
export type SupportedLang = 'es' | 'en' | 'pt';
export type AppTab = 'home' | 'explore' | 'social_pulse';
export type AntioquiaRegion = 'Oriente' | 'Suroeste' | 'Occidente' | 'Norte' | 'Bajo Cauca' | 'Nordeste' | 'Magdalena Medio' | 'Urabá' | 'Valle de Aburrá';

export interface GroundingLink {
  title: string;
  uri: string;
  type: 'video' | 'official' | 'social' | 'news';
}

export interface SocialPulse {
  trendingScore: number; // 0-100
  platform: 'TikTok' | 'Instagram' | 'YouTube';
  sentiment: 'Positivo' | 'Neutral' | 'Crítico';
  recentMentions: number;
  lastUpdate: string;
}

export interface PlaceData {
  type: 'place';
  titulo: string;
  region: AntioquiaRegion;
  descripcion: string;
  budget: {
    busTicket: number;
    averageMeal: number;
  };
  accessibility: {
    score: number;
    wheelchairFriendly: boolean;
    elderlyApproved: boolean;
    notes: string;
  };
  security: {
    status: 'Seguro' | 'Precaución' | 'Crítico';
    lastReported: string;
    emergencyNumber: string;
  };
  socialPulse?: SocialPulse;
  groundingLinks?: GroundingLink[];
  viaEstado: string;
  tiempoDesdeMedellin: string;
  imagen: string;
  coordenadas: { lat: number; lng: number };
  weather?: {
    condition: string;
    temp: number;
  };
  neighborTip?: string;
  // Detalle extendido de la Guía del Arriero
  foodTip?: string;
  cultureTip?: string;
  logisticsTip?: string;
  peopleTip?: string;
  terminalInfo?: string;
  busFrequency?: string;
  busCompanies?: string[];
  seguridadTexto?: string;
  // Additional fields for local logistics matching
  nomadScore?: number;
  wifiQuality?: string;
}

export type UnifiedItem = PlaceData;

export interface AppState {
  busqueda: string;
  cargando: boolean;
  error: string | null;
  tarjeta: PlaceData | null;
  unifiedResults: UnifiedItem[];
  language: SupportedLang;
  activeTab: AppTab;
  accessibilityMode: boolean;
}

// Fix: Added missing exported member ChallengeData
export interface ChallengeData {
  id: string;
  titulo: string;
  mision: string;
  dificultad: 'Fácil' | 'Media' | 'Arriero';
  recompensa: string;
  completado: boolean;
}

// Fix: Added missing exported member UGCContent
export interface UGCContent {
  id: string;
  created_at: string;
  place_slug: string;
  user_name: string;
  comment: string;
  stars: number;
}

// Fix: Added missing exported member DishData
export interface DishData {
  nombre: string;
  descripcion: string;
  categoria: string;
  precioLocalEstimated: number;
  precioVerificado: boolean;
  economiaCircular: boolean;
}

// Fix: Added missing exported member CultureExperience
export interface CultureExperience {
  titulo: string;
  descripcion: string;
  categoria: string;
  impactoSocial: string;
  ubicacion: string;
}
