export const demoUsers = [
  {
    name: "Asha Kumar",
    phone: "9000000001",
    email: "asha@blinkshield.demo",
    password: "Pass@123",
    role: "worker",
    city: "Bengaluru",
    assignedZone: "Koramangala-5th-Block",
    darkStoreId: "BLR-KRM-01",
    payoutMethod: {
      provider: "mock-razorpay",
      upiId: "asha@okicici",
      accountName: "Asha Kumar"
    }
  },
  {
    name: "Rohan Singh",
    phone: "9000000002",
    email: "rohan@blinkshield.demo",
    password: "Pass@123",
    role: "worker",
    city: "Bengaluru",
    assignedZone: "HSR-Layout-Sector-2",
    darkStoreId: "BLR-HSR-02",
    payoutMethod: {
      provider: "mock-razorpay",
      upiId: "rohan@okhdfc",
      accountName: "Rohan Singh"
    }
  },
  {
    name: "Imran Shaikh",
    phone: "9000000003",
    email: "imran@blinkshield.demo",
    password: "Pass@123",
    role: "worker",
    city: "Bengaluru",
    assignedZone: "Indiranagar-100ft",
    darkStoreId: "BLR-IDR-03",
    payoutMethod: {
      provider: "mock-razorpay",
      upiId: "imran@ybl",
      accountName: "Imran Shaikh"
    }
  },
  {
    name: "Neha Sharma",
    phone: "9000000004",
    email: "admin@blinkshield.demo",
    password: "Admin@123",
    role: "admin",
    city: "Bengaluru",
    assignedZone: "Koramangala-5th-Block",
    darkStoreId: "BLR-KRM-01",
    payoutMethod: {
      provider: "mock-razorpay",
      upiId: "admin@blinkshield",
      accountName: "Neha Sharma"
    }
  }
];

export const demoProfiles = {
  "asha@blinkshield.demo": {
    vehicleType: "bike",
    avgWeeklyEarnings: 4200,
    avgDailyHours: 8,
    preferredShift: "morning-peak",
    activityScore: 0.88
  },
  "rohan@blinkshield.demo": {
    vehicleType: "scooter",
    avgWeeklyEarnings: 3900,
    avgDailyHours: 7,
    preferredShift: "mixed-peak",
    activityScore: 0.76
  },
  "imran@blinkshield.demo": {
    vehicleType: "bike",
    avgWeeklyEarnings: 4600,
    avgDailyHours: 9,
    preferredShift: "evening-peak",
    activityScore: 0.61
  }
};

export const demoHistoricalEvents = [
  {
    type: "heavy_rainfall",
    zone: "Koramangala-5th-Block",
    darkStoreId: "BLR-KRM-01",
    severity: "high",
    source: "mock-weather",
    thresholdValue: 50,
    observedValue: 72,
    startedAtOffsetHours: 96,
    endedAtOffsetHours: 92,
    isTriggerActive: false,
    recommendedClaimWindow: 3,
    evidence: [
      {
        source: "mock-weather",
        summary: "Koramangala rainfall crossed 72mm during evening peak.",
        payload: { rainfallMm: 72 }
      }
    ]
  },
  {
    type: "severe_pollution",
    zone: "Indiranagar-100ft",
    darkStoreId: "BLR-IDR-03",
    severity: "medium",
    source: "mock-aqi",
    thresholdValue: 300,
    observedValue: 334,
    startedAtOffsetHours: 48,
    endedAtOffsetHours: 42,
    isTriggerActive: false,
    recommendedClaimWindow: 2,
    evidence: [
      {
        source: "mock-aqi",
        summary: "AQI remained above 330 for multiple prime order slots.",
        payload: { aqi: 334 }
      }
    ]
  }
];

export const seededActivityModes = {
  "asha@blinkshield.demo": "steady",
  "rohan@blinkshield.demo": "moderate",
  "imran@blinkshield.demo": "suspicious"
};

export const demoSeededClaims = [
  {
    email: "asha@blinkshield.demo",
    eventType: "heavy_rainfall",
    claimStatus: "paid",
    decision: "approved",
    payoutAmount: 240,
    fraudScore: 0.19,
    lossWindowHours: 3,
    reasons: [
      "Rainfall exceeded the parametric threshold in the assigned Blinkit zone.",
      "Worker telemetry matched active delivery behavior during the disruption window."
    ],
    payoutStatus: "completed"
  },
  {
    email: "imran@blinkshield.demo",
    eventType: "severe_pollution",
    claimStatus: "flagged",
    decision: "flagged",
    payoutAmount: 180,
    fraudScore: 0.66,
    lossWindowHours: 2,
    reasons: [
      "AQI trigger is valid, but telemetry suggests suspicious activity regularity.",
      "BlinkShield flags suspicious claims for verification instead of auto-rejecting."
    ]
  }
];
