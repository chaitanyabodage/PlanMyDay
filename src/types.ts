export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'work' | 'personal' | 'creative' | 'routine';
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  reminderTime?: string; // HH:MM
  isReminderActive: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface User {
  username: string;
  passwordHash: string; // SHA-256 of password for authentication
  createdAt: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  type: 'info' | 'success' | 'warning';
}

export type DesignTheme = 'cyberpunk' | 'obsidian' | 'luxury' | 'solar';

