import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ThreeCityViewer } from './components/ThreeCityViewer';
import { NavigationHeader } from './components/NavigationHeader';
import { MetricCardsStrip } from './components/MetricCardsStrip';
import { ScenarioController } from './components/ScenarioController';
import { WardTelemetryDrawer } from './components/WardTelemetryDrawer';
import { TrafficCongestionModal } from './components/TrafficCongestionModal';
import { ElectricityGridModal } from './components/ElectricityGridModal';
import { WaterDistributionModal } from './components/WaterDistributionModal';
import { PollutionVisualizerModal } from './components/PollutionVisualizerModal';
import { EmergencyResponseModal } from './components/EmergencyResponseModal';
import { AIPlannerRecommendationsModal } from './components/AIPlannerRecommendationsModal';

import { CitySimulationEngine } from './services/citySimulationEngine';
import { 
  Ward, 
  CityMetrics, 
  Incident, 
  Recommendation, 
  VisualLayer, 
  CameraMode, 
  TimeOfDay, 
  ScenarioPreset 
} from './types/city';

export const App: React.FC = () => {
  const engine = useMemo(() => new CitySimulationEngine(), []);

  const [metrics, setMetrics] = useState<CityMetrics>(() => engine.stepSimulation(0));
  const [wards, setWards] = useState<Ward[]>(() => engine.getWards());
  const [incidents, setIncidents] = useState<Incident[]>(() => engine.getIncidents());
  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => engine.getRecommendations());
  
  const [activeLayer, setActiveLayer] = useState<VisualLayer>('ALL');
  const [cameraMode, setCameraMode] = useState<CameraMode>('TACTICAL_GOD_VIEW');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('NOON');
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [currentScenario, setCurrentScenario] = useState<ScenarioPreset>('NORMAL');

  // Modal open states
  const [isTrafficOpen, setIsTrafficOpen] = useState<boolean>(false);
  const [isPowerOpen, setIsPowerOpen] = useState<boolean>(false);
  const [isWaterOpen, setIsWaterOpen] = useState<boolean>(false);
  const [isPollutionOpen, setIsPollutionOpen] = useState<boolean>(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isAIPlannerOpen, setIsAIPlannerOpen] = useState<boolean>(false);

  // Auto-simulation interval ticker
  useEffect(() => {
    const interval = setInterval(() => {
      const nextMetrics = engine.stepSimulation(1.5);
      setMetrics(nextMetrics);
      setWards([...engine.getWards()]);
      setIncidents([...engine.getIncidents()]);
    }, 4000);

    return () => clearInterval(interval);
  }, [engine]);

  // Handler: Manual Step Simulation
  const handleStepSimulation = () => {
    const nextMetrics = engine.stepSimulation(15.0);
    setMetrics(nextMetrics);
    setWards([...engine.getWards()]);
    setIncidents([...engine.getIncidents()]);
  };

  // Handler: Select Scenario
  const handleSelectScenario = (scenario: ScenarioPreset) => {
    setCurrentScenario(scenario);
    engine.setScenario(scenario);
    const nextMetrics = engine.stepSimulation(0.1);
    setMetrics(nextMetrics);
    setWards([...engine.getWards()]);
  };

  // Handler: Focus Ward
  const handleFocusWard = (ward: Ward) => {
    setSelectedWard(ward);
    setCameraMode('WARD_TELEMETRY');
  };

  // Handler: Apply AI Recommendation
  const handleApplyRecommendation = (recId: string) => {
    engine.applyIntervention(recId);
    setRecommendations([...engine.getRecommendations()]);
    const nextMetrics = engine.stepSimulation(0.5);
    setMetrics(nextMetrics);
    setWards([...engine.getWards()]);
  };

  // Handler: Dispatch Emergency Unit
  const handleDispatchUnit = (incidentId: string, unitName: string) => {
    engine.dispatchEmergencyUnit(incidentId, unitName);
    setIncidents([...engine.getIncidents()]);
  };

  // Handler: Resolve Incident
  const handleResolveIncident = (incidentId: string) => {
    engine.resolveIncident(incidentId);
    setIncidents([...engine.getIncidents()]);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-city-bg select-none">
      
      {/* 1. Interactive 3D WebGL Digital Twin */}
      <ThreeCityViewer
        wards={wards}
        incidents={incidents}
        activeLayer={activeLayer}
        cameraMode={cameraMode}
        timeOfDay={timeOfDay}
        selectedWard={selectedWard}
        onSelectWard={(ward) => {
          setSelectedWard(ward);
          setCameraMode('WARD_TELEMETRY');
        }}
        onSelectIncident={(incident) => {
          setIsEmergencyOpen(true);
        }}
      />

      {/* 2. Top Navigation Bar */}
      <NavigationHeader
        metrics={metrics}
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
        cameraMode={cameraMode}
        setCameraMode={setCameraMode}
        timeOfDay={timeOfDay}
        setTimeOfDay={setTimeOfDay}
        onOpenTrafficModal={() => setIsTrafficOpen(true)}
        onOpenPowerModal={() => setIsPowerOpen(true)}
        onOpenWaterModal={() => setIsWaterOpen(true)}
        onOpenPollutionModal={() => setIsPollutionOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyOpen(true)}
        onOpenAIPlannerModal={() => setIsAIPlannerOpen(true)}
        onStepSimulation={handleStepSimulation}
      />

      {/* 3. Left Stress-Test Scenarios Controller */}
      <ScenarioController
        currentScenario={currentScenario}
        onSelectScenario={handleSelectScenario}
      />

      {/* 4. Right Ward Telemetry Drawer */}
      <WardTelemetryDrawer
        ward={selectedWard}
        onClose={() => setSelectedWard(null)}
        onFocusWard={handleFocusWard}
      />

      {/* 5. Bottom Floating KPI Metrics Strip */}
      <MetricCardsStrip
        metrics={metrics}
        onOpenTraffic={() => setIsTrafficOpen(true)}
        onOpenPower={() => setIsPowerOpen(true)}
        onOpenWater={() => setIsWaterOpen(true)}
        onOpenPollution={() => setIsPollutionOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
      />

      {/* 6. Modals for Deep Infrastructure Simulation */}
      <TrafficCongestionModal
        isOpen={isTrafficOpen}
        onClose={() => setIsTrafficOpen(false)}
        metrics={metrics}
        wards={wards}
        onApplyReversibleLane={() => handleApplyRecommendation('REC-01')}
      />

      <ElectricityGridModal
        isOpen={isPowerOpen}
        onClose={() => setIsPowerOpen(false)}
        metrics={metrics}
        wards={wards}
        onDeployBESS={() => handleApplyRecommendation('REC-02')}
      />

      <WaterDistributionModal
        isOpen={isWaterOpen}
        onClose={() => setIsWaterOpen(false)}
        metrics={metrics}
        wards={wards}
        onApplyPRVs={() => handleApplyRecommendation('REC-03')}
      />

      <PollutionVisualizerModal
        isOpen={isPollutionOpen}
        onClose={() => setIsPollutionOpen(false)}
        metrics={metrics}
        wards={wards}
        onApplyGreenBuffer={() => handleApplyRecommendation('REC-04')}
      />

      <EmergencyResponseModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        incidents={incidents}
        metrics={metrics}
        onDispatchUnit={handleDispatchUnit}
        onResolveIncident={handleResolveIncident}
      />

      <AIPlannerRecommendationsModal
        isOpen={isAIPlannerOpen}
        onClose={() => setIsAIPlannerOpen(false)}
        recommendations={recommendations}
        onApplyRecommendation={handleApplyRecommendation}
      />

    </div>
  );
};

export default App;
