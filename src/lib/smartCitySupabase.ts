import { supabase } from './supabase';
import type { UserSession } from '../context/AuthContext';

export interface SmartCityTrafficSensor {
  id: string;
  sensor_code: string;
  name: string;
  location_name: string;
  zone: string;
  latitude: number;
  longitude: number;
  protocol: 'mqtt_edge' | 'lorawan_mesh' | 'wifi_halow' | 'starlink_leo' | 'fiber_rest' | 'modbus_scada';
  mqtt_topic: string;
  status: 'online' | 'degraded' | 'offline';
  current_flow_veh_per_min: number;
  avg_speed_kmh: number;
  congestion_level: number;
  edge_device_hw?: string;
  last_heartbeat: string;
}

export interface SmartCityEnergyNode {
  id: string;
  node_code: string;
  name: string;
  location: string;
  solar_capacity_kw: number;
  current_solar_gen_kw: number;
  bess_storage_kwh: number;
  bess_current_soc_pct: number;
  public_lighting_load_kw: number;
  ev_chargers_load_kw: number;
  cfe_grid_draw_kw: number;
  target_cfe_reduction_pct: number;
  edge_ai_balancing_active: boolean;
  threshold_ev_throttle_pct: number;
  threshold_solar_priority_kw: number;
  status: 'optimal' | 'warning' | 'throttled';
  last_balanced_at: string;
}

export interface SmartCityTransitAnonymized {
  id: string;
  route_code: string;
  bus_unit_id: string;
  edge_camera_id: string;
  passenger_count: number;
  occupancy_pct: number;
  differential_privacy_epsilon: number;
  k_anonymity_cluster_size: number;
  face_embeddings_stored: boolean;
  anonymization_salt_sha256: string;
  route_segment_zone: string;
  recorded_at: string;
}

export interface SmartCityFailoverTelemetry {
  id: string;
  event_trigger: string;
  network_state: 'nominal_fiber' | 'degraded_fiber_40pct_loss' | 'satellite_leo_active' | 'wireless_mesh_isolated';
  fiber_connectivity_pct: number;
  starlink_leo_throughput_mbps: number;
  lorawan_mesh_active_nodes: number;
  priority_traffic_latency_ms: number;
  failover_engaged_at?: string;
  status: string;
  recorded_at: string;
}

export interface SmartCityLegacyAsset {
  id: string;
  asset_tag: string;
  system_origin: 'JAPAMA_AGUA_POTABLE' | 'TRANSITO_AHOME_SEMAFOROS' | 'ALUMBRADO_MUNICIPAL';
  asset_name: string;
  installation_year: number;
  material_spec: string;
  location_description: string;
  zone: string;
  current_pressure_psi?: number;
  timing_cycle_seconds?: number;
  health_status: 'optimal' | 'warning' | 'critical_maintenance';
  last_inspection_date: string;
  legacy_db_table_ref: string;
}

export interface SmartCityCitizenReport {
  id: string;
  user_did: string;
  report_type: 'traffic_accident' | 'pothole' | 'street_light_failure' | 'water_leak_japama' | 'cctv_blindspot';
  title: string;
  description: string;
  location_name: string;
  latitude: number;
  longitude: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_triage' | 'dispatched' | 'resolved';
  is_zk_anonymous: boolean;
  zk_proof_hash?: string;
  upvotes: number;
  assigned_department: string;
  response_latency_seconds?: number;
  created_at: string;
}

// ============================================================================
// DEFAULT FALLBACK IN-MEMORY SEED DATA (LOS MOCHIS, SINALOA)
// ============================================================================

export const DEFAULT_TRAFFIC_SENSORS: SmartCityTrafficSensor[] = [
  {
    id: 'sn-1',
    sensor_code: 'SN-LM-01',
    name: 'Radar Leyva y Castro',
    location_name: 'Blvd. Rosendo G. Castro y Gabriel Leyva (Centro)',
    zone: 'zona_centro',
    latitude: 25.7928,
    longitude: -108.9950,
    protocol: 'mqtt_edge',
    mqtt_topic: 'mochis/traffic/sn_01',
    status: 'online',
    current_flow_veh_per_min: 68,
    avg_speed_kmh: 38.5,
    congestion_level: 0.42,
    edge_device_hw: 'NVIDIA Jetson Orin Nano Edge Gateway',
    last_heartbeat: new Date().toISOString(),
  },
  {
    id: 'sn-2',
    sensor_code: 'SN-LM-02',
    name: 'Cámara Cruce Centenario y Rosales',
    location_name: 'Blvd. Antonio Rosales y Blvd. Centenario',
    zone: 'plaza_paseo',
    latitude: 25.7820,
    longitude: -108.9880,
    protocol: 'mqtt_edge',
    mqtt_topic: 'mochis/traffic/sn_02',
    status: 'online',
    current_flow_veh_per_min: 94,
    avg_speed_kmh: 24.0,
    congestion_level: 0.78,
    edge_device_hw: 'ESP32-S3 Cam + Neural Edge NPU',
    last_heartbeat: new Date().toISOString(),
  },
  {
    id: 'sn-3',
    sensor_code: 'SN-LM-03',
    name: 'Sensor Flujo Country Club / Scally',
    location_name: 'Blvd. Pedro Anaya y Gabriel Leyva',
    zone: 'scally_country',
    latitude: 25.8010,
    longitude: -109.0080,
    protocol: 'lorawan_mesh',
    mqtt_topic: 'mochis/traffic/sn_03',
    status: 'online',
    current_flow_veh_per_min: 32,
    avg_speed_kmh: 48.0,
    congestion_level: 0.15,
    edge_device_hw: 'LoRaWAN Heltec V3 Solar Node',
    last_heartbeat: new Date().toISOString(),
  },
  {
    id: 'sn-4',
    sensor_code: 'SN-LM-04',
    name: 'Acceso Parque Industrial - Topolobampo',
    location_name: 'Carretera Los Mochis - Topolobampo Km 4.5',
    zone: 'parque_industrial',
    latitude: 25.7420,
    longitude: -109.0230,
    protocol: 'starlink_leo',
    mqtt_topic: 'mochis/traffic/sn_04',
    status: 'online',
    current_flow_veh_per_min: 55,
    avg_speed_kmh: 64.0,
    congestion_level: 0.20,
    edge_device_hw: 'Industrial Rugged Starlink Edge Router',
    last_heartbeat: new Date().toISOString(),
  },
];

export const DEFAULT_ENERGY_NODES: SmartCityEnergyNode[] = [
  {
    id: 'en-1',
    node_code: 'SOL-LM-CENTRO-01',
    name: 'Microred Fotovoltaica Palacio Municipal Ahome',
    location: 'Allende y Cuauhtémoc, Centro Los Mochis',
    solar_capacity_kw: 120.0,
    current_solar_gen_kw: 98.4,
    bess_storage_kwh: 350.0,
    bess_current_soc_pct: 92.5,
    public_lighting_load_kw: 18.5,
    ev_chargers_load_kw: 45.0,
    cfe_grid_draw_kw: 14.2,
    target_cfe_reduction_pct: 28.5,
    edge_ai_balancing_active: true,
    threshold_ev_throttle_pct: 75.0,
    threshold_solar_priority_kw: 20.0,
    status: 'optimal',
    last_balanced_at: new Date().toISOString(),
  },
  {
    id: 'en-2',
    node_code: 'SOL-LM-PASEO-02',
    name: 'Parque Solar & Estación Carga Rápida Paseo Los Mochis',
    location: 'Blvd. Centenario y Rosales',
    solar_capacity_kw: 250.0,
    current_solar_gen_kw: 215.0,
    bess_storage_kwh: 600.0,
    bess_current_soc_pct: 85.0,
    public_lighting_load_kw: 32.0,
    ev_chargers_load_kw: 110.0,
    cfe_grid_draw_kw: 24.5,
    target_cfe_reduction_pct: 32.0,
    edge_ai_balancing_active: true,
    threshold_ev_throttle_pct: 75.0,
    threshold_solar_priority_kw: 20.0,
    status: 'optimal',
    last_balanced_at: new Date().toISOString(),
  },
  {
    id: 'en-3',
    node_code: 'SOL-LM-TOPO-03',
    name: 'Generador Híbrido Puerto Topolobampo',
    location: 'Muelle Fiscal Topolobampo',
    solar_capacity_kw: 180.0,
    current_solar_gen_kw: 150.0,
    bess_storage_kwh: 400.0,
    bess_current_soc_pct: 78.0,
    public_lighting_load_kw: 22.0,
    ev_chargers_load_kw: 60.0,
    cfe_grid_draw_kw: 18.0,
    target_cfe_reduction_pct: 25.0,
    edge_ai_balancing_active: true,
    threshold_ev_throttle_pct: 75.0,
    threshold_solar_priority_kw: 20.0,
    status: 'optimal',
    last_balanced_at: new Date().toISOString(),
  },
];

export const DEFAULT_LEGACY_ASSETS: SmartCityLegacyAsset[] = [
  {
    id: 'leg-1',
    asset_tag: 'JAPAMA-TUB-PL-1994-01',
    system_origin: 'JAPAMA_AGUA_POTABLE',
    asset_name: 'Tubería Matriz Acueducto Río Fuerte',
    installation_year: 1994,
    material_spec: 'Asbesto-Cemento 18" Clase 7 (Presión nominal 100 PSI)',
    location_description: 'Parque Sinaloa / Blvd. Macario Gaxiola',
    zone: 'zona_centro',
    current_pressure_psi: 42.5,
    health_status: 'warning',
    last_inspection_date: '2024-03-15',
    legacy_db_table_ref: 'db_japama_legacy.tbl_red_primaria_1994',
  },
  {
    id: 'leg-2',
    asset_tag: 'JAPAMA-VAL-1988-12',
    system_origin: 'JAPAMA_AGUA_POTABLE',
    asset_name: 'Válvula Reguladora de Presión Sector 3 Scally',
    installation_year: 1988,
    material_spec: 'Hierro Fundido ASTM A126 Clase B con Bridas ANSI 150',
    location_description: 'Colonia Scally / Av. Independencia',
    zone: 'scally_country',
    current_pressure_psi: 38.0,
    health_status: 'warning',
    last_inspection_date: '2023-11-20',
    legacy_db_table_ref: 'db_japama_legacy.tbl_valvulas_sector_1988',
  },
  {
    id: 'leg-3',
    asset_tag: 'TRANSITO-SEM-1999-07',
    system_origin: 'TRANSITO_AHOME_SEMAFOROS',
    asset_name: 'Controlador Electromecánico 4 Fases Gabriel Leyva',
    installation_year: 1999,
    material_spec: 'Gabinete NEMA 3R con relevadores mecánicos y levas rotativas',
    location_description: 'Gabriel Leyva y Av. Hidalgo (Centro)',
    zone: 'zona_centro',
    timing_cycle_seconds: 90,
    health_status: 'critical_maintenance',
    last_inspection_date: '2024-01-10',
    legacy_db_table_ref: 'db_transito_ahome.tbl_controladores_1999',
  },
];

// ============================================================================
// SERVICE CLIENT FUNCTIONS WITH SUPABASE + LOCAL STORAGE PERSISTENCE
// ============================================================================

export async function fetchSmartCityTrafficSensors(): Promise<SmartCityTrafficSensor[]> {
  try {
    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      const { data, error } = await supabase
        .from('smartcity_traffic_sensors')
        .select('*')
        .order('sensor_code', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as SmartCityTrafficSensor[];
      }
    }
  } catch (err) {
    console.warn('Supabase offline or table missing, using cached smartcity sensors:', err);
  }

  const cached = localStorage.getItem('smartcity_mochis_sensors');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // fallback
    }
  }
  return DEFAULT_TRAFFIC_SENSORS;
}

export async function fetchSmartCityEnergyNodes(): Promise<SmartCityEnergyNode[]> {
  try {
    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      const { data, error } = await supabase
        .from('smartcity_energy_nodes')
        .select('*')
        .order('node_code', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as SmartCityEnergyNode[];
      }
    }
  } catch (err) {
    console.warn('Supabase energy query warn:', err);
  }

  const cached = localStorage.getItem('smartcity_mochis_energy_nodes');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // fallback
    }
  }
  return DEFAULT_ENERGY_NODES;
}

export async function fetchSmartCityLegacyAssets(): Promise<SmartCityLegacyAsset[]> {
  try {
    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      const { data, error } = await supabase
        .from('smartcity_legacy_infrastructure')
        .select('*')
        .order('installation_year', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as SmartCityLegacyAsset[];
      }
    }
  } catch (err) {
    console.warn('Supabase legacy assets query warn:', err);
  }
  return DEFAULT_LEGACY_ASSETS;
}

export async function submitCitizenReportToSupabase(report: Omit<SmartCityCitizenReport, 'id' | 'created_at' | 'upvotes'>): Promise<{ success: boolean; id: string }> {
  const newId = `rep_${Date.now()}`;
  const fullReport: SmartCityCitizenReport = {
    ...report,
    id: newId,
    upvotes: 0,
    created_at: new Date().toISOString(),
  };

  try {
    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      const { error } = await supabase
        .from('smartcity_citizen_reports')
        .insert([fullReport]);

      if (!error) {
        return { success: true, id: newId };
      }
    }
  } catch (err) {
    console.warn('Supabase citizen report insert warn:', err);
  }

  // Local fallback
  const existingRaw = localStorage.getItem('smartcity_mochis_citizen_reports') || '[]';
  const existing: SmartCityCitizenReport[] = JSON.parse(existingRaw);
  existing.unshift(fullReport);
  localStorage.setItem('smartcity_mochis_citizen_reports', JSON.stringify(existing.slice(0, 50)));

  return { success: true, id: newId };
}
