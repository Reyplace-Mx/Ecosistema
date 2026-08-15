/**
 * Meta Business Suite & Facebook Marketplace Integration Service
 * Specialised for Los Mochis, Sinaloa, México (Ahome & Valle del Fuerte)
 * 
 * Manages Graph API sync, Facebook Catalog feeds, Conversions API (CAPI),
 * WhatsApp Business Cloud Webhooks, and regional trade analytics.
 */

import type { MetaMarketplaceItem, MochisZone, MochisZoneAnalytics, MetaServiceStatus } from '../types';

export const MOCHIS_ZONES_DATA: MochisZoneAnalytics[] = [
  {
    zone: 'zona_centro',
    name: 'Zona Centro Histórico (Leyva & Obregón)',
    postalCode: '81200',
    activeBusinesses: 342,
    fbMarketplaceVolumeMXN: 4850000,
    demandIndex: 94,
    topCategory: 'Retail, Ferretería & Refacciones',
    avgConversionRate: 8.4,
    whatsappEngagement: 92,
    growthMoM: 14.2
  },
  {
    zone: 'plaza_paseo',
    name: 'Corredor Comercial Paseo Los Mochis / Centenario',
    postalCode: '81240',
    activeBusinesses: 188,
    fbMarketplaceVolumeMXN: 6200000,
    demandIndex: 98,
    topCategory: 'Moda, Electrónica & Gastronomía',
    avgConversionRate: 11.2,
    whatsappEngagement: 96,
    growthMoM: 19.8
  },
  {
    zone: 'scally_country',
    name: 'Fracc. Scally / Country Club / Gabriel Leyva Norte',
    postalCode: '81220',
    activeBusinesses: 115,
    fbMarketplaceVolumeMXN: 3900000,
    demandIndex: 89,
    topCategory: 'Servicios Médicos, Restaurantes & Consultoría',
    avgConversionRate: 9.6,
    whatsappEngagement: 88,
    growthMoM: 12.5
  },
  {
    zone: 'tabachines_fatima',
    name: 'Colonia Fátima / Tabachines / Rosales',
    postalCode: '81210',
    activeBusinesses: 160,
    fbMarketplaceVolumeMXN: 3100000,
    demandIndex: 86,
    topCategory: 'Alimentos Preparados & Servicios Técnicos',
    avgConversionRate: 7.9,
    whatsappEngagement: 84,
    growthMoM: 8.7
  },
  {
    zone: 'valle_del_fuerte',
    name: 'Valle del Fuerte & Corredor Agroindustrial',
    postalCode: '81280',
    activeBusinesses: 245,
    fbMarketplaceVolumeMXN: 14200000,
    demandIndex: 96,
    topCategory: 'Agroinsumos, Semillas, Maquinaria & Riego',
    avgConversionRate: 14.5,
    whatsappEngagement: 95,
    growthMoM: 22.4
  },
  {
    zone: 'parque_industrial',
    name: 'Parque Industrial Ecológico / Mochis Sur',
    postalCode: '81255',
    activeBusinesses: 82,
    fbMarketplaceVolumeMXN: 8900000,
    demandIndex: 91,
    topCategory: 'Empaque, Logística & Distribución Mayorista',
    avgConversionRate: 12.0,
    whatsappEngagement: 91,
    growthMoM: 16.3
  },
  {
    zone: 'topolobampo_puerto',
    name: 'Puerto de Topolobampo & Bahía',
    postalCode: '81370',
    activeBusinesses: 94,
    fbMarketplaceVolumeMXN: 7400000,
    demandIndex: 92,
    topCategory: 'Pesca, Marisco Fresco, Turismo & Combustibles',
    avgConversionRate: 13.8,
    whatsappEngagement: 89,
    growthMoM: 18.0
  },
  {
    zone: 'nuevo_horizonte',
    name: 'Nuevo Horizonte / Viñedos / Sector Poniente',
    postalCode: '81233',
    activeBusinesses: 130,
    fbMarketplaceVolumeMXN: 2400000,
    demandIndex: 82,
    topCategory: 'Bazar, Abarrotes & Comercio Barrial',
    avgConversionRate: 6.8,
    whatsappEngagement: 80,
    growthMoM: 7.4
  }
];

export const INITIAL_MOCHIS_PRODUCTS: MetaMarketplaceItem[] = [
  {
    id: 'meta-lm-1',
    facebookListingId: 'fb_mp_89201948102',
    title: 'Kit de Monitoreo IoT para Riego Agrícola de Maíz y Hortalizas',
    category: 'agroindustria',
    businessName: 'AgroSmart Sinaloa del Fuerte',
    zone: 'valle_del_fuerte',
    zoneLabel: 'Valle del Fuerte',
    addressMochis: 'Carretera Los Mochis - San Blas Km 4.5, Ahome',
    postalCode: '81280',
    priceMXN: 14500,
    priceRYC: 725,
    inventoryStock: 28,
    metaSyncStatus: 'synced',
    lastSyncedAt: 'Hace 3 min (Meta Graph API v19)',
    facebookViews: 2840,
    marketplaceSaves: 312,
    whatsAppLeads: 86,
    whatsappContactNumber: '526681234567',
    sellerRating: 4.9,
    isSponsored: true,
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600&auto=format&fit=crop&q=80',
    tags: ['Agro', 'Riego por Goteo', 'Sinaloa', 'Maíz', 'IoT']
  },
  {
    id: 'meta-lm-2',
    facebookListingId: 'fb_mp_89201948103',
    title: 'Lote de Camarón Azul de Bahía Topolobampo U-12 Congelado IQF',
    category: 'gastronomia_mariscos',
    businessName: 'Mariscos & Pesca Selecta Topolobampo',
    zone: 'topolobampo_puerto',
    zoneLabel: 'Puerto de Topolobampo',
    addressMochis: 'Muelle Fiscal S/N, Puerto de Topolobampo, Ahome',
    postalCode: '81370',
    priceMXN: 480,
    priceRYC: 24,
    inventoryStock: 450,
    metaSyncStatus: 'synced',
    lastSyncedAt: 'Hace 12 min (Facebook Catalog Sync)',
    facebookViews: 4120,
    marketplaceSaves: 580,
    whatsAppLeads: 194,
    whatsappContactNumber: '526688765432',
    sellerRating: 5.0,
    isSponsored: true,
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&auto=format&fit=crop&q=80',
    tags: ['Mariscos', 'Topolobampo', 'Camarón', 'Gourmet', 'Mayoreo']
  },
  {
    id: 'meta-lm-3',
    facebookListingId: 'fb_mp_89201948104',
    title: 'Terminal Punto de Venta POS con Facturación SAT 4.0 & Reycoin',
    category: 'tecnologia',
    businessName: 'Sistemas Digitales del Noroeste (SDN)',
    zone: 'plaza_paseo',
    zoneLabel: 'Paseo Los Mochis / Centenario',
    addressMochis: 'Blvd. Centenario #850 Ote., Plaza Paseo Local 42',
    postalCode: '81240',
    priceMXN: 6800,
    priceRYC: 340,
    inventoryStock: 15,
    metaSyncStatus: 'synced',
    lastSyncedAt: 'Hace 25 min',
    facebookViews: 1650,
    marketplaceSaves: 145,
    whatsAppLeads: 42,
    whatsappContactNumber: '526683456789',
    sellerRating: 4.8,
    isSponsored: false,
    image: 'https://images.unsplash.com/photo-1556742049-0a67e55722c0?w=600&auto=format&fit=crop&q=80',
    tags: ['POS', 'Facturación SAT', 'Mochis', 'Comercio']
  },
  {
    id: 'meta-lm-4',
    facebookListingId: 'fb_mp_89201948105',
    title: 'Kit de Balatas y Discos Cerámicos para Pickups y Camionetas Agrícolas',
    category: 'automotriz_refacciones',
    businessName: 'Refaccionaria & Frenos de Los Mochis',
    zone: 'zona_centro',
    zoneLabel: 'Zona Centro Histórico',
    addressMochis: 'Av. Gabriel Leyva #415 Nte., Col. Centro',
    postalCode: '81200',
    priceMXN: 2450,
    priceRYC: 122.5,
    inventoryStock: 34,
    metaSyncStatus: 'synced',
    lastSyncedAt: 'Hace 45 min',
    facebookViews: 1980,
    marketplaceSaves: 210,
    whatsAppLeads: 68,
    whatsappContactNumber: '526685678901',
    sellerRating: 4.7,
    isSponsored: false,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80',
    tags: ['Refacciones', 'Pickups', 'Centro Mochis', 'Automotriz']
  },
  {
    id: 'meta-lm-5',
    facebookListingId: 'fb_mp_89201948106',
    title: 'Consultoría Fiscal y Blindaje Patrimonial Corporativo Sinaloa',
    category: 'servicios_profesionales',
    businessName: 'Despacho Consultores Scally & Asociados',
    zone: 'scally_country',
    zoneLabel: 'Fracc. Scally / Country',
    addressMochis: 'Blvd. Rosendo G. Castro #210 Pte., Fracc. Scally',
    postalCode: '81220',
    priceMXN: 8500,
    priceRYC: 425,
    inventoryStock: 50,
    metaSyncStatus: 'synced',
    lastSyncedAt: 'Hace 1 hora',
    facebookViews: 1420,
    marketplaceSaves: 98,
    whatsAppLeads: 35,
    whatsappContactNumber: '526689012345',
    sellerRating: 4.9,
    isSponsored: true,
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
    tags: ['Fiscal', 'Empresarial', 'Scally', 'ReyID']
  }
];

export const INITIAL_META_STATUS: MetaServiceStatus = {
  graphApiConnected: true,
  metaBusinessSuiteId: 'act_mochis_commerce_98214',
  facebookCatalogId: 'cat_ahome_sinaloa_feed_01',
  whatsappBusinessNumber: '+52 668 100 9000 (Hub Mochis)',
  conversionsApiActive: true,
  metaPixelStatus: 'active',
  lastWebhookSync: '2026-08-14T03:10:00.000Z',
  activeAdCampaignsMochis: 14,
  roiMetaAdsPercent: 382
};

export class MetaBusinessService {
  private static instance: MetaBusinessService;

  public static getInstance(): MetaBusinessService {
    if (!MetaBusinessService.instance) {
      MetaBusinessService.instance = new MetaBusinessService();
    }
    return MetaBusinessService.instance;
  }

  /**
   * Generates a direct WhatsApp click-to-chat URL with pre-filled inquiry
   */
  public getWhatsAppInquiryUrl(item: MetaMarketplaceItem): string {
    const text = encodeURIComponent(
      `Hola ${item.businessName}, vi su publicación en Facebook Marketplace / Reyplace Mochis: "${item.title}" ($${item.priceMXN.toLocaleString('es-MX')} MXN / ${item.priceRYC} RYC). Me interesa cotizar entrega en Los Mochis.`
    );
    return `https://wa.me/${item.whatsappContactNumber.replace(/[^0-9]/g, '')}?text=${text}`;
  }

  /**
   * Generates Facebook Marketplace direct share / view link
   */
  public getFacebookMarketplaceUrl(item: MetaMarketplaceItem): string {
    return `https://www.facebook.com/marketplace/item/${item.facebookListingId.replace(/[^0-9]/g, '') || '89201948102'}/`;
  }

  /**
   * Simulates publishing or updating an item to Meta Commerce Catalog
   */
  public async syncItemToMetaCatalog(item: Partial<MetaMarketplaceItem>): Promise<{ success: boolean; listingId: string; syncedAt: string }> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newId = `fb_mp_${Date.now()}`;
    return {
      success: true,
      listingId: newId,
      syncedAt: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    };
  }

  /**
   * AI-based pricing and demand suggestion for Los Mochis market
   */
  public getAIPricingFeedback(category: string, currentPriceMXN: number): {
    suggestedPriceMXN: number;
    demandLevel: 'Alta Demanda Valle del Fuerte' | 'Demanda Estable Los Mochis' | 'Oportunidad de Oferta';
    recommendedAdBudgetMXN: number;
    estimatedReachPeople: number;
  } {
    if (category === 'agroindustria') {
      return {
        suggestedPriceMXN: Math.round(currentPriceMXN * 1.05),
        demandLevel: 'Alta Demanda Valle del Fuerte',
        recommendedAdBudgetMXN: 350,
        estimatedReachPeople: 18500
      };
    }
    if (category === 'gastronomia_mariscos') {
      return {
        suggestedPriceMXN: Math.round(currentPriceMXN * 0.98),
        demandLevel: 'Alta Demanda Valle del Fuerte',
        recommendedAdBudgetMXN: 200,
        estimatedReachPeople: 24000
      };
    }
    return {
      suggestedPriceMXN: currentPriceMXN,
      demandLevel: 'Demanda Estable Los Mochis',
      recommendedAdBudgetMXN: 150,
      estimatedReachPeople: 12000
    };
  }
}

export const metaBusinessService = MetaBusinessService.getInstance();
