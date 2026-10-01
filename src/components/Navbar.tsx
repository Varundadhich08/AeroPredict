import React from 'react';
import { Plane, Cpu, BarChart3, BookOpen, Sparkles, Navigation } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'dashboard' | 'explorer';
  onNavigate: (view: 'home' | 'dashboard' | 'explorer') => void;
  onOpenPredictionModal: () => void;
  onOpenDocs: () => void;
  hasResult: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenPredictionModal,
  onOpenDocs,
  hasResult,
}) => {
  return (
    <header className="relative z-30 w-full border-b border-slate-800/80 bg-[#05070A]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-base font-extrabold font-display tracking-tight text-white flex items-center gap-1.5">
              <span>AEROPREDICT</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950 border border-sky-500/30 text-sky-400 font-normal">
                ML-OPS
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 -mt-0.5">
              Flight Delay Prediction System
            </div>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-mono">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentView === 'home'
                ? 'bg-slate-800/80 text-sky-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Home / Radar
          </button>

          {hasResult && (
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-slate-800/80 text-sky-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              Operations Dashboard
            </button>
          )}

          <button
            onClick={() => onNavigate('explorer')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentView === 'explorer'
                ? 'bg-slate-800/80 text-sky-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Schedule Explorer
          </button>

          <button
            onClick={onOpenDocs}
            className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>ML Architecture</span>
          </button>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <button
            id="nav-btn-predict"
            onClick={onOpenPredictionModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-sky-500/25 active:scale-98 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-200" />
            <span>Start Prediction</span>
          </button>
        </div>
      </div>
    </header>
  );
};
