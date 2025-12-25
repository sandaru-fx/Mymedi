
import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import {
  Search, Stethoscope, ArrowRight, Mic, Camera, X, Sparkles,
  AlertTriangle, Lightbulb, Moon, Sun, Plus, ShieldAlert, MapPin,
  ExternalLink, Pill, Clock, RotateCcw, RefreshCcw, HeartPulse,
  LifeBuoy, Zap, AlertCircle, LogIn, User, ShieldCheck, FileText,
  Upload, CheckCircle, Trash2, LayoutDashboard, Eye, Key, UserPlus,
  Settings, Mail, Phone, CreditCard, LogOut, Home, History, MessageSquarePlus,
  ChevronRight, Languages, Bell, BellRing, BarChart3, TrendingUp, PieChart, Activity, PhoneCall, Ban,
  // Added Flame and Lock to fix "Cannot find name" errors on lines 418 and 524
  Flame, Lock
} from 'lucide-react';
import { Language, MedicineInfo, InteractionResult, PharmacyLocation, DosageSchedule, SymptomAnalysis, UserRole, UserInquiry, UserProfile, AppNotification, EmergencyInfo } from './types';
import {
  fetchMedicineDetails, identifyMedicineFromImage, checkInteractions,
  findNearbyPharmacies, generateDosageSchedule, analyzeSymptoms, fetchEmergencyInstructions
} from './services/geminiService';
import MedicineCard from './components/MedicineCard';
import Loader from './components/Loader';

// Three.js Background Component
const MedicalScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Create a mesh background
    const geometry = new THREE.BufferGeometry();
    const count = 3000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 15;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.015,
      color: 0x0ea5e9, // Vibrant Sky Blue/Teal
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    camera.position.z = 5;

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      points.rotation.y += 0.001;
      points.rotation.x += 0.0005;

      // Subtle mouse interaction
      points.position.x += (mouseX * 0.5 - points.position.x) * 0.05;
      points.position.y += (mouseY * 0.5 - points.position.y) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="mesh-bg" />;
};

type Tab = 'home' | 'search' | 'reports' | 'profile' | 'sos';
type AdminTab = 'dashboard' | 'analytics';
type AuthView = 'landing' | 'login' | 'signup' | 'app';

const App: React.FC = () => {
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
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
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiries, setInquiries] = useState<UserInquiry[]>(() => {
    const saved = localStorage.getItem('mediguide_inquiries');
    return saved ? JSON.parse(saved) : [];
  });
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
      if (mode === 'medicine') {
        const result = await fetchMedicineDetails(searchQuery, language);
        setData(result);
      } else {
        const result = await analyzeSymptoms(searchQuery, language);
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
      const result = await fetchEmergencyInstructions(situation, language);
      setEmergencyData(result);
    } catch (err) {
      // If AI fails, we still have curated content in state
      console.error("Emergency lookup failed, falling back to curated content.");
    } finally {
      setIsLoading(false);
    }
  };

  const sosCuratedContent: Record<string, any> = {
    'Snake Bite': {
      image: '/src/assets/snake_bite.png',
      actions: isSinhala ? ['සන්සුන්ව සිටින්න සහ අවයවය නොසොල්වා තබන්න', 'තුවාලය වටා තදින් බැඳීමෙන් වළකින්න', 'වහාම රෝහල් ගත වෙන්න'] : ['Keep the victim calm and still', 'Immobilize the bitten limb', 'Do not apply a tourniquet or cut the wound', 'Seek emergency medical help immediately'],
      avoid: isSinhala ? ['තුවාලය කැපීම හෝ ලේ උරා බීම', 'අයිස් තැබීම', 'මත්පැන් පානය කිරීම'] : ['Trying to suck out the venom', 'Applying ice or heat', 'Giving the victim alcohol or caffeine'],
      tip: isSinhala ? 'සර්පයාගේ පෙනුම මතක තබා ගැනීමට උත්සාහ කරන්න' : 'Try to remember the appearance of the snake if possible.'
    },
    'Dog Bite': {
      image: '/src/assets/dog_bite.png',
      actions: isSinhala ? ['සබන් සහ ජලය යොදා තුවාලය හොඳින් සෝදන්න', 'පිරිසිදු රෙදි කැබැල්ලකින් තද කර රුධිර වහනය නතර කරන්න', 'ප්‍රතිජීවක ආලේපනයක් ගල්වන්න'] : ['Wash the wound thoroughly with soap and water', 'Apply pressure with a clean cloth to stop bleeding', 'Apply antibiotic ointment and cover with a sterile bandage'],
      avoid: isSinhala ? ['තුවාලය නොසලකා හැරීම', 'එන්නත් ලබා ගැනීම ප්‍රමාද කිරීම'] : ['Ignoring even minor bites', 'Delaying medical evaluation for infection risk'],
      tip: isSinhala ? 'සුනඛයාගේ අයිතිකරු පිළිබඳව විමසන්න' : 'Check the vaccination status of the dog if known.'
    },
    'Choking': {
      image: '/src/assets/choking.png',
      actions: isSinhala ? ['පිට මැදට පහර 5ක් දෙන්න', 'උදරයට තෙරපුම (Heimlich Maneuver) 5ක් දෙන්න', 'වස්තුව පිටතට එනතුරු මෙය නැවත කරන්න'] : ['Give 5 back blows between the shoulder blades', 'Perform 5 abdominal thrusts (Heimlich maneuver)', 'Alternate between 5 blows and 5 thrusts until the blockage is cleared'],
      avoid: isSinhala ? ['පුද්ගලයා කහින විට බාධා කිරීම', 'කට තුලට ඇඟිලි දමා සෙවීමට උත්සාහ කිරීම'] : ['Interfering if the person is coughing forcefully', 'Blind finger sweeps in the mouth'],
      tip: isSinhala ? 'පුද්ගලයා සිහිසුන් වුවහොත් CPR ආරම්භ කරන්න' : 'If the person becomes unconscious, begin CPR immediately.'
    },
    'Severe Bleeding': {
      image: '/src/assets/bleeding.png',
      actions: isSinhala ? ['තුවාලය මත සෘජුවම තද කරන්න', 'තුවාලය හදවතේ මට්ටමට වඩා ඉහලින් තබන්න', 'පිරිසිදු වෙළුම් පටියක් භාවිතා කරන්න'] : ['Apply direct pressure to the wound with a clean cloth', 'Elevate the injured area above heart level', 'Apply a sterile bandage once bleeding is controlled'],
      avoid: isSinhala ? ['බැඳ ඇති රෙදි ඉවත් කිරීම', 'තුවාලය ඇතුලට අමුද්‍රව්‍ය දැමීම'] : ['Removing soaked bandages (layer more on top)', 'Applying a tourniquet unless bleeding is life-threatening'],
      tip: isSinhala ? 'රුධිර වහනය අධික නම් වහාම 1990 අමතන්න' : 'If bleeding is arterial (spirting), use dynamic pressure.'
    },
    'Poisoning': {
      image: '/src/assets/poisoning.png',
      actions: isSinhala ? ['විෂ වූ ද්‍රව්‍යය හඳුනා ගන්න', 'බහාලුම ළඟ තබා ගන්න', 'වහාම 1990 හෝ විෂ තොරතුරු මධ්‍යස්ථානය අමතන්න'] : ['Identify the substance and the amount taken', 'Keep the container for medical reference', 'Call emergency services or Poison Control immediately'],
      avoid: isSinhala ? ['වමනය කිරීමට උත්සහ කිරීම (විශේෂ උපදෙස් නැතිව)', 'කිරි හෝ ජලය ලබා දීම'] : ['Inducing vomiting unless told by a professional', 'Giving ipecac syrup or charcoal'],
      tip: isSinhala ? 'පුද්ගලයාගේ සිහිය පරීක්ෂා කරමින් සිටින්න' : 'Stay with the person and monitor breathing until help arrives.'
    },
    'Heart Attack': {
      image: '/src/assets/heart_attack.png',
      actions: isSinhala ? ['පුද්ගලයා සුව පහසු ලෙස වාඩි කරවන්න', 'සිරුරු ඇඳුම් ලිහිල් කරන්න', 'ඇස්පිරින් ලබා දීමට (වෛද්‍ය උපදෙස් මත) උත්සාහ කරන්න'] : ['Have the person sit down and rest', 'Loosen tight clothing', 'Ask if they take chest pain medication (like nitroglycerin)'],
      avoid: isSinhala ? ['පුද්ගලයාට තනිවම රිය පැදවීමට ඉඩ දීම', 'රෝග ලක්ෂණ නොසලකා හැරීම'] : ['Letting the person drive themselves to the hospital', 'Ignoring early warning signs like indigestion'],
      tip: isSinhala ? 'පුද්ගලයා සිහිසුන් වුවහොත් වහාම CPR ආරම්භ කරන්න' : 'Begin CPR if the person becomes unresponsive or stops breathing.'
    }
  };

  const handleLogout = () => {
    setRole(null);
    setCurrentUser(null);
    setActiveTab('home');
    setQuery('');
    setView('landing');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="w-full max-w-6xl mt-12 animate-fade-in-up space-y-16 pb-24 px-4">
            <div className="text-center space-y-6">
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-tight">
                {isSinhala ? 'ඔබේ සෞඛ්‍ය ගමන' : 'Intelligent Health'} <br />
                <span className="text-teal-600 underline decoration-teal-500/30 underline-offset-8 decoration-4">
                  {isSinhala ? 'AI සහායෙන්' : 'AI Companion'}
                </span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto text-lg leading-relaxed">
                {isSinhala
                  ? 'ශ්‍රී ලංකාවේ ප්‍රථම කෘතිම බුද්ධියෙන් ක්‍රියාත්මක වන වෛද්‍ය තොරතුරු හුවමාරුව. NMRA ප්‍රමිතීන්ට අනුකූලව ක්‍රියාත්මක වේ.'
                  : 'Sri Lanka\'s first AI-driven pharmaceutical intelligence hub. Compliant with NMRA regulatory standards.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { id: 'search', mode: 'medicine', color: 'bg-teal-600', icon: Search, title: isSinhala ? 'බෙහෙත්' : 'Search Meds', desc: isSinhala ? 'මාත්‍රාව සහ මිල' : 'Usage & Pricing' },
                { id: 'search', mode: 'symptom', color: 'bg-rose-500', icon: HeartPulse, title: isSinhala ? 'රෝග ලක්ෂණ' : 'Symptoms', desc: isSinhala ? 'AI වෛද්‍ය සහාය' : 'AI Diagnosis' },
                { id: 'sos', mode: null, color: 'bg-red-600', icon: LifeBuoy, title: isSinhala ? 'හදිසි අවස්ථා' : 'SOS Aid', desc: isSinhala ? 'මූලික ප්‍රථමාධාර' : 'Emergency Aid', pulse: true },
                { id: 'reports', mode: null, color: 'bg-slate-900', icon: FileText, title: isSinhala ? 'මිල පාලනය' : 'Reporting', desc: isSinhala ? 'වැඩි මිල වාර්තා' : 'Market Control' }
              ].map((card, i) => (
                <button
                  key={i}
                  onClick={() => { if (card.mode) setMode(card.mode as any); setActiveTab(card.id as Tab); }}
                  className={`${card.color} ${card.pulse ? 'animate-pulse-slow' : ''} p-8 rounded-[3rem] shadow-2xl shadow-slate-900/10 text-white flex flex-col items-start gap-5 hover:scale-105 transition-all duration-300 group relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="p-4 bg-white/20 rounded-[1.5rem] group-hover:rotate-12 transition-transform shadow-lg">
                    <card.icon className="w-7 h-7" />
                  </div>
                  <div className="text-left relative z-10">
                    <h3 className="text-2xl font-black">{card.title}</h3>
                    <p className="text-xs font-bold opacity-80 mt-1 uppercase tracking-widest">{card.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="glass-card p-10 rounded-[3rem] shadow-xl border border-white/40 dark:border-slate-800/50 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 font-black text-[10px] uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" /> Trusted Intelligence
                </div>
                <h3 className="text-3xl font-black">{isSinhala ? 'වැඩි විශ්වාසනීයත්වයක්' : 'Medical Accuracy'}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {isSinhala
                    ? 'අපගේ AI පද්ධතිය ලෝක මට්ටමේ වෛද්‍ය දත්ත ගබඩාවන් සමඟ සම්බන්ධව ඇති අතර, ශ්‍රී ලාංකික වෙළඳපල මිල ගණන් නිරන්තරයෙන් යාවත්කාලීන කරයි.'
                    : 'Our AI model consults global pharmaceutical databases while continuously monitoring local Sri Lankan market prices for the most accurate advisory experience.'}
                </p>
              </div>
              <div className="w-full md:w-64 h-64 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center animate-float">
                <Stethoscope className="w-24 h-24 text-teal-600 opacity-20" />
              </div>
            </div>
          </div>
        );
      case 'search':
        return (
          <div className="w-full max-w-5xl mx-auto pb-24 px-4">
            <div className={`transition-all duration-700 ${hasSearched ? 'mt-4' : 'mt-20'}`}>
              <div className="text-center mb-16 animate-fade-in-up">
                <h2 className="text-5xl font-black tracking-tighter">AI <span className={mode === 'medicine' ? 'text-teal-600' : 'text-rose-500'}>{isSinhala ? 'විශේෂඥ' : 'Expert'}</span> {isSinhala ? 'සෙවුම' : 'Consult'}</h2>
                <div className="flex justify-center mt-8">
                  <div className="glass-card p-1.5 rounded-full shadow-2xl flex gap-1 border border-white/50">
                    <button onClick={() => { setMode('medicine'); setData(null); }} className={`px-8 py-3 rounded-full text-sm font-black transition-all ${mode === 'medicine' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}>{isSinhala ? 'බෙහෙත්' : 'Medicine'}</button>
                    <button onClick={() => { setMode('symptom'); setSymptomData(null); }} className={`px-8 py-3 rounded-full text-sm font-black transition-all ${mode === 'symptom' ? 'bg-rose-500 text-white shadow-xl' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}>{isSinhala ? 'රෝග ලක්ෂණ' : 'Symptoms'}</button>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-3xl mx-auto">
                <form onSubmit={handleSearch} className="glass-card rounded-[2.5rem] shadow-2xl p-3 flex flex-col sm:flex-row items-center gap-3 border border-white/50">
                  <div className="flex-grow w-full flex items-center px-6">
                    {mode === 'medicine' ? <Pill className="w-6 h-6 text-teal-500 mr-4" /> : <Activity className="w-6 h-6 text-rose-500 mr-4" />}
                    <input
                      type="text"
                      className="w-full py-5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xl font-bold focus:outline-none"
                      placeholder={mode === 'medicine' ? (isSinhala ? "බෙහෙත් නම ඇතුලත් කරන්න..." : "Medicine name...") : (isSinhala ? "ඔබේ අපහසුතා පවසන්න..." : "Describe symptoms...")}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3 pr-2">
                    <button type="submit" className={`p-4 rounded-[1.5rem] ${mode === 'medicine' ? 'bg-teal-600' : 'bg-rose-500'} text-white shadow-xl hover:scale-105 active:scale-95 transition-all`}>
                      <ArrowRight className="w-7 h-7" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="mt-16 w-full">
              {isLoading ? <Loader /> : (
                <>
                  {data && <MedicineCard info={data} language={language} />}
                  {symptomData && (
                    <div className="glass-card p-10 rounded-[3rem] shadow-2xl border border-white/50 animate-fade-in-up space-y-10">
                      <div className="bg-rose-600 text-white p-6 rounded-3xl flex items-center gap-5">
                        <AlertTriangle className="w-10 h-10 shrink-0" />
                        <div className="font-bold text-lg">{isSinhala ? "මෙම තොරතුරු දැනුවත් වීම සඳහා පමණි. හදිසි අවස්ථාවකදී වහාම වෛද්‍යවරයකු හමුවන්න." : "For informational purposes only. In emergencies, seek professional medical attention immediately."}</div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                          <h3 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter"><TrendingUp className="text-rose-500" /> {isSinhala ? "හැකියාව ඇති තත්ත්වයන්" : "Potential Conditions"}</h3>
                          <div className="space-y-3">
                            {symptomData.possibleConditions.map((cond, i) => (
                              <div key={i} className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl font-black border border-slate-200 dark:border-slate-700 flex items-center justify-between group">
                                <span>{cond}</span>
                                <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div className="bg-slate-900 text-white p-8 rounded-[2rem]">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">{isSinhala ? 'වෛද්‍ය අවවාදය' : 'AI Medical Advice'}</h4>
                            <p className="font-bold text-lg leading-relaxed">{symptomData.advice}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      case 'sos':
        return (
          <div className="w-full max-w-4xl mt-12 animate-fade-in-up space-y-10 pb-24 px-4">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-red-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-red-600 animate-pulse">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <h2 className="text-5xl font-black text-red-600 tracking-tighter uppercase">{isSinhala ? 'හදිසි අවස්ථා' : 'Emergency Aid'}</h2>
              <p className="text-slate-500 font-bold max-w-lg mx-auto">{isSinhala ? 'පහත අවස්ථාවන්ගෙන් එකක් තෝරන්න නැතහොත් වහාම 1990 අමතන්න.' : 'Select a situation for first aid steps or call 1990 immediately.'}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[
                { situation: isSinhala ? 'සර්ප දෂ්ඨනය' : 'Snake Bite', icon: AlertCircle },
                { situation: isSinhala ? 'බල්ලා දෂ්ඨ කිරීම' : 'Dog Bite', icon: ShieldAlert },
                { situation: isSinhala ? 'හුස්ම හිරවීම' : 'Choking', icon: Zap },
                { situation: isSinhala ? 'දැඩි රුධිර වහනය' : 'Severe Bleeding', icon: Flame },
                { situation: isSinhala ? 'විෂ වීම්' : 'Poisoning', icon: Ban },
                { situation: isSinhala ? 'හෘදයාබාධ ලක්ෂණ' : 'Heart Attack', icon: Activity }
              ].map((item, i) => (
                <button key={i} onClick={() => handleSOSRequest(item.situation)} className="glass-card p-8 rounded-[2.5rem] border-2 border-transparent hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all flex flex-col items-center gap-4 group shadow-xl">
                  <div className="p-4 bg-red-100 text-red-600 rounded-2xl group-hover:scale-110 transition-transform">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <span className="font-black text-sm uppercase tracking-widest">{item.situation}</span>
                </button>
              ))}
            </div>

            <a href="tel:1990" className="w-full p-8 bg-red-600 text-white rounded-[2.5rem] shadow-2xl flex items-center justify-center gap-8 hover:scale-[1.02] transition-all group">
              <div className="p-5 bg-white/20 rounded-full group-hover:animate-bounce shadow-inner">
                <PhoneCall className="w-10 h-10" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black uppercase tracking-[0.2em] opacity-80">Suwa Seriya Sri Lanka</p>
                <p className="text-5xl font-black tracking-tighter">1990</p>
              </div>
            </a>

            {isLoading ? <Loader /> : emergencyData && (
              <div className="glass-card p-0 rounded-[3.5rem] border border-white/40 dark:border-slate-800 animate-fade-in-up overflow-hidden shadow-2xl">
                <div className="relative h-80 w-full overflow-hidden bg-slate-900 group">
                  <img
                    src={sosCuratedContent[emergencyData.situation]?.image || '/src/assets/heart_attack.png'}
                    alt={emergencyData.situation}
                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                  <div className="absolute bottom-10 left-10 text-white">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/50 text-red-500 font-black text-[10px] uppercase tracking-widest mb-4">
                      <ShieldAlert className="w-4 h-4" /> Priority Level 1
                    </div>
                    <h3 className="text-5xl font-black tracking-tighter uppercase">{emergencyData.situation}</h3>
                  </div>
                </div>

                <div className="p-12 space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 text-emerald-500">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <h4 className="text-2xl font-black tracking-tight">{isSinhala ? 'වහාම කළ යුතු දෑ' : 'Step-by-Step Response'}</h4>
                      </div>
                      <div className="space-y-4">
                        {(sosCuratedContent[emergencyData.situation]?.actions || emergencyData.immediateActions).map((action: string, i: number) => (
                          <div key={i} className="flex items-start gap-5 p-6 bg-slate-50 dark:bg-slate-900/40 rounded-[2rem] border border-slate-200 dark:border-slate-800 group hover:border-emerald-500/30 transition-all">
                            <span className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black shrink-0 shadow-lg shadow-emerald-500/20">{i + 1}</span>
                            <p className="font-bold text-slate-700 dark:text-slate-200 text-lg leading-relaxed">{action}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-4 text-rose-500">
                        <div className="p-3 bg-rose-500/10 rounded-2xl">
                          <Ban className="w-6 h-6" />
                        </div>
                        <h4 className="text-2xl font-black tracking-tight">{isSinhala ? 'නොකළ යුතු දෑ' : 'Critical Mistakes to Avoid'}</h4>
                      </div>
                      <div className="space-y-3">
                        {(sosCuratedContent[emergencyData.situation]?.avoid || emergencyData.thingsToAvoid).map((thing: string, i: number) => (
                          <div key={i} className="flex items-center gap-5 p-5 bg-rose-500/5 dark:bg-rose-500/10 rounded-2xl border border-rose-500/10 group hover:border-rose-500/30 transition-all">
                            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center font-black shrink-0">X</div>
                            <p className="font-bold text-rose-900/80 dark:text-rose-100/80 text-base">{thing}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 p-8 bg-slate-950 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10 flex flex-col gap-4">
                          <div className="flex items-center gap-2 text-teal-500 text-[10px] font-black uppercase tracking-widest">
                            <Sparkles className="w-4 h-4" /> Pro Tip
                          </div>
                          <p className="text-lg font-bold text-slate-300 italic leading-relaxed">
                            {sosCuratedContent[emergencyData.situation]?.tip || emergencyData.professionalAdvice}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-600/20">
                        <PhoneCall className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Emergency Dispatch</p>
                        <p className="text-3xl font-black text-red-600">1990</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEmergencyData(null)}
                      className="px-8 py-4 bg-slate-200 dark:bg-slate-800 font-black text-sm rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                    >
                      Close Report
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'reports':
      case 'profile':
      default:
        return <div className="py-24 text-center font-black opacity-20 text-4xl">UPCOMING FEATURE</div>;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead && n.userId === currentUser?.id).length;

  return (
    <div className="min-h-screen flex flex-col font-sans relative selection:bg-teal-500 selection:text-white transition-colors duration-300">
      <MedicalScene />

      <header className="sticky top-0 w-full z-[100] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="glass-card rounded-[2rem] px-8 py-4 flex justify-between items-center shadow-2xl border-white/40 dark:border-slate-800/50">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setView('landing'); setActiveTab('home'); }}>
                <div className="bg-slate-950 dark:bg-white p-2.5 rounded-[1.2rem] shadow-xl group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-6 h-6 text-teal-400 dark:text-teal-600" />
                </div>
                <h1 className="text-2xl font-black text-slate-950 dark:text-white tracking-tighter hidden sm:block">
                  MediGuide<span className="text-teal-600">AI</span>
                </h1>
              </div>

              {view === 'app' && role === 'USER' && (
                <nav className="hidden md:flex items-center gap-1">
                  {[
                    { id: 'home', icon: Home, label: isSinhala ? 'මුල් පිටුව' : 'Home' },
                    { id: 'search', icon: Search, label: isSinhala ? 'සෙවුම' : 'Search' },
                    { id: 'sos', icon: AlertTriangle, label: 'SOS', color: 'text-red-600' },
                    { id: 'reports', icon: FileText, label: isSinhala ? 'වාර්තා' : 'Reports' },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as Tab)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === t.id ? (t.id === 'sos' ? 'bg-red-500/10 text-red-600' : 'bg-teal-500/10 text-teal-600') : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                      <t.icon className="w-4 h-4" />
                      <span>{t.label}</span>
                    </button>
                  ))}
                </nav>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 mr-2">
                <button
                  onClick={() => setLanguage(isSinhala ? Language.English : Language.Sinhala)}
                  className="px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  {isSinhala ? 'EN' : 'සිං'}
                </button>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-500"
                >
                  {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>

              {view === 'landing' ? (
                <div className="flex items-center gap-3">
                  <button onClick={() => setView('login')} className="hidden xs:block px-6 py-2.5 font-bold text-sm hover:text-teal-600 transition-all">Sign In</button>
                  <button onClick={() => setView('signup')} className="px-6 py-2.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-sm rounded-xl shadow-lg hover:scale-105 transition-all">Join Free</button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveTab('profile')} className={`p-2.5 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-teal-500/10 text-teal-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    <User className="w-5 h-5" />
                  </button>
                  <button onClick={handleLogout} className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center relative z-10 overflow-y-auto">
        {view === 'landing' && (
          <div className="w-full max-w-6xl mt-20 animate-fade-in-up space-y-16 px-6 text-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 font-black text-xs uppercase tracking-[0.3em]">
                <Sparkles className="w-4 h-4" /> Next-Gen Medical AI
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9]">
                Expert Health <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">at Your Fingertips</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-bold max-w-3xl mx-auto leading-relaxed">
                Experience the future of healthcare with MediGuide AI. Get instant pharmaceutical intelligence, symptom analysis, and emergency guidance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
              <button
                onClick={() => setView('signup')}
                className="w-full sm:w-auto px-12 py-6 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xl font-black rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group"
              >
                Get Started <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
              <button
                onClick={() => setView('login')}
                className="w-full sm:w-auto px-12 py-6 glass-card text-xl font-black rounded-[2rem] shadow-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all"
              >
                Sign In
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
              {[
                { icon: ShieldCheck, title: "Verified Hub", desc: "Compliant with NMRA standards and global health protocols." },
                { icon: Zap, title: "Instant Analysis", desc: "Real-time drug interactions and symptom checking powered by Gemini." },
                { icon: HeartPulse, title: "Life-Saving SOS", desc: "Quick access to emergency protocols and Suwa Seriya 1990." }
              ].map((feature, i) => (
                <div key={i} className="glass-card p-10 rounded-[3rem] text-left border border-white/40 dark:border-slate-800/50 hover:border-teal-500/50 transition-all group">
                  <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-600 mb-6 group-hover:rotate-12 transition-transform">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black mb-3">{feature.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'login' && (
          <div className="flex items-center justify-center py-20 px-6 w-full max-w-md animate-fade-in-up">
            <div className="glass-card p-12 rounded-[3.5rem] shadow-2xl w-full border border-white/50 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500"></div>
              <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
                <Lock className="w-8 h-8 text-teal-400" />
              </div>
              <h2 className="text-3xl font-black mb-2">Welcome Back</h2>
              <p className="text-slate-500 font-bold mb-8">Sign in to your medical dashboard</p>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold border-none outline-none focus:ring-2 ring-teal-500 transition-all"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold border-none outline-none focus:ring-2 ring-teal-500 transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <div className="text-right pb-2">
                  <button type="button" className="text-xs font-black text-teal-600 uppercase tracking-widest hover:underline">Forgot Password?</button>
                </div>
                <button type="submit" className="w-full py-5 bg-teal-600 text-white rounded-2xl font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all">Sign In</button>
              </form>

              <div className="my-8 flex items-center gap-4">
                <div className="h-[1px] flex-grow bg-slate-200 dark:bg-slate-800"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">or</span>
                <div className="h-[1px] flex-grow bg-slate-200 dark:bg-slate-800"></div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                className="w-full py-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-black shadow-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-4"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.94 0 3.1 1.05 3.1 1.05l2.31-2.31C15.89 2.45 14.12 1.5 12 1.5c-4.12 0-7.61 2.5-9.04 6.06l2.7 2.09c.67-1.94 2.48-3.32 4.67-3.32z" />
                  <path fill="#FBBC05" d="M22.06 12.01c0-.79-.07-1.54-.19-2.27H12v4.3h5.64c-.24 1.25-.96 2.31-2.02 3.03l3.24 2.51c1.9-1.75 3.24-4.57 3.24-7.57z" />
                  <path fill="#4285F4" d="M3.96 8.56C3.67 9.4 3.5 10.3 3.5 11.25s.17 1.85.46 2.69l-2.7 2.09C.45 14.21 0 12.78 0 11.25s.45-2.96 1.25-4.78l2.71 2.09z" />
                  <path fill="#34A853" d="M12 22.5c2.97 0 5.46-.98 7.28-2.66l-3.24-2.51c-1.12.75-2.54 1.19-4.04 1.19-3.11 0-5.74-2.1-6.68-4.94l-2.7 2.09C4.39 20 7.88 22.5 12 22.5z" />
                </svg>
                Continue with Google
              </button>

              <p className="mt-8 text-sm font-bold text-slate-500">
                Don't have an account? <button onClick={() => setView('signup')} className="text-teal-600 hover:underline">Sign up for free</button>
              </p>
            </div>
          </div>
        )}

        {view === 'signup' && (
          <div className="flex items-center justify-center py-20 px-6 w-full max-w-lg animate-fade-in-up">
            <div className="glass-card p-12 rounded-[3.5rem] shadow-2xl w-full border border-white/50 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500"></div>
              <div className="w-20 h-20 bg-teal-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-black mb-2">Create Account</h2>
              <p className="text-slate-500 font-bold mb-8">Join the MediGuide community today</p>

              <form onSubmit={handleSignUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Perera"
                    className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold border-none outline-none focus:ring-2 ring-teal-500"
                    value={signUpData.fullName}
                    onChange={e => setSignUpData({ ...signUpData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-1 block">Email</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold border-none outline-none focus:ring-2 ring-teal-500"
                    value={signUpData.email}
                    onChange={e => setSignUpData({ ...signUpData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-1 block">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold border-none outline-none focus:ring-2 ring-teal-500"
                    value={signUpData.password}
                    onChange={e => setSignUpData({ ...signUpData, password: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-1 block">NIC Number</label>
                  <input
                    type="text"
                    placeholder="123456789V"
                    className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold border-none outline-none focus:ring-2 ring-teal-500"
                    value={signUpData.nic}
                    onChange={e => setSignUpData({ ...signUpData, nic: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-1 block">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="077 123 4567"
                    className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold border-none outline-none focus:ring-2 ring-teal-500"
                    value={signUpData.phone}
                    onChange={e => setSignUpData({ ...signUpData, phone: e.target.value })}
                  />
                </div>
                <button type="submit" className="sm:col-span-2 mt-4 py-5 bg-teal-600 text-white rounded-2xl font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all">Complete Registration</button>
              </form>

              <p className="mt-8 text-sm font-bold text-slate-500">
                Already have an account? <button onClick={() => setView('login')} className="text-teal-600 hover:underline">Sign in instead</button>
              </p>
            </div>
          </div>
        )}

        {view === 'app' && role && renderContent()}
      </main>

      {view === 'app' && role === 'USER' && (
        <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-lg glass-card border-white/40 dark:border-slate-800 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] rounded-[2.5rem] px-6 py-3 flex justify-between items-center animate-fade-in-up">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'search', icon: Search, label: 'Search' },
            { id: 'sos', icon: AlertTriangle, label: 'SOS', color: 'text-red-600' },
            { id: 'reports', icon: FileText, label: 'Report' },
            { id: 'profile', icon: User, label: 'User' }
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as Tab)} className={`flex flex-col items-center p-2 rounded-2xl transition-all ${activeTab === t.id ? (t.color || 'bg-teal-500/10 text-teal-600 scale-110') : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
              <t.icon className={`w-6 h-6 ${activeTab === t.id ? 'fill-current opacity-20' : ''}`} />
            </button>
          ))}
        </nav>
      )}

      <footer className="py-16 text-center z-10 print:hidden opacity-40">
        <span className="text-[10px] font-black uppercase tracking-[0.5em]">MediGuide AI Sri Lanka • National Digital Health Hub</span>
      </footer>
    </div>
  );
};

export default App;
