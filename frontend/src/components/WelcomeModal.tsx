import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../models/types';
import { MessageCircle, Search, Activity, ChevronRight, Check } from 'lucide-react';

interface WelcomeModalProps {
    isOpen: boolean;
    onComplete: () => void;
    setLanguage: (lang: Language) => void;
    language: Language;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onComplete, setLanguage, language }) => {
    const [step, setStep] = useState(0);

    // Auto-advance step 0 after language selection is simulated in UI, 
    // but we wait for user to click button in reality or just auto-advance?
    // Let's make Step 0: Language, Step 1-3: Features.

    const featureSlides = [
        {
            title: language === Language.Sinhala ? "AI ඖෂධ සහයක" : "AI Medical Assistant",
            desc: language === Language.Sinhala
                ? "ඕනෑම ඖෂධයක් හෝ රෝග ලක්ෂණයක් ගැන සිංහලෙන් අසා දැනගන්න."
                : "Ask about any medicine or symptom in your preferred language.",
            icon: <MessageCircle size={48} className="text-teal-400" />,
            color: "from-teal-500/20 to-emerald-500/20"
        },
        {
            title: language === Language.Sinhala ? "ක්ෂණික මිල හා තොරතුරු" : "Instant Info & Prices",
            desc: language === Language.Sinhala
                ? "ඖෂධ මිල ගණන් සහ විස්තර ක්ෂණිකව සොයාගන්න."
                : "Find medicine prices and details instantly using our search.",
            icon: <Search size={48} className="text-blue-400" />,
            color: "from-blue-500/20 to-cyan-500/20"
        },
        {
            title: language === Language.Sinhala ? "හදිසි අවස්ථා සහය" : "Emergency Support",
            desc: language === Language.Sinhala
                ? "හදිසි අවස්ථාවකදී කළ යුතු දේ සහ සම්බන්ධ කරගත යුතු අංක."
                : "Guidance on what to do in emergencies and who to contact.",
            icon: <Activity size={48} className="text-rose-400" />,
            color: "from-rose-500/20 to-pink-500/20"
        }
    ];

    const handleLanguageSelect = (lang: Language) => {
        setLanguage(lang);
        setStep(1);
    };

    const handleNext = () => {
        if (step < featureSlides.length) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="relative w-full max-w-lg overflow-hidden bg-gray-900/90 border border-white/10 rounded-3xl shadow-2xl shadow-teal-500/20"
                >
                    {/* Background Ambient Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

                    {/* Content Container */}
                    <div className="relative p-8 min-h-[500px] flex flex-col justify-center">

                        {/* Step 0: Language Selection */}
                        {step === 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="text-center space-y-2">
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                                        Welcome to MediGuide
                                    </h2>
                                    <p className="text-gray-400">Choose your preferred language to get started</p>
                                </div>

                                <div className="grid gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02, borderColor: "rgba(20, 184, 166, 0.5)" }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleLanguageSelect(Language.Sinhala)}
                                        className="group relative flex items-center p-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-all"
                                    >
                                        <div className="flex-1 text-left">
                                            <h3 className="text-2xl font-bold text-white mb-1">සිංහල</h3>
                                            <p className="text-sm text-gray-400 group-hover:text-teal-400 transition-colors">සිංහලෙන් භාවිතා කරන්න</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center group-hover:bg-teal-500 transition-colors">
                                            <span className="text-2xl">අ</span>
                                        </div>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02, borderColor: "rgba(59, 130, 246, 0.5)" }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleLanguageSelect(Language.English)}
                                        className="group relative flex items-center p-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-all"
                                    >
                                        <div className="flex-1 text-left">
                                            <h3 className="text-2xl font-bold text-white mb-1">English</h3>
                                            <p className="text-sm text-gray-400 group-hover:text-blue-400 transition-colors">Use in English</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                                            <span className="text-xl font-bold">En</span>
                                        </div>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* Feature Slides */}
                        {step > 0 && (
                            <div className="flex flex-col h-full justify-between">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
                                    >
                                        <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${featureSlides[step - 1].color} flex items-center justify-center mb-4 ring-1 ring-white/20 backdrop-blur-xl`}>
                                            {featureSlides[step - 1].icon}
                                        </div>

                                        <h2 className="text-3xl font-bold text-white">
                                            {featureSlides[step - 1].title}
                                        </h2>

                                        <p className="text-lg text-gray-400 max-w-xs leading-relaxed">
                                            {featureSlides[step - 1].desc}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>

                                <div className="mt-8 flex items-center justify-between">
                                    <div className="flex space-x-2">
                                        {featureSlides.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`h-2 rounded-full transition-all duration-300 ${idx === step - 1 ? 'w-8 bg-teal-500' : 'w-2 bg-gray-700'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleNext}
                                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl font-bold text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all"
                                    >
                                        <span>{step === featureSlides.length ? (language === Language.Sinhala ? 'ආරම්භ කරන්න' : 'Get Started') : (language === Language.Sinhala ? 'ඊළඟ' : 'Next')}</span>
                                        {step === featureSlides.length ? <Check size={20} /> : <ChevronRight size={20} />}
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default WelcomeModal;
