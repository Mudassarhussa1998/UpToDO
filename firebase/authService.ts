// firebase/authService.ts
import { auth } from './fireabaseConfig';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

export const signUp = async (email: string, password: string): Promise<User | null> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        console.error('Sign up error:', error);
        if (error instanceof FirebaseError) {
            console.error('Firebase error code:', error.code);
            console.error('Firebase error message:', error.message);
            
            // Handle specific error types
            if (error.code === 'auth/network-request-failed') {
                console.error('Network error - check internet connection');
            } else if (error.code === 'auth/email-already-in-use') {
                console.error('Email already registered');
            }
        }
        return null;
    }
};

export const login = async (email: string, password: string): Promise<User | null> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        console.error('Login error:', error);
        if (error instanceof FirebaseError) {
            console.error('Firebase error code:', error.code);
            console.error('Firebase error message:', error.message);
            
            // Handle specific error types
            if (error.code === 'auth/network-request-failed') {
                console.error('Network error - check internet connection');
            } else if (error.code === 'auth/invalid-credential') {
                console.error('Invalid email or password');
            } else if (error.code === 'auth/user-not-found') {
                console.error('User not found - please register first');
            }
        }
        return null;
    }
};

export const logout = async (): Promise<void> => {
    await signOut(auth);
};
