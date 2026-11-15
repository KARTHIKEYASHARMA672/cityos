import React from 'react';
import { 
  Gauge, 
  Zap, 
  Droplet, 
  Wind, 
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { CityMetrics } from '../types/city';

interface MetricCardsStripProps {
  metrics: CityMetrics;
  onOpenTraffic: () => void;
  onOpenPower: () => void;
  onOpenWater: () => void;
  onOpenPollution: () => void;
  onOpenEmergency: () => void;
}

export const MetricCardsStrip: React.FC<MetricCardsStripProps> = ({
  metrics,
  onOpenTraffic,
  onOpenPower,
  onOpenWater,
  onOpenPollution,
  onOpenEmergency,
}) => {
  return (
    <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 max-w-7xl mx-auto">
        
        {/* 1. Traffic Congestion Card */}
        <div 
          onClick={onOpenTraffic}
          className="pointer-events-auto bg-city-surface/95 backdrop-blur-md p-3.5 rounded-2xl border border-city-border shadow-elevated hover:border-city-terracotta cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between text-xs text-city-muted mb-1">
            <span className="flex items-center space-x-1 font-semibold text-city-ink">
              <Gauge className="w-3.5 h-3.5 text-city-terracotta" />
              <span>Traffic Congestion</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-city-terracotta" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-extrabold font-mono text-city-ink">{metrics.cityCongestionIndexPct}%</span>
            <span className="text-[11px] font-medium text-city-muted">
              {metrics.avgVehicleSpeedKMH} km/h avg
            </span>
          </div>
          <div className="mt-2 w-full bg-city-bg h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                metrics.cityCongestionIndexPct > 75 ? 'bg-city-danger' : metrics.cityCongestionIndexPct > 50 ? 'bg-city-terracotta' : 'bg-city-success'
              }`}
              style={{ width: `${metrics.cityCongestionIndexPct}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] text-city-muted">
            <span>Silk Board Choke</span>
            <span className="font-mono font-medium text-city-terracotta">{metrics.chokePointsCount} Critical Juncs</span>
          </div>
        </div>

        {/* 2. Electricity Demand Card */}
        <div 
          onClick={onOpenPower}
          className="pointer-events-auto bg-city-surface/95 backdrop-blur-md p-3.5 rounded-2xl border border-city-border shadow-elevated hover:border-city-amber cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between text-xs text-city-muted mb-1">
            <span className="flex items-center space-x-1 font-semibold text-city-ink">
              <Zap className="w-3.5 h-3.5 text-city-amber" />
              <span>Power Grid</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-city-amber" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-extrabold font-mono text-city-ink">{metrics.totalPowerDemandMW}</span>
            <span className="text-xs text-city-muted">MW</span>
          </div>
          <div className="mt-2 w-full bg-city-bg h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-city-amber rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (metrics.totalPowerDemandMW / metrics.totalPowerSupplyMW) * 100)}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] text-city-muted">
            <span className="text-amber-700 font-medium">Solar: {metrics.solarPVGenerationMW} MW</span>
            <span className="font-mono">{metrics.gridFrequencyHz} Hz</span>
          </div>
        </div>

        {/* 3. Water Distribution Card */}
        <div 
          onClick={onOpenWater}
          className="pointer-events-auto bg-city-surface/95 backdrop-blur-md p-3.5 rounded-2xl border border-city-border shadow-elevated hover:border-city-water cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between text-xs text-city-muted mb-1">
            <span className="flex items-center space-x-1 font-semibold text-city-ink">
              <Droplet className="w-3.5 h-3.5 text-city-water" />
              <span>Water Hydraulics</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-city-water" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-extrabold font-mono text-city-ink">{metrics.totalWaterSupplyMLD}</span>
            <span className="text-xs text-city-muted">MLD</span>
          </div>
          <div className="mt-2 w-full bg-city-bg h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-city-water rounded-full transition-all duration-500"
              style={{ width: `${metrics.totalReservoirLevelPct}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] text-city-muted">
            <span>Reservoir: {metrics.totalReservoirLevelPct}%</span>
            <span className="font-mono text-city-danger font-medium">{metrics.nonRevenueWaterLossPct}% NRW Loss</span>
          </div>
        </div>

        {/* 4. Air Quality & Pollution Card */}
        <div 
          onClick={onOpenPollution}
          className="pointer-events-auto bg-city-surface/95 backdrop-blur-md p-3.5 rounded-2xl border border-city-border shadow-elevated hover:border-amber-700 cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between text-xs text-city-muted mb-1">
            <span className="flex items-center space-x-1 font-semibold text-city-ink">
              <Wind className="w-3.5 h-3.5 text-amber-700" />
              <span>Pollution & AQI</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-700" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-extrabold font-mono text-city-ink">{metrics.cityCompositeAQI}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              metrics.cityCompositeAQI > 200 ? 'bg-red-100 text-red-800' : metrics.cityCompositeAQI > 100 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {metrics.cityCompositeAQI > 200 ? 'VERY POOR' : metrics.cityCompositeAQI > 100 ? 'MODERATE' : 'GOOD'}
            </span>
          </div>
          <div className="mt-2 w-full bg-city-bg h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-600 rounded-full"
              style={{ width: `${Math.min(100, (metrics.cityCompositeAQI / 300) * 100)}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] text-city-muted">
            <span>Primary: {metrics.dominantPollutant}</span>
            <span>+{metrics.heatIslandDeltaC}°C Heat Island</span>
          </div>
        </div>

        {/* 5. Emergency Response Card */}
        <div 
          onClick={onOpenEmergency}
          className="pointer-events-auto bg-city-surface/95 backdrop-blur-md p-3.5 rounded-2xl border border-city-border shadow-elevated hover:border-city-danger cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between text-xs text-city-muted mb-1">
            <span className="flex items-center space-x-1 font-semibold text-city-ink">
              <AlertTriangle className="w-3.5 h-3.5 text-city-danger" />
              <span>Emergency Dispatch</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-city-danger" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-extrabold font-mono text-city-danger">{metrics.activeEmergencies}</span>
            <span className="text-[11px] font-medium text-city-muted">Active Alerts</span>
          </div>
          <div className="mt-2 w-full bg-city-bg h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-city-danger rounded-full animate-pulse"
              style={{ width: `${Math.min(100, metrics.activeEmergencies * 25)}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] text-city-muted">
            <span className="text-city-danger font-medium">ETA: {metrics.avgAmbulanceResponseMin}m</span>
            <span>Beds: {metrics.hospitalBedOccupancyPct}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};
