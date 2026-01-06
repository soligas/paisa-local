
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PlaceData, SupportedLang, DishData, CultureExperience } from '../types';

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

/**
 * Verifica si la conexión con Supabase está activa
 */
export async function testSupabaseConnection(): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { data, error } = await supabase.from('places').select('count', { count: 'exact', head: true });
    return !error;
  } catch { return false; }
}

/**
 * Busca lugares verificados en la DB
 */
export async function searchVerifiedPlaces(query: string): Promise<PlaceData[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .or(`titulo.ilike.%${query}%,region.ilike.%${query}%,descripcion.ilike.%${query}%`)
      .limit(10);

    if (error || !data) return [];
    
    return data.map((d): PlaceData => ({
      type: 'place',
      titulo: d.titulo,
      descripcion: d.descripcion,
      imagen: d.imagen_url || "https://images.unsplash.com/photo-1590487988256-9ed24133863e",
      vibeScore: d.vibe_score || 90,
      nomadScore: d.nomad_score || 85,
      isVerified: true,
      region: d.region || 'Antioquia',
      coordenadas: d.coordenadas || { lat: 6.25, lng: -75.5 },
      budget: d.budget || { busTicket: 25000, averageMeal: 20000 },
      neighborTip: d.neighbor_tip,
      trivia: d.trivia,
      viaEstado: d.via_estado || 'Despejada',
      tiempoDesdeMedellin: d.tiempo_viaje || '2h',
      seguridadTexto: d.seguridad_texto || 'Verificado por locales'
    }));
  } catch (e) { 
    console.error("Error fetching places:", e);
    return []; 
  }
}

/**
 * Obtiene platos típicos desde Supabase
 */
export async function getVerifiedDishes(query: string): Promise<DishData[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%`);
    
    if (error || !data || data.length === 0) return null;

    return data.map((d): DishData => ({
      type: 'dish',
      nombre: d.nombre || 'Plato Típico',
      descripcion: d.descripcion || '',
      dondeProbar: d.donde_probar || 'Antioquia',
      categoria: d.categoria || 'Gastronomía',
      imagen: d.imagen_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      precioLocalEstimated: d.precio_local ? d.precio_local.toLocaleString() : "25,000",
      precioTuristaEstimated: d.precio_turista ? d.precio_turista.toLocaleString() : "35,000",
      precioVerificado: true,
      economiaCircular: d.economia_circular ?? true
    }));
  } catch (e) { 
    console.error("Error fetching dishes:", e);
    return null; 
  }
}

/**
 * Obtiene reseñas de un lugar específico
 */
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

/**
 * Inserta datos de forma masiva (para seeding inicial)
 */
export async function seedMassiveData(table: string, items: any[]) {
  if (!supabase) return;
  try {
    const { data, error } = await supabase.from(table).upsert(items, { onConflict: table === 'places' ? 'titulo' : 'nombre' });
    if (error) console.error(`Error seeding ${table}:`, error);
    return data;
  } catch (e) { console.error(e); }
}

/**
 * Publicar una nueva reseña
 */
export async function postUGC(content: Omit<UGCContent, 'id' | 'created_at'>) {
  if (!supabase) return { data: null, error: { message: 'Supabase no configurado' } };
  const { data, error } = await supabase.from('ugc_content').insert([content]);
  return { data, error };
}
