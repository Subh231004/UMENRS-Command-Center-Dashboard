import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  ShieldAlert, 
  Flame, 
  Droplet, 
  Mountain, 
  ShieldCheck,
  CloudSun,
  Wind,
  Eye
} from 'lucide-react';


export const HazardSummaryPanel: React.FC = () => {
  const { weather } = useDashboard();

  // Custom visual breakdowns
  const hazardData = [
    { name: 'Fire Zones', count: 1, color: 'text-red-400', barBg: 'bg-red-500', icon: Flame },
    { name: 'Flood Zones', count: 1, color: 'text-blue-400', barBg: 'bg-blue-500', icon: Droplet },
    { name: 'Landslide', count: 1, color: 'text-yellow-400', barBg: 'bg-yellow-500', icon: Mountain },
    { name: 'Safe Areas', count: 3, color: 'text-green-400', barBg: 'bg-green-500', icon: ShieldCheck }
  ];

  const totalThreats = 3;

  return (
    <div className="glass-card flex flex-col rounded-xl p-4 border border-white/6 h-full justify-between gap-4">
      {/* Upper: Hazard Summary */}
      <div>
        <div className="flex items-center justify-between border-b border-white/8 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-400" />
            <h3 className="font-semibold text-xs uppercase tracking-widest text-slate-200 font-display">
              HAZARD SUMMARY
            </h3>
          </div>
          <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            Zone Analytics
          </span>
        </div>

        {/* Hazard Grid with mini Donut Chart */}
        <div className="mt-4 flex items-center justify-between gap-4">
          {/* Legend and stats */}
          <div className="flex-1 space-y-2.5">
            {hazardData.map((h, idx) => {
              const Icon = h.icon;
              return (
                <div key={idx} className="flex flex-col">
                  <div className="flex items-center justify-between text-[10px] font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Icon className={`h-3.5 w-3.5 ${h.color}`} />
                      {h.name}
                    </span>
                    <span className="font-mono text-slate-200">{h.count} zones</span>
                  </div>
                  {/* Progress bar count indicator */}
                  <div className="h-1 w-full bg-white/5 rounded-full mt-1.5 overflow-hidden">
                    <div className={`h-full ${h.barBg}`} style={{ width: `${(h.count / 4) * 100}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Minimalist SVG Donut Chart */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg width="70" height="70" viewBox="0 0 36 36" className="w-18 h-18">
              {/* Empty baseline */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3.5" />
              {/* Fire Segment */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ef4444" strokeWidth="3.5" strokeDasharray="33 100" strokeDashoffset="25" />
              {/* Flood Segment */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeDasharray="33 100" strokeDashoffset="92" />
              {/* Landslide Segment */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="34 100" strokeDashoffset="59" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-mono text-xs font-black text-slate-100">{totalThreats}</span>
              <span className="text-[6px] font-bold text-slate-500 uppercase tracking-widest leading-none">threats</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lower: Weather Widget */}
      <div className="border-t border-white/5 pt-4">
        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
          <CloudSun className="h-4 w-4 text-blue-400" /> METEOROLOGICAL HUD
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-slate-950/40 border border-white/5 p-2 font-mono">
            <div className="text-xs font-black text-slate-100">{weather.temperature}°C</div>
            <div className="text-[7px] text-slate-500 uppercase font-bold tracking-wider mt-0.5">Temp</div>
          </div>
          <div className="rounded-lg bg-slate-950/40 border border-white/5 p-2 font-mono">
            <div className="text-[10px] font-black text-slate-100 flex items-center justify-center gap-0.5">
              <Wind className="h-3 w-3 text-slate-400" /> {weather.windSpeed}
            </div>
            <div className="text-[7px] text-slate-500 uppercase font-bold tracking-wider mt-0.5">Wind ({weather.windDirection})</div>
          </div>
          <div className="rounded-lg bg-slate-950/40 border border-white/5 p-2 font-mono">
            <div className="text-xs font-black text-slate-100 flex items-center justify-center gap-0.5">
              <Eye className="h-3 w-3 text-slate-400" /> {weather.visibility}k
            </div>
            <div className="text-[7px] text-slate-500 uppercase font-bold tracking-wider mt-0.5">Visibility</div>
          </div>
        </div>
      </div>
    </div>
  );
};
