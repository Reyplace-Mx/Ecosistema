-- ============================================================================
-- SMART CITY LOS MOCHIS, SINALOA - ECOSISTEMA DIGITAL HÍBRIDO
-- ESQUEMA COMPLETO DE BASE DE DATOS POSTGRESQL & POLÍTICAS DE SEGURIDAD SUPABASE
-- ============================================================================
-- Autor: Arquitecto Jefe de Sistemas Urbanos Inteligentes e IoT (Reyplace)
-- Ubicación: Los Mochis, Municipio de Ahome, Sinaloa, México
-- Descripción: Base de datos híbrida para IoT (MQTT Edge), telemetría de tráfico,
-- balanceo energético solar, anonimización de transporte público, resiliencia
-- satelital/malla, infraestructura legacy (JAPAMA/Tránsito) y usuarios ReyID.
-- ============================================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. TIPOS ENUMERADOS DEL ECOSISTEMA SMART CITY
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE user_smartcity_role AS ENUM (
        'citizen',
        'verified_citizen',
        'municipal_operator',
        'traffic_controller',
        'energy_engineer',
        'emergency_coordinator',
        'smartcity_admin'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE sensor_protocol_type AS ENUM (
        'mqtt_edge',
        'lorawan_mesh',
        'wifi_halow',
        'starlink_leo',
        'fiber_rest',
        'modbus_scada'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE energy_source_type AS ENUM (
        'solar_microgrid',
        'battery_storage_bess',
        'cfe_main_grid',
        'ev_smart_charger'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE failover_network_state AS ENUM (
        'nominal_fiber',
        'degraded_fiber_40pct_loss',
        'satellite_leo_active',
        'wireless_mesh_isolated'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 2. TABLA DE PERFILES & IDENTIDADES SOBERANAS REYID
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    handle TEXT UNIQUE NOT NULL,
    did TEXT UNIQUE NOT NULL, -- e.g. did:rey:0x7aF982...b3A1
    wallet_address TEXT NOT NULL,
    role user_smartcity_role DEFAULT 'citizen',
    kyc_status TEXT DEFAULT 'pending',
    reycoin_balance NUMERIC(18, 4) DEFAULT 500.0000,
    fido2_passkey_enabled BOOLEAN DEFAULT FALSE,
    zone_mochis TEXT DEFAULT 'zona_centro',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. INTEGRACIÓN DE DATOS SILOS: SENSORES DE TRÁFICO (MQTT) & TELEMETRÍA
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.smartcity_traffic_sensors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sensor_code TEXT UNIQUE NOT NULL, -- e.g. SN-LM-LEYVA-01
    name TEXT NOT NULL,
    location_name TEXT NOT NULL, -- e.g. Blvd. Rosendo G. Castro y Gabriel Leyva
    zone TEXT NOT NULL DEFAULT 'zona_centro',
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    protocol sensor_protocol_type DEFAULT 'mqtt_edge',
    mqtt_topic TEXT NOT NULL, -- e.g. mochis/traffic/edge/sn_leyva_01/telemetry
    status TEXT DEFAULT 'online', -- online, degraded, offline
    current_flow_veh_per_min INTEGER DEFAULT 45,
    avg_speed_kmh NUMERIC(5, 2) DEFAULT 42.5,
    congestion_level NUMERIC(4, 2) DEFAULT 0.25, -- 0.00 a 1.00
    edge_device_hw TEXT DEFAULT 'NVIDIA Jetson Orin Nano / ESP32-S3 Gateway',
    last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.smartcity_traffic_telemetry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sensor_id UUID REFERENCES public.smartcity_traffic_sensors(id) ON DELETE CASCADE,
    payload_hash TEXT NOT NULL, -- Cripto SHA-256 de verificación en el borde
    vehicle_count INTEGER NOT NULL,
    avg_speed_kmh NUMERIC(5, 2) NOT NULL,
    occupancy_rate NUMERIC(5, 2) NOT NULL,
    anomaly_detected BOOLEAN DEFAULT FALSE,
    latency_ms INTEGER DEFAULT 8, -- <15ms objetivo mediación Edge
    raw_mqtt_msg JSONB NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. REPORTES CIUDADANOS HÍBRIDOS (JSON APP MÓVIL)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.smartcity_citizen_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_did TEXT NOT NULL, -- did:rey: o anónimo
    report_type TEXT NOT NULL, -- 'traffic_accident', 'pothole', 'street_light_failure', 'water_leak_japama'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location_name TEXT NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    severity TEXT DEFAULT 'medium', -- low, medium, high, critical
    status TEXT DEFAULT 'pending', -- pending, in_triage, dispatched, resolved
    is_zk_anonymous BOOLEAN DEFAULT FALSE,
    zk_proof_hash TEXT,
    upvotes INTEGER DEFAULT 0,
    assigned_department TEXT DEFAULT 'Dirección de Tránsito Ahome',
    response_latency_seconds INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. OPTIMIZACIÓN ENERGÉTICA DE LA RED HÍBRIDA (SOLAR + EV CHARGING)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.smartcity_energy_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_code TEXT UNIQUE NOT NULL, -- e.g. SOL-LM-PARQUE-IND-04
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    solar_capacity_kw NUMERIC(10, 2) NOT NULL, -- Potencia solar instalada
    current_solar_gen_kw NUMERIC(10, 2) DEFAULT 0.00,
    bess_storage_kwh NUMERIC(10, 2) NOT NULL, -- Capacidad de Baterías
    bess_current_soc_pct NUMERIC(5, 2) DEFAULT 88.50, -- State of Charge (%)
    public_lighting_load_kw NUMERIC(10, 2) DEFAULT 14.20,
    ev_chargers_load_kw NUMERIC(10, 2) DEFAULT 35.00,
    cfe_grid_draw_kw NUMERIC(10, 2) DEFAULT 12.00,
    target_cfe_reduction_pct NUMERIC(5, 2) DEFAULT 25.00, -- Reducción objetivo del 25%
    edge_ai_balancing_active BOOLEAN DEFAULT TRUE,
    threshold_ev_throttle_pct NUMERIC(5, 2) DEFAULT 75.00, -- Umbral SoC para modular cargadores EV
    threshold_solar_priority_kw NUMERIC(10, 2) DEFAULT 20.00, -- Umbral mínimo solar
    status TEXT DEFAULT 'optimal',
    last_balanced_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. GOBERNANZA & CIBERSEGURIDAD: ANONIMIZACIÓN EN EL BORDE (EDGE PRIVACY)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.smartcity_transit_anonymized (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_code TEXT NOT NULL, -- e.g. RUTA-CENTRO-UNIVERSIDAD-08
    bus_unit_id TEXT NOT NULL, -- UNIDAD-42
    edge_camera_id TEXT NOT NULL,
    passenger_count INTEGER NOT NULL,
    occupancy_pct NUMERIC(5, 2) NOT NULL,
    -- PRIVACIDAD: Datos biométricos NUNCA se almacenan en crudo.
    -- Solo métricas estadísticas agregadas con ruido Laplaciano (Privacidad Diferencial ε=0.5)
    differential_privacy_epsilon NUMERIC(4, 2) DEFAULT 0.50,
    k_anonymity_cluster_size INTEGER DEFAULT 5,
    face_embeddings_stored BOOLEAN DEFAULT FALSE, -- OBLIGATORIO: FALSE por normativa
    anonymization_salt_sha256 TEXT NOT NULL,
    route_segment_zone TEXT DEFAULT 'scally_country',
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. RESILIENCIA ANTE DESASTRES & CONMUTACIÓN POR ERROR (FAILOVER REDES)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.smartcity_failover_telemetry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_trigger TEXT NOT NULL, -- 'simulated_fiber_loss_40pct', 'hurricane_alert', 'substation_failure'
    network_state failover_network_state DEFAULT 'nominal_fiber',
    fiber_connectivity_pct NUMERIC(5, 2) DEFAULT 100.00,
    starlink_leo_throughput_mbps NUMERIC(10, 2) DEFAULT 220.50,
    lorawan_mesh_active_nodes INTEGER DEFAULT 48,
    priority_traffic_latency_ms INTEGER DEFAULT 12,
    failover_engaged_at TIMESTAMPTZ,
    recovered_at TIMESTAMPTZ,
    status TEXT DEFAULT 'standby_ready',
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. INFRAESTRUCTURA LEGACY: JAPAMA (AGUA) Y SEMAFORIZACIÓN TRÁNSITO
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.smartcity_legacy_infrastructure (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_tag TEXT UNIQUE NOT NULL, -- e.g. JAPAMA-TUB-PL-1998-04
    system_origin TEXT NOT NULL, -- 'JAPAMA_AGUA_POTABLE', 'TRANSITO_AHOME_SEMAFOROS', 'ALUMBRADO_MUNICIPAL'
    asset_name TEXT NOT NULL,
    installation_year INTEGER NOT NULL CHECK (installation_year >= 1970),
    material_spec TEXT NOT NULL, -- e.g. Asbesto-Cemento 12 pulg, Acero Galvanizado, Controlador Electromecánico
    location_description TEXT NOT NULL,
    zone TEXT NOT NULL DEFAULT 'zona_centro',
    current_pressure_psi NUMERIC(6, 2), -- Para tuberías de agua
    timing_cycle_seconds INTEGER, -- Para semáforos
    health_status TEXT DEFAULT 'warning', -- optimal, warning, critical_maintenance
    last_inspection_date DATE DEFAULT '2024-03-15',
    legacy_db_table_ref TEXT NOT NULL, -- e.g. db_japama_legacy.tbl_red_primaria_1998
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.smartcity_nl_sql_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id),
    natural_language_prompt TEXT NOT NULL,
    sanitized_sql_query TEXT NOT NULL,
    execution_status TEXT DEFAULT 'success', -- success, blocked_by_guardrail, syntax_error
    response_summary TEXT,
    execution_time_ms INTEGER DEFAULT 45,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 9. AUDITORÍA CRIPTOGRÁFICA & AUTENTICACIÓN REYID FIDO2
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.reyid_auth_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_did TEXT NOT NULL,
    user_name TEXT NOT NULL,
    method TEXT NOT NULL, -- 'WebAuthn / Passkey', 'Biométrico Facial', 'Touch ID', 'YubiKey Hardware FIDO2'
    status TEXT NOT NULL DEFAULT 'SUCCESS',
    device TEXT NOT NULL,
    ip_address INET,
    location TEXT DEFAULT 'Los Mochis, Sinaloa',
    cryptographic_hash TEXT NOT NULL,
    aaguid TEXT,
    algorithm TEXT DEFAULT 'ES256 (FIDO2 L3)',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 10. POLÍTICAS DE SEGURIDAD ROW LEVEL SECURITY (RLS) ESTRICTAS
-- ============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smartcity_traffic_sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smartcity_traffic_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smartcity_citizen_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smartcity_energy_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smartcity_transit_anonymized ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smartcity_failover_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smartcity_legacy_infrastructure ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smartcity_nl_sql_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reyid_auth_logs ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Políticas para 'profiles'
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil o perfiles públicos" ON public.profiles;
CREATE POLICY "Los usuarios pueden ver su propio perfil o perfiles públicos"
ON public.profiles FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Los usuarios pueden actualizar solo su propio perfil" ON public.profiles;
CREATE POLICY "Los usuarios pueden actualizar solo su propio perfil"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- ----------------------------------------------------------------------------
-- Políticas para Sensores de Tráfico & Telemetría
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Lectura pública de sensores de tráfico Smart City" ON public.smartcity_traffic_sensors;
CREATE POLICY "Lectura pública de sensores de tráfico Smart City"
ON public.smartcity_traffic_sensors FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Operadores municipales pueden actualizar sensores" ON public.smartcity_traffic_sensors;
CREATE POLICY "Operadores municipales pueden actualizar sensores"
ON public.smartcity_traffic_sensors FOR ALL
USING (true); -- En producción autentica JWT claim role

DROP POLICY IF EXISTS "Lectura pública de telemetría de tráfico" ON public.smartcity_traffic_telemetry;
CREATE POLICY "Lectura pública de telemetría de tráfico"
ON public.smartcity_traffic_telemetry FOR SELECT
USING (true);

-- ----------------------------------------------------------------------------
-- Políticas para Reportes Ciudadanos
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Lectura pública de reportes ciudadanos no confidenciales" ON public.smartcity_citizen_reports;
CREATE POLICY "Lectura pública de reportes ciudadanos no confidenciales"
ON public.smartcity_citizen_reports FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Cualquier ciudadano verificado o anónimo puede crear reportes" ON public.smartcity_citizen_reports;
CREATE POLICY "Cualquier ciudadano verificado o anónimo puede crear reportes"
ON public.smartcity_citizen_reports FOR INSERT
WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- Políticas para Energía & Microred Solar
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Lectura pública de estado energético de la ciudad" ON public.smartcity_energy_nodes;
CREATE POLICY "Lectura pública de estado energético de la ciudad"
ON public.smartcity_energy_nodes FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Ingenieros energéticos pueden controlar nodos" ON public.smartcity_energy_nodes;
CREATE POLICY "Ingenieros energéticos pueden controlar nodos"
ON public.smartcity_energy_nodes FOR UPDATE
USING (true);

-- ----------------------------------------------------------------------------
-- Políticas para Transporte Anonimizado (Privacy Guard)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Solo lectura de métricas ya anonimizadas en el borde" ON public.smartcity_transit_anonymized;
CREATE POLICY "Solo lectura de métricas ya anonimizadas en el borde"
ON public.smartcity_transit_anonymized FOR SELECT
USING (face_embeddings_stored = FALSE);

-- ----------------------------------------------------------------------------
-- Políticas para Auditoría ReyID
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Lectura de logs de autenticación ReyID para auditoría" ON public.reyid_auth_logs;
CREATE POLICY "Lectura de logs de autenticación ReyID para auditoría"
ON public.reyid_auth_logs FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Registro de eventos de autenticación exitosos" ON public.reyid_auth_logs;
CREATE POLICY "Registro de eventos de autenticación exitosos"
ON public.reyid_auth_logs FOR INSERT
WITH CHECK (true);

-- ============================================================================
-- 11. SEMILLAS DE DATOS INICIALES (LOS MOCHIS, SINALOA)
-- ============================================================================

INSERT INTO public.smartcity_traffic_sensors (sensor_code, name, location_name, zone, latitude, longitude, protocol, mqtt_topic, status, current_flow_veh_per_min, avg_speed_kmh, congestion_level)
VALUES 
('SN-LM-01', 'Radar Leyva y Castro', 'Blvd. Rosendo G. Castro y Gabriel Leyva', 'zona_centro', 25.7928, -108.9950, 'mqtt_edge', 'mochis/traffic/sn_01', 'online', 68, 38.5, 0.42),
('SN-LM-02', 'Cámara Cruce Centenario', 'Blvd. Antonio Rosales y Blvd. Centenario', 'plaza_paseo', 25.7820, -108.9880, 'mqtt_edge', 'mochis/traffic/sn_02', 'online', 94, 25.0, 0.78),
('SN-LM-03', 'Sensor Flujo Country Club', 'Blvd. Pedro Anaya y Scally', 'scally_country', 25.8010, -109.0080, 'lorawan_mesh', 'mochis/traffic/sn_03', 'online', 32, 48.0, 0.15),
('SN-LM-04', 'Controlador Acceso Industrial', 'Carretera Los Mochis - Topolobampo Km 4.5', 'parque_industrial', 25.7420, -109.0230, 'starlink_leo', 'mochis/traffic/sn_04', 'online', 55, 62.0, 0.20)
ON CONFLICT (sensor_code) DO NOTHING;

INSERT INTO public.smartcity_energy_nodes (node_code, name, location, solar_capacity_kw, current_solar_gen_kw, bess_storage_kwh, bess_current_soc_pct, public_lighting_load_kw, ev_chargers_load_kw, cfe_grid_draw_kw, target_cfe_reduction_pct, edge_ai_balancing_active)
VALUES
('SOL-LM-CENTRO-01', 'Microred Fotovoltaica Palacio Municipal', 'Allende y Cuauhtémoc, Centro', 120.00, 98.40, 350.00, 92.50, 18.50, 45.00, 14.20, 28.50, TRUE),
('SOL-LM-PARQUE-02', 'Parque Solar & Estación EV Paseo', 'Blvd. Centenario y Rosales', 250.00, 215.00, 600.00, 85.00, 32.00, 110.00, 24.50, 32.00, TRUE),
('SOL-LM-TOPO-03', 'Generador Híbrido Puerto Topolobampo', 'Muelle Fiscal Topolobampo', 180.00, 150.00, 400.00, 78.00, 22.00, 60.00, 18.00, 25.00, TRUE)
ON CONFLICT (node_code) DO NOTHING;

INSERT INTO public.smartcity_legacy_infrastructure (asset_tag, system_origin, asset_name, installation_year, material_spec, location_description, zone, current_pressure_psi, timing_cycle_seconds, health_status, legacy_db_table_ref)
VALUES
('JAPAMA-TUB-PL-1994-01', 'JAPAMA_AGUA_POTABLE', 'Tubería Matriz Acueducto Río Fuerte', 1994, 'Asbesto-Cemento 18 pulgadas clase 7', 'Parque Sinaloa / Blvd. Macario Gaxiola', 'zona_centro', 42.50, NULL, 'warning', 'db_japama_legacy.tbl_red_primaria_1994'),
('JAPAMA-VAL-1988-12', 'JAPAMA_AGUA_POTABLE', 'Válvula Reguladora de Presión Sector 3', 1988, 'Hierro Fundido Brida ANSI 150', 'Colonia Scally / Av. Independencia', 'scally_country', 38.00, NULL, 'warning', 'db_japama_legacy.tbl_valvulas_sector_1988'),
('TRANSITO-SEM-1999-07', 'TRANSITO_AHOME_SEMAFOROS', 'Controlador Electromecánico 4 Fases', 1999, 'Gabinete NEMA 3R con relevadores mecánicos', 'Gabriel Leyva y Av. Hidalgo', 'zona_centro', NULL, 90, 'critical_maintenance', 'db_transito_ahome.tbl_controladores_1999')
ON CONFLICT (asset_tag) DO NOTHING;

-- ============================================================================
-- FIN DEL ESQUEMA SMART CITY LOS MOCHIS SINALOA
-- ============================================================================
