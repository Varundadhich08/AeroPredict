import React, { useEffect, useRef, useState } from 'react';
import { Plane, MapPin, Wind, Compass, Navigation, Radio, Gauge } from 'lucide-react';
import { FlightRoute, WeatherTelemetry } from '../../types';

interface InteractiveFlightMapProps {
  flight: FlightRoute;
  weather: WeatherTelemetry;
}

export const InteractiveFlightMap: React.FC<InteractiveFlightMapProps> = ({ flight, weather }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animProgress, setAnimProgress] = useState(0.45);

  // Flight Route Coordinate Projection (Mercator 2D Projection helper)
  const mapWidth = 900;
  const mapHeight = 460;

  const projectCoord = (lat: number, lng: number) => {
    // Standard Mercator projection mapping
    const x = ((lng + 180) / 360) * mapWidth;
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = mapHeight / 2 - (mapWidth * mercN) / (2 * Math.PI);
    return {
      x: Math.max(30, Math.min(mapWidth - 30, x)),
      y: Math.max(30, Math.min(mapHeight - 30, y)),
    };
  };

  const originPoint = projectCoord(flight.origin.lat, flight.origin.lng);
  const destPoint = projectCoord(flight.destination.lat, flight.destination.lng);

  useEffect(() => {
    let t = 0;
    let reqId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      t = (t + 0.004) % 1;
      setAnimProgress(t);

      ctx.clearRect(0, 0, mapWidth, mapHeight);

      // Draw Grid / Lat-Long graticule lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < mapWidth; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, mapHeight);
        ctx.stroke();
      }
      for (let y = 0; y < mapHeight; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(mapWidth, y);
        ctx.stroke();
      }

      // Draw World Continents simplified vector backdrop
      ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
      ctx.lineWidth = 1;

      // Geodesic Great Circle Arc
      const controlX = (originPoint.x + destPoint.x) / 2;
      const controlY = Math.min(originPoint.y, destPoint.y) - 75; // Arch upwards

      // Path Glow
      ctx.beginPath();
      ctx.moveTo(originPoint.x, originPoint.y);
      ctx.quadraticCurveTo(controlX, controlY, destPoint.x, destPoint.y);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Dashed Line
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(originPoint.x, originPoint.y);
      ctx.quadraticCurveTo(controlX, controlY, destPoint.x, destPoint.y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      // Current Plane Position along Quadratic Bezier Curve: B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
      const planeX =
        Math.pow(1 - t, 2) * originPoint.x + 2 * (1 - t) * t * controlX + Math.pow(t, 2) * destPoint.x;
      const planeY =
        Math.pow(1 - t, 2) * originPoint.y + 2 * (1 - t) * t * controlY + Math.pow(t, 2) * destPoint.y;

      // Tangent vector for plane heading angle
      const dx = 2 * (1 - t) * (controlX - originPoint.x) + 2 * t * (destPoint.x - controlX);
      const dy = 2 * (1 - t) * (controlY - originPoint.y) + 2 * t * (destPoint.y - controlY);
      const headingAngle = Math.atan2(dy, dx);

      // Radar Pulse around Plane
      ctx.beginPath();
      ctx.arc(planeX, planeY, 14 + Math.sin(t * 20) * 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Plane Icon
      ctx.save();
      ctx.translate(planeX, planeY);
      ctx.rotate(headingAngle);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;

      // Draw stylized aircraft triangle
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(-8, -8);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-8, 8);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Origin Pin
      ctx.beginPath();
      ctx.arc(originPoint.x, originPoint.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Destination Pin
      ctx.beginPath();
      ctx.arc(destPoint.x, destPoint.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#f43f5e';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      reqId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(reqId);
  }, [originPoint.x, originPoint.y, destPoint.x, destPoint.y]);

  return (
    <div className="space-y-6">
      {/* Map Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase">
              <Navigation className="w-4 h-4 text-sky-400" />
              <span>Great Circle Navigation & Telemetry</span>
            </div>
            <h2 className="text-xl font-bold text-white font-display mt-1">
              {flight.origin.name} ➔ {flight.destination.name}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>ENROUTE CRUISE • FL370 (37,000 FT)</span>
          </div>
        </div>

        {/* Canvas World Route Container */}
        <div className="relative w-full h-[320px] sm:h-[400px] rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={mapWidth}
            height={mapHeight}
            className="w-full h-full object-cover"
          />

          {/* Origin Airport Badge Overlay */}
          <div
            className="absolute p-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-md shadow-lg text-xs font-mono"
            style={{
              left: `${Math.min(75, Math.max(5, (originPoint.x / mapWidth) * 100))}%`,
              top: `${Math.min(75, Math.max(10, (originPoint.y / mapHeight) * 100))}%`,
              transform: 'translate(-50%, -120%)',
            }}
          >
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{flight.origin.iata} (ORIGIN)</span>
            </div>
            <div className="text-[10px] text-slate-300">{flight.origin.city}</div>
            <div className="text-[9px] text-slate-400 mt-0.5">{weather.conditionName} • {weather.windSpeedKnots} kts</div>
          </div>

          {/* Destination Airport Badge Overlay */}
          <div
            className="absolute p-2.5 rounded-xl bg-slate-900/90 border border-rose-500/40 backdrop-blur-md shadow-lg text-xs font-mono"
            style={{
              left: `${Math.min(85, Math.max(15, (destPoint.x / mapWidth) * 100))}%`,
              top: `${Math.min(75, Math.max(10, (destPoint.y / mapHeight) * 100))}%`,
              transform: 'translate(-50%, -120%)',
            }}
          >
            <div className="flex items-center gap-1.5 text-rose-400 font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{flight.destination.iata} (DESTINATION)</span>
            </div>
            <div className="text-[10px] text-slate-300">{flight.destination.city}</div>
            <div className="text-[9px] text-slate-400 mt-0.5">Runways: {flight.destination.runways} • {flight.destination.timezone}</div>
          </div>

          {/* Compass Rose */}
          <div className="absolute bottom-4 left-4 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-sky-400" />
            <span>GEO PROJECTION: MERCATOR (WGS84)</span>
          </div>
        </div>
      </div>

      {/* Origin vs Destination Airport Detailed Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Origin Airport */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 font-bold">DEPARTURE FACILITY</span>
            <span className="text-xs font-mono text-slate-400">{flight.origin.icao}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-display">{flight.origin.name}</h3>
            <p className="text-xs text-slate-400">{flight.origin.city}, {flight.origin.country}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
            <div>
              <span className="text-slate-400 text-[10px] block">ACTIVE RUNWAYS</span>
              <span className="text-white font-bold">{flight.origin.runways} Runways</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">CONGESTION</span>
              <span className="text-amber-400 font-bold">{flight.origin.congestionIndex}%</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">HISTORICAL DELAY</span>
              <span className="text-white font-bold">{flight.origin.avgDelayMinutes} min</span>
            </div>
          </div>
        </div>

        {/* Destination Airport */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-rose-400 font-bold">ARRIVAL FACILITY</span>
            <span className="text-xs font-mono text-slate-400">{flight.destination.icao}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-display">{flight.destination.name}</h3>
            <p className="text-xs text-slate-400">{flight.destination.city}, {flight.destination.country}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
            <div>
              <span className="text-slate-400 text-[10px] block">ACTIVE RUNWAYS</span>
              <span className="text-white font-bold">{flight.destination.runways} Runways</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">CONGESTION</span>
              <span className="text-sky-400 font-bold">{flight.destination.congestionIndex}%</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">HISTORICAL DELAY</span>
              <span className="text-white font-bold">{flight.destination.avgDelayMinutes} min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
