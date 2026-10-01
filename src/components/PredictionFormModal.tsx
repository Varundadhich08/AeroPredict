import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plane,
  Search,
  CloudRain,
  Wind,
  Thermometer,
  Eye,
  Snowflake,
  Activity,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { FlightRoute, WeatherTelemetry, OperationsTelemetry } from '../types';
import { FLIGHTS_DATABASE, AIRPORTS, AIRLINES, WEATHER_PRESETS } from '../data/flightsDatabase';

interface PredictionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunPrediction: (
    flight: FlightRoute,
    weather: WeatherTelemetry,
    ops: OperationsTelemetry,
    selectedModel: string
  ) => void;
  initialFlightNumber?: string;
}

export const PredictionFormModal: React.FC<PredictionFormModalProps> = ({
  isOpen,
  onClose,
  onRunPrediction,
  initialFlightNumber = 'AI302',
}) => {
  // Flight selection state
  const [searchQuery, setSearchQuery] = useState(initialFlightNumber);
  const [selectedFlight, setSelectedFlight] = useState<FlightRoute>(
    FLIGHTS_DATABASE.find((f) => f.flightNumber === initialFlightNumber) || FLIGHTS_DATABASE[0]
  );
  const [departureDate, setDepartureDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Weather Telemetry State
  const [weatherPreset, setWeatherPreset] = useState<string>('THUNDERSTORM');
  const [temperatureC, setTemperatureC] = useState<number>(22);
  const [humidity, setHumidity] = useState<number>(94);
  const [windSpeedKnots, setWindSpeedKnots] = useState<number>(28);
  const [windDirectionDeg, setWindDirectionDeg] = useState<number>(240);
  const [visibilityMiles, setVisibilityMiles] = useState<number>(1.8);
  const [rainMmPerHour, setRainMmPerHour] = useState<number>(28.5);
  const [snowCm, setSnowCm] = useState<number>(0);
  const [conditionName, setConditionName] = useState<WeatherTelemetry['conditionName']>('Heavy Thunderstorm');

  // Operations Telemetry State
  const [airportCongestionIndex, setAirportCongestionIndex] = useState<number>(85);
  const [activeRunways, setActiveRunways] = useState<number>(selectedFlight.origin.runways);
  const [departureQueueCount, setDepartureQueueCount] = useState<number>(18);
  const [groundHoldMinutes, setGroundHoldMinutes] = useState<number>(15);
  const [isPeakHour, setIsPeakHour] = useState<boolean>(true);

  // Model selection
  const [selectedModel, setSelectedModel] = useState<string>('XGBoost Ensemble');

  // Filtered flights for dropdown auto-suggest
  const matchingFlights = FLIGHTS_DATABASE.filter(
    (f) =>
      f.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.airlineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.origin.iata.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.destination.iata.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // When initialFlightNumber updates
  useEffect(() => {
    if (initialFlightNumber) {
      const match = FLIGHTS_DATABASE.find((f) => f.flightNumber === initialFlightNumber);
      if (match) {
        setSelectedFlight(match);
        setSearchQuery(match.flightNumber);
        setActiveRunways(match.origin.runways);
        setAirportCongestionIndex(match.origin.congestionIndex);
      }
    }
  }, [initialFlightNumber]);

  // Apply Weather Preset handler
  const handleApplyPreset = (presetKey: string) => {
    setWeatherPreset(presetKey);
    const preset = WEATHER_PRESETS[presetKey];
    if (preset && preset.data) {
      if (preset.data.temperatureC !== undefined) setTemperatureC(preset.data.temperatureC);
      if (preset.data.humidity !== undefined) setHumidity(preset.data.humidity);
      if (preset.data.windSpeedKnots !== undefined) setWindSpeedKnots(preset.data.windSpeedKnots);
      if (preset.data.windDirectionDeg !== undefined) setWindDirectionDeg(preset.data.windDirectionDeg);
      if (preset.data.visibilityMiles !== undefined) setVisibilityMiles(preset.data.visibilityMiles);
      if (preset.data.rainMmPerHour !== undefined) setRainMmPerHour(preset.data.rainMmPerHour);
      if (preset.data.snowCm !== undefined) setSnowCm(preset.data.snowCm);
      if (preset.data.conditionName) setConditionName(preset.data.conditionName);
    }
  };

  const handleSelectFlight = (flight: FlightRoute) => {
    setSelectedFlight(flight);
    setSearchQuery(flight.flightNumber);
    setActiveRunways(flight.origin.runways);
    setAirportCongestionIndex(flight.origin.congestionIndex);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const weatherData: WeatherTelemetry = {
      temperatureC,
      temperatureF: Math.round((temperatureC * 9) / 5 + 32),
      humidity,
      windSpeedKnots,
      windDirectionDeg,
      visibilityMiles,
      rainMmPerHour,
      snowCm,
      barometricPressureHpa: 1013 - Math.round(rainMmPerHour * 0.8),
      conditionName,
      isSevere: rainMmPerHour > 15 || snowCm > 5 || windSpeedKnots > 25 || visibilityMiles < 1.5,
    };

    const opsData: OperationsTelemetry = {
      airportCongestionIndex,
      activeRunways,
      departureQueueCount,
      groundHoldMinutes,
      isPeakHour,
      airTrafficFlowManagementDelay: groundHoldMinutes,
    };

    onRunPrediction(selectedFlight, weatherData, opsData, selectedModel);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-sky-400">
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                  <span>Flight Dispatch & Telemetry Input</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-sky-950 border border-sky-500/30 text-sky-300 font-mono">
                    STAGE 1 OF 2
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Select flight number for automatic route lookup, then verify meteorological conditions.
                </p>
              </div>
            </div>

            <button
              id="btn-close-prediction-modal"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* 1. Flight Number Lookup Section */}
            <div className="space-y-3">
              <label className="block text-xs font-mono text-sky-400 uppercase tracking-wider">
                1. Flight Number Search & Auto-Populate
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  id="input-flight-number-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. AI302, EK502, QR101, 6E541, DL221, AA440, SQ321..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Quick Presets Carousel */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
                <span className="text-slate-400 text-[11px] whitespace-nowrap">PRESETS:</span>
                {FLIGHTS_DATABASE.slice(0, 7).map((f) => (
                  <button
                    key={f.flightNumber}
                    type="button"
                    onClick={() => handleSelectFlight(f)}
                    className={`px-2.5 py-1 rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
                      selectedFlight.flightNumber === f.flightNumber
                        ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {f.flightNumber} ({f.origin.iata} ➔ {f.destination.iata})
                  </button>
                ))}
              </div>

              {/* Auto-Populated Flight Details Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">AIRLINE</span>
                  <span className="font-semibold text-white text-sm flex items-center gap-1.5 mt-0.5">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: AIRLINES[selectedFlight.airlineCode]?.color || '#3b82f6' }}
                    />
                    {selectedFlight.airlineName}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">ROUTE (ORIGIN ➔ DEST)</span>
                  <span className="font-mono font-bold text-sky-300 text-sm mt-0.5 block">
                    {selectedFlight.origin.iata} ➔ {selectedFlight.destination.iata}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate block">
                    {selectedFlight.origin.city} to {selectedFlight.destination.city}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">SCHEDULED TIME</span>
                  <span className="font-mono text-white text-sm font-semibold mt-0.5 block">
                    {selectedFlight.scheduledDeparture} ➔ {selectedFlight.scheduledArrival}
                  </span>
                  <span className="text-[10px] text-slate-400">{selectedFlight.distanceMiles} mi ({selectedFlight.distanceKm} km)</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">AIRCRAFT & GATE</span>
                  <span className="text-slate-200 text-xs font-medium mt-0.5 block truncate">
                    {selectedFlight.aircraftType}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Terminal {selectedFlight.terminal} • Gate {selectedFlight.gate}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Weather Simulation Presets & Advanced Sliders */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-sky-400" />
                  <span>2. Meteorological Telemetry (METAR Simulation)</span>
                </label>
              </div>

              {/* Weather Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {Object.entries(WEATHER_PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleApplyPreset(key)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      weatherPreset === key
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg ring-1 ring-blue-400'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-semibold truncate text-white">{preset.label}</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {preset.data.rainMmPerHour ? `${preset.data.rainMmPerHour} mm/h rain` : ''}
                      {preset.data.snowCm ? `${preset.data.snowCm} cm snow` : ''}
                      {preset.data.visibilityMiles !== undefined ? ` • ${preset.data.visibilityMiles} SM Vis` : ''}
                    </div>
                  </button>
                ))}
              </div>

              {/* Weather Input Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <CloudRain className="w-3.5 h-3.5 text-blue-400" /> Rain Rate:
                    </span>
                    <span className="font-mono text-sky-300 font-bold">{rainMmPerHour.toFixed(1)} mm/h</span>
                  </div>
                  <input
                    id="slider-rain-rate"
                    type="range"
                    min="0"
                    max="50"
                    step="0.5"
                    value={rainMmPerHour}
                    onChange={(e) => setRainMmPerHour(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5 text-teal-400" /> Wind Velocity:
                    </span>
                    <span className="font-mono text-teal-300 font-bold">{windSpeedKnots} Knots</span>
                  </div>
                  <input
                    id="slider-wind-speed"
                    type="range"
                    min="0"
                    max="55"
                    step="1"
                    value={windSpeedKnots}
                    onChange={(e) => setWindSpeedKnots(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-amber-400" /> Visibility:
                    </span>
                    <span className="font-mono text-amber-300 font-bold">{visibilityMiles.toFixed(1)} SM</span>
                  </div>
                  <input
                    id="slider-visibility"
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={visibilityMiles}
                    onChange={(e) => setVisibilityMiles(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Snowflake className="w-3.5 h-3.5 text-indigo-400" /> Snow Accumulation:
                    </span>
                    <span className="font-mono text-indigo-300 font-bold">{snowCm.toFixed(1)} cm</span>
                  </div>
                  <input
                    id="slider-snow"
                    type="range"
                    min="0"
                    max="30"
                    step="0.5"
                    value={snowCm}
                    onChange={(e) => setSnowCm(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 text-rose-400" /> Temperature:
                    </span>
                    <span className="font-mono text-rose-300 font-bold">{temperatureC}°C</span>
                  </div>
                  <input
                    id="slider-temp"
                    type="range"
                    min="-20"
                    max="45"
                    step="1"
                    value={temperatureC}
                    onChange={(e) => setTemperatureC(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Relative Humidity:</span>
                    <span className="font-mono text-slate-300 font-bold">{humidity}%</span>
                  </div>
                  <input
                    id="slider-humidity"
                    type="range"
                    min="10"
                    max="100"
                    step="1"
                    value={humidity}
                    onChange={(e) => setHumidity(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Airport Operations & Traffic */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <label className="text-xs font-mono text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>3. Airport Traffic & Runway Queue Load</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Airport Congestion:</span>
                    <span className="font-mono text-emerald-300 font-bold">{airportCongestionIndex}%</span>
                  </div>
                  <input
                    id="slider-congestion"
                    type="range"
                    min="10"
                    max="100"
                    value={airportCongestionIndex}
                    onChange={(e) => setAirportCongestionIndex(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Taxi Queue Count:</span>
                    <span className="font-mono text-sky-300 font-bold">{departureQueueCount} aircraft</span>
                  </div>
                  <input
                    id="slider-queue-count"
                    type="range"
                    min="1"
                    max="35"
                    value={departureQueueCount}
                    onChange={(e) => setDepartureQueueCount(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div>
                    <div className="text-xs font-semibold text-white">Peak Hour Window</div>
                    <div className="text-[10px] text-slate-400">High traffic slot congestion</div>
                  </div>
                  <button
                    id="btn-toggle-peak-hour"
                    type="button"
                    onClick={() => setIsPeakHour(!isPeakHour)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                      isPeakHour ? 'bg-sky-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        isPeakHour ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Model Selection & Submit */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-mono text-slate-400 whitespace-nowrap">ML MODEL:</span>
                <select
                  id="select-ml-model"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-sky-300 focus:outline-none focus:border-sky-500"
                >
                  <option value="XGBoost Ensemble">XGBoost (Ensemble - 94.2% Acc)</option>
                  <option value="LightGBM Booster">LightGBM (Gradient Booster - 93.8% Acc)</option>
                  <option value="CatBoost Classifier">CatBoost (Categorical Trees - 93.9% Acc)</option>
                  <option value="Random Forest">Random Forest (500 Trees - 92.1% Acc)</option>
                  <option value="Logistic Regression">Logistic Regression (L2 Regularized)</option>
                  <option value="Decision Tree (CART)">Decision Tree (Single CART)</option>
                </select>
              </div>

              <button
                id="btn-submit-prediction"
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_35px_rgba(56,189,248,0.6)] active:scale-98 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-sky-200" />
                <span>Predict Delay & Explain</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
