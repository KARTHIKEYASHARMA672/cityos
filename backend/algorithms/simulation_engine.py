import math
import random
from typing import List, Dict, Any, Tuple
from models import WardData, CityMetrics, InfrastructureIncident, AIRecommendation

class IndianCitySimulationEngine:
    """
    Mathematical simulation engine for Indian Urban Digital Twin infrastructure.
    Simulates cross-coupled interactions between traffic density, power grid,
    water hydraulics, particulate air pollution, and emergency response.
    """

    def __init__(self):
        self.time_hour: float = 14.5  # 2:30 PM default
        self.monsoon_factor: float = 0.0
        self.heatwave_factor: float = 0.2
        self.festival_rush: bool = False
        self.active_interventions: List[str] = []

        # Wards Setup
        self.wards: Dict[str, WardData] = {
            "W01": WardData(
                id="W01",
                name="Cyber Gateway & Tech Park",
                category="Commercial / IT",
                population=380000,
                power_demand_mw=195.0,
                power_capacity_mw=210.0,
                water_demand_mld=82.0,
                water_delivered_mld=79.5,
                pipeline_pressure_bar=3.2,
                traffic_density_pct=78.5,
                avg_speed_kmh=16.8,
                aqi=174,
                pm25=92.4,
                no2=48.2,
                co2_emissions_tph=118.0,
                transformer_load_pct=88.4,
                active_incidents=1,
                coordinates=[45.0, -35.0]
            ),
            "W02": WardData(
                id="W02",
                name="Pettah Heritage & Old Bazaar",
                category="Heritage Commercial & Mixed",
                population=620000,
                power_demand_mw=145.0,
                power_capacity_mw=150.0,
                water_demand_mld=98.0,
                water_delivered_mld=88.0,
                pipeline_pressure_bar=2.1,
                traffic_density_pct=89.2,
                avg_speed_kmh=11.4,
                aqi=238,
                pm25=142.0,
                no2=64.0,
                co2_emissions_tph=145.0,
                transformer_load_pct=94.2,
                active_incidents=2,
                coordinates=[-40.0, -20.0]
            ),
            "W03": WardData(
                id="W03",
                name="Bellandur Lake Basin & Enclave",
                category="Residential & Wetlands",
                population=780000,
                power_demand_mw=160.0,
                power_capacity_mw=180.0,
                water_demand_mld=140.0,
                water_delivered_mld=128.0,
                pipeline_pressure_bar=2.8,
                traffic_density_pct=64.0,
                avg_speed_kmh=24.5,
                aqi=152,
                pm25=76.0,
                no2=36.0,
                co2_emissions_tph=82.0,
                transformer_load_pct=74.0,
                active_incidents=1,
                coordinates=[60.0, 50.0]
            ),
            "W04": WardData(
                id="W04",
                name="Peenya Industrial & Freight Hub",
                category="Heavy Industrial & Logistics",
                population=410000,
                power_demand_mw=265.0,
                power_capacity_mw=280.0,
                water_demand_mld=110.0,
                water_delivered_mld=104.0,
                pipeline_pressure_bar=3.5,
                traffic_density_pct=72.0,
                avg_speed_kmh=19.2,
                aqi=264,
                pm25=168.0,
                no2=82.0,
                co2_emissions_tph=210.0,
                transformer_load_pct=91.5,
                active_incidents=1,
                coordinates=[-55.0, 55.0]
            ),
            "W05": WardData(
                id="W05",
                name="Vidhana Civic & Healthcare Belt",
                category="Government & Medical",
                population=490000,
                power_demand_mw=110.0,
                power_capacity_mw=130.0,
                water_demand_mld=75.0,
                water_delivered_mld=74.0,
                pipeline_pressure_bar=3.8,
                traffic_density_pct=48.0,
                avg_speed_kmh=32.0,
                aqi=128,
                pm25=58.0,
                no2=28.0,
                co2_emissions_tph=54.0,
                transformer_load_pct=62.0,
                active_incidents=0,
                coordinates=[0.0, 0.0]
            ),
            "W06": WardData(
                id="W06",
                name="Greenfield Solar Aerotropolis",
                category="Innovation & Greenfield",
                population=350000,
                power_demand_mw=85.0,
                power_capacity_mw=140.0,
                water_demand_mld=55.0,
                water_delivered_mld=54.5,
                pipeline_pressure_bar=4.1,
                traffic_density_pct=34.0,
                avg_speed_kmh=42.0,
                aqi=88,
                pm25=34.0,
                no2=18.0,
                co2_emissions_tph=31.0,
                transformer_load_pct=45.0,
                active_incidents=0,
                coordinates=[10.0, -80.0]
            ),
        }

        # Active Incidents
        self.incidents: List[InfrastructureIncident] = [
            InfrastructureIncident(
                id="INC-401",
                title="Silk Board Junction Traffic Gridlock",
                category="TRAFFIC",
                ward_id="W01",
                location_name="Outer Ring Road Interchange",
                severity="CRITICAL",
                status="RESPONDING",
                dispatched_unit="Traffic Police Interceptor T-08",
                response_eta_min=4.2,
                golden_hour_seconds_left=1650,
                coordinates=[42.0, -32.0]
            ),
            InfrastructureIncident(
                id="INC-402",
                title="11kV Substation Feeder Overload Trip",
                category="POWER",
                ward_id="W02",
                location_name="Chowk Distribution Substation 4",
                severity="HIGH",
                status="ACTIVE",
                dispatched_unit="BESCOM Rapid Restoration Crew B-2",
                response_eta_min=9.5,
                golden_hour_seconds_left=2400,
                coordinates=[-38.0, -18.0]
            ),
            InfrastructureIncident(
                id="INC-403",
                title="Main Trunk Pipeline Pressure Burst",
                category="WATER",
                ward_id="W03",
                location_name="Lake Bypass 900mm Feeder Line",
                severity="HIGH",
                status="RESPONDING",
                dispatched_unit="Water Board Emergency Valve Van W-05",
                response_eta_min=6.8,
                golden_hour_seconds_left=1980,
                coordinates=[58.0, 48.0]
            ),
            InfrastructureIncident(
                id="INC-404",
                title="Chemical Storage Shed Fire Alarm",
                category="FIRE",
                ward_id="W04",
                location_name="Peenya Sector 2 Freight Terminal",
                severity="CRITICAL",
                status="RESPONDING",
                dispatched_unit="Fire Tender Engine F-12 & Water Bowsers",
                response_eta_min=3.5,
                golden_hour_seconds_left=1200,
                coordinates=[-52.0, 52.0]
            )
        ]

        # Strategic Recommendations
        self.recommendations: List[AIRecommendation] = [
            AIRecommendation(
                id="REC-01",
                title="Deploy Dynamic Reversible Lane & AI Signal Mesh on Ring Road",
                category="Mobility & Traffic",
                capex_inr_crores=42.5,
                timeline_months=6,
                priority="CRITICAL",
                roi_score=9.4,
                description="Synchronize 28 intersection signal controllers along Outer Ring Road with inductive loop and camera sensors. Creates a tidal center lane toward Tech Hub during morning rush and outward during evening.",
                impact={
                    "congestion_reduction_pct": 34.2,
                    "avg_speed_gain_kmh": 12.6,
                    "fuel_saved_kiloliters_daily": 8500.0,
                    "aqi_improvement_pts": 28.0
                },
                status="PROPOSED"
            ),
            AIRecommendation(
                id="REC-02",
                title="Install 25MWh Distributed Battery Energy Storage System (BESS) at Pettah & Peenya",
                category="Power & Grid",
                capex_inr_crores=85.0,
                timeline_months=9,
                priority="HIGH",
                roi_score=8.8,
                description="Peak-shaves transformer loads by absorbing surplus midday rooftop solar and discharging during 7:00 PM - 10:30 PM evening peak. Eliminates rolling blackouts in Pettah and Peenya.",
                impact={
                    "peak_load_shaved_mw": 25.0,
                    "blackout_risk_reduction_pct": 86.0,
                    "grid_stability_gain_pct": 18.5,
                    "co2_abated_mt_year": 14200.0
                },
                status="PROPOSED"
            ),
            AIRecommendation(
                id="REC-03",
                title="District Metered Areas (DMA) & Smart Pressure Reducing Valves (PRVs)",
                category="Water Infrastructure",
                capex_inr_crores=58.0,
                timeline_months=8,
                priority="HIGH",
                roi_score=9.1,
                description="Segment Bellandur and Pettah water distribution networks into 16 monitored zones with acoustic leak listening sensors and automated PRVs to maintain constant 2.8 bar head.",
                impact={
                    "water_saved_mld": 28.4,
                    "nrw_loss_reduction_pct": 42.0,
                    "energy_saved_mwh_year": 3800.0,
                    "tanker_trips_reduced_daily": 320.0
                },
                status="PROPOSED"
            ),
            AIRecommendation(
                id="REC-04",
                title="Urban Green Buffer & Ultra-Low Emission Freight Corridor in Industrial Zone",
                category="Environment & AQI",
                capex_inr_crores=36.0,
                timeline_months=12,
                priority="MEDIUM",
                roi_score=7.9,
                description="Enforce daytime heavy diesel truck diversions to outer peripheral expressways and plant a dense 3-tier bio-shield forest strip around Peenya and Lake Basin.",
                impact={
                    "pm25_reduction_pct": 26.5,
                    "no2_reduction_pct": 31.0,
                    "heat_island_cooling_c": 1.4,
                    "aqi_improvement_pts": 45.0
                },
                status="PROPOSED"
            ),
            AIRecommendation(
                id="REC-05",
                title="Dedicated Emergency Preemption Beacon Corridor (Green Corridor Routing)",
                category="Emergency Management",
                capex_inr_crores=18.5,
                timeline_months=4,
                priority="CRITICAL",
                roi_score=9.7,
                description="Install V2X RF preemption transmitters on all 48 municipal ambulances and fire tenders that automatically switch traffic signals to green 400m ahead along hospital trauma routes.",
                impact={
                    "ambulance_response_time_min_reduction": 6.8,
                    "golden_hour_survival_rate_gain_pct": 38.0,
                    "accident_secondary_collisions_reduction_pct": 72.0
                },
                status="PROPOSED"
            )
        ]

    def step_simulation(self, delta_time_min: float = 5.0) -> CityMetrics:
        """Advance the digital twin simulation by delta_time minutes."""
        self.time_hour = (self.time_hour + (delta_time_min / 60.0)) % 24.0

        # Solar PV Curve: peak at 12:30 PM (12.5)
        solar_insolation = max(0.0, math.sin(max(0.0, min(math.pi, (self.time_hour - 6.0) / 12.0 * math.pi))))
        solar_pv_mw = 180.0 * solar_insolation * (1.0 - self.monsoon_factor * 0.7)

        # Baseline diurnal demand factors
        is_office_rush = (8.5 <= self.time_hour <= 11.5) or (17.5 <= self.time_hour <= 20.5)
        evening_lighting_rush = (18.0 <= self.time_hour <= 22.0)
        
        # Calculate dynamic Ward values
        total_power_demand = 0.0
        total_water_demand = 0.0
        total_water_delivered = 0.0
        congestion_sum = 0.0
        aqi_sum = 0.0

        for ward in self.wards.values():
            # Power simulation
            base_power = ward.power_capacity_mw * 0.7
            if "Commercial" in ward.category:
                factor = 1.35 if (9.0 <= self.time_hour <= 19.0) else 0.45
            elif "Residential" in ward.category:
                factor = 1.4 if evening_lighting_rush else 0.75
            elif "Industrial" in ward.category:
                factor = 1.15
            else:
                factor = 1.0

            heat_cooling_surge = self.heatwave_factor * 25.0
            ward.power_demand_mw = round(base_power * factor + heat_cooling_surge, 1)
            ward.transformer_load_pct = min(99.0, round((ward.power_demand_mw / ward.power_capacity_mw) * 100.0, 1))

            # Water simulation
            rush_water = 1.3 if (6.0 <= self.time_hour <= 9.5 or 18.0 <= self.time_hour <= 21.0) else 0.8
            ward.water_demand_mld = round(ward.population * 0.00015 * rush_water, 1)
            ward.water_delivered_mld = round(ward.water_demand_mld * random.uniform(0.92, 0.98), 1)

            # Traffic simulation
            traffic_multiplier = 1.4 if is_office_rush else 0.8
            if self.festival_rush:
                traffic_multiplier *= 1.25
            ward.traffic_density_pct = min(96.0, max(20.0, round(ward.traffic_density_pct * 0.95 + (random.uniform(50.0, 75.0) * traffic_multiplier * 0.05), 1)))
            ward.avg_speed_kmh = max(8.0, round(50.0 * (1.0 - (ward.traffic_density_pct / 100.0) ** 1.8), 1))

            # AQI and Pollution simulation
            traffic_contrib = (ward.traffic_density_pct / 100.0) * 120.0
            industrial_contrib = 90.0 if "Industrial" in ward.category else 20.0
            ward.pm25 = round(traffic_contrib * 0.6 + industrial_contrib + random.uniform(15.0, 30.0), 1)
            ward.no2 = round(traffic_contrib * 0.4 + (30.0 if "Commercial" in ward.category else 10.0), 1)
            ward.aqi = min(480, int(ward.pm25 * 1.45 + ward.no2 * 0.35))

            total_power_demand += ward.power_demand_mw
            total_water_demand += ward.water_demand_mld
            total_water_delivered += ward.water_delivered_mld
            congestion_sum += ward.traffic_density_pct
            aqi_sum += ward.aqi

        # City-wide aggregates
        avg_congestion = round(congestion_sum / len(self.wards), 1)
        city_aqi = int(aqi_sum / len(self.wards))
        grid_stability = 98.2 if total_power_demand < 950.0 else max(82.0, 98.2 - (total_power_demand - 950.0) * 0.15)

        # Update golden hour seconds for incidents
        for inc in self.incidents:
            if inc.status == "RESPONDING":
                inc.golden_hour_seconds_left = max(0, inc.golden_hour_seconds_left - int(delta_time_min * 60))
                if inc.response_eta_min and inc.response_eta_min > 0.5:
                    inc.response_eta_min = max(0.2, round(inc.response_eta_min - (delta_time_min), 1))

        formatted_time = f"{int(self.time_hour):02d}:{int((self.time_hour % 1) * 60):02d}"

        return CityMetrics(
            city_name="Indraprastha Megacity Digital Twin",
            total_population=sum(w.population for w in self.wards.values()),
            timestamp=formatted_time,
            current_weather="Clear Winter Haze" if self.monsoon_factor < 0.3 else "Monsoon Rain Squall",
            ambient_temp_c=round(24.0 + 8.0 * math.sin((self.time_hour - 8) / 12 * math.pi) + self.heatwave_factor * 6.0, 1),
            wind_speed_kmh=round(12.0 + random.uniform(-2.0, 3.0), 1),
            wind_direction_deg=225.0,
            total_power_demand_mw=round(total_power_demand, 1),
            total_power_supply_mw=round(total_power_demand + 45.0, 1),
            solar_pv_generation_mw=round(solar_pv_mw, 1),
            grid_frequency_hz=round(50.0 + random.uniform(-0.04, 0.03), 2),
            grid_stability_index=round(grid_stability, 1),
            rolling_blackout_active=grid_stability < 85.0,
            total_reservoir_level_pct=round(74.5 - (total_water_demand * 0.005), 1),
            total_water_supply_mld=round(total_water_delivered, 1),
            non_revenue_water_loss_pct=round(((total_water_demand - total_water_delivered) / max(1.0, total_water_demand)) * 100.0, 1),
            pumping_stations_active=8,
            city_congestion_index_pct=avg_congestion,
            avg_vehicle_speed_kmh=round(50.0 * (1.0 - (avg_congestion / 100.0) ** 1.8), 1),
            active_metro_trains=14,
            choke_points_count=sum(1 for w in self.wards.values() if w.traffic_density_pct > 75.0),
            city_composite_aqi=city_aqi,
            dominant_pollutant="PM2.5",
            heat_island_delta_c=round(2.8 + (avg_congestion / 100.0) * 1.5, 1),
            active_emergencies=len(self.incidents),
            avg_ambulance_response_min=round(8.5 + (avg_congestion / 100.0) * 8.0, 1),
            hospital_bed_occupancy_pct=84.2
        )

    def apply_intervention(self, rec_id: str) -> Dict[str, Any]:
        """Apply an AI recommendation into the simulation model."""
        target_rec = next((r for r in self.recommendations if r.id == rec_id), None)
        if not target_rec:
            return {"success": False, "error": "Recommendation not found"}

        target_rec.status = "SIMULATED"
        self.active_interventions.append(rec_id)

        # Apply specific modifiers
        if rec_id == "REC-01":  # Dynamic Reversible Lane
            for w in self.wards.values():
                w.traffic_density_pct = max(20.0, w.traffic_density_pct - 18.0)
                w.avg_speed_kmh += 8.5
        elif rec_id == "REC-02":  # BESS Storage
            for w in self.wards.values():
                w.transformer_load_pct = max(35.0, w.transformer_load_pct - 14.0)
        elif rec_id == "REC-03":  # Water PRVs
            for w in self.wards.values():
                w.water_delivered_mld += 4.5
        elif rec_id == "REC-04":  # Clean Corridor
            for w in self.wards.values():
                w.aqi = max(50, w.aqi - 35)
                w.pm25 = max(20.0, w.pm25 - 25.0)

        return {
            "success": True,
            "recommendation": target_rec.dict(),
            "active_interventions": self.active_interventions,
            "message": f"Successfully simulated '{target_rec.title}' across municipal telemetry grid."
        }
