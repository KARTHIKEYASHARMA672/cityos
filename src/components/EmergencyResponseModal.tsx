import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Siren, 
  Clock, 
  CheckCircle2, 
  Send, 
  ShieldAlert,
  Flame,
  Droplet,
  Car,
  Zap,
  Activity
} from 'lucide-react';
import { Incident, CityMetrics } from '../types/city';

interface EmergencyResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: Incident[];
  metrics: CityMetrics;
  onDispatchUnit: (incidentId: string, unitName: string) => void;
  onResolveIncident: (incidentId: string) => void;
}

export const EmergencyResponseModal: React.FC<EmergencyResponseModalProps> = ({
  isOpen,
  onClose,
  incidents,
  metrics,
  onDispatchUnit,
  onResolveIncident,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident>(incidents[0] || null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDispatch = (incidentId: string, unit: string) => {
    onDispatchUnit(incidentId, unit);
    setToastMessage(`Dispatched ${unit} with dynamic traffic green-corridor preemption.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResolve = (incidentId: string) => {
    onResolveIncident(incidentId);
    setToastMessage('Incident resolved and cleared from active municipal radar.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'FIRE': return <Flame className="w-4 h-4 text-red-600" />;
      case 'WATER': return <Droplet className="w-4 h-4 text-sky-600" />;
      case 'TRAFFIC': return <Car className="w-4 h-4 text-amber-600" />;
      case 'POWER': return <Zap className="w-4 h-4 text-amber-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-city-ink/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-city-surface border border-city-border rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-city-border bg-city-bg/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-city-danger text-white flex items-center justify-center shadow-sm">
              <Siren className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-city-ink">Emergency Response & Dispatch Command Center</h2>
              <p className="text-xs text-city-muted">Shortest path A* routing, dynamic congestion bypass & golden-hour countdown</p>
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
              <span className="text-[11px] text-city-muted font-medium">Active Incidents</span>
              <div className="text-2xl font-mono font-extrabold text-city-danger mt-1">
                {incidents.filter(i => i.status !== 'RESOLVED').length}
              </div>
              <span className="text-[10px] text-city-muted">Priority municipal alerts</span>
            </div>
            <div className="p-3.5 bg-city-bg rounded-2xl border border-city-border">
              <span className="text-[11px] text-city-muted font-medium">Avg Response ETA</span>
              <div className="text-2xl font-mono font-extrabold text-city-ink mt-1">
                {metrics.avgAmbulanceResponseMin} <span className="text-sm font-sans font-normal">min</span>
              </div>
              <span className="text-[10px] text-city-success font-medium">Target: &lt;8.0 min</span>
            </div>
            <div className="p-3.5 bg-city-bg rounded-2xl border border-city-border">
              <span className="text-[11px] text-city-muted font-medium">Trauma ICU Beds</span>
              <div className="text-2xl font-mono font-extrabold text-city-primary mt-1">
                {metrics.hospitalBedOccupancyPct}%
              </div>
              <span className="text-[10px] text-city-muted">Occupancy rate</span>
            </div>
            <div className="p-3.5 bg-city-bg rounded-2xl border border-city-border">
              <span className="text-[11px] text-city-muted font-medium">Green Corridor Status</span>
              <div className="text-2xl font-mono font-extrabold text-city-success mt-1">
                READY
              </div>
              <span className="text-[10px] text-city-muted">V2X Traffic Preemption</span>
            </div>
          </div>

          {/* Incident List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-city-muted">Live Infrastructure Incident Feed</h3>
            
            <div className="space-y-3">
              {incidents.map(inc => (
                <div 
                  key={inc.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    inc.status === 'RESOLVED' 
                      ? 'bg-city-bg/50 border-city-border opacity-60' 
                      : 'bg-city-surface-card border-city-border shadow-card'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-xl bg-city-bg border border-city-border mt-0.5">
                        {getCategoryIcon(inc.category)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-city-primary">{inc.id}</span>
                          <h4 className="text-sm font-bold text-city-ink">{inc.title}</h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            inc.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {inc.severity}
                          </span>
                        </div>
                        <p className="text-xs text-city-muted mt-1">{inc.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-[11px] text-city-muted">
                          <span>Ward: <strong className="text-city-ink">{inc.wardId}</strong></span>
                          <span>Location: <strong className="text-city-ink">{inc.locationName}</strong></span>
                          {inc.status === 'RESPONDING' && (
                            <span className="text-city-terracotta font-medium flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>ETA: {inc.responseEtaMin} min ({inc.dispatchedUnit})</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end md:self-center">
                      {inc.status !== 'RESOLVED' ? (
                        <>
                          <button
                            onClick={() => handleDispatch(inc.id, inc.category === 'FIRE' ? 'Fire Engine Tender F-12' : inc.category === 'WATER' ? 'Rapid Valve Van W-02' : 'Trauma Ambulance Unit 04')}
                            className="px-3 py-1.5 rounded-xl bg-city-danger text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-sm"
                          >
                            Dispatch Unit
                          </button>
                          <button
                            onClick={() => handleResolve(inc.id)}
                            className="px-3 py-1.5 rounded-xl bg-city-surface border border-city-border text-city-ink text-xs font-semibold hover:border-city-success hover:text-city-success transition-colors"
                          >
                            Mark Resolved
                          </button>
                        </>
                      ) : (
                        <span className="flex items-center space-x-1 text-xs text-city-success font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Cleared</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {toastMessage && (
            <div className="p-3 bg-red-50 text-red-900 text-xs rounded-xl border border-red-200 flex items-center space-x-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-red-700 flex-shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
