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
  Info,
  X,
  Upload,
  Key,
  Flame,
  AlertTriangle,
  Clock
} from 'lucide-react';
import type { ChatRoom, ChatMessage } from '../types';

const MOCK_ROOMS: ChatRoom[] = [
  {
    id: 'room_1',
    name: 'Consultoría Financiera VIP',
    type: 'vip',
    participants: 3,
    lastMessage: 'Acuerdo profesional certificado.',
    lastMessageTime: '10:42 AM',
    unread: 2,
    securityStatus: 'secure'
  },
  {
    id: 'room_2',
    name: 'Operaciones (Privado 1 a 1)',
    type: 'direct',
    participants: 2,
    lastMessage: 'Archivo blindado recibido.',
    lastMessageTime: 'Ayer',
    unread: 0,
    securityStatus: 'secure'
  },
  {
    id: 'room_3',
    name: 'Contacto Confidencial',
    type: 'direct',
    participants: 2,
    lastMessage: 'Mensaje autodestruido.',
    lastMessageTime: 'Hace 2 días',
    unread: 0,
    securityStatus: 'ghost_mode'
  }
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  room_1: [
    {
      id: 'msg_1',
      senderId: 'usr_2',
      senderName: 'Elena V.',
      content: 'Revisando los parámetros de seguridad. Todo el chat está cifrado de extremo a extremo.',
      timestamp: '10:30 AM',
      isCertified: false,
      encryptionLevel: 'quantum'
    },
    {
      id: 'msg_2',
      senderId: 'me',
      senderName: 'Alex Vanguard',
      content: 'Adjunto el documento confidencial. Solo podrá abrirse con ReyID y se destruirá después de leer.',
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
      content: 'Procedo a verificar el mensaje certificado. Esto no revelará el contenido, solo la existencia del acuerdo.',
      timestamp: '10:38 AM',
      isCertified: true,
      encryptionLevel: 'quantum'
    }
  ],
  room_2: [
    {
      id: 'msg_4',
      senderId: 'usr_4',
      senderName: 'Carlos M. (Soporte)',
      content: 'Bienvenido a Operaciones Privadas 1 a 1. Tu canal directo de comunicación.',
      timestamp: 'Ayer 4:15 PM',
      isCertified: false,
      encryptionLevel: 'quantum'
    }
  ],
  room_3: [
    {
      id: 'msg_5',
      senderId: 'usr_5',
      senderName: 'Anónimo 09',
      content: 'Sesión iniciada en Modo Fantasma. Este chat no almacenará metadatos.',
      timestamp: 'Hace 2 días',
      isCertified: false,
      encryptionLevel: 'quantum'
    }
  ]
};

export function UnionLiveDashboard() {
  const [activeRoomId, setActiveRoomId] = useState<string>(MOCK_ROOMS[0].id);
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [messageText, setMessageText] = useState('');
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [isCertified, setIsCertified] = useState(false);
  
  // Armored File Modal State
  const [showFileModal, setShowFileModal] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('1.8 MB');
  const [selectedFileType, setSelectedFileType] = useState('Contrato Blindado');
  const [requireReyID, setRequireReyID] = useState(true);
  const [selfDestructOnRead, setSelfDestructOnRead] = useState(true);

  // Active Room
  const activeRoom = MOCK_ROOMS.find(r => r.id === activeRoomId) || MOCK_ROOMS[0];
  const currentMessages = messagesMap[activeRoomId] || [];

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      senderName: 'Alex Vanguard (Tú)',
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCertified: isCertified,
      encryptionLevel: 'quantum'
    };

    setMessagesMap(prev => ({
      ...prev,
      [activeRoomId]: [...(prev[activeRoomId] || []), newMsg]
    }));

    setMessageText('');
  };

  const handleSendArmoredFile = () => {
    const fileTitle = fileName.trim() || 'Documento_Cifrado_ReyID.pdf';
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      senderName: 'Alex Vanguard (Tú)',
      content: `📎 Archivo Blindado enviado: ${fileTitle}. Solo accesible vía ReyID Biométrico.${selfDestructOnRead ? ' Se autodestruirá tras la primera lectura.' : ''}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCertified: true,
      encryptionLevel: 'quantum',
      attachment: {
        name: fileTitle,
        type: 'contract',
        size: fileSize
      }
    };

    setMessagesMap(prev => ({
      ...prev,
      [activeRoomId]: [...(prev[activeRoomId] || []), newMsg]
    }));

    setShowFileModal(false);
    setFileName('');
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto h-[calc(100vh-64px)] flex flex-col animate-fade-in relative">
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
                    {room.type === 'vip' && <Star className="w-4 h-4 text-orange-500" />}
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
                {activeRoom.type === 'vip' ? <Star className="w-6 h-6 text-orange-500" /> : <Users className="w-6 h-6 text-slate-500 dark:text-gray-400" />}
              </div>
              <div>
                <h2 className="text-slate-900 dark:text-white font-bold flex items-center gap-2 text-lg">
                  {activeRoom.name}
                  {(activeRoom.securityStatus === 'ghost_mode' || isGhostMode) && (
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-widest rounded-md flex items-center gap-1 border border-green-200 dark:border-green-500/20">
                      <Ghost className="w-3 h-3" /> Modo Fantasma
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-gray-500 mt-0.5">
                  <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-blue-500" /> Cifrado E2E</span>
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

          {/* Ghost Mode Alert Banner */}
          {isGhostMode && (
            <div className="bg-green-500/10 border-b border-green-500/20 p-2.5 px-4 flex items-center justify-between text-xs text-green-400 font-mono">
              <div className="flex items-center gap-2">
                <Ghost className="w-4 h-4 text-green-400 animate-pulse" />
                <span>MODO FANTASMA ACTIVO: Sin historial • Sin capturas • Cero metadatos</span>
              </div>
              <span className="text-[10px] bg-green-500/20 px-2 py-0.5 rounded font-bold border border-green-500/30">PROTEGIDO</span>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/30 dark:bg-transparent">
            {currentMessages.map((msg, idx) => {
              const isMe = msg.senderId === 'me';
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
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
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isMe ? 'bg-white/10' : 'bg-amber-500/10 border border-amber-500/20'}`}>
                          <FileText className={`w-5 h-5 ${isMe ? 'text-white' : 'text-amber-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{msg.attachment.name}</p>
                          <p className={`text-[10px] mt-0.5 ${isMe ? 'text-blue-100' : 'text-slate-500 dark:text-gray-500'}`}>{msg.attachment.size} • Archivo Blindado (ReyID)</p>
                        </div>
                      </div>
                    )}

                    {msg.isCertified && (
                      <div className={`mt-3 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest ${isMe ? 'text-purple-200' : 'text-purple-600 dark:text-purple-400'}`}>
                        <CheckCircle className="w-3.5 h-3.5" /> Hash Registrado (Mensaje Certificado)
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
                    ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30 shadow-sm' 
                    : 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-gray-500 border-slate-200 dark:border-white/5 hover:text-slate-700 dark:hover:text-gray-300'
                }`}
              >
                {isGhostMode ? <EyeOff className="w-3.5 h-3.5" /> : <Ghost className="w-3.5 h-3.5" />}
                {isGhostMode ? 'Modo Fantasma ON' : 'Modo Fantasma OFF'}
              </button>
              
              <button 
                onClick={() => setIsCertified(!isCertified)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border transition-colors ${
                  isCertified 
                    ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30 shadow-sm' 
                    : 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-gray-500 border-slate-200 dark:border-white/5 hover:text-slate-700 dark:hover:text-gray-300'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                {isCertified ? 'Mensaje Certificado' : 'Mensaje Estándar'}
              </button>
            </div>
            
            <div className="flex items-end gap-2 bg-slate-50 dark:bg-[#111112] border border-slate-200 dark:border-white/10 rounded-2xl p-2.5 focus-within:border-blue-400 dark:focus-within:border-white/20 transition-colors shadow-inner dark:shadow-none">
              <button 
                onClick={() => setShowFileModal(true)}
                className="p-2.5 text-slate-400 dark:text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors shrink-0" 
                title="Adjuntar Archivo Blindado"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <textarea 
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={isGhostMode ? "No dejará historial, no guarda metadatos..." : "Escribe un mensaje privado 1 a 1..."}
                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 dark:text-gray-200 resize-none max-h-32 py-2.5 placeholder-slate-400 dark:placeholder-gray-600"
                rows={1}
              />
              <button 
                onClick={handleSendMessage}
                className="p-3 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl text-white hover:opacity-90 transition-opacity shrink-0 shadow-lg shadow-blue-500/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Security Status & Official Features */}
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 pb-2">
          
          <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-500" />
              <h3 className="font-bold text-slate-800 dark:text-white">Funciones Oficiales</h3>
            </div>
            
            <div className="space-y-6">
              {/* 🟦 Chat Privado 1 a 1 */}
              <div className="flex items-start gap-3 group p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setActiveRoomId('room_2')}>
                 <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 group-hover:scale-110 transition-transform">
                   <div className="w-3 h-3 rounded-sm bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">Chat privado 1 a 1</h4>
                   <ul className="text-xs text-slate-500 dark:text-gray-400 mt-1.5 space-y-1">
                     <li>• Cifrado extremo a extremo</li>
                     <li>• Mensajes autodestructibles</li>
                     <li>• Archivos blindados</li>
                     <li>• Notificaciones seguras</li>
                   </ul>
                 </div>
              </div>
              
              {/* 🟧 Salas VIP */}
              <div className="flex items-start gap-3 group p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setActiveRoomId('room_1')}>
                 <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20 group-hover:scale-110 transition-transform">
                   <div className="w-3 h-3 rounded-sm bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">Salas VIP</h4>
                   <ul className="text-xs text-slate-500 dark:text-gray-400 mt-1.5 space-y-1">
                     <li>• Para clientes premium</li>
                     <li>• Para consultorías</li>
                     <li>• Para negocios locales</li>
                     <li>• Para editores de noticias</li>
                   </ul>
                 </div>
              </div>

              {/* 🟩 Modo Fantasma */}
              <div className="flex items-start gap-3 group p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => { setActiveRoomId('room_3'); setIsGhostMode(true); }}>
                 <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/20 group-hover:scale-110 transition-transform">
                   <div className="w-3 h-3 rounded-sm bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">Modo Fantasma</h4>
                   <ul className="text-xs text-slate-500 dark:text-gray-400 mt-1.5 space-y-1">
                     <li>• No deja historial</li>
                     <li>• No permite capturas (opcional)</li>
                     <li>• No guarda metadatos</li>
                   </ul>
                 </div>
              </div>

              {/* 🟪 Mensajes certificados */}
              <div className="flex items-start gap-3 group p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setIsCertified(true)}>
                 <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20 group-hover:scale-110 transition-transform">
                   <div className="w-3 h-3 rounded-sm bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">Mensajes certificados</h4>
                   <ul className="text-xs text-slate-500 dark:text-gray-400 mt-1.5 space-y-1">
                     <li>• Se certifica existencia del msg</li>
                     <li>• Sin revelar contenido</li>
                     <li>• Útil para acuerdos profesionales</li>
                   </ul>
                 </div>
              </div>

              {/* 🟫 Archivos blindados */}
              <div className="flex items-start gap-3 group p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setShowFileModal(true)}>
                 <div className="w-8 h-8 rounded-lg bg-amber-700/10 flex items-center justify-center shrink-0 border border-amber-700/20 group-hover:scale-110 transition-transform">
                   <div className="w-3 h-3 rounded-sm bg-amber-700 shadow-[0_0_8px_rgba(180,83,9,0.6)]"></div>
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">Archivos blindados</h4>
                   <ul className="text-xs text-slate-500 dark:text-gray-400 mt-1.5 space-y-1">
                     <li>• Documentos cifrados</li>
                     <li>• Solo se abren con ReyID</li>
                     <li>• Se destruyen después de leer</li>
                   </ul>
                 </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Armored File Attachment Modal */}
      <AnimatePresence>
        {showFileModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111112] border border-amber-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <button 
                  onClick={() => setShowFileModal(false)}
                  className="p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Adjuntar Archivo Blindado</h3>
                  <p className="text-xs text-gray-400">Documentos protegidos por cifrado ReyID</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-gray-400 block mb-1.5">Nombre del Documento</label>
                  <input 
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Ej. Contrato_Acreditacion_VIP.pdf"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-gray-400 block mb-1.5">Tipo de Documento</label>
                    <select 
                      value={selectedFileType}
                      onChange={(e) => setSelectedFileType(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-500"
                    >
                      <option value="Contrato Blindado">Contrato Blindado</option>
                      <option value="Auditoría Financiera">Auditoría Financiera</option>
                      <option value="Acuerdo de Confidencialidad">Acuerdo de Confidencialidad</option>
                      <option value="Escritura Digital">Escritura Digital</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-gray-400 block mb-1.5">Tamaño Estimado</label>
                    <input 
                      type="text"
                      value={fileSize}
                      onChange={(e) => setFileSize(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <Key className="w-4 h-4 text-cyan-400" />
                      <span>Requerir Validación ReyID</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={requireReyID}
                      onChange={(e) => setRequireReyID(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span>Autodestrucción tras lectura</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={selfDestructOnRead}
                      onChange={(e) => setSelfDestructOnRead(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleSendArmoredFile}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl font-bold text-white shadow-lg shadow-amber-500/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 mt-2"
                >
                  <Upload className="w-4 h-4" /> Enviar Documento Blindado
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

