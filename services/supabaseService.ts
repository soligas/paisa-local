
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PlaceData, DishData } from '../types';

const supabaseUrl = (process.env.VITE_SUPABASE_URL || '').toString();
const supabaseAnonKey = (process.env.VITE_SUPABASE_ANON_KEY || '').toString();

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'));

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
  neighborTip: d.neighbor_tip,
  trivia: d.trivia,
  viaEstado: d.via_estado || 'Despejada',
  tiempoDesdeMedellin: d.tiempo_viaje || '2h',
  seguridadTexto: 'Logística verificada por la comunidad'
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

export async function getVerifiedDishes(query: string): Promise<DishData[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('dishes')
    .select('*')
    .or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%`)
    .limit(5);

  if (error || !data || data.length === 0) return null;

  return data.map((d): DishData => ({
    type: 'dish',
    nombre: d.nombre,
    descripcion: d.descripcion || '',
    dondeProbar: d.donde_probar || 'Antioquia',
    categoria: d.categoria || 'Gastronomía',
    imagen: d.imagen_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
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
  const { error } = await supabase.from(table).upsert(data, { onConflict: table === 'places' ? 'titulo' : 'nombre' });
  if (error) throw error;
}
