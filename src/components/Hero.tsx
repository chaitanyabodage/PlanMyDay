import { ArrowRight, CheckSquare, Sparkles, Clock, Shield, Award } from 'lucide-react';
import { DesignTheme } from '../types';
import { THEMES } from '../lib/themes';

interface HeroProps {
  onLaunch: () => void;
  onExploreFeatures: () => void;
  currentTheme: DesignTheme;
  onThemeChange: (theme: DesignTheme) => void;
}

export default function Hero({ onLaunch, onExploreFeatures, currentTheme, onThemeChange }: HeroProps) {
  const activeTheme = THEMES[currentTheme];

  // A premium mockup task data list to show off the visual redesign inside the mockup frame
  const demoTasks = [
    { title: 'Redesign client proposal draft', due: 'Today', category: 'Work', priority: 'High', completed: true },
    { title: 'Weekly creative design sync', due: 'Tomorrow', category: 'Creative', priority: 'Medium', completed: false },
    { title: 'Read Chapter 4: Minimalist UI systems', due: '12 Sep 2026', category: 'Personal', priority: 'Low', completed: false }
  ];

  return (
    <section
      id="planmyday-hero"
      className={`relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden ${activeTheme.bg} ${activeTheme.textPrimary} transition-colors duration-500 font-sans`}
    >
      {/* Soft gradient background orbs for depth without sci-fi effects */}
      <div 
        className="absolute top-[15%] left-[20%] w-[350px] h-[350px] rounded-full blur-[140px] pointer-events-none opacity-40 transition-all duration-1000"
        style={{ backgroundColor: `${activeTheme.accent1}15` }}
      ></div>
      <div 
        className="absolute bottom-[20%] right-[15%] w-[450px] h-[450px] rounded-full blur-[180px] pointer-events-none opacity-40 transition-all duration-1000"
        style={{ backgroundColor: `${activeTheme.accent2}15` }}
      ></div>

      <div className="relative z-10 w-full max-w-6xl px-6 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Product Value Pitch */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
          
          {/* Subtle Accent Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1 bg-white/[0.03] border border-white/5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3B82F6]"></span>
            </span>
            <span className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
              REFINED CLIENT-SIDE WORKSPACE
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
            Organize your day <br />
            <span 
              className="bg-clip-text text-transparent filter drop-shadow-sm font-black"
              style={{ backgroundImage: `linear-gradient(to r, ${activeTheme.accent1}, ${activeTheme.accent2})` }}
            >
              with elegant ease.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed max-w-lg">
            PlanMyDay is a premium, minimal, student-friendly daily planner. 
            Group your checklists, set task schedules with synthesized audio reminders, 
            and keep your personal workspace isolated and perfectly offline-first.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={onLaunch}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-neutral-950 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg cursor-pointer hover:opacity-95 hover:scale-[1.01]"
              style={{ backgroundImage: `linear-gradient(to r, ${activeTheme.accent1}, ${activeTheme.accent2})` }}
            >
              <CheckSquare size={14} className="text-neutral-950" />
              Launch Workspace
              <ArrowRight size={14} className="ml-1 text-neutral-950" />
            </button>

            <button
              onClick={onExploreFeatures}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/80 text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer"
            >
              Explore Features
            </button>
          </div>

          {/* Core App Benefits Grid */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-neutral-900 w-full max-w-lg">
            <div>
              <span className="block text-2xl font-bold text-white tracking-tight">100%</span>
              <span className="text-[10px] uppercase text-neutral-400 font-semibold tracking-wide mt-1 block">
                Offline-First
              </span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-white tracking-tight">Live</span>
              <span className="text-[10px] uppercase text-neutral-400 font-semibold tracking-wide mt-1 block">
                Activity Sync
              </span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-white tracking-tight">Audio</span>
              <span className="text-[10px] uppercase text-neutral-400 font-semibold tracking-wide mt-1 block">
                Chrono Alerts
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Premium Mockup (Notion/Linear Style) */}
        <div className="lg:col-span-5 relative group w-full">
          {/* Subtle outer glow that scales on hover */}
          <div 
            className="absolute -inset-1 rounded-2xl opacity-10 blur-xl group-hover:opacity-15 transition-all duration-500"
            style={{ backgroundImage: `linear-gradient(to r, ${activeTheme.accent1}, ${activeTheme.accent2})` }}
          ></div>

          {/* Mockup Container */}
          <div className="relative overflow-hidden rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl p-[1px]">
            <div className="bg-neutral-900/90 rounded-[15px] p-5 flex flex-col space-y-5">
              
              {/* Mockup Windows Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800"></div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-neutral-950 border border-neutral-800 text-[10px] font-medium text-neutral-400">
                  <CheckSquare size={10} style={{ color: activeTheme.accent1 }} />
                  <span>planmyday.app/workspace</span>
                </div>
                <span className="w-4 h-4"></span>
              </div>

              {/* Mockup Workspace Stats Segment */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider block">Completed</span>
                    <span className="text-lg font-bold text-white">67%</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-neutral-800 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white">2/3</span>
                  </div>
                </div>
                <div className="bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/60">
                  <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider block">Remaining</span>
                  <span className="text-lg font-bold text-white">1 Task</span>
                </div>
              </div>

              {/* Mockup Task list representation */}
              <div className="space-y-2.5">
                {demoTasks.map((task, i) => (
                  <div 
                    key={i} 
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                      task.completed 
                        ? 'bg-neutral-950/40 border-neutral-800/40 opacity-55' 
                        : 'bg-neutral-950/80 border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        task.completed 
                          ? 'border-[#3B82F6] bg-[#3B82F6]/10 text-[#3B82F6]' 
                          : 'border-neutral-700'
                      }`}>
                        {task.completed && (
                          <svg className="w-2.5 h-2.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="4">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-xs truncate ${task.completed ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 font-semibold uppercase">
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mockup Footer Info */}
              <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                <span className="flex items-center gap-1">
                  <Sparkles size={10} style={{ color: activeTheme.accent1 }} />
                  Sync Active
                </span>
                <span>Workspace: Private</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
