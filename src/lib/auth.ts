
import type { User } from '@/types';

const USERS_KEY = 'migreen_users';
const SESSION_KEY = 'migreen_session';

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

// NOTE: This is an insecure way to handle passwords and user data.
// It is for PROTOTYPING PURPOSES ONLY.
// In a real application, never store plain text passwords. Use a secure auth provider.

export function signUp(email: string, password_plaintext: string): User {
  if (!isStorageAvailable()) {
    throw new Error('Local storage is not available.');
  }

  const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    throw new Error('An account with this email already exists.');
  }

  const newUser: User = {
    id: new Date().toISOString() + Math.random().toString(36).substring(2,9),
    email,
    // In a real app, you would HASH and SALT the password here.
    // We store it plaintext for this prototype, which is INSECURE.
    password: password_plaintext,
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Return user object without the password
  const { password, ...userToReturn } = newUser;
  return userToReturn;
}


export function logIn(email: string, password_plaintext: string): void {
  if (!isStorageAvailable()) {
    throw new Error('Local storage is not available.');
  }

  const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password_plaintext) {
    throw new Error('Invalid email or password.');
  }
  
  // In a real app, you'd create a JWT or session token.
  // Here, we just store the user object (without password) to simulate a session.
  const { password, ...sessionUser } = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
}

export function logOut(): void {
  if (!isStorageAvailable()) return;
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): User | null {
  if (!isStorageAvailable()) return null;
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
}
