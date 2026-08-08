import React from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  Calendar, 
  Clock, 
  FileCheck, 
  MessageSquare, 
  Wallet, 
  Star, 
  TrendingUp,
  Cpu,
  ShieldCheck,
  CheckCircle,
  MoreVertical,
  ChevronRight,
  UploadCloud
} from 'lucide-react';
import type { ProProfile, Appointment, Deliverable } from '../types';

const MOCK_PROFILE: ProProfile = {
  id: 'pro_1',
  name: 'Alex Vanguard',
  title: 'Consultor de Arquitectura Web3',
  rating: 4.9,
  reviews: 124,
  hourlyRateRYC: 150,
  availability: 'available',
  skills: ['Smart Contracts', 'Seguridad Cuántica', 'Arquitectura DApp', 'Auditoría Reycoin']
};

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_1',
    clientName: 'TechCorp Global',
    service: 'Auditoría de Smart Contract',
    date: 'Hoy',
    time: '14:00 - 16:00',
    status: 'upcoming',
    priceRYC: 300,
    paymentStatus: 'escrow'
  },
  {
    id: 'apt_2',
    clientName: 'Elena V.',
    service: 'Consultoría Cúpula Digital',
    date: 'Hoy',
    time: '17:30 - 18:30',
    status: 'upcoming',
    priceRYC: 150,
    paymentStatus: 'paid'
  },
  {
    id: 'apt_3',
    clientName: 'Startup X',
    service: 'Diseño Tokenomics',
    date: 'Mañana',
    time: '10:00 - 12:00',
    status: 'upcoming',
    priceRYC: 450,
    paymentStatus: 'escrow'
  }
];

const MOCK_DELIVERABLES: Deliverable[] = [
  {
    id: 'del_1',
    name: 'Reporte_Auditoria_v1.pdf',
    clientName: 'TechCorp Global',
    uploadDate: 'Hace 2 horas',
    status: 'pending_review',
    size: '4.2 MB'
  },
  {
    id: 'del_2',
    name: 'Esquema_Tokenomics.ryc',
    clientName: 'Startup X',
    uploadDate: 'Ayer',
    status: 'approved',
    size: '1.1 MB'
  }
];

export function ReyplaceProDashboard() {
  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col overflow-y-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-cyan-400" />
            Servicios Pro <span className="text-gray-600 font-medium">/</span> Centro Profesional
          </h1>
          <p className="text-gray-400 mt-2">Gestiona tu portafolio, agenda, citas y pagos seguros mediante Reycoin Escrow.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            Disponible para contrataciones
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Profile & Stats */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111112] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Briefcase className="w-24 h-24" />
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-700 p-1 mb-4">
                <div className="w-full h-full rounded-full bg-[#080809] flex items-center justify-center border-2 border-[#111112] overflow-hidden relative">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)] opacity-40"></div>
                  <span className="text-2xl font-bold text-white z-10">AV</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-white">{MOCK_PROFILE.name}</h2>
              <p className="text-sm text-cyan-400 font-medium mb-3">{MOCK_PROFILE.title}</p>
              
              <div className="flex items-center gap-2 text-sm text-gray-300 mb-6">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-bold">{MOCK_PROFILE.rating}</span>
                <span className="text-gray-500">({MOCK_PROFILE.reviews} reseñas)</span>
              </div>

              <div className="w-full bg-[#080809] rounded-xl p-4 border border-white/5">
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Tarifa Base</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-bold text-white">{MOCK_PROFILE.hourlyRateRYC}</span>
                  <span className="text-sm font-medium text-amber-500">RYC/hr</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#111112] border border-white/5 rounded-2xl p-5 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 flex items-center gap-2"><Wallet className="w-4 h-4" /> En Escrow</span>
              <span className="text-white font-medium">750 RYC</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Ingresos Mes</span>
              <span className="text-green-400 font-medium">+3,240 RYC</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 flex items-center gap-2"><Calendar className="w-4 h-4" /> Horas Agendadas</span>
              <span className="text-white font-medium">18h / sem</span>
            </div>
          </motion.div>
        </div>

        {/* Middle Column: Agenda & Citas */}
        <div className="lg:col-span-6 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#111112] border border-white/5 rounded-2xl p-6 shadow-xl h-full"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold text-white">Agenda & Citas Activas</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Próximos compromisos</p>
              </div>
              <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-gray-300 transition-colors">
                Ver Calendario Completo
              </button>
            </div>

            <div className="space-y-3">
              {MOCK_APPOINTMENTS.map((apt) => (
                <div key={apt.id} className="bg-[#080809] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/10 transition-colors group">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex flex-col items-center justify-center shrink-0 border border-cyan-500/20">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">{apt.date}</span>
                      <span className="text-xs font-mono text-cyan-300">{apt.time.split(' - ')[0]}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white mb-1 group-hover:text-cyan-400 transition-colors">{apt.service}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {apt.clientName}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {apt.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 justify-between sm:justify-end border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                    <div className="text-right">
                      <div className="text-sm font-bold text-amber-500">{apt.priceRYC} RYC</div>
                      <div className={`text-[10px] uppercase tracking-widest font-bold flex items-center justify-end gap-1 ${
                        apt.paymentStatus === 'escrow' ? 'text-purple-400' : 'text-green-400'
                      }`}>
                        {apt.paymentStatus === 'escrow' ? <ShieldCheck className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                        {apt.paymentStatus}
                      </div>
                    </div>
                    <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Deliverables & Reybot */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Deliverables */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#111112] border border-white/5 rounded-2xl p-5 shadow-xl"
          >
             <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs uppercase font-bold tracking-widest text-gray-400">Entregables</h4>
              <button className="text-cyan-400 hover:text-cyan-300">
                <UploadCloud className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              {MOCK_DELIVERABLES.map((doc) => (
                <div key={doc.id} className="bg-[#080809] border border-white/5 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 truncate">
                      <FileCheck className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="text-xs font-medium text-gray-200 truncate">{doc.name}</span>
                    </div>
                    <button className="text-gray-500 hover:text-white shrink-0"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">{doc.clientName}</span>
                    <span className={`text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded ${
                      doc.status === 'pending_review' ? 'bg-amber-500/10 text-amber-400' : 'bg-green-500/10 text-green-400'
                    }`}>
                      {doc.status === 'pending_review' ? 'En Revisión' : 'Aprobado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Reybot Insights */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#111112] border border-white/5 rounded-2xl p-5 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 blur-2xl rounded-full"></div>
            
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs uppercase font-bold tracking-widest text-cyan-400">Reybot Insights</h4>
            </div>

            <div className="space-y-3 relative z-10">
              <div className="bg-[#080809] border border-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-300 leading-relaxed mb-2">
                  La demanda de "Auditoría de Smart Contracts" ha subido un 24% esta semana. Sugiero ajustar tu tarifa base a <span className="text-amber-400 font-bold">165 RYC/hr</span> para maximizar ingresos.
                </p>
                <button className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 flex items-center gap-1 hover:text-cyan-300">
                  Ajustar Tarifas <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="bg-[#080809] border border-white/5 rounded-lg p-3 flex justify-between items-center">
                <span className="text-xs text-gray-400">Respuestas Automáticas</span>
                <div className="w-8 h-4 bg-cyan-500 rounded-full flex items-center p-0.5 justify-end">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
