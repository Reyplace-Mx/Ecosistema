import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AnimatedCard } from '../components/AnimatedCard';
import { 
  GraduationCap,
  BookOpen,
  Video,
  Award,
  Star,
  Users,
  PlayCircle,
  Brain,
  ShieldCheck,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Coins
} from 'lucide-react';
import type { AcademyCourse, AcademyWebinar, AcademyCertification } from '../types';

const MOCK_COURSES: AcademyCourse[] = [
  {
    id: 'crs_1',
    title: 'Finanzas Descentralizadas (DeFi) para Negocios Locales',
    instructor: 'Dr. Roberto Gómez',
    category: 'Finanzas',
    level: 'intermediate',
    priceRYC: 50,
    rating: 4.8,
    students: 1240,
    isPremium: true,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'crs_2',
    title: 'Introducción a Smart City y Nodos Reyplace',
    instructor: 'Reyplace Oficial',
    category: 'Tecnología',
    level: 'beginner',
    priceRYC: 0,
    rating: 4.9,
    students: 3500,
    isPremium: false,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'crs_3',
    title: 'Estrategias de Logística Urbana Inteligente',
    instructor: 'Laura Méndez',
    category: 'Negocios',
    level: 'advanced',
    priceRYC: 120,
    rating: 4.7,
    students: 856,
    isPremium: true,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c50a63?auto=format&fit=crop&w=300&q=80'
  }
];

const MOCK_WEBINARS: AcademyWebinar[] = [
  {
    id: 'web_1',
    title: 'Reybot AI: Automatiza tu Atención al Cliente',
    host: 'Equipo Reybot',
    date: 'En vivo ahora',
    participants: 450,
    isLive: true
  },
  {
    id: 'web_2',
    title: 'Masterclass: Crea y Vende tu Colección NFT Local',
    host: 'María Fernández',
    date: 'Mañana, 18:00 hrs',
    participants: 125,
    maxParticipants: 500,
    isLive: false
  }
];

const MOCK_CERTS: AcademyCertification[] = [
  {
    id: 'cert_1',
    name: 'Ciudadano Smart Nivel 1',
    issuer: 'Reyplace Academy',
    requiredScore: 80,
    verifiableOnBlockchain: true
  },
  {
    id: 'cert_2',
    name: 'Comerciante Verificado Web3',
    issuer: 'Reyplace Negocios',
    requiredScore: 90,
    verifiableOnBlockchain: true
  }
];

export function AcademyDashboard() {
  const [activeTab, setActiveTab] = useState<'courses' | 'webinars' | 'certs'>('courses');

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col overflow-y-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-indigo-400" />
            Academia <span className="text-gray-600 font-medium">/</span> Educación Reyplace
          </h1>
          <p className="text-gray-400 mt-2">Aprende nuevas habilidades, certifícate en blockchain y accede a contenido premium.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 bg-[#111112] border border-white/5 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'courses' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Cursos
          </button>
          <button 
            onClick={() => setActiveTab('webinars')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'webinars' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Webinars
          </button>
          <button 
            onClick={() => setActiveTab('certs')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'certs' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Certificaciones
          </button>
        </div>
      </header>

      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-[#111112] border border-white/5 rounded-lg px-3 py-2 w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Buscar cursos..." 
                  className="bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-600 w-full"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 transition-colors">
                <Filter className="w-4 h-4" /> Filtros
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_COURSES.map(course => (
                <AnimatedCard 
                  key={course.id}
                  className="bg-[#111112] border border-white/5 rounded-2xl overflow-hidden shadow-xl group hover:border-white/10 transition-colors flex flex-col"
                >
                  <div className="h-40 relative">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111112] to-transparent"></div>
                    <div className="absolute top-3 right-3 flex gap-2">
                      {course.isPremium && (
                        <span className="bg-amber-500/90 text-black text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded backdrop-blur flex items-center gap-1 shadow-lg">
                          <ShieldCheck className="w-3 h-3" /> Premium
                        </span>
                      )}
                    </div>
                    <button className="absolute inset-0 m-auto w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 shadow-lg">
                       <PlayCircle className="w-6 h-6 ml-1" />
                    </button>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-widest">{course.category}</span>
                      <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${
                         course.level === 'beginner' ? 'bg-green-500/10 text-green-400' :
                         course.level === 'intermediate' ? 'bg-amber-500/10 text-amber-400' :
                         'bg-red-500/10 text-red-400'
                      }`}>
                        {course.level === 'beginner' ? 'Principiante' : course.level === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                      </span>
                    </div>
                    
                    <h3 className="text-base font-bold text-white mb-2 leading-tight group-hover:text-indigo-400 transition-colors">{course.title}</h3>
                    <p className="text-xs text-gray-400 mb-4">Por <span className="font-medium text-gray-300">{course.instructor}</span></p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                      <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                        <span className="flex items-center gap-1 text-amber-400"><Star className="w-3.5 h-3.5 fill-current" /> {course.rating}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.students.toLocaleString()}</span>
                      </div>
                      
                      {course.priceRYC > 0 ? (
                        <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                          {course.priceRYC} <span className="text-[10px] text-amber-500">RYC</span>
                        </div>
                      ) : (
                        <div className="text-xs font-bold text-green-400 uppercase tracking-widest">Gratis</div>
                      )}
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-indigo-900/20 to-[#111112] border border-indigo-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                 <Brain className="w-32 h-32 text-indigo-400" />
               </div>
               
               <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-4">
                   <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                     <Brain className="w-4 h-4 text-indigo-400" />
                   </div>
                   <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">IA Educativa Reybot</h3>
                 </div>
                 
                 <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                   Reybot analiza tu progreso, te sugiere rutas de aprendizaje y puede crear quizzes personalizados basados en tus intereses de Smart City o DeFi.
                 </p>
                 
                 <button className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
                   Hablar con Tutor AI
                 </button>
               </div>
            </div>
            
            <div className="bg-[#111112] border border-white/5 rounded-2xl p-6 shadow-xl">
               <h3 className="text-sm font-bold text-white mb-4">Mi Progreso</h3>
               
               <div className="space-y-4">
                 <div>
                   <div className="flex justify-between text-sm mb-1">
                     <span className="text-gray-300">Curso: Economía Digital Local</span>
                     <span className="text-indigo-400 font-bold">75%</span>
                   </div>
                   <div className="w-full bg-white/5 rounded-full h-1.5">
                     <div className="bg-indigo-400 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                   </div>
                 </div>
                 
                 <div>
                   <div className="flex justify-between text-sm mb-1">
                     <span className="text-gray-300">Certificación: Comerciante Web3</span>
                     <span className="text-indigo-400 font-bold">30%</span>
                   </div>
                   <div className="w-full bg-white/5 rounded-full h-1.5">
                     <div className="bg-indigo-400 h-1.5 rounded-full" style={{ width: '30%' }}></div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'webinars' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {MOCK_WEBINARS.map(webinar => (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 key={webinar.id}
                 className="bg-[#111112] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-white/10 transition-colors"
               >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#080809] border border-white/10 flex items-center justify-center text-indigo-400">
                      <Video className="w-6 h-6" />
                    </div>
                    {webinar.isLive ? (
                      <span className="bg-red-500/10 text-red-400 text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded border border-red-500/20 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></div> En Vivo
                      </span>
                    ) : (
                      <span className="bg-white/5 text-gray-400 text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> Próximamente
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2">{webinar.title}</h3>
                  <p className="text-sm text-gray-400 mb-6">Host: <span className="text-gray-200">{webinar.host}</span></p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                       <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {webinar.participants} {webinar.maxParticipants ? `/ ${webinar.maxParticipants}` : ''}</span>
                    </div>
                    <button className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                      webinar.isLive 
                        ? 'bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/20' 
                        : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20'
                    }`}>
                      {webinar.isLive ? 'Unirse Ahora' : 'Agendar'}
                    </button>
                  </div>
               </motion.div>
             ))}
          </div>
        </div>
      )}

      {activeTab === 'certs' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[#111112] to-[#0c0c11] border border-indigo-500/20 rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center text-center min-h-[400px] relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
             
             <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-6 relative z-10">
                <Award className="w-10 h-10 text-indigo-400" />
             </div>
             
             <h3 className="text-xl font-bold text-white mb-2 relative z-10">Certificaciones Blockchain</h3>
             <p className="text-sm text-gray-400 mb-8 max-w-md relative z-10 leading-relaxed">
               Todas las certificaciones obtenidas en Reyplace Academy se emiten como NFTs en la blockchain, garantizando su autenticidad y permitiendo que negocios e instituciones las verifiquen instantáneamente.
             </p>
             
             <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all border border-white/10 flex items-center gap-2 relative z-10">
               Ver Mis Certificados <ShieldCheck className="w-4 h-4 text-green-400" />
             </button>
          </div>
          
          <div className="space-y-4">
             {MOCK_CERTS.map(cert => (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 key={cert.id}
                 className="bg-[#111112] border border-white/5 rounded-2xl p-6 shadow-xl flex items-center gap-6"
               >
                  <div className="w-16 h-16 rounded-2xl bg-[#080809] border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                    <Award className="w-8 h-8 text-amber-400 drop-shadow-md" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base font-bold text-white">{cert.name}</h4>
                      {cert.verifiableOnBlockchain && (
                        <ShieldCheck className="w-4 h-4 text-green-400" title="Verificable en Blockchain" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{cert.issuer}</p>
                    <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-gray-500">
                      <span>Puntaje Min: <span className="text-white">{cert.requiredScore}%</span></span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-indigo-500/20 shrink-0">
                    Tomar Examen
                  </button>
               </motion.div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}
