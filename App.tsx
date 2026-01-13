
import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Accessibility, ArrowLeft, Radio, TrendingUp, Sparkles, Heart, Compass, Trophy, MessageSquare, Map as MapIcon, Info, ShieldCheck, Bus, Target, Globe, HeartHandshake, Eye, Code2, Cpu, Sun, Moon, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { AppState, PlaceData, ChallengeData } from './types';
import { searchUnified } from './services/geminiService';
import { PaisaLogo } from './components/atoms/PaisaLogo';
import { PlaceCard } from './components/PlaceCard';
import { Footer } from './components/organisms/Footer';
import { DiscoveryCard } from './components/molecules/DiscoveryCard';
import { HorizontalCarousel } from './components/molecules/HorizontalCarousel';
import { SectionHeader } from './components/molecules/SectionHeader';
import { EpicAntioquiaMap } from './components/molecules/EpicAntioquiaMap';
import { CultureCard } from './components/molecules/CultureCard';
import { ChallengeCard } from './components/molecules/ChallengeCard';
import { Navigation } from './components/organisms/Navigation';
import { getLocalPlace } from './services/logisticsService';

const DICHOS_PAISAS = [
  { word: "¡Eh Ave María!", meaning: "Expresión máxima de asombro, alegría o frustración." },
  { word: "Berraquera", meaning: "Cualidad de ser valiente, emprendedor y echado pa' lante." },
  { word: "Parce", meaning: "Amigo cercano, compañero de aventuras." },
  { word: "Mijo / Mija", meaning: "Trato cariñoso derivado de 'mi hijo', usado con todos." },
  { word: "¡Qué charro!", meaning: "Algo que resulta muy gracioso o divertido." }
];

const MISIONES: ChallengeData[] = [
  { titulo: "El Catador", mision: "Prueba un café de origen en 3 pueblos diferentes.", dificultad: "Fácil", recompensa: "Insignia Cafetera", completado: false },
  { titulo: "Pata de Perro", mision: "Visita un municipio de cada una de las 9 subregiones.", dificultad: "Arriero", recompensa: "Trofeo Legendario", completado: false },
  { titulo: "Escalador", mision: "Sube los 740 escalones de la Piedra del Peñol.", dificultad: "Media", recompensa: "Pulmón de Acero", completado: false }
];

const DISCOVERY_ITEMS = [
  { title: "Suroeste", subtitle: "Café y Tradición", image: "https://images.unsplash.com/photo-1599140849279-101442488c2f" },
  { title: "Oriente", subtitle: "Aguas y Zócalos", image: "https://images.unsplash.com/photo-1591143831388-75095d3a958a" },
  { title: "Occidente", subtitle: "Historia y Sol", image: "https://images.unsplash.com/photo-1590487988256-9ed24133863e" },
  { title: "Norte", subtitle: "Ruta de la Leche", image: "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59" }
];

const TRUST_CARDS = [
  { 
    icon: Target, 
    title: "Misión Táctica", 
    text: "Descentralizamos el turismo para que el dinero llegue a los pueblos que nadie visita.",
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  { 
    icon: Globe, 
    title: "Indexación Real", 
    text: "No usamos folletos viejos. Nuestra IA cruza reportes de redes y tránsito en vivo.",
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  { 
    icon: HeartHandshake, 
    title: "Comunidad Viva", 
    text: "Somos un equipo de arrieros digitales comprometidos con el desarrollo local.",
    color: "text-paisa-gold",
    bg: "bg-amber-50"
  }
];

export default function App() {
  const [state, setState] = useState<AppState & { favorites: string[] }>({
    busqueda: '', cargando: false, error: null, tarjeta: null,
    unifiedResults: [], language: 'es', activeTab: 'home',
    accessibilityMode: false,
    favorites: JSON.parse(localStorage.getItem('paisa_favs') || '[]')
  });

  const [showFavorites, setShowFavorites] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  
  // Live API Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  useEffect(() => {
    localStorage.setItem('paisa_favs', JSON.stringify(state.favorites));
  }, [state.favorites]);

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
              const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
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
              const binary = atob(audioData);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
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
          systemInstruction: 'Sos el Arriero Loco, un guía antioqueño legendario. Hablás con dichos paisas, sos muy servicial y conocés cada rincón de los 125 municipios de Antioquia. Tu misión es dar consejos tácticos de viaje.'
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

  return (
    <div className={`min-h-screen transition-colors duration-500 flex flex-col ${state.accessibilityMode ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Header Section */}
      <header className="p-8 max-w-7xl mx-auto w-full flex justify-between items-center relative z-50">
        <PaisaLogo isDark={state.accessibilityMode} className="scale-100" onClick={handleReset} />
        <div className="flex items-center gap-6">
           {(state.unifiedResults.length > 0 || showFavorites) && (
             <button onClick={handleReset} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">
                <ArrowLeft size={16} /> VOLVER
             </button>
           )}
           
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
                    <h2 className="text-4xl font-black uppercase tracking-tight text-slate-900">No tenés parches guardados</h2>
                    <p className="text-xl font-serif italic text-slate-500">Mijo, explorá los pueblos y dales amor para verlos aquí.</p>
                  </div>
                  <button onClick={() => setShowFavorites(false)} className="px-10 py-5 bg-paisa-emerald text-white rounded-full font-black uppercase text-[11px] tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl">
                    Empezar a explorar
                  </button>
                </div>
              ) : (
                <>
                  {/* HERO SECTION */}
                  <div className="text-center space-y-12">
                    <div className="space-y-8">
                      <h1 className={`text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] ${state.accessibilityMode ? 'text-white' : 'text-slate-900'}`}>
                        ANTIOQUIA <br /> <span className={state.accessibilityMode ? 'text-paisa-gold' : 'text-paisa-emerald'}>TE ESPERA</span>
                      </h1>
                      
                      <div className="max-w-3xl mx-auto space-y-6">
                        <p className="text-2xl md:text-3xl font-serif italic text-slate-500 leading-relaxed px-4">
                          "Indexamos en tiempo real los 125 municipios de Antioquia para que explorés con datos reales, itinerarios con IA y la sabiduría de los locales."
                        </p>
                        
                        <div className="flex flex-wrap justify-center items-center gap-8 pt-4">
                          <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-400">
                            <Bus size={18} className="text-paisa-emerald" /> PRECIOS DE BUS
                          </div>
                          <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-400">
                            <ShieldCheck size={18} className="text-paisa-emerald" /> ESTADO DE VÍAS
                          </div>
                          <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-400">
                            <Sparkles size={18} className="text-paisa-emerald" /> ITINERARIOS IA
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative max-w-2xl mx-auto px-4">
                      <input 
                        type="text"
                        placeholder="¿A qué pueblo vamos, mijo? (Ej: Urrao, Jardín...)"
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
                        Indexar
                      </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 opacity-40">
                      {['Urrao 2025', 'Jericó hoy', 'Guatapé precios'].map(tag => (
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
                             <span className="text-[12px] font-black uppercase tracking-[0.4em] text-paisa-emerald">Transparencia Total</span>
                          </div>
                          <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-slate-900">
                            TECNOLOGÍA PARA <br /> <span className="text-paisa-gold">VIAJEROS CONSCIENTES</span>
                          </h2>
                          <p className="text-2xl text-slate-500 font-serif italic leading-relaxed">
                            Paisa Local Pro nació como un proyecto de impacto social. No somos una agencia de viajes; somos una herramienta tecnológica que conecta la sabiduría arriera con el poder de la Inteligencia Artificial.
                          </p>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                           {TRUST_CARDS.map((card, i) => (
                             <motion.div 
                               key={i}
                               whileHover={{ x: 10 }}
                               className={`p-10 rounded-[48px] ${card.bg} border border-current/5 flex items-start gap-8 shadow-sm`}
                             >
                               <div className={`p-5 rounded-2xl bg-white shadow-md ${card.color}`}>
                                  <card.icon size={28} />
                               </div>
                               <div className="space-y-2">
                                  <h4 className={`text-xl font-black uppercase tracking-tight ${card.color}`}>{card.title}</h4>
                                  <p className="text-base font-medium text-slate-600 leading-relaxed">{card.text}</p>
                               </div>
                             </motion.div>
                           ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-10">
                    <SectionHeader title="Explorar" subtitle="Descubre Antioquia por subregiones y tesoros locales." icon={Compass} />
                    <HorizontalCarousel>
                      {DISCOVERY_ITEMS.map((item, i) => (
                        <DiscoveryCard key={i} title={item.title} subtitle={item.subtitle} image={item.image} onClick={() => { setState(s => ({...s, busqueda: item.title})); handleSearch(item.title); }} />
                      ))}
                    </HorizontalCarousel>
                  </section>

                  <section className="space-y-10">
                    <EpicAntioquiaMap lang={state.language} onSelectRegion={(name) => { setState(s => ({...s, busqueda: name})); handleSearch(name); }} />
                  </section>

                  <section className="space-y-10">
                    <SectionHeader title="Dichos" subtitle="Aprende a hablar como un arriero auténtico." icon={MessageSquare} />
                    <HorizontalCarousel>
                      {DICHOS_PAISAS.map((dicho, i) => (
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
                       <h2 className="text-5xl font-black uppercase tracking-tighter">Tus Parches Guardados</h2>
                    </div>
                    <p className="text-slate-400 font-serif italic text-2xl">"Mijo, aquí tenés los tesoros que más te han gustado."</p>
                 </div>
               )}

               {displayedResults.map((item, i) => (
                 <PlaceCard 
                   key={i} 
                   data={item as any} 
                   lang={state.language} 
                   i18n={{}} 
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
              <p className="text-2xl font-black uppercase tracking-tighter">Indexando el Destino</p>
              <p className="text-lg font-serif italic opacity-60">Consultando Unsplash, Pexels e Invías para datos reales...</p>
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
        label={isLiveActive ? "Escuchando..." : "Arriero Loco"}
      />

      <Footer isDark={state.accessibilityMode} />
    </div>
  );
}
