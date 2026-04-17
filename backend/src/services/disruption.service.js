import { DisruptionEvent } from "../models/DisruptionEvent.js";
import { User } from "../models/User.js";
import { getDisruption } from "./aiEngine.service.js";
import { getWeatherData } from "./weather.service.js";
import {
  buildSimulationState,
  buildZoneStatus,
  getAqi,
  getDarkStoreByZone,
  getPlatformStatus,
  getWeather
} from "./mockProvider.service.js";
import { runClaimsForEvent } from "./claim.service.js";

function buildEvidence(type, state, zone) {
  const evidenceMap = {
    heavy_rainfall: {
      summary: `Heavy rain reached ${state.observedValue}mm near ${zone}.`,
      payload: state.weather
    },
    extreme_heat: {
      summary: `Heat touched ${state.observedValue}C during peak order window.`,
      payload: state.weather
    },
    severe_pollution: {
      summary: `AQI crossed ${state.observedValue} with visibility concerns.`,
      payload: state.aqi
    },
    zone_restriction: {
      summary: "Dark-store geofence moved to restricted and store was closed.",
      payload: state.zoneStatus
    },
    platform_outage: {
      summary: "Locality faced order suspension from Blinkit activity feed.",
      payload: state.platformStatus
    },
    gps_spoof_attack: {
      summary: "Synthetic heavy rainfall created to test fraud detection path.",
      payload: state.weather
    }
  };

  return [
    {
      source: state.source,
      summary: evidenceMap[type].summary,
      payload: evidenceMap[type].payload
    }
  ];
}

function toSeverity(type, observedValue) {
  if (type === "zone_restriction" || type === "platform_outage") {
    return "critical";
  }

  if (type === "severe_pollution") {
    return observedValue > 340 ? "critical" : "high";
  }

  if (type === "heavy_rainfall") {
    return observedValue > 70 ? "critical" : "high";
  }

  if (type === "extreme_heat") {
    return observedValue > 44 ? "critical" : "high";
  }

  return "medium";
}

export async function getLiveDisruptions(zone) {
  const zonesToEvaluate = zone
    ? [zone]
    : [...new Set((await User.find({ role: "worker" }).lean()).map((user) => user.assignedZone))];

  const results = await Promise.all(
    zonesToEvaluate.map(async (item) => {
      const darkStore = getDarkStoreByZone(item);
      const mockWeather = getWeather(item);
      let realWeather = null;
      try {
         realWeather = await getWeatherData(item);
      } catch (e) {
         // ignore
      }
      
      const rainfall_mm = realWeather ? realWeather.rainfall_mm : mockWeather.rainfallMm;
      const temperature_c = realWeather ? realWeather.temperature : mockWeather.temperatureC;
      
      const aqi = getAqi(item);
      const platformStatus = getPlatformStatus(item);
      const zoneStatus = buildZoneStatus(item, platformStatus);

      // if real weather has disruptions, build it here, else let AI engine evaluate normally
      // We pass the live data down to the risk engine. 
      return getDisruption(
        "/ai/disruption-monitor",
        {
          zone: item,
          dark_store_id: darkStore?.darkStoreId || "UNKNOWN",
          rainfall_mm: rainfall_mm,
          temperature_c: temperature_c,
          aqi_value: aqi.aqi,
          zone_restricted: zoneStatus.zoneRestricted,
          dark_store_closed: zoneStatus.darkStoreClosed,
          order_suspension: platformStatus.orderSuspension
        },
        () => ({
          disruption_type: "clear",
          severity: "low",
          affected_zone: item,
          trigger_status: false,
          recommended_claim_window: 0,
          evidence: [
             { summary: `Current Temp: ${temperature_c}°C` },
             { summary: `Rainfall: ${rainfall_mm}mm` },
             { summary: `Risk API Data: Open-Meteo` },
          ], // Inject real evidence visually
          threshold_value: 0,
          observed_value: 0,
          source: realWeather ? "Open-Meteo" : "mock-fallback"
        })
      );
    })
  );

  const activeEventsRaw = await DisruptionEvent.find({ isTriggerActive: true })
    .sort({ createdAt: -1 })
    .lean();

  const uniqueEvents = [];
  const seen = new Set();
  
  for (const ev of activeEventsRaw) {
    // If events share the same type + zone + same minute, count as duplicate from orchestration
    const timeKey = new Date(ev.createdAt).toISOString().slice(0, 16);
    const key = `${ev.type}-${ev.zone}-${timeKey}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueEvents.push(ev);
    }
  }

  const limitedEvents = uniqueEvents.slice(0, 5);

  return {
    monitoredZones: results,
    activeEvents: limitedEvents
  };
}

export async function simulateDisruption({ type, zone, darkStoreId, durationHours }) {
  const state = buildSimulationState(type, zone);
  const darkStore = darkStoreId || getDarkStoreByZone(zone)?.darkStoreId || "UNKNOWN";
  const now = new Date();
  const endedAt = new Date(now);
  endedAt.setHours(now.getHours() + (durationHours || 3));

  const event = await DisruptionEvent.create({
    type,
    zone,
    darkStoreId: darkStore,
    severity: toSeverity(type, state.observedValue),
    source: state.source,
    thresholdValue: state.thresholdValue,
    observedValue: state.observedValue,
    startedAt: now,
    endedAt,
    isTriggerActive: true,
    recommendedClaimWindow: durationHours || 3,
    evidence: buildEvidence(type, state, zone)
  });

  const affectedWorkers = await User.find({
    role: "worker",
    assignedZone: zone
  }).lean();

  const orchestration = await runClaimsForEvent(event, affectedWorkers, {
    simulationType: type
  });

  return {
    event,
    affectedWorkers: affectedWorkers.length,
    claims: orchestration
  };
}

export async function getDisruptionHistory() {
  return DisruptionEvent.find().sort({ createdAt: -1 }).lean();
}

