
export type SupportedLang = 'es' | 'en' | 'pt';
export type AppTab = 'home' | 'explore' | 'social_pulse' | 'favorites';
export type AntioquiaRegion = 'Oriente' | 'Suroeste' | 'Occidente' | 'Norte' | 'Bajo Cauca' | 'Nordeste' | 'Magdalena Medio' | 'Urabá' | 'Valle de Aburrá';

export interface GroundingLink {
  title: string;
  uri: string;
  type: 'video' | 'official' | 'social' | 'news';
}

export interface CharcoTactico {
  nombre: string;
  descripcion: string;
  mapUrl: string;
  videoUrl: string;
  dificultad: 'Fácil' | 'Media' | 'Arriero';
  equipoNecesario: string[];
  requiereGuia: boolean;
}

export interface FinancialSpot {
  nombre: string;
  tipo: 'ATM' | 'CORRESPONSAL' | 'CAMBIO' | 'BANCO';
  nota?: string;
}

export interface GastroRecommendation {
  nombre: string;
  precio: number;
  descripcion?: string;
}

/**
 * Representa un plato típico con información de sostenibilidad y verificación.
 * Se utiliza en el componente DishCard.
 */
export interface DishData {
  nombre: string;
  categoria: string;
  descripcion: string;
  precioLocalEstimated: number;
  precioVerificado: boolean;
  economiaCircular: boolean;
  imagen?: string;
}

/**
 * Representa una experiencia cultural o turística.
 * Se utiliza en el componente ExperienceCard.
 */
export interface CultureExperience {
  titulo: string;
  categoria: string;
  descripcion: string;
  impactoSocial: string;
  ubicacion: string;
  imagen?: string;
}

export interface PlaceData {
  type: 'place';
  titulo: string;
  region: AntioquiaRegion;
  descripcion: string;
  budget: {
    busTicket: number;
    averageMeal: number;
    dailyStay?: number;
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
  viaEstado: string;
  tiempoDesdeMedellin: string;
  imagen: string;
  coordenadas: { lat: number; lng: number };
  weather?: {
    condition: string;
    temp: number;
  };
  paymentMethods: {
    cashOnly: boolean;
    cardAcceptance: 'Baja' | 'Media' | 'Alta';
    digitalTransfer: boolean;
    tacticalNote?: string; // e.g., "Manda el efectivo y QR de Bancolombia"
  };
  atmAvailable: boolean;
  financialSpots?: FinancialSpot[];
  marketDay?: string;
  localMobility: {
    type: string;
    estimatedCost: number;
  };
  packingList: string[];
  neighborTip?: string;
  busFrequency?: string;
  terminalInfo?: string;
  vibeScore?: number;
  mapUrl?: string;
  terminalUrl?: string;
  gastroSocialUrl?: string;
  gastroVideoUrl?: string;
  exchangeHousesUrl?: string;
  charcosTacticos?: CharcoTactico[];
  groundingLinks?: GroundingLink[];
  gastronomia?: GastroRecommendation[];
}

export type UnifiedItem = PlaceData;

export interface AppState {
  busqueda: string;
  cargando: boolean;
  error: string | null;
  tarjeta: PlaceData | null;
  unifiedResults: UnifiedItem[];
  favoritePlaces: PlaceData[];
  language: SupportedLang;
  activeTab: AppTab;
  accessibilityMode: boolean;
}

export interface ChallengeData {
  titulo: string;
  mision: string;
  dificultad: 'Fácil' | 'Media' | 'Arriero';
  recompensa: string;
  completado: boolean;
}

export interface UGCContent {
  id: string;
  created_at: string;
  place_slug: string;
  user_name: string;
  comment: string;
  stars: number;
}
