import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Cpu, 
  Database, 
  Network, 
  Radio, 
  ShieldCheck
} from 'lucide-react';


export const SystemHealthPanel: React.FC = () => {
  const { systemHealth, groundNodes } = useDashboard();

  const getStatusLight = (status: string) => {
    switch (status) {
      case 'Healthy':
        return <span className="h-2 w-2 rounded-full bg-green-500 glow-green animate-pulse"></span>;
      case 'Warning':
        return <span className="h-2 w-2 rounded-full bg-amber-500 glow-amber animate-pulse"></span>;
      default:
        return <span className="h-2 w-2 rounded-full bg-red-500 glow-red animate-pulse"></span>;
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'text-green-400';
      case 'Warning': return 'text-amber-400';
      default: return 'text-red-400';
    }
  };

  return (
    <div className="glass-card flex flex-col rounded-xl p-4 border border-white/6 h-full justify-between gap-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between border-b border-white/8 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-400" />
            <h3 className="font-semibold text-xs uppercase tracking-widest text-slate-200 font-display">
              SYSTEM DIAGNOSTICS
            </h3>
          </div>
          <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            Uptime 100%
          </span>
        </div>

        {/* Diagnostics grid */}
        <div className="mt-4 space-y-3">
          {/* API */}
          <div className="flex items-center justify-between rounded-lg bg-slate-950/20 border border-white/5 px-3 py-2">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-400" />
              <span className="text-[10px] font-bold text-slate-300">FastAPI Gateway</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="text-slate-500">{systemHealth.apiLatency}</span>
              <div className="flex items-center gap-1.5">
                {getStatusLight(systemHealth.apiStatus)}
                <span className={getStatusTextColor(systemHealth.apiStatus)}>{systemHealth.apiStatus}</span>
              </div>
            </div>
          </div>

          {/* AI Model */}
          <div className="flex items-center justify-between rounded-lg bg-slate-950/20 border border-white/5 px-3 py-2">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-green-400" />
              <span className="text-[10px] font-bold text-slate-300">YOLOv8 Thermal AI</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="text-slate-500">{systemHealth.aiModelLatency}</span>
              <div className="flex items-center gap-1.5">
                {getStatusLight(systemHealth.aiModelStatus)}
                <span className={getStatusTextColor(systemHealth.aiModelStatus)}>{systemHealth.aiModelStatus}</span>
              </div>
            </div>
          </div>

          {/* Network Link */}
          <div className="flex items-center justify-between rounded-lg bg-slate-950/20 border border-white/5 px-3 py-2">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-indigo-400" />
              <span className="text-[10px] font-bold text-slate-300">Satellite Comm Link</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="text-slate-500">{systemHealth.networkBandwidth}</span>
              <div className="flex items-center gap-1.5">
                {getStatusLight(systemHealth.networkStatus)}
                <span className={getStatusTextColor(systemHealth.networkStatus)}>{systemHealth.networkStatus}</span>
              </div>
            </div>
          </div>

          {/* UAV Links */}
          <div className="flex items-center justify-between rounded-lg bg-slate-950/20 border border-white/5 px-3 py-2">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-cyan-400" />
              <span className="text-[10px] font-bold text-slate-300">UAV Fleet Connect</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="text-slate-500">{systemHealth.uavActiveLinks} links</span>
              <div className="flex items-center gap-1.5">
                {getStatusLight(systemHealth.uavConnectivity)}
                <span className={getStatusTextColor(systemHealth.uavConnectivity)}>{systemHealth.uavConnectivity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ground Node Quick Status summary list */}
      <div className="border-t border-white/5 pt-4">
        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
          <Radio className="h-4 w-4 text-cyan-400" /> Mesh Node Battery Relays
        </div>
        <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[9px]">
          {groundNodes.map((node) => (
            <div 
              key={node.id} 
              className={`rounded border p-1.5 flex flex-col justify-between h-12 bg-slate-950/20 ${
                node.status === 'Online' ? 'border-green-500/10' :
                node.status === 'Connecting' ? 'border-amber-500/10' : 'border-red-500/10'
              }`}
            >
              <div className="font-bold text-slate-200 truncate">{node.id}</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className={`h-1.5 w-1.5 rounded-full ${
                  node.status === 'Online' ? 'bg-green-500' :
                  node.status === 'Connecting' ? 'bg-amber-500' : 'bg-red-500'
                }`}></span>
                <span className="text-slate-400">{node.battery}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
