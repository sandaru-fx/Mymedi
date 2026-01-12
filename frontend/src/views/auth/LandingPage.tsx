import React, { useState } from 'react';
import {
    Sparkles, ArrowRight, ShieldCheck, Zap, HeartPulse, Globe, ChevronRight, Search, FileText, AlertCircle
} from 'lucide-react';
import { AuthView, Language } from '../../models/types';
import { motion, AnimatePresence } from 'framer-motion';

interface LandingPageProps {
    setView: (view: AuthView) => void;
    setLanguage: (lang: Language) => void;
    language: Language;
}

const LandingPage: React.FC<LandingPageProps> = ({ setView, setLanguage, language }) => {
    // If user has seen onboarding in this session, skip? 
    // For now, let's force it as user requested, or use a local state that defaults to 0.
    const [step, setStep] = useState(0); // 0: Lang, 1: Features, 2: Final

    const isSinhala = language === Language.Sinhala;

    const handleLanguageSelect = (lang: Language) => {
        setLanguage(lang);
        setStep(1);
    };

    const onboardingSlides = [
        {
            icon: <Search className="w-16 h-16 text-blue-400" />,
            titleEn: "Smart Medicine Search",
            titleSi: "සුහුරු ඖෂධ සෙවීම",
            descEn: "Find medicines, check prices, and analyze symptoms instantly with AI.",
            descSi: "AI සමඟින් ඖෂධ, මිල ගණන් සහ රෝග ලක්ෂණ ක්ෂණිකව සොයන්න.",
            color: "from-blue-500/20 to-teal-500/20"
        },
        {
            icon: <AlertCircle className="w-16 h-16 text-red-400" />,
            titleEn: "Emergency Support",
            titleSi: "හදිසි සහාය",
            descEn: "One-tap access to First Aid and 1990 Suwa Seriya ambulance service.",
            descSi: "ප්‍රථමාධාර සහ 1990 සුව සැරිය ගිලන් රථ සේවාව වෙත ක්ෂණික ප්‍රවේශය.",
            color: "from-red-500/20 to-orange-500/20"
        },
        {
            icon: <FileText className="w-16 h-16 text-purple-400" />,
            titleEn: "Report & Protect",
            titleSi: "වාර්තා කර ආරක්ෂා වන්න",
            descEn: "Report price violations and fake medicines to help the community.",
            descSi: "ප්‍රජාව ආරක්ෂා කිරීම සඳහා මිල උල්ලංඝනය කිරීම් සහ ව්‍යාජ ඖෂධ වාර්තා කරන්න.",
            color: "from-purple-500/20 to-pink-500/20"
        }
    ];

    const [slideIndex, setSlideIndex] = useState(0);

    const handleNextSlide = () => {
        if (slideIndex < onboardingSlides.length - 1) {
            setSlideIndex(prev => prev + 1);
        } else {
            setStep(2); // Go to Landing
        }
    };

    // STEP 0: LANGUAGE SELECTION
    if (step === 0) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
                <Globe className="w-16 h-16 text-teal-500 mb-8 animate-pulse" />
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">
                    Select Your Language <br />
                    <span className="text-teal-500">ඔබේ භාෂාව තෝරන්න</span>
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
                    <button onClick={() => handleLanguageSelect(Language.English)}
                        className="group relative p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-teal-500 transition-all shadow-xl hover:shadow-teal-500/20 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2 group-hover:scale-105 transition-transform">English</h2>
                        <p className="text-slate-500 font-bold">International</p>
                    </button>

                    <button onClick={() => handleLanguageSelect(Language.Sinhala)}
                        className="group relative p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-teal-500 transition-all shadow-xl hover:shadow-teal-500/20 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-2 group-hover:scale-105 transition-transform">සිංහල</h2>
                        <p className="text-slate-500 font-bold">ශ්‍රී ලංකා</p>
                    </button>
                </div>
            </motion.div>
        );
    }

    // STEP 1: FEATURES CAROUSEL
    if (step === 1) {
        const slide = onboardingSlides[slideIndex];
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center w-full max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slideIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        <div className={`w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br ${slide.color} flex items-center justify-center mb-8 ring-1 ring-white/20 shadow-2xl`}>
                            {slide.icon}
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
                            {isSinhala ? slide.titleSi : slide.titleEn}
                        </h2>
                        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-12">
                            {isSinhala ? slide.descSi : slide.descEn}
                        </p>
                    </motion.div>
                </AnimatePresence>

                <div className="flex flex-col items-center gap-8 w-full">
                    <div className="flex gap-2">
                        {onboardingSlides.map((_, i) => (
                            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === slideIndex ? 'w-8 bg-teal-500' : 'w-2 bg-slate-300 dark:bg-white/20'}`} />
                        ))}
                    </div>

                    <button onClick={handleNextSlide} className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xl font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                        {slideIndex === onboardingSlides.length - 1 ? (isSinhala ? 'ආරම්භ කරන්න' : 'Get Started') : (isSinhala ? 'ඊළඟ' : 'Next')} <ChevronRight />
                    </button>
                </div>
            </div>
        );
    }

    // STEP 2: ORIGINAL LANDING (FINAL)
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-6xl mt-20 space-y-16 px-6 text-center">
            <div className="space-y-8 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 font-black text-xs uppercase tracking-[0.3em]">
                    <Sparkles className="w-4 h-4" /> Next-Gen Medical AI
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9]">
                    {isSinhala ? 'ඔබේ සෞඛ්‍යය' : 'Expert Health'} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">
                        {isSinhala ? 'අපගේ වගකීමයි' : 'at Your Fingertips'}
                    </span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-bold max-w-3xl mx-auto leading-relaxed">
                    {isSinhala
                        ? 'MediGuide AI සමඟ සෞඛ්‍ය සේවයේ අනාගතය අත්විඳින්න. ඖෂධ තොරතුරු, රෝග ලක්ෂණ විශ්ලේෂණය සහ හදිසි මඟ පෙන්වීම් ක්ෂණිකව ලබා ගන්න.'
                        : 'Experience the future of healthcare with MediGuide AI. Get instant pharmaceutical intelligence, symptom analysis, and emergency guidance.'}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
                <button
                    onClick={() => setView('signup')}
                    className="w-full sm:w-auto px-12 py-6 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xl font-black rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group"
                >
                    {isSinhala ? 'ලියාපදිංචි වන්න' : 'Get Started'} <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>

                <button
                    onClick={() => setView('login')}
                    className="w-full sm:w-auto px-12 py-6 glass-card text-xl font-black rounded-[2rem] shadow-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all"
                >
                    {isSinhala ? 'ඇතුල් වන්න' : 'Sign In'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
                {[
                    { icon: ShieldCheck, title: isSinhala ? "තහවුරු කළ" : "Verified Hub", desc: isSinhala ? "NMRA ප්‍රමිතීන් සහ ගෝලීය සෞඛ්‍ය ප්‍රොටෝකෝල සමඟ අනුකූල වේ." : "Compliant with NMRA standards and global health protocols." },
                    { icon: Zap, title: isSinhala ? "ක්ෂණික විශ්ලේෂණය" : "Instant Analysis", desc: isSinhala ? "Gemini මගින් බල ගැන්වෙන තත්‍ය කාලීන ඖෂධ සහ රෝග ලක්ෂණ පරීක්ෂාව." : "Real-time drug interactions and symptom checking powered by Gemini." },
                    { icon: HeartPulse, title: isSinhala ? "හදිසි SOS" : "Life-Saving SOS", desc: isSinhala ? "හදිසි ප්‍රොටෝකෝල සහ සුව සැරිය 1990 වෙත ඉක්මන් ප්‍රවේශය." : "Quick access to emergency protocols and Suwa Seriya 1990." }
                ].map((feature, i) => (
                    <div key={i} className="glass-card p-10 rounded-[3rem] text-left border border-white/40 dark:border-slate-800/50 hover:border-teal-500/50 transition-all group">
                        <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-600 mb-6 group-hover:rotate-12 transition-transform">
                            <feature.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default LandingPage;
