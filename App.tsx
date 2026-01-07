
import { 
  Trophy, Search, Loader2, Compass, Mic, MicOff, Star, 
  ChevronLeft, Sparkles, Map, Utensils, Bus, Database, Zap,
  Navigation as NavIcon, AlertTriangle, Activity, Wifi, WifiOff
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, PlaceData, SupportedLang, UnifiedItem } from './types';
import { 
  searchUnified, checkSystemHealth,
  connectArrieroLive, decodeAudioData, decode
} from './services/geminiService';

import { PaisaLogo } from './components/atoms/PaisaLogo';
import { Navigation as MainNav } from './components/organisms/Navigation';
import { PlaceCard as PlaceDetail } from './components/PlaceCard';
import { DishCard } from './components/molecules/DishCard';
import { ExperienceCard } from './components/molecules/ExperienceCard';
import { Footer } from './components/organisms/Footer';
import { SearchBox } from './components/SearchBox';
import { EpicAntioquiaMap } from './components/molecules/EpicAntioquiaMap';
import { SafeImage } from './components/atoms/SafeImage';

export default function App() {
  const [state, setState] = useState<AppState>({
    busqueda: '', sugerencias: [], cargando: false, buscandoSugerencias: false, error: null, tarjeta: null,
    unifiedResults: [], language: 'es', activeTab: 'explore', 
    favorites: [], foodFavorites: [], cultureFavorites: [], visitedTowns: [], transcription: ''
  });

  const [xp, setXp] = useState(() => Number(localStorage.getItem('paisa_xp') || 150));
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isSystemHealthy, setIsSystemHealthy] = useState<boolean | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);

  useEffect(() => {
    localStorage.setItem('paisa_xp', xp.toString());
    // Health Check inicial
    checkSystemHealth().then(setIsSystemHealthy);
  }, [xp]);

  const handleSearch = async (q?: string) => {
    const query = q || state.busqueda;
    if (!query) return;
    
    setState(s => ({ ...s, busqueda: query, cargando: true, error: null, tarjeta: null }));
    
    try {
      const data = await searchUnified(query, state.language);
      setState(s => ({ ...s, unifiedResults: data, cargando: false }));
      setXp(prev => prev + 50);
    } catch (e) { 
      setState(s => ({ ...s, cargando: false, error: "Ave María, no pudimos encontrar la ruta. Revise su conexión mijo." })); 
    }
  };

  const handleLiveToggle = async () => {
    if (isLiveActive) {
      if (liveSessionRef.current) liveSessionRef.current.close();
      setIsLiveActive(false);
      return;
    }

    setState(s => ({ ...s, error: null }));

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
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

      if (!session) throw new Error("API Key Missing");
      liveSessionRef.current = session;
    } catch (e) { 
      setIsLiveActive(false);
      setState(s => ({ ...s, error: "¡Eh ave maría! El Arriero no pudo conectar. Revise si Vercel Authentication le está bloqueando el paso o si la API_KEY es válida." }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-40 overflow-x-hidden">
      <header className="fixed top-0 inset-x-0 z-[500] px-6 py-4 glass border-b border-slate-100 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <Trophy size={18} className="text-paisa-gold" />
            <div className="w-24 md:w-40 h-2 bg-slate-200 rounded-full overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: `${(xp % 500) / 5}%` }} className="xp-bar h-full" />
            </div>
            <span className="font-paisa text-[9px] text-paisa-emerald uppercase tracking-tighter">Berraquera Lvl {Math.floor(xp/500)+1}</span>
            <div className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase transition-colors ${isSystemHealthy ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
               {isSystemHealthy ? <Wifi size={10} /> : <WifiOff size={10} />}
               {isSystemHealthy ? 'IA Verificada' : 'IA Fuera de Ruta'}
            </div>
         </div>
         <div className="flex gap-2">
           {['es', 'en'].map(l => (
             <button key={l} onClick={() => setState(s => ({...s, language: l as SupportedLang}))} className={`w-8 h-8 rounded-full text-[10px] font-black uppercase transition-all ${state.language === l ? 'bg-paisa-emerald text-white' : 'text-slate-400'}`}>
               {l}
             </button>
           ))}
         </div>
      </header>

      <div className="pt-32 px-6 max-w-6xl mx-auto space-y-16">
        {state.error && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 text-red-600 shadow-lg">
             <AlertTriangle className="shrink-0" />
             <p className="text-sm font-bold">{state.error}</p>
             <button onClick={() => setState(s => ({ ...s, error: null }))} className="ml-auto text-xs font-black uppercase bg-white px-4 py-2 rounded-xl shadow-sm">Cerrar</button>
          </motion.div>
        )}

        <div className="flex flex-col items-center text-center gap-10">
          <PaisaLogo onClick={() => setState(s => ({...s, unifiedResults: [], tarjeta: null, error: null}))} className="scale-125 cursor-pointer" />
          <SearchBox 
            value={state.busqueda} onChange={(v) => setState(s => ({...s, busqueda: v}))} 
            onSearch={handleSearch} placeholder="¿A qué pueblo o terminal vamos mijo?" 
          />
        </div>

        <AnimatePresence mode="wait">
          {state.cargando ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-40 gap-8">
               <div className="relative">
                  <Loader2 className="text-paisa-emerald animate-spin" size={64} />
                  <Sparkles className="absolute -top-4 -right-4 text-paisa-gold animate-pulse" />
               </div>
               <p className="text-2xl font-serif italic text-slate-400 animate-pulse">Consultando el Universo Paisa...</p>
            </motion.div>
          ) : state.tarjeta ? (
            <motion.div key="detail" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
               <button onClick={() => setState(s => ({ ...s, tarjeta: null }))} className="flex items-center gap-3 mb-10 px-6 py-3 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 shadow-sm hover:text-paisa-emerald transition-all">
                  <ChevronLeft size={16} /> Volver al Camino
               </button>
               <PlaceDetail data={state.tarjeta} lang={state.language} i18n={{}} isFavorite={false} onToggleFavorite={()=>{}} />
            </motion.div>
          ) : state.unifiedResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {state.unifiedResults.map((item, i) => (
                 <motion.div 
                   key={i} 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   onClick={() => item.type === 'place' && setState(s => ({...s, tarjeta: item}))}
                 >
                    {item.type === 'place' ? (
                      <div className="bg-white rounded-[40px] overflow-hidden shadow-xl border border-slate-100 cursor-pointer hover:-translate-y-2 transition-all group">
                        <SafeImage src={item.imagen} alt={item.titulo} className="aspect-video" />
                        <div className="p-8 space-y-4">
                           <div className="flex justify-between items-center">
                              <h5 className="text-2xl font-black uppercase tracking-tighter group-hover:text-paisa-emerald transition-colors">{item.titulo}</h5>
                              <div className="flex gap-2">
                                <div className="px-2 py-1 bg-amber-50 text-amber-600 rounded-lg text-[7px] font-bold">LIVE</div>
                                <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[7px] font-bold uppercase">Safe</div>
                              </div>
                           </div>
                           <p className="text-slate-500 font-serif italic text-sm line-clamp-2">"{item.descripcion}"</p>
                           <div className="pt-4 border-t flex items-center justify-between text-[10px] font-black uppercase text-paisa-emerald">
                              <span className="flex items-center gap-1"><Bus size={12}/> Bus: ${item.budget.busTicket.toLocaleString()}</span>
                              <span className="text-slate-300">{item.region}</span>
                           </div>
                        </div>
                      </div>
                    ) : item.type === 'dish' ? (
                      <DishCard dish={item} isFavorite={false} onToggleFavorite={()=>{}} />
                    ) : (
                      <ExperienceCard experience={item} isFavorite={false} onToggleFavorite={()=>{}} />
                    )}
                 </motion.div>
               ))}
            </div>
          ) : (
            <motion.div key="home" className="space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Guatapé', 'Jardín', 'Santa Fe de Antioquia'].map(p => (
                   <button key={p} onClick={() => handleSearch(p)} className="p-10 bg-white rounded-[40px] border border-slate-100 text-left hover:border-paisa-gold transition-all group shadow-sm hover:shadow-xl">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Ruta Sugerida</p>
                        <NavIcon size={14} className="text-slate-200 group-hover:text-paisa-emerald transition-colors" />
                      </div>
                      <h4 className="text-3xl font-black uppercase tracking-tighter group-hover:text-paisa-emerald">{p}</h4>
                   </button>
                ))}
              </div>
              <EpicAntioquiaMap onSelectRegion={(r) => handleSearch(r)} lang={state.language} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MainNav 
        onReset={() => setState(s => ({...s, unifiedResults: [], tarjeta: null, busqueda: '', error: null}))} 
        isLiveActive={isLiveActive} 
        onLiveToggle={handleLiveToggle} 
        hasResults={state.unifiedResults.length > 0 || !!state.tarjeta} 
        label={isLiveActive ? "Escuchando..." : "Hablar con Arriero"} 
      />
      <Footer isDark={false} />
      
      {/* Mini Health Monitor (Senior Touch) */}
      <div className="fixed bottom-4 right-4 z-[600] pointer-events-none opacity-20 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-full text-[6px] font-black uppercase">
          <Activity size={8} className={isSystemHealthy ? 'text-emerald-400 animate-pulse' : 'text-red-400'} />
          Region: us-east-1 | Gemini v3
        </div>
      </div>
    </div>
  );
}
