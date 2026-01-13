
/**
 * Servicio Táctico de Unsplash v2.3
 */
export async function getUnsplashImage(query: string): Promise<string | null> {
  const accessKey = (process.env.UNSPLASH_API_KEY || '').trim();

  if (!accessKey) return null;

  const fetchImage = async (q: string) => {
    try {
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=1&orientation=landscape&client_id=${accessKey}`;
      const response = await fetch(url);
      if (!response.ok) return null;
      const data = await response.json();
      return data.results?.[0]?.urls?.regular || null;
    } catch (e) {
      return null;
    }
  };

  // 1. Intento con la palabra clave optimizada de la IA
  let img = await fetchImage(query);
  
  // 2. Fallback: Si no hay resultados, buscar Antioquia general
  if (!img) {
    img = await fetchImage("Antioquia Colombia mountains");
  }

  return img;
}
