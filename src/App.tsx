import React, { useState } from 'react';
import { useDashboard } from './context/DashboardContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { KPICards } from './components/dashboard/KPICards';
import { DisasterMap } from './components/dashboard/DisasterMap';
import { TelemetryPanel } from './components/dashboard/TelemetryPanel';
import { MissionTimeline } from './components/dashboard/MissionTimeline';
import { SOSInboxPanel } from './components/dashboard/SOSInboxPanel';
import { SurvivorPanel } from './components/dashboard/SurvivorPanel';
import { HazardSummaryPanel } from './components/dashboard/HazardSummaryPanel';
import { SystemHealthPanel } from './components/dashboard/SystemHealthPanel';
import { AnalyticsPanel } from './components/analytics/AnalyticsPanel';
import { ReportsPanel } from './components/reports/ReportsPanel';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { 
  LayoutDashboard, 
  Map, 
  Mail, 
  Search, 
  Settings as SettingsIcon,
  Radio,
  Plane,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const App: React.FC = () => {
  const { activePage, setActivePage, sidebarCollapsed, sosMessages, groundNodes, uavs, survivors } = useDashboard();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Accordion state for mobile view panels
  const [activeAccordion, setActiveAccordion] = useState<string | null>('map');

  const toggleAccordion = (panel: string) => {
    setActiveAccordion(activeAccordion === panel ? null : panel);
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'Dashboard':
        return (
          <div className="space-y-4">
            {/* 1. KPI Cards Row */}
            <KPICards />

            {/* 2. Main Responsive Grid */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-10">
              
              {/* Left Section (70% on Desktop = 7 cols) */}
              <div className="space-y-4 xl:col-span-7 flex flex-col">
                
                {/* Desktop & Laptop layout: normal list. Mobile layout: accordions */}
                <div className="block lg:hidden">
                  <div className="space-y-2.5">
                    {/* Map Accordion */}
                    <div className="rounded-xl border border-white/6 bg-[#0f1524]/60 overflow-hidden">
                      <button 
                        onClick={() => toggleAccordion('map')}
                        className="flex w-full items-center justify-between px-4 py-3 bg-[#0f1524]/80 text-xs font-bold uppercase tracking-wider text-slate-200"
                      >
                        <span className="flex items-center gap-2"><Map className="h-4 w-4 text-blue-400" /> Interactive Disaster Map</span>
                        {activeAccordion === 'map' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      {activeAccordion === 'map' && (
                        <div className="p-1 h-[320px]">
                          <DisasterMap />
                        </div>
                      )}
                    </div>

                    {/* Telemetry Accordion */}
                    <div className="rounded-xl border border-white/6 bg-[#0f1524]/60 overflow-hidden">
                      <button 
                        onClick={() => toggleAccordion('telemetry')}
                        className="flex w-full items-center justify-between px-4 py-3 bg-[#0f1524]/80 text-xs font-bold uppercase tracking-wider text-slate-200"
                      >
                        <span className="flex items-center gap-2"><Plane className="h-4 w-4 text-blue-400" /> UAV Fleet Telemetry</span>
                        {activeAccordion === 'telemetry' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      {activeAccordion === 'telemetry' && (
                        <div className="p-3">
                          <TelemetryPanel />
                        </div>
                      )}
                    </div>

                    {/* SOS Accordion */}
                    <div className="rounded-xl border border-white/6 bg-[#0f1524]/60 overflow-hidden">
                      <button 
                        onClick={() => toggleAccordion('sos')}
                        className="flex w-full items-center justify-between px-4 py-3 bg-[#0f1524]/80 text-xs font-bold uppercase tracking-wider text-slate-200"
                      >
                        <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-red-400" /> Live SOS Alerts</span>
                        {activeAccordion === 'sos' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      {activeAccordion === 'sos' && (
                        <div className="p-3">
                          <SOSInboxPanel />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Desktop & Laptop layout: Normal flowing containers */}
                <div className="hidden lg:flex flex-col gap-4">
                  <div className="h-[440px]">
                    <DisasterMap />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TelemetryPanel />
                    <MissionTimeline />
                  </div>
                </div>
              </div>

              {/* Right Section (30% on Desktop = 3 cols) */}
              <div className="space-y-4 xl:col-span-3 hidden lg:flex flex-col">
                <SOSInboxPanel />
                <SurvivorPanel />
                <HazardSummaryPanel />
                <SystemHealthPanel />
              </div>

            </div>
          </div>
        );
      case 'Live Map':
        return (
          <div className="h-[calc(100vh-130px)] lg:h-[calc(100vh-100px)] w-full flex flex-col gap-4">
            <div className="flex-1 min-h-[380px]">
              <DisasterMap />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-fit">
              <div className="md:col-span-2">
                <TelemetryPanel />
              </div>
              <div className="md:col-span-1">
                <SystemHealthPanel />
              </div>
            </div>
          </div>
        );
      case 'UAV Fleet':
        return (
          <div className="space-y-6 text-left">
            <div className="flex flex-col gap-1 border-b border-white/8 pb-4">
              <h2 className="text-xl font-bold text-slate-100 font-display">Active UAV fleet roster</h2>
              <p className="text-xs text-slate-400">Direct tactical monitoring of autonomous and human-guided aerial network nodes.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {uavs.map(uav => (
                <div key={uav.id} className="glass-card rounded-xl border border-white/6 p-4 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <div className="flex items-center gap-2">
                      <Plane className="h-4.5 w-4.5 text-blue-400" />
                      <span className="font-mono text-sm font-bold text-slate-200">{uav.id}</span>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      uav.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-slate-800 text-slate-400'
                    }`}>{uav.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="bg-slate-950/20 p-2 rounded">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Airspeed</p>
                      <p className="text-slate-200 font-bold mt-0.5">{uav.speed} km/h</p>
                    </div>
                    <div className="bg-slate-950/20 p-2 rounded">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Battery charge</p>
                      <p className="text-slate-200 font-bold mt-0.5">{uav.battery}%</p>
                    </div>
                    <div className="bg-slate-950/20 p-2 rounded">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Altitude</p>
                      <p className="text-slate-200 font-bold mt-0.5">{uav.altitude} m</p>
                    </div>
                    <div className="bg-slate-950/20 p-2 rounded">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">GPS Signal</p>
                      <p className="text-slate-200 font-bold mt-0.5">{uav.signal}% ({uav.gpsSatellites} Sats)</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                      <span>Area Swept Progress</span>
                      <span>{uav.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${uav.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Survivor Detection':
        return (
          <div className="h-full flex flex-col gap-4">
            <div className="flex flex-col gap-1 text-left border-b border-white/8 pb-4">
              <h2 className="text-xl font-bold text-slate-100 font-display">AI Thermal Detections Log</h2>
              <p className="text-xs text-slate-400 font-sans">Infrared signature tracking logs logged by YOLOv8 models. Confirm coordinates to dispatch extraction assets.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <SurvivorPanel />
              </div>
              <div className="md:col-span-2 glass-card rounded-xl border border-white/6 p-4 text-left">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 border-b border-white/8 pb-2">Thermal Target Manifest</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="border-b border-white/8 text-slate-500">
                        <th className="py-2 text-left">Target ID</th>
                        <th className="py-2 text-left">Sensor Source</th>
                        <th className="py-2 text-left">Confidence</th>
                        <th className="py-2 text-left">Coordinates</th>
                        <th className="py-2 text-left">Spotted Time</th>
                        <th className="py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-350">
                      {survivors.map(s => (
                        <tr key={s.id} className="hover:bg-white/5">
                          <td className="py-3 font-bold text-slate-100">{s.id}</td>
                          <td className="py-3">{s.uavId}</td>
                          <td className="py-3 text-green-400 font-bold">{s.confidence}%</td>
                          <td className="py-3">{s.coords[0].toFixed(5)}, {s.coords[1].toFixed(5)}</td>
                          <td className="py-3">{s.time}</td>
                          <td className="py-3"><span className="text-[8px] uppercase font-bold bg-green-500/10 border border-green-500/20 text-green-400 px-1.5 py-0.5 rounded">Identified</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      case 'SOS Inbox':
        return (
          <div className="space-y-6 text-left">
            <div className="flex flex-col gap-1 border-b border-white/8 pb-4">
              <h2 className="text-xl font-bold text-slate-100 font-display">SOS Distress Message Registry</h2>
              <p className="text-xs text-slate-400">Direct cellular, satellite, and mesh beacons sent from isolated disaster victims.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
              <div className="xl:col-span-1">
                <SOSInboxPanel />
              </div>
              <div className="xl:col-span-3 glass-card rounded-xl border border-white/6 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 border-b border-white/8 pb-2">Distress Beacon Manifest</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="border-b border-white/8 text-slate-500">
                        <th className="py-2 text-left">SOS ID</th>
                        <th className="py-2 text-left">Sender/Beacon</th>
                        <th className="py-2 text-left">Injury Severity</th>
                        <th className="py-2 text-left">People</th>
                        <th className="py-2 text-left">Logged Time</th>
                        <th className="py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-350">
                      {sosMessages.map(msg => (
                        <tr key={msg.id} className="hover:bg-white/5">
                          <td className="py-3 font-bold text-slate-100">{msg.id}</td>
                          <td className="py-3">
                            <span className="font-sans font-bold text-slate-200">{msg.victimName}</span>
                            <span className="block text-[10px] text-slate-500">"{msg.message.substring(0, 45)}..."</span>
                          </td>
                          <td className="py-3">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                              msg.injuryLevel === 'Critical' ? 'bg-red-500/20 text-red-400' :
                              msg.injuryLevel === 'Serious' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>{msg.injuryLevel}</span>
                          </td>
                          <td className="py-3 font-bold">{msg.peopleCount}</td>
                          <td className="py-3">{msg.time}</td>
                          <td className="py-3">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                              msg.status === 'Unacknowledged' ? 'bg-red-500/10 text-red-400' :
                              msg.status === 'Acknowledged' ? 'bg-amber-500/10 text-amber-400' : 'bg-green-500/10 text-green-400'
                            }`}>{msg.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Hazard Zones':
        return (
          <div className="space-y-6 text-left">
            <div className="flex flex-col gap-1 border-b border-white/8 pb-4">
              <h2 className="text-xl font-bold text-slate-100 font-display">Active Hazard & Transit Zones</h2>
              <p className="text-xs text-slate-400">Restricted areas and staging corridors mapped by emergency aircraft sensors.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-1">
                <HazardSummaryPanel />
              </div>
              <div className="xl:col-span-2 glass-card rounded-xl border border-white/6 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 border-b border-white/8 pb-2 text-left">Threat boundaries</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="border-b border-white/8 text-slate-500">
                        <th className="py-2 text-left">Threat ID</th>
                        <th className="py-2 text-left">Zone Name</th>
                        <th className="py-2 text-left">Category</th>
                        <th className="py-2 text-left">Severity</th>
                        <th className="py-2 text-left">Boundaries</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      <tr>
                        <td className="py-3 font-bold">HAZ-01</td>
                        <td className="py-3 font-sans">Boulder Creek Overflow Zone</td>
                        <td className="py-3 text-blue-400 font-bold">Flood Warning</td>
                        <td className="py-3"><span className="text-red-400 font-bold">High</span></td>
                        <td className="py-3">4 coordinates logged</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold">HAZ-02</td>
                        <td className="py-3 font-sans">Pine Ridge Forest Fire Front</td>
                        <td className="py-3 text-red-400 font-bold">Wildfire Front</td>
                        <td className="py-3"><span className="text-red-400 font-bold">High</span></td>
                        <td className="py-3">4 coordinates logged</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold">HAZ-03</td>
                        <td className="py-3 font-sans">Canyon Road Mudslide Risk Area</td>
                        <td className="py-3 text-yellow-500 font-bold">Landslide Risk</td>
                        <td className="py-3"><span className="text-amber-400">Medium</span></td>
                        <td className="py-3">4 coordinates logged</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Ground Nodes':
        return (
          <div className="space-y-6 text-left">
            <div className="flex flex-col gap-1 border-b border-white/8 pb-4">
              <h2 className="text-xl font-bold text-slate-100 font-display">Ground Relay Terminals</h2>
              <p className="text-xs text-slate-400 font-sans">Incidental mesh nodes deployed via air-drops or manual relays to route network communication.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {groundNodes.map(node => (
                <div key={node.id} className="glass-card rounded-xl border border-white/6 p-4 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <div className="flex items-center gap-2">
                      <Radio className="h-4.5 w-4.5 text-cyan-400" />
                      <span className="font-mono text-sm font-bold text-slate-200">{node.id}</span>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      node.status === 'Online' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      node.status === 'Connecting' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>{node.status}</span>
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <p className="text-slate-400 font-sans"><span className="text-slate-500 font-bold uppercase font-mono text-[9px] block">Terminal sector</span> {node.name}</p>
                    <div className="flex justify-between border-t border-white/5 pt-2">
                      <span className="text-slate-500">Relay Battery:</span>
                      <span className="text-slate-200 font-bold">{node.battery}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Connected Peers:</span>
                      <span className="text-cyan-400 font-bold">{node.connections} terminals</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Reports':
        return <ReportsPanel />;
      case 'Analytics':
        return <AnalyticsPanel />;
      case 'Settings':
        return <SettingsPanel />;
      default:
        return <div className="py-20 text-center text-slate-500">Screen layout under engineering.</div>;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#080c14] text-[#f8fafc] font-sans pb-16 lg:pb-0">
      {/* Top emergency Header bar */}
      <Header onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Main layout container */}
      <div className="flex flex-1 w-full relative">
        {/* Navigation Sidebar */}
        <Sidebar mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />

        {/* Dashboard Main Viewport */}
        <main className={`flex-1 p-3 sm:p-4 md:p-6 overflow-hidden max-w-full transition-all duration-200 ${
          sidebarCollapsed ? 'lg:pl-3' : 'lg:pl-4'
        }`}>
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex h-16 border-t border-white/8 bg-[#0f1524]/90 backdrop-blur-md lg:hidden">
        <button 
          onClick={() => setActivePage('Dashboard')} 
          className={`flex-1 flex flex-col items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-wider ${
            activePage === 'Dashboard' ? 'text-blue-400 font-black' : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </button>
        <button 
          onClick={() => setActivePage('Live Map')} 
          className={`flex-1 flex flex-col items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-wider ${
            activePage === 'Live Map' ? 'text-blue-400 font-black' : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Map className="h-5 w-5" />
          Map
        </button>
        <button 
          onClick={() => setActivePage('SOS Inbox')} 
          className={`flex-1 flex flex-col items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-wider ${
            activePage === 'SOS Inbox' ? 'text-blue-400 font-black' : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <div className="relative">
            <Mail className="h-5 w-5" />
            {sosMessages.filter(s => s.status === 'Unacknowledged').length > 0 && (
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
            )}
          </div>
          SOS ({sosMessages.filter(s => s.status === 'Unacknowledged').length})
        </button>
        <button 
          onClick={() => setActivePage('Survivor Detection')} 
          className={`flex-1 flex flex-col items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-wider ${
            activePage === 'Survivor Detection' ? 'text-blue-400 font-black' : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Search className="h-5 w-5" />
          Detections
        </button>
        <button 
          onClick={() => setActivePage('Settings')} 
          className={`flex-1 flex flex-col items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-wider ${
            activePage === 'Settings' ? 'text-blue-400 font-black' : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <SettingsIcon className="h-5 w-5" />
          Settings
        </button>
      </div>
    </div>
  );
};

export default App;
