import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Landmark,
  FileText,
  CreditCard,
  AlertTriangle,
  Building,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Camera
} from 'lucide-react';
import type { GovProcedure, GovPayment, GovReport } from '../types';

const MOCK_PROCEDURES: GovProcedure[] = [
  {
    id: 'TRM-9921',
    name: 'Renovación Licencia Comercial',
    department: 'Desarrollo Económico',
    status: 'in_progress',
    dateSubmitted: '12/10/2023',
    lastUpdate: 'Hace 2 días'
  },
  {
    id: 'TRM-8834',
    name: 'Permiso de Construcción Menor',
    department: 'Obras Públicas',
    status: 'completed',
    dateSubmitted: '01/09/2023',
    lastUpdate: '25/09/2023'
  },
  {
    id: 'TRM-1022',
    name: 'Alta vehicular',
    department: 'Tránsito Municipal',
    status: 'pending',
    dateSubmitted: 'Hoy',
    lastUpdate: 'Hace 1 hora'
  }
];

const MOCK_PAYMENTS: GovPayment[] = [
  {
    id: 'PAY-4412',
    description: 'Impuesto Predial Anual',
    amountRYC: 250,
    amountUSD: 250,
    dueDate: '31/12/2023',
    status: 'pending'
  },
  {
    id: 'PAY-4411',
    description: 'Derechos por Licencia de Funcionamiento',
    amountRYC: 50,
    amountUSD: 50,
    dueDate: '15/10/2023',
    status: 'paid'
  }
];

const MOCK_REPORTS: GovReport[] = [
  {
    id: 'REP-773',
    type: 'Bacheo',
    location: 'Av. Principal esq. Calle 4',
    status: 'assigned',
    dateReported: 'Ayer',
    upvotes: 42
  },
  {
    id: 'REP-774',
    type: 'Alumbrado Público',
    location: 'Parque Central',
    status: 'open',
    dateReported: 'Hoy',
    upvotes: 12
  }
];

export function GovernmentDashboard() {
  const [activeTab, setActiveTab] = useState<'procedures' | 'payments' | 'reports' | 'integration'>('procedures');

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col overflow-y-auto">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
            <Landmark className="w-8 h-8 text-cyan-400" />
            Gobierno Digital <span className="text-gray-600 font-medium">/</span> Smart Gov
          </h1>
          <p className="text-gray-400 mt-2">Trámites municipales, pagos de impuestos y participación ciudadana integrada a Smart City.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 bg-[#111112] border border-white/5 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('procedures')}
            className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'procedures' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <span className="hidden sm:inline">Trámites</span>
            <span className="sm:hidden"><FileText className="w-4 h-4" /></span>
          </button>
          <button 
            onClick={() => setActiveTab('payments')}
            className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'payments' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <span className="hidden sm:inline">Pagos Oficiales</span>
            <span className="sm:hidden"><CreditCard className="w-4 h-4" /></span>
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'reports' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <span className="hidden sm:inline">Reportes</span>
            <span className="sm:hidden"><AlertTriangle className="w-4 h-4" /></span>
          </button>
          <button 
            onClick={() => setActiveTab('integration')}
            className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'integration' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <span className="hidden sm:inline">Integración</span>
            <span className="sm:hidden"><Building className="w-4 h-4" /></span>
          </button>
        </div>
      </header>

      {activeTab === 'procedures' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div className="flex items-center gap-2 bg-[#111112] border border-white/5 rounded-lg px-3 py-2 w-full sm:w-80">
               <Search className="w-4 h-4 text-gray-500" />
               <input 
                 type="text" 
                 placeholder="Buscar trámite o folio..." 
                 className="bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-600 w-full"
               />
             </div>
             <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2">
               <Plus className="w-4 h-4" /> Nuevo Trámite
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_PROCEDURES.map(proc => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={proc.id}
                className="bg-[#111112] border border-white/5 rounded-2xl p-6 shadow-xl hover:border-white/10 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                    <FileText className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded border ${
                    proc.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    proc.status === 'in_progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-white/5 text-gray-400 border-white/10'
                  }`}>
                    {proc.status === 'completed' ? 'Completado' : proc.status === 'in_progress' ? 'En Revisión' : 'Pendiente'}
                  </span>
                </div>
                
                <h3 className="text-base font-bold text-white mb-1">{proc.name}</h3>
                <p className="text-xs text-cyan-400/80 mb-4">{proc.department}</p>
                
                <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Folio:</span>
                    <span className="font-mono text-gray-300">{proc.id}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Iniciado:</span>
                    <span className="text-gray-300">{proc.dateSubmitted}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Actualización:</span>
                    <span className="text-gray-300">{proc.lastUpdate}</span>
                  </div>
                </div>
                
                <button className="w-full mt-6 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-colors border border-white/10">
                  Ver Detalles
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
             <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
               <CreditCard className="w-4 h-4 text-cyan-400" /> Obligaciones y Pagos
             </h3>
             {MOCK_PAYMENTS.map(payment => (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 key={payment.id}
                 className="bg-[#111112] border border-white/5 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
               >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                      payment.status === 'paid' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                    }`}>
                      {payment.status === 'paid' ? <CheckCircle className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">{payment.description}</h4>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500 font-mono">{payment.id}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-400">Vence: {payment.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-3 md:gap-1">
                    <div className="text-right">
                      <p className="text-lg font-bold text-white flex items-center gap-1 justify-end">
                        {payment.amountRYC} <span className="text-[10px] text-amber-500">RYC</span>
                      </p>
                    </div>
                    {payment.status === 'paid' ? (
                      <span className="text-[10px] uppercase font-bold tracking-widest text-green-400 bg-green-500/10 px-2 py-1 rounded">
                        Pagado
                      </span>
                    ) : (
                      <button className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-cyan-500/20">
                        Pagar Ahora
                      </button>
                    )}
                  </div>
               </motion.div>
             ))}
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#111112] to-[#081515] border border-cyan-500/20 rounded-2xl p-6 shadow-xl">
               <h3 className="text-sm font-bold text-white mb-4">Integración ReyWallet</h3>
               <p className="text-xs text-gray-400 mb-6">Paga tus impuestos municipales y servicios con Reycoin. Los pagos se procesan vía contrato inteligente, garantizando transparencia y emitiendo un comprobante NFT inmutable.</p>
               <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-cyan-400 text-sm font-bold rounded-xl transition-colors border border-cyan-500/30 flex items-center justify-center gap-2">
                 Vincular ReyWallet <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
             <h3 className="text-sm font-bold text-white flex items-center gap-2">
               <AlertTriangle className="w-4 h-4 text-cyan-400" /> Reportes Ciudadanos
             </h3>
             <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2">
               <Camera className="w-4 h-4" /> Crear Reporte
             </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {MOCK_REPORTS.map(report => (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 key={report.id}
                 className="bg-[#111112] border border-white/5 rounded-2xl p-5 shadow-xl flex gap-4 hover:border-white/10 transition-colors"
               >
                 <div className="flex flex-col items-center gap-2">
                   <button className="w-10 h-10 rounded-lg bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-400 border border-white/10 text-gray-400 flex flex-col items-center justify-center transition-colors">
                     <span className="text-xs font-bold">{report.upvotes}</span>
                   </button>
                 </div>
                 <div className="flex-1">
                   <div className="flex justify-between items-start mb-1">
                     <h4 className="text-sm font-bold text-white">{report.type}</h4>
                     <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${
                        report.status === 'resolved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        report.status === 'assigned' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-white/5 text-gray-400 border-white/10'
                      }`}>
                        {report.status === 'resolved' ? 'Resuelto' : report.status === 'assigned' ? 'Asignado' : 'Abierto'}
                      </span>
                   </div>
                   <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                     <MapPin className="w-3 h-3" /> {report.location}
                   </p>
                   <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                     <span>{report.id}</span>
                     <span>•</span>
                     <span>{report.dateReported}</span>
                   </div>
                 </div>
               </motion.div>
             ))}
          </div>
        </div>
      )}

      {activeTab === 'integration' && (
        <div className="bg-[#111112] border border-white/5 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center text-center min-h-[500px] relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
           
           <Building className="w-16 h-16 text-cyan-400 mx-auto mb-6 relative z-10" />
           <h2 className="text-2xl font-bold text-white mb-4 relative z-10">Portal de Ayuntamientos</h2>
           <p className="text-gray-400 max-w-lg mx-auto mb-8 relative z-10 leading-relaxed">
             Este módulo está diseñado para que los gobiernos locales puedan ofrecer servicios digitales mediante la infraestructura de Reyplace, integrándose con Smart City y la Cúpula Digital.
           </p>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl relative z-10">
             <div className="bg-[#080809] border border-cyan-500/20 rounded-xl p-6 text-left">
               <ShieldCheck className="w-6 h-6 text-cyan-400 mb-3" />
               <h4 className="text-sm font-bold text-white mb-2">Cúpula Digital</h4>
               <p className="text-xs text-gray-500">Datos encriptados y permisos ciudadanos auditables.</p>
             </div>
             <div className="bg-[#080809] border border-cyan-500/20 rounded-xl p-6 text-left">
               <Building className="w-6 h-6 text-cyan-400 mb-3" />
               <h4 className="text-sm font-bold text-white mb-2">Smart City</h4>
               <p className="text-xs text-gray-500">Conexión con sensores urbanos y alertas cívicas.</p>
             </div>
           </div>
           
           <button className="mt-8 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all border border-white/10 relative z-10">
             Contactar a Ventas de Gobierno
           </button>
        </div>
      )}
    </div>
  );
}
