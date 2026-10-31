import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  CloudRain,
  Grid,
  Sparkles,
  Plane,
  Building2,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  MONTHLY_DELAY_TRENDS,
  HOURLY_DELAY_TRENDS,
  CORRELATION_MATRIX,
  AIRLINES,
  AIRPORTS,
} from '../../data/flightsDatabase';
import { PredictionResult } from '../../types';

interface AnalyticsVisualizationsProps {
  result: PredictionResult;
}

export const AnalyticsVisualizations: React.FC<AnalyticsVisualizationsProps> = ({ result }) => {
  const [activeSubView, setActiveSubView] = useState<'trends' | 'airports' | 'airlines' | 'correlation' | 'features'>('trends');

  // Airline comparison data formatted for charts
  const airlineChartData = Object.values(AIRLINES).map((a) => ({
    name: a.name,
    code: a.code,
    onTime: a.onTimePerformance,
    delayRate: (100 - a.onTimePerformance).toFixed(1),
  }));

  // Airport comparison data formatted for charts
  const airportChartData = Object.values(AIRPORTS).map((a) => ({
    name: a.iata,
    city: a.city,
    avgDelay: a.avgDelayMinutes,
    congestion: a.congestionIndex,
  }));

  return (
    <div className="space-y-6">
      {/* Visualizations Navigation Header */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase">
              <BarChart3 className="w-4 h-4 text-sky-400" />
              <span>Historical Flight & Weather Analytics Telemetry</span>
            </div>
            <h2 className="text-xl font-bold text-white font-display mt-1">
              Global Delay Distributions & Correlation Matrices
            </h2>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono overflow-x-auto">
            <button
              onClick={() => setActiveSubView('trends')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeSubView === 'trends'
                  ? 'bg-blue-600/30 text-sky-300 font-bold border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Time Trends
            </button>
            <button
              onClick={() => setActiveSubView('airports')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeSubView === 'airports'
                  ? 'bg-blue-600/30 text-sky-300 font-bold border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Airport Rankings
            </button>
            <button
              onClick={() => setActiveSubView('airlines')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeSubView === 'airlines'
                  ? 'bg-blue-600/30 text-sky-300 font-bold border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Airline Reliability
            </button>
            <button
              onClick={() => setActiveSubView('correlation')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeSubView === 'correlation'
                  ? 'bg-blue-600/30 text-sky-300 font-bold border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Correlation Matrix
            </button>
            <button
              onClick={() => setActiveSubView('features')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeSubView === 'features'
                  ? 'bg-blue-600/30 text-sky-300 font-bold border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Feature Importance
            </button>
          </div>
        </div>

        {/* 1. Monthly & Hourly Trend Charts */}
        {activeSubView === 'trends' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Monthly Trend Area Chart */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  Average Delay (Minutes) by Month
                </span>
                <span className="text-slate-500">Seasonal Weather Peaks</span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MONTHLY_DELAY_TRENDS}>
                    <defs>
                      <linearGradient id="colorAvgDelay" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="avgDelay"
                      stroke="#38bdf8"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorAvgDelay)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Hourly Trend Bar Chart */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                  Delay Probability (%) by Hour of Day
                </span>
                <span className="text-slate-500">Peak Afternoon Slots</span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={HOURLY_DELAY_TRENDS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="delayProbability" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* 2. Airport Rankings */}
        {activeSubView === 'airports' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="text-xs font-mono text-slate-300 font-semibold">
              International Airport Congestion & Average Delay Index
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={airportChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="avgDelay" fill="#38bdf8" name="Avg Delay (Mins)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="congestion" fill="#f59e0b" name="Congestion Index" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 3. Airline Reliability Rankings */}
        {activeSubView === 'airlines' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="text-xs font-mono text-slate-300 font-semibold">
              Carrier On-Time Performance (OTP %) Across 12 Major Airlines
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={airlineChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" domain={[60, 100]} stroke="#64748b" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={10} width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="onTime" fill="#10b981" name="On-Time Rate (%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 4. Correlation Matrix Heatmap */}
        {activeSubView === 'correlation' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="text-xs font-mono text-slate-300 font-semibold">
              Pearson Feature Correlation Coefficient Matrix (r ∈ [-1.0, +1.0])
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CORRELATION_MATRIX.map((item, idx) => {
                const isPositive = item.corr > 0;
                const absCorr = Math.abs(item.corr);
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between font-mono text-xs"
                  >
                    <div>
                      <span className="text-white font-semibold block">{item.featureA}</span>
                      <span className="text-[10px] text-slate-500">vs {item.featureB}</span>
                    </div>

                    <div
                      className={`px-3 py-1 rounded-lg font-bold ${
                        isPositive
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {isPositive ? `+${item.corr.toFixed(2)}` : item.corr.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Feature Importance Breakdown */}
        {activeSubView === 'features' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="text-xs font-mono text-slate-300 font-semibold">
              Ensemble Mean Decrease in Impurity (MDI) & Permutation Importance
            </div>

            <div className="space-y-3">
              {result.featureImportance.map((f, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-white font-medium">{f.name}</span>
                    <span className="text-sky-400 font-bold">{(f.score * 100).toFixed(0)}% Importance</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full"
                      style={{ width: `${f.score * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
