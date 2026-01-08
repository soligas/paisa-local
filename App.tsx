
import { 
  Trophy, Search, Loader2, Compass, Mic, MicOff, Star, 
  ChevronLeft, Sparkles, Map, Utensils, Bus, Database, Zap,
  Navigation as NavIcon, AlertTriangle, Activity, Wifi, WifiOff, Info, ZapOff,
  BellRing, X, MapPin, Clock, ShieldCheck, Camera, Play, CheckCircle, Info as InfoIcon,
  Users, HeartHandshake, Globe, Instagram
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
    favorites: [], foodFavorites: [], cultureFavorites: [], visitedTowns: [], transcription: ''
  });

  const [xp, setXp] = useState(() => Number(localStorage.getItem('paisa_xp') || 150));
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [systemStatus, setSystemStatus] = useState<{ok: boolean | null, msg: string, code?: number}>({ ok: null, msg: "Iniciando..." });
  const [showAlert, setShowAlert] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);

  useEffect(() => {
    localStorage.setItem('paisa_xp', xp.toString());
    checkSystemHealth().then(setSystemStatus);
  }, [xp]);

  useEffect(() => {
    if (state.busqueda.length >= 2) {
      const suggestions = getLocalSuggestions(state.busqueda);
      setState(s => ({ ...s, sugerencias: suggestions }));
    } else {
      setState(s => ({ ...s, sugerencias: [] }));
    }
  }, [state.busqueda]);

  const handleSearch = async (q?: string) => {
    const query = q || state.busqueda;
    if (!query) return;
    
    setState(s => ({ ...s, busqueda: query, cargando: true, error: null, tarjeta: null, sugerencias: [] }));
    
    try {
      const data = await searchUnified(query, state.language);
      if (data.length === 0) {
        setState(s => ({ ...s, cargando: false, error: "No encontramos ese destino. Intente con Jardín, Guatapé o Jericó." }));
      } else {
        setState(s => ({ ...s, unifiedResults: data, cargando: false }));
        setXp(prev => prev + 50);
      }
    } catch (e: any) { 
      setState(s => ({ 
        ...s, 
        cargando: false, 
        error: "¡Eh ave maría! Hubo un problema buscando. Intente de nuevo." 
      })); 
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
      setState(s => ({ ...s, error: "El Arriero está ocupado herrando mulas. Intente más tarde." }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-40 overflow-x-hidden">
      <AnimatePresence>
        {showAlert && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="bg-paisa-emerald text-white px-6 py-3 flex items-center justify-between z-[600] relative overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <BellRing size={16} className="animate-bounce" />
              <p className="text-[10px] font-black uppercase tracking-widest">
                Alerta Arriera: Vía a Guatapé fluyendo normal. ¡Disfrute el charco!
              </p>
            </div>
            <button onClick={() => setShowAlert(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="fixed top-0 inset-x-0 z-[500] px-6 py-4 glass border-b border-slate-100 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <Trophy size={18} className="text-paisa-gold" />
            <div className="w-24 md:w-40 h-2 bg-slate-200 rounded-full overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: `${(xp % 500) / 5}%` }} className="xp-bar h-full" />
            </div>
            <span className="font-paisa text-[9px] text-paisa-emerald uppercase tracking-tighter">Lvl {Math.floor(xp/500)+1}</span>
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
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-red-50 border border-red-200 rounded-3xl flex items-center gap-4 text-red-700 shadow-xl">
               <AlertTriangle className="shrink-0" />
               <p className="text-sm font-bold">{state.error}</p>
               <button onClick={() => setState(s => ({ ...s, error: null }))} className="ml-auto text-xs font-black uppercase bg-white px-4 py-2 rounded-xl shadow-sm border border-red-100">Ocultar</button>
          </motion.div>
        )}

        <div className="flex flex-col items-center text-center gap-10">
          <PaisaLogo onClick={() => setState(s => ({...s, unifiedResults: [], tarjeta: null, error: null}))} className="scale-125 cursor-pointer" />
          <SearchBox 
            value={state.busqueda} 
            onChange={(v) => setState(s => ({...s, busqueda: v}))} 
            onSearch={handleSearch} 
            suggestions={state.sugerencias}
            placeholder="¿A qué pueblo o terminal vamos mijo?" 
          />
        </div>

        <AnimatePresence mode="wait">
          {state.cargando ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-40 gap-8">
               <div className="relative">
                  <Loader2 className="text-paisa-emerald animate-spin" size={64} />
                  <Sparkles className="absolute -top-4 -right-4 text-paisa-gold animate-pulse" />
               </div>
               <p className="text-2xl font-serif italic text-slate-400 animate-pulse">Consultando el mapa...</p>
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
                   className="flex flex-col h-full"
                 >
                    {item.type === 'place' ? (
                      <div className="bg-white rounded-[40px] overflow-hidden shadow-xl border border-slate-100 flex flex-col h-full group">
                        <div className="h-48 cursor-pointer overflow-hidden" onClick={() => setState(s => ({...s, tarjeta: item}))}>
                           <SafeImage alt={item.titulo} region={item.region} className="w-full h-full group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="p-8 space-y-4 flex-1 flex flex-col">
                           <div className="flex justify-between items-center cursor-pointer" onClick={() => setState(s => ({...s, tarjeta: item}))}>
                              <h5 className="text-2xl font-black uppercase tracking-tighter group-hover:text-paisa-emerald transition-colors">{item.titulo}</h5>
                              <Badge color="gold">{item.region}</Badge>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-4 text-slate-500">
                              <div className="flex items-center gap-2">
                                 <Bus size={12} className="text-paisa-emerald" />
                                 <span className="text-[10px] font-black">${item.budget.busTicket.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <Clock size={12} className="text-paisa-emerald" />
                                 <span className="text-[10px] font-black">{item.tiempoDesdeMedellin}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <Wifi size={12} className="text-paisa-emerald" />
                                 <span className="text-[10px] font-black">{item.wifiQuality}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <ShieldCheck size={12} className="text-paisa-emerald" />
                                 <span className="text-[10px] font-black">{item.viaEstado}</span>
                              </div>
                           </div>

                           <div className="pt-6 mt-auto border-t border-slate-50 flex flex-wrap gap-2">
                              <a 
                                href={`https://www.google.com/search?q=${item.titulo}+Antioquia+turismo+fotos&tbm=isch`} 
                                target="_blank" 
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-paisa-emerald hover:bg-emerald-50 transition-all"
                              >
                                <Camera size={12} /> Fotos
                              </a>
                              <a 
                                href={`https://www.youtube.com/results?search_query=${item.titulo}+Antioquia+vlog+viaje`} 
                                target="_blank" 
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                              >
                                <Play size={12} /> Videos
                              </a>
                              <button 
                                onClick={() => setState(s => ({...s, tarjeta: item}))}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 text-[9px] font-black uppercase tracking-widest text-white hover:bg-emerald-700 transition-all ml-auto"
                              >
                                <CheckCircle size={12} /> Verificar
                              </button>
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
            <motion.div key="home" className="space-y-24">
              {/* Sección Explicativa: Nuestra Propuesta */}
              <section className="space-y-12">
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                   <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Tu Brújula en <span className="text-paisa-emerald">Antioquia</span></h2>
                   <p className="text-lg text-slate-500 font-serif italic">Somos la inteligencia colectiva de las montañas llevada a tu bolsillo. Turismo táctico para el viajero moderno.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <motion.div whileHover={{ y: -10 }} className="p-10 bg-white rounded-[48px] border border-slate-100 shadow-xl space-y-6 text-center">
                      <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 text-paisa-emerald flex items-center justify-center">
                         <Globe size={40} />
                      </div>
                      <h4 className="text-xl font-black uppercase tracking-tight">Acceso Total</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-serif">Explora los 125 municipios. Desde el mar de Urabá hasta los páramos del Norte, con datos técnicos de transporte y seguridad verificados.</p>
                   </motion.div>

                   <motion.div whileHover={{ y: -10 }} className="p-10 bg-white rounded-[48px] border border-slate-100 shadow-xl space-y-6 text-center">
                      <div className="w-20 h-20 mx-auto rounded-3xl bg-gold-50 text-paisa-gold flex items-center justify-center">
                         <HeartHandshake size={40} />
                      </div>
                      <h4 className="text-xl font-black uppercase tracking-tight">Impacto Local</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-serif">Promovemos el turismo regenerativo. Conectamos viajeros con maestros de oficio, fincas cafeteras y gastronomía de origen auténtico.</p>
                   </motion.div>

                   <motion.div whileHover={{ y: -10 }} className="p-10 bg-white rounded-[48px] border border-slate-100 shadow-xl space-y-6 text-center">
                      <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 text-paisa-emerald flex items-center justify-center">
                         <Zap size={40} />
                      </div>
                      <h4 className="text-xl font-black uppercase tracking-tight">Datos en Vivo</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-serif">Precios de buses actualizados, calidad de internet para nómadas y estado de vías reportado por la comunidad arriera en tiempo real.</p>
                   </motion.div>
                </div>
              </section>

              {/* Destinos Populares */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Guatapé', 'Jardín', 'Jericó'].map(p => (
                   <button key={p} onClick={() => handleSearch(p)} className="p-10 bg-white rounded-[40px] border border-slate-100 text-left hover:border-paisa-gold transition-all group shadow-sm hover:shadow-xl">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Destino Top</p>
                        <NavIcon size={14} className="text-slate-200 group-hover:text-paisa-emerald transition-colors" />
                      </div>
                      <h4 className="text-3xl font-black uppercase tracking-tighter group-hover:text-paisa-emerald">{p}</h4>
                   </button>
                ))}
              </div>
              
              <EpicAntioquiaMap onSelectRegion={(r) => handleSearch(r)} lang={state.language} />
              
              {/* Sección Social de Instagram */}
              <section className="bg-slate-900 rounded-[56px] p-12 lg:p-20 text-white relative overflow-hidden text-center space-y-10 border border-white/5">
                 <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <svg width="100%" height="100%"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
                 </div>
                 <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
                    <Badge color="gold" className="mb-4">Instagram Live</Badge>
                    <h3 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">Unite a la Comunidad <span className="text-paisa-gold">Arriera</span></h3>
                    <p className="text-xl text-white/50 font-serif italic">Compartí tus aventuras, reportá el estado de los charcos y ayudanos a mapear los tesoros ocultos de nuestra tierra.</p>
                 </div>
                 <div className="flex flex-col md:flex-row justify-center items-center gap-6 relative z-10">
                    <a href="https://instagram.com/paisalocal.pro" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 px-10 py-5 bg-white text-slate-900 rounded-full font-black uppercase text-[12px] tracking-widest hover:bg-paisa-gold hover:scale-105 transition-all shadow-2xl">
                       <Instagram size={20} className="text-paisa-emerald" /> Seguinos en @paisalocal.pro
                    </a>
                 </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MainNav 
        onReset={() => setState(s => ({...s, unifiedResults: [], tarjeta: null, busqueda: '', error: null, sugerencias: []}))} 
        isLiveActive={isLiveActive} 
        onLiveToggle={handleLiveToggle} 
        hasResults={state.unifiedResults.length > 0 || !!state.tarjeta} 
        label={isLiveActive ? "Hablando..." : "Arriero Live"} 
      />
      <Footer isDark={false} />
    </div>
  );
}
