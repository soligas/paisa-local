
export type SupportedLang = 'es' | 'en' | 'pt';
export type AppTab = 'home' | 'explore' | 'gastronomy' | 'culture';
export type AntioquiaRegion = 'Oriente' | 'Suroeste' | 'Occidente' | 'Norte' | 'Bajo Cauca' | 'Nordeste' | 'Magdalena Medio' | 'Urabá' | 'Valle de Aburrá';

export interface GroundingLink {
  title: string;
  uri: string;
  type: 'video' | 'official' | 'news' | 'photo' | 'other';
}

export interface AccessibilityData {
  wheelchairFriendly: boolean;
  elderlyApproved: boolean;
  brailleAvailable: boolean;
  sensoryFriendly: boolean;
  score: number; // 0-100
  notes: string;
}

export interface SecurityData {
  status: 'Seguro' | 'Precaución' | 'Crítico';
  lastReported: string;
  emergencyNumber: string;
  touristPoliceLink: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
}

export interface PlaceData {
  type: 'place';
  titulo: string;
  region: AntioquiaRegion;
  descripcion: string;
  seguridadTexto: string;
  security?: SecurityData;
  accessibility?: AccessibilityData;
  groundingLinks?: GroundingLink[];
  vibeScore: number;
  nomadScore: number; 
  wifiQuality: 'Excelente' | 'Inestable' | 'Limitada';
  viaEstado: 'Despejada' | 'Paso Restringido' | 'Cerrada';
  tiempoDesdeMedellin: string;
  busFrequency: string; 
  busCompanies: string[];
  budget: {
    busTicket: number;
    averageMeal: number;
  };
  coordenadas: { lat: number; lng: number };
  imagen: string; 
  isVerified?: boolean;
  neighborTip?: string;
  trivia?: string;
  terminalInfo?: string;
  weather?: WeatherData;
}

export interface DishData {
  type: 'dish';
  nombre: string;
  descripcion: string;
  dondeProbar: string;
  categoria: string;
  imagen: string;
  precioLocalEstimated: string;
  precioVerificado: boolean;
  economiaCircular: boolean;
}

export interface CultureExperience {
  type: 'experience';
  titulo: string;
  descripcion: string;
  ubicacion: string;
  categoria: string;
  impactoSocial: string;
  imagen: string;
  costoSugeridoCOP: string;
  horarioRecomendado: string;
}

export interface UGCContent {
  id: string;
  created_at: string;
  place_slug: string;
  user_name: string;
  comment: string;
  stars: number;
}

export interface ChallengeData {
  id: string;
  titulo: string;
  mision: string;
  recompensa: string;
  dificultad: 'Fácil' | 'Media' | 'Arriero';
  completado: boolean;
}

export type UnifiedItem = PlaceData | DishData | CultureExperience;

export interface AppState {
  busqueda: string;
  sugerencias: string[];
  cargando: boolean;
  buscandoSugerencias: boolean;
  error: string | null;
  tarjeta: PlaceData | null;
  unifiedResults: UnifiedItem[];
  language: SupportedLang;
  activeTab: AppTab;
  favorites: string[];
  foodFavorites: string[];
  cultureFavorites: string[];
  visitedTowns: string[];
  transcription: string;
  accessibilityMode: boolean; 
}
