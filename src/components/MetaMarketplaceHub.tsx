import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Share2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  MapPin,
  Store,
  DollarSign,
  Search,
  Filter,
  Plus,
  Zap,
  Eye,
  Bookmark,
  Users,
  Sparkles,
  ShoppingBag,
  Layers,
  BarChart2,
  Radio,
  Send,
  Building,
  Anchor,
  Wheat,
  SlidersHorizontal,
  X
} from 'lucide-react';
import {
  MOCHIS_ZONES_DATA,
  INITIAL_MOCHIS_PRODUCTS,
  INITIAL_META_STATUS,
  metaBusinessService
} from '../lib/metaBusinessService';
import type { MetaMarketplaceItem, MochisZone, MochisZoneAnalytics, MetaServiceStatus } from '../types';

export function MetaMarketplaceHub() {
  const [items, setItems] = useState<MetaMarketplaceItem[]>(INITIAL_MOCHIS_PRODUCTS);
  const [selectedZone, setSelectedZone] = useState<MochisZone | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [metaStatus, setMetaStatus] = useState<MetaServiceStatus>(INITIAL_META_STATUS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const [isCreatingModalOpen, setIsCreatingModalOpen] = useState(false);

  // New item form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<MetaMarketplaceItem['category']>('agroindustria');
  const [newBusinessName, setNewBusinessName] = useState('');
  const [newZone, setNewZone] = useState<MochisZone>('zona_centro');
  const [newAddress, setNewAddress] = useState('Av. Gabriel Leyva #100, Los Mochis, Sin.');
  const [newPriceMXN, setNewPriceMXN] = useState<number>(2500);
  const [newStock, setNewStock] = useState<number>(10);
  const [newPhone, setNewPhone] = useState('526681234567');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600&auto=format&fit=crop&q=80');

  // Trigger manual Meta Graph API sync
  const handleSyncCatalog = async () => {
    setIsSyncing(true);
    setSyncToast('Conectando con Meta Graph API v19 y sincronizando feeds de Facebook Marketplace...');
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSyncing(false);
    setMetaStatus((prev) => ({
      ...prev,
      lastWebhookSync: new Date().toISOString()
    }));
    setSyncToast('¡Catálogo de Los Mochis sincronizado exitosamente con Meta Commerce Manager y WhatsApp Cloud API!');
    setTimeout(() => setSyncToast(null), 4000);
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesZone = selectedZone === 'all' || item.zone === selectedZone;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesZone && matchesCategory && matchesSearch;
  });

  // Calculate zone summary
  const currentZoneData = MOCHIS_ZONES_DATA.find((z) => z.zone === selectedZone);

  // Handle Add Item
  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBusinessName.trim()) return;

    const zoneObj = MOCHIS_ZONES_DATA.find((z) => z.zone === newZone) || MOCHIS_ZONES_DATA[0];
    const newItem: MetaMarketplaceItem = {
      id: `meta-lm-${Date.now()}`,
      facebookListingId: `fb_mp_${Math.floor(10000000000 + Math.random() * 90000000000)}`,
      title: newTitle,
      category: newCategory,
      businessName: newBusinessName,
      zone: newZone,
      zoneLabel: zoneObj.name.split('(')[0].trim(),
      addressMochis: newAddress,
      postalCode: zoneObj.postalCode,
      priceMXN: Number(newPriceMXN),
      priceRYC: Number((newPriceMXN / 20).toFixed(1)),
      inventoryStock: Number(newStock),
      metaSyncStatus: 'synced',
      lastSyncedAt: 'Recién sincronizado (Meta Graph API)',
      facebookViews: 12,
      marketplaceSaves: 2,
      whatsAppLeads: 1,
      whatsappContactNumber: newPhone,
      sellerRating: 5.0,
      isSponsored: false,
      image: newImage,
      tags: ['Mochis', newCategory, zoneObj.postalCode]
    };

    setItems([newItem, ...items]);
    setIsCreatingModalOpen(false);
    setSyncToast(`"${newTitle}" ha sido publicado en Facebook Marketplace (Región Los Mochis / Ahome) y Reyplace.`);
    setTimeout(() => setSyncToast(null), 4000);

    // Reset inputs
    setNewTitle('');
    setNewBusinessName('');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {syncToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-3.5 bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border border-cyan-500/40 rounded-2xl flex items-center justify-between text-xs text-cyan-200 shadow-xl"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow shrink-0" />
              <span>{syncToast}</span>
            </div>
            <button onClick={() => setSyncToast(null)} className="text-slate-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meta & Facebook Service Header Bar */}
      <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-cyan-950/60 border border-blue-500/20 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/30 shrink-0">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Meta Business Suite & Facebook Marketplace
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Mochis, Sinaloa MX
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Graph API v19.0 + CAPI
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Retroalimentación continua con datos de comercios, demanda de mercado local (Ahome y Valle del Fuerte), sincronización de inventario en Facebook Shops y generación de leads directos a WhatsApp Business.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsCreatingModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar en Meta Mochis</span>
            </button>

            <button
              onClick={handleSyncCatalog}
              disabled={isSyncing}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Feeds'}</span>
            </button>
          </div>
        </div>

        {/* Live Meta Telemetry Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
          <div className="bg-black/40 rounded-xl p-2.5 border border-white/5">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Catálogo Meta ID</div>
            <div className="font-mono text-cyan-300 font-bold truncate mt-0.5">{metaStatus.facebookCatalogId}</div>
          </div>
          <div className="bg-black/40 rounded-xl p-2.5 border border-white/5">
            <div className="text-[10px] font-mono text-slate-400 uppercase">WhatsApp Business Hub</div>
            <div className="font-mono text-emerald-400 font-bold truncate mt-0.5">{metaStatus.whatsappBusinessNumber}</div>
          </div>
          <div className="bg-black/40 rounded-xl p-2.5 border border-white/5">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Campañas Ahome Activas</div>
            <div className="font-mono text-purple-300 font-bold truncate mt-0.5">{metaStatus.activeAdCampaignsMochis} en circulación</div>
          </div>
          <div className="bg-black/40 rounded-xl p-2.5 border border-white/5">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Retorno ROI Meta Ads</div>
            <div className="font-mono text-amber-400 font-bold truncate mt-0.5">+{metaStatus.roiMetaAdsPercent}% en Sinaloa</div>
          </div>
        </div>
      </div>

      {/* Regional Intelligence Bar: Los Mochis Districts */}
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Inteligencia Comercial por Zonas de Los Mochis (Ahome, Sinaloa)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Filtra y analiza la demanda de consumo en tiempo real sincronizada con Facebook Marketplace y grupos comerciales locales.
            </p>
          </div>

          {/* District selector pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedZone('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedZone === 'all'
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              Todo Los Mochis ({MOCHIS_ZONES_DATA.reduce((acc, z) => acc + z.activeBusinesses, 0)} Negocios)
            </button>
            {MOCHIS_ZONES_DATA.map((z) => (
              <button
                key={z.zone}
                onClick={() => setSelectedZone(z.zone)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  selectedZone === z.zone
                    ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{z.name.split('/')[0].split('(')[0].trim()}</span>
                <span className="text-[10px] font-mono text-cyan-300">({z.activeBusinesses})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Zone Analytics Cards */}
        {currentZoneData ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 bg-slate-950 p-4 rounded-2xl border border-white/5">
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Zona / Código Postal</div>
              <div className="text-xs font-bold text-white mt-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{currentZoneData.name.split('(')[0]} (CP {currentZoneData.postalCode})</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Volumen FB Marketplace</div>
              <div className="text-xs font-bold text-emerald-400 mt-1">
                ${(currentZoneData.fbMarketplaceVolumeMXN / 1000000).toFixed(2)}M MXN/mes
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Índice de Demanda</div>
              <div className="text-xs font-bold text-cyan-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>{currentZoneData.demandIndex}/100</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Categoría Líder</div>
              <div className="text-xs font-bold text-amber-300 mt-1 truncate">
                {currentZoneData.topCategory}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Conversión Promedio</div>
              <div className="text-xs font-bold text-purple-400 mt-1">
                {currentZoneData.avgConversionRate}%
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">WhatsApp Engagement</div>
              <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentZoneData.whatsappEngagement}%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-2xl border border-white/5">
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Negocios Registrados Ahome</div>
              <div className="text-base font-bold text-white mt-0.5">
                {MOCHIS_ZONES_DATA.reduce((acc, z) => acc + z.activeBusinesses, 0)} Puntos de Venta
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Volumen Mensual Transaccionado</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">
                ${(MOCHIS_ZONES_DATA.reduce((acc, z) => acc + z.fbMarketplaceVolumeMXN, 0) / 1000000).toFixed(1)}M MXN
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Sectores Clave Sinaloa</div>
              <div className="text-xs font-bold text-cyan-300 mt-1">
                Agroindustria • Mariscos • Retail • Tecnología
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Sincronización WhatsApp</div>
              <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cotización directa instantánea</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por producto, negocio o colonia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Categories selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'agroindustria', label: '🌾 Agroindustria' },
            { id: 'gastronomia_mariscos', label: '🦐 Mariscos & Comida' },
            { id: 'tecnologia', label: '💻 Tecnología' },
            { id: 'automotriz_refacciones', label: '🚗 Refacciones' },
            { id: 'servicios_profesionales', label: '💼 Servicios Pro' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-white text-black font-bold shadow'
                  : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid from Facebook Marketplace & Meta Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const waUrl = metaBusinessService.getWhatsAppInquiryUrl(item);
          const fbUrl = metaBusinessService.getFacebookMarketplaceUrl(item);
          const aiAdvice = metaBusinessService.getAIPricingFeedback(item.category, item.priceMXN);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/90 border border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-cyan-500/40 transition-all group"
            >
              {/* Product Header & Image */}
              <div>
                <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Top badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold bg-black/70 backdrop-blur-md text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                      <Share2 className="w-3 h-3 text-blue-400" />
                      <span>{item.facebookListingId.substring(0, 12)}...</span>
                    </span>

                    {item.isSponsored ? (
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-purple-600/80 backdrop-blur-md text-white shadow-md">
                        Meta Ad Mochis
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-emerald-600/80 backdrop-blur-md text-white">
                        Orgánico
                      </span>
                    )}
                  </div>

                  {/* Bottom Image Overlay Info */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {item.zoneLabel} • CP {item.postalCode}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <div className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <Store className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{item.businessName}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1 leading-snug line-clamp-2">
                      {item.title}
                    </h4>
                  </div>

                  {/* Pricing Display */}
                  <div className="p-3 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Precio Los Mochis</div>
                      <div className="text-lg font-extrabold text-white">
                        ${item.priceMXN.toLocaleString('es-MX')}{' '}
                        <span className="text-xs font-normal text-slate-400">MXN</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-cyan-400 uppercase">En Reycoin</div>
                      <div className="text-sm font-mono font-bold text-cyan-300">
                        {item.priceRYC} RYC
                      </div>
                    </div>
                  </div>

                  {/* Address & Meta Social Telemetry */}
                  <div className="text-[11px] text-slate-400 space-y-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{item.addressMochis}</span>
                    </div>
                  </div>

                  {/* Facebook & WhatsApp Leads Metrics */}
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono pt-2 border-t border-white/5 text-slate-300">
                    <div className="bg-white/5 p-1.5 rounded-xl">
                      <div className="text-slate-500 uppercase text-[8px]">Vistas FB</div>
                      <div className="font-bold text-cyan-400 flex items-center justify-center gap-1 mt-0.5">
                        <Eye className="w-3 h-3" />
                        <span>{item.facebookViews}</span>
                      </div>
                    </div>
                    <div className="bg-white/5 p-1.5 rounded-xl">
                      <div className="text-slate-500 uppercase text-[8px]">Guardados</div>
                      <div className="font-bold text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                        <Bookmark className="w-3 h-3" />
                        <span>{item.marketplaceSaves}</span>
                      </div>
                    </div>
                    <div className="bg-white/5 p-1.5 rounded-xl">
                      <div className="text-slate-500 uppercase text-[8px]">Leads WA</div>
                      <div className="font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                        <MessageCircle className="w-3 h-3" />
                        <span>{item.whatsAppLeads}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 space-y-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Cotizar por WhatsApp Business</span>
                </a>

                <div className="flex items-center gap-2">
                  <a
                    href={fbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-semibold text-[11px] border border-blue-500/30 flex items-center justify-center gap-1 transition-all"
                  >
                    <Share2 className="w-3 h-3 text-blue-400" />
                    <span>Ver en Facebook</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                  </a>

                  <div className="px-2 py-1.5 rounded-xl bg-white/5 text-slate-400 text-[10px] font-mono shrink-0">
                    Stock: <strong className="text-white">{item.inventoryStock} u.</strong>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal for Creating New Meta Marketplace Listing */}
      <AnimatePresence>
        {isCreatingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-xl w-full space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-600 text-white">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Publicar en Meta Marketplace (Los Mochis)</h3>
                    <p className="text-[11px] text-slate-400">Sincronización instantánea con Facebook Shops y WhatsApp Catalog</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreatingModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Título del Producto o Servicio</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Paquete de Semillas Híbridas de Maíz Blanco Sinaloa 25kg"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full mt-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Nombre del Negocio / Empresa</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. AgroServicios El Fuerte"
                      value={newBusinessName}
                      onChange={(e) => setNewBusinessName(e.target.value)}
                      className="w-full mt-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Categoría Comercial</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full mt-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-sans"
                    >
                      <option value="agroindustria">🌾 Agroindustria & Granos</option>
                      <option value="gastronomia_mariscos">🦐 Gastronomía & Mariscos</option>
                      <option value="tecnologia">💻 Tecnología & Software</option>
                      <option value="automotriz_refacciones">🚗 Refacciones Automotrices</option>
                      <option value="servicios_profesionales">💼 Servicios Profesionales</option>
                      <option value="retail_moda">🛍️ Retail & Moda</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Zona en Los Mochis</label>
                    <select
                      value={newZone}
                      onChange={(e) => setNewZone(e.target.value as any)}
                      className="w-full mt-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-sans"
                    >
                      {MOCHIS_ZONES_DATA.map((z) => (
                        <option key={z.zone} value={z.zone}>{z.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Dirección / Colonia</label>
                    <input
                      type="text"
                      placeholder="Ej. Blvd. Rosales #450, Col. Centro"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="w-full mt-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Precio (MXN)</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newPriceMXN}
                      onChange={(e) => setNewPriceMXN(Number(e.target.value))}
                      className="w-full mt-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Equivalente (RYC)</label>
                    <input
                      type="text"
                      disabled
                      value={`${(newPriceMXN / 20).toFixed(1)} RYC`}
                      className="w-full mt-1 bg-cyan-950/30 border border-cyan-500/30 rounded-xl px-3 py-2 text-cyan-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Inventario Inicial</label>
                    <input
                      type="number"
                      min="1"
                      value={newStock}
                      onChange={(e) => setNewStock(Number(e.target.value))}
                      className="w-full mt-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">WhatsApp de Contacto (con lada)</label>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="Ej. 526681234567"
                      className="w-full mt-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">URL de Imagen del Producto</label>
                    <input
                      type="text"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      className="w-full mt-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsCreatingModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:text-white cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:brightness-110 shadow-lg shadow-blue-600/30 cursor-pointer flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Publicar en Meta Marketplace</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
