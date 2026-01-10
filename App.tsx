
import React, { useState, useEffect } from 'react';
import { Search, Loader2, Accessibility, ArrowLeft, Radio, TrendingUp, Sparkles, Heart, Compass, Trophy, MessageSquare, Map as MapIcon, Info, ShieldCheck, Bus, Target, Globe, HeartHandshake, Eye, Code2, Cpu } from 'lucide-react';
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
             className={`relative p-3 rounded-full border transition-all ${showFavorites ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-200' : 'bg-white border-slate-100 text-slate-400'}`}
             title="Mis Favoritos"
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

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-4">
        <AnimatePresence mode="wait">
          {!displayedResults.length && !state.cargando ? (
            <motion.div 
              key="search-home"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16 py-8"
            >
              {/* Hero Search Section - Título Inspirador */}
              <div className="text-center space-y-10">
                <div className="space-y-6">
                  <h1 className={`text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] ${state.accessibilityMode ? 'text-white' : 'text-slate-900'}`}>
                    Antioquia <br /> <span className={state.accessibilityMode ? 'text-paisa-gold' : 'text-paisa-emerald'}>Te Espera</span>
                  </h1>
                  
                  {/* Explicación de lo que hacemos */}
                  <div className="max-w-2xl mx-auto space-y-4">
                    <p className="text-xl md:text-2xl font-serif italic text-slate-500 leading-relaxed">
                      "Indexamos en tiempo real los 125 municipios de Antioquia para que explorés con datos reales, itinerarios con IA y la sabiduría de los locales."
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 pt-2 opacity-60">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Bus size={14} className="text-paisa-emerald" /> Precios de Bus</div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><ShieldCheck size={14} className="text-paisa-emerald" /> Estado de Vías</div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Sparkles size={14} className="text-paisa-emerald" /> Itinerarios IA</div>
                    </div>
                  </div>
                  
                  {showFavorites && (
                    <button onClick={() => setShowFavorites(false)} className="text-xs font-black uppercase tracking-[0.2em] text-paisa-emerald hover:underline">Volver a explorar</button>
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

              {/* Nueva Sección: Quiénes Somos y Por Qué Confiar */}
              <section className="px-4 md:px-0">
                <div className="bg-white rounded-[64px] p-10 md:p-16 border border-slate-100 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-20 opacity-5 -rotate-12">
                     <Eye size={200} />
                  </div>
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                         <Info size={24} className="text-paisa-emerald" />
                         <span className="text-[11px] font-black uppercase tracking-[0.4em] text-paisa-emerald">Transparencia Total</span>
                      </div>
                      <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-slate-900">
                        Tecnología para <br /> <span className="text-paisa-gold">Viajeros Conscientes</span>
                      </h2>
                      <p className="text-xl text-slate-500 font-serif italic leading-relaxed">
                        Paisa Local Pro nació como un proyecto de impacto social. No somos una agencia de viajes; somos una herramienta tecnológica que conecta la sabiduría arriera con el poder de la Inteligencia Artificial.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 pt-2">
                         <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                            <p className="text-4xl font-black text-paisa-emerald">125</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pueblos Indexados</p>
                         </div>
                         <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                            <p className="text-4xl font-black text-paisa-emerald">100%</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Datos Verificados</p>
                         </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                       {TRUST_CARDS.map((card, i) => (
                         <motion.div 
                           key={i}
                           whileHover={{ x: 10 }}
                           className={`p-8 rounded-[40px] ${card.bg} border border-current/5 flex items-start gap-6`}
                         >
                           <div className={`p-4 rounded-2xl bg-white shadow-sm ${card.color}`}>
                              <card.icon size={24} />
                           </div>
                           <div className="space-y-2">
                              <h4 className={`text-lg font-black uppercase tracking-tight ${card.color}`}>{card.title}</h4>
                              <p className="text-sm font-medium text-slate-600 leading-relaxed">{card.text}</p>
                           </div>
                         </motion.div>
                       ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Discovery Section */}
              <section className="space-y-8">
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
              <section className="space-y-8">
                <EpicAntioquiaMap 
                  lang={state.language} 
                  onSelectRegion={(name) => { setState(s => ({...s, busqueda: name})); handleSearch(name); }} 
                />
              </section>

              {/* Culture Section */}
              <section className="space-y-8">
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
              <section className="space-y-8">
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
              className="space-y-12 pb-12"
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
