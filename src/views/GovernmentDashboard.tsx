import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Camera,
  Fingerprint,
  Key,
  Lock,
  Send,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import type { GovProcedure, GovPayment, GovReport } from '../types';
import { LocalInitiativesMap } from '../components/LocalInitiativesMap';
import { IssueReportModal } from '../components/IssueReportModal';

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
  const [activeTab, setActiveTab] = useState<'initiatives' | 'procedures' | 'payments' | 'reports' | 'integration'>('initiatives');
  
  // New procedure modal and tracking state
  const [showNewProcModal, setShowNewProcModal] = useState(false);
  const [selectedProcType, setSelectedProcType] = useState('Renovación Licencia Comercial');
  const [procApplicant, setProcApplicant] = useState('');
  const [proceduresList, setProceduresList] = useState<GovProcedure[]>(MOCK_PROCEDURES);
  
  // ReyID Signing Modal State
  const [showSignModal, setShowSignModal] = useState(false);
  const [signingProcId, setSigningProcId] = useState<string | null>(null);
  const [reyIdPin, setReyIdPin] = useState('');
  const [signingStatus, setSigningStatus] = useState<'idle' | 'signing' | 'success'>('idle');

  // Selected Procedure for tracking / details
  const [activeTrackingProc, setActiveTrackingProc] = useState<GovProcedure | null>(MOCK_PROCEDURES[0]);

  // Citizen Reports & Camera Modal State
  const [reportsList, setReportsList] = useState<GovReport[]>(MOCK_REPORTS);
  const [showIssueReportModal, setShowIssueReportModal] = useState(false);

  const handleCreateProcedure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!procApplicant) return;
    const newId = `TRM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newProc: GovProcedure = {
      id: newId,
      name: selectedProcType,
      department: selectedProcType.includes('Licencia') ? 'Desarrollo Económico' : selectedProcType.includes('Construcción') ? 'Obras Públicas' : 'Tránsito Municipal',
      status: 'pending',
      dateSubmitted: 'Justo ahora',
      lastUpdate: 'Recién creado'
    };
    setProceduresList([newProc, ...proceduresList]);
    setActiveTrackingProc(newProc);
    setProcApplicant('');
    setShowNewProcModal(false);
  };

  const handleSignWithReyID = (e: React.FormEvent) => {
    e.preventDefault();
    if (reyIdPin.length < 4) return;
    setSigningStatus('signing');
    setTimeout(() => {
      setSigningStatus('success');
      setTimeout(() => {
        if (signingProcId) {
          setProceduresList(prev => prev.map(p => p.id === signingProcId ? { ...p, status: 'in_progress', lastUpdate: 'Firmado con ReyID' } : p));
        }
        setShowSignModal(false);
        setSigningStatus('idle');
        setReyIdPin('');
      }, 1200);
    }, 1500);
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col overflow-y-auto animate-fade-in">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-500 dark:from-cyan-400 dark:to-blue-300 tracking-tight flex items-center gap-3">
            <Landmark className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
            Gobierno Digital <span className="text-slate-400 dark:text-gray-600 font-medium text-2xl">/ Smart Gov</span>
          </h1>
          <p className="text-slate-500 dark:text-gray-400 mt-2 font-medium">Trámites municipales, pagos de impuestos y firma digital con ReyID integrados.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-xl p-1.5 shadow-sm">
          <button 
            onClick={() => setActiveTab('initiatives')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${activeTab === 'initiatives' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'}`}
          >
            Mapa Obras Públicas
          </button>
          <button 
            onClick={() => setActiveTab('procedures')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${activeTab === 'procedures' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'}`}
          >
            Digital Trámites
          </button>
          <button 
            onClick={() => setActiveTab('payments')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${activeTab === 'payments' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'}`}
          >
            Pagos Oficiales
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${activeTab === 'reports' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'}`}
          >
            Reportes
          </button>
          <button 
            onClick={() => setActiveTab('integration')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${activeTab === 'integration' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'}`}
          >
            Portal Ayuntamiento
          </button>
        </div>
      </header>

      {activeTab === 'initiatives' && (
        <LocalInitiativesMap />
      )}

      {activeTab === 'procedures' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div className="flex items-center gap-2 bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 w-full sm:w-80 shadow-sm">
                 <Search className="w-4 h-4 text-slate-400 dark:text-gray-500" />
                 <input 
                   type="text" 
                   placeholder="Buscar trámite o folio..." 
                   className="bg-transparent border-none outline-none text-sm text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-600 w-full"
                 />
               </div>
               <button 
                 onClick={() => setShowNewProcModal(true)}
                 className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
               >
                 <Plus className="w-4 h-4" /> Iniciar Nuevo Trámite
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proceduresList.map(proc => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={proc.id}
                  onClick={() => setActiveTrackingProc(proc)}
                  className={`bg-white dark:bg-[#111112] border rounded-2xl p-6 shadow-sm cursor-pointer transition-all ${activeTrackingProc?.id === proc.id ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center border border-cyan-200 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full ${
                      proc.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                      proc.status === 'in_progress' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                      'bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-gray-400'
                    }`}>
                      {proc.status === 'completed' ? 'Completado' : proc.status === 'in_progress' ? 'En Revisión' : 'Pendiente Firma'}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{proc.name}</h3>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400 mb-4 font-medium">{proc.department}</p>
                  
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Folio:</span>
                      <span className="font-mono text-slate-800 dark:text-gray-200 font-bold">{proc.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Actualización:</span>
                      <span className="text-slate-700 dark:text-gray-300">{proc.lastUpdate}</span>
                    </div>
                  </div>

                  {proc.status === 'pending' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSigningProcId(proc.id); setShowSignModal(true); }}
                      className="w-full mt-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20"
                    >
                      <Fingerprint className="w-4 h-4" /> Firmar Documento con ReyID
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tracking & Progress Stepper Sidebar */}
          <div className="lg:col-span-4 bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs uppercase font-bold tracking-widest text-slate-500 dark:text-gray-400">Seguimiento de Solicitud</h3>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">{activeTrackingProc?.id}</span>
              </div>
              
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">{activeTrackingProc?.name}</h4>
              <p className="text-xs text-slate-500 dark:text-gray-400 mb-6">{activeTrackingProc?.department}</p>

              {/* Stepper */}
              <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-white/10">
                <div className="flex items-start gap-4 relative">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 z-10 text-xs font-bold shadow-md shadow-emerald-500/30">✓</div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">1. Solicitud Enviada</h5>
                    <p className="text-[10px] text-slate-500 dark:text-gray-400">Recibido en sistema municipal digital.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 text-xs font-bold ${
                    activeTrackingProc?.status !== 'pending' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-cyan-500 text-white animate-pulse'
                  }`}>
                    {activeTrackingProc?.status !== 'pending' ? '✓' : '2'}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">2. Firma Criptográfica ReyID</h5>
                    <p className="text-[10px] text-slate-500 dark:text-gray-400">Validación biométrica y sello notarial blockchain.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 text-xs font-bold ${
                    activeTrackingProc?.status === 'completed' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-gray-400'
                  }`}>
                    3
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">3. Aprobación & Emisión de Permiso</h5>
                    <p className="text-[10px] text-slate-500 dark:text-gray-400">Descarga de documento oficial con código QR.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5">
              <button 
                onClick={() => { setSigningProcId(activeTrackingProc?.id || ''); setShowSignModal(true); }}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Key className="w-4 h-4" /> Firmar Expediente Digital
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
             <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
               <CreditCard className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Obligaciones y Pagos Municipales
             </h3>
             {MOCK_PAYMENTS.map(payment => (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 key={payment.id}
                 className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
               >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                      payment.status === 'paid' ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400'
                    }`}>
                      {payment.status === 'paid' ? <CheckCircle className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{payment.description}</h4>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500 dark:text-gray-500 font-mono">{payment.id}</span>
                        <span className="text-slate-300 dark:text-gray-700">•</span>
                        <span className="text-slate-500 dark:text-gray-400">Vence: {payment.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-3 md:gap-1">
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1 justify-end">
                        {payment.amountRYC} <span className="text-[10px] text-amber-500 font-bold">RYC</span>
                      </p>
                    </div>
                    {payment.status === 'paid' ? (
                      <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-500/20">
                        Pagado
                      </span>
                    ) : (
                      <button onClick={() => alert(`Pago procesado con éxito para ${payment.description}`)} className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-cyan-500/20">
                        Pagar con Reycoin
                      </button>
                    )}
                  </div>
               </motion.div>
             ))}
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white dark:from-[#111112] to-cyan-50 dark:to-[#081515] border border-cyan-200 dark:border-cyan-500/20 rounded-3xl p-6 shadow-sm">
               <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Integración ReyWallet</h3>
               <p className="text-xs text-slate-600 dark:text-gray-400 mb-6 leading-relaxed">Paga tus impuestos municipales y servicios con Reycoin. Los pagos se procesan vía contrato inteligente, emitiendo un comprobante NFT inmutable.</p>
               <button className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2">
                 Vincular ReyWallet <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
             <div>
               <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <AlertTriangle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Reportes Ciudadanos de Infraestructura
               </h3>
               <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                 Captura imágenes con tu cámara e IA Gemini Vision para clasificar automáticamente incidencias urbanas.
               </p>
             </div>
             <button 
               onClick={() => setShowIssueReportModal(true)}
               className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
             >
               <Camera className="w-4 h-4" /> Crear Reporte con Cámara / Gemini
             </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {reportsList.map(report => (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 key={report.id}
                 className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm flex gap-4"
               >
                 <div className="flex flex-col items-center gap-2">
                   <button 
                     onClick={() => {
                       setReportsList(prev => prev.map(r => r.id === report.id ? { ...r, upvotes: r.upvotes + 1 } : r));
                     }}
                     title="Apoyar este reporte"
                     className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-cyan-50 dark:hover:bg-cyan-500/20 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 flex flex-col items-center justify-center transition-colors cursor-pointer"
                   >
                     <span className="text-xs font-bold">👍 {report.upvotes}</span>
                   </button>
                 </div>
                 <div className="flex-1">
                   <div className="flex justify-between items-start mb-1">
                     <h4 className="text-sm font-bold text-slate-900 dark:text-white">{report.type}</h4>
                     <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${
                        report.status === 'resolved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' :
                        report.status === 'assigned' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' :
                        'bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-gray-400 border-slate-200 dark:border-white/10'
                      }`}>
                       {report.status === 'resolved' ? 'Resuelto' : report.status === 'assigned' ? 'Asignado' : 'Abierto'}
                     </span>
                   </div>
                   <p className="text-xs text-slate-500 dark:text-gray-400 flex items-center gap-1 mb-2">
                     <MapPin className="w-3 h-3 text-cyan-400" /> {report.location}
                   </p>
                   <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-gray-500 font-mono">
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
        <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl shadow-sm p-8 flex flex-col items-center justify-center text-center min-h-[500px] relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
           
           <Building className="w-16 h-16 text-cyan-600 dark:text-cyan-400 mx-auto mb-6 relative z-10" />
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 relative z-10">Portal de Ayuntamientos</h2>
           <p className="text-slate-500 dark:text-gray-400 max-w-lg mx-auto mb-8 relative z-10 leading-relaxed">
             Este módulo está diseñado para que los gobiernos locales puedan ofrecer servicios digitales mediante la infraestructura de Reyplace, integrándose con Smart City y la Cúpula Digital.
           </p>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl relative z-10">
             <div className="bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-cyan-500/20 rounded-2xl p-6 text-left">
               <ShieldCheck className="w-6 h-6 text-cyan-600 dark:text-cyan-400 mb-3" />
               <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Cúpula Digital</h4>
               <p className="text-xs text-slate-500 dark:text-gray-500">Datos encriptados y permisos ciudadanos auditables.</p>
             </div>
             <div className="bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-cyan-500/20 rounded-2xl p-6 text-left">
               <Building className="w-6 h-6 text-cyan-600 dark:text-cyan-400 mb-3" />
               <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Smart City</h4>
               <p className="text-xs text-slate-500 dark:text-gray-500">Conexión con sensores urbanos y alertas cívicas.</p>
             </div>
           </div>
           
           <button className="mt-8 px-6 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-white/10 relative z-10">
             Contactar a Ventas de Gobierno
           </button>
        </div>
      )}

      {/* Modal Nuevo Trámite */}
      {showNewProcModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative">
            <button onClick={() => setShowNewProcModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white font-bold">✕</button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Iniciar Nuevo Trámite Digital</h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mb-6">Selecciona el servicio y proporciona tus datos de solicitante para iniciar.</p>

            <form onSubmit={handleCreateProcedure} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">Tipo de Trámite</label>
                <select value={selectedProcType} onChange={e => setSelectedProcType(e.target.value)} className="w-full bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-gray-200 outline-none">
                  <option value="Renovación Licencia Comercial">Renovación Licencia Comercial</option>
                  <option value="Permiso de Construcción Menor">Permiso de Construcción Menor</option>
                  <option value="Alta vehicular municipal">Alta vehicular municipal</option>
                  <option value="Constancia de Residencia">Constancia de Residencia</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">Nombre del Solicitante / Empresa</label>
                <input type="text" value={procApplicant} onChange={e => setProcApplicant(e.target.value)} placeholder="Ej. Juan Pérez / Empresa S.A." required className="w-full bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-gray-200 outline-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowNewProcModal(false)} className="flex-1 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl font-bold text-xs text-slate-700 dark:text-white transition">Cancelar</button>
                <button type="submit" className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-xs transition shadow-md shadow-cyan-500/20">Iniciar Trámite</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Firma Digital ReyID */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111112] border border-purple-500/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative text-center">
            <button onClick={() => setShowSignModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white font-bold">✕</button>
            <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto mb-4 text-purple-600 dark:text-purple-400">
              <Fingerprint className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Firma Biométrica ReyID</h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mb-6">Ingresa tu PIN de seguridad ReyID para sellar criptográficamente el expediente <span className="font-mono text-cyan-600 dark:text-cyan-400">{signingProcId}</span>.</p>

            {signingStatus === 'idle' && (
              <form onSubmit={handleSignWithReyID} className="space-y-4">
                <input 
                  type="password" 
                  maxLength={6} 
                  value={reyIdPin} 
                  onChange={e => setReyIdPin(e.target.value)} 
                  placeholder="••••" 
                  required
                  className="w-40 mx-auto text-center tracking-[1em] font-mono text-2xl bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/10 rounded-xl py-3 text-slate-900 dark:text-white outline-none focus:border-purple-500" 
                />
                <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs transition shadow-lg shadow-purple-500/20">
                  Confirmar Firma Criptográfica
                </button>
              </form>
            )}

            {signingStatus === 'signing' && (
              <div className="py-8 space-y-4">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-slate-400">Generando prueba de conocimiento cero y sello blockchain...</p>
              </div>
            )}

            {signingStatus === 'success' && (
              <div className="py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">✓</div>
                <h4 className="text-sm font-bold text-white">¡Documento Firmado con Éxito!</h4>
                <p className="text-[10px] text-slate-400">Hash: <span className="font-mono text-cyan-400">0x7F9B...42E1</span></p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Modal Reporte de Incidencia con Cámara y Gemini Vision */}
      <IssueReportModal
        isOpen={showIssueReportModal}
        onClose={() => setShowIssueReportModal(false)}
        onReportCreated={(newReport) => setReportsList([newReport, ...reportsList])}
      />
    </div>
  );
}
