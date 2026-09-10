import { DesignTheme } from '../types';

export interface ThemeColors {
  id: DesignTheme;
  name: string;
  bg: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  accent1: string; // Hex color
  accent2: string; // Hex color
  border: string;
  glowColor: string;
  badgeStyle: string;
  description: string;
  fontFamily: string;
}

export const THEMES: Record<DesignTheme, ThemeColors> = {
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Oceanic Blue',
    bg: 'bg-[#0B0F19]',
    cardBg: 'bg-[#131B2E]/60',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-400',
    accent1: '#3B82F6', // Royal blue
    accent2: '#06B6D4', // Teal/Cyan
    border: 'border-slate-800/80',
    glowColor: 'rgba(59, 130, 246, 0.15)',
    badgeStyle: 'text-blue-400 bg-blue-950/20 border-blue-500/20',
    description: 'A professional deep navy-slate base accented with crisp royal blue and soft cyan details.',
    fontFamily: 'font-sans',
  },
  obsidian: {
    id: 'obsidian',
    name: 'Nordic Obsidian',
    bg: 'bg-[#09090B]',
    cardBg: 'bg-[#18181B]/70',
    textPrimary: 'text-neutral-100',
    textSecondary: 'text-neutral-400',
    accent1: '#F4F4F5',
    accent2: '#A1A1AA',
    border: 'border-zinc-800',
    glowColor: 'rgba(244, 244, 245, 0.08)',
    badgeStyle: 'text-neutral-200 bg-neutral-900 border-neutral-700',
    description: 'An elegant, high-contrast monochrome design featuring bone-white and light zinc accents.',
    fontFamily: 'font-sans',
  },
  luxury: {
    id: 'luxury',
    name: 'Amethyst Premium',
    bg: 'bg-[#0A0714]',
    cardBg: 'bg-[#120E22]/65',
    textPrimary: 'text-[#F5F2FB]',
    textSecondary: 'text-[#9A91B0]',
    accent1: '#D946EF', // Fuchsia
    accent2: '#8B5CF6', // Purple
    border: 'border-[#2D234C]',
    glowColor: 'rgba(139, 92, 246, 0.15)',
    badgeStyle: 'text-fuchsia-400 bg-fuchsia-950/20 border-fuchsia-500/20',
    description: 'A sophisticated royal violet canvas enriched with calming amethyst and orchid tones.',
    fontFamily: 'font-sans',
  },
  solar: {
    id: 'solar',
    name: 'Rose Minimalist',
    bg: 'bg-[#0D0B0C]',
    cardBg: 'bg-[#161214]/75',
    textPrimary: 'text-[#F4F2F3]',
    textSecondary: 'text-neutral-400',
    accent1: '#F43F5E', // Rose
    accent2: '#FDA4AF', // Rose light
    border: 'border-rose-950/30',
    glowColor: 'rgba(244, 63, 94, 0.12)',
    badgeStyle: 'text-rose-400 bg-rose-950/20 border-rose-500/20',
    description: 'A warm, premium off-black layout with refined rose petal highlights and elegant proportions.',
    fontFamily: 'font-sans',
  },
};
