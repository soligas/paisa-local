
/**
 * Servicio Táctico de Unsplash v2.1
 * Objetivo: Obtener postales reales de Antioquia con alta relevancia.
 */

export async function getUnsplashImage(query: string): Promise<string | null> {
  // Capturamos la clave mapeada por Vite
  const accessKey = (process.env.UNSPLASH_API_KEY || '').trim();

  if (!accessKey || accessKey === 'undefined') {
    console.warn("Unsplash API Key no detectada en el entorno.");
    return null;
  }

  try {
    const keywords = "pueblo arquitectura landscape antioquia colombia";
    const searchQuery = encodeURIComponent(`${query} ${keywords}`);
    const url = `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=1&orientation=landscape&client_id=${accessKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error en Unsplash API:", errorData);
      return null;
    }
    
    const data = await response.json();
    return data.results[0]?.urls?.regular || null;
  } catch (error) {
    console.error("Pipeline Unsplash Offline:", error);
    return null;
  }
}
