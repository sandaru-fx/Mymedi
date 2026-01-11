import React from 'react';
import { useAppController } from './controllers/useAppController';
import MedicalScene from './components/MedicalScene';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import SOSModal from './components/SOSModal';
import WelcomeModal from './components/WelcomeModal';
import OnboardingTour from './components/OnboardingTour';
import LandingPage from './views/auth/LandingPage';
import LoginPage from './views/auth/LoginPage';
import SignupPage from './views/auth/SignupPage';
import HomeView from './views/HomeView';
import SearchView from './views/SearchView';
import SOSView from './views/SOSView';
import ServicesView from './views/ServicesView';
import AboutView from './views/AboutView';

import ContactView from './views/ContactView';
import ReportsView from './views/ReportsView';
import AdminDashboard from './views/AdminDashboard';

const App: React.FC = () => {
  const controller = useAppController();
  const {
    view, setView, role, activeTab, setActiveTab,
    handleLogout, setLanguage, setIsDarkMode, isSinhala, isDarkMode,
    handleLogin, email, setEmail, password, setPassword, handleGoogleSignIn,
    handleSignUp, signUpData, setSignUpData,
    mode, setMode, setData, setSymptomData, query, setQuery, handleSearch, isLoading, data, symptomData, language, hasSearched,
    handleSOSRequest, emergencyData, setEmergencyData, isSOSOpen, setIsSOSOpen,
    showWelcome, setShowWelcome, completeWelcome,
    showOnboarding, setShowOnboarding
  } = controller;

  // Sync User to Backend on Login
  React.useEffect(() => {
    if (controller.currentUser) {
      // Sync user to local DB
      fetch('http://localhost:5001/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: controller.currentUser.id,
          email: controller.currentUser.primaryEmailAddress?.emailAddress,
          name: controller.currentUser.fullName
        })
      }).catch(err => console.error("User Sync Failed", err));
    }
  }, [controller.currentUser]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView isSinhala={isSinhala} setMode={setMode} setActiveTab={setActiveTab} />;
      case 'search':
        return (
          <SearchView
            hasSearched={hasSearched}
            mode={mode}
            isSinhala={isSinhala}
            setMode={setMode}
            setData={setData}
            setSymptomData={setSymptomData}
            query={query}
            setQuery={setQuery}
            handleSearch={handleSearch}
            isLoading={isLoading}
            data={data}
            symptomData={symptomData}
            language={language}
            error={controller.error}
          />
        );
      case 'sos':
        return (
          <SOSView
            isSinhala={isSinhala}
            handleSOSRequest={handleSOSRequest}
            isLoading={isLoading}
            emergencyData={emergencyData}
            setEmergencyData={setEmergencyData}
          />
        );
      case 'services':
        return <ServicesView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'reports':
        return <ReportsView />;
      case 'profile':
      default:
        return <div className="py-24 text-center font-black opacity-20 text-4xl">UPCOMING FEATURE</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative selection:bg-teal-500 selection:text-white transition-colors duration-300">
      <MedicalScene />

      <Header
        view={view}
        role={role}
        isSinhala={isSinhala}
        isDarkMode={isDarkMode}
        activeTab={activeTab}
        setView={setView}
        setActiveTab={setActiveTab}
        setLanguage={setLanguage}
        setIsDarkMode={setIsDarkMode}
        handleLogout={handleLogout}
        setIsSOSOpen={setIsSOSOpen}
        setShowOnboarding={setShowOnboarding}
      />

      <main className="flex-grow flex flex-col items-center relative z-10 overflow-y-auto w-full">
        {(view === 'landing' || view === 'app') && activeTab === 'home' && view === 'landing' && <LandingPage setView={setView} />}

        {view === 'login' && (
          <LoginPage
            setView={setView}
            onDemoLogin={() => {
              // Mock Admin Login
              controller.setRole('ADMIN');
              controller.setView('app');
            }}
          />
        )}

        {view === 'signup' && (
          <SignupPage
            setView={setView}
          />
        )}

        {((activeTab === 'services' || activeTab === 'about' || activeTab === 'contact') || (view === 'app' && role === 'USER')) && renderContent()}

        {view === 'app' && role === 'ADMIN' && <AdminDashboard onLogout={handleLogout} />}

        {(role === 'USER' || view === 'landing') && <Footer />}
      </main>

      {view === 'app' && role === 'USER' && (
        <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        isSinhala={isSinhala}
      />

      <WelcomeModal
        isOpen={showWelcome}
        onComplete={completeWelcome}
        setLanguage={setLanguage}
        language={language}
      />

      <OnboardingTour
        isOpen={showOnboarding}
        onComplete={() => {
          setShowOnboarding(false);
          if (controller.currentUser) {
            localStorage.setItem(`onboarding_done_${controller.currentUser.id}`, 'true');
          }
        }}
        language={language}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default App;
