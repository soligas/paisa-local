
import React, { useState, useEffect } from 'react';
import { Search, Loader2, Accessibility, ArrowLeft, Radio, TrendingUp, Sparkles, Heart, Compass, Trophy, MessageSquare, Map as MapIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function App() {
  const [state, setState] = useState<AppState & { favorites: string[] }>({
    busqueda: '', cargando: false, error: null, tarjeta: null,
    unifiedResults: [], language: 'es', activeTab: 'home',
    accessibilityMode: false,
    favorites: JSON.parse(localStorage.getItem('paisa_favs') || '[]')
  });

  const [showFavorites, setShowFavorites] = useState(false);

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

  const displayedResults = showFavorites 
    ? state.unifiedResults.filter(r => state.favorites.includes(r.titulo))
    : state.unifiedResults;

  return (
    <div className={`min-h-screen transition-colors duration-500 flex flex-col ${state.accessibilityMode ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Status Bar */}
      <div className={`py-2 px-6 text-[9px] font-black uppercase tracking-[0.3em] flex justify-between items-center ${state.accessibilityMode ? 'bg-paisa-gold text-black' : 'bg-slate-900 text-white'}`}>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Pipeline: {state.cargando ? 'Consultando Index...' : 'Conectado'}</span>
        </div>
        <div className="hidden md:block">Grounding: Google Search API 2025</div>
      </div>

      <header className="p-6 max-w-7xl mx-auto w-full flex justify-between items-center">
        <PaisaLogo isDark={state.accessibilityMode} className="scale-90" onClick={handleReset} />
        <div className="flex items-center gap-4">
           {state.unifiedResults.length > 0 && (
             <button onClick={handleReset} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">
                <ArrowLeft size={14} /> Volver
             </button>
           )}
           
           <button 
             onClick={() => setShowFavorites(!showFavorites)}
             className={`relative p-3 rounded-full border transition-all ${showFavorites ? 'bg-red-500 text-white border-red-500' : 'bg-white border-slate-100 text-slate-400'}`}
             title="Ver Favoritos"
           >
             <Heart size={20} fill={showFavorites ? "white" : "none"} />
             {state.favorites.length > 0 && !showFavorites && (
               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                 {state.favorites.length}
               </span>
             )}
           </button>

           <button 
            onClick={() => setState(s => ({...s, accessibilityMode: !s.accessibilityMode}))}
            className={`p-3 rounded-full border transition-all ${state.accessibilityMode ? 'bg-paisa-gold text-black border-paisa-gold' : 'bg-white border-slate-100 text-slate-400'}`}
          >
            <Accessibility size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-4 pb-12">
        <AnimatePresence mode="wait">
          {!displayedResults.length && !state.cargando ? (
            <motion.div 
              key="search-home"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="space-y-24 py-12"
            >
              {/* Hero Search Section */}
              <div className="text-center space-y-12">
                <div className="space-y-4">
                  <h1 className={`text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] ${state.accessibilityMode ? 'text-white' : 'text-slate-900'}`}>
                    Buscador <br /> <span className={state.accessibilityMode ? 'text-paisa-gold' : 'text-paisa-emerald'}>Táctico 2025</span>
                  </h1>
                  <p className="text-xl font-serif italic opacity-60">
                    {showFavorites ? "No tienes favoritos guardados todavía." : "Datos reales indexados para viajeros que no comen cuento."}
                  </p>
                  {showFavorites && (
                    <button onClick={() => setShowFavorites(false)} className="text-xs font-black uppercase tracking-[0.2em] text-paisa-emerald hover:underline">Volver a buscar</button>
                  )}
                </div>

                {!showFavorites && (
                  <div className="relative max-w-2xl mx-auto">
                    <input 
                      type="text"
                      placeholder="¿A qué pueblo vamos, mijo? (Ej: Urrao, Jardín...)"
                      className={`w-full p-8 rounded-[32px] text-xl md:text-2xl outline-none border-2 transition-all shadow-2xl
                        ${state.accessibilityMode ? 'bg-zinc-900 border-paisa-gold text-white' : 'bg-white border-slate-100 focus:border-paisa-emerald'}`}
                      value={state.busqueda}
                      onChange={e => setState(s => ({...s, busqueda: e.target.value}))}
                      onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    />
                    <button 
                      onClick={() => handleSearch()} 
                      className="absolute right-3 top-3 bottom-3 px-8 rounded-2xl bg-paisa-emerald text-white font-black uppercase text-[10px] tracking-widest hover:brightness-110 active:scale-95 transition-all"
                    >
                      Indexar
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-3 opacity-40">
                  {['Urrao 2025', 'Jericó hoy', 'Guatapé precios'].map(tag => (
                    <button key={tag} onClick={() => { setState(s => ({...s, busqueda: tag})); handleSearch(tag); }} className="px-4 py-2 rounded-full border border-current text-[9px] font-black uppercase tracking-widest hover:opacity-100">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discovery Section */}
              <section className="space-y-10">
                <SectionHeader 
                  title="Explorar" 
                  subtitle="Descubre Antioquia por subregiones y tesoros locales." 
                  icon={Compass} 
                />
                <HorizontalCarousel>
                  {DISCOVERY_ITEMS.map((item, i) => (
                    <DiscoveryCard 
                      key={i}
                      title={item.title}
                      subtitle={item.subtitle}
                      image={item.image}
                      onClick={() => { setState(s => ({...s, busqueda: item.title})); handleSearch(item.title); }}
                    />
                  ))}
                </HorizontalCarousel>
              </section>

              {/* Map Section */}
              <section className="space-y-10">
                <EpicAntioquiaMap 
                  lang={state.language} 
                  onSelectRegion={(name) => { setState(s => ({...s, busqueda: name})); handleSearch(name); }} 
                />
              </section>

              {/* Culture Section */}
              <section className="space-y-10">
                <SectionHeader 
                  title="Dichos" 
                  subtitle="Aprende a hablar como un arriero auténtico." 
                  icon={MessageSquare} 
                />
                <HorizontalCarousel>
                  {DICHOS_PAISAS.map((dicho, i) => (
                    <CultureCard key={i} word={dicho.word} meaning={dicho.meaning} isDark={state.accessibilityMode} />
                  ))}
                </HorizontalCarousel>
              </section>

              {/* Challenges Section */}
              <section className="space-y-10 pb-12">
                <SectionHeader 
                  title="Misiones" 
                  subtitle="Completa retos, gana berraquera y sube de nivel." 
                  icon={Trophy} 
                />
                <HorizontalCarousel>
                  {MISIONES.map((mision, i) => (
                    <ChallengeCard key={i} challenge={mision} isDark={state.accessibilityMode} />
                  ))}
                </HorizontalCarousel>
              </section>

            </motion.div>
          ) : (
            <motion.div 
              key="results-view"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="space-y-12"
            >
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
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[1000] flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <Loader2 className="animate-spin text-paisa-emerald" size={64} />
              <Sparkles className="absolute -top-2 -right-2 text-paisa-gold animate-bounce" size={24} />
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-black uppercase tracking-tighter">Indexando el Destino</p>
              <p className="text-sm font-serif italic opacity-60">Consultando TikTok, Instagram e Invías para datos 2025...</p>
            </div>
          </div>
        )}
      </main>

      <Footer isDark={state.accessibilityMode} />
    </div>
  );
}
