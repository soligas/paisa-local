
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
  X, Repeat, ChevronRight, MapPinned, Award, Shield, ShoppingBag, Lightbulb, Compass as CompassIcon
} from 'lucide-react';
import { PlaceData, SupportedLang, CharcoTactico, FinancialSpot, GastroRecommendation, LocalTour, LocalStore } from '../types';
import { SafeImage } from './atoms/SafeImage';
import { generateSmartItinerary, generateTacticalRecommendations, generateLocalTours } from '../services/geminiService';
import { Badge } from './atoms/Badge';

interface PlaceCardProps {
  data: PlaceData;
  lang: SupportedLang;
  i18n: any;
  isFavorite: boolean;
  onToggleFavorite: (title: string) => void;
  onRequestPayment: () => void;
}

type TabType = 'logistica' | 'economia' | 'aventura';

const RouteGraphic = ({ terminal, localType }: { terminal: string, localType: string }) => {
  return (
    <div className="relative py-12 px-4 flex flex-col items-center gap-12">
      <div className="absolute top-16 bottom-16 w-0.5 bg-slate-200 left-1/2 -translate-x-1/2 rounded-full" />
      <div className="relative flex flex-col items-center gap-2">
         <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center text-slate-400 z-10 shadow-sm">
            <Flag size={18} />
         </div>
         <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Medellín</span>
      </div>
      <div className="relative flex flex-col items-center gap-2">
         <div className="w-16 h-16 rounded-full bg-paisa-emerald text-white flex items-center justify-center z-10 shadow-lg ring-4 ring-white">
            <Bus size={24} />
         </div>
         <span className="text-[10px] font-black uppercase text-paisa-emerald tracking-tighter">{terminal.toUpperCase()}</span>
      </div>
      <div className="relative flex flex-col items-center gap-4 max-w-[140px] text-center">
         <div className="w-12 h-12 rounded-full bg-white border-2 border-paisa-gold flex items-center justify-center text-paisa-gold z-10 shadow-sm">
            <Bike size={18} />
         </div>
         <span className="text-[9px] font-black uppercase text-[#B48444] leading-tight tracking-tighter">
            {localType || 'BUSES Y TAXIS DE MONTAÑA'}
         </span>
      </div>
      <div className="relative flex flex-col items-center gap-2">
         <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center z-10 shadow-xl">
            <MapPin size={18} />
         </div>
         <span className="text-[10px] font-black uppercase text-slate-900 tracking-tighter">Destino</span>
      </div>
    </div>
  );
};

export const PlaceCard: React.FC<PlaceCardProps> = ({ data, lang, i18n, isFavorite, onToggleFavorite, onRequestPayment }) => {
  const [activeTab, setActiveTab] = useState<TabType>('logistica');
  const [loadingItinerary, setLoadingItinerary] = useState(false);
  const [itinerary, setItinerary] = useState<any[] | null>(null);
  const [loadingTips, setLoadingTips] = useState(false);
  const [tips, setTips] = useState<string[] | null>(null);
  const [loadingTours, setLoadingTours] = useState(false);
  const [tours, setTours] = useState<LocalTour[] | null>(null);
  
  const [numPeople, setNumPeople] = useState(1);
  const [numMeals, setNumMeals] = useState(1);
  
  const handleGenerateItinerary = async () => {
    if (loadingItinerary) return;
    setLoadingItinerary(true);
    onRequestPayment(); // Open support modal
    try {
      const res = await generateSmartItinerary(data.titulo, lang);
      if (res?.itinerary) setItinerary(res.itinerary);
    } catch (e) {
      console.error("Failed to generate itinerary:", e);
    }
    setLoadingItinerary(false);
  };

  const handleGetTips = async () => {
    if (loadingTips) return;
    setLoadingTips(true);
    onRequestPayment(); // Open support modal
    try {
      const res = await generateTacticalRecommendations(data.titulo, lang);
      if (res) setTips(res);
    } catch (e) {
      console.error("Failed to generate tips:", e);
    }
    setLoadingTips(false);
  };

  const handleGetTours = async () => {
    if (loadingTours) return;
    setLoadingTours(true);
    onRequestPayment(); // Open support modal
    try {
      const res = await generateLocalTours(data.titulo, lang);
      if (res) setTours(res);
    } catch (e) {
      console.error("Failed to generate tours:", e);
    }
    setLoadingTours(false);
  };

  const ticketCost = data.budget?.busTicket || 35000;
  const mealCost = data.budget?.averageMeal || 25000;
  const stayCost = data.budget?.dailyStay || 80000;
  
  const totalTransport = ticketCost * numPeople * 2;
  const totalFood = mealCost * numPeople * numMeals;
  const totalStay = stayCost * numPeople;
  const totalBudget = totalTransport + totalFood + totalStay;

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
                 <Badge color="gold">{data.region?.toUpperCase()}</Badge>
                 <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white leading-[0.8]">{data.titulo}</h1>
              </div>
              <div className="px-6 py-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 text-white text-center">
                 <span className="block text-[8px] font-black uppercase tracking-widest opacity-60">VIBE</span>
                 <span className="text-xl font-black">{data.vibeScore || 95}%</span>
              </div>
           </div>
        </div>
        <div className="p-10 md:p-14 bg-white">
           <p className="text-2xl md:text-4xl font-serif italic text-slate-400 leading-tight max-w-4xl">"{data.descripcion}"</p>
        </div>
      </div>

      <div className="sticky top-[80px] z-[40] p-2 bg-white/80 backdrop-blur-xl rounded-full gap-2 shadow-2xl border border-slate-100 flex max-w-3xl mx-auto w-full">
        {(['logistica', 'economia', 'aventura'] as TabType[]).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 md:py-6 rounded-full flex items-center justify-center gap-3 transition-all duration-500 ${activeTab === tab ? 'bg-paisa-emerald text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
            {tab === 'logistica' ? <Truck size={18} /> : tab === 'economia' ? <Banknote size={18} /> : <Compass size={18} />}
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">{i18n.tabs[tab]}</span>
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'logistica' && (
            <motion.div key="log" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-[#F7FBF9] p-10 rounded-[56px] border border-[#EAF5EF] space-y-10 shadow-sm relative overflow-hidden">
                  <h3 className="text-xl font-black uppercase tracking-widest text-[#1A4731] flex items-center gap-3"><Bus size={24} /> {i18n.logisticsTitle}</h3>
                  <RouteGraphic terminal={data.terminalInfo?.split(' ').pop() || 'Terminal'} localType={data.localMobility?.type || ''} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 text-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 block mb-4">{i18n.buses}</span>
                        <span className="text-xl font-black text-slate-900">{data.busFrequency}</span>
                     </div>
                     <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 text-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 block mb-4">{i18n.departure}</span>
                        <span className="text-xl font-black text-slate-900">{data.terminalInfo}</span>
                     </div>
                  </div>
               </div>
               <div className="bg-slate-950 p-10 rounded-[56px] text-white space-y-8">
                  <h3 className="text-xl font-black uppercase tracking-widest text-paisa-gold flex items-center gap-3"><Briefcase size={24} /> {i18n.packingTitle}</h3>
                  <div className="grid grid-cols-1 gap-4">
                     {data.packingList.map((item, idx) => (
                       <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                          <CheckCircle2 size={16} className="text-paisa-gold" />
                          <span className="text-sm font-bold uppercase tracking-widest">{item}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'economia' && (
            <motion.div key="eco" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               
               {/* Left Panel: Banca y Pagos */}
               <div className="lg:col-span-4 bg-white p-10 rounded-[56px] border border-slate-100 space-y-10 shadow-xl">
                  <h3 className="text-xl font-black uppercase tracking-widest text-slate-900 flex items-center gap-3"><Landmark size={24} className="text-paisa-emerald" /> {i18n.bankTitle}</h3>
                  
                  <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 flex flex-col gap-4 text-center">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-relaxed px-4">
                        {data.paymentMethods?.tacticalNote || i18n.paymentNote}
                     </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4 px-6 py-4 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-paisa-emerald/30 transition-all">
                       <div className="p-3 rounded-2xl bg-white shadow-sm text-paisa-emerald">
                          <Store size={20} />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">DÍA DE MERCADO</span>
                          <span className="text-sm font-black text-slate-900">{data.marketDay || "Sábados y Domingos"}</span>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 ml-4">LUGARES DE RETIRO Y COMPRA</h4>
                       {(data.financialSpots || [
                          { nombre: 'BANCOLOMBIA (CORRESPONSAL)', tipo: 'CORRESPONSAL' },
                          { nombre: 'CAJERO SERVIBANCA', tipo: 'ATM' },
                          { nombre: 'WESTERN UNION', tipo: 'CAMBIO' }
                       ]).map((spot, idx) => (
                         <div key={idx} className="p-5 rounded-[28px] bg-slate-50 border border-slate-50 flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all">
                            <div className="flex items-center gap-4">
                               <div className="p-3 bg-white rounded-2xl shadow-sm text-paisa-emerald group-hover:bg-paisa-emerald group-hover:text-white transition-all">
                                  {renderFinancialSpotIcon(spot.tipo)}
                               </div>
                               <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{spot.nombre}</span>
                            </div>
                            <Badge color="slate" className="text-[7px] py-1 px-3 bg-slate-200/50">{spot.tipo}</Badge>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>

               {/* Right Panel: Calculador Presupuestal */}
               <div className="lg:col-span-8 bg-[#FFFDF0] p-10 md:p-14 rounded-[64px] border border-amber-100/50 shadow-sm space-y-12 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                     <h3 className="text-3xl font-black uppercase tracking-tighter text-[#4A3728] flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-amber-900/10 text-amber-900"><Calculator size={32} /></div>
                        {i18n.calcTitle}
                     </h3>
                     <Badge color="gold" className="bg-[#D4A574]/20 text-[#8B5E34] border border-[#D4A574]/30 px-4 py-2">VIGENTE 2024</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                     <div className="space-y-12">
                        <div className="space-y-8">
                           <div className="flex justify-between items-center group">
                              <span className="text-[11px] font-black uppercase tracking-widest text-amber-900/60">{i18n.travellers}</span>
                              <div className="flex items-center gap-6">
                                 <button onClick={() => setNumPeople(Math.max(1, numPeople - 1))} className="w-10 h-10 rounded-full bg-white border border-amber-200 flex items-center justify-center shadow-sm text-amber-900 hover:bg-amber-900 hover:text-white transition-all"><Minus size={14}/></button>
                                 <span className="text-3xl font-black text-amber-950 w-8 text-center">{numPeople}</span>
                                 <button onClick={() => setNumPeople(numPeople + 1)} className="w-10 h-10 rounded-full bg-white border border-amber-200 flex items-center justify-center shadow-sm text-amber-900 hover:bg-amber-900 hover:text-white transition-all"><Plus size={14}/></button>
                              </div>
                           </div>
                           
                           <div className="flex justify-between items-center group">
                              <span className="text-[11px] font-black uppercase tracking-widest text-amber-900/60">{i18n.mealsPerDay}</span>
                              <div className="flex items-center gap-6">
                                 <button onClick={() => setNumMeals(Math.max(1, numMeals - 1))} className="w-10 h-10 rounded-full bg-white border border-amber-200 flex items-center justify-center shadow-sm text-amber-900 hover:bg-amber-900 hover:text-white transition-all"><Minus size={14}/></button>
                                 <span className="text-3xl font-black text-amber-950 w-8 text-center">{numMeals}</span>
                                 <button onClick={() => setNumMeals(numMeals + 1)} className="w-10 h-10 rounded-full bg-white border border-amber-200 flex items-center justify-center shadow-sm text-amber-900 hover:bg-amber-900 hover:text-white transition-all"><Plus size={14}/></button>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-900/40 flex items-center gap-2">
                              <Utensils size={12} /> {i18n.foodRecs}
                           </h4>
                           <div className="space-y-4">
                              {(data.gastronomia || [
                                 { nombre: 'BANDEJA PAISA TRADICIONAL', precio: 25000, descripcion: 'FRIJOLES, CHICHARRÓN, HUEVO, TAJADA Y CARNE MOLIDA. EL MOTOR DEL ARRIERO.' },
                                 { nombre: 'MONDONGO CALDEÑO', precio: 18000, descripcion: 'SOPA ESPESA DE CALLOS Y CARNE DE CERDO, SERVIDA CON AGUACATE Y AREPA.' }
                              ]).map((food, idx) => (
                                <div key={idx} className="p-6 rounded-[32px] bg-white border border-amber-200/50 shadow-sm flex flex-col gap-2 group hover:shadow-xl transition-all">
                                   <div className="flex justify-between items-start">
                                      <span className="text-sm font-black text-amber-950 uppercase">{food.nombre}</span>
                                      <span className="text-sm font-black text-amber-900">${food.precio.toLocaleString()}</span>
                                   </div>
                                   <p className="text-[9px] font-bold text-amber-900/40 leading-relaxed uppercase tracking-widest">{food.descripcion}</p>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>

                     {/* Total Summary Card */}
                     <div className="relative">
                        <motion.div 
                          layout
                          className="p-10 md:p-12 rounded-[56px] bg-[#4A2C19] text-white space-y-8 shadow-4xl relative z-10"
                        >
                           <div className="space-y-1">
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{i18n.totalEstimated}</span>
                              <div className="text-6xl font-black tracking-tighter">${totalBudget.toLocaleString()}</div>
                           </div>

                           <div className="h-px bg-white/10 w-full" />

                           <div className="space-y-6">
                              {[
                                 { label: i18n.budgetBreakdown.transport, val: totalTransport },
                                 { label: i18n.budgetBreakdown.food, val: totalFood },
                                 { label: i18n.budgetBreakdown.stay, val: totalStay }
                              ].map((item, idx) => (
                                 <div key={idx} className="flex justify-between items-center group">
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-50 group-hover:opacity-100 transition-opacity">{item.label}</span>
                                    <span className="text-lg font-black">${item.val.toLocaleString()}</span>
                                 </div>
                              ))}
                           </div>

                           <div className="pt-4">
                              <div className="p-5 rounded-3xl bg-black/20 border border-white/5 flex items-center gap-4 text-center">
                                 <Info size={16} className="text-amber-500 shrink-0" />
                                 <p className="text-[8px] font-black uppercase leading-relaxed opacity-60 tracking-widest">
                                    LOS PRECIOS SON PROMEDIOS LOCALES ACTUALES. EL EFECTIVO ES CLAVE PARA NEGOCIAR.
                                 </p>
                              </div>
                           </div>
                        </motion.div>
                        <div className="absolute -bottom-4 -right-4 inset-0 bg-amber-900/10 rounded-[56px] -z-0 blur-2xl" />
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'aventura' && (
            <motion.div key="ave" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-12">
               
               {/* Smart Results View - ITINERARY */}
               <AnimatePresence>
                 {itinerary && (
                   <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 p-12 rounded-[64px] space-y-10 shadow-4xl relative">
                     <button onClick={() => setItinerary(null)} className="absolute top-10 right-10 text-white/40 hover:text-white transition-all"><X size={24} /></button>
                     <h4 className="text-2xl font-black uppercase text-paisa-gold flex items-center gap-3"><Clock size={24} /> {i18n.itineraryTitle}</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {itinerary.map((stop, idx) => (
                          <div key={idx} className="p-8 bg-white/5 rounded-[40px] border border-white/10 space-y-4 hover:bg-white/10 transition-all group">
                             <div className="flex justify-between items-center">
                                <span className="text-paisa-gold font-black text-sm tracking-widest">{stop.hora}</span>
                                <Badge color="white" className="text-[7px]">Sugerencia</Badge>
                             </div>
                             <h5 className="text-xl font-black text-white uppercase group-hover:text-paisa-gold transition-colors">{stop.actividad}</h5>
                             <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase group-hover:text-white/60"><MapPin size={12} /> {stop.lugar}</div>
                             <p className="text-[9px] italic text-white/30 font-serif leading-relaxed line-clamp-2">"{stop.tip}"</p>
                          </div>
                        ))}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Smart Results View - TIPS */}
               <AnimatePresence>
                 {tips && (
                   <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-amber-50 p-12 rounded-[64px] space-y-10 shadow-xl border border-amber-100 relative">
                     <button onClick={() => setTips(null)} className="absolute top-10 right-10 text-amber-900/40 hover:text-amber-900 transition-all"><X size={24} /></button>
                     <h4 className="text-2xl font-black uppercase text-amber-900 flex items-center gap-3"><Lightbulb size={24} /> {i18n.secretsTitle}</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tips.map((tip, idx) => (
                          <div key={idx} className="p-8 bg-white rounded-[40px] border border-amber-100 space-y-4 shadow-sm hover:shadow-xl transition-all">
                             <div className="w-10 h-10 rounded-2xl bg-amber-900 text-white flex items-center justify-center">
                                <span className="text-xs font-black">{idx + 1}</span>
                             </div>
                             <p className="text-sm font-serif italic text-amber-950 leading-relaxed">"{tip}"</p>
                          </div>
                        ))}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Smart Results View - TOURS */}
               <AnimatePresence>
                 {tours && (
                   <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-emerald-900 p-12 rounded-[64px] space-y-10 shadow-4xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
                        <CompassIcon size={200} />
                     </div>
                     <button onClick={() => setTours(null)} className="absolute top-10 right-10 text-white/40 hover:text-white transition-all"><X size={24} /></button>
                     <h4 className="text-2xl font-black uppercase text-paisa-gold flex items-center gap-3"><MapPinned size={24} /> TOURS IDEALES EN {data.titulo.toUpperCase()}</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {tours.map((tour, idx) => (
                          <div key={idx} className="p-8 bg-white/5 rounded-[40px] border border-white/10 space-y-6 flex flex-col justify-between hover:bg-white/10 transition-all group">
                             <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                   <Badge color="gold">{tour.duracion}</Badge>
                                </div>
                                <h5 className="text-xl font-black text-white uppercase group-hover:text-paisa-gold transition-colors">{tour.nombre}</h5>
                                <p className="text-[10px] text-white/50 leading-relaxed italic line-clamp-3">"{tour.descripcion}"</p>
                             </div>
                             <div className="pt-4 border-t border-white/10">
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/30 block mb-2">INCLUYE</span>
                                <div className="flex flex-wrap gap-1">
                                   {tour.incluye.map((item, i) => <Badge key={i} color="white" className="text-[6px] py-0.5 px-2 bg-white/5">{item}</Badge>)}
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Charcos Section */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(data.charcosTacticos || []).map((charco, idx) => (
                    <div key={idx} className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-xl space-y-6 group hover:shadow-2xl transition-all">
                       <div className="p-4 rounded-3xl bg-blue-50 text-blue-600 w-max group-hover:bg-blue-600 group-hover:text-white transition-all"><Waves size={24} /></div>
                       <div className="space-y-2">
                          <h4 className="text-2xl font-black uppercase text-slate-900">{charco.nombre}</h4>
                          <p className="text-xs font-serif italic text-slate-500">"{charco.descripcion}"</p>
                       </div>
                       <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <Badge color="slate">{charco.dificultad || 'Media'}</Badge>
                          <a href={charco.mapUrl} target="_blank" className="p-2 rounded-full hover:bg-slate-100 transition-all text-slate-400 hover:text-paisa-emerald"><Navigation size={18} /></a>
                       </div>
                    </div>
                  ))}
               </div>

               {/* Call to Action Section with Loading Indicators */}
               <div className="bg-[#1A4731] p-12 md:p-20 rounded-[64px] text-center space-y-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-paisa-gold/30 to-transparent" />
                  <h3 className="text-white text-4xl md:text-6xl font-serif italic max-w-2xl mx-auto leading-tight">"¿Quiere que le arme el plan completo mijo?"</h3>
                  
                  <div className="flex flex-wrap items-center justify-center gap-6">
                    <button 
                      onClick={handleGenerateItinerary} 
                      className="px-10 py-6 rounded-[32px] bg-white text-paisa-emerald font-black uppercase text-[12px] shadow-2xl flex items-center gap-4 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Sparkles size={20} className="text-paisa-gold" /> {i18n.btnItinerary}
                    </button>
                    <button 
                      onClick={handleGetTips} 
                      className="px-10 py-6 rounded-[32px] bg-white/10 text-white border border-white/20 font-black uppercase text-[12px] flex items-center gap-4 hover:bg-white/20 transition-all"
                    >
                      <Lightbulb size={20} className="text-paisa-gold" /> {i18n.btnTips}
                    </button>
                    <button 
                      onClick={handleGetTours} 
                      className="px-10 py-6 rounded-[32px] bg-paisa-gold text-slate-900 font-black uppercase text-[12px] flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                      <MapPinned size={20} /> VER TOURS IDEALES
                    </button>
                  </div>

                  <AnimatePresence>
                    {(loadingItinerary || loadingTips || loadingTours) && (
                       <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                          Consultando Inteligencia Táctica en Campo...
                       </motion.p>
                    )}
                  </AnimatePresence>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
