import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Sun, 
  BatteryCharging, 
  AlertTriangle, 
  CheckCircle2, 
  Power,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { Ward, CityMetrics } from '../types/city';

interface ElectricityGridModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: CityMetrics;
  wards: Ward[];
  onDeployBESS: () => void;
}

export const ElectricityGridModal: React.FC<ElectricityGridModalProps> = ({
  isOpen,
  onClose,
  metrics,
  wards,
  onDeployBESS,
}) => {
  const [bessDischarging, setBessDischarging] = useState<boolean>(false);
  const [loadSheddingToggled, setLoadSheddingToggled] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleBESS = () => {
    setBessDischarging(!bessDischarging);
    onDeployBESS();
    setActionMessage(bessDischarging ? 'BESS battery switched to Solar Absorption Mode.' : '25MWh BESS actively discharging 25MW into Pettah & Peenya substations.');
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleToggleLoadShedding = () => {
    setLoadSheddingToggled(!loadSheddingToggled);
    setActionMessage(!loadSheddingToggled ? 'Rotational 30-min load shedding active on Feeder F-9 (Peenya Industrial).' : 'Load shedding deactivated. Grid balance restored.');
    setTimeout(() => setActionMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-city-ink/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-city-surface border border-city-border rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-city-border bg-city-bg/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-city-amber text-white flex items-center justify-center shadow-sm">
              <Zap className="w-5 h-5 text-amber-950" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-city-ink">Electricity Grid & Substation Telemetry</h2>
              <p className="text-xs text-city-muted">220kV Receiving Stations, Solar PV duck curve & load shedding optimization</p>
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
              <span className="text-[11px] text-city-muted font-medium">Total Demand</span>
              <div className="text-2xl font-mono font-extrabold text-city-ink mt-1">
                {metrics.totalPowerDemandMW} <span className="text-sm font-sans font-normal">MW</span>
              </div>
              <span className="text-[10px] text-city-muted">Capacity: {metrics.totalPowerSupplyMW} MW</span>
            </div>
            <div className="p-3.5 bg-city-bg rounded-2xl border border-city-border">
              <span className="text-[11px] text-city-muted font-medium">Rooftop Solar PV</span>
              <div className="text-2xl font-mono font-extrabold text-amber-700 mt-1">
                {metrics.solarPVGenerationMW} <span className="text-sm font-sans font-normal">MW</span>
              </div>
              <span className="text-[10px] text-city-success font-medium">Clean energy feed-in</span>
            </div>
            <div className="p-3.5 bg-city-bg rounded-2xl border border-city-border">
              <span className="text-[11px] text-city-muted font-medium">Grid Frequency</span>
              <div className="text-2xl font-mono font-extrabold text-city-primary mt-1">
                {metrics.gridFrequencyHz} <span className="text-sm font-sans font-normal">Hz</span>
              </div>
              <span className="text-[10px] text-city-muted">Nominal: 50.00 Hz</span>
            </div>
            <div className="p-3.5 bg-city-bg rounded-2xl border border-city-border">
              <span className="text-[11px] text-city-muted font-medium">Stability Index</span>
              <div className="text-2xl font-mono font-extrabold text-city-success mt-1">
                {metrics.gridStabilityIndex}%
              </div>
              <span className="text-[10px] text-city-muted">Resilience benchmark</span>
            </div>
          </div>

          {/* Diurnal Demand & Solar Duck Curve Visualization */}
          <div className="p-4 bg-city-surface-card rounded-2xl border border-city-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-city-muted mb-3">Diurnal Load Curve vs. Solar Duck Curve</h3>
            <div className="h-36 flex items-end justify-between space-x-2 pt-4 px-2 border-b border-city-border">
              {[
                { hour: '00:00', load: 45, solar: 0 },
                { hour: '03:00', load: 38, solar: 0 },
                { hour: '06:00', load: 52, solar: 10 },
                { hour: '09:00', load: 78, solar: 55 },
                { hour: '12:00', load: 92, solar: 95 },
                { hour: '15:00', load: 86, solar: 68 },
                { hour: '18:00', load: 98, solar: 15 },
                { hour: '21:00', load: 94, solar: 0 },
              ].map((slot, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center space-y-1">
                  <div className="w-full flex items-end justify-center space-x-1 h-24">
                    {/* Load bar */}
                    <div 
                      className="w-3 bg-city-ink/80 rounded-t"
                      style={{ height: `${slot.load}%` }}
                      title={`Load: ${slot.load}%`}
                    />
                    {/* Solar bar */}
                    <div 
                      className="w-3 bg-city-amber rounded-t"
                      style={{ height: `${slot.solar}%` }}
                      title={`Solar: ${slot.solar}%`}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-city-muted">{slot.hour}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-6 mt-3 text-xs">
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-city-ink/80" />
                <span className="text-city-muted">Municipal Grid Load (MW)</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-city-amber" />
                <span className="text-city-muted">Solar PV Feed (MW)</span>
              </span>
            </div>
          </div>

          {/* Substation Transformer Loading */}
          <div className="p-4 bg-city-surface-card rounded-2xl border border-city-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-city-muted mb-3">66kV / 11kV Substation Transformer Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {wards.map(ward => (
                <div key={ward.id} className="p-3 bg-city-bg rounded-xl border border-city-border flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-city-primary">{ward.id}</span>
                    <h4 className="font-semibold text-city-ink">{ward.name}</h4>
                    <span className="text-[10px] text-city-muted">{ward.powerDemandMW} MW / {ward.powerCapacityMW} MW</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-city-ink">{ward.transformerLoadPct}%</div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      ward.transformerLoadPct > 90 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {ward.transformerLoadPct > 90 ? 'CRITICAL THERMAL' : 'NOMINAL'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid Interventions & Battery Actions */}
          <div className="p-4 bg-city-bg rounded-2xl border border-city-border space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-city-ink">Grid Resilience Controls</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleToggleBESS}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  bessDischarging ? 'bg-city-success text-white' : 'bg-city-amber text-amber-950 hover:bg-amber-400'
                }`}
              >
                <BatteryCharging className="w-4 h-4" />
                <span>{bessDischarging ? 'BESS Discharging (25MW Active)' : 'Deploy 25MWh BESS Peak Shaving'}</span>
              </button>

              <button
                onClick={handleToggleLoadShedding}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  loadSheddingToggled ? 'bg-city-danger text-white' : 'bg-city-surface border border-city-border text-city-ink hover:border-city-danger'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>{loadSheddingToggled ? 'Deactivate Rolling Load Shedding' : 'Simulate Rotational Load Shedding'}</span>
              </button>
            </div>

            {actionMessage && (
              <div className="p-3 bg-amber-50 text-amber-900 text-xs rounded-xl border border-amber-200 flex items-center space-x-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>{actionMessage}</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
