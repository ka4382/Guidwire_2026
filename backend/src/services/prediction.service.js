/**
 * prediction.service.js
 *
 * Provides predictive insights for admin dashboards.
 * Simulates advanced ML forecasting based on current trends.
 */

/**
 * Gets predictive insights for the next week.
 *
 * @param {string} zone 
 * @returns {object} Predictive insight data
 */
export function getPredictiveInsights(zone = "Koramangala-5th-Block") {
  // In a real scenario, this would query an ML model or historical DB
  // For the demo, we generate realistic dynamic responses based on zone
  
  const isHighRiskZone = ["Koramangala-5th-Block", "Powai-LakeSide"].includes(zone);
  
  if (isHighRiskZone) {
     return {
      next_week_risk: "HIGH",
      reason: "Heavy rainfall forecast and historical drain overflow correlation",
      premium_change: "+₹15",
      confidence_score: 87
    };
  }

  return {
    next_week_risk: "MEDIUM",
    reason: "Moderate traffic disruptions expected due to roadwork",
    premium_change: "+₹5",
    confidence_score: 62
  };
}

/**
 * Gets global predictive insights for all zones.
 */
export function getGlobalPredictiveInsights() {
  return [
    {
      zone: "Koramangala-5th-Block",
      ...getPredictiveInsights("Koramangala-5th-Block")
    },
    {
      zone: "Indiranagar-100ft",
      ...getPredictiveInsights("Indiranagar-100ft")
    },
     {
      zone: "Powai-LakeSide",
      ...getPredictiveInsights("Powai-LakeSide")
    }
  ];
}
