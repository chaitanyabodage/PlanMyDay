import { CheckSquare, Info } from 'lucide-react';
import { DesignTheme } from '../types';
import { THEMES } from '../lib/themes';

interface FooterProps {
  currentTheme?: DesignTheme;
}

export default function Footer({ currentTheme = 'solar' }: FooterProps) {
  const activeTheme = THEMES[currentTheme];

  return (
    <footer className={`${activeTheme.bg} border-t border-neutral-900 py-12 relative overflow-hidden transition-colors duration-500 font-sans`}>
      {/* Subtle thin accent line */}
      <div 
        className="absolute top-0 left-0 right-0 h-[1px] opacity-35"
        style={{
          backgroundImage: `linear-gradient(to right, transparent, ${activeTheme.accent1}, transparent)`
        }}
      ></div>

      <div className="w-full max-w-6xl px-6 mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
            <CheckSquare size={13} style={{ color: activeTheme.accent1 }} />
          </div>
          <div>
            <span className="text-white font-extrabold tracking-tight text-sm font-sans">PLANMYDAY</span>
            <span className="text-[10px] block text-neutral-500 font-medium font-sans">
              Elegant client-side daily checklist
            </span>
          </div>
        </div>

        {/* Center: Info links */}
        <div className="flex flex-wrap justify-center gap-5 text-xs text-neutral-400 font-semibold font-sans">
          <span className="hover:text-white cursor-pointer transition-colors duration-200">
            Privacy Policy
          </span>
          <span className="text-neutral-800">|</span>
          <span className="hover:text-white cursor-pointer transition-colors duration-200">
            Student Plan
          </span>
          <span className="text-neutral-800">|</span>
          <span className="hover:text-white cursor-pointer transition-colors duration-200">
            Documentation
          </span>
        </div>

        {/* Right: Copyright and Version info */}
        <div className="flex items-center gap-3 text-xs text-neutral-500 font-sans">
          <Info size={12} style={{ color: activeTheme.accent2 }} />
          <span>v1.2 Stable</span>
          <span className="text-neutral-800">•</span>
          <span>&copy; {new Date().getFullYear()} PlanMyDay.</span>
        </div>
      </div>
    </footer>
  );
}
