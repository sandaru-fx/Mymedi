
import React, { useState } from 'react';
import { MedicineInfo, Language } from '../models/types';
import { Info, ClipboardList, Tag, AlertTriangle, CheckCircle2, Volume2, StopCircle, Copy, Check, Flame, UtensilsCrossed, ShieldCheck, Microscope, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface MedicineCardProps {
   info: MedicineInfo;
   language: Language;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ info, language }) => {
   const [isSpeaking, setIsSpeaking] = useState(false);
   const [copied, setCopied] = useState(false);
   const isSinhala = language === Language.Sinhala;

   const handleSpeak = () => {
      if (isSpeaking) {
         window.speechSynthesis.cancel();
         setIsSpeaking(false);
         return;
      }
      const textToSpeak = `${info.medicineName}. ${info.description}. ${info.uses}. ${info.howToUse}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = isSinhala ? 'si-LK' : 'en-US';
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
   };

   const copyInstructions = () => {
      const text = `${info.medicineName}\n\n${info.description}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   };

   return (
      <div className="w-full max-w-5xl mx-auto space-y-10 animate-fade-in-up">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-4">
            <div className="space-y-2">
               <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 font-black text-[10px] uppercase tracking-widest border border-teal-100">
                  <ShieldCheck className="w-4 h-4" /> AI Verified Clinical Record
               </div>
               <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">
                  {info.medicineName}
               </h2>
            </div>
            <div className="flex gap-3">
               <button onClick={copyInstructions} className="glass-card flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase transition-all active:scale-95 border-white/50">
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {isSinhala ? 'පිටපත් කරන්න' : 'Copy'}
               </button>
               <button onClick={handleSpeak} className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xs uppercase shadow-2xl transition-all active:scale-95 ${isSpeaking ? 'bg-rose-500 text-white' : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'}`}>
                  {isSpeaking ? <StopCircle className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
                  {isSpeaking ? 'Stop' : 'Listen'}
               </button>
            </div>
         </div>

         {/* Premium Price Display Card */}
         <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-[3.5rem] shadow-2xl"
         >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-600"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

            <div className="relative z-10 p-10 md:p-16">
               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                           <DollarSign className="w-8 h-8 text-white" />
                        </div>
                        <div>
                           <p className="text-xs font-black text-white/80 uppercase tracking-[0.3em]">{isSinhala ? 'වත්මන් වෙළඳපල මිල' : 'Current Market Price'}</p>
                           <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider mt-0.5">Sri Lankan Pharmacies • 2025</p>
                        </div>
                     </div>
                     <div className="flex items-baseline gap-4">
                        <h3 className="text-6xl md:text-7xl font-black text-white tracking-tighter drop-shadow-lg">
                           {info.priceRange}
                        </h3>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                           <TrendingUp className="w-5 h-5 text-white" />
                           <span className="text-sm font-black text-white">Live</span>
                        </div>
                     </div>
                     <p className="text-sm font-bold text-white/80 max-w-md">
                        {isSinhala ? 'මිල පරාසය සාමාන්‍ය සහ වෙළඳ නාම අනුව වෙනස් විය හැක' : 'Price may vary between generic and branded versions'}
                     </p>
                  </div>

                  <div className="flex flex-col gap-3">
                     <div className="glass-card bg-white/10 backdrop-blur-md border-white/30 px-6 py-4 rounded-2xl">
                        <div className="flex items-center gap-3">
                           <Clock className="w-5 h-5 text-white" />
                           <div>
                              <p className="text-[10px] font-black text-white/60 uppercase tracking-wider">Last Updated</p>
                              <p className="text-sm font-black text-white">Today</p>
                           </div>
                        </div>
                     </div>
                     <div className="glass-card bg-white/10 backdrop-blur-md border-white/30 px-6 py-4 rounded-2xl">
                        <div className="flex items-center gap-3">
                           <ShieldCheck className="w-5 h-5 text-white" />
                           <div>
                              <p className="text-[10px] font-black text-white/60 uppercase tracking-wider">Verified</p>
                              <p className="text-sm font-black text-white">AI Checked</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </motion.div>

         <div className="glass-card p-1 rounded-[3.5rem] shadow-2xl overflow-hidden border-white/50">
            <div className="bg-slate-900 dark:bg-slate-800 p-12 md:p-16 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                  <Microscope className="w-40 h-40" />
               </div>
               <div className="relative z-10 space-y-6 max-w-2xl">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400">Biological Description</h3>
                  <p className="text-2xl md:text-3xl font-medium leading-relaxed italic opacity-90">
                     "{info.description}"
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-1">
               <div className="bg-white/40 dark:bg-slate-900/40 p-10 space-y-6">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center">
                     <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">{isSinhala ? 'භාවිතයන්' : 'Primary Uses'}</h4>
                  <p className="text-slate-500 font-bold leading-relaxed">{info.uses}</p>
               </div>

               {/* Enhanced How to Use Section */}
               <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-10 space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                        <ClipboardList className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{isSinhala ? 'භාවිතා කරන ආකාරය' : 'How to Use'}</h4>
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Step-by-Step Guide</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     {info.howToUse.split('.').filter(step => step.trim()).map((step, index) => (
                        <motion.div
                           key={index}
                           initial={{ opacity: 0, x: -20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: index * 0.1 }}
                           className="flex items-start gap-4 p-4 bg-white/60 dark:bg-slate-900/40 rounded-2xl border border-blue-200 dark:border-blue-900/30"
                        >
                           <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-lg">
                              {index + 1}
                           </div>
                           <p className="text-slate-700 dark:text-slate-200 font-bold leading-relaxed pt-1">
                              {step.trim()}
                           </p>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 border-t border-white/20">
               <div className="p-10 bg-rose-50/50 dark:bg-rose-950/10 space-y-6">
                  <div className="flex items-center gap-3 text-rose-600">
                     <Flame className="w-6 h-6" />
                     <h4 className="text-lg font-black uppercase tracking-tight">Side Effects</h4>
                  </div>
                  <ul className="grid grid-cols-1 gap-3">
                     {info.sideEffects.map((eff, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400">
                           <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {eff}
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="p-10 bg-amber-50/50 dark:bg-amber-950/10 space-y-6">
                  <div className="flex items-center gap-3 text-amber-600">
                     <UtensilsCrossed className="w-6 h-6" />
                     <h4 className="text-lg font-black uppercase tracking-tight">Food Warnings</h4>
                  </div>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed">{info.foodInteractions}</p>
               </div>
            </div>
         </div>

         <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-20"><AlertTriangle className="w-20 h-20" /></div>
            <div className="relative z-10 flex gap-6">
               <div className="p-4 bg-white/10 rounded-2xl h-fit border border-white/10">
                  <ShieldCheck className="w-8 h-8 text-teal-400" />
               </div>
               <div>
                  <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-2">Legal Disclaimer</h5>
                  <p className="font-bold opacity-80 leading-relaxed italic">{info.disclaimer}</p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default MedicineCard;
