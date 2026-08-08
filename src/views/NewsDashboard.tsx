import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Newspaper,
  TrendingUp,
  Car,
  CloudRain,
  ShieldAlert,
  Calendar,
  Hexagon,
  Cpu,
  CheckCircle,
  Clock,
  MapPin,
  ExternalLink,
  Search,
  Filter,
  AlertTriangle
} from 'lucide-react';
import type { NewsArticle, NewsCategory } from '../types';

const MOCK_NEWS: NewsArticle[] = [
  {
    id: 'news_1',
    title: 'Nueva Zona Franca Digital en Smart City Norte',
    summary: 'El gobierno local aprueba incentivos fiscales para empresas tech que operen nodos Reyplace.',
    category: 'economy',
    author: 'Redacción Reyplace Pro',
    publishDate: 'Hace 30 min',
    isBlockchainVerified: true,
    txHash: '0x7f2...8b9c',
    aiSummary: 'Aprobación de zona franca digital en sector Norte. Beneficios: 0% impuestos locales por 3 años a nodos validadores.',
    impactScore: 9.2
  },
  {
    id: 'news_2',
    title: 'Accidente en Vía Rápida Sur',
    summary: 'Tráfico detenido por colisión múltiple. Desvíos recomendados por Av. Central.',
    category: 'traffic',
    author: 'Smart City Traffic Monitor',
    publishDate: 'Hace 1 hora',
    isBlockchainVerified: false,
    impactScore: 7.5
  },
  {
    id: 'news_3',
    title: 'Alerta Meteorológica: Tormenta Eléctrica',
    summary: 'Se esperan fuertes lluvias y ráfagas de viento a partir de las 18:00 hrs.',
    category: 'weather',
    author: 'Sistema Meteorológico Reyplace',
    publishDate: 'Hace 2 horas',
    isBlockchainVerified: true,
    txHash: '0x1a4...9f02',
    impactScore: 8.8
  },
  {
    id: 'news_4',
    title: 'Actualización Cúpula Digital: Nuevo Protocolo de Encriptación',
    summary: 'Implementamos el estándar post-cuántico para todas las transacciones Reycoin.',
    category: 'security',
    author: 'Equipo de Ciberseguridad',
    publishDate: 'Ayer',
    isBlockchainVerified: true,
    txHash: '0x9c3...1e4b',
    aiSummary: 'Cúpula Digital migra a criptografía post-cuántica. Impacto: Mayor seguridad, tiempos de validación mantenidos en <2s.',
    impactScore: 9.8
  },
  {
    id: 'news_5',
    title: 'Festival de Innovación Web3',
    summary: 'El evento anual reunirá a más de 5,000 desarrolladores. Entradas disponibles en Marketplace.',
    category: 'events',
    author: 'Eventos Smart City',
    publishDate: 'Ayer',
    isBlockchainVerified: false,
    impactScore: 5.5
  }
];

const CATEGORIES: { id: NewsCategory | 'all'; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'Todo', icon: <Newspaper className="w-4 h-4" /> },
  { id: 'local', label: 'Local', icon: <MapPin className="w-4 h-4" /> },
  { id: 'economy', label: 'Economía', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'traffic', label: 'Tráfico', icon: <Car className="w-4 h-4" /> },
  { id: 'weather', label: 'Clima', icon: <CloudRain className="w-4 h-4" /> },
  { id: 'security', label: 'Seguridad', icon: <ShieldAlert className="w-4 h-4" /> },
  { id: 'events', label: 'Eventos', icon: <Calendar className="w-4 h-4" /> }
];

export function NewsDashboard() {
  const [activeCategory, setActiveCategory] = useState<NewsCategory | 'all'>('all');

  const filteredNews = activeCategory === 'all' 
    ? MOCK_NEWS 
    : MOCK_NEWS.filter(news => news.category === activeCategory);

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col overflow-y-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-fuchsia-400" />
            Pro News <span className="text-gray-600 font-medium">/</span> Centro Informativo
          </h1>
          <p className="text-gray-400 mt-2">Noticias verificadas en blockchain, curadas por Reybot AI e integradas con Smart City.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#111112] border border-white/5 rounded-lg px-3 py-2">
           <Search className="w-4 h-4 text-gray-500" />
           <input 
             type="text" 
             placeholder="Buscar noticias..." 
             className="bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-600 w-full md:w-48"
           />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
           <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
             {CATEGORIES.map(cat => (
               <button
                 key={cat.id}
                 onClick={() => setActiveCategory(cat.id)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0 ${
                   activeCategory === cat.id 
                    ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30' 
                    : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-gray-200'
                 }`}
               >
                 {cat.icon} {cat.label}
               </button>
             ))}
           </div>

           <div className="space-y-4">
             {filteredNews.map(news => (
               <motion.article 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 key={news.id} 
                 className="bg-[#111112] border border-white/5 hover:border-white/10 rounded-2xl p-5 md:p-6 transition-colors shadow-xl group"
               >
                 <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                   <div className="flex-1">
                     <div className="flex flex-wrap items-center gap-2 mb-3">
                       <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border flex items-center gap-1
                         ${news.category === 'economy' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                           news.category === 'traffic' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                           news.category === 'security' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                           news.category === 'weather' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                           'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400'
                         }`}>
                         {CATEGORIES.find(c => c.id === news.category)?.icon}
                         {CATEGORIES.find(c => c.id === news.category)?.label}
                       </span>
                       <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                         <Clock className="w-3 h-3" /> {news.publishDate}
                       </div>
                     </div>
                     
                     <h2 className="text-xl font-bold text-white mb-2 group-hover:text-fuchsia-400 transition-colors">
                       {news.title}
                     </h2>
                     <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                       {news.summary}
                     </p>

                     {news.aiSummary && (
                       <div className="bg-[#080809] border border-fuchsia-500/20 rounded-xl p-4 mb-4 flex gap-3">
                         <Cpu className="w-5 h-5 text-fuchsia-400 shrink-0 mt-0.5" />
                         <div>
                           <h4 className="text-[10px] uppercase font-bold tracking-widest text-fuchsia-400/70 mb-1">Resumen Reybot AI</h4>
                           <p className="text-xs text-gray-300 leading-relaxed">{news.aiSummary}</p>
                         </div>
                       </div>
                     )}

                     <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                       <span>Por: <span className="text-gray-300">{news.author}</span></span>
                       {news.impactScore && (
                         <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                           Impacto: <span className="text-white font-bold">{news.impactScore}/10</span>
                         </span>
                       )}
                     </div>
                   </div>

                   <div className="md:w-48 shrink-0 flex flex-col gap-3">
                     {news.isBlockchainVerified ? (
                       <div className="bg-[#080809] border border-green-500/20 rounded-xl p-3 flex flex-col gap-2">
                         <div className="flex items-center gap-2 text-green-400">
                           <Hexagon className="w-4 h-4" />
                           <span className="text-[10px] uppercase font-bold tracking-widest">Verificado</span>
                         </div>
                         <div className="text-[9px] text-gray-500 font-mono break-all">
                           {news.txHash}
                         </div>
                         <button className="text-[10px] flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                           Ver en Explorador <ExternalLink className="w-3 h-3" />
                         </button>
                       </div>
                     ) : (
                       <div className="bg-[#080809] border border-white/5 rounded-xl p-3 flex items-center gap-2 text-gray-500">
                         <AlertTriangle className="w-4 h-4" />
                         <span className="text-[10px] uppercase font-bold tracking-widest">Sin verificar</span>
                       </div>
                     )}
                     
                     <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-colors">
                       Leer Completo
                     </button>
                   </div>
                 </div>
               </motion.article>
             ))}
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-fuchsia-900/20 to-purple-900/40 border border-fuchsia-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Cpu className="w-32 h-32 text-fuchsia-400" />
             </div>
             
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-4">
                 <div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse"></div>
                 <h3 className="text-sm font-bold text-fuchsia-400 uppercase tracking-widest">Reybot News Radar</h3>
               </div>
               
               <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                 Análisis en tiempo real de tendencias en Smart City. La Cúpula Digital reporta operaciones normales sin anomalías.
               </p>
               
               <div className="space-y-3">
                 <div className="bg-[#080809]/50 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                     <TrendingUp className="w-4 h-4 text-green-400" /> Economía Local
                   </div>
                   <span className="text-xs text-green-400 font-bold">+2.4%</span>
                 </div>
                 <div className="bg-[#080809]/50 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                     <Car className="w-4 h-4 text-amber-400" /> Congestión Vial
                   </div>
                   <span className="text-xs text-amber-400 font-bold">Nivel Medio</span>
                 </div>
                 <div className="bg-[#080809]/50 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                     <ShieldAlert className="w-4 h-4 text-cyan-400" /> Alertas Cúpula
                   </div>
                   <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                     0 Activas
                   </span>
                 </div>
               </div>
             </div>
          </div>
          
          <div className="bg-[#111112] border border-white/5 rounded-2xl p-6 shadow-xl">
             <h3 className="text-sm font-bold text-white mb-4">Fuentes Verificadas</h3>
             <div className="space-y-3">
               <div className="flex items-center justify-between bg-[#080809] border border-white/5 p-3 rounded-xl">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                     <CloudRain className="w-4 h-4" />
                   </div>
                   <div>
                     <p className="text-xs font-bold text-white">Sistema Meteorológico</p>
                     <p className="text-[9px] text-gray-500 uppercase tracking-widest">Smart City API</p>
                   </div>
                 </div>
                 <CheckCircle className="w-4 h-4 text-green-500" />
               </div>
               <div className="flex items-center justify-between bg-[#080809] border border-white/5 p-3 rounded-xl">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                     <Car className="w-4 h-4" />
                   </div>
                   <div>
                     <p className="text-xs font-bold text-white">Traffic Hub Central</p>
                     <p className="text-[9px] text-gray-500 uppercase tracking-widest">Gobierno Local</p>
                   </div>
                 </div>
                 <CheckCircle className="w-4 h-4 text-green-500" />
               </div>
             </div>
             
             <button className="w-full mt-4 text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors flex items-center justify-center gap-1">
               Ver Registro Blockchain <ExternalLink className="w-3 h-3" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
