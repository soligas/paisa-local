
import { SupportedLang } from '../types';

export const TRANSLATIONS: Record<SupportedLang, any> = {
  es: {
    heroTitle: "ANTIOQUIA",
    heroSubtitle: "AUDITORÍA TÁCTICA",
    heroDescription: "Sistema de soberanía de datos para el territorio. Auditamos la logística, economía y rutas de Antioquia para eliminar la asimetría de información y potenciar el comercio local de montaña.",
    searchPlaceholder: "Buscar municipio o subregión...",
    searchBtn: "BUSCAR",
    backBtn: "REPLEGAR",
    surpriseMe: "¿Sin coordenadas? Deje que el sistema asigne una ruta de campo...",
    exploreTitle: "Explorar",
    exploreSubtitle: "Subregiones y datos indexados por el sistema.",
    indexing: "Indexando Destino",
    indexingMsgs: [
      "Extrayendo datos de movilidad...",
      "Validando nodos financieros (ATM)...",
      "Sincronizando malla vial regional 🟢",
      "Auditando puntos de interés táctico..."
    ],
    listening: "Escucha activa...",
    favoritesTitle: "REPORTES GUARDADOS",
    reportsTitle: "REPORTES",
    reportsSubtitle: "Extracciones de campo verificadas",
    tacticalIntelligence: "Inteligencia de Campo v3.1",
    pulseItems: [
      "CONEXIÓN SUROESTE: FLUJO ESTABLE 🟢",
      "TERMÓMETRO JARDÍN: 22°C ÓPTIMO ☀️",
      "TÚNEL ORIENTE: OPERATIVO ✅",
      "CENTRO JERICÓ: MERCADO ACTIVO 📦",
      "VÍA URABÁ: PRECAUCIÓN POR OBRAS ⚠️"
    ],
    municipiosIndexed: "Territorios Indexados",
    about: {
      title: "MISIÓN TÁCTICA",
      subtitle: "SOBERANÍA DE DATOS",
      description: "Arriero Pro no es una guía de viajes. Es un motor de auditoría territorial diseñado para eliminar la asimetría de información y potenciar la economía local.",
      pillars: [
        {
          title: "Auditoría Técnica",
          desc: "Datos validados en campo: frecuencias reales, red de cajeros y estado de vías.",
          icon: "database"
        },
        {
          title: "Impulso Local",
          desc: "Conectamos al viajero con el comercio de base, fortaleciendo la economía regional.",
          icon: "shield"
        },
        {
          title: "Algoritmo Arriero",
          desc: "Combinamos IA de última generación con la sabiduría ancestral de las montañas.",
          icon: "mountain"
        }
      ]
    },
    discovery: [
      { title: "Jardín", subtitle: "Auditoría Cafetera", image: "https://images.unsplash.com/photo-1596570073289-535359b85642" },
      { title: "Guatapé", subtitle: "Ruta de Embalses", image: "https://images.unsplash.com/photo-1599140849279-101442488c2f" },
      { title: "Jericó", subtitle: "Patrimonio Táctico", image: "https://images.unsplash.com/photo-1624647900726-24845564c785" }
    ],
    placeCard: {
      tabs: {
        logistica: "LOGÍSTICA",
        economia: "ECONOMÍA",
        aventura: "AVENTURA"
      },
      logisticsTitle: "MOVILIDAD Y ACCESO",
      packingTitle: "EQUIPO RECOMENDADO",
      bankTitle: "NODOS FINANCIEROS",
      calcTitle: "PROYECCIÓN DE GASTOS",
      supermarketsTitle: "ESTADÍSTICA DE PRECIOS",
      itineraryTitle: "HOJA DE RUTA",
      secretsTitle: "INTELIGENCIA LOCAL",
      sourcesTitle: "FUENTES AUDITADAS",
      buses: "FREQUENCIA",
      departure: "DESPLIEGUE DESDE",
      travellers: "VIAJEROS",
      mealsPerDay: "RACIONES/DÍA",
      foodRecs: "GASTRONOMÍA DE CAMPO",
      totalEstimated: "COSTO OPERATIVO ESTIMADO",
      budgetBreakdown: {
        transport: "Movilidad",
        food: "Suministros",
        stay: "Alojamiento"
      },
      btnItinerary: "GENERAR PLAN IA",
      btnTips: "REVELAR SECRETOS",
      itineraryNote: "Optimizado por el motor Arriero Pro.",
      locationTerminal: "Ubicación Terminal",
      locationDestino: "Ubicación Destino",
      cashNote: "Datos verificados. El efectivo es indispensable en este sector.",
      paymentNote: "ESTABLECIMIENTOS GRANDES: DIGITAL. RURALIDAD: EFECTIVO Y QR BANCOLOMBIA."
    },
    mapLabels: {
      section: "INTELIGENCIA TERRITORIAL",
      subtitle: "Auditoria de las 9 subregiones de Antioquia",
      tag: "SECTOR ESTRATÉGICO",
      census: "COBERTURA DE CAMPO",
      pulse: "PULSO LOCAL",
      treasures: "TESOROS INDEXADOS",
      exploreBtn: "DESPLEGAR INFORME",
      impulsar: "APOYAR ESTE PROYECTO"
    },
    navigation: {
      accessibility: "Modo Táctico",
      reset: "Nueva Auditoría"
    },
    footer: {
      quote: "Transformando la información en soberanía económica para nuestras montañas.",
      network: "Red de Aliados",
      verification: "Estado del Sistema",
      contact: "Enlace Directo",
      v1: "Logística Indexada",
      v2: "Seguridad Verificada",
      terms: "Reglas de Campo",
      privacy: "Protección de Datos",
      copy: "© Arriero Pro. Hecho con berraca voluntad."
    },
    payment: {
      floatingBtn: "APOYAR ESTE PROYECTO",
      modalTitle: "CONTRIBUCIÓN VOLUNTARIA",
      modalSubtitle: "Tu apoyo financiero directo permite que Arriero Pro siga auditando el territorio de forma independiente. Cada aporte impulsa nuestra infraestructura de datos soberanos.",
      nequi: "Nequi / Daviplata",
      bancolombia: "QR Bancolombia",
      card: "Transferencia Digital",
      scanTitle: "APOYAR ESTA MISIÓN",
      scanSubtitle: "Tu contribución mantiene viva la auditoría territorial.",
      confirm: "VOLVER AL CAMPO",
      back: "CAMBIAR MÉTODO",
      secureNote: "Tu aporte financia la soberanía de datos en Antioquia.",
      hint: "¿Deseas apoyar este proyecto?",
      syncing: "CONECTANDO PASARELA...",
      mainBtn: "APOYAR PROYECTO"
    }
  },
  en: {
    heroTitle: "ANTIOQUIA",
    heroSubtitle: "TACTICAL AUDIT",
    heroDescription: "Data sovereignty system for the territory. We audit the logistics, economy, and routes of Antioquia to eliminate information asymmetry and empower local mountain commerce.",
    searchPlaceholder: "Search town or subregion...",
    searchBtn: "SEARCH",
    backBtn: "REDEPLOY",
    surpriseMe: "No coordinates? Let the system assign a field route...",
    exploreTitle: "Explore",
    exploreSubtitle: "Subregions and data indexed by the system.",
    indexing: "Indexing Destination",
    indexingMsgs: [
      "Extracting mobility data...",
      "Validating financial nodes (ATM)...",
      "Syncing regional road network 🟢",
      "Auditing points of tactical interest..."
    ],
    listening: "Active listening...",
    favoritesTitle: "SAVED REPORTS",
    reportsTitle: "REPORTS",
    reportsSubtitle: "Verified field extractions",
    tacticalIntelligence: "Field Intel v3.1",
    pulseItems: [
      "SW CONNECTION: STABLE FLOW 🟢",
      "JARDIN TEMP: 22°C OPTIMAL ☀️",
      "EAST TUNNEL: OPERATIONAL ✅",
      "JERICO CENTER: ACTIVE MARKET 📦",
      "URABA ROAD: CAUTION - WORK IN PROGRESS ⚠️"
    ],
    municipiosIndexed: "Indexed Territories",
    about: {
      title: "TACTICAL MISSION",
      subtitle: "DATA SOVEREIGNTY",
      description: "Arriero Pro is not a travel guide. It is a territorial audit engine designed to eliminate information asymmetry and boost the local economy.",
      pillars: [
        {
          title: "Technical Audit",
          desc: "Field-validated data: real frequencies, ATM networks, and road conditions.",
          icon: "database"
        },
        {
          title: "Local Boost",
          desc: "We connect the traveler with grassroots commerce, strengthening the regional economy.",
          icon: "shield"
        },
        {
          title: "Arriero Algorithm",
          desc: "We combine next-gen AI with the ancestral wisdom of the mountains.",
          icon: "mountain"
        }
      ]
    },
    discovery: [
      { title: "Jardin", subtitle: "Coffee Audit", image: "https://images.unsplash.com/photo-1596570073289-535359b85642" },
      { title: "Guatape", subtitle: "Reservoir Route", image: "https://images.unsplash.com/photo-1599140849279-101442488c2f" },
      { title: "Jerico", subtitle: "Tactical Heritage", image: "https://images.unsplash.com/photo-1624647900726-24845564c785" }
    ],
    placeCard: {
      tabs: {
        logistica: "LOGISTICS",
        economia: "ECONOMY",
        aventura: "ADVENTURE"
      },
      logisticsTitle: "MOBILITY & ACCESS",
      packingTitle: "RECOMMENDED GEAR",
      bankTitle: "FINANCIAL NODES",
      calcTitle: "EXPENSE PROJECTION",
      supermarketsTitle: "PRICE STATISTICS",
      itineraryTitle: "ROADMAP",
      secretsTitle: "LOCAL INTEL",
      sourcesTitle: "AUDITED SOURCES",
      buses: "FREQUENCY",
      departure: "DEPLOY FROM",
      travellers: "TRAVELERS",
      mealsPerDay: "RATIONS/DAY",
      foodRecs: "FIELD GASTRONOMY",
      totalEstimated: "ESTIMATED OPERATING COST",
      budgetBreakdown: {
        transport: "Mobility",
        food: "Supplies",
        stay: "Stay"
      },
      btnItinerary: "GENERATE AI PLAN",
      btnTips: "REVEAL SECRETS",
      itineraryNote: "Optimized by the Arriero Pro engine.",
      locationTerminal: "Terminal Location",
      locationDestino: "Destination Location",
      cashNote: "Verified data. Cash is indispensable in this sector.",
      paymentNote: "LARGE ESTABLISHMENTS: DIGITAL. RURAL: CASH AND BANCOLOMBIA QR."
    },
    mapLabels: {
      section: "TERRITORIAL INTEL",
      subtitle: "Audit of the 9 Antioquian subregions",
      tag: "STRATEGIC SECTOR",
      census: "FIELD COVERAGE",
      pulse: "LOCAL PULSE",
      treasures: "INDEXED TREASURES",
      exploreBtn: "DEPLOY REPORT",
      impulsar: "SUPPORT THIS PROJECT"
    },
    navigation: {
      accessibility: "Tactical Mode",
      reset: "New Audit"
    },
    footer: {
      quote: "Transforming information into economic sovereignty for our mountains.",
      network: "Partner Network",
      verification: "System Status",
      contact: "Direct Link",
      v1: "Indexed Logistics",
      v2: "Verified Road Safety",
      terms: "Field Rules",
      privacy: "Data Protection",
      copy: "© Arriero Pro. Built with mountain grit."
    },
    payment: {
      floatingBtn: "SUPPORT PROJECT",
      modalTitle: "VOLUNTARY CONTRIBUTION",
      modalSubtitle: "Your direct financial support allows Arriero Pro to continue auditing the territory independently. Every contribution powers our sovereign data infrastructure.",
      nequi: "Nequi / Daviplata",
      bancolombia: "Bancolombia QR",
      card: "Digital Transfer",
      scanTitle: "SUPPORT THIS MISSION",
      scanSubtitle: "Your contribution keeps territorial auditing alive.",
      confirm: "BACK TO FIELD",
      back: "CHANGE METHOD",
      secureNote: "Your contribution finances data sovereignty in Antioquia.",
      hint: "Would you like to support this project?",
      syncing: "CONNECTING GATEWAY...",
      mainBtn: "SUPPORT PROJECT"
    }
  },
  pt: {
    heroTitle: "ANTIOQUIA",
    heroSubtitle: "AUDITORIA TÁCTICA",
    heroDescription: "Sistema de soberania de datos para o território. Auditamos a logística, economia e rotas de Antioquia para eliminar a assimetria de informação e impulsionar o comércio local de montanha.",
    searchPlaceholder: "Buscar município ou sub-região...",
    searchBtn: "BUSCAR",
    backBtn: "REPLIEGAR",
    surpriseMe: "Sem coordenadas? Deixe o sistema atribuir uma rota de campo...",
    exploreTitle: "Explorar",
    exploreSubtitle: "Sub-regiões e dados indexados pelo sistema.",
    indexing: "Indexando Destino",
    indexingMsgs: [
      "Extraindo dados de mobilidade...",
      "Validando nós financeiros (ATM)...",
      "Sincronizando malha viária regional 🟢",
      "Auditando pontos de interesse táctico..."
    ],
    listening: "Escuta activa...",
    favoritesTitle: "RELATÓRIOS SALVOS",
    reportsTitle: "RELATÓRIOS",
    reportsSubtitle: "Extrações de campo verificadas",
    tacticalIntelligence: "Inteligencia de Campo v3.1",
    pulseItems: [
      "CONEXÃO SUDOESTE: FLUXO ESTÁVEL 🟢",
      "TERMÔMETRO JARDIM: 22°C ÓTIMO ☀️",
      "TÚNEL ORIENTE: OPERACIONAL ✅",
      "CENTRO JERICÓ: MERCADO ACTIVO 📦",
      "VIA URABÁ: PRECAUÇÃO POR OBRAS ⚠️"
    ],
    municipiosIndexed: "Territórios Indexados",
    about: {
      title: "MISSÃO TÁCTICA",
      subtitle: "SOBERANIA DE DADOS",
      description: "Arriero Pro não é um guia de viagens. É um motor de auditoria territorial projetado para eliminar a assimetria de informação e impulsionar a economia local.",
      pillars: [
        {
          title: "Auditoria Técnica",
          desc: "Dados validados em campo: frequências reais, redes ATM e estado das vias.",
          icon: "database"
        },
        {
          title: "Impulso Local",
          desc: "Conectamos o viajante ao comércio de base, fortalecendo a economia regional.",
          icon: "shield"
        },
        {
          title: "Algoritmo Arriero",
          desc: "Combinamos IA de última geração con a sabedoria ancestral das montanhas.",
          icon: "mountain"
        }
      ]
    },
    discovery: [
      { title: "Jardim", subtitle: "Auditoria Cafeeira", image: "https://images.unsplash.com/photo-1596570073289-535359b85642" },
      { title: "Guatapé", subtitle: "Rota de Represas", image: "https://images.unsplash.com/photo-1599140849279-101442488c2f" },
      { title: "Jericó", subtitle: "Patrimônio Táctico", image: "https://images.unsplash.com/photo-1624647900726-24845564c785" }
    ],
    placeCard: {
      tabs: {
        logistica: "LOGÍSTICA",
        economia: "ECONOMIA",
        aventura: "AVENTURA"
      },
      logisticsTitle: "MOBILIDADE E ACESSO",
      packingTitle: "EQUIPAMENTO RECOMENDADO",
      bankTitle: "NÓS FINANCEIROS",
      calcTitle: "PROJEÇÃO DE GASTOS",
      supermarketsTitle: "ESTATÍSTICA DE PREÇOS",
      itineraryTitle: "ROTEIRO TÁCTICO",
      secretsTitle: "INTELIGÊNCIA LOCAL",
      sourcesTitle: "FONTES AUDITADAS",
      buses: "FREQUÊNCIA",
      departure: "DESLOCAMENTO DE",
      travellers: "VIAJANTES",
      mealsPerDay: "RAÇÕES/DIA",
      foodRecs: "GASTRONOMIA DE CAMPO",
      totalEstimated: "CUSTO OPERATIVO ESTIMADO",
      budgetBreakdown: {
        transport: "Mobilidade",
        food: "Suprimentos",
        stay: "Hospedagem"
      },
      btnItinerary: "GERAR PLANO IA",
      btnTips: "REVELAR SEGREDOS",
      itineraryNote: "Otimizado pelo motor Arriero Pro.",
      locationTerminal: "Localização do Terminal",
      locationDestino: "Localização do Destino",
      cashNote: "Dados verificados. O dinheiro vivo é indispensável neste setor.",
      paymentNote: "ESTABELECIMENTOS GRANDES: DIGITAL. RURAL: DINHEIRO E QR BANCOLOMBIA."
    },
    mapLabels: {
      section: "INTELIGENCIA TERRITORIAL",
      subtitle: "Auditoria das 9 sub-regiões de Antioquia",
      tag: "SETOR ESTRATÉGICO",
      census: "COBERTURA DE CAMPO",
      pulse: "PULSO LOCAL",
      treasures: "TESOUROS INDEXADOS",
      exploreBtn: "DESPLEGAR RELATÓRIO",
      impulsar: "APOIAR ESTE PROJETO"
    },
    navigation: {
      accessibility: "Modo Táctico",
      reset: "Nova Auditoria"
    },
    footer: {
      quote: "Transformando a informação em soberania económica para nossas montanhas.",
      network: "Rede de Aliados",
      verification: "Estado del Sistema",
      contact: "Link Direto",
      v1: "Logística Indexada",
      v2: "Segurança Verificada",
      terms: "Regras de Campo",
      privacy: "Protección de Datos",
      copy: "© Arriero Pro. Feito con vontade arriera."
    },
    payment: {
      floatingBtn: "APOIAR PROJETO",
      modalTitle: "CONTRIBUIÇÃO VOLUNTÁRIA",
      modalSubtitle: "Seu apoio financeiro direto permite que o Arriero Pro continue auditando o território de forma independente. Cada contribuição impulsiona nossa infraestrutura de dados soberanos.",
      nequi: "Nequi / Daviplata",
      bancolombia: "QR Bancolombia",
      card: "Transferência Digital",
      scanTitle: "APOIAR ESTA MISSÃO",
      scanSubtitle: "Sua contribuição mantém viva a auditoria territorial.",
      confirm: "VOLTAR AO CAMPO",
      back: "ALTERAR MÉTODO",
      secureNote: "Sua contribuição financia a soberania de dados em Antioquia.",
      hint: "Deseja apoiar este projeto?",
      syncing: "CONECTANDO GATEWAY...",
      mainBtn: "APOIAR PROJETO"
    }
  }
};
