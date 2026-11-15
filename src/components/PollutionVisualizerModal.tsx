import React, { useState } from 'react';
import { 
  X, 
  Wind, 
  Thermometer, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert,
  CloudFog,
  Sparkles
} from 'lucide-react';
import { Ward, CityMetrics } from '../types/city';

interface PollutionVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: CityMetrics;
  wards: Ward[];
  onApplyGreenBuffer: () => void;
}

export const PollutionVisualizerModal: React.FC<PollutionVisualizerModalProps> = ({
  isOpen,
  onClose,
  metrics,
  wards,
  onApplyGreenBuffer,
}) => {
  const [mistCannonsActive, setMistCannonsActive] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleMistCannons = () => {
    setMistCannonsActive(!mistCannonsActive);
    setToastMessage(!mistCannonsActive ? 'Deployed 24 anti-smog mist water cannons along Industrial & Ring Road corridors.' : 'Anti-smog mist cannons deactivated.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleGreenCorridor = () => {
    onApplyGreenBuffer();
    setToastMessage('Urban Bio-Shield Green Buffer simulation initiated. Heavy freight diverted.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-city-ink/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-city-surface border border-city-border rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-city-border bg-city-bg/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-700 text-white flex items-center justify-center shadow-sm">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-city-ink">Air Quality (AQI) & Urban Heat Island Simulation</h2>
              <p className="text-xs text-city-muted">Gaussian plume dispersion, PM2.5/NO2 advection & thermal anomaly mapping</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-city-muted hover:text-city-ink hover:bg-city-bg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 bg-city-bg rounded-2xl border border-city-border">
              <span className="text-[11px] text-city-muted font-medium">Composite AQI</span>
              <div className="text-2xl font-mono font-extrabold text-amber-800 mt-1">
                {metrics.cityCompositeAQI}
              </div>
              <span className="text-[10px] text-city-danger font-medium">National Standard: 50</span>
            </div>
            <div className="p-3.5 bg-city-bg rounded-2xl border border-city-border">
              <span className="text-[11px] text-city-muted font-medium">Dominant Pollutant</span>
              <div className="text-2xl font-mono font-extrabold text-city-ink mt-1">
                PM2.5
              </div>
              <span className="text-[10px] text-city-muted">Fine inhalable particulates</span>
            </div>
            <div className="p-3.5 bg-city-bg rounded-2xl border border-city-border">
              <span className="text-[11px] text-city-muted font-medium">Heat Island Delta</span>
              <div className="text-2xl font-mono font-extrabold text-city-terracotta mt-1">
                +{metrics.heatIslandDeltaC}°C
              </div>
              <span className="text-[10px] text-city-muted">Urban thermal canopy</span>
            </div>
            <div className="p-3.5 bg-city-bg rounded-2xl border border-city-border">
              <span className="text-[11px] text-city-muted font-medium">Wind Vector Advection</span>
              <div className="text-2xl font-mono font-extrabold text-city-primary mt-1">
                {metrics.windSpeedKMH} <span className="text-sm font-sans font-normal">km/h</span>
              </div>
              <span className="text-[10px] text-city-muted">Direction: SW 230°</span>
            </div>
          </div>

          {/* CPCB Health Advisory Banner */}
          <div className={`p-4 rounded-2xl border flex items-start space-x-3 ${
            metrics.cityCompositeAQI > 200 ? 'bg-red-50 border-red-200 text-red-900' : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
            <div className="text-xs space-y-1">
              <span className="font-bold">Public Health Advisory — Stage-III GRAP Protocol</span>
              <p className="text-city-muted">
                Air quality index indicates heavy particulate concentration across Pettah and Peenya. Elderly and children advised to limit outdoor physical activity. Anti-dust water sprinkling active on ring roads.
              </p>
            </div>
          </div>

          {/* Ward Pollutant Density Table */}
          <div className="p-4 bg-city-surface-card rounded-2xl border border-city-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-city-muted mb-3">Ward Particulate Concentrations & Emissions</h3>
            <div className="divide-y divide-city-border text-xs">
              {wards.map(ward => (
                <div key={ward.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-city-primary">{ward.id}</span>
                    <span className="font-semibold text-city-ink">{ward.name}</span>
                  </div>
                  <div className="flex items-center space-x-6 text-[11px]">
                    <div>
                      PM2.5: <span className="font-mono font-bold text-amber-800">{ward.pm25} µg/m³</span>
                    </div>
                    <div>
                      NO2: <span className="font-mono font-medium text-city-ink">{ward.no2} ppb</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-extrabold text-sm">{ward.aqi} AQI</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        ward.aqi > 200 ? 'bg-red-100 text-red-800' : ward.aqi > 100 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {ward.aqi > 200 ? 'SEVERE' : ward.aqi > 100 ? 'POOR' : 'GOOD'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mitigation Actions */}
          <div className="p-4 bg-city-bg rounded-2xl border border-city-border space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-city-ink">Air Quality Mitigation Controls</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleGreenCorridor}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-city-forest text-white text-xs font-bold hover:bg-emerald-800 shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Simulate Bio-Shield Forest & Low-Emission Corridor</span>
              </button>

              <button
                onClick={handleToggleMistCannons}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  mistCannonsActive ? 'bg-amber-800 text-white' : 'bg-city-surface border border-city-border text-city-ink hover:border-amber-700'
                }`}
              >
                <CloudFog className="w-4 h-4" />
                <span>{mistCannonsActive ? 'Anti-Smog Mist Cannons (Active)' : 'Deploy Anti-Smog Mist Cannons'}</span>
              </button>
            </div>

            {toastMessage && (
              <div className="p-3 bg-amber-50 text-amber-900 text-xs rounded-xl border border-amber-200 flex items-center space-x-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>{toastMessage}</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
