import React from 'react';
import { motion } from 'motion/react';
import { Plane, Compass, Sparkles, ArrowRight, ShieldCheck, Cpu, BarChart3, Clock } from 'lucide-react';

interface HeroSectionProps {
  onStartPrediction: () => void;
  onExploreML: () => void;
  onExploreSchedule: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartPrediction,
  onExploreML,
  onExploreSchedule,
}) => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-4 pt-16 pb-12 text-center max-w-5xl mx-auto">
      {/* 1. Avionics Operation Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-xs font-mono text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.15)] backdrop-blur-md mb-8"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
        </span>
        <span className="tracking-wider uppercase font-semibold">CLASSICAL ML ENSEMBLE ENGINE</span>
        <span className="text-slate-500">|</span>
        <span className="text-slate-400">94.2% XGBOOST ACCURACY</span>
      </motion.div>

      {/* 2. Main High-Impact Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
        className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 font-display"
      >
        Predict Flight Delays <br />
        <span className="bg-gradient-to-r from-sky-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent filter drop-shadow-sm">
          Before They Happen
        </span>
      </motion.h1>

      {/* 3. Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
        className="text-lg sm:text-xl text-slate-300 max-w-2xl font-light leading-relaxed mb-10 text-balance"
      >
        Machine Learning powered prediction using historical flight, airport, and weather data.
        Delivering sub-minute delay regression and game-theoretic SHAP explainability.
      </motion.p>

      {/* 4. Action Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.45 }}
        className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16"
      >
        <button
          id="btn-hero-start-prediction"
          onClick={onStartPrediction}
          className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 text-white font-semibold text-base shadow-[0_0_35px_rgba(37,99,235,0.45)] hover:shadow-[0_0_50px_rgba(56,189,248,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden border border-sky-300/30"
        >
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform" />
          <Plane className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-sky-100" />
          <span>Start Prediction</span>
          <ArrowRight className="w-4 h-4 text-sky-200 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          id="btn-hero-learn-more"
          onClick={onExploreML}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 hover:text-white font-medium text-base border border-slate-700/60 hover:border-slate-500/80 backdrop-blur-xl shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          <Cpu className="w-4 h-4 text-sky-400" />
          <span>ML Architecture & SHAP</span>
        </button>

        <button
          id="btn-hero-explore-flights"
          onClick={onExploreSchedule}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-slate-900/40 hover:bg-slate-900/70 text-slate-400 hover:text-slate-200 font-medium text-sm border border-slate-800/80 hover:border-slate-700 backdrop-blur-md transition-all duration-200 cursor-pointer"
        >
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <span>Live Flight Schedule</span>
        </button>
      </motion.div>

      {/* 5. Key Metrics Telemetry Grid (Emirates / Apple Luxury Operations Center) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl pt-6 border-t border-slate-800/80"
      >
        <div className="flex flex-col items-center p-4 rounded-xl bg-slate-900/40 backdrop-blur-md border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 uppercase mb-1">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>Classifiers</span>
          </div>
          <div className="text-2xl font-bold font-display text-white">6 Models</div>
          <div className="text-[11px] text-slate-400 mt-0.5">XGBoost, CatBoost, LightGBM</div>
        </div>

        <div className="flex flex-col items-center p-4 rounded-xl bg-slate-900/40 backdrop-blur-md border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 uppercase mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Model ROC-AUC</span>
          </div>
          <div className="text-2xl font-bold font-display text-emerald-400">0.968</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Cross-Validated ROC</div>
        </div>

        <div className="flex flex-col items-center p-4 rounded-xl bg-slate-900/40 backdrop-blur-md border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 uppercase mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Regression RMSE</span>
          </div>
          <div className="text-2xl font-bold font-display text-amber-400">± 4.18 min</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Mean Absolute Error</div>
        </div>

        <div className="flex flex-col items-center p-4 rounded-xl bg-slate-900/40 backdrop-blur-md border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Explainable AI</span>
          </div>
          <div className="text-2xl font-bold font-display text-indigo-300">TreeSHAP</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Game-Theoretic Attribution</div>
        </div>
      </motion.div>
    </div>
  );
};
