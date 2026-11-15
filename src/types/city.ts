export type CameraMode = 'TACTICAL_GOD_VIEW' | 'FLYOVER_DRONE' | 'WARD_TELEMETRY' | 'GROUND_PATROL';

export type VisualLayer = 'ALL' | 'TRAFFIC' | 'POWER' | 'WATER' | 'AQI' | 'EMERGENCY';

export type TimeOfDay = 'DAWN' | 'NOON' | 'DUSK' | 'NIGHT';

export interface Ward {
  id: string;
  name: string;
  category: string;
  population: number;
  powerDemandMW: number;
  powerCapacityMW: number;
  waterDemandMLD: number;
  waterDeliveredMLD: number;
  pipelinePressureBar: number;
  trafficDensityPct: number;
  avgSpeedKMH: number;
  aqi: number;
  pm25: number;
  no2: number;
  co2EmissionsTPH: number;
  transformerLoadPct: number;
  activeIncidents: number;
  coordinates: [number, number]; // [x, z] in Three.js coordinates
  areaKm2: number;
}

export interface CityMetrics {
  cityName: string;
  totalPopulation: number;
  timestamp: string;
  currentWeather: string;
  ambientTempC: number;
  windSpeedKMH: number;
  windDirectionDeg: number;

  // Power Grid
  totalPowerDemandMW: number;
  totalPowerSupplyMW: number;
  solarPVGenerationMW: number;
  gridFrequencyHz: number;
  gridStabilityIndex: number;
  rollingBlackoutActive: boolean;

  // Water Distribution
  totalReservoirLevelPct: number;
  totalWaterSupplyMLD: number;
  nonRevenueWaterLossPct: number;
  pumpingStationsActive: number;

  // Traffic & Mobility
  cityCongestionIndexPct: number;
  avgVehicleSpeedKMH: number;
  activeMetroTrains: number;
  chokePointsCount: number;

  // Environment & Health
  cityCompositeAQI: number;
  dominantPollutant: string;
  heatIslandDeltaC: number;

  // Emergency Readiness
  activeEmergencies: number;
  avgAmbulanceResponseMin: number;
  hospitalBedOccupancyPct: number;
}

export interface Incident {
  id: string;
  title: string;
  category: 'TRAFFIC' | 'POWER' | 'WATER' | 'FIRE' | 'MEDICAL';
  wardId: string;
  locationName: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'RESPONDING' | 'RESOLVED';
  dispatchedUnit?: string;
  responseEtaMin?: number;
  goldenHourSecondsLeft: number;
  coordinates: [number, number];
  description: string;
}

export interface Recommendation {
  id: string;
  title: string;
  category: string;
  capexInrCrores: number;
  timelineMonths: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  roiScore: number;
  description: string;
  impact: {
    congestionReductionPct?: number;
    avgSpeedGainKMH?: number;
    peakLoadShavedMW?: number;
    blackoutRiskReductionPct?: number;
    waterSavedMLD?: number;
    nrwLossReductionPct?: number;
    pm25ReductionPct?: number;
    aqiImprovementPts?: number;
    ambulanceResponseTimeMinReduction?: number;
    [key: string]: number | undefined;
  };
  status: 'PROPOSED' | 'SIMULATED' | 'APPROVED';
}

export type ScenarioPreset = 
  | 'NORMAL'
  | 'MONSOON_FLOOD'
  | 'SUMMER_HEATWAVE'
  | 'FESTIVAL_RUSH'
  | 'METRO_BREAKDOWN';
