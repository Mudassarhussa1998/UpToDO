// firebase/firestoreService.ts
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './fireabaseConfig';

interface UserData {
    name: string;
    email: string;
    age?: number;
}

export const saveUserData = async (uid: string, data: UserData): Promise<void> => {
    await setDoc(doc(db, 'users', uid), data);
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
    const docSnap = await getDoc(doc(db, 'users', uid));
    if (docSnap.exists()) {
        return docSnap.data() as UserData;
    }
    return null;
};
