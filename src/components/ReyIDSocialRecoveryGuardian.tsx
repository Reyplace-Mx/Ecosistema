import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  RefreshCw, 
  ShieldAlert,
  Send,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export interface RecoveryGuardian {
  id: string;
  name: string;
  relationship: string;
  did: string;
  publicKey: string;
  status: 'active' | 'pending' | 'invited';
  addedDate: string;
  lastPing: string;
}

const INITIAL_GUARDIANS: RecoveryGuardian[] = [
  {
    id: 'g_1',
    name: 'Dispositivo Seguro de Respaldo (iPad Pro)',
    relationship: 'Hardware Enclave Secundario',
    did: 'did:rey:hardware:ipad-enclave-9912',
    publicKey: '0x88f912a7bc410291e0a8174f1b8219c0119284ba',
    status: 'active',
    addedDate: '15 Ene 2026',
    lastPing: 'Hace 2 horas',
  },
  {
    id: 'g_2',
    name: 'Sofia Mendoza (Socia Principal Reyplace)',
    relationship: 'Contacto de Confianza 1',
    did: 'did:rey:0x221c498018237461928374a10294829102938475',
    publicKey: '0x39c1045e994b6621029384756192837465019283',
    status: 'active',
    addedDate: '20 Ene 2026',
    lastPing: 'Ayer',
  },
  {
    id: 'g_3',
    name: 'Nodo Guardián Institucional (Cúpula Sentinel L3)',
    relationship: 'Enclave ZKP Institucional',
    did: 'did:rey:cupula:sentinel-guardian-losmochis',
    publicKey: '0x773d19c0a1029384756192837465019283746192',
    status: 'active',
    addedDate: '01 Feb 2026',
    lastPing: 'En línea',
  },
];

export function ReyIDSocialRecoveryGuardian() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [guardians, setGuardians] = useState<RecoveryGuardian[]>(INITIAL_GUARDIANS);
  const [threshold, setThreshold] = useState<number>(2); // 2 of 3
  const [isSimulatingRecovery, setIsSimulatingRecovery] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<number>(0);
  const [isAddGuardianOpen, setIsAddGuardianOpen] = useState(false);

  // New guardian form
  const [newName, setNewName] = useState('');
  const [newRel, setNewRel] = useState('');
  const [newDid, setNewDid] = useState('');

  const handleAddGuardian = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDid) {
      toast.error('Campos requeridos', 'Ingresa el nombre y DID del nuevo guardián.');
      return;
    }

    const newGuardian: RecoveryGuardian = {
      id: `g_${Date.now()}`,
      name: newName,
      relationship: newRel || 'Contacto de Confianza',
      did: newDid,
      publicKey: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      status: 'pending',
      addedDate: 'Hoy',
      lastPing: 'Esperando confirmación',
    };

    setGuardians([...guardians, newGuardian]);
    setIsAddGuardianOpen(false);
    setNewName('');
    setNewRel('');
    setNewDid('');
    toast.success('Invitación de Guardián Enviada', 'Se ha enviado un desafío criptográfico al DID indicado.');
  };

  const handleRemoveGuardian = (id: string) => {
    if (guardians.length <= 2) {
      toast.error('Mínimo Requerido', 'Debes mantener al menos 2 guardianes para el protocolo Shamir 2-de-X.');
      return;
    }
    setGuardians(guardians.filter(g => g.id !== id));
    toast.info('Guardián Removido', 'El esquema de fragmentos de clave ha sido recalculado.');
  };

  const handleSimulateRecovery = () => {
    setIsSimulatingRecovery(true);
    setRecoveryStep(1);

    setTimeout(() => {
      setRecoveryStep(2);
      setTimeout(() => {
        setRecoveryStep(3);
        setTimeout(() => {
          setRecoveryStep(4);
          setIsSimulatingRecovery(false);
          toast.success('¡Recuperación Social Completada!', 'Se obtuvieron 2 de 3 firmas de guardianes. Tu identidad ReyID fue restaurada exitosamente.');
        }, 1200);
      }, 1200);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#0d171f] via-[#09101d] to-[#0d171f] border border-cyan-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Recuperación Social & Guardianes de Confianza (Shamir Secret Sharing)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                UMBRAL 2-DE-3 ACTIVO
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Si pierdes tu teléfono o hardware Passkey, recupera tu cuenta mediante la aprobación criptográfica de tus guardianes, sin depender de SMS ni emails hackeables.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddGuardianOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Añadir Guardián</span>
        </button>
      </div>

      {/* Grid: Guardians List + Simulation Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Guardians List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 pb-1">
            <span className="font-bold uppercase">Tus Guardianes Designados ({guardians.length})</span>
            <span className="text-cyan-400 font-bold">Umbral requerido: {threshold} de {guardians.length}</span>
          </div>

          {guardians.map((guardian) => (
            <div
              key={guardian.id}
              className="p-4 rounded-2xl bg-[#0a0d14] border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">{guardian.name}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      {guardian.status === 'active' ? 'ACTIVO' : 'PENDIENTE'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">{guardian.relationship}</p>
                  <p className="text-[10px] font-mono text-cyan-400 truncate max-w-xs">{guardian.did}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                <div className="text-right text-[10px] font-mono text-gray-500 hidden sm:block">
                  <div>Añadido: {guardian.addedDate}</div>
                  <div className="text-emerald-400">{guardian.lastPing}</div>
                </div>

                <button
                  onClick={() => handleRemoveGuardian(guardian.id)}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs transition-colors cursor-pointer"
                  title="Remover guardián"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Social Recovery Simulator */}
        <div className="lg:col-span-5 bg-[#0a0d14] border border-cyan-500/30 rounded-3xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-[80px] pointer-events-none" />

          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Simulador de Rescate</div>
            <h3 className="text-base font-bold text-white mt-0.5">Protocolo de Recuperación de Emergencia</h3>
            <p className="text-xs text-gray-400 mt-1">
              Prueba la reconstrucción de tu clave privada ReyID como si hubieras perdido todo acceso físico.
            </p>
          </div>

          {/* Recovery steps progress */}
          <div className="space-y-3 bg-[#05070c] border border-white/10 rounded-2xl p-4 font-mono text-xs">
            <div className={`flex items-center gap-2.5 ${recoveryStep >= 1 ? 'text-cyan-300 font-bold' : 'text-gray-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${recoveryStep >= 1 ? 'bg-cyan-500 text-black border-cyan-400' : 'border-gray-600'}`}>1</span>
              <span>Emisión de Desafío ZKP de Rescate</span>
            </div>

            <div className={`flex items-center gap-2.5 ${recoveryStep >= 2 ? 'text-cyan-300 font-bold' : 'text-gray-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${recoveryStep >= 2 ? 'bg-cyan-500 text-black border-cyan-400' : 'border-gray-600'}`}>2</span>
              <span>Firma de Guardián 1 (iPad Pro Enclave)</span>
            </div>

            <div className={`flex items-center gap-2.5 ${recoveryStep >= 3 ? 'text-cyan-300 font-bold' : 'text-gray-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${recoveryStep >= 3 ? 'bg-cyan-500 text-black border-cyan-400' : 'border-gray-600'}`}>3</span>
              <span>Firma de Guardián 2 (Sofia Mendoza)</span>
            </div>

            <div className={`flex items-center gap-2.5 ${recoveryStep >= 4 ? 'text-emerald-300 font-bold' : 'text-gray-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${recoveryStep >= 4 ? 'bg-emerald-500 text-black border-emerald-400' : 'border-gray-600'}`}>4</span>
              <span>Reconstrucción Polinómica de Shamir (2/3)</span>
            </div>
          </div>

          <button
            onClick={handleSimulateRecovery}
            disabled={isSimulatingRecovery}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isSimulatingRecovery ? 'animate-spin' : 'text-black'}`} />
            <span>{isSimulatingRecovery ? 'Ejecutando Recuperación Shamir...' : 'Simular Rescate de Cuenta'}</span>
          </button>
        </div>
      </div>

      {/* Add Guardian Modal */}
      <AnimatePresence>
        {isAddGuardianOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0e17] border border-cyan-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Añadir Guardián de Rescate</h3>
                </div>
                <button onClick={() => setIsAddGuardianOpen(false)} className="text-gray-400 hover:text-white font-mono">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddGuardian} className="space-y-3.5">
                <div>
                  <label className="text-xs font-mono text-gray-300 mb-1 block">Nombre / Alias del Guardián</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ej. Roberto Valenzuela (Abogado de Confianza)"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-gray-300 mb-1 block">Relación / Tipo de Guardián</label>
                  <input
                    type="text"
                    value={newRel}
                    onChange={(e) => setNewRel(e.target.value)}
                    placeholder="Ej. Familiar / Dispositivo Frío"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-gray-300 mb-1 block">DID o Clave Pública del Guardián</label>
                  <input
                    type="text"
                    value={newDid}
                    onChange={(e) => setNewDid(e.target.value)}
                    placeholder="did:rey:0x..."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 outline-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddGuardianOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-mono"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold"
                  >
                    Registrar Guardián
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
