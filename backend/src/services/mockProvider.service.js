import { aqiFeed } from "../data/mockFeeds/aqi.js";
import { darkStores } from "../data/mockFeeds/darkStores.js";
import { platformStatusFeed } from "../data/mockFeeds/platform.js";
import { cityZones } from "../data/mockFeeds/zones.js";
import { weatherFeed } from "../data/mockFeeds/weather.js";
import { workerActivityTemplates } from "../data/mockFeeds/activity.js";
import { seededActivityModes } from "../data/seed-data.js";

const defaultWeather = {
  rainfallMm: 10,
  temperatureC: 30,
  forecastSeverity: 0.5
};

const defaultAqi = { aqi: 140 };

const defaultPlatformStatus = {
  orderSuspension: false,
  zoneRestricted: false,
  darkStoreClosed: false
};

export function getZoneMeta(zone) {
  return cityZones.find((item) => item.zone === zone);
}

export function getDarkStoreById(darkStoreId) {
  return darkStores.find((item) => item.darkStoreId === darkStoreId);
}

export function getDarkStoreByZone(zone) {
  return darkStores.find((item) => item.zone === zone);
}

export function getWeather(zone) {
  return weatherFeed[zone] || defaultWeather;
}

export function getAqi(zone) {
  return aqiFeed[zone] || defaultAqi;
}

export function getPlatformStatus(zone) {
  return platformStatusFeed[zone] || defaultPlatformStatus;
}

export function buildZoneStatus(zone, platformStatus = getPlatformStatus(zone)) {
  return {
    zoneRestricted: Boolean(platformStatus.zoneRestricted),
    darkStoreClosed: Boolean(platformStatus.darkStoreClosed)
  };
}

export function getWorkerActivityForUser(user) {
  const mode = seededActivityModes[user.email] || "steady";
  return {
    ...workerActivityTemplates[mode],
    zone: user.assignedZone,
    darkStoreId: user.darkStoreId,
    lastActiveAt: new Date().toISOString(),
    recentOrders: Math.round(workerActivityTemplates[mode].activeMinutesDuringWindow / 18)
  };
}

export function getWorkerActivityByMode(mode) {
  return {
    ...workerActivityTemplates[mode],
    lastActiveAt: new Date().toISOString()
  };
}

export function buildSimulationState(type, zone) {
  const currentWeather = getWeather(zone);
  const currentAqi = getAqi(zone);
  const currentPlatformStatus = getPlatformStatus(zone);

  const responses = {
    heavy_rainfall: {
      weather: { ...currentWeather, rainfallMm: 74 },
      aqi: currentAqi,
      platformStatus: currentPlatformStatus,
      zoneStatus: buildZoneStatus(zone, currentPlatformStatus),
      thresholdValue: 50,
      observedValue: 74,
      source: "mock-weather"
    },
    extreme_heat: {
      weather: { ...currentWeather, temperatureC: 44 },
      aqi: currentAqi,
      platformStatus: currentPlatformStatus,
      zoneStatus: buildZoneStatus(zone, currentPlatformStatus),
      thresholdValue: 42,
      observedValue: 44,
      source: "mock-weather"
    },
    severe_pollution: {
      weather: currentWeather,
      aqi: { aqi: 342 },
      platformStatus: currentPlatformStatus,
      zoneStatus: buildZoneStatus(zone, currentPlatformStatus),
      thresholdValue: 300,
      observedValue: 342,
      source: "mock-aqi"
    },
    zone_restriction: {
      weather: currentWeather,
      aqi: currentAqi,
      platformStatus: { ...currentPlatformStatus, zoneRestricted: true, darkStoreClosed: true },
      zoneStatus: { zoneRestricted: true, darkStoreClosed: true },
      thresholdValue: 1,
      observedValue: 1,
      source: "mock-geofence"
    },
    platform_outage: {
      weather: currentWeather,
      aqi: currentAqi,
      platformStatus: { ...currentPlatformStatus, orderSuspension: true },
      zoneStatus: buildZoneStatus(zone, currentPlatformStatus),
      thresholdValue: 1,
      observedValue: 1,
      source: "mock-blinkit-platform"
    },
    gps_spoof_attack: {
      weather: { ...currentWeather, rainfallMm: 78 },
      aqi: currentAqi,
      platformStatus: currentPlatformStatus,
      zoneStatus: buildZoneStatus(zone, currentPlatformStatus),
      thresholdValue: 50,
      observedValue: 78,
      source: "mock-weather"
    }
  };

  return responses[type];
}

