import React from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  CloudRain,
  Activity,
  Wind,
  Layers,
  Thermometer,
  Eye,
} from 'lucide-react';
import { PredictionResult } from '../../types';

interface PredictionHeroCardProps {
  result: PredictionResult;
}

export const PredictionHeroCard: React.FC<PredictionHeroCardProps> = ({ result }) => {
  const isDelayed = result.status !== 'ON_TIME';
  const prob = result.delayProbability;

  // Status Styling Logic
  const statusColors = {
    ON_TIME: {
      bg: 'bg-emerald-950/60',
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]',
      icon: CheckCircle2,
    },
    MINOR_DELAY: {
      bg: 'bg-amber-950/50',
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]',
      icon: AlertTriangle,
    },
    MODERATE_DELAY: {
      bg: 'bg-rose-950/60',
      border: 'border-rose-500/40',
      text: 'text-rose-400',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      glow: 'shadow-[0_0_35px_rgba(244,63,94,0.2)]',
      icon: AlertTriangle,
    },
    SEVERE_DELAY: {
      bg: 'bg-red-950/70',
      border: 'border-red-500/60',
      text: 'text-red-400',
      badge: 'bg-red-500/25 text-red-300 border-red-500/50',
      glow: 'shadow-[0_0_40px_rgba(239,68,68,0.25)]',
      icon: AlertTriangle,
    },
  }[result.status];

  const StatusIcon = statusColors.icon;

  // Radial Gauge Math
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (prob / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* 1. Main Large Operations Center Card */}
      <div
        className={`p-6 sm:p-8 rounded-2xl ${statusColors.bg} border ${statusColors.border} ${statusColors.glow} backdrop-blur-xl transition-all duration-300`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Status Badge, Title & Expected Delay Minutes */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${statusColors.badge}`}
              >
                <StatusIcon className="w-4 h-4" />
                <span>{result.statusLabel}</span>
              </span>

              <span className="text-xs font-mono text-slate-400">
                MODEL: {result.selectedModel}
              </span>
            </div>

            <div>
              <div className="text-sm font-mono text-slate-400">PREDICTED FLIGHT OUTCOME</div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight mt-1">
                Flight {result.flight.flightNumber}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs font-mono text-slate-400 block">EXPECTED DELAY</span>
                <span className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1 block">
                  {result.expectedDelayMinutes > 0 ? `${result.expectedDelayMinutes} min` : '0 min'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  95% CI: {result.confidenceInterval[0]}–{result.confidenceInterval[1]} min
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs font-mono text-slate-400 block">MODEL CONFIDENCE</span>
                <span className="text-2xl sm:text-3xl font-extrabold font-display text-sky-400 mt-1 block">
                  {result.confidenceScore}%
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  High Reliability Holdout
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-xs font-mono text-slate-400 block">ACTUAL DEPARTURE</span>
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white mt-1 block">
                  {result.timeline.predictedGateDeparture}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Sched: {result.timeline.scheduledGateDeparture}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: High Precision Radial Probability Gauge */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Track Circle */}
                <circle
                  cx="88"
                  cy="88"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-slate-800"
                  fill="transparent"
                />
                {/* Progress Circle */}
                <motion.circle
                  cx="88"
                  cy="88"
                  r={radius}
                  stroke={prob > 60 ? '#f43f5e' : prob > 30 ? '#f59e0b' : '#10b981'}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold font-display text-white">{prob}%</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Delay Probability
                </span>
              </div>
            </div>

            <div className="w-full text-center mt-3 pt-3 border-t border-slate-800">
              <span className="text-xs font-mono text-slate-400">
                CLASSIFICATION MARGIN:{' '}
                <span className="text-sky-300 font-bold">
                  {prob >= 50 ? 'POSITIVE (DELAY LIKELY)' : 'NEGATIVE (ON TIME)'}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Primary Operational Reason Cards (As explicitly requested in prompt) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono text-sky-400 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <span>Primary Delay Drivers & SHAP Attributions</span>
          </h3>
          <span className="text-xs text-slate-400">Derived from Classical Ensemble Tree Splits</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {result.topReasons.map((reason, idx) => {
            const severityStyle = {
              critical: 'border-rose-500/40 bg-rose-950/30 text-rose-300',
              high: 'border-amber-500/40 bg-amber-950/30 text-amber-300',
              medium: 'border-blue-500/30 bg-slate-900/60 text-sky-300',
              low: 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300',
            }[reason.severity];

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border backdrop-blur-md transition-all ${severityStyle}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white text-sm">{reason.title}</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700">
                    {reason.impact}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{reason.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
