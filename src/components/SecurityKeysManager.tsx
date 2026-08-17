import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  KeyRound,
  Fingerprint,
  Scan,
  Smartphone,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Copy,
  Check,
  Clock,
  Cpu,
  Lock,
  Eye,
  ArrowUpRight,
  Info,
  PauseCircle,
  PlayCircle,
  Hash,
  Download,
  Database,
  Sparkles,
  X
} from 'lucide-react';
import type { WebAuthnDevice } from '../types';
import { registerWebAuthnCredential, authenticateWithWebAuthn } from '../lib/webauthn';
import { useToast } from '../context/ToastContext';

interface SecurityKeysManagerProps {
  devices: WebAuthnDevice[];
  onDevicesChange: (devices: WebAuthnDevice[]) => void;
  onTriggerSync?: (actionLabel: string) => void;
  onAddAuditLog?: (action: string, module: string, status: 'confirmed' | 'failed') => void;
}

export function SecurityKeysManager({
  devices,
  onDevicesChange,
  onTriggerSync,
  onAddAuditLog,
}: SecurityKeysManagerProps) {
  const { toast } = useToast();

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'revoked'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'fingerprint' | 'faceid' | 'hardware_key' | 'passkey'>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [renamingDevice, setRenamingDevice] = useState<WebAuthnDevice | null>(null);
  const [newNameInput, setNewNameInput] = useState('');
  const [revokingDevice, setRevokingDevice] = useState<WebAuthnDevice | null>(null);
  const [selectedDetailsDevice, setSelectedDetailsDevice] = useState<WebAuthnDevice | null>(null);

  // Testing device state
  const [testingDeviceId, setTestingDeviceId] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // New Device Form state
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyType, setNewKeyType] = useState<'fingerprint' | 'faceid' | 'hardware_key' | 'passkey'>('fingerprint');
  const [newKeyAttachment, setNewKeyAttachment] = useState<'platform' | 'cross-platform'>('platform');
  const [newKeyAlgorithm, setNewKeyAlgorithm] = useState<'ES256' | 'Ed25519' | 'RS256'>('ES256');

  // Copy state helper
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copiado al Portapapeles', text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered devices
  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.credentialId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.algorithm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (device.publicKeyFingerprint && device.publicKeyFingerprint.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    const matchesType = typeFilter === 'all' || device.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate statistics
  const totalKeys = devices.length;
  const activeKeys = devices.filter((d) => d.status === 'active').length;
  const suspendedKeys = devices.filter((d) => d.status === 'suspended').length;
  const revokedKeys = devices.filter((d) => d.status === 'revoked').length;
  const hardwareKeys = devices.filter((d) => d.type === 'hardware_key').length;

  // 1. Rename Device Handler
  const handleOpenRename = (device: WebAuthnDevice) => {
    setRenamingDevice(device);
    setNewNameInput(device.name);
  };

  const handleSaveRename = () => {
    if (!renamingDevice) return;
    const trimmed = newNameInput.trim();
    if (!trimmed) {
      toast.error('Nombre Inválido', 'El nombre de la llave no puede estar vacío.');
      return;
    }

    const previousName = renamingDevice.name;
    const updatedDevices = devices.map((d) =>
      d.id === renamingDevice.id ? { ...d, name: trimmed } : d
    );

    onDevicesChange(updatedDevices);
    toast.success(
      'Nombre de Llave Actualizado',
      `"${previousName}" ha sido renombrada a "${trimmed}". Sincronizado en ReyID.`
    );

    onTriggerSync?.(`Renombrado de Llave: ${trimmed}`);
    onAddAuditLog?.(`Renombrado de Llave: ${trimmed}`, 'Seguridad ReyID', 'confirmed');
    setRenamingDevice(null);
    setNewNameInput('');
  };

  // 2. Revoke Device Handler
  const handleOpenRevoke = (device: WebAuthnDevice) => {
    setRevokingDevice(device);
  };

  const handleConfirmRevoke = () => {
    if (!revokingDevice) return;

    const targetId = revokingDevice.id;
    const targetName = revokingDevice.name;

    // Mark as revoked (keeping audit trail) or remove if already revoked
    const updatedDevices = devices.map((d) =>
      d.id === targetId
        ? {
            ...d,
            status: 'revoked' as const,
            lastUsedAt: `Revocada el ${new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}`,
          }
        : d
    );

    onDevicesChange(updatedDevices);
    toast.error(
      'Credencial Biométrica Revocada',
      `La llave "${targetName}" ha sido revocada de forma inmediata. Ya no podrá utilizarse para 2FA o firmas.`
    );

    onTriggerSync?.(`Revocación de Llave Biometría: ${targetName}`);
    onAddAuditLog?.(`Revocación FIDO2: ${targetName}`, 'Cúpula Digital', 'confirmed');
    setRevokingDevice(null);
  };

  // Permanent Delete Handler (for already revoked keys)
  const handlePermanentDelete = (deviceId: string, deviceName: string) => {
    const updatedDevices = devices.filter((d) => d.id !== deviceId);
    onDevicesChange(updatedDevices);
    toast.info(
      'Registro Eliminado',
      `La credencial revocada "${deviceName}" fue purgada del almacenamiento local.`
    );
    onTriggerSync?.(`Purgado de Llave: ${deviceName}`);
    onAddAuditLog?.(`Purgado Llave Revocada: ${deviceName}`, 'Seguridad ReyID', 'confirmed');
    setRevokingDevice(null);
  };

  // 3. Suspend / Activate Toggle
  const handleToggleSuspend = (device: WebAuthnDevice) => {
    const isCurrentlyActive = device.status === 'active';
    const newStatus = isCurrentlyActive ? ('suspended' as const) : ('active' as const);

    const updatedDevices = devices.map((d) =>
      d.id === device.id ? { ...d, status: newStatus } : d
    );

    onDevicesChange(updatedDevices);
    if (newStatus === 'suspended') {
      toast.warning(
        'Llave Suspendida Temporalmente',
        `"${device.name}" ha sido pausada. Puedes reactivarla en cualquier momento.`
      );
      onTriggerSync?.(`Suspensión de Llave: ${device.name}`);
      onAddAuditLog?.(`Suspensión Llave: ${device.name}`, 'Seguridad ReyID', 'confirmed');
    } else {
      toast.success(
        'Llave Reactivada',
        `"${device.name}" está nuevamente activa y autorizada para firmas biométricas.`
      );
      onTriggerSync?.(`Reactivación de Llave: ${device.name}`);
      onAddAuditLog?.(`Reactivación Llave: ${device.name}`, 'Seguridad ReyID', 'confirmed');
    }
  };

  // 4. Test Biometric Key Verification (WebAuthn Challenge)
  const handleTestKey = async (device: WebAuthnDevice) => {
    if (device.status === 'revoked') {
      toast.error('Llave Revocada', 'No es posible autenticarse con una credencial revocada.');
      return;
    }
    if (device.status === 'suspended') {
      toast.warning('Llave Suspendida', 'Reactiva la llave antes de realizar la verificación biométrica.');
      return;
    }

    setTestingDeviceId(device.id);
    try {
      const result = await authenticateWithWebAuthn(device.credentialId);
      if (result.success) {
        const updatedDevices = devices.map((d) =>
          d.id === device.id ? { ...d, lastUsedAt: 'Hace unos instantes' } : d
        );
        onDevicesChange(updatedDevices);

        toast.success(
          '¡Verificación Biométrica Exitosa!',
          `Identidad confirmada en "${device.name}". Firma FIDO2: ${result.signature.substring(0, 14)}...`
        );
        onTriggerSync?.(`Verificación Exitosa: ${device.name}`);
        onAddAuditLog?.(`Autenticación WebAuthn (${device.name})`, 'WebAuthn 2FA', 'confirmed');
      } else {
        toast.error('Error Biométrico', 'No se recibió la confirmación del sensor.');
        onAddAuditLog?.(`Fallo Biométrico (${device.name})`, 'WebAuthn 2FA', 'failed');
      }
    } catch {
      toast.error('Operación Cancelada', 'La solicitud de autenticación fue cancelada por el usuario.');
    } finally {
      setTestingDeviceId(null);
    }
  };

  // 5. Register New Key (WebAuthn Native Flow)
  const handleRegisterNewKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      toast.error('Nombre Obligatorio', 'Ingresa un alias o nombre para identificar la nueva llave.');
      return;
    }

    setIsRegistering(true);
    try {
      const cred = await registerWebAuthnCredential('reyid-user-master', newKeyName.trim());

      const rawHash = `0x${Array.from(new Uint8Array(20), () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      const newDev: WebAuthnDevice = {
        id: `wa_dev_${Date.now()}`,
        name: newKeyName.trim(),
        type: newKeyType,
        credentialId: cred.rawId.substring(0, 22) + '...',
        registeredAt: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }),
        lastUsedAt: 'Recién creada',
        authenticatorAttachment: newKeyAttachment,
        status: 'active',
        algorithm: newKeyAlgorithm,
        publicKeyFingerprint: `SHA256:${rawHash.substring(2, 18).toUpperCase()}`,
        aaguid: newKeyType === 'hardware_key' ? 'cbfe69d0-cbd9-409b-96e3-d0f510329e50' : '00000000-0000-0000-0000-000000000000',
        transports: newKeyAttachment === 'platform' ? ['internal'] : ['usb', 'nfc'],
        backupState: true,
      };

      onDevicesChange([newDev, ...devices]);
      setIsAddModalOpen(false);
      setNewKeyName('');
      toast.success(
        '¡Llave de Seguridad Registrada!',
        `"${newDev.name}" ha sido vinculada al Enclave Seguro con algoritmo ${newDev.algorithm}.`
      );

      onTriggerSync?.(`Alta de Llave de Seguridad: ${newDev.name}`);
      onAddAuditLog?.(`Registro de Llave FIDO2 (${newDev.name})`, 'Seguridad ReyID', 'confirmed');
    } catch {
      toast.error('Error al Registrar', 'No se pudo generar la credencial criptográfica.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Stats Overview */}
      <div className="bg-[#111112] border border-cyan-500/20 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-3xl animate-liquid-morph pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-purple-500/10 blur-3xl animate-liquid-morph-slow pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white tracking-tight">
                    Gestión de Llaves de Seguridad & Credenciales Biométricas
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/30 uppercase">
                    FIDO2 / WebAuthn
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Administra, renombra, prueba y revoca credenciales físicas y passkeys asociadas a tu ReyID.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" /> Registrar Nueva Llave de Seguridad
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10 relative z-10 font-mono">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">Total Llaves</div>
              <div className="text-lg font-bold text-white mt-0.5">{totalKeys}</div>
            </div>
            <KeyRound className="w-5 h-5 text-cyan-400 opacity-80" />
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-emerald-400 uppercase tracking-widest">Activas (2FA)</div>
              <div className="text-lg font-bold text-emerald-300 mt-0.5">{activeKeys}</div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-amber-400 uppercase tracking-widest">Pausadas</div>
              <div className="text-lg font-bold text-amber-300 mt-0.5">{suspendedKeys}</div>
            </div>
            <PauseCircle className="w-5 h-5 text-amber-400" />
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-rose-400 uppercase tracking-widest">Revocadas</div>
              <div className="text-lg font-bold text-rose-300 mt-0.5">{revokedKeys}</div>
            </div>
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#111112] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, ID o algoritmo..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-gray-500 focus:border-cyan-500 outline-none font-mono"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end text-xs font-mono">
          {/* Status Filter */}
          <div className="flex bg-black/50 p-1 rounded-xl border border-white/5">
            {(['all', 'active', 'suspended', 'revoked'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  statusFilter === st
                    ? st === 'active'
                      ? 'bg-emerald-500 text-black font-extrabold'
                      : st === 'suspended'
                      ? 'bg-amber-500 text-black font-extrabold'
                      : st === 'revoked'
                      ? 'bg-rose-500 text-white font-extrabold'
                      : 'bg-cyan-500 text-black font-extrabold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {st === 'all' ? 'Todas' : st === 'active' ? 'Activas' : st === 'suspended' ? 'Pausadas' : 'Revocadas'}
              </button>
            ))}
          </div>

          {/* Type Filter dropdown */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="bg-black/60 border border-white/10 text-gray-300 rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-cyan-500"
          >
            <option value="all">Tipo: Todos</option>
            <option value="fingerprint">Huella / Touch ID</option>
            <option value="faceid">Face ID / Facial</option>
            <option value="hardware_key">Llave Física / YubiKey</option>
            <option value="passkey">Passkey FIDO2</option>
          </select>
        </div>
      </div>

      {/* Security Keys Grid */}
      {filteredDevices.length === 0 ? (
        <div className="bg-[#111112] border border-white/5 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-500">
            <KeyRound className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No se encontraron llaves de seguridad</h3>
            <p className="text-xs text-gray-400 font-mono max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Prueba modificando los filtros o el término de búsqueda.'
                : 'No tienes llaves biométricas registradas aún. Añade tu primer dispositivo.'}
            </p>
          </div>
          {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-cyan-400 font-mono font-bold"
            >
              Restablecer Filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDevices.map((device) => {
            const isTesting = testingDeviceId === device.id;
            const isRevoked = device.status === 'revoked';
            const isSuspended = device.status === 'suspended';
            const isActive = device.status === 'active';

            return (
              <motion.div
                key={device.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`bg-[#111112] rounded-3xl p-6 space-y-5 border transition-all duration-300 relative group shadow-xl ${
                  isRevoked
                    ? 'border-rose-500/30 opacity-70 bg-rose-950/10'
                    : isSuspended
                    ? 'border-amber-500/30 bg-amber-950/10'
                    : 'border-white/10 hover:border-cyan-500/50 hover:shadow-cyan-500/10'
                }`}
              >
                {/* Header: Device Icon & Name with Quick Rename */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                        isRevoked
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          : isSuspended
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : device.type === 'fingerprint'
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                          : device.type === 'faceid'
                          ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                          : device.type === 'hardware_key'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      {device.type === 'fingerprint' && <Fingerprint className="w-6 h-6" />}
                      {device.type === 'faceid' && <Scan className="w-6 h-6" />}
                      {device.type === 'hardware_key' && <KeyRound className="w-6 h-6" />}
                      {device.type === 'passkey' && <Smartphone className="w-6 h-6" />}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                          {device.name}
                        </h3>
                        {!isRevoked && (
                          <button
                            onClick={() => handleOpenRename(device)}
                            className="text-gray-500 hover:text-cyan-400 p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                            title="Renombrar Llave"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                        <span className="uppercase text-cyan-400 font-bold">{device.algorithm}</span>
                        <span>•</span>
                        <span className="text-gray-300">{device.authenticatorAttachment}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator Badge */}
                  <div>
                    {isActive && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Activa
                      </span>
                    )}
                    {isSuspended && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/30">
                        <PauseCircle className="w-3 h-3" />
                        Pausada
                      </span>
                    )}
                    {isRevoked && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 text-[10px] font-mono font-bold border border-rose-500/30">
                        <ShieldAlert className="w-3 h-3" />
                        Revocada
                      </span>
                    )}
                  </div>
                </div>

                {/* Credential Data Metadata Box */}
                <div className="space-y-2 text-xs font-mono bg-black/50 p-3.5 rounded-2xl border border-white/5 text-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">ID Credencial:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-300 font-semibold text-[11px]">{device.credentialId}</span>
                      <button
                        onClick={() => handleCopyText(device.credentialId, device.id)}
                        className="text-gray-500 hover:text-cyan-300 p-0.5 rounded transition-colors"
                        title="Copiar ID"
                      >
                        {copiedId === device.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {device.publicKeyFingerprint && (
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">Fingerprint:</span>
                      <span className="text-cyan-400 text-[10px] truncate max-w-[170px]">
                        {device.publicKeyFingerprint}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">Registrada:</span>
                    <span className="text-gray-300 text-[11px]">{device.registeredAt}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">Último Uso:</span>
                    <span className={isRevoked ? 'text-rose-400 text-[11px]' : 'text-emerald-400 text-[11px] font-semibold'}>
                      {device.lastUsedAt}
                    </span>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center gap-2 pt-1">
                  {/* Test verification button */}
                  <button
                    onClick={() => handleTestKey(device)}
                    disabled={isTesting || isRevoked}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 ${
                      isActive
                        ? 'bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 shadow-md shadow-cyan-950/30'
                        : 'bg-white/5 text-gray-400 border border-white/10'
                    }`}
                  >
                    {isTesting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                        <span>Verificando...</span>
                      </>
                    ) : (
                      <>
                        <Scan className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Probar Biometría</span>
                      </>
                    )}
                  </button>

                  {/* Details View Button */}
                  <button
                    onClick={() => setSelectedDetailsDevice(device)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
                    title="Detalles Criptográficos"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Suspend / Resume Button */}
                  {!isRevoked && (
                    <button
                      onClick={() => handleToggleSuspend(device)}
                      className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                        isSuspended
                          ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 text-amber-400'
                      }`}
                      title={isSuspended ? 'Reactivar Llave' : 'Suspender Temporalmente'}
                    >
                      {isSuspended ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
                    </button>
                  )}

                  {/* Revoke / Delete Button */}
                  <button
                    onClick={() => {
                      if (isRevoked) {
                        handlePermanentDelete(device.id, device.name);
                      } else {
                        handleOpenRevoke(device);
                      }
                    }}
                    className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                    title={isRevoked ? 'Eliminar Registro' : 'Revocar Credencial'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: Rename Device Modal */}
      <AnimatePresence>
        {renamingDevice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#111112] border border-cyan-500/30 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                    <Edit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Renombrar Llave de Seguridad</h3>
                    <p className="text-xs text-gray-400 font-mono">Modifica el alias de tu credencial biométrica</p>
                  </div>
                </div>
                <button
                  onClick={() => setRenamingDevice(null)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 font-mono">
                <label className="text-xs text-gray-300 block font-bold">
                  Nuevo Nombre o Alias Descriptivo:
                </label>
                <input
                  type="text"
                  value={newNameInput}
                  onChange={(e) => setNewNameInput(e.target.value)}
                  placeholder="ej. MacBook Pro M3 de Trabajo, YubiKey 5 NFC..."
                  className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-cyan-500/40 text-xs text-white placeholder-gray-500 focus:border-cyan-400 outline-none"
                  autoFocus
                />

                {/* Suggestions Pills */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Sugerencias rápidas:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Touch ID Personal',
                      'iPhone Face ID',
                      'YubiKey Principal',
                      'Windows Hello Oficina',
                      'Passkey iCloud Enclave',
                    ].map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setNewNameInput(sug)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-[11px] text-gray-300 hover:text-cyan-300 border border-white/5 cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10 font-mono">
                <button
                  type="button"
                  onClick={() => setRenamingDevice(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveRename}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/30 cursor-pointer"
                >
                  Guardar Nombre
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Revoke Key Confirmation Modal */}
      <AnimatePresence>
        {revokingDevice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#111112] border border-rose-500/40 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center gap-3 border-b border-rose-500/20 pb-4">
                <div className="p-3 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">¿Revocar Credencial de Seguridad?</h3>
                  <p className="text-xs text-rose-400/80 font-mono">Acción de seguridad irreversible</p>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-gray-300 space-y-2">
                  <p className="text-white font-bold">
                    Estás a punto de revocar la llave: <span className="text-rose-400 font-extrabold">"{revokingDevice.name}"</span>
                  </p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Al revocar esta credencial, ningún atacante ni usuario podrá iniciar sesión o firmar transacciones con este hardware o enclave biométrico.
                  </p>
                </div>

                <div className="bg-black/50 p-3.5 rounded-2xl border border-white/5 space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-gray-400">
                    <span>ID de Credencial:</span>
                    <span className="text-gray-200 font-bold">{revokingDevice.credentialId}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Algoritmo / Tipo:</span>
                    <span className="text-cyan-400">{revokingDevice.algorithm} ({revokingDevice.type})</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Registrada:</span>
                    <span>{revokingDevice.registeredAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-white/10 font-mono">
                <button
                  type="button"
                  onClick={() => setRevokingDevice(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleConfirmRevoke}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg shadow-rose-950/40 cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Confirmar Revocación</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Add New WebAuthn Key Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#111112] border border-cyan-500/30 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Vincular Nueva Llave de Seguridad</h3>
                    <p className="text-xs text-gray-400 font-mono">Firma criptográfica en Enclave Seguro (FIDO2)</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRegisterNewKey} className="space-y-5 font-mono">
                {/* Name field */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-bold block">
                    Nombre o Etiqueta del Dispositivo:
                  </label>
                  <input
                    type="text"
                    required
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="ej. MacBook Pro M3, YubiKey 5 NFC, iPhone 15 Pro..."
                    className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-gray-500 outline-none"
                  />
                </div>

                {/* Key Type Selection */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-300 font-bold block">
                    Tipo de Autenticador Biométrico:
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'fingerprint', label: 'Huella / Touch ID', icon: Fingerprint },
                      { id: 'faceid', label: 'Face ID / Facial', icon: Scan },
                      { id: 'hardware_key', label: 'Llave YubiKey FIDO2', icon: KeyRound },
                      { id: 'passkey', label: 'Passkey Móvil Enclave', icon: Smartphone },
                    ].map((type) => {
                      const Icon = type.icon;
                      const isSelected = newKeyType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setNewKeyType(type.id as any)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                            isSelected
                              ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-950/20'
                              : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="text-[11px] font-bold">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Attachment & Algorithm */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-gray-400 block font-bold">Acoplamiento:</label>
                    <select
                      value={newKeyAttachment}
                      onChange={(e) => setNewKeyAttachment(e.target.value as any)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-500"
                    >
                      <option value="platform">Plataforma (Integrada)</option>
                      <option value="cross-platform">Cross-Platform (USB / NFC)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] text-gray-400 block font-bold">Algoritmo Cripto:</label>
                    <select
                      value={newKeyAlgorithm}
                      onChange={(e) => setNewKeyAlgorithm(e.target.value as any)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-500"
                    >
                      <option value="ES256">ES256 (NIST P-256)</option>
                      <option value="Ed25519">Ed25519 (EdDSA)</option>
                      <option value="RS256">RS256 (RSA 2048)</option>
                    </select>
                  </div>
                </div>

                {/* Security Advice info */}
                <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-[11px] text-gray-300 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <p>
                    Al presionar "Generar Credencial", el navegador solicitará tu huella digital, rostro o tocar tu llave de seguridad.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-bold transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isRegistering ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Invocando Sensor...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Generar Credencial</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: Key Cryptographic Details Modal */}
      <AnimatePresence>
        {selectedDetailsDevice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#111112] border border-cyan-500/30 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Inspección Criptográfica FIDO2</h3>
                    <p className="text-xs text-gray-400 font-mono">{selectedDetailsDevice.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDetailsDevice(null)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="bg-black/60 p-4 rounded-2xl border border-white/5 space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">ID de Credencial:</span>
                    <span className="text-cyan-300 font-bold">{selectedDetailsDevice.credentialId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Algoritmo de Firma:</span>
                    <span className="text-white font-bold">{selectedDetailsDevice.algorithm} (FIDO2 / W3C)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tipo de Acoplamiento:</span>
                    <span className="text-gray-300">{selectedDetailsDevice.authenticatorAttachment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Huella Criptográfica SHA-256:</span>
                    <span className="text-emerald-400 text-[10px]">
                      {selectedDetailsDevice.publicKeyFingerprint || 'SHA256:8F9B2C4E...A177'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">AAGUID de Autenticador:</span>
                    <span className="text-gray-400 text-[10px]">
                      {selectedDetailsDevice.aaguid || '00000000-0000-0000-0000-000000000000'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Transportes Permitidos:</span>
                    <span className="text-cyan-400">
                      {selectedDetailsDevice.transports?.join(', ') || 'internal, usb, nfc'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Copia de Seguridad (Sync):</span>
                    <span className="text-emerald-400 font-bold">Habilitada (Passkey Multi-Device)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-[11px] text-gray-300 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    Enclave Seguro y Zero-Trust
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    La clave privada reside exclusivamente en el hardware biométrico. Solo la clave pública y el contador de firmas se sincronizan en la red Reyplace.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10 font-mono">
                <button
                  type="button"
                  onClick={() => {
                    const jsonStr = JSON.stringify(selectedDetailsDevice, null, 2);
                    const blob = new Blob([jsonStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `reyid_key_${selectedDetailsDevice.id}.json`;
                    a.click();
                    toast.success('Metadatos Exportados', 'Archivo JSON generado.');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-cyan-300 font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar JSON</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDetailsDevice(null)}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
