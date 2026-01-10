
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

// Added UGCContent interface
export interface UGCContent {
  id: string;
  created_at: string;
  place_slug: string;
  user_name: string;
  comment: string;
  stars: number;
}

// Added ChallengeData interface
export interface ChallengeData {
  titulo: string;
  mision: string;
  dificultad: 'Fácil' | 'Media' | 'Arriero';
  recompensa: string;
  completado: boolean;
}

// Added DishData interface
export interface DishData {
  nombre: string;
  categoria: string;
  descripcion: string;
  precioLocalEstimated: number;
  precioVerificado: boolean;
  economiaCircular: boolean;
}

// Added CultureExperience interface
export interface CultureExperience {
  titulo: string;
  categoria: string;
  descripcion: string;
  impactoSocial: string;
  ubicacion: string;
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
  // Added missing optional fields used in PlaceCard
  weather?: {
    condition: string;
    temp: number;
  };
  neighborTip?: string;
  terminalInfo?: string;
  busFrequency?: string;
  busCompanies?: string[];
  seguridadTexto?: string;
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
