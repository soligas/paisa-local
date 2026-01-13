
/**
 * Servicio Táctico de Pexels v1.3
 */
export async function getPexelsImage(query: string): Promise<string | null> {
  const apiKey = (process.env.PEXELS_API_KEY || '').trim();

  if (!apiKey) return null;

  const fetchImage = async (q: string) => {
    try {
      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=1`;
      const response = await fetch(url, { headers: { 'Authorization': apiKey } });
      if (!response.ok) return null;
      const data = await response.json();
      return data.photos?.[0]?.src?.large || null;
    } catch (e) {
      return null;
    }
  };

  let img = await fetchImage(query);
  
  if (!img) {
    img = await fetchImage("coffee region colombia");
  }

  return img;
}
