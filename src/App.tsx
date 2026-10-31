import React, { useState } from 'react';
import { Airport3DCanvas } from './components/Airport3DCanvas';
import { AviationAtmosphere } from './components/AviationAtmosphere';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PredictionFormModal } from './components/PredictionFormModal';
import { CinematicLoadingScreen } from './components/CinematicLoadingScreen';
import { DashboardView } from './components/dashboard/DashboardView';
import { FlightExplorer } from './components/FlightExplorer';
import { DocumentationModal } from './components/DocumentationModal';
import { FlightRoute, WeatherTelemetry, OperationsTelemetry, PredictionResult } from './types';
import { FLIGHTS_DATABASE, WEATHER_PRESETS } from './data/flightsDatabase';
import { runClassicalMLPrediction } from './ml/engine';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'explorer'>('home');
  const [isPredictionModalOpen, setIsPredictionModalOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Active or Default Prediction Result
  const [predictionResult, setPredictionResult] = useState<PredictionResult>(() => {
    const defaultFlight = FLIGHTS_DATABASE[0]; // AI302
    const defaultPreset = WEATHER_PRESETS.THUNDERSTORM.data;
    const defaultWeather: WeatherTelemetry = {
      temperatureC: defaultPreset.temperatureC || 22,
      temperatureF: 72,
      humidity: defaultPreset.humidity || 94,
      windSpeedKnots: defaultPreset.windSpeedKnots || 28,
      windDirectionDeg: defaultPreset.windDirectionDeg || 240,
      visibilityMiles: defaultPreset.visibilityMiles || 1.8,
      rainMmPerHour: defaultPreset.rainMmPerHour || 28.5,
      snowCm: 0,
      barometricPressureHpa: 994,
      conditionName: 'Heavy Thunderstorm',
      isSevere: true,
    };
    const defaultOps: OperationsTelemetry = {
      airportCongestionIndex: 85,
      activeRunways: 4,
      departureQueueCount: 18,
      groundHoldMinutes: 15,
      isPeakHour: true,
      airTrafficFlowManagementDelay: 15,
    };
    return runClassicalMLPrediction(defaultFlight, defaultWeather, defaultOps, 'XGBoost (Ensemble)');
  });

  const [pendingPredictionData, setPendingPredictionData] = useState<{
    flight: FlightRoute;
    weather: WeatherTelemetry;
    ops: OperationsTelemetry;
    selectedModel: string;
  } | null>(null);

  const [targetFlightNumber, setTargetFlightNumber] = useState<string>('AI302');

  // Trigger from Form Modal
  const handleRunPrediction = (
    flight: FlightRoute,
    weather: WeatherTelemetry,
    ops: OperationsTelemetry,
    selectedModel: string
  ) => {
    setIsPredictionModalOpen(false);
    setPendingPredictionData({ flight, weather, ops, selectedModel });
    setIsLoading(true);
  };

  // Complete Loading Takeoff animation
  const handleLoadingComplete = () => {
    if (pendingPredictionData) {
      const res = runClassicalMLPrediction(
        pendingPredictionData.flight,
        pendingPredictionData.weather,
        pendingPredictionData.ops,
        pendingPredictionData.selectedModel
      );
      setPredictionResult(res);
    }
    setIsLoading(false);
    setCurrentView('dashboard');
  };

  // Quick Trigger from Schedule Explorer
  const handleSelectFromExplorer = (flight: FlightRoute) => {
    setTargetFlightNumber(flight.flightNumber);
    setIsPredictionModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#05070A] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* 1. Full-Screen Cinematic Airport Animation Background (Three.js 3D & 2D Canvas) */}
      <Airport3DCanvas />

      {/* 2. Aviation Atmosphere Layers (Radar scope, ATC audio, atmospheric clouds, particles) */}
      <AviationAtmosphere />

      {/* 3. Top Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenPredictionModal={() => setIsPredictionModalOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        hasResult={Boolean(predictionResult)}
      />

      {/* 4. Main Body Content Switcher */}
      <main className="relative z-10 flex-1">
        {currentView === 'home' && (
          <HeroSection
            onStartPrediction={() => setIsPredictionModalOpen(true)}
            onExploreML={() => setIsDocsOpen(true)}
            onExploreSchedule={() => setCurrentView('explorer')}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            result={predictionResult}
            onNewPrediction={() => setIsPredictionModalOpen(true)}
          />
        )}

        {currentView === 'explorer' && (
          <FlightExplorer onSelectFlightForPrediction={handleSelectFromExplorer} />
        )}
      </main>

      {/* 5. Interactive Prediction Modal */}
      <PredictionFormModal
        isOpen={isPredictionModalOpen}
        onClose={() => setIsPredictionModalOpen(false)}
        onRunPrediction={handleRunPrediction}
        initialFlightNumber={targetFlightNumber}
      />

      {/* 6. Cinematic Loading Screen (Jet acceleration & ML pipeline progress) */}
      {isLoading && pendingPredictionData && (
        <CinematicLoadingScreen
          flightNumber={pendingPredictionData.flight.flightNumber}
          airlineName={pendingPredictionData.flight.airlineName}
          onComplete={handleLoadingComplete}
        />
      )}

      {/* 7. ML Architecture & Documentation Modal */}
      <DocumentationModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
    </div>
  );
}
