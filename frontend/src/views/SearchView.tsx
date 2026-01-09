import React from 'react';
import {
    Pill,
    Activity,
    ArrowRight,
    AlertTriangle,
    TrendingUp,
    ChevronRight
} from 'lucide-react';
import Loader from '../components/Loader';
import MedicineCard from '../components/MedicineCard';
import { MedicineInfo, SymptomAnalysis, Language } from '../models/types';

interface SearchViewProps {
    hasSearched: boolean;
    mode: 'medicine' | 'symptom';
    isSinhala: boolean;
    setMode: (mode: 'medicine' | 'symptom') => void;
    setData: (data: MedicineInfo | null) => void;
    setSymptomData: (data: SymptomAnalysis | null) => void;
    query: string;
    setQuery: (val: string) => void;
    handleSearch: (e: React.FormEvent) => void;
    isLoading: boolean;
    data: MedicineInfo | null;
    symptomData: SymptomAnalysis | null;
    language: Language;
}

const SearchView: React.FC<SearchViewProps> = ({
    hasSearched,
    mode,
    isSinhala,
    setMode,
    setData,
    setSymptomData,
    query,
    setQuery,
    handleSearch,
    isLoading,
    data,
    symptomData,
    language
}) => {
    return (
        <div className="w-full max-w-5xl mx-auto pb-24 px-4">
            <div className={`transition-all duration-700 ${hasSearched ? 'mt-4' : 'mt-20'}`}>
                <div className="text-center mb-16 animate-fade-in-up">
                    <h2 className="text-5xl font-black tracking-tighter">AI <span className={mode === 'medicine' ? 'text-teal-600' : 'text-rose-500'}>{isSinhala ? 'විශේෂඥ' : 'Expert'}</span> {isSinhala ? 'සෙවුම' : 'Consult'}</h2>
                    <div className="flex justify-center mt-8">
                        <div className="glass-card p-1.5 rounded-full shadow-2xl flex gap-1 border border-white/50">
                            <button onClick={() => { setMode('medicine'); setData(null); }} className={`px-8 py-3 rounded-full text-sm font-black transition-all ${mode === 'medicine' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}>{isSinhala ? 'බෙහෙත්' : 'Medicine'}</button>
                            <button onClick={() => { setMode('symptom'); setSymptomData(null); }} className={`px-8 py-3 rounded-full text-sm font-black transition-all ${mode === 'symptom' ? 'bg-rose-500 text-white shadow-xl' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}>{isSinhala ? 'රෝග ලක්ෂණ' : 'Symptoms'}</button>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-3xl mx-auto">
                    <form onSubmit={handleSearch} className="glass-card rounded-[2.5rem] shadow-2xl p-3 flex flex-col sm:flex-row items-center gap-3 border border-white/50">
                        <div className="flex-grow w-full flex items-center px-6">
                            {mode === 'medicine' ? <Pill className="w-6 h-6 text-teal-500 mr-4" /> : <Activity className="w-6 h-6 text-rose-500 mr-4" />}
                            <input
                                type="text"
                                className="w-full py-5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xl font-bold focus:outline-none"
                                placeholder={mode === 'medicine' ? (isSinhala ? "බෙහෙත් නම ඇතුලත් කරන්න..." : "Medicine name...") : (isSinhala ? "ඔබේ අපහසුතා පවසන්න..." : "Describe symptoms...")}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 pr-2">
                            <button type="submit" className={`p-4 rounded-[1.5rem] ${mode === 'medicine' ? 'bg-teal-600' : 'bg-rose-500'} text-white shadow-xl hover:scale-105 active:scale-95 transition-all`}>
                                <ArrowRight className="w-7 h-7" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="mt-16 w-full">
                {isLoading ? <Loader /> : (
                    <>
                        {data && <MedicineCard info={data} language={language} />}
                        {symptomData && (
                            <div className="glass-card p-10 rounded-[3rem] shadow-2xl border border-white/50 animate-fade-in-up space-y-10">
                                <div className="bg-rose-600 text-white p-6 rounded-3xl flex items-center gap-5">
                                    <AlertTriangle className="w-10 h-10 shrink-0" />
                                    <div className="font-bold text-lg">{isSinhala ? "මෙම තොරතුරු දැනුවත් වීම සඳහා පමණි. හදිසි අවස්ථාවකදී වහාම වෛද්‍යවරයකු හමුවන්න." : "For informational purposes only. In emergencies, seek professional medical attention immediately."}</div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter"><TrendingUp className="text-rose-500" /> {isSinhala ? "හැකියාව ඇති තත්ත්වයන්" : "Potential Conditions"}</h3>
                                        <div className="space-y-3">
                                            {symptomData.possibleConditions.map((cond, i) => (
                                                <div key={i} className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl font-black border border-slate-200 dark:border-slate-700 flex items-center justify-between group">
                                                    <span>{cond}</span>
                                                    <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="bg-slate-900 text-white p-8 rounded-[2rem]">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">{isSinhala ? 'වෛද්‍ය අවවාදය' : 'AI Medical Advice'}</h4>
                                            <p className="font-bold text-lg leading-relaxed">{symptomData.advice}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchView;
