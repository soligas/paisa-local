
import React, { useState, useEffect } from 'react';
import { Search, Loader2, ArrowLeft, Heart, Compass, ShieldCheck, Activity, TrendingUp, Sparkles, Truck, Coffee, MapPin, Waves, Mountain, Wind, Star, Target, Info, AlertCircle, RefreshCw, ChevronRight, Utensils, Palette, Navigation as NavIcon, Map as MapIcon, Compass as CompassIcon } from 'lucide-react';
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
  
  const t = TRANSLATIONS[state.language] || TRANSLATIONS.es;

  useEffect(() => {
    let interval: any;
    if (state.cargando) {
      interval = setInterval(() => {
        setLoadingMsgIdx(prev => (prev + 1) % (t.indexingMijo?.length || 1));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [state.cargando, t.indexingMijo]);

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
      setState(s => ({ ...s, cargando: false, error: "Mijo, falló la conexión táctica. Intente de nuevo." }));
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

  return (
    <div className={`min-h-screen transition-colors duration-500 ${state.activeTab === 'home' ? 'bg-paisa-light' : 'bg-white'}`}>
      
      {/* Regional Pulse Ticker */}
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
                    <Badge color="gold">INTELIGENCIA TURÍSTICA</Badge>
                    <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-slate-950 leading-[0.8] mb-4">
                      ANTIOQUIA<br/><span className="text-paisa-emerald">TÁCTICA</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-slate-400 font-serif italic max-w-2xl mx-auto px-4 leading-relaxed">
                      "{t.heroDescription}"
                    </p>
                  </div>

                  <div className="space-y-8">
                    <SearchBox value={state.busqueda} onChange={handleSearchChange} onSearch={handleSearch} placeholder={t.searchPlaceholder} suggestions={suggestions} />
                    <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto px-4">
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
                            className="flex items-center gap-3 px-6 py-4 rounded-3xl bg-white border border-slate-100 shadow-xl hover:border-paisa-emerald/20 hover:bg-emerald-50/30 transition-all text-slate-500 hover:text-paisa-emerald group"
                         >
                            <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-paisa-emerald group-hover:text-white transition-all">
                               <cat.icon size={14} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
                         </motion.button>
                       ))}
                    </div>

                    <motion.button 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      onClick={handleSurpriseMe}
                      className="group flex items-center justify-center gap-3 mx-auto px-6 py-2 rounded-full hover:bg-paisa-emerald/5 transition-all"
                    >
                      <Sparkles size={16} className="text-paisa-gold group-hover:animate-spin" />
                      <span className="text-[12px] font-black uppercase tracking-widest text-slate-400 group-hover:text-paisa-emerald">
                        {t.surpriseMe}
                      </span>
                    </motion.button>
                  </div>
                </div>

                <div className="pt-12 space-y-10">
                   <SectionHeader title="TERRITORIOS" subtitle="Navegue por las 9 subregiones de nuestra tierra" icon={MapIcon} />
                   <EpicAntioquiaMap onSelectRegion={(reg) => handleSearch(reg)} lang={state.language} />
                </div>

                <div className="pt-12">
                  <SectionHeader title="TESOROS" subtitle="Pueblos que todo arriero debe conocer" icon={Mountain} />
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
                     <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-4 border-dashed border-paisa-emerald/30"
                     />
                     <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 rounded-full border-2 border-paisa-gold/30"
                     />
                     <motion.div 
                        animate={{ rotate: [0, 45, -45, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="z-10"
                     >
                        <CompassIcon size={80} className="text-paisa-emerald drop-shadow-2xl" strokeWidth={1} />
                     </motion.div>
                  </div>
                  <div className="space-y-4 max-w-sm">
                     <p className="text-xl font-serif italic text-slate-600">"{t.indexingMijo[loadingMsgIdx]}"</p>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">
                        Rastreando coordenadas y precios locales...
                     </p>
                  </div>
                </div>
              )}

              {!state.cargando && state.unifiedResults.length > 0 && (
                <div className="space-y-20 pb-20">
                  {state.unifiedResults.map((res, i) => (
                    <PlaceCard key={i} data={res} lang={state.language} i18n={t.placeCard} isFavorite={state.favoritePlaces.some(f => f.titulo === res.titulo)} onToggleFavorite={() => toggleFavorite(res)} />
                  ))}
                </div>
              )}
              
              {!state.cargando && state.unifiedResults.length === 0 && !state.error && (
                <div className="max-w-xl mx-auto py-32 text-center space-y-8 px-6">
                  <CompassIcon size={48} className="text-slate-200 mx-auto" />
                  <p className="text-sm font-serif italic text-slate-400">"Mijo, no encontramos nada bajo ese nombre."</p>
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
                  <p className="text-sm font-serif italic text-slate-400">"Mijo, empiece a explorar y guarde los pueblos que más le gusten."</p>
                </div>
              ) : (
                <div className="space-y-20 pb-20">
                  {state.favoritePlaces.map((res, i) => (
                    <PlaceCard key={i} data={res} lang={state.language} i18n={t.placeCard} isFavorite={true} onToggleFavorite={() => toggleFavorite(res)} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AppNavigation onReset={handleReset} isLiveActive={isLiveActive} onLiveToggle={() => {}} hasResults={state.unifiedResults.length > 0 || state.favoritePlaces.length > 0} label={isLiveActive ? t.listening : "Asistente Vivo"} currentLang={state.language} onLangChange={(l) => setState(s => ({ ...s, language: l }))} isAccessibilityActive={state.accessibilityMode} onAccessibilityToggle={() => setState(s => ({ ...s, accessibilityMode: !state.accessibilityMode }))} t={t.navigation} />
      <Footer t={t.footer} />
    </div>
  );
}
