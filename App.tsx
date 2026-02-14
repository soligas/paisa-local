
import React, { useState, useEffect } from 'react';
import { 
  Search, Loader2, ArrowLeft, Heart, Compass, ShieldCheck, Activity, TrendingUp, Sparkles, 
  Truck, Coffee, MapPin, Waves, Mountain, Wind, Star, Target, Info, AlertCircle, RefreshCw, 
  ChevronRight, Utensils, Palette, Navigation as NavIcon, Map as MapIcon, Compass as CompassIcon,
  Wallet, CreditCard, X, Shield, Landmark, Layers, Database, ChevronDown, QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, SupportedLang, PlaceData } from './types';
import { searchUnified } from './services/geminiService';
import { PaisaLogo } from './components/atoms/PaisaLogo';
import { PlaceCard } from './components/PlaceCard';
import { Footer } from './components/organisms/Footer';
import { DiscoveryCard } from './components/molecules/DiscoveryCard';
import { HorizontalCarousel } from './components/molecules/HorizontalCarousel';
import { SectionHeader } from './components/molecules/SectionHeader';
import { Navigation as AppNavigation } from './components/organisms/Navigation';
import { getLocalSuggestions } from './services/logisticsService';
import { TRANSLATIONS } from './constants/translations';
import { SearchBox } from './components/SearchBox';
import { Badge } from './components/atoms/Badge';
import { EpicAntioquiaMap } from './components/molecules/EpicAntioquiaMap';

export function App() {
  const [state, setState] = useState<AppState>({
    busqueda: '', cargando: false, error: null, tarjeta: null,
    unifiedResults: [], language: 'es', activeTab: 'home',
    accessibilityMode: false,
    favoritePlaces: JSON.parse(localStorage.getItem('arriero_pro_fav_places') || '[]')
  });

  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentHint, setShowPaymentHint] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  
  const t = TRANSLATIONS[state.language] || TRANSLATIONS.es;

  useEffect(() => {
    let interval: any;
    if (state.cargando) {
      interval = setInterval(() => {
        setLoadingMsgIdx(prev => (prev + 1) % (t.indexingMsgs?.length || 1));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [state.cargando, t.indexingMsgs]);

  useEffect(() => {
    const timer = setTimeout(() => setShowPaymentHint(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  // Lógica para cargar Helio solo cuando sea necesario
  useEffect(() => {
    if (showPaymentModal && selectedPaymentMethod === 'card') {
      const container = document.getElementById('helio-container');
      if (container && !container.innerHTML) {
        const helioConfig = {
          paylinkId: "67a7b8f9e602418e597793b8",
          network: "mainnet",
          display: "inline"
        };
        
        const script = document.createElement('script');
        script.src = "https://embed.helio.xyz/checkout/v1/embed.js";
        script.type = "module";
        script.onload = () => {
          // @ts-ignore
          if (window.HelioCheckout) {
            // @ts-ignore
            new window.HelioCheckout({
              container: '#helio-container',
              paylinkId: helioConfig.paylinkId,
              network: helioConfig.network
            });
          }
        };
        document.body.appendChild(script);
      }
    }
  }, [showPaymentModal, selectedPaymentMethod]);

  const handleSearchChange = (val: string) => {
    setState(s => ({ ...s, busqueda: val }));
    if (val.length >= 2) {
      setSuggestions(getLocalSuggestions(val));
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = async (q?: string) => {
    const query = q || state.busqueda;
    if (!query) return;
    
    setState(s => ({ 
      ...s, 
      cargando: true, 
      error: null, 
      activeTab: 'explore', 
      busqueda: query,
      unifiedResults: []
    }));
    
    try {
      const results = await searchUnified(query, state.language);
      setState(s => ({ 
        ...s, 
        unifiedResults: results, 
        cargando: false,
        error: null
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setState(s => ({ ...s, cargando: false, error: "Lo sentimos, no pudimos completar la búsqueda. Intente de nuevo." }));
    }
  };

  const handleSurpriseMe = () => {
    const destacados = ['Jardín', 'Jericó', 'Guatapé', 'Santa Fe de Antioquia', 'Sonsón', 'Urrao', 'Támesis', 'San Rafael'];
    const randomIdx = Math.floor(Math.random() * destacados.length);
    handleSearch(destacados[randomIdx]);
  };

  const handleReset = () => {
    setState(s => ({ ...s, unifiedResults: [], busqueda: '', activeTab: 'home', error: null, cargando: false }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (place: PlaceData) => {
    const isFav = state.favoritePlaces.some(f => f.titulo === place.titulo);
    const newFavs = isFav 
      ? state.favoritePlaces.filter(f => f.titulo !== place.titulo) 
      : [...state.favoritePlaces, place];
    
    setState(s => ({ ...s, favoritePlaces: newFavs }));
    localStorage.setItem('arriero_pro_fav_places', JSON.stringify(newFavs));
  };

  const goToFavorites = () => {
    setState(s => ({ ...s, activeTab: 'favorites' }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case 'database': return <Database size={24} />;
      case 'shield': return <ShieldCheck size={24} />;
      case 'mountain': return <Mountain size={24} />;
      default: return <Sparkles size={24} />;
    }
  };

  const handleOpenPayment = () => {
    setSelectedPaymentMethod(null);
    setShowPaymentModal(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${state.activeTab === 'home' ? 'bg-paisa-light' : 'bg-white'}`}>
      
      <div className="bg-slate-950 overflow-hidden h-10 flex items-center border-b border-white/5">
        <div className="flex items-center gap-12 animate-marquee whitespace-nowrap px-6">
          {t.pulseItems.concat(t.pulseItems).map((item: string, i: number) => (
            <span key={i} className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-paisa-emerald rounded-full animate-pulse shadow-[0_0_8px_rgba(45,122,76,0.8)]" /> 
              {item}
            </span>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <PaisaLogo onClick={handleReset} />
          <div className="flex items-center gap-4">
            <button 
              onClick={goToFavorites}
              className={`p-2.5 rounded-xl shadow-sm border transition-all relative group ${state.activeTab === 'favorites' ? 'bg-paisa-emerald text-white border-paisa-emerald' : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'}`}
              title={t.favoritesTitle}
            >
               <Heart size={20} fill={(state.favoritePlaces.length > 0 || state.activeTab === 'favorites') ? "currentColor" : "none"} />
               {state.favoritePlaces.length > 0 && (
                 <span className="absolute -top-2 -right-2 w-5 h-5 bg-paisa-gold text-slate-900 rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm">
                   {state.favoritePlaces.length}
                 </span>
               )}
            </button>
          </div>
        </div>
      </header>

      <main className="pb-32">
        <AnimatePresence mode="wait">
          
          {state.activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-12 md:pt-20">
              <div className="max-w-6xl mx-auto px-6 space-y-16">
                
                <div className="text-center space-y-12">
                  <div className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                       <Badge color="gold">INTELIGENCIA TURÍSTICA</Badge>
                       <div className="px-6 py-3 rounded-2xl bg-slate-950 text-white flex items-center gap-4 border border-white/10 shadow-4xl group hover:border-paisa-gold/50 transition-all cursor-default">
                          <Database size={20} className="text-paisa-gold" />
                          <div className="flex flex-col items-start leading-none">
                             <span className="text-2xl font-black text-white tracking-tighter">125</span>
                             <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">Municipios Indexados</span>
                          </div>
                       </div>
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-slate-950 leading-[0.8] mb-4">
                      ANTIOQUIA<br/><span className="text-paisa-emerald">TÁCTICA</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-slate-400 font-serif italic max-w-2xl mx-auto px-4 leading-relaxed">
                      "{t.heroDescription}"
                    </p>
                  </div>

                  <div className="space-y-8">
                    <SearchBox value={state.busqueda} onChange={handleSearchChange} onSearch={handleSearch} placeholder={t.searchPlaceholder} suggestions={suggestions} />
                    
                    <div className="max-w-4xl mx-auto">
                      <div className="p-8 md:p-12 rounded-[48px] bg-white shadow-2xl border border-slate-100 space-y-10">
                        <div className="flex flex-wrap justify-center gap-4">
                           {[
                             { icon: Utensils, label: 'Gastronomía', q: 'Donde comer mejor en Antioquia' },
                             { icon: Waves, label: 'Charcos', q: 'Mejores charcos Antioquia aventura' },
                             { icon: Coffee, label: 'Ruta Café', q: 'Pueblos cafeteros tradicionales' },
                             { icon: Palette, label: 'Colores', q: 'Pueblos coloniales coloridos' }
                           ].map((cat, idx) => (
                             <motion.button
                                key={idx}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSearch(cat.q)}
                                className="flex items-center gap-4 px-6 py-4 rounded-3xl bg-white border border-slate-100 shadow-lg hover:border-paisa-emerald/20 hover:bg-emerald-50/30 transition-all text-slate-500 hover:text-paisa-emerald group"
                             >
                                <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-paisa-emerald group-hover:text-white transition-all shadow-sm">
                                   <cat.icon size={18} />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-widest">{cat.label}</span>
                             </motion.button>
                           ))}
                        </div>
                        
                        <div className="flex flex-col items-center gap-4 pt-4 border-t border-slate-50">
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSurpriseMe}
                            className="group flex items-center gap-4 px-8 py-3 rounded-full hover:bg-paisa-gold/5 transition-all"
                          >
                            <Sparkles size={18} className="text-paisa-gold group-hover:animate-spin" />
                            <span className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-slate-600 transition-colors">
                              {t.surpriseMe}
                            </span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div className="pt-12 md:pt-24 space-y-16">
                   <div className="bg-white p-12 md:p-20 rounded-[64px] shadow-2xl border border-slate-100 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none">
                         <Compass size={200} />
                      </div>
                      <div className="max-w-4xl space-y-8 relative z-10">
                         <div className="space-y-4">
                            <Badge color="emerald">{t.about.title}</Badge>
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 leading-none">
                               {t.about.subtitle}
                            </h2>
                         </div>
                         <p className="text-xl md:text-2xl font-serif italic text-slate-500 leading-relaxed">
                            "{t.about.description}"
                         </p>
                         
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                            {t.about.pillars.map((pillar: any, idx: number) => (
                               <motion.div 
                                 key={idx}
                                 initial={{ opacity: 0, y: 20 }}
                                 whileInView={{ opacity: 1, y: 0 }}
                                 viewport={{ once: true }}
                                 transition={{ delay: idx * 0.1 }}
                                 className="space-y-4 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all"
                               >
                                  <div className="p-4 rounded-2xl bg-paisa-emerald text-white w-max shadow-lg">
                                     {getPillarIcon(pillar.icon)}
                                  </div>
                                  <h3 className="text-lg font-black uppercase tracking-widest text-slate-900">{pillar.title}</h3>
                                  <p className="text-xs text-slate-400 leading-relaxed font-medium uppercase tracking-wider">{pillar.desc}</p>
                               </motion.div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>

                <div className="pt-12 space-y-10">
                   <SectionHeader title="TERRITORIOS" subtitle="Navegue por las 9 subregiones de nuestra tierra" icon={MapIcon} />
                   <EpicAntioquiaMap onSelectRegion={(reg) => handleSearch(reg)} lang={state.language} />
                </div>

                <div className="pt-12">
                  <SectionHeader title="TESOROS" subtitle="Pueblos que todo viajero debe conocer" icon={Mountain} />
                  <HorizontalCarousel>
                    {t.discovery.map((d: any, i: number) => (
                      <DiscoveryCard key={i} title={d.title} subtitle={d.subtitle} image={d.image} onClick={() => handleSearch(d.title)} />
                    ))}
                  </HorizontalCarousel>
                </div>
              </div>
            </motion.div>
          )}

          {state.activeTab === 'explore' && (
            <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-6 md:pt-10">
              <div className="max-w-4xl mx-auto px-6 mb-16">
                 <div className="flex items-center gap-4 mb-10">
                    <button onClick={handleReset} className="p-4 rounded-full bg-slate-100 text-slate-500 hover:bg-paisa-emerald hover:text-white transition-all shadow-sm">
                      <ArrowLeft size={22} />
                    </button>
                    <div className="space-y-0.5">
                       <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">{state.busqueda}</h2>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.tacticalIntelligence}</p>
                    </div>
                 </div>
                 <SearchBox value={state.busqueda} onChange={handleSearchChange} onSearch={handleSearch} placeholder={t.searchPlaceholder} suggestions={suggestions} />
              </div>

              {state.cargando && (
                <div className="py-24 flex flex-col items-center justify-center gap-8 text-center px-8">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                     <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-4 border-dashed border-paisa-emerald/30" />
                     <motion.div animate={{ rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} className="absolute inset-4 rounded-full border-2 border-paisa-gold/30" />
                     <motion.div animate={{ rotate: [0, 45, -45, 0] }} transition={{ duration: 2, repeat: Infinity }} className="z-10">
                        <CompassIcon size={80} className="text-paisa-emerald drop-shadow-2xl" strokeWidth={1} />
                     </motion.div>
                  </div>
                  <div className="space-y-4 max-w-sm">
                     <p className="text-xl font-serif italic text-slate-600">"{t.indexingMsgs[loadingMsgIdx]}"</p>
                  </div>
                </div>
              )}

              {!state.cargando && state.unifiedResults.length > 0 && (
                <div className="space-y-20 pb-20">
                  {state.unifiedResults.map((res, i) => (
                    <PlaceCard key={i} data={res} lang={state.language} i18n={t.placeCard} isFavorite={state.favoritePlaces.some(f => f.titulo === res.titulo)} onToggleFavorite={() => toggleFavorite(res)} onRequestPayment={handleOpenPayment} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {state.activeTab === 'favorites' && (
            <motion.div key="favorites" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-6 md:pt-10">
              <div className="max-w-4xl mx-auto px-6 mb-16">
                 <div className="flex items-center gap-4 mb-10">
                    <button onClick={handleReset} className="p-4 rounded-full bg-slate-100 text-slate-500 hover:bg-paisa-emerald hover:text-white transition-all shadow-sm">
                      <ArrowLeft size={22} />
                    </button>
                    <div className="space-y-0.5">
                       <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">{t.favoritesTitle}</h2>
                    </div>
                 </div>
              </div>
              {state.favoritePlaces.length === 0 ? (
                <div className="max-w-xl mx-auto py-32 text-center space-y-8 px-6">
                  <Heart size={48} className="text-slate-200 mx-auto" />
                  <p className="text-sm font-serif italic text-slate-400">"Empiece a explorar y guarde los pueblos que más le gusten."</p>
                </div>
              ) : (
                <div className="space-y-20 pb-20">
                  {state.favoritePlaces.map((res, i) => (
                    <PlaceCard key={i} data={res} lang={state.language} i18n={t.placeCard} isFavorite={true} onToggleFavorite={() => toggleFavorite(res)} onRequestPayment={handleOpenPayment} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="fixed bottom-28 right-8 z-[500] flex flex-col items-end gap-3 pointer-events-none">
        <AnimatePresence>
          {showPaymentHint && (
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-slate-900 text-white px-6 py-4 rounded-3xl shadow-2xl border border-white/10 relative">
              <p className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{t.payment.hint}</p>
              <div className="absolute top-full right-6 w-3 h-3 bg-slate-900 rotate-45 -translate-y-1.5 border-r border-b border-white/10" />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={handleOpenPayment}
          className="pointer-events-auto h-20 px-8 bg-paisa-emerald text-white rounded-full shadow-[0_15px_45px_rgba(45,122,76,0.3)] flex items-center gap-6 border-4 border-white transition-all group overflow-hidden"
          title={t.payment.floatingBtn}
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
             <Coffee size={20} className="text-paisa-emerald group-hover:animate-bounce" />
          </div>
          <span className="text-[12px] font-black uppercase tracking-[0.2em] whitespace-nowrap">{t.payment.floatingBtn}</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPaymentModal(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-white rounded-[56px] overflow-hidden shadow-4xl p-10 space-y-10">
              <button onClick={() => setShowPaymentModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 p-2 z-20"><X size={24} /></button>
              
              <AnimatePresence mode="wait">
                {!selectedPaymentMethod ? (
                  <motion.div key="methods" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-10">
                    <div className="space-y-6 text-center">
                       <div className="relative mx-auto w-24 h-24">
                          <div className="absolute inset-0 bg-paisa-gold/20 rounded-[32px] rotate-6" />
                          <div className="absolute inset-0 bg-paisa-emerald rounded-[32px] flex items-center justify-center shadow-lg shadow-emerald-900/30">
                             <Coffee size={44} className="text-paisa-gold" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-950">{t.payment.modalTitle}</h2>
                          <p className="text-[13px] font-serif italic text-slate-500 px-4 leading-relaxed opacity-80">
                            "{t.payment.modalSubtitle}"
                          </p>
                       </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { id: 'nequi', label: t.payment.nequi, icon: Wallet, color: '#FF00BF' },
                        { id: 'bancolombia', label: t.payment.bancolombia, icon: Landmark, color: '#2D7A4C' },
                        { id: 'card', label: t.payment.card, icon: CreditCard, color: '#1A242F' }
                      ].map((method) => (
                        <button 
                          key={method.id} 
                          onClick={() => setSelectedPaymentMethod(method.id)}
                          className="w-full group flex items-center justify-between p-5 rounded-[28px] border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl transition-all text-left"
                        >
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:bg-slate-50 transition-colors" style={{ color: method.color }}>
                              <method.icon size={24} />
                            </div>
                            <span className="text-[13px] font-black uppercase tracking-widest text-slate-700">{method.label}</span>
                          </div>
                          <ChevronRight size={18} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <button onClick={() => setShowPaymentModal(false)} className="w-full py-6 bg-paisa-emerald text-white rounded-[28px] font-black uppercase text-[12px] tracking-[0.25em] shadow-2xl hover:bg-paisa-charcoal transition-all transform active:scale-95">
                        {t.payment.confirm}
                      </button>
                      <div className="flex items-center justify-center gap-2 opacity-30">
                         <Shield size={10} />
                         <span className="text-[8px] font-black uppercase tracking-widest">{t.payment.secureNote}</span>
                      </div>
                    </div>
                  </motion.div>
                ) : selectedPaymentMethod === 'card' ? (
                  <motion.div key="helio" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 py-4">
                    <div className="space-y-3 text-center">
                       <div className="p-3 bg-slate-50 rounded-3xl w-max mx-auto text-paisa-emerald">
                          <CreditCard size={32} />
                       </div>
                       <div className="space-y-1">
                          <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-950">DONACIÓN CON TARJETA</h2>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">PROCESADO DE FORMA SEGURA POR HELIO</p>
                       </div>
                    </div>

                    <div id="helio-container" className="bg-slate-50 rounded-[40px] border border-slate-100 min-h-[400px] flex items-center justify-center relative overflow-hidden">
                       <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-20 pointer-events-none -z-0">
                          <Loader2 size={32} className="animate-spin text-slate-900" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">CARGANDO PASARELA...</span>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <button onClick={() => setSelectedPaymentMethod(null)} className="w-full py-4 border-2 border-slate-100 text-slate-400 rounded-[24px] font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all">
                         {t.payment.back}
                       </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="qr" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 py-4">
                    <div className="space-y-3 text-center">
                       <div className="p-3 bg-slate-50 rounded-3xl w-max mx-auto text-paisa-emerald">
                          <QrCode size={32} />
                       </div>
                       <div className="space-y-1">
                          <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-950">{t.payment.scanTitle}</h2>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.payment.scanSubtitle}</p>
                       </div>
                    </div>

                    <div className="relative w-full max-w-[280px] mx-auto rounded-[40px] overflow-visible shadow-2xl border-4 border-slate-100 bg-white flex flex-col items-center p-6 pb-12">
                       <div className="w-full aspect-square bg-[#240124] rounded-3xl flex items-center justify-center overflow-hidden mb-8">
                         <img 
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Y2l9P34jD62kM8Q9qG7p7H9P34jD62kM8Q9qG7p7H9.png" 
                          className="w-full h-full object-contain" 
                          alt="QR Payment David Pineda" 
                         />
                       </div>
                       
                       <div className="flex flex-col items-center gap-2">
                          <span className="px-5 py-2 bg-slate-900 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl">
                            DAVID PINEDA
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 tracking-wider">
                            dpineda86@gmail.com
                          </span>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <button onClick={() => setSelectedPaymentMethod(null)} className="w-full py-4 border-2 border-slate-100 text-slate-400 rounded-[24px] font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all">
                         {t.payment.back}
                       </button>
                       <button onClick={() => setShowPaymentModal(false)} className="w-full py-5 bg-paisa-emerald text-white rounded-[24px] font-black uppercase text-[11px] tracking-[0.25em] shadow-xl transition-all">
                        {t.payment.confirm}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AppNavigation onReset={handleReset} isLiveActive={isLiveActive} onLiveToggle={() => {}} hasResults={state.unifiedResults.length > 0 || state.favoritePlaces.length > 0} label={isLiveActive ? t.listening : "Asistente Vivo"} currentLang={state.language} onLangChange={(l) => setState(s => ({ ...s, language: l }))} isAccessibilityActive={state.accessibilityMode} onAccessibilityToggle={() => setState(s => ({ ...s, accessibilityMode: !state.accessibilityMode }))} t={t.navigation} />
      <Footer t={t.footer} />
    </div>
  );
}
