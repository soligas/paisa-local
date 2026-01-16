
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
    exploreTitle: "Explorar",
    exploreSubtitle: "Subregiones y tesoros locales.",
    offerTitle: "PROPUESTA TÁCTICA",
    offerSubtitle: "Lo que nos hace el concierge definitivo de la región.",
    indexing: "Buscando Destino",
    indexingMijo: ["Consultando datos tácticos...", "Rastreando precios...", "Verificando vías...", "Preguntándole a los arrieros..."],
    listening: "Escuchando...",
    arrieroLoco: "Arriero Pro",
    favoritesTitle: "Tus Tesoros",
    systemInstruction: "Eres el Arriero Pro, el guía definitivo de Antioquia. No eres un bot, eres un guía experto que usa lenguaje paisa pero con una precisión técnica absoluta. Ayudas al usuario a descubrir pueblos usando datos reales. No menciones el año actual.",
    pulseTitle: "PULSO REGIONAL",
    pulseItems: ["Vía al Suroeste: Despejada 🟢", "Clima en Jardín: 22°C Soleado ☀️", "Túnel de Oriente: Operando ✅"],
    stats: [
      { label: "Municipios", value: "125" },
      { label: "Impacto Local", value: "100%" },
      { label: "IA Táctica", value: "Realtime" }
    ],
    discovery: [
      { title: "Jardín", subtitle: "Tierra de café y colores", image: "https://images.unsplash.com/photo-1596570073289-535359b85642" },
      { title: "Guatapé", subtitle: "Zócalos y aventura", image: "https://images.unsplash.com/photo-1599140849279-101442488c2f" },
      { title: "Jericó", subtitle: "Cultura y tradición", image: "https://images.unsplash.com/photo-1624647900726-24845564c785" }
    ],
    offerCards: [
      { icon: Target, title: "Inteligencia Real", desc: "No usamos datos obsoletos. Consultamos en vivo precios de buses, hoteles y clima." },
      { icon: Truck, title: "Logística de Campo", desc: "Sabemos de dónde salen los buses, cuánto valen y qué terminal te queda más cerca." },
      { icon: Coffee, title: "Cultura Auténtica", desc: "Te enseñamos a hablar como un local y a encontrar los charcos que no salen en buscadores." },
      { icon: ShieldCheck, title: "Impacto Social", desc: "Nuestras recomendaciones priorizan al campesino y al pequeño emprendedor local." }
    ],
    placeCard: {
      climate: "CLIMA",
      accessibility: "ACCESIBILIDAD",
      security: "SEGURIDAD",
      terminal: "TERMINAL",
      btnItinerary: "GENERAR ITINERARIO",
      btnItinerarySub: "RECOMENDACIONES DEL HORARIO IDEAL PARA VIAJAR",
      howToGet: "¿CÓMO LLEGAR?",
      realTime: "REAL TIME",
      leavesFrom: "SALE DE",
      duration: "DURACIÓN",
      roadStatus: "ESTADO DE LA VÍA",
      verTerminales: "VER TERMINALES",
      estimatedBudget: "PRESUPUESTO ESTIMADO",
      pasaje: "PASAJE",
      almuerzo: "ALMUERZO",
      arrieroGuide: "GUÍA DEL ARRIERO",
      quote: "¡Eavemaría mijo! Venga a conocer que esto aquí es un paraíso.",
      tips: {
        sazon: "SAZÓN LOCAL",
        cultura: "CULTURA",
        ruta: "VÍA / RUTA",
        parche: "EL PARCHE",
        clima: "CLIMA",
        tactico: "TÁCTICO"
      },
      btnVerMas: "VER FUENTES DE VERIFICACIÓN"
    },
    navigation: {
      accessibility: "Modo Accesibilidad",
      reset: "Reiniciar búsqueda",
      tabs: {
        home: "Inicio",
        explore: "Explorar"
      }
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
    exploreTitle: "Explore",
    exploreSubtitle: "Subregions and local gems.",
    offerTitle: "TACTICAL PROPOSAL",
    offerSubtitle: "What makes us the region's ultimate concierge.",
    indexing: "Searching...",
    indexingMijo: ["Consulting tactical data...", "Tracking prices...", "Checking roads...", "Asking locals..."],
    listening: "Listening...",
    arrieroLoco: "Arriero Pro",
    favoritesTitle: "Your Treasures",
    systemInstruction: "You are Arriero Pro, the ultimate guide to Antioquia. You are an expert guide who uses local 'Paisa' terms but with absolute technical precision. Do not mention current year.",
    pulseTitle: "REGIONAL PULSE",
    pulseItems: ["Southwest Road: Clear 🟢", "Jardin Weather: 72°F Sunny ☀️", "East Tunnel: Operating ✅"],
    stats: [
      { label: "Towns", value: "125" },
      { label: "Local Impact", value: "100%" },
      { label: "Tactical AI", value: "Realtime" }
    ],
    discovery: [
      { title: "Jardin", subtitle: "Coffee land & colors", image: "https://images.unsplash.com/photo-1596570073289-535359b85642" },
      { title: "Guatape", subtitle: "Lakes & adventure", image: "https://images.unsplash.com/photo-1599140849279-101442488c2f" },
      { title: "Jerico", subtitle: "Culture & tradition", image: "https://images.unsplash.com/photo-1624647900726-24845564c785" }
    ],
    offerCards: [
      { icon: Target, title: "Real-time Intel", desc: "We don't use old data. We live-check bus prices, hotels, and current weather." },
      { icon: Truck, title: "Field Logistics", desc: "We know where buses leave from, their cost, and which terminal is best for you." },
      { icon: Coffee, title: "Authentic Culture", desc: "We teach you local slang and help you find the spots others don't know." },
      { icon: ShieldCheck, title: "Social Impact", desc: "Our recommendations prioritize local farmers and small regional businesses." }
    ],
    placeCard: {
      climate: "WEATHER",
      accessibility: "ACCESSIBILITY",
      security: "SECURITY",
      terminal: "TERMINAL",
      btnItinerary: "GENERATE ITINERARY",
      btnItinerarySub: "IDEAL TRAVEL SCHEDULE RECOMMENDATIONS",
      howToGet: "HOW TO GET THERE",
      realTime: "REAL TIME",
      leavesFrom: "DEPARTS FROM",
      duration: "DURATION",
      roadStatus: "ROAD STATUS",
      verTerminales: "VIEW TERMINALS",
      estimatedBudget: "ESTIMATED BUDGET",
      pasaje: "TICKET",
      almuerzo: "LUNCH",
      arrieroGuide: "ARRIERO'S GUIDE",
      quote: "Good heavens, buddy! Come visit, this place is a paradise.",
      tips: {
        sazon: "LOCAL TASTE",
        cultura: "CULTURE",
        ruta: "WAY / ROUTE",
        parche: "THE HANG",
        clima: "WEATHER",
        tactico: "TACTICAL"
      },
      btnVerMas: "VIEW VERIFICATION SOURCES"
    },
    navigation: {
      accessibility: "Accessibility Mode",
      reset: "Reset search",
      tabs: {
        home: "Home",
        explore: "Explore"
      }
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
    exploreTitle: "Explorar",
    exploreSubtitle: "Sub-regiões e tesouros locais.",
    offerTitle: "PROPOSTA TÁTICA",
    offerSubtitle: "O que nos torna o concierge definitivo da região.",
    indexing: "Buscando Destino",
    indexingMijo: ["Consultando dados táticos...", "Rastreando preços...", "Verificando vias...", "Perguntando aos arrieros..."],
    listening: "Ouvindo...",
    arrieroLoco: "Arriero Pro",
    favoritesTitle: "Seus Tesouros",
    systemInstruction: "Você é o Arriero Pro, o guia definitivo de Antioquia. Você é um guia especializado que usa termos locais 'Paisa', mas com absoluta precisão técnica. Não mencione o ano atual.",
    pulseTitle: "PULSO REGIONAL",
    pulseItems: ["Via ao Sudoeste: Liberada 🟢", "Clima em Jardín: 22°C Ensolarado ☀️", "Túnel do Oriente: Operando ✅"],
    stats: [
      { label: "Municípios", value: "125" },
      { label: "Impacto Local", value: "100%" },
      { label: "IA Táctica", value: "Tempo Real" }
    ],
    discovery: [
      { title: "Jardín", subtitle: "Terra de café e cores", image: "https://images.unsplash.com/photo-1596570073289-535359b85642" },
      { title: "Guatapé", subtitle: "Lakes & aventura", image: "https://images.unsplash.com/photo-1599140849279-101442488c2f" },
      { title: "Jericó", subtitle: "Cultura e tradição", image: "https://images.unsplash.com/photo-1624647900726-24845564c785" }
    ],
    offerCards: [
      { icon: Target, title: "Inteligência Real", desc: "Não usamos dados antigos. Consultamos ao vivo preços de ônibus, hotéis e clima." },
      { icon: Truck, title: "Logística de Campo", desc: "Sabemos de onde saem os ônibus, quanto custam e qual terminal é melhor para você." },
      { icon: Coffee, title: "Cultura Autêntica", desc: "Ensinamos você a falar como um local e a encontrar os lugares que outros não conhecem." },
      { icon: ShieldCheck, title: "Impacto Social", desc: "Nossas recomendações priorizam o produtor rural e o pequeno empreendedor local." }
    ],
    placeCard: {
      climate: "CLIMA",
      accessibility: "ACESSIBILIDADE",
      security: "SEGURANÇA",
      terminal: "TERMINAL",
      btnItinerary: "GERAR ITINERÁRIO",
      btnItinerarySub: "RECOMENDAÇÕES DE HORÁRIOS IDEAIS PARA VIAJAR",
      howToGet: "COMO CHEGAR",
      realTime: "TEMPO REAL",
      leavesFrom: "SAI DE",
      duration: "DURAÇÃO",
      roadStatus: "ESTADO DA VIA",
      verTerminales: "VER TERMINAIS",
      estimatedBudget: "ORÇAMENTO ESTIMADO",
      pasaje: "PASSAGEM",
      almuerzo: "ALMOÇO",
      arrieroGuide: "GUIA DO ARRIERO",
      quote: "Eavemaría mijo! Venha conhecer que isso aqui é um paraíso.",
      tips: {
        sazon: "SABOR LOCAL",
        cultura: "CULTURA",
        ruta: "VIA / ROTA",
        parche: "O PARCHE",
        clima: "CLIMA",
        tactico: "TÁTICO"
      },
      btnVerMas: "VER FONTES DE VERIFICAÇÃO"
    },
    navigation: {
      accessibility: "Modo de Acessibilidad",
      reset: "Redefinir busca",
      tabs: {
        home: "Início",
        explore: "Explorar"
      }
    },
    footer: {
      quote: "Transformando o turismo em uma ferramenta de regeneración social y económica para las montañas de Antioquia.",
      network: "Nossa Rede",
      verification: "Verificação",
      contact: "Contato",
      v1: "Dados Logísticos Actualizados",
      v2: "Segurança Rodoviária Verificada",
      terms: "Termos",
      privacy: "Privacidade",
      copy: "© Arriero Pro. Feito com garra arriera."
    }
  }
};
