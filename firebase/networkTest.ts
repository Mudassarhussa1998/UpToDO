// networkTest.ts
import { auth } from './fireabaseConfig';

export const testFirebaseConnection = async () => {
    try {
        console.log('Testing Firebase connection...');
        
        // Test if we can access Firebase auth
        const currentUser = auth.currentUser;
        console.log('Current user:', currentUser ? currentUser.email : 'No user logged in');
        
        // Test if we can get auth state
        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log('Auth state changed:', user ? user.email : 'No user');
            unsubscribe();
        });
        
        return true;
    } catch (error) {
        console.error('Firebase connection test failed:', error);
        return false;
    }
};

export const checkNetworkConnectivity = async () => {
    try {
        // Simple network test
        const response = await fetch('https://www.google.com', {
            method: 'HEAD'
        });
        console.log('Network connectivity test:', response.ok ? 'SUCCESS' : 'FAILED');
        return response.ok;
    } catch (error) {
        console.error('Network connectivity test failed:', error);
        return false;
    }
}; 