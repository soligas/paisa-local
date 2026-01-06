
export type SupportedLang = 'es' | 'en' | 'pt';
export type AppTab = 'home' | 'explore' | 'gastronomy' | 'culture';
export type AntioquiaRegion = 'Oriente' | 'Suroeste' | 'Occidente' | 'Norte' | 'Bajo Cauca' | 'Nordeste' | 'Magdalena Medio' | 'Urabá' | 'Valle de Aburrá';

export interface GroundingLink {
  uri: string;
  title: string;
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
  productoresOrigen?: { nombre: string; finca: string; impacto: string }[];
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
  maestroOficio?: { nombre: string; especialidad: string; años: number };
}

export interface ChallengeData {
  titulo: string;
  mision: string;
  dificultad: 'Fácil' | 'Media' | 'Arriero';
  recompensa: string;
  completado: boolean;
}

export interface PlaceData {
  type: 'place';
  titulo: string;
  region: AntioquiaRegion;
  descripcion: string;
  seguridadTexto: string;
  verdadIncomoda?: string;
  vibeScore: number;
  nomadScore: number;
  viaEstado: 'Despejada' | 'Paso Restringido' | 'Cerrada';
  tiempoDesdeMedellin: string;
  budget: {
    busTicket: number;
    averageMeal: number;
  };
  coordenadas: { lat: number; lng: number };
  imagen: string;
  itinerarioImpacto?: { hora: string; actividad: string; beneficio: string }[];
  isVerified?: boolean;
  sources?: any[];
  neighborTip?: string;
  trivia?: string;
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
  visitedTowns: string[]; // Nuevo: Municipios sellados en el pasaporte
  transcription: string; // Nuevo: Texto del Arriero en tiempo real
}
