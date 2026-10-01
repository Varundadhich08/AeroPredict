import React from 'react';
import { Clock, PlaneTakeoff, PlaneLanding, Navigation, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PredictionResult } from '../../types';

interface FlightTimelineProps {
  result: PredictionResult;
}

export const FlightTimeline: React.FC<FlightTimelineProps> = ({ result }) => {
  const { timeline, flight } = result;

  const milestones = [
    {
      label: 'Scheduled Gate Departure',
      time: timeline.scheduledGateDeparture,
      sub: `Terminal ${flight.terminal}, Gate ${flight.gate}`,
      icon: Clock,
      status: 'scheduled',
    },
    {
      label: 'Predicted Pushback & Departure',
      time: timeline.predictedGateDeparture,
      sub: `${result.expectedDelayMinutes > 0 ? `+${result.expectedDelayMinutes} min variance` : 'On schedule'}`,
      icon: Navigation,
      status: result.expectedDelayMinutes > 15 ? 'delayed' : 'ontime',
    },
    {
      label: 'Taxi-Out & Wheels Up (Takeoff)',
      time: timeline.estimatedWheelsUp,
      sub: `Estimated ${timeline.estimatedTaxiOutMinutes} min taxi queue`,
      icon: PlaneTakeoff,
      status: 'estimated',
    },
    {
      label: 'Enroute Cruise Duration',
      time: `${Math.floor(timeline.estimatedFlightDurationMinutes / 60)}h ${timeline.estimatedFlightDurationMinutes % 60}m`,
      sub: `${flight.distanceMiles} Nautical Miles • Mach 0.82`,
      icon: Navigation,
      status: 'enroute',
    },
    {
      label: 'Wheels Down (Landing)',
      time: timeline.estimatedWheelsDown,
      sub: `${flight.destination.iata} Runway Approach`,
      icon: PlaneLanding,
      status: 'estimated',
    },
    {
      label: 'Predicted Gate Arrival',
      time: timeline.predictedGateArrival,
      sub: `Sched: ${timeline.scheduledGateArrival} (${result.timeline.delayAtArrivalMinutes > 0 ? `+${result.timeline.delayAtArrivalMinutes}m arrival delay` : 'On Time'})`,
      icon: CheckCircle2,
      status: result.timeline.delayAtArrivalMinutes > 15 ? 'delayed' : 'ontime',
    },
  ];

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Flight Operation Milestones & Block-Time Decomposition</span>
          </div>
          <h2 className="text-xl font-bold text-white font-display mt-1">
            Dispatch Phase Milestones
          </h2>
        </div>

        <div className="text-xs font-mono text-slate-400">
          TOTAL FLIGHT BLOCK: {Math.floor(timeline.estimatedFlightDurationMinutes / 60)}h{' '}
          {timeline.estimatedFlightDurationMinutes % 60}m
        </div>
      </div>

      {/* Responsive Milestones Timeline Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {milestones.map((item, idx) => {
          const Icon = item.icon;
          const isDelay = item.status === 'delayed';
          const isOntime = item.status === 'ontime';

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                isDelay
                  ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                  : isOntime
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-slate-400">PHASE 0{idx + 1}</span>
                  <Icon className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-xs font-medium text-slate-300 line-clamp-1">{item.label}</div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80">
                <div className="text-lg font-bold font-mono text-white">{item.time}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{item.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
