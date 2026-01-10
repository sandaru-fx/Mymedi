import React from 'react';
import { HeartPulse, Github, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

const Footer: React.FC = () => {
    return (
        <footer className="w-full relative z-10 pt-24 pb-12 px-6 overflow-hidden">
            {/* Three.js Background Layer */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 5] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                        <Sphere args={[1, 64, 64]} position={[3, -2, 0]}>
                            <MeshDistortMaterial
                                color="#14b8a6"
                                speed={2}
                                distort={0.3}
                                radius={1}
                            />
                        </Sphere>
                    </Float>
                    <Float speed={3} rotationIntensity={1} floatIntensity={1}>
                        <Sphere args={[0.5, 32, 32]} position={[-4, 1, -2]}>
                            <MeshDistortMaterial
                                color="#0d9488"
                                speed={3}
                                distort={0.5}
                                radius={1}
                            />
                        </Sphere>
                    </Float>
                </Canvas>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
                    {/* Brand Section */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-teal-500/40">
                                <HeartPulse className="w-7 h-7" />
                            </div>
                            <span className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                                MediGuide <span className="text-teal-500">AI</span>
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg leading-relaxed max-w-sm">
                            Empowering Sri Lankan citizens with instant pharmaceutical intelligence and transparent healthcare information. National Digital Health Hub.
                        </p>
                        <div className="flex gap-5">
                            {[Facebook, Twitter, Linkedin, Github].map((Icon, i) => (
                                <a key={i} href="#" className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-teal-500 hover:text-white hover:scale-110 transition-all duration-300">
                                    <Icon className="w-6 h-6" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Navigation</h4>
                        <ul className="space-y-4">
                            {['Home', 'Services', 'About Us', 'Contact'].map((item, i) => (
                                <li key={i}>
                                    <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-teal-500 font-bold text-lg transition-colors flex items-center gap-2 group">
                                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="space-y-6">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Resources</h4>
                        <ul className="space-y-4">
                            {['NMRA Updates', 'Suwa Seriya 1990', 'Privacy Policy', 'Terms of Service'].map((item, i) => (
                                <li key={i}>
                                    <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-teal-500 font-bold text-lg transition-colors flex items-center gap-2 group">
                                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-24 pt-10 border-t border-slate-200 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-400 text-sm font-black uppercase tracking-[0.3em]">
                        © 2026 MediGuide AI Sri Lanka • National Digital Health Project
                    </p>
                    <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-900/50 rounded-full border border-slate-200 dark:border-slate-800">
                        <div className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                        <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Global Status: Live</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
