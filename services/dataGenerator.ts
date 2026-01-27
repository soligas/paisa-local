
import { GoogleGenAI } from "@google/genai";
import { seedMassiveData } from "./supabaseService";

const MUNICIPIOS_ANTIOQUIA = [
  "Abejorral", "Abriaquí", "Alejandría", "Amagá", "Amalfi", "Andes", "Angelópolis", "Angostura", "Anorí", "Anzá", "Apartadó", "Arboletes", "Argelia", "Armenia", "Barbosa", "Belmira", "Bello", "Betania", "Betulia", "Briceño", "Buriticá", "Caicedo", "Caldas", "Campamento", "Cañasgordas", "Caracolí", "Caramanta", "Carepa", "El Carmen de Viboral", "Carolina del Príncipe", "Caucasia", "Chigorodó", "Cisneros", "Ciudad Bolívar", "Cocorná", "Concepción", "Concordia", "Copacabana", "Dabeiba", "Donmatías", "Ebéjico", "El Bagre", "El Peñol", "El Retiro", "El Santuario", "Entrerríos", "Envigado", "Fredonia", "Frontino", "Giraldo", "Girardota", "Gómez Plata", "Granada", "Guadalupe", "Guarne", "Guatapé", "Heliconia", "Hispania", "Itagüí", "Ituango", "Jardín", "Jericó", "La Ceja", "La Estrella", "La Pintada", "La Unión", "Liborina", "Maceo", "Marinilla", "Medellín", "Montebello", "Murindó", "Mutatá", "Nariño", "Nechí", "Necoclí", "Olaya", "Peque", "Pueblorrico", "Puerto Berrío", "Puerto Nare", "Puerto Triunfo", "Remedios", "Rionegro", "Sabanalarga", "Sabaneta", "Salgar", "San Andrés de Cuerquia", "San Carlos", "San Francisco", "San Jerónimo", "San José de la Montaña", "San Juan de Urabá", "San Luis", "San Pedro de los Milagros", "San Pedro de Urabá", "San Rafael", "San Roque", "San Vicente Ferrer", "Santa Bárbara", "Santa Fe de Antioquia", "Santa Rosa de Osos", "Santo Domingo", "Segovia", "Sonsón", "Sopetrán", "Támesis", "Tarazá", "Tarso", "Titiribí", "Toledo", "Turbo", "Uramita", "Urrao", "Valdivia", "Valparaíso", "Vegachí", "Venecia", "Vigía del Fuerte", "Yalí", "Yarumal", "Yolombó", "Yondó", "Zaragoza"
];

function robustParse(text: string) {
  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const startIdx = cleaned.search(/[\{\[]/);
    const lastBracket = cleaned.lastIndexOf(']');
    const lastBrace = cleaned.lastIndexOf('}');
    const endIdx = Math.max(lastBracket, lastBrace);
    if (startIdx === -1 || endIdx === -1) return null;
    const jsonStr = cleaned.substring(startIdx, endIdx + 1).replace(/,\s*([\]\}])/g, '$1');
    return JSON.parse(jsonStr);
  } catch (e) {
    return null;
  }
}

export async function generateAndSeedPueblos(onProgress: (current: number, total: number, lastPueblo: string) => void) {
  if (!process.env.API_KEY || process.env.API_KEY === 'undefined') return;
  
  const batchSize = 3; 
  const total = MUNICIPIOS_ANTIOQUIA.length;

  for (let i = 0; i < total; i += batchSize) {
    const batch = MUNICIPIOS_ANTIOQUIA.slice(i, i + batchSize);
    
    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Investiga municipios de Antioquia: ${batch.join(", ")}.
        Responde un JSON ARRAY with objetos:
        {
          "titulo": "...",
          "region": "...",
          "budget": {"busTicket": 0, "averageMeal": 0}
        }`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        }
      });

      const data = robustParse(response.text);
      if (data) {
        await seedMassiveData('places', data);
        onProgress(Math.min(i + batch.length, total), total, batch[batch.length - 1]);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Error en lote ${batch}:`, error);
    }
  }
}
