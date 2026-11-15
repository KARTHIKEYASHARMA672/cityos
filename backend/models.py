from typing import List, Optional, Dict
from pydantic import BaseModel, Field

class WardData(BaseModel):
    id: str
    name: str
    category: str
    population: int
    power_demand_mw: float
    power_capacity_mw: float
    water_demand_mld: float
    water_delivered_mld: float
    pipeline_pressure_bar: float
    traffic_density_pct: float
    avg_speed_kmh: float
    aqi: int
    pm25: float
    no2: float
    co2_emissions_tph: float
    transformer_load_pct: float
    active_incidents: int
    coordinates: List[float]  # [x, z] in Three.js world space

class InfrastructureIncident(BaseModel):
    id: str
    title: str
    category: str  # "TRAFFIC", "POWER", "WATER", "FIRE", "MEDICAL"
    ward_id: str
    location_name: str
    severity: str  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    status: str  # "ACTIVE", "RESPONDING", "RESOLVED"
    dispatched_unit: Optional[str] = None
    response_eta_min: Optional[float] = None
    golden_hour_seconds_left: int
    coordinates: List[float]

class CityMetrics(BaseModel):
    city_name: str = "Indraprastha Megacity Digital Twin"
    total_population: int = 3450000
    timestamp: str
    current_weather: str = "Clear Winter Haze"
    ambient_temp_c: float = 29.4
    wind_speed_kmh: float = 14.2
    wind_direction_deg: float = 225.0
    
    # Power Grid
    total_power_demand_mw: float
    total_power_supply_mw: float
    solar_pv_generation_mw: float
    grid_frequency_hz: float
    grid_stability_index: float  # 0 to 100%
    rolling_blackout_active: bool
    
    # Water Distribution
    total_reservoir_level_pct: float
    total_water_supply_mld: float
    non_revenue_water_loss_pct: float
    pumping_stations_active: int
    
    # Traffic & Mobility
    city_congestion_index_pct: float
    avg_vehicle_speed_kmh: float
    active_metro_trains: int
    choke_points_count: int
    
    # Environment & Health
    city_composite_aqi: int
    dominant_pollutant: str = "PM2.5"
    heat_island_delta_c: float
    
    # Emergency Readiness
    active_emergencies: int
    avg_ambulance_response_min: float
    hospital_bed_occupancy_pct: float

class AIRecommendation(BaseModel):
    id: str
    title: str
    category: str
    capex_inr_crores: float
    timeline_months: int
    priority: str  # "CRITICAL", "HIGH", "MEDIUM"
    roi_score: float
    description: str
    impact: Dict[str, float]
    status: str = "PROPOSED"  # "PROPOSED", "SIMULATED", "APPROVED"
