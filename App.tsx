
import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, ArrowLeft, Heart, Compass, MessageSquare, Map as MapIcon, Target, Database, HeartHandshake, Zap, Sun, Info, Globe, ShieldCheck, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { AppState, PlaceData, SupportedLang, AppTab } from './types';
import { searchUnified } from './services/geminiService';
import { PaisaLogo } from './components/atoms/PaisaLogo';
import { Badge } from './components/atoms/Badge';
import { PlaceCard } from './components/PlaceCard';
import { Footer } from './components/organisms/Footer';
import { DiscoveryCard } from './components/molecules/DiscoveryCard';
import { HorizontalCarousel } from './components/molecules/HorizontalCarousel';
import { SectionHeader } from './components/molecules/SectionHeader';
import { EpicAntioquiaMap } from './components/molecules/EpicAntioquiaMap';
import { CultureCard } from './components/molecules/CultureCard';
import { Navigation } from './components/organisms/Navigation';
import { BlobManager } from './components/BlobManager';
import { getLocalPlace } from './services/logisticsService';

function encodeAudio(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function decodeAudio(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

const TRANSLATIONS: Record<SupportedLang, any> = {
  es: {
    heroTitle: "ANTIOQUIA",
    heroSubtitle: "TE ESPERA",
    heroDescription: "Indexamos en tiempo real los 125 municipios para que explorés con datos reales, itinerarios con IA y la sabiduría de los locales.",
    searchPlaceholder: "¿Qué pueblo buscamos, mijo?",
    searchBtn: "Indexar",
    backBtn: "VOLVER",
    exploreTitle: "Explorar",
    exploreSubtitle: "Subregiones y tesoros locales.",
    dichosTitle: "Dichos",
    dichosSubtitle: "Hablá como un arriero auténtico.",
    pulseTitle: "Pulso Social",
    pulseSubtitle: "Tendencias en las montañas.",
    indexing: "Indexando Destino",
    indexingMijo: [
      "Consultando datos tácticos...",
      "Rastreando precios de pasajes...",
      "Verificando estado de la vía...",
      "Buscando fotos en la bodega...",
      "Preguntándole a los arrieros...",
      "Calculando el presupuesto...",
      "Afinando los zócalos..."
    ],
    listening: "Hablando...",
    arrieroLoco: "Arriero Loco",
    favoritesTitle: "Tus Tesoros",
    stats: [
      { label: "Municipios", value: "125" },
      { label: "Rutas", value: "100%" },
      { label: "IA", value: "+10k" }
    ],
    aboutTitle: "Turismo con Alma",
    aboutSubtitle: "Impacto Real",
    aboutDescription: "Cada búsqueda impulsa el comercio local y la visibilidad de los pueblos más recónditos.",
    placeCard: {
      weather: "Clima",
      accessibility: "Accesibilidad",
      itineraryIA: "Itinerario IA",
      quickMap: "Mapa Real",
      quickVideo: "Video Guía",
      quickFood: "Comida",
      quickSocial: "Red Social",
      sourcesTitle: "Fuentes Consultadas",
      budgetTitle: "Presupuesto",
      busTicket: "Pasaje Bus",
      meal: "Almuerzo",
      departurePoint: "Sale de",
      arrieroGuide: "Guía del Arriero"
    },
    discovery: [
      { title: "Jardín", subtitle: "Color y Café", image: "https://images.unsplash.com/photo-1596570073289-535359b85642" },
      { title: "Guatapé", subtitle: "Zócalos y Embalse", image: "https://images.unsplash.com/photo-1599140849279-101442488c2f" },
      { title: "Jericó", subtitle: "Cultura y Carrieles", image: "https://images.unsplash.com/photo-1624647900726-24845564c785" }
    ],
    dichos: [
      { word: "Mijo", meaning: "Abreviación de 'mi hijo', término de cariño." },
      { word: "Berraquera", meaning: "Algo excelente, valiente o extraordinario." },
      { word: "Avemaría", meaning: "Expresión de asombro o alegría." }
    ],
    howItWorks: [
      { icon: Zap, title: "IA Táctica", desc: "Datos actualizados en milisegundos." },
      { icon: HeartHandshake, title: "Social", desc: "Conectamos con la gente del pueblo." },
      { icon: ShieldCheck, title: "Seguro", desc: "Rutas verificadas por la comunidad." }
    ]
  },
  en: {
    heroTitle: "ANTIOQUIA",
    heroSubtitle: "AWAITS YOU",
    heroDescription: "Real-time indexing of all 125 towns. Explore with tactical data, AI itineraries, and local wisdom.",
    searchPlaceholder: "Which town are we looking for?",
    searchBtn: "Index",
    backBtn: "BACK",
    exploreTitle: "Explore",
    exploreSubtitle: "Subregions and local treasures.",
    dichosTitle: "Sayings",
    dichosSubtitle: "Speak like a true highlander.",
    indexing: "Indexing Destination",
    indexingMijo: ["Tactical data...", "Price checking...", "Road status...", "Photos..."],
    listening: "Listening...",
    arrieroLoco: "Crazy Arriero",
    favoritesTitle: "Your Treasures",
    stats: [{ label: "Towns", value: "125" }, { label: "Routes", value: "100%" }, { label: "IA", value: "+10k" }],
    placeCard: {
      weather: "Weather",
      accessibility: "Accessibility",
      itineraryIA: "AI Itinerary",
      quickMap: "Live Map",
      quickVideo: "Video Guide",
      quickFood: "Food",
      quickSocial: "Social",
      sourcesTitle: "Sources",
      budgetTitle: "Budget",
      busTicket: "Bus Ticket",
      meal: "Meal",
      departurePoint: "Departs from",
      arrieroGuide: "Highlander's Guide"
    }
  },
  pt: {
    heroTitle: "ANTIOQUIA",
    heroSubtitle: "TE ESPERA",
    heroDescription: "Indexação em tempo real de 125 municípios. Explore com dados táticos e sabedoria local.",
    searchPlaceholder: "Qual cidade estamos procurando?",
    searchBtn: "Indexar",
    backBtn: "VOLTAR",
    exploreTitle: "Explorar",
    exploreSubtitle: "Sub-regiões e tesouros locais.",
    indexing: "Indexando Destino",
    indexingMijo: ["Dados táticos...", "Preços...", "Estradas...", "Fotos..."],
    listening: "Falando...",
    arrieroLoco: "Arriero Louco",
    favoritesTitle: "Seus Tesouros",
    stats: [{ label: "Municípios", value: "125" }, { label: "Rotas", value: "100%" }, { label: "IA", value: "+10k" }],
    placeCard: {
      weather: "Clima",
      accessibility: "Acessibilidade",
      itineraryIA: "Itinerário IA",
      quickMap: "Mapa Real",
      quickVideo: "Guia de Vídeo",
      quickFood: "Comida",
      quickSocial: "Social",
      sourcesTitle: "Fontes",
      budgetTitle: "Orçamento",
      busTicket: "Passagem",
      meal: "Refeição",
      departurePoint: "Saída de",
      arrieroGuide: "Guia do Arriero"
    }
  }
};

export function App() {
  const [state, setState] = useState<AppState & { favorites: string[] }>({
    busqueda: '', cargando: false, error: null, tarjeta: null,
    unifiedResults: [], language: 'es', activeTab: 'home',
    accessibilityMode: false,
    favorites: JSON.parse(localStorage.getItem('paisa_favs') || '[]')
  });

  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [showBlobManager, setShowBlobManager] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const activeSessionRef = useRef<any>(null);

  const t = TRANSLATIONS[state.language] || TRANSLATIONS.es;

  useEffect(() => {
    let interval: any;
    if (state.cargando) {
      interval = setInterval(() => {
        setLoadingMsgIdx(prev => (prev + 1) % (t.indexingMijo?.length || 1));
      }, 1500);
    } else {
      setLoadingMsgIdx(0);
    }
    return () => clearInterval(interval);
  }, [state.cargando, t.indexingMijo]);

  const toggleLive = async () => {
    if (isLiveActive) {
      if (activeSessionRef.current) activeSessionRef.current.close();
      setIsLiveActive(false);
      return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    audioContextRef.current = outputCtx;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: { data: encodeAudio(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioBase64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioBase64) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decodeAudio(audioBase64), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
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
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: 'Eres el Arriero Loco de Antioquia. Eres muy amable, servicial y conoces cada rincón de los 125 municipios. Hablas con jerga paisa ligera ("mijo", "avemaría", "berraquera"). Ayuda al usuario a planear su viaje por Antioquia.'
        }
      });
      activeSessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Error iniciando Live API:", err);
    }
  };

  const handleSearch = async (q?: string) => {
    const query = q || state.busqueda;
    if (!query) return;
    setState(s => ({ ...s, cargando: true, error: null, activeTab: 'explore' }));
    setShowFavorites(false);
    try {
      const results = await searchUnified(query, state.language);
      setState(s => ({ ...s, unifiedResults: results, cargando: false }));
    } catch (err) {
      setState(s => ({ ...s, cargando: false, error: "Error de red táctica." }));
    }
  };

  const handleReset = () => {
    setState(s => ({ ...s, unifiedResults: [], busqueda: '', activeTab: 'home' }));
    setShowFavorites(false);
  };

  const handleLangChange = (lang: SupportedLang) => {
    setState(s => ({ ...s, language: lang }));
  };

  const handleAccessibilityToggle = () => {
    setState(s => ({ ...s, accessibilityMode: !s.accessibilityMode }));
  };

  const displayedResults = showFavorites 
    ? (state.favorites.map(title => getLocalPlace(title)).filter(p => p !== null) as PlaceData[])
    : state.unifiedResults;

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans transition-all duration-500 ${state.accessibilityMode ? 'accessibility-mode grayscale' : ''}`}>
      
      <header className="sticky top-0 p-4 md:p-8 max-w-7xl mx-auto w-full flex justify-between items-center z-[100] bg-slate-50/80 backdrop-blur-md">
        <PaisaLogo onClick={handleReset} className="scale-75 md:scale-100 origin-left" />
        <div className="flex items-center gap-2 md:gap-4">
           <button 
             onClick={() => setShowBlobManager(true)}
             className="p-3 md:p-3.5 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-paisa-emerald transition-all"
             title="Administrar Fotos"
           >
             <Database size={20} />
           </button>
           <div className="hidden lg:flex bg-white rounded-full border border-slate-100 p-1.5 shadow-sm">
              {(['home', 'explore', 'social_pulse'] as AppTab[]).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setState(s => ({...s, activeTab: tab}))}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${state.activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab.replace('_', ' ')}
                </button>
              ))}
           </div>
           <button onClick={() => setShowFavorites(!showFavorites)} className={`p-3 md:p-3.5 rounded-full border transition-all ${showFavorites ? 'bg-red-500 text-white border-red-500 shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>
             <Heart size={20} fill={showFavorites ? "white" : "none"} />
           </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8">
        <AnimatePresence mode="wait">
          {state.activeTab === 'home' && !state.cargando && (
             <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-24 md:space-y-32 py-12 md:py-20">
                <div className="text-center space-y-12 md:space-y-20">
                  <div className="space-y-6 md:space-y-8 px-4">
                    <div className="flex justify-center gap-6 md:gap-12 mb-4">
                       {(t.stats || []).map((s: any) => (
                         <div key={s.label} className="flex flex-col">
                            <span className="text-paisa-emerald text-xl md:text-2xl font-black">{s.value}</span>
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-300">{s.label}</span>
                         </div>
                       ))}
                    </div>
                    <h1 className="text-5xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] md:leading-[0.8]">
                      {t.heroTitle} <br /> <span className="text-paisa-emerald">{t.heroSubtitle}</span>
                    </h1>
                    <p className="text-lg md:text-2xl font-serif italic text-slate-500 max-w-4xl mx-auto leading-relaxed">
                      "{t.heroDescription}"
                    </p>
                  </div>

                  <div className="relative max-w-3xl mx-auto px-4 group">
                     <div className="flex flex-col md:flex-row gap-4">
                       <div className="relative flex-1">
                          <input 
                            type="text" placeholder={t.searchPlaceholder}
                            className="w-full p-6 md:p-10 rounded-3xl md:rounded-[40px] text-lg md:text-3xl outline-none border-2 border-slate-100 shadow-xl focus:border-paisa-emerald transition-all bg-white"
                            value={state.busqueda} onChange={e => setState(s => ({...s, busqueda: e.target.value}))}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                          />
                       </div>
                       <button onClick={() => handleSearch()} className="w-full md:w-auto p-6 md:px-12 rounded-3xl md:rounded-[32px] bg-paisa-emerald text-white font-black uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all">
                         {t.searchBtn}
                       </button>
                     </div>
                  </div>
                </div>

                <section className="bg-slate-900 rounded-[48px] md:rounded-[64px] p-8 md:p-20 text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-96 h-96 bg-paisa-emerald/20 blur-[100px] -mr-40 -mt-40" />
                   <div className="relative z-10 space-y-12">
                      <div className="space-y-4">
                         <span className="text-paisa-gold text-[10px] font-black uppercase tracking-[0.4em]">{t.aboutSubtitle}</span>
                         <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{t.aboutTitle}</h2>
                         <p className="text-xl md:text-2xl font-serif italic text-white/40 max-w-3xl">"{t.aboutDescription}"</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         {(t.howItWorks || []).map((step: any, idx: number) => (
                           <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-[32px] space-y-4 hover:bg-white/10 transition-colors">
                              <div className="w-12 h-12 rounded-2xl bg-paisa-gold/20 text-paisa-gold flex items-center justify-center">
                                 <step.icon size={24} />
                              </div>
                              <h4 className="text-xl font-black uppercase tracking-tight">{step.title}</h4>
                              <p className="text-sm text-white/40 leading-relaxed italic">"{step.desc}"</p>
                           </div>
                         ))}
                      </div>
                   </div>
                </section>

                <section>
                  <SectionHeader title={t.exploreTitle} subtitle={t.exploreSubtitle} icon={Compass} />
                  <HorizontalCarousel>
                    {(t.discovery || []).map((item: any, idx: number) => (
                      <DiscoveryCard key={idx} title={item.title} subtitle={item.subtitle} image={item.image} onClick={() => handleSearch(item.title)} />
                    ))}
                  </HorizontalCarousel>
                </section>

                <section className="px-4">
                   <EpicAntioquiaMap onSelectRegion={handleSearch} lang={state.language} />
                </section>

                <section>
                  <SectionHeader title={t.dichosTitle} subtitle={t.dichosSubtitle} icon={MessageSquare} />
                  <HorizontalCarousel>
                    {(t.dichos || []).map((dicho: any, idx: number) => (
                      <CultureCard key={idx} word={dicho.word} meaning={dicho.meaning} />
                    ))}
                  </HorizontalCarousel>
                </section>
             </motion.div>
          )}

          {state.activeTab === 'explore' && !state.cargando && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 md:space-y-16 py-12 md:py-20">
               <div className="space-y-4 px-4">
                  <button onClick={handleReset} className="flex items-center gap-3 text-paisa-emerald font-black uppercase text-[10px] tracking-widest hover:translate-x-[-4px] transition-transform">
                     <ArrowLeft size={16} /> {t.backBtn}
                  </button>
                  <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                    {showFavorites ? t.favoritesTitle : `${t.exploreTitle}: ${state.busqueda}`}
                  </h2>
               </div>
               <div className="space-y-12 md:space-y-16">
                  {displayedResults.map((item, i) => (
                    <PlaceCard 
                      key={i} 
                      data={item} 
                      lang={state.language} 
                      i18n={t.placeCard} 
                      isFavorite={state.favorites.includes(item.titulo)} 
                      onToggleFavorite={(title) => {
                        const newFavs = state.favorites.includes(title) 
                          ? state.favorites.filter(f => f !== title) 
                          : [...state.favorites, title];
                        setState(s => ({ ...s, favorites: newFavs }));
                        localStorage.setItem('paisa_favs', JSON.stringify(newFavs));
                      }} 
                    />
                  ))}
               </div>
            </motion.div>
          )}

          {state.cargando && (
            <div key="loading" className="flex flex-col items-center justify-center py-40 md:py-60 gap-8">
               <div className="relative">
                  <Loader2 className="animate-spin text-paisa-emerald" size={80} strokeWidth={1.5} />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-paisa-emerald/5 rounded-full blur-2xl"
                  />
               </div>
               <div className="text-center space-y-4 px-8">
                  <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">{t.indexing}</h3>
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={loadingMsgIdx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-lg md:text-2xl font-serif italic text-slate-400"
                    >
                      {t.indexingMijo?.[loadingMsgIdx] || "Consultando..."}
                    </motion.p>
                  </AnimatePresence>
               </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <Navigation 
        onReset={handleReset} 
        isLiveActive={isLiveActive} 
        onLiveToggle={toggleLive} 
        hasResults={state.unifiedResults.length > 0} 
        label={isLiveActive ? t.listening : t.arrieroLoco}
        currentLang={state.language}
        onLangChange={handleLangChange}
        isAccessibilityActive={state.accessibilityMode}
        onAccessibilityToggle={handleAccessibilityToggle}
      />

      <AnimatePresence>
        {showBlobManager && (
          <BlobManager onClose={() => setShowBlobManager(false)} />
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
}
