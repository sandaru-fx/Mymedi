import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/apiConfig';
import { MessageSquare, Send, CheckCircle, XCircle, Clock, Image as ImageIcon } from 'lucide-react';

interface Medicine {
    _id: string;
    medicineName: string;
    description: string;
    priceRange: string;
    uses: string;
    howToUse: string;
}

interface Message {
    sender: 'USER' | 'ADMIN';
    text: string;
    timestamp: string;
}

interface Report {
    _id: string;
    userEmail: string;
    pharmacyName: string;
    medicineName: string;
    pricePaid: string;
    receiptImage: string;
    status: string;
    date: string;
    province?: string;
    district?: string;
    messages: Message[];
}

interface AdminDashboardProps {
    onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [activeSection, setActiveSection] = useState('overview');
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [adminChatMsg, setAdminChatMsg] = useState('');

    // Medicine Form State
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        medicineName: '',
        displayName: '',
        description: '',
        uses: '',
        howToUse: '',
        priceRange: '',
        foodInteractions: '',
        disclaimer: ''
    });
    const [editingMedicineId, setEditingMedicineId] = useState<string | null>(null);

    useEffect(() => {
        if (activeSection === 'medicines') fetchMedicines();
        if (activeSection === 'inquiries' || activeSection === 'analytics') fetchReports();
        if (activeSection === 'messages') fetchContactMessages();
    }, [activeSection]);

    const fetchMedicines = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/all-medicines`);
            const data = await res.json();
            setMedicines(data);
        } catch (error) { console.error("Fetch medicines failed"); }
    };

    const fetchReports = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/reports/all?role=ADMIN`);
            const data = await res.json();
            setReports(data);
        } catch (error) { console.error("Fetch reports failed"); }
    };

    const fetchContactMessages = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/contact`);
            const data = await res.json();
            setMessages(data);
        } catch (error) { console.error("Fetch messages failed"); }
    };

    const handleAddMedicine = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingMedicineId
                ? `${API_BASE_URL}/admin/update-medicine/${editingMedicineId}`
                : `${API_BASE_URL}/admin/add-medicine`;

            const method = editingMedicineId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowAddModal(false);
                setEditingMedicineId(null);
                setFormData({
                    medicineName: '', displayName: '', description: '',
                    uses: '', howToUse: '', priceRange: '',
                    foodInteractions: '', disclaimer: ''
                });
                fetchMedicines();
                alert(editingMedicineId ? "Medicine Updated!" : "Medicine Added!");
            }
        } catch (error) { alert("Failed"); }
    };

    const handleEditClick = (med: Medicine) => {
        setFormData({
            medicineName: med.medicineName,
            displayName: '', // Add if available in type
            description: med.description,
            uses: med.uses,
            howToUse: med.howToUse,
            priceRange: med.priceRange,
            foodInteractions: '',
            disclaimer: ''
        });
        setEditingMedicineId(med._id);
        setShowAddModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this?")) return;
        try {
            await fetch(`${API_BASE_URL}/admin/delete-medicine/${id}`, { method: 'DELETE' });
            fetchMedicines();
        } catch (error) { alert("Delete failed"); }
    };

    const handleSendAdminMessage = async () => {
        if (!selectedReport || !adminChatMsg.trim()) return;
        try {
            // Optimistic
            const newMsg: Message = { sender: 'ADMIN', text: adminChatMsg, timestamp: new Date().toISOString() };
            const updated = { ...selectedReport, messages: [...selectedReport.messages, newMsg] };
            setSelectedReport(updated);
            setAdminChatMsg('');

            await fetch(`${API_BASE_URL}/reports/${selectedReport._id}/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sender: 'ADMIN', text: newMsg.text })
            });
        } catch (error) { console.error("Msg failed"); }
    };

    const updateReportStatus = async (status: string) => {
        if (!selectedReport) return;
        try {
            const res = await fetch(`${API_BASE_URL}/reports/${selectedReport._id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setSelectedReport({ ...selectedReport, status });
                fetchReports(); // Refresh list
            }
        } catch (err) { console.error("Status update failed"); }
    };

    return (
        <div className="w-full min-h-screen bg-gray-900 text-white font-sans relative overflow-hidden">
            {/* Background 3D Elements (CSS) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob top-10 left-10"></div>
                <div className="absolute w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 top-10 right-10"></div>
            </div>

            <div className="relative z-10 flex h-screen">
                {/* Sidebar */}
                <div className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col">
                    <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 mb-10">
                        ADMIN PRIME
                    </h1>
                    <nav className="space-y-4">
                        <button onClick={() => setActiveSection('overview')} className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeSection === 'overview' ? 'bg-teal-500/20 text-teal-300' : 'hover:bg-white/5 text-gray-400'}`}>📊 Overview</button>
                        <button onClick={() => setActiveSection('medicines')} className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeSection === 'medicines' ? 'bg-teal-500/20 text-teal-300' : 'hover:bg-white/5 text-gray-400'}`}>💊 Medicines</button>
                        <button onClick={() => setActiveSection('inquiries')} className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeSection === 'inquiries' ? 'bg-teal-500/20 text-teal-300' : 'hover:bg-white/5 text-gray-400'}`}>📨 Price Reports</button>
                        <button onClick={() => setActiveSection('messages')} className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeSection === 'messages' ? 'bg-teal-500/20 text-teal-300' : 'hover:bg-white/5 text-gray-400'}`}>💬 Messages</button>
                        <button onClick={() => setActiveSection('analytics')} className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeSection === 'analytics' ? 'bg-teal-500/20 text-teal-300' : 'hover:bg-white/5 text-gray-400'}`}>📈 Analytics</button>

                        <div className="pt-8 mt-auto border-t border-white/10 space-y-2">
                            <button onClick={() => setActiveSection('profile')} className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeSection === 'profile' ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/5 text-gray-400'}`}>👤 Admin Profile</button>
                            <button onClick={onLogout} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-400 transition-all">🚪 Logout</button>
                        </div>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-10 overflow-y-auto">

                    {/* OVERVIEW */}
                    {activeSection === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                <h3 className="text-gray-400">Total Medicines</h3>
                                <p className="text-4xl font-bold">{medicines.length > 0 ? medicines.length : '50+'}</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                <h3 className="text-gray-400">Pending Reports</h3>
                                <p className="text-4xl font-bold text-yellow-400">{reports.filter(r => r.status === 'Pending').length}</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                <h3 className="text-gray-400">Unread Messages</h3>
                                <p className="text-4xl font-bold text-teal-400">{messages.filter(m => m.status === 'Unread').length}</p>
                            </div>
                        </div>
                    )}

                    {/* MEDICINE MANAGER */}
                    {activeSection === 'medicines' && (
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-bold">Medicine Database</h2>
                                <button onClick={() => {
                                    setEditingMedicineId(null);
                                    setFormData({
                                        medicineName: '', displayName: '', description: '',
                                        uses: '', howToUse: '', priceRange: '',
                                        foodInteractions: '', disclaimer: ''
                                    });
                                    setShowAddModal(true);
                                }} className="bg-gradient-to-r from-teal-500 to-blue-600 px-6 py-2 rounded-lg font-bold hover:shadow-lg">+ Add New</button>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-black/20 text-gray-400">
                                        <tr><th className="p-4">Name</th><th className="p-4">Price</th><th className="p-4 text-right">Actions</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {medicines.map((med) => (
                                            <tr key={med._id}>
                                                <td className="p-4 font-medium text-teal-300">{med.medicineName}</td>
                                                <td className="p-4">{med.priceRange}</td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => handleEditClick(med)} className="text-teal-400 hover:text-teal-300 font-bold transition-colors">Edit</button>
                                                    <button onClick={() => handleDelete(med._id)} className="text-red-400 ml-4 hover:text-red-300 transition-colors">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* INQUIRIES & CHAT */}
                    {activeSection === 'inquiries' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
                            {/* List */}
                            <div className="col-span-1 bg-white/5 rounded-2xl p-4 overflow-y-auto border border-white/10">
                                <h2 className="text-xl font-bold mb-4">Price Reports</h2>
                                {reports.map(rep => (
                                    <div key={rep._id} onClick={() => setSelectedReport(rep)}
                                        className={`p-4 rounded-xl mb-2 cursor-pointer transition-all ${selectedReport?._id === rep._id ? 'bg-teal-500/20 border border-teal-500/50' : 'bg-white/5 hover:bg-white/10'}`}>
                                        <div className="flex justify-between">
                                            <span className="font-bold">{rep.pharmacyName}</span>
                                            <span className="text-xs bg-black/30 px-2 py-1 rounded">{rep.status}</span>
                                        </div>
                                        <div className="text-sm text-gray-400 mt-1">{rep.userEmail}</div>
                                        <div className="text-xs text-gray-500 mt-2 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(rep.date).toLocaleDateString()}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Chat & Details */}
                            <div className="col-span-2 bg-white/5 rounded-2xl border border-white/10 flex flex-col overflow-hidden">
                                {selectedReport ? (
                                    <>
                                        <div className="p-6 bg-black/20 border-b border-white/10 flex justify-between items-start">
                                            <div>
                                                <h3 className="text-2xl font-bold">{selectedReport.pharmacyName}</h3>
                                                <p className="text-teal-400 text-sm">Reported by: {selectedReport.nic} ({selectedReport.userEmail})</p>
                                                <p className="text-sm text-gray-400 mt-1">Medicine: {selectedReport.medicineName} | Price: Rs.{selectedReport.pricePaid}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => updateReportStatus('Resolved')} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 font-bold text-xs">RESOLVE</button>
                                                <button onClick={() => updateReportStatus('Rejected')} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 font-bold text-xs">REJECT</button>
                                            </div>
                                        </div>

                                        {/* Receipt Image */}
                                        {selectedReport.receiptImage && (
                                            <div className="p-6 border-b border-white/10 cursor-pointer group relative">
                                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Proof Check</h4>
                                                <img src={selectedReport.receiptImage} alt="Receipt" className="h-40 object-cover rounded-lg border border-white/20 group-hover:scale-105 transition-transform" />
                                            </div>
                                        )}

                                        {/* Messages */}
                                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                            {selectedReport.messages.map((msg, i) => (
                                                <div key={i} className={`flex ${msg.sender === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${msg.sender === 'ADMIN' ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                                        <p className="text-xs opacity-50 mb-1">{msg.sender}</p>
                                                        {msg.text}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Input */}
                                        <div className="p-4 bg-black/30 flex gap-2">
                                            <input className="flex-1 bg-white/10 rounded-full px-4 outline-none border border-white/5 focus:border-teal-500"
                                                value={adminChatMsg} onChange={e => setAdminChatMsg(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendAdminMessage()} placeholder="Reply to user..." />
                                            <button onClick={handleSendAdminMessage} className="p-3 bg-teal-500 rounded-full hover:scale-110"><Send className="w-5 h-5" /></button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-gray-500">Select a report to view details</div>
                                )}
                            </div>
                        </div>
                    )}
                    {/* MESSAGES (NEW) */}
                    {activeSection === 'messages' && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-white mb-6">General Messages</h2>
                            <div className="grid gap-4">
                                {messages.map(msg => (
                                    <div key={msg._id} className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-teal-400">{msg.subject}</h3>
                                                <p className="text-sm text-gray-400">From: {msg.name} ({msg.email})</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${msg.status === 'Unread' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                                                    {msg.status}
                                                </span>
                                                <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed bg-black/20 p-4 rounded-xl">{msg.message}</p>
                                        <div className="mt-4 flex gap-2">
                                            <a href={`mailto:${msg.email}`} className="px-4 py-2 bg-teal-500/20 text-teal-400 rounded-lg text-sm font-bold hover:bg-teal-500/30 transition-colors">
                                                Reply via Email
                                            </a>
                                            {msg.status === 'Unread' && (
                                                <button
                                                    onClick={async () => {
                                                        await fetch(`${API_BASE_URL}/contact/${msg._id}/status`, {
                                                            method: 'PATCH',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ status: 'Read' })
                                                        });
                                                        fetchContactMessages();
                                                    }}
                                                    className="px-4 py-2 bg-white/5 text-gray-400 rounded-lg text-sm font-bold hover:bg-white/10 transition-colors"
                                                >
                                                    Mark as Read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {messages.length === 0 && (
                                    <div className="text-center py-20 text-gray-500">
                                        <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                        <p>No messages found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ANALYTICS (NEW) */}
                    {activeSection === 'analytics' && (
                        <div className="space-y-8 animate-fade-in-up">
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500">
                                📊 Static Analysis Engine
                            </h2>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                    <h3 className="text-gray-400 text-sm">Total Inquiries</h3>
                                    <p className="text-4xl font-bold">{reports.length}</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                    <h3 className="text-gray-400 text-sm">Most Reported Area</h3>
                                    <p className="text-xl font-bold text-yellow-400 truncate">
                                        {Object.entries(reports.reduce((acc, curr) => {
                                            acc[curr.district || 'Unknown'] = (acc[curr.district || 'Unknown'] || 0) + 1;
                                            return acc;
                                        }, {} as any)).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* HOTSPOT ZONES */}
                                <div className="bg-black/30 p-6 rounded-2xl border border-white/10">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        🔴 High Risk Zones <span className="text-xs font-normal text-gray-500">(By District)</span>
                                    </h3>
                                    <div className="space-y-4">
                                        {Object.entries(reports.reduce((acc, curr) => {
                                            if (curr.district) acc[curr.district] = (acc[curr.district] || 0) + 1;
                                            return acc;
                                        }, {} as any)).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5).map(([district, count]: any, index) => (
                                            <div key={district} className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center font-bold text-sm">#{index + 1}</div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between mb-1">
                                                        <span className="font-bold">{district}</span>
                                                        <span className="text-sm text-gray-400">{count} Reports</span>
                                                    </div>
                                                    <div className="w-full bg-white/5 rounded-full h-2">
                                                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(count / reports.length) * 100}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {reports.length === 0 && <p className="text-gray-500">No data available yet.</p>}
                                    </div>
                                </div>

                                {/* TOP MEDICINES */}
                                <div className="bg-black/30 p-6 rounded-2xl border border-white/10">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        💊 Most Reported Medicines
                                    </h3>
                                    <div className="space-y-4">
                                        {Object.entries(reports.reduce((acc, curr) => {
                                            acc[curr.medicineName] = (acc[curr.medicineName] || 0) + 1;
                                            return acc;
                                        }, {} as any)).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5).map(([name, count]: any, index) => (
                                            <div key={name} className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-500 flex items-center justify-center font-bold text-sm">#{index + 1}</div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between mb-1">
                                                        <span className="font-bold">{name}</span>
                                                        <span className="text-sm text-gray-400">{count} Cases</span>
                                                    </div>
                                                    <div className="w-full bg-white/5 rounded-full h-2">
                                                        <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${(count / reports.length) * 100}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {reports.length === 0 && <p className="text-gray-500">No data available yet.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ADMIN PROFILE */}
                    {activeSection === 'profile' && (
                        <div className="max-w-2xl mx-auto animate-fade-in-up">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-teal-500 to-blue-600 opacity-20"></div>

                                <div className="relative z-10">
                                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-teal-400 to-blue-600 rounded-full p-1 mb-6 shadow-2xl shadow-teal-500/20">
                                        <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                                            <span className="text-4xl">👨‍💻</span>
                                        </div>
                                    </div>

                                    <h2 className="text-3xl font-black text-white mb-2">Super Admin</h2>
                                    <p className="text-teal-400 font-bold mb-6">System Administrator</p>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-black/30 p-4 rounded-xl">
                                            <p className="text-gray-400 text-xs">EMAIL</p>
                                            <p className="font-mono text-sm">admin@mediguide.lk</p>
                                        </div>
                                        <div className="bg-black/30 p-4 rounded-xl">
                                            <p className="text-gray-400 text-xs">ACCESS LEVEL</p>
                                            <p className="font-mono text-sm text-yellow-400">ROOT / LEVEL 5</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 text-left">
                                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-teal-500/30 transition-colors">
                                            <span className="text-gray-300">System Status</span>
                                            <span className="text-green-400 font-bold text-xs bg-green-500/20 px-2 py-1 rounded">ONLINE</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-teal-500/30 transition-colors">
                                            <span className="text-gray-300">Database Connection</span>
                                            <span className="text-green-400 font-bold text-xs bg-green-500/20 px-2 py-1 rounded">CONNECTED</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-teal-500/30 transition-colors">
                                            <span className="text-gray-300">Last Login</span>
                                            <span className="text-gray-400 text-sm">{new Date().toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ADD MEDICINE MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-gray-800 border border-white/10 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                        <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                        <h2 className="text-2xl font-bold mb-6">{editingMedicineId ? 'Edit Medicine' : 'Add New Medicine'}</h2>
                        <form onSubmit={handleAddMedicine} className="space-y-4">
                            <input required className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white" placeholder="Search Key (e.g. panadol)" value={formData.medicineName} onChange={e => setFormData({ ...formData, medicineName: e.target.value })} />
                            <input required className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white" placeholder="Price Range" value={formData.priceRange} onChange={e => setFormData({ ...formData, priceRange: e.target.value })} />
                            <textarea required className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            <textarea className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white" placeholder="Uses (comma separated)" value={formData.uses} onChange={e => setFormData({ ...formData, uses: e.target.value })} />
                            <textarea className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white" placeholder="How to Use" value={formData.howToUse} onChange={e => setFormData({ ...formData, howToUse: e.target.value })} />
                            <button type="submit" className="w-full bg-teal-500 py-3 rounded-lg font-bold">{editingMedicineId ? 'Update Medicine' : 'Add Medicine'}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
