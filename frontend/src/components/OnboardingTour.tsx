import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, Tab } from '../models/types';
import {
    Home, Search, AlertCircle, FileText, Settings,
    ChevronRight, ChevronLeft, X, Check
} from 'lucide-react';

interface OnboardingTourProps {
    isOpen: boolean;
    onComplete: () => void;
    language: Language;
    setActiveTab?: (tab: Tab) => void;
}

interface TourStep {
    titleEn: string;
    titleSi: string;
    descEn: string;
    descSi: string;
    icon: React.ReactNode;
    color: string;
    position: 'center' | 'top' | 'bottom';
    highlightSelector?: string;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({
    isOpen,
    onComplete,
    language
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const isSinhala = language === Language.Sinhala;

    const tourSteps: TourStep[] = [
        {
            titleEn: "Welcome to MediGuide! 🎉",
            titleSi: "MediGuide වෙත සාදරයෙන් පිළිගනිමු! 🎉",
            descEn: "Let's take a quick tour to help you get started with all the amazing features.",
            descSi: "අපි ඔබට සියලු විශිෂ්ට විශේෂාංග සමඟ ආරම්භ කිරීමට උපකාර කිරීම සඳහා ඉක්මන් චාරිකාවක් ගනිමු.",
            icon: <Home size={48} className="text-teal-400" />,
            color: "from-teal-500/20 to-emerald-500/20",
            position: 'center'
        },
        {
            titleEn: "Search Medicines & Symptoms",
            titleSi: "ඖෂධ සහ රෝග ලක්ෂණ සොයන්න",
            descEn: "Use the Search tab to find medicine information, prices, and analyze symptoms using AI. Just type and get instant results!",
            descSi: "AI භාවිතයෙන් ඖෂධ තොරතුරු, මිල ගණන් සහ රෝග ලක්ෂණ විශ්ලේෂණය කිරීමට Search ටැබ් එක භාවිතා කරන්න. ටයිප් කරන්න සහ ක්ෂණික ප්‍රතිඵල ලබා ගන්න!",
            icon: <Search size={48} className="text-blue-400" />,
            color: "from-blue-500/20 to-cyan-500/20",
            position: 'center'
        },
        {
            titleEn: "Emergency SOS Support",
            titleSi: "හදිසි SOS සහාය",
            descEn: "In case of emergency, tap the SOS button (top right) for immediate first-aid guidance and emergency contacts.",
            descSi: "හදිසි අවස්ථාවකදී, ක්ෂණික ප්‍රථමාධාර මාර්ගෝපදේශ සහ හදිසි සම්බන්ධතා සඳහා SOS බොත්තම (ඉහළ දකුණ) තට්ටු කරන්න.",
            icon: <AlertCircle size={48} className="text-rose-400" />,
            color: "from-rose-500/20 to-pink-500/20",
            position: 'top'
        },
        {
            titleEn: "Report Medicine Prices",
            titleSi: "ඖෂධ මිල වාර්තා කරන්න",
            descEn: "Help the community by reporting medicine prices you encounter. Your reports help others find fair prices!",
            descSi: "ඔබට හමුවන ඖෂධ මිල වාර්තා කිරීමෙන් ප්‍රජාවට උදව් කරන්න. ඔබේ වාර්තා අන්‍යයන්ට සාධාරණ මිල සොයා ගැනීමට උපකාරී වේ!",
            icon: <FileText size={48} className="text-purple-400" />,
            color: "from-purple-500/20 to-fuchsia-500/20",
            position: 'center'
        },
        {
            titleEn: "Customize Your Experience",
            titleSi: "ඔබේ අත්දැකීම අභිරුචිකරණය කරන්න",
            descEn: "Use the settings in the header to switch between languages (සිංහල/English) and toggle dark/light mode.",
            descSi: "භාෂා (සිංහල/English) අතර මාරු වීමට සහ අඳුරු/ආලෝක මාදිලිය ටොගල් කිරීමට ශීර්ෂයේ සැකසුම් භාවිතා කරන්න.",
            icon: <Settings size={48} className="text-amber-400" />,
            color: "from-amber-500/20 to-orange-500/20",
            position: 'top'
        },
        {
            titleEn: "You're All Set! 🚀",
            titleSi: "ඔබ සූදානම්! 🚀",
            descEn: "That's it! You're ready to explore MediGuide. Remember, we're here to help you make informed health decisions.",
            descSi: "එච්චරයි! ඔබ MediGuide ගවේෂණය කිරීමට සූදානම්. මතක තබා ගන්න, තොරතුරු සහිත සෞඛ්‍ය තීරණ ගැනීමට අපි ඔබට උදව් කිරීමට මෙහි සිටිමු.",
            icon: <Check size={48} className="text-green-400" />,
            color: "from-green-500/20 to-emerald-500/20",
            position: 'center'
        }
    ];

    const currentTourStep = tourSteps[currentStep];

    const handleNext = () => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        onComplete();
    };

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg"
            >
                {/* Spotlight Effect */}
                <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black/80 pointer-events-none" />

                {/* Tour Card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className={`relative w-full max-w-2xl overflow-hidden bg-gray-900/95 border border-white/10 rounded-3xl shadow-2xl shadow-teal-500/20 ${currentTourStep.position === 'top' ? 'self-start mt-20' :
                        currentTourStep.position === 'bottom' ? 'self-end mb-20' :
                            'self-center'
                        }`}
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

                    {/* Skip Button */}
                    <button
                        onClick={handleSkip}
                        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                    >
                        <X size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                    </button>

                    {/* Content */}
                    <div className="relative p-10 min-h-[400px] flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center text-center space-y-6"
                            >
                                {/* Icon */}
                                <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${currentTourStep.color} flex items-center justify-center ring-1 ring-white/20 backdrop-blur-xl shadow-lg`}>
                                    {currentTourStep.icon}
                                </div>

                                {/* Title */}
                                <h2 className="text-4xl font-bold text-white leading-tight">
                                    {isSinhala ? currentTourStep.titleSi : currentTourStep.titleEn}
                                </h2>

                                {/* Description */}
                                <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
                                    {isSinhala ? currentTourStep.descSi : currentTourStep.descEn}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation */}
                        <div className="mt-10 flex items-center justify-between">
                            {/* Progress Dots */}
                            <div className="flex space-x-2">
                                {tourSteps.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-2 rounded-full transition-all duration-300 ${idx === currentStep
                                            ? 'w-8 bg-teal-500'
                                            : idx < currentStep
                                                ? 'w-2 bg-teal-700'
                                                : 'w-2 bg-gray-700'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center space-x-3">
                                {currentStep > 0 && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handlePrevious}
                                        className="flex items-center space-x-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-white transition-all"
                                    >
                                        <ChevronLeft size={20} />
                                        <span>{isSinhala ? 'පෙර' : 'Previous'}</span>
                                    </motion.button>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleNext}
                                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl font-bold text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all"
                                >
                                    <span>
                                        {currentStep === tourSteps.length - 1
                                            ? (isSinhala ? 'ආරම්භ කරන්න' : 'Get Started')
                                            : (isSinhala ? 'ඊළඟ' : 'Next')
                                        }
                                    </span>
                                    {currentStep === tourSteps.length - 1
                                        ? <Check size={20} />
                                        : <ChevronRight size={20} />
                                    }
                                </motion.button>
                            </div>
                        </div>

                        {/* Step Counter */}
                        <div className="mt-6 text-center text-sm text-gray-500">
                            {currentStep + 1} / {tourSteps.length}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default OnboardingTour;
