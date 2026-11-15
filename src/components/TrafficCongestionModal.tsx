import React, { useState } from 'react';
import { 
  X, 
  Gauge, 
  Car, 
  Bus, 
  Bike, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  TrendingDown,
  Navigation
} from 'lucide-react';
import { Ward, CityMetrics } from '../types/city';

interface TrafficCongestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: CityMetrics;
  wards: Ward[];
  onApplyReversibleLane: () => void;
}

export const TrafficCongestionModal: React.FC<TrafficCongestionModalProps> = ({
  isOpen,
  onClose,
  metrics,
  wards,
  onApplyReversibleLane,
}) => {
  const [signalCycleSeconds, setSignalCycleSeconds] = useState<number>(120);
  const [busPriorityEnabled, setBusPriorityEnabled] = useState<boolean>(true);
  const [oddEvenRuleEnabled, setOddEvenRuleEnabled] = useState<boolean>(false);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplySignalTuning = () => {
    setAppliedNotification('Signal cycle optimized across 28 intersection micro-controllers.');
    setTimeout(() => setAppliedNotification(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-city-ink/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-city-surface border border-city-border rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-city-border bg-city-bg/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-city-terracotta text-white flex items-center justify-center shadow-sm">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-city-ink">Traffic Congestion & Arterial Mobility Simulation</h2>
              <p className="text-xs text-city-muted">BPR Delay curves, cell transmission macro-flow & signal synchronization</p>
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
              <span className="text-[11px] text-city-muted font-medium">City Congestion</span>
              <div className="text-2xl font-mono font-extrabold text-city-terracotta mt-1">
                {metrics.cityCongestionIndexPct}%
              </div>
              <span className="text-[10px] text-city-muted">Peak rush threshold: 65%</span>
            </div>
            <div className="p-3.5 bg-city-bg rounded-2xl border border-city-border">
              <span className="text-[11px] text-city-muted font-medium">Avg Vehicle Speed</span>
              <div className="text-2xl font-mono font-extrabold text-city-ink mt-1">
                {metrics.avgVehicleSpeedKMH} <span className="text-sm font-sans font-normal">km/h</span>
              </div>
              <span className="text-[10px] text-city-success font-medium">Free flow: 52 km/h</span>
            </div>
            <div className="p-3.5 bg-city-bg rounded-2xl border border-city-border">
              <span className="text-[11px] text-city-muted font-medium">Active Metro Trains</span>
              <div className="text-2xl font-mono font-extrabold text-city-primary mt-1">
                {metrics.activeMetroTrains}
              </div>
              <span className="text-[10px] text-city-muted">Namma Metro Purple/Green</span>
            </div>
            <div className="p-3.5 bg-city-bg rounded-2xl border border-city-border">
              <span className="text-[11px] text-city-muted font-medium">Critical Choke Points</span>
              <div className="text-2xl font-mono font-extrabold text-city-danger mt-1">
                {metrics.chokePointsCount}
              </div>
              <span className="text-[10px] text-city-danger font-medium">Level of Service (LOS) F</span>
            </div>
          </div>

          {/* Modal Split Distribution */}
          <div className="p-4 bg-city-surface-card rounded-2xl border border-city-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-city-muted mb-3">Indian Urban Modal Split Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-city-bg rounded-xl border border-city-border">
                <div className="flex items-center justify-center space-x-1.5 text-xs font-semibold text-emerald-800 mb-1">
                  <Bus className="w-4 h-4 text-emerald-700" />
                  <span>Public Bus (BMTC)</span>
                </div>
                <div className="text-xl font-mono font-bold text-city-ink">34%</div>
                <span className="text-[10px] text-city-muted">1.2M daily riders</span>
              </div>
              <div className="p-3 bg-city-bg rounded-xl border border-city-border">
                <div className="flex items-center justify-center space-x-1.5 text-xs font-semibold text-amber-800 mb-1">
                  <Car className="w-4 h-4 text-amber-700" />
                  <span>Auto-Rickshaws</span>
                </div>
                <div className="text-xl font-mono font-bold text-city-ink">22%</div>
                <span className="text-[10px] text-city-muted">42,000 active permits</span>
              </div>
              <div className="p-3 bg-city-bg rounded-xl border border-city-border">
                <div className="flex items-center justify-center space-x-1.5 text-xs font-semibold text-blue-800 mb-1">
                  <Bike className="w-4 h-4 text-blue-700" />
                  <span>Two-Wheelers</span>
                </div>
                <div className="text-xl font-mono font-bold text-city-ink">28%</div>
                <span className="text-[10px] text-city-muted">Fast lane-filtering</span>
              </div>
              <div className="p-3 bg-city-bg rounded-xl border border-city-border">
                <div className="flex items-center justify-center space-x-1.5 text-xs font-semibold text-purple-800 mb-1">
                  <Car className="w-4 h-4 text-purple-700" />
                  <span>Private Cabs/Cars</span>
                </div>
                <div className="text-xl font-mono font-bold text-city-ink">16%</div>
                <span className="text-[10px] text-city-muted">High road footprint</span>
              </div>
            </div>
          </div>

          {/* Choke Points & Ward Density Table */}
          <div className="p-4 bg-city-surface-card rounded-2xl border border-city-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-city-muted mb-3">Ward Corridor Congestion & Level of Service</h3>
            <div className="divide-y divide-city-border text-xs">
              {wards.map(ward => (
                <div key={ward.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-city-primary">{ward.id}</span>
                    <span className="font-semibold text-city-ink">{ward.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-city-bg h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          ward.trafficDensityPct > 80 ? 'bg-city-danger' : ward.trafficDensityPct > 60 ? 'bg-city-terracotta' : 'bg-city-success'
                        }`}
                        style={{ width: `${ward.trafficDensityPct}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold w-12 text-right">{ward.trafficDensityPct}%</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ward.trafficDensityPct > 80 ? 'bg-red-100 text-red-800' : ward.trafficDensityPct > 60 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      LOS {ward.trafficDensityPct > 80 ? 'F' : ward.trafficDensityPct > 65 ? 'E' : ward.trafficDensityPct > 50 ? 'C' : 'A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-Time Signal Tuning Controls */}
          <div className="p-4 bg-city-bg rounded-2xl border border-city-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-city-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-city-ink">Adaptive Signal Optimization Controls</h3>
              </div>
              <span className="text-xs text-city-muted font-mono">{signalCycleSeconds}s Cycle</span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-city-muted mb-1">
                <span>Adaptive Traffic Signal Cycle Length</span>
                <span className="font-mono">{signalCycleSeconds} seconds</span>
              </div>
              <input 
                type="range" 
                min={60} 
                max={180} 
                value={signalCycleSeconds} 
                onChange={e => setSignalCycleSeconds(Number(e.target.value))}
                className="w-full accent-city-primary cursor-pointer"
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onApplyReversibleLane}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-city-primary text-white text-xs font-bold hover:bg-city-primary-hover shadow-sm transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Simulate Dynamic Reversible Lane</span>
              </button>

              <button
                onClick={handleApplySignalTuning}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-city-surface border border-city-border text-city-ink text-xs font-semibold hover:border-city-primary transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-city-primary" />
                <span>Apply Signal Timing Optimization</span>
              </button>
            </div>

            {appliedNotification && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center space-x-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{appliedNotification}</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
