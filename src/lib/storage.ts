import type { TherapySession, Settings } from '@/types';

const SESSIONS_KEY = 'migreen_sessions';
const SETTINGS_KEY = 'migreen_settings';

export function getStoredSessions(): TherapySession[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(SESSIONS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function storeSession(session: TherapySession): void {
  if (typeof window === 'undefined') return;
  const sessions = getStoredSessions();
  sessions.push(session);
  // Sort by startTime descending to have recent sessions first
  sessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function getStoredSettings(): Settings | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(SETTINGS_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function storeSettings(settings: Settings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
