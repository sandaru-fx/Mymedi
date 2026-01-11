import React, { useState, useEffect, useRef } from 'react';
import { Camera, Send, MessageSquare, Plus, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { API_BASE_URL } from '../config/apiConfig';

interface Message {
    sender: 'USER' | 'ADMIN';
    text: string;
    timestamp: string;
}

interface Report {
    _id: string;
    pharmacyName: string;
    medicineName: string;
    status: string;
    date: string;
    messages: Message[];
}

const SL_LOCATIONS: Record<string, string[]> = {
    "Western": ["Colombo", "Gampaha", "Kalutara"],
    "Central": ["Kandy", "Matale", "Nuwara Eliya"],
    "Southern": ["Galle", "Matara", "Hambantota"],
    "Northern": ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"],
    "Eastern": ["Batticaloa", "Ampara", "Trincomalee"],
    "North Western": ["Kurunegala", "Puttalam"],
    "North Central": ["Anuradhapura", "Polonnaruwa"],
    "Uva": ["Badulla", "Monaragala"],
    "Sabaragamuwa": ["Ratnapura", "Kegalle"]
};

const ReportsView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');
    const [reports, setReports] = useState<Report[]>([]);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        userEmail: 'user@mediguide.lk', // Mock or get from context
        nic: '',
        pharmacyName: '',
        location: '', // Still keep for specific town/street
        province: '', // NEW
        district: '', // NEW
        medicineName: '',
        pricePaid: '',
        receiptImage: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [chatMessage, setChatMessage] = useState('');

    useEffect(() => {
        if (activeTab === 'history') {
            fetchReports();
        }
    }, [activeTab]);

    const fetchReports = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/reports/all?email=${formData.userEmail}`);
            const data = await res.json();
            setReports(data);
        } catch (error) {
            console.error("Failed to fetch reports");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, receiptImage: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const [showSuccess, setShowSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSubmitError(null);
        try {
            console.log("Submitting report...");
            const res = await fetch(`${API_BASE_URL}/reports/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Server rejected submission");
            }

            // Success!
            setShowSuccess(true);
            setActiveTab('history');

            // Clear form
            setFormData({ ...formData, pharmacyName: '', pricePaid: '', receiptImage: '' });

            // Hide success msg after 3s
            setTimeout(() => setShowSuccess(false), 3000);

        } catch (error: any) {
            console.error("Submission error:", error);
            setSubmitError(error.message || "Failed to connect to server.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!selectedReport || !chatMessage.trim()) return;

        try {
            // Optimistic update
            const newMessage: Message = { sender: 'USER', text: chatMessage, timestamp: new Date().toISOString() };
            const updatedReport = { ...selectedReport, messages: [...selectedReport.messages, newMessage] };
            setSelectedReport(updatedReport);
            setChatMessage('');

            await fetch(`${API_BASE_URL}/reports/${selectedReport._id}/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sender: 'USER', text: newMessage.text })
            });

            // Refresh to get any sync updates
            // fetchReports(); 
        } catch (error) {
            console.error("Message failed");
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-6 animate-fade-in-up pb-24">
            <h1 className="text-4xl font-black mb-8 text-center text-slate-900 dark:text-white">Price Reporting Center</h1>

            {showSuccess && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-2xl flex items-center justify-center gap-2 text-green-600 animate-fade-in-up">
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-bold">Report Submitted Successfully! Admin will review it shortly.</span>
                </div>
            )}

            {submitError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-2xl flex items-center justify-center gap-2 text-red-600 animate-fade-in-up">
                    <XCircle className="w-6 h-6" />
                    <span className="font-bold">{submitError}</span>
                </div>
            )}

            <div className="flex justify-center gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('submit')}
                    className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${activeTab === 'submit' ? 'bg-teal-500 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-500'}`}
                >
                    <Plus className="w-5 h-5" /> Submit Complaint
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${activeTab === 'history' ? 'bg-teal-500 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-500'}`}
                >
                    <FileText className="w-5 h-5" /> My Reports
                </button>
            </div>

            {activeTab === 'submit' && (
                <div className="glass-card p-8 rounded-[2rem] max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2">My NIC Number</label>
                                <input required className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-teal-500"
                                    placeholder="e.g. 981234567V"
                                    value={formData.nic}
                                    onChange={e => setFormData({ ...formData, nic: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2">Pharmacy Name</label>
                                <input required className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-teal-500"
                                    placeholder="Which pharmacy?"
                                    value={formData.pharmacyName}
                                    onChange={e => setFormData({ ...formData, pharmacyName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2">Province</label>
                                <select required className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-teal-500"
                                    value={formData.province}
                                    onChange={e => setFormData({ ...formData, province: e.target.value, district: '' })}
                                >
                                    <option value="">Select Province</option>
                                    {Object.keys(SL_LOCATIONS).map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2">District</label>
                                <select required className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-teal-500"
                                    value={formData.district}
                                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                                    disabled={!formData.province}
                                >
                                    <option value="">Select District</option>
                                    {formData.province && SL_LOCATIONS[formData.province].map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">Exact Location / Town</label>
                            <input required className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="e.g. Town Hall, Colombo 7"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">Medicine Bought</label>
                            <input required className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="Medicine Name"
                                value={formData.medicineName}
                                onChange={e => setFormData({ ...formData, medicineName: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">Price Charged (Rs)</label>
                            <input required type="number" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="0.00"
                                value={formData.pricePaid}
                                onChange={e => setFormData({ ...formData, pricePaid: e.target.value })}
                            />
                        </div>

                        <div className="bg-slate-100 dark:bg-slate-900/50 p-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center cursor-pointer hover:border-teal-500 transition-colors"
                            onClick={() => fileInputRef.current?.click()}>
                            <Camera className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                            <p className="text-slate-500 font-medium">Upload Receipt Photo</p>
                            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            {formData.receiptImage && <p className="text-teal-500 font-bold mt-2">Image Selected!</p>}
                        </div>

                        <button disabled={isLoading} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-xl shadow-xl hover:scale-105 transition-all">
                            {isLoading ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
                    {/* List */}
                    <div className="overflow-y-auto space-y-4 pr-2">
                        {reports.map(report => (
                            <div key={report._id}
                                onClick={() => setSelectedReport(report)}
                                className={`p-6 rounded-2xl cursor-pointer transition-all border ${selectedReport?._id === report._id ? 'bg-teal-500/10 border-teal-500' : 'glass-card border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">{report.pharmacyName}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${report.status === 'Resolved' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                        {report.status}
                                    </span>
                                </div>
                                <p className="text-slate-500 text-sm mb-1">{report.medicineName}</p>
                                <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(report.date).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {report.messages.length} msgs</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chat Area */}
                    <div className="glass-card rounded-[2rem] overflow-hidden flex flex-col h-full relative">
                        {selectedReport ? (
                            <>
                                <div className="bg-slate-100 dark:bg-slate-900 p-4 border-b dark:border-slate-800 flex justify-between items-center">
                                    <h3 className="font-bold">Case #{selectedReport._id.slice(-6)}</h3>
                                    <span className="text-xs text-slate-500">Direct Line with Admin</span>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {selectedReport.messages.length === 0 && (
                                        <div className="text-center text-slate-400 mt-10">No messages yet.</div>
                                    )}
                                    {selectedReport.messages.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${msg.sender === 'USER' ? 'bg-teal-500 text-white rounded-br-none' : 'bg-slate-200 dark:bg-slate-800 rounded-bl-none'}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 bg-white dark:bg-slate-950 border-t dark:border-slate-800 flex gap-2">
                                    <input
                                        className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-full px-4 outline-none"
                                        placeholder="Type a message..."
                                        value={chatMessage}
                                        onChange={e => setChatMessage(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <button onClick={handleSendMessage} className="p-3 bg-teal-500 rounded-full text-white hover:scale-110 transition-transform">
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
                                <p>Select a report to view chat</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsView;
