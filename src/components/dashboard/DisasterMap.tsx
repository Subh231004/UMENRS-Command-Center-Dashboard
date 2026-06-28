import React, { useEffect, useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polyline, 
  Polygon, 
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import { useDashboard } from '../../context/DashboardContext';
import type { MapLayers } from '../../context/DashboardContext';
import { 
  RefreshCw, 
  Layers, 
  Compass
} from 'lucide-react';

// Re-define leaflet default icons to work around Webpack/Vite asset resolution failures
// We are using custom divIcons for custom styling and performance.

const createUAVIcon = (heading: number, isSelected: boolean) => L.divIcon({
  className: 'custom-leaflet-marker',
  html: `<div style="transform: rotate(${heading}deg); transition: transform 0.3s ease;">
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="16" fill="rgba(59, 130, 246, 0.15)" stroke="${isSelected ? '#3b82f6' : '#64748b'}" stroke-width="1.5" stroke-dasharray="3 3" />
      <!-- Drone shape -->
      <path d="M20 10 L20 30 M10 20 L30 20" stroke="${isSelected ? '#60a5fa' : '#94a3b8'}" stroke-width="2" />
      <circle cx="10" cy="20" r="2" fill="#ef4444" />
      <circle cx="30" cy="20" r="2" fill="#ef4444" />
      <circle cx="20" cy="10" r="2" fill="#10b981" />
      <circle cx="20" cy="30" r="2" fill="#10b981" />
      <!-- Center core -->
      <circle cx="20" cy="20" r="5" fill="${isSelected ? '#3b82f6' : '#475569'}" stroke="#ffffff" stroke-width="1" />
    </svg>
  </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17]
});

const createSurvivorIcon = (severity: 'Critical' | 'Moderate' | 'Stable') => {
  const color = severity === 'Critical' ? '#ef4444' : severity === 'Moderate' ? '#f59e0b' : '#10b981';
  const pingColor = severity === 'Critical' ? 'bg-red-500' : severity === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500';
  
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div class="relative flex items-center justify-center">
      <span class="absolute inline-flex h-7 w-7 animate-ping rounded-full ${pingColor}/30 opacity-75"></span>
      <div class="h-4 w-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center" style="background: ${color};">
        <div class="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></div>
      </div>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const createSOSIcon = (injuryLevel: 'Critical' | 'Serious' | 'Minor', status: string) => {
  const color = injuryLevel === 'Critical' ? '#ef4444' : injuryLevel === 'Serious' ? '#f59e0b' : '#3b82f6';
  const isPending = status === 'Unacknowledged';
  const strokeColor = isPending ? '#ffffff' : '#94a3b8';
  
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div class="relative flex items-center justify-center" style="filter: drop-shadow(0 0 6px ${color});">
      ${isPending ? `<span class="absolute inline-flex h-9 w-9 animate-ping rounded-full" style="background: ${color}40; opacity: 0.8;"></span>` : ''}
      <div class="flex h-6.5 w-6.5 items-center justify-center rounded-md border border-white/20 bg-slate-900 text-white font-bold" style="border-top: 2px solid ${color};">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      </div>
    </div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
};

const createNodeIcon = (status: 'Online' | 'Offline' | 'Connecting') => {
  const color = status === 'Online' ? '#10b981' : status === 'Connecting' ? '#f59e0b' : '#ef4444';
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div class="flex items-center justify-center h-6 w-6 rounded-full border border-white/10 bg-slate-950/80 text-white">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="${status === 'Connecting' ? 'animate-spin' : ''}">
        <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/>
        <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/>
        <circle cx="12" cy="12" r="2"/>
        <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/>
        <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/>
      </svg>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const createLandingZoneIcon = (status: string) => {
  const color = status === 'Clear' ? '#10b981' : '#ef4444';
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div class="flex items-center justify-center h-6 w-6 rounded-full border-2 border-dashed bg-slate-900/90 text-xs font-black font-display" style="border-color: ${color}; color: ${color};">
      H
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Map fly-to controller component
const MapFlyToController: React.FC = () => {
  const map = useMap();
  const { flyToTarget, triggerFlyTo } = useDashboard();

  useEffect(() => {
    if (flyToTarget) {
      map.setView(flyToTarget, 16, {
        animate: true,
        duration: 1.2
      });
      // Clear fly to target in context after flying
      const timer = setTimeout(() => {
        triggerFlyTo(null);
      }, 1300);
      return () => clearTimeout(timer);
    }
  }, [flyToTarget, map, triggerFlyTo]);

  return null;
};

export const DisasterMap: React.FC = () => {
  const {
    mapCenter,
    mapZoom,
    layers,
    toggleLayer,
    uavs,
    selectedUavId,
    setSelectedUavId,
    survivors,
    sosMessages,
    groundNodes,
    landingZones,
    resetMap
  } = useDashboard();

  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [mapRefreshing, setMapRefreshing] = useState(false);

  const handleRefresh = () => {
    setMapRefreshing(true);
    setTimeout(() => setMapRefreshing(false), 800);
  };

  // Hazard color helpers
  const getHazardStyle = (type: 'Flood' | 'Fire' | 'Landslide') => {
    switch (type) {
      case 'Flood':
        return { fillColor: '#3b82f6', fillOpacity: 0.25, color: '#2563eb', weight: 2, dashArray: '4' };
      case 'Fire':
        return { fillColor: '#ef4444', fillOpacity: 0.3, color: '#dc2626', weight: 2 };
      case 'Landslide':
        return { fillColor: '#eab308', fillOpacity: 0.25, color: '#ca8a04', weight: 2, dashArray: '5 5' };
    }
  };

  const activeUAVObject = uavs.find(u => u.id === selectedUavId);

  return (
    <div className="relative flex h-full min-h-[380px] w-full flex-col rounded-xl border border-white/8 bg-[#0b0f19] overflow-hidden">
      {/* Map Element */}
      <div className="relative flex-1 z-10">
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          zoomControl={false}
          className="h-full w-full"
        >
          {/* Fly to controller */}
          <MapFlyToController />
          
          {/* OpenStreetMap Tile Layer with dark command theme filters override */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="dark-tiles"
          />

          {/* Hazard Polygons */}
          {layers.hazards && (
            <>
              {/* Flood Zone */}
              <Polygon 
                positions={[
                  [40.0165, -105.2850],
                  [40.0175, -105.2720],
                  [40.0135, -105.2680],
                  [40.0110, -105.2810]
                ]} 
                pathOptions={getHazardStyle('Flood')}
              >
                <Popup>
                  <div className="text-xs">
                    <p className="font-bold text-blue-400">Flood Warning Zone A</p>
                    <p className="text-slate-300">Boulder Creek Overflow. Water depth elevated 1.8m.</p>
                  </div>
                </Popup>
              </Polygon>

              {/* Fire Zone */}
              <Polygon 
                positions={[
                  [40.0260, -105.2650],
                  [40.0290, -105.2580],
                  [40.0240, -105.2520],
                  [40.0220, -105.2600]
                ]} 
                pathOptions={getHazardStyle('Fire')}
              >
                <Popup>
                  <div className="text-xs">
                    <p className="font-bold text-red-400">Forest Fire Front</p>
                    <p className="text-slate-300">Wildfire spreading east. Winds NE 24km/h. No flights recommended below 100m.</p>
                  </div>
                </Popup>
              </Polygon>

              {/* Landslide Zone */}
              <Polygon 
                positions={[
                  [40.0070, -105.2950],
                  [40.0095, -105.2920],
                  [40.0080, -105.2880],
                  [40.0050, -105.2910]
                ]} 
                pathOptions={getHazardStyle('Landslide')}
              >
                <Popup>
                  <div className="text-xs">
                    <p className="font-bold text-yellow-500">Active Slide Risk</p>
                    <p className="text-slate-300">Unstable soil near canyon pass. Ground transit restricted.</p>
                  </div>
                </Popup>
              </Polygon>
            </>
          )}

          {/* UAV flight path lines */}
          {layers.uavs && uavs.map(uav => {
            if (uav.status !== 'Active' || uav.path.length < 2) return null;
            const isSelected = uav.id === selectedUavId;
            return (
              <Polyline
                key={`path-${uav.id}`}
                positions={uav.path}
                pathOptions={{ 
                  color: isSelected ? '#3b82f6' : '#475569', 
                  weight: isSelected ? 3 : 1.5,
                  opacity: isSelected ? 0.8 : 0.4,
                  dashArray: isSelected ? undefined : '5, 5'
                }}
              />
            );
          })}

          {/* UAV Drone Markers */}
          {layers.uavs && uavs.map(uav => {
            if (uav.status !== 'Active') return null;
            const isSelected = uav.id === selectedUavId;
            return (
              <Marker
                key={uav.id}
                position={uav.coords}
                icon={createUAVIcon(uav.heading, isSelected)}
                eventHandlers={{
                  click: () => setSelectedUavId(uav.id)
                }}
              >
                <Popup>
                  <div className="text-xs min-w-40 font-mono">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1 mb-1">
                      <span className="font-bold text-blue-400">{uav.id}</span>
                      <span className="text-slate-400 bg-white/5 px-1 rounded text-[9px]">{uav.status}</span>
                    </div>
                    <p className="text-slate-300">Bat: <span className="text-white font-bold">{uav.battery}%</span></p>
                    <p className="text-slate-300">Alt: <span className="text-white">{uav.altitude}m</span> | Spd: <span className="text-white">{uav.speed}km/h</span></p>
                    <p className="text-slate-300 font-semibold mt-1">Telemetry Signal: {uav.signal}%</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* AI Survivor Markers */}
          {layers.survivors && survivors.map(surv => (
            <Marker
              key={surv.id}
              position={surv.coords}
              icon={createSurvivorIcon(surv.severity)}
            >
              <Popup>
                <div className="text-xs">
                  <div className="flex justify-between items-center border-b border-white/10 pb-1 mb-1">
                    <span className="font-mono font-bold text-green-400">{surv.id}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      surv.severity === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>{surv.severity}</span>
                  </div>
                  <p className="text-slate-300">AI Confidence: <span className="text-white font-bold">{surv.confidence}%</span></p>
                  <p className="text-slate-300">Time Spotted: <span className="text-white">{surv.time}</span></p>
                  <p className="text-slate-300">Distance to Node: <span className="text-white">{surv.distance}m</span></p>
                  <p className="text-slate-400 text-[10px] italic mt-1">Sensor Source: {surv.uavId}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* SOS distress signals */}
          {layers.sos && sosMessages.map(msg => (
            <Marker
              key={msg.id}
              position={msg.coords}
              icon={createSOSIcon(msg.injuryLevel, msg.status)}
            >
              <Popup>
                <div className="text-xs max-w-48">
                  <div className="flex justify-between items-center border-b border-white/10 pb-1 mb-1">
                    <span className="font-bold text-red-500 font-mono">{msg.id}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      msg.status === 'Unacknowledged' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      msg.status === 'Acknowledged' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'
                    }`}>{msg.status}</span>
                  </div>
                  <p className="text-slate-200 font-semibold mb-1">{msg.victimName} ({msg.peopleCount} pax)</p>
                  <p className="text-slate-300 text-[11px] leading-tight mb-1 bg-white/5 p-1 rounded">"{msg.message}"</p>
                  <p className="text-slate-400 text-[9px]">Distress GPS: {msg.coords[0].toFixed(5)}, {msg.coords[1].toFixed(5)}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Ground Relay Nodes */}
          {layers.nodes && groundNodes.map(node => (
            <Marker
              key={node.id}
              position={node.coords}
              icon={createNodeIcon(node.status)}
            >
              <Popup>
                <div className="text-xs font-mono">
                  <div className="flex justify-between items-center border-b border-white/10 pb-1 mb-1">
                    <span className="font-bold text-cyan-400">{node.id}</span>
                    <span className={`text-[9px] px-1 rounded ${
                      node.status === 'Online' ? 'bg-green-500/20 text-green-400' :
                      node.status === 'Connecting' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                    }`}>{node.status}</span>
                  </div>
                  <p className="text-slate-300">Name: <span className="text-white">{node.name}</span></p>
                  <p className="text-slate-300">Link Battery: <span className="text-white">{node.battery}%</span></p>
                  <p className="text-slate-300 font-semibold mt-1 text-cyan-400">Mesh peers: {node.connections} terminals</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Emergency Landing Zones */}
          {layers.landingZones && landingZones.map(lz => (
            <Marker
              key={lz.id}
              position={lz.coords}
              icon={createLandingZoneIcon(lz.status)}
            >
              <Popup>
                <div className="text-xs font-mono">
                  <p className="font-bold text-emerald-400">{lz.id} - Helipad</p>
                  <p className="text-slate-300">Sector: {lz.name}</p>
                  <p className={`text-[10px] font-bold ${lz.status === 'Clear' ? 'text-green-400' : 'text-red-400'}`}>
                    Landing status: {lz.status}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

        </MapContainer>
      </div>

      {/* Floating HUD controls */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        {/* Re-center Map */}
        <button 
          onClick={resetMap}
          title="Reset Map Bounds"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-slate-900/90 text-slate-300 shadow-lg backdrop-blur-md transition hover:bg-slate-800 hover:text-white"
        >
          <Compass className="h-4.5 w-4.5" />
        </button>

        {/* Signal Refresh */}
        <button 
          onClick={handleRefresh}
          title="Refresh Network Signals"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-slate-900/90 text-slate-300 shadow-lg backdrop-blur-md transition hover:bg-slate-800 hover:text-white"
        >
          <RefreshCw className={`h-4.5 w-4.5 ${mapRefreshing ? 'animate-spin text-blue-400' : ''}`} />
        </button>

        {/* Map Layers Toggler */}
        <div className="relative">
          <button 
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 shadow-lg backdrop-blur-md transition ${
              showLayerMenu ? 'bg-blue-600/80 text-white' : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Layers className="h-4.5 w-4.5" />
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#0f1524]/95 p-2 shadow-2xl backdrop-blur-xl">
              <h4 className="border-b border-white/8 px-1.5 py-1 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Layer Visibility
              </h4>
              <div className="mt-1 space-y-1">
                {(Object.keys(layers) as Array<keyof MapLayers>).map((key) => (
                  <label 
                    key={key} 
                    className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-xs text-slate-300 hover:bg-white/5 cursor-pointer select-none capitalize"
                  >
                    <input 
                      type="checkbox" 
                      checked={layers[key]}
                      onChange={() => toggleLayer(key)}
                      className="h-3.5 w-3.5 rounded border-white/15 bg-white/5 text-blue-600 outline-none focus:ring-0"
                    />
                    {key === 'uavs' ? 'UAVs & Paths' : key === 'landingZones' ? 'Landing Pads' : key}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating HUD Panel: Active UAV Stats - Bottom Left */}
      {activeUAVObject && (
        <div className="absolute bottom-3 left-3 z-20 hidden md:block max-w-64 rounded-xl border border-white/10 bg-[#0f1524]/85 p-2.5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-1 mb-1">
            <div className="flex items-center gap-1.5 text-blue-400">
              <Compass className="h-4 w-4 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="font-mono text-xs font-bold">{activeUAVObject.id} Tracker</span>
            </div>
            <span className="text-[9px] text-slate-400 bg-white/5 px-1 rounded uppercase font-bold">{activeUAVObject.status}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[10px] text-slate-300">
            <div>Speed: <span className="text-white font-bold">{activeUAVObject.speed} km/h</span></div>
            <div>Altitude: <span className="text-white font-bold">{activeUAVObject.altitude} m</span></div>
            <div>Signal: <span className="text-white font-bold">{activeUAVObject.signal}%</span></div>
            <div>Heading: <span className="text-white font-bold">{activeUAVObject.heading}°</span></div>
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[9px] text-slate-500 font-bold uppercase">Sector Scan progress</span>
            <span className="text-[10px] text-slate-200 font-bold">{activeUAVObject.progress}%</span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${activeUAVObject.progress}%` }}></div>
          </div>
        </div>
      )}

      {/* Floating Map Legend - Bottom Right */}
      <div className="absolute bottom-3 right-3 z-20 hidden lg:block rounded-xl border border-white/10 bg-[#0f1524]/85 p-2.5 shadow-2xl backdrop-blur-md max-w-48 font-mono text-[9px]">
        <h4 className="border-b border-white/10 pb-1 mb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">Emergency Legend</h4>
        <div className="space-y-1.5 text-slate-300">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span>Critical Victim (SOS)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
            <span>Spotted Survivor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-3 w-3 items-center justify-center border border-blue-500/40 rounded bg-blue-500/20">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="3"><circle cx="12" cy="12" r="10"/></svg>
            </div>
            <span>UAV Active Orbiter</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-4 bg-blue-500/20 border border-blue-500/50 rounded-sm"></span>
            <span>Flooded Creek Sector</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-4 bg-red-500/20 border border-red-500/50 rounded-sm"></span>
            <span>Fire Outbreak Front</span>
          </div>
        </div>
      </div>
    </div>
  );
};
