import React, { useState } from 'react';
import { motion } from 'motion/react';
import smartCityBanner from '../assets/images/smart_city_banner_1786197097177.jpg';
import { 
  Building2, 
  Map as MapIcon, 
  AlertTriangle, 
  Car, 
  CloudRain, 
  ShieldAlert, 
  Lock,
  Camera,
  Activity,
  Wind,
  CheckCircle,
  Clock,
  Radio,
  Eye,
  Settings
} from 'lucide-react';
import type { CityAlert, CitySensor } from '../types';

const MOCK_ALERTS: CityAlert[] = [
  {
    id: 'alt_1',
    type: 'traffic',
    title: 'Congestión Severa - Vía Principal',
    description: 'Tráfico detenido por accidente. Desvíos automáticos activados en red logística.',
    severity: 'critical',
    location: 'Vía Principal, Sector 4',
    timestamp: 'Hace 10 min',
    isEncryptedReport: false
  },
  {
    id: 'alt_2',
    type: 'weather',
    title: 'Alerta de Lluvias Fuertes',
    description: 'Precipitación estimada de 40mm/h en la próxima hora.',
    severity: 'warning',
    location: 'Toda la ciudad',
    timestamp: 'Hace 30 min',
    isEncryptedReport: false
  },
  {
    id: 'alt_3',
    type: 'security',
    title: 'Reporte Anónimo Cifrado',
    description: 'Reporte ciudadano de actividad sospechosa. Cifrado ZK activado.',
    severity: 'warning',
    location: 'Zona Industrial Sur',
    timestamp: 'Hace 2 horas',
    isEncryptedReport: true
  }
];

const MOCK_SENSORS: CitySensor[] = [
  {
    id: 'sn_1',
    type: 'traffic',
    name: 'Radar Flujo Vehicular',
    location: 'Intersección Norte-Sur',
    status: 'online',
    lastReading: '245 vehículos/hora'
  },
  {
    id: 'sn_2',
    type: 'camera',
    name: 'Cam 4K - Plaza Central',
    location: 'Plaza Central',
    status: 'online',
    lastReading: 'Feed Activo'
  },
  {
    id: 'sn_3',
    type: 'air_quality',
    name: 'Sensor PM2.5 / AQI',
    location: 'Parque Metropolitano',
    status: 'online',
    lastReading: 'AQI: 42 (Bueno)'
  },
  {
    id: 'sn_4',
    type: 'weather',
    name: 'Estación Meteorológica',
    location: 'Torre Reyplace',
    status: 'maintenance',
    lastReading: 'Calibrando'
  }
];

export function SmartCityDashboard() {
  const [activeTab, setActiveTab] = useState<'map' | 'alerts' | 'sensors' | 'reports'>('map');

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col overflow-y-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
            <Building2 className="w-8 h-8 text-blue-400" />
            Smart City <span className="text-gray-600 font-medium">/</span> Centro de Control
          </h1>
          <p className="text-gray-400 mt-2">Monitoreo urbano en tiempo real. Integrado con logística, reportes cifrados y gobierno digital.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#111112] border border-white/5 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'map' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Mapa Urbano
          </button>
          <button 
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'alerts' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Alertas
          </button>
          <button 
            onClick={() => setActiveTab('sensors')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'sensors' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Sensores
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'reports' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Reportes Cifrados
          </button>
        </div>
      </header>

      {/* Banner Smart City */}
      <div className="relative rounded-2xl overflow-hidden border border-blue-500/30 shadow-xl bg-[#080809] h-36 sm:h-48">
        <img
          src={smartCityBanner}
          alt="Smart City Banner"
          className="w-full h-full object-cover opacity-70"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
        <div className="absolute inset-0 p-6 flex flex-col justify-center">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold mb-1">
            Módulo Smart City • Los Mochis, Sinaloa
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Monitoreo Urbano & Red de Sensores Cúpula
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mt-1">
            Gestión inteligente de tráfico, clima, seguridad y reportes ciudadanos protegidos por la Cúpula Digital.
          </p>
        </div>
      </div>

      {activeTab === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[600px]">
          <div className="lg:col-span-9 bg-[#111112] border border-white/5 rounded-2xl p-4 shadow-xl relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <MapIcon className="w-5 h-5 text-blue-400" /> Live City Map
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[10px] text-green-400 uppercase font-bold tracking-widest bg-green-500/10 px-2 py-1 rounded">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div> Feed Activo
                </span>
                <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Settings className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 bg-[#080809] border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-center group">
              <div className="absolute inset-0 bg-blue-900/10 pointer-events-none"></div>
              
              <div className="text-center z-10">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-4 relative">
                   <div className="absolute inset-0 rounded-full border border-blue-400/50 animate-ping"></div>
                   <Radio className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-gray-400 text-sm font-medium">Cargando datos satelitales y de sensores...</p>
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                 <button className="flex-1 bg-[#111112]/90 backdrop-blur-md border border-white/10 rounded-lg p-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                   <Car className="w-4 h-4 text-amber-400" /> Capa Tráfico
                 </button>
                 <button className="flex-1 bg-[#111112]/90 backdrop-blur-md border border-white/10 rounded-lg p-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                   <CloudRain className="w-4 h-4 text-blue-400" /> Capa Clima
                 </button>
                 <button className="flex-1 bg-[#111112]/90 backdrop-blur-md border border-white/10 rounded-lg p-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                   <Camera className="w-4 h-4 text-purple-400" /> Cámaras (CCTV)
                 </button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3 space-y-6 flex flex-col">
            <div className="bg-[#111112] border border-white/5 rounded-2xl p-5 shadow-xl">
              <h3 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-4">Estado General</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Calidad del Aire (AQI)</span>
                    <span className="text-green-400 font-bold">42 (Bueno)</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1">
                    <div className="bg-green-400 h-1 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Flujo Vehicular</span>
                    <span className="text-amber-400 font-bold">Medio</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1">
                    <div className="bg-amber-400 h-1 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Cobertura WiFi Ciudad</span>
                    <span className="text-cyan-400 font-bold">98%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1">
                    <div className="bg-cyan-400 h-1 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#111112] border border-white/5 rounded-2xl p-5 shadow-xl flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs uppercase font-bold tracking-widest text-gray-500">Alertas Recientes</h3>
                <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-bold">{MOCK_ALERTS.length}</span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {MOCK_ALERTS.map(alert => (
                  <div key={alert.id} className="bg-[#080809] border border-white/5 p-3 rounded-xl">
                    <div className="flex items-start gap-2 mb-1">
                      {alert.severity === 'critical' ? <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                      <h4 className="text-xs font-bold text-white leading-tight">{alert.title}</h4>
                    </div>
                    <p className="text-[10px] text-gray-500 pl-6">{alert.timestamp} • {alert.location}</p>
                  </div>
                ))}
              </div>
              <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white transition-colors mt-4">
                Ver Todas
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="bg-[#111112] border border-white/5 rounded-2xl shadow-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Centro de Alertas Ciudadanas
            </h3>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 hover:text-white transition-colors">
                Filtrar por Severidad
              </button>
              <button className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-xs font-bold text-cyan-400 hover:bg-cyan-500/20 transition-colors flex items-center gap-1">
                <Radio className="w-3 h-3" /> Emitir Alerta
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_ALERTS.map(alert => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={alert.id} 
                className={`border rounded-xl p-5 transition-colors relative overflow-hidden group ${
                  alert.severity === 'critical' 
                    ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40' 
                    : 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40'
                }`}
              >
                {alert.isEncryptedReport && (
                  <div className="absolute top-0 right-0 bg-purple-500/10 text-purple-400 text-[9px] uppercase font-bold tracking-widest px-2 py-1 rounded-bl-lg border-b border-l border-purple-500/20 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Cifrado
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    alert.severity === 'critical' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {alert.type === 'traffic' ? <Car className="w-5 h-5" /> : 
                     alert.type === 'weather' ? <CloudRain className="w-5 h-5" /> :
                     alert.type === 'security' ? <ShieldAlert className="w-5 h-5" /> :
                     <Activity className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{alert.title}</h4>
                    <p className="text-[10px] text-gray-500">{alert.timestamp}</p>
                  </div>
                </div>
                
                <p className="text-xs text-gray-300 mb-4 h-10 line-clamp-2">{alert.description}</p>
                
                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="text-[10px] text-gray-500 truncate max-w-[150px] flex items-center gap-1">
                     <MapIcon className="w-3 h-3" /> {alert.location}
                  </span>
                  <button className="text-[10px] uppercase font-bold tracking-widest text-white hover:text-cyan-400 transition-colors">
                    Ver Detalles
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'sensors' && (
        <div className="bg-[#111112] border border-white/5 rounded-2xl shadow-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
             <h3 className="text-sm font-bold text-white flex items-center gap-2">
               <Activity className="w-4 h-4 text-cyan-400" /> Red de Sensores IoT
             </h3>
             <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1 text-gray-400"><div className="w-2 h-2 rounded-full bg-green-500"></div> Online (98%)</span>
                <span className="flex items-center gap-1 text-gray-400"><div className="w-2 h-2 rounded-full bg-red-500"></div> Offline (1%)</span>
                <span className="flex items-center gap-1 text-gray-400"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Maint. (1%)</span>
             </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-[#080809]/50">
                  <th className="px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sensor / Ubicación</th>
                  <th className="px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tipo</th>
                  <th className="px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Última Lectura</th>
                  <th className="px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Estado</th>
                  <th className="px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_SENSORS.map(sensor => (
                  <tr key={sensor.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                          sensor.type === 'camera' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                          sensor.type === 'traffic' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                          sensor.type === 'air_quality' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                          'bg-blue-500/10 border-blue-500/20 text-blue-400'
                        }`}>
                           {sensor.type === 'camera' ? <Camera className="w-5 h-5" /> : 
                            sensor.type === 'traffic' ? <Car className="w-5 h-5" /> :
                            sensor.type === 'air_quality' ? <Wind className="w-5 h-5" /> :
                            <CloudRain className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white mb-0.5">{sensor.name}</p>
                          <p className="text-[10px] text-gray-500">{sensor.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                       <span className="text-xs text-gray-300 uppercase font-bold tracking-widest">{sensor.type.replace('_', ' ')}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-300 font-mono">{sensor.lastReading || '--'}</span>
                    </td>
                    <td className="px-5 py-4">
                      {sensor.status === 'online' && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] uppercase font-bold tracking-widest">
                          <CheckCircle className="w-3 h-3" /> Online
                        </span>
                      )}
                      {sensor.status === 'maintenance' && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] uppercase font-bold tracking-widest">
                          <Settings className="w-3 h-3" /> Mant.
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors ml-auto">
                        <Eye className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-gradient-to-br from-[#111112] to-[#1a1025] border border-purple-500/20 rounded-2xl p-8 shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                 <Lock className="w-48 h-48 text-purple-400" />
              </div>
              
              <div className="w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-6 relative z-10">
                 <Lock className="w-10 h-10 text-purple-400" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">Reportes Cifrados ZK</h3>
              <p className="text-sm text-gray-400 mb-8 max-w-md relative z-10 leading-relaxed">
                El sistema de reportes ciudadanos utiliza pruebas de conocimiento cero (ZK-proofs) para garantizar el anonimato total del denunciante mientras se verifica la autenticidad del reporte en blockchain.
              </p>
              
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2 relative z-10">
                <Lock className="w-4 h-4" /> Generar Reporte Anónimo
              </button>
           </div>
           
           <div className="bg-[#111112] border border-white/5 rounded-2xl shadow-xl p-6 flex flex-col">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-purple-400" /> Inbox Seguro
              </h3>
              
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl bg-[#080809]">
                 <div className="text-center p-6">
                   <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                     <Lock className="w-5 h-5 text-gray-500" />
                   </div>
                   <p className="text-sm font-bold text-gray-400">Bandeja Vacía</p>
                   <p className="text-xs text-gray-500 mt-1">Los reportes descifrados aparecerán aquí.</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
