import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Database,
  Package,
  ShoppingCart,
  TrendingUp,
  Cpu,
  Zap,
  BarChart,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Settings,
  Download,
  Filter,
  Search,
  CheckCircle,
  FileText
} from 'lucide-react';
import type { ERPInventoryItem, ERPSalesData, ERPAutomationRule } from '../types';

const MOCK_INVENTORY: ERPInventoryItem[] = [
  {
    id: 'inv_1',
    name: 'Hardware Wallet "Reyplace Safe"',
    sku: 'RPS-001',
    category: 'Electrónica',
    stock: 45,
    minStock: 20,
    priceRYC: 120,
    priceUSD: 120,
    status: 'in_stock',
    supplier: 'Reyplace Hardware',
    lastRestock: '15/10/2023'
  },
  {
    id: 'inv_2',
    name: 'Kit de Sensores Smart City',
    sku: 'SCK-400',
    category: 'IoT',
    stock: 8,
    minStock: 15,
    priceRYC: 450,
    priceUSD: 450,
    status: 'low_stock',
    supplier: 'UrbanTech Solutions',
    lastRestock: '02/10/2023'
  },
  {
    id: 'inv_3',
    name: 'Terminal de Pago Reycoin (POS)',
    sku: 'POS-RYC2',
    category: 'Equipamiento',
    stock: 0,
    minStock: 10,
    priceRYC: 250,
    priceUSD: 250,
    status: 'out_of_stock',
    supplier: 'Reyplace Hardware',
    lastRestock: '10/09/2023'
  }
];

const MOCK_SALES: ERPSalesData[] = [
  {
    id: 'sale_1',
    date: 'Hoy, 10:45',
    orderId: 'ORD-9824',
    customer: 'María Fernández',
    amountRYC: 120,
    amountUSD: 120,
    status: 'completed',
    paymentMethod: 'reywallet'
  },
  {
    id: 'sale_2',
    date: 'Hoy, 09:12',
    orderId: 'ORD-9823',
    customer: 'Tech Store Centro',
    amountRYC: 450,
    amountUSD: 450,
    status: 'completed',
    paymentMethod: 'web3'
  },
  {
    id: 'sale_3',
    date: 'Ayer, 16:30',
    orderId: 'ORD-9822',
    customer: 'Juan Pérez',
    amountRYC: 25,
    amountUSD: 25,
    status: 'refunded',
    paymentMethod: 'card'
  }
];

const MOCK_RULES: ERPAutomationRule[] = [
  {
    id: 'rule_1',
    name: 'Auto-reabastecimiento POS',
    trigger: 'Stock < Min (Terminal POS)',
    action: 'Crear orden a Reyplace Hardware',
    status: 'active',
    lastRun: 'Hace 2 horas',
    successRate: 100
  },
  {
    id: 'rule_2',
    name: 'Alerta de Precios Competitivos',
    trigger: 'Cambio de precio en Marketplace',
    action: 'Notificar y sugerir ajuste de margen',
    status: 'active',
    lastRun: 'Ayer',
    successRate: 95
  },
  {
    id: 'rule_3',
    name: 'Conciliación Web3 Diaria',
    trigger: '00:00 hrs GMT-5',
    action: 'Sincronizar ReyWallet y Ledger',
    status: 'paused',
    successRate: 88
  }
];

export function ERPDashboard() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'sales' | 'finance' | 'ai_reports' | 'automation'>('inventory');

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col overflow-y-auto">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
            <Database className="w-8 h-8 text-emerald-400" />
            ERP Reyplace <span className="text-gray-600 font-medium">/</span> Gestión Empresarial
          </h1>
          <p className="text-gray-400 mt-2">Planificación de recursos, automatización de procesos e inteligencia de negocios.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 bg-[#111112] border border-white/5 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'inventory' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <span className="hidden sm:inline">Inventario</span>
            <span className="sm:hidden"><Package className="w-4 h-4" /></span>
          </button>
          <button 
            onClick={() => setActiveTab('sales')}
            className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'sales' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <span className="hidden sm:inline">Ventas</span>
            <span className="sm:hidden"><ShoppingCart className="w-4 h-4" /></span>
          </button>
          <button 
            onClick={() => setActiveTab('finance')}
            className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'finance' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <span className="hidden sm:inline">Finanzas</span>
            <span className="sm:hidden"><DollarSign className="w-4 h-4" /></span>
          </button>
          <button 
            onClick={() => setActiveTab('ai_reports')}
            className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'ai_reports' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <span className="hidden sm:inline">Reportes IA</span>
            <span className="sm:hidden"><BarChart className="w-4 h-4" /></span>
          </button>
          <button 
            onClick={() => setActiveTab('automation')}
            className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'automation' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <span className="hidden sm:inline">Automatización</span>
            <span className="sm:hidden"><Zap className="w-4 h-4" /></span>
          </button>
        </div>
      </header>

      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-[#111112] border border-white/5 rounded-lg px-3 py-2 w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Buscar SKU, nombre o categoría..." 
                className="bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-600 w-full"
              />
            </div>
            <div className="flex gap-2">
               <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                 <Filter className="w-4 h-4" /> Filtrar
               </button>
               <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                 <Plus className="w-4 h-4" /> Nuevo Artículo
               </button>
            </div>
          </div>

          <div className="bg-[#111112] border border-white/5 rounded-2xl shadow-xl overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b border-white/5 bg-[#080809]/50">
                     <th className="px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Producto / SKU</th>
                     <th className="px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Categoría</th>
                     <th className="px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Stock</th>
                     <th className="px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Precio (RYC/USD)</th>
                     <th className="px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Estado</th>
                     <th className="px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Acciones</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {MOCK_INVENTORY.map(item => (
                     <tr key={item.id} className="hover:bg-white/5 transition-colors">
                       <td className="px-5 py-4">
                          <p className="text-sm font-bold text-white mb-0.5">{item.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono">{item.sku}</p>
                       </td>
                       <td className="px-5 py-4 text-xs text-gray-400">
                         {item.category}
                       </td>
                       <td className="px-5 py-4">
                         <div className="flex flex-col items-center">
                           <span className={`text-sm font-bold ${
                             item.stock === 0 ? 'text-red-400' :
                             item.stock <= item.minStock ? 'text-amber-400' :
                             'text-green-400'
                           }`}>
                             {item.stock}
                           </span>
                           <span className="text-[9px] text-gray-500 uppercase">Min: {item.minStock}</span>
                         </div>
                       </td>
                       <td className="px-5 py-4">
                         <p className="text-sm font-bold text-white flex items-center gap-1">{item.priceRYC} <span className="text-[9px] text-amber-500">RYC</span></p>
                       </td>
                       <td className="px-5 py-4">
                          <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded flex items-center gap-1 w-max ${
                            item.status === 'in_stock' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                            item.status === 'low_stock' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {item.status === 'in_stock' ? 'Con Stock' : item.status === 'low_stock' ? 'Stock Bajo' : 'Agotado'}
                          </span>
                       </td>
                       <td className="px-5 py-4 text-right">
                         <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white transition-colors border border-white/10">
                           Editar
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'sales' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#111112] border border-white/5 rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-sm font-bold text-white flex items-center gap-2">
                   <ShoppingCart className="w-4 h-4 text-emerald-400" /> Transacciones Recientes
                 </h3>
                 <button className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors">
                   Ver Libro Mayor
                 </button>
              </div>
              
              <div className="space-y-3">
                {MOCK_SALES.map(sale => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={sale.id}
                    className="bg-[#080809] border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                        sale.status === 'completed' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                        sale.status === 'refunded' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                        'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      }`}>
                         {sale.status === 'completed' ? <CheckCircle className="w-5 h-5" /> :
                          sale.status === 'refunded' ? <AlertTriangle className="w-5 h-5" /> :
                          <TrendingUp className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white mb-0.5">{sale.customer}</p>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-gray-500">{sale.date}</span>
                          <span className="text-gray-600 font-mono">{sale.orderId}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-bold text-white flex items-center justify-end gap-1">
                        {sale.amountRYC} <span className="text-[10px] text-amber-500">RYC</span>
                      </p>
                      <p className="text-[9px] uppercase font-bold tracking-widest text-gray-500 mt-1">
                        Via {sale.paymentMethod}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
             <div className="bg-[#111112] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <h3 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-6">Métricas del Día</h3>
                
                <div className="space-y-6 relative z-10">
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-widest">Ingresos Brutos</p>
                    <p className="text-3xl font-light text-white mb-1">595 <span className="text-sm font-bold text-amber-500">RYC</span></p>
                    <p className="text-xs text-green-400 flex items-center gap-1 font-bold"><ArrowUpRight className="w-3 h-3" /> +12.5% vs ayer</p>
                  </div>
                  
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-widest">Ticket Promedio</p>
                    <p className="text-xl font-bold text-white mb-1">198.33 <span className="text-[10px] text-amber-500">RYC</span></p>
                  </div>
                  
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-widest">Tasa de Conversión</p>
                    <p className="text-xl font-bold text-white">4.2%</p>
                  </div>
                </div>
                
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'finance' && (
        <div className="bg-[#111112] border border-white/5 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center text-center min-h-[500px]">
           <DollarSign className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
           <h2 className="text-2xl font-bold text-white mb-2">Módulo Financiero y Contabilidad</h2>
           <p className="text-gray-400 max-w-md mx-auto mb-8">
             Gestión de tesorería, conciliación bancaria, declaraciones de impuestos y conexión con el contrato inteligente de escrow.
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
             <div className="bg-[#080809] border border-white/5 rounded-xl p-5 hover:border-emerald-500/30 transition-colors cursor-pointer group">
               <Database className="w-6 h-6 text-gray-400 group-hover:text-emerald-400 mb-3 transition-colors" />
               <h4 className="text-sm font-bold text-white mb-1">Flujo de Caja</h4>
               <p className="text-xs text-gray-500">Histórico de ingresos y egresos.</p>
             </div>
             <div className="bg-[#080809] border border-white/5 rounded-xl p-5 hover:border-emerald-500/30 transition-colors cursor-pointer group">
               <FileText className="w-6 h-6 text-gray-400 group-hover:text-emerald-400 mb-3 transition-colors" />
               <h4 className="text-sm font-bold text-white mb-1">Impuestos & SAT</h4>
               <p className="text-xs text-gray-500">Reportes automatizados DGI/SAT.</p>
             </div>
             <div className="bg-[#080809] border border-white/5 rounded-xl p-5 hover:border-emerald-500/30 transition-colors cursor-pointer group">
               <TrendingUp className="w-6 h-6 text-gray-400 group-hover:text-emerald-400 mb-3 transition-colors" />
               <h4 className="text-sm font-bold text-white mb-1">Nóminas</h4>
               <p className="text-xs text-gray-500">Pago de salarios en FIAT y RYC.</p>
             </div>
           </div>
        </div>
      )}

      {activeTab === 'ai_reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-gradient-to-br from-[#111112] to-[#0a1510] border border-emerald-500/20 rounded-2xl p-8 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Cpu className="w-32 h-32 text-emerald-400" />
             </div>
             
             <div className="flex items-center gap-3 mb-6 relative z-10">
               <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                 <Cpu className="w-5 h-5 text-emerald-400" />
               </div>
               <h3 className="text-xl font-bold text-white">Insight Generator (Reybot)</h3>
             </div>
             
             <div className="space-y-4 relative z-10 mb-8">
               <div className="bg-[#080809]/80 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-4">
                 <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 mb-2">Predicción de Demanda</p>
                 <p className="text-sm text-gray-300 leading-relaxed">Se espera un aumento del 40% en ventas de 'Hardware Wallet' para la próxima semana debido al evento 'Festival Web3' en Smart City. Sugiero aumentar stock en 20 unidades.</p>
               </div>
               <div className="bg-[#080809]/80 backdrop-blur-sm border border-white/5 rounded-xl p-4">
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">Optimización de Precios</p>
                 <p className="text-sm text-gray-300 leading-relaxed">El precio de 'Terminal de Pago Reycoin' está un 5% por debajo del mercado. Un ajuste marginal mejoraría la rentabilidad sin afectar el volumen.</p>
               </div>
             </div>
             
             <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 relative z-10">
               <BarChart className="w-4 h-4" /> Generar Reporte Completo
             </button>
           </div>
           
           <div className="bg-[#111112] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center">
             <BarChart className="w-12 h-12 text-gray-600 mb-4" />
             <h3 className="text-lg font-bold text-white mb-2">Visualizador de Datos</h3>
             <p className="text-sm text-gray-500 mb-6 max-w-sm">
               Conecta tus fuentes de datos para visualizar gráficos dinámicos de ventas, crecimiento de usuarios y retención, alimentados por D3 y Recharts.
             </p>
             <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-bold transition-colors border border-white/10">
               Configurar Dashboard
             </button>
           </div>
        </div>
      )}

      {activeTab === 'automation' && (
        <div className="bg-[#111112] border border-white/5 rounded-2xl shadow-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" /> Reglas de Automatización Empresarial
            </h3>
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Nueva Regla
            </button>
          </div>
          
          <div className="space-y-4">
             {MOCK_RULES.map(rule => (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 key={rule.id}
                 className={`border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                   rule.status === 'active' ? 'bg-[#080809] border-emerald-500/20' : 'bg-[#080809] border-white/5 opacity-60'
                 }`}
               >
                 <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                     rule.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-gray-500/10 border-gray-500/20 text-gray-500'
                   }`}>
                     <Zap className="w-6 h-6" />
                   </div>
                   <div>
                     <h4 className="text-sm font-bold text-white mb-1">{rule.name}</h4>
                     <div className="flex items-center gap-3 text-xs text-gray-400">
                       <span className="flex items-center gap-1 font-mono bg-white/5 px-2 py-0.5 rounded">
                         <span className="text-gray-500">IF:</span> {rule.trigger}
                       </span>
                       <span className="flex items-center gap-1 font-mono bg-white/5 px-2 py-0.5 rounded">
                         <span className="text-gray-500">THEN:</span> {rule.action}
                       </span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                   <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded border ${
                     rule.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-gray-500 border-white/10'
                   }`}>
                     {rule.status === 'active' ? 'Activa' : 'Pausada'}
                   </span>
                   {rule.lastRun && (
                     <span className="text-[10px] text-gray-500">
                       Última vez: {rule.lastRun} ({rule.successRate}% éxito)
                     </span>
                   )}
                 </div>
               </motion.div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}
