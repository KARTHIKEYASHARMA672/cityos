import React, { useState } from 'react';
import { 
  X, 
  Droplet, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Truck, 
  Waves,
  Filter
} from 'lucide-react';
import { Ward, CityMetrics } from '../types/city';

interface WaterDistributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: CityMetrics;
  wards: Ward[];
  onApplyPRVs: () => void;
}

export const WaterDistributionModal: React.FC<WaterDistributionModalProps> = ({
  isOpen,
  onClose,
  metrics,
  wards,
  onApplyPRVs,
}) => {
  const [tankersDispatched, setTankersDispatched] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDispatchTankers = () => {
    setTankersDispatched(prev => prev + 12);
    setToastMessage('Dispatched 12 Municipal Water Tankers (120,000L) to dry wards.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOptimizePRVs = () => {
    onApplyPRVs();
    setToastMessage('District Metered Area (DMA) Smart Pressure Reducing Valves calibrated.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-city-ink/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-city-surface border border-city-border rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-city-border bg-city-bg/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-city-water text-white flex items-center justify-center shadow-sm">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-city-ink">Water Hydraulics & Distribution Simulation</h2>
              <p className="text-xs text-city-muted">Hardy-Cross loop pressure solver, non-revenue leakage & tanker dispatch</p>
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
              <span className="text-[11px] text-city-muted font-medium">Reservoir Storage</span>
              <div className="text-2xl font-mono font-extrabold text-city-water mt-1">
                {metrics.totalReservoirLevelPct}%
              </div>
              <span className="text-[10px] text-city-muted">City Raw Water Reservoir</span>
            </div>
            <div className="p-3.5 bg-city-bg rounded-2xl border border-city-border">
              <span className="text-[11px] text-city-muted font-medium">Daily Supply</span>
              <div className="text-2xl font-mono font-extrabold text-city-ink mt-1">
                {metrics.totalWaterSupplyMLD} <span className="text-sm font-sans font-normal">MLD</span>
              </div>
              <span className="text-[10px] text-city-muted">Million Liters per Day</span>
            </div>
            <div className="p-3.5 bg-city-bg rounded-2xl border border-city-border">
              <span className="text-[11px] text-city-muted font-medium">NRW Leakage Loss</span>
              <div className="text-2xl font-mono font-extrabold text-city-danger mt-1">
                {metrics.nonRevenueWaterLossPct}%
              </div>
              <span className="text-[10px] text-city-danger font-medium">Unbilled pipe seepage</span>
            </div>
            <div className="p-3.5 bg-city-bg rounded-2xl border border-city-border">
              <span className="text-[11px] text-city-muted font-medium">Active Booster Pumps</span>
              <div className="text-2xl font-mono font-extrabold text-city-primary mt-1">
                {metrics.pumpingStationsActive}
              </div>
              <span className="text-[10px] text-city-muted">High-head WTP pumps</span>
            </div>
          </div>

          {/* Ward Pipeline Pressure Gradients */}
          <div className="p-4 bg-city-surface-card rounded-2xl border border-city-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-city-muted mb-3">Ward Distribution Pressure Gradients & Head Loss</h3>
            <div className="space-y-3 text-xs">
              {wards.map(ward => (
                <div key={ward.id} className="p-3 bg-city-bg rounded-xl border border-city-border flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-city-primary">{ward.id}</span>
                    <span className="font-semibold text-city-ink">{ward.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-[11px] text-city-muted">
                      Demand: <span className="font-mono font-medium text-city-ink">{ward.waterDemandMLD} MLD</span>
                    </div>
                    <div className="text-[11px] text-city-muted">
                      Delivered: <span className="font-mono font-medium text-city-water">{ward.waterDeliveredMLD} MLD</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono font-bold text-city-ink">{ward.pipelinePressureBar} bar</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        ward.pipelinePressureBar < 2.5 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {ward.pipelinePressureBar < 2.5 ? 'LOW HEAD' : 'OPTIMAL'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Water Management Actions */}
          <div className="p-4 bg-city-bg rounded-2xl border border-city-border space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-city-ink">Hydraulic Interventions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleOptimizePRVs}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-city-water text-white text-xs font-bold hover:bg-sky-600 shadow-sm transition-all"
              >
                <Filter className="w-4 h-4" />
                <span>Calibrate Smart Pressure Valves (Save 28 MLD)</span>
              </button>

              <button
                onClick={handleDispatchTankers}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-city-surface border border-city-border text-city-ink text-xs font-bold hover:border-city-water transition-all"
              >
                <Truck className="w-4 h-4 text-city-water" />
                <span>Emergency Water Tanker Fleet ({tankersDispatched} Dispatched)</span>
              </button>
            </div>

            {toastMessage && (
              <div className="p-3 bg-sky-50 text-sky-900 text-xs rounded-xl border border-sky-200 flex items-center space-x-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>{toastMessage}</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
