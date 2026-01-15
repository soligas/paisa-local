
import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, ArrowLeft, Heart, Compass, MessageSquare, Map as MapIcon, Target, ShieldCheck, Zap, Sun, Globe, Activity, TrendingUp, Sparkles, Navigation, CheckCircle2, Truck, Users, Coffee } from 'lucide-react';
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
import { Navigation as AppNavigation } from './components/organisms/Navigation';
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
    heroSubtitle: "ARRIERO PRO",
    heroDescription: "Indexamos en tiempo real los 125 municipios. Somos Arriero Pro: inteligencia táctica, datos de campo y la berraquera del campo.",
    searchPlaceholder: "¿Qué pueblo buscamos, mijo?",
    searchBtn: "BUSCAR",
    backBtn: "VOLVER",
    exploreTitle: "Explorar",
    exploreSubtitle: "Subregiones y tesoros locales.",
    offerTitle: "PROPUESTA TÁCTICA",
    offerSubtitle: "Lo que nos hace el concierge definitivo de la región.",
    dichosTitle: "Dichos",
    dichosSubtitle: "Hablá como un arriero auténtico.",
    indexing: "Buscando Destino",
    indexingMijo: ["Consultando datos tácticos...", "Rastreando precios...", "Verificando vías...", "Preguntándole a los arrieros..."],
    listening: "Escuchando...",
    arrieroLoco: "Arriero Pro",
    favoritesTitle: "Tus Tesoros",
    systemInstruction: "Eres el Arriero Pro, el guía definitivo de Antioquia. No eres un bot, eres un guía experto que usa lenguaje paisa pero con una precisión técnica absoluta. Ayudas al usuario a descubrir pueblos usando datos reales.",
    pulseTitle: "PULSO REGIONAL",
    pulseItems: ["Vía al Suroeste: Despejada 🟢", "Clima en Jardín: 22°C Soleado ☀️", "Túnel de Oriente: Operando ✅"],
    stats: [{ label: "Municipios", value: "125" }, { label: "Impacto Local", value: "100%" }, { label: "IA Táctica", value: "Realtime" }],
    offerCards: [
      { icon: Target, title: "Inteligencia Real", desc: "No usamos datos obsoletos. Consultamos en vivo precios de buses, hoteles y clima." },
      { icon: Truck, title: "Logística de Campo", desc: "Sabemos de dónde salen los buses, cuánto valen y qué terminal te queda más cerca." },
      { icon: Coffee, title: "Cultura Auténtica", desc: "Te enseñamos a hablar como un local y a encontrar los charcos que no salen en buscadores." },
      { icon: ShieldCheck, title: "Impacto Social", desc: "Nuestras recomendaciones priorizan al campesino y al pequeño emprendedor local." }
    ]
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
    dichosTitle: "Sayings",
    dichosSubtitle: "Speak like a true local.",
    indexing: "Searching...",
    indexingMijo: ["Consulting tactical data...", "Tracking prices...", "Checking roads...", "Asking locals..."],
    listening: "Listening...",
    arrieroLoco: "Arriero Pro",
    favoritesTitle: "Your Treasures",
    systemInstruction: "You are Arriero Pro, the ultimate guide to Antioquia. You are an expert guide who uses local 'Paisa' terms but with absolute technical precision.",
    pulseTitle: "REGIONAL PULSE",
    pulseItems: ["Southwest Road: Clear 🟢", "Jardin Weather: 72°F Sunny ☀️", "East Tunnel: Operating ✅"],
    stats: [{ label: "Towns", value: "125" }, { label: "Local Impact", value: "100%" }, { label: "Tactical AI", value: "Realtime" }],
    offerCards: [
      { icon: Target, title: "Real-time Intel", desc: "We don't use old data. We live-check bus prices, hotels, and current weather." },
      { icon: Truck, title: "Field Logistics", desc: "We know where buses leave from, their cost, and which terminal is best for you." },
      { icon: Coffee, title: "Authentic Culture", desc: "We teach you local slang and help you find the spots others don't know." },
      { icon: ShieldCheck, title: "Social Impact", desc: "Our recommendations prioritize local farmers and small regional businesses." }
    ]
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
    dichosTitle: "Ditados",
    dichosSubtitle: "Fale como um arriero autêntico.",
    indexing: "Buscando Destino",
    indexingMijo: ["Consultando dados táticos...", "Rastreando preços...", "Verificando vias...", "Perguntando aos arrieros..."],
    listening: "Ouvindo...",
    arrieroLoco: "Arriero Pro",
    favoritesTitle: "Seus Tesouros",
    systemInstruction: "Você é o Arriero Pro, o guia definitivo de Antioquia. Você é um guia especializado que usa termos locais 'Paisa', mas com absoluta precisão técnica.",
    pulseTitle: "PULSO REGIONAL",
    pulseItems: ["Via ao Sudoeste: Liberada 🟢", "Clima em Jardín: 22°C Ensolarado ☀️", "Túnel do Oriente: Operando ✅"],
    stats: [{ label: "Municípios", value: "125" }, { label: "Impacto Local", value: "100%" }, { label: "IA Tática", value: "Tempo Real" }],
    offerCards: [
      { icon: Target, title: "Inteligência Real", desc: "Não usamos dados antigos. Consultamos ao vivo preços de ônibus, hotéis e clima." },
      { icon: Truck, title: "Logística de Campo", desc: "Sabemos de onde saem os ônibus, quanto custam e qual terminal é melhor para você." },
      { icon: Coffee, title: "Cultura Autêntica", desc: "Ensinamos você a falar como um local e a encontrar os lugares que outros não conhecem." },
      { icon: ShieldCheck, title: "Impacto Social", desc: "Nossas recomendações priorizam o produtor rural e o pequeno empreendedor local." }
    ]
  }
};

export function App() {
  const [state, setState] = useState<AppState & { favorites: string[] }>({
    busqueda: '', cargando: false, error: null, tarjeta: null,
    unifiedResults: [], language: 'es', activeTab: 'home',
    accessibilityMode: false,
    favorites: JSON.parse(localStorage.getItem('arriero_pro_favs') || '[]')
  });

  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  
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
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
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
          },
          onclose: () => setIsLiveActive(false),
          onerror: () => setIsLiveActive(false)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: t.systemInstruction
        }
      });
      activeSessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (q?: string) => {
    const query = q || state.busqueda;
    if (!query) return;
    setState(s => ({ ...s, cargando: true, error: null, activeTab: 'explore', busqueda: query }));
    try {
      const results = await searchUnified(query, state.language);
      setState(s => ({ ...s, unifiedResults: results, cargando: false }));
    } catch (err) {
      setState(s => ({ ...s, cargando: false, error: "Error de red." }));
    }
  };

  const handleReset = () => {
    setState(s => ({ ...s, unifiedResults: [], busqueda: '', activeTab: 'home' }));
    setShowFavorites(false);
  };

  const displayedResults = showFavorites 
    ? (state.favorites.map(title => getLocalPlace(title)).filter(p => p !== null) as PlaceData[])
    : state.unifiedResults;

  return (
    <div className={`min-h-screen flex flex-col bg-[#FDFDFD] text-slate-900 font-sans transition-all duration-500 ${state.accessibilityMode ? 'accessibility-mode grayscale' : ''}`}>
      <div className="bg-[#1A242F] text-white py-2 overflow-hidden border-b border-white/5 relative z-[1001]">
         <div className="flex items-center whitespace-nowrap animate-shimmer-fast gap-12 px-8">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-paisa-gold flex items-center gap-2">
              <Activity size={12} /> {t.pulseTitle}
            </span>
            {(t.pulseItems || []).map((item: string, i: number) => (
              <span key={i} className="text-[10px] font-bold uppercase tracking-widest opacity-60 flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-paisa-emerald" /> {item}
              </span>
            ))}
         </div>
      </div>

      <header className="sticky top-0 p-4 md:p-8 max-w-7xl mx-auto w-full flex justify-between items-center z-[1000] bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
        <PaisaLogo onClick={handleReset} className="scale-75 md:scale-100 origin-left" />
        <div className="flex items-center gap-2 md:gap-4">
           <div className="hidden lg:flex bg-white rounded-full border border-slate-100 p-1.5 shadow-sm">
              {(['home', 'explore'] as AppTab[]).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setState(s => ({...s, activeTab: tab}))}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${state.activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab}
                </button>
              ))}
           </div>
           <button onClick={() => setShowFavorites(!showFavorites)} className={`p-3 md:p-3.5 rounded-full border transition-all ${showFavorites ? 'bg-red-500 text-white border-red-500 shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-red-100'}`}>
             <Heart size={20} fill={showFavorites ? "white" : "none"} />
           </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8">
        <AnimatePresence mode="wait">
          {state.activeTab === 'home' && !state.cargando && (
             <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-24 md:space-y-48 py-12 md:py-24">
                <div className="text-center space-y-16">
                  <div className="space-y-8 px-4">
                    <div className="flex justify-center">
                       <div className="px-6 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-paisa-emerald text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3">
                         <TrendingUp size={14} /> REGIONAL GUIDE
                       </div>
                    </div>
                    <h1 className="text-7xl sm:text-8xl md:text-[11rem] font-black uppercase tracking-tighter leading-[0.8] text-slate-950">
                      {t.heroTitle} <br /> <span className="text-paisa-emerald">{t.heroSubtitle}</span>
                    </h1>
                    <p className="text-xl md:text-3xl font-serif italic text-slate-600 max-w-4xl mx-auto drop-shadow-sm">"{t.heroDescription}"</p>
                  </div>

                  <div className="relative max-w-4xl mx-auto px-4 pt-4 space-y-8">
                     <div className="flex flex-col md:flex-row gap-4">
                       <input 
                         type="text" placeholder={t.searchPlaceholder}
                         className="w-full p-6 md:p-12 rounded-3xl md:rounded-[48px] text-lg md:text-3xl outline-none border-2 border-slate-200 shadow-2xl focus:border-paisa-emerald bg-white transition-all font-medium"
                         value={state.busqueda} onChange={e => setState(s => ({...s, busqueda: e.target.value}))}
                         onKeyDown={e => e.key === 'Enter' && handleSearch()}
                       />
                       <button onClick={() => handleSearch()} className="w-full md:w-auto p-6 md:px-14 rounded-3xl md:rounded-[40px] bg-paisa-emerald text-white font-black uppercase tracking-widest shadow-2xl hover:brightness-110 active:scale-95 text-xl flex items-center justify-center gap-4 transition-all">
                         <Search size={28} />
                         <span>{t.searchBtn}</span>
                       </button>
                     </div>
                  </div>
                </div>

                {/* NUEVA SECCIÓN: PROPUESTA TÁCTICA (QUÉ OFRECEMOS) */}
                <section className="px-4">
                   <SectionHeader title={t.offerTitle} subtitle={t.offerSubtitle} icon={ShieldCheck} />
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {(t.offerCards || []).map((card: any, i: number) => (
                        <motion.div 
                          key={i} whileHover={{ y: -10 }}
                          className="p-10 rounded-[48px] bg-white border border-slate-100 shadow-xl space-y-6 group hover:border-paisa-emerald transition-all"
                        >
                           <div className="w-16 h-16 rounded-[24px] bg-slate-50 text-paisa-emerald flex items-center justify-center group-hover:bg-paisa-emerald group-hover:text-white transition-all">
                              <card.icon size={32} />
                           </div>
                           <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">{card.title}</h4>
                           <p className="text-slate-500 font-serif italic text-lg leading-relaxed">"{card.desc}"</p>
                        </motion.div>
                      ))}
                   </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-12 px-8">
                   {(t.stats || []).map((stat: any, i: number) => (
                     <div key={i} className="flex flex-col items-center text-center space-y-4 group">
                        <div className="text-7xl md:text-8xl font-black text-slate-950 tracking-tighter group-hover:text-paisa-emerald transition-colors">{stat.value}</div>
                        <div className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-300">{stat.label}</div>
                     </div>
                   ))}
                </section>

                <section>
                  <SectionHeader title={t.exploreTitle} subtitle={t.exploreSubtitle} icon={Compass} />
                  <HorizontalCarousel>
                    {(t.discovery || []).map((item: any, idx: number) => (
                      <DiscoveryCard key={idx} title={item.title} subtitle={item.subtitle} image={item.image} onClick={() => handleSearch(item.title)} />
                    ))}
                  </HorizontalCarousel>
                </section>

                <EpicAntioquiaMap onSelectRegion={handleSearch} lang={state.language} />
             </motion.div>
          )}

          {state.activeTab === 'explore' && !state.cargando && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 py-12 md:py-20">
               <div className="space-y-4 px-4">
                  <button onClick={handleReset} className="flex items-center gap-3 text-paisa-emerald font-black uppercase text-[12px] tracking-widest hover:translate-x-[-4px] transition-transform">
                     <ArrowLeft size={20} /> {t.backBtn}
                  </button>
                  <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-slate-950">
                    {showFavorites ? t.favoritesTitle : `${t.exploreTitle}: ${state.busqueda}`}
                  </h2>
               </div>
               <div className="space-y-16">
                  {displayedResults.map((item, i) => (
                    <PlaceCard 
                      key={i} 
                      data={item} 
                      lang={state.language} 
                      i18n={t.placeCard || {}} 
                      isFavorite={state.favorites.includes(item.titulo)} 
                      onToggleFavorite={(title) => {
                        const newFavs = state.favorites.includes(title) 
                          ? state.favorites.filter(f => f !== title) 
                          : [...state.favorites, title];
                        setState(s => ({ ...s, favorites: newFavs }));
                        localStorage.setItem('arriero_pro_favs', JSON.stringify(newFavs));
                      }} 
                    />
                  ))}
               </div>
            </motion.div>
          )}

          {state.cargando && (
            <div key="loading" className="flex flex-col items-center justify-center py-40 gap-8">
               <Loader2 className="animate-spin text-paisa-emerald" size={100} strokeWidth={1.5} />
               <div className="text-center space-y-4">
                  <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-950">{t.indexing}</h3>
                  <AnimatePresence mode="wait">
                    <motion.p key={loadingMsgIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-2xl md:text-3xl font-serif italic text-slate-500">
                      {t.indexingMijo?.[loadingMsgIdx] || "Consultando..."}
                    </motion.p>
                  </AnimatePresence>
               </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <AppNavigation 
        onReset={handleReset} 
        isLiveActive={isLiveActive} 
        onLiveToggle={toggleLive} 
        hasResults={state.unifiedResults.length > 0} 
        label={isLiveActive ? t.listening : t.arrieroLoco}
        currentLang={state.language}
        onLangChange={(l) => setState(s => ({...s, language: l}))}
        isAccessibilityActive={state.accessibilityMode}
        onAccessibilityToggle={() => setState(s => ({...s, accessibilityMode: !s.accessibilityMode}))}
      />
      <Footer />
    </div>
  );
}
