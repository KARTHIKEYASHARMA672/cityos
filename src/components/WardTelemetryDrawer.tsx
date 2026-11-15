import React from 'react';
import { 
  X, 
  Building2, 
  Users, 
  Zap, 
  Droplet, 
  Gauge, 
  Wind, 
  AlertTriangle,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Ward } from '../types/city';

interface WardTelemetryDrawerProps {
  ward: Ward | null;
  onClose: () => void;
  onFocusWard: (ward: Ward) => void;
}

export const WardTelemetryDrawer: React.FC<WardTelemetryDrawerProps> = ({
  ward,
  onClose,
  onFocusWard,
}) => {
  if (!ward) return null;

  return (
    <div className="absolute top-20 right-4 z-30 w-80 sm:w-96 bg-city-surface/95 backdrop-blur-md border border-city-border rounded-3xl shadow-elevated p-5 space-y-4 animate-slide-in">
      
      {/* Header */}
      <div className="flex items-start justify-between border-b border-city-border pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-city-primary/10 border border-city-primary/20 flex items-center justify-center text-city-primary">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-city-primary">{ward.id}</span>
              <span className="text-[10px] font-semibold text-city-muted uppercase tracking-wider">{ward.category}</span>
            </div>
            <h3 className="text-base font-extrabold text-city-ink">{ward.name}</h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-city-muted hover:text-city-ink hover:bg-city-bg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Ward Quick Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 bg-city-bg rounded-xl border border-city-border">
          <span className="text-[10px] text-city-muted">Ward Population</span>
          <div className="text-sm font-bold font-mono text-city-ink mt-0.5">
            {ward.population.toLocaleString()}
          </div>
        </div>
        <div className="p-2.5 bg-city-bg rounded-xl border border-city-border">
          <span className="text-[10px] text-city-muted">Geographic Area</span>
          <div className="text-sm font-bold font-mono text-city-ink mt-0.5">
            {ward.areaKm2} km²
          </div>
        </div>
      </div>

      {/* Telemetry Breakdown */}
      <div className="space-y-3 text-xs">
        
        {/* Power */}
        <div className="p-3 bg-city-surface-card rounded-xl border border-city-border space-y-1.5">
          <div className="flex items-center justify-between text-city-ink font-semibold">
            <span className="flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-city-amber" />
              <span>Electricity & Transformer</span>
            </span>
            <span className="font-mono text-city-amber">{ward.transformerLoadPct}%</span>
          </div>
          <div className="flex justify-between text-city-muted text-[11px]">
            <span>Demand: {ward.powerDemandMW} MW</span>
            <span>Capacity: {ward.powerCapacityMW} MW</span>
          </div>
        </div>

        {/* Water */}
        <div className="p-3 bg-city-surface-card rounded-xl border border-city-border space-y-1.5">
          <div className="flex items-center justify-between text-city-ink font-semibold">
            <span className="flex items-center space-x-1.5">
              <Droplet className="w-3.5 h-3.5 text-city-water" />
              <span>Water Distribution</span>
            </span>
            <span className="font-mono text-city-water">{ward.pipelinePressureBar} bar</span>
          </div>
          <div className="flex justify-between text-city-muted text-[11px]">
            <span>Demand: {ward.waterDemandMLD} MLD</span>
            <span>Delivered: {ward.waterDeliveredMLD} MLD</span>
          </div>
        </div>

        {/* Traffic */}
        <div className="p-3 bg-city-surface-card rounded-xl border border-city-border space-y-1.5">
          <div className="flex items-center justify-between text-city-ink font-semibold">
            <span className="flex items-center space-x-1.5">
              <Gauge className="w-3.5 h-3.5 text-city-terracotta" />
              <span>Traffic Density</span>
            </span>
            <span className="font-mono text-city-terracotta">{ward.trafficDensityPct}%</span>
          </div>
          <div className="flex justify-between text-city-muted text-[11px]">
            <span>Avg Speed: {ward.avgSpeedKMH} km/h</span>
            <span>{ward.trafficDensityPct > 75 ? 'Congested LOS F' : 'Fluid Flow'}</span>
          </div>
        </div>

        {/* AQI */}
        <div className="p-3 bg-city-surface-card rounded-xl border border-city-border space-y-1.5">
          <div className="flex items-center justify-between text-city-ink font-semibold">
            <span className="flex items-center space-x-1.5">
              <Wind className="w-3.5 h-3.5 text-amber-700" />
              <span>Air Quality Index</span>
            </span>
            <span className="font-mono font-bold text-amber-800">{ward.aqi} AQI</span>
          </div>
          <div className="flex justify-between text-city-muted text-[11px]">
            <span>PM2.5: {ward.pm25} µg/m³</span>
            <span>NO2: {ward.no2} ppb</span>
          </div>
        </div>

      </div>

      {/* Focus Camera Button */}
      <button
        onClick={() => onFocusWard(ward)}
        className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-city-ink text-white text-xs font-bold hover:bg-city-primary transition-colors shadow-sm"
      >
        <Compass className="w-4 h-4" />
        <span>Focus Camera on {ward.name.split(' ')[0]}</span>
      </button>

    </div>
  );
};
