
/**
 * Servicio Táctico de Pexels v1.2
 * Documentación oficial: https://www.pexels.com/api/documentation/
 */

export async function getPexelsImage(query: string): Promise<string | null> {
  const apiKey = (process.env.PEXELS_API_KEY || '').trim();

  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    console.warn("Pexels API Key: No se encontró la autorización para el servicio de fotos.");
    return null;
  }

  const fetchImage = async (q: string) => {
    try {
      const searchQuery = encodeURIComponent(q);
      const url = `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=1`;
      
      const response = await fetch(url, {
        headers: {
          // La documentación de Pexels requiere el API Key en el header de Authorization
          'Authorization': apiKey
        }
      });
      
      if (!response.ok) return null;
      
      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        // 'large' es el tamaño recomendado por Pexels para backgrounds y cards
        return data.photos[0].src.large;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  // Estrategia de búsqueda escalonada
  let imageUrl = await fetchImage(`${query} Antioquia town`);
  
  if (!imageUrl) {
    imageUrl = await fetchImage(`${query} Colombia`);
  }

  if (!imageUrl && query !== "Colombia") {
    imageUrl = await fetchImage("Colombian coffee region landscape");
  }

  return imageUrl;
}
