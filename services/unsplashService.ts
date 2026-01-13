
/**
 * Servicio Táctico de Unsplash v2.0
 * Objetivo: Obtener postales reales de Antioquia con alta relevancia.
 */

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_API_KEY;

export async function getUnsplashImage(query: string): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'undefined' || UNSPLASH_ACCESS_KEY.trim() === '') {
    return null;
  }

  try {
    // Agregamos keywords tácticos para obtener mejores paisajes y arquitectura
    const keywords = "pueblo arquitectura landscape antioquia colombia";
    const searchQuery = encodeURIComponent(`${query} ${keywords}`);
    const url = `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=1&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY.trim()}`;
    
    const response = await fetch(url);
    
    if (!response.ok) return null;
    
    const data = await response.json();
    // Priorizamos la URL 'regular' para buen balance entre peso y calidad
    const imageUrl = data.results[0]?.urls?.regular;
    
    return imageUrl || null;
  } catch (error) {
    console.error("Pipeline Unsplash Offline:", error);
    return null;
  }
}
