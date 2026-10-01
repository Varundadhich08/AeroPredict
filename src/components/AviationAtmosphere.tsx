import React, { useEffect, useState } from 'react';
import { Plane, Radio, Volume2, VolumeX } from 'lucide-react';
import { airportAudio } from '../utils/audioAmbience';

interface AviationAtmosphereProps {
  onAudioToggle?: (isMuted: boolean) => void;
}

export const AviationAtmosphere: React.FC<AviationAtmosphereProps> = () => {
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [radarAngle, setRadarAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle((prev) => (prev + 3) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const handleAudioToggle = () => {
    const muted = airportAudio.toggleMute();
    setIsAudioMuted(muted);
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Subtle Dark Vignette & Terminal Glass Reflection */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.18),rgba(255,255,255,0))]" />

      {/* 2. Top-Right ATC Sound Controller & Telemetry Badge */}
      <div className="absolute top-5 right-6 z-20 pointer-events-auto flex items-center gap-3">
        <button
          id="btn-airport-audio-toggle"
          onClick={handleAudioToggle}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-xs font-mono text-slate-300 hover:text-sky-300 hover:border-sky-500/50 transition-all duration-200 shadow-lg cursor-pointer"
          title={isAudioMuted ? 'Unmute Airport & Jet Engine Ambience' : 'Mute Airport Ambience'}
        >
          {isAudioMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              <span>SOUND: OFF</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-emerald-300">ATC & JET: ON</span>
            </>
          )}
        </button>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-slate-800 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <Radio className="w-3.5 h-3.5 text-sky-400" />
          <span>RADAR 133.85 MHz</span>
        </div>
      </div>

      {/* 3. Floating Atmospheric Clouds */}
      <div
        className="absolute -top-20 left-0 w-[140%] h-72 opacity-25 filter blur-3xl pointer-events-none bg-gradient-to-r from-transparent via-sky-900 to-transparent"
        style={{
          animation: 'floatCloud 48s linear infinite',
        }}
      />

      {/* 4. Realistic Air Traffic Control Mini-Radar in Background Corner */}
      <div className="hidden lg:block absolute bottom-6 right-8 w-44 h-44 rounded-full border border-sky-500/20 bg-slate-950/60 backdrop-blur-md p-2 pointer-events-none shadow-2xl">
        <div className="relative w-full h-full rounded-full border border-sky-500/30 flex items-center justify-center overflow-hidden">
          {/* Concentric distance rings (5nm, 10nm, 15nm) */}
          <div className="absolute w-3/4 h-3/4 rounded-full border border-sky-500/20 border-dashed" />
          <div className="absolute w-1/2 h-1/2 rounded-full border border-sky-500/20" />
          <div className="absolute w-1/4 h-1/4 rounded-full border border-sky-500/30" />
          <div className="absolute w-full h-[1px] bg-sky-500/20" />
          <div className="absolute h-full w-[1px] bg-sky-500/20" />

          {/* Radar Sweep Beam */}
          <div
            className="absolute inset-0 origin-center"
            style={{
              transform: `rotate(${radarAngle}deg)`,
              background: 'conic-gradient(from 0deg, rgba(56, 189, 248, 0.45) 0deg, rgba(56, 189, 248, 0) 60deg)',
            }}
          />

          {/* Aircraft Radar Blips */}
          <div className="absolute top-6 right-10 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[9px] font-mono text-emerald-400">AI302</span>
          </div>
          <div className="absolute bottom-9 left-7 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span className="text-[9px] font-mono text-sky-400">EK502</span>
          </div>
          <div className="absolute top-14 left-10 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[9px] font-mono text-amber-400">6E541</span>
          </div>

          <div className="absolute bottom-1 right-2 text-[8px] font-mono text-sky-400/60 uppercase">
            PRIMARY SURVEILLANCE
          </div>
        </div>
      </div>

      {/* 5. Transiting High-Altitude Commercial Jet Silhouette (Moving smoothly across the sky) */}
      <div
        className="absolute top-24 -left-20 pointer-events-none opacity-40 hover:opacity-100 transition-opacity"
        style={{
          animation: 'floatCloud 38s linear infinite',
        }}
      >
        <div className="flex items-center gap-3">
          <Plane className="w-5 h-5 text-sky-300 transform rotate-45 filter drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
          <div className="w-36 h-[1px] bg-gradient-to-r from-sky-400/40 to-transparent" />
        </div>
      </div>
    </div>
  );
};
