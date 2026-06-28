import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import type { MapStyle } from '../../context/DashboardContext';
import { 
  Settings, 
  Map, 
  Globe, 
  Bell, 
  User, 
  Check, 
  Volume2, 
  Lock,
  Battery
} from 'lucide-react';
import { motion } from 'framer-motion';

export const SettingsPanel: React.FC = () => {
  const { 
    mapStyle, 
    setMapStyle, 
    language, 
    setLanguage 
  } = useDashboard();

  const mapStylesList: Array<{ value: MapStyle; label: string; desc: string }> = [
    { value: 'dark', label: 'Tactical Dark', desc: 'Inverted high contrast (recommended for command room)' },
    { value: 'satellite', label: 'Satellite imagery', desc: 'Photographic mapping of surface details' },
    { value: 'street', label: 'Street Map', desc: 'Standard visual highway and building details' },
    { value: 'topo', label: 'Topological contours', desc: 'Elevation details (recommended for landslides)' }
  ];

  const languagesList = [
    { code: 'en', name: 'English (US)' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }
  ];

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-6 xl:grid-cols-3 text-left"
    >
      {/* Left Column: Map and System Preferences */}
      <div className="space-y-6 xl:col-span-2">
        {/* Card 1: Map Style */}
        <motion.div variants={cardVariants} className="glass-card rounded-xl border border-white/6 p-4">
          <div className="flex items-center gap-2 border-b border-white/8 pb-2.5 mb-4">
            <Map className="h-4.5 w-4.5 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">GIS Map Layout Styles</h3>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {mapStylesList.map((style) => {
              const isSelected = mapStyle === style.value;
              return (
                <button
                  key={style.value}
                  onClick={() => setMapStyle(style.value)}
                  className={`flex flex-col text-left rounded-xl p-3 border transition select-none cursor-pointer ${
                    isSelected 
                      ? 'bg-blue-600/15 border-blue-500/35 text-blue-400'
                      : 'border-white/5 bg-slate-950/20 hover:bg-slate-900/30 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold text-xs">
                    <span>{style.label}</span>
                    {isSelected && <Check className="h-4 w-4 text-blue-400" />}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">{style.desc}</p>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Card 2: Language & Region */}
        <motion.div variants={cardVariants} className="glass-card rounded-xl border border-white/6 p-4">
          <div className="flex items-center gap-2 border-b border-white/8 pb-2.5 mb-4">
            <Globe className="h-4.5 w-4.5 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">System Localization</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {languagesList.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as 'en' | 'es' | 'fr')}
                  className={`py-2 px-3 text-center rounded-xl border text-xs font-bold transition select-none cursor-pointer ${
                    isSelected 
                      ? 'bg-cyan-600/20 border-cyan-500/30 text-cyan-400'
                      : 'border-white/5 bg-slate-950/20 hover:bg-slate-900/30 text-slate-400 hover:text-slate-350'
                  }`}
                >
                  {lang.name}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Card 3: Alert Filter Preferences */}
        <motion.div variants={cardVariants} className="glass-card rounded-xl border border-white/6 p-4">
          <div className="flex items-center gap-2 border-b border-white/8 pb-2.5 mb-4">
            <Bell className="h-4.5 w-4.5 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Incident Alert Filters</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-0 focus:ring-offset-0" />
              <div className="flex flex-col">
                <span className="font-bold flex items-center gap-1"><Volume2 className="h-3.5 w-3.5 text-slate-400" /> Sound Alarms</span>
                <span className="text-[9px] text-slate-500">Play auditory buzzer in browser when a Critical SOS is received.</span>
              </div>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-0 focus:ring-offset-0" />
              <div className="flex flex-col">
                <span className="font-bold flex items-center gap-1"><Battery className="h-3.5 w-3.5 text-slate-400" /> UAV Low-Power warnings</span>
                <span className="text-[9px] text-slate-500">Highlight drone nodes and alert triggers immediately if charge drops below 40%.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-0 focus:ring-offset-0" />
              <div className="flex flex-col">
                <span className="font-bold flex items-center gap-1"><Settings className="h-3.5 w-3.5 text-slate-400" /> Autonomic Relays</span>
                <span className="text-[9px] text-slate-500">Automatically spin up Standby drones if an active drone battery hits 15%.</span>
              </div>
            </label>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Profile details */}
      <div className="space-y-6">
        <motion.div variants={cardVariants} className="glass-card rounded-xl border border-white/6 p-4">
          <div className="flex items-center gap-2 border-b border-white/8 pb-2.5 mb-4">
            <User className="h-4.5 w-4.5 text-violet-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Incident Command Officer</h3>
          </div>

          <div className="flex flex-col items-center text-center p-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-blue-500/30 bg-blue-600/10 text-blue-400 font-bold text-xl glow-blue">
              C1
            </div>
            <h4 className="mt-3 font-bold text-sm text-slate-100 font-display">Cmdr. S. Sen</h4>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">National Disaster Response Force</p>
            
            <div className="mt-6 w-full space-y-3 text-left">
              <div>
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Assigned Call Sign</label>
                <input type="text" readOnly value="COMMAND-01" className="h-8 w-full mt-1 rounded-lg border border-white/5 bg-slate-950/40 px-2.5 font-mono text-xs text-slate-400 outline-none" />
              </div>
              
              <div>
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Authorization Code</label>
                <div className="relative mt-1">
                  <input type="password" readOnly value="•••••••••••••••" className="h-8 w-full rounded-lg border border-white/5 bg-slate-950/40 px-2.5 font-mono text-xs text-slate-400 outline-none" />
                  <Lock className="absolute top-2.5 right-2.5 h-3 w-3 text-slate-600" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
