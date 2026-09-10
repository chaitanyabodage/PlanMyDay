// @ts-nocheck
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import { SecurityEvent, DesignTheme } from './types';
import { playCyberChime } from './lib/crypto';
import { THEMES } from './lib/themes';

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('hero');
  const [currentTheme, setCurrentTheme] = useState<DesignTheme>(() => {
    const saved = localStorage.getItem('planmyday_aesthetic_theme');
    return (saved as DesignTheme) || 'solar'; // Default to solar (Variation 6 Rose Brutalist)
  });
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);

  // Function to add centralized security logs
  const addSecurityEvent = (
    action: string,
    details: string,
    type: SecurityEvent['type'] = 'info'
  ) => {
    const newEvent: SecurityEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action,
      details,
      type,
    };
    setSecurityEvents((prev) => [...prev, newEvent].slice(-100)); // Cap at last 100 actions
  };

  // Add system-level startup alerts
  useEffect(() => {
    addSecurityEvent(
      'System Initialize',
      'PlanMyDay core checklist dashboard loaded and ready.',
      'info'
    );
  }, []);

  const handleAuthSuccess = (username: string) => {
    setCurrentUser(username);
    setActiveTab('dashboard');
  };

  const handleLock = () => {
    if (currentUser) {
      addSecurityEvent(
        'Session Closed',
        `User ${currentUser} successfully signed out.`,
        'warning'
      );
    }
    setCurrentUser(null);
    setActiveTab('hero');
    playCyberChime('lock');
  };

  const handleThemeChange = (newTheme: DesignTheme) => {
    setCurrentTheme(newTheme);
    localStorage.setItem('planmyday_aesthetic_theme', newTheme);
    addSecurityEvent('Theme Altered', `Workspace layout design changed to ${THEMES[newTheme].name}`, 'info');
  };

  const handleNavigate = (section: string) => {
    setActiveTab(section);
    // Smooth scroll back to top on transitions
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeTheme = THEMES[currentTheme];

  return (
    <div className={`min-h-screen ${activeTheme.bg} ${activeTheme.textPrimary} transition-colors duration-500 flex flex-col justify-between selection:bg-rose-500/30 selection:text-white`}>
      {/* Central Floating Header */}
      <Navbar
        currentUser={currentUser}
        isUnlocked={!!currentUser}
        onLock={handleLock}
        onNavigate={handleNavigate}
        activeTab={activeTab}
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
      />

      {/* Main Coordinate Sections */}
      <main className="grow">
        {activeTab === 'hero' && (
          <>
            <Hero
              onLaunch={() => handleNavigate(currentUser ? 'dashboard' : 'auth')}
              onExploreFeatures={() => handleNavigate('features')}
              currentTheme={currentTheme}
              onThemeChange={handleThemeChange}
            />
            <Features 
              onGetStarted={() => handleNavigate(currentUser ? 'dashboard' : 'auth')} 
              currentTheme={currentTheme}
            />
          </>
        )}

        {activeTab === 'features' && (
          <div className="pt-20">
            <Features 
              onGetStarted={() => handleNavigate(currentUser ? 'dashboard' : 'auth')} 
              currentTheme={currentTheme}
            />
          </div>
        )}

        {activeTab === 'auth' && (
          <Auth 
            onAuthSuccess={handleAuthSuccess} 
            addSecurityEvent={addSecurityEvent}
            currentTheme={currentTheme}
          />
        )}

        {activeTab === 'dashboard' && currentUser && (
          <Dashboard
            username={currentUser}
            addSecurityEvent={addSecurityEvent}
            securityEvents={securityEvents}
            currentTheme={currentTheme}
            onThemeChange={handleThemeChange}
          />
        )}
      </main>

      {/* Persistent Brand Footer (hidden inside active dashboard view to keep workspaces clean) */}
      {activeTab !== 'dashboard' && <Footer currentTheme={currentTheme} />}
    </div>
  );
}

