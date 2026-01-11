import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, ShieldCheck, MapPin, ExternalLink, MessageSquare, HeartPulse } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

const ContactCard = ({ icon: Icon, title, detail, subDetail, color }: any) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="glass-card p-10 rounded-[2.5rem] border-white/10 flex flex-col items-center text-center transition-all hover:bg-white/10 group shadow-2xl"
    >
        <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-6 text-white shadow-xl shadow-current/20 group-hover:scale-110 transition-transform`}>
            <Icon size={32} />
        </div>
        <h3 className="font-black text-slate-900 dark:text-white text-2xl mb-2 tracking-tight">{title}</h3>
        <p className="text-teal-600 dark:text-teal-400 font-bold text-lg mb-2">{detail}</p>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">{subDetail}</p>
    </motion.div>
);

import { useState } from 'react';
import { API_BASE_URL } from '../config/apiConfig';

const ContactView = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus('submitting');

        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setSubmitStatus('error');
        }
    };

    return (
        <div className="relative bg-slate-50 dark:bg-slate-950 py-32 px-6 w-full overflow-hidden min-h-screen">

            {/* Three.js Background Layer */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 10] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                        <Sphere args={[2, 64, 64]} position={[-8, 4, 0]}>
                            <MeshDistortMaterial color="#14b8a6" speed={2} distort={0.3} radius={1} />
                        </Sphere>
                    </Float>
                    <Float speed={3} rotationIntensity={1} floatIntensity={1}>
                        <Sphere args={[1.5, 32, 32]} position={[10, -5, -2]}>
                            <MeshDistortMaterial color="#3b82f6" speed={3} distort={0.5} radius={1} />
                        </Sphere>
                    </Float>
                </Canvas>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-24 space-y-6"
                >
                    <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 font-black text-xs uppercase tracking-[0.3em]">
                        <HeartPulse className="w-4 h-4" /> Transparency Matters
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">
                        Get in Touch with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">MediGuide AI</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-bold max-w-3xl mx-auto leading-relaxed">
                        Have concerns about medicine prices? Our team and official regulatory bodies are here to help you.
                    </p>
                </motion.div>

                {/* Info Cards Row */}
                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    <ContactCard
                        icon={ShieldCheck}
                        title="Official Reporting"
                        detail="NMRA Portal"
                        subDetail="Direct complaints to the Authority"
                        color="bg-blue-600"
                    />
                    <ContactCard
                        icon={Phone}
                        title="Consumer Hotline"
                        detail="Dial 1977"
                        subDetail="CAA Consumer Affairs Protection"
                        color="bg-teal-600"
                    />
                    <ContactCard
                        icon={Mail}
                        title="Direct Support"
                        detail="support@mymedi.lk"
                        subDetail="For technical & general inquiries"
                        color="bg-emerald-600"
                    />
                </div>

                {/* Main Content: Form & Official Info */}
                <div className="glass-card rounded-[3rem] shadow-2xl border-white/50 overflow-hidden grid lg:grid-cols-5 dark:border-slate-800/50">

                    {/* Left Column: Form (3/5 width) */}
                    <div className="lg:col-span-3 p-10 md:p-16 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">
                        <div className="flex items-center gap-4 mb-12 text-teal-600 dark:text-teal-400">
                            <MessageSquare size={40} className="drop-shadow-lg" />
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Send a Message</h2>
                        </div>

                        {submitStatus === 'success' ? (
                            <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl p-8 text-center">
                                <h3 className="text-2xl font-black text-teal-600 mb-2">Message Sent!</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">Thank you for contacting us. We will get back to you shortly.</p>
                                <button
                                    onClick={() => setSubmitStatus('idle')}
                                    className="mt-6 px-6 py-2 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-colors"
                                >
                                    Send Another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="block text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full p-5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-bold text-lg dark:text-white"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full p-5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-bold text-lg dark:text-white"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full p-5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-bold text-lg dark:text-white"
                                        placeholder="General Inquiry / Feedback"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Message</label>
                                    <textarea
                                        rows={5}
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full p-5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-bold text-lg dark:text-white"
                                        placeholder="How can we help you today?..."
                                    ></textarea>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={submitStatus === 'submitting'}
                                    className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black py-6 rounded-2xl shadow-2xl hover:bg-teal-600 dark:hover:bg-teal-500 dark:hover:text-white transition-all flex items-center justify-center gap-4 text-2xl group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitStatus === 'submitting' ? 'Sending...' : 'Send Message'} <HeartPulse className="w-8 h-8 group-hover:animate-pulse" />
                                </motion.button>
                            </form>
                        )}
                    </div>

                    {/* Right Column: Official Guide (2/5 width) */}
                    <div className="lg:col-span-2 bg-slate-950 p-10 md:p-16 text-white relative flex flex-col justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-transparent opacity-50 pointer-events-none" />

                        <div className="relative z-10 space-y-12">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black tracking-tight mb-4">Official Guidelines</h3>
                                <p className="text-slate-400 font-bold text-lg leading-relaxed">
                                    Before reporting a price discrepancy, please ensure you have the purchase receipt. All price data in our system is synced with the latest NMRA gazettes.
                                </p>
                            </div>

                            <div className="space-y-10">
                                <div className="flex gap-6 group">
                                    <div className="p-4 bg-white/10 rounded-2xl h-fit text-blue-400 group-hover:scale-110 transition-transform shadow-xl">
                                        <ExternalLink size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-xl mb-2">NMRA Regulations</h4>
                                        <p className="text-sm font-medium text-slate-500 mb-3">Check latest pricing gazettes on the NMRA official site.</p>
                                        <a href="https://nmra.gov.lk" target="_blank" rel="noreferrer" className="text-blue-400 text-sm font-black hover:text-blue-300 transition-colors uppercase tracking-widest border-b-2 border-blue-400/20 pb-1">VISIT NMRA.GOV.LK</a>
                                    </div>
                                </div>

                                <div className="flex gap-6 group">
                                    <div className="p-4 bg-white/10 rounded-2xl h-fit text-teal-400 group-hover:scale-110 transition-transform shadow-xl">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-xl mb-2">Head Office</h4>
                                        <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                            National Medicines Regulatory Authority,<br />
                                            No.120, Norris Canal Road, Colombo 10.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-teal-500/10 border border-teal-500/20 rounded-3xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-[50px] -mr-16 -mt-16" />
                                <h4 className="text-sm font-black text-teal-400 mb-3 uppercase tracking-[0.3em]">Emergency Reporting</h4>
                                <p className="text-base font-bold text-slate-300 leading-relaxed">If you are being forced to pay higher, call CAA at <span className="text-white text-xl">1977</span> immediately.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactView;
