import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  MessageSquare, 
  Award, 
  Briefcase, 
  GraduationCap, 
  Star, 
  CheckCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Coins,
  ShieldCheck,
  ChevronRight,
  MapPin
} from 'lucide-react';

export function ProfessionalProfile() {
  return (
    <div className="h-full flex flex-col overflow-y-auto bg-slate-50 dark:bg-[#080809] animate-fade-in relative">
      
      {/* Cover Image */}
      <div className="h-48 md:h-64 lg:h-80 w-full bg-gradient-to-r from-cyan-900 to-blue-900 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#080809] to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 relative z-10 w-full pb-20">
        
        {/* Header Section */}
        <div className="bg-white dark:bg-[#111112] rounded-3xl shadow-xl border border-slate-200 dark:border-white/5 p-6 sm:p-8 md:p-10 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            
            {/* Avatar */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1.5 bg-white dark:bg-[#080809] border border-slate-200 dark:border-white/10 shadow-lg shrink-0 -mt-16 sm:-mt-20 md:mt-0 relative group">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop" 
                  alt="Alex Vanguard" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white dark:border-[#111112] shadow-sm" title="En línea"></div>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    Alex Vanguard
                    <ShieldCheck className="w-6 h-6 text-cyan-600 dark:text-cyan-400" title="Perfil Verificado por Cúpula" />
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-cyan-400 font-medium mt-1">
                    Consultor de Arquitectura Web3 & Smart Contracts
                  </p>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-cyan-600/20">
                    <Calendar className="w-5 h-5" />
                    <span>Agendar cita</span>
                  </button>
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl font-bold transition-colors">
                    <MessageSquare className="w-5 h-5" />
                    <span>Mensaje</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-500 dark:text-gray-400 pt-2">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" /> Remoto / Global
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-slate-700 dark:text-white">4.9</span> (124 reseñas)
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" /> Respuesta usual: &lt; 2 horas
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Sobre mí */}
            <section className="bg-white dark:bg-[#111112] rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-white/5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-cyan-600 dark:text-cyan-500" />
                Sobre mí
              </h2>
              
              <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
                <p className="text-slate-600 dark:text-gray-300 leading-relaxed">
                  Con más de 8 años de experiencia en ingeniería de software y 4 enfocados exclusivamente en ecosistemas Web3, me especializo en diseñar arquitecturas descentralizadas robustas y seguras. Mi enfoque se centra en crear puentes entre la lógica de negocios tradicional (ERP) y la inmutabilidad de blockchain mediante contratos inteligentes altamente optimizados.
                </p>
                <p className="text-slate-600 dark:text-gray-300 leading-relaxed mt-4">
                  He colaborado activamente en la integración de Reycoin v2 y poseo un profundo conocimiento de los estándares de seguridad requeridos por la Cúpula Digital.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Experiencia</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="mt-1 w-2 h-2 rounded-full bg-cyan-500 shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">Lead Blockchain Engineer</h4>
                        <p className="text-xs text-slate-500 mt-0.5">TechCorp Global • 2021 - Presente</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="mt-1 w-2 h-2 rounded-full bg-slate-300 dark:bg-gray-600 shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">Desarrollador Full-Stack</h4>
                        <p className="text-xs text-slate-500 mt-0.5">InnovateX • 2018 - 2021</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Certificaciones</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                      <Award className="w-5 h-5 text-amber-500 shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-gray-300 font-medium">Reyplace Academy: Smart Contracts Avanzado</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                      <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-gray-300 font-medium">Cúpula Digital: Auditor de Seguridad Nivel 3</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Servicios Destacados */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Star className="w-6 h-6 text-amber-500" />
                  Servicios Destacados
                </h2>
                <button className="text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors flex items-center gap-1 group">
                  Ver todos <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Auditoría de Smart Contracts',
                    desc: 'Revisión exhaustiva buscando vulnerabilidades (re-entrancy, overflow, etc.) antes del despliegue.',
                    price: 'Desde 1,500 RYC',
                    icon: ShieldCheck
                  },
                  {
                    title: 'Diseño de Tokenomics',
                    desc: 'Modelado económico para tu ecosistema de tokens, incentivos y mecanismos de quema.',
                    price: 'Desde 2,000 RYC',
                    icon: Coins
                  },
                  {
                    title: 'Integración ERP Web3',
                    desc: 'Conexión entre sistemas legacy y blockchain mediante oráculos y contratos Escrow.',
                    price: 'Desde 3,500 RYC',
                    icon: Briefcase
                  }
                ].map((service, idx) => (
                  <div key={idx} className="bg-white dark:bg-[#111112] rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-white/5 hover:border-cyan-500/30 dark:hover:border-cyan-500/30 transition-colors flex flex-col h-full group cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center mb-4 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                      <service.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">{service.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-6 flex-1 line-clamp-3">{service.desc}</p>
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{service.price}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Portafolio */}
            <section className="bg-white dark:bg-[#111112] rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-white/5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-cyan-600 dark:text-cyan-500" />
                Portafolio y Casos de Éxito
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    title: 'Marketplace Descentralizado B2B',
                    client: 'Consorcio Logístico Sur',
                    desc: 'Arquitectura y despliegue de contratos Escrow para asegurar el pago entre proveedores logísticos. Reducción del fraude en un 99%.',
                    tags: ['Solidity', 'Reycoin v2', 'React'],
                    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop'
                  },
                  {
                    title: 'Sistema de Votación DAO',
                    client: 'Comunidad Smart City',
                    desc: 'Implementación de gobernanza on-chain para presupuestos comunitarios. Altamente optimizado para bajas comisiones (gas fees).',
                    tags: ['Smart Contracts', 'Web3.js', 'Auditoría'],
                    img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop'
                  }
                ].map((project, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-6 group">
                    <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                      <img src={project.img} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                      <p className="text-xs text-cyan-600 dark:text-cyan-500 font-medium mb-2">{project.client}</p>
                      <p className="text-sm text-slate-600 dark:text-gray-400 mb-3 line-clamp-2">{project.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 text-xs rounded-md font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            
            {/* Integración Reycoin & Precios */}
            <div className="bg-gradient-to-b from-cyan-900 to-[#111112] rounded-3xl p-6 shadow-xl border border-cyan-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Coins className="w-32 h-32 text-cyan-300" />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-sm uppercase tracking-widest font-bold text-cyan-400 mb-6 flex items-center gap-2">
                  <Coins className="w-4 h-4" /> Contratación
                </h3>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-300 mb-1">Tarifa por hora</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-light text-white">150</span>
                    <span className="text-amber-500 font-bold">RYC</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Pagos protegidos por Escrow
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Milestones personalizables
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Facturación automática ERP
                  </div>
                </div>

                <button className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-xl font-bold transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2">
                  Pagar con Reycoin <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-center text-xs text-gray-400 mt-4">
                  También acepta FIAT vía pasarela Reyplace
                </p>
              </div>
            </div>

            {/* Testimonios */}
            <div className="bg-white dark:bg-[#111112] rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-white/5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-6">Opiniones de clientes</h3>
              
              <div className="space-y-5">
                {[
                  {
                    name: 'Carlos Ruiz',
                    company: 'Logística Express',
                    rating: 5,
                    text: 'Excelente trabajo. El contrato de escrow funcionó a la perfección y se entregó antes de tiempo.',
                    date: 'Hace 1 mes'
                  },
                  {
                    name: 'Mariana G.',
                    company: 'Startup FinTech',
                    rating: 5,
                    text: 'Muy profesional. Encontró una vulnerabilidad crítica en nuestro código antes del lanzamiento.',
                    date: 'Hace 3 meses'
                  }
                ].map((review, idx) => (
                  <div key={idx} className="pb-5 border-b border-slate-100 dark:border-white/5 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{review.name}</p>
                        <p className="text-xs text-slate-500">{review.company}</p>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <Star className="w-3 h-3 fill-amber-500" />
                        <Star className="w-3 h-3 fill-amber-500" />
                        <Star className="w-3 h-3 fill-amber-500" />
                        <Star className="w-3 h-3 fill-amber-500" />
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-gray-400 italic">"{review.text}"</p>
                    <p className="text-[10px] text-slate-400 mt-2">{review.date}</p>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-2 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                Ver 122 reseñas más
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
