import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Plane, 
  Search, 
  Radio, 
  Mail, 
  ShieldAlert, 
  CheckCircle,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

export const MissionTimeline: React.FC = () => {
  const { timelineEvents } = useDashboard();

  const getEventStyle = (type: string, severity: string) => {
    switch (type) {
      case 'uav': 
        return { icon: Plane, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
      case 'survivor': 
        return { icon: Search, color: 'text-green-400 bg-green-500/10 border-green-500/20' };
      case 'node': 
        return { icon: Radio, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
      case 'sos': 
        return { icon: Mail, color: severity === 'critical' ? 'text-red-400 bg-red-500/10 border-red-500/20 animate-pulse' : 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
      case 'completed': 
        return { icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      default: 
        return { icon: ShieldAlert, color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' };
    }
  };

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="glass-card flex flex-col rounded-xl p-4 border border-white/6 h-full justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/8 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-400" />
          <h3 className="font-semibold text-xs uppercase tracking-widest text-slate-200 font-display">
            LIVE MISSION TIMELINE
          </h3>
        </div>
        <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest">
          Chronological Logs
        </span>
      </div>

      {/* Events List */}
      <div className="mt-4 flex-1 overflow-y-auto max-h-[290px] pr-1">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative border-l border-white/8 ml-3 pl-5 space-y-4"
        >
          {timelineEvents.map((evt) => {
            const { icon: Icon, color } = getEventStyle(evt.type, evt.severity);
            
            return (
              <motion.div 
                key={evt.id} 
                variants={itemVariants}
                className="relative text-left"
              >
                {/* Timeline node icon */}
                <div className={`absolute -left-[31px] top-0 flex h-6.5 w-6.5 items-center justify-center rounded-full border bg-[#0f1524] ${color}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>

                {/* Event text content */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-400 bg-white/5 px-1 py-0.5 rounded">
                      {evt.time}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">
                      {evt.type} update
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-200 font-medium leading-relaxed">
                    {evt.message}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
