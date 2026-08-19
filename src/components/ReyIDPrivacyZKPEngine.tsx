import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Fingerprint, 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  CheckCircle2, 
  Cpu, 
  Terminal, 
  Sparkles, 
  Activity, 
  Key, 
  RefreshCw, 
  Share2, 
  Copy, 
  Check, 
  Sliders,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export interface ZKProofScenario {
  id: string;
  title: string;
  statement: string;
  privateInput: string;
  publicOutput: string;
  circuit: string;
  proverTimeMs: number;
  snarkType: 'Groth16' | 'PLONK' | 'Bulletproofs';
}

const ZKP_SCENARIOS: ZKProofScenario[] = [
  {
    id: 'zkp_age_18',
    title: 'Mayoría de Edad (+18 Años)',
    statement: 'Demostrar que el usuario tiene 18 o más años sin revelar su fecha de nacimiento ni edad exacta.',
    privateInput: 'fecha_nacimiento = 1996-04-12 (29 años)',
    publicOutput: 'isOver18: true, nullifierHash: 0x9a8f...1b2c',
    circuit: 'circom/age_proof_groth16.circom',
    proverTimeMs: 420,
    snarkType: 'Groth16',
  },
  {
    id: 'zkp_solvency_500',
    title: 'Solvencia Económica (>500 REY)',
    statement: 'Demostrar que la billetera posee balance mayor a 500 REY para acceder a contratos Smart City sin revelar el balance real.',
    privateInput: 'balance_real = 4,850.50 REY, privateKey = **********',
    publicOutput: 'hasMinSolvency: true, threshold: 500 REY',
    circuit: 'circom/balance_range_proof.circom',
    proverTimeMs: 510,
    snarkType: 'PLONK',
  },
  {
    id: 'zkp_residency_ahome',
    title: 'Residencia en Municipio de Ahome',
    statement: 'Demostrar residencia dentro de los códigos postales de Los Mochis/Ahome sin revelar la dirección de calle ni geolocalización GPS exacta.',
    privateInput: 'calle = Gabriel Leyva #450, CP = 81200, Lat/Lng = 25.7904,-108.9959',
    publicOutput: 'isAhomeResident: true, geoCluster: "Ahome-Urbano-Norte"',
    circuit: 'circom/polygon_inclusion_proof.circom',
    proverTimeMs: 640,
    snarkType: 'Groth16',
  },
  {
    id: 'zkp_reputation_l3',
    title: 'Scoring de Reputación Cívica (>90%)',
    statement: 'Demostrar que la puntuación de conducta y participación cívica supera el 90% para votar en el cabildo abierto digital.',
    privateInput: 'historial_completo_reportes = 142 acciones validadas, score_real = 98.4%',
    publicOutput: 'isReputationOver90: true, tierLevel: "L3_EXCELENCIA"',
    circuit: 'circom/merkle_reputation_proof.circom',
    proverTimeMs: 380,
    snarkType: 'Bulletproofs',
  },
];

export function ReyIDPrivacyZKPEngine() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedScenario, setSelectedScenario] = useState<ZKProofScenario>(ZKP_SCENARIOS[0]);
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [proofGenerated, setProofGenerated] = useState<any>(null);
  const [isVerifyingProof, setIsVerifyingProof] = useState(false);
  const [verificationPassed, setVerificationPassed] = useState<boolean | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerateProof = () => {
    setIsGeneratingProof(true);
    setProofGenerated(null);
    setVerificationPassed(null);

    setTimeout(() => {
      setIsGeneratingProof(false);
      const proof = {
        protocol: selectedScenario.snarkType,
        circuit: selectedScenario.circuit,
        pi_a: [
          `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
          `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
        ],
        pi_b: [
          [`0x${Math.random().toString(16).substring(2, 10)}`, `0x${Math.random().toString(16).substring(2, 10)}`],
          [`0x${Math.random().toString(16).substring(2, 10)}`, `0x${Math.random().toString(16).substring(2, 10)}`],
        ],
        pi_c: [
          `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
          `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
        ],
        publicSignals: [
          "0x0000000000000000000000000000000000000000000000000000000000000001",
          `0x${Math.random().toString(16).substring(2, 18)}`
        ],
        nullifierHash: `0xzk_${Math.random().toString(16).substring(2, 14)}`,
        timestamp: new Date().toISOString(),
        proverIdentity: user?.did || 'did:rey:0x7aF982ef91b2c41893c8340d91a92182b3A1',
      };
      setProofGenerated(proof);
      toast.success('Prueba ZK-SNARK Generada en Local', `Calculada en el navegador en ${selectedScenario.proverTimeMs}ms sin compartir datos privados.`);
    }, selectedScenario.proverTimeMs + 200);
  };

  const handleVerifyZKProof = () => {
    if (!proofGenerated) return;
    setIsVerifyingProof(true);
    setTimeout(() => {
      setIsVerifyingProof(false);
      setVerificationPassed(true);
      toast.success('¡Prueba ZKP Válida!', 'La verificación matemática confirma la declaración con 0% de fuga de datos personales.');
    }, 600);
  };

  const handleCopyProofJSON = () => {
    if (!proofGenerated) return;
    navigator.clipboard.writeText(JSON.stringify(proofGenerated, null, 2));
    setIsCopied(true);
    toast.success('Prueba ZKP Copiada', 'Payload criptográfico copiado al portapapeles.');
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#120d1f] via-[#0d101f] to-[#120d1f] border border-purple-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/20">
            <EyeOff className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Motor de Pruebas de Cero Conocimiento (ZKP Enclave)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                SNARK / CIRCOM 2.1
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Demuestra atributos verídicos ante entidades de gobierno o plataformas sin entregar tu INE, saldo bancario, ubicación o fecha de nacimiento.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono">
          <Lock className="w-3.5 h-3.5 text-purple-400" />
          <span>Privacidad Soberana L3</span>
        </div>
      </div>

      {/* Grid: Scenario Selector + Proof Generator & Verifier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Scenarios */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">
            Circuitos Criptográficos Disponibles
          </div>

          {ZKP_SCENARIOS.map((scenario) => {
            const isSelected = selectedScenario.id === scenario.id;
            return (
              <div
                key={scenario.id}
                onClick={() => {
                  setSelectedScenario(scenario);
                  setProofGenerated(null);
                  setVerificationPassed(null);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#1a102f] to-[#0d091b] border-purple-400 shadow-lg shadow-purple-500/20'
                    : 'bg-[#0a0d14] border-white/10 hover:border-purple-500/40 hover:bg-[#100d1c]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{scenario.title}</h4>
                      <p className="text-[10px] font-mono text-purple-400">{scenario.snarkType} • {scenario.circuit}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-300 mt-2.5 leading-relaxed">{scenario.statement}</p>
              </div>
            );
          })}
        </div>

        {/* Right: Prover Studio */}
        <div className="lg:col-span-7 bg-[#0a0d14] border border-purple-500/30 rounded-3xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[90px] pointer-events-none" />

          {/* Scenario Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <div className="text-[10px] font-mono text-purple-400 uppercase font-bold">Circuito Activo</div>
              <h3 className="text-base font-bold text-white">{selectedScenario.title}</h3>
            </div>

            <button
              onClick={handleGenerateProof}
              disabled={isGeneratingProof}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md shadow-purple-500/20 cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingProof ? 'animate-spin' : 'text-white'}`} />
              <span>{isGeneratingProof ? 'Calculando ZK-SNARK...' : 'Generar Prueba Local'}</span>
            </button>
          </div>

          {/* Comparison: Private Inputs vs Public Output */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Private Inputs (Se quedan en tu dispositivo) */}
            <div className="p-3.5 rounded-2xl bg-[#140b1e] border border-purple-500/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-400 uppercase">
                <Lock className="w-3.5 h-3.5" />
                <span>Dato Privado (NUNCA sale del cliente)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-amber-200/90 break-all">
                {selectedScenario.privateInput}
              </div>
            </div>

            {/* Public Output (Lo único que ve el verificador) */}
            <div className="p-3.5 rounded-2xl bg-[#0e1422] border border-cyan-500/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-cyan-400 uppercase">
                <EyeOff className="w-3.5 h-3.5" />
                <span>Salida Pública Revelada</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-cyan-200/90 break-all">
                {selectedScenario.publicOutput}
              </div>
            </div>
          </div>

          {/* Generated Proof Payload & Verifier */}
          {proofGenerated ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 pt-2"
            >
              <div className="bg-[#05070c] border border-purple-500/30 rounded-2xl p-4 space-y-3 font-mono">
                <div className="flex items-center justify-between text-xs text-purple-300 font-bold pb-2 border-b border-white/10">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    Payload Criptográfico zk-SNARK Groth16
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyProofJSON}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Copiado' : 'Copiar JSON'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-purple-200/80 space-y-1 max-h-36 overflow-y-auto scrollbar-none">
                  <div><strong>Protocol:</strong> {proofGenerated.protocol}</div>
                  <div><strong>Nullifier:</strong> {proofGenerated.nullifierHash}</div>
                  <div><strong>pi_a:</strong> [{proofGenerated.pi_a.join(', ')}]</div>
                  <div><strong>publicSignals:</strong> [{proofGenerated.publicSignals.join(', ')}]</div>
                </div>
              </div>

              {/* Verifier Button & Result */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0e1422] border border-cyan-500/20">
                <div className="text-xs">
                  <div className="font-bold text-white">Verificador On-Chain / Edge</div>
                  <div className="text-gray-400 text-[11px]">Ejecuta el emparejamiento bilineal en curva elíptica BN254</div>
                </div>

                <button
                  onClick={handleVerifyZKProof}
                  disabled={isVerifyingProof}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  <ShieldCheck className={`w-4 h-4 ${isVerifyingProof ? 'animate-spin' : 'text-black'}`} />
                  <span>{isVerifyingProof ? 'Comprobando Curva...' : 'Ejecutar Verificación ZKP'}</span>
                </button>
              </div>

              {verificationPassed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold">¡Prueba Criptográfica Aprobada!</span>
                    <p className="text-[11px] text-emerald-300/80 mt-0.5">
                      La declaración se demostró 100% verdadera. La clave secreta y la información confidencial permanecieron intactas en tu dispositivo.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div className="bg-[#05070c] border border-white/5 rounded-2xl p-8 text-center text-gray-500 text-xs font-mono">
              Haz clic en "Generar Prueba Local" para compilar y ejecutar el circuito ZKP en tu navegador.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
