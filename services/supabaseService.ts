
import { UGCContent } from '../types';

/**
 * Re-export UGCContent to satisfy imports in other components
 */
export type { UGCContent };

// Mock de datos iniciales para simular comunidad
const INITIAL_REVIEWS: Record<string, UGCContent[]> = {
  "Jardín": [
    { id: "1", created_at: new Date().toISOString(), place_slug: "Jardín", user_name: "ArrieroDigital", comment: "El café en la plaza es de otro mundo mijo!", stars: 5 },
    { id: "2", created_at: new Date().toISOString(), place_slug: "Jardín", user_name: "PaisaViajera", comment: "La vía está perfecta hoy.", stars: 4 }
  ]
};

export async function getPlaceUGC(slug: string): Promise<UGCContent[]> {
  const localData = localStorage.getItem(`ugc_${slug}`);
  if (localData) return JSON.parse(localData);
  return INITIAL_REVIEWS[slug] || [];
}

export async function insertUGC(review: Omit<UGCContent, 'id' | 'created_at'>) {
  const slug = review.place_slug;
  const current = await getPlaceUGC(slug);
  const newReview: UGCContent = {
    ...review,
    id: Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString()
  };
  const updated = [newReview, ...current];
  localStorage.setItem(`ugc_${slug}`, JSON.stringify(updated));
  return [newReview];
}

/**
 * Added missing seedMassiveData function to fix import error in dataGenerator.ts
 */
export async function seedMassiveData(table: string, data: any) {
  console.log(`Simulando guardado en tabla ${table}:`, data);
  return { success: true };
}

// Funciones vacías para mantener compatibilidad si se llaman en otros sitios
export const isSupabaseConfigured = false;
export async function testSupabaseConnection() { return false; }