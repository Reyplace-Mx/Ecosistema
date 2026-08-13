import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  Filter, 
  Search, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Database, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Calendar, 
  ShieldCheck, 
  RefreshCw,
  HardHat,
  X,
  ExternalLink
} from 'lucide-react';

export interface LocalInitiative {
  id: string;
  title: string;
  category: 'Infraestructura' | 'Vías y Movilidad' | 'Parques y Verde' | 'Alumbrado e Iluminación' | 'Agua y Saneamiento' | 'Salud y Educación';
  description: string;
  budgetRYC: number;
  budgetMXN: number;
  progress: number; // 0 - 100
  status: 'execution' | 'bidding' | 'completed' | 'planning';
  locationName: string;
  lat: number;
  lng: number;
  contractor: string;
  startDate: string;
  estimatedCompletion: string;
  beneficiariesCount: number;
  supabaseSyncTime: string;
  upvotes: number;
  supervisor: string;
}

const MOCK_INITIATIVES: LocalInitiative[] = [
  {
    id: 'OB-2026-001',
    title: 'Pavimentación Hidráulica & Ciclovía Av. Universidad',
    category: 'Vías y Movilidad',
    description: 'Reconstrucción con concreto hidráulico de alta durabilidad, señalización inteligente y carril exclusivo para ciclistas.',
    budgetRYC: 1850000,
    budgetMXN: 37000000,
    progress: 68,
    status: 'execution',
    locationName: 'Distrito Centro - Av. Universidad Km 4',
    lat: 19.4326,
    lng: -99.1332,
    contractor: 'Consorcio Vial Reyplace S.A.',
    startDate: '10 Ene 2026',
    estimatedCompletion: '30 Nov 2026',
    beneficiariesCount: 85000,
    supabaseSyncTime: 'Sincronizado ahora',
    upvotes: 342,
    supervisor: 'Ing. Carlos Mendoza (Obras Públicas)'
  },
  {
    id: 'OB-2026-002',
    title: 'Parque Lineal Sustentable & Captación Pluvial Cúpula',
    category: 'Parques y Verde',
    description: 'Creación de área verde de 12 hectáreas con pozos de infiltración pluvial, luminarias solares y sensores de calidad de aire.',
    budgetRYC: 920000,
    budgetMXN: 18400000,
    progress: 42,
    status: 'execution',
    locationName: 'Zona Norte - San Jerónimo',
    lat: 19.4510,
    lng: -99.1180,
    contractor: 'Infraestructura Ecológica MX',
    startDate: '01 Feb 2026',
    estimatedCompletion: '15 Dic 2026',
    beneficiariesCount: 42000,
    supabaseSyncTime: 'Sincronizado hace 2m',
    upvotes: 512,
    supervisor: 'Dra. Sofía Ramírez (Medio Ambiente)'
  },
  {
    id: 'OB-2026-003',
    title: 'Modernización de Red de Agua Potable & Sensores IoT',
    category: 'Agua y Saneamiento',
    description: 'Sustitución de tubería principal por polietileno de alta densidad e instalación de válvulas de presión telemétricas.',
    budgetRYC: 1450000,
    budgetMXN: 29000000,
    progress: 100,
    status: 'completed',
    locationName: 'Sector Oriente - Juárez',
    lat: 19.4180,
    lng: -99.1550,
    contractor: 'Sistemas Hídricos Inteligentes',
    startDate: '15 Ago 2025',
    estimatedCompletion: '10 Jul 2026',
    beneficiariesCount: 110000,
    supabaseSyncTime: 'Sincronizado hace 5m',
    upvotes: 689,
    supervisor: 'Ing. Mateo Torres (Agua Potable)'
  },
  {
    id: 'OB-2026-004',
    title: 'Red de Alumbrado Público LED & Red 5G Municipal',
    category: 'Alumbrado e Iluminación',
    description: 'Instalación de 3,500 luminarias inteligentes autoregulables conectadas a la Cúpula Reyplace.',
    budgetRYC: 680000,
    budgetMXN: 13600000,
    progress: 15,
    status: 'bidding',
    locationName: 'Eje Periférico Sur',
    lat: 19.3900,
    lng: -99.1700,
    contractor: 'Licitación Pública en Proceso',
    startDate: '15 Sep 2026',
    estimatedCompletion: '28 Feb 2027',
    beneficiariesCount: 65000,
    supabaseSyncTime: 'Sincronizado hace 1m',
    upvotes: 215,
    supervisor: 'Mtro. Luis Galindo (Servicios Públicos)'
  },
  {
    id: 'OB-2026-005',
    title: 'Centro de Salud Comunitario & Telemedicina ReyID',
    category: 'Salud y Educación',
    description: 'Construcción de clínica de primer nivel con consultorios digitales, área de urgencias y conexión satelital.',
    budgetRYC: 2100000,
    budgetMXN: 42000000,
    progress: 88,
    status: 'execution',
    locationName: 'Comunidad Tecma - Sector Poniente',
    lat: 19.4050,
    lng: -99.1200,
    contractor: 'Constructora Médica del Norte',
    startDate: '01 Nov 2025',
    estimatedCompletion: '30 Sep 2026',
    beneficiariesCount: 55000,
    supabaseSyncTime: 'Sincronizado ahora',
    upvotes: 840,
    supervisor: 'Dra. Valentina Castro (Salud Pública)'
  }
];

export function LocalInitiativesMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const [initiatives, setInitiatives] = useState<LocalInitiative[]>(MOCK_INITIATIVES);
  const [selectedInitiative, setSelectedInitiative] = useState<LocalInitiative | null>(MOCK_INITIATIVES[0]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSyncingSupabase, setIsSyncingSupabase] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Project Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<LocalInitiative['category']>('Infraestructura');
  const [newDescription, setNewDescription] = useState('');
  const [newBudgetRYC, setNewBudgetRYC] = useState('500000');
  const [newLocationName, setNewLocationName] = useState('Distrito Tecnológico - Av. Central');
  const [newContractor, setNewContractor] = useState('Obras Urbanas S.A.');

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [19.4250, -99.1400],
        zoom: 12,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Dark / Modern Tile Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Filter Initiatives
  const filteredInitiatives = initiatives.filter(init => {
    const matchesCategory = filterCategory === 'all' || init.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || init.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      init.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      init.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      init.contractor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  // Render & Update Markers on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => map.removeLayer(marker));
    markersRef.current = {};

    filteredInitiatives.forEach(init => {
      const statusColor = 
        init.status === 'execution' ? '#06b6d4' : 
        init.status === 'completed' ? '#10b981' : 
        init.status === 'bidding' ? '#f59e0b' : '#a855f7';

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            background: #090a0f;
            border: 2px solid ${statusColor};
            border-radius: 50%;
            box-shadow: 0 0 15px ${statusColor}66, 0 4px 10px rgba(0,0,0,0.5);
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            <div style="
              width: 12px;
              height: 12px;
              background: ${statusColor};
              border-radius: 50%;
              box-shadow: 0 0 8px ${statusColor};
            "></div>
            ${init.status === 'execution' ? `
              <span style="
                position: absolute;
                inset: -4px;
                border: 2px solid ${statusColor};
                border-radius: 50%;
                animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
                opacity: 0.6;
              "></span>
            ` : ''}
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const marker = L.marker([init.lat, init.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setSelectedInitiative(init);
        map.flyTo([init.lat, init.lng], 14, { duration: 0.8 });
      });

      markersRef.current[init.id] = marker;
    });
  }, [filteredInitiatives]);

  // Trigger Supabase Sync Simulation
  const handleSupabaseSync = () => {
    setIsSyncingSupabase(true);
    setTimeout(() => {
      setIsSyncingSupabase(false);
      setInitiatives(prev => prev.map(init => ({
        ...init,
        upvotes: init.upvotes + Math.floor(Math.random() * 3),
        supabaseSyncTime: 'Sincronizado ahora (Supabase Realtime WSS)'
      })));
    }, 1200);
  };

  // Add New Initiative
  const handleCreateInitiative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const rycVal = parseInt(newBudgetRYC) || 500000;
    const newInit: LocalInitiative = {
      id: `OB-2026-0${initiatives.length + 1}`,
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription || 'Proyecto de infraestructura pública registrado en la red de Gobierno Digital.',
      budgetRYC: rycVal,
      budgetMXN: rycVal * 20,
      progress: 0,
      status: 'execution',
      locationName: newLocationName,
      lat: 19.4200 + (Math.random() - 0.5) * 0.05,
      lng: -99.1400 + (Math.random() - 0.5) * 0.05,
      contractor: newContractor,
      startDate: 'Hoy',
      estimatedCompletion: '31 Dic 2026',
      beneficiariesCount: 25000,
      supabaseSyncTime: 'Sincronizado ahora (Supabase)',
      upvotes: 1,
      supervisor: 'Ing. Supervisor Municipal'
    };

    setInitiatives([newInit, ...initiatives]);
    setSelectedInitiative(newInit);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    handleSupabaseSync();
  };

  return (
    <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Building2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Mapa de Iniciativas Locales y Obras Públicas
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Supabase Realtime Enabled
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Geolocalización interactiva con Leaflet para auditoría ciudadana, avance físico y presupuestario en tiempo real.
          </p>
        </div>

        {/* Supabase Sync Button & New Project Button */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSupabaseSync}
            disabled={isSyncingSupabase}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-500 ${isSyncingSupabase ? 'animate-spin' : ''}`} />
            <span>{isSyncingSupabase ? 'Sincronizando...' : 'Sincronizar Supabase'}</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Obra Pública</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3">
        {/* Search */}
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por obra, ubicación o contratista..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-gray-200 outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Filter Category */}
        <div className="md:col-span-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-gray-200 outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="all">Todas las Categorías</option>
            <option value="Vías y Movilidad">Vías y Movilidad</option>
            <option value="Parques y Verde">Parques y Verde</option>
            <option value="Agua y Saneamiento">Agua y Saneamiento</option>
            <option value="Alumbrado e Iluminación">Alumbrado e Iluminación</option>
            <option value="Salud y Educación">Salud y Educación</option>
          </select>
        </div>

        {/* Filter Status */}
        <div className="md:col-span-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-gray-200 outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="all">Todos los Estados</option>
            <option value="execution">En Ejecución</option>
            <option value="bidding">En Licitación</option>
            <option value="completed">Completados</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Leaflet Map (Left) + Project Details Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        
        {/* Leaflet Map Container */}
        <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 min-h-[420px] lg:min-h-[500px] shadow-inner bg-[#0b0c10]">
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-10" />

          {/* Map Overlay Badge */}
          <div className="absolute top-3 left-3 z-20 bg-slate-900/90 backdrop-blur-md border border-white/10 p-2.5 rounded-xl shadow-lg flex items-center gap-3 text-xs font-mono text-white">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
            </span>
            <span>{filteredInitiatives.length} Iniciativas Activas en Mapa</span>
          </div>
        </div>

        {/* Selected Initiative Detail Drawer / Card */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-lg">
          {selectedInitiative ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-white/5 pb-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {selectedInitiative.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                    {selectedInitiative.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-gray-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{selectedInitiative.locationName}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border shrink-0 ${
                  selectedInitiative.status === 'execution' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' :
                  selectedInitiative.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                  'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {selectedInitiative.status === 'execution' ? 'En Ejecución' : selectedInitiative.status === 'completed' ? 'Completado' : 'En Licitación'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 bg-white dark:bg-[#111112] p-3 rounded-xl border border-slate-200 dark:border-white/5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500 dark:text-gray-400">Avance Físico de Obra:</span>
                  <strong className="text-cyan-500 dark:text-cyan-400 font-bold">{selectedInitiative.progress}%</strong>
                </div>
                <div className="w-full bg-slate-200 dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500"
                    style={{ width: `${selectedInitiative.progress}%` }}
                  />
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                {selectedInitiative.description}
              </p>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-white dark:bg-[#111112] rounded-xl border border-slate-200 dark:border-white/5">
                  <span className="text-[10px] text-slate-400 dark:text-gray-500 uppercase block">Presupuesto RYC</span>
                  <strong className="text-amber-500 text-sm">{selectedInitiative.budgetRYC.toLocaleString()} RYC</strong>
                </div>

                <div className="p-2.5 bg-white dark:bg-[#111112] rounded-xl border border-slate-200 dark:border-white/5">
                  <span className="text-[10px] text-slate-400 dark:text-gray-500 uppercase block">Presupuesto MXN</span>
                  <strong className="text-slate-900 dark:text-white text-sm">${selectedInitiative.budgetMXN.toLocaleString('es-MX')}</strong>
                </div>

                <div className="p-2.5 bg-white dark:bg-[#111112] rounded-xl border border-slate-200 dark:border-white/5">
                  <span className="text-[10px] text-slate-400 dark:text-gray-500 uppercase block">Beneficiarios</span>
                  <strong className="text-cyan-400 text-sm">{selectedInitiative.beneficiariesCount.toLocaleString()} habs.</strong>
                </div>

                <div className="p-2.5 bg-white dark:bg-[#111112] rounded-xl border border-slate-200 dark:border-white/5">
                  <span className="text-[10px] text-slate-400 dark:text-gray-500 uppercase block">Respaldo Ciudadano</span>
                  <strong className="text-emerald-400 text-sm">👍 {selectedInitiative.upvotes} Votos</strong>
                </div>
              </div>

              {/* Metadata details */}
              <div className="space-y-1.5 text-[11px] font-mono text-slate-500 dark:text-gray-400 bg-white dark:bg-[#111112] p-3 rounded-xl border border-slate-200 dark:border-white/5">
                <div className="flex justify-between">
                  <span>Contratista:</span>
                  <strong className="text-slate-800 dark:text-gray-200">{selectedInitiative.contractor}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Supervisor Municipal:</span>
                  <span className="text-slate-700 dark:text-gray-300">{selectedInitiative.supervisor}</span>
                </div>
                <div className="flex justify-between">
                  <span>Periodo de Obra:</span>
                  <span>{selectedInitiative.startDate} — {selectedInitiative.estimatedCompletion}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-100 dark:border-white/5 text-[10px]">
                  <span>Estado Supabase:</span>
                  <span className="text-emerald-400">{selectedInitiative.supabaseSyncTime}</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
              <MapPin className="w-12 h-12 text-cyan-500/40 mb-2" />
              <p className="text-xs">Selecciona un marcador en el mapa para ver los detalles de la obra pública.</p>
            </div>
          )}

          {/* List of initiatives quick selection */}
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 dark:text-gray-500 block mb-2">
              Iniciativas Filtradas ({filteredInitiatives.length})
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
              {filteredInitiatives.map(init => (
                <button
                  key={init.id}
                  onClick={() => {
                    setSelectedInitiative(init);
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.flyTo([init.lat, init.lng], 14, { duration: 0.8 });
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono shrink-0 border transition-all cursor-pointer ${
                    selectedInitiative?.id === init.id
                      ? 'bg-cyan-600 text-white border-cyan-500 font-bold shadow-md'
                      : 'bg-white dark:bg-[#111112] text-slate-700 dark:text-gray-300 border-slate-200 dark:border-white/10 hover:border-cyan-500/50'
                  }`}
                >
                  {init.id}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* MODAL: Registra Nueva Obra Pública */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#111112] border border-cyan-500/30 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 relative"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <HardHat className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Registrar Nueva Obra Pública</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInitiative} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase mb-1">Nombre del Proyecto</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Colector Pluvial & Puente Peatonal Av. Hidalgo"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-gray-200 outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase mb-1">Categoría</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as LocalInitiative['category'])}
                    className="w-full bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-gray-200 outline-none"
                  >
                    <option value="Infraestructura">Infraestructura</option>
                    <option value="Vías y Movilidad">Vías y Movilidad</option>
                    <option value="Parques y Verde">Parques y Verde</option>
                    <option value="Agua y Saneamiento">Agua y Saneamiento</option>
                    <option value="Alumbrado e Iluminación">Alumbrado e Iluminación</option>
                    <option value="Salud y Educación">Salud y Educación</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase mb-1">Presupuesto (RYC)</label>
                  <input
                    type="number"
                    required
                    value={newBudgetRYC}
                    onChange={e => setNewBudgetRYC(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-gray-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase mb-1">Ubicación / Sector</label>
                <input
                  type="text"
                  required
                  value={newLocationName}
                  onChange={e => setNewLocationName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase mb-1">Empresa Contratista</label>
                <input
                  type="text"
                  required
                  value={newContractor}
                  onChange={e => setNewContractor(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase mb-1">Descripción</label>
                <textarea
                  rows={2}
                  placeholder="Detalles técnicos y beneficios para la ciudadanía..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-gray-200 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-gray-300 text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  Guardar en Supabase Realtime
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
