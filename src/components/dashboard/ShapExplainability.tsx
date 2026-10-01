import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, TrendingDown, Info, ShieldAlert, Cpu } from 'lucide-react';
import { PredictionResult } from '../../types';

interface ShapExplainabilityProps {
  result: PredictionResult;
}

export const ShapExplainability: React.FC<ShapExplainabilityProps> = ({ result }) => {
  const baseRate = 28; // Historical base delay rate baseline (%)

  return (
    <div className="space-y-6">
      {/* SHAP Header Info */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>TreeSHAP Game-Theoretic Decomposition</span>
            </div>
            <h2 className="text-xl font-bold text-white font-display mt-1">
              Feature Attributions for Prediction {result.id}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Exact Shapley values measure the marginal contribution of each operational and weather variable to the final delay probability.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">BASELINE E[f(x)]</span>
              <span className="text-white font-bold text-sm">{baseRate}%</span>
            </div>
            <span className="text-slate-600">➔</span>
            <div>
              <span className="text-slate-500 block">OUTPUT f(x)</span>
              <span className="text-sky-400 font-bold text-sm">{result.delayProbability}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* SHAP Waterfall / Feature Contributions */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl space-y-4">
        <h3 className="text-sm font-mono text-slate-300 uppercase tracking-wider">
          Individual Feature Attribution Waterfall
        </h3>

        <div className="space-y-3">
          {result.shapValues.map((item, idx) => {
            const isPositive = !item.favorable; // Increases delay
            const barWidth = Math.min(100, Math.abs(item.impactPercent) * 2.8);

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-xs sm:text-sm">{item.label}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {item.rawValue}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs font-bold">
                    {isPositive ? (
                      <span className="text-rose-400 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +{item.impactPercent}% Delay Probability
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5" />
                        {item.impactPercent}% Delay Probability
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar visual */}
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden flex items-center">
                  <div
                    className={`h-full rounded-full ${
                      isPositive
                        ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mathematical Formulation Reference Card */}
      <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-500/20 text-xs space-y-2">
        <div className="flex items-center gap-2 text-sky-400 font-mono font-bold">
          <Info className="w-4 h-4" />
          <span>Shapley Value Theoretical Formulation</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          The TreeSHAP algorithm computes the exact additive attribution for each flight telemetry variable by satisfying the four axiomatic properties: <strong>Efficiency, Symmetry, Dummy (Null), and Additivity</strong>:
        </p>
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-sky-300 text-center text-xs overflow-x-auto">
          ϕᵢ(v) = ∑ [ |S|! (|N| - |S| - 1)! / |N|! ] × [ v(S ∪ {'{i}'}) - v(S) ]
        </div>
      </div>
    </div>
  );
};
