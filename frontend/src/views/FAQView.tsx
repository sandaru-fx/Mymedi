import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, ShieldCheck, DollarSign, FileText } from 'lucide-react';

import { Tab } from '../models/types';

interface FAQViewProps {
    setActiveTab?: (tab: Tab) => void;
}

const FAQView: React.FC<FAQViewProps> = ({ setActiveTab = () => { } }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "Is MediGuideAI free to use?",
            answer: "Yes! MediGuideAI is a completely free public service dedicated to consumer protection. Our goal is to ensure fair medicine pricing for everyone in Sri Lanka.",
            icon: DollarSign
        },
        {
            question: "How are the medicine prices determined?",
            answer: "We use the official Maximum Retail Prices (MRP) published by the National Medicines Regulatory Authority (NMRA). We regularly update our database to reflect the latest gazetted prices.",
            icon: ShieldCheck
        },
        {
            question: "How can I report a pharmacy?",
            answer: "If you find a pharmacy selling above the MRP, you can use our 'Reports' feature. Simply upload a photo of the receipt and fill in the details. We will forward reliable reports to the relevant authorities.",
            icon: FileText
        },
        {
            question: "Is my identity safe when I report?",
            answer: "Absolutely. We value your privacy. Your personal details are kept confidential and are only used to verify the authenticity of the report.",
            icon: MessageCircle
        }
    ];

    return (
        <div className="relative w-full min-h-screen pt-32 pb-20 px-6 overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-16 animate-fade-in-up">
                    <span className="px-4 py-2 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-black text-xs uppercase tracking-widest border border-teal-500/20 mb-4 inline-block">
                        Help Center
                    </span>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
                        Frequently Asked <span className="text-teal-500">Questions</span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto">
                        Everything you need to know about MediGuideAI, tailored for you.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card rounded-3xl overflow-hidden border border-white/50 shadow-xl"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 md:p-8 text-left group transition-all"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${openIndex === index ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 group-hover:text-teal-600'}`}>
                                        <faq.icon size={24} />
                                    </div>
                                    <h3 className={`text-xl font-black transition-colors ${openIndex === index ? 'text-teal-600 dark:text-teal-400' : 'text-slate-900 dark:text-white'}`}>
                                        {faq.question}
                                    </h3>
                                </div>
                                <div className={`p-2 rounded-full transition-transform duration-300 ${openIndex === index ? 'rotate-180 bg-teal-100 dark:bg-teal-900/30 text-teal-600' : 'text-slate-400'}`}>
                                    <ChevronDown size={24} />
                                </div>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <div className="px-8 pb-8 md:px-10 md:pb-10 pt-0">
                                            <div className="pl-[4.5rem]">
                                                <p className="text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center animate-fade-in-up delay-300">
                    <p className="text-slate-500 dark:text-slate-400 font-bold mb-4">Still have questions?</p>
                    <button onClick={() => setActiveTab('contact')} className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform flex items-center gap-2 mx-auto">
                        <MessageCircle size={20} />
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FAQView;
