import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  LayoutDashboard, 
  Map, 
  Plane, 
  Search, 
  Mail, 
  ShieldAlert, 
  Radio, 
  FileText, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

type MenuPage = 
  | 'Dashboard' 
  | 'Live Map' 
  | 'UAV Fleet' 
  | 'Survivor Detection' 
  | 'SOS Inbox' 
  | 'Hazard Zones' 
  | 'Ground Nodes' 
  | 'Reports' 
  | 'Analytics' 
  | 'Settings';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { 
    activePage, 
    setActivePage, 
    sidebarCollapsed, 
    setSidebarCollapsed,
    sosMessages,
    survivors
  } = useDashboard();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: 'Dashboard' },
    { name: 'Live Map', icon: Map, path: 'Live Map' },
    { name: 'UAV Fleet', icon: Plane, path: 'UAV Fleet', badgeCount: 3 },
    { name: 'Survivor Detection', icon: Search, path: 'Survivor Detection', badgeCount: survivors.length, badgeColor: 'bg-green-600' },
    { name: 'SOS Inbox', icon: Mail, path: 'SOS Inbox', badgeCount: sosMessages.filter(s => s.status === 'Unacknowledged').length, badgeColor: 'bg-red-500' },
    { name: 'Hazard Zones', icon: ShieldAlert, path: 'Hazard Zones' },
    { name: 'Ground Nodes', icon: Radio, path: 'Ground Nodes' },
    { name: 'Reports', icon: FileText, path: 'Reports' },
    { name: 'Analytics', icon: BarChart3, path: 'Analytics' },
    { name: 'Settings', icon: Settings, path: 'Settings' }
  ];

  const handleMenuClick = (page: MenuPage) => {
    setActivePage(page);
    onCloseMobile();
  };

  const sidebarVariants = {
    expanded: { width: '240px' },
    collapsed: { width: '70px' }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <motion.aside
        initial="expanded"
        animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
        variants={sidebarVariants}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-white/8 bg-[#0f1524] transition-all duration-200 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] ${
          mobileOpen ? 'translate-x-0 w-[240px]' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header in Drawer */}
        <div className="flex h-16 items-center justify-between border-b border-white/8 px-4 lg:hidden">
          <div className="flex items-center gap-2 text-slate-100">
            <Radio className="h-5 w-5 text-blue-400" />
            <span className="font-display font-bold text-sm tracking-widest">UMENRS MENU</span>
          </div>
          <button 
            onClick={onCloseMobile}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-100"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.path;
            
            return (
              <button
                key={item.name}
                onClick={() => handleMenuClick(item.path as MenuPage)}
                className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold tracking-wide transition-all ${
                  isActive 
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25' 
                    : 'text-slate-400 border border-transparent hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                {/* Selection indicator pill */}
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-blue-500" 
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                
                {/* Label text */}
                <span className={`transition-opacity duration-150 ${
                  sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden lg:hidden' : 'opacity-100'
                }`}>
                  {item.name}
                </span>

                {/* Badges for counts */}
                {item.badgeCount && item.badgeCount > 0 ? (
                  <span className={`ml-auto flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white shadow-sm ${
                    sidebarCollapsed ? 'absolute top-1.5 right-1.5' : ''
                  } ${item.badgeColor || 'bg-blue-600'}`}>
                    {item.badgeCount}
                  </span>
                ) : null}

                {/* Tooltip for Collapsed Sidebar */}
                {sidebarCollapsed && (
                  <div className="absolute left-[74px] z-50 hidden rounded bg-slate-900 border border-white/10 px-2 py-1 text-[10px] font-bold text-slate-100 shadow-md group-hover:block whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer collapse toggle */}
        <div className="hidden border-t border-white/8 p-3 lg:block">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex h-9 w-full items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-slate-200"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4.5 w-4.5" />
            ) : (
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                <ChevronLeft className="h-4.5 w-4.5" /> Collapse
              </div>
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
};
