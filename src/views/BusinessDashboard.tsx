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
  Star
} from 'lucide-react';
import type { BusinessProfile, Branch, InventoryItem } from '../types';

const MOCK_PROFILE: BusinessProfile = {
  id: 'biz_1',
  name: 'UrbanTech Solutions',
  category: 'Tecnología IoT',
  verificationStatus: 'verified',
  rating: 4.8,
  totalSales: 12500
};

const MOCK_BRANCHES: Branch[] = [
  {
    id: 'br_1',
    name: 'Sede Principal',
    address: 'Av. Tecnológica 124, Zona Norte',
    status: 'active'
  },
  {
    id: 'br_2',
    name: 'Centro de Distribución',
    address: 'Parque Industrial Sur, Nave 4',
    status: 'active'
  }
];

const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'inv_1',
    name: 'Sensor IoT Ambiental v2',
    sku: 'IOT-ENV-002',
    stock: 45,
    priceRYC: 120,
    status: 'in_stock'
  },
  {
    id: 'inv_2',
    name: 'Módulo de Conectividad LoRa',
    sku: 'LORA-MOD-01',
    stock: 8,
    priceRYC: 85,
    status: 'low_stock'
  },
  {
    id: 'inv_3',
    name: 'Kit Domótica Base',
    sku: 'DOM-KIT-B',
    stock: 0,
    priceRYC: 350,
    status: 'out_of_stock'
  }
];

export function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory'>('overview');

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col overflow-y-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
            <Store className="w-8 h-8 text-cyan-400" />
            Negocios <span className="text-gray-600 font-medium">/</span> Centro de Operaciones
          </h1>
          <p className="text-gray-400 mt-2">Gestiona tus sucursales, inventario, reportes y configuración.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Resumen
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'inventory' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Inventario
          </button>
        </div>
      </header>

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
                  <MapPin className="w-4 h-4 text-cyan-400" /> Sucursales
                </h3>
                <button className="text-xs font-bold text-cyan-400 hover:text-cyan-300">
                  + Nueva
                </button>
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
                  <TrendingUp className="w-3 h-3" /> +12% vs ayer
                </div>
              </div>
              <div className="bg-[#111112] border border-white/5 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                  <Package className="w-5 h-5" />
                  <span className="text-xs uppercase font-bold tracking-widest">Envíos Pendientes</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">8</div>
                <button className="text-[10px] text-cyan-400 uppercase font-bold tracking-widest mt-1 hover:text-cyan-300">
                  Ver Logística
                </button>
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

            <div className="bg-[#111112] border border-white/5 rounded-2xl p-6 shadow-xl h-[340px] flex flex-col">
              <h3 className="text-sm font-bold text-white mb-4">Integraciones & Configuración</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-[#080809] border border-white/5 hover:border-white/10 rounded-xl p-4 text-left transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Marketplace Sync</p>
                      <p className="text-xs text-gray-500">Catálogo sincronizado</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </button>
                <button className="bg-[#080809] border border-white/5 hover:border-white/10 rounded-xl p-4 text-left transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Logística Reyplace</p>
                      <p className="text-xs text-gray-500">Envíos automáticos</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </button>
                <button className="bg-[#080809] border border-white/5 hover:border-white/10 rounded-xl p-4 text-left transition-colors flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-white/10 transition-colors">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">Ajustes de Negocio</p>
                    <p className="text-xs text-gray-500">Impuestos, notificaciones</p>
                  </div>
                </button>
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
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg text-sm font-bold text-white hover:opacity-90 transition-opacity">
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
                      <button className="text-xs font-bold text-cyan-400 hover:text-cyan-300">
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
