import React, { useState } from 'react';
import { Sliders, RefreshCw, CloudRain, Wind, Eye, Snowflake, Activity, Zap, TrendingUp, Sparkles } from 'lucide-react';
import { FlightRoute, WeatherTelemetry, OperationsTelemetry, PredictionResult } from '../../types';
import { runClassicalMLPrediction } from '../../ml/engine';

interface WhatIfSimulatorProps {
  initialResult: PredictionResult;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ initialResult }) => {
  const [rainRate, setRainRate] = useState<number>(initialResult.weather.rainMmPerHour);
  const [windSpeed, setWindSpeed] = useState<number>(initialResult.weather.windSpeedKnots);
  const [visibility, setVisibility] = useState<number>(initialResult.weather.visibilityMiles);
  const [snowCm, setSnowCm] = useState<number>(initialResult.weather.snowCm);
  const [congestion, setCongestion] = useState<number>(initialResult.operations.airportCongestionIndex);
  const [queueCount, setQueueCount] = useState<number>(initialResult.operations.departureQueueCount);
  const [isPeak, setIsPeak] = useState<boolean>(initialResult.operations.isPeakHour);

  // Live Real-Time ML Model Re-evaluation
  const simulatedWeather: WeatherTelemetry = {
    ...initialResult.weather,
    rainMmPerHour: rainRate,
    windSpeedKnots: windSpeed,
    visibilityMiles: visibility,
    snowCm: snowCm,
    conditionName:
      snowCm > 3
        ? 'Blizzard / Snow'
        : rainRate > 15
        ? 'Heavy Thunderstorm'
        : windSpeed > 25
        ? 'High Wind Gale'
        : visibility < 1.0
        ? 'Heavy Fog'
        : 'Clear',
  };

  const simulatedOps: OperationsTelemetry = {
    ...initialResult.operations,
    airportCongestionIndex: congestion,
    departureQueueCount: queueCount,
    isPeakHour: isPeak,
    groundHoldMinutes: Math.round(congestion * 0.25 + queueCount * 0.8),
  };

  const liveResult = runClassicalMLPrediction(
    initialResult.flight,
    simulatedWeather,
    simulatedOps,
    initialResult.selectedModel
  );

  const deltaProb = liveResult.delayProbability - initialResult.delayProbability;
  const deltaMins = liveResult.expectedDelayMinutes - initialResult.expectedDelayMinutes;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase">
              <Sliders className="w-4 h-4 text-sky-400" />
              <span>Real-Time What-If Sensitivity Simulator</span>
            </div>
            <h2 className="text-xl font-bold text-white font-display mt-1">
              Dynamic Sensitivity & Counterfactual Analysis
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tweak meteorological and airport constraints to witness live XGBoost inference in real time.
            </p>
          </div>

          <button
            onClick={() => {
              setRainRate(0);
              setWindSpeed(8);
              setVisibility(10);
              setSnowCm(0);
              setCongestion(40);
              setQueueCount(4);
              setIsPeak(false);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Optimal VFR</span>
          </button>
        </div>

        {/* Live Simulator Comparison Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div>
            <span className="text-xs font-mono text-slate-400 block">SIMULATED STATUS</span>
            <span
              className={`text-xl font-extrabold font-display mt-1 inline-block ${
                liveResult.status === 'ON_TIME'
                  ? 'text-emerald-400'
                  : liveResult.status === 'MINOR_DELAY'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {liveResult.statusLabel}
            </span>
          </div>

          <div>
            <span className="text-xs font-mono text-slate-400 block">DELAY PROBABILITY</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold font-display text-white">{liveResult.delayProbability}%</span>
              {deltaProb !== 0 && (
                <span
                  className={`text-xs font-mono font-bold ${
                    deltaProb > 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  ({deltaProb > 0 ? `+${deltaProb}%` : `${deltaProb}%`})
                </span>
              )}
            </div>
          </div>

          <div>
            <span className="text-xs font-mono text-slate-400 block">EXPECTED DELAY TIME</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold font-display text-white">
                {liveResult.expectedDelayMinutes} min
              </span>
              {deltaMins !== 0 && (
                <span
                  className={`text-xs font-mono font-bold ${
                    deltaMins > 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  ({deltaMins > 0 ? `+${deltaMins}m` : `${deltaMins}m`})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Real-time Interactive Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-3">
          {/* Rain Rate Slider */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-blue-400" /> Rain Rate:
              </span>
              <span className="text-sky-300 font-bold">{rainRate.toFixed(1)} mm/h</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="0.5"
              value={rainRate}
              onChange={(e) => setRainRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          {/* Wind Speed Slider */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-teal-400" /> Wind Velocity:
              </span>
              <span className="text-teal-300 font-bold">{windSpeed} Knots</span>
            </div>
            <input
              type="range"
              min="0"
              max="55"
              step="1"
              value={windSpeed}
              onChange={(e) => setWindSpeed(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>

          {/* Visibility Slider */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-amber-400" /> Visibility (RVR):
              </span>
              <span className="text-amber-300 font-bold">{visibility.toFixed(1)} SM</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={visibility}
              onChange={(e) => setVisibility(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Snow Slider */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Snowflake className="w-4 h-4 text-indigo-400" /> Snow Depth:
              </span>
              <span className="text-indigo-300 font-bold">{snowCm.toFixed(1)} cm</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="0.5"
              value={snowCm}
              onChange={(e) => setSnowCm(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Airport Congestion Slider */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" /> Airport Congestion:
              </span>
              <span className="text-emerald-300 font-bold">{congestion}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={congestion}
              onChange={(e) => setCongestion(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Queue Count Slider */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-sky-400" /> Taxi Queue Count:
              </span>
              <span className="text-sky-300 font-bold">{queueCount} planes</span>
            </div>
            <input
              type="range"
              min="1"
              max="35"
              value={queueCount}
              onChange={(e) => setQueueCount(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
