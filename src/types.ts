export interface Airport {
  iata: string;
  icao: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  runways: number;
  elevation: number; // feet
  avgDelayMinutes: number;
  congestionIndex: number; // 0 - 100
  timezone: string;
}

export interface Airline {
  code: string;
  icao: string;
  name: string;
  country: string;
  onTimePerformance: number; // e.g. 84.5%
  fleetSize: number;
  primaryHub: string;
  color: string;
}

export interface FlightRoute {
  flightNumber: string;
  airlineCode: string;
  airlineName: string;
  origin: Airport;
  destination: Airport;
  scheduledDeparture: string; // "14:30"
  scheduledArrival: string; // "18:45"
  distanceMiles: number;
  distanceKm: number;
  aircraftType: string;
  terminal: string;
  gate: string;
  daysOfOperation: number[]; // 1=Mon, 7=Sun
  baseDelayRate: number; // baseline probability (0.0 to 1.0)
}

export interface WeatherTelemetry {
  temperatureC: number;
  temperatureF: number;
  humidity: number; // %
  windSpeedKnots: number;
  windDirectionDeg: number;
  visibilityMiles: number;
  rainMmPerHour: number;
  snowCm: number;
  barometricPressureHpa: number;
  conditionName: 'Clear' | 'Partly Cloudy' | 'Overcast' | 'Mist' | 'Heavy Fog' | 'Moderate Rain' | 'Heavy Thunderstorm' | 'Blizzard / Snow' | 'High Wind Gale';
  isSevere: boolean;
}

export interface OperationsTelemetry {
  airportCongestionIndex: number; // 0 to 100
  activeRunways: number;
  departureQueueCount: number;
  groundHoldMinutes: number;
  isPeakHour: boolean;
  airTrafficFlowManagementDelay: number;
}

export interface ShapContribution {
  feature: string;
  label: string;
  impactPercent: number; // e.g. +18 for +18%
  rawValue: string;
  category: 'weather' | 'traffic' | 'schedule' | 'carrier' | 'distance' | 'aircraft';
  description: string;
  favorable: boolean; // true if reduces delay, false if increases delay
}

export interface ModelMetrics {
  name: string;
  type: 'Classification' | 'Regression';
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  rocAuc?: number;
  logLoss?: number;
  rmse?: number;
  mae?: number;
  r2Score?: number;
  evs?: number;
}

export interface PredictionResult {
  id: string;
  timestamp: string;
  flight: FlightRoute;
  weather: WeatherTelemetry;
  operations: OperationsTelemetry;
  selectedModel: string;
  
  // High-level prediction
  status: 'ON_TIME' | 'MINOR_DELAY' | 'MODERATE_DELAY' | 'SEVERE_DELAY';
  statusLabel: string;
  delayProbability: number; // 0 to 100
  expectedDelayMinutes: number;
  confidenceScore: number; // 0 to 100
  confidenceInterval: [number, number]; // [min, max] minutes
  
  // Explanations
  shapValues: ShapContribution[];
  topReasons: Array<{
    title: string;
    description: string;
    impact: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    icon: string;
  }>;
  
  // Timeline
  timeline: {
    scheduledGateDeparture: string;
    predictedGateDeparture: string;
    estimatedTaxiOutMinutes: number;
    estimatedWheelsUp: string;
    estimatedFlightDurationMinutes: number;
    estimatedWheelsDown: string;
    estimatedTaxiInMinutes: number;
    predictedGateArrival: string;
    scheduledGateArrival: string;
    delayAtArrivalMinutes: number;
  };

  // ML Details
  featureImportance: Array<{ name: string; score: number; category: string }>;
  confusionMatrix: {
    tp: number; // Delay predicted & happened
    fp: number; // Delay predicted & on time
    tn: number; // On-time predicted & on time
    fn: number; // On-time predicted & delay happened
  };
  rocCurve: Array<{ fpr: number; tpr: number; threshold: number }>;
}

export interface HistoricalPredictionRecord {
  id: string;
  timestamp: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  status: 'ON_TIME' | 'MINOR_DELAY' | 'MODERATE_DELAY' | 'SEVERE_DELAY';
  delayProbability: number;
  expectedDelayMinutes: number;
  weatherCondition: string;
  congestionIndex: number;
  modelUsed: string;
}
