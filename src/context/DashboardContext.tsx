import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  mockUAVs, 
  mockSurvivors, 
  mockSOSMessages, 
  mockTimelineEvents, 
  mockGroundNodes,
  mockLandingZones,
  mockWeatherData,
  mockSystemHealth
} from '../data/mockData';
import type { 
  UAV, 
  Survivor, 
  SOSMessage, 
  TimelineEvent, 
  GroundNode,
  LandingZone
} from '../data/mockData';

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

export interface MapLayers {
  uavs: boolean;
  survivors: boolean;
  sos: boolean;
  hazards: boolean;
  nodes: boolean;
  landingZones: boolean;
}

export type MapStyle = 'dark' | 'satellite' | 'street' | 'topo';

interface DashboardContextType {
  activePage: MenuPage;
  setActivePage: (page: MenuPage) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  uavs: UAV[];
  selectedUavId: string | null;
  setSelectedUavId: (id: string | null) => void;
  survivors: Survivor[];
  sosMessages: SOSMessage[];
  timelineEvents: TimelineEvent[];
  groundNodes: GroundNode[];
  landingZones: LandingZone[];
  weather: typeof mockWeatherData;
  systemHealth: typeof mockSystemHealth;
  
  // Actions
  acknowledgeSOS: (id: string) => void;
  dispatchTeam: (id: string) => void;
  
  // Map control
  mapCenter: [number, number];
  mapZoom: number;
  mapStyle: MapStyle;
  setMapStyle: (style: MapStyle) => void;
  layers: MapLayers;
  toggleLayer: (layer: keyof MapLayers) => void;
  flyToTarget: [number, number] | null;
  triggerFlyTo: (coords: [number, number] | null) => void;
  resetMap: () => void;
  
  // Time and Weather
  localTime: string;
  utcTime: string;
  language: 'en' | 'es' | 'fr';
  setLanguage: (lang: 'en' | 'es' | 'fr') => void;
  notifications: Array<{ id: string; message: string; read: boolean; type: string }>;
  markNotificationsAsRead: () => void;
  addNotification: (message: string, type: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Layout
  const [activePage, setActivePage] = useState<MenuPage>('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'es' | 'fr'>('en');

  // Core Data State
  const [uavs, setUavs] = useState<UAV[]>(mockUAVs);
  const [selectedUavId, setSelectedUavId] = useState<string | null>('UAV-101');
  const [survivors] = useState<Survivor[]>(mockSurvivors);
  const [sosMessages, setSosMessages] = useState<SOSMessage[]>(mockSOSMessages);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(mockTimelineEvents);
  const [groundNodes, setGroundNodes] = useState<GroundNode[]>(mockGroundNodes);
  const [landingZones] = useState<LandingZone[]>(mockLandingZones);
  
  // Settings/Styles
  const [mapStyle, setMapStyle] = useState<MapStyle>('dark');
  const [layers, setLayers] = useState<MapLayers>({
    uavs: true,
    survivors: true,
    sos: true,
    hazards: true,
    nodes: true,
    landingZones: true
  });
  
  // Map Position controls
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.0150, -105.2705]);
  const [mapZoom, setMapZoom] = useState<number>(14);
  const [flyToTarget, setFlyToTarget] = useState<[number, number] | null>(null);

  // Time management
  const [localTime, setLocalTime] = useState<string>('');
  const [utcTime, setUtcTime] = useState<string>('');

  // Notifications
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; read: boolean; type: string }>>([
    { id: '1', message: 'CRITICAL: SOS Received from Marcus & Family', read: false, type: 'critical' },
    { id: '2', message: 'AI model detected survivor SURV-001 (96.8% confidence)', read: false, type: 'survivor' },
    { id: '3', message: 'UAV-102 Battery dropping below 45%', read: false, type: 'warning' }
  ]);

  // Update clock every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // Adjust slightly to simulate the 2026 timeframe
      const targetYear = 2026;
      const currentYear = now.getFullYear();
      const diffYears = targetYear - currentYear;
      if (diffYears !== 0) {
        now.setFullYear(targetYear);
      }
      
      setLocalTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
      setUtcTime(now.toUTCString().replace('GMT', 'UTC').split(' ')[4]);
    };
    
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Periodic Telemetry Simulator to bring the dashboard "alive"
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Move active UAVs slightly and cycle batteries
      setUavs(prevUavs => 
        prevUavs.map(uav => {
          if (uav.status !== 'Active') return uav;
          
          // Micro-coordinates change (flight drift)
          const latDrift = (Math.random() - 0.5) * 0.0004;
          const lngDrift = (Math.random() - 0.5) * 0.0004;
          const nextCoords: [number, number] = [
            uav.coords[0] + latDrift,
            uav.coords[1] + lngDrift
          ];
          
          // Battery drain simulation
          const nextBattery = Math.max(5, uav.battery - (Math.random() > 0.7 ? 1 : 0));
          
          // Micro speed and altitude fluctuations
          const nextSpeed = Math.max(30, Math.min(80, uav.speed + Math.round((Math.random() - 0.5) * 4)));
          const nextAlt = Math.max(90, Math.min(220, uav.altitude + Math.round((Math.random() - 0.5) * 6)));
          const nextHeading = (uav.heading + Math.round((Math.random() - 0.5) * 10) + 360) % 360;
          const nextProgress = Math.min(100, uav.progress + (Math.random() > 0.9 ? 1 : 0));

          // If battery gets too low, send a notification once
          if (nextBattery === 40 && uav.battery > 40) {
            addNotification(`WARNING: ${uav.id} battery at 40%`, 'warning');
          } else if (nextBattery === 15 && uav.battery > 15) {
            addNotification(`CRITICAL: ${uav.id} battery critical (${nextBattery}%)`, 'critical');
          }

          // Add coordinate to path history (cap at last 10 points)
          const updatedPath = [...uav.path, nextCoords].slice(-12);

          return {
            ...uav,
            coords: nextCoords,
            battery: nextBattery,
            speed: nextSpeed,
            altitude: nextAlt,
            heading: nextHeading,
            progress: nextProgress,
            path: updatedPath as [number, number][]
          };
        })
      );

      // 2. Occasionally fluctuate node connectivity / battery
      setGroundNodes(prevNodes => 
        prevNodes.map(node => {
          if (node.status === 'Offline') return node;
          const batteryDrift = Math.random() > 0.95 ? -1 : 0;
          const nextBattery = Math.max(0, node.battery + batteryDrift);
          const nextStatus = nextBattery === 0 ? 'Offline' : node.status;
          
          // Micro connection variations
          const connectionsDrift = Math.round((Math.random() - 0.5) * 2);
          const nextConn = Math.max(2, Math.min(30, node.connections + (Math.random() > 0.8 ? connectionsDrift : 0)));

          return {
            ...node,
            battery: nextBattery,
            status: nextStatus as 'Online' | 'Offline' | 'Connecting',
            connections: nextConn
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Action methods
  const acknowledgeSOS = (id: string) => {
    setSosMessages(prev => 
      prev.map(msg => msg.id === id ? { ...msg, status: 'Acknowledged' } : msg)
    );
    
    const msgObj = sosMessages.find(m => m.id === id);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    setTimelineEvents(prev => [
      {
        id: `EVT-${Date.now()}`,
        time: timeStr,
        type: 'sos',
        message: `Emergency center acknowledged SOS request from ${msgObj?.victimName || id}.`,
        severity: 'info'
      },
      ...prev
    ]);

    addNotification(`Acknowledged SOS from ${msgObj?.victimName || id}`, 'info');
  };

  const dispatchTeam = (id: string) => {
    setSosMessages(prev => 
      prev.map(msg => msg.id === id ? { ...msg, status: 'Dispatched' } : msg)
    );
    
    const msgObj = sosMessages.find(m => m.id === id);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    setTimelineEvents(prev => [
      {
        id: `EVT-${Date.now()}`,
        time: timeStr,
        type: 'node',
        message: `Rescue team DISPATCHED to coordinates of ${msgObj?.victimName || id}.`,
        severity: 'success'
      },
      ...prev
    ]);

    addNotification(`Dispatched rescue team for ${msgObj?.victimName || id}`, 'success');
  };

  const toggleLayer = (layer: keyof MapLayers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const triggerFlyTo = (coords: [number, number] | null) => {
    setFlyToTarget(coords);
    if (coords) {
      setMapCenter(coords);
    }
  };

  const resetMap = () => {
    setMapCenter([40.0150, -105.2705]);
    setMapZoom(14);
    setFlyToTarget(null);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (message: string, type: string) => {
    setNotifications(prev => [
      {
        id: Date.now().toString(),
        message,
        read: false,
        type
      },
      ...prev
    ]);
  };

  return (
    <DashboardContext.Provider value={{
      activePage,
      setActivePage,
      sidebarCollapsed,
      setSidebarCollapsed,
      uavs,
      selectedUavId,
      setSelectedUavId,
      survivors,
      sosMessages,
      timelineEvents,
      groundNodes,
      landingZones,
      weather: mockWeatherData,
      systemHealth: mockSystemHealth,
      
      acknowledgeSOS,
      dispatchTeam,
      
      mapCenter,
      mapZoom,
      mapStyle,
      setMapStyle,
      layers,
      toggleLayer,
      flyToTarget,
      triggerFlyTo,
      resetMap,
      
      localTime,
      utcTime,
      language,
      setLanguage,
      notifications,
      markNotificationsAsRead,
      addNotification
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
