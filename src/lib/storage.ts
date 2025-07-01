import type { TherapySession, Settings } from '@/types';

const getSessionsKey = (userId?: string) => `migreen_sessions_${userId || 'guest'}`;
const getSettingsKey = (userId?: string) => `migreen_settings_${userId || 'guest'}`;

// Helper to check if localStorage is available
function isStorageAvailable(): boolean {
  try {
    const testKey = '__test__';
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
        return false;
    }
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

export function getStoredSessions(userId?: string): TherapySession[] {
  if (!isStorageAvailable()) return [];
  const key = getSessionsKey(userId);
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to parse sessions from localStorage:", error);
    return [];
  }
}

export function storeSession(session: TherapySession, userId?: string): void {
  if (!isStorageAvailable()) return;
  const key = getSessionsKey(userId);
  try {
    const sessions = getStoredSessions(userId);
    sessions.push(session);
    sessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    localStorage.setItem(key, JSON.stringify(sessions));
  } catch (error) {
    console.error("Failed to store session in localStorage:", error);
  }
}

export function deleteStoredSession(sessionId: string, userId?: string): void {
  if (!isStorageAvailable()) return;
  const key = getSessionsKey(userId);
  try {
    let sessions = getStoredSessions(userId);
    sessions = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem(key, JSON.stringify(sessions));
  } catch (error) {
    console.error("Failed to delete session from localStorage:", error);
  }
}

export function getStoredSettings(userId?: string): Settings | null {
  if (!isStorageAvailable()) return null;
  const key = getSettingsKey(userId);
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to parse settings from localStorage:", error);
    return null;
  }
}

export function storeSettings(settings: Settings, userId?: string): void {
  if (!isStorageAvailable()) return;
  const key = getSettingsKey(userId);
  try {
    localStorage.setItem(key, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to store settings in localStorage:", error);
  }
}
