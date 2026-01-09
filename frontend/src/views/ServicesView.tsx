import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import { Search, ShieldAlert, HeartPulse, ClipboardCheck, LucideIcon } from 'lucide-react';

interface ServiceCardProps {
    icon: LucideIcon;
    title: string;
    desc: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon: Icon, title, desc }) => (
    <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:scale-105 transition-all duration-300">
        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 text-blue-400">
            <Icon size={28} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
);

const ServicesView = () => {
    return (
        <div className="relative bg-slate-900 py-20 px-6 overflow-hidden w-full min-h-screen">
            {/* Three.js Background Element */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] opacity-30">
                <Canvas>
                    <ambientLight intensity={1} />
                    <Sphere args={[1, 100, 200]} scale={2.4}>
                        <MeshDistortMaterial color="#3b82f6" speed={1.5} distort={0.4} />
                    </Sphere>
                </Canvas>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <h2 className="text-4xl font-extrabold text-white mb-12 text-center">
                    Our <span className="text-blue-500">Services</span>
                </h2>

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
