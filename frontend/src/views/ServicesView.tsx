import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import { Search, ShieldAlert, HeartPulse, ClipboardCheck, LucideIcon } from 'lucide-react';

interface ServiceCardProps {
    icon: LucideIcon;
    title: string;
    desc: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon: Icon, title, desc }) => (
    <div className="p-10 glass-card bg-white/5 backdrop-blur-2xl border-white/10 rounded-[2.5rem] hover:scale-105 hover:bg-white/10 transition-all duration-500 group">
        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-8 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-xl shadow-blue-500/10">
            <Icon size={32} />
        </div>
        <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{title}</h3>
        <p className="text-slate-400 font-medium text-base leading-relaxed">{desc}</p>
    </div>
);

const ServicesView = () => {
    return (
        <div className="relative bg-slate-900 py-32 px-6 overflow-hidden w-full min-h-screen">
            {/* Next-Gen Three.js Background */}
            <div className="absolute inset-0 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 10] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                        <Sphere args={[2, 100, 200]} position={[8, 4, -4]}>
                            <MeshDistortMaterial color="#3b82f6" speed={1.5} distort={0.4} />
                        </Sphere>
                    </Float>
                    <Float speed={3} rotationIntensity={0.5} floatIntensity={2}>
                        <Sphere args={[1, 100, 200]} position={[-10, -5, -2]}>
                            <MeshDistortMaterial color="#14b8a6" speed={2} distort={0.5} />
                        </Sphere>
                    </Float>
                    <Float speed={4} rotationIntensity={2} floatIntensity={0.5}>
                        <Sphere args={[0.5, 64, 64]} position={[2, -8, 2]}>
                            <MeshDistortMaterial color="#2dd4bf" speed={3} distort={0.6} />
                        </Sphere>
                    </Float>
                </Canvas>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-20 space-y-6">
                    <h2 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none">
                        Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">Healthcare Services</span>
                    </h2>
                    <p className="text-xl text-slate-400 font-bold max-w-2xl mx-auto leading-relaxed">
                        Cutting-edge medical intelligence and transparency tools designed for every citizen in Sri Lanka.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <ServiceCard
                        icon={Search}
                        title="Price Check"
                        desc="Verify the government-regulated maximum retail price (MRP) for any medicine instantly."
                    />
                    <ServiceCard
                        icon={ShieldAlert}
                        title="Report Fraud"
                        desc="Easily report pharmacies selling medicines above the control price to authorities."
                    />
                    <ServiceCard
                        icon={HeartPulse}
                        title="Health Records"
                        desc="Keep a track of your essential medications and price trends over time."
                    />
                    <ServiceCard
                        icon={ClipboardCheck}
                        title="Official Updates"
                        desc="Get real-time notifications on NMRA gazette price changes and new regulations."
                    />
                </div>
            </div>
        </div>
    );
};

export default ServicesView;
