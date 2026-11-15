import React from 'react';
import { 
  Building2, 
  Eye, 
  Sun, 
  Sunrise, 
  Sunset, 
  Moon, 
  Compass, 
  Video, 
  MapPin, 
  Layers, 
  Zap, 
  Droplet, 
  Wind, 
  AlertTriangle, 
  Sparkles,
  RefreshCw,
  Gauge
} from 'lucide-react';
import { VisualLayer, CameraMode, TimeOfDay, CityMetrics } from '../types/city';

interface NavigationHeaderProps {
  metrics: CityMetrics;
  activeLayer: VisualLayer;
  setActiveLayer: (layer: VisualLayer) => void;
  cameraMode: CameraMode;
  setCameraMode: (mode: CameraMode) => void;
  timeOfDay: TimeOfDay;
  setTimeOfDay: (time: TimeOfDay) => void;
  onOpenTrafficModal: () => void;
  onOpenPowerModal: () => void;
  onOpenWaterModal: () => void;
  onOpenPollutionModal: () => void;
  onOpenEmergencyModal: () => void;
  onOpenAIPlannerModal: () => void;
  onStepSimulation: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  metrics,
  activeLayer,
  setActiveLayer,
  cameraMode,
  setCameraMode,
  timeOfDay,
  setTimeOfDay,
  onOpenTrafficModal,
  onOpenPowerModal,
  onOpenWaterModal,
  onOpenPollutionModal,
  onOpenEmergencyModal,
  onOpenAIPlannerModal,
  onStepSimulation,
}) => {
  return (
    <header className="absolute top-3 left-3 right-3 z-30 pointer-events-none">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
        
        {/* Left Branding & Live Clock */}
        <div className="pointer-events-auto flex items-center space-x-3 bg-city-surface/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-city-border shadow-elevated">
          <div className="w-10 h-10 rounded-xl bg-city-primary flex items-center justify-center text-white shadow-sm">
            <Building2 className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-tight text-city-ink text-base">CITYOS</span>
              <span className="bg-city-terracotta/10 text-city-terracotta text-[10px] font-bold px-2 py-0.5 rounded-md border border-city-terracotta/20">
                INDIA DIGITAL TWIN
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-city-muted">
              <span>Indraprastha Megacity</span>
              <span>•</span>
              <span className="font-mono font-medium text-city-ink">{metrics.timestamp}</span>
              <span>•</span>
              <span className="text-[11px] text-city-primary font-medium">{metrics.currentWeather}</span>
            </div>
          </div>
        </div>

        {/* Center: Layer Selector & Camera Switcher */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 bg-city-surface/90 backdrop-blur-md p-1.5 rounded-2xl border border-city-border shadow-elevated">
          
          {/* Layer Pills */}
          <div className="flex items-center space-x-1 border-r border-city-border pr-2 mr-1">
            <button
              onClick={() => setActiveLayer('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeLayer === 'ALL'
                  ? 'bg-city-primary text-white shadow-sm'
                  : 'text-city-muted hover:text-city-ink hover:bg-city-bg'
              }`}
            >
              All Layers
            </button>
            <button
              onClick={() => setActiveLayer('TRAFFIC')}
              className={`p-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all ${
                activeLayer === 'TRAFFIC'
                  ? 'bg-city-terracotta text-white shadow-sm'
                  : 'text-city-muted hover:text-city-ink hover:bg-city-bg'
              }`}
              title="Traffic Layer"
            >
              <Gauge className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveLayer('POWER')}
              className={`p-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all ${
                activeLayer === 'POWER'
                  ? 'bg-city-amber text-white shadow-sm'
                  : 'text-city-muted hover:text-city-ink hover:bg-city-bg'
              }`}
              title="Power Grid Layer"
            >
              <Zap className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveLayer('WATER')}
              className={`p-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all ${
                activeLayer === 'WATER'
                  ? 'bg-city-water text-white shadow-sm'
                  : 'text-city-muted hover:text-city-ink hover:bg-city-bg'
              }`}
              title="Water Distribution Layer"
            >
              <Droplet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveLayer('AQI')}
              className={`p-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all ${
                activeLayer === 'AQI'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'text-city-muted hover:text-city-ink hover:bg-city-bg'
              }`}
              title="Pollution AQI Layer"
            >
              <Wind className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveLayer('EMERGENCY')}
              className={`p-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all ${
                activeLayer === 'EMERGENCY'
                  ? 'bg-city-danger text-white shadow-sm'
                  : 'text-city-muted hover:text-city-ink hover:bg-city-bg'
              }`}
              title="Emergency Layer"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          </div>

          {/* Camera Modes */}
          <div className="flex items-center space-x-1 border-r border-city-border pr-2 mr-1">
            <button
              onClick={() => setCameraMode('TACTICAL_GOD_VIEW')}
              className={`p-1.5 rounded-xl text-xs transition-all ${
                cameraMode === 'TACTICAL_GOD_VIEW'
                  ? 'bg-city-ink text-white'
                  : 'text-city-muted hover:text-city-ink hover:bg-city-bg'
              }`}
              title="Tactical God-View"
            >
              <Compass className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCameraMode('FLYOVER_DRONE')}
              className={`p-1.5 rounded-xl text-xs transition-all ${
                cameraMode === 'FLYOVER_DRONE'
                  ? 'bg-city-ink text-white'
                  : 'text-city-muted hover:text-city-ink hover:bg-city-bg'
              }`}
              title="Flyover Drone Orbit"
            >
              <Video className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCameraMode('GROUND_PATROL')}
              className={`p-1.5 rounded-xl text-xs transition-all ${
                cameraMode === 'GROUND_PATROL'
                  ? 'bg-city-ink text-white'
                  : 'text-city-muted hover:text-city-ink hover:bg-city-bg'
              }`}
              title="Ground Street Patrol"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Time of Day */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setTimeOfDay('DAWN')}
              className={`p-1.5 rounded-xl text-xs transition-all ${
                timeOfDay === 'DAWN' ? 'bg-orange-500 text-white' : 'text-city-muted hover:bg-city-bg'
              }`}
              title="Dawn (Morning Mist)"
            >
              <Sunrise className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTimeOfDay('NOON')}
              className={`p-1.5 rounded-xl text-xs transition-all ${
                timeOfDay === 'NOON' ? 'bg-amber-500 text-white' : 'text-city-muted hover:bg-city-bg'
              }`}
              title="Noon (High Sun)"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTimeOfDay('DUSK')}
              className={`p-1.5 rounded-xl text-xs transition-all ${
                timeOfDay === 'DUSK' ? 'bg-city-terracotta text-white' : 'text-city-muted hover:bg-city-bg'
              }`}
              title="Dusk (Golden Hour)"
            >
              <Sunset className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTimeOfDay('NIGHT')}
              className={`p-1.5 rounded-xl text-xs transition-all ${
                timeOfDay === 'NIGHT' ? 'bg-slate-800 text-white' : 'text-city-muted hover:bg-city-bg'
              }`}
              title="Night (City Lights)"
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right: Simulation Step & AI Recommendations Button */}
        <div className="pointer-events-auto flex items-center space-x-2">
          <button
            onClick={onStepSimulation}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-city-surface/90 backdrop-blur-md border border-city-border text-xs font-semibold text-city-ink hover:bg-city-bg hover:border-city-primary transition-all shadow-card"
          >
            <RefreshCw className="w-3.5 h-3.5 text-city-primary" />
            <span>Step +15m</span>
          </button>

          <button
            onClick={onOpenAIPlannerModal}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-city-primary text-white text-xs font-bold shadow-elevated hover:bg-city-primary-hover transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI City Planning</span>
          </button>
        </div>

      </div>
    </header>
  );
};
