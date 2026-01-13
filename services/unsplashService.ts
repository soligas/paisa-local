
/**
 * Servicio Táctico de Unsplash v2.2
 * Optimizado según la documentación oficial: https://unsplash.com/documentation#search-photos
 */

export async function getUnsplashImage(query: string): Promise<string | null> {
  const accessKey = (process.env.UNSPLASH_API_KEY || '').trim();

  if (!accessKey || accessKey === 'undefined' || accessKey === '') {
    console.warn("Unsplash API Key: Mijo, falta la llave en las variables de entorno.");
    return null;
  }

  // Estrategia de búsqueda: Municipio + Descriptores para evitar resultados genéricos
  const fetchImage = async (q: string) => {
    try {
      const searchQuery = encodeURIComponent(q);
      // Según la documentación, se puede pasar el client_id como parámetro de consulta
      const url = `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=1&orientation=landscape&client_id=${accessKey}`;
      
      const response = await fetch(url);
      if (!response.ok) return null;
      
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        // Retornamos la versión 'regular' que es óptima para web
        return data.results[0].urls.regular;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  // 1. Intento específico: Pueblo + Antioquia + Paisaje
  let imageUrl = await fetchImage(`${query} Antioquia Colombia paisaje`);
  
  // 2. Fallback 1: Solo el Pueblo + Colombia
  if (!imageUrl) {
    imageUrl = await fetchImage(`${query} Colombia`);
  }

  // 3. Fallback final: Si nada funciona, una imagen genérica pero hermosa de Antioquia
  if (!imageUrl && query !== "Antioquia") {
    imageUrl = await fetchImage("Antioquia Colombia mountains");
  }

  return imageUrl;
}
