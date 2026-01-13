
/**
 * Servicio Táctico de Pexels v1.0
 * Objetivo: Backup de alta fidelidad para postales de Antioquia.
 */

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

export async function getPexelsImage(query: string): Promise<string | null> {
  if (!PEXELS_API_KEY || PEXELS_API_KEY === 'undefined' || PEXELS_API_KEY.trim() === '') {
    return null;
  }

  try {
    const keywords = "town architecture landscape colombia";
    const searchQuery = encodeURIComponent(`${query} ${keywords}`);
    const url = `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=1`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': PEXELS_API_KEY.trim()
      }
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    // Priorizamos 'large' para buena resolución sin sacrificar performance
    return data.photos?.[0]?.src?.large || null;
  } catch (error) {
    console.error("Pipeline Pexels Offline:", error);
    return null;
  }
}
