export interface UAV {
  id: string;
  name: string;
  status: 'Active' | 'Charging' | 'Maintenance' | 'Standby';
  battery: number; // 0-100
  speed: number; // km/h
  altitude: number; // meters
  heading: number; // degrees
  coords: [number, number]; // [lat, lng]
  signal: number; // 0-100 (percentage)
  gpsSatellites: number;
  progress: number; // 0-100 (mission progress)
  path: [number, number][];
}

export interface Survivor {
  id: string;
  uavId: string;
  confidence: number; // percentage
  coords: [number, number];
  distance: number; // distance to nearest node (m)
  time: string;
  severity: 'Critical' | 'Moderate' | 'Stable';
  thermalSnapshotType: 'heat' | 'infrared' | 'silhouette';
}

export interface SOSMessage {
  id: string;
  victimName: string;
  coords: [number, number];
  injuryLevel: 'Critical' | 'Serious' | 'Minor';
  peopleCount: number;
  time: string;
  status: 'Unacknowledged' | 'Acknowledged' | 'Dispatched';
  message: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  type: 'uav' | 'survivor' | 'node' | 'sos' | 'hazard' | 'completed';
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
}

export interface HazardZone {
  id: string;
  type: 'Flood' | 'Fire' | 'Landslide';
  name: string;
  polygon: [number, number][];
  severity: 'High' | 'Medium' | 'Low';
}

export interface GroundNode {
  id: string;
  name: string;
  coords: [number, number];
  status: 'Online' | 'Offline' | 'Connecting';
  battery: number;
  connections: number;
}

export interface LandingZone {
  id: string;
  name: string;
  coords: [number, number];
  status: 'Clear' | 'Obstructed';
}

// Coordinate baseline: Centered around a disaster scenario in a valley near a river (e.g. disaster strike in Boulder, CO area)
export const MAP_CENTER: [number, number] = [40.0150, -105.2705];

export const mockUAVs: UAV[] = [
  {
    id: 'UAV-101',
    name: 'Gorgon Eye 1',
    status: 'Active',
    battery: 68,
    speed: 52,
    altitude: 120,
    heading: 145,
    coords: [40.0195, -105.2630],
    signal: 94,
    gpsSatellites: 14,
    progress: 72,
    path: [
      [40.0120, -105.2800],
      [40.0145, -105.2750],
      [40.0160, -105.2700],
      [40.0180, -105.2650],
      [40.0195, -105.2630]
    ]
  },
  {
    id: 'UAV-102',
    name: 'Horizon Scout 2',
    status: 'Active',
    battery: 42,
    speed: 48,
    altitude: 150,
    heading: 280,
    coords: [40.0110, -105.2820],
    signal: 82,
    gpsSatellites: 12,
    progress: 35,
    path: [
      [40.0160, -105.2700],
      [40.0150, -105.2750],
      [40.0130, -105.2800],
      [40.0110, -105.2820]
    ]
  },
  {
    id: 'UAV-103',
    name: 'Thermal Raptor 3',
    status: 'Active',
    battery: 89,
    speed: 60,
    altitude: 180,
    heading: 45,
    coords: [40.0240, -105.2510],
    signal: 98,
    gpsSatellites: 16,
    progress: 88,
    path: [
      [40.0180, -105.2600],
      [40.0200, -105.2580],
      [40.0220, -105.2540],
      [40.0240, -105.2510]
    ]
  },
  {
    id: 'UAV-104',
    name: 'Network Relay 4',
    status: 'Standby',
    battery: 100,
    speed: 0,
    altitude: 0,
    heading: 0,
    coords: [40.0150, -105.2705],
    signal: 100,
    gpsSatellites: 0,
    progress: 0,
    path: []
  }
];

export const mockSurvivors: Survivor[] = [
  {
    id: 'SURV-001',
    uavId: 'UAV-101',
    confidence: 96.8,
    coords: [40.0210, -105.2600],
    distance: 42,
    time: '22:08:45',
    severity: 'Critical',
    thermalSnapshotType: 'heat'
  },
  {
    id: 'SURV-002',
    uavId: 'UAV-101',
    confidence: 84.5,
    coords: [40.0175, -105.2660],
    distance: 120,
    time: '22:10:12',
    severity: 'Moderate',
    thermalSnapshotType: 'silhouette'
  },
  {
    id: 'SURV-003',
    uavId: 'UAV-103',
    confidence: 91.2,
    coords: [40.0255, -105.2490],
    distance: 85,
    time: '22:12:30',
    severity: 'Stable',
    thermalSnapshotType: 'infrared'
  }
];

export const mockSOSMessages: SOSMessage[] = [
  {
    id: 'SOS-302',
    victimName: 'Marcus & Family',
    coords: [40.0090, -105.2860],
    injuryLevel: 'Critical',
    peopleCount: 4,
    time: '22:04:15',
    status: 'Unacknowledged',
    message: 'Trapped on second story balcony due to rising flood waters. Child has severe head injury from falling debris. Power grid is completely offline.'
  },
  {
    id: 'SOS-303',
    victimName: 'Sarah Jenkins',
    coords: [40.0135, -105.2730],
    injuryLevel: 'Serious',
    peopleCount: 2,
    time: '22:07:33',
    status: 'Acknowledged',
    message: 'Trapped under fallen rafters in warehouse lobby. I can hear UAVs above. Leg is broken, bleeding is slow but persistent. Need extraction.'
  },
  {
    id: 'SOS-304',
    victimName: 'Community Center Shelter',
    coords: [40.0225, -105.2580],
    injuryLevel: 'Minor',
    peopleCount: 18,
    time: '22:09:50',
    status: 'Dispatched',
    message: 'Shelter is holding but water is encroaching fast. Comm relay node deployed nearby but signal strength is fluctuating. Requesting sandbag drone dispatch.'
  }
];

export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: 'EVT-001',
    time: '21:30:00',
    type: 'uav',
    message: 'Emergency command initialized. UAV Fleet standby protocols active.',
    severity: 'info'
  },
  {
    id: 'EVT-002',
    time: '21:35:10',
    type: 'node',
    message: 'Ground Node-Alpha successfully deployed and established satellite link.',
    severity: 'success'
  },
  {
    id: 'EVT-003',
    time: '21:40:00',
    type: 'uav',
    message: 'UAV-101 (Gorgon Eye 1) and UAV-102 (Horizon Scout 2) launched for zone scanning.',
    severity: 'info'
  },
  {
    id: 'EVT-004',
    time: '22:04:15',
    type: 'sos',
    message: 'SOS distress signal received from Marcus & Family. Severity classification: CRITICAL.',
    severity: 'critical'
  },
  {
    id: 'EVT-005',
    time: '22:07:33',
    type: 'sos',
    message: 'SOS request acknowledged for Sarah Jenkins. Dispatch queue assigned.',
    severity: 'warning'
  },
  {
    id: 'EVT-006',
    time: '22:08:45',
    type: 'survivor',
    message: 'AI Thermal Scan detected human silhouette (SURV-001) in Zone-C (96.8% confidence).',
    severity: 'critical'
  },
  {
    id: 'EVT-007',
    time: '22:11:00',
    type: 'node',
    message: 'Ground Node-Beta deployed via drone drop to strengthen network relay over flooded sectors.',
    severity: 'success'
  },
  {
    id: 'EVT-008',
    time: '22:12:30',
    type: 'survivor',
    message: 'AI Model identified survivor cluster SURV-003 near assembly zone.',
    severity: 'info'
  }
];

export const mockHazardZones: HazardZone[] = [
  {
    id: 'HAZ-1',
    type: 'Flood',
    name: 'Boulder Creek Overflow Zone',
    polygon: [
      [40.0165, -105.2850],
      [40.0175, -105.2720],
      [40.0135, -105.2680],
      [40.0110, -105.2810]
    ],
    severity: 'High'
  },
  {
    id: 'HAZ-2',
    type: 'Fire',
    name: 'Pine Ridge Forest Fire Front',
    polygon: [
      [40.0260, -105.2650],
      [40.0290, -105.2580],
      [40.0240, -105.2520],
      [40.0220, -105.2600]
    ],
    severity: 'High'
  },
  {
    id: 'HAZ-3',
    type: 'Landslide',
    name: 'Canyon Road Mudslide Risk Area',
    polygon: [
      [40.0070, -105.2950],
      [40.0095, -105.2920],
      [40.0080, -105.2880],
      [40.0050, -105.2910]
    ],
    severity: 'Medium'
  }
];

export const mockGroundNodes: GroundNode[] = [
  {
    id: 'NODE-A',
    name: 'Relay Alpha (Command)',
    coords: [40.0150, -105.2705],
    status: 'Online',
    battery: 92,
    connections: 18
  },
  {
    id: 'NODE-B',
    name: 'Relay Beta (Flood sector)',
    coords: [40.0140, -105.2770],
    status: 'Online',
    battery: 64,
    connections: 9
  },
  {
    id: 'NODE-C',
    name: 'Relay Gamma (Canyon pass)',
    coords: [40.0180, -105.2610],
    status: 'Connecting',
    battery: 48,
    connections: 0
  },
  {
    id: 'NODE-D',
    name: 'Relay Delta (North Forest)',
    coords: [40.0230, -105.2550],
    status: 'Offline',
    battery: 0,
    connections: 0
  }
];

export const mockLandingZones: LandingZone[] = [
  {
    id: 'LZ-1',
    name: 'Command Base Pad',
    coords: [40.0145, -105.2700],
    status: 'Clear'
  },
  {
    id: 'LZ-2',
    name: 'University Field Assembly',
    coords: [40.0105, -105.2660],
    status: 'Clear'
  },
  {
    id: 'LZ-3',
    name: 'North Foothills Clearing',
    coords: [40.0250, -105.2620],
    status: 'Obstructed'
  }
];

export const mockWeatherData = {
  temperature: 14.5, // Celsius
  windSpeed: 24, // km/h
  windDirection: 'NE',
  humidity: 88, // %
  visibility: 3.2, // km (restricted due to rain/fog)
  condition: 'Heavy Rain / Mist',
  pressure: 1008, // hPa
  icon: 'cloud-rain'
};

export const mockSystemHealth = {
  apiStatus: 'Healthy',
  apiLatency: '45ms',
  aiModelStatus: 'Healthy',
  aiModelLatency: '110ms',
  aiConfidenceThreshold: '75%',
  networkStatus: 'Warning',
  networkBandwidth: '450 Mbps',
  databaseStatus: 'Healthy',
  databaseLatency: '8ms',
  uavConnectivity: 'Healthy',
  uavActiveLinks: '3/4'
};

// Analytics Data over time
export const mockAnalyticsData = {
  detectionTrend: [
    { name: '16:00', survivors: 0, confidenceAvg: 0 },
    { name: '17:00', survivors: 1, confidenceAvg: 80 },
    { name: '18:00', survivors: 1, confidenceAvg: 82 },
    { name: '19:00', survivors: 3, confidenceAvg: 87 },
    { name: '20:00', survivors: 5, confidenceAvg: 90 },
    { name: '21:00', survivors: 8, confidenceAvg: 92 },
    { name: '22:00', survivors: 12, confidenceAvg: 94 }
  ],
  sosTimeline: [
    { time: '18:00', received: 1, resolved: 0 },
    { time: '19:00', received: 2, resolved: 1 },
    { time: '20:00', received: 4, resolved: 2 },
    { time: '21:00', received: 6, resolved: 4 },
    { time: '22:00', received: 3, resolved: 5 }
  ],
  uavPerformance: [
    { name: 'UAV-101', flightTime: 240, batteryUsed: 75, survivorsFound: 6 },
    { name: 'UAV-102', flightTime: 180, batteryUsed: 88, survivorsFound: 3 },
    { name: 'UAV-103', flightTime: 110, batteryUsed: 32, survivorsFound: 3 },
    { name: 'UAV-104', flightTime: 0, batteryUsed: 0, survivorsFound: 0 }
  ],
  networkLatencyTrend: [
    { time: '21:30', satLink: 420, meshNode: 12 },
    { time: '21:45', satLink: 435, meshNode: 14 },
    { time: '22:00', satLink: 480, meshNode: 18 },
    { time: '22:15', satLink: 520, meshNode: 28 },
    { time: '22:30', satLink: 490, meshNode: 22 }
  ],
  missionSuccessRates: [
    { name: 'Search Coverage', value: 82 },
    { name: 'Relay Uptime', value: 98 },
    { name: 'AI Precision', value: 92 },
    { name: 'Rescue Efficiency', value: 78 }
  ]
};
