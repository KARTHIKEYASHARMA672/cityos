import { Ward, CityMetrics, Incident, Recommendation, ScenarioPreset } from '../types/city';

export class CitySimulationEngine {
  private timeHour: number = 14.5; // 2:30 PM default
  private scenario: ScenarioPreset = 'NORMAL';
  private activeInterventions: string[] = [];

  private wards: Record<string, Ward> = {
    W01: {
      id: 'W01',
      name: 'Cyber Gateway & Tech Park',
      category: 'Commercial / IT Corridor',
      population: 380000,
      powerDemandMW: 195.0,
      powerCapacityMW: 210.0,
      waterDemandMLD: 82.0,
      waterDeliveredMLD: 79.5,
      pipelinePressureBar: 3.2,
      trafficDensityPct: 78.5,
      avgSpeedKMH: 16.8,
      aqi: 174,
      pm25: 92.4,
      no2: 48.2,
      co2EmissionsTPH: 118.0,
      transformerLoadPct: 88.4,
      activeIncidents: 1,
      coordinates: [45.0, -35.0],
      areaKm2: 14.2
    },
    W02: {
      id: 'W02',
      name: 'Pettah Heritage & Old Bazaar',
      category: 'Heritage Commercial & Dense Mixed',
      population: 620000,
      powerDemandMW: 145.0,
      powerCapacityMW: 150.0,
      waterDemandMLD: 98.0,
      waterDeliveredMLD: 88.0,
      pipelinePressureBar: 2.1,
      trafficDensityPct: 89.2,
      avgSpeedKMH: 11.4,
      aqi: 238,
      pm25: 142.0,
      no2: 64.0,
      co2EmissionsTPH: 145.0,
      transformerLoadPct: 94.2,
      activeIncidents: 2,
      coordinates: [-40.0, -20.0],
      areaKm2: 9.8
    },
    W03: {
      id: 'W03',
      name: 'Bellandur Lake Basin & Enclave',
      category: 'Residential & Wetlands',
      population: 780000,
      powerDemandMW: 160.0,
      powerCapacityMW: 180.0,
      waterDemandMLD: 140.0,
      waterDeliveredMLD: 128.0,
      pipelinePressureBar: 2.8,
      trafficDensityPct: 64.0,
      avgSpeedKMH: 24.5,
      aqi: 152,
      pm25: 76.0,
      no2: 36.0,
      co2EmissionsTPH: 82.0,
      transformerLoadPct: 74.0,
      activeIncidents: 1,
      coordinates: [60.0, 50.0],
      areaKm2: 22.4
    },
    W04: {
      id: 'W04',
      name: 'Peenya Industrial & Freight Hub',
      category: 'Heavy Industrial & Logistics',
      population: 410000,
      powerDemandMW: 265.0,
      powerCapacityMW: 280.0,
      waterDemandMLD: 110.0,
      waterDeliveredMLD: 104.0,
      pipelinePressureBar: 3.5,
      trafficDensityPct: 72.0,
      avgSpeedKMH: 19.2,
      aqi: 264,
      pm25: 168.0,
      no2: 82.0,
      co2EmissionsTPH: 210.0,
      transformerLoadPct: 91.5,
      activeIncidents: 1,
      coordinates: [-55.0, 55.0],
      areaKm2: 18.6
    },
    W05: {
      id: 'W05',
      name: 'Vidhana Civic & Healthcare Belt',
      category: 'Government & Medical Hub',
      population: 490000,
      powerDemandMW: 110.0,
      powerCapacityMW: 130.0,
      waterDemandMLD: 75.0,
      waterDeliveredMLD: 74.0,
      pipelinePressureBar: 3.8,
      trafficDensityPct: 48.0,
      avgSpeedKMH: 32.0,
      aqi: 128,
      pm25: 58.0,
      no2: 28.0,
      co2EmissionsTPH: 54.0,
      transformerLoadPct: 62.0,
      activeIncidents: 0,
      coordinates: [0.0, 0.0],
      areaKm2: 11.5
    },
    W06: {
      id: 'W06',
      name: 'Greenfield Solar Aerotropolis',
      category: 'Innovation & Smart Township',
      population: 350000,
      powerDemandMW: 85.0,
      powerCapacityMW: 140.0,
      waterDemandMLD: 55.0,
      waterDeliveredMLD: 54.5,
      pipelinePressureBar: 4.1,
      trafficDensityPct: 34.0,
      avgSpeedKMH: 42.0,
      aqi: 88,
      pm25: 34.0,
      no2: 18.0,
      co2EmissionsTPH: 31.0,
      transformerLoadPct: 45.0,
      activeIncidents: 0,
      coordinates: [10.0, -80.0],
      areaKm2: 30.1
    }
  };

  private incidents: Incident[] = [
    {
      id: 'INC-401',
      title: 'Silk Board Junction Traffic Gridlock',
      category: 'TRAFFIC',
      wardId: 'W01',
      locationName: 'Outer Ring Road Interchange',
      severity: 'CRITICAL',
      status: 'RESPONDING',
      dispatchedUnit: 'Traffic Police Interceptor T-08',
      responseEtaMin: 4.2,
      goldenHourSecondsLeft: 1650,
      coordinates: [42.0, -32.0],
      description: 'Multiple stalled trucks blocking north-bound flyover ramp. Queue tail extending 2.8 km back to Agara junction.'
    },
    {
      id: 'INC-402',
      title: '11kV Substation Feeder Overload Trip',
      category: 'POWER',
      wardId: 'W02',
      locationName: 'Chowk Distribution Substation 4',
      severity: 'HIGH',
      status: 'ACTIVE',
      dispatchedUnit: 'BESCOM Rapid Restoration Crew B-2',
      responseEtaMin: 9.5,
      goldenHourSecondsLeft: 2400,
      coordinates: [-38.0, -18.0],
      description: 'Thermal breaker tripped on Feeder F-7 due to commercial AC load spike. 18 commercial complexes running on diesel generators.'
    },
    {
      id: 'INC-403',
      title: 'Main Trunk Pipeline Pressure Burst',
      category: 'WATER',
      wardId: 'W03',
      locationName: 'Lake Bypass 900mm Feeder Line',
      severity: 'HIGH',
      status: 'RESPONDING',
      dispatchedUnit: 'Water Board Emergency Valve Van W-05',
      responseEtaMin: 6.8,
      goldenHourSecondsLeft: 1980,
      coordinates: [58.0, 48.0],
      description: 'Pressure surge burst coupling in section 14-B. Non-revenue water outflow estimated at 1,400 liters/minute into stormwater canal.'
    },
    {
      id: 'INC-404',
      title: 'Chemical Storage Shed Fire Alarm',
      category: 'FIRE',
      wardId: 'W04',
      locationName: 'Peenya Sector 2 Freight Terminal',
      severity: 'CRITICAL',
      status: 'RESPONDING',
      dispatchedUnit: 'Fire Tender Engine F-12 & Water Bowsers',
      responseEtaMin: 3.5,
      goldenHourSecondsLeft: 1200,
      coordinates: [-52.0, 52.0],
      description: 'Industrial solvent containment failure triggered Class B thermal alarm. Hospital trauma team on standby.'
    }
  ];

  private recommendations: Recommendation[] = [
    {
      id: 'REC-01',
      title: 'Deploy Dynamic Reversible Lane & AI Signal Mesh on Ring Road',
      category: 'Mobility & Traffic',
      capexInrCrores: 42.5,
      timelineMonths: 6,
      priority: 'CRITICAL',
      roiScore: 9.4,
      description: 'Synchronize 28 intersection signal controllers along Outer Ring Road with inductive loop and camera sensors. Creates a tidal center lane toward Tech Hub during morning rush and outward during evening.',
      impact: {
        congestionReductionPct: 34.2,
        avgSpeedGainKMH: 12.6,
        aqiImprovementPts: 28.0
      },
      status: 'PROPOSED'
    },
    {
      id: 'REC-02',
      title: 'Install 25MWh Distributed Battery Energy Storage System (BESS) at Pettah & Peenya',
      category: 'Power & Grid',
      capexInrCrores: 85.0,
      timelineMonths: 9,
      priority: 'HIGH',
      roiScore: 8.8,
      description: 'Peak-shaves transformer loads by absorbing surplus midday rooftop solar and discharging during 7:00 PM - 10:30 PM evening peak. Eliminates rolling blackouts in Pettah and Peenya.',
      impact: {
        peakLoadShavedMW: 25.0,
        blackoutRiskReductionPct: 86.0
      },
      status: 'PROPOSED'
    },
    {
      id: 'REC-03',
      title: 'District Metered Areas (DMA) & Smart Pressure Reducing Valves (PRVs)',
      category: 'Water Infrastructure',
      capexInrCrores: 58.0,
      timelineMonths: 8,
      priority: 'HIGH',
      roiScore: 9.1,
      description: 'Segment Bellandur and Pettah water distribution networks into 16 monitored zones with acoustic leak listening sensors and automated PRVs to maintain constant 2.8 bar head.',
      impact: {
        waterSavedMLD: 28.4,
        nrwLossReductionPct: 42.0
      },
      status: 'PROPOSED'
    },
    {
      id: 'REC-04',
      title: 'Urban Green Buffer & Ultra-Low Emission Freight Corridor in Industrial Zone',
      category: 'Environment & AQI',
      capexInrCrores: 36.0,
      timelineMonths: 12,
      priority: 'MEDIUM',
      roiScore: 7.9,
      description: 'Enforce daytime heavy diesel truck diversions to outer peripheral expressways and plant a dense 3-tier bio-shield forest strip around Peenya and Lake Basin.',
      impact: {
        pm25ReductionPct: 26.5,
        aqiImprovementPts: 45.0
      },
      status: 'PROPOSED'
    },
    {
      id: 'REC-05',
      title: 'Dedicated Emergency Preemption Beacon Corridor (Green Corridor Routing)',
      category: 'Emergency Management',
      capexInrCrores: 18.5,
      timelineMonths: 4,
      priority: 'CRITICAL',
      roiScore: 9.7,
      description: 'Install V2X RF preemption transmitters on all 48 municipal ambulances and fire tenders that automatically switch traffic signals to green 400m ahead along hospital trauma routes.',
      impact: {
        ambulanceResponseTimeMinReduction: 6.8
      },
      status: 'PROPOSED'
    }
  ];

  public getWards(): Ward[] {
    return Object.values(this.wards);
  }

  public getIncidents(): Incident[] {
    return this.incidents;
  }

  public getRecommendations(): Recommendation[] {
    return this.recommendations;
  }

  public getScenario(): ScenarioPreset {
    return this.scenario;
  }

  public setScenario(newScenario: ScenarioPreset): void {
    this.scenario = newScenario;
  }

  public applyIntervention(recId: string): boolean {
    const rec = this.recommendations.find(r => r.id === recId);
    if (!rec) return false;

    rec.status = 'SIMULATED';
    if (!this.activeInterventions.includes(recId)) {
      this.activeInterventions.push(recId);
    }

    // Apply immediate impact to ward parameters
    if (recId === 'REC-01') {
      Object.values(this.wards).forEach(w => {
        w.trafficDensityPct = Math.max(22, w.trafficDensityPct - 20);
        w.avgSpeedKMH += 9.5;
        w.aqi = Math.max(50, w.aqi - 25);
      });
    } else if (recId === 'REC-02') {
      Object.values(this.wards).forEach(w => {
        w.transformerLoadPct = Math.max(35, w.transformerLoadPct - 18);
      });
    } else if (recId === 'REC-03') {
      Object.values(this.wards).forEach(w => {
        w.waterDeliveredMLD += 5.2;
        w.pipelinePressureBar = Math.min(4.0, w.pipelinePressureBar + 0.4);
      });
    } else if (recId === 'REC-04') {
      Object.values(this.wards).forEach(w => {
        w.aqi = Math.max(45, w.aqi - 38);
        w.pm25 = Math.max(15, w.pm25 - 28);
      });
    }

    return true;
  }

  public dispatchEmergencyUnit(incidentId: string, unitName: string): boolean {
    const inc = this.incidents.find(i => i.id === incidentId);
    if (!inc) return false;
    inc.status = 'RESPONDING';
    inc.dispatchedUnit = unitName;
    inc.responseEtaMin = 3.5;
    return true;
  }

  public resolveIncident(incidentId: string): boolean {
    const inc = this.incidents.find(i => i.id === incidentId);
    if (!inc) return false;
    inc.status = 'RESOLVED';
    inc.responseEtaMin = 0;
    return true;
  }

  public stepSimulation(deltaTimeMin: number = 2.0): CityMetrics {
    this.timeHour = (this.timeHour + (deltaTimeMin / 60.0)) % 24.0;

    // Solar PV Generation (Bell curve from 6am to 6pm, peak 12:30pm)
    const solarInsolation = Math.max(0, Math.sin(Math.max(0, Math.min(Math.PI, ((this.timeHour - 6.0) / 12.0) * Math.PI))));
    let solarPVGenerationMW = 185.0 * solarInsolation;

    // Scenario modifiers
    let trafficMultiplier = 1.0;
    let powerSurgeMultiplier = 1.0;
    let waterDrainMultiplier = 1.0;
    let aqiMultiplier = 1.0;

    if (this.scenario === 'MONSOON_FLOOD') {
      trafficMultiplier = 1.45;
      waterDrainMultiplier = 1.25;
      aqiMultiplier = 0.65; // rain washes down PM2.5
      solarPVGenerationMW *= 0.2; // heavy overcast
    } else if (this.scenario === 'SUMMER_HEATWAVE') {
      powerSurgeMultiplier = 1.35; // AC load
      waterDrainMultiplier = 1.3;
      aqiMultiplier = 1.25;
    } else if (this.scenario === 'FESTIVAL_RUSH') {
      trafficMultiplier = 1.4;
      powerSurgeMultiplier = 1.2;
      aqiMultiplier = 1.5;
    } else if (this.scenario === 'METRO_BREAKDOWN') {
      trafficMultiplier = 1.5; // road traffic jumps due to metro halt
    }

    const isOfficeRush = (this.timeHour >= 8.5 && this.timeHour <= 11.0) || (this.timeHour >= 17.5 && this.timeHour <= 20.5);
    if (isOfficeRush) {
      trafficMultiplier *= 1.3;
    }

    let totalPowerDemand = 0;
    let totalWaterDemand = 0;
    let totalWaterDelivered = 0;
    let congestionSum = 0;
    let aqiSum = 0;

    Object.values(this.wards).forEach(w => {
      // Dynamic power
      const baseLoad = w.powerCapacityMW * 0.7;
      w.powerDemandMW = Math.round((baseLoad * powerSurgeMultiplier + (Math.sin(this.timeHour / 4) * 8)) * 10) / 10;
      w.transformerLoadPct = Math.min(99, Math.round((w.powerDemandMW / w.powerCapacityMW) * 1000) / 10);

      // Dynamic water
      w.waterDemandMLD = Math.round((w.population * 0.00015 * waterDrainMultiplier) * 10) / 10;
      w.waterDeliveredMLD = Math.round((w.waterDemandMLD * 0.94) * 10) / 10;

      // Dynamic traffic
      w.trafficDensityPct = Math.min(97, Math.max(15, Math.round((w.trafficDensityPct * 0.96 + (trafficMultiplier * 3.5)) * 10) / 10));
      w.avgSpeedKMH = Math.max(7, Math.round(52.0 * Math.pow(1.0 - (w.trafficDensityPct / 100.0), 1.7) * 10) / 10);

      // Dynamic pollution
      w.pm25 = Math.round(((w.trafficDensityPct * 1.1) + (w.category.includes('Industrial') ? 95 : 35)) * aqiMultiplier * 10) / 10;
      w.no2 = Math.round(((w.trafficDensityPct * 0.5) + 20) * 10) / 10;
      w.aqi = Math.min(480, Math.round(w.pm25 * 1.4 + w.no2 * 0.3));

      totalPowerDemand += w.powerDemandMW;
      totalWaterDemand += w.waterDemandMLD;
      totalWaterDelivered += w.waterDeliveredMLD;
      congestionSum += w.trafficDensityPct;
      aqiSum += w.aqi;
    });

    // Update Incidents Golden Hour
    this.incidents.forEach(inc => {
      if (inc.status === 'RESPONDING') {
        inc.goldenHourSecondsLeft = Math.max(0, inc.goldenHourSecondsLeft - Math.round(deltaTimeMin * 60));
        if (inc.responseEtaMin && inc.responseEtaMin > 0.3) {
          inc.responseEtaMin = Math.max(0.2, Math.round((inc.responseEtaMin - (deltaTimeMin / 3)) * 10) / 10);
        }
      }
    });

    const wardCount = Object.keys(this.wards).length;
    const avgCongestion = Math.round((congestionSum / wardCount) * 10) / 10;
    const cityAQI = Math.round(aqiSum / wardCount);
    const gridStability = totalPowerDemand > 980 ? 82.5 : Math.round((99.2 - (totalPowerDemand / 980) * 8.5) * 10) / 10;

    const formattedTime = `${Math.floor(this.timeHour).toString().padStart(2, '0')}:${Math.floor((this.timeHour % 1) * 60).toString().padStart(2, '0')}`;

    return {
      cityName: 'Indraprastha Megacity Digital Twin',
      totalPopulation: Object.values(this.wards).reduce((acc, w) => acc + w.population, 0),
      timestamp: `${formattedTime} IST`,
      currentWeather: this.scenario === 'MONSOON_FLOOD' ? 'Monsoon Downpour (42mm/hr)' : this.scenario === 'SUMMER_HEATWAVE' ? 'Heatwave Extreme (41.5°C)' : 'Clear Civic Sky',
      ambientTempC: Math.round((28.5 + Math.sin((this.timeHour - 8) / 12 * Math.PI) * 7.5 + (this.scenario === 'SUMMER_HEATWAVE' ? 6 : 0)) * 10) / 10,
      windSpeedKMH: Math.round((14.0 + (this.scenario === 'MONSOON_FLOOD' ? 18.0 : 0)) * 10) / 10,
      windDirectionDeg: 230,

      totalPowerDemandMW: Math.round(totalPowerDemand * 10) / 10,
      totalPowerSupplyMW: Math.round((totalPowerDemand + 55.0) * 10) / 10,
      solarPVGenerationMW: Math.round(solarPVGenerationMW * 10) / 10,
      gridFrequencyHz: Math.round((50.0 + (Math.random() * 0.06 - 0.03)) * 100) / 100,
      gridStabilityIndex: gridStability,
      rollingBlackoutActive: gridStability < 84.0,

      totalReservoirLevelPct: Math.round((76.2 - (totalWaterDemand * 0.003)) * 10) / 10,
      totalWaterSupplyMLD: Math.round(totalWaterDelivered * 10) / 10,
      nonRevenueWaterLossPct: Math.round(((totalWaterDemand - totalWaterDelivered) / totalWaterDemand * 100) * 10) / 10,
      pumpingStationsActive: 8,

      cityCongestionIndexPct: avgCongestion,
      avgVehicleSpeedKMH: Math.max(8.0, Math.round(52.0 * Math.pow(1.0 - (avgCongestion / 100.0), 1.7) * 10) / 10),
      activeMetroTrains: this.scenario === 'METRO_BREAKDOWN' ? 2 : 16,
      chokePointsCount: Object.values(this.wards).filter(w => w.trafficDensityPct > 75).length,

      cityCompositeAQI: cityAQI,
      dominantPollutant: 'PM2.5',
      heatIslandDeltaC: Math.round((2.6 + (avgCongestion / 100) * 1.6) * 10) / 10,

      activeEmergencies: this.incidents.filter(i => i.status !== 'RESOLVED').length,
      avgAmbulanceResponseMin: Math.round((7.2 + (avgCongestion / 100) * 8.5) * 10) / 10,
      hospitalBedOccupancyPct: 84.5
    };
  }
}
