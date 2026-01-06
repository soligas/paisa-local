
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PlaceData, DishData, CultureExperience } from '../types';

const supabaseUrl = (process.env.VITE_SUPABASE_URL || '').toString().trim();
const supabaseAnonKey = (process.env.VITE_SUPABASE_ANON_KEY || '').toString().trim();

// Verificamos si la configuración es válida (debe empezar con http y tener una key)
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') &&
  supabaseAnonKey.length > 20
);

export const supabase: SupabaseClient | null = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export interface UGCContent {
  id: string;
  created_at: string;
  place_slug: string;
  user_name: string;
  comment: string;
  image_url?: string;
  stars: number;
}

const mapPlace = (d: any): PlaceData => ({
  type: 'place',
  titulo: d.titulo || 'Lugar sin nombre',
  region: d.region || 'Antioquia',
  descripcion: d.descripcion || '',
  imagen: d.imagen_url || "https://images.unsplash.com/photo-1590487988256-9ed24133863e",
  vibeScore: d.vibe_score || 90,
  nomadScore: d.nomad_score || 85,
  isVerified: d.is_verified ?? true,
  coordenadas: d.coordenadas || { lat: 6.25, lng: -75.5 },
  budget: d.budget || { busTicket: 25000, averageMeal: 20000 },
  budgetRange: d.budget_range || '$$',
  neighborTip: d.neighbor_tip,
  trivia: d.trivia,
  viaEstado: d.via_estado || 'Despejada',
  tiempoDesdeMedellin: d.tiempo_viaje || '2h',
  seguridadTexto: `Plan ${d.parche_type || 'Familiar'}. Vía: ${d.via_estado || 'Despejada'}.`,
  parcheType: d.parche_type as any,
  carType: d.car_type as any,
  terminalInfo: d.terminal_info,
  signatureDish: d.signature_dish
});

const mapDish = (d: any): DishData => ({
  type: 'dish',
  nombre: d.nombre,
  descripcion: d.descripcion || '',
  dondeProbar: d.donde_probar || 'Antioquia',
  categoria: d.categoria || 'Gastronomía',
  imagen: d.imagen_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
  precioLocalEstimated: (d.precio_local || 25000).toLocaleString(),
  precioTuristaEstimated: (d.precio_turista || 35000).toLocaleString(),
  precioVerificado: true,
  economiaCircular: d.economia_circular ?? true,
  productoresOrigen: d.productores_origen || []
});

const mapExperience = (d: any): CultureExperience => ({
  type: 'experience',
  titulo: d.titulo,
  descripcion: d.descripcion || '',
  ubicacion: d.ubicacion || 'Antioquia',
  categoria: d.categoria || 'Cultura',
  impactoSocial: d.impacto_social || 'Regenerativo',
  imagen: d.imagen_url || "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59",
  costoSugeridoCOP: d.costo_sugerido_cop || '30.000',
  horarioRecomendado: d.horario_recomendado || 'Mañana',
  maestroOficio: d.maestro_oficio
});

export async function testSupabaseConnection(): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('places').select('id').limit(1);
    return !error;
  } catch { return false; }
}

export async function isPlacesEmpty(): Promise<boolean> {
  if (!supabase) return true;
  try {
    const { count, error } = await supabase.from('places').select('*', { count: 'exact', head: true });
    if (error) return true;
    return (count || 0) === 0;
  } catch { return true; }
}

export async function searchVerifiedPlaces(query: string): Promise<PlaceData[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .or(`titulo.ilike.%${query}%,descripcion.ilike.%${query}%`)
    .limit(10);
  return error ? [] : data.map(mapPlace);
}

export async function getVerifiedDishes(query: string): Promise<DishData[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('dishes')
    .select('*')
    .or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%`)
    .limit(5);
  return error ? [] : data.map(mapDish);
}

export async function getVerifiedExperiences(query: string): Promise<CultureExperience[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .or(`titulo.ilike.%${query}%,descripcion.ilike.%${query}%`)
    .limit(5);
  return error ? [] : data.map(mapExperience);
}

export async function getPlaceUGC(slug: string): Promise<UGCContent[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('ugc_content')
    .select('*')
    .eq('place_slug', slug)
    .order('created_at', { ascending: false });
  return error ? [] : data;
}

export async function insertUGC(review: Omit<UGCContent, 'id' | 'created_at'>) {
  if (!supabase) return;
  const { data, error } = await supabase
    .from('ugc_content')
    .insert([review])
    .select();
  if (error) throw error;
  return data;
}

export async function seedMassiveData(table: string, data: any | any[]) {
  if (!supabase) return;
  const formattedData = Array.isArray(data) ? data.map(d => formatForSQL(table, d)) : formatForSQL(table, data);
  const { error } = await supabase.from(table).upsert(formattedData, { 
    onConflict: table === 'places' ? 'titulo' : 'nombre' 
  });
  if (error) throw error;
}

function formatForSQL(table: string, item: any) {
  if (table === 'places') {
    return {
      titulo: item.titulo,
      region: item.region,
      descripcion: item.descripcion,
      imagen_url: item.imagen_url || item.imagen,
      vibe_score: item.vibe_score || 90,
      coordenadas: item.coordenadas,
      budget: item.budget,
      neighbor_tip: item.neighbor_tip,
      via_estado: item.via_estado,
      tiempo_viaje: item.tiempo_viaje,
      parche_type: item.parche_type,
      car_type: item.car_type,
      terminal_info: item.terminal_info,
      signature_dish: item.signature_dish,
      budget_range: item.budget_range
    };
  }
  if (table === 'dishes') {
    return {
      nombre: item.nombre,
      descripcion: item.descripcion,
      donde_probar: item.donde_probar || item.donde,
      categoria: item.categoria,
      imagen_url: item.imagen_url || item.imagen,
      precio_local: item.precio_local || item.precio_est,
      productores_origen: item.productores_origen || []
    };
  }
  if (table === 'experiences') {
    return {
      titulo: item.titulo,
      descripcion: item.descripcion,
      ubicacion: item.ubicacion,
      categoria: item.categoria,
      impacto_social: item.impacto_social,
      imagen_url: item.imagen_url || item.imagen,
      costo_sugerido_cop: item.costo_sugerido_cop,
      maestro_oficio: item.maestro_oficio
    };
  }
  return item;
}
