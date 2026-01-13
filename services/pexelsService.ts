
/**
 * Servicio Táctico de Pexels v1.1
 * Objetivo: Backup de alta fidelidad para postales de Antioquia.
 */

export async function getPexelsImage(query: string): Promise<string | null> {
  const apiKey = (process.env.PEXELS_API_KEY || '').trim();

  if (!apiKey || apiKey === 'undefined') {
    console.warn("Pexels API Key no detectada en el entorno.");
    return null;
  }

  try {
    const keywords = "town architecture landscape colombia";
    const searchQuery = encodeURIComponent(`${query} ${keywords}`);
    const url = `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=1`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': apiKey
      }
    });
    
    if (!response.ok) {
      console.error("Error en Pexels API:", response.statusText);
      return null;
    }
    
    const data = await response.json();
    return data.photos?.[0]?.src?.large || null;
  } catch (error) {
    console.error("Pipeline Pexels Offline:", error);
    return null;
  }
}
