import React, { useState } from 'react';
import { PredictionResult } from '../../types';
import { PredictionHeader } from './PredictionHeader';
import { PredictionHeroCard } from './PredictionHeroCard';
import { ShapExplainability } from './ShapExplainability';
import { InteractiveFlightMap } from './InteractiveFlightMap';
import { FlightTimeline } from './FlightTimeline';
import { ModelComparisonSuite } from './ModelComparisonSuite';
import { AnalyticsVisualizations } from './AnalyticsVisualizations';
import { WhatIfSimulator } from './WhatIfSimulator';

interface DashboardViewProps {
  result: PredictionResult;
  onNewPrediction: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ result, onNewPrediction }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // CSV Export utility
  const handleExportCSV = () => {
    const csvRows = [
      ['Metric', 'Value'],
      ['Flight Number', result.flight.flightNumber],
      ['Airline', result.flight.airlineName],
      ['Origin Airport', `${result.flight.origin.city} (${result.flight.origin.iata})`],
      ['Destination Airport', `${result.flight.destination.city} (${result.flight.destination.iata})`],
      ['Distance', `${result.flight.distanceMiles} miles`],
      ['Predicted Status', result.statusLabel],
      ['Delay Probability (%)', `${result.delayProbability}%`],
      ['Expected Delay (Minutes)', `${result.expectedDelayMinutes} min`],
      ['Model Confidence (%)', `${result.confidenceScore}%`],
      ['95% Confidence Interval', `${result.confidenceInterval[0]} - ${result.confidenceInterval[1]} min`],
      ['Selected ML Model', result.selectedModel],
      ['Weather Condition', result.weather.conditionName],
      ['Rain Rate (mm/h)', `${result.weather.rainMmPerHour}`],
      ['Wind Speed (knots)', `${result.weather.windSpeedKnots}`],
      ['Visibility (SM)', `${result.weather.visibilityMiles}`],
      ['Airport Congestion Index', `${result.operations.airportCongestionIndex}%`],
      ['Departure Queue Count', `${result.operations.departureQueueCount}`],
      ['Timestamp', result.timestamp],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.map((val) => `"${val}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Flight_Delay_Prediction_${result.flight.flightNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF / Print Report Generator
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header & Sub-Tabs Navigation */}
      <PredictionHeader
        result={result}
        onNewPrediction={onNewPrediction}
        onExportCSV={handleExportCSV}
        onPrintReport={handlePrintReport}
        onToggleBookmark={() => setIsBookmarked(!isBookmarked)}
        isBookmarked={isBookmarked}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Dynamic Tab Views */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <PredictionHeroCard result={result} />
          <FlightTimeline result={result} />
          <InteractiveFlightMap flight={result.flight} weather={result.weather} />
          <ShapExplainability result={result} />
        </div>
      )}

      {activeTab === 'shap' && <ShapExplainability result={result} />}

      {activeTab === 'map' && (
        <div className="space-y-6">
          <InteractiveFlightMap flight={result.flight} weather={result.weather} />
          <FlightTimeline result={result} />
        </div>
      )}

      {activeTab === 'simulator' && <WhatIfSimulator initialResult={result} />}

      {activeTab === 'models' && <ModelComparisonSuite result={result} />}

      {activeTab === 'analytics' && <AnalyticsVisualizations result={result} />}
    </div>
  );
};
