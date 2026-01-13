
import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Accessibility, ArrowLeft, Radio, TrendingUp, Sparkles, Heart, Compass, Trophy, MessageSquare, Map as MapIcon, Info, ShieldCheck, Bus, Target, Globe, HeartHandshake, Eye, Code2, Cpu, Sun, Moon, Mic, MicOff, Languages, ChevronDown, Check, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { AppState, PlaceData, ChallengeData, SupportedLang } from './types';
import { searchUnified } from './services/geminiService';
import { PaisaLogo } from './components/atoms/PaisaLogo';
import { PlaceCard } from './components/PlaceCard';
import { Footer } from './components/organisms/Footer';
import { DiscoveryCard } from './components/molecules/DiscoveryCard';
import { HorizontalCarousel } from './components/molecules/HorizontalCarousel';
import { SectionHeader } from './components/molecules/SectionHeader';
import { EpicAntioquiaMap } from './components/molecules/EpicAntioquiaMap';
import { CultureCard } from './components/molecules/CultureCard';
import { Navigation } from './components/organisms/Navigation';
import { getLocalPlace } from './services/logisticsService';

// Fix: Define the missing LANGUAGES constant used in the UI
const LANGUAGES: { code: SupportedLang; name: string; flag: string }[] = [
  { code: 'es', name: 'Español', flag: '🇨🇴' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' }
];

// Fix: Implement manual base64 encoding as per @google/genai guidelines
function encodeBase64(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Fix: Implement manual base64 decoding as per @google/genai guidelines
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

const TRANSLATIONS = {
  es: {
    heroTitle: "ANTIOQUIA",
    heroSubtitle: "TE ESPERA",
    heroDescription: "Indexamos en tiempo real los 125 municipios de Antioquia para que explorés con datos reales, itinerarios con IA y la sabiduría de los locales.",
    searchPlaceholder: "¿A qué pueblo vamos, mijo? (Ej: Urrao, Jardín...)",
    searchBtn: "Indexar",
    backBtn: "VOLVER",
    favoritesTitle: "Tus Parches Guardados",
    favoritesEmpty: "No tenés parches guardados",
    favoritesMijo: "Mijo, explorá los pueblos y dales amor para verlos aquí.",
    startExploring: "Empezar a explorar",
    busPrices: "PRECIOS DE BUS",
    roadStatus: "ESTADO DE VÍAS",
    iaItineraries: "ITINERARIOS IA",
    transparency: "Transparencia Total",
    techTitle: "TECNOLOGÍA PARA",
    techSubtitle: "VIAJEROS CONSCIENTES",
    techDesc: "Paisa Local Pro nació como un proyecto de impacto social. No somos una agencia de viajes; somos una herramienta tecnológica que conecta la sabiduría arriera con el poder de la Inteligencia Artificial.",
    exploreTitle: "Explorar",
    exploreSubtitle: "Descubre Antioquia por subregiones y tesoros locales.",
    dichosTitle: "Dichos",
    dichosSubtitle: "Aprende a hablar como un arriero auténtico.",
    indexing: "Indexando el Destino",
    indexingMijo: "Consultando Unsplash, Pexels e Invías para datos reales...",
    listening: "Escuchando...",
    arrieroLoco: "Arriero Loco",
    suggestedTags: ['Urrao hoy', 'Jericó hoy', 'Guatapé precios'],
    dichos: [
      { word: "¡Eh Ave María!", meaning: "Expresión máxima de asombro, alegría o frustración." },
      { word: "Berraquera", meaning: "Cualidad de ser valiente, emprendedor y echado pa' lante." },
      { word: "Parce", meaning: "Amigo cercano, compañero de aventuras." },
      { word: "Mijo / Mija", meaning: "Trato cariñoso derivado de 'mi hijo', usado con todos." },
      { word: "¡Qué charro!", meaning: "Algo que resulta muy gracioso o divertido." }
    ],
    discovery: [
      { title: "Suroeste", subtitle: "Café y Tradición", image: "https://images.unsplash.com/photo-1599140849279-101442488c2f" },
      { title: "Oriente", subtitle: "Aguas y Zócalos", image: "https://images.unsplash.com/photo-1591143831388-75095d3a958a" },
      { title: "Occidente", subtitle: "Historia y Sol", image: "https://images.unsplash.com/photo-1590487988256-9ed24133863e" },
      { title: "Norte", subtitle: "Ruta de la Leche", image: "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59" }
    ],
    trustCards: [
      { title: "Misión Táctica", text: "Descentralizamos el turismo para que el dinero llegue a los pueblos que nadie visita." },
      { title: "Indexación Real", text: "No usamos folletos viejos. Nuestra IA cruza reportes de redes y tránsito en vivo." },
      { title: "Comunidad Viva", text: "Somos un equipo de arrieros digitales comprometidos con el desarrollo local." }
    ],
    placeCard: {
      verified: "Destino Verificado",
      logistics: "Estado Logístico",
      accessibility: "Accesibilidad",
      itineraryIA: "Generar Itinerario Táctico",
      refreshItinerary: "Refrescar Plan IA",
      securitySOS: "Seguridad & SOS",
      reportsSOS: "Reportes SOS",
      budgetTitle: "Presupuesto Local",
      busTicket: "Pasaje Bus",
      meal: "Almuerzo",
      indexedToday: "Indexado Hoy",
      puebloFlavor: "Sazón de Pueblo",
      logisticsTitle: "Logística Arriera",
      departurePoint: "Punto de Salida",
      securityTitle: "Seguridad",
      safeStatus: "Seguro",
      cautionStatus: "Precaución",
      arrieroGuide: "Guía del Arriero Local",
      foodTip: "COMIDA",
      foodTipDesc: "Probá los platos típicos, ¡la sazón de pueblo es única!",
      cultureTip: "CULTURA",
      cultureTipDesc: "Saludá con un 'Buenas', el respeto abre todas las puertas.",
      timeTip: "HORARIOS",
      timeTipDesc: "El comercio madruga mucho, ¡aprovechá el día mijo!",
      peopleTip: "PERSONAS",
      peopleTipDesc: "Los locales son los mejores guías, no dudés en preguntar.",
      defaultNeighborTip: "Disfrutá el paisaje mijo, que como este no hay dos.",
      itineraryPlan: "Plan de 1 Día",
      references: "Verificación y Referencias Web",
      reports: "Reportes",
      noReports: "No hay reportes todavía mijo.",
      didYouVisit: "¿Pasaste por aquí?",
      yourName: "Tu nombre",
      commentPlaceholder: "Contanos qué tal el parche...",
      sendReport: "Enviar Reporte Táctico",
      sending: "Enviando...",
      share: "Compartir",
      fav: "Favorito",
      back: "Volver",
      verifiedDest: "Destino Verificado",
      verifiedRoute: "Ruta Verificada",
      current: "Vigente Hoy",
      tipMijo: "¡Eavemaría!",
      seeAventure: "Ver aventura",
      currency: "COP"
    }
  },
  en: {
    heroTitle: "ANTIOQUIA",
    heroSubtitle: "AWAITS YOU",
    heroDescription: "We index Antioquia's 125 municipalities in real-time so you can explore with actual data, AI itineraries, and local wisdom.",
    searchPlaceholder: "Where are we going, friend? (Ex: Urrao, Jardin...)",
    searchBtn: "Index",
    backBtn: "BACK",
    favoritesTitle: "Your Saved Spots",
    favoritesEmpty: "You don't have saved spots",
    favoritesMijo: "Friend, explore the towns and give them some love to see them here.",
    startExploring: "Start exploring",
    busPrices: "BUS PRICES",
    roadStatus: "ROAD STATUS",
    iaItineraries: "AI ITINERARIES",
    transparency: "Total Transparency",
    techTitle: "TECHNOLOGY FOR",
    techSubtitle: "CONSCIOUS TRAVELERS",
    techDesc: "Paisa Local Pro was born as a social impact project. We are not a travel agency; we are a technological tool connecting muleteer wisdom with the power of AI.",
    exploreTitle: "Explore",
    exploreSubtitle: "Discover Antioquia by subregions and local treasures.",
    dichosTitle: "Slang",
    dichosSubtitle: "Learn to speak like an authentic muleteer.",
    indexing: "Indexing Destination",
    indexingMijo: "Consulting Unsplash, Pexels, and Roads for real data...",
    listening: "Listening...",
    arrieroLoco: "Crazy Muleteer",
    suggestedTags: ['Urrao today', 'Jerico today', 'Guatape prices'],
    dichos: [
      { word: "¡Eh Ave María!", meaning: "Maximum expression of amazement, joy, or frustration." },
      { word: "Berraquera", meaning: "Quality of being brave, enterprising, and forward-looking." },
      { word: "Parce", meaning: "Close friend, adventure companion." },
      { word: "Mijo / Mija", meaning: "Affectionate term derived from 'my son', used with everyone." },
      { word: "¡Qué charro!", meaning: "Something that is very funny or amusing." }
    ],
    discovery: [
      { title: "Southwest", subtitle: "Coffee and Tradition", image: "https://images.unsplash.com/photo-1599140849279-101442488c2f" },
      { title: "East", subtitle: "Waters and Zocalos", image: "https://images.unsplash.com/photo-1591143831388-75095d3a958a" },
      { title: "West", subtitle: "History and Sun", image: "https://images.unsplash.com/photo-1590487988256-9ed24133863e" },
      { title: "North", subtitle: "The Milk Route", image: "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59" }
    ],
    trustCards: [
      { title: "Tactical Mission", text: "We decentralize tourism so that money reaches towns that no one visits." },
      { title: "Real Indexing", text: "We don't use old brochures. Our AI crosses network reports and live traffic." },
      { title: "Living Community", text: "We are a team of digital muleteers committed to local development." }
    ],
    placeCard: {
      verified: "Verified Destination",
      logistics: "Logistical Status",
      accessibility: "Accessibility",
      itineraryIA: "Generate Tactical Itinerary",
      refreshItinerary: "Refresh AI Plan",
      securitySOS: "Safety & SOS",
      reportsSOS: "SOS Reports",
      budgetTitle: "Local Budget",
      busTicket: "Bus Ticket",
      meal: "Lunch",
      indexedToday: "Indexed Today",
      puebloFlavor: "Local Flavor",
      logisticsTitle: "Muleteer Logistics",
      departurePoint: "Departure Point",
      securityTitle: "Safety",
      safeStatus: "Safe",
      cautionStatus: "Caution",
      arrieroGuide: "Local Muleteer's Guide",
      foodTip: "FOOD",
      foodTipDesc: "Try the local dishes, town seasoning is unique!",
      cultureTip: "CULTURA",
      cultureTipDesc: "Greet with a 'Buenas', respect opens all doors.",
      timeTip: "SCHEDULE",
      timeTipDesc: "Shops open very early, make the most of the day!",
      peopleTip: "PEOPLE",
      peopleTipDesc: "Locals are the best guides, don't hesitate to ask.",
      defaultNeighborTip: "Enjoy the landscape, friend, there's nothing else like it.",
      itineraryPlan: "1-Day Plan",
      references: "Web Verification & References",
      reports: "Reports",
      noReports: "No reports yet, friend.",
      didYouVisit: "Did you visit?",
      yourName: "Your name",
      commentPlaceholder: "Tell us about your trip...",
      sendReport: "Send Tactical Report",
      sending: "Sending...",
      share: "Share",
      fav: "Favorite",
      back: "Back",
      verifiedDest: "Verified Destination",
      verifiedRoute: "Verified Route",
      current: "Valid Today",
      tipMijo: "Oh my!",
      seeAventure: "See adventure",
      currency: "COP"
    }
  },
  pt: {
    heroTitle: "ANTIOQUIA",
    heroSubtitle: "ESPERA VOCÊ",
    heroDescription: "Indexamos os 125 municípios de Antioquia em tempo real para que você possa explorar com dados reais, itinerários de IA e sabedoria local.",
    searchPlaceholder: "Para que vila vamos, mijo? (Ex: Urrao, Jardín...)",
    searchBtn: "Indexar",
    backBtn: "VOLTAR",
    favoritesTitle: "Seus Lugares Salvos",
    favoritesEmpty: "Você não tem lugares salvos",
    favoritesMijo: "Mijo, explore as vilas e dê a elas amor para vê-las aqui.",
    startExploring: "Começar a explorar",
    busPrices: "PREÇOS DE ÔNIBUS",
    roadStatus: "ESTADO DAS VIAS",
    iaItineraries: "ITINERÁRIOS IA",
    transparency: "Transparência Total",
    techTitle: "TECNOLOGÍA PARA",
    techSubtitle: "VIAJANTES CONSCIENTES",
    techDesc: "Paisa Local Pro nació como un proyecto de impacto social. No somos una agencia de viajes; somos una herramienta tecnológica que conecta la sabiduría arriera con el poder de la IA.",
    exploreTitle: "Explorar",
    exploreSubtitle: "Descubra Antioquia por sub-regiões e tesouros locais.",
    dichosTitle: "Ditos",
    dichosSubtitle: "Aprenda a falar como um autêntico arriero.",
    indexing: "Indexando o Destino",
    indexingMijo: "Consultando Unsplash, Pexels e Rodovias para datos reais...",
    listening: "Ouvindo...",
    arrieroLoco: "Arriero Louco",
    suggestedTags: ['Urrao hoy', 'Jericó hoy', 'Guatapé precios'],
    dichos: [
      { word: "¡Eh Ave María!", meaning: "Expressão máxima de espanto, alegria o frustração." },
      { word: "Berraquera", meaning: "Qualidade de ser corajoso, empreendedor e voltado para o futuro." },
      { word: "Parce", meaning: "Amigo próximo, companheiro de aventura." },
      { word: "Mijo / Mija", meaning: "Termo afetuoso derivado de 'meu filho', usado com todos." },
      { word: "¡Qué charro!", meaning: "Algo que é muito engraçado ou divertido." }
    ],
    discovery: [
      { title: "Sudoeste", subtitle: "Café e Tradição", image: "https://images.unsplash.com/photo-1599140849279-101442488c2f" },
      { title: "Leste", subtitle: "Águas e Zócalos", image: "https://images.unsplash.com/photo-1591143831388-75095d3a958a" },
      { title: "Ocidente", subtitle: "História e Sol", image: "https://images.unsplash.com/photo-1590487988256-9ed24133863e" },
      { title: "Norte", subtitle: "Rota do Leite", image: "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59" }
    ],
    trustCards: [
      { title: "Missão Tática", text: "Descentralizamos o turismo para que o dinheiro chegue a aldeias que ninguém visita." },
      { title: "Indexación Real", text: "Não usamos brochuras antigas. Nossa IA cruza relatórios de rede e tráfego ao vivo." },
      { title: "Comunidade Viva", text: "Somos uma equipa de arrieros digitais empenhados no desenvolvimento local." }
    ],
    placeCard: {
      verified: "Destino Verificado",
      logistics: "Estado Logístico",
      accessibility: "Acessibilidade",
      itineraryIA: "Gerar Itinerário Tático",
      refreshItinerary: "Atualizar Plano IA",
      securitySOS: "Segurança & SOS",
      reportsSOS: "Relatórios SOS",
      budgetTitle: "Orçamento Local",
      busTicket: "Passagem Ônibus",
      meal: "Almoço",
      indexedToday: "Indexado Hoje",
      puebloFlavor: "Sabor da Vila",
      logisticsTitle: "Logística Arriera",
      departurePoint: "Ponto de Partida",
      securityTitle: "Segurança",
      safeStatus: "Seguro",
      cautionStatus: "Cuidado",
      arrieroGuide: "Guia do Arriero Local",
      foodTip: "COMIDA",
      foodTipDesc: "Experimente os pratos típicos, o tempero da vila é único!",
      cultureTip: "CULTURA",
      cultureTipDesc: "Cumprimente com um 'Buenas', o respeito abre todas las portas.",
      timeTip: "HORÁRIOS",
      timeTipDesc: "O comércio abre muito cedo, aproveite o dia mijo!",
      peopleTip: "PESSOAS",
      peopleTipDesc: "Os locais são os melhores guías, não hesite em perguntar.",
      defaultNeighborTip: "Aproveite a paisagem mijo, pois não há outra igual.",
      itineraryPlan: "Plano de 1 Dia",
      references: "Verificação e Referências Web",
      reports: "Relatórios",
      noReports: "Sem relatórios ainda mijo.",
      didYouVisit: "Você visitou?",
      yourName: "Seu nome",
      commentPlaceholder: "Conte-nos sobre a viagem...",
      sendReport: "Enviar Relatório Tático",
      sending: "Enviando...",
      share: "Compartilhar",
      fav: "Favorito",
      back: "Voltar",
      verifiedDest: "Destino Verificado",
      verifiedRoute: "Rota Verificada",
      current: "Válido Hoje",
      tipMijo: "Eita!",
      seeAventure: "Ver aventura",
      currency: "COP"
    }
  }
};

export function App() {
  const [state, setState] = useState<AppState & { favorites: string[] }>({
    busqueda: '', cargando: false, error: null, tarjeta: null,
    unifiedResults: [], 
    language: (localStorage.getItem('paisa_lang') as SupportedLang) || 'es', 
    activeTab: 'home',
    accessibilityMode: false,
    favorites: JSON.parse(localStorage.getItem('paisa_favs') || '[]')
  });

  const [showFavorites, setShowFavorites] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  const t = TRANSLATIONS[state.language];

  useEffect(() => {
    localStorage.setItem('paisa_favs', JSON.stringify(state.favorites));
  }, [state.favorites]);

  useEffect(() => {
    localStorage.setItem('paisa_lang', state.language);
  }, [state.language]);

  const handleSearch = async (q?: string) => {
    const query = q || state.busqueda;
    if (!query) return;
    setState(s => ({ ...s, cargando: true, error: null }));
    setShowFavorites(false);
    
    try {
      const results = await searchUnified(query, state.language);
      setState(s => ({ ...s, unifiedResults: results, cargando: false }));
    } catch (err) {
      setState(s => ({ ...s, cargando: false, error: "No se pudo conectar con el índice táctico." }));
    }
  };

  const toggleFavorite = (title: string) => {
    setState(s => {
      const isFav = s.favorites.includes(title);
      const newFavs = isFav 
        ? s.favorites.filter(f => f !== title)
        : [...s.favorites, title];
      return { ...s, favorites: newFavs };
    });
  };

  const handleReset = () => {
    setState(s => ({ ...s, unifiedResults: [], busqueda: '' }));
    setShowFavorites(false);
  };

  const toggleLiveAPI = async () => {
    if (isLiveActive) {
      if (sessionRef.current) sessionRef.current.close();
      setIsLiveActive(false);
      return;
    }

    try {
      // Fix: Create a new GoogleGenAI instance right before making an API call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsLiveActive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              // Fix: Use manual base64 encoding as per guidelines
              const pcmBytes = new Uint8Array(int16.buffer);
              const base64 = encodeBase64(pcmBytes);
              // Fix: Rely on sessionPromise resolves to send data and avoid stale closures
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              // Fix: Use manual base64 decoding as per guidelines
              const bytes = decodeBase64(audioData);
              const dataInt16 = new Int16Array(bytes.buffer);
              const buffer = outputCtx.createBuffer(1, dataInt16.length, 24000);
              const channelData = buffer.getChannelData(0);
              for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => setIsLiveActive(false),
          onerror: () => setIsLiveActive(false)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
          systemInstruction: `Sos el Arriero Loco, un guía antioqueño legendario. Hablás con dichos paisas, sos muy servicial y conocés cada rincón de los 125 municipios de Antioquia. Tu misión es dar consejos tácticos de viaje. Responde en el idioma ${state.language} pero manteniendo el sabor y la jerga paisa auténtica.`
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e) {
      console.error("Live API Error:", e);
    }
  };

  const displayedResults = showFavorites 
    ? (state.favorites.map(title => getLocalPlace(title)).filter(p => p !== null) as PlaceData[])
    : state.unifiedResults;

  const currentLang = LANGUAGES.find(l => l.code === state.language) || LANGUAGES[0];

  const TRUST_CARDS_ICONS = [Target, Globe, HeartHandshake];

  return (
    <div className={`min-h-screen transition-colors duration-500 flex flex-col ${state.accessibilityMode ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Header Section */}
      <header className="p-8 max-w-7xl mx-auto w-full flex justify-between items-center relative z-[60]">
        <PaisaLogo isDark={state.accessibilityMode} className="scale-100" onClick={handleReset} />
        
        <div className="flex items-center gap-4 sm:gap-6">
           {(state.unifiedResults.length > 0 || showFavorites) && (
             <button onClick={handleReset} className="hidden sm:flex items-center gap-2 text-[11px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">
                <ArrowLeft size={16} /> {t.backBtn}
             </button>
           )}

           {/* Selector de Idiomas Premium Ajustado */}
           <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`flex items-center gap-3 px-5 py-3 rounded-full border shadow-sm transition-all duration-300 ${isLangMenuOpen ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-100 text-slate-700 hover:border-paisa-emerald/50'}`}
              >
                <div className="flex items-center gap-2">
                  <Languages size={18} className={isLangMenuOpen ? 'text-paisa-gold' : 'text-slate-400'} />
                  <span className="text-[12px] font-black uppercase tracking-widest">{currentLang.code}</span>
                </div>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180 text-paisa-gold' : 'text-slate-300'}`} />
              </button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40 bg-slate-950/5 backdrop-blur-sm"
                      onClick={() => setIsLangMenuOpen(false)}
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute top-full right-0 mt-4 w-56 bg-white rounded-[40px] shadow-2xl border border-slate-100 p-3 z-50 overflow-hidden"
                    >
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setState(s => ({ ...s, language: lang.code }));
                            setIsLangMenuOpen(false);
                            if (state.unifiedResults.length > 0) handleSearch();
                          }}
                          className={`w-full flex items-center justify-between px-6 py-4 rounded-[28px] transition-all group ${state.language === lang.code ? 'bg-emerald-50 text-paisa-emerald' : 'hover:bg-slate-50 text-slate-600'}`}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black tracking-widest text-slate-300 group-hover:text-paisa-emerald/50">{lang.flag}</span>
                            <span className="text-sm font-bold">{lang.name}</span>
                          </div>
                          {state.language === lang.code && <Check size={18} strokeWidth={3} className="text-paisa-emerald" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
           </div>
           
           <button 
             onClick={() => setShowFavorites(!showFavorites)}
             className={`relative p-3.5 rounded-full border transition-all duration-300 ${showFavorites ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-200' : 'bg-white border-slate-100 text-slate-400 hover:border-red-200'}`}
             title="Mis Favoritos"
           >
             <Heart size={22} fill={showFavorites || state.favorites.length > 0 ? (showFavorites ? "white" : "#ef4444") : "none"} className={state.favorites.length > 0 && !showFavorites ? 'text-red-500' : ''} />
             {state.favorites.length > 0 && (
               <span className={`absolute -top-1 -right-1 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center transition-colors ${showFavorites ? 'bg-slate-900' : 'bg-red-500'}`}>
                 {state.favorites.length}
               </span>
             )}
           </button>

           <button 
            onClick={() => setState(s => ({...s, accessibilityMode: !s.accessibilityMode}))}
            className={`p-3.5 rounded-full border transition-all duration-300 ${state.accessibilityMode ? 'bg-paisa-gold text-black border-paisa-gold' : 'bg-white border-slate-100 text-slate-400 hover:border-paisa-gold/50'}`}
            title={state.accessibilityMode ? "Modo Claro" : "Modo Oscuro"}
          >
            {state.accessibilityMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-8 pt-8">
        <AnimatePresence mode="wait">
          {!displayedResults.length && !state.cargando ? (
            <motion.div 
              key="search-home"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="space-y-20 py-10"
            >
              {showFavorites ? (
                <div className="text-center py-40 space-y-8">
                  <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-300">
                    <Heart size={56} />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-4xl font-black uppercase tracking-tight text-slate-900">{t.favoritesEmpty}</h2>
                    <p className="text-xl font-serif italic text-slate-500">{t.favoritesMijo}</p>
                  </div>
                  <button onClick={() => setShowFavorites(false)} className="px-10 py-5 bg-paisa-emerald text-white rounded-full font-black uppercase text-[11px] tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl">
                    {t.startExploring}
                  </button>
                </div>
              ) : (
                <>
                  {/* HERO SECTION */}
                  <div className="text-center space-y-12">
                    <div className="space-y-8">
                      <h1 className={`text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] ${state.accessibilityMode ? 'text-white' : 'text-slate-900'}`}>
                        {t.heroTitle} <br /> <span className={state.accessibilityMode ? 'text-paisa-gold' : 'text-paisa-emerald'}>{t.heroSubtitle}</span>
                      </h1>
                      
                      <div className="max-w-3xl mx-auto space-y-6">
                        <p className="text-2xl md:text-3xl font-serif italic text-slate-500 leading-relaxed px-4">
                          "{t.heroDescription}"
                        </p>
                        
                        <div className="flex flex-wrap justify-center items-center gap-8 pt-4">
                          <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-400">
                            <Bus size={18} className="text-paisa-emerald" /> {t.busPrices}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-400">
                            <ShieldCheck size={18} className="text-paisa-emerald" /> {t.roadStatus}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-400">
                            <Sparkles size={18} className="text-paisa-emerald" /> {t.iaItineraries}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative max-w-2xl mx-auto px-4">
                      <input 
                        type="text"
                        placeholder={t.searchPlaceholder}
                        className={`w-full p-10 rounded-[40px] text-2xl md:text-3xl outline-none border-2 transition-all shadow-2xl
                          ${state.accessibilityMode ? 'bg-zinc-900 border-paisa-gold text-white' : 'bg-white border-slate-100 focus:border-paisa-emerald'}`}
                        value={state.busqueda}
                        onChange={e => setState(s => ({...s, busqueda: e.target.value}))}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                      />
                      <button 
                        onClick={() => handleSearch()} 
                        className="absolute right-7 top-4 bottom-4 px-10 rounded-3xl bg-paisa-emerald text-white font-black uppercase text-[11px] tracking-widest hover:brightness-110 active:scale-95 transition-all"
                      >
                        {t.searchBtn}
                      </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 opacity-40">
                      {t.suggestedTags.map(tag => (
                        <button key={tag} onClick={() => { setState(s => ({...s, busqueda: tag})); handleSearch(tag); }} className="px-5 py-2.5 rounded-full border border-current text-[10px] font-black uppercase tracking-widest hover:opacity-100">
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* TRUST CARDS */}
                  <section className="px-4 md:px-0">
                    <div className="bg-white rounded-[64px] p-12 md:p-20 border border-slate-100 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-24 opacity-5 -rotate-12">
                         <Eye size={240} />
                      </div>
                      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                          <div className="flex items-center gap-3">
                             <Info size={28} className="text-paisa-emerald" />
                             <span className="text-[12px] font-black uppercase tracking-[0.4em] text-paisa-emerald">{t.transparency}</span>
                          </div>
                          <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-slate-900">
                            {t.techTitle} <br /> <span className="text-paisa-gold">{t.techSubtitle}</span>
                          </h2>
                          <p className="text-2xl text-slate-500 font-serif italic leading-relaxed">
                            {t.techDesc}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                           {t.trustCards.map((card, i) => (
                             <motion.div 
                               key={i}
                               whileHover={{ x: 10 }}
                               className={`p-10 rounded-[48px] bg-slate-50 border border-current/5 flex items-start gap-8 shadow-sm`}
                             >
                               <div className={`p-5 rounded-2xl bg-white shadow-md text-emerald-600`}>
                                  {React.createElement(TRUST_CARDS_ICONS[i], { size: 28 })}
                               </div>
                               <div className="space-y-2">
                                  <h4 className={`text-xl font-black uppercase tracking-tight text-emerald-600`}>{card.title}</h4>
                                  <p className="text-base font-medium text-slate-600 leading-relaxed">{card.text}</p>
                               </div>
                             </motion.div>
                           ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-10">
                    <SectionHeader title={t.exploreTitle} subtitle={t.exploreSubtitle} icon={Compass} />
                    <HorizontalCarousel>
                      {t.discovery.map((item, i) => (
                        <DiscoveryCard key={i} title={item.title} subtitle={item.subtitle} image={item.image} onClick={() => { setState(s => ({...s, busqueda: item.title})); handleSearch(item.title); }} />
                      ))}
                    </HorizontalCarousel>
                  </section>

                  <section className="space-y-10">
                    <EpicAntioquiaMap lang={state.language} onSelectRegion={(name) => { setState(s => ({...s, busqueda: name})); handleSearch(name); }} />
                  </section>

                  <section className="space-y-10">
                    <SectionHeader title={t.dichosTitle} subtitle={t.dichosSubtitle} icon={MessageSquare} />
                    <HorizontalCarousel>
                      {t.dichos.map((dicho, i) => (
                        <CultureCard key={i} word={dicho.word} meaning={dicho.meaning} isDark={state.accessibilityMode} />
                      ))}
                    </HorizontalCarousel>
                  </section>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="results-view"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="space-y-16 pb-20"
            >
               {showFavorites && (
                 <div className="pt-10 pb-6 border-b border-slate-100 mb-12">
                    <div className="flex items-center gap-5 text-red-500 mb-3">
                       <Heart size={32} fill="currentColor" />
                       <h2 className="text-5xl font-black uppercase tracking-tighter">{t.favoritesTitle}</h2>
                    </div>
                    <p className="text-slate-400 font-serif italic text-2xl">"{t.favoritesMijo}"</p>
                 </div>
               )}

               {displayedResults.map((item, i) => (
                 <PlaceCard 
                   key={i} 
                   data={item as any} 
                   lang={state.language} 
                   i18n={t.placeCard} 
                   isFavorite={state.favorites.includes(item.titulo)} 
                   onToggleFavorite={toggleFavorite} 
                 />
               ))}
            </motion.div>
          )}
        </AnimatePresence>

        {state.cargando && (
          <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-[1000] flex flex-col items-center justify-center gap-8">
            <div className="relative">
              <Loader2 className="animate-spin text-paisa-emerald" size={80} strokeWidth={1.5} />
              <Sparkles className="absolute -top-3 -right-3 text-paisa-gold animate-bounce" size={32} />
            </div>
            <div className="text-center space-y-3">
              <p className="text-2xl font-black uppercase tracking-tighter">{t.indexing}</p>
              <p className="text-lg font-serif italic opacity-60">{t.indexingMijo}</p>
            </div>
          </div>
        )}
      </main>

      {/* World Class Navigation Bar with Arriero Loco */}
      <Navigation 
        onReset={handleReset} 
        isLiveActive={isLiveActive} 
        onLiveToggle={toggleLiveAPI} 
        hasResults={state.unifiedResults.length > 0} 
        label={isLiveActive ? t.listening : t.arrieroLoco}
      />

      <Footer isDark={state.accessibilityMode} />
    </div>
  );
}
