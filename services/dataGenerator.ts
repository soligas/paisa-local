
import { GoogleGenAI } from "@google/genai";
import { seedMassiveData } from "./supabaseService";

const MUNICIPIOS_ANTIOQUIA = [
  "Abejorral", "Abriaquí", "Alejandría", "Amagá", "Amalfi", "Andes", "Angelópolis", "Angostura", "Anorí", "Anzá", "Apartadó", "Arboletes", "Argelia", "Armenia", "Barbosa", "Belmira", "Bello", "Betania", "Betulia", "Briceño", "Buriticá", "Caicedo", "Caldas", "Campamento", "Cañasgordas", "Caracolí", "Caramanta", "Carepa", "El Carmen de Viboral", "Carolina del Príncipe", "Caucasia", "Chigorodó", "Cisneros", "Ciudad Bolívar", "Cocorná", "Concepción", "Concordia", "Copacabana", "Dabeiba", "Donmatías", "Ebéjico", "El Bagre", "El Peñol", "El Retiro", "El Santuario", "Entrerríos", "Envigado", "Fredonia", "Frontino", "Giraldo", "Girardota", "Gómez Plata", "Granada", "Guadalupe", "Guarne", "Guatapé", "Heliconia", "Hispania", "Itagüí", "Ituango", "Jardín", "Jericó", "La Ceja", "La Estrella", "La Pintada", "La Unión", "Liborina", "Maceo", "Marinilla", "Medellín", "Montebello", "Murindó", "Mutatá", "Nariño", "Nechí", "Necoclí", "Olaya", "Peque", "Pueblorrico", "Puerto Berrío", "Puerto Nare", "Puerto Triunfo", "Remedios", "Rionegro", "Sabanalarga", "Sabaneta", "Salgar", "San Andrés de Cuerquia", "San Carlos", "San Francisco", "San Jerónimo", "San José de la Montaña", "San Juan de Urabá", "San Luis", "San Pedro de los Milagros", "San Pedro de Urabá", "San Rafael", "San Roque", "San Vicente Ferrer", "Santa Bárbara", "Santa Fe de Antioquia", "Santa Rosa de Osos", "Santo Domingo", "Segovia", "Sonsón", "Sopetrán", "Támesis", "Tarazá", "Tarso", "Titiribí", "Toledo", "Turbo", "Uramita", "Urrao", "Valdivia", "Valparaíso", "Vegachí", "Venecia", "Vigía del Fuerte", "Yalí", "Yarumal", "Yolombó", "Yondó", "Zaragoza"
];

export async function generateAndSeedPueblos(onProgress: (current: number, total: number, lastPueblo: string) => void) {
  const apiKey = (process.env.API_KEY || '').toString();
  if (!apiKey || apiKey === 'undefined') return;
  
  const ai = new GoogleGenAI({ apiKey });
  const batchSize = 3; 
  const total = MUNICIPIOS_ANTIOQUIA.length;

  for (let i = 0; i < total; i += batchSize) {
    const batch = MUNICIPIOS_ANTIOQUIA.slice(i, i + batchSize);
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Investiga y genera datos turísticos detallados para estos municipios de Antioquia: ${batch.join(", ")}.
        Entrega un ARRAY JSON con esquema:
        {
          "titulo": "Nombre",
          "region": "Subregión",
          "descripcion": "Descripción",
          "imagen_url": "URL",
          "vibe_score": 90,
          "nomad_score": 80,
          "coordenadas": {"lat": 0, "lng": 0},
          "budget": {"busTicket": 0, "averageMeal": 0},
          "neighbor_tip": "Tip",
          "trivia": "Trivia",
          "via_estado": "Despejada",
          "tiempo_viaje": "3h"
        }`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        }
      });

      const rawText = response.text || "";
      if (rawText) {
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanedText);
        await seedMassiveData('places', data);
        onProgress(Math.min(i + batch.length, total), total, batch[batch.length - 1]);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Error en lote ${batch}:`, error);
    }
  }
}
