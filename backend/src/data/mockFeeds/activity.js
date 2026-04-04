export const workerActivityTemplates = {
  steady: {
    gpsStabilityScore: 0.85,
    movementDistanceRatio: 0.74,
    avgSpeed: 18,
    accelerometerMotionScore: 0.78,
    deliveryCompletionRate: 0.84,
    claimFrequency30d: 1,
    networkGeoConsistency: 0.88,
    crossWorkerTriggerSimilarity: 0.2,
    activeMinutesDuringWindow: 95
  },
  suspicious: {
    gpsStabilityScore: 0.18,
    movementDistanceRatio: 0.11,
    avgSpeed: 62,
    accelerometerMotionScore: 0.09,
    deliveryCompletionRate: 0.12,
    claimFrequency30d: 5,
    networkGeoConsistency: 0.21,
    crossWorkerTriggerSimilarity: 0.87,
    activeMinutesDuringWindow: 5
  },
  moderate: {
    gpsStabilityScore: 0.57,
    movementDistanceRatio: 0.49,
    avgSpeed: 22,
    accelerometerMotionScore: 0.46,
    deliveryCompletionRate: 0.52,
    claimFrequency30d: 2,
    networkGeoConsistency: 0.61,
    crossWorkerTriggerSimilarity: 0.36,
    activeMinutesDuringWindow: 54
  }
};

