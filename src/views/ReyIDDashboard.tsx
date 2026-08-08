import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Fingerprint, 
  Wallet, 
  Key, 
  CheckCircle, 
  Link as LinkIcon, 
  AlertTriangle, 
  Hash, 
  ShieldCheck, 
  Database, 
  Network,
  UserCheck,
  UserPlus,
  LogIn,
  LogOut,
  Sparkles,
  Lock,
  Mail,
  User,
  AtSign,
  FileSignature,
  Send,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { loginSchema, signupSchema, web3SignatureSchema, LoginFormData, SignupFormData, Web3SignatureFormData } from '../lib/validations';
import type { SignatureLog } from '../types';

const INITIAL_LOGS: SignatureLog[] = [
  { id: 'sig_1', action: 'Contrato de Arrendamiento', module: 'Smart City', timestamp: 'Hace 2 horas', status: 'confirmed', txHash: '0x8f...1c4' },
  { id: 'sig_2', action: 'Acceso Cúpula Nivel 3', module: 'Seguridad', timestamp: 'Hace 5 horas', status: 'confirmed', txHash: '0x2a...9b1' },
  { id: 'sig_3', action: 'Transferencia Reycoin', module: 'Economía', timestamp: 'Ayer', status: 'confirmed', txHash: '0x99...4d2' },
  { id: 'sig_4', action: 'Votación Gobernanza', module: 'Web3', timestamp: 'Hace 2 días', status: 'failed', txHash: '0x1c...7f0' },
];

export function ReyIDDashboard() {
  const { user, isLoggedIn, login, signup, logout } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'auth' | 'sign'>('profile');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Logs state
  const [signatureLogs, setSignatureLogs] = useState<SignatureLog[]>(INITIAL_LOGS);

  // Form State - Login
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [loginErrors, setLoginErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Form State - Signup
  const [signupData, setSignupData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    handle: '',
    password: '',
    confirmPassword: '',
  });
  const [signupErrors, setSignupErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});
  const [isSubmittingSignup, setIsSubmittingSignup] = useState(false);

  // Form State - Web3 Signature
  const [signData, setSignData] = useState<Web3SignatureFormData>({
    messageToSign: '',
    network: 'REYCHAIN_L2',
  });
  const [signErrors, setSignErrors] = useState<Partial<Record<keyof Web3SignatureFormData, string>>>({});
  const [isSigning, setIsSigning] = useState(false);

  // Validation functions with Zod
  const validateLoginField = (field: keyof LoginFormData, value: string) => {
    const updatedData = { ...loginData, [field]: value };
    const result = loginSchema.safeParse(updatedData);
    if (!result.success) {
      const fieldError = result.error.issues.find((err) => err.path[0] === field);
      setLoginErrors((prev) => ({ ...prev, [field]: fieldError ? fieldError.message : undefined }));
    } else {
      setLoginErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateSignupField = (field: keyof SignupFormData, value: string) => {
    const updatedData = { ...signupData, [field]: value };
    const result = signupSchema.safeParse(updatedData);
    if (!result.success) {
      const fieldError = result.error.issues.find((err) => err.path[0] === field);
      setSignupErrors((prev) => ({ ...prev, [field]: fieldError ? fieldError.message : undefined }));
    } else {
      setSignupErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse(loginData);

    if (!result.success) {
      const formattedErrors: Partial<Record<keyof LoginFormData, string>> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          formattedErrors[err.path[0] as keyof LoginFormData] = err.message;
        }
      });
      setLoginErrors(formattedErrors);
      toast.error('Error de Validación', 'Revise los campos del formulario de inicio de sesión.');
      return;
    }

    setIsSubmittingLogin(true);
    try {
      await login(result.data.email);
      toast.success('Sesión Iniciada', `Bienvenido al ecosistema Reyplace.`);
      setLoginData({ email: '', password: '' });
      setLoginErrors({});
      setActiveTab('profile');
    } catch {
      toast.error('Error de Autenticación', 'No se pudo iniciar sesión con Firebase Auth.');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = signupSchema.safeParse(signupData);

    if (!result.success) {
      const formattedErrors: Partial<Record<keyof SignupFormData, string>> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          formattedErrors[err.path[0] as keyof SignupFormData] = err.message;
        }
      });
      setSignupErrors(formattedErrors);
      toast.error('Error de Validación Zod', 'Complete correctamente los campos de registro.');
      return;
    }

    setIsSubmittingSignup(true);
    try {
      await signup(result.data.email, result.data.fullName, result.data.handle);
      toast.success('Cuenta Registrada', `Tu ReyID y DID han sido generados con éxito.`);
      setSignupData({ fullName: '', email: '', handle: '', password: '', confirmPassword: '' });
      setSignupErrors({});
      setActiveTab('profile');
    } catch {
      toast.error('Error de Registro', 'No se pudo completar el registro en Firebase Auth.');
    } finally {
      setIsSubmittingSignup(false);
    }
  };

  const handleSignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = web3SignatureSchema.safeParse(signData);

    if (!result.success) {
      const formattedErrors: Partial<Record<keyof Web3SignatureFormData, string>> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          formattedErrors[err.path[0] as keyof Web3SignatureFormData] = err.message;
        }
      });
      setSignErrors(formattedErrors);
      toast.error('Error de Validación', 'Mensaje demasiado corto para firma criptográfica.');
      return;
    }

    setIsSigning(true);
    await new Promise((res) => setTimeout(res, 800));

    const randomHash = `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`;
    const newLog: SignatureLog = {
      id: `sig_${Date.now()}`,
      action: result.data.messageToSign,
      module: 'Firma ReyID',
      timestamp: 'Ahora mismo',
      status: 'confirmed',
      txHash: randomHash,
    };

    setSignatureLogs((prev) => [newLog, ...prev]);
    toast.success('Mensaje Criptográfico Firmado', `Hash asignado: ${randomHash}`);
    setSignData({ messageToSign: '', network: 'REYCHAIN_L2' });
    setSignErrors({});
    setIsSigning(false);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
            <Fingerprint className="w-8 h-8 text-cyan-400" />
            ReyID <span className="text-gray-600 font-medium">/</span> Centro de Identidad
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Gestiona tu identidad descentralizada, autenticación con Firebase & Zod, y firmas en Cúpula Digital.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-xl text-xs text-cyan-400 font-mono">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              Sesión Activa: {user?.handle}
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl text-xs text-amber-400 font-mono">
              <AlertCircle className="w-4 h-4" />
              Sin Iniciar Sesión
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-xs font-mono">
            <ShieldCheck className="w-4 h-4" />
            Cúpula Activa
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-cyan-600 text-black shadow-lg shadow-cyan-500/20'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Fingerprint className="w-4 h-4" />
          Identidad & Wallet
        </button>

        <button
          onClick={() => setActiveTab('auth')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'auth'
              ? 'bg-cyan-600 text-black shadow-lg shadow-cyan-500/20'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <LogIn className="w-4 h-4" />
          Autenticación & Zod Validation
        </button>

        <button
          onClick={() => setActiveTab('sign')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'sign'
              ? 'bg-cyan-600 text-black shadow-lg shadow-cyan-500/20'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <FileSignature className="w-4 h-4" />
          Firmador Web3
        </button>
      </div>

      {/* Tab Content 1: Profile & Wallet */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: ID Card & Wallet */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Identity Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-2xl bg-[#111112] border border-cyan-500/20 shadow-xl group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-50 pointer-events-none"></div>
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full group-hover:bg-cyan-500/20 transition-all duration-700 pointer-events-none"></div>
              
              <div className="relative p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-900/40 to-blue-800/40 border border-cyan-500/30 flex items-center justify-center text-xl font-bold text-cyan-400 shadow-lg overflow-hidden relative font-mono">
                    {user?.name ? user.name.substring(0, 2).toUpperCase() : 'GT'}
                  </div>
                  {user?.kycStatus === 'verified' && (
                    <div className="flex items-center gap-1.5 bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold tracking-widest border border-cyan-500/20">
                      <CheckCircle className="w-3.5 h-3.5" />
                      KYC Verificado
                    </div>
                  )}
                </div>

                <div className="space-y-1 mb-6">
                  <h2 className="text-xl font-bold text-white">{user?.name || 'Invitado Global'}</h2>
                  <p className="text-cyan-400 text-xs font-mono tracking-widest uppercase">{user?.handle || '@invitado'}</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#080809] rounded-xl p-3 border border-white/5">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Network className="w-3 h-3 text-cyan-400" /> DID (Identificador Descentralizado)
                    </div>
                    <div className="font-mono text-xs text-gray-300 break-all">{user?.did || 'did:rey:0x7aF982...b3A1'}</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Rol Ecosistema</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-300">
                        {user?.role || 'Pro Business'}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-gray-300">
                        Cúpula L3
                      </span>
                    </div>
                  </div>

                  {isLoggedIn && (
                    <button
                      onClick={() => {
                        logout();
                        toast.info('Sesión Cerrada', 'Has cerrado sesión correctamente.');
                      }}
                      className="w-full mt-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Cerrar Sesión Activa
                    </button>
                  )}
                </div>
              </div>
              
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50"></div>
            </motion.div>

            {/* Reycoin Wallet Summary */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl p-6 relative overflow-hidden shadow-lg text-white"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Wallet className="w-32 h-32" />
              </div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2 text-white/80">
                  <Wallet className="w-4 h-4" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">Wallet ReyCoin</span>
                </div>
                <div className="text-3xl font-bold mb-6 font-mono">
                  {(user?.reycoinBalance ?? 12450).toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-lg opacity-80 font-normal">RYC</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2 text-xs text-white/70">
                      <LinkIcon className="w-4 h-4" /> Dirección Web3
                    </div>
                    <div className="font-mono text-xs">{user?.walletAddress || '0x7aF982...3b9'}</div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toast.success('Dirección Copiada', 'Dirección Web3 copiada al portapapeles.')}
                      className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Recibir RYC
                    </button>
                    <button 
                      onClick={() => toast.info('Transferencia', 'Abriendo el módulo de envío en Reycoin Dashboard.')}
                      className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Enviar RYC
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Security & Activity */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#111112] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cúpula Digital</div>
                    <div className="text-sm text-white font-medium">Cifrado AES-256</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2 font-mono">Aislamiento Zero-Trust</div>
              </div>

              <div className="bg-[#111112] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Firebase Auth</div>
                    <div className="text-sm text-green-400 font-medium">Sincronizado</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2 font-mono">Persistencia Global</div>
              </div>

              <div className="bg-[#111112] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Validación Zod</div>
                    <div className="text-sm text-white font-medium">Esquemas Activos</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2 font-mono">Feedback Inmediato</div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-[#111112] border border-white/5 rounded-2xl overflow-hidden flex flex-col min-h-[400px]">
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-xs uppercase font-bold tracking-widest text-gray-400">Activity Log & Audit Trail</h3>
                <span className="text-xs font-mono text-cyan-400">{signatureLogs.length} Transacciones</span>
              </div>
              
              <div className="p-0 overflow-y-auto flex-1 bg-[#111112]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Acción Firmada</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Módulo</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Hash (Tx)</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {signatureLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="font-mono text-[11px] text-gray-300 group-hover:text-cyan-400 transition-colors">{log.action}</div>
                          <div className="text-[10px] font-mono text-gray-600 mt-0.5">{log.timestamp}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-white/5">
                            {log.module}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 font-mono text-xs text-gray-500 group-hover:text-cyan-400 transition-colors">
                            <Hash className="w-3 h-3" />
                            {log.txHash}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {log.status === 'confirmed' && (
                            <div className="flex items-center gap-1.5 text-green-500 text-xs font-mono">
                              <CheckCircle className="w-3.5 h-3.5" /> <span>[CONFIRMED]</span>
                            </div>
                          )}
                          {log.status === 'failed' && (
                            <div className="flex items-center gap-1.5 text-red-500 text-xs font-mono">
                              <AlertTriangle className="w-3.5 h-3.5" /> <span>[FAILED]</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab Content 2: Auth Forms with Zod Validation & Firebase state */}
      {activeTab === 'auth' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-[#111112] border border-cyan-500/20 rounded-2xl p-6 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-cyan-600 text-black'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <LogIn className="w-4 h-4" /> Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-cyan-600 text-black'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-4 h-4" /> Crear Cuenta
                </button>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-lg">
                <Sparkles className="w-3 h-3" /> Zod Validations Enabled
              </div>
            </div>

            {/* LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Correo Electrónico / DID / Handle
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="usuario@ejemplo.com o @vanguard"
                      value={loginData.email}
                      onChange={(e) => {
                        setLoginData({ ...loginData, email: e.target.value });
                        validateLoginField('email', e.target.value);
                      }}
                      className={`w-full bg-[#080809] border ${
                        loginErrors.email ? 'border-rose-500 text-rose-300' : 'border-white/10 text-white focus:border-cyan-500'
                      } rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono transition-colors outline-none`}
                    />
                  </div>
                  {loginErrors.email && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {loginErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => {
                        setLoginData({ ...loginData, password: e.target.value });
                        validateLoginField('password', e.target.value);
                      }}
                      className={`w-full bg-[#080809] border ${
                        loginErrors.password ? 'border-rose-500 text-rose-300' : 'border-white/10 text-white focus:border-cyan-500'
                      } rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono transition-colors outline-none`}
                    />
                  </div>
                  {loginErrors.password && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {loginErrors.password}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingLogin}
                    className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingLogin ? (
                      <span className="animate-pulse">Validando credenciales Zod...</span>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" /> Iniciar Sesión en Reyplace
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* SIGNUP FORM */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                      Nombre Completo
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Ej: Elena Rostova"
                        value={signupData.fullName}
                        onChange={(e) => {
                          setSignupData({ ...signupData, fullName: e.target.value });
                          validateSignupField('fullName', e.target.value);
                        }}
                        className={`w-full bg-[#080809] border ${
                          signupErrors.fullName ? 'border-rose-500 text-rose-300' : 'border-white/10 text-white focus:border-cyan-500'
                        } rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono transition-colors outline-none`}
                      />
                    </div>
                    {signupErrors.fullName && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {signupErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                      Alias ReyID (@handle)
                    </label>
                    <div className="relative">
                      <AtSign className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="elena_tech"
                        value={signupData.handle}
                        onChange={(e) => {
                          setSignupData({ ...signupData, handle: e.target.value });
                          validateSignupField('handle', e.target.value);
                        }}
                        className={`w-full bg-[#080809] border ${
                          signupErrors.handle ? 'border-rose-500 text-rose-300' : 'border-white/10 text-white focus:border-cyan-500'
                        } rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono transition-colors outline-none`}
                      />
                    </div>
                    {signupErrors.handle && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {signupErrors.handle}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="elena@empresa.com"
                      value={signupData.email}
                      onChange={(e) => {
                        setSignupData({ ...signupData, email: e.target.value });
                        validateSignupField('email', e.target.value);
                      }}
                      className={`w-full bg-[#080809] border ${
                        signupErrors.email ? 'border-rose-500 text-rose-300' : 'border-white/10 text-white focus:border-cyan-500'
                      } rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono transition-colors outline-none`}
                    />
                  </div>
                  {signupErrors.email && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {signupErrors.email}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                      Contraseña (Mínimo 8 caracteres)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={signupData.password}
                        onChange={(e) => {
                          setSignupData({ ...signupData, password: e.target.value });
                          validateSignupField('password', e.target.value);
                        }}
                        className={`w-full bg-[#080809] border ${
                          signupErrors.password ? 'border-rose-500 text-rose-300' : 'border-white/10 text-white focus:border-cyan-500'
                        } rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono transition-colors outline-none`}
                      />
                    </div>
                    {signupErrors.password && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {signupErrors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                      Confirmar Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={signupData.confirmPassword}
                        onChange={(e) => {
                          setSignupData({ ...signupData, confirmPassword: e.target.value });
                          validateSignupField('confirmPassword', e.target.value);
                        }}
                        className={`w-full bg-[#080809] border ${
                          signupErrors.confirmPassword ? 'border-rose-500 text-rose-300' : 'border-white/10 text-white focus:border-cyan-500'
                        } rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono transition-colors outline-none`}
                      />
                    </div>
                    {signupErrors.confirmPassword && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {signupErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingSignup}
                    className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingSignup ? (
                      <span className="animate-pulse">Generando ReyID Criptográfico...</span>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" /> Registrar Cuenta y Asignar DID
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Tab Content 3: Web3 Signer */}
      {activeTab === 'sign' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-[#111112] border border-cyan-500/20 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-cyan-400" /> Firmador Digital Cúpula
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Genera una firma criptográfica verificable con tu llave privada de ReyID para autorizaciones en el ecosistema.
            </p>

            <form onSubmit={handleSignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Red Blockchain de Destino
                </label>
                <select
                  value={signData.network}
                  onChange={(e) => setSignData({ ...signData, network: e.target.value as any })}
                  className="w-full bg-[#080809] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none focus:border-cyan-500"
                >
                  <option value="REYCHAIN_L2">ReyChain L2 (Optimized Gas)</option>
                  <option value="ETH_MAINNET">Ethereum Mainnet</option>
                  <option value="POLYGON">Polygon POS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Mensaje o Acción a Firmar
                </label>
                <textarea
                  rows={4}
                  placeholder="Ej: Aprobación de contrato inteligente #9021 o autorización de pago en Escrow."
                  value={signData.messageToSign}
                  onChange={(e) => setSignData({ ...signData, messageToSign: e.target.value })}
                  className={`w-full bg-[#080809] border ${
                    signErrors.messageToSign ? 'border-rose-500 text-rose-300' : 'border-white/10 text-white focus:border-cyan-500'
                  } rounded-xl p-4 text-xs font-mono outline-none resize-none`}
                />
                {signErrors.messageToSign && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {signErrors.messageToSign}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSigning}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSigning ? (
                  <span className="animate-pulse">Firmando con Cúpula Digital...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Generar Firma Criptográfica
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
