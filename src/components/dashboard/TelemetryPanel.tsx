import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Compass, 
  Battery, 
  Gauge, 
  TrendingUp, 
  Satellite, 
  Wifi, 
  ShieldAlert,
  PlaneTakeoff,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export const TelemetryPanel: React.FC = () => {
  const { uavs, selectedUavId, setSelectedUavId } = useDashboard();

  const currentUAV = uavs.find(u => u.id === selectedUavId) || uavs[0];

  // Battery circle circumference details
  // Radius = 30, Circumference = 2 * pi * 30 = 188.4
  const radius = 30;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (currentUAV.battery / 100) * circumference;

  const getBatteryColor = (percent: number) => {
    if (percent > 60) return 'stroke-green-500 text-green-400';
    if (percent > 25) return 'stroke-amber-500 text-amber-400';
    return 'stroke-red-500 text-red-500 animate-pulse';
  };

  const getSignalColor = (sig: number) => {
    if (sig > 85) return 'text-green-400';
    if (sig > 50) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="glass-card flex flex-col rounded-xl p-4 border border-white/6 h-full justify-between">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-white/8 pb-3">
        <div className="flex items-center gap-2">
          <PlaneTakeoff className="h-5 w-5 text-blue-400" />
          <h3 className="font-semibold text-xs uppercase tracking-widest text-slate-200 font-display">
            UAV FLEET TELEMETRY
          </h3>
        </div>

        {/* Dropdown Selector */}
        <select 
          value={selectedUavId || ''} 
          onChange={(e) => setSelectedUavId(e.target.value)}
          className="h-8 rounded-lg border border-white/10 bg-slate-900 px-2 font-mono text-[10px] font-bold text-slate-200 outline-none focus:border-blue-500/50 cursor-pointer"
        >
          {uavs.map(u => (
            <option key={u.id} value={u.id}>
              {u.id} ({u.status})
            </option>
          ))}
        </select>
      </div>

      {/* Main Grid Indicators */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        
        {/* Battery Circular Gauge */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-slate-950/40 border border-white/5 p-3 text-center">
          <div className="relative flex items-center justify-center">
            <svg height={radius * 2} width={radius * 2}>
              <circle
                stroke="rgba(255,255,255,0.04)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <motion.circle
                className={`gauge-ring ${getBatteryColor(currentUAV.battery)}`}
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            <div className="absolute font-mono text-xs font-black text-slate-200">
              {currentUAV.battery}%
            </div>
          </div>
          <span className="mt-2 text-[8px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Battery className="h-2.5 w-2.5" /> Battery
          </span>
        </div>

        {/* Airspeed Gauge */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-slate-950/40 border border-white/5 p-3 text-center">
          <div className="relative flex h-[48px] w-[48px] items-center justify-center rounded-full border border-white/5 bg-slate-950">
            <span className="font-mono text-xs font-black text-slate-200">{currentUAV.speed}</span>
            <span className="absolute bottom-1.5 text-[6px] font-bold uppercase text-slate-500">km/h</span>
            {/* Speed line indicator */}
            <div 
              className="absolute inset-1.5 border border-transparent border-t-blue-500 rounded-full animate-spin"
              style={{ animationDuration: `${60 / (currentUAV.speed || 1)}s` }}
            />
          </div>
          <span className="mt-2 text-[8px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Gauge className="h-2.5 w-2.5" /> Airspeed
          </span>
        </div>

        {/* Compass Heading Vector */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-slate-950/40 border border-white/5 p-3 text-center">
          <div className="relative flex h-[48px] w-[48px] items-center justify-center rounded-full border border-white/8 bg-slate-950">
            {/* Heading arrow */}
            <motion.div 
              style={{ rotate: currentUAV.heading }}
              animate={{ rotate: currentUAV.heading }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="text-blue-400"
            >
              <Compass className="h-6 w-6" />
            </motion.div>
            <div className="absolute -top-1.5 font-mono text-[7px] font-bold text-slate-500">N</div>
            <div className="absolute -bottom-1.5 font-mono text-[7px] font-bold text-slate-500">{currentUAV.heading}°</div>
          </div>
          <span className="mt-2 text-[8px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <TrendingUp className="h-2.5 w-2.5" /> HEADING
          </span>
        </div>

      </div>

      {/* Altitude and Signal strength metrics */}
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
        {/* Altitude progress */}
        <div className="flex flex-col justify-between rounded-xl bg-slate-950/30 p-2.5 border border-white/5">
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Altitude ceiling</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-sm font-black text-slate-100">{currentUAV.altitude}m</span>
            <span className="text-[8px] text-slate-500">/ 300m max</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${(currentUAV.altitude / 300) * 100}%` }}></div>
          </div>
        </div>

        {/* Signals */}
        <div className="flex flex-col justify-between rounded-xl bg-slate-950/30 p-2.5 border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Comm Signal</span>
            <Wifi className={`h-3 w-3 ${getSignalColor(currentUAV.signal)}`} />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-sm font-black text-slate-100">{currentUAV.signal}%</span>
            <span className="text-[8px] text-slate-500 flex items-center gap-0.5"><Satellite className="h-2.5 w-2.5" /> {currentUAV.gpsSatellites} sats</span>
          </div>
          {/* Signal bar indicator */}
          <div className="flex items-end gap-0.5 h-1.5 mt-2">
            {[1, 2, 3, 4, 5].map((bar) => (
              <div 
                key={bar} 
                className={`flex-1 rounded-sm h-full ${
                  currentUAV.signal >= bar * 20 
                    ? currentUAV.signal < 40 
                      ? 'bg-red-500' 
                      : currentUAV.signal < 75 
                        ? 'bg-amber-500' 
                        : 'bg-green-500'
                    : 'bg-white/5'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Flight Sector Coverage */}
      <div className="mt-4 border-t border-white/5 pt-4">
        <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase">
          <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-amber-400" /> Sector Coverage Index</span>
          <span className="font-mono text-slate-200">{currentUAV.progress}% COMPLETE</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full mt-2 overflow-hidden">
          <motion.div 
            className="h-full bg-blue-500 rounded-full" 
            style={{ width: `${currentUAV.progress}%` }}
            animate={{ width: `${currentUAV.progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Warning display for low assets */}
      {currentUAV.battery < 45 && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-2 text-[10px] text-red-400">
          <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-red-400 animate-bounce" />
          <div>
            <span className="font-bold">LOW ASSET RUNTIME:</span> {currentUAV.id} is discharging rapidly. Recommend routing to base helipad immediately.
          </div>
        </div>
      )}
    </div>
  );
};
