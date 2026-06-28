import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Scan, 
  MapPin, 
  Percent, 
  Eye,
  Radio
} from 'lucide-react';


const ThermalSnapshot: React.FC<{ type: 'heat' | 'infrared' | 'silhouette' }> = ({ type }) => {
  return (
    <div className="relative h-14 w-22 overflow-hidden rounded-lg border border-white/10 bg-slate-950 flex items-center justify-center shrink-0">
      {/* Animated thermal hot-spot gradient */}
      <div 
        className="absolute inset-0 filter blur-xs animate-pulse opacity-90"
        style={{
          background: type === 'heat' 
            ? 'radial-gradient(circle, rgba(239,68,68,1) 0%, rgba(245,158,11,0.8) 40%, rgba(30,41,59,0.9) 100%)' 
            : type === 'silhouette'
            ? 'radial-gradient(circle at 60% 40%, rgba(220,38,38,1) 0%, rgba(13,148,136,0.5) 45%, rgba(15,23,42,0.9) 100%)'
            : 'radial-gradient(circle, rgba(219,39,119,1) 0%, rgba(124,58,237,0.7) 40%, rgba(15,23,42,0.9) 100%)'
        }}
      />
      {/* Target Reticle Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-7 w-7 border border-dashed border-white/20 rounded-full animate-spin" style={{ animationDuration: '15s' }} />
        <div className="absolute h-5 w-[1px] bg-white/25"></div>
        <div className="absolute w-5 h-[1px] bg-white/25"></div>
        <div className="h-1 w-1 bg-red-400 rounded-full"></div>
      </div>
      <span className="absolute bottom-0.5 right-1 text-[6px] font-mono text-slate-400 tracking-wider bg-slate-950/80 px-1 rounded-sm uppercase">
        {type}
      </span>
    </div>
  );
};

export const SurvivorPanel: React.FC = () => {
  const { survivors, triggerFlyTo } = useDashboard();

  return (
    <div className="glass-card flex flex-col rounded-xl p-4 border border-white/6 h-full justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/8 pb-3">
        <div className="flex items-center gap-2">
          <Scan className="h-5 w-5 text-green-400 animate-pulse" />
          <h3 className="font-semibold text-xs uppercase tracking-widest text-slate-200 font-display">
            AI SURVIVOR DETECTION
          </h3>
        </div>
        <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest">
          Thermal Feeds
        </span>
      </div>

      {/* Detections List */}
      <div className="mt-4 flex-1 space-y-3 overflow-y-auto max-h-[300px] pr-1">
        {survivors.map((surv) => (
          <div
            key={surv.id}
            className="rounded-xl border border-white/5 bg-slate-950/20 p-2.5 flex items-center gap-3 transition hover:bg-slate-900/30"
          >
            {/* Thermal Snapshot */}
            <ThermalSnapshot type={surv.thermalSnapshotType} />

            {/* Info Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-200">{surv.id}</span>
                <div className="flex items-center text-green-400 font-mono text-[10px] font-bold">
                  <Percent className="h-3 w-3 shrink-0" />
                  <span>{surv.confidence}%</span>
                </div>
              </div>

              {/* Coordinates & Node distance */}
              <div className="mt-1 space-y-0.5 text-[9px] text-slate-400 font-mono">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                  <span>GPS: {surv.coords[0].toFixed(4)}, {surv.coords[1].toFixed(4)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Radio className="h-3 w-3 text-slate-500 shrink-0" />
                  <span>Distance: {surv.distance}m from Node</span>
                </div>
                <div className="text-[8px] text-slate-500">
                  Detected at {surv.time} via {surv.uavId}
                </div>
              </div>
            </div>

            {/* Target Button */}
            <button
              onClick={() => triggerFlyTo(surv.coords)}
              title="Track coordinates on map"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-100 transition shrink-0"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
