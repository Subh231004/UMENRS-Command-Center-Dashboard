import React from 'react';

import { 
  AreaChart, Area, 
  BarChart, Bar, 
  LineChart, Line,
  ComposedChart,
  RadialBarChart, RadialBar,
  XAxis, YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { mockAnalyticsData } from '../../data/mockData';
import { 
  TrendingUp, 
  Network, 
  Battery, 
  BarChart3, 
  CheckCircle,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AnalyticsPanel: React.FC = () => {


  // Custom tooltips
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-white/10 bg-[#0f1524]/90 p-2 font-mono text-[10px] text-slate-200 shadow-xl backdrop-blur-md">
          <p className="font-bold border-b border-white/5 pb-1 mb-1">{label}</p>
          {payload.map((item: any, idx: number) => (
            <p key={idx} style={{ color: item.color }} className="flex justify-between gap-4">
              <span>{item.name}:</span>
              <span className="font-bold">{item.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 text-left"
    >
      {/* Top Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-100 font-display">Mission Analytics & Telemetry Reports</h2>
        <p className="text-xs text-slate-400">Review real-time flight metrics, search precision models, and latency indexes from UMENRS ground terminals.</p>
      </div>

      {/* Grid: 2 columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Chart 1: Detection Trend (Area Chart) */}
        <motion.div variants={cardVariants} className="glass-card rounded-xl p-4 border border-white/6 flex flex-col h-[320px]">
          <div className="flex items-center gap-2 border-b border-white/8 pb-2.5 mb-3">
            <TrendingUp className="h-4.5 w-4.5 text-green-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">AI Thermal Detections Trend</h3>
          </div>
          <div className="flex-1 w-full text-[10px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockAnalyticsData.detectionTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSurvivors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#64748b" tickLine={false} />
                <YAxis stroke="#64748b" tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="survivors" name="Detections" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSurvivors)" />
                <Area type="monotone" dataKey="confidenceAvg" name="Confidence %" stroke="#3b82f6" strokeWidth={1.5} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart 2: SOS Inbox vs Resolved (Bar Chart) */}
        <motion.div variants={cardVariants} className="glass-card rounded-xl p-4 border border-white/6 flex flex-col h-[320px]">
          <div className="flex items-center gap-2 border-b border-white/8 pb-2.5 mb-3">
            <CheckCircle className="h-4.5 w-4.5 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">SOS Distress Signals: Received vs Dispatched</h3>
          </div>
          <div className="flex-1 w-full text-[10px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAnalyticsData.sosTimeline} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="time" stroke="#64748b" tickLine={false} />
                <YAxis stroke="#64748b" tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar dataKey="received" name="Distress Calls" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Teams Dispatched" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart 3: UAV Flight Time vs Battery Used (Composed Chart) */}
        <motion.div variants={cardVariants} className="glass-card rounded-xl p-4 border border-white/6 flex flex-col h-[320px]">
          <div className="flex items-center gap-2 border-b border-white/8 pb-2.5 mb-3">
            <Battery className="h-4.5 w-4.5 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">UAV Asset Performance Log</h3>
          </div>
          <div className="flex-1 w-full text-[10px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={mockAnalyticsData.uavPerformance} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#64748b" tickLine={false} />
                <YAxis stroke="#64748b" tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar dataKey="flightTime" name="Flight Mins" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                <Line type="monotone" dataKey="batteryUsed" name="Battery Draw %" stroke="#ef4444" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart 4: Comm Latency (Line Chart) */}
        <motion.div variants={cardVariants} className="glass-card rounded-xl p-4 border border-white/6 flex flex-col h-[320px]">
          <div className="flex items-center gap-2 border-b border-white/8 pb-2.5 mb-3">
            <Network className="h-4.5 w-4.5 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Mesh & Satellite Relay Latency</h3>
          </div>
          <div className="flex-1 w-full text-[10px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockAnalyticsData.networkLatencyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="time" stroke="#64748b" tickLine={false} />
                <YAxis stroke="#64748b" tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="satLink" name="Satellite (ms)" stroke="#f59e0b" strokeWidth={2.5} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="meshNode" name="Mesh Ground (ms)" stroke="#06b6d4" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Radial Metric Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* KPI Radial card */}
        <motion.div variants={cardVariants} className="glass-card rounded-xl p-4 border border-white/6 flex flex-col h-[280px] lg:col-span-1">
          <div className="flex items-center gap-2 border-b border-white/8 pb-2.5 mb-3">
            <BarChart3 className="h-4.5 w-4.5 text-violet-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Coverage KPI Breakdown</h3>
          </div>
          <div className="flex-1 w-full text-[10px] font-mono relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" cy="50%" 
                innerRadius="30%" outerRadius="90%" 
                barSize={8} 
                data={mockAnalyticsData.missionSuccessRates}
              >
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={4}
                />
                <Legend iconSize={6} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '9px', lineHeight: '16px' }} />
                <Tooltip content={<CustomTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Dynamic Diagnostics block */}
        <motion.div variants={cardVariants} className="glass-card rounded-xl p-4 border border-white/6 lg:col-span-2 flex flex-col justify-between h-[280px]">
          <div className="flex items-center gap-2 border-b border-white/8 pb-2.5">
            <Clock className="h-4.5 w-4.5 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Operational Log Analytics</h3>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4 flex-1">
            <div className="rounded-xl border border-white/5 bg-slate-950/20 p-3 flex flex-col justify-between">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Search Swept Area</span>
              <div className="mt-2 font-mono text-xl font-bold text-slate-100">82.4 km²</div>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">Covering 82% of assigned Boulder Creek valley sectors. UAV-101 and 103 active.</p>
            </div>
            
            <div className="rounded-xl border border-white/5 bg-slate-950/20 p-3 flex flex-col justify-between">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Average Dispatch Time</span>
              <div className="mt-2 font-mono text-xl font-bold text-slate-150">3m 12s</div>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">Average duration between SOS receiving, duty commander approval, and drone deployment.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
