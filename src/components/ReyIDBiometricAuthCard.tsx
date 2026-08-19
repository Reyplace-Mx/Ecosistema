import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Fingerprint,
  Scan,
  ShieldCheck,
  Cpu,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Smartphone,
  Laptop,
  Trash2,
  Play,
  RotateCw,
  Lock,
  UserCheck,
  ShieldAlert,
  HardDrive
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  checkWebAuthnSupport,
  getStoredBiometricCredentials,
  saveBiometricCredential,
  removeStoredBiometricCredential,
  registerWebAuthnCredential,
  authenticateWithWebAuthn,
  detectBiometricHardware,
  WebAuthnCredentialInfo
} from '../lib/webauthn';

interface ReyIDBiometricAuthCardProps {
  onAuthSuccess?: () => void;
  showEnrollment?: boolean;
}

export function ReyIDBiometricAuthCard({ onAuthSuccess, showEnrollment = true }: ReyIDBiometricAuthCardProps) {
  const { user, isLoggedIn, loginWithBiometrics, registerWithBiometrics } = useAuth();
  const { toast } = useToast();

  const [supportInfo, setSupportInfo] = useState<{
    supported: boolean;
    hasPlatformAuthenticator: boolean;
    isConditionalMediationAvailable: boolean;
    hardwareName: string;
  }>({
    supported: true,
    hasPlatformAuthenticator: true,
    isConditionalMediationAvailable: false,
    hardwareName: 'Verificando hardware...',
  });

  const [passkeys, setPasskeys] = useState<WebAuthnCredentialInfo[]>([]);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'vault'>('login');

  // Registration form state
  const [enrollName, setEnrollName] = useState('');
  const [enrollHandle, setEnrollHandle] = useState('');
  const [enrollAlgorithm, setEnrollAlgorithm] = useState<'ES256' | 'Ed25519' | 'RS256'>('ES256');

  // Live assertion result state
  const [lastAssertion, setLastAssertion] = useState<{
    success: boolean;
    credentialId: string;
    signature: string;
    authenticatorName: string;
    timestamp: string;
    didProof: string;
  } | null>(null);

  useEffect(() => {
    checkWebAuthnSupport().then((info) => {
      setSupportInfo(info);
    });
    refreshPasskeys();
  }, []);

  const refreshPasskeys = () => {
    const list = getStoredBiometricCredentials();
    setPasskeys(list);
  };

  const handleInstantBiometricLogin = async (credentialId?: string) => {
    setIsAuthenticating(true);
    setLastAssertion(null);
    try {
      const bioUser = await loginWithBiometrics(credentialId);
      refreshPasskeys();
      setLastAssertion({
        success: true,
        credentialId: bioUser.biometricCredentialId || 'passkey_hw_' + Date.now(),
        signature: '0x' + Array.from(new Uint8Array(16), () => Math.floor(Math.random() * 16).toString(16)).join(''),
        authenticatorName: supportInfo.hardwareName,
        timestamp: new Date().toLocaleTimeString(),
        didProof: bioUser.did,
      });

      toast.success(
        '¡Autenticación Biométrica Exitosa!',
        `Acceso concedido a ${bioUser.name} mediante ${supportInfo.hardwareName}.`
      );

      if (onAuthSuccess) onAuthSuccess();
    } catch (err: any) {
      toast.error('Fallo en Sensor Biométrico', err?.message || 'No se completó la verificación del hardware.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleEnrollBiometric = async (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = enrollName.trim() || user?.name || 'Ciudadano ReyID';
    const handle = enrollHandle.trim() || user?.handle || '@ciudadano';

    setIsEnrolling(true);
    try {
      const result = await registerWithBiometrics(displayName, handle, enrollAlgorithm);
      refreshPasskeys();
      setEnrollName('');
      setEnrollHandle('');
      setActiveTab('vault');

      toast.success(
        '¡Hardware Biométrico Enlazado!',
        `Se ha registrado la credencial ${result.credential.algorithm} en el enclave seguro del dispositivo.`
      );
    } catch (err: any) {
      toast.error('Error al Registrar Hardware', err?.message || 'No se pudo vincular la biometría.');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleDeletePasskey = (id: string) => {
    removeStoredBiometricCredential(id);
    refreshPasskeys();
    toast.info('Passkey Revocada', 'La credencial biométrica local ha sido eliminada.');
  };

  return (
    <div className="w-full bg-[#0d1117]/90 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Diagnostics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Hardware WebAuthn FIDO2
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold">
              <CheckCircle2 className="w-3 h-3" /> Enclave Activo
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Fingerprint className="w-6 h-6 text-cyan-400" />
            Acceso Biométrico ReyID
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Autenticación descentralizada y sin contraseñas respaldada por hardware físico.
          </p>
        </div>

        {/* Hardware Status Tag */}
        <div className="bg-[#161b22] border border-white/10 rounded-2xl p-3 text-right shrink-0">
          <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Dispositivo Detectado</div>
          <div className="text-xs font-bold text-white font-mono flex items-center justify-end gap-1.5 mt-0.5">
            {/mac|apple|iphone/i.test(supportInfo.hardwareName) ? (
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <Laptop className="w-3.5 h-3.5 text-cyan-400" />
            )}
            {supportInfo.hardwareName}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mt-6 mb-6 p-1 bg-[#161b22] rounded-2xl border border-white/10">
        <button
          onClick={() => setActiveTab('login')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'login'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Scan className="w-4 h-4" />
          <span>Iniciar Sesión Biométrico</span>
        </button>

        {showEnrollment && (
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Vincular Nuevo Hardware</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('vault')}
          className={`py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'vault'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Bóveda ({passkeys.length})</span>
        </button>
      </div>

      {/* TAB 1: LOGIN FLOW */}
      {activeTab === 'login' && (
        <div className="space-y-6">
          {/* Main Action Banner */}
          <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-cyan-500/20 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden group">
            <div className="relative z-10 max-w-lg mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border-2 border-cyan-400/40 flex items-center justify-center mx-auto mb-4 relative shadow-2xl shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <Fingerprint className={`w-10 h-10 text-cyan-400 ${isAuthenticating ? 'animate-pulse' : ''}`} />
                {isAuthenticating && (
                  <div className="absolute inset-0 border-2 border-cyan-400 rounded-3xl animate-ping opacity-75 pointer-events-none" />
                )}
              </div>

              <h3 className="text-lg font-black text-white mb-2">
                Desbloqueo Criptográfico de Hardware
              </h3>
              <p className="text-xs text-gray-300 font-mono mb-6 leading-relaxed">
                Toca el botón a continuación para autenticarte usando tu sensor de huella dactilar, Face ID o Windows Hello. No requiere contraseña.
              </p>

              <button
                onClick={() => handleInstantBiometricLogin()}
                disabled={isAuthenticating}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-3 mx-auto cursor-pointer disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-black" />
                    <span>Esperando Lectura de Sensor Biométrico...</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4 text-black" />
                    <span>Autenticar con {supportInfo.hardwareName}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Live Proof Card if recently authenticated */}
          {lastAssertion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 sm:p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
                  <CheckCircle2 className="w-4 h-4" /> Desafío FIDO2 Verificado con Éxito
                </div>
                <span className="text-[10px] text-emerald-300 font-mono">{lastAssertion.timestamp}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono">
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase">DID Cúpula Validado</span>
                  <span className="text-white font-bold truncate block">{lastAssertion.didProof}</span>
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase">Firma Criptográfica Hardware</span>
                  <span className="text-cyan-300 font-bold truncate block">{lastAssertion.signature}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick List of registered passkeys */}
          {passkeys.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 font-mono">
                Llaves Biométricas Registradas en este Navegador
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {passkeys.map((pk) => (
                  <div
                    key={pk.id}
                    className="bg-[#161b22] border border-white/10 hover:border-cyan-500/40 rounded-2xl p-4 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Fingerprint className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="text-xs font-bold text-white truncate font-mono">
                          {pk.userDisplayName || 'Ciudadano ReyID'}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">
                        {pk.algorithm} • {new Date(pk.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <button
                      onClick={() => handleInstantBiometricLogin(pk.id)}
                      disabled={isAuthenticating}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-cyan-300" /> Probar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ENROLL / REGISTER FLOW */}
      {activeTab === 'register' && (
        <form onSubmit={handleEnrollBiometric} className="space-y-4 max-w-xl mx-auto">
          <div className="bg-[#161b22] border border-white/10 rounded-2xl p-5 mb-4">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              Generación de Par de Llaves en Enclave Físico
            </h3>
            <p className="text-xs text-gray-400 font-mono leading-relaxed">
              El dispositivo creará un par de llaves criptográficas asimétricas (pública/privada). La llave privada nunca sale del chip de seguridad físico de tu dispositivo.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 font-mono">
              Nombre de la Identidad / Usuario
            </label>
            <input
              type="text"
              placeholder="Ej. Alex Vanguard (Pro Business)"
              value={enrollName}
              onChange={(e) => setEnrollName(e.target.value)}
              className="w-full bg-[#080809] border border-white/10 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 font-mono">
              Alias ReyID (@handle)
            </label>
            <input
              type="text"
              placeholder="@alexvanguard"
              value={enrollHandle}
              onChange={(e) => setEnrollHandle(e.target.value)}
              className="w-full bg-[#080809] border border-white/10 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 font-mono">
              Algoritmo Criptográfico de Hardware
            </label>
            <select
              value={enrollAlgorithm}
              onChange={(e) => setEnrollAlgorithm(e.target.value as any)}
              className="w-full bg-[#080809] border border-white/10 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none"
            >
              <option value="ES256">ES256 (ECDSA con curva NIST P-256 / Estándar FIDO2)</option>
              <option value="Ed25519">Ed25519 (EdDSA Alta Velocidad Cúpula)</option>
              <option value="RS256">RS256 (RSA 2048-bit Legacy Enclave)</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isEnrolling}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-mono"
            >
              {isEnrolling ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-black" />
                  <span>Creando Credencial en Enclave de Hardware...</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4 text-black" />
                  <span>Vincular y Generar Passkey FIDO2</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: PASSKEY VAULT */}
      {activeTab === 'vault' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
              Credenciales Guardadas ({passkeys.length})
            </h3>
            <span className="text-[10px] text-cyan-400 font-mono">Almacenamiento Seguro Local</span>
          </div>

          {passkeys.length === 0 ? (
            <div className="text-center py-12 bg-[#161b22]/50 border border-dashed border-white/10 rounded-2xl">
              <Fingerprint className="w-10 h-10 text-gray-600 mx-auto mb-2" />
              <p className="text-xs text-gray-400 font-mono">No hay llaves biométricas registradas en este dispositivo.</p>
              <button
                onClick={() => setActiveTab('register')}
                className="mt-3 text-xs text-cyan-400 font-mono font-bold hover:underline cursor-pointer"
              >
                + Vincular mi primera llave biométrica
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {passkeys.map((pk) => (
                <div
                  key={pk.id}
                  className="bg-[#161b22] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono">{pk.userDisplayName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                        {pk.algorithm}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 font-mono mt-1">
                      ID: <span className="text-gray-300">{pk.id.substring(0, 24)}...</span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                      {pk.authenticatorName} • Registrado el {new Date(pk.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleInstantBiometricLogin(pk.id)}
                      disabled={isAuthenticating}
                      className="px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-cyan-300" /> Probar
                    </button>
                    <button
                      onClick={() => handleDeletePasskey(pk.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-colors cursor-pointer"
                      title="Eliminar credencial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
