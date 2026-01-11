import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, CreditCard, Save, Edit2, Loader, FileText, MessageSquare, Heart, Clock, AlertCircle, CheckCircle, Search } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { API_BASE_URL } from '../config/apiConfig';

const ProfileView = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'profile' | 'reports' | 'messages' | 'saved'>('profile');

    // Profile State
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({ name: '', email: '', phone: '', nic: '', address: '' });

    // Data State
    const [reports, setReports] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [savedMeds, setSavedMeds] = useState<any[]>([]);

    const isGoogleUser = user?.externalAccounts.some(acc => acc.provider === 'google') || false;

    useEffect(() => {
        if (isLoaded && user) fetchData();
    }, [isLoaded, user]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const token = await getToken();
            if (!token) return;

            // 1. Fetch Profile
            const profileRes = await fetch(`${API_BASE_URL}/users/profile`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (profileRes.ok) {
                const data = await profileRes.json();
                setProfileData({
                    name: data.name || user?.fullName || '',
                    email: data.email || user?.primaryEmailAddress?.emailAddress || '',
                    phone: data.phone || '',
                    nic: data.nic || '',
                    address: data.address || ''
                });
            }

            // 2. Fetch Reports
            const reportsRes = await fetch(`${API_BASE_URL}/reports/all?email=${user?.primaryEmailAddress}`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (reportsRes.ok) setReports(await reportsRes.json());

            // 3. Fetch Messages
            const msgsRes = await fetch(`${API_BASE_URL}/contact/my`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (msgsRes.ok) setMessages(await msgsRes.json());

            // 4. Fetch Saved Meds
            const savedRes = await fetch(`${API_BASE_URL}/users/saved`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (savedRes.ok) setSavedMeds(await savedRes.json());

        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(profileData)
            });
            if (res.ok) setIsEditing(false);
        } catch (error) { console.error("Update failed", error); } finally { setIsSaving(false); }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-teal-500"><Loader className="animate-spin w-10 h-10" /></div>;

    const TabButton = ({ id, label, icon: Icon }: any) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bold transition-all ${activeTab === id
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'
                }`}
        >
            <Icon size={20} />
            <span className="text-lg">{label}</span>
        </button>
    );

    return (
        <div className="relative bg-white dark:bg-slate-900 w-full min-h-screen pt-32 pb-20 px-6 transition-colors duration-300">
            {/* Background 3D */}
            <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 10] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}><Sphere args={[3, 64, 64]} position={[10, 0, -5]}><MeshDistortMaterial color="#14b8a6" speed={2} distort={0.3} radius={1} /></Sphere></Float>
                </Canvas>
            </div>

            <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 text-center border border-slate-200 dark:border-white/10 shadow-xl">
                        <div className="relative inline-block mb-4">
                            <img src={user?.imageUrl} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-xl" />
                            <div className="absolute bottom-0 right-0 p-1.5 bg-teal-500 rounded-full border-4 border-white dark:border-slate-800"><User size={14} className="text-white" /></div>
                        </div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white truncate">{user?.fullName}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-bold truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                    </div>

                    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[2rem] p-4 border border-slate-200 dark:border-white/10 shadow-xl space-y-2">
                        <TabButton id="profile" label="Profile" icon={User} />
                        <TabButton id="reports" label="My Reports" icon={FileText} />
                        <TabButton id="messages" label="Inquiries" icon={MessageSquare} />
                        <TabButton id="saved" label="Saved Meds" icon={Heart} />
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 p-8 md:p-12">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">Personal Details</h2>
                                    {!isEditing ? (
                                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl font-bold hover:bg-teal-500/20"><Edit2 size={16} /> Edit</button>
                                    ) : (
                                        <div className="flex gap-3">
                                            <button onClick={() => setIsEditing(false)} className="px-5 py-2 bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-xl font-bold">Cancel</button>
                                            <button onClick={handleSaveProfile} disabled={isSaving} className="flex items-center gap-2 px-5 py-2 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700">{isSaving ? 'Saving...' : 'Save'}</button>
                                        </div>
                                    )}
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} disabled={!isEditing || isGoogleUser} className={`w-full p-4 rounded-xl font-bold outline-none ${isEditing && !isGoogleUser ? 'bg-white dark:bg-black/20 border-2 border-teal-500/50' : 'bg-slate-100 dark:bg-black/40 text-slate-500'}`} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                                        <input type="text" value={profileData.email} disabled className="w-full p-4 rounded-xl font-bold outline-none bg-slate-100 dark:bg-black/40 text-slate-500 cursor-not-allowed" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                                        <input type="text" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} disabled={!isEditing} className={`w-full p-4 rounded-xl font-bold outline-none ${isEditing ? 'bg-white dark:bg-black/20 border-2 border-teal-500/50' : 'bg-slate-100 dark:bg-black/40 text-slate-500'}`} placeholder="Not set" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">NIC</label>
                                        <input type="text" value={profileData.nic} onChange={(e) => setProfileData({ ...profileData, nic: e.target.value })} disabled={!isEditing} className={`w-full p-4 rounded-xl font-bold outline-none ${isEditing ? 'bg-white dark:bg-black/20 border-2 border-teal-500/50' : 'bg-slate-100 dark:bg-black/40 text-slate-500'}`} placeholder="Not set" />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Address</label>
                                        <textarea rows={2} value={profileData.address} onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} disabled={!isEditing} className={`w-full p-4 rounded-xl font-bold outline-none resize-none ${isEditing ? 'bg-white dark:bg-black/20 border-2 border-teal-500/50' : 'bg-slate-100 dark:bg-black/40 text-slate-500'}`} placeholder="Not set" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'reports' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Report History</h2>
                                {reports.length === 0 ? (
                                    <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-white/10">
                                        <FileText size={48} className="mx-auto text-slate-600 mb-4" />
                                        <p className="text-slate-500 font-bold">No reports submitted yet.</p>
                                    </div>
                                ) : (
                                    reports.map((report) => (
                                        <div key={report._id} className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className={`p-3 rounded-2xl ${report.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-600' : report.status === 'Resolved' ? 'bg-green-500/20 text-green-600' : 'bg-blue-500/20 text-blue-600'}`}>
                                                    {report.status === 'Pending' ? <Clock size={24} /> : report.status === 'Resolved' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{report.pharmacyName}</h3>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">{report.medicineName} • {new Date(report.date).toLocaleDateString()}</p>
                                                    <span className={`inline-block md:hidden mt-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${report.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{report.status}</span>
                                                </div>
                                            </div>
                                            <div className="hidden md:block">
                                                <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider ${report.status === 'Pending' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                                                        report.status === 'Replied' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' :
                                                            'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                                                    }`}>
                                                    {report.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'messages' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Inqiury Messages</h2>
                                {messages.length === 0 ? (
                                    <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-white/10">
                                        <MessageSquare size={48} className="mx-auto text-slate-600 mb-4" />
                                        <p className="text-slate-500 font-bold">No inquiries sent yet.</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <div key={msg._id} className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{msg.subject}</h3>
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{new Date(msg.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${msg.status === 'Replied' ? 'bg-green-500/20 text-green-500' : 'bg-slate-500/20 text-slate-500'}`}>{msg.status}</span>
                                            </div>
                                            <div className="bg-slate-100 dark:bg-black/20 p-4 rounded-xl text-slate-600 dark:text-slate-300 font-medium text-sm">
                                                {msg.message}
                                            </div>
                                            {msg.adminReply && (
                                                <div className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-xl ml-8 relative">
                                                    <div className="absolute -left-2 top-0 bottom-0 w-1 bg-teal-500 rounded-full"></div>
                                                    <p className="text-xs font-black text-teal-600 uppercase tracking-widest mb-1">Admin Reply</p>
                                                    <p className="text-slate-700 dark:text-teal-100 font-medium text-sm">{msg.adminReply}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'saved' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Saved Medicines</h2>
                                {savedMeds.length === 0 ? (
                                    <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-white/10">
                                        <Heart size={48} className="mx-auto text-slate-600 mb-4" />
                                        <p className="text-slate-500 font-bold">No medicines saved yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {savedMeds.map((med) => (
                                            <div key={med._id} className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg group hover:scale-[1.02] transition-transform">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{med.medicineName}</h3>
                                                    <div className="p-2 bg-red-500/10 text-red-500 rounded-full">
                                                        <Heart size={20} fill="currentColor" />
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mb-4">{med.description}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-teal-600 dark:text-teal-400 font-black">{med.priceRange}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
