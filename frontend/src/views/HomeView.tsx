import React from 'react';
import {
    Search,
    HeartPulse,
    LifeBuoy,
    FileText,
    ShieldCheck,
    Stethoscope
} from 'lucide-react';
import { Tab } from '../models/types';

interface HomeViewProps {
    isSinhala: boolean;
    setMode: (mode: 'medicine' | 'symptom') => void;
    setActiveTab: (tab: Tab) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ isSinhala, setMode, setActiveTab }) => {
    return (
        <div className="w-full max-w-6xl mt-12 animate-fade-in-up space-y-16 pb-24 px-4">
            <div className="text-center space-y-6">
                <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-tight">
                    {isSinhala ? 'ඔබේ සෞඛ්‍ය ගමන' : 'Intelligent Health'} <br />
                    <span className="text-teal-600 underline decoration-teal-500/30 underline-offset-8 decoration-4">
                        {isSinhala ? 'AI සහායෙන්' : 'AI Companion'}
                    </span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto text-lg leading-relaxed">
                    {isSinhala
                        ? 'ශ්‍රී ලංකාවේ ප්‍රථම කෘතිම බුද්ධියෙන් ක්‍රියාත්මක වන වෛද්‍ය තොරතුරු හුවමාරුව. NMRA ප්‍රමිතීන්ට අනුකූලව ක්‍රියාත්මක වේ.'
                        : 'Sri Lanka\'s first AI-driven pharmaceutical intelligence hub. Compliant with NMRA regulatory standards.'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { id: 'search', mode: 'medicine', color: 'bg-teal-600', icon: Search, title: isSinhala ? 'බෙහෙත්' : 'Search Meds', desc: isSinhala ? 'මාත්‍රාව සහ මිල' : 'Usage & Pricing' },
                    { id: 'search', mode: 'symptom', color: 'bg-rose-500', icon: HeartPulse, title: isSinhala ? 'රෝග ලක්ෂණ' : 'Symptoms', desc: isSinhala ? 'AI වෛද්‍ය සහාය' : 'AI Diagnosis' },
                    { id: 'sos', mode: null, color: 'bg-red-600', icon: LifeBuoy, title: isSinhala ? 'හදිසි අවස්ථා' : 'SOS Aid', desc: isSinhala ? 'මූලික ප්‍රථමාධාර' : 'Emergency Aid', pulse: true },
                    { id: 'reports', mode: null, color: 'bg-slate-900', icon: FileText, title: isSinhala ? 'මිල පාලනය' : 'Reporting', desc: isSinhala ? 'වැඩි මිල වාර්තා' : 'Market Control' }
                ].map((card, i) => (
                    <button
                        key={i}
                        onClick={() => { if (card.mode) setMode(card.mode as 'medicine' | 'symptom'); setActiveTab(card.id as Tab); }}
                        className={`${card.color} ${card.pulse ? 'animate-pulse-slow' : ''} p-8 rounded-[3rem] shadow-2xl shadow-slate-900/10 text-white flex flex-col items-start gap-5 hover:scale-105 transition-all duration-300 group relative overflow-hidden`}
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="p-4 bg-white/20 rounded-[1.5rem] group-hover:rotate-12 transition-transform shadow-lg">
                            <card.icon className="w-7 h-7" />
                        </div>
                        <div className="text-left relative z-10">
                            <h3 className="text-2xl font-black">{card.title}</h3>
                            <p className="text-xs font-bold opacity-80 mt-1 uppercase tracking-widest">{card.desc}</p>
                        </div>
                    </button>
                ))}
            </div>

            <div className="glass-card p-10 rounded-[3rem] shadow-xl border border-white/40 dark:border-slate-800/50 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 font-black text-[10px] uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4" /> Trusted Intelligence
                    </div>
                    <h3 className="text-3xl font-black">{isSinhala ? 'වැඩි විශ්වාසනීයත්වයක්' : 'Medical Accuracy'}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        {isSinhala
                            ? 'අපගේ AI පද්ධතිය ලෝක මට්ටමේ වෛද්‍ය දත්ත ගබඩාවන් සමඟ සම්බන්ධව ඇති අතර, ශ්‍රී ලාංකික වෙළඳපල මිල ගණන් නිරන්තරයෙන් යාවත්කාලීන කරයි.'
                            : 'Our AI model consults global pharmaceutical databases while continuously monitoring local Sri Lankan market prices for the most accurate advisory experience.'}
                    </p>
                </div>
                <div className="w-full md:w-64 h-64 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center animate-float">
                    <Stethoscope className="w-24 h-24 text-teal-600 opacity-20" />
                </div>
            </div>
        </div>
    );
};

export default HomeView;
