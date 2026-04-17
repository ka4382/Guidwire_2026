/**
 * weather.service.js
 *
 * Provides real-time weather data using the free Open-Meteo API.
 * Maps coordinates to zones and returns structured weather disruption data.
 * Built to fail gracefully.
 */

import axios from "axios";

// Map our zones to approximate coordinates (Lat, Lon) for the API
const ZONE_COORDS = {
  "Koramangala-5th-Block": { lat: 12.9345, lon: 77.6266 },
  "HSR-Layout-Sector-2": { lat: 12.9081, lon: 77.6476 },
  "Indiranagar-100ft": { lat: 12.9784, lon: 77.6408 },
  "Powai-LakeSide": { lat: 19.1176, lon: 72.9060 },
  "Mumbai-Bandra": { lat: 19.0596, lon: 72.8295 },
  "Chennai-Tnagar": { lat: 13.0418, lon: 80.2341 },
  "Hyderabad-Hitec": { lat: 17.4435, lon: 78.3772 }
};

/**
 * Fetches real-time weather data for a given zone.
 * Uses Open-Meteo (no API key required).
 *
 * @param {string} zone
 * @returns {Promise<object>} e.g. { condition: "Rain", intensity: "Heavy", temperature: 32, rainfall_mm: 45 }
 */
export async function getWeatherData(zone) {
  try {
    const coords = ZONE_COORDS[zone] || ZONE_COORDS["Koramangala-5th-Block"];
    
    // Fetch current weather and hourly forecast (for precise rain amounts)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,precipitation,weather_code&timezone=auto`;
    
    const response = await axios.get(url, { timeout: 5000 }); // 5 second timeout to fail fast
    
    if (!response.data || !response.data.current) {
      throw new Error("Invalid response format from Open-Meteo");
    }

    const current = response.data.current;
    
    // WMO Weather interpretation codes (approximate)
    // 0: Clear, 1-3: Cloudy, 51-67: Rain/Drizzle, 71-77: Snow, 95-99: Thunderstorm
    let condition = "Clear";
    let intensity = "None";
    let rainfall_mm = current.precipitation || 0;
    
    if (current.weather_code >= 51 && current.weather_code <= 67) {
      condition = "Rain";
      if (rainfall_mm > 15) intensity = "Heavy";
      else if (rainfall_mm > 5) intensity = "Moderate";
      else intensity = "Light";
    } else if (current.weather_code >= 95) {
      condition = "Thunderstorm";
      intensity = "Severe";
      rainfall_mm = Math.max(rainfall_mm, 20); // Thunderstorms imply heavy rain
    } else if (current.weather_code >= 1 && current.weather_code <= 3) {
      condition = "Cloudy";
      intensity = "None";
    }

    return {
      condition,
      intensity,
      temperature: current.temperature_2m,
      rainfall_mm
    };
  } catch (error) {
    console.warn(`[WeatherService] API call failed: ${error.message}. Returning null to trigger fallback.`);
    return null; // Return null to indicate failure and trigger simulate fallback
  }
}
