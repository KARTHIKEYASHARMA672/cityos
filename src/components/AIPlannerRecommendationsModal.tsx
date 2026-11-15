import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  IndianRupee, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Droplet,
  Car,
  Wind
} from 'lucide-react';
import { Recommendation } from '../types/city';

interface AIPlannerRecommendationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendations: Recommendation[];
  onApplyRecommendation: (recId: string) => void;
}

export const AIPlannerRecommendationsModal: React.FC<AIPlannerRecommendationsModalProps> = ({
  isOpen,
  onClose,
  recommendations,
  onApplyRecommendation,
}) => {
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulate = (recId: string, title: string) => {
    onApplyRecommendation(recId);
    setSuccessToast(`Simulating "${title}". Real-time operational deltas applied across 3D city telemetry!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-city-ink/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-city-surface border border-city-border rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-city-border bg-city-bg/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-city-primary text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-city-ink">AI City Planning & Infrastructure Intelligence</h2>
              <p className="text-xs text-city-muted">Autonomous capital expenditure optimization, multi-objective ROI & live intervention sandbox</p>
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
          
          {/* Overview Banner */}
          <div className="p-4 bg-gradient-to-r from-teal-900 to-city-ink text-white rounded-2xl shadow-elevated flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Municipal Masterplan AI Diagnostic</span>
              </div>
              <h3 className="text-base font-extrabold">Autonomous Cross-Domain Intervention Portfolio</h3>
              <p className="text-xs text-teal-100/80 mt-1 max-w-xl">
                The AI planner evaluates bottlenecks across traffic, power transformers, water leakages, and air quality to compute optimal capital investments with verified payback periods.
              </p>
            </div>
            <div className="flex items-center space-x-4 border-t md:border-t-0 md:border-l border-teal-700/50 pt-3 md:pt-0 md:pl-4 text-center">
              <div>
                <span className="text-[10px] text-teal-200">Total Capex</span>
                <div className="text-lg font-mono font-bold text-amber-300">₹240 Cr</div>
              </div>
              <div>
                <span className="text-[10px] text-teal-200">Avg ROI</span>
                <div className="text-lg font-mono font-bold text-emerald-300">9.1 / 10</div>
              </div>
            </div>
          </div>

          {/* Recommendations List */}
          <div className="space-y-4">
            {recommendations.map(rec => (
              <div 
                key={rec.id}
                className="p-5 bg-city-surface-card rounded-2xl border border-city-border shadow-card hover:border-city-primary transition-all space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono text-xs font-extrabold text-city-primary bg-city-bg px-2 py-0.5 rounded border border-city-border">
                      {rec.id}
                    </span>
                    <h4 className="text-sm font-bold text-city-ink">{rec.title}</h4>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-city-muted font-medium">
                      Capex: <strong className="text-city-ink font-mono">₹{rec.capexInrCrores} Cr</strong>
                    </span>
                    <span className="text-city-muted font-medium">
                      Timeline: <strong className="text-city-ink font-mono">{rec.timelineMonths}m</strong>
                    </span>
                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                      ROI {rec.roiScore}/10
                    </span>
                  </div>
                </div>

                <p className="text-xs text-city-muted leading-relaxed">{rec.description}</p>

                {/* Impact Tags & Action Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-city-border">
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    {Object.entries(rec.impact).map(([key, val]) => (
                      <span key={key} className="bg-city-bg px-2.5 py-1 rounded-lg text-city-ink border border-city-border font-medium">
                        {key.replace(/_/g, ' ')}: <strong className="text-city-primary font-mono">{val}</strong>
                      </span>
                    ))}
                  </div>

                  <div>
                    {rec.status === 'SIMULATED' ? (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Scenario Simulated</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSimulate(rec.id, rec.title)}
                        className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-city-primary text-white hover:bg-city-primary-hover rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        <span>Simulate Intervention</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {successToast && (
            <div className="p-3 bg-emerald-50 text-emerald-900 text-xs rounded-xl border border-emerald-200 flex items-center space-x-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
