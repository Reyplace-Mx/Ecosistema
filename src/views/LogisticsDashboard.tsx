import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Truck, 
  Map, 
  PackageSearch, 
  Navigation, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle,
  AlertCircle,
  DollarSign,
  Activity,
  Layers
} from 'lucide-react';
import type { DeliveryDriver, DeliveryShipment, DeliveryZone } from '../types';

const MOCK_SHIPMENTS: DeliveryShipment[] = [
  {
    id: 'SHP-9021',
    orderId: 'ORD-9844',
    destination: 'Sector 4, Av. Principal 120',
    status: 'in_transit',
    estimatedTime: '14:30',
    driverId: 'drv_1',
    feeRYC: 15
  },
  {
    id: 'SHP-9022',
    orderId: 'ORD-9845',
    destination: 'Zona Industrial Sur, Nave 8',
    status: 'pending',
    estimatedTime: '16:00',
    feeRYC: 25
  },
  {
    id: 'SHP-9018',
    orderId: 'ORD-9812',
    destination: 'Centro Comercial Reyplace, Local 42',
    status: 'delivered',
    estimatedTime: 'Entregado a las 11:15',
    driverId: 'drv_2',
    feeRYC: 10
  }
];

const MOCK_DRIVERS: DeliveryDriver[] = [
  {
    id: 'drv_1',
    name: 'Carlos Mendoza',
    vehicle: 'Furgoneta Eléctrica T2',
    rating: 4.9,
    status: 'on_route',
    completedDeliveries: 1245
  },
  {
    id: 'drv_2',
    name: 'Ana Silva',
    vehicle: 'Moto EV-R',
    rating: 4.8,
    status: 'available',
    completedDeliveries: 890
  }
];

const MOCK_ZONES: DeliveryZone[] = [
  {
    id: 'zone_1',
    name: 'Centro & Distrito Smart',
    baseFeeRYC: 10,
    status: 'active'
  },
  {
    id: 'zone_2',
    name: 'Zona Industrial & Periferia',
    baseFeeRYC: 25,
    status: 'active'
  }
];

export function LogisticsDashboard() {
  const [activeTab, setActiveTab] = useState<'tracking' | 'drivers' | 'zones'>('tracking');

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col overflow-y-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
            <Truck className="w-8 h-8 text-cyan-400" />
            Logística <span className="text-gray-600 font-medium">/</span> Red de Distribución
          </h1>
          <p className="text-gray-400 mt-2">Gestiona rutas, tracking, tarifas, zonas y repartidores. Conectado con Marketplace & Smart City.</p>
        </div>
        <div className="flex items-center gap-3 bg-[#111112] border border-white/5 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('tracking')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'tracking' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Tracking & Rutas
          </button>
          <button 
            onClick={() => setActiveTab('drivers')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'drivers' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Repartidores
          </button>
          <button 
            onClick={() => setActiveTab('zones')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'zones' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Zonas & Tarifas
          </button>
        </div>
      </header>

      {activeTab === 'tracking' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#111112] border border-white/5 rounded-2xl p-6 shadow-xl min-h-[500px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <PackageSearch className="w-4 h-4 text-cyan-400" /> Envíos Activos
                </h3>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="flex items-center gap-1 text-gray-400 bg-white/5 px-2 py-1 rounded">
                    <Activity className="w-3 h-3" /> Auto-asignación Web3 activada
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {MOCK_SHIPMENTS.map(shipment => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={shipment.id} 
                    className="bg-[#080809] border border-white/5 hover:border-white/10 transition-colors rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                        shipment.status === 'in_transit' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' :
                        shipment.status === 'delivered' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                        'bg-white/5 border-white/10 text-gray-400'
                      }`}>
                        {shipment.status === 'delivered' ? <CheckCircle className="w-6 h-6" /> : <Truck className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-white">{shipment.id}</span>
                          <span className="text-[10px] text-gray-500">Ord: {shipment.orderId}</span>
                          <span className={`text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded ${
                            shipment.status === 'in_transit' ? 'bg-cyan-500/10 text-cyan-400' :
                            shipment.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                            'bg-amber-500/10 text-amber-400'
                          }`}>
                            {shipment.status === 'in_transit' ? 'En Tránsito' : shipment.status === 'delivered' ? 'Entregado' : 'Pendiente'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-500" /> {shipment.destination}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                          <Clock className="w-3 h-3" /> ETA: {shipment.estimatedTime}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                      <div className="text-sm font-bold text-white flex items-center gap-1">
                        {shipment.feeRYC} <span className="text-xs text-amber-500">RYC</span>
                      </div>
                      {shipment.driverId ? (
                        <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded text-xs text-gray-400 border border-white/10">
                          <Navigation className="w-3 h-3 text-cyan-400" /> {MOCK_DRIVERS.find(d => d.id === shipment.driverId)?.name}
                        </div>
                      ) : (
                        <button className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 hover:text-cyan-300">
                          Asignar Ruta
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden h-[300px] flex flex-col justify-end">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              
              <div className="absolute top-6 left-6 right-6 flex items-start justify-between z-10">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Live Map Integrado</h3>
                  <p className="text-xs text-gray-400">Smart City Traffic Hub</p>
                </div>
                <Map className="w-6 h-6 text-cyan-400" />
              </div>
              
              <div className="relative z-10 bg-[#080809]/80 backdrop-blur-md border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">Tráfico Ciudad</span>
                  <span className="flex items-center gap-1 text-xs text-green-400 font-bold">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div> Fluido
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Rutas Optimizadas</span>
                    <span className="text-white font-medium">98%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Ahorro CO2</span>
                    <span className="text-green-400 font-medium">12.5 kg</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#111112] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-4">Métricas del Día</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#080809] border border-white/5 rounded-xl p-4">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Entregas</p>
                  <p className="text-2xl font-bold text-white">45</p>
                </div>
                <div className="bg-[#080809] border border-white/5 rounded-xl p-4">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Ingresos (Fee)</p>
                  <p className="text-xl font-bold text-white flex items-center gap-1">420 <span className="text-xs text-amber-500">RYC</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'drivers' && (
        <div className="bg-[#111112] border border-white/5 rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" /> Flota & Repartidores
            </h3>
            <button className="text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-widest bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20">
              Añadir Repartidor
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_DRIVERS.map(driver => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={driver.id} 
                className="bg-[#080809] border border-white/5 hover:border-white/10 rounded-xl p-5 transition-all shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center text-lg font-bold text-white">
                      {driver.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{driver.name}</h4>
                      <p className="text-xs text-gray-500">{driver.vehicle}</p>
                    </div>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                    driver.status === 'available' ? 'bg-green-500 shadow-green-500/50' : 
                    driver.status === 'on_route' ? 'bg-cyan-500 shadow-cyan-500/50' : 
                    'bg-gray-500'
                  }`}></span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#111112] rounded-lg p-2 text-center border border-white/5">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Rating</p>
                    <p className="text-sm font-bold text-white">{driver.rating} ⭐</p>
                  </div>
                  <div className="bg-[#111112] rounded-lg p-2 text-center border border-white/5">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Entregas</p>
                    <p className="text-sm font-bold text-white">{driver.completedDeliveries}</p>
                  </div>
                </div>
                
                <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white transition-colors">
                  Ver Perfil Completo
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'zones' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#111112] border border-white/5 rounded-2xl shadow-xl p-6">
             <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" /> Zonas de Cobertura
              </h3>
            </div>
            
            <div className="space-y-4">
              {MOCK_ZONES.map(zone => (
                <div key={zone.id} className="bg-[#080809] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{zone.name}</h4>
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                      Activa
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Tarifa Base</p>
                    <p className="text-lg font-bold text-white flex items-center justify-end gap-1">
                      {zone.baseFeeRYC} <span className="text-xs text-amber-500">RYC</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-b from-[#111112] to-[#0c0c0d] border border-white/5 rounded-2xl shadow-xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <DollarSign className="w-32 h-32" />
              </div>
            <h3 className="text-sm font-bold text-white mb-4 relative z-10">Configuración de Tarifas</h3>
            <div className="space-y-6 relative z-10">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Multiplicador por Distancia (por km)</label>
                <div className="flex items-center gap-3">
                  <input type="number" defaultValue="1.5" className="bg-[#080809] border border-white/10 rounded-lg px-3 py-2 text-white w-24 text-center focus:outline-none focus:border-cyan-500" />
                  <span className="text-sm text-gray-300">RYC / km extra</span>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Comisión de Plataforma</label>
                <div className="flex items-center justify-between bg-[#080809] border border-white/10 rounded-lg p-4">
                  <span className="text-sm text-gray-300">Fee deducido por envío</span>
                  <span className="text-lg font-bold text-white">5%</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-2">Esta tarifa se destina a la tesorería de Reycoin.</p>
              </div>
              
              <button className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-sm font-bold text-white transition-colors mt-4">
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
