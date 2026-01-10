import React from 'react';
import { useAppController } from './controllers/useAppController';
import MedicalScene from './components/MedicalScene';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import SOSModal from './components/SOSModal';
import LandingPage from './views/auth/LandingPage';
import LoginPage from './views/auth/LoginPage';
import SignupPage from './views/auth/SignupPage';
import HomeView from './views/HomeView';
import SearchView from './views/SearchView';
import SOSView from './views/SOSView';
import ServicesView from './views/ServicesView';
import AboutView from './views/AboutView';
import ContactView from './views/ContactView';

const App: React.FC = () => {
  const controller = useAppController();
  const {
    view, setView, role, activeTab, setActiveTab,
    handleLogout, setLanguage, setIsDarkMode, isSinhala, isDarkMode,
    handleLogin, email, setEmail, password, setPassword, handleGoogleSignIn,
    handleSignUp, signUpData, setSignUpData,
    mode, setMode, setData, setSymptomData, query, setQuery, handleSearch, isLoading, data, symptomData, language, hasSearched,
    handleSOSRequest, emergencyData, setEmergencyData, isSOSOpen, setIsSOSOpen
  } = controller;

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
      case 'profile':
      case 'reports':
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
      />

      <main className="flex-grow flex flex-col items-center relative z-10 overflow-y-auto w-full">
        {(view === 'landing' || view === 'app') && activeTab === 'home' && view === 'landing' && <LandingPage setView={setView} />}

        {view === 'login' && (
          <LoginPage
            setView={setView}
          />
        )}

        {view === 'signup' && (
          <SignupPage
            setView={setView}
          />
        )}

        {((activeTab === 'services' || activeTab === 'about' || activeTab === 'contact') || (view === 'app' && role)) && renderContent()}

        <Footer />
      </main>

      {view === 'app' && role === 'USER' && (
        <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        isSinhala={isSinhala}
      />
    </div>
  );
};

export default App;
