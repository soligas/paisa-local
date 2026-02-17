
import React, { useState, useEffect } from 'react';
import { 
  Search, Loader2, ArrowLeft, Heart, Compass, ShieldCheck, Activity, TrendingUp, Sparkles, 
  Truck, Coffee, MapPin, Waves, Mountain, Wind, Star, Target, Info, AlertCircle, RefreshCw, 
  ChevronRight, Utensils, Palette, Navigation as NavIcon, Map as MapIcon, Compass as CompassIcon,
  Wallet, CreditCard, X, Shield, Landmark, Layers, Database, ChevronDown, QrCode, ExternalLink,
  Lock, CheckCircle, Key, Copy, Share2, Target as TargetIcon, ShieldCheck as SecurityIcon, Zap,
  ArrowRight
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const t = TRANSLATIONS[state.language] || TRANSLATIONS.es;

  // Correct URL from user prompt to fix the redirection
  const NOTION_URL = 'https://rift-polka-627.notion.site/SDFS-30a574549d5b8030a779f870d0a60392?source=copy_link';

  useEffect(() => {
    let interval: any;
    if (state.cargando) {
      interval = setInterval(() => {
        setLoadingMsgIdx(prev => (prev + 1) % (t.indexingMsgs?.length || 1));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [state.cargando, t.indexingMsgs]);

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
      setState(s => ({ ...s, cargando: false, error: "Error en la indexación táctica." }));
    }
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

  const handleOpenPaymentLink = () => {
    // Exact redirection using the user-provided full URL
    window.open(NOTION_URL, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] selection:bg-[#2D7A4C] selection:text-white">
      {/* Real-time information ticker */}
      <div className="bg-[#020617] overflow-hidden h-12 flex items-center border-b border-[#1e293b] sticky top-0 z-[110]">
        <div className="flex items-center animate-marquee whitespace-nowrap px-6">
          {t.pulseItems.concat(t.pulseItems).map((item: string, i: number) => (
            <span key={i} className="font-tactical text-[10px] uppercase tracking-[0.2em] text-[#94a3b8] flex items-center gap-4 mr-16">
              <div className="w-2 h-2 bg-[#2D7A4C] rounded-full shadow-[0_0_10px_#2D7A4C]" /> {item}
            </span>
          ))}
        </div>
      </div>

      <header className="sticky top-12 z-[100] bg-white border-b border-[#e2e8f0] px-6 py-5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <PaisaLogo onClick={handleReset} />
          <button 
            onClick={() => setState(s => ({ ...s, activeTab: 'favorites' }))}
            className={`w-14 h-14 rounded-full border transition-all relative flex items-center justify-center group ${state.activeTab === 'favorites' ? 'bg-[#2D7A4C] text-white shadow-lg border-[#2D7A4C]' : 'bg-[#f1f5f9] text-[#64748b] border-transparent hover:border-[#2D7A4C]/30'}`}
          >
             <Heart size={22} strokeWidth={2.5} fill={state.favoritePlaces.length > 0 ? "currentColor" : "none"} className="group-hover:scale-110 transition-transform" />
             {state.favoritePlaces.length > 0 && (
               <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#D4A574] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-md">
                 {state.favoritePlaces.length}
               </span>
             )}
          </button>
        </div>
      </header>

      <main className="pb-40">
        <AnimatePresence mode="wait">
          {state.activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-16 md:pt-24">
              <div className="max-w-6xl mx-auto px-6 space-y-40">
                <div className="text-center space-y-12">
                  <div className="space-y-4">
                    <h1 className="text-6xl md:text-[8.5rem] font-black uppercase tracking-tighter text-[#0f172a] leading-[0.85] select-none">
                      {t.heroTitle}
                    </h1>
                    <h2 className="text-4xl md:text-[6.5rem] font-black uppercase tracking-tighter text-[#2D7A4C] leading-[0.85] drop-shadow-sm">
                      {t.heroSubtitle}
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl font-medium text-slate-500 mt-12 leading-relaxed italic px-8">
                      "{t.heroDescription}"
                    </p>
                  </div>
                  <SearchBox value={state.busqueda} onChange={handleSearchChange} onSearch={handleSearch} placeholder={t.searchPlaceholder} searchLabel={t.searchBtn} suggestions={suggestions} />
                </div>

                <section className="bg-white rounded-[64px] p-12 md:p-24 border border-slate-100 shadow-4xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32" />
                   <div className="max-w-4xl space-y-12 relative z-10">
                      <div className="space-y-6">
                        <Badge color="emerald" className="w-fit !rounded-[12px] px-6 py-3 font-bold !bg-[#2D7A4C]">{t.about.title}</Badge>
                        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-[#0f172a] leading-none">
                          {t.about.subtitle}
                        </h2>
                      </div>
                      <p className="text-xl md:text-3xl font-serif italic text-slate-600 leading-relaxed">
                        "{t.about.description}"
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-8">
                         {t.about.pillars.map((pillar: any, idx: number) => (
                           <div key={idx} className="space-y-6 group">
                              <div className="w-20 h-20 rounded-[30px] bg-white border-2 border-slate-100 text-slate-900 flex items-center justify-center shadow-[0_12px_30px_-5px_rgba(0,0,0,0.1)] group-hover:scale-110 group-hover:bg-[#2D7A4C] group-hover:text-white transition-all duration-300">
                                 {pillar.icon === 'database' ? <Database size={32} strokeWidth={2.5} /> : pillar.icon === 'shield' ? <SecurityIcon size={32} strokeWidth={2.5} /> : <Mountain size={32} strokeWidth={2.5} />}
                              </div>
                              <div className="space-y-2">
                                 <h4 className="text-lg font-black uppercase tracking-widest text-slate-900">{pillar.title}</h4>
                                 <p className="text-sm font-medium text-slate-500 leading-relaxed">{pillar.desc}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </section>
                
                <div className="relative pt-12">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 bg-white rounded-full border border-slate-200 shadow-xl text-[11px] font-black text-[#2D7A4C] uppercase tracking-widest z-10">
                    <MapIcon size={16} strokeWidth={3} /> {t.mapLabels.section}
                  </div>
                  <EpicAntioquiaMap 
                    onSelectRegion={handleSearch} 
                    lang={state.language} 
                    t={t.mapLabels} 
                    onRequestPayment={() => setShowPaymentModal(true)}
                  />
                </div>

                <div className="pt-20">
                  <SectionHeader title={t.reportsTitle} subtitle={t.reportsSubtitle} icon={Mountain} />
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
            <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-12 md:pt-16">
              <div className="max-w-4xl mx-auto px-6 mb-20">
                 <button onClick={handleReset} className="mb-8 flex items-center gap-4 text-[#2D7A4C] font-black uppercase tracking-widest text-[12px] group">
                   <div className="p-3 rounded-2xl bg-[#2D7A4C] text-white shadow-lg group-hover:scale-110 transition-transform">
                    <ArrowLeft size={18} strokeWidth={3} />
                   </div> 
                   {t.backBtn}
                 </button>
                 <SearchBox value={state.busqueda} onChange={handleSearchChange} onSearch={handleSearch} placeholder={t.searchPlaceholder} searchLabel={t.searchBtn} suggestions={suggestions} />
              </div>
              {state.cargando ? (
                <div className="py-40 flex flex-col items-center justify-center gap-10 text-center px-10">
                   <div className="relative">
                     <div className="absolute inset-0 animate-ping bg-[#2D7A4C]/20 rounded-full" />
                     <Loader2 className="animate-spin text-[#2D7A4C] relative z-10" size={80} strokeWidth={2} />
                   </div>
                   <p className="text-3xl font-serif italic text-[#475569] max-w-xl leading-relaxed">"{t.indexingMsgs[loadingMsgIdx]}"</p>
                </div>
              ) : (
                <div className="space-y-48 pb-32">
                  {state.unifiedResults.map((res, i) => (
                    <PlaceCard key={i} data={res} lang={state.language} i18n={t.placeCard} isFavorite={state.favoritePlaces.some(f => f.titulo === res.titulo)} onToggleFavorite={() => toggleFavorite(res)} onRequestPayment={() => setShowPaymentModal(true)} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-32 right-8 z-[500] flex flex-col items-end gap-4">
        <motion.button 
          whileHover={{ scale: 1.05, y: -4 }} 
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPaymentModal(true)}
          className="h-20 px-10 bg-[#2D7A4C] text-white rounded-[30px] shadow-[0_20px_40px_rgba(45,122,76,0.3)] flex items-center gap-5 border-4 border-white transition-all group pointer-events-auto ring-1 ring-slate-200"
        >
          <Coffee size={24} strokeWidth={3} className="group-hover:rotate-12 transition-transform" /> 
          <span className="text-[14px] font-black uppercase tracking-[0.2em]">{t.payment.floatingBtn}</span>
        </motion.button>
      </div>

      <AppNavigation onReset={handleReset} isLiveActive={false} onLiveToggle={() => {}} hasResults={state.unifiedResults.length > 0} label="ASISTENTE VIVO" currentLang={state.language} onLangChange={(l) => setState(s => ({ ...s, language: l }))} isAccessibilityActive={state.accessibilityMode} onAccessibilityToggle={() => setState(s => ({ ...s, accessibilityMode: !state.accessibilityMode }))} t={t.navigation} />
      <Footer t={t.footer} />
      
      {/* Tactical Payment Modal perfectly matched to screenshot */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPaymentModal(false)} className="absolute inset-0 bg-[#0a020d]/95 backdrop-blur-3xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }} className="relative w-full max-w-sm bg-[#13011a] rounded-[64px] overflow-hidden shadow-[0_50px_120px_rgba(0,0,0,0.8)] flex flex-col items-center text-white border border-white/5">
              
              {/* Close button icon */}
              <button onClick={() => setShowPaymentModal(false)} className="absolute top-10 right-10 text-white/30 hover:text-white p-2 transition-colors z-20">
                <X size={28} strokeWidth={3} />
              </button>
              
              <div className="w-full flex flex-col items-center pt-16 pb-12 px-8 space-y-12">
                {/* Header Text - Neon Cyan matching user screenshot */}
                <div className="text-center space-y-3">
                  <h3 className="text-5xl font-black uppercase tracking-[0.1em] text-[#00ffc4] drop-shadow-[0_0_20px_rgba(0,255,196,0.6)] leading-none">{t.payment.modalTitle}</h3>
                  <p className="text-[13px] font-medium text-white/60 italic leading-relaxed px-4">
                    "{t.payment.modalSubtitle}"
                  </p>
                </div>

                {/* Tactical Central Container with Lighting Bolt and Gold Button */}
                <div className="w-full bg-[#1e0a24]/90 border border-white/5 rounded-[60px] p-10 flex flex-col items-center gap-12 relative overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]">
                   
                   <div className="absolute inset-0 bg-gradient-to-b from-[#D4A574]/5 to-transparent pointer-events-none" />
                   
                   {/* Lightning Bolt Symbol precisely as shown in the center of the UI */}
                   <div className="relative p-2.5 bg-white rounded-[32px] shadow-2xl">
                     <div className="w-24 h-24 bg-[#13011a] rounded-[24px] flex items-center justify-center text-[#D4A574]">
                        <Zap size={60} strokeWidth={2.5} fill="currentColor" />
                     </div>
                   </div>

                   <div className="w-full space-y-10 flex flex-col items-center relative z-10">
                     {/* Correct Gold Button with Full URL Redirection */}
                     <button 
                        onClick={handleOpenPaymentLink}
                        className="w-full py-10 bg-[#D4A574] text-[#13011a] rounded-[38px] font-black uppercase text-[17px] tracking-[0.3em] shadow-[0_25px_60px_-10px_rgba(212,165,116,0.5)] hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-6 group border-2 border-white/10"
                     >
                       <span className="ml-6">{t.payment.mainBtn}</span>
                       <ChevronRight size={26} strokeWidth={5} className="group-hover:translate-x-3 transition-transform" />
                     </button>
                     
                     <div className="text-center">
                        <span className="text-[11px] font-black uppercase tracking-[0.6em] text-white/30">{t.payment.scanSubtitle}</span>
                     </div>
                   </div>
                </div>

                {/* Bottom Auditing Future Pill */}
                <div className="w-full pt-4">
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="w-full py-6 bg-transparent rounded-full border-2 border-[#00ffc4]/20 flex items-center justify-center gap-4 transition-all hover:bg-[#00ffc4]/5 active:scale-95"
                  >
                    <div className="w-3.5 h-3.5 bg-[#00ffc4] rounded-full animate-pulse shadow-[0_0_15px_#00ffc4]" />
                    <span className="text-[12px] font-black uppercase tracking-[0.4em] text-[#00ffc4] flex items-center gap-3">
                      <Lock size={16} className="opacity-70" /> AUDITANDO EL FUTURO
                    </span>
                  </button>
                </div>
              </div>

              <div className="h-6 w-full" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
