import React from 'react';
import { 
  CloudRain, 
  SunMedium, 
  Sparkles, 
  AlertOctagon, 
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { ScenarioPreset } from '../types/city';

interface ScenarioControllerProps {
  currentScenario: ScenarioPreset;
  onSelectScenario: (scenario: ScenarioPreset) => void;
}

export const ScenarioController: React.FC<ScenarioControllerProps> = ({
  currentScenario,
  onSelectScenario,
}) => {
  const scenarios: { id: ScenarioPreset; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'NORMAL',
      label: 'Normal Baseline',
      icon: <SlidersHorizontal className="w-3.5 h-3.5" />,
      desc: 'Standard diurnal municipal conditions'
    },
    {
      id: 'MONSOON_FLOOD',
      label: 'Monsoon Flash Flood',
      icon: <CloudRain className="w-3.5 h-3.5 text-sky-600" />,
      desc: '42mm/hr rainfall, underpass waterlogging, +45% traffic delay'
    },
    {
      id: 'SUMMER_HEATWAVE',
      label: 'Summer Heatwave',
      icon: <SunMedium className="w-3.5 h-3.5 text-amber-600" />,
      desc: '41.5°C peak ambient temp, cooling AC electrical surge'
    },
    {
      id: 'FESTIVAL_RUSH',
      label: 'Festival / Diwali Rush',
      icon: <Sparkles className="w-3.5 h-3.5 text-orange-600" />,
      desc: 'Market crowd surge, AQI spike, high transit volume'
    },
    {
      id: 'METRO_BREAKDOWN',
      label: 'Metro Grid Breakdown',
      icon: <AlertOctagon className="w-3.5 h-3.5 text-red-600" />,
      desc: 'Viaduct power trip, 1.2M commuters divert to road network'
    }
  ];

  return (
    <div className="absolute top-20 left-4 z-20 pointer-events-auto">
      <div className="bg-city-surface/90 backdrop-blur-md p-2.5 rounded-2xl border border-city-border shadow-elevated w-64 space-y-2">
        <div className="flex items-center space-x-1.5 px-1 text-[11px] font-bold uppercase tracking-wider text-city-muted">
          <SlidersHorizontal className="w-3.5 h-3.5 text-city-primary" />
          <span>Stress-Test Scenarios</span>
        </div>

        <div className="space-y-1">
          {scenarios.map(sc => (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc.id)}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-semibold transition-all ${
                currentScenario === sc.id
                  ? 'bg-city-primary text-white shadow-sm'
                  : 'text-city-ink hover:bg-city-bg'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className={currentScenario === sc.id ? 'text-white' : ''}>
                  {sc.icon}
                </span>
                <div>
                  <div className="text-[11px] leading-tight font-bold">{sc.label}</div>
                  <div className={`text-[9px] line-clamp-1 ${
                    currentScenario === sc.id ? 'text-teal-100' : 'text-city-muted'
                  }`}>
                    {sc.desc}
                  </div>
                </div>
              </div>
              {currentScenario === sc.id && (
                <Check className="w-3.5 h-3.5 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
