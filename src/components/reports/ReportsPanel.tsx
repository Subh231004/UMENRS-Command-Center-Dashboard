import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  FileText, 
  Download, 
  Plane, 
  Users,
  FileSpreadsheet,
  Map
} from 'lucide-react';

export const ReportsPanel: React.FC = () => {
  const { uavs, survivors, sosMessages } = useDashboard();
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  // Functional CSV exporter
  const handleCSVExport = (type: string) => {
    setGeneratingReport(type);
    
    setTimeout(() => {
      let dataToExport: any[] = [];
      let filename = `${type}_report_${Date.now()}.csv`;

      if (type === 'survivor') {
        dataToExport = survivors.map(s => ({
          ID: s.id,
          UAV_Source: s.uavId,
          Confidence: `${s.confidence}%`,
          Latitude: s.coords[0],
          Longitude: s.coords[1],
          Distance_Node_Meters: s.distance,
          Time: s.time,
          Severity: s.severity
        }));
      } else if (type === 'telemetry') {
        dataToExport = uavs.map(u => ({
          ID: u.id,
          Name: u.name,
          Status: u.status,
          Battery: `${u.battery}%`,
          Speed_KMH: u.speed,
          Altitude_Meters: u.altitude,
          Heading_Degrees: u.heading,
          Latitude: u.coords[0],
          Longitude: u.coords[1],
          Signal_Strength: `${u.signal}%`,
          GPS_Satellites: u.gpsSatellites
        }));
      } else {
        dataToExport = sosMessages.map(s => ({
          ID: s.id,
          Victim: s.victimName,
          Latitude: s.coords[0],
          Longitude: s.coords[1],
          Trauma_Level: s.injuryLevel,
          People_Count: s.peopleCount,
          Time: s.time,
          Message: s.message.replace(/,/g, ';'),
          Status: s.status
        }));
      }

      if (dataToExport.length === 0) return;

      const headers = Object.keys(dataToExport[0]).join(',');
      const rows = dataToExport.map(item => 
        Object.values(item).map(val => typeof val === 'string' ? `"${val}"` : val).join(',')
      );
      
      const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setGeneratingReport(null);
    }, 1000);
  };

  // Functional GeoJSON exporter
  const handleGeoJSONExport = () => {
    setGeneratingReport('geojson');
    
    setTimeout(() => {
      // Pack survivors and SOS as GeoJSON features
      const features: any[] = [];

      // UAV features
      uavs.forEach(u => {
        if (u.status === 'Active') {
          features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [u.coords[1], u.coords[0]] // GeoJSON uses [lng, lat]
            },
            properties: {
              id: u.id,
              type: "uav",
              battery: u.battery,
              speed: u.speed,
              altitude: u.altitude
            }
          });
        }
      });

      // Survivor features
      survivors.forEach(s => {
        features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [s.coords[1], s.coords[0]]
          },
          properties: {
            id: s.id,
            type: "survivor",
            confidence: s.confidence,
            severity: s.severity
          }
        });
      });

      // SOS features
      sosMessages.forEach(sos => {
        features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [sos.coords[1], sos.coords[0]]
          },
          properties: {
            id: sos.id,
            type: "sos",
            victim: sos.victimName,
            injuryLevel: sos.injuryLevel,
            peopleCount: sos.peopleCount,
            message: sos.message
          }
        });
      });

      const geojson = {
        type: "FeatureCollection",
        metadata: {
          title: "UMENRS Emergency Operations Map Export",
          timestamp: new Date().toISOString()
        },
        features
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geojson, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `umenrs_emergency_map_${Date.now()}.geojson`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setGeneratingReport(null);
    }, 1000);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const reportsList = [
    {
      title: 'Mission Manifest Summary',
      description: 'Comprehensive incident command overview. Contains incident description, UAV orbit sectors, and rescue response summaries.',
      icon: FileText,
      actionText: 'Print PDF / Manifest',
      action: handlePrintPDF,
      key: 'pdf'
    },
    {
      title: 'Survivor Detection Logs',
      description: 'Tabular database of all active thermal coordinates cataloged by AI models including confidence indices.',
      icon: Users,
      actionText: 'Download CSV',
      action: () => handleCSVExport('survivor'),
      key: 'survivor'
    },
    {
      title: 'UAV Telemetry History',
      description: 'Complete flight logs including battery discharge rates, signal decibel readings, and speed indexes.',
      icon: Plane,
      actionText: 'Download CSV',
      action: () => handleCSVExport('telemetry'),
      key: 'telemetry'
    },
    {
      title: 'SOS distress manifest',
      description: 'Raw feed entries of civilian distress beacons. Includes injury levels, counts, and dispatcher remarks.',
      icon: FileSpreadsheet,
      actionText: 'Download CSV',
      action: () => handleCSVExport('sos'),
      key: 'sos'
    },
    {
      title: 'Geographic GIS Coordinates',
      description: 'GeoJSON payload mapping active orbits, danger polygons, and survivor locations suitable for QGIS/FEMA layouts.',
      icon: Map,
      actionText: 'Download GeoJSON',
      action: handleGeoJSONExport,
      key: 'geojson'
    }
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-100 font-display">Operational Manifests & GIS Exports</h2>
        <p className="text-xs text-slate-400">Generate and download official incident command logs, coordinate files, and network summaries for distribution.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left column: Action cards */}
        <div className="space-y-4 xl:col-span-2">
          {reportsList.map((rep) => {
            const Icon = rep.icon;
            const isProcessing = generatingReport === rep.key;
            
            return (
              <div 
                key={rep.key} 
                className="glass-card rounded-xl border border-white/6 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-200 font-display">{rep.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal max-w-lg">{rep.description}</p>
                  </div>
                </div>

                <button
                  onClick={rep.action}
                  disabled={generatingReport !== null}
                  className={`flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-xs font-bold uppercase transition select-none ${
                    generatingReport !== null 
                      ? 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/10 border border-blue-400/20'
                  }`}
                >
                  <Download className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
                  {isProcessing ? 'Compiling...' : rep.actionText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Right column: Document manifest preview */}
        <div className="glass-card rounded-xl border border-white/6 p-4 h-fit flex flex-col gap-4 font-mono text-[10px] text-slate-400">
          <div className="border-b border-white/8 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-display">Manifest Print Preview</h3>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">Draft layout</p>
          </div>

          <div className="bg-slate-950/40 border border-white/5 p-4 rounded-xl space-y-4 text-left leading-normal overflow-y-auto max-h-[360px]">
            <div className="text-center border-b border-white/8 pb-3">
              <h4 className="font-bold text-slate-100 text-xs uppercase tracking-wider">INCIDENT REPORT FORM</h4>
              <p className="text-[8px] text-slate-500 mt-1">UMENRS COMMAND SYSTEM // NDMA REGISTRY</p>
            </div>
            
            <div className="space-y-1">
              <div><span className="text-slate-500">INCIDENT ID :</span> UMENRS-2026-CO-009</div>
              <div><span className="text-slate-500">DATE/TIME   :</span> 2026-06-28 22:13:51 LOCAL</div>
              <div><span className="text-slate-500">SECTOR      :</span> BOULDER COUNTY CREEK DRAINAGE</div>
              <div><span className="text-slate-500">CATEGORY    :</span> FLASH FLOODING & landslide FRONT</div>
            </div>

            <div className="border-t border-white/5 pt-2">
              <p className="font-bold text-slate-300 uppercase mb-1">Asset Allocation</p>
              <div>• Active Orbiters : 3 Drones (Gorgon, Scout, Raptor)</div>
              <div>• Relay Nodes    : 2 Active, 1 Connecting, 1 Offline</div>
            </div>

            <div className="border-t border-white/5 pt-2">
              <p className="font-bold text-slate-300 uppercase mb-1">Human Impact Metrics</p>
              <div>• Total AI Detections : {survivors.length} thermal signatures</div>
              <div>• SOS beacons logged  : {sosMessages.length} distress beacons</div>
              <div>• Status Acknowledged : {sosMessages.filter(s => s.status !== 'Unacknowledged').length} files</div>
              <div>• Rescue Teams Out   : {sosMessages.filter(s => s.status === 'Dispatched').length} dispatches</div>
            </div>

            <div className="border-t border-white/5 pt-2 text-center text-[8px] text-slate-600 uppercase">
              CONFIDENTIAL // DEMO AND DRILL MANIFEST ONLY
            </div>
          </div>
          
          <button 
            onClick={handlePrintPDF}
            className="flex h-9 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition font-bold text-xs uppercase"
          >
            <FileText className="h-4 w-4" /> Trigger System Print
          </button>
        </div>
      </div>
    </div>
  );
};
