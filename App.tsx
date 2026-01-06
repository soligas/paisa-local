
import { 
  Trophy, Search, Loader2, Compass, Mic, MicOff, Star, 
  ChevronLeft, XCircle, ArrowRight, Languages, Database, Rocket, CheckCircle, Wifi, WifiOff, MapPin, Award, AlertCircle, Sparkles, Map, Utensils, Plane, Bus, Shield, Wallet
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, PlaceData, DishData, CultureExperience, SupportedLang, UnifiedItem } from './types';
import { 
  searchUnified, cleanString,
  connectArrieroLive, decodeAudioData, decode, getSearchSuggestions
} from './services/geminiService';
import { localData } from './data';

import { Badge } from './components/atoms/Badge';
import { PaisaLogo } from './components/atoms/PaisaLogo';
import { Navigation as MainNav } from './components/organisms/Navigation';
import { PlaceCard as PlaceDetail } from './components/PlaceCard';
import { DishCard } from './components/molecules/DishCard';
import { ExperienceCard } from './components/molecules/ExperienceCard';
import { DiscoveryCard } from './components/molecules/DiscoveryCard';
import { Footer } from './components/organisms/Footer';
import { SearchBox } from './components/SearchBox';
import { EpicAntioquiaMap } from './components/molecules/EpicAntioquiaMap';
import { SafeImage } from './components/atoms/SafeImage';

const UI_STRINGS = {
  es: {
    lvl: 'NIVEL',
    consulting: 'Consultando terminales y guías locales...',
    title: 'Universo',
    subtitle: 'Tu concierge logístico para los 125 municipios.',
    placeholder: '¿Qué pueblo, terminal o plato buscas?',
    back: 'Volver a explorar',
    trending: 'Lo que todo turista debe conocer',
    resultsFor: 'Explorando',
    listening: 'Escuchando...',
    talk: 'Hablar con Arriero',
    errorDesc: '¡Avemaría! Hubo un problema. Mostrando datos de respaldo.'
  },
  en: {
    lvl: 'LEVEL',
    consulting: 'Checking bus terminals and local guides...',
    title: 'Antioquia',
    subtitle: 'Your logistics concierge for the 125 towns.',
    placeholder: 'Search for a town, terminal or dish...',
    back: 'Back to explore',
    trending: 'Top tourist picks',
    resultsFor: 'Exploring',
    listening: 'Listening...',
    talk: 'Talk to Guide',
    errorDesc: 'Oops! Something went wrong. Showing fallback data.'
  },
  pt: {
    lvl: 'NÍVEL',
    consulting: 'Consultando terminais e guias locais...',
    title: 'Antioquia',
    subtitle: 'Seu concierge logístico para os 125 municípios.',
    placeholder: 'Procure uma vila, terminal ou prato...',
    back: 'Voltar ao mix',
    trending: 'Mais buscados',
    resultsFor: 'Explorando',
    listening: 'Ouvindo...',
    talk: 'Falar com Guia',
    errorDesc: 'Ops! Algo deu errado. Mostrando dados locais.'
  }
};

export default function App() {
  const [state, setState] = useState<AppState>({
    busqueda: '', sugerencias: [], cargando: false, buscandoSugerencias: false, error: null, tarjeta: null,
    unifiedResults: [], language: (localStorage.getItem('paisa_lang') as SupportedLang) || 'es', activeTab: 'explore', 
    favorites: JSON.parse(localStorage.getItem('paisa_favorites') || '[]'),
    foodFavorites: JSON.parse(localStorage.getItem('paisa_food_favorites') || '[]'),
    cultureFavorites: JSON.parse(localStorage.getItem('paisa_culture_favorites') || '[]'),
    visitedTowns: JSON.parse(localStorage.getItem('paisa_visited') || '[]'),
    transcription: ''
  });

  const [xp, setXp] = useState(() => Number(localStorage.getItem('paisa_xp') || 0));
  const [isLiveActive, setIsLiveActive] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const t = UI_STRINGS[state.language];

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (state.busqueda.trim().length >= 2 && !state.cargando) {
        setState(s => ({ ...s, buscandoSugerencias: true }));
        const suggestions = await getSearchSuggestions(state.busqueda);
        setState(s => ({ ...s, sugerencias: suggestions, buscandoSugerencias: false }));
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [state.busqueda]);

  const handleSearch = async (q?: string) => {
    const query = q || state.busqueda;
    if (!query) return;
    
    setState(s => ({ ...s, busqueda: query, cargando: true, error: null, sugerencias: [], tarjeta: null }));
    
    try {
      const data = await searchUnified(query, state.language);
      const exactMatch = Object.values(localData).find(p => cleanString(p.titulo) === cleanString(query));
      
      setState(s => ({ 
        ...s, 
        unifiedResults: data, 
        cargando: false,
        tarjeta: exactMatch ? (exactMatch as PlaceData) : null,
        error: data.length === 0 ? "No encontramos pistas mijo. Intente con otro nombre." : null
      }));
      
      addXP(50);
    } catch (e) { 
      setState(s => ({ ...s, cargando: false, error: t.errorDesc })); 
    }
  };

  const addXP = (amount: number) => {
    const newXP = xp + amount;
    setXp(newXP);
    localStorage.setItem('paisa_xp', String(newXP));
  };

  const resetView = () => {
    setState(s => ({...s, busqueda: '', unifiedResults: [], tarjeta: null, error: null}));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLiveToggle = async () => {
    if (isLiveActive) {
      if (liveSessionRef.current) liveSessionRef.current.close();
      setIsLiveActive(false);
      return;
    }
    try {
      if (!audioContextRef.current) audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      setIsLiveActive(true);
      const session = await connectArrieroLive(state.language, {
        onAudioChunk: async (b64: string) => {
          const buf = await decodeAudioData(decode(b64), audioContextRef.current!, 24000);
          const src = audioContextRef.current!.createBufferSource();
          src.buffer = buf;
          src.connect(audioContextRef.current!.destination);
          const start = Math.max(nextStartTimeRef.current, audioContextRef.current!.currentTime);
          src.start(start);
          nextStartTimeRef.current = start + buf.duration;
          activeSourcesRef.current.add(src);
        },
        onTranscription: (txt: string) => setState(s => ({ ...s, transcription: s.transcription + " " + txt })),
        onInterrupted: () => {
          activeSourcesRef.current.forEach(s => s.stop());
          activeSourcesRef.current.clear();
          nextStartTimeRef.current = 0;
        }
      });
      liveSessionRef.current = session;
    } catch (e) { setIsLiveActive(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-40">
      
      {/* HUD de Progreso */}
      <header className="fixed top-0 inset-x-0 z-[500] px-6 py-4 glass border-b border-slate-100 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <Trophy size={18} className="text-paisa-gold" />
            <div className="w-24 md:w-40 h-2 bg-slate-200 rounded-full overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: `${(xp % 500) / 5}%` }} className="xp-bar h-full" />
            </div>
            <span className="font-paisa text-[9px] text-paisa-emerald uppercase">{t.lvl} {Math.floor(xp/500)+1}</span>
         </div>
         <div className="flex gap-2">
           {['es', 'en', 'pt'].map(l => (
             <button key={l} onClick={() => setState(s => ({...s, language: l as SupportedLang}))} className={`w-8 h-8 rounded-full text-[10px] font-black uppercase transition-all ${state.language === l ? 'bg-paisa-emerald text-white' : 'text-slate-400'}`}>
               {l}
             </button>
           ))}
         </div>
      </header>

      <div className="pt-32 px-6 max-w-6xl mx-auto space-y-16">
        {/* Cabecera Principal y Buscador */}
        <div className="flex flex-col items-center text-center gap-10">
          <PaisaLogo onClick={resetView} className="scale-125 cursor-pointer hover:rotate-2 transition-transform" />
          <SearchBox 
            value={state.busqueda} 
            onChange={(v) => setState(s => ({...s, busqueda: v}))} 
            onSearch={handleSearch} 
            suggestions={state.sugerencias}
            placeholder={t.placeholder}
            isSearchingSuggestions={state.buscandoSugerencias}
          />
          {state.error && <div className="text-red-500 font-black uppercase text-[10px] tracking-widest bg-red-50 px-6 py-2 rounded-full border border-red-100">{state.error}</div>}
        </div>

        <AnimatePresence mode="wait">
          {state.cargando ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-40 gap-8">
               <div className="relative">
                 <Loader2 className="text-paisa-emerald animate-spin" size={64} />
                 <Sparkles className="absolute -top-4 -right-4 text-paisa-gold animate-pulse" />
               </div>
               <p className="text-2xl font-serif italic text-slate-400 animate-pulse">{t.consulting}</p>
            </motion.div>
          ) : state.tarjeta ? (
            <motion.div key="detail" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}>
               <button onClick={() => setState(s => ({ ...s, tarjeta: null }))} className="flex items-center gap-3 mb-10 px-6 py-3 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-paisa-emerald hover:shadow-xl border border-slate-100 transition-all">
                  <ChevronLeft size={16} /> {t.back}
               </button>
               <PlaceDetail 
                  data={state.tarjeta} lang={state.language} i18n={{}} 
                  isFavorite={state.favorites.includes(state.tarjeta.titulo)}
                  onToggleFavorite={(t) => setState(s => ({...s, favorites: s.favorites.includes(t) ? s.favorites.filter(f => f !== t) : [...s.favorites, t]}))}
                  isVisited={state.visitedTowns.includes(state.tarjeta.titulo)}
                  onToggleVisited={(t) => setState(s => ({...s, visitedTowns: s.visitedTowns.includes(t) ? s.visitedTowns.filter(v => v !== t) : [...s.visitedTowns, t]}))}
               />
            </motion.div>
          ) : state.unifiedResults.length > 0 ? (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
               <div className="flex items-center gap-4 text-slate-400 border-b border-slate-100 pb-6">
                  <Sparkles size={20} className="text-paisa-gold" />
                  <span className="text-sm font-black uppercase tracking-[0.2em]">{t.resultsFor}: <span className="text-paisa-emerald">"{state.busqueda}"</span></span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {state.unifiedResults.map((item, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: i * 0.1 }}
                      onClick={() => item.type === 'place' && setState(s => ({...s, tarjeta: item as PlaceData}))}
                    >
                       {item.type === 'place' ? (
                          <div className="group bg-white rounded-[48px] overflow-hidden shadow-2xl border border-slate-100 h-full cursor-pointer hover:-translate-y-3 transition-all">
                             <div className="relative aspect-video">
                                <SafeImage src={item.imagen} alt={item.titulo} className="w-full h-full" />
                                <div className="absolute top-6 left-6 flex flex-col gap-2">
                                  <Badge color="emerald">Destino</Badge>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-8 left-8">
                                  <h5 className="text-white text-4xl font-black uppercase tracking-tighter drop-shadow-xl">{item.titulo}</h5>
                                  <p className="text-white/60 text-xs font-black uppercase tracking-widest">{item.region}</p>
                                </div>
                             </div>
                             <div className="p-10 space-y-6">
                                <p className="text-slate-500 font-serif italic text-lg line-clamp-2 leading-relaxed">"{item.descripcion}"</p>
                                {item.trivia && (
                                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                                     <Bus size={14} className="text-paisa-emerald" />
                                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.trivia}</span>
                                  </div>
                                )}
                                <div className="flex items-center justify-between pt-6 border-t border-slate-50 text-paisa-emerald">
                                   <span className="text-[10px] font-black uppercase tracking-widest">Ver Guía Completa</span>
                                   <ArrowRight size={18} />
                                </div>
                             </div>
                          </div>
                       ) : item.type === 'dish' ? (
                         <DishCard dish={item} isFavorite={state.foodFavorites.includes(item.nombre)} onToggleFavorite={(n) => setState(s => ({...s, foodFavorites: s.foodFavorites.includes(n) ? s.foodFavorites.filter(f => f !== n) : [...s.foodFavorites, n]}))} />
                       ) : (
                         <ExperienceCard experience={item} isFavorite={state.cultureFavorites.includes(item.titulo)} onToggleFavorite={(t) => setState(s => ({...s, cultureFavorites: s.cultureFavorites.includes(t) ? s.cultureFavorites.filter(f => f !== t) : [...s.cultureFavorites, t]}))} />
                       )}
                    </motion.div>
                  ))}
               </div>
            </motion.div>
          ) : (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-24 pb-20">
              {/* Dashboard para el Turista */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <button onClick={() => handleSearch("Pueblos Patrimonio")} className="group p-10 bg-white rounded-[40px] shadow-xl border border-slate-100 flex flex-col items-center gap-6 hover:-translate-y-2 transition-all">
                   <div className="p-6 rounded-3xl bg-emerald-50 text-paisa-emerald group-hover:bg-paisa-emerald group-hover:text-white transition-all"><Map size={36} /></div>
                   <div className="text-center">
                     <h4 className="font-black uppercase text-xs tracking-widest">Pueblos Mágicos</h4>
                     <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-2">Patrimonio Histórico</p>
                   </div>
                </button>
                <button onClick={() => handleSearch("Bandeja Paisa y Cafe")} className="group p-10 bg-white rounded-[40px] shadow-xl border border-slate-100 flex flex-col items-center gap-6 hover:-translate-y-2 transition-all">
                   <div className="p-6 rounded-3xl bg-gold-50 text-paisa-gold group-hover:bg-paisa-gold group-hover:text-white transition-all"><Utensils size={36} /></div>
                   <div className="text-center">
                     <h4 className="font-black uppercase text-xs tracking-widest">Ruta Gastronómica</h4>
                     <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-2">Sabores de la Montaña</p>
                   </div>
                </button>
                <button onClick={() => handleSearch("Como llegar a los pueblos")} className="group p-10 bg-white rounded-[40px] shadow-xl border border-slate-100 flex flex-col items-center gap-6 hover:-translate-y-2 transition-all">
                   <div className="p-6 rounded-3xl bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all"><Bus size={36} /></div>
                   <div className="text-center">
                     <h4 className="font-black uppercase text-xs tracking-widest">Guía de Buses</h4>
                     <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-2">Terminal Norte y Sur</p>
                   </div>
                </button>
              </div>

              <div className="space-y-8">
                 <h2 className="text-slate-900 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4">
                   <div className="h-px w-12 bg-paisa-gold" /> {t.trending}
                 </h2>
                 <div className="flex gap-8 overflow-x-auto no-scrollbar pb-10 px-2 -mx-2">
                   {Object.values(localData).map((p) => (
                     <DiscoveryCard 
                        key={p.titulo} title={p.titulo} subtitle={p.region} image={p.imagen} 
                        onClick={() => setState(s => ({...s, tarjeta: p as PlaceData}))}
                      />
                   ))}
                 </div>
              </div>
              <div className="space-y-10">
                 <h2 className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Explora las 9 Subregiones</h2>
                 <EpicAntioquiaMap onSelectRegion={(r) => handleSearch(r)} lang={state.language} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MainNav 
        onReset={resetView} isLiveActive={isLiveActive} onLiveToggle={handleLiveToggle} 
        hasResults={state.unifiedResults.length > 0 || !!state.tarjeta}
        label={isLiveActive ? t.listening : t.talk}
      />
      <Footer />
    </div>
  );
}
