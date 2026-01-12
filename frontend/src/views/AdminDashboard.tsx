import React, { useState, useEffect } from 'react';
import DashboardCharts from '../components/admin/DashboardCharts';
import ActivityFeed from '../components/admin/ActivityFeed';
import AuditLogViewer from '../components/admin/AuditLogViewer';
import HealthBadge from '../components/admin/HealthBadge';
import { API_BASE_URL } from '../config/apiConfig';
import { MessageSquare, Send, CheckCircle, XCircle, Clock, Image as ImageIcon, Sun, Moon, FileText, Shield, Activity, AlertTriangle } from 'lucide-react';

interface Medicine {
    _id: string;
    image?: string; // Base64 or URL
    medicineName: string;
    description: string;
    priceRange: string;
    uses: string;
    howToUse: string;
    sideEffects?: string[];
    foodInteractions?: string;
    disclaimer?: string;
}

interface Message {
    sender: 'USER' | 'ADMIN';
    text: string;
    timestamp: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isBanned: boolean;
    createdAt: string;
}

interface ContactMessage {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'Unread' | 'Read' | 'Replied';
    adminReply?: string;
    isBlocked: boolean;
    createdAt: string;
}

interface Report {
    _id: string;
    userEmail: string;
    nic?: string;
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
    isDarkMode: boolean;
    toggleTheme: () => void;
}

import { useAuth } from '@clerk/clerk-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// District Coordinates for Sri Lanka
const DISTRICT_COORDS: Record<string, [number, number]> = {
    "Colombo": [6.9271, 79.8612],
    "Gampaha": [7.0840, 80.0098],
    "Kalutara": [6.5854, 79.9607],
    "Kandy": [7.2906, 80.6337],
    "Matale": [7.4675, 80.6234],
    "Nuwara Eliya": [6.9497, 80.7891],
    "Galle": [6.0535, 80.2210],
    "Matara": [5.9549, 80.5550],
    "Hambantota": [6.1246, 81.1245],
    "Jaffna": [9.6615, 80.0255],
    "Kilinochchi": [9.3803, 80.3992],
    "Mannar": [8.9810, 79.9044],
    "Vavuniya": [8.7542, 80.4982],
    "Mullaitivu": [9.2671, 80.8143],
    "Batticaloa": [7.7170, 81.7010],
    "Ampara": [7.2843, 81.6747],
    "Trincomalee": [8.5717, 81.2333],
    "Kurunegala": [7.4863, 80.3647],
    "Puttalam": [8.0330, 79.8300],
    "Anuradhapura": [8.3114, 80.4037],
    "Polonnaruwa": [7.9397, 81.0036],
    "Badulla": [6.9934, 81.0550],
    "Moneragala": [6.8916, 81.3500],
    "Ratnapura": [6.7056, 80.3847],
    "Kegalle": [7.2513, 80.3464]
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, isDarkMode, toggleTheme }) => {
    const { getToken, isSignedIn, isLoaded } = useAuth();
    const [activeSection, setActiveSection] = useState('overview');

    // Helper for Authenticated Requests
    const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
        try {
            const token = isLoaded && isSignedIn ? await getToken() : null;
            const headers = {
                ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
                ...(token ? { 'Authorization': `Bearer ${token}` } : { 'x-demo-admin': 'true' }),
                ...options.headers,
            };
            return fetch(url, { ...options, headers });
        } catch (error) {
            console.error("Auth Token Error", error);
            throw error;
        }
    };

    // Medicine Management State
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalMedicines, setTotalMedicines] = useState(0);

    const [reports, setReports] = useState<Report[]>([]);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [adminChatMsg, setAdminChatMsg] = useState('');
    const [replyingToId, setReplyingToId] = useState<string | null>(null);
    const [replyDraft, setReplyDraft] = useState('');
    const [showBlockedInquiries, setShowBlockedInquiries] = useState(false);

    const [users, setUsers] = useState<User[]>([]);
    const [aiInsight, setAiInsight] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);

    // Audit Logs & Fraud Analysis State
    const [auditLogs, setAuditLogs] = useState([]);
    const [fraudAnalysis, setFraudAnalysis] = useState<{ riskScore: number, reason: string, verdict: string } | null>(null);
    const [analyzingFraud, setAnalyzingFraud] = useState(false);

    // Prepare Activity Feed Data
    const activities = React.useMemo(() => {
        const reportActs = reports.slice(0, 10).map(r => ({
            id: r._id,
            type: 'REPO' as const,
            title: `Report: ${r.medicineName}`,
            subtitle: `${r.pharmacyName} - ${r.status}`,
            timestamp: r.date,
            status: r.status
        }));

        const msgActs = messages.slice(0, 10).map(m => ({
            id: m._id,
            type: 'MSG' as const,
            title: `Inquiry: ${m.subject}`,
            subtitle: m.name,
            timestamp: m.createdAt,
            status: m.status
        }));

        // Merge and sort by newest
        return [...reportActs, ...msgActs]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 15);
    }, [reports, messages]);

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
        disclaimer: '',
        image: ''
    });
    const [editingMedicineId, setEditingMedicineId] = useState<string | null>(null);

    useEffect(() => {
        // ALWAYS fetch reports and messages for counts in Overview
        fetchReports();
        fetchContactMessages();
        fetchMedicines(); // To get count for overview too

        if (activeSection === 'medicines') fetchMedicines();
        if (activeSection === 'medicines') fetchMedicines();
        if (activeSection === 'users') fetchUsers();
        if (activeSection === 'analytics') fetchAIAnalytics();
        if (activeSection === 'logs') fetchAuditLogs();
    }, [activeSection, page, searchQuery]); // Re-fetch on page or search change

    const fetchAuditLogs = async () => {
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/admin/audit-logs`);
            if (res.ok) {
                const data = await res.json();
                setAuditLogs(Array.isArray(data) ? data : []);
            }
        } catch (error) { console.error("Fetch logs failed"); }
    };

    const handleAnalyzeFraud = async (reportId: string) => {
        setAnalyzingFraud(true);
        setFraudAnalysis(null);
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/admin/analyze-fraud`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reportId })
            });
            const data = await res.json();
            setFraudAnalysis(data);
        } catch (error) { alert("Fraud Analysis Failed"); }
        finally { setAnalyzingFraud(false); }
    };

    const fetchAIAnalytics = async () => {
        if (aiInsight) return; // Only fetch once per session or manually
        setLoadingAI(true);
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/admin/ai-analytics`);
            const data = await res.json();
            if (data.insight) setAiInsight(data.insight);
        } catch (error) { console.error("AI Analytics failed"); }
        finally { setLoadingAI(false); }
    };

    const fetchMedicines = async () => {
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                search: searchQuery
            });
            const res = await authenticatedFetch(`${API_BASE_URL}/admin/all-medicines?${query}`);
            if (!res.ok) throw new Error("Failed to fetch medicines");

            const data = await res.json();

            // Handle new paginated response
            if (data.medicines) {
                setMedicines(data.medicines);
                setTotalPages(data.pages);
                setTotalMedicines(data.total);
            } else {
                // Fallback for legacy format if any
                setMedicines(Array.isArray(data) ? data : []);
            }
        } catch (error) { console.error("Fetch medicines failed"); }
    };

    const fetchReports = async () => {
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/reports/all?role=ADMIN`);
            if (!res.ok) throw new Error("Failed to fetch reports");
            const data = await res.json();
            setReports(Array.isArray(data) ? data : []);
        } catch (error) { console.error("Fetch reports failed"); }
    };

    const fetchContactMessages = async () => {
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/contact`);
            if (!res.ok) throw new Error("Failed to fetch messages");
            const data = await res.json();
            setMessages(Array.isArray(data) ? data : []);
        } catch (error) { console.error("Fetch messages failed"); }
    };

    const fetchUsers = async () => {
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/users/all`);
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();
            setUsers(data.users || []);
        } catch (error) { console.error("Fetch users failed"); }
    };

    const toggleBanUser = async (id: string, currentStatus: boolean) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? 'UNBAN' : 'BAN'} this user?`)) return;
        try {
            await authenticatedFetch(`${API_BASE_URL}/users/${id}/ban`, { method: 'PATCH' });
            fetchUsers();
        } catch (err) { alert("Action failed"); }
    };

    const handleAddMedicine = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const priceRegex = /^(\d+(\.\d{1,2})?|\d+(\.\d{1,2})?\s*-\s*\d+(\.\d{1,2})?)$/;
        if (!priceRegex.test(formData.priceRange)) {
            alert("Invalid Price Format! Use '100' or '100 - 200'");
            return;
        }

        try {
            const url = editingMedicineId
                ? `${API_BASE_URL}/admin/update-medicine/${editingMedicineId}`
                : `${API_BASE_URL}/admin/add-medicine`;

            const method = editingMedicineId ? 'PUT' : 'POST';

            const payload = {
                ...formData,
                displayName: formData.displayName || formData.medicineName,
                foodInteractions: formData.foodInteractions || "Consult your doctor"
            };

            const res = await authenticatedFetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                setShowAddModal(false);
                setEditingMedicineId(null);
                setFormData({
                    medicineName: '', displayName: '', description: '',
                    uses: '', howToUse: '', priceRange: '',
                    foodInteractions: '', disclaimer: '', image: ''
                });
                fetchMedicines();
                alert(editingMedicineId ? "Medicine Updated Successfully!" : "New Medicine Added to Database!");
            } else {
                throw new Error(data.error || "Operation failed");
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to save medicine. Check network connection.");
        }
    };

    const handleEditClick = (med: Medicine) => {
        setFormData({
            medicineName: med.medicineName,
            displayName: '', // Add if available in type
            description: med.description,
            uses: med.uses,
            howToUse: med.howToUse,
            priceRange: med.priceRange,
            foodInteractions: med.foodInteractions || '', // Ensure field exists
            disclaimer: med.disclaimer || '',
            image: med.image || ''
        });
        setEditingMedicineId(med._id);
        setShowAddModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this?")) return;
        try {
            await authenticatedFetch(`${API_BASE_URL}/admin/delete-medicine/${id}`, { method: 'DELETE' });
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

            await authenticatedFetch(`${API_BASE_URL}/reports/${selectedReport._id}/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sender: 'ADMIN', text: newMsg.text })
            });
        } catch (error) { console.error("Msg failed"); }
    };

    const updateReportStatus = async (status: string) => {
        if (!selectedReport) return;
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/reports/${selectedReport._id}/status`, {
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

    const handleReplyInquiry = async (id: string) => {
        if (!replyDraft.trim()) return;
        try {
            await authenticatedFetch(`${API_BASE_URL}/contact/${id}/reply`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminReply: replyDraft })
            });
            setReplyingToId(null);
            setReplyDraft('');
            fetchContactMessages();
        } catch (err) { alert("Reply failed"); }
    };

    const handleToggleBlockInquiry = async (id: string, currentStatus: boolean) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? 'Unblock' : 'Block'} this inquiry?`)) return;
        try {
            await authenticatedFetch(`${API_BASE_URL}/contact/${id}/block`, { method: 'PATCH' });
            fetchContactMessages();
        } catch (err) { alert("Block failed"); }
    };

    const exportToCSV = () => {
        const headers = ["Pharmacy", "Medicine", "Price", "Status", "Date", "District"];
        const rows = reports.map(r => [
            r.pharmacyName,
            r.medicineName,
            r.pricePaid,
            r.status,
            new Date(r.date).toLocaleDateString(),
            r.district || "N/A"
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "price_reports.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();

        // Header Background
        doc.setFillColor(0, 128, 128); // Teal color
        doc.rect(0, 0, 210, 40, 'F');

        // Title
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text("NATIONAL MEDICINES REGULATORY AUTHORITY", 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text("Official Pharmacy Inspection Report", 105, 30, { align: 'center' });

        // Metadata
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(`Generated By: Admin System`, 14, 50);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 55);
        doc.text(`Reference: REF-${Date.now().toString().slice(-6)}`, 14, 60);

        autoTable(doc, {
            startY: 70,
            head: [['Pharmacy', 'Medicine', 'Price (LKR)', 'Status', 'Date', 'District']],
            body: reports.map(r => [
                r.pharmacyName,
                r.medicineName,
                r.pricePaid,
                r.status,
                new Date(r.date).toLocaleDateString(),
                r.district || "N/A"
            ]),
            headStyles: { fillColor: [0, 128, 128], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            margin: { top: 70 },
        });

        // Safe Footer
        const pageCount = doc.internal.pages.length - 1; // Correct way to get page count might differ in versions, but typically safe
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("Confidential Document - Authorized Personnel Only", 105, 290, { align: 'center' });

        doc.save('NMRA_Official_Report.pdf');
    };

    const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/admin/bulk-upload`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                fetchMedicines();
            } else {
                alert("Upload failed: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            alert("Bulk upload failed");
        }
    };

    const [filterDistrict, setFilterDistrict] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    const filteredReports = reports.filter(r => {
        const matchesDistrict = filterDistrict === 'All' || (r.district && r.district === filterDistrict);
        const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
        return matchesDistrict && matchesStatus;
    });

    const uniqueDistricts = Array.from(new Set(reports.map(r => r.district).filter(Boolean)));

    return (
        <div className="w-full min-h-screen bg-slate-50 dark:bg-gray-900 text-slate-900 dark:text-white font-sans relative overflow-hidden transition-colors duration-300">
            {/* Background 3D Elements (CSS) - Visible in both but adjusted */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-50 dark:opacity-100">
                <div className="absolute w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob top-10 left-10"></div>
                <div className="absolute w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 top-10 right-10"></div>
            </div>

            <div className="relative z-10 flex h-screen">
                {/* Sidebar */}
                <div className="w-64 bg-white/80 dark:bg-white/5 backdrop-blur-xl border-r border-slate-200 dark:border-white/10 p-6 flex flex-col transition-colors duration-300 overflow-y-auto">
                    <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-500 mb-10">
                        ADMIN PRIME
                    </h1>
                    <nav className="space-y-4">
                        {[
                            { id: 'overview', label: '📊 Overview' },
                            { id: 'medicines', label: '💊 Medicines' },
                            { id: 'inquiries', label: '📨 Price Reports' },
                            { id: 'messages', label: '💬 Messages' },
                            { id: 'users', label: '👥 Users' },
                            { id: 'analytics', label: '📈 Analytics' },
                            { id: 'logs', label: '🛡️ Security Logs' },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold ${activeSection === item.id
                                    ? 'bg-teal-500/20 text-teal-700 dark:text-teal-300 shadow-sm'
                                    : 'hover:bg-slate-200 dark:hover:bg-white/5 text-slate-500 dark:text-gray-400'}`}
                            >
                                {item.label}
                            </button>
                        ))}

                        <div className="pt-8 mt-auto border-t border-slate-200 dark:border-white/10 space-y-2">
                            <button onClick={toggleTheme} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-white/5 text-slate-500 dark:text-gray-400 transition-all font-bold flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                </span>
                            </button>
                            <div className="px-4 py-2"><HealthBadge /></div>
                            <button onClick={() => setActiveSection('profile')} className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold ${activeSection === 'profile' ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300' : 'hover:bg-slate-200 dark:hover:bg-white/5 text-slate-500 dark:text-gray-400'}`}>👤 Admin Profile</button>
                            <button onClick={onLogout} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-all font-bold">🚪 Logout</button>
                        </div>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-10 overflow-y-auto">

                    {/* OVERVIEW */}
                    {activeSection === 'overview' && (
                        <div className="space-y-6">
                            {/* Metrics Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm transition-transform hover:scale-105">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-slate-500 dark:text-gray-400 font-bold text-sm uppercase">Total Medicines</p>
                                            <p className="text-4xl font-black text-slate-900 dark:text-white mt-2">{medicines.length > 0 ? medicines.length : '50+'}</p>
                                        </div>
                                        <div className="p-3 bg-blue-500/10 rounded-full text-blue-500">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm transition-transform hover:scale-105">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-slate-500 dark:text-gray-400 font-bold text-sm uppercase">Pending Reports</p>
                                            <p className="text-4xl font-black text-yellow-500 dark:text-yellow-400 mt-2">{reports.filter(r => r.status === 'Pending').length}</p>
                                        </div>
                                        <div className="p-3 bg-yellow-500/10 rounded-full text-yellow-500">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm transition-transform hover:scale-105">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-slate-500 dark:text-gray-400 font-bold text-sm uppercase">Unread Inquiries</p>
                                            <p className="text-4xl font-black text-teal-600 dark:text-teal-400 mt-2">{Array.isArray(messages) ? messages.filter(m => m.status === 'Unread').length : 0}</p>
                                        </div>
                                        <div className="p-3 bg-teal-500/10 rounded-full text-teal-500">
                                            <MessageSquare className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Analysis Section */}
                            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                                {/* Charts Column */}
                                <div className="xl:col-span-3">
                                    <DashboardCharts reports={reports} />
                                </div>

                                {/* Activity Feed Column */}
                                <div className="xl:col-span-1">
                                    <ActivityFeed activities={activities} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MEDICINE MANAGER */}
                    {activeSection === 'medicines' && (
                        <div>
                            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">Medicine Database</h2>
                                    <p className="text-slate-500 dark:text-gray-400 text-sm font-bold">{totalMedicines} medicines found</p>
                                </div>
                                <div className="flex gap-4 w-full md:w-auto">
                                    <div className="relative flex-1 md:w-64">
                                        <input
                                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2 px-4 pl-10 focus:border-teal-500 outline-none transition-colors text-slate-900 dark:text-white font-medium"
                                            placeholder="Search medicines..."
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setPage(1); // Reset to page 1 on search
                                            }}
                                        />
                                        <CheckCircle className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                                    </div>

                                    <label className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-2 rounded-lg font-bold hover:shadow-lg whitespace-nowrap cursor-pointer flex items-center gap-2">
                                        📄 Bulk Upload
                                        <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleBulkUpload} />
                                    </label>

                                    <button onClick={() => {
                                        setEditingMedicineId(null);
                                        setFormData({
                                            medicineName: '', displayName: '', description: '',
                                            uses: '', howToUse: '', priceRange: '',
                                            foodInteractions: '', disclaimer: '', image: ''
                                        });
                                        setShowAddModal(true);
                                    }} className="bg-gradient-to-r from-teal-500 to-blue-600 px-6 py-2 rounded-lg font-bold hover:shadow-lg whitespace-nowrap">+ Add New</button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-100 dark:bg-black/20 text-slate-500 dark:text-gray-400 border-b border-slate-200 dark:border-white/5">
                                        <tr>
                                            <th className="p-4 w-16">Image</th>
                                            <th className="p-4">Name</th>
                                            <th className="p-4">Uses</th>
                                            <th className="p-4">Price</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                                        {medicines.map((med) => (
                                            <tr key={med._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="p-4">
                                                    {med.image ? (
                                                        <img src={med.image} alt={med.medicineName} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-white/10" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-500">No Img</div>
                                                    )}
                                                </td>
                                                <td className="p-4 font-bold text-slate-900 dark:text-teal-300 capitalize">{med.medicineName}</td>
                                                <td className="p-4 text-sm text-slate-500 dark:text-gray-400 max-w-xs truncate">{med.uses}</td>
                                                <td className="p-4 font-mono font-bold text-orange-600 dark:text-yellow-400">{med.priceRange}</td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => handleEditClick(med)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold transition-colors mr-4">Edit</button>
                                                    <button onClick={() => handleDelete(med._id)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-bold transition-colors">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination Controls */}
                                <div className="p-4 flex justify-between items-center bg-black/20 border-t border-white/5">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        className="px-4 py-2 rounded-lg bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all font-bold text-sm"
                                    >
                                        ← Previous
                                    </button>
                                    <span className="text-sm font-medium text-gray-400">Page {page} of {totalPages}</span>
                                    <button
                                        disabled={page >= totalPages}
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        className="px-4 py-2 rounded-lg bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all font-bold text-sm"
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* INQUIRIES & CHAT */}
                    {activeSection === 'inquiries' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
                            {/* List */}
                            <div className="col-span-1 bg-white dark:bg-white/5 rounded-2xl p-4 overflow-y-auto border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Price Reports</h2>
                                    <div className="flex gap-2">
                                        <button onClick={exportToCSV} className="text-xs font-bold bg-green-100 text-green-700 dark:bg-green-600 dark:text-white px-3 py-1.5 rounded hover:bg-green-200 dark:hover:bg-green-700 transition-colors">CSV</button>
                                        <button onClick={exportToPDF} className="text-xs font-bold bg-red-100 text-red-700 dark:bg-red-600 dark:text-white px-3 py-1.5 rounded hover:bg-red-200 dark:hover:bg-red-700 transition-colors">PDF</button>
                                    </div>
                                </div>

                                <div className="flex gap-2 mb-4">
                                    <select className="bg-slate-100 dark:bg-black/30 text-xs rounded-lg p-2 border border-slate-200 dark:border-white/10 outline-none text-slate-700 dark:text-white font-bold" value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)}>
                                        <option value="All">All Districts</option>
                                        {uniqueDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <select className="bg-slate-100 dark:bg-black/30 text-xs rounded-lg p-2 border border-slate-200 dark:border-white/10 outline-none text-slate-700 dark:text-white font-bold" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                        <option value="All">All Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>

                                {filteredReports.map(rep => (
                                    <div key={rep._id} onClick={() => setSelectedReport(rep)}
                                        className={`p-4 rounded-xl mb-2 cursor-pointer transition-all border ${selectedReport?._id === rep._id ? 'bg-teal-50 dark:bg-teal-500/20 border-teal-500 dark:border-teal-500/50' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-transparent hover:bg-slate-100 dark:hover:bg-white/10'}`}>
                                        <div className="flex justify-between">
                                            <span className="font-bold text-slate-900 dark:text-white">{rep.pharmacyName}</span>
                                            <span className="text-xs bg-slate-200 dark:bg-black/30 px-2 py-1 rounded text-slate-600 dark:text-white font-bold">{rep.status}</span>
                                        </div>
                                        <div className="text-sm text-slate-500 dark:text-gray-400 mt-1 font-medium">{rep.userEmail}</div>
                                        <div className="text-xs text-slate-400 dark:text-gray-500 mt-2 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(rep.date).toLocaleDateString()}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Chat & Details */}
                            <div className="col-span-2 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col overflow-hidden shadow-sm dark:shadow-none">
                                {selectedReport ? (
                                    <>
                                        <div className="p-6 bg-slate-100 dark:bg-black/20 border-b border-slate-200 dark:border-white/10 flex justify-between items-start">
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{selectedReport.pharmacyName}</h3>
                                                <p className="text-teal-600 dark:text-teal-400 text-sm font-bold">Reported by: {selectedReport.nic} ({selectedReport.userEmail})</p>
                                                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1 font-medium">Medicine: {selectedReport.medicineName} | Price: Rs.{selectedReport.pricePaid}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => updateReportStatus('Resolved')} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 font-bold text-xs">RESOLVE</button>
                                                <button onClick={() => updateReportStatus('Rejected')} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 font-bold text-xs">REJECT</button>
                                                <button onClick={() => handleAnalyzeFraud(selectedReport._id)} disabled={analyzingFraud} className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 font-bold text-xs flex items-center gap-1">
                                                    {analyzingFraud ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <Shield className="w-3 h-3" />}
                                                    AI CHECK
                                                </button>
                                            </div>
                                        </div>

                                        {/* Fraud Analysis Result */}
                                        {fraudAnalysis && (
                                            <div className="mx-6 mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-500/30 rounded-xl animate-fade-in">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Shield className={`w-5 h-5 ${fraudAnalysis.riskScore > 50 ? 'text-red-500' : 'text-green-500'}`} />
                                                    <h4 className="font-bold text-slate-800 dark:text-white">AI Fraud Detection</h4>
                                                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${fraudAnalysis.riskScore > 50 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                                                        Risk: {fraudAnalysis.riskScore}%
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-gray-300 mb-2 font-medium">{fraudAnalysis.reason}</p>
                                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-500">Verdict: {fraudAnalysis.verdict}</p>
                                            </div>
                                        )}

                                        {/* Receipt Image */}
                                        {selectedReport.receiptImage && (
                                            <div className="p-6 border-b border-slate-200 dark:border-white/10 cursor-pointer group relative">
                                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Proof Check</h4>
                                                <img src={selectedReport.receiptImage} alt="Receipt" className="h-40 object-cover rounded-lg border border-white/20 group-hover:scale-105 transition-transform" />
                                            </div>
                                        )}

                                        {/* Messages */}
                                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-transparent">
                                            {selectedReport.messages.map((msg, i) => (
                                                <div key={i} className={`flex ${msg.sender === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[75%] p-3 rounded-2xl text-sm font-medium ${msg.sender === 'ADMIN' ? 'bg-teal-600 text-white shadow-md' : 'bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-transparent shadow-sm'}`}>
                                                        <p className="text-xs opacity-50 mb-1 font-bold">{msg.sender}</p>
                                                        {msg.text}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Input */}
                                        <div className="p-4 bg-slate-100 dark:bg-black/30 flex gap-2 border-t border-slate-200 dark:border-white/5">
                                            <input className="flex-1 bg-white dark:bg-white/10 rounded-full px-4 outline-none border border-slate-300 dark:border-white/5 focus:border-teal-500 text-slate-900 dark:text-white placeholder:text-slate-400"
                                                value={adminChatMsg} onChange={e => setAdminChatMsg(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendAdminMessage()} placeholder="Reply to user..." />
                                            <button onClick={handleSendAdminMessage} className="p-3 bg-teal-500 rounded-full hover:scale-110 text-white shadow-lg shadow-teal-500/30"><Send className="w-5 h-5" /></button>
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
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold text-white">General Inquiries</h2>
                                <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                                    <button
                                        onClick={() => setShowBlockedInquiries(false)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!showBlockedInquiries ? 'bg-teal-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Active
                                    </button>
                                    <button
                                        onClick={() => setShowBlockedInquiries(true)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${showBlockedInquiries ? 'bg-red-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Blocked List
                                    </button>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                {messages.filter(m => !!m.isBlocked === showBlockedInquiries).map(msg => (
                                    <div key={msg._id} className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 hover:shadow-md dark:hover:bg-white/10 transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-black text-slate-800 dark:text-teal-400">{msg.subject}</h3>
                                                <p className="text-sm text-slate-500 dark:text-gray-400 font-bold">From: {msg.name} ({msg.email})</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${msg.status === 'Unread' ? 'bg-yellow-500/20 text-yellow-400' : (msg.status === 'Replied' ? 'bg-teal-500/20 text-teal-400' : 'bg-green-500/20 text-green-400')}`}>
                                                    {msg.status}
                                                </span>
                                                <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <p className="text-slate-700 dark:text-gray-300 leading-relaxed bg-slate-50 dark:bg-black/20 p-4 rounded-xl font-medium border border-slate-100 dark:border-transparent">{msg.message}</p>

                                        {msg.adminReply && (
                                            <div className="mt-4 ml-8 p-4 bg-teal-50 dark:bg-teal-500/10 border-l-4 border-teal-500 rounded-lg">
                                                <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase mb-2">Admin Reply</h4>
                                                <p className="text-sm text-slate-600 dark:text-gray-300 italic">{msg.adminReply}</p>
                                            </div>
                                        )}

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {replyingToId === msg._id ? (
                                                <div className="w-full space-y-2 animate-fade-in">
                                                    <textarea
                                                        className="w-full bg-black/40 border border-teal-500/30 rounded-xl p-4 text-sm text-white outline-none focus:border-teal-500"
                                                        placeholder="Write your professional reply..."
                                                        rows={3}
                                                        value={replyDraft}
                                                        onChange={e => setReplyDraft(e.target.value)}
                                                    />
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleReplyInquiry(msg._id)} className="px-4 py-2 bg-teal-500 text-white rounded-lg text-xs font-bold hover:bg-teal-600 transition-all">SEND REPLY</button>
                                                        <button onClick={() => { setReplyingToId(null); setReplyDraft(''); }} className="px-4 py-2 bg-white/5 text-gray-400 rounded-lg text-xs font-bold hover:bg-white/10">CANCEL</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <button onClick={() => { setReplyingToId(msg._id); setReplyDraft(msg.adminReply || ''); }} className="px-4 py-2 bg-teal-500/20 text-teal-400 rounded-lg text-sm font-bold hover:bg-teal-500/30 transition-colors">
                                                        {msg.adminReply ? 'Edit Reply' : 'Quick Reply'}
                                                    </button>
                                                    <a href={`mailto:${msg.email}`} className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-bold hover:bg-blue-500/30 transition-colors">
                                                        Mailto
                                                    </a>
                                                    {msg.status === 'Unread' && (
                                                        <button
                                                            onClick={async () => {
                                                                await authenticatedFetch(`${API_BASE_URL}/contact/${msg._id}/status`, {
                                                                    method: 'PATCH',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ status: 'Read' })
                                                                });
                                                                fetchContactMessages();
                                                            }}
                                                            className="px-4 py-2 bg-white/5 text-gray-400 rounded-lg text-sm font-bold hover:bg-white/10 transition-colors"
                                                        >
                                                            Mark Read
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleToggleBlockInquiry(msg._id, !!msg.isBlocked)}
                                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${msg.isBlocked ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
                                                    >
                                                        {msg.isBlocked ? 'Unblock' : 'Block / Spam'}
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            const userRes = await authenticatedFetch(`${API_BASE_URL}/users/all?limit=1000`);
                                                            const userData = await userRes.json();
                                                            const targetUser = userData.users?.find((u: any) => u.email === msg.email);
                                                            if (targetUser) {
                                                                toggleBanUser(targetUser._id, targetUser.isBanned);
                                                            } else {
                                                                alert("User account not found in database (Legacy or External user).");
                                                            }
                                                        }}
                                                        className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg text-sm font-bold hover:bg-purple-500/20"
                                                    >
                                                        Ban Account
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {messages.filter(m => !!m.isBlocked === showBlockedInquiries).length === 0 && (
                                    <div className="text-center py-20 text-gray-500">
                                        <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                        <p>No {showBlockedInquiries ? 'blocked' : 'active'} inquiries found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* USERS MANAGER (NEW) */}
                    {activeSection === 'users' && (
                        <div>
                            <h2 className="text-3xl font-black mb-6 text-slate-900 dark:text-white">User Database</h2>
                            <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-100 dark:bg-black/20 text-slate-500 dark:text-gray-400 font-bold">
                                        <tr>
                                            <th className="p-4">Name</th>
                                            <th className="p-4">Email</th>
                                            <th className="p-4">Role</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                                        {users.map(user => (
                                            <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="p-4 font-bold text-slate-900 dark:text-white">{user.name || 'Unknown'}</td>
                                                <td className="p-4 text-slate-500 dark:text-gray-400 font-mono text-sm">{user.email}</td>
                                                <td className="p-4"><span className="bg-slate-200 dark:bg-white/10 px-2 py-1 rounded text-xs font-bold text-slate-700 dark:text-gray-300">{user.role}</span></td>
                                                <td className="p-4">
                                                    {user.isBanned
                                                        ? <span className="text-red-400 font-bold bg-red-500/20 px-2 py-1 rounded text-xs">BANNED</span>
                                                        : <span className="text-green-400 font-bold bg-green-500/20 px-2 py-1 rounded text-xs">ACTIVE</span>}
                                                </td>
                                                <td className="p-4 text-right">
                                                    {user.role !== 'admin' && (
                                                        <button
                                                            onClick={() => toggleBanUser(user._id, user.isBanned)}
                                                            className={`px-4 py-2 rounded-lg font-bold text-xs ${user.isBanned ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                                                        >
                                                            {user.isBanned ? 'UNBAN' : 'BAN USER'}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
                                <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                                    <h3 className="text-slate-500 dark:text-gray-400 text-sm font-bold">Total Inquiries</h3>
                                    <p className="text-4xl font-black text-slate-900 dark:text-white">{reports.length}</p>
                                </div>
                                <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col justify-center relative overflow-hidden group shadow-sm dark:shadow-none">
                                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <div className="w-12 h-12 bg-teal-400 rounded-full blur-xl"></div>
                                    </div>
                                    <h3 className="text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-widest mb-1">AI Agent Status</h3>
                                    <p className="text-xl font-black text-slate-900 dark:text-white">Active & Monitoring</p>
                                </div>
                                <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                                    <h3 className="text-slate-500 dark:text-gray-400 text-sm font-bold">Most Reported Area</h3>
                                    <p className="text-xl font-black text-yellow-600 dark:text-yellow-400 truncate">
                                        {Object.entries(reports.reduce((acc, curr) => {
                                            acc[curr.district || 'Unknown'] = (acc[curr.district || 'Unknown'] || 0) + 1;
                                            return acc;
                                        }, {} as any)).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "N/A"}
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                                    <h3 className="text-slate-500 dark:text-gray-400 text-sm font-bold">Targeted Medicine</h3>
                                    <p className="text-xl font-black text-red-600 dark:text-red-500 truncate">
                                        {Object.entries(reports.reduce((acc, curr) => {
                                            acc[curr.medicineName] = (acc[curr.medicineName] || 0) + 1;
                                            return acc;
                                        }, {} as any)).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* AI INSIGHT WIDGET */}
                            <div className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/40 dark:to-blue-900/40 p-1 rounded-3xl border border-teal-200 dark:border-teal-500/30 shadow-xl dark:shadow-teal-500/10">
                                <div className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-3xl rounded-[1.4rem] p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-teal-500/20 rounded-2xl flex items-center justify-center text-2xl animate-pulse">
                                            🧠
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white">AI Strategy Insight</h3>
                                            <p className="text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-tighter">Generated by Gemini 1.5 Flash</p>
                                        </div>
                                        {loadingAI && <div className="ml-auto w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>}
                                    </div>
                                    <div className="min-h-[60px] text-slate-700 dark:text-gray-200 leading-relaxed italic text-lg relative font-medium">
                                        <span className="text-4xl text-teal-500/20 absolute -top-4 -left-4 font-serif">"</span>
                                        {aiInsight || (loadingAI ? 'Scanning national reports for patterns...' : 'Monitoring platform data for anomalies.')}
                                        <span className="text-4xl text-teal-500/20 absolute -bottom-6 -right-4 font-serif">"</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* HOTSPOT ZONES */}
                                <div className="bg-slate-100 dark:bg-black/30 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-inner dark:shadow-none">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                                        🔴 High Risk Zones <span className="text-xs font-normal text-slate-500 dark:text-gray-500">(By District)</span>
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
                                                        <span className="font-bold text-slate-800 dark:text-gray-200">{district}</span>
                                                        <span className="text-sm text-slate-500 dark:text-gray-400">{count} Reports</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 dark:bg-white/5 rounded-full h-2">
                                                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(count / reports.length) * 100}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {reports.length === 0 && <p className="text-gray-500">No data available yet.</p>}
                                    </div>
                                </div>

                                {/* TOP MEDICINES */}
                                <div className="bg-slate-100 dark:bg-black/30 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-inner dark:shadow-none">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
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
                                                        <span className="font-bold text-slate-800 dark:text-gray-200">{name}</span>
                                                        <span className="text-sm text-slate-500 dark:text-gray-400">{count} Cases</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 dark:bg-white/5 rounded-full h-2">
                                                        <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${(count / reports.length) * 100}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {reports.length === 0 && <p className="text-gray-500">No data available yet.</p>}
                                    </div>
                                </div>
                            </div>

                            {/* NATIONAL HEAT DISPATCH MAP */}
                            <div className="bg-slate-100 dark:bg-black/30 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-inner dark:shadow-none">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                                    🌍 National Report Hotspots <span className="text-xs font-normal text-slate-500 dark:text-gray-500">(Real-time Visual)</span>
                                </h3>
                                <div className="h-[500px] rounded-xl overflow-hidden border border-slate-300 dark:border-white/10 relative shadow-xl">
                                    <MapContainer
                                        center={[7.8731, 80.7718]}
                                        zoom={7.5}
                                        style={{ height: '100%', width: '100%', background: '#111' }}
                                        scrollWheelZoom={false}
                                    >
                                        <TileLayer
                                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                        />
                                        {reports.filter(r => r.district && DISTRICT_COORDS[r.district]).map((report, idx) => (
                                            <CircleMarker
                                                key={report._id || idx}
                                                center={DISTRICT_COORDS[report.district!]}
                                                pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.6 }}
                                                radius={8}
                                            >
                                                <Popup>
                                                    <div className="text-black">
                                                        <p className="font-bold">{report.medicineName}</p>
                                                        <p className="text-xs">{report.pharmacyName}</p>
                                                        <p className="text-xs font-bold text-red-600">Price: LKR {report.pricePaid}</p>
                                                    </div>
                                                </Popup>
                                            </CircleMarker>
                                        ))}
                                    </MapContainer>
                                    <div className="absolute bottom-4 right-4 z-[1000] bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10 text-[10px] text-gray-400">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                            <span>Violation Hotspot</span>
                                        </div>
                                        <p>Click dots for details</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECURITY LOGS (NEW) */}
                    {activeSection === 'logs' && (
                        <div className="animate-fade-in-up">
                            <h2 className="text-3xl font-black mb-6 text-slate-900 dark:text-white">Security & Audit Logs</h2>
                            <AuditLogViewer logs={auditLogs} />
                        </div>
                    )}

                    {/* ADMIN PROFILE */}
                    {activeSection === 'profile' && (
                        <div className="max-w-2xl mx-auto animate-fade-in-up">
                            <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl dark:shadow-none">
                                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-teal-500 to-blue-600 opacity-20"></div>

                                <div className="relative z-10">
                                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-teal-400 to-blue-600 rounded-full p-1 mb-6 shadow-2xl shadow-teal-500/20">
                                        <div className="w-full h-full bg-slate-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
                                            <span className="text-4xl">👨‍💻</span>
                                        </div>
                                    </div>

                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Super Admin</h2>
                                    <p className="text-teal-600 dark:text-teal-400 font-bold mb-6">System Administrator</p>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-slate-100 dark:bg-black/30 p-4 rounded-xl">
                                            <p className="text-slate-500 dark:text-gray-400 text-xs font-bold">EMAIL</p>
                                            <p className="font-mono text-sm font-bold text-slate-800 dark:text-white">admin@mediguide.lk</p>
                                        </div>
                                        <div className="bg-slate-100 dark:bg-black/30 p-4 rounded-xl">
                                            <p className="text-slate-500 dark:text-gray-400 text-xs font-bold">ACCESS LEVEL</p>
                                            <p className="font-mono text-sm text-yellow-600 dark:text-yellow-400 font-bold">ROOT / LEVEL 5</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 text-left">
                                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 hover:border-teal-500/30 transition-colors">
                                            <span className="text-slate-600 dark:text-gray-300 font-bold">System Status</span>
                                            <span className="text-green-600 dark:text-green-400 font-bold text-xs bg-green-500/20 px-2 py-1 rounded">ONLINE</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 hover:border-teal-500/30 transition-colors">
                                            <span className="text-slate-600 dark:text-gray-300 font-bold">Database Connection</span>
                                            <span className="text-green-600 dark:text-green-400 font-bold text-xs bg-green-500/20 px-2 py-1 rounded">CONNECTED</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 hover:border-teal-500/30 transition-colors">
                                            <span className="text-slate-600 dark:text-gray-300 font-bold">Last Login</span>
                                            <span className="text-slate-500 dark:text-gray-400 text-sm font-medium">{new Date().toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div >

            {/* ADD MEDICINE MODAL */}
            {
                showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-white/10 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
                            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white transition-colors">✕</button>
                            <h2 className="text-2xl font-black mb-6 text-slate-900 dark:text-white">{editingMedicineId ? 'Edit Medicine' : 'Add New Medicine'}</h2>
                            <form onSubmit={handleAddMedicine} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-500 dark:text-gray-400 uppercase font-bold">Medicine Name</label>
                                        <input required className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-900 dark:text-white focus:border-teal-500 outline-none font-bold" placeholder="e.g. Panadol" value={formData.medicineName} onChange={e => setFormData({ ...formData, medicineName: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-500 dark:text-gray-400 uppercase font-bold">Price Range (LKR)</label>
                                        <input required className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-900 dark:text-white focus:border-teal-500 outline-none font-bold" placeholder="e.g. 150 - 200" value={formData.priceRange} onChange={e => setFormData({ ...formData, priceRange: e.target.value })} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-slate-500 dark:text-gray-400 uppercase font-bold">Medicine Image</label>
                                    <div className="flex items-center gap-4">
                                        {formData.image && <img src={formData.image} className="w-16 h-16 rounded-lg object-cover border border-slate-200 dark:border-white/10" />}
                                        <label className="flex-1 cursor-pointer bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-center transition-all">
                                            <span className="text-sm font-bold text-teal-600 dark:text-teal-400"><ImageIcon className="w-4 h-4 inline mr-2" /> Upload Image</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => setFormData({ ...formData, image: reader.result as string });
                                                    reader.readAsDataURL(file);
                                                }
                                            }} />
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-slate-500 dark:text-gray-400 uppercase font-bold">Description (Overview)</label>
                                    <textarea required rows={3} className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-900 dark:text-white focus:border-teal-500 outline-none" placeholder="Detailed description of the medicine..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-500 dark:text-gray-400 uppercase font-bold">Primary Uses</label>
                                        <textarea rows={3} className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-900 dark:text-white focus:border-teal-500 outline-none" placeholder="Fever, Headache (Comma separated)" value={formData.uses} onChange={e => setFormData({ ...formData, uses: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-500 dark:text-gray-400 uppercase font-bold">How To Use</label>
                                        <textarea rows={3} className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-900 dark:text-white focus:border-teal-500 outline-none" placeholder="Take after meals..." value={formData.howToUse} onChange={e => setFormData({ ...formData, howToUse: e.target.value })} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-slate-500 dark:text-gray-400 uppercase font-bold">Safety Disclaimer</label>
                                    <input className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-900 dark:text-white text-sm focus:border-teal-500 outline-none" placeholder="Consult a doctor if..." value={formData.disclaimer || ''} onChange={e => setFormData({ ...formData, disclaimer: e.target.value })} />
                                </div>

                                <button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all">{editingMedicineId ? 'Update Medicine' : 'Add to Database'}</button>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default AdminDashboard;
