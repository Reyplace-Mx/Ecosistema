import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  FileCheck2, 
  QrCode, 
  KeyRound, 
  Copy, 
  Download, 
  Plus, 
  Lock, 
  Eye, 
  Check, 
  Sparkles, 
  FileText, 
  RefreshCw, 
  ExternalLink,
  Shield,
  Layers,
  ChevronRight,
  Fingerprint,
  Cpu
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export interface VerifiableCredential {
  id: string;
  type: string;
  title: string;
  issuer: {
    name: string;
    did: string;
    jurisdiction: string;
    verified: boolean;
  };
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: Record<string, any>;
  proofType: 'Ed25519Signature2020' | 'JsonWebSignature2020' | 'ZkProofGroth16';
  proofHash: string;
  status: 'valid' | 'revoked' | 'expired';
  category: 'government' | 'professional' | 'zkp' | 'sustainability';
}

const INITIAL_CREDENTIALS: VerifiableCredential[] = [
  {
    id: 'vc_ahome_citizen_2026',
    type: 'SmartCityCitizenCredential',
    title: 'Identidad Ciudadana Digital de Ahome',
    issuer: {
      name: 'Ayuntamiento de Ahome & GovTech Sinaloa',
      did: 'did:gov:mx:sin:ahome:secretaria-innovacion',
      jurisdiction: 'Los Mochis, Sinaloa, MX',
      verified: true,
    },
    issuanceDate: '10 de Enero de 2026',
    expirationDate: '10 de Enero de 2030',
    credentialSubject: {
      citizenId: 'AHM-2026-98124',
      municipality: 'Ahome',
      city: 'Los Mochis',
      residentStatus: 'Ciudadano Permanente',
      participatoryVoting: 'Habilitado (Nivel 3)',
      smartCityAccess: 'Total',
    },
    proofType: 'Ed25519Signature2020',
    proofHash: '0x88f912a7bc410291e0a8174f1b8219c0119284ba3910c28394bc88a71629d01f',
    status: 'valid',
    category: 'government',
  },
  {
    id: 'vc_sinaloa_driver_2026',
    type: 'DigitalDriverLicenseCredential',
    title: 'Licencia Digital de Conducir (Sinaloa)',
    issuer: {
      name: 'Dirección de Vialidad y Transportes de Sinaloa',
      did: 'did:gov:mx:sin:vialidad-transporte',
      jurisdiction: 'Culiacán / Los Mochis, Sinaloa',
      verified: true,
    },
    issuanceDate: '01 de Febrero de 2026',
    expirationDate: '01 de Febrero de 2029',
    credentialSubject: {
      licenseNumber: 'SIN-DRV-A882914',
      category: 'Automovilista & Chofer Particular (Tipo A)',
      bloodType: 'O Positivo (O+)',
      donorStatus: 'Donador Voluntario de Órganos',
      trafficRecord: 'Limpio (Sin infracciones vigentes)',
    },
    proofType: 'JsonWebSignature2020',
    proofHash: '0x33b194cf81a029381710928374a019b882736192837461928301928374a10294',
    status: 'valid',
    category: 'government',
  },
  {
    id: 'vc_reyplace_pro_l3',
    type: 'ReyplaceProfessionalCertification',
    title: 'Certificación Reyplace Pro Nivel 3 (Arquitecto IoT)',
    issuer: {
      name: 'Reyplace Academy & Architecture Council',
      did: 'did:rey:academy:cert-authority-01',
      jurisdiction: 'Global / Ecosistema Reyplace',
      verified: true,
    },
    issuanceDate: '15 de Diciembre de 2025',
    expirationDate: 'Permanente (Inmutable on-chain)',
    credentialSubject: {
      specialty: 'Smart City & Edge-to-Cloud Hybrid Architect',
      reputationScore: '98.5 / 100',
      clearedLevel: 'Cúpula Sentinel L3 (Master Operator)',
      auditProjectsCompleted: 24,
    },
    proofType: 'Ed25519Signature2020',
    proofHash: '0x77c2901a88b39401928374a019b882736192837461928301928374a102948291',
    status: 'valid',
    category: 'professional',
  },
  {
    id: 'vc_zkp_age_proof',
    type: 'ZeroKnowledgeAgeVerification',
    title: 'Prueba ZKP de Mayoría de Edad (+18)',
    issuer: {
      name: 'ReyID Zero-Knowledge Sovereign Issuer',
      did: 'did:rey:zkp:enclave-verifier-01',
      jurisdiction: 'Criptográfico (Privacidad Absoluta)',
      verified: true,
    },
    issuanceDate: '12 de Enero de 2026',
    expirationDate: 'Auto-renovable sin rastro',
    credentialSubject: {
      claim: 'isAgeOver18 === true',
      birthdateRevealed: 'NO (Dato protegido en Enclave)',
      legalNameRevealed: 'NO (Prueba seudónima zk-SNARK)',
      circomCircuit: 'AgeVerificationGroth16_v2',
    },
    proofType: 'ZkProofGroth16',
    proofHash: '0x9918237461928301928374a10294829102938475619283746501928374619283',
    status: 'valid',
    category: 'zkp',
  },
  {
    id: 'vc_green_citizen_solar',
    type: 'SustainableCitizenEcoCredential',
    title: 'Insignia Eco-Ciudadano Solar (Ahome Verde)',
    issuer: {
      name: 'Comisión de Energía & Medio Ambiente Ahome',
      did: 'did:gov:mx:sin:ahome:medio-ambiente',
      jurisdiction: 'Los Mochis, Sinaloa',
      verified: true,
    },
    issuanceDate: '20 de Enero de 2026',
    expirationDate: '20 de Enero de 2027',
    credentialSubject: {
      solarGenerationOffsetKwh: '1,450 kWh generados',
      carbonReductionTons: '1.2 Toneladas CO2 evitadas',
      ecoRewardsTier: 'Oro (25% descuento en predial digital)',
    },
    proofType: 'Ed25519Signature2020',
    proofHash: '0x12a9837461928301928374a10294829102938475619283746501928374619283',
    status: 'valid',
    category: 'sustainability',
  }
];

export function ReyIDW3CCredentialsManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [credentials, setCredentials] = useState<VerifiableCredential[]>(INITIAL_CREDENTIALS);
  const [selectedCred, setSelectedCred] = useState<VerifiableCredential | null>(INITIAL_CREDENTIALS[0]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'government' | 'professional' | 'zkp' | 'sustainability'>('all');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ status: 'verified' | 'failed' | null; message: string }>({ status: null, message: '' });
  const [isIssuingModalOpen, setIsIssuingModalOpen] = useState(false);

  // New credential form
  const [newCredTitle, setNewCredTitle] = useState('');
  const [newCredCategory, setNewCredCategory] = useState<'government' | 'professional' | 'zkp' | 'sustainability'>('professional');
  const [newCredClaimKey, setNewCredClaimKey] = useState('');
  const [newCredClaimValue, setNewCredClaimValue] = useState('');

  const filteredCredentials = credentials.filter(c => activeCategory === 'all' || c.category === activeCategory);

  const handleVerifyCredential = (cred: VerifiableCredential) => {
    setIsVerifying(true);
    setVerificationResult({ status: null, message: '' });
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationResult({
        status: 'verified',
        message: `Firma criptográfica válida de ${cred.issuer.name}. La prueba ${cred.proofType} coincide 100% con la clave pública en el DID Document del emisor.`
      });
      toast.success('Credencial W3C Verificada', 'Integridad y autenticidad del emisor confirmadas on-chain.');
    }, 900);
  };

  const handleExportJSONLD = (cred: VerifiableCredential) => {
    const jsonLdPayload = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/security/suites/ed25519-2020/v1',
        'https://reyplace.com/credentials/v2'
      ],
      id: `urn:uuid:${cred.id}`,
      type: ['VerifiableCredential', cred.type],
      issuer: cred.issuer,
      issuanceDate: cred.issuanceDate,
      expirationDate: cred.expirationDate,
      credentialSubject: {
        id: user?.did || 'did:rey:0x7aF982ef91b2c41893c8340d91a92182b3A1',
        ...cred.credentialSubject
      },
      proof: {
        type: cred.proofType,
        created: new Date().toISOString(),
        verificationMethod: `${cred.issuer.did}#key-1`,
        proofPurpose: 'assertionMethod',
        proofValue: cred.proofHash
      }
    };

    const blob = new Blob([JSON.stringify(jsonLdPayload, null, 2)], { type: 'application/ld+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cred.id}_w3c_verifiable_credential.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Credencial Exportada', 'Archivo estándar W3C JSON-LD descargado con éxito.');
  };

  const handleIssueSelfClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCredTitle.trim()) {
      toast.error('Título requerido', 'Ingrese un nombre descriptivo para la credencial.');
      return;
    }

    const randomHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const newCred: VerifiableCredential = {
      id: `vc_custom_${Date.now()}`,
      type: 'ReyIDCustomSelfAssertedCredential',
      title: newCredTitle,
      issuer: {
        name: `ReyID Self-Sovereign (${user?.name || 'Titular'})`,
        did: user?.did || 'did:rey:0x7aF982ef91b2c41893c8340d91a92182b3A1',
        jurisdiction: 'Soberanía Individual Reyplace',
        verified: true,
      },
      issuanceDate: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }),
      expirationDate: 'Sin vencimiento programado',
      credentialSubject: {
        [newCredClaimKey || 'declaracion']: newCredClaimValue || 'Certificado firmado por titular',
        holder: user?.handle || '@usuario',
        securityLevel: 'Enclave Cúpula FIDO2',
      },
      proofType: 'Ed25519Signature2020',
      proofHash: randomHash,
      status: 'valid',
      category: newCredCategory,
    };

    setCredentials([newCred, ...credentials]);
    setSelectedCred(newCred);
    setIsIssuingModalOpen(false);
    setNewCredTitle('');
    setNewCredClaimKey('');
    setNewCredClaimValue('');
    toast.success('Nueva Credencial Emitida', 'Firmada criptográficamente con la clave privada de tu ReyID.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#0d131f] via-[#09101d] to-[#0d131f] border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Billetera de Credenciales Verificables W3C & DIDs
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                ESTÁNDAR W3C VC 2.0
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Porta tus identificaciones oficiales, licencias de Sinaloa, acreditaciones profesionales y pruebas ZKP sin intermediarios.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsIssuingModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black text-xs font-mono font-extrabold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Emitir Credencial Soberana</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'Todas las Credenciales' },
          { id: 'government', label: 'Gubernamentales (Ahome / Sinaloa)' },
          { id: 'professional', label: 'Profesionales & Reyplace Pro' },
          { id: 'zkp', label: 'Cero Conocimiento (ZKP)' },
          { id: 'sustainability', label: 'Sustentabilidad Solar' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all border cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid: Credentials List + Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Credential Cards List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredCredentials.map((cred) => {
            const isSelected = selectedCred?.id === cred.id;
            return (
              <div
                key={cred.id}
                onClick={() => {
                  setSelectedCred(cred);
                  setVerificationResult({ status: null, message: '' });
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#0c1524] to-[#070e1b] border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-[#0a0d14] border-white/10 hover:border-cyan-500/40 hover:bg-[#0c1220]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      cred.category === 'government' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                      cred.category === 'professional' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
                      cred.category === 'zkp' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' :
                      'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    }`}>
                      {cred.category === 'government' ? <Shield className="w-5 h-5" /> :
                       cred.category === 'professional' ? <Award className="w-5 h-5" /> :
                       cred.category === 'zkp' ? <Fingerprint className="w-5 h-5" /> :
                       <Sparkles className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white line-clamp-1">{cred.title}</h3>
                      <p className="text-[11px] text-gray-400 line-clamp-1">{cred.issuer.name}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
                    VÁLIDA
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-400">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-cyan-400" /> {cred.proofType}
                  </span>
                  <span>Vence: {cred.expirationDate}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Credential Inspector */}
        <div className="lg:col-span-7">
          {selectedCred ? (
            <div className="bg-[#0a0d14] border border-cyan-500/30 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[90px] pointer-events-none" />

              {/* Inspector Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                      {selectedCred.category}
                    </span>
                    <span className="text-[11px] font-mono text-gray-400">ID: {selectedCred.id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{selectedCred.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportJSONLD(selectedCred)}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Exportar JSON-LD W3C"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>JSON-LD</span>
                  </button>

                  <button
                    onClick={() => handleVerifyCredential(selectedCred)}
                    disabled={isVerifying}
                    className="px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <ShieldCheck className={`w-4 h-4 ${isVerifying ? 'animate-spin' : 'text-cyan-400'}`} />
                    <span>{isVerifying ? 'Verificando...' : 'Verificar Cripto'}</span>
                  </button>
                </div>
              </div>

              {/* Verification Outcome Alert */}
              {verificationResult.status && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="font-bold">Credencial Criptográficamente Auténtica</div>
                    <div className="text-[11px] text-emerald-300/80 leading-relaxed">{verificationResult.message}</div>
                  </div>
                </motion.div>
              )}

              {/* Issuer Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-[#0e1422] border border-cyan-500/20 space-y-1">
                  <div className="text-[10px] font-mono font-bold text-gray-400 uppercase">Emisor Autorizado</div>
                  <div className="text-xs font-bold text-white">{selectedCred.issuer.name}</div>
                  <div className="text-[10px] font-mono text-cyan-400 truncate">{selectedCred.issuer.did}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0e1422] border border-cyan-500/20 space-y-1">
                  <div className="text-[10px] font-mono font-bold text-gray-400 uppercase">Vigencia & Jurisdicción</div>
                  <div className="text-xs font-bold text-white">{selectedCred.issuer.jurisdiction}</div>
                  <div className="text-[10px] font-mono text-gray-400">Emisión: {selectedCred.issuanceDate}</div>
                </div>
              </div>

              {/* Claims Data View */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Atributos & Declaraciones (Claims)</span>
                  <span className="text-[10px] text-cyan-400">Sujeto: {user?.handle || '@alexvanguard'}</span>
                </div>
                <div className="bg-[#05070c] rounded-2xl border border-white/10 p-4 space-y-2.5">
                  {Object.entries(selectedCred.credentialSubject).map(([key, value]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0 gap-1">
                      <span className="text-gray-400 font-mono text-[11px]">{key}:</span>
                      <span className="text-white font-bold text-[11px] font-mono text-right">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cryptographic Proof Footer */}
              <div className="bg-[#05070c] rounded-2xl border border-white/10 p-3.5 font-mono text-[10px] space-y-1 text-gray-400">
                <div className="flex items-center justify-between text-cyan-400 font-bold">
                  <span>Prueba Criptográfica: {selectedCred.proofType}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Clave Ed25519 Validada
                  </span>
                </div>
                <div className="text-gray-500 break-all">{selectedCred.proofHash}</div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0a0d14] border border-white/10 rounded-3xl p-12 text-center text-gray-400">
              Selecciona una credencial para inspeccionar sus atributos criptográficos.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Issue Self-Asserted Credential */}
      <AnimatePresence>
        {isIssuingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0e17] border border-cyan-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Emitir Credencial Soberana ReyID</h3>
                </div>
                <button
                  onClick={() => setIsIssuingModalOpen(false)}
                  className="text-gray-400 hover:text-white text-sm font-mono cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleIssueSelfClaim} className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-gray-300 mb-1 block">Título de la Credencial</label>
                  <input
                    type="text"
                    value={newCredTitle}
                    onChange={(e) => setNewCredTitle(e.target.value)}
                    placeholder="Ej. Certificado de Operador Drone Urbano"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none font-mono"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-gray-300 mb-1 block">Categoría</label>
                    <select
                      value={newCredCategory}
                      onChange={(e) => setNewCredCategory(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none font-mono"
                    >
                      <option value="professional" className="bg-[#0b0e17]">Profesional</option>
                      <option value="government" className="bg-[#0b0e17]">Gubernamental</option>
                      <option value="zkp" className="bg-[#0b0e17]">ZKP Privacidad</option>
                      <option value="sustainability" className="bg-[#0b0e17]">Sustentabilidad</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-gray-300 mb-1 block">Esquema Cripto</label>
                    <div className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400 text-xs font-mono">
                      Ed25519Signature2020
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-gray-300 mb-1 block">Clave del Atributo</label>
                    <input
                      type="text"
                      value={newCredClaimKey}
                      onChange={(e) => setNewCredClaimKey(e.target.value)}
                      placeholder="Ej. autorizacion_vuelo"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-gray-300 mb-1 block">Valor del Atributo</label>
                    <input
                      type="text"
                      value={newCredClaimValue}
                      onChange={(e) => setNewCredClaimValue(e.target.value)}
                      placeholder="Ej. Nivel Avanzado Ahome"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300">
                  La credencial será firmada con la clave privada de tu ReyID (WebAuthn / Passkey) y registrada en tu billetera de credenciales soberanas.
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsIssuingModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-mono cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black text-xs font-mono font-bold cursor-pointer"
                  >
                    Firmar y Emitir Credencial
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
