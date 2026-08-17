import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Store, 
  MapPin, 
  Package, 
  BarChart3, 
  Settings, 
  ShoppingCart, 
  CheckCircle, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  Box, 
  Truck, 
  Star,
  Share2,
  MessageCircle,
  Zap,
  Globe,
  RefreshCw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import type { BusinessProfile, Branch, InventoryItem } from '../types';
import { MOCHIS_ZONES_DATA } from '../lib/metaBusinessService';
import { MetaBusinessMetricsView } from '../components/MetaBusinessMetricsView';

const MOCK_PROFILE: BusinessProfile = {
  id: 'biz_1',
  name: 'UrbanTech Solutions & AgroDigital Mochis',
  category: 'Tecnología IoT & Agroindustria Sinaloa',
  verificationStatus: 'verified',
  rating: 4.8,
  totalSales: 12500
};

const MOCK_BRANCHES: Branch[] = [
  {
    id: 'br_1',
    name: 'Sede Principal Centro Los Mochis',
    address: 'Av. Gabriel Leyva #415 Nte., Col. Centro, Los Mochis, Sin. (CP 81200)',
    status: 'active'
  },
  {
    id: 'br_2',
    name: 'Sucursal Paseo Los Mochis',
    address: 'Blvd. Centenario #850 Ote., Plaza Paseo Local 42, Los Mochis, Sin. (CP 81240)',
    status: 'active'
  },
  {
    id: 'br_3',
    name: 'Centro Logístico Valle del Fuerte',
    address: 'Parque Industrial Ecológico Nave 4, Los Mochis, Sin. (CP 81255)',
    status: 'active'
  }
];

const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'inv_1',
    name: 'Sensor IoT Ambiental v2 (Monitoreo Riego)',
    sku: 'IOT-ENV-002',
    stock: 45,
    priceRYC: 120,
    status: 'in_stock'
  },
  {
    id: 'inv_2',
    name: 'Módulo de Conectividad LoRa Agrícola',
    sku: 'LORA-MOD-01',
    stock: 8,
    priceRYC: 85,
    status: 'low_stock'
  },
  {
    id: 'inv_3',
    name: 'Kit Domótica Base para Oficinas',
    sku: 'DOM-KIT-B',
    stock: 0,
    priceRYC: 350,
    status: 'out_of_stock'
  }
];

export function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'meta_analytics' | 'meta_sync' | 'inventory'>('overview');
  const [isSyncingMeta, setIsSyncingMeta] = useState(false);
  const [metaSyncNotice, setMetaSyncNotice] = useState<string | null>(null);

  const handleManualMetaSync = async () => {
    setIsSyncingMeta(true);
    setMetaSyncNotice('Sincronizando inventario con Meta Commerce Manager y Facebook Marketplace Mochis...');
    await new Promise(r => setTimeout(r, 1000));
    setIsSyncingMeta(false);
    setMetaSyncNotice('¡Inventario y precios sincronizados con Meta Graph API v19 (Los Mochis, Sin.)!');
    setTimeout(() => setMetaSyncNotice(null), 3500);
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col overflow-y-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
            <Store className="w-8 h-8 text-cyan-400" />
            Negocios <span className="text-gray-600 font-medium">/</span> Centro de Operaciones
          </h1>
          <p className="text-gray-400 mt-2">
            Gestiona sucursales en Los Mochis (Sinaloa), inventario, métricas de Meta Business Suite con Recharts y WhatsApp.
          </p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'overview' ? 'bg-white/10 text-white font-semibold' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Resumen
          </button>
          <button 
            onClick={() => setActiveTab('meta_analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'meta_analytics'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-white/5 text-gray-300 border border-white/5 hover:bg-white/10'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-cyan-300" />
            <span>Métricas Meta Suite (Recharts)</span>
          </button>
          <button 
            onClick={() => setActiveTab('meta_sync')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'meta_sync'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-white/5 text-gray-300 border border-white/5 hover:bg-white/10'
            }`}
          >
            <Share2 className="w-4 h-4 text-cyan-300" />
            <span>Meta & WhatsApp Sync</span>
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'inventory' ? 'bg-white/10 text-white font-semibold' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Inventario
          </button>
        </div>
      </header>

      {metaSyncNotice && (
        <div className="p-3 bg-gradient-to-r from-blue-950 to-cyan-950 border border-cyan-500/40 rounded-2xl text-xs text-cyan-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{metaSyncNotice}</span>
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Business Profile */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111112] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Store className="w-32 h-32" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-xl font-bold text-white shadow-lg overflow-hidden relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)] opacity-40"></div>
                    UT
                  </div>
                  {MOCK_PROFILE.verificationStatus === 'verified' && (
                    <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest border border-green-500/20">
                      <CheckCircle className="w-3 h-3" />
                      Empresa Verificada
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-white mb-1">{MOCK_PROFILE.name}</h2>
                <p className="text-gray-500 text-sm mb-6">{MOCK_PROFILE.category}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#080809] border border-white/5 rounded-xl p-3">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Ventas (RYC)</p>
                    <p className="text-lg font-bold text-white flex items-center gap-1">
                      {MOCK_PROFILE.totalSales.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-[#080809] border border-white/5 rounded-xl p-3">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Rating</p>
                    <p className="text-lg font-bold text-white flex items-center gap-1">
                      {MOCK_PROFILE.rating} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#111112] border border-white/5 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" /> Sucursales en Los Mochis
                </h3>
                <span className="text-xs font-bold text-cyan-400">
                  {MOCK_BRANCHES.length} Activas
                </span>
              </div>
              <div className="space-y-3">
                {MOCK_BRANCHES.map(branch => (
                  <div key={branch.id} className="bg-[#080809] border border-white/5 rounded-xl p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-gray-200">{branch.name}</span>
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    </div>
                    <p className="text-xs text-gray-500">{branch.address}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Key Metrics & Recent Activity */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/20 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center gap-2 mb-2 text-cyan-400">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="text-xs uppercase font-bold tracking-widest">Órdenes Hoy</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">24</div>
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <TrendingUp className="w-3 h-3" /> +12% vs ayer en Ahome
                </div>
              </div>
              <div className="bg-[#111112] border border-white/5 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center gap-2 mb-2 text-emerald-400">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-xs uppercase font-bold tracking-widest">Leads WhatsApp</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">18</div>
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  <Zap className="w-3 h-3" /> Desde FB Marketplace Mochis
                </div>
              </div>
              <div className="bg-[#111112] border border-white/5 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-xs uppercase font-bold tracking-widest">Ingresos Mes</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">4,200 <span className="text-sm text-gray-500 font-normal">RYC</span></div>
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <TrendingUp className="w-3 h-3" /> +5% vs mes anterior
                </div>
              </div>
            </div>

            <div className="bg-[#111112] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Integraciones de Canal & Meta Suite</h3>
                <button
                  onClick={handleManualMetaSync}
                  disabled={isSyncingMeta}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingMeta ? 'animate-spin' : ''}`} />
                  <span>Sincronizar Todo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setActiveTab('meta_sync')}
                  className="bg-[#080809] border border-white/5 hover:border-blue-500/30 rounded-xl p-4 text-left transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Meta Business & FB Marketplace</p>
                      <p className="text-xs text-gray-500">Catálogo activo en Los Mochis</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </button>

                <button 
                  onClick={() => setActiveTab('meta_sync')}
                  className="bg-[#080809] border border-white/5 hover:border-emerald-500/30 rounded-xl p-4 text-left transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">WhatsApp Business Cloud API</p>
                      <p className="text-xs text-gray-500">Webhooks de leads en tiempo real</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </button>

                <button className="bg-[#080809] border border-white/5 hover:border-white/10 rounded-xl p-4 text-left transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Logística & Envíos Ahome</p>
                      <p className="text-xs text-gray-500">Cobertura Mochis y Topolobampo</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </button>

                <button className="bg-[#080809] border border-white/5 hover:border-white/10 rounded-xl p-4 text-left transition-colors flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-white/10 transition-colors">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">Ajustes SAT & Reycoin</p>
                    <p className="text-xs text-gray-500">Facturación 4.0 y pasarela de cobro</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Meta Business Suite Metrics with Recharts */}
      {activeTab === 'meta_analytics' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <MetaBusinessMetricsView />
        </motion.div>
      )}

      {/* Tab: Meta & WhatsApp Sync Detail View */}
      {activeTab === 'meta_sync' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-blue-400" />
                  <h2 className="text-base font-bold text-white">Conectores Oficiales Meta & WhatsApp Business</h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Integración directa para retroalimentar inventario, precios y campañas en Los Mochis y Valle del Fuerte, Sinaloa.
                </p>
              </div>

              <button
                onClick={handleManualMetaSync}
                disabled={isSyncingMeta}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingMeta ? 'animate-spin' : ''}`} />
                <span>{isSyncingMeta ? 'Sincronizando...' : 'Forzar Sincronización Graph API'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-blue-400" /> Facebook Pages & Shop
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    CONECTADO
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Página: <strong>Reyplace Comercio Los Mochis (@reyplacemochis)</strong></p>
                <div className="text-[10px] font-mono text-slate-500">ID de Página: 109283749102938</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-emerald-400" /> WhatsApp Cloud API
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    ACTIVO (WABA)
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Línea Oficial: <strong>+52 668 100 9000</strong></p>
                <div className="text-[10px] font-mono text-slate-500">Plantillas de Respuesta Automática: 14</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-purple-400" /> Meta Conversions API (CAPI)
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                    PIXEL SERVER-SIDE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Pixel ID: <strong>928103948571029</strong></p>
                <div className="text-[10px] font-mono text-slate-500">Eventos de Compra & Leads deduplicados</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="bg-[#111112] border border-white/5 rounded-2xl shadow-xl flex flex-col min-h-[500px]">
          <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-bold text-white">Catálogo & Inventario</h3>
              <div className="hidden sm:block h-4 w-px bg-white/10"></div>
              <span className="text-xs text-gray-500">{MOCK_INVENTORY.length} artículos</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg text-sm font-bold text-white hover:opacity-90 transition-opacity cursor-pointer">
              <Plus className="w-4 h-4" /> Nuevo Artículo
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-[#080809]/50">
                  <th className="px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Artículo / SKU</th>
                  <th className="px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stock</th>
                  <th className="px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Precio (RYC)</th>
                  <th className="px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Estado</th>
                  <th className="px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_INVENTORY.map(item => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#080809] border border-white/5 flex items-center justify-center shrink-0">
                          <Box className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white mb-0.5">{item.name}</p>
                          <p className="text-[10px] font-mono text-gray-500">{item.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-medium ${item.stock === 0 ? 'text-gray-500' : 'text-white'}`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-white">{item.priceRYC}</span>
                    </td>
                    <td className="px-5 py-4">
                      {item.status === 'in_stock' && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] uppercase font-bold tracking-widest">
                          En Stock
                        </span>
                      )}
                      {item.status === 'low_stock' && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] uppercase font-bold tracking-widest">
                          <AlertTriangle className="w-3 h-3" /> Poco Stock
                        </span>
                      )}
                      {item.status === 'out_of_stock' && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] uppercase font-bold tracking-widest">
                          Agotado
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="text-xs font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer">
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

