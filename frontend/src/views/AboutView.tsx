import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, MeshWobbleMaterial, Torus } from '@react-three/drei';

const AboutView = () => {
    return (
        <div className="bg-slate-900 py-20 px-6 min-h-screen flex items-center w-full">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

                {/* Left Side: 3D Visualization */}
                <div className="h-[400px] w-full bg-slate-800/50 rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing">
                    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        <Torus args={[1, 0.4, 16, 100]}>
                            <MeshWobbleMaterial color="#60a5fa" speed={1} factor={0.6} />
                        </Torus>
                        <OrbitControls enableZoom={false} />
                    </Canvas>
                </div>

                {/* Right Side: Content */}
                <div>
                    <h4 className="text-blue-500 font-semibold tracking-widest uppercase mb-4">About MyMedi</h4>
                    <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                        Bridging the gap between <br />
                        <span className="text-blue-500">Patients & Transparency</span>
                    </h2>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                        MyMedi was born out of a simple necessity: Ensure that no Sri Lankan citizen is overcharged for life-saving medications. We provide a platform where technology meets social responsibility.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-white">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span>Real-time data synchronization with official sources.</span>
                        </div>
                        <div className="flex items-center gap-4 text-white">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span>Direct reporting channel for consumer protection.</span>
                        </div>
                    </div>
                    <button className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AboutView;
