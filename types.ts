
export type SupportedLang = 'es' | 'en' | 'pt';
export type AppTab = 'home' | 'explore' | 'gastronomy' | 'culture';
export type AntioquiaRegion = 'Oriente' | 'Suroeste' | 'Occidente' | 'Norte' | 'Bajo Cauca' | 'Nordeste' | 'Magdalena Medio' | 'Urabá' | 'Valle de Aburrá';

export interface PlaceData {
  type: 'place';
  titulo: string;
  region: AntioquiaRegion;
  descripcion: string;
  seguridadTexto: string;
  vibeScore: number;
  nomadScore: number;
  viaEstado: 'Despejada' | 'Paso Restringido' | 'Cerrada';
  tiempoDesdeMedellin: string;
  budget: {
    busTicket: number;
    averageMeal: number;
  };
  budgetRange?: '$' | '$$' | '$$$';
  coordenadas: { lat: number; lng: number };
  imagen: string;
  isVerified?: boolean;
  neighborTip?: string;
  trivia?: string;
  // Nuevos campos de UX Research
  parcheType?: 'Familiar' | 'Rumba' | 'Romántico' | 'Aventura' | 'Cultural';
  carType?: 'Cualquier Carro' | '4x4 Recomendado' | 'Solo Campero';
  terminalInfo?: string;
  signatureDish?: string;
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
  // Added missing field for UI consistency
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
  // Added missing field for UI consistency
  maestroOficio?: { nombre: string; especialidad: string; años: number };
}

// Added ChallengeData to fix import error in ChallengeCard.tsx
export interface ChallengeData {
  id: string;
  titulo: string;
  mision: string;
  dificultad: 'Fácil' | 'Media' | 'Arriero';
  recompensa: string;
  completado: boolean;
}

/**
 * Added UGCContent to fix missing exported member error
 */
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