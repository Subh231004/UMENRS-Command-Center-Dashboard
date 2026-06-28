import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Users, 
  MessageSquareCode, 
  Plane, 
  Radio, 
  Target, 
  Network, 
  BatteryCharging, 
  Timer,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export const KPICards: React.FC = () => {
  const { uavs, survivors, sosMessages, groundNodes } = useDashboard();

  // Computations
  const activeUavCount = uavs.filter(u => u.status === 'Active').length;
  const deployedNodes = groundNodes.filter(n => n.status === 'Online').length;
  const avgBattery = Math.round(
    uavs.filter(u => u.status === 'Active').reduce((acc, u) => acc + u.battery, 0) / (activeUavCount || 1)
  );

  const kpis = [
    {
      title: 'Survivors Detected',
      value: survivors.length,
      trend: '+2 new',
      isPositive: true,
      icon: Users,
      color: 'text-green-400 bg-green-500/10 border-green-500/20',
      sparkline: 'M0,15 L10,13 L20,10 L30,12 L40,8 L50,9 L60,4 L70,5 L80,2 L90,3 L100,0',
      sparkColor: 'stroke-green-400'
    },
    {
      title: 'Active SOS Alerts',
      value: sosMessages.filter(s => s.status !== 'Dispatched').length,
      trend: '1 critical',
      isPositive: false,
      icon: MessageSquareCode,
      color: 'text-red-400 bg-red-500/10 border-red-500/20',
      sparkline: 'M0,0 L10,5 L20,2 L30,10 L40,8 L50,14 L60,11 L70,16 L80,12 L90,18 L100,20',
      sparkColor: 'stroke-red-400'
    },
    {
      title: 'Active UAVs',
      value: `${activeUavCount}/${uavs.length}`,
      trend: '1 standby',
      isPositive: true,
      icon: Plane,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      sparkline: 'M0,15 L20,15 L40,10 L60,10 L80,5 L100,5',
      sparkColor: 'stroke-blue-400'
    },
    {
      title: 'Ground Nodes Deployed',
      value: `${deployedNodes}/${groundNodes.length}`,
      trend: '1 connecting',
      isPositive: true,
      icon: Radio,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      sparkline: 'M0,10 L15,10 L30,5 L45,15 L60,10 L75,5 L90,10 L100,10',
      sparkColor: 'stroke-cyan-400'
    },
    {
      title: 'Detection Precision',
      value: '96.8%',
      trend: '+0.4% avg',
      isPositive: true,
      icon: Target,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      sparkline: 'M0,15 L20,13 L40,14 L60,10 L80,5 L100,2',
      sparkColor: 'stroke-emerald-400'
    },
    {
      title: 'Relay Uptime',
      value: '99.4%',
      trend: '+0.1%',
      isPositive: true,
      icon: Network,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      sparkline: 'M0,12 L20,12 L40,10 L60,8 L80,5 L100,1',
      sparkColor: 'stroke-indigo-400'
    },
    {
      title: 'UAV Avg Battery',
      value: `${avgBattery}%`,
      trend: 'Discharging',
      isPositive: false,
      icon: BatteryCharging,
      color: avgBattery > 50 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20',
      sparkline: 'M0,5 L15,8 L30,10 L45,12 L60,15 L75,13 L90,17 L100,19',
      sparkColor: avgBattery > 50 ? 'stroke-amber-400' : 'stroke-red-400'
    },
    {
      title: 'Mission Duration',
      value: '04h 42m',
      trend: 'Continuous',
      isPositive: true,
      icon: Timer,
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
      sparkline: 'M0,20 L20,18 L40,16 L60,14 L80,12 L100,10',
      sparkColor: 'stroke-violet-400'
    }
  ];

  // Container variants for staggered entrance
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8"
    >
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        
        return (
          <motion.div
            key={idx}
            variants={cardVariants}
            className="glass-card flex flex-col justify-between rounded-xl p-3 border border-white/6"
          >
            {/* Header: Title + Icon */}
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
                {kpi.title}
              </span>
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${kpi.color}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>

            {/* Content: Value + Trend */}
            <div className="mt-3">
              <h3 className="font-mono text-lg font-bold tracking-tight text-slate-100">
                {kpi.value}
              </h3>
              <div className="mt-1.5 flex items-center justify-between">
                {/* Trend text */}
                <span className={`flex items-center text-[9px] font-bold ${
                  kpi.isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {kpi.isPositive ? (
                    <ArrowUpRight className="mr-0.5 h-3 w-3 shrink-0" />
                  ) : (
                    <ArrowDownRight className="mr-0.5 h-3 w-3 shrink-0" />
                  )}
                  {kpi.trend}
                </span>

                {/* SVG Sparkline */}
                <svg className="h-4 w-12" viewBox="0 0 100 20">
                  <path
                    d={kpi.sparkline}
                    fill="none"
                    strokeWidth="2"
                    className={kpi.sparkColor}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
