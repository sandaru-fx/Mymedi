import { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
    fetchMedicineDetails,
    analyzeSymptoms,
    fetchEmergencyInstructions
} from '../services/geminiService';
import {
    Language,
    MedicineInfo,
    SymptomAnalysis,
    EmergencyInfo,
    UserRole,
    UserProfile,
    AppNotification,
    UserInquiry,
    Tab,
    AdminTab,
    AuthView
} from '../models/types';

export const useAppController = () => {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const [view, setView] = useState<AuthView>('landing');
    const [role, setRole] = useState<UserRole>(null);
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
        const saved = localStorage.getItem('mediguide_users');
        return saved ? JSON.parse(saved) : [];
    });

    const [notifications, setNotifications] = useState<AppNotification[]>(() => {
        const saved = localStorage.getItem('mediguide_notifications');
        return saved ? JSON.parse(saved) : [];
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showNotifications, setShowNotifications] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [onboardingStep, setOnboardingStep] = useState(0);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signUpData, setSignUpData] = useState<Partial<UserProfile>>({
        fullName: '',
        email: '',
        password: '',
        nic: '',
        phone: ''
    });

    const [query, setQuery] = useState('');
    const [mode, setMode] = useState<'medicine' | 'symptom'>('medicine');
    const [language, setLanguage] = useState<Language>(Language.Sinhala);
    const isSinhala = language === Language.Sinhala;
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<MedicineInfo | null>(null);
    const [symptomData, setSymptomData] = useState<SymptomAnalysis | null>(null);
    const [emergencyData, setEmergencyData] = useState<EmergencyInfo | null>(null);
    const [isSOSOpen, setIsSOSOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isListening, setIsListening] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showInquiryForm, setShowInquiryForm] = useState(false);
    const [inquiries, setInquiries] = useState<UserInquiry[]>(() => {
        const saved = localStorage.getItem('mediguide_inquiries');
        return saved ? JSON.parse(saved) : [];
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [newInquiry, setNewInquiry] = useState<Partial<UserInquiry>>({
        medicineName: '',
        pricePaid: '',
        pharmacyName: '',
        location: '',
        date: new Date().toISOString().split('T')[0],
        nic: '',
        phone: '',
        billImage: ''
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [adminSelectedInquiry, setAdminSelectedInquiry] = useState<UserInquiry | null>(null);
    const billUploadRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        localStorage.setItem('mediguide_inquiries', JSON.stringify(inquiries));
    }, [inquiries]);

    useEffect(() => {
        localStorage.setItem('mediguide_users', JSON.stringify(registeredUsers));
    }, [registeredUsers]);

    useEffect(() => {
        localStorage.setItem('mediguide_notifications', JSON.stringify(notifications));
    }, [notifications]);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            setView('app');
            setRole('USER');
        } else if (isLoaded && !isSignedIn) {
            setView('landing');
            setRole(null);
        }
    }, [isLoaded, isSignedIn]);

    const adminAnalytics = useMemo(() => {
        const total = inquiries.length;
        const statusDistribution = {
            Pending: inquiries.filter(i => i.status === 'Pending').length,
            Reviewed: inquiries.filter(i => i.status === 'Reviewed').length,
            ActionTaken: inquiries.filter(i => i.status === 'Action Taken').length,
        };

        const medCounts: Record<string, number> = {};
        const districtCounts: Record<string, number> = {};

        inquiries.forEach(inq => {
            medCounts[inq.medicineName] = (medCounts[inq.medicineName] || 0) + 1;
            const loc = inq.location || 'Unknown';
            districtCounts[loc] = (districtCounts[loc] || 0) + 1;
        });

        const topMedicines = Object.entries(medCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);

        return { total, statusDistribution, topMedicines, districtCounts };
    }, [inquiries]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email === 'admin@nmra.gov.lk' && password === 'admin123') {
            setRole('ADMIN');
            setView('app');
            return;
        }
        const user = registeredUsers.find(u => u.email === email && u.password === password);
        if (user) {
            setRole('USER');
            setCurrentUser(user);
            setView('app');
            if (!localStorage.getItem(`onboarding_done_${user.id}`)) setShowOnboarding(true);
        } else if (email === 'user@mediguide.lk' && password === 'user123') {
            const demoUser: UserProfile = { id: 'demo', fullName: 'Demo User', email: 'user@mediguide.lk', nic: '000000000V', phone: '0771234567', password: 'user123' };
            setRole('USER');
            setCurrentUser(demoUser);
            setView('app');
            setShowOnboarding(true);
        } else {
            setError("Credentials mismatch.");
        }
    };

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!signUpData.email || !signUpData.password || !signUpData.fullName) {
            setError("Please fill all required fields.");
            return;
        }
        const newUser: UserProfile = {
            id: Math.random().toString(36).substr(2, 9),
            fullName: signUpData.fullName || '',
            email: signUpData.email || '',
            password: signUpData.password || '',
            nic: signUpData.nic || '',
            phone: signUpData.phone || '',
        };
        setRegisteredUsers([...registeredUsers, newUser]);
        setCurrentUser(newUser);
        setRole('USER');
        setView('app');
        setShowOnboarding(true);
    };

    const handleGoogleSignIn = () => {
        // Mock Google Sign In
        const googleUser: UserProfile = { id: 'g-123', fullName: 'Google User', email: 'google@example.com', nic: '', phone: '' };
        setRole('USER');
        setCurrentUser(googleUser);
        setView('app');
    };

    const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
        if (e) e.preventDefault();
        const searchQuery = overrideQuery || query;
        if (!searchQuery.trim()) return;
        setIsLoading(true);
        setError(null);
        setHasSearched(true);
        try {
            const token = await getToken();
            if (!token) throw new Error("Not authenticated");

            if (mode === 'medicine') {
                const result = await fetchMedicineDetails(searchQuery, language, token);
                setData(result);
            } else {
                const result = await analyzeSymptoms(searchQuery, language, token);
                setSymptomData(result);
            }
        } catch (err) {
            setError("Failed to fetch medical intelligence.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSOSRequest = async (situation: string) => {
        // We now use both professional curated content and dynamic AI update
        setIsLoading(true);
        setError(null);
        setEmergencyData(null);
        try {
            const token = await getToken();
            if (!token) throw new Error("Not authenticated");

            const result = await fetchEmergencyInstructions(situation, language, token);
            setEmergencyData(result);
        } catch (err) {
            console.error("Emergency lookup failed, falling back to curated content.");
            // Fallback: Create a basic EmergencyInfo object with the situation name
            setEmergencyData({
                situation: situation,
                immediateActions: [],
                thingsToAvoid: [],
                emergencyContact: '1990',
                professionalAdvice: 'Please follow the curated medical instructions below.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        setRole(null);
        setCurrentUser(null);
        setActiveTab('home');
        setQuery('');
        setView('landing');
    };

    return {
        view, setView,
        role, setRole,
        activeTab, setActiveTab,
        adminTab, setAdminTab,
        currentUser, setCurrentUser,
        registeredUsers, setRegisteredUsers,
        notifications, setNotifications,
        showNotifications, setShowNotifications,
        showOnboarding, setShowOnboarding,
        onboardingStep, setOnboardingStep,
        email, setEmail,
        password, setPassword,
        signUpData, setSignUpData,
        query, setQuery,
        mode, setMode,
        language, setLanguage,
        isSinhala,
        isLoading, setIsLoading,
        data, setData,
        symptomData, setSymptomData,
        emergencyData, setEmergencyData,
        isSOSOpen, setIsSOSOpen,
        error, setError,
        hasSearched, setHasSearched,
        isListening, setIsListening,
        isDarkMode, setIsDarkMode,
        showInquiryForm, setShowInquiryForm,
        inquiries, setInquiries,
        newInquiry, setNewInquiry,
        adminSelectedInquiry, setAdminSelectedInquiry,
        billUploadRef,
        adminAnalytics,
        handleLogin,
        handleSignUp,
        handleGoogleSignIn,
        handleSearch,
        handleSOSRequest,
        handleLogout
    };
};
