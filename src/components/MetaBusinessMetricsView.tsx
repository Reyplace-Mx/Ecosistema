import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  Share2, 
  MessageCircle, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShoppingBag, 
  Eye, 
  MousePointerClick, 
  Target, 
  Sparkles, 
  Calendar, 
  ArrowUpRight, 
  MapPin, 
  Zap, 
  Filter 
} from 'lucide-react';
import { MOCHIS_ZONES_DATA } from '../lib/metaBusinessService';

// Time series mock metrics for Los Mochis Meta campaigns
const DAILY_METRICS_DATA = [
  { day: 'Lun', reach: 8400, marketplaceClicks: 420, whatsappLeads: 48, conversionsRYC: 18 },
  { day: 'Mar', reach: 9800, marketplaceClicks: 560, whatsappLeads: 62, conversionsRYC: 24 },
  { day: 'Mié', reach: 11200, marketplaceClicks: 680, whatsappLeads: 74, conversionsRYC: 31 },
  { day: 'Jue', reach: 13500, marketplaceClicks: 810, whatsappLeads: 89, conversionsRYC: 40 },
  { day: 'Vie', reach: 16800, marketplaceClicks: 1120, whatsappLeads: 135, conversionsRYC: 58 },
  { day: 'Sáb', reach: 19400, marketplaceClicks: 1430, whatsappLeads: 168, conversionsRYC: 72 },
  { day: 'Dom', reach: 15100, marketplaceClicks: 940, whatsappLeads: 106, conversionsRYC: 49 },
];

const ZONE_PERFORMANCE_DATA = [
  { zone: 'Centro Mochis', leads: 145, salesRYC: 8900, ctr: '5.8%', color: '#00d2ff' },
  { zone: 'Plaza Paseo', leads: 118, salesRYC: 7400, ctr: '6.2%', color: '#38bdf8' },
  { zone: 'Fracc. Scally', leads: 76, salesRYC: 5100, ctr: '4.9%', color: '#818cf8' },
  { zone: 'Col. Fátima', leads: 64, salesRYC: 3800, ctr: '4.2%', color: '#a855f7' },
  { zone: 'Valle del Fuerte', leads: 92, salesRYC: 6900, ctr: '5.4%', color: '#ec4899' },
  { zone: 'Topolobampo', leads: 47, salesRYC: 2700, ctr: '3.9%', color: '#10b981' },
];

const CHANNEL_SHARE_DATA = [
  { name: 'FB Marketplace', value: 44, color: '#1877F2' },
  { name: 'WhatsApp Business', value: 32, color: '#25D366' },
  { name: 'Instagram Direct & Shop', value: 16, color: '#E1306C' },
  { name: 'Meta Pixel CAPI Web', value: 8, color: '#8b5cf6' },
];

const FUNNEL_DATA = [
  { stage: '1. Impresiones Meta Mochis', users: 94200, fill: '#3b82f6' },
  { stage: '2. Clics Catálogo & Marketplace', users: 18400, fill: '#06b6d4' },
  { stage: '3. Leads / Chats WhatsApp', users: 4820, fill: '#10b981' },
  { stage: '4. Cotizaciones & Envíos', users: 1950, fill: '#f59e0b' },
  { stage: '5. Pagos en Reycoin (RYC)', users: 840, fill: '#ec4899' },
];

const TOP_CAMPAIGNS = [
  {
    id: 'camp_1',
    name: 'Campaña AgroTech IoT Los Mochis & Valle',
    channel: 'Facebook Ads + Marketplace',
    budget: '$3,500 MXN',
    roas: '5.2x',
    leads: 184,
    status: 'active',
  },
  {
    id: 'camp_2',
    name: 'Kit Domótica Paseo Mochis & Scally',
    channel: 'Instagram Reels + WhatsApp CAPI',
    budget: '$2,200 MXN',
    roas: '4.4x',
    leads: 129,
    status: 'active',
  },
  {
    id: 'camp_3',
    name: 'Ofertas Flash Sensores LoRa Sinaloa',
    channel: 'FB Marketplace Mochis',
    budget: '$1,800 MXN',
    roas: '3.9x',
    leads: 95,
    status: 'active',
  },
];

export function MetaBusinessMetricsView() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'leads' | 'conversions'>('all');

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111112] border border-white/10 rounded-2xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">
              Analítica Meta Business Suite & Facebook Marketplace
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Métricas de rendimiento en Los Mochis y Valle del Fuerte, Sinaloa (Graph API v19.0)
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-black/50 p-1 rounded-xl border border-white/5 flex gap-1 text-xs">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                timeRange === '7d' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              7 Días
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                timeRange === '30d' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              30 Días
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                timeRange === '90d' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Trimestre
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Alcance Total Mochis</span>
            <Eye className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">94,200</div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3 h-3" /> +18.4% vs semana previa
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Leads WhatsApp</span>
            <MessageCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">682 <span className="text-xs text-gray-400 font-normal">chats</span></div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <Zap className="w-3 h-3" /> 84% de respuesta &lt; 2 min
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-purple-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">ROAS Publicitario</span>
            <Target className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">4.8x</div>
          <div className="flex items-center gap-1 text-xs text-purple-300 font-medium">
            <ArrowUpRight className="w-3 h-3" /> $4.80 por cada $1.00 invertido
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Ventas Cerradas (RYC)</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">34,800 <span className="text-xs text-cyan-300 font-normal">RYC</span></div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3 h-3" /> +22.7% en Los Mochis
          </div>
        </div>
      </div>

      {/* Primary Recharts Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Temporal AreaChart (Daily Reach & Clicks) */}
        <div className="lg:col-span-8 bg-[#111112] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Alcance y Tráfico Semanal en Los Mochis
              </h3>
              <p className="text-xs text-gray-400">Interacciones diarias desde Facebook Marketplace e Instagram</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Alcance
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Clics
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> WhatsApp Leads
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DAILY_METRICS_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00d2ff" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="day" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#374151', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    color: '#ffffff' 
                  }} 
                />
                <Area type="monotone" dataKey="reach" name="Alcance Personas" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorReach)" />
                <Area type="monotone" dataKey="marketplaceClicks" name="Clics Catálogo" stroke="#00d2ff" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" />
                <Area type="monotone" dataKey="whatsappLeads" name="Leads WhatsApp" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Acquisition Channel Share PieChart */}
        <div className="lg:col-span-4 bg-[#111112] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-purple-400" />
              Canales de Venta Meta
            </h3>
            <p className="text-xs text-gray-400">Distribución de leads en Ahome</p>
          </div>

          <div className="h-52 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CHANNEL_SHARE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {CHANNEL_SHARE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any) => [`${val}%`, 'Participación']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#374151', borderRadius: '12px', fontSize: '11px', color: '#fff' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {CHANNEL_SHARE_DATA.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-200">{item.name}</span>
                </div>
                <span className="font-bold text-white font-mono">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Recharts Section: Urban Zone Performance & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Zone Performance BarChart */}
        <div className="lg:col-span-6 bg-[#111112] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Ventas y Leads por Zona de Los Mochis
              </h3>
              <p className="text-xs text-gray-400">Facturación en Reycoin y tasa de conversión local</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ZONE_PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis 
                  dataKey="zone" 
                  stroke="#6b7280" 
                  tick={{ fill: '#9ca3af', fontSize: 10 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#374151', borderRadius: '12px', fontSize: '11px', color: '#fff' }} 
                />
                <Bar dataKey="salesRYC" name="Ventas (RYC)" fill="#00d2ff" radius={[6, 6, 0, 0]} />
                <Bar dataKey="leads" name="Leads WhatsApp" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Funnel & Conversion Stages */}
        <div className="lg:col-span-6 bg-[#111112] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              Embudo de Conversión Meta Commerce
            </h3>
            <p className="text-xs text-gray-400">Flujo completo desde anuncio hasta cobro en Reycoin</p>
          </div>

          <div className="space-y-3 pt-2">
            {FUNNEL_DATA.map((step, idx) => {
              const percentage = Math.round((step.users / FUNNEL_DATA[0].users) * 100);
              return (
                <div key={step.stage} className="p-3 rounded-xl bg-white/5 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{step.stage}</span>
                    <span className="font-mono text-cyan-300 font-bold">
                      {step.users.toLocaleString()} <span className="text-[10px] text-gray-400">({percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${Math.max(4, percentage)}%`,
                        backgroundColor: step.fill
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Active Campaigns in Los Mochis Table */}
      <div className="bg-[#111112] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Campañas Activas en Los Mochis (Meta Ads Manager)
          </h3>
          <span className="text-xs text-cyan-400 font-mono">Graph API Sincronizado</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Campaña / Segmento</th>
                <th className="py-3 px-4">Canal Meta</th>
                <th className="py-3 px-4">Presupuesto</th>
                <th className="py-3 px-4">Leads WhatsApp</th>
                <th className="py-3 px-4">ROAS</th>
                <th className="py-3 px-4 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {TOP_CAMPAIGNS.map(camp => (
                <tr key={camp.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-medium text-white">{camp.name}</td>
                  <td className="py-3 px-4 text-gray-400">{camp.channel}</td>
                  <td className="py-3 px-4 font-mono text-gray-300">{camp.budget}</td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{camp.leads}</td>
                  <td className="py-3 px-4 font-mono text-cyan-400 font-bold">{camp.roas}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-bold text-[10px] uppercase border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Activa
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
