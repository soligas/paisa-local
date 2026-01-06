
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PlaceData, DishData } from '../types';

const supabaseUrl = (process.env.VITE_SUPABASE_URL || '').toString();
const supabaseAnonKey = (process.env.VITE_SUPABASE_ANON_KEY || '').toString();

export const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export interface UGCContent {
  id: string;
  created_at: string;
  place_slug: string;
  user_name: string;
  comment: string;
  image_url: string;
  stars: number;
}

// Mapeo de campos para flexibilidad (Español <-> Inglés)
const mapPlace = (d: any): PlaceData => ({
  type: 'place',
  titulo: d.titulo || d.nombre || 'Lugar sin nombre',
  descripcion: d.descripcion || d.resena || '',
  imagen: d.imagen_url || d.foto || "https://images.unsplash.com/photo-1590487988256-9ed24133863e",
  vibeScore: d.vibe_score || 90,
  nomadScore: d.nomad_score || 85,
  isVerified: true,
  region: d.region || 'Antioquia',
  coordenadas: d.coordenadas || { lat: 6.25, lng: -75.5 },
  budget: d.budget || { busTicket: d.precio_bus || 25000, averageMeal: d.precio_comida || 20000 },
  neighborTip: d.neighbor_tip || d.tip_local,
  trivia: d.trivia || d.curiosidad,
  viaEstado: d.via_estado || 'Despejada',
  tiempoDesdeMedellin: d.tiempo_viaje || d.duracion || '2h',
  seguridadTexto: d.seguridad_texto || 'Zona turística'
});

/**
 * Intenta buscar en múltiples tablas posibles
 */
async function trySelect(tables: string[], query: string) {
  if (!supabase) return [];
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .or(`titulo.ilike.%${query}%,descripcion.ilike.%${query}%`)
        .limit(5);
      if (!error && data && data.length > 0) return data;
    } catch { continue; }
  }
  return [];
}

export async function testSupabaseConnection(): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('places').select('id').limit(1);
    if (!error) return true;
    const { error: error2 } = await supabase.from('lugares').select('id').limit(1);
    return !error2;
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
  const data = await trySelect(['places', 'lugares', 'municipios'], query);
  return data.map(mapPlace);
}

export async function getVerifiedDishes(query: string): Promise<DishData[] | null> {
  if (!supabase) return null;
  const data = await trySelect(['dishes', 'gastronomia', 'platos'], query);
  if (data.length === 0) return null;

  return data.map((d): DishData => ({
    type: 'dish',
    nombre: d.nombre || d.titulo,
    descripcion: d.descripcion || d.detalle || '',
    dondeProbar: d.donde_probar || d.restaurante || 'Antioquia',
    categoria: d.categoria || 'Gastronomía',
    imagen: d.imagen_url || d.foto || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    precioLocalEstimated: (d.precio_local || 25000).toLocaleString(),
    precioTuristaEstimated: (d.precio_turista || 35000).toLocaleString(),
    precioVerificado: true,
    economiaCircular: d.economia_circular ?? true
  }));
}

export async function getPlaceUGC(slug: string): Promise<UGCContent[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('ugc_content')
      .select('*')
      .eq('place_slug', slug)
      .order('created_at', { ascending: false });
    return error ? [] : data;
  } catch { return []; }
}

export async function seedMassiveData(table: string, data: any | any[]) {
  if (!supabase) return;
  const { error } = await supabase.from(table).upsert(data, { onConflict: table === 'places' ? 'titulo' : 'nombre' });
  if (error) {
    console.error(`Error seeding table ${table}:`, error);
    throw error;
  }
}
