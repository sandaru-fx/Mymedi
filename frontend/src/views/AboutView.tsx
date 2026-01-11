import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, MeshWobbleMaterial, Torus, Float } from '@react-three/drei';

const AboutView = () => {
    return (
        <div className="bg-white dark:bg-slate-900 py-32 px-6 min-h-screen flex items-center w-full relative overflow-hidden transition-colors duration-300">
            {/* Subtle background glow */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px]" />

            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
                {/* Left Side: 3D Visualization */}
                <div className="h-[500px] w-full glass-card bg-white shadow-2xl dark:shadow-none dark:bg-white/5 rounded-[3rem] overflow-hidden cursor-grab active:cursor-grabbing border-slate-200 dark:border-white/10 relative group transition-colors duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                        <ambientLight intensity={0.7} />
                        <pointLight position={[10, 10, 10]} intensity={1.5} />
                        <Float speed={2} rotationIntensity={2} floatIntensity={1}>
                            <Torus args={[1, 0.4, 32, 100]}>
                                <MeshWobbleMaterial color="#60a5fa" speed={1} factor={0.6} roughness={0.1} metalness={0.8} />
                            </Torus>
                        </Float>
                        <OrbitControls enableZoom={false} />
                    </Canvas>
                    <div className="absolute bottom-6 left-6 right-6 p-4 glass-card bg-white/10 backdrop-blur-md rounded-2xl text-center border border-white/20">
                        <span className="text-xs font-black text-slate-900 dark:text-white/80 uppercase tracking-[0.3em]">Interactive Medical Core</span>
                    </div>
                </div>

                {/* Right Side: Content */}
                <div className="space-y-10">
                    <div className="space-y-4">
                        <h4 className="text-teal-600 dark:text-teal-500 font-black tracking-[0.4em] uppercase text-sm">Our Mission</h4>
                        <h2 className="text-6xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter transition-colors duration-300">
                            Bridging the gap between <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-500 dark:to-teal-400">Patients & Transparency</span>
                        </h2>
                    </div>

                    <p className="text-xl text-slate-600 dark:text-slate-400 font-bold leading-relaxed transition-colors duration-300">
                        MyMedi was born out of a simple necessity: Ensure that no Sri Lankan citizen is overcharged for life-saving medications. We provide a platform where technology meets social responsibility.
                    </p>

                    <div className="grid gap-6">
                        {[
                            "Real-time data synchronization with official sources.",
                            "Direct reporting channel for consumer protection.",
                            "Transparent pricing for all essential medications."
                        ].map((text, i) => (
                            <div key={i} className="flex items-center gap-5 p-4 glass-card bg-white shadow-lg dark:shadow-none dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300">
                                <div className="w-3 h-3 bg-teal-500 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                                <span className="text-lg text-slate-700 dark:text-slate-200 font-bold">{text}</span>
                            </div>
                        ))}
                    </div>

                    <button className="px-12 py-5 bg-blue-600 text-white font-black text-xl rounded-2xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-500/30">
                        Join Our Community
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AboutView;
