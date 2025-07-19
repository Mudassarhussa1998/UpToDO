// context/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/fireabaseConfig';

interface AuthContextType {
    user: User | null;
    token: string | null;
}

const AuthContext = createContext<AuthContextType>({ user: null, token: null });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const idToken = await firebaseUser.getIdToken();
                setUser(firebaseUser);
                setToken(idToken);
            } else {
                setUser(null);
                setToken(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return <AuthContext.Provider value={{ user, token }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
