import React, { useState } from 'react';
import { Search, Plane, ArrowUpRight, Clock, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { FLIGHTS_DATABASE, AIRLINES } from '../data/flightsDatabase';
import { FlightRoute } from '../types';

interface FlightExplorerProps {
  onSelectFlightForPrediction: (flight: FlightRoute) => void;
}

export const FlightExplorer: React.FC<FlightExplorerProps> = ({ onSelectFlightForPrediction }) => {
  const [search, setSearch] = useState('');
  const [selectedAirline, setSelectedAirline] = useState('ALL');

  const filteredFlights = FLIGHTS_DATABASE.filter((flight) => {
    const matchesSearch =
      flight.flightNumber.toLowerCase().includes(search.toLowerCase()) ||
      flight.airlineName.toLowerCase().includes(search.toLowerCase()) ||
      flight.origin.city.toLowerCase().includes(search.toLowerCase()) ||
      flight.destination.city.toLowerCase().includes(search.toLowerCase()) ||
      flight.origin.iata.toLowerCase().includes(search.toLowerCase()) ||
      flight.destination.iata.toLowerCase().includes(search.toLowerCase());

    const matchesAirline = selectedAirline === 'ALL' || flight.airlineCode === selectedAirline;

    return matchesSearch && matchesAirline;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-8">
      {/* Flight Explorer Header */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase">
              <Plane className="w-4 h-4 text-sky-400" />
              <span>International Flight Telemetry Schedule</span>
            </div>
            <h2 className="text-2xl font-bold text-white font-display mt-1">
              Global Flight Operations & Dispatch Board
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live schedule feed with baseline ML risk indicators. Select any flight to launch full predictive inference.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search flight, airline, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Airline Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          <span className="text-slate-500 text-[11px] whitespace-nowrap">FILTER AIRLINE:</span>
          <button
            onClick={() => setSelectedAirline('ALL')}
            className={`px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
              selectedAirline === 'ALL'
                ? 'bg-blue-600/30 text-sky-300 border-blue-500 font-bold'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            All Airlines ({FLIGHTS_DATABASE.length})
          </button>
          {Object.values(AIRLINES).map((airline) => (
            <button
              key={airline.code}
              onClick={() => setSelectedAirline(airline.code)}
              className={`px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                selectedAirline === airline.code
                  ? 'bg-blue-600/30 text-sky-300 border-blue-500 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {airline.name}
            </button>
          ))}
        </div>
      </div>

      {/* Flight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFlights.map((flight) => {
          const airline = AIRLINES[flight.airlineCode];
          const riskLevel =
            flight.baseDelayRate > 0.35
              ? { label: 'ELEVATED RISK', color: 'text-rose-400 border-rose-500/40 bg-rose-950/30' }
              : flight.baseDelayRate > 0.22
              ? { label: 'MODERATE RISK', color: 'text-amber-400 border-amber-500/40 bg-amber-950/30' }
              : { label: 'LOW RISK', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30' };

          return (
            <div
              key={flight.flightNumber}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 hover:shadow-xl group"
            >
              <div className="space-y-3">
                {/* Airline & Status badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: airline?.color || '#3b82f6' }}
                    />
                    <span className="font-semibold text-white text-xs">{flight.airlineName}</span>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${riskLevel.color}`}>
                    {riskLevel.label}
                  </span>
                </div>

                {/* Flight Number & Route */}
                <div>
                  <div className="text-2xl font-bold font-mono text-white tracking-tight">
                    {flight.flightNumber}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300 mt-1">
                    <span className="text-sky-300 font-bold">{flight.origin.city} ({flight.origin.iata})</span>
                    <span>➔</span>
                    <span className="text-sky-300 font-bold">{flight.destination.city} ({flight.destination.iata})</span>
                  </div>
                </div>

                {/* Schedule & Aircraft info */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div>
                    <span className="text-slate-400 text-[10px] block">SCHEDULED</span>
                    <span className="text-white font-semibold">{flight.scheduledDeparture} ➔ {flight.scheduledArrival}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">DISTANCE</span>
                    <span className="text-white font-semibold">{flight.distanceMiles} miles</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectFlightForPrediction(flight)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-sky-600 border border-slate-700 hover:border-sky-500 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer group-hover:shadow-lg"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400 group-hover:text-white" />
                <span>Predict Delay For This Flight</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
