import { Shield, Clock, Activity, Sliders, Cpu, ListTodo } from 'lucide-react';
import { DesignTheme } from '../types';
import { THEMES } from '../lib/themes';

interface FeaturesProps {
  onGetStarted: () => void;
  currentTheme?: DesignTheme;
}

export default function Features({ onGetStarted, currentTheme = 'solar' }: FeaturesProps) {
  const activeTheme = THEMES[currentTheme];

  const bentoCards = [
    {
      id: 'categories',
      size: 'md:col-span-8 lg:col-span-8',
      icon: <ListTodo style={{ color: activeTheme.accent1 }} size={20} />,
      title: 'Premium Task Allocation',
      description:
        'Seamlessly organize tasks into dedicated categories: Work, Personal, Creative, or Routine. Customize priority metrics and assign target dates with elegant structural cards that adapt to any display.',
      tag: 'ORGANIZATION',
    },
    {
      id: 'analytics',
      size: 'md:col-span-4 lg:col-span-4',
      icon: <Activity style={{ color: activeTheme.accent2 }} size={20} />,
      title: 'Interactive Progress Metrics',
      description:
        'Track your accomplishments in real time with beautiful visual progress rings, pending statistics, and completion rates.',
      tag: 'ANALYTICS',
    },
    {
      id: 'reminders',
      size: 'md:col-span-4 lg:col-span-4',
      icon: <Clock style={{ color: activeTheme.accent1 }} size={20} />,
      title: 'Chrono Bell Reminders',
      description:
        'Set precise reminder times and hear a calming, synthesized client-side audio alert directly inside your browser.',
      tag: 'NOTIFICATIONS',
    },
    {
      id: 'privacy',
      size: 'md:col-span-8 lg:col-span-8',
      icon: <Shield style={{ color: activeTheme.accent2 }} size={20} />,
      title: 'Complete Sandboxed Privacy',
      description:
        'All your task schedules are stored directly in your browser local memory sandbox. Your workspace is fully decentralized, keeping your personal agenda and daily routine entirely private.',
      tag: 'SECURITY',
    },
    {
      id: 'customization',
      size: 'md:col-span-6 lg:col-span-6',
      icon: <Sliders style={{ color: activeTheme.accent1 }} size={20} />,
      title: 'Sleek Visual Adaptability',
      description:
        'Switch instantly between premium visual presets—including Oceanic Blue, Nordic Obsidian, Amethyst Premium, and Rose Minimalist. Tailor your focus environment with subtle, eye-safe colors.',
      tag: 'THEMING',
    },
    {
      id: 'performance',
      size: 'md:col-span-6 lg:col-span-6',
      icon: <Cpu style={{ color: activeTheme.accent2 }} size={20} />,
      title: 'Instant Offline Sovereign Engine',
      description:
        'Run entirely offline without any external network dependency. Tasks load with zero latency, providing an incredibly smooth, fluid interface ideal for students and professionals alike.',
      tag: 'RUNTIME SYSTEM',
    },
  ];

  return (
    <section 
      id="planmyday-features" 
      className={`py-24 ${activeTheme.bg} border-t border-neutral-900 relative transition-colors duration-500 font-sans`}
    >
      {/* Decorative gradient blur */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[160px] pointer-events-none opacity-30"
        style={{ backgroundColor: `${activeTheme.accent1}10` }}
      ></div>

      <div className="w-full max-w-6xl px-6 mx-auto">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] font-bold tracking-wider uppercase bg-white/5 border border-white/5 px-3 py-1 rounded-lg text-neutral-400">
            FEATURES OVERVIEW
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
            Streamlined for Focus
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base font-normal">
            PlanMyDay balances beautiful editorial layouts with powerful, sandboxed client-side memory.
          </p>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-fr">
          {bentoCards.map((card) => (
            <div
              key={card.id}
              className={`${card.size} group relative overflow-hidden rounded-xl bg-neutral-900/45 border border-neutral-800/80 p-6 flex flex-col justify-between transition-all duration-300 hover:border-neutral-700 hover:shadow-lg`}
            >
              <div>
                {/* Header in Card */}
                <div className="flex items-center justify-between mb-5">
                  <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                    {card.icon}
                  </div>
                  <span className="text-[9px] font-bold text-neutral-500 tracking-wider uppercase font-sans">
                    {card.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 font-sans">
                  {card.title}
                </h3>

                <p className="text-neutral-400 text-xs sm:text-sm font-normal leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-6 pt-4 border-t border-neutral-900/60 flex items-center justify-between text-[10px] text-neutral-500 font-sans">
                <span className="font-medium">COMPLIANT // OFFLINE</span>
                <span className="transition-opacity duration-300 opacity-0 group-hover:opacity-100 font-semibold" style={{ color: activeTheme.accent1 }}>
                  PLANMYDAY ACTIVE
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Trigger */}
        <div className="mt-16 text-center">
          <button
            onClick={onGetStarted}
            className="px-8 py-3.5 rounded-xl text-neutral-950 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer hover:opacity-95 hover:scale-[1.01]"
            style={{ backgroundImage: `linear-gradient(to r, ${activeTheme.accent1}, ${activeTheme.accent2})` }}
          >
            Launch PlanMyDay Workspace
          </button>
        </div>
      </div>
    </section>
  );
}
