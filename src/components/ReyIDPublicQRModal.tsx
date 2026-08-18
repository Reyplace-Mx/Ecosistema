import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { 
  QrCode, 
  ShieldCheck, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Lock, 
  Eye, 
  Clock, 
  Sparkles, 
  ExternalLink, 
  Key, 
  Smartphone, 
  FileCheck, 
  X,
  Sliders,
  Wallet,
  Mail,
  UserCheck
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import type { UserSession } from '../context/AuthContext';

interface ReyIDPublicQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserSession | {
    name: string;
    handle: string;
    did: string;
    walletAddress?: string;
    email?: string;
    role?: string;
    kycStatus?: string;
  };
}

export function ReyIDPublicQRModal({ isOpen, onClose, user }: ReyIDPublicQRModalProps) {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);

  // QR Customization States
  const [includeWallet, setIncludeWallet] = useState(true);
  const [includeEmail, setIncludeEmail] = useState(false);
  const [includeKycBadge, setIncludeKycBadge] = useState(true);
  const [qrColorTheme, setQrColorTheme] = useState<'cyan' | 'gold' | 'neon' | 'dark'>('cyan');
  const [qrPayloadType, setQrPayloadType] = useState<'url' | 'did_w3c' | 'zk_proof'>('url');
  const [qrExpiry, setQrExpiry] = useState<'never' | '24h' | '1h'>('never');
  const [isCopied, setIsCopied] = useState(false);
  const [isTestingScan, setIsTestingScan] = useState(false);

  if (!isOpen) return null;

  // Generate payload string
  const baseAppUrl = window.location.origin;
  const userHandleClean = user.handle?.replace('@', '') || 'alexvanguard';
  const profilePublicUrl = `${baseAppUrl}/#id/${userHandleClean}`;

  const getQRValue = () => {
    const timestamp = Date.now();
    const expiryToken = qrExpiry === '1h' ? `&exp=${timestamp + 3600000}` : qrExpiry === '24h' ? `&exp=${timestamp + 86400000}` : '';
    
    if (qrPayloadType === 'url') {
      let url = `${profilePublicUrl}?did=${encodeURIComponent(user.did || 'did:rey:0x7aF982ef91b2c41893c8340d91a92182b3A1')}`;
      if (includeWallet && user.walletAddress) url += `&w=${encodeURIComponent(user.walletAddress)}`;
      if (includeEmail && user.email) url += `&em=${encodeURIComponent(user.email)}`;
      if (includeKycBadge) url += `&kyc=L3`;
      return url + expiryToken;
    }

    if (qrPayloadType === 'did_w3c') {
      return JSON.stringify({
        '@context': ['https://www.w3.org/ns/did/v1', 'https://reyplace.com/did/v2'],
        id: user.did || 'did:rey:0x7aF982ef91b2c41893c8340d91a92182b3A1',
        handle: user.handle || '@alexvanguard',
        name: user.name || 'Alex Vanguard',
        verificationMethod: 'FIDO2_Passkey_L3',
        wallet: includeWallet ? user.walletAddress : undefined,
        email: includeEmail ? user.email : undefined,
        verifiedBy: 'Cupula_Digital_Smart_City',
        issuedAt: new Date().toISOString(),
      });
    }

    // ZK Proof Token format
    return `REY-ZK-ID:${user.did?.slice(0, 16)}:${btoa(JSON.stringify({ u: user.handle, ts: timestamp, exp: qrExpiry }))}`;
  };

  const qrValue = getQRValue();

  // Color mappings
  const themeColors = {
    cyan: { fg: '#00d2ff', bg: '#060911', border: 'border-cyan-500/40', glow: 'shadow-cyan-500/20' },
    gold: { fg: '#f59e0b', bg: '#0d0a04', border: 'border-amber-500/40', glow: 'shadow-amber-500/20' },
    neon: { fg: '#d946ef', bg: '#0d0411', border: 'border-fuchsia-500/40', glow: 'shadow-fuchsia-500/20' },
    dark: { fg: '#ffffff', bg: '#000000', border: 'border-white/30', glow: 'shadow-white/10' },
  };

  const currentTheme = themeColors[qrColorTheme];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profilePublicUrl);
    setIsCopied(true);
    toast.success('Enlace Copiado', 'El enlace público a tu perfil ReyID ha sido copiado.');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDownloadPNG = () => {
    const canvas = document.getElementById('reyid-qr-canvas') as HTMLCanvasElement;
    if (!canvas) {
      toast.error('Error', 'No se pudo generar el lienzo del código QR.');
      return;
    }
    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `ReyID_QR_${userHandleClean}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    toast.success('QR Descargado', `Código QR en alta resolución guardado como ReyID_QR_${userHandleClean}.png`);
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Perfil ReyID: ${user.name}`,
          text: `Verifica mi identidad profesional descentralizada y credenciales Web3 en Reyplace.`,
          url: profilePublicUrl,
        });
        toast.success('Compartido', 'Perfil enviado satisfactoriamente.');
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0b0e17] border border-cyan-500/30 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl relative my-8"
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white tracking-tight">Código QR ReyID Público</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                VERIFICADO L3
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Comparte tu identidad soberana, credenciales profesionales y wallet de forma segura.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Left Column: QR Code Display Card */}
          <div className="flex flex-col items-center">
            <div 
              ref={canvasRef}
              className={`p-6 rounded-3xl border ${currentTheme.border} shadow-2xl ${currentTheme.glow} transition-all duration-300 relative flex flex-col items-center justify-center`}
              style={{ backgroundColor: currentTheme.bg }}
            >
              {/* Top Security Banner */}
              <div className="flex items-center justify-between w-full mb-3 text-[10px] font-mono text-gray-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>REYPLACE ID</span>
                </span>
                <span className="text-cyan-400 font-bold uppercase">{qrPayloadType}</span>
              </div>

              {/* QR Canvas / Visual Element */}
              <div className="p-3 bg-white rounded-2xl shadow-inner relative group">
                <QRCodeCanvas
                  id="reyid-qr-canvas"
                  value={qrValue}
                  size={200}
                  level="H"
                  marginSize={1}
                  imageSettings={{
                    src: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop',
                    x: undefined,
                    y: undefined,
                    height: 38,
                    width: 38,
                    excavate: true,
                  }}
                />
              </div>

              {/* Identity Footer */}
              <div className="mt-4 text-center">
                <p className="text-sm font-bold text-white tracking-wide">{user.name || 'Alex Vanguard'}</p>
                <p className="text-xs font-mono text-cyan-400 mt-0.5">{user.handle || '@alexvanguard'}</p>
                <div className="mt-2 text-[10px] font-mono text-gray-500 truncate max-w-[200px]">
                  {user.did || 'did:rey:0x7aF982ef91b2c41893c8340d91a92182b3A1'}
                </div>
              </div>
            </div>

            {/* Quick Actions Under QR */}
            <div className="flex items-center gap-2 mt-4 w-full justify-center">
              <button
                onClick={handleDownloadPNG}
                className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase font-mono flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar PNG</span>
              </button>

              <button
                onClick={handleShareNative}
                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Compartir enlace público"
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              </button>

              <button
                onClick={handleCopyLink}
                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Copiar URL"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Right Column: Customization & Security Controls */}
          <div className="space-y-4">
            
            {/* Format Payload Selector */}
            <div>
              <label className="text-[11px] font-mono text-gray-400 uppercase font-bold block mb-1.5">
                Tipo de Contenido Criptográfico
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'url', label: 'Enlace Web', desc: 'URL Verificable' },
                  { id: 'did_w3c', label: 'DID W3C', desc: 'JSON-LD' },
                  { id: 'zk_proof', label: 'Prueba ZK', desc: 'Zero-Knowledge' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setQrPayloadType(type.id as any)}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      qrPayloadType === type.id
                        ? 'bg-cyan-500/15 border-cyan-500/40 text-white'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">{type.label}</div>
                    <div className="text-[9px] font-mono text-cyan-400">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy Toggles */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="text-[11px] font-mono text-gray-400 uppercase font-bold block">
                Privacidad & Datos Incluidos
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer">
                <div className="flex items-center gap-2.5 text-xs text-gray-300">
                  <Wallet className="w-4 h-4 text-cyan-400" />
                  <span>Incluir Dirección de Wallet EVM</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeWallet}
                  onChange={(e) => setIncludeWallet(e.target.checked)}
                  className="rounded border-gray-700 text-cyan-500 focus:ring-cyan-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer">
                <div className="flex items-center gap-2.5 text-xs text-gray-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Incluir Sello de Verificación KYC L3</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeKycBadge}
                  onChange={(e) => setIncludeKycBadge(e.target.checked)}
                  className="rounded border-gray-700 text-cyan-500 focus:ring-cyan-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer">
                <div className="flex items-center gap-2.5 text-xs text-gray-300">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>Incluir Correo de Contacto Profesional</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeEmail}
                  onChange={(e) => setIncludeEmail(e.target.checked)}
                  className="rounded border-gray-700 text-cyan-500 focus:ring-cyan-500"
                />
              </label>
            </div>

            {/* Expiry / Temporal QR */}
            <div className="pt-2 border-t border-white/5">
              <label className="text-[11px] font-mono text-gray-400 uppercase font-bold block mb-1.5 flex items-center justify-between">
                <span>Vigencia Temporal del QR</span>
                <Clock className="w-3.5 h-3.5 text-gray-500" />
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'never', label: 'Permanente' },
                  { id: '24h', label: '24 Horas' },
                  { id: '1h', label: '1 Hora (Dinámico)' },
                ].map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => setQrExpiry(exp.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold text-center border transition-all cursor-pointer ${
                      qrExpiry === exp.id
                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {exp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Theme Selector */}
            <div className="pt-2 border-t border-white/5">
              <label className="text-[11px] font-mono text-gray-400 uppercase font-bold block mb-1.5">
                Tema Visual del Código QR
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'cyan', color: 'bg-[#00d2ff]', label: 'Cyan' },
                  { id: 'gold', color: 'bg-amber-500', label: 'Gold' },
                  { id: 'neon', color: 'bg-fuchsia-500', label: 'Neon' },
                  { id: 'dark', color: 'bg-white', label: 'Monocromo' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setQrColorTheme(t.id as any)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      qrColorTheme === t.id
                        ? 'bg-white/10 border-white/30 text-white'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                    <span className="text-[11px]">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Live Simulator Accordion */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <button
            onClick={() => setIsTestingScan(!isTestingScan)}
            className="w-full flex items-center justify-between text-xs font-mono text-gray-400 hover:text-white py-1 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>{isTestingScan ? 'Ocultar Simulador de Escaneo' : 'Simular lo que verá un tercero al escanear este QR'}</span>
            </span>
            <span className="text-cyan-400 font-bold">{isTestingScan ? '▲' : '▼'}</span>
          </button>

          <AnimatePresence>
            {isTestingScan && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 p-4 rounded-2xl bg-[#060810] border border-cyan-500/20 font-mono text-xs text-gray-300 space-y-2 overflow-hidden"
              >
                <div className="flex items-center justify-between text-emerald-400 font-bold pb-2 border-b border-white/10">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Firma Criptográfica Verificada
                  </span>
                  <span className="text-[10px] text-gray-400">Latencia: 4ms</span>
                </div>
                <div className="text-xs space-y-1">
                  <p><strong className="text-white">Titular:</strong> {user.name || 'Alex Vanguard'}</p>
                  <p><strong className="text-white">Identificador:</strong> <span className="text-cyan-400">{user.did || 'did:rey:0x7aF982ef91b2c41893c8340d91a92182b3A1'}</span></p>
                  {includeWallet && <p><strong className="text-white">Wallet:</strong> <span className="text-amber-400">{user.walletAddress || '0x7aF982...3b9'}</span></p>}
                  {includeEmail && <p><strong className="text-white">Email:</strong> {user.email || 'contacto.reyplace@gmail.com'}</p>}
                  <p><strong className="text-white">Estado KYC:</strong> <span className="text-emerald-400 font-bold">Verificado Nivel 3 (FIDO2 Passkey)</span></p>
                  <p><strong className="text-white">Vigencia:</strong> {qrExpiry === 'never' ? 'Sin caducidad' : qrExpiry === '24h' ? 'Válido por 24 horas' : 'Código dinámico de 1 hora'}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
    </div>
  );
}
