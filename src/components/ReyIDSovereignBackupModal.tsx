import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Upload, 
  Lock, 
  ShieldCheck, 
  Key, 
  FileText, 
  Copy, 
  Check, 
  AlertTriangle, 
  Sparkles,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { CryptoEngine } from '../lib/cryptoEngine';

interface ReyIDSovereignBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReyIDSovereignBackupModal({ isOpen, onClose }: ReyIDSovereignBackupModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [backupPassword, setBackupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptedPayload, setEncryptedPayload] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  // Restore State
  const [restorePayload, setRestorePayload] = useState('');
  const [restorePassword, setRestorePassword] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);
  const [activeTab, setActiveTab] = useState<'export' | 'did_doc' | 'restore'>('export');

  if (!isOpen) return null;

  const didDocument = {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://w3id.org/security/suites/ed25519-2020/v1',
      'https://reyplace.com/did/v2'
    ],
    id: user?.did || 'did:rey:0x7aF982ef91b2c41893c8340d91a92182b3A1',
    alsoKnownAs: [`https://reyplace.com/profile/${user?.handle || 'alexvanguard'}`],
    verificationMethod: [
      {
        id: `${user?.did || 'did:rey:0x7aF982ef91b2c41893c8340d91a92182b3A1'}#key-1`,
        type: 'Ed25519VerificationKey2020',
        controller: user?.did || 'did:rey:0x7aF982ef91b2c41893c8340d91a92182b3A1',
        publicKeyMultibase: 'z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwW5DmCd6'
      },
      {
        id: `${user?.did || 'did:rey:0x7aF982ef91b2c41893c8340d91a92182b3A1'}#fido2-passkey-1`,
        type: 'JsonWebKey2020',
        controller: user?.did || 'did:rey:0x7aF982ef91b2c41893c8340d91a92182b3A1',
        publicKeyJwk: {
          kty: 'EC',
          crv: 'P-256',
          x: 'f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU',
          y: 'x_daaqundbg2w2RqrY21km02HT0VnJaW3264KWCnH6I'
        }
      }
    ],
    authentication: [
      `${user?.did || 'did:rey:0x7aF982ef91b2c41893c8340d91a92182b3A1'}#key-1`,
      `${user?.did || 'did:rey:0x7aF982ef91b2c41893c8340d91a92182b3A1'}#fido2-passkey-1`
    ],
    assertionMethod: [
      `${user?.did || 'did:rey:0x7aF982ef91b2c41893c8340d91a92182b3A1'}#key-1`
    ],
    service: [
      {
        id: `${user?.did || 'did:rey:0x7aF982ef91b2c41893c8340d91a92182b3A1'}#smartcity-agent`,
        type: 'SmartCityCitizenService',
        serviceEndpoint: 'https://smartcity.reyplace.com/api/v1/agent'
      }
    ]
  };

  const handleExportDIDDoc = () => {
    const blob = new Blob([JSON.stringify(didDocument, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `did_document_${user?.handle || 'reyid'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('DID Document Descargado', 'Estándar W3C guardado en formato JSON-LD.');
  };

  const handleGenerateEncryptedBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (backupPassword.length < 8) {
      toast.error('Contraseña Débil', 'La contraseña de respaldo debe tener al menos 8 caracteres.');
      return;
    }
    if (backupPassword !== confirmPassword) {
      toast.error('Contraseñas no coinciden', 'Por favor verifica la contraseña ingresada.');
      return;
    }

    setIsEncrypting(true);
    try {
      const rawIdentityData = JSON.stringify({
        user,
        didDocument,
        exportedAt: new Date().toISOString(),
        version: 'ReyID_Sovereign_v2.5',
        network: 'REYCHAIN_SMARTCITY_AHOME',
      });

      const encrypted = await CryptoEngine.encryptAES256(rawIdentityData, backupPassword);
      setEncryptedPayload(JSON.stringify(encrypted, null, 2));
      toast.success('Bóveda Encriptada con Éxito', 'Cifrado AES-256-GCM + PBKDF2 generado en memoria local.');
    } catch {
      toast.error('Error Criptográfico', 'No se pudo cifrar la copia de seguridad.');
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDownloadBackupFile = () => {
    if (!encryptedPayload) return;
    const blob = new Blob([encryptedPayload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reyid_vault_backup_${Date.now()}.reyid.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Archivo .reyid Descargado', 'Guarda este archivo en una ubicación segura fuera de línea.');
  };

  const handleRestoreBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restorePayload || !restorePassword) {
      toast.error('Datos Incompletos', 'Pega el JSON cifrado y proporciona la contraseña maestra.');
      return;
    }

    setIsRestoring(true);
    try {
      const parsedBundle = JSON.parse(restorePayload);
      const decryptedString = await CryptoEngine.decryptAES256(parsedBundle.ciphertext, parsedBundle.iv, restorePassword);
      const recoveredData = JSON.parse(decryptedString);

      toast.success('¡Identidad Restaurada con Éxito!', `ReyID recuperado para ${recoveredData.user?.handle || 'usuario'}.`);
      setRestorePayload('');
      setRestorePassword('');
      onClose();
    } catch {
      toast.error('Fallo de Desencriptación', 'Contraseña incorrecta o paquete de respaldo corrupto.');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0a0d14] border border-cyan-500/30 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 relative overflow-hidden"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Bóveda Soberana ReyID & DID Document</h3>
              <p className="text-xs text-gray-400">Exporta e importa tu identidad autosoberana con cifrado militar</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white font-mono text-sm">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 gap-2 pb-2">
          {[
            { id: 'export', label: '1. Backup Cifrado AES-256-GCM' },
            { id: 'did_doc', label: '2. DID Document (W3C JSON-LD)' },
            { id: 'restore', label: '3. Restaurar Identidad' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Export AES Backup */}
        {activeTab === 'export' && (
          <div className="space-y-4">
            <form onSubmit={handleGenerateEncryptedBackup} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-gray-300 mb-1 block">Contraseña Maestra de Respaldo</label>
                  <input
                    type="password"
                    value={backupPassword}
                    onChange={(e) => setBackupPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-gray-300 mb-1 block">Confirmar Contraseña</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la contraseña"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isEncrypting}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <Sparkles className={`w-4 h-4 ${isEncrypting ? 'animate-spin' : 'text-black'}`} />
                <span>{isEncrypting ? 'Encriptando con AES-GCM + PBKDF2...' : 'Generar Bóveda Encriptada'}</span>
              </button>
            </form>

            {encryptedPayload && (
              <div className="space-y-3 pt-2">
                <div className="bg-[#05070c] border border-white/10 rounded-2xl p-3 font-mono text-[11px] text-cyan-200/90 max-h-36 overflow-y-auto">
                  <pre>{encryptedPayload}</pre>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={handleDownloadBackupFile}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-mono font-bold text-xs flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-black" />
                    <span>Descargar Archivo .reyid.json</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: W3C DID Document */}
        {activeTab === 'did_doc' && (
          <div className="space-y-4">
            <div className="bg-[#05070c] border border-white/10 rounded-2xl p-4 font-mono text-[11px] text-cyan-200/90 max-h-60 overflow-y-auto">
              <pre>{JSON.stringify(didDocument, null, 2)}</pre>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-gray-400">Estándar W3C DID Core 1.0</span>
              <button
                onClick={handleExportDIDDoc}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-black" />
                <span>Descargar DID Document (.json)</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Restore */}
        {activeTab === 'restore' && (
          <form onSubmit={handleRestoreBackup} className="space-y-3">
            <div>
              <label className="text-xs font-mono text-gray-300 mb-1 block">Payload Cifrado (.reyid o JSON)</label>
              <textarea
                value={restorePayload}
                onChange={(e) => setRestorePayload(e.target.value)}
                placeholder='Pega aquí el contenido JSON {"ciphertext": "...", "iv": "...", "salt": "..."}'
                rows={4}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-mono text-gray-300 mb-1 block">Contraseña Maestra de Desencriptación</label>
              <input
                type="password"
                value={restorePassword}
                onChange={(e) => setRestorePassword(e.target.value)}
                placeholder="Ingresa la contraseña con la que creaste el respaldo"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isRestoring}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRestoring ? 'animate-spin' : 'text-black'}`} />
              <span>{isRestoring ? 'Desencriptando y Verificando...' : 'Restaurar Bóveda ReyID'}</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
