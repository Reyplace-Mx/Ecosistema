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
  AlertCircle,
  Scan,
  Smartphone,
  Laptop,
  KeyRound,
  Plus,
  Trash2,
  Cpu,
  CheckCircle2,
  RefreshCw,
  Settings,
  Radio,
  Layers,
  ShieldAlert,
  X,
  Activity,
  Check,
  ScanFace
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LivenessModal } from '../components/LivenessModal';
import { BiometricPanel } from '../components/BiometricPanel';
import { EmergencyAlertsWidget } from '../components/EmergencyAlertsWidget';
import { BiometricConfigSection } from '../components/BiometricConfigSection';
import { loginSchema, signupSchema, web3SignatureSchema, LoginFormData, SignupFormData, Web3SignatureFormData } from '../lib/validations';
import type { SignatureLog, WebAuthnDevice, SupabaseSyncState } from '../types';
import { SupabaseSyncIndicator } from '../components/SupabaseSyncIndicator';

const INITIAL_LOGS: SignatureLog[] = [
  { id: 'sig_1', action: 'Contrato de Arrendamiento', module: 'Smart City', timestamp: 'Hace 2 horas', status: 'confirmed', txHash: '0x8f...1c4' },
  { id: 'sig_2', action: 'Acceso Cúpula Nivel 3', module: 'Seguridad', timestamp: 'Hace 5 horas', status: 'confirmed', txHash: '0x2a...9b1' },
  { id: 'sig_3', action: 'Transferencia Reycoin', module: 'Economía', timestamp: 'Ayer', status: 'confirmed', txHash: '0x99...4d2' },
  { id: 'sig_4', action: 'Votación Gobernanza', module: 'Web3', timestamp: 'Hace 2 días', status: 'failed', txHash: '0x1c...7f0' },
];

const INITIAL_WEBAUTHN_DEVICES: WebAuthnDevice[] = [
  {
    id: 'wa_dev_1',
    name: 'MacBook Pro M3 (Touch ID)',
    type: 'fingerprint',
    credentialId: 'cred_rey_0x9181a...f88b',
    registeredAt: '15 ene 2026',
    lastUsedAt: 'Hace 10 minutos',
    authenticatorAttachment: 'platform',
    status: 'active',
    algorithm: 'ES256',
  },
  {
    id: 'wa_dev_2',
    name: 'iPhone 15 Pro (Face ID)',
    type: 'faceid',
    credentialId: 'cred_rey_0x221c4...a11e',
    registeredAt: '01 feb 2026',
    lastUsedAt: 'Ayer a las 18:45',
    authenticatorAttachment: 'platform',
    status: 'active',
    algorithm: 'Ed25519',
  },
  {
    id: 'wa_dev_3',
    name: 'YubiKey 5 NFC (Llave de Seguridad Hardware)',
    type: 'hardware_key',
    credentialId: 'cred_rey_0x773d1...9c0a',
    registeredAt: '20 nov 2025',
    lastUsedAt: 'Hace 3 días',
    authenticatorAttachment: 'cross-platform',
    status: 'active',
    algorithm: 'ES256',
  },
];

export function ReyIDDashboard() {
  const { user, isLoggedIn, login, signup, loginWithGoogle, loginWithWeb3Wallet, logout } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'webauthn' | 'config' | 'auth' | 'sign'>('profile');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Supabase Sync Indicator State
  const [supabaseSyncStatus, setSupabaseSyncStatus] = useState<SupabaseSyncState>('synced');
  const [lastSyncTime, setLastSyncTime] = useState<string>('Hace unos segundos');

  // Logs state
  const [signatureLogs, setSignatureLogs] = useState<SignatureLog[]>(INITIAL_LOGS);

  // WebAuthn Biometrics State
  const [devices, setDevices] = useState<WebAuthnDevice[]>(INITIAL_WEBAUTHN_DEVICES);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceType, setNewDeviceType] = useState<'fingerprint' | 'faceid' | 'hardware_key' | 'passkey'>('fingerprint');
  const [newDeviceAttachment, setNewDeviceAttachment] = useState<'platform' | 'cross-platform'>('platform');
  const [isScanningBiometric, setIsScanningBiometric] = useState(false);
  const [testingDeviceId, setTestingDeviceId] = useState<string | null>(null);

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

  // Liveness Modal State
  const [isLivenessModalOpen, setIsLivenessModalOpen] = useState(false);
  const [livenessCompleted, setLivenessCompleted] = useState(false);

  // Trigger Supabase Sync Helper
  const triggerSupabaseSync = async (actionLabel: string, isCryptoSign = false) => {
    setSupabaseSyncStatus(isCryptoSign ? 'signing' : 'syncing');
    await new Promise((res) => setTimeout(res, 1200));
    setSupabaseSyncStatus('updated');
    const nowStr = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastSyncTime(`${nowStr} CST`);
    await new Promise((res) => setTimeout(res, 1500));
    setSupabaseSyncStatus('synced');
  };

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
      triggerSupabaseSync('Inicio de Sesión ReyID');
      toast.success('Sesión Iniciada', `Bienvenido al ecosistema Reyplace.`);
      setLoginData({ email: '', password: '' });
      setLoginErrors({});
      setActiveTab('profile');
    } catch {
      toast.error('Error de Autenticación', 'No se pudo iniciar sesión.');
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
      triggerSupabaseSync('Registro Nuevo ReyID');
      toast.success('Cuenta Registrada', `Tu ReyID y DID han sido generados con éxito.`);
      setSignupData({ fullName: '', email: '', handle: '', password: '', confirmPassword: '' });
      setSignupErrors({});
      setActiveTab('profile');
    } catch {
      toast.error('Error de Registro', 'No se pudo completar el registro.');
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
    triggerSupabaseSync('Firma Criptográfica Supabase', true);
    await new Promise((res) => setTimeout(res, 1200));

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
    toast.success('Mensaje Criptográfico Firmado', `Sincronizado en Supabase. Hash: ${randomHash}`);
    setSignData({ messageToSign: '', network: 'REYCHAIN_L2' });
    setSignErrors({});
    setIsSigning(false);
  };

  // WebAuthn Device Registration Handler
  const handleRegisterDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName.trim()) {
      toast.error('Nombre Requerido', 'Escriba un nombre para el nuevo dispositivo biométrico.');
      return;
    }

    setIsScanningBiometric(true);
    await new Promise((res) => setTimeout(res, 1600));

    const randomCredId = `cred_rey_0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`;
    const newDev: WebAuthnDevice = {
      id: `wa_dev_${Date.now()}`,
      name: newDeviceName.trim(),
      type: newDeviceType,
      credentialId: randomCredId,
      registeredAt: 'Hoy',
      lastUsedAt: 'Hace un momento',
      authenticatorAttachment: newDeviceAttachment,
      status: 'active',
      algorithm: newDeviceType === 'faceid' ? 'Ed25519' : 'ES256',
    };

    setDevices((prev) => [newDev, ...prev]);
    setIsScanningBiometric(false);
    setIsAddDeviceModalOpen(false);
    setNewDeviceName('');
    toast.success('Dispositivo Registrado', `${newDev.name} vinculado con clave pública WebAuthn FIDO2.`);
    triggerSupabaseSync('Alta Dispositivo Biométrico WebAuthn');
  };

  // Test Biometric Authentication on device
  const handleTestDevice = async (device: WebAuthnDevice) => {
    setTestingDeviceId(device.id);
    await new Promise((res) => setTimeout(res, 1200));
    setDevices((prev) =>
      prev.map((d) => (d.id === device.id ? { ...d, lastUsedAt: 'Ahora mismo' } : d))
    );
    setTestingDeviceId(null);
    toast.success('Verificación Biométrica Exitosa', `Dispositivo: ${device.name}`);
    triggerSupabaseSync('Prueba Autenticación WebAuthn');
  };

  // Revoke device handler
  const handleRevokeDevice = (deviceId: string, deviceName: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
    toast.info('Dispositivo Revocado', `${deviceName} ha sido desvinculado de ReyID.`);
    triggerSupabaseSync('Baja Dispositivo WebAuthn');
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 relative">
      {/* Official Reyplace Background Liquid Blobs Spectrum */}
      <div className="fixed top-10 right-10 w-[500px] h-[500px] bg-[#00d2ff]/12 blur-[100px] animate-liquid-morph pointer-events-none -z-10" />
      <div className="fixed top-1/3 left-5 w-[450px] h-[450px] bg-[#d946ef]/10 blur-[110px] animate-liquid-morph-slow pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-1/4 w-[400px] h-[400px] bg-[#f97316]/10 blur-[90px] animate-liquid-morph pointer-events-none -z-10" />
      <div className="fixed bottom-20 left-10 w-[450px] h-[450px] bg-[#2563eb]/15 blur-[100px] animate-liquid-morph-slow pointer-events-none -z-10" />
      
      {/* Header */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-[#00d2ff]/15 text-[#00d2ff] border border-[#00d2ff]/30 tracking-wider uppercase">
              CONECTAMOS
            </span>
            <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-[#d946ef]/15 text-[#d946ef] border border-[#d946ef]/30 tracking-wider uppercase">
              INNOVAMOS
            </span>
            <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-[#f97316]/15 text-[#f97316] border border-[#f97316]/30 tracking-wider uppercase">
              TRANSFORMAMOS
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="p-2 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 neu-inset-dark">
              <Fingerprint className="w-8 h-8 text-[#00d2ff]" />
            </span>
            <span>ReyID</span> <span className="text-gray-600 font-medium">/</span> <span className="brand-text-gradient">Centro de Identidad & Usuarios</span>
          </h1>
          <p className="text-gray-400 mt-1.5 text-xs sm:text-sm max-w-3xl">
            Gestiona tu identidad descentralizada en el Ecosistema Digital Reyplace, biometría WebAuthn (Passkeys), firmas en Cúpula Digital y sincronización en tiempo real.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1.5 rounded-2xl text-xs text-cyan-300 font-mono shadow-md">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              Sesión Activa: <span className="font-bold">{user?.handle}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-2xl text-xs text-amber-400 font-mono shadow-md">
              <AlertCircle className="w-4 h-4" />
              Sin Iniciar Sesión
            </div>
          )}
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-2xl text-xs font-mono font-bold shadow-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Cúpula Activa
          </div>
        </div>
      </header>

      {/* Supabase Realtime Sync Header Banner */}
      <SupabaseSyncIndicator
        status={supabaseSyncStatus}
        lastSyncTime={lastSyncTime}
        pingMs={22}
        onManualSync={() => triggerSupabaseSync('Sincronización Manual Supabase')}
      />

      {/* Emergency & Civil Protection Weather Alerts Banner */}
      <EmergencyAlertsWidget />

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2.5 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'neu-button-cyan text-black shadow-lg shadow-cyan-500/25 scale-105'
              : 'glass-panel-dark text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Fingerprint className="w-4 h-4" />
          Identidad & Wallet
        </button>

        <button
          onClick={() => setActiveTab('webauthn')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'webauthn'
              ? 'neu-button-cyan text-black shadow-lg shadow-cyan-500/25 scale-105'
              : 'glass-panel-dark text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Scan className="w-4 h-4" />
          Biometría WebAuthn ({devices.length})
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'config'
              ? 'neu-button-cyan text-black shadow-lg shadow-cyan-500/25 scale-105'
              : 'glass-panel-dark text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Settings className="w-4 h-4" />
          Configuración Biométrica
        </button>

        <button
          onClick={() => setActiveTab('auth')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'auth'
              ? 'neu-button-cyan text-black shadow-lg shadow-cyan-500/25 scale-105'
              : 'glass-panel-dark text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <LogIn className="w-4 h-4" />
          Autenticación & Zod
        </button>

        <button
          onClick={() => setActiveTab('sign')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'sign'
              ? 'neu-button-cyan text-black shadow-lg shadow-cyan-500/25 scale-105'
              : 'glass-panel-dark text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <FileSignature className="w-4 h-4" />
          Firmador Web3
        </button>
      </div>

      {/* TAB CONTENT 1: Profile & Wallet */}
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
                    <div className="space-y-2 mt-4">
                      <button
                        onClick={() => setIsLivenessModalOpen(true)}
                        className="w-full py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <ScanFace className="w-4 h-4" /> Prueba de Vida (Liveness)
                      </button>
                      
                      <button
                        onClick={() => {
                          logout();
                          toast.info('Sesión Cerrada', 'Has cerrado sesión correctamente.');
                        }}
                        className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Cerrar Sesión Activa
                      </button>
                    </div>
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
            
            {/* Biometric Progress Panel */}
            <BiometricPanel 
              livenessCompleted={livenessCompleted} 
              onOpenLiveness={() => setIsLivenessModalOpen(true)} 
            />

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
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Supabase Database</div>
                    <div className="text-sm text-green-400 font-medium">Realtime Active</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2 font-mono">Persistencia en Tiempo Real</div>
              </div>

              <div className="bg-[#111112] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Scan className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Biometría WebAuthn</div>
                    <div className="text-sm text-white font-medium">{devices.length} Claves FIDO2</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2 font-mono">Passkeys Activas</div>
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

      {/* TAB CONTENT 2: Advanced WebAuthn Biometrics Management */}
      {activeTab === 'webauthn' && (
        <div className="space-y-6">
          
          {/* Section Header Banner */}
          <div className="bg-[#111112] border border-cyan-500/20 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Scan className="w-6 h-6" />
                </span>
                <h2 className="text-xl font-bold text-white">Configuración Avanzada de Biometría WebAuthn</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  Passkeys FIDO2
                </span>
              </div>
              <p className="text-xs text-gray-400 max-w-2xl">
                Vincula tus autenticadores de hardware, Touch ID, Face ID y Passkeys criptográficas. Las credenciales se firman localmente en el Enclave Seguro de tu dispositivo y se sincronizan vía Supabase Realtime.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsAddDeviceModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer shrink-0 z-10"
            >
              <Plus className="w-4 h-4" /> Añadir nuevo dispositivo de confianza
            </motion.button>

            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Biometric Devices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device) => {
              const isTesting = testingDeviceId === device.id;
              return (
                <motion.div
                  key={device.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[#111112] border border-white/10 hover:border-cyan-500/40 rounded-2xl p-5 space-y-4 shadow-lg transition-all relative group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                        {device.type === 'fingerprint' && <Fingerprint className="w-6 h-6" />}
                        {device.type === 'faceid' && <Scan className="w-6 h-6 text-purple-400" />}
                        {device.type === 'hardware_key' && <KeyRound className="w-6 h-6 text-amber-400" />}
                        {device.type === 'passkey' && <Smartphone className="w-6 h-6 text-emerald-400" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {device.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono text-gray-500 uppercase">{device.algorithm}</span>
                          <span className="text-gray-600">•</span>
                          <span className="text-[10px] font-mono text-cyan-400">{device.authenticatorAttachment}</span>
                        </div>
                      </div>
                    </div>

                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono bg-[#080809] p-3 rounded-xl border border-white/5 text-gray-400">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Credencial:</span>
                      <span className="text-gray-300 font-semibold">{device.credentialId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Registrado:</span>
                      <span>{device.registeredAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Último Acceso:</span>
                      <span className="text-emerald-400">{device.lastUsedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleTestDevice(device)}
                      disabled={isTesting}
                      className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/30 text-xs font-bold text-gray-200 hover:text-cyan-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isTesting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                          <span>Escaneando...</span>
                        </>
                      ) : (
                        <>
                          <Scan className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Probar Biometría</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleRevokeDevice(device.id, device.name)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                      title="Revocar Dispositivo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Security Features Info Box */}
          <div className="bg-[#111112] border border-white/5 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Aislamiento TPM / Secure Enclave</h4>
                <p className="text-[11px] text-gray-400 mt-1">Las llaves privadas de autenticación nunca salen del chip de tu dispositivo.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Zero Phishing Guarantee</h4>
                <p className="text-[11px] text-gray-400 mt-1">WebAuthn valida el origen del dominio impidiendo ataques de suplantación.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Sincronización Supabase Realtime</h4>
                <p className="text-[11px] text-gray-400 mt-1">Los registros de claves públicas se actualizan instantáneamente en toda la red.</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT 3: Auth Forms with Zod Validation */}
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

            {/* Quick Provider Login (Google & Web3 Wallet) */}
            <div className="mb-6 pb-6 border-b border-white/10 space-y-3">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Acceso Rápido Vinculado a ReyID</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await loginWithGoogle();
                      triggerSupabaseSync('Autenticación Google OAuth');
                      toast.success('Sesión Iniciada con Google', 'ReyID vinculado a Google Auth.');
                      setActiveTab('profile');
                    } catch {
                      toast.error('Error Google', 'No se pudo completar la autenticación con Google.');
                    }
                  }}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>ReyID con Google Auth</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await loginWithWeb3Wallet();
                      triggerSupabaseSync('Conexión Web3 Wallet');
                      toast.success('Billetera Web3 Conectada', 'ReyID vinculado a Ethereum / ReyChain L2 DID.');
                      setActiveTab('profile');
                    } catch {
                      toast.error('Error Web3', 'No se pudo conectar la billetera Web3.');
                    }
                  }}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all cursor-pointer"
                >
                  <Wallet className="w-4 h-4 text-cyan-400" />
                  <span>Billetera Web3 / MetaMask</span>
                </button>
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

      {/* TAB CONTENT 4: Web3 Signer */}
      {activeTab === 'sign' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-[#111112] border border-cyan-500/20 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-cyan-400" /> Firmador Digital Cúpula
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Genera una firma criptográfica verificable con tu llave privada de ReyID para autorizaciones en el ecosistema. Cada firma transmite un evento en tiempo real vía Supabase.
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
                  <span className="animate-pulse">Firmando y Sincronizando en Supabase...</span>
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

      {/* TAB CONTENT 5: Biometric Configuration */}
      {activeTab === 'config' && (
        <BiometricConfigSection />
      )}

      {/* MODAL: Add New WebAuthn Device */}
      <AnimatePresence>
        {isAddDeviceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#111112] border border-cyan-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden space-y-5"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Scan className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">Añadir Nuevo Dispositivo de Confianza</h3>
                    <p className="text-xs text-gray-400">Registro WebAuthn FIDO2 / Passkey</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAddDeviceModalOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form / Biometric Scan Interaction */}
              <form onSubmit={handleRegisterDevice} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Nombre del Dispositivo
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Google Pixel 8 Pro - Touch ID"
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    className="w-full bg-[#080809] border border-white/10 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                      Tipo Biométrico
                    </label>
                    <select
                      value={newDeviceType}
                      onChange={(e) => setNewDeviceType(e.target.value as any)}
                      className="w-full bg-[#080809] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-mono outline-none focus:border-cyan-500"
                    >
                      <option value="fingerprint">Huella Dactilar (Touch ID)</option>
                      <option value="faceid">Reconocimiento Facial (Face ID)</option>
                      <option value="hardware_key">Llave de Seguridad (YubiKey)</option>
                      <option value="passkey">Passkey Multi-dispositivo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                      Modalidad
                    </label>
                    <select
                      value={newDeviceAttachment}
                      onChange={(e) => setNewDeviceAttachment(e.target.value as any)}
                      className="w-full bg-[#080809] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-mono outline-none focus:border-cyan-500"
                    >
                      <option value="platform">Incrustado (Platform TPM)</option>
                      <option value="cross-platform">Llave Externa (USB/NFC)</option>
                    </select>
                  </div>
                </div>

                {/* Animated Biometric Radar / Fingerprint Scan Preview */}
                <div className="p-6 bg-[#080809] rounded-2xl border border-cyan-500/20 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[160px]">
                  {isScanningBiometric ? (
                    <div className="space-y-3 flex flex-col items-center">
                      <div className="relative flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="absolute w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-400 pointer-events-none"
                        />
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          className="w-14 h-14 rounded-full border-2 border-dashed border-cyan-400 flex items-center justify-center"
                        >
                          <Scan className="w-8 h-8 text-cyan-300" />
                        </motion.div>
                      </div>
                      <p className="text-xs font-mono font-bold text-cyan-300 animate-pulse">
                        Generando clave pública FIDO2 & Leyendo sensor TPM...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400">
                        {newDeviceType === 'fingerprint' && <Fingerprint className="w-7 h-7" />}
                        {newDeviceType === 'faceid' && <Scan className="w-7 h-7 text-purple-400" />}
                        {newDeviceType === 'hardware_key' && <KeyRound className="w-7 h-7 text-amber-400" />}
                        {newDeviceType === 'passkey' && <Smartphone className="w-7 h-7 text-emerald-400" />}
                      </div>
                      <p className="text-xs text-gray-300 font-bold">
                        Sensor Listo para Registro
                      </p>
                      <p className="text-[11px] text-gray-500 max-w-xs mx-auto">
                        Al presionar el botón, se iniciará la autenticación biométrica en tu hardware.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddDeviceModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-400 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isScanningBiometric}
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isScanningBiometric ? (
                      <span>Registrando...</span>
                    ) : (
                      <>
                        <Scan className="w-4 h-4" />
                        <span>Escanear & Registrar</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <LivenessModal 
        isOpen={isLivenessModalOpen} 
        onClose={() => setIsLivenessModalOpen(false)}
        onSuccess={() => {
          setLivenessCompleted(true);
          triggerSupabaseSync('Prueba de Vida Exitosa (Liveness)');
        }}
      />

    </div>
  );
}
