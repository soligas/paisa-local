
# 🏔️ Paisa Local Pro

**Paisa Local Pro** es un concierge digital de clase mundial diseñado para explorar los 125 municipios de Antioquia, Colombia. Potenciado por la tecnología de **Google Gemini AI**, ofrece una experiencia inmersiva que combina datos en tiempo real, cultura local y gamificación.

## ✨ Características Principales

- **🔍 Exploración Inteligente**: Búsqueda avanzada de pueblos con itinerarios generados por IA, presupuestos en COP y recomendaciones gastronómicas.
- **🎙️ Arriero Loco (Live API)**: Conversación por voz en tiempo real con un guía virtual experto en la región.
- **🍜 Sabores Locales**: Catálogo detallado de la gastronomía antioqueña con "tips de arriero".
- **🏆 Sistema de Berraquera (Gamificación)**: Gana XP explorando y completando misiones para subir de nivel.
- **🛣️ Estado de Vías**: Reportes actualizados de las carreteras de la región para viajes seguros.
- **🗺️ Mapas Dinámicos**: Integración con Leaflet para geolocalización de puntos de interés.

## 🚀 Tecnologías

- **Core**: React 19 + TypeScript.
- **IA**: @google/genai (Gemini 3 Pro, Gemini 2.5 Flash, Live API).
- **Diseño**: Tailwind CSS + Framer Motion.
- **Iconografía**: Lucide React.
- **Mapas**: Leaflet.js.

## 🛠️ Instalación y Configuración

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/paisa-local-pro.git
   cd paisa-local-pro
   ```

2. **Configurar la API Key**:
   El proyecto requiere una clave de API de Google AI Studio. Asegúrate de configurar la variable de entorno `API_KEY`.

3. **Ejecución local**:
   Al usar *importmaps*, puedes servir el proyecto con cualquier servidor estático (ej. Live Server en VS Code o `npx servor`).

## 📁 Estructura del Proyecto

- `/components`: Componentes UI reutilizables (SearchBox, PlaceCard).
- `/services`: Lógica de integración con la API de Gemini.
- `App.tsx`: Orquestador principal de la aplicación.
- `types.ts`: Definiciones de tipos para un código robusto.

## 🤝 Contribuciones

¡Las "ganas" y la "berraquera" son bienvenidas! Siéntete libre de abrir un PR para añadir nuevos municipios, platos típicos o mejorar la lógica de la IA.

---
Hecho con ❤️ en las montañas de Antioquia.
