// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCJ5kQChm-HKEwJGwxV7wLgpRfS8H-pbg4",
    authDomain: "hire-host-app.firebaseapp.com",
    databaseURL: "https://hire-host-app-default-rtdb.firebaseio.com",
    projectId: "hire-host-app",
    storageBucket: "hire-host-app.firebasestorage.app",
    messagingSenderId: "73455794355",
    appId: "1:73455794355:ios:3281052118f00e8ffad8c6",
    measurementId: "G-J59XXWH7YE"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Add better error handling for network issues
console.log('Firebase initialized with project:', firebaseConfig.projectId);
console.log('Auth domain:', firebaseConfig.authDomain);
