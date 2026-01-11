import React, { useState, useEffect, useRef } from 'react';
import {
    Pill,
    Activity,
    ArrowRight,
    AlertTriangle,
    TrendingUp,
    ChevronRight,
    Search,
    Mic,
    Camera,
    X,
    Upload
} from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import Loader from '../components/Loader';
import MedicineCard from '../components/MedicineCard';
import { MedicineInfo, SymptomAnalysis, Language } from '../models/types';
import { fetchMedicineAutocomplete } from '../services/autocompleteService';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchViewProps {
    hasSearched: boolean;
    mode: 'medicine' | 'symptom';
    isSinhala: boolean;
    setMode: (mode: 'medicine' | 'symptom') => void;
    setData: (data: MedicineInfo | null) => void;
    setSymptomData: (data: SymptomAnalysis | null) => void;
    query: string;
    setQuery: (val: string) => void;
    handleSearch: (e: React.FormEvent, overrideQuery?: string) => void;
    isLoading: boolean;
    data: MedicineInfo | null;
    symptomData: SymptomAnalysis | null;
    language: Language;
    error: string | null;
    isSinhala: boolean; // Explicitly adding for clarity in props interface if needed, though already destructured
}

// Add WebkitSpeechRecognition type definition
declare global {
    interface Window {
        webkitSpeechRecognition: any;
    }
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
    language,
    error
}) => {
    const { getToken } = useAuth();
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const debounceTimer = useRef<NodeJS.Timeout>();

    // Fetch autocomplete suggestions
    useEffect(() => {
        if (mode !== 'medicine' || query.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        // Debounce the autocomplete request
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(async () => {
            try {
                setIsLoadingSuggestions(true);
                // Try to get token, but proceed for autocomplete even if null for now (since backend is public)
                let token = null;
                try {
                    token = await getToken();
                } catch (e) {
                    console.log("Not signed in, using public autocomplete");
                }

                const results = await fetchMedicineAutocomplete(query, token);
                setSuggestions(results);
                setShowSuggestions(results.length > 0);
            } catch (error) {
                console.error('Autocomplete error:', error);
                setSuggestions([]);
            } finally {
                setIsLoadingSuggestions(false);
            }
        }, 300);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [query, mode, getToken]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    selectSuggestion(suggestions[selectedIndex]);
                } else {
                    handleSearch(e);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setSelectedIndex(-1);
                break;
        }
    };

    const selectSuggestion = (suggestion: string) => {
        setQuery(suggestion);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        // Trigger search with the selected suggestion
        handleSearch({ preventDefault: () => { } } as React.FormEvent, suggestion);
    };

    // --- VOICE SEARCH LOGIC ---
    const [isListening, setIsListening] = useState(false);

    const handleVoiceSearch = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Your browser does not support voice search. Please use Google Chrome.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = isSinhala ? 'si-LK' : 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            handleSearch({ preventDefault: () => { } } as React.FormEvent, transcript);
        };

        recognition.onError = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.start();
    };


    // --- IMAGE PREVIEW & SCAN LOGIC ---
    const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzingImage(true);

        try {
            // Convert to Base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64Image = reader.result as string;

                // Call Backend
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/medical/analyze-prescription`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image: base64Image,
                        language: isSinhala ? 'Sinhala' : 'English'
                    })
                });

                const data = await response.json();

                if (data.medicines && data.medicines.length > 0) {
                    // If multiple medicines found, we could show a modal. 
                    // For now, let's just pick the first one or populate suggestions
                    if (data.medicines.length === 1) {
                        setQuery(data.medicines[0]);
                        handleSearch({ preventDefault: () => { } } as React.FormEvent, data.medicines[0]);
                    } else {
                        setSuggestions(data.medicines);
                        setShowSuggestions(true);
                        setQuery(data.medicines[0]); // Autofill first but let user choose
                    }
                } else {
                    alert("No medicines found in the image. Please try a clearer photo.");
                }
                setIsAnalyzingImage(false);
            };
        } catch (error) {
            console.error(error);
            alert("Failed to analyze image.");
            setIsAnalyzingImage(false);
        }
    };

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

                <div className="w-full max-w-3xl mx-auto relative" ref={searchRef}>
                    <form onSubmit={handleSearch} className="glass-card rounded-[2.5rem] shadow-2xl p-3 flex flex-col sm:flex-row items-center gap-3 border border-white/50">
                        <div className="flex-grow w-full flex items-center px-6">
                            {mode === 'medicine' ? <Pill className="w-6 h-6 text-teal-500 mr-4" /> : <Activity className="w-6 h-6 text-rose-500 mr-4" />}
                            <input
                                type="text"
                                className="w-full py-5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xl font-bold focus:outline-none"
                                placeholder={mode === 'medicine' ? (isSinhala ? "බෙහෙත් නම ඇතුලත් කරන්න..." : "Medicine name...") : (isSinhala ? "ඔබේ අපහසුතා පවසන්න..." : "Describe symptoms...")}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => {
                                    if (mode === 'medicine' && suggestions.length > 0) {
                                        setShowSuggestions(true);
                                    }
                                }}
                            />

                            {/* VOICE & CAMERA ICONS */}
                            <div className="flex items-center gap-2 mr-2">
                                <button
                                    type="button"
                                    onClick={handleVoiceSearch}
                                    className={`p-2 rounded-full transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600'}`}
                                    title="Voice Search"
                                >
                                    <Mic className="w-5 h-5" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`p-2 rounded-full transition-all ${isAnalyzingImage ? 'bg-teal-500 text-white animate-pulse' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600'}`}
                                    title="Scan Prescription"
                                >
                                    <Camera className="w-5 h-5" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>

                            {isLoadingSuggestions && mode === 'medicine' && (
                                <Search className="w-5 h-5 text-slate-400 animate-pulse" />
                            )}
                        </div>
                        <div className="flex items-center gap-3 pr-2">
                            <button type="submit" className={`p-4 rounded-[1.5rem] ${mode === 'medicine' ? 'bg-teal-600' : 'bg-rose-500'} text-white shadow-xl hover:scale-105 active:scale-95 transition-all`}>
                                <ArrowRight className="w-7 h-7" />
                            </button>
                        </div>
                    </form>

                    {/* Autocomplete Dropdown */}
                    <AnimatePresence>
                        {showSuggestions && mode === 'medicine' && suggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full mt-2 w-full glass-card rounded-3xl shadow-2xl border border-white/50 overflow-hidden z-50"
                            >
                                <div className="p-2">
                                    {suggestions.map((suggestion, index) => (
                                        <motion.button
                                            key={suggestion}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            onClick={() => selectSuggestion(suggestion)}
                                            className={`w-full text-left px-6 py-4 rounded-2xl font-bold text-slate-700 dark:text-slate-200 transition-all ${selectedIndex === index
                                                ? 'bg-teal-500 text-white shadow-lg scale-[1.02]'
                                                : 'hover:bg-white/50 dark:hover:bg-slate-800/50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Pill className={`w-5 h-5 ${selectedIndex === index ? 'text-white' : 'text-teal-500'}`} />
                                                <span className="text-lg">{suggestion}</span>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                                <div className="px-6 py-3 bg-slate-50/50 dark:bg-slate-900/50 border-t border-white/20">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        {isSinhala ? 'ඊතල යතුරු භාවිතා කරන්න' : 'Use arrow keys to navigate'}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="mt-16 w-full px-4">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-8 rounded-3xl border border-rose-500/20 bg-rose-500/5 text-rose-600 dark:text-rose-400 mb-10 flex items-center gap-5"
                    >
                        <div className="p-4 bg-rose-500 text-white rounded-2xl shadow-lg ring-4 ring-rose-500/20">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black uppercase tracking-tight">{isSinhala ? 'දෝෂයක් සිදුවිය' : 'Search Error'}</h4>
                            <p className="font-bold opacity-80">{error}</p>
                        </div>
                    </motion.div>
                )}

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
