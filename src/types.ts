export interface ReyIDProfile {
  did: string; // Decentralized Identifier
  name: string;
  handle: string;
  walletAddress: string;
  reycoinBalance: number;
  roles: string[];
  kycStatus: 'verified' | 'pending' | 'unverified';
  securityLevel: 'maximum' | 'standard' | 'basic';
  joinDate: string;
}

export interface SignatureLog {
  id: string;
  action: string;
  module: string;
  timestamp: string;
  status: 'confirmed' | 'pending' | 'failed';
  txHash: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isCertified: boolean;
  encryptionLevel: 'standard' | 'quantum' | 'ghost';
  attachment?: {
    name: string;
    type: 'file' | 'image' | 'contract';
    size: string;
  };
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'vip';
  participants: number;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  securityStatus: 'secure' | 'ghost_mode';
}

export interface ProProfile {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  hourlyRateRYC: number;
  availability: 'available' | 'busy' | 'offline';
  skills: string[];
}

export interface Appointment {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'in_progress';
  priceRYC: number;
  paymentStatus: 'paid' | 'pending' | 'escrow';
}

export interface Deliverable {
  id: string;
  name: string;
  clientName: string;
  uploadDate: string;
  status: 'pending_review' | 'approved' | 'rejected';
  size: string;
}

export interface MarketItem {
  id: string;
  name: string;
  type: 'product' | 'service';
  sellerName: string;
  priceRYC: number;
  priceUSD?: number;
  rating: number;
  sales: number;
  inStock: boolean;
  image?: string;
  variants?: string[];
}

export interface CartItem {
  id: string;
  item: MarketItem;
  quantity: number;
  selectedVariant?: string;
}

export interface Order {
  id: string;
  date: string;
  totalRYC: number;
  status: 'processing' | 'shipped' | 'delivered' | 'completed';
  items: number;
}

export interface BusinessProfile {
  id: string;
  name: string;
  category: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  rating: number;
  totalSales: number;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'inactive';
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  priceRYC: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface DeliveryDriver {
  id: string;
  name: string;
  vehicle: string;
  rating: number;
  status: 'available' | 'on_route' | 'offline';
  completedDeliveries: number;
}

export interface DeliveryShipment {
  id: string;
  orderId: string;
  destination: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed';
  estimatedTime: string;
  driverId?: string;
  feeRYC: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  baseFeeRYC: number;
  status: 'active' | 'inactive';
}

export interface WalletData {
  address: string;
  balanceInternalRYC: number;
  balanceWeb3RYC: number;
  totalFiatUSD: number;
  status: 'active' | 'locked' | 'unverified';
}

export interface Transaction {
  id: string;
  date: string;
  type: 'deposit' | 'withdrawal' | 'payment' | 'transfer' | 'fee';
  amountRYC: number;
  amountUSD?: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  network?: 'internal' | 'web3';
  txHash?: string;
}

export interface SmartContract {
  id: string;
  name: string;
  type: 'escrow' | 'subscription' | 'vesting';
  status: 'active' | 'paused' | 'completed';
  balanceRYC: number;
  participants: number;
}

export type NewsCategory = 'local' | 'economy' | 'traffic' | 'weather' | 'security' | 'events';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  author: string;
  publishDate: string;
  isBlockchainVerified: boolean;
  txHash?: string;
  aiSummary?: string;
  impactScore?: number;
}

export type CityAlertSeverity = 'info' | 'warning' | 'critical';

export interface CityAlert {
  id: string;
  type: 'traffic' | 'weather' | 'security' | 'infrastructure';
  title: string;
  description: string;
  severity: CityAlertSeverity;
  location: string;
  timestamp: string;
  isEncryptedReport: boolean;
}

export interface CitySensor {
  id: string;
  type: 'camera' | 'traffic' | 'weather' | 'air_quality';
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  lastReading?: string;
  coordinates?: [number, number];
}

export interface CommunityPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    isCreator: boolean;
    isPro: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  tipsRYC: number;
  groupId?: string;
  groupName?: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  type: 'public' | 'private' | 'pro_only';
  image: string;
}

export interface AcademyCourse {
  id: string;
  title: string;
  instructor: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  priceRYC: number;
  rating: number;
  students: number;
  isPremium: boolean;
  image: string;
}

export interface AcademyWebinar {
  id: string;
  title: string;
  host: string;
  date: string;
  participants: number;
  maxParticipants?: number;
  isLive: boolean;
}

export interface AcademyCertification {
  id: string;
  name: string;
  issuer: string;
  requiredScore: number;
  verifiableOnBlockchain: boolean;
}

export interface ERPInventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  priceRYC: number;
  priceUSD: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  supplier: string;
  lastRestock: string;
}

export interface ERPSalesData {
  id: string;
  date: string;
  orderId: string;
  customer: string;
  amountRYC: number;
  amountUSD: number;
  status: 'completed' | 'pending' | 'refunded';
  paymentMethod: 'reywallet' | 'card' | 'web3';
}

export interface ERPAutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: 'active' | 'paused';
  lastRun?: string;
  successRate?: number;
}

export interface GovProcedure {
  id: string;
  name: string;
  department: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  dateSubmitted: string;
  lastUpdate: string;
}

export interface GovPayment {
  id: string;
  description: string;
  amountRYC: number;
  amountUSD: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
}

export interface GovReport {
  id: string;
  type: string;
  location: string;
  status: 'open' | 'assigned' | 'resolved';
  dateReported: string;
  upvotes: number;
}

export interface ReybotInteraction {
  id: string;
  module: string;
  user: string;
  intent: string;
  status: 'resolved' | 'escalated' | 'processing';
  timestamp: string;
}

export interface CupulaThreat {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  origin: string;
  status: 'blocked' | 'monitoring' | 'investigating';
  timestamp: string;
}

export interface WebAuthnDevice {
  id: string;
  name: string;
  type: 'fingerprint' | 'faceid' | 'hardware_key' | 'passkey';
  credentialId: string;
  registeredAt: string;
  lastUsedAt: string;
  authenticatorAttachment: 'platform' | 'cross-platform';
  status: 'active' | 'revoked';
  algorithm: 'ES256' | 'Ed25519' | 'RS256';
}

export type SupabaseSyncState = 'synced' | 'syncing' | 'signing' | 'updated' | 'error';

export interface Web3Transaction {
  id: string;
  hash: string;
  type: 'transfer' | 'smart_contract' | 'nft_mint' | 'identity_verification';
  amount?: number;
  from: string;
  to: string;
  status: 'confirmed' | 'pending' | 'failed';
  timestamp: string;
}

export interface InfrastructureNode {
  id: string;
  name: string;
  type: 'server' | 'database' | 'cache' | 'cdn' | 'worker';
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  region: string;
  load: number;
  uptime: string;
}
