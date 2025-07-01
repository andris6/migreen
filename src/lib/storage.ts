import type { TherapySession, Settings } from '@/types';

const SESSIONS_KEY = 'migreen_sessions';
const SETTINGS_KEY = 'migreen_settings';

// Helper to check if localStorage is available
function isStorageAvailable(): boolean {
  try {
    const testKey = '__test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

export function getStoredSessions(): TherapySession[] {
  if (!isStorageAvailable()) return [];
  try {
    const stored = localStorage.getItem(SESSIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to parse sessions from localStorage:", error);
    return [];
  }
}

export function storeSession(session: TherapySession): void {
  if (!isStorageAvailable()) return;
  try {
    const sessions = getStoredSessions();
    sessions.push(session);
    sessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error("Failed to store session in localStorage:", error);
  }
}

export function deleteStoredSession(sessionId: string): void {
  if (!isStorageAvailable()) return;
  try {
    let sessions = getStoredSessions();
    sessions = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error("Failed to delete session from localStorage:", error);
  }
}

export function getStoredSettings(): Settings | null {
  if (!isStorageAvailable()) return null;
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to parse settings from localStorage:", error);
    return null;
  }
}

export function storeSettings(settings: Settings): void {
  if (!isStorageAvailable()) return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to store settings in localStorage:", error);
  }
}
