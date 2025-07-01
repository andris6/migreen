
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth } from './firebase';
import type { User } from '@/types';

// NOTE: This is now configured for Firebase Authentication.

export async function signUp(email: string, password_plaintext: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password_plaintext);
    const firebaseUser = userCredential.user;
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email,
    };
  } catch (error: any) {
    // Firebase provides specific error codes, you can handle them here
    // e.g., error.code === 'auth/email-already-in-use'
    throw new Error(error.message || 'An unknown error occurred during sign up.');
  }
}

export async function logIn(email: string, password_plaintext: string): Promise<User> {
   try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password_plaintext);
    const firebaseUser = userCredential.user;
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email,
    };
  } catch (error: any) {
    // e.g., error.code === 'auth/wrong-password' or 'auth/user-not-found'
    throw new Error(error.message || 'An unknown error occurred during login.');
  }
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}
