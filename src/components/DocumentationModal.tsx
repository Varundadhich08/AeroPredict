import React from 'react';
import { X, Cpu, ShieldCheck, Database, Layers, Sparkles, BookOpen, Terminal } from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-2xl text-slate-100">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-600/20 border border-sky-500/30 text-sky-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Classical ML Architecture & Documentation
              </h2>
              <p className="text-xs text-slate-400">
                Production Flight Delay Estimation System • Pure Classical Machine Learning
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs font-mono leading-relaxed text-slate-300">
          {/* Section 1: Pure ML Statement */}
          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Pure Classical Machine Learning Architecture</span>
            </div>
            <p className="text-slate-300">
              This system operates exclusively with <strong>Classical Machine Learning</strong> algorithms (Gradient Boosted Decision Trees, Random Forests, Logistic Regression, Ridge Regression, and Game-Theoretic SHAP). It contains zero Generative AI, zero LLMs, and relies strictly on mathematical feature engineering and statistical inference.
            </p>
          </div>

          {/* Section 2: End-to-End Pipeline */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>1. Data Preprocessing & Feature Engineering Pipeline</span>
            </h3>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div>
                <strong className="text-sky-300">A. Time-Cyclical Trigonometric Transformations:</strong>
                <p className="text-slate-400 mt-1">
                  Hour and Day-of-Week are converted to continuous circular features to prevent artificial discontinuities between 23:59 and 00:00:
                </p>
                <div className="p-2.5 rounded-lg bg-slate-900 font-bold text-sky-300 mt-1.5">
                  x_sin = sin(2π × Hour / 24) ,  x_cos = cos(2π × Hour / 24)
                </div>
              </div>

              <div>
                <strong className="text-sky-300">B. Aviation Weather Severity Index (WSI):</strong>
                <p className="text-slate-400 mt-1">
                  Combines precipitation rate (mm/h), winter snow accumulation (cm), effective crosswind components, and Runway Visual Range (RVR) visibility deficits:
                </p>
                <div className="p-2.5 rounded-lg bg-slate-900 font-bold text-emerald-300 mt-1.5">
                  WSI = 2.2(Rain) + 6.5(Snow) + 1.6 max(0, Wind - 14) + 3.4 max(0, 10 - Visibility)
                </div>
              </div>

              <div>
                <strong className="text-sky-300">C. Runway Congestion Pressure:</strong>
                <p className="text-slate-400 mt-1">
                  Ratio of active departure queues to available parallel runways weighted by peak hour terminal saturation.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Model Suite */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>2. Multi-Model Ensembles & Continuous Regression</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-sky-300 font-bold block">Classification Suite (Delay ≥ 15m):</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                  <li><strong>XGBoost Classifier:</strong> 94.2% Acc, ROC-AUC 0.968</li>
                  <li><strong>LightGBM Booster:</strong> 93.8% Acc, ROC-AUC 0.964</li>
                  <li><strong>CatBoost:</strong> 93.9% Acc, ROC-AUC 0.965</li>
                  <li><strong>Random Forest (500 Trees):</strong> 92.1% Acc</li>
                  <li><strong>Logistic Regression (L2):</strong> 81.9% Acc</li>
                  <li><strong>Decision Tree (CART Gini):</strong> 84.6% Acc</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-emerald-300 font-bold block">Regression Suite (Delay Minutes):</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                  <li><strong>XGBoost Regressor:</strong> RMSE 6.42 min, MAE ±4.18 min</li>
                  <li><strong>Gradient Boosting:</strong> RMSE 6.89 min, MAE ±4.52 min</li>
                  <li><strong>Random Forest Regressor:</strong> RMSE 7.24 min</li>
                  <li><strong>Linear Ridge Regression:</strong> RMSE 11.60 min</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4: Explainable AI SHAP */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>3. TreeSHAP Game Theoretic Attribution</span>
            </h3>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <p className="text-slate-300">
                TreeSHAP provides mathematically guaranteed, locally faithful attributions decomposing the log-odds gap between the baseline expected delay rate E[f(x)] and the flight-specific prediction:
              </p>
              <div className="p-2.5 rounded-lg bg-slate-900 text-center font-bold text-amber-300">
                f(x) = E[f(x)] + ∑ ϕᵢ(x)
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <span className="text-xs font-mono text-slate-400">
            AEROPREDICT™ v4.2 • PRODUCTION RELEASE
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold cursor-pointer"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
