import { DesignTheme } from '../types';
import { THEMES } from '../lib/themes';
import { Sliders, Check, Sparkles } from 'lucide-react';

interface DesignSelectorProps {
  currentTheme: DesignTheme;
  onThemeChange: (theme: DesignTheme) => void;
}

export default function DesignSelector({ currentTheme, onThemeChange }: DesignSelectorProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-neutral-900/30 p-5 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
        <Sliders size={16} className="text-[#ff0055]" />
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-space-mono flex items-center gap-1">
          Aesthetic Design Engine <Sparkles size={12} className="text-rose-400" />
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {Object.values(THEMES).map((theme) => {
          const isActive = currentTheme === theme.id;
          const isVariation6 = theme.id === 'solar';
          return (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                isActive
                  ? 'bg-white/[0.04] border-rose-500/40 shadow-[0_0_15px_rgba(255,0,85,0.15)]'
                  : 'bg-neutral-950/20 border-white/5 hover:border-white/10 hover:bg-white/[0.01]'
              }`}
            >
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-sans">
                    {theme.name}
                  </span>
                  {isVariation6 && (
                    <span className="text-[9px] bg-rose-600/20 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/30 font-bold font-space-mono">
                      RECOMMENDED
                    </span>
                  )}
                  {isActive && !isVariation6 && (
                    <span className="text-[8px] font-space-mono font-bold text-rose-400 uppercase tracking-widest">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-neutral-400 leading-normal font-light">
                  {theme.description}
                </p>
              </div>

              {/* Color previews */}
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="flex -space-x-1.5">
                  <div
                    className="w-4 h-4 rounded-full border border-neutral-950"
                    style={{ backgroundColor: theme.accent1 }}
                  ></div>
                  <div
                    className="w-4 h-4 rounded-full border border-neutral-950"
                    style={{ backgroundColor: theme.accent2 }}
                  ></div>
                </div>

                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                    isActive ? 'bg-rose-500/20 text-rose-400' : 'text-transparent border border-white/10'
                  }`}
                >
                  <Check size={11} className={isActive ? 'opacity-100' : 'opacity-0'} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
