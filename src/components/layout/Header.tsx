import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Bell, 
  Search, 
  Activity, 
  CloudRain, 
  Wind, 
  Check,
  User,
  LogOut,
  ChevronDown,
  Menu,
  Globe,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { 
    localTime, 
    utcTime, 
    weather, 
    notifications, 
    markNotificationsAsRead,
    language
  } = useDashboard();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-l-4 border-red-500 bg-red-950/20';
      case 'warning': return 'border-l-4 border-amber-500 bg-amber-950/20';
      case 'survivor': return 'border-l-4 border-green-500 bg-green-950/20';
      default: return 'border-l-4 border-blue-500 bg-blue-950/20';
    }
  };

  const formattedDate = new Date().toLocaleDateString(language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-white/8 bg-[#0b0f19]/85 px-4 backdrop-blur-md">
      {/* Brand Logo & Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleMobileMenu}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 glow-blue">
            <Activity className="h-5 w-5 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-blue-500 animate-ping" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wider text-slate-100 font-display select-none">
              UMENRS
            </h1>
            <p className="hidden text-[9px] font-semibold uppercase tracking-widest text-slate-500 sm:block">
              UAV Emergency Relay
            </p>
          </div>
        </div>

        {/* Mission Status Badge */}
        <div className="hidden items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400 sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          ACTIVE MISSION
        </div>
      </div>

      {/* Right widgets */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Search Bar - Desktop */}
        <div className="relative hidden w-48 xl:block">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search assets..." 
            className="h-9 w-full rounded-lg border border-white/8 bg-white/5 pl-9 pr-3 text-xs text-slate-300 placeholder-slate-500 outline-none transition focus:border-blue-500/50 focus:bg-white/10"
          />
        </div>

        {/* Clock widget */}
        <div className="hidden items-center gap-4 border-r border-white/8 pr-4 text-right sm:flex md:pr-5">
          <div>
            <div className="flex items-center gap-1.5 justify-end">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-mono text-sm font-bold text-slate-200 tracking-wider">
                {localTime || "22:13:51"}
              </span>
              <span className="text-[9px] font-semibold text-slate-500 bg-white/5 px-1 py-0.5 rounded">LOC</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end text-[10px] text-slate-400">
              <Globe className="h-3 w-3 text-slate-500" />
              <span className="font-mono">{utcTime || "16:43:51"}</span>
              <span className="text-[8px] font-semibold text-slate-600">UTC</span>
            </div>
          </div>
          <div className="hidden text-left text-xs font-medium text-slate-400 md:block">
            <div>{formattedDate}</div>
            <div className="text-[10px] text-slate-500">BOULDER COMMAND</div>
          </div>
        </div>

        {/* Weather Widget */}
        <div className="hidden items-center gap-3 border-r border-white/8 pr-4 text-slate-300 md:flex md:pr-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/8 text-blue-400">
            <CloudRain className="h-5 w-5" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-slate-200">{weather.temperature}°C</div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Wind className="h-2.5 w-2.5" /> {weather.windSpeed} km/h {weather.windDirection}
            </div>
          </div>
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileDropdown(false);
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-slate-100"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white glow-red">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-72 md:w-80 rounded-xl border border-white/10 bg-[#0f1524] p-2 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center justify-between border-b border-white/8 px-2 py-2 pb-2">
                  <h3 className="font-semibold text-xs text-slate-300 font-display">Alerts Inbox</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markNotificationsAsRead}
                      className="flex items-center gap-1 text-[10px] font-medium text-blue-400 hover:text-blue-300"
                    >
                      <Check className="h-3.5 w-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="mt-1 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500">
                      No active alerts.
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`mt-1 flex flex-col rounded-lg p-2.5 transition hover:bg-white/5 ${getNotificationColor(notif.type)} ${!notif.read ? 'font-medium' : ''}`}
                      >
                        <p className="text-[11px] text-slate-300 leading-normal">
                          {notif.message}
                        </p>
                        <span className="mt-1 text-[9px] text-slate-500">Just now</span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-1.5 transition hover:bg-white/10"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600/30 text-blue-400 font-bold text-xs border border-blue-500/20">
              C1
            </div>
            <div className="hidden text-left text-xs lg:block">
              <div className="font-semibold text-slate-200">Cmdr. S. Sen</div>
              <div className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Duty Officer</div>
            </div>
            <ChevronDown className="hidden h-3 w-3 text-slate-400 lg:block" />
          </button>

          <AnimatePresence>
            {showProfileDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#0f1524] p-1.5 shadow-2xl backdrop-blur-xl"
              >
                <div className="px-2.5 py-2 border-b border-white/8">
                  <p className="text-xs font-semibold text-slate-200">Commander</p>
                  <p className="text-[10px] text-slate-500">subhasish@ndma.gov</p>
                </div>
                <div className="mt-1.5">
                  <button className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs text-slate-300 hover:bg-white/5">
                    <User className="h-4.5 w-4.5 text-slate-400" /> My Profile
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs text-red-400 hover:bg-red-950/20">
                    <LogOut className="h-4.5 w-4.5 text-red-400/70" /> Disconnect Command
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
