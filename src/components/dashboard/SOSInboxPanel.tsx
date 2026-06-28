import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  AlertTriangle, 
  MapPin, 
  UserCheck, 
  CheckCircle,
  Truck,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

export const SOSInboxPanel: React.FC = () => {
  const { sosMessages, acknowledgeSOS, dispatchTeam, triggerFlyTo } = useDashboard();

  const getSeverityStyle = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'border-red-500/30 bg-red-950/20 text-red-400 glow-red border-t-4';
      case 'Serious':
        return 'border-amber-500/30 bg-amber-950/20 text-amber-400 border-t-4';
      default:
        return 'border-blue-500/30 bg-blue-950/20 text-blue-400 border-t-4';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Unacknowledged':
        return 'bg-red-500/10 text-red-400 border border-red-500/25 animate-pulse';
      case 'Acknowledged':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/25';
      default:
        return 'bg-green-500/10 text-green-400 border border-green-500/25';
    }
  };

  return (
    <div className="glass-card flex flex-col rounded-xl p-4 border border-white/6 h-full justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/8 pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-400 animate-pulse" />
          <h3 className="font-semibold text-xs uppercase tracking-widest text-slate-200 font-display">
            LIVE SOS INBOX
          </h3>
        </div>
        <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest">
          {sosMessages.filter(s => s.status === 'Unacknowledged').length} Active
        </span>
      </div>

      {/* Cards List */}
      <div className="mt-4 flex-1 space-y-3 overflow-y-auto max-h-[360px] pr-1">
        {sosMessages.map((sos) => (
          <motion.div
            key={sos.id}
            layout
            className={`rounded-xl border p-3 flex flex-col transition hover:bg-slate-900/40 ${getSeverityStyle(sos.injuryLevel)}`}
          >
            {/* Title Line */}
            <div className="flex justify-between items-start gap-1">
              <div>
                <h4 className="text-xs font-bold text-slate-100">{sos.victimName}</h4>
                <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-slate-400 font-mono">
                  <Users className="h-3 w-3 text-slate-500" />
                  <span>{sos.peopleCount} individuals</span>
                  <span>•</span>
                  <span>{sos.time}</span>
                </div>
              </div>
              <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${getStatusBadge(sos.status)}`}>
                {sos.status}
              </span>
            </div>

            {/* Message details */}
            <p className="mt-2 text-[11px] text-slate-300 leading-normal bg-black/25 p-2 rounded border border-white/5 font-sans italic">
              "{sos.message}"
            </p>

            {/* Coords details */}
            <div className="mt-2 flex items-center gap-1 text-[9px] text-slate-500 font-mono">
              <MapPin className="h-3 w-3" />
              <span>GPS: {sos.coords[0].toFixed(5)}, {sos.coords[1].toFixed(5)}</span>
            </div>

            {/* Action buttons */}
            <div className="mt-3 flex items-center gap-2">
              {/* Fly to on map */}
              <button
                onClick={() => triggerFlyTo(sos.coords)}
                className="flex-1 flex items-center justify-center gap-1 text-[10px] font-bold uppercase py-1.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition text-slate-300"
              >
                <MapPin className="h-3 w-3 text-blue-400" /> Track Map
              </button>

              {/* Acknowledge Action */}
              {sos.status === 'Unacknowledged' && (
                <button
                  onClick={() => acknowledgeSOS(sos.id)}
                  className="flex-1 flex items-center justify-center gap-1 text-[10px] font-bold uppercase py-1.5 rounded bg-amber-600/20 border border-amber-500/30 text-amber-400 hover:bg-amber-600/35 transition"
                >
                  <UserCheck className="h-3 w-3" /> Acknowledge
                </button>
              )}

              {/* Dispatch Action */}
              {sos.status !== 'Dispatched' && (
                <button
                  onClick={() => dispatchTeam(sos.id)}
                  className="flex-1 flex items-center justify-center gap-1 text-[10px] font-bold uppercase py-1.5 rounded bg-green-600/25 border border-green-500/30 text-green-400 hover:bg-green-600/40 transition"
                >
                  <Truck className="h-3 w-3" /> Dispatch
                </button>
              )}

              {sos.status === 'Dispatched' && (
                <div className="flex-1 flex items-center justify-center gap-1 text-[9px] font-bold uppercase py-1.5 text-green-400 bg-green-500/5 rounded border border-green-500/10">
                  <CheckCircle className="h-3 w-3" /> Team Route Active
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
