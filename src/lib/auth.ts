
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  verifyPasswordResetCode as fbVerifyPasswordResetCode,
  confirmPasswordReset as fbConfirmPasswordReset,
  sendEmailVerification,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth } from './firebase';
import type { User } from '@/types';

// NOTE: This is now configured for Firebase Authentication.

export async function signUp(email: string, password_plaintext: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password_plaintext);
    const firebaseUser = userCredential.user;
    await sendEmailVerification(firebaseUser);
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email,
    };
  } catch (error: any) {
    // Firebase provides specific error codes, you can handle them here
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
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    // Handle errors like 'auth/user-not-found' gracefully without revealing if user exists
    if (error.code === 'auth/user-not-found') {
        // Don't throw an error to prevent user enumeration
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


export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}
