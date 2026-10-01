import React from 'react';
import {
  Download,
  Share2,
  Bookmark,
  RotateCcw,
  Sparkles,
  Layers,
  Sliders,
  BarChart3,
  FileText,
  BookmarkCheck,
} from 'lucide-react';
import { PredictionResult } from '../../types';

interface PredictionHeaderProps {
  result: PredictionResult;
  onNewPrediction: () => void;
  onExportCSV: () => void;
  onPrintReport: () => void;
  onToggleBookmark: () => void;
  isBookmarked: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const PredictionHeader: React.FC<PredictionHeaderProps> = ({
  result,
  onNewPrediction,
  onExportCSV,
  onPrintReport,
  onToggleBookmark,
  isBookmarked,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Bar with Flight Tag, Route, and Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-600/20 border border-blue-500/30 text-sky-400 font-mono font-bold text-lg">
            {result.flight.flightNumber}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white font-display">
                {result.flight.airlineName}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                {result.flight.aircraftType}
              </span>
            </div>
            <div className="text-xs font-mono text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="text-sky-300 font-semibold">{result.flight.origin.city} ({result.flight.origin.iata})</span>
              <span>➔</span>
              <span className="text-sky-300 font-semibold">{result.flight.destination.city} ({result.flight.destination.iata})</span>
              <span>•</span>
              <span>{result.flight.distanceMiles} mi ({result.flight.distanceKm} km)</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-toggle-favorite"
            onClick={onToggleBookmark}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>

          <button
            id="btn-export-csv"
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>CSV Export</span>
          </button>

          <button
            id="btn-print-pdf-report"
            onClick={onPrintReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>PDF Dispatch</span>
          </button>

          <button
            id="btn-re-predict"
            onClick={onNewPrediction}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-sky-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Prediction</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium border-b border-slate-800">
        {[
          { id: 'overview', label: 'Operations Overview', icon: Sparkles },
          { id: 'shap', label: 'SHAP Explainable AI', icon: Layers },
          { id: 'map', label: 'Interactive Flight Route', icon: BarChart3 },
          { id: 'simulator', label: 'What-If Live Simulator', icon: Sliders },
          { id: 'models', label: 'ML Models & ROC Benchmark', icon: BarChart3 },
          { id: 'analytics', label: 'Delay Trends & Correlations', icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-nav-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-600/20 text-sky-300 border border-blue-500/40 font-semibold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
