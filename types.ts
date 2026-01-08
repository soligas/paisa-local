
export type SupportedLang = 'es' | 'en' | 'pt';
export type AppTab = 'home' | 'explore' | 'gastronomy' | 'culture';
export type AntioquiaRegion = 'Oriente' | 'Suroeste' | 'Occidente' | 'Norte' | 'Bajo Cauca' | 'Nordeste' | 'Magdalena Medio' | 'Urabá' | 'Valle de Aburrá';

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
  vibeScore: number;
  nomadScore: number; // 1-100 (Wi-Fi/Cell signal)
  wifiQuality: 'Excelente' | 'Inestable' | 'Limitada';
  viaEstado: 'Despejada' | 'Paso Restringido' | 'Cerrada';
  tiempoDesdeMedellin: string;
  busFrequency: string; // ej: "Cada 30 min"
  busCompanies: string[];
  budget: {
    busTicket: number;
    averageMeal: number;
  };
  coordenadas: { lat: number; lng: number };
  imagen: string; // Se usará como semilla para el arte generativo
  isVerified?: boolean;
  neighborTip?: string;
  trivia?: string;
  terminalInfo?: string;
  weather?: WeatherData;
  currentFestival?: string;
  itinerary?: {
    morning: string;
    afternoon: string;
    evening: string;
  };
}

export interface DishData {
  type: 'dish';
  nombre: string;
  descripcion: string;
  dondeProbar: string;
  categoria: string;
  imagen: string;
  precioLocalEstimated: string;
  precioTuristaEstimated: string;
  precioVerificado: boolean;
  economiaCircular: boolean;
  productoresOrigen?: { nombre: string; finca: string }[];
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
  maestroOficio?: {
    nombre: string;
    especialidad: string;
    años: number;
  };
}

export interface ChallengeData {
  id: string;
  titulo: string;
  mision: string;
  recompensa: string;
  dificultad: 'Fácil' | 'Media' | 'Arriero';
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
}
