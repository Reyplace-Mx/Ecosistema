import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Shield, 
  Ghost, 
  FileText, 
  Send, 
  Paperclip,
  CheckCircle,
  Hash,
  Database,
  Search,
  Lock,
  Cpu,
  Star,
  Users,
  EyeOff,
  Zap,
  Info
} from 'lucide-react';
import type { ChatRoom, ChatMessage } from '../types';

const MOCK_ROOMS: ChatRoom[] = [
  {
    id: 'room_1',
    name: 'Consejo Fundadores',
    type: 'vip',
    participants: 4,
    lastMessage: 'Contrato inteligente desplegado.',
    lastMessageTime: '10:42 AM',
    unread: 2,
    securityStatus: 'secure'
  },
  {
    id: 'room_2',
    name: 'Operaciones Nodo 3',
    type: 'group',
    participants: 12,
    lastMessage: 'Sincronización completa.',
    lastMessageTime: 'Ayer',
    unread: 0,
    securityStatus: 'secure'
  },
  {
    id: 'room_3',
    name: 'Contacto Seguro A.',
    type: 'direct',
    participants: 2,
    lastMessage: 'Información confidencial recibida.',
    lastMessageTime: 'Hace 2 días',
    unread: 0,
    securityStatus: 'ghost_mode'
  }
];

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    senderId: 'usr_2',
    senderName: 'Elena V.',
    content: 'Revisando los parámetros de seguridad del nuevo módulo. Todo parece estar en orden según los requerimientos de la Cúpula Digital.',
    timestamp: '10:30 AM',
    isCertified: false,
    encryptionLevel: 'quantum'
  },
  {
    id: 'msg_2',
    senderId: 'me',
    senderName: 'Alex Vanguard',
    content: 'Adjunto el contrato para la validación final. Requiere firma multisig.',
    timestamp: '10:35 AM',
    isCertified: true,
    encryptionLevel: 'quantum',
    attachment: {
      name: 'Contrato_Base_v2.pdf',
      type: 'contract',
      size: '2.4 MB'
    }
  },
  {
    id: 'msg_3',
    senderId: 'usr_3',
    senderName: 'David R.',
    content: 'Procedo a verificar los hashes en la cadena principal. Confirmaré en breve.',
    timestamp: '10:38 AM',
    isCertified: true,
    encryptionLevel: 'quantum'
  }
];

export function UnionLiveDashboard() {
  const [activeRoomId, setActiveRoomId] = useState<string>(MOCK_ROOMS[0].id);
  const [messageText, setMessageText] = useState('');
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [isCertified, setIsCertified] = useState(false);

  const activeRoom = MOCK_ROOMS.find(r => r.id === activeRoomId) || MOCK_ROOMS[0];

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto h-[calc(100vh-64px)] flex flex-col animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 tracking-tight flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-500" />
            Unión.live <span className="text-slate-400 dark:text-gray-600 font-medium text-2xl">/ Secure Chat</span>
          </h1>
          <p className="text-slate-500 dark:text-gray-400 mt-2 font-medium">Comunicación privada, cifrada y descentralizada. Integrado con ReyID y Cúpula Digital.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-green-500/10 border border-emerald-200 dark:border-green-500/20 text-emerald-700 dark:text-green-400 rounded-lg text-sm shadow-sm">
            <Shield className="w-4 h-4" />
            <span className="font-bold">Cifrado Cuántico Activo</span>
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Column: Chat List */}
        <div className="lg:col-span-3 flex flex-col bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#0c0c0d]">
            <div className="flex items-center gap-2 bg-white dark:bg-[#080809] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 shadow-sm">
              <Search className="w-4 h-4 text-slate-400 dark:text-gray-500" />
              <input 
                type="text" 
                placeholder="Buscar sala o contacto..." 
                className="bg-transparent border-none outline-none text-sm text-slate-700 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-600 w-full"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {MOCK_ROOMS.map(room => (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                key={room.id}
                onClick={() => setActiveRoomId(room.id)}
                className={`w-full text-left p-3.5 rounded-2xl transition-all ${
                  activeRoomId === room.id 
                    ? 'bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 shadow-sm' 
                    : 'hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex items-center gap-2">
                    {room.type === 'vip' && <Star className="w-4 h-4 text-amber-500" />}
                    {room.type === 'group' && <Users className="w-4 h-4 text-slate-400 dark:text-gray-400" />}
                    {room.type === 'direct' && <Lock className="w-4 h-4 text-slate-400 dark:text-gray-400" />}
                    <span className={`text-sm font-bold ${activeRoomId === room.id ? 'text-blue-700 dark:text-white' : 'text-slate-700 dark:text-gray-300'}`}>
                      {room.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 dark:text-gray-500">{room.lastMessageTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500 dark:text-gray-500 truncate pr-4">{room.lastMessage}</p>
                  {room.unread > 0 && (
                    <span className="shrink-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      {room.unread}
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Middle Column: Active Chat */}
        <div className="lg:col-span-6 flex flex-col bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden relative">
          {/* Chat Header */}
          <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-[#0c0c0d]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-700 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm">
                {activeRoom.type === 'vip' ? <Star className="w-6 h-6 text-amber-500" /> : <Users className="w-6 h-6 text-slate-500 dark:text-gray-400" />}
              </div>
              <div>
                <h2 className="text-slate-900 dark:text-white font-bold flex items-center gap-2 text-lg">
                  {activeRoom.name}
                  {activeRoom.securityStatus === 'ghost_mode' && (
                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 text-[10px] font-bold uppercase tracking-widest rounded-md flex items-center gap-1 border border-purple-200 dark:border-purple-500/20">
                      <Ghost className="w-3 h-3" /> Ghost Mode
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-gray-500 mt-0.5">
                  <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> E2E Encrypted</span>
                  <span>•</span>
                  <span>{activeRoom.participants} participantes</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
               <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-white dark:bg-transparent border border-slate-200 dark:border-transparent rounded-lg shadow-sm dark:shadow-none">
                 <Info className="w-5 h-5" />
               </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/30 dark:bg-transparent">
            {MOCK_MESSAGES.map((msg, idx) => {
              const isMe = msg.senderId === 'me';
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={msg.id} 
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-baseline gap-2 mb-1.5 px-1">
                    <span className="text-xs font-bold text-slate-500 dark:text-gray-400">{isMe ? 'Tú' : msg.senderName}</span>
                    <span className="text-[10px] text-slate-400 dark:text-gray-600 font-mono">{msg.timestamp}</span>
                  </div>
                  <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative group ${
                    isMe 
                      ? 'bg-blue-600 text-white border border-blue-700 dark:border-blue-500/20 rounded-tr-sm' 
                      : 'bg-white dark:bg-[#1a1a1c] text-slate-800 dark:text-gray-300 border border-slate-200 dark:border-white/5 rounded-tl-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    
                    {msg.attachment && (
                      <div className={`mt-3 rounded-xl p-3 flex items-center gap-3 border ${isMe ? 'bg-black/10 border-white/10' : 'bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/5'}`}>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isMe ? 'bg-white/10' : 'bg-blue-50 dark:bg-blue-500/10'}`}>
                          <FileText className={`w-5 h-5 ${isMe ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{msg.attachment.name}</p>
                          <p className={`text-[10px] mt-0.5 ${isMe ? 'text-blue-100' : 'text-slate-500 dark:text-gray-500'}`}>{msg.attachment.size} • Archivo Blindado</p>
                        </div>
                      </div>
                    )}

                    {msg.isCertified && (
                      <div className={`mt-3 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest ${isMe ? 'text-emerald-300' : 'text-emerald-600 dark:text-green-400'}`}>
                        <CheckCircle className="w-3.5 h-3.5" /> Hash Registrado
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#0c0c0d]">
            <div className="flex flex-wrap items-center gap-2 mb-3 px-1">
              <button 
                onClick={() => setIsGhostMode(!isGhostMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border transition-colors ${
                  isGhostMode 
                    ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30 shadow-sm' 
                    : 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-gray-500 border-slate-200 dark:border-white/5 hover:text-slate-700 dark:hover:text-gray-300'
                }`}
              >
                {isGhostMode ? <EyeOff className="w-3.5 h-3.5" /> : <Ghost className="w-3.5 h-3.5" />}
                {isGhostMode ? 'Ghost Mode ON' : 'Ghost Mode OFF'}
              </button>
              
              <button 
                onClick={() => setIsCertified(!isCertified)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border transition-colors ${
                  isCertified 
                    ? 'bg-blue-50 dark:bg-cyan-500/10 text-blue-700 dark:text-cyan-400 border-blue-200 dark:border-cyan-500/30 shadow-sm' 
                    : 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-gray-500 border-slate-200 dark:border-white/5 hover:text-slate-700 dark:hover:text-gray-300'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                {isCertified ? 'Certificar Mensaje' : 'Mensaje Estándar'}
              </button>
            </div>
            
            <div className="flex items-end gap-2 bg-slate-50 dark:bg-[#111112] border border-slate-200 dark:border-white/10 rounded-2xl p-2.5 focus-within:border-blue-400 dark:focus-within:border-white/20 transition-colors shadow-inner dark:shadow-none">
              <button className="p-2.5 text-slate-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors shrink-0">
                <Paperclip className="w-5 h-5" />
              </button>
              <textarea 
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={isGhostMode ? "Mensaje efímero (se destruye al leer)..." : "Escribe un mensaje seguro..."}
                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 dark:text-gray-200 resize-none max-h-32 py-2.5 placeholder-slate-400 dark:placeholder-gray-600"
                rows={1}
              />
              <button className="p-3 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl text-white hover:opacity-90 transition-opacity shrink-0 shadow-lg shadow-blue-500/20">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Security Status */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm relative overflow-hidden">
             {/* Decoración de fondo */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-10 pointer-events-none">
              <Hash className="w-32 h-32 text-blue-500" />
            </div>

            <div className="flex items-center justify-between mb-6 relative z-10">
              <h4 className="text-xs uppercase font-bold tracking-widest text-slate-500 dark:text-gray-400">Auditoría Blockchain</h4>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-green-400 uppercase">Sincronizado</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              </div>
            </div>
            <div className="space-y-5 relative z-10">
               <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-cyan-500/10 border border-blue-100 dark:border-cyan-500/20 flex items-center justify-center shrink-0">
                   <Hash className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-slate-800 dark:text-white">Última validación</p>
                   <p className="text-[10px] text-slate-500 dark:text-gray-500 font-mono mt-1 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded inline-block">Block #849201</p>
                 </div>
               </div>
               <div className="bg-slate-50 dark:bg-black/20 rounded-xl p-4 border border-slate-200 dark:border-white/5">
                 <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-gray-500 mb-2">Hash de Integridad de Sala</div>
                 <div className="font-mono text-xs text-slate-600 dark:text-gray-400 break-all leading-relaxed">0x7F2a8B...9C4dE1fA</div>
               </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xs uppercase font-bold tracking-widest text-slate-500 dark:text-gray-400">Reybot Guardian</h4>
              <div className="p-1.5 bg-blue-50 dark:bg-white/5 rounded-lg border border-blue-100 dark:border-white/10">
                <Cpu className="w-4 h-4 text-blue-600 dark:text-gray-400" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm pb-3 border-b border-slate-100 dark:border-white/5">
                <span className="text-slate-600 dark:text-gray-400 font-medium">Análisis de Riesgo</span>
                <span className="bg-emerald-50 dark:bg-green-500/10 text-emerald-600 dark:text-green-400 px-2 py-1 rounded text-xs font-bold uppercase tracking-widest border border-emerald-100 dark:border-green-500/20">Seguro</span>
              </div>
              <div className="flex justify-between items-center text-sm pb-3 border-b border-slate-100 dark:border-white/5">
                <span className="text-slate-600 dark:text-gray-400 font-medium">Filtro Antifraude</span>
                <span className="bg-blue-50 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 px-2 py-1 rounded text-xs font-bold uppercase tracking-widest border border-blue-100 dark:border-cyan-500/20">Activo</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-gray-400 font-medium">Archivos Escaneados</span>
                <span className="text-slate-800 dark:text-gray-300 font-mono font-bold">1,204</span>
              </div>
            </div>
          </div>
          
           <div className="bg-gradient-to-br from-blue-900 to-cyan-900 border border-blue-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden">
             <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-400/20 blur-3xl rounded-full"></div>
             <div className="relative z-10">
               <h4 className="text-xs uppercase font-bold tracking-widest text-cyan-300 mb-4 flex items-center gap-2">
                 <Zap className="w-4 h-4" /> Costos de Red (RYC)
               </h4>
               <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                 <div>
                   <p className="text-3xl font-light text-white flex items-baseline gap-1">0.05 <span className="text-sm font-bold text-cyan-400">RYC</span></p>
                   <p className="text-[10px] text-cyan-100/60 uppercase tracking-widest mt-1">Por Msg Certificado</p>
                 </div>
                 <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold text-white transition-colors w-full sm:w-auto text-center backdrop-blur-sm">
                   Recargar
                 </button>
               </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}

