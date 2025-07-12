
import type { TherapySession, Settings, WithFirestoreStubs } from '@/types';
import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, collection, writeBatch, getDocs, query, orderBy } from 'firebase/firestore';

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

// === Firestore Implementation ===

async function getFirestoreSessions(userId: string): Promise<TherapySession[]> {
    const sessionsCol = collection(db, 'users', userId, 'sessions');
    const q = query(sessionsCol, orderBy('startTime', 'desc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => doc.data() as TherapySession);
}

async function storeFirestoreSession(session: TherapySession, userId: string): Promise<void> {
    const sessionDocRef = doc(db, 'users', userId, 'sessions', session.id);
    await setDoc(sessionDocRef, session, { merge: true });
}

async function deleteFirestoreSession(sessionId: string, userId: string): Promise<void> {
    const batch = writeBatch(db);
    const sessionDocRef = doc(db, 'users', userId, 'sessions', sessionId);
    batch.delete(sessionDocRef);
    await batch.commit();
}


async function getFirestoreSettings(userId: string): Promise<Settings | null> {
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        const data = docSnap.data() as WithFirestoreStubs<Settings>;
        return data.settings || null;
    }
    return null;
}

async function storeFirestoreSettings(settings: Settings, userId: string): Promise<void> {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, { settings }, { merge: true });
}


// === LocalStorage Implementation ===

function getLocalSessions(userId?: string): TherapySession[] {
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

function storeLocalSession(session: TherapySession, userId?: string): void {
    if (!isStorageAvailable()) return;
    const key = getSessionsKey(userId);
    try {
        const sessions = getLocalSessions(userId);
        sessions.push(session);
        sessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
        localStorage.setItem(key, JSON.stringify(sessions));
    } catch (error) {
        console.error("Failed to store session in localStorage:", error);
    }
}

function deleteLocalSession(sessionId: string, userId?: string): void {
    if (!isStorageAvailable()) return;
    const key = getSessionsKey(userId);
    try {
        let sessions = getLocalSessions(userId);
        sessions = sessions.filter(s => s.id !== sessionId);
        localStorage.setItem(key, JSON.stringify(sessions));
    } catch (error) {
        console.error("Failed to delete session from localStorage:", error);
    }
}

function getLocalSettings(userId?: string): Settings | null {
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

function storeLocalSettings(settings: Settings, userId?: string): void {
    if (!isStorageAvailable()) return;
    const key = getSettingsKey(userId);
    try {
        localStorage.setItem(key, JSON.stringify(settings));
    } catch (error) {
        console.error("Failed to store settings in localStorage:", error);
    }
}


// === Unified Public API ===

export async function getStoredSessions(userId?: string): Promise<TherapySession[]> {
    if (userId) {
        return getFirestoreSessions(userId);
    }
    return getLocalSessions();
}

export async function storeSession(session: TherapySession, userId?: string): Promise<void> {
    if (userId) {
        await storeFirestoreSession(session, userId);
    } else {
        storeLocalSession(session);
    }
}

export async function deleteStoredSession(sessionId: string, userId?: string): Promise<void> {
    if (userId) {
        await deleteFirestoreSession(sessionId, userId);
    } else {
        deleteLocalSession(sessionId);
    }
}

export async function getStoredSettings(userId?: string): Promise<Settings | null> {
    if (userId) {
        return getFirestoreSettings(userId);
    }
    return getLocalSettings();
}

export async function storeSettings(settings: Settings, userId?: string): Promise<void> {
    if (userId) {
        await storeFirestoreSettings(settings, userId);
    } else {
        storeLocalSettings(settings, userId);
    }
}
    