import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Package, 
  Star, 
  CreditCard, 
  Truck, 
  ChevronRight,
  TrendingUp,
  Tag,
  Store,
  ShieldCheck,
  Share2,
  MapPin
} from 'lucide-react';
import type { MarketItem, CartItem, Order } from '../types';
import { MetaMarketplaceHub } from '../components/MetaMarketplaceHub';

const MOCK_ITEMS: MarketItem[] = [
  {
    id: 'item_1',
    name: 'Módulo de Integración API (Web3)',
    type: 'service',
    sellerName: 'DevCorp Solutions',
    priceRYC: 450,
    priceUSD: 450,
    rating: 4.8,
    sales: 124,
    inStock: true,
    variants: ['Standard', 'Enterprise']
  },
  {
    id: 'item_2',
    name: 'Hardware Wallet "Reyplace Safe"',
    type: 'product',
    sellerName: 'Reyplace Oficial',
    priceRYC: 120,
    priceUSD: 120,
    rating: 4.9,
    sales: 892,
    inStock: true,
    variants: ['Titanium', 'Carbon Black']
  },
  {
    id: 'item_3',
    name: 'Servidor Nodo Dedicado (1 Mes)',
    type: 'service',
    sellerName: 'CloudNet Vanguard',
    priceRYC: 85,
    rating: 4.7,
    sales: 45,
    inStock: true
  },
  {
    id: 'item_4',
    name: 'Kit de Sensores IoT Smart City',
    type: 'product',
    sellerName: 'UrbanTech',
    priceRYC: 210,
    priceUSD: 210,
    rating: 4.6,
    sales: 310,
    inStock: true
  }
];

const MOCK_CART: CartItem[] = [
  {
    id: 'cart_1',
    item: MOCK_ITEMS[1],
    quantity: 1,
    selectedVariant: 'Carbon Black'
  }
];

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-9821',
    date: 'Ayer',
    totalRYC: 450,
    status: 'completed',
    items: 1
  },
  {
    id: 'ORD-9844',
    date: 'Hoy',
    totalRYC: 120,
    status: 'shipped',
    items: 1
  }
];

export function MarketplaceDashboard() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'meta_marketplace' | 'cart'>('meta_marketplace');

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col overflow-y-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-cyan-400" />
            Marketplace <span className="text-gray-600 font-medium">/</span> Centro de Comercio
          </h1>
          <p className="text-gray-400 mt-2">
            Productos y servicios verificados. Integración con Meta Commerce, Facebook Marketplace Los Mochis y pagos híbridos Reycoin.
          </p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button 
            onClick={() => setActiveTab('meta_marketplace')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'meta_marketplace'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-white/5 text-gray-300 border border-white/5 hover:bg-white/10'
            }`}
          >
            <Share2 className="w-4 h-4 text-cyan-300" />
            <span>Meta & Facebook Mochis</span>
          </button>

          <button 
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'catalog' ? 'bg-white/10 text-white font-semibold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Catálogo Web3
          </button>

          <button 
            onClick={() => setActiveTab('cart')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'cart'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold'
                : 'bg-white/5 text-gray-300 border border-white/5 hover:bg-white/10'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Carrito</span>
            {MOCK_CART.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center text-[10px] font-bold">
                {MOCK_CART.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Tab: Meta & Facebook Marketplace Mochis */}
      {activeTab === 'meta_marketplace' && (
        <MetaMarketplaceHub />
      )}


      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Filters & Categories */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#111112] border border-white/5 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-4 bg-[#080809] border border-white/10 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Buscar productos..." 
                  className="bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-600 w-full"
                />
              </div>
              <div className="flex items-center gap-2 mb-4 text-sm font-bold text-gray-300 uppercase tracking-widest">
                <Filter className="w-4 h-4 text-gray-500" /> Filtros
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer p-2 rounded-lg hover:bg-white/5">
                  <input type="checkbox" className="accent-cyan-500" defaultChecked />
                  <span>Todos los artículos</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer p-2 rounded-lg hover:bg-white/5">
                  <input type="checkbox" className="accent-cyan-500" />
                  <span>Productos Físicos</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer p-2 rounded-lg hover:bg-white/5">
                  <input type="checkbox" className="accent-cyan-500" />
                  <span>Servicios Digitales</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer p-2 rounded-lg hover:bg-white/5">
                  <input type="checkbox" className="accent-cyan-500" />
                  <span>Solo pagos en RYC</span>
                </label>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 border border-cyan-500/20 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h4 className="text-xs uppercase font-bold tracking-widest text-cyan-400">Garantía Escrow</h4>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Tus fondos están protegidos en contratos inteligentes hasta que confirmes la recepción.
              </p>
            </div>
          </div>

          {/* Right Column: Products Grid */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {MOCK_ITEMS.map(item => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={item.id} 
                  className="bg-[#111112] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors shadow-xl group flex flex-col"
                >
                  <div className="h-40 bg-[#080809] border-b border-white/5 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111112] to-transparent opacity-50"></div>
                    {item.type === 'product' ? <Package className="w-16 h-16 text-gray-700 group-hover:scale-110 group-hover:text-cyan-500/50 transition-all duration-500" /> : <Store className="w-16 h-16 text-gray-700 group-hover:scale-110 group-hover:text-blue-500/50 transition-all duration-500" />}
                    
                    <div className="absolute top-3 left-3">
                      <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded bg-black/50 backdrop-blur-sm border ${item.type === 'product' ? 'border-amber-500/30 text-amber-400' : 'border-blue-500/30 text-blue-400'}`}>
                        {item.type === 'product' ? 'Producto' : 'Servicio'}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">{item.name}</h3>
                    <p className="text-[11px] text-gray-500 font-medium mb-3">{item.sellerName}</p>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1 text-xs text-gray-300">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="font-bold">{item.rating}</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-gray-700"></div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{item.sales} ventas</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-white flex items-baseline gap-1">
                          {item.priceRYC} <span className="text-xs text-amber-500">RYC</span>
                        </div>
                        {item.priceUSD && (
                          <div className="text-[10px] text-gray-500">
                            ≈ ${item.priceUSD} USD
                          </div>
                        )}
                      </div>
                      <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-cyan-500 hover:text-black flex items-center justify-center transition-all">
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cart' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#111112] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-medium text-white mb-6">Tu Carrito</h3>
              
              {MOCK_CART.map(cartItem => (
                <div key={cartItem.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 border-b border-white/5 last:border-0">
                  <div className="w-16 h-16 rounded-lg bg-[#080809] border border-white/10 flex items-center justify-center shrink-0">
                    {cartItem.item.type === 'product' ? <Package className="w-6 h-6 text-gray-600" /> : <Store className="w-6 h-6 text-gray-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate mb-1">{cartItem.item.name}</h4>
                    <p className="text-xs text-gray-500 mb-2">Vendido por: {cartItem.item.sellerName}</p>
                    {cartItem.selectedVariant && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-400 border border-white/10">
                        <Tag className="w-3 h-3" /> Variante: {cartItem.selectedVariant}
                      </span>
                    )}
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 mt-2 sm:mt-0">
                    <div className="text-right">
                      <div className="text-base font-bold text-white flex items-baseline gap-1">
                        {cartItem.item.priceRYC * cartItem.quantity} <span className="text-xs text-amber-500">RYC</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-[#080809] border border-white/10 rounded-lg px-2 py-1">
                      <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white">-</button>
                      <span className="text-sm text-white font-medium w-4 text-center">{cartItem.quantity}</span>
                      <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#111112] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-4">Órdenes Recientes</h3>
              <div className="space-y-3">
                {MOCK_ORDERS.map(order => (
                  <div key={order.id} className="bg-[#080809] border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-white">{order.id}</span>
                          <span className={`text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded ${
                            order.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-cyan-500/10 text-cyan-400'
                          }`}>
                            {order.status === 'completed' ? 'Completado' : 'En Envío'}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500">{order.date} • {order.items} artículo(s)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">{order.totalRYC} RYC</div>
                      <button className="text-[10px] text-cyan-400 hover:text-cyan-300 uppercase tracking-widest font-bold mt-1">
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-b from-[#111112] to-[#0c0c0d] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full"></div>
              
              <h3 className="text-lg font-medium text-white mb-6 relative z-10">Resumen de Compra</h3>
              
              <div className="space-y-4 mb-6 relative z-10 border-b border-white/5 pb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white font-medium">120 RYC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Fee de Red (Web3)</span>
                  <span className="text-white font-medium">0.05 RYC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Logística</span>
                  <span className="text-white font-medium">15 RYC</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8 relative z-10">
                <span className="text-sm font-bold text-white uppercase tracking-widest">Total Estimado</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white flex items-baseline gap-1">
                    135.05 <span className="text-sm text-amber-500">RYC</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">≈ $135.05 USD</div>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <button className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" /> Pagar con Reycoin
                </button>
                <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-gray-300 transition-all flex items-center justify-center gap-2">
                  Pago Híbrido (RYC + FIAT)
                </button>
              </div>
            </div>
            
            <div className="bg-[#080809] border border-white/5 rounded-2xl p-4 flex items-start gap-3">
              <Truck className="w-5 h-5 text-gray-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-300 mb-1">Integración Logística</p>
                <p className="text-[10px] text-gray-500 leading-relaxed">El rastreo de envíos se habilita automáticamente tras la confirmación del bloque.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
