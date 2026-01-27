
import { SupportedLang } from '../types';
import { Target, Truck, Coffee, ShieldCheck } from 'lucide-react';

export const TRANSLATIONS: Record<SupportedLang, any> = {
  es: {
    heroTitle: "ANTIOQUIA",
    heroSubtitle: "ARRIERO PRO",
    heroDescription: "Indexamos en tiempo real los 125 municipios. Somos Arriero Pro: inteligencia táctica, datos de campo y la berraquera del campo.",
    searchPlaceholder: "¿Qué pueblo buscamos, mijo?",
    searchBtn: "BUSCAR",
    backBtn: "VOLVER",
    surpriseMe: "¿No sabe pa' dónde ir? Déjese llevar mijo...",
    exploreTitle: "Explorar",
    exploreSubtitle: "Subregiones y tesoros locales.",
    indexing: "Buscando Destino",
    indexingMijo: ["Consultando datos tácticos...", "Rastreando precios...", "Verificando vías...", "Preguntándole a los arrieros..."],
    listening: "Escuchando...",
    favoritesTitle: "MIS TESOROS GUARDADOS",
    tacticalIntelligence: "Inteligencia Táctica en Campo",
    pulseItems: ["Vía al Suroeste: Despejada 🟢", "Clima en Jardín: 22°C Soleado ☀️", "Túnel de Oriente: Operando ✅"],
    discovery: [
      { title: "Jardín", subtitle: "Tierra de café y colores", image: "https://images.unsplash.com/photo-1596570073289-535359b85642" },
      { title: "Guatapé", subtitle: "Zócalos y aventura", image: "https://images.unsplash.com/photo-1599140849279-101442488c2f" },
      { title: "Jericó", subtitle: "Cultura y tradición", image: "https://images.unsplash.com/photo-1624647900726-24845564c785" }
    ],
    placeCard: {
      tabs: {
        logistica: "LOGÍSTICA",
        economia: "ECONOMÍA",
        aventura: "AVENTURA"
      },
      logisticsTitle: "RUTA Y MOVILIDAD",
      packingTitle: "MALETA TÁCTICA",
      bankTitle: "BANCA Y PAGOS",
      calcTitle: "CALCULADOR PRESUPUESTAL",
      itineraryTitle: "ITINERARIO TÁCTICO",
      secretsTitle: "SECRETOS DEL ARRIERO",
      sourcesTitle: "FUENTES Y REFERENCIAS TÁCTICAS",
      buses: "BUSES",
      departure: "SALE DE",
      travellers: "VIAJEROS",
      mealsPerDay: "COMIDAS/DÍA",
      foodRecs: "RECOMENDACIONES GASTRONÓMICAS",
      totalEstimated: "TOTAL ESTIMADO COP",
      budgetBreakdown: {
        transport: "Transporte",
        food: "Alimentación",
        stay: "Alojamiento"
      },
      btnItinerary: "GENERAR ITINERARIO",
      btnTips: "VER TIPS LOCALES",
      itineraryNote: "Planificado al minuto por el concierge.",
      locationTerminal: "Ubicación Terminal",
      locationDestino: "Ubicación Destino",
      cashNote: "Los precios son promedios locales actuales. El efectivo es clave para negociar.",
      paymentNote: "LIMITADA A SUPERMERCADOS DE CADENA. EN LA CALLE MANDA EL EFECTIVO Y EL QR DE BANCOLOMBIA."
    },
    navigation: {
      accessibility: "Modo Accesibilidad",
      reset: "Reiniciar búsqueda"
    },
    footer: {
      quote: "Transformando el turismo en una herramienta de regeneración social y económica para las montañas de Antioquia.",
      network: "Nuestra Red",
      verification: "Verificación",
      contact: "Contacto",
      v1: "Datos Logísticos Actualizados",
      v2: "Seguridad Vial Verificada",
      terms: "Términos",
      privacy: "Privacidad",
      copy: "© Arriero Pro. Hecho con berraca voluntad."
    }
  },
  en: {
    heroTitle: "ANTIOQUIA",
    heroSubtitle: "ARRIERO PRO",
    heroDescription: "Real-time indexing of 125 towns. We are Arriero Pro: tactical intelligence, field data, and local heart.",
    searchPlaceholder: "Which town, buddy?",
    searchBtn: "SEARCH",
    backBtn: "BACK",
    surpriseMe: "Don't know where to go? Let yourself go, buddy...",
    exploreTitle: "Explore",
    exploreSubtitle: "Subregions and local gems.",
    indexing: "Searching...",
    indexingMijo: ["Consulting tactical data...", "Tracking prices...", "Checking roads...", "Asking locals..."],
    listening: "Listening...",
    favoritesTitle: "MY SAVED TREASURES",
    tacticalIntelligence: "Tactical Field Intelligence",
    pulseItems: ["Southwest Road: Clear 🟢", "Jardin Weather: 72°F Sunny ☀️", "East Tunnel: Operating ✅"],
    discovery: [
      { title: "Jardin", subtitle: "Coffee land & colors", image: "https://images.unsplash.com/photo-1596570073289-535359b85642" },
      { title: "Guatape", subtitle: "Lakes & adventure", image: "https://images.unsplash.com/photo-1599140849279-101442488c2f" },
      { title: "Jerico", subtitle: "Culture & tradition", image: "https://images.unsplash.com/photo-1624647900726-24845564c785" }
    ],
    placeCard: {
      tabs: {
        logistica: "LOGISTICS",
        economia: "ECONOMY",
        aventura: "ADVENTURE"
      },
      logisticsTitle: "ROUTE & MOBILITY",
      packingTitle: "TACTICAL PACKING",
      bankTitle: "BANKING & PAYMENTS",
      calcTitle: "BUDGET CALCULATOR",
      itineraryTitle: "TACTICAL ITINERARY",
      secretsTitle: "ARRIERO SECRETS",
      sourcesTitle: "SOURCES & VERIFICATION",
      buses: "BUSES",
      departure: "DEPARTS FROM",
      travellers: "TRAVELLERS",
      mealsPerDay: "MEALS/DAY",
      foodRecs: "GASTRONOMIC RECS",
      totalEstimated: "ESTIMATED TOTAL COP",
      budgetBreakdown: {
        transport: "Transport",
        food: "Food",
        stay: "Stay"
      },
      btnItinerary: "GENERATE ITINERARY",
      btnTips: "VIEW LOCAL TIPS",
      itineraryNote: "Planned to the minute by the concierge.",
      locationTerminal: "Terminal Location",
      locationDestino: "Destination Location",
      cashNote: "Prices are current local averages. Cash is key for negotiation.",
      paymentNote: "LIMITED TO CHAIN SUPERMARKETS. IN THE STREETS, CASH AND BANCOLOMBIA QR RULE."
    },
    navigation: {
      accessibility: "Accessibility Mode",
      reset: "Reset search"
    },
    footer: {
      quote: "Transforming tourism into a tool for social and economic regeneration for the mountains of Antioquia.",
      network: "Our Network",
      verification: "Verification",
      contact: "Contact",
      v1: "Updated Logistic Data",
      v2: "Verified Road Safety",
      terms: "Terms",
      privacy: "Privacy",
      copy: "© Arriero Pro. Made with local heart."
    }
  },
  pt: {
    heroTitle: "ANTIOQUIA",
    heroSubtitle: "ARRIERO PRO",
    heroDescription: "Indexamos em tempo real os 125 municípios. Somos Arriero Pro: inteligência tática, dados de campo e a garra do campo.",
    searchPlaceholder: "Qual cidade buscamos, mijo?",
    searchBtn: "BUSCAR",
    backBtn: "VOLTAR",
    surpriseMe: "Não sabe para onde ir? Deixe-se levar, mijo...",
    exploreTitle: "Explorar",
    exploreSubtitle: "Sub-regiões e tesouros locales.",
    indexing: "Buscando Destino",
    indexingMijo: ["Consultando dados táticos...", "Rastreando preços...", "Verificando vias...", "Perguntando aos arrieros..."],
    listening: "Ouvindo...",
    favoritesTitle: "MEUS TESOUROS GUARDADOS",
    tacticalIntelligence: "Inteligência Táctica em Campo",
    pulseItems: ["Via ao Sudoeste: Liberada 🟢", "Clima em Jardín: 22°C Ensolarado ☀️", "Túnel do Oriente: Operando ✅"],
    discovery: [
      { title: "Jardín", subtitle: "Terra de café e colores", image: "https://images.unsplash.com/photo-1596570073289-535359b85642" },
      { title: "Guatapé", subtitle: "Lakes & aventura", image: "https://images.unsplash.com/photo-1599140849279-101442488c2f" },
      { title: "Jericó", subtitle: "Cultura e tradição", image: "https://images.unsplash.com/photo-1624647900726-24845564c785" }
    ],
    placeCard: {
      tabs: {
        logistica: "LOGÍSTICA",
        economia: "ECONOMIA",
        aventura: "AVENTURA"
      },
      logisticsTitle: "ROTA E MOBILIDADE",
      packingTitle: "MALA TÁCTICA",
      bankTitle: "BANCOS E PAGAMENTOS",
      calcTitle: "CALCULADORA DE ORÇAMENTO",
      itineraryTitle: "ITINERÁRIO TÁCTICO",
      secretsTitle: "SEGREDOS DO ARRIERO",
      sourcesTitle: "FONTES E VERIFICAÇÃO",
      buses: "ÔNIBUS",
      departure: "PARTE DE",
      travellers: "VIAJANTES",
      mealsPerDay: "REFEIÇÕES/DIA",
      foodRecs: "RECS GASTRONÔMICAS",
      totalEstimated: "TOTAL ESTIMADO COP",
      budgetBreakdown: {
        transport: "Transporte",
        food: "Alimentação",
        stay: "Hospedagem"
      },
      btnItinerary: "GERAR ITINERÁRIO",
      btnTips: "VER TIPS LOCAIS",
      itineraryNote: "Planejado ao minuto pelo concierge.",
      locationTerminal: "Localização Terminal",
      locationDestino: "Localização Destino",
      cashNote: "Preços são médias locais atuais. Dinheiro vivo é a chave para negociar.",
      paymentNote: "LIMITADO A SUPERMERCADOS DE REDE. NAS RUAS, DINHEIRO E QR BANCOLOMBIA MANDAM."
    },
    navigation: {
      accessibility: "Modo de Acessibilidad",
      reset: "Redefinir busca"
    },
    footer: {
      quote: "Transformando o turismo en una herramienta de regeneración social e económica para as montanhas de Antioquia.",
      network: "Nossa Rede",
      verification: "Verificação",
      contact: "Contacto",
      v1: "Dados Logísticos Actualizados",
      v2: "Segurança Rodoviária Verificada",
      terms: "Terms",
      privacy: "Privacidad",
      copy: "© Arriero Pro. Feito com garra arriera."
    }
  }
};
