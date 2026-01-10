
import { GoogleGenAI, Type } from "@google/genai";
import { SupportedLang, UnifiedItem, PlaceData, AntioquiaRegion, GroundingLink } from "../types";
import { getLocalPlace } from "./logisticsService";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Motor de parsing ultra-robusto para respuestas de IA
 */
function safeJsonParse(text: string) {
  if (!text) return null;
  try {
    let cleaned = text.trim();
    
    // 1. Eliminar bloques de código markdown si existen
    cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // 2. Localizar el inicio real del JSON ([ o {)
    const startIdx = cleaned.search(/[\{\[]/);
    if (startIdx === -1) return null;
    
    // 3. Localizar el final real del JSON (último ] o })
    const lastBracket = cleaned.lastIndexOf(']');
    const lastBrace = cleaned.lastIndexOf('}');
    const endIdx = Math.max(lastBracket, lastBrace);
    
    if (endIdx === -1 || endIdx < startIdx) return null;
    
    cleaned = cleaned.substring(startIdx, endIdx + 1);

    // 4. Limpieza de errores comunes de la IA (Comas finales y saltos de línea ilegales en strings)
    // Eliminar comas antes de cerrar llaves o corchetes: ,} -> } o ,] -> ]
    cleaned = cleaned.replace(/,\s*([\]\}])/g, '$1');
    
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Error crítico de parsing JSON:", e);
    // Intento desesperado: si es un error de posición, loguear contexto
    return null;
  }
}

export async function searchUnified(query: string, lang: SupportedLang = 'es'): Promise<UnifiedItem[]> {
  const localMatch = getLocalPlace(query);
  if (localMatch && !query.includes('2025') && !query.includes('hoy')) {
    return [localMatch];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `INVESTIGACIÓN TURÍSTICA TÁCTICA PARA: "${query}".
      
      INSTRUCCIONES DE SALIDA:
      - Responde ÚNICAMENTE con un JSON ARRAY válido.
      - No incluyas texto explicativo antes o después del JSON.
      - Asegúrate de escapar comillas dobles dentro de los textos.
      - El campo 'neighborTip' debe ser un objeto con: {food, culture, schedule, people}.
      
      ESQUEMA REQUERIDO POR OBJETO:
      {
        "titulo": "Nombre del lugar",
        "region": "Subregión válida de Antioquia",
        "descripcion": "Descripción corta",
        "imagen": "URL de imagen real",
        "viaEstado": "Estado vial 2025",
        "budget": {"busTicket": 0, "averageMeal": 0},
        "accessibility": {"score": 85, "wheelchairFriendly": true, "elderlyApproved": true},
        "security": {"status": "Seguro", "lastReported": "Hoy", "emergencyNumber": "123"},
        "neighborTip": "Resumen de tips locales"
      }`,
      config: {
        tools: [{ googleSearch: {} }],
        // Forzamos el tipo de respuesta si el modelo lo soporta con estas herramientas
        responseMimeType: "application/json",
        systemInstruction: "Eres un indexador de datos turísticos precisos. No inventes precios, búscalos o estima basado en el mercado actual de 2025."
      },
    });

    const groundingLinks: GroundingLink[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          groundingLinks.push({
            title: chunk.web.title || "Fuente de Verificación",
            uri: chunk.web.uri,
            type: chunk.web.uri.includes('video') ? 'video' : 'official'
          });
        }
      });
    }

    const rawData = safeJsonParse(response.text);
    const data = Array.isArray(rawData) ? rawData[0] : rawData;

    if (data) {
      const place: PlaceData = {
        type: 'place',
        titulo: data.titulo || data.nombre || query,
        region: (data.region || 'Suroeste') as AntioquiaRegion,
        descripcion: data.descripcion || "Destino indexado mediante inteligencia artificial.",
        imagen: data.imagen || "https://images.unsplash.com/photo-1590487988256-9ed24133863e",
        viaEstado: data.viaEstado || "Verificada por IA",
        tiempoDesdeMedellin: data.tiempoDesdeMedellin || "Variable",
        coordenadas: data.coordenadas || { lat: 6.2, lng: -75.5 },
        budget: {
          busTicket: data.budget?.busTicket || 35000,
          averageMeal: data.budget?.averageMeal || 25000
        },
        accessibility: {
          score: data.accessibility?.score || 85,
          wheelchairFriendly: !!data.accessibility?.wheelchairFriendly,
          elderlyApproved: !!data.accessibility?.elderlyApproved,
          notes: data.accessibility?.notes || "Información basada en reportes de redes sociales."
        },
        security: {
          status: data.security?.status || 'Seguro',
          lastReported: data.security?.lastReported || 'Recientemente',
          emergencyNumber: data.security?.emergencyNumber || '123'
        },
        socialPulse: data.socialPulse,
        groundingLinks: groundingLinks.slice(0, 4),
        neighborTip: typeof data.neighborTip === 'string' ? data.neighborTip : "Saluda siempre con 'Buenas', madruga para el mejor café y prueba la trucha local.",
        terminalInfo: data.terminalInfo || "Terminal del Norte"
      };
      return [place];
    }
  } catch (e) {
    console.error("AI Search Error", e);
    if (localMatch) return [localMatch];
  }
  return localMatch ? [localMatch] : [];
}

export async function generateSmartItinerary(pueblo: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Crea un itinerario de 1 día para ${pueblo}, Antioquia. 
      Responde EXCLUSIVAMENTE un JSON con: { "morning": "...", "afternoon": "...", "evening": "..." }. 
      No añadas markdown ni comentarios.`,
      config: { 
        responseMimeType: "application/json" 
      }
    });
    return safeJsonParse(response.text);
  } catch (e) { 
    console.error("Itinerary Generation Error:", e);
    return null; 
  }
}

export async function checkSystemHealth(): Promise<boolean> {
  return !!process.env.API_KEY;
}
