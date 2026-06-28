# 🛸 UMENRS (UAV Emergency Network Relay System) Dashboard

[![Active Mission](https://img.shields.io/badge/Mission-Active-green.svg?style=flat-square)](#)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg?style=flat-square)](#)
[![React](https://img.shields.io/badge/Framework-React--TS-cyan.svg?style=flat-square)](#)
[![Vite](https://img.shields.io/badge/Build-Vite-purple.svg?style=flat-square)](#)

A high-fidelity, responsive emergency command center dashboard for the **UAV Emergency Network Relay System (UMENRS)**. This system is designed to simulate tactical disaster monitoring, AI-driven survivor search coordinates, and mesh network relay deployments during communication outages.

The user interface matches emergency software layout requirements used by professional disaster response groups like FEMA, NDMA, and search & rescue command operations.

---

## 📸 Key Capabilities & Visual Modules

### 🗺️ Interactive Disaster Map
* Built with **React Leaflet** (OpenStreetMap) utilizing customized tactical dark-map filters.
* Animated vector icon markers for active UAV positions (rotating dynamically to represent flight headings).
* Pulsing red distress SOS beacons showing survivor locations.
* Green hotspots identifying AI-classified survivors.
* Multi-overlay configurations outlining regional disaster threats (Flood Zones, Wildfire Fronts, Mudslide Risks) alongside clear Helipads and Ground Relays.
* Smooth fly-to panning animations when focusing on target coordinates.

### 📊 Real-Time Telemetry Gauges
* Radial vector SVG progress indicators tracking airspeed, altitude levels, and communication signal strengths.
* Rotating compass indicator matching live UAV headers.
* Dynamic battery rings shifting from Green (healthy) to Amber/Red (low fuel limits) accompanied by alarm logs.

### 🚨 Live SOS Beacon Inbox
* Severity-sorted distress call boards containing victim counts, injury status, description messages, and GPS coordinates.
* Interactive command dispatching ("Acknowledge Beacons" and "Dispatch Ground Teams") reflecting on active map paths and timeline logs.

### 📈 Recharts Visual Analytics
* Area layouts displaying survivor scanning confidence trends.
* Stacked bar graphs tracking SOS receipts vs resolved dispatches.
* Composed line/bar charts correlating flight hours with battery draw metrics.
* Line latency indicators comparing satellite links with ground mesh node terminals.

### 📥 Manifest Export Center
* Functional browser download triggers generating actual **CSV files** (for telemetry logs, survivor coordinates, and SOS lists) and **GeoJSON layers** suitable for GIS imports.
* Interactive PDF printing setup presenting clean official manifests.

---

## 🛠️ Tech Stack & Dependencies

* **Core**: React.js (Vite template), TypeScript
* **Styling**: Tailwind CSS v4.0.0 (CSS-first configuration, zero config files)
* **Animation**: Framer Motion (smooth card mounts and dropdown transitions)
* **Maps**: Leaflet, React Leaflet (tactical tile styling)
* **Visualizations**: Recharts, SVG path sparklines
* **Iconography**: Lucide React

---

## 📂 Code Directory Layout

```bash
src/
├── components/
│   ├── analytics/
│   │   └── AnalyticsPanel.tsx      # Recharts visualizations
│   ├── dashboard/
│   │   ├── DisasterMap.tsx         # Leaflet GIS layout & controls
│   │   ├── KPICards.tsx            # Animated sparkline stats
│   │   ├── TelemetryPanel.tsx      # SVG dials & airspeed gauges
│   │   ├── SOSInboxPanel.tsx       # Alert management panels
│   │   ├── SurvivorPanel.tsx       # Animated thermal radar feeds
│   │   ├── HazardSummaryPanel.tsx  # Threat charts & weather summaries
│   │   ├── SystemHealthPanel.tsx   # Ping limits & node status
│   │   └── MissionTimeline.tsx     # Chronological log streams
│   ├── layout/
│   │   ├── Header.tsx              # Digital clocks & notification hubs
│   │   └── Sidebar.tsx             # Collapsible/Responsive navigation
│   ├── reports/
│   │   └── ReportsPanel.tsx        # Print manifesting & CSV/GeoJSON exports
│   └── settings/
│       └── SettingsPanel.tsx       # Localizations & GIS map styling
├── context/
│   └── DashboardContext.tsx        # State triggers & drift simulators
├── data/
│   └── mockData.ts                 # Database structure models
├── App.tsx                         # Core responsive switcher routing
├── main.tsx                        # Global provider wrapping
└── index.css                       # Glassmorphism helpers & custom classes
```

---

## ⚙️ Quick Start Installation

Ensure you have Node.js (v18+) installed.

### 1. Install Dependencies
```powershell
npm install
```

### 2. Launch Local Dev Server
```powershell
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### 3. Verify Code Compilation
```powershell
# Run TypeScript compilation checks
npx tsc --noEmit

# Compile production bundle
npm run build
```
