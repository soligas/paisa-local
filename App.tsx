
import { 
  Trophy, Search, Loader2, Compass, Star, ChevronLeft, Sparkles, Navigation as NavIcon, 
  AlertTriangle, Play, Camera, Globe, Info, Accessibility, ShieldCheck, Instagram, MapPin, 
  Clock, Heart, CheckCircle, ExternalLink, ShieldAlert
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, PlaceData, SupportedLang, UnifiedItem } from './types';
import { 
  searchUnified, checkSystemHealth,
  connectArrieroLive, decodeAudioData, decode
} from './services/geminiService';
import { getLocalSuggestions } from './services/logisticsService';

import { PaisaLogo } from './components/atoms/PaisaLogo';
import { Navigation as MainNav } from './components/organisms/Navigation';
import { PlaceCard as PlaceDetail } from './components/PlaceCard';
import { DishCard } from './components/molecules/DishCard';
import { ExperienceCard } from './components/molecules/ExperienceCard';
import { Footer } from './components/organisms/Footer';
import { SearchBox } from './components/SearchBox';
import { EpicAntioquiaMap } from './components/molecules/EpicAntioquiaMap';
import { SafeImage } from './components/atoms/SafeImage';
import { Badge } from './components/atoms/Badge';

export default function App() {
  const [state, setState] = useState<AppState>({
    busqueda: '', sugerencias: [], cargando: false, buscandoSugerencias: false, error: null, tarjeta: null,
    unifiedResults: [], language: 'es', activeTab: 'explore', 
    favorites: [], foodFavorites: [], cultureFavorites: [], visitedTowns: [], transcription: '',
    accessibilityMode: false
  });

  const [xp, setXp] = useState(() => Number(localStorage.getItem('paisa_xp') || 150));
  const [isLiveActive, setIsLiveActive] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);

  useEffect(() => {
    localStorage.setItem('paisa_xp', xp.toString());
    checkSystemHealth();
  }, [xp]);

  const handleSearch = async (q?: string) => {
    const query = q || state.busqueda;
    if (!query) return;
    setState(s => ({ ...s, busqueda: query, cargando: true, error: null, tarjeta: null, sugerencias: [] }));
    try {
      const data = await searchUnified(query, state.language);
      if (data.length === 0) {
        setState(s => ({ ...s, cargando: false, error: "No encontramos ese destino." }));
      } else {
        setState(s => ({ ...s, unifiedResults: data, cargando: false }));
        setXp(p => p + 50);
      }
    } catch (e) { setState(s => ({ ...s, cargando: false, error: "Error de IA." })); }
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
          if (!audioContextRef.current) return;
          const buf = await decodeAudioData(decode(b64), audioContextRef.current, 24000);
          const src = audioContextRef.current.createBufferSource();
          src.buffer = buf;
          src.connect(audioContextRef.current.destination);
          src.start();
        }
      });
      liveSessionRef.current = session;
    } catch (e) { setIsLiveActive(false); }
  };

  return (
    <div className={`min-h-screen ${state.accessibilityMode ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'} font-sans pb-40 transition-colors duration-500`}>
      <header className="fixed top-0 inset-x-0 z-[500] px-6 py-4 glass border-b border-slate-100 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <Trophy size={18} className="text-paisa-gold" />
            <div className="w-24 md:w-40 h-2 bg-slate-200 rounded-full overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: `${(xp % 500) / 5}%` }} className="xp-bar h-full" />
            </div>
            <span className="font-paisa text-[9px] text-paisa-emerald uppercase tracking-tighter">Lvl {Math.floor(xp/500)+1}</span>
         </div>
         <div className="flex gap-4">
           <button onClick={() => setState(s => ({...s, accessibilityMode: !s.accessibilityMode}))} className={`p-2 rounded-full border ${state.accessibilityMode ? 'bg-paisa-gold text-black border-paisa-gold' : 'bg-white text-slate-400 border-slate-100'}`}>
             <Accessibility size={20} />
           </button>
           <div className="flex gap-2">
             {['es', 'en'].map(l => (
               <button key={l} onClick={() => setState(s => ({...s, language: l as SupportedLang}))} className={`w-8 h-8 rounded-full text-[10px] font-black uppercase ${state.language === l ? 'bg-paisa-emerald text-white' : 'text-slate-400'}`}>
                 {l}
               </button>
             ))}
           </div>
         </div>
      </header>

      <div className="pt-32 px-6 max-w-6xl mx-auto space-y-16">
        {/* HERO START SECTIONS (Very important for onboarding) */}
        {!state.unifiedResults.length && !state.tarjeta && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-10">
            <PaisaLogo isDark={state.accessibilityMode} className="scale-150 mx-auto" />
            <div className="space-y-4">
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                Antioquia en <br /> <span className="text-paisa-emerald">Tu Bolsillo</span>
              </h1>
              <p className="text-lg md:text-2xl text-slate-400 font-serif italic max-w-2xl mx-auto">
                Guía inclusiva con IA para explorar los 125 pueblos sin fragmentación y con seguridad verificada.
              </p>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col items-center">
          <SearchBox 
            value={state.busqueda} 
            onChange={(v) => setState(s => ({...s, busqueda: v}))} 
            onSearch={handleSearch} 
            placeholder={state.accessibilityMode ? "BUSCAR PUEBLO (ALTA VISIBILIDAD)" : "¿A qué terminal vamos mijo?"} 
            isDark={state.accessibilityMode}
          />
        </div>

        <AnimatePresence mode="wait">
          {state.cargando ? (
            <div className="flex flex-col items-center py-40 gap-8">
               <Loader2 className="text-paisa-emerald animate-spin" size={64} />
               <p className="text-2xl font-serif italic opacity-40">Verificando fuentes reales...</p>
            </div>
          ) : state.tarjeta ? (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
               <button onClick={() => setState(s => ({ ...s, tarjeta: null }))} className="flex items-center gap-3 mb-10 px-6 py-3 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 shadow-sm">
                  <ChevronLeft size={16} /> Volver
               </button>
               <PlaceDetail data={state.tarjeta} lang={state.language} i18n={{}} isFavorite={false} onToggleFavorite={()=>{}} />
            </motion.div>
          ) : state.unifiedResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {state.unifiedResults.map((item, i) => (
                 <div key={i}>
                    {item.type === 'place' ? (
                      <div className={`rounded-[40px] overflow-hidden shadow-xl border flex flex-col h-full ${state.accessibilityMode ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-slate-100'}`}>
                        <div className="h-48 cursor-pointer" onClick={() => setState(s => ({...s, tarjeta: item}))}>
                           <SafeImage alt={item.titulo} region={item.region} className="w-full h-full" />
                        </div>
                        <div className="p-8 space-y-4 flex-1 flex flex-col">
                           <h5 className={`text-2xl font-black uppercase ${state.accessibilityMode ? 'text-paisa-gold' : 'text-slate-900'}`}>{item.titulo}</h5>
                           
                           {/* Trust Indicators (Gap Fix: Trust & Safety) */}
                           <div className="flex gap-2">
                             {item.accessibility?.wheelchairFriendly && <Badge color="emerald">Accesible ♿</Badge>}
                             {item.security?.status === 'Seguro' && <Badge color="gold">Zona Segura 🛡️</Badge>}
                           </div>

                           <p className="text-sm text-slate-400 italic line-clamp-3">"{item.descripcion}"</p>

                           {/* REAL REFERENCE LINKS (Gap Fix: Fragmentation & Trust) */}
                           {item.groundingLinks && item.groundingLinks.length > 0 && (
                             <div className="pt-4 border-t border-slate-50 mt-auto">
                                <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-3 flex items-center gap-2">
                                  <ShieldCheck size={10} /> Evidencia Real
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {item.groundingLinks.map((link, idx) => (
                                    <a 
                                      key={idx} 
                                      href={link.uri} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-paisa-emerald hover:bg-emerald-50 transition-all flex items-center gap-2"
                                    >
                                      {link.type === 'video' ? <Play size={12} /> : link.type === 'official' ? <Globe size={12} /> : <Info size={12} />}
                                      <span className="text-[9px] font-black uppercase">{link.type}</span>
                                    </a>
                                  ))}
                                </div>
                             </div>
                           )}

                           <button onClick={() => setState(s => ({...s, tarjeta: item}))} className="w-full py-4 bg-paisa-emerald text-white rounded-2xl font-black uppercase text-[10px] mt-4 hover:brightness-110 transition-all">
                             Ver Itinerario Táctico
                           </button>
                        </div>
                      </div>
                    ) : item.type === 'dish' ? (
                      <DishCard dish={item} isFavorite={false} onToggleFavorite={()=>{}} />
                    ) : (
                      <ExperienceCard experience={item} isFavorite={false} onToggleFavorite={()=>{}} />
                    )}
                 </div>
               ))}
            </div>
          ) : (
            <div className="space-y-24">
              {/* START SECTIONS (Gap: Info & Onboarding) */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
                 <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-4">
                    <Accessibility className="text-paisa-gold" size={32} />
                    <h4 className="text-xl font-black uppercase">Filtro de Inclusión</h4>
                    <p className="text-sm text-slate-400">Verificamos si hay rampas y ascensores antes de que tú llegues.</p>
                 </div>
                 <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-4">
                    <ShieldCheck className="text-paisa-emerald" size={32} />
                    <h4 className="text-xl font-black uppercase">Seguridad Real</h4>
                    <p className="text-sm text-slate-400">Datos directos de la Policía de Turismo y el Invías #767.</p>
                 </div>
                 <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-4">
                    <Globe className="text-blue-500" size={32} />
                    <h4 className="text-xl font-black uppercase">No Fragmentación</h4>
                    <p className="text-sm text-slate-400">Centralizamos links de YouTube, Maps y sitios oficiales en un solo lugar.</p>
                 </div>
              </section>

              <EpicAntioquiaMap onSelectRegion={(r) => handleSearch(r)} lang={state.language} />
            </div>
          )}
        </AnimatePresence>
      </div>

      <MainNav 
        onReset={() => setState(s => ({...s, unifiedResults: [], tarjeta: null, busqueda: ''}))} 
        isLiveActive={isLiveActive} 
        onLiveToggle={handleLiveToggle} 
        hasResults={state.unifiedResults.length > 0} 
        label={isLiveActive ? "Hablando..." : "Arriero Live"} 
      />
      <Footer isDark={state.accessibilityMode} />
    </div>
  );
}
