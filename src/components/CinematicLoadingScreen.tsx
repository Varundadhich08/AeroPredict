import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Radio, Cpu, Sparkles, Database, CloudRain, ShieldCheck } from 'lucide-react';
import { airportAudio } from '../utils/audioAmbience';

interface CinematicLoadingScreenProps {
  onComplete: () => void;
  flightNumber: string;
  airlineName: string;
}

const PIPELINE_STEPS = [
  { text: 'Querying historical flight telemetry archive...', icon: Database, duration: 400 },
  { text: 'Ingesting METAR meteorological sensor streams...', icon: CloudRain, duration: 450 },
  { text: 'Decomposing crosswind vectors & runway braking index...', icon: Radio, duration: 450 },
  { text: 'Calculating terminal departure queue pressure...', icon: Plane, duration: 400 },
  { text: 'Executing Classical ML Ensembles (XGBoost, Random Forest)...', icon: Cpu, duration: 550 },
  { text: 'Estimating expected delay minutes regression...', icon: ShieldCheck, duration: 450 },
  { text: 'Computing game-theoretic TreeSHAP feature attributions...', icon: Sparkles, duration: 400 },
  { text: 'Finalizing Operations Dispatch Dashboard...', icon: ShieldCheck, duration: 300 },
];

export const CinematicLoadingScreen: React.FC<CinematicLoadingScreenProps> = ({
  onComplete,
  flightNumber,
  airlineName,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    let currentIdx = 0;
    let progress = 0;

    const interval = setInterval(() => {
      progress += 1.8;
      setProgressPercent(Math.min(100, Math.round(progress)));

      const stepIndex = Math.min(
        PIPELINE_STEPS.length - 1,
        Math.floor((progress / 100) * PIPELINE_STEPS.length)
      );
      if (stepIndex !== currentIdx) {
        currentIdx = stepIndex;
        setCurrentStepIdx(stepIndex);
      }

      if (progress >= 100) {
        clearInterval(interval);
        airportAudio.playPredictionSuccessSound();
        setTimeout(() => {
          onComplete();
        }, 350);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  const CurrentIcon = PIPELINE_STEPS[currentStepIdx]?.icon || Cpu;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-2xl text-slate-100 p-6">
      {/* 1. Cinematic Airport Runway Perspective & Aircraft Lift-off Animation */}
      <div className="relative w-full max-w-xl h-64 mb-8 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-blue-950/30 to-slate-900/60 border border-slate-800/80 shadow-2xl">
        {/* Runway Tarmac perspective lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Vanishing point lines */}
          <div className="w-0 h-0 border-l-[180px] border-l-transparent border-r-[180px] border-r-transparent border-b-[260px] border-b-slate-900/80 opacity-60" />
          {/* Runway Centerline Strobes */}
          <div className="absolute inset-y-0 w-1 flex flex-col justify-between py-2">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-4 bg-sky-400 rounded-full runway-light-active"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Radar Sweep Rings in background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-56 h-56 rounded-full border border-sky-400/40 animate-ping" />
          <div className="w-40 h-40 rounded-full border border-sky-400/60" />
          <div className="w-24 h-24 rounded-full border border-sky-400/80" />
        </div>

        {/* Dynamic Jet Lifting Off with Particle Trail */}
        <motion.div
          animate={{
            y: [60, -20, -70],
            scale: [0.75, 1.1, 1.35],
            rotate: [-1, -8, -12],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="relative">
            <Plane className="w-16 h-16 text-sky-400 filter drop-shadow-[0_0_20px_rgba(56,189,248,0.9)]" />
            {/* Wingtip strobe flashes */}
            <span className="absolute top-6 -left-2 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="absolute top-6 -right-2 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          {/* Engine Exhaust Jet Contrail */}
          <div className="w-1.5 h-16 bg-gradient-to-b from-sky-400/80 via-blue-500/40 to-transparent blur-[1px] -mt-1" />
        </motion.div>

        {/* Flight Badge overlay */}
        <div className="absolute top-3 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-xs font-mono text-sky-300">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span>DISPATCH: {flightNumber} ({airlineName})</span>
        </div>

        <div className="absolute bottom-3 right-4 text-[10px] font-mono text-slate-400">
          RUNWAY 28L / CAT-III ILS
        </div>
      </div>

      {/* 2. Pipeline Status Message Carousel */}
      <div className="w-full max-w-md text-center space-y-4">
        <div className="flex items-center justify-center gap-2.5 h-8">
          <CurrentIcon className="w-5 h-5 text-sky-400 animate-spin" />
          <AnimatePresence mode="wait">
            <motion.span
              key={currentStepIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-mono text-slate-200"
            >
              {PIPELINE_STEPS[currentStepIdx]?.text}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* 3. High-Precision Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]"
              style={{ width: `${progressPercent}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-xs font-mono text-slate-400 px-1">
            <span>INFERENCE PIPELINE</span>
            <span className="text-sky-300 font-bold">{progressPercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
