
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  verifyPasswordResetCode as fbVerifyPasswordResetCode,
  confirmPasswordReset as fbConfirmPasswordReset,
  sendEmailVerification,
  applyActionCode,
  type User as FirebaseUser,
  type ActionCodeSettings,
} from 'firebase/auth';
import { auth } from './firebase';
import type { User } from '@/types';

const actionCodeSettings: ActionCodeSettings = {
    url: 'https://migreen.app/auth/action',
};

export async function signUp(email: string, password_plaintext: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password_plaintext);
    const firebaseUser = userCredential.user;
    await sendEmailVerification(firebaseUser, actionCodeSettings);
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email,
    };
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('An account with this email already exists.');
    }
    throw error;
  }
}

export async function logIn(email: string, password_plaintext: string): Promise<User> {
   try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password_plaintext);
    const firebaseUser = userCredential.user;

    if (!firebaseUser.emailVerified) {
        throw new Error('Please verify your email address before logging in. Check your inbox for a verification link.');
    }

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email,
    };
  } catch (error: any) {
    if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password. Please try again.');
    }
    throw new Error((error as Error).message || 'An unknown error occurred during login.');
  }
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

export async function sendPasswordReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
        return;
    }
    throw new Error((error as Error).message || 'An unknown error occurred during password reset.');
  }
}

export async function verifyPasswordResetCode(oobCode: string): Promise<string> {
  try {
    const email = await fbVerifyPasswordResetCode(auth, oobCode);
    return email;
  } catch (error: any) {
     throw new Error((error as Error).message || 'Invalid or expired password reset code.');
  }
}

export async function confirmPasswordReset(oobCode: string, newPassword_plaintext: string): Promise<void> {
    try {
        await fbConfirmPasswordReset(auth, oobCode, newPassword_plaintext);
    } catch (error: any) {
        throw new Error((error as Error).message || 'Failed to reset password.');
    }
}

export async function handleEmailAction(oobCode: string): Promise<void> {
    try {
        await applyActionCode(auth, oobCode);
    } catch (error: any) {
        throw new Error('Invalid action code.');
    }
}

export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}
