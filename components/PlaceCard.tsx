
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Bus, ShieldCheck, Sun, Accessibility, 
  Loader2, Truck, Compass, Star,
  MapPin, Navigation, ShieldAlert,
  Wallet, Utensils, Users, Calculator,
  ExternalLink, Banknote, Sparkles, TrendingUp, Share2, Plus, Minus,
  Activity, Instagram, Youtube, PlayCircle, Map, Waves, Coins,
  CreditCard, Store, Landmark, Info, Briefcase, Footprints, UserCheck, Bike,
  CheckCircle2, AlertCircle, Map as MapIcon, Flag, Link as LinkIcon, ShoppingCart, Coffee, Clock,
  X, Repeat, ChevronRight
} from 'lucide-react';
import { PlaceData, SupportedLang, CharcoTactico, FinancialSpot, GastroRecommendation } from '../types';
import { SafeImage } from './atoms/SafeImage';
import { generateSmartItinerary, generateTacticalRecommendations } from '../services/geminiService';
import { Badge } from './atoms/Badge';

interface PlaceCardProps {
  data: PlaceData;
  lang: SupportedLang;
  i18n: any;
  isFavorite: boolean;
  onToggleFavorite: (title: string) => void;
}

type TabType = 'logistica' | 'economia' | 'aventura';

const RouteGraphic = ({ terminal, localType }: { terminal: string, localType: string }) => {
  return (
    <div className="relative py-12 px-4 flex flex-col items-center gap-12">
      {/* Path Line */}
      <div className="absolute top-16 bottom-16 w-0.5 bg-slate-200 left-1/2 -translate-x-1/2 rounded-full" />
      
      {/* Stop: Medellín */}
      <div className="relative flex flex-col items-center gap-2">
         <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center text-slate-400 z-10 shadow-sm">
            <Flag size={18} />
         </div>
         <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Medellín</span>
      </div>

      {/* Stop: Terminal */}
      <div className="relative flex flex-col items-center gap-2">
         <div className="w-16 h-16 rounded-full bg-paisa-emerald text-white flex items-center justify-center z-10 shadow-lg ring-4 ring-white">
            <Bus size={24} />
         </div>
         <span className="text-[10px] font-black uppercase text-paisa-emerald tracking-tighter">{terminal.toUpperCase()}</span>
      </div>

      {/* Stop: Local Transport */}
      <div className="relative flex flex-col items-center gap-4 max-w-[140px] text-center">
         <div className="w-12 h-12 rounded-full bg-white border-2 border-paisa-gold flex items-center justify-center text-paisa-gold z-10 shadow-sm">
            <Bike size={18} />
         </div>
         <span className="text-[9px] font-black uppercase text-[#B48444] leading-tight tracking-tighter">
            {localType || 'BUSES CIRCULARES Y TAXIS DE MONTAÑA (WILLYS PARA VEREDAS).'}
         </span>
      </div>

      {/* Stop: Destino */}
      <div className="relative flex flex-col items-center gap-2">
         <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center z-10 shadow-xl">
            <MapPin size={18} />
         </div>
         <span className="text-[10px] font-black uppercase text-slate-900 tracking-tighter">Destino</span>
      </div>
    </div>
  );
};

export const PlaceCard: React.FC<PlaceCardProps> = ({ data, lang, i18n, isFavorite, onToggleFavorite }) => {
  const [activeTab, setActiveTab] = useState<TabType>('logistica');
  const [loadingItinerary, setLoadingItinerary] = useState(false);
  const [itinerary, setItinerary] = useState<any[] | null>(null);
  const [loadingTips, setLoadingTips] = useState(false);
  const [tips, setTips] = useState<string[] | null>(null);
  
  const [numPeople, setNumPeople] = useState(1);
  const [numMeals, setNumMeals] = useState(1);
  
  const handleGenerateItinerary = async () => {
    if (loadingItinerary) return;
    setLoadingItinerary(true);
    const result = await generateSmartItinerary(data.titulo, lang);
    if (result && result.itinerary) {
      setItinerary(result.itinerary);
    }
    setLoadingItinerary(false);
  };

  const handleGetTips = async () => {
    if (loadingTips) return;
    setLoadingTips(true);
    const results = await generateTacticalRecommendations(data.titulo, lang);
    if (results) setTips(results);
    setLoadingTips(false);
  };

  const ticketCost = data.budget?.busTicket || 35000;
  const mealCost = data.budget?.averageMeal || 25000;
  const stayCost = data.budget?.dailyStay || 80000;
  
  const totalBuses = ticketCost * numPeople * 2;
  const totalMeals = mealCost * numPeople * numMeals;
  const totalStay = stayCost * numPeople;
  const totalBudget = totalBuses + totalMeals + totalStay;

  const renderFinancialSpotIcon = (tipo: string) => {
    switch (tipo) {
      case 'ATM': return <CreditCard size={12} />;
      case 'CAMBIO': return <Repeat size={12} />;
      case 'BANCO': return <Landmark size={12} />;
      default: return <Store size={12} />;
    }
  };

  return (
    <motion.div layout className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Hero Header */}
      <div className="rounded-[40px] md:rounded-[64px] bg-white shadow-2xl border border-slate-100 overflow-hidden flex flex-col relative">
        <div className="relative h-64 md:h-[400px] w-full">
           <SafeImage src={data.imagen} alt={data.titulo} region={data.region} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
           
           <div className="absolute top-8 right-8">
              <button onClick={() => onToggleFavorite(data.titulo)} className={`p-4 rounded-full backdrop-blur-xl border transition-all shadow-2xl active:scale-90 ${isFavorite ? 'bg-red-500 text-white border-red-400' : 'bg-white/10 text-white border-white/20'}`}>
                <Heart size={20} fill={isFavorite ? "white" : "none"} />
              </button>
           </div>

           <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                 <Badge color="gold" className="bg-paisa-gold/90 backdrop-blur-sm">{data.region?.toUpperCase()}</Badge>
                 <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white leading-[0.8]">{data.titulo}</h1>
              </div>
              <div className="flex gap-2">
                 <div className="px-6 py-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 text-white text-center">
                    <span className="block text-[8px] font-black uppercase tracking-widest opacity-60">VIBE</span>
                    <span className="text-xl font-black">{data.vibeScore || 95}%</span>
                 </div>
              </div>
           </div>
        </div>
        
        <div className="p-10 md:p-14 bg-white">
           <p className="text-2xl md:text-4xl font-serif italic text-slate-400 leading-tight max-w-4xl">
             "{data.descripcion || '...'}"
           </p>
        </div>
      </div>

      {/* Selector de Pestañas */}
      <div className="sticky top-[80px] z-[40] p-2 bg-white/80 backdrop-blur-xl rounded-full gap-2 shadow-2xl border border-slate-100 flex max-w-3xl mx-auto w-full">
        {(['logistica', 'economia', 'aventura'] as TabType[]).map((tab) => {
          const isActive = activeTab === tab;
          const Icon = tab === 'logistica' ? Truck : tab === 'economia' ? Banknote : Compass;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 md:py-6 rounded-full flex items-center justify-center gap-3 transition-all duration-500 ${isActive ? 'bg-paisa-emerald text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
              <Icon size={18} />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">{i18n.tabs[tab]}</span>
            </button>
          );
        })}
      </div>

      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          
          {/* TAB: LOGÍSTICA */}
          {activeTab === 'logistica' && (
            <motion.div key="log" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-[#F7FBF9] p-10 rounded-[56px] border border-[#EAF5EF] space-y-10 shadow-sm relative overflow-hidden">
                  <h3 className="text-xl font-black uppercase tracking-widest text-[#1A4731] flex items-center gap-3"><Bus size={24} /> {i18n.logisticsTitle}</h3>
                  
                  <div className="flex justify-center gap-4">
                    <a href={data.terminalUrl || '#'} target="_blank" className="px-4 py-2 bg-white border border-slate-200 rounded-full text-[9px] font-black uppercase text-slate-400 hover:text-paisa-emerald transition-colors flex items-center gap-2">
                       <Map size={10} /> {i18n.locationTerminal}
                    </a>
                    <a href={data.mapUrl || '#'} target="_blank" className="px-4 py-2 bg-white border border-slate-200 rounded-full text-[9px] font-black uppercase text-slate-400 hover:text-paisa-emerald transition-colors flex items-center gap-2">
                       <MapPin size={10} /> {i18n.locationDestino}
                    </a>
                  </div>

                  <RouteGraphic terminal={data.terminalInfo?.split(' ').pop() || 'Terminal'} localType={data.localMobility?.type || ''} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 block mb-4">{i18n.buses}</span>
                        <span className="text-lg md:text-xl font-black text-slate-900 leading-tight">
                          {data.busFrequency || '...'}
                        </span>
                     </div>
                     <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 block mb-4">{i18n.departure}</span>
                        <span className="text-xl md:text-2xl font-black text-slate-900">{data.terminalInfo || '...'}</span>
                     </div>
                  </div>
               </div>
               <div className="bg-slate-950 p-10 rounded-[56px] text-white space-y-8 min-h-[400px]">
                  <h3 className="text-xl font-black uppercase tracking-widest text-paisa-gold flex items-center gap-3"><Briefcase size={24} /> {i18n.packingTitle}</h3>
                  <div className="grid grid-cols-1 gap-4">
                     {(data.packingList && data.packingList.length > 0 ? data.packingList : ["Bloqueador solar", "Repelente", "Saco ligero", "Cámara", "Efectivo"]).map((item, idx) => (
                       <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                          <CheckCircle2 size={16} className="text-paisa-gold" />
                          <span className="text-sm font-bold uppercase tracking-widest">{item}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}

          {/* TAB: ECONOMÍA */}
          {activeTab === 'economia' && (
            <motion.div key="eco" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="bg-white p-10 rounded-[56px] border border-slate-100 space-y-8 shadow-xl">
                    <h3 className="text-xl font-black uppercase tracking-widest text-slate-900 flex items-center gap-3"><Landmark size={24} className="text-paisa-emerald" /> {i18n.bankTitle}</h3>
                    
                    <div className="p-6 rounded-[32px] bg-slate-50 border border-slate-200">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-relaxed text-center">
                          {data.paymentMethods?.tacticalNote || i18n.paymentNote}
                       </p>
                    </div>

                    <div className="space-y-6">
                       <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-3xl shadow-sm">
                          <Store size={18} className="text-paisa-emerald" />
                          <div className="flex flex-col">
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">DÍA DE MERCADO</span>
                             <span className="text-xs font-black text-slate-700">{data.marketDay || '...'}</span>
                          </div>
                       </div>

                       <div className="space-y-3 pt-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block px-2">LUGARES DE RETIRO Y COMPRA</span>
                          {(data.financialSpots && data.financialSpots.length > 0 ? data.financialSpots : [
                            { nombre: 'Bancolombia (Corresponsal)', tipo: 'CORRESPONSAL' },
                            { nombre: 'Cajero Servibanca', tipo: 'ATM' },
                            { nombre: 'Western Union', tipo: 'CAMBIO' }
                          ]).map((spot: any, idx: number) => (
                            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white rounded-xl shadow-sm text-paisa-emerald">
                                    {renderFinancialSpotIcon(spot.tipo)}
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-700 uppercase">{spot.nombre}</span>
                               </div>
                               <Badge color="slate" className="text-[7px]">{spot.tipo}</Badge>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>

                  <div className="bg-[#FEFCE8] p-10 rounded-[56px] border border-amber-100 lg:col-span-2 space-y-8 shadow-sm">
                    <div className="flex justify-between items-center px-2">
                       <h3 className="text-xl md:text-3xl font-black uppercase tracking-widest text-[#5C3F1E] flex items-center gap-3">
                        <Calculator size={24} /> {i18n.calcTitle}
                       </h3>
                       <Badge color="gold" className="bg-[#D4A574]/80 text-[#5C3F1E]">VIGENTE 2024</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-12">
                          <div className="space-y-6">
                             <div className="flex justify-between items-center px-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#5C3F1E]">{i18n.travellers}</span>
                                <div className="flex items-center gap-4">
                                   <button onClick={() => setNumPeople(Math.max(1, numPeople - 1))} className="w-10 h-10 rounded-full bg-white border border-amber-200 flex items-center justify-center text-amber-900 shadow-sm"><Minus size={14}/></button>
                                   <span className="text-3xl font-black text-amber-900 w-6 text-center">{numPeople}</span>
                                   <button onClick={() => setNumPeople(numPeople + 1)} className="w-10 h-10 rounded-full bg-white border border-amber-200 flex items-center justify-center text-amber-900 shadow-sm"><Plus size={14}/></button>
                                </div>
                             </div>
                             <div className="flex justify-between items-center px-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#5C3F1E]">{i18n.mealsPerDay}</span>
                                <div className="flex items-center gap-4">
                                   <button onClick={() => setNumMeals(Math.max(1, numMeals - 1))} className="w-10 h-10 rounded-full bg-white border border-amber-200 flex items-center justify-center text-amber-900 shadow-sm"><Minus size={14}/></button>
                                   <span className="text-3xl font-black text-amber-900 w-6 text-center">{numMeals}</span>
                                   <button onClick={() => setNumMeals(numMeals + 1)} className="w-10 h-10 rounded-full bg-white border border-amber-200 flex items-center justify-center text-amber-900 shadow-sm"><Plus size={14}/></button>
                                </div>
                             </div>
                          </div>

                          <div className="space-y-6 pt-6 border-t border-amber-200/50">
                             <div className="flex items-center justify-between px-2">
                               <span className="text-[10px] font-black uppercase tracking-widest text-[#5C3F1E] flex items-center gap-2">
                                  <Utensils size={14} /> {i18n.foodRecs}
                               </span>
                             </div>
                             <div className="space-y-4">
                                {(data.gastronomia && data.gastronomia.length > 0 ? data.gastronomia : [
                                  { nombre: 'Bandeja Paisa Tradicional', precio: 25000, descripcion: 'Frijoles, chicharrón, huevo, tajada y carne molida. El motor del arriero.' },
                                  { nombre: 'Mondongo Caldeño', precio: 18000, descripcion: 'Sopa espesa de callos y carne de cerdo, servida con aguacate y arepa.' }
                                ]).map((dish: GastroRecommendation, idx: number) => (
                                  <div key={idx} className="p-6 bg-white/60 rounded-[32px] border border-amber-200 flex flex-col gap-2 relative">
                                     <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-1">
                                          <span className="text-[11px] font-black text-[#5C3F1E] uppercase tracking-tight">{dish.nombre}</span>
                                          <p className="text-[9px] font-bold text-[#5C3F1E]/60 uppercase leading-relaxed max-w-[70%]">
                                            {dish.descripcion}
                                          </p>
                                        </div>
                                        <span className="text-xs font-black text-[#5C3F1E] mt-1">${dish.precio.toLocaleString()}</span>
                                     </div>
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>
                       
                       <div className="p-10 rounded-[48px] bg-amber-900 text-white space-y-6 shadow-2xl flex flex-col justify-center h-fit">
                          <div>
                            <span className="text-[11px] font-black uppercase tracking-widest opacity-40">{i18n.totalEstimated}</span>
                            <div className="text-5xl font-black tracking-tighter">${totalBudget.toLocaleString()}</div>
                          </div>
                          <div className="pt-6 border-t border-white/10 space-y-4">
                             <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                                <span className="opacity-50">{i18n.budgetBreakdown.transport}</span>
                                <span>${totalBuses.toLocaleString()}</span>
                             </div>
                             <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                                <span className="opacity-50">{i18n.budgetBreakdown.food}</span>
                                <span>${totalMeals.toLocaleString()}</span>
                             </div>
                             <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                                <span className="opacity-50">{i18n.budgetBreakdown.stay}</span>
                                <span>${totalStay.toLocaleString()}</span>
                             </div>
                          </div>
                          <div className="p-4 bg-white/10 rounded-2xl flex items-center gap-3">
                             <div className="shrink-0"><Info size={14} className="text-paisa-gold" /></div>
                             <p className="text-[8px] font-bold uppercase tracking-widest leading-relaxed">
                                {i18n.cashNote}
                             </p>
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
            </motion.div>
          )}

          {/* TAB: AVENTURA */}
          {activeTab === 'aventura' && (
            <motion.div key="ave" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-12">
               {itinerary && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="bg-slate-900 p-12 rounded-[64px] border border-white/5 space-y-10 shadow-4xl relative"
                 >
                   <button onClick={() => setItinerary(null)} className="absolute top-10 right-10 text-white/40 hover:text-white">
                     <X size={24} />
                   </button>
                   <div className="space-y-2">
                     <h4 className="text-2xl font-black uppercase tracking-widest text-paisa-gold flex items-center gap-3">
                       <Clock className="text-paisa-gold" size={24} /> {i18n.itineraryTitle}
                     </h4>
                     <p className="text-sm font-serif italic text-white/40">{i18n.itineraryNote}</p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {itinerary.map((stop, idx) => (
                        <div key={idx} className="p-8 bg-white/5 rounded-[40px] border border-white/10 space-y-4 hover:bg-white/10 transition-all group">
                           <div className="flex items-center justify-between">
                              <span className="text-paisa-gold font-black text-sm tracking-widest">{stop.hora}</span>
                              <Badge color="white" className="opacity-20">STOP {idx + 1}</Badge>
                           </div>
                           <h5 className="text-xl font-black text-white uppercase tracking-tight">{stop.actividad}</h5>
                           <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase">
                              <MapPin size={12} /> {stop.lugar}
                           </div>
                           <div className="pt-4 border-t border-white/5">
                              <p className="text-[10px] italic font-medium text-paisa-gold leading-relaxed">"{stop.tip}"</p>
                           </div>
                        </div>
                      ))}
                   </div>
                 </motion.div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(data.charcosTacticos && data.charcosTacticos.length > 0 ? data.charcosTacticos : [
                    { nombre: 'Charco Escondido', descripcion: 'Aguas cristalinas a 20 min del parque.', dificultad: 'Media', requiereGuia: false, mapUrl: '#' },
                    { nombre: 'Cascada del Arriero', descripcion: 'Impresionante caída de agua de 30m.', dificultad: 'Arriero', requiereGuia: true, mapUrl: '#' }
                  ]).map((charco, idx) => (
                    <div key={idx} className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-xl space-y-8 relative overflow-hidden group">
                       <div className="absolute top-6 right-6"><Badge color={charco.dificultad === 'Arriero' ? 'red' : charco.dificultad === 'Media' ? 'gold' : 'emerald'}>{charco.dificultad.toUpperCase()}</Badge></div>
                       <div className="p-4 rounded-3xl bg-blue-50 text-blue-600 w-max group-hover:scale-110 transition-transform"><Waves size={24} /></div>
                       <div className="space-y-3">
                          <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900">{charco.nombre}</h4>
                          <p className="text-xs font-serif italic text-slate-500 leading-relaxed">"{charco.descripcion}"</p>
                       </div>
                       <div className="space-y-4 pt-4 border-t border-slate-50">
                          <div className="flex items-center gap-3"><UserCheck size={16} className={charco.requiereGuia ? 'text-amber-600' : 'text-emerald-600'} /><span className="text-[10px] font-black uppercase tracking-widest">{charco.requiereGuia ? 'GUÍA OBLIGATORIO' : 'ENTRADA LIBRE'}</span></div>
                       </div>
                       <div className="flex flex-col gap-3 pt-2">
                          <a href={charco.mapUrl} target="_blank" className="w-full py-4 rounded-xl bg-blue-50 text-blue-700 font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2">UBICACIÓN</a>
                       </div>
                    </div>
                  ))}
               </div>

               {tips && (
                 <div className="bg-[#FEFCE8] p-10 rounded-[48px] border border-amber-200 space-y-6">
                    <h4 className="text-xl font-black uppercase tracking-widest text-amber-900 flex items-center gap-3">
                      <Star className="text-amber-600" size={24} /> {i18n.secretsTitle}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tips.map((tip, idx) => (
                        <div key={idx} className="p-4 bg-white/50 rounded-2xl border border-amber-100 text-sm font-medium text-amber-800 italic">
                          "{tip}"
                        </div>
                      ))}
                    </div>
                 </div>
               )}

               <div className="bg-[#1A4731] p-12 rounded-[64px] text-center space-y-10 shadow-2xl relative overflow-hidden">
                  <h3 className="text-white text-3xl md:text-5xl font-serif italic max-w-2xl mx-auto leading-tight">
                    "¿Quiere que le arme el plan completo mijo?"
                  </h3>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button onClick={handleGenerateItinerary} disabled={loadingItinerary} className="px-12 py-6 rounded-3xl bg-white text-paisa-emerald font-black uppercase text-[11px] tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all">
                      {loadingItinerary ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={20}/> {i18n.btnItinerary}</>}
                    </button>
                    <button onClick={handleGetTips} disabled={loadingTips} className="px-12 py-6 rounded-3xl bg-white/10 text-white border border-white/20 font-black uppercase text-[11px] tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:bg-white/20 transition-all">
                      {loadingTips ? <Loader2 className="animate-spin" size={20} /> : <><Info size={20}/> {i18n.btnTips}</>}
                    </button>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
