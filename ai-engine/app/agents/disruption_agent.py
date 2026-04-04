from app.models.schemas import DisruptionMonitorRequest, DisruptionMonitorResponse


class DisruptionMonitoringAgent:
    def run(self, payload: DisruptionMonitorRequest) -> DisruptionMonitorResponse:
        rainfall = float(payload.weather.get("rainfallMm", 0))
        temperature = float(payload.weather.get("temperatureC", 0))
        aqi = float(payload.aqi.get("aqi", 0))
        zone_restricted = bool(payload.zone_status.get("zoneRestricted", False))
        dark_store_closed = bool(payload.zone_status.get("darkStoreClosed", False))
        order_suspension = bool(payload.platform_status.get("orderSuspension", False))

        trigger = {
            "disruption_type": "clear",
            "severity": "low",
            "trigger_status": False,
            "recommended_claim_window": 0,
            "threshold_value": 0.0,
            "observed_value": 0.0,
            "source": "mock-clear",
            "evidence": [],
        }

        if zone_restricted or dark_store_closed:
            trigger = {
                "disruption_type": "zone_restriction",
                "severity": "critical",
                "trigger_status": True,
                "recommended_claim_window": 4,
                "threshold_value": 1,
                "observed_value": 1,
                "source": "mock-geofence",
                "evidence": [
                    {
                        "source": "mock-geofence",
                        "summary": "Dark-store geofence switched to restricted or closed.",
                        "payload": payload.zone_status,
                    }
                ],
            }
        elif order_suspension:
            trigger = {
                "disruption_type": "platform_outage",
                "severity": "critical",
                "trigger_status": True,
                "recommended_claim_window": 3,
                "threshold_value": 1,
                "observed_value": 1,
                "source": "mock-blinkit-platform",
                "evidence": [
                    {
                        "source": "mock-blinkit-platform",
                        "summary": "Order suspension reported for the local Blinkit micro-zone.",
                        "payload": payload.platform_status,
                    }
                ],
            }
        elif rainfall > 50:
            trigger = {
                "disruption_type": "heavy_rainfall",
                "severity": "critical" if rainfall > 70 else "high",
                "trigger_status": True,
                "recommended_claim_window": 3,
                "threshold_value": 50,
                "observed_value": rainfall,
                "source": "mock-weather",
                "evidence": [
                    {
                        "source": "mock-weather",
                        "summary": f"Rainfall reached {rainfall:.0f}mm during a delivery window.",
                        "payload": payload.weather,
                    }
                ],
            }
        elif temperature > 42:
            trigger = {
                "disruption_type": "extreme_heat",
                "severity": "critical" if temperature > 44 else "high",
                "trigger_status": True,
                "recommended_claim_window": 2,
                "threshold_value": 42,
                "observed_value": temperature,
                "source": "mock-weather",
                "evidence": [
                    {
                        "source": "mock-weather",
                        "summary": f"Temperature hit {temperature:.0f}C in the assigned zone.",
                        "payload": payload.weather,
                    }
                ],
            }
        elif aqi > 300:
            trigger = {
                "disruption_type": "severe_pollution",
                "severity": "critical" if aqi > 340 else "high",
                "trigger_status": True,
                "recommended_claim_window": 2,
                "threshold_value": 300,
                "observed_value": aqi,
                "source": "mock-aqi",
                "evidence": [
                    {
                        "source": "mock-aqi",
                        "summary": f"AQI reached {aqi:.0f}, beyond the BlinkShield trigger threshold.",
                        "payload": payload.aqi,
                    }
                ],
            }

        return DisruptionMonitorResponse(
            affected_zone=payload.zone,
            **trigger,
        )


disruption_monitoring_agent = DisruptionMonitoringAgent()

