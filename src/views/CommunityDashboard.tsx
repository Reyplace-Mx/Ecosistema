import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users,
  MessageCircle,
  ThumbsUp,
  Share2,
  MoreHorizontal,
  Plus,
  Coins,
  ShieldCheck,
  Award,
  Globe,
  Lock,
  Search,
  Filter
} from 'lucide-react';
import type { CommunityPost, CommunityGroup } from '../types';

const MOCK_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    author: {
      id: 'usr_1',
      name: 'María Fernández',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      isCreator: true,
      isPro: true
    },
    content: '¡Increíble la nueva actualización de Smart City! El tráfico en mi zona ha mejorado un 40% gracias a los desvíos automáticos. ¿Alguien más lo ha notado?',
    timestamp: 'Hace 2 horas',
    likes: 342,
    comments: 56,
    tipsRYC: 15,
    groupId: 'grp_1',
    groupName: 'Smart City Beta Testers'
  },
  {
    id: 'post_2',
    author: {
      id: 'usr_2',
      name: 'Dr. Roberto Gómez',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      isCreator: false,
      isPro: true
    },
    content: 'Acabo de publicar mi nuevo curso en la Academia Reyplace sobre "Finanzas Descentralizadas para Negocios Locales". Especial descuento para usuarios Pro.',
    timestamp: 'Hace 5 horas',
    likes: 890,
    comments: 124,
    tipsRYC: 250
  },
  {
    id: 'post_3',
    author: {
      id: 'usr_3',
      name: 'Café del Parque',
      avatar: 'https://i.pravatar.cc/150?u=a04258a2462d826712d',
      isCreator: false,
      isPro: false
    },
    content: '¡Hoy aceptamos Reycoin! Ven y disfruta de un 10% de descuento pagando desde tu ReyWallet. ☕️✨',
    timestamp: 'Ayer',
    likes: 124,
    comments: 12,
    tipsRYC: 5,
    groupId: 'grp_2',
    groupName: 'Negocios Locales'
  }
];

const MOCK_GROUPS: CommunityGroup[] = [
  {
    id: 'grp_1',
    name: 'Smart City Beta Testers',
    description: 'Comunidad para probar las nuevas funciones de la ciudad.',
    members: 12450,
    category: 'Tecnología',
    type: 'pro_only',
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'grp_2',
    name: 'Negocios Locales',
    description: 'Red de apoyo y ofertas entre comerciantes.',
    members: 3420,
    category: 'Negocios',
    type: 'public',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'grp_3',
    name: 'Inversores RYC',
    description: 'Análisis de mercado y trading.',
    members: 8900,
    category: 'Finanzas',
    type: 'private',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=300&q=80'
  }
];

export function CommunityDashboard() {
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'creators'>('feed');

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col overflow-y-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-pink-400" />
            Comunidad <span className="text-gray-600 font-medium">/</span> Red Social Reyplace
          </h1>
          <p className="text-gray-400 mt-2">Conecta con usuarios, creadores, academia y descubre grupos locales.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 bg-[#111112] border border-white/5 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'feed' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Mi Feed
          </button>
          <button 
            onClick={() => setActiveTab('groups')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'groups' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Grupos
          </button>
          <button 
            onClick={() => setActiveTab('creators')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'creators' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Creadores
          </button>
        </div>
      </header>

      {activeTab === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            
            {/* Create Post */}
            <div className="bg-[#111112] border border-white/5 rounded-2xl p-4 shadow-xl">
              <div className="flex gap-4">
                <img src="https://i.pravatar.cc/150?u=me" alt="Mi perfil" className="w-10 h-10 rounded-full border border-white/10" />
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="¿Qué está pasando en Reyplace?" 
                    className="w-full bg-transparent border-none outline-none text-white placeholder-gray-500 py-2"
                  />
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-pink-400 transition-colors rounded-full hover:bg-pink-500/10">
                        <Globe className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-pink-400 transition-colors rounded-full hover:bg-pink-500/10">
                        <Users className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="px-6 py-2 bg-pink-500 hover:bg-pink-400 text-white text-sm font-bold rounded-full transition-colors shadow-lg shadow-pink-500/20">
                      Publicar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feed */}
            <div className="space-y-4">
              {MOCK_POSTS.map(post => (
                <motion.article 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={post.id}
                  className="bg-[#111112] border border-white/5 hover:border-white/10 transition-colors rounded-2xl p-5 shadow-xl"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full border border-white/10" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-white hover:underline cursor-pointer">{post.author.name}</h3>
                          {post.author.isPro && <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
                          {post.author.isCreator && <Award className="w-3.5 h-3.5 text-fuchsia-400" />}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                          <span>{post.timestamp}</span>
                          {post.groupName && (
                            <>
                              <span>•</span>
                              <span className="hover:text-pink-400 cursor-pointer">{post.groupName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-pink-400 transition-colors group">
                        <div className="p-1.5 rounded-full group-hover:bg-pink-500/10 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                        </div>
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-blue-400 transition-colors group">
                        <div className="p-1.5 rounded-full group-hover:bg-blue-500/10 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                        </div>
                        {post.comments}
                      </button>
                      <button className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-green-400 transition-colors group">
                        <div className="p-1.5 rounded-full group-hover:bg-green-500/10 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </div>
                      </button>
                    </div>
                    
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-colors">
                      <Coins className="w-3 h-3" /> Dar Propina
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-pink-900/20 to-[#111112] border border-pink-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Users className="w-24 h-24 text-pink-400" />
              </div>
              <div className="relative z-10">
                <h3 className="text-sm font-bold text-pink-400 mb-2 uppercase tracking-widest">Sugerencias para ti</h3>
                <p className="text-xs text-gray-400 mb-4">Basado en tus intereses y actividad en Reyplace.</p>
                
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={`https://i.pravatar.cc/150?u=sug${i}`} alt="User" className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="text-xs font-bold text-white">Usuario {i}</p>
                          <p className="text-[10px] text-gray-500">Nuevo en la ciudad</p>
                        </div>
                      </div>
                      <button className="text-[10px] font-bold text-pink-400 hover:text-pink-300 uppercase tracking-widest">Seguir</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-[#111112] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-4">Trending en Reyplace</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-gray-500 mb-1">1 • Tecnología</p>
                  <p className="text-sm font-bold text-white">#SmartCityUpdate</p>
                  <p className="text-xs text-gray-400 mt-0.5">2.4k posts</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 mb-1">2 • Finanzas</p>
                  <p className="text-sm font-bold text-white">#Reycoin</p>
                  <p className="text-xs text-gray-400 mt-0.5">1.8k posts</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 mb-1">3 • Academia</p>
                  <p className="text-sm font-bold text-white">#DeFiLocal</p>
                  <p className="text-xs text-gray-400 mt-0.5">856 posts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'groups' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-[#111112] border border-white/5 rounded-lg px-3 py-2 w-full md:w-64">
              <Search className="w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Buscar grupos..." 
                className="bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-600 w-full"
              />
            </div>
            <button className="px-4 py-2 bg-pink-500 hover:bg-pink-400 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Crear Grupo
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_GROUPS.map(group => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                key={group.id}
                className="bg-[#111112] border border-white/5 rounded-2xl overflow-hidden shadow-xl group hover:border-white/10 transition-colors flex flex-col"
              >
                <div className="h-32 relative">
                  <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111112] to-transparent"></div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    {group.type === 'pro_only' && (
                      <span className="bg-amber-500/90 text-black text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded backdrop-blur flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Pro
                      </span>
                    )}
                    {group.type === 'private' && (
                      <span className="bg-black/50 text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded border border-white/20 backdrop-blur flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Privado
                      </span>
                    )}
                    {group.type === 'public' && (
                      <span className="bg-green-500/90 text-black text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded backdrop-blur flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Público
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-[10px] text-pink-400 uppercase font-bold tracking-widest mb-2 block">{group.category}</span>
                  <h3 className="text-lg font-bold text-white mb-2">{group.name}</h3>
                  <p className="text-xs text-gray-400 mb-4 flex-1 line-clamp-2">{group.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                      <Users className="w-4 h-4" /> {group.members.toLocaleString()} miembros
                    </span>
                    <button className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-colors border border-white/10">
                      Unirme
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'creators' && (
        <div className="bg-[#111112] border border-white/5 rounded-2xl shadow-xl p-6 text-center py-20">
           <Award className="w-16 h-16 text-fuchsia-400 mx-auto mb-4" />
           <h2 className="text-2xl font-bold text-white mb-2">Creators Hub</h2>
           <p className="text-gray-400 max-w-md mx-auto mb-6">
             Descubre a los creadores de contenido, instructores de academia y streamers de Reyplace. Apóyalos con propinas en RYC o suscríbete a sus membresías.
           </p>
           <button className="px-6 py-2 bg-fuchsia-500 hover:bg-fuchsia-400 text-white text-sm font-bold rounded-full transition-colors shadow-lg shadow-fuchsia-500/20">
             Explorar Creadores
           </button>
        </div>
      )}
    </div>
  );
}
