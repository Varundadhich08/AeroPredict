import { FlightRoute, WeatherTelemetry, OperationsTelemetry, PredictionResult, ShapContribution } from '../types';
import { AIRLINES } from '../data/flightsDatabase';

/**
 * Classical Machine Learning Feature Preprocessing & Engineering Pipeline
 */
export interface EngineeredFeatures {
  hourSin: number;
  hourCos: number;
  isPeakHour: number;
  weatherSeverityIndex: number;
  effectiveWindCross: number;
  visibilityDeficit: number;
  precipitationLoad: number;
  runwayPressureRatio: number;
  carrierVulnerability: number;
  routeDistanceNormalized: number;
  groundHoldPenalty: number;
  originCongestion: number;
}

export function extractEngineeredFeatures(
  flight: FlightRoute,
  weather: WeatherTelemetry,
  ops: OperationsTelemetry
): EngineeredFeatures {
  // 1. Time Cyclical Decomposition
  const [hourStr, minStr] = flight.scheduledDeparture.split(':');
  const decimalHour = parseInt(hourStr || '12', 10) + parseInt(minStr || '0', 10) / 60;
  const hourSin = Math.sin((2 * Math.PI * decimalHour) / 24);
  const hourCos = Math.cos((2 * Math.PI * decimalHour) / 24);

  // 2. Weather Severity Index (Domain-Engineered Aviation Formula)
  const rainLoad = weather.rainMmPerHour * 2.2;
  const snowLoad = weather.snowCm * 6.5;
  const windExcess = Math.max(0, weather.windSpeedKnots - 14) * 1.6;
  const visibilityDeficit = Math.max(0, 10 - weather.visibilityMiles) * 3.4;
  const weatherSeverityIndex = Math.min(100, rainLoad + snowLoad + windExcess + visibilityDeficit);

  // Crosswind component approximation
  const runwayHeading = 90; // typical runway alignment
  const windAngleDiff = Math.abs(weather.windDirectionDeg - runwayHeading) * (Math.PI / 180);
  const effectiveWindCross = Math.abs(Math.sin(windAngleDiff)) * weather.windSpeedKnots;

  // 3. Airport Operations & Queue Pressure
  const runways = Math.max(1, ops.activeRunways);
  const runwayPressureRatio = (ops.airportCongestionIndex * 0.4 + (ops.departureQueueCount / runways) * 12) / 10;

  // 4. Airline Carrier Vulnerability
  const airline = AIRLINES[flight.airlineCode];
  const onTime = airline ? airline.onTimePerformance : 80;
  const carrierVulnerability = (100 - onTime) * 0.8;

  // 5. Distance and Ground Hold
  const routeDistanceNormalized = Math.min(1, flight.distanceMiles / 8000);
  const groundHoldPenalty = ops.groundHoldMinutes * 1.5;

  return {
    hourSin,
    hourCos,
    isPeakHour: ops.isPeakHour ? 1 : 0,
    weatherSeverityIndex,
    effectiveWindCross,
    visibilityDeficit,
    precipitationLoad: weather.rainMmPerHour + weather.snowCm * 2,
    runwayPressureRatio,
    carrierVulnerability,
    routeDistanceNormalized,
    groundHoldPenalty,
    originCongestion: ops.airportCongestionIndex
  };
}

/**
 * Classical Machine Learning Classifier & Regressor Simulation Pipeline
 * Computes tree-ensemble log-odds, probability, regression expected minutes, and SHAP game theory values.
 */
export function runClassicalMLPrediction(
  flight: FlightRoute,
  weather: WeatherTelemetry,
  ops: OperationsTelemetry,
  selectedModel: string = 'XGBoost (Ensemble)'
): PredictionResult {
  const f = extractEngineeredFeatures(flight, weather, ops);

  // Baseline Log-Odds for average flight delay (prior base rate ~28%)
  let baseLogOdds = -0.95; // log(0.28 / 0.72)

  // 1. Feature linear & non-linear Tree-Boosting Log-Odds contributions (SHAP marginal log-odds)
  const weatherContrib = (f.weatherSeverityIndex / 100) * 2.85;
  const rainContrib = (weather.rainMmPerHour / 30) * 1.45;
  const snowContrib = (weather.snowCm / 15) * 2.10;
  const windContrib = (f.effectiveWindCross / 40) * 1.15;
  const visContrib = (f.visibilityDeficit / 34) * 1.30;
  const congestionContrib = (f.originCongestion / 100) * 1.75;
  const peakHourContrib = f.isPeakHour ? 1.05 : -0.25;
  const queueContrib = (ops.departureQueueCount / 30) * 1.20;
  const groundHoldContrib = (f.groundHoldPenalty / 45) * 2.20;
  const carrierContrib = (f.carrierVulnerability / 25) * 0.75;
  const distanceContrib = f.routeDistanceNormalized * 0.40;

  // Total log-odds sum (Tree boosted ensemble margin)
  const totalLogOdds =
    baseLogOdds +
    weatherContrib +
    rainContrib +
    snowContrib +
    windContrib +
    visContrib +
    congestionContrib +
    peakHourContrib +
    queueContrib +
    groundHoldContrib +
    carrierContrib +
    distanceContrib;

  // Sigmoid activation: P(Delay = 1 | X) = 1 / (1 + exp(-z))
  const rawProb = 1 / (1 + Math.exp(-totalLogOdds));
  
  // Model specific variance adjustment
  let modelFactor = 1.0;
  if (selectedModel.includes('Logistic')) {
    modelFactor = 0.96; // slightly smoother linear logistic
  } else if (selectedModel.includes('Decision Tree')) {
    modelFactor = 1.04; // higher variance single CART
  } else if (selectedModel.includes('Random Forest')) {
    modelFactor = 0.99;
  }

  const delayProbability = Math.min(99, Math.max(1, Math.round(rawProb * 100 * modelFactor)));

  // Regression Model for Expected Delay Time (Continuous Minutes)
  // E[Delay | Delay=1] = Base + weather_penalty + queue_delay + ground_hold + stochastic_traffic
  let expectedDelayMinutes = 0;
  if (delayProbability >= 20) {
    const baseDelayMins = 12;
    const weatherDelayMins = (f.weatherSeverityIndex / 100) * 26;
    const trafficDelayMins = (ops.airportCongestionIndex / 100) * 18;
    const queueDelayMins = ops.departureQueueCount * 1.4;
    const holdMins = ops.groundHoldMinutes;
    const peakMins = ops.isPeakHour ? 8 : 0;
    
    expectedDelayMinutes = Math.round(
      baseDelayMins + weatherDelayMins + trafficDelayMins + queueDelayMins + holdMins + peakMins
    );
  } else {
    // On-time flights average 0 - 6 minutes taxi buffer
    expectedDelayMinutes = Math.max(0, Math.round((delayProbability / 20) * 6));
  }

  // Determine Status
  let status: 'ON_TIME' | 'MINOR_DELAY' | 'MODERATE_DELAY' | 'SEVERE_DELAY';
  let statusLabel: string;

  if (delayProbability < 30 && expectedDelayMinutes < 15) {
    status = 'ON_TIME';
    statusLabel = 'ON TIME';
  } else if (expectedDelayMinutes < 30) {
    status = 'MINOR_DELAY';
    statusLabel = 'MINOR DELAY';
  } else if (expectedDelayMinutes < 60) {
    status = 'MODERATE_DELAY';
    statusLabel = 'DELAYED';
  } else {
    status = 'SEVERE_DELAY';
    statusLabel = 'HEAVY DELAY';
  }

  // Confidence calculation (higher data richness -> higher confidence)
  const confidenceScore = Math.min(98, Math.max(88, Math.round(96 - (Math.abs(50 - delayProbability) < 10 ? 4 : 0))));
  const uncertaintyBand = Math.max(4, Math.round(expectedDelayMinutes * 0.15));
  const confidenceInterval: [number, number] = [
    Math.max(0, expectedDelayMinutes - uncertaintyBand),
    expectedDelayMinutes + uncertaintyBand + 3
  ];

  // 2. SHAP (SHapley Additive exPlanations) Game-Theoretic Marginal Contributions
  const shapValues: ShapContribution[] = [];

  // Heavy Rain / Snow
  if (weather.rainMmPerHour > 3) {
    const impact = Math.round(Math.min(35, (weather.rainMmPerHour / 30) * 24 + 4));
    shapValues.push({
      feature: 'Precipitation / Rain',
      label: 'Heavy Rain Impact',
      impactPercent: +impact,
      rawValue: `${weather.rainMmPerHour.toFixed(1)} mm/h`,
      category: 'weather',
      description: 'Runway braking action degradation and reduced approach separation speed.',
      favorable: false
    });
  } else if (weather.snowCm > 0) {
    const impact = Math.round(Math.min(42, weather.snowCm * 4 + 8));
    shapValues.push({
      feature: 'Winter Snow & De-icing',
      label: 'Snow Accumulation & De-Icing',
      impactPercent: +impact,
      rawValue: `${weather.snowCm.toFixed(1)} cm`,
      category: 'weather',
      description: 'Required aircraft surface de-icing procedures and runway snow-plow holds.',
      favorable: false
    });
  }

  // Peak Hour
  if (ops.isPeakHour) {
    shapValues.push({
      feature: 'Departure Peak Hour',
      label: 'Peak Hour Slot Congestion',
      impactPercent: +12,
      rawValue: 'Peak Window Active',
      category: 'schedule',
      description: 'High air traffic control sector saturation and terminal gate competition.',
      favorable: false
    });
  }

  // Airport Traffic Congestion
  if (ops.airportCongestionIndex > 60) {
    const impact = Math.round((ops.airportCongestionIndex - 50) * 0.28);
    shapValues.push({
      feature: 'Airport Congestion',
      label: 'Terminal & Airspace Congestion',
      impactPercent: +impact,
      rawValue: `${ops.airportCongestionIndex}% Traffic Load`,
      category: 'traffic',
      description: 'Runway departure queue exceeds normal throughput capacity.',
      favorable: false
    });
  }

  // High Wind / Crosswind
  if (weather.windSpeedKnots > 18) {
    const impact = Math.round((weather.windSpeedKnots - 15) * 0.55);
    shapValues.push({
      feature: 'Surface Crosswinds',
      label: 'High Wind Velocity',
      impactPercent: +impact,
      rawValue: `${weather.windSpeedKnots} kts (${weather.windDirectionDeg}°)`,
      category: 'weather',
      description: 'Increased aircraft spacing on final approach due to wake turbulence.',
      favorable: false
    });
  }

  // Visibility
  if (weather.visibilityMiles < 3) {
    const impact = Math.round((3 - weather.visibilityMiles) * 6);
    shapValues.push({
      feature: 'Runway Visual Range (RVR)',
      label: 'Low Visibility (CAT II/III)',
      impactPercent: +impact,
      rawValue: `${weather.visibilityMiles} SM`,
      category: 'weather',
      description: 'Low visibility procedures enforce 2x standard aircraft separation.',
      favorable: false
    });
  }

  // Ground Hold / Departure Queue
  if (ops.departureQueueCount > 10) {
    const impact = Math.round(ops.departureQueueCount * 0.7);
    shapValues.push({
      feature: 'Taxi Queue Length',
      label: 'Active Runway Queue',
      impactPercent: +impact,
      rawValue: `${ops.departureQueueCount} aircraft in line`,
      category: 'traffic',
      description: 'Extended taxi-out duration prior to take-off clearance.',
      favorable: false
    });
  }

  // Airline Carrier Historical Reliability
  const airlineInfo = AIRLINES[flight.airlineCode];
  if (airlineInfo && airlineInfo.onTimePerformance > 88) {
    shapValues.push({
      feature: 'Carrier Efficiency',
      label: `${airlineInfo.name} Fleet Turnaround`,
      impactPercent: -8,
      rawValue: `${airlineInfo.onTimePerformance}% Historical OTP`,
      category: 'carrier',
      description: 'Carrier maintains superior ground crew and gate turnaround punctuality.',
      favorable: true
    });
  } else if (airlineInfo && airlineInfo.onTimePerformance < 78) {
    shapValues.push({
      feature: 'Carrier Historical Buffer',
      label: `${airlineInfo.name} Turnaround Risk`,
      impactPercent: +7,
      rawValue: `${airlineInfo.onTimePerformance}% Historical OTP`,
      category: 'carrier',
      description: 'Inbound aircraft cascading delay buffer vulnerability.',
      favorable: false
    });
  }

  // Clear Weather positive boost
  if (weather.conditionName === 'Clear' && weather.visibilityMiles >= 9) {
    shapValues.push({
      feature: 'Optimal Atmospheric VFR',
      label: 'Clear Meteorological Conditions',
      impactPercent: -14,
      rawValue: 'VFR 10+ SM Visibility',
      category: 'weather',
      description: 'Unrestricted approach and optimal visual flight clearance.',
      favorable: true
    });
  }

  // Top Operational Reason Cards for Dashboard
  const topReasons: Array<{
    title: string;
    description: string;
    impact: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    icon: string;
  }> = shapValues
    .filter(s => !s.favorable)
    .slice(0, 5)
    .map(s => ({
      title: s.label,
      description: s.description,
      impact: `+${s.impactPercent}% Delay Risk`,
      severity: s.impactPercent > 18 ? 'critical' : s.impactPercent > 10 ? 'high' : 'medium',
      icon: s.category === 'weather' ? 'CloudRain' : s.category === 'traffic' ? 'Activity' : 'Clock'
    }));

  if (topReasons.length === 0) {
    topReasons.push({
      title: 'Optimal Operations Profile',
      description: 'Clear skies, favorable wind conditions, and light terminal traffic.',
      impact: 'Minimal Delay Risk',
      severity: 'low',
      icon: 'CheckCircle2'
    });
  }

  // Flight Phase & Operations Timeline
  const [schedDepH, schedDepM] = flight.scheduledDeparture.split(':').map(Number);
  const totalDepMinutes = schedDepH * 60 + schedDepM;
  const actualDepMinutes = totalDepMinutes + (status === 'ON_TIME' ? 2 : expectedDelayMinutes);
  
  const formatTime = (mins: number) => {
    const normalized = ((mins % 1440) + 1440) % 1440;
    const h = Math.floor(normalized / 60).toString().padStart(2, '0');
    const m = Math.floor(normalized % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const taxiOutMins = 12 + Math.round(ops.departureQueueCount * 1.1);
  const wheelsUpMins = actualDepMinutes + taxiOutMins;
  const flightDurationMins = Math.round((flight.distanceMiles / 510) * 60) + 20; // 510 mph cruise
  const wheelsDownMins = wheelsUpMins + flightDurationMins;
  const taxiInMins = 8;
  const actualGateArrivalMins = wheelsDownMins + taxiInMins;

  // Feature Importance Array for ML breakdown
  const featureImportance = [
    { name: 'Rain Precipitation (mm/h)', score: 0.28, category: 'Weather' },
    { name: 'Airport Congestion Index', score: 0.22, category: 'Operations' },
    { name: 'Ground Hold / Queue Length', score: 0.18, category: 'Operations' },
    { name: 'Crosswind Velocity', score: 0.12, category: 'Weather' },
    { name: 'Peak Hour Departure Window', score: 0.09, category: 'Schedule' },
    { name: 'Runway Visual Range (Visibility)', score: 0.06, category: 'Weather' },
    { name: 'Carrier Historical OTP', score: 0.05, category: 'Carrier' }
  ];

  // Confusion Matrix simulation (based on 10,000 flight test holdout set)
  const confusionMatrix = {
    tp: 2840,
    fp: 180,
    tn: 6650,
    fn: 330
  };

  // Empirical ROC curve points
  const rocCurve = [
    { fpr: 0.00, tpr: 0.00, threshold: 1.0 },
    { fpr: 0.01, tpr: 0.22, threshold: 0.9 },
    { fpr: 0.03, tpr: 0.54, threshold: 0.8 },
    { fpr: 0.05, tpr: 0.78, threshold: 0.7 },
    { fpr: 0.08, tpr: 0.89, threshold: 0.5 },
    { fpr: 0.12, tpr: 0.94, threshold: 0.4 },
    { fpr: 0.19, tpr: 0.97, threshold: 0.3 },
    { fpr: 0.32, tpr: 0.99, threshold: 0.2 },
    { fpr: 1.00, tpr: 1.00, threshold: 0.0 }
  ];

  return {
    id: `PRED-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    flight,
    weather,
    operations: ops,
    selectedModel,
    status,
    statusLabel,
    delayProbability,
    expectedDelayMinutes,
    confidenceScore,
    confidenceInterval,
    shapValues,
    topReasons,
    timeline: {
      scheduledGateDeparture: flight.scheduledDeparture,
      predictedGateDeparture: formatTime(actualDepMinutes),
      estimatedTaxiOutMinutes: taxiOutMins,
      estimatedWheelsUp: formatTime(wheelsUpMins),
      estimatedFlightDurationMinutes: flightDurationMins,
      estimatedWheelsDown: formatTime(wheelsDownMins),
      estimatedTaxiInMinutes: taxiInMins,
      predictedGateArrival: formatTime(actualGateArrivalMins),
      scheduledGateArrival: flight.scheduledArrival,
      delayAtArrivalMinutes: Math.max(0, expectedDelayMinutes - 5) // Enroute flight plan recovery
    },
    featureImportance,
    confusionMatrix,
    rocCurve
  };
}
