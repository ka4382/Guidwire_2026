# BlinkShield AI API Reference

Base URLs:

- Frontend consumes backend at `http://localhost:5000/api`
- Backend proxies AI engine at `http://localhost:8000`

## Auth

### `POST /api/auth/register`

Registers a Blinkit delivery partner or admin.

```json
{
  "name": "Asha Kumar",
  "phone": "9000000001",
  "email": "asha@blinkshield.demo",
  "password": "Pass@123",
  "city": "Bengaluru",
  "assignedZone": "Koramangala-5th-Block",
  "darkStoreId": "BLR-KRM-01",
  "payoutMethod": {
    "provider": "mock-razorpay",
    "upiId": "asha@okicici",
    "accountName": "Asha Kumar"
  }
}
```

### `POST /api/auth/login`

```json
{
  "email": "asha@blinkshield.demo",
  "password": "Pass@123"
}
```

### `GET /api/auth/me`

Returns the authenticated user from the JWT token.

## Workers

### `GET /api/workers/:id`

Returns user profile plus `WorkerProfile`.

### `PUT /api/workers/:id`

Updates onboarding data like `avgWeeklyEarnings`, `avgDailyHours`, `preferredShift`, `activityScore`, and payout details.

### `GET /api/workers/:id/activity`

Returns mock Blinkit activity telemetry used for fraud scoring.

## Premium / Risk

### `POST /api/premium/calculate`

```json
{
  "workerId": "worker-object-id"
}
```

Response highlights:

- `weekly_premium`
- `coverage_amount`
- `risk_level`
- `explanation`
- `pricing_factors`

### `GET /api/premium/:workerId/latest`

Returns the latest stored quote summary from `WorkerProfile.riskProfile`.

## Policies

### `POST /api/policies`

Creates a new weekly policy draft from the latest quote.

```json
{
  "workerId": "worker-object-id"
}
```

### `GET /api/policies/:workerId`

Returns all weekly policies for the worker.

### `PATCH /api/policies/:policyId/activate`

Activates the selected weekly policy and deactivates earlier ones.

### `PATCH /api/policies/:policyId/cancel`

Cancels an active policy.

## Disruptions

### `GET /api/disruptions/live`

Optional query:

- `zone=Koramangala-5th-Block`

Returns:

- `monitoredZones`
- `activeEvents`

### `POST /api/disruptions/simulate`

Admin-only endpoint that triggers the full zero-touch chain.

```json
{
  "type": "heavy_rainfall",
  "zone": "Koramangala-5th-Block"
}
```

Supported `type` values:

- `heavy_rainfall`
- `extreme_heat`
- `severe_pollution`
- `zone_restriction`
- `platform_outage`
- `gps_spoof_attack`

### `GET /api/disruptions/history`

Returns disruption history persisted in MongoDB.

## Claims

### `POST /api/claims/trigger`

Manual single-worker trigger.

```json
{
  "workerId": "worker-object-id",
  "disruptionEventId": "event-object-id"
}
```

### `GET /api/claims/:workerId`

Returns claim history with populated disruption and policy references.

### `GET /api/claims/details/:claimId`

Returns one fully populated claim.

### `PATCH /api/claims/:claimId/review`

Admin-only review action for flagged claims.

```json
{
  "action": "approve",
  "notes": "Cleared after manual telemetry check"
}
```

## Payouts

### `POST /api/payouts/process`

```json
{
  "claimId": "claim-object-id"
}
```

### `GET /api/payouts/:workerId`

Returns payout history for the worker.

## Analytics

### `GET /api/analytics/worker/:workerId`

Worker summary:

- protected earnings
- claims breakdown
- payout totals
- active policy

### `GET /api/analytics/admin/overview`

Admin summary:

- total workers
- active policies
- loss ratio
- claims funnel
- next-week disruption trend

### `GET /api/analytics/admin/fraud`

Returns flagged claims and recent `FraudSignal` records.

### `GET /api/analytics/admin/disruptions`

Returns disruption counts by zone and full disruption history.

## AI Engine

### `POST /ai/risk-assess`

Accepts zone risk, forecast severity, activity consistency, pollution history, and flood-prone factor.

### `POST /ai/fraud-detect`

Accepts delivery telemetry, network consistency, and recent claim frequency.

### `POST /ai/claim-decision`

Accepts trigger data, policy data, fraud score, and estimated income loss.

### `POST /ai/payout-execute`

Returns a simulated payout reference and payout timestamp.

### `GET /ai/disruption-monitor`

Accepts rainfall, temperature, AQI, geofence status, and platform outage flags.

### `POST /ai/run-orchestrator`

Runs the deterministic agent chain:

1. Disruption Monitoring Agent
2. Fraud Detection Agent
3. Claim Decision Agent
4. Payout Execution Agent

