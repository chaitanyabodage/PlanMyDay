import { useState, useEffect } from 'react';
import { Lock, LogOut, Wifi, Palette, CheckSquare } from 'lucide-react';
import { DesignTheme } from '../types';
import { THEMES } from '../lib/themes';

interface NavbarProps {
  currentUser: string | null;
  isUnlocked: boolean;
  onLock: () => void;
  onNavigate: (section: string) => void;
  activeTab: string;
  currentTheme?: DesignTheme;
  onThemeChange?: (theme: DesignTheme) => void;
}

export default function Navbar({
  currentUser,
  isUnlocked,
  onLock,
  onNavigate,
  activeTab,
  currentTheme = 'solar',
  onThemeChange,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const activeTheme = THEMES[currentTheme];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="planmyday-navbar"
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl transition-all duration-300 rounded-xl ${
        scrolled
          ? 'bg-neutral-950/80 backdrop-blur-md border border-neutral-800 shadow-[0_12px_30px_rgba(0,0,0,0.6)]'
          : 'bg-neutral-950/40 backdrop-blur-sm border border-neutral-900 shadow-sm'
      }`}
    >
      <div className="px-5 py-2.5 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          onClick={() => onNavigate('hero')}
        >
          <div 
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 group-hover:scale-105"
            style={{ backgroundColor: `${activeTheme.accent1}15`, border: `1px solid ${activeTheme.accent1}30` }}
          >
            <CheckSquare size={16} style={{ color: activeTheme.accent1 }} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-extrabold tracking-tight text-base font-sans">
                PLANMYDAY
              </span>
              <span className="text-[9px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-neutral-400 uppercase font-sans">
                v1.2
              </span>
            </div>
            <span className="text-[10px] block font-medium tracking-wider uppercase text-neutral-400 leading-none mt-0.5">
              To-Do List & Workspace
            </span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          <button
            onClick={() => onNavigate('hero')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
              activeTab === 'hero'
                ? 'bg-neutral-900 text-white font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40'
            }`}
            style={activeTab === 'hero' ? { borderLeft: `2px solid ${activeTheme.accent1}` } : undefined}
          >
            Explore
          </button>
          <button
            onClick={() => onNavigate('features')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
              activeTab === 'features'
                ? 'bg-neutral-900 text-white font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40'
            }`}
            style={activeTab === 'features' ? { borderLeft: `2px solid ${activeTheme.accent1}` } : undefined}
          >
            Features
          </button>
          <button
            onClick={() => {
              if (currentUser) {
                onNavigate('dashboard');
              } else {
                onNavigate('auth');
              }
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
              activeTab === 'dashboard' || activeTab === 'auth'
                ? 'bg-neutral-900 text-white font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40'
            }`}
            style={(activeTab === 'dashboard' || activeTab === 'auth') ? { borderLeft: `2px solid ${activeTheme.accent2}` } : undefined}
          >
            Dashboard
          </button>
        </nav>

        {/* Right: User Status, Theme Switcher & Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Selector */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-2 bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-all duration-200 cursor-pointer"
              title="Select Color Theme"
            >
              <Palette size={14} style={{ color: activeTheme.accent1 }} />
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-neutral-950 border border-neutral-800 rounded-xl p-1.5 shadow-2xl z-50 font-sans text-xs">
                <div className="px-3 py-1.5 text-[10px] text-neutral-500 font-bold uppercase tracking-wider border-b border-neutral-900 mb-1">
                  Workspace Themes
                </div>
                {(Object.keys(THEMES) as DesignTheme[]).map((themeKey) => {
                  const t = THEMES[themeKey];
                  return (
                    <button
                      key={themeKey}
                      onClick={() => {
                        onThemeChange?.(themeKey);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between hover:bg-neutral-900 transition-all cursor-pointer ${
                        currentTheme === themeKey ? 'text-white bg-neutral-900' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className="font-medium">{t.name}</span>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.accent1 }}></span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {currentUser ? (
            <div className="flex items-center gap-3">
              {/* Online Session Badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-neutral-900/60 border border-neutral-800 rounded-lg">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                <span className="text-xs text-neutral-300 font-medium font-sans">
                  {currentUser}
                </span>
                <span className="text-[11px] text-neutral-600 font-sans">|</span>
                <span className="text-[10px] font-bold uppercase tracking-wider font-sans" style={{ color: activeTheme.accent1 }}>
                  Online
                </span>
              </div>

              {/* Status Indicator */}
              <div className="hidden sm:flex items-center gap-1.5 text-neutral-400 text-xs font-sans">
                <Wifi size={13} className="text-emerald-500 animate-pulse" />
                <span className="text-[11px] text-neutral-400 font-medium">Live Sync</span>
              </div>

              {/* Sign Out Action */}
              <button
                onClick={onLock}
                title="Sign Out of Session"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-red-500/30 text-neutral-300 hover:text-red-400 text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide text-neutral-950 cursor-pointer transition-all duration-300 hover:shadow-lg"
              style={{ backgroundImage: `linear-gradient(to r, ${activeTheme.accent1}, ${activeTheme.accent2})` }}
            >
              <Lock size={12} />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
