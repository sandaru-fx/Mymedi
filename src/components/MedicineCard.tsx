
import React, { useState } from 'react';
import { MedicineInfo, Language } from '../types';
import { Info, ClipboardList, Tag, AlertTriangle, CheckCircle2, Volume2, StopCircle, Copy, Check, Flame, UtensilsCrossed, ShieldCheck, Microscope } from 'lucide-react';

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
    <div className="w-full max-w-4xl mx-auto space-y-10 animate-fade-in-up">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 p-1">
           <div className="bg-white/40 dark:bg-slate-900/40 p-10 space-y-6">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center">
                 <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black tracking-tight">{isSinhala ? 'භාවිතයන්' : 'Primary Uses'}</h4>
              <p className="text-slate-500 font-bold leading-relaxed">{info.uses}</p>
           </div>
           <div className="bg-white/40 dark:bg-slate-900/40 p-10 space-y-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center">
                 <ClipboardList className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black tracking-tight">{isSinhala ? 'උපදෙස්' : 'Dosage Guide'}</h4>
              <p className="text-slate-500 font-bold leading-relaxed">{info.howToUse}</p>
           </div>
           <div className="bg-white/40 dark:bg-slate-900/40 p-10 space-y-6 lg:border-none">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 text-teal-600 rounded-2xl flex items-center justify-center">
                 <Tag className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black tracking-tight">{isSinhala ? 'මිල' : 'Market Price'}</h4>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{info.priceRange}</p>
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
