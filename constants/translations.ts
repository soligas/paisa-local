
import { SupportedLang } from '../types';

export const TRANSLATIONS: Record<SupportedLang, any> = {
  es: {
    heroTitle: "ANTIOQUIA",
    heroSubtitle: "ARRIERO PRO",
    heroDescription: "Indexamos en tiempo real los 125 municipios. Somos Arriero Pro: inteligencia táctica, datos de campo y la excelencia en la información regional.",
    searchPlaceholder: "¿Qué pueblo desea buscar?",
    searchBtn: "EXPLORAR",
    backBtn: "VOLVER",
    surpriseMe: "¿No sabe hacia dónde ir? Déjese guiar por nosotros...",
    exploreTitle: "Explorar",
    exploreSubtitle: "Subregiones y tesoros locales.",
    indexing: "Buscando Destino",
    indexingMsgs: ["Consultando datos técnicos...", "Rastreando precios actualizados...", "Verificando el estado de las vías...", "Analizando información regional..."],
    listening: "Escuchando...",
    favoritesTitle: "MIS TESOROS GUARDADOS",
    tacticalIntelligence: "Inteligencia Táctica en Campo",
    pulseItems: ["Vía al Suroeste: Despejada 🟢", "Clima en Jardín: 22°C Soleado ☀️", "Túnel de Oriente: Operando ✅"],
    about: {
      title: "NUESTRO PROPÓSITO",
      subtitle: "Lo que hacemos y por qué importa",
      description: "Somos el primer concierge táctico digital diseñado para empoderar al viajero y fortalecer la economía de los 125 municipios de Antioquia. No somos una guía turística común; somos un sistema de indexación regional.",
      pillars: [
        {
          title: "Inteligencia Real",
          desc: "Auditamos datos técnicos en tiempo real: desde la frecuencia de buses hasta la disponibilidad de cajeros automáticos.",
          icon: "database"
        },
        {
          title: "Soberanía Turística",
          desc: "Conectamos al viajero directamente con el comercio local, eliminando intermediarios y fomentando el pago justo.",
          icon: "shield"
        },
        {
          title: "Sabiduría de Campo",
          desc: "Combinamos la potencia de la IA con la sabiduría del arriero para ofrecer recomendaciones que no aparecen en buscadores tradicionales.",
          icon: "mountain"
        }
      ]
    },
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
      packingTitle: "EQUIPAJE RECOMENDADO",
      bankTitle: "BANCA Y PAGOS",
      calcTitle: "CÁLCULO DE PRESUPUESTO",
      supermarketsTitle: "INTELIGENCIA DE PRECIOS",
      itineraryTitle: "ITINERARIO RECOMENDADO",
      secretsTitle: "CONSEJOS LOCALES",
      sourcesTitle: "FUENTES Y REFERENCIAS",
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
      btnTips: "VER CONSEJOS LOCALES",
      itineraryNote: "Planificado con precisión por el sistema.",
      locationTerminal: "Ubicación Terminal",
      locationDestino: "Ubicación Destino",
      cashNote: "Precios verificados. El efectivo es fundamental en zonas rurales.",
      paymentNote: "PAGOS DIGITALES EN COMERCIOS DE CADENA. EN OTRAS ZONAS SE RECOMIENDA EFECTIVO Y QR BANCOLOMBIA."
    },
    navigation: {
      accessibility: "Modo Accesibilidad",
      reset: "Nueva búsqueda"
    },
    footer: {
      quote: "Transformando el turismo en una herramienta de desarrollo social y económico para las comunidades de Antioquia.",
      network: "Nuestra Red",
      verification: "Verificación",
      contact: "Contacto",
      v1: "Datos Logísticos Actualizados",
      v2: "Seguridad Vial Verificada",
      terms: "Términos",
      privacy: "Privacidad",
      copy: "© Arriero Pro. Comprometidos con nuestra región."
    },
    payment: {
      floatingBtn: "APOYAR PROYECTO",
      modalTitle: "APOYO VOLUNTARIO",
      modalSubtitle: "Arriero Pro es una herramienta gratuita. Si le ha sido de utilidad, puede apoyarnos voluntariamente para mantener el servicio activo.",
      nequi: "Nequi / Daviplata",
      bancolombia: "Bancolombia QR",
      card: "Donación con Tarjeta",
      scanTitle: "ESCANEÉ PARA APOYAR",
      scanSubtitle: "Utilice su aplicación móvil para realizar el aporte voluntario.",
      confirm: "CONTINUAR EXPLORANDO",
      back: "CAMBIAR MÉTODO",
      secureNote: "El apoyo es 100% voluntario para el mantenimiento técnico.",
      hint: "¿Le ha sido útil la herramienta?"
    }
  },
  en: {
    heroTitle: "ANTIOQUIA",
    heroSubtitle: "ARRIERO PRO",
    heroDescription: "Real-time indexing of 125 towns. We are Arriero Pro: tactical intelligence, field data, and excellence in regional information.",
    searchPlaceholder: "Which town would you like to search for?",
    searchBtn: "EXPLORE",
    backBtn: "BACK",
    surpriseMe: "Not sure where to go? Let us guide you...",
    exploreTitle: "Explore",
    exploreSubtitle: "Subregions and local gems.",
    indexing: "Searching...",
    indexingMsgs: ["Consulting technical data...", "Tracking updated prices...", "Checking road conditions...", "Analyzing regional info..."],
    listening: "Listening...",
    favoritesTitle: "MY SAVED TREASURES",
    tacticalIntelligence: "Tactical Field Intelligence",
    pulseItems: ["Southwest Road: Clear 🟢", "Jardin Weather: 72°F Sunny ☀️", "East Tunnel: Operating ✅"],
    about: {
      title: "OUR PURPOSE",
      subtitle: "What we do and why it matters",
      description: "We are the first digital tactical concierge designed to empower the traveler and strengthen the economy of the 125 municipalities of Antioquia. We are not a common travel guide; we are a regional indexing system.",
      pillars: [
        {
          title: "Real Intelligence",
          desc: "We audit technical data in real-time: from bus frequency to ATM availability.",
          icon: "database"
        },
        {
          title: "Tourism Sovereignty",
          desc: "We connect the traveler directly with local commerce, eliminating intermediaries and encouraging fair payment.",
          icon: "shield"
        },
        {
          title: "Field Wisdom",
          desc: "We combine the power of AI with the wisdom of the 'arriero' to offer recommendations that do not appear in traditional search engines.",
          icon: "mountain"
        }
      ]
    },
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
      packingTitle: "RECOMMENDED GEAR",
      bankTitle: "BANKING & PAYMENTS",
      calcTitle: "BUDGET CALCULATOR",
      supermarketsTitle: "PRICE INTELLIGENCE",
      itineraryTitle: "RECOMMENDED ITINERARY",
      secretsTitle: "LOCAL INSIGHTS",
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
      itineraryNote: "Planned with precision by the system.",
      locationTerminal: "Terminal Location",
      locationDestino: "Destination Location",
      cashNote: "Verified prices. Cash is fundamental in rural areas.",
      paymentNote: "DIGITAL PAYMENTS IN CHAIN STORES. IN OTHER AREAS, CASH AND BANCOLOMBIA QR ARE RECOMMENDED."
    },
    navigation: {
      accessibility: "Accessibility Mode",
      reset: "New search"
    },
    footer: {
      quote: "Transformando el turismo en una herramienta de desarrollo social y económico para las comunidades de Antioquia.",
      network: "Our Network",
      verification: "Verification",
      contact: "Contact",
      v1: "Updated Logistic Data",
      v2: "Verified Road Safety",
      terms: "Terms",
      privacy: "Privacy",
      copy: "© Arriero Pro. Committed to our region."
    },
    payment: {
      floatingBtn: "SUPPORT PROJECT",
      modalTitle: "VOLUNTARY SUPPORT",
      modalSubtitle: "Arriero Pro is a free tool. If it has been useful to you, you can voluntarily support us to keep the service active.",
      nequi: "Nequi / Daviplata",
      bancolombia: "Bancolombia QR",
      card: "Credit Card Donation",
      scanTitle: "SCAN TO SUPPORT",
      scanSubtitle: "Use your mobile app to make your voluntary contribution.",
      confirm: "CONTINUE EXPLORING",
      back: "CHANGE METHOD",
      secureNote: "Support is 100% voluntary for technical maintenance.",
      hint: "Was the tool helpful?"
    }
  },
  pt: {
    heroTitle: "ANTIOQUIA",
    heroSubtitle: "ARRIERO PRO",
    heroDescription: "Indexamos em tempo real os 125 municípios. Somos Arriero Pro: inteligência tática, dados de campo e excelência na informação regional.",
    searchPlaceholder: "Qual cidade você deseja procurar?",
    searchBtn: "EXPLORAR",
    backBtn: "VOLTAR",
    surpriseMe: "Não sabe para onde ir? Deixe-nos guiar você...",
    exploreTitle: "Explorar",
    exploreSubtitle: "Sub-regiões e tesouros locais.",
    indexing: "Buscando...",
    indexingMsgs: ["Consultando dados técnicos...", "Rastreando preços atualizados...", "Verificando o estado das estradas...", "Analisando info regional..."],
    listening: "Ouvindo...",
    favoritesTitle: "MEUS TESOUROS GUARDADOS",
    tacticalIntelligence: "Inteligência Táctica em Campo",
    pulseItems: ["Via ao Sudoeste: Liberada 🟢", "Clima em Jardín: 22°C Ensolarado ☀️", "Túnel do Oriente: Operando ✅"],
    about: {
      title: "NOSSO PROPÓSITO",
      subtitle: "O que fazemos e por que importa",
      description: "Somos o primeiro concierge tático digital projetado para capacitar o viajante e fortalecer a economia dos 125 municípios de Antioquia. Não somos um guia de viagem comum; somos um sistema de indexação regional.",
      pillars: [
        {
          title: "Inteligência Real",
          desc: "Auditamos dados técnicos em tempo real: da frequência dos ônibus à disponibilidade de caixas eletrônicos.",
          icon: "database"
        },
        {
          title: "Soberania Turística",
          desc: "Conectamos o viajante diretamente ao comércio local, eliminando intermediários e incentivando o pagamento justo.",
          icon: "shield"
        },
        {
          title: "Sabedoria de Campo",
          desc: "Combinamos o poder da IA com a sabedoria do 'arriero' para oferecer recomendações que não aparecem nos buscadores tradicionais.",
          icon: "mountain"
        }
      ]
    },
    discovery: [
      { title: "Jardín", subtitle: "Terra de café e cores", image: "https://images.unsplash.com/photo-1596570073289-535359b85642" },
      { title: "Guatapé", subtitle: "Lakes & aventura", image: "https://images.unsplash.com/photo-1599140849279-101442488c2f" },
      { title: "Jericó", subtitle: "Cultura e tradição", image: "https://images.unsplash.com/photo-1624647900726-24845564c785" }
    ],
    placeCard: {
      tabs: {
        logistica: "LOGÍSTICA",
        economia: "ECONOMIA",
        aventura: "ADVENTURA"
      },
      logisticsTitle: "ROTA E MOBILIDADE",
      packingTitle: "BAGAGEM RECOMENDADA",
      bankTitle: "BANCOS E PAGAMENTOS",
      calcTitle: "CÁLCULO DE ORÇAMENTO",
      supermarketsTitle: "INTELIGÊNCIA DE PREÇOS",
      itineraryTitle: "ITINERÁRIO RECOMENDADO",
      secretsTitle: "DICAS LOCAIS",
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
      btnTips: "VER DICAS LOCAIS",
      itineraryNote: "Planejado com precisão pelo sistema.",
      locationTerminal: "Localização Terminal",
      locationDestino: "Localização Destino",
      cashNote: "Precios verificados. O dinheiro vivo é fundamental em áreas rurais.",
      paymentNote: "PAGAMENTOS DIGITAIS EM LOJAS DE REDE. EM OUTRAS ÁREAS, RECOMENDA-SE DINHEIRO E QR BANCOLOMBIA."
    },
    navigation: {
      accessibility: "Modo de Acessibilidade",
      reset: "Nova busca"
    },
    footer: {
      quote: "Transformando o turismo em uma ferramenta de desenvolvimento social e económico para as comunidades de Antioquia.",
      network: "Nossa Rede",
      verification: "Verificação",
      contact: "Contacto",
      v1: "Dados Logísticos Actualizados",
      v2: "Segurança Rodoviária Verificada",
      terms: "Termos",
      privacy: "Privacidade",
      copy: "© Arriero Pro. Comprometidos con nossa região."
    },
    payment: {
      floatingBtn: "APOIAR PROJETO",
      modalTitle: "APOIO VOLUNTÁRIO",
      modalSubtitle: "Arriero Pro é uma ferramenta gratuita. Se lhe foi útil, pode nos apoiar voluntariamente para manter o serviço ativo.",
      nequi: "Nequi / Daviplata",
      bancolombia: "Bancolombia QR",
      card: "Doação com Cartão",
      scanTitle: "ESCANEIE PARA APOIAR",
      scanSubtitle: "Use seu aplicativo móvel para fazer sua contribuição voluntária.",
      confirm: "CONTINUAR EXPLORANDO",
      back: "ALTERAR MÉTODO",
      secureNote: "O apoio é 100% voluntário para a manutenção técnica.",
      hint: "A ferramenta foi útil?"
    }
  }
};
