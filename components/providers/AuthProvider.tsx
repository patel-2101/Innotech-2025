'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  ConfirmationResult,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface User {
  id: string;
  phoneNumber: string;
  name: string | null;
  email: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInWithPhone: (phoneNumber: string) => Promise<ConfirmationResult>;
  verifyOTP: (confirmationResult: ConfirmationResult, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  setupRecaptcha: (elementId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${idToken}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.data);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setupRecaptcha = (elementId: string) => {
    if (!recaptchaVerifier) {
      const verifier = new RecaptchaVerifier(auth, elementId, {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        }
      });
      setRecaptchaVerifier(verifier);
    }
  };

  const signInWithPhone = async (phoneNumber: string): Promise<ConfirmationResult> => {
    if (!recaptchaVerifier) {
      throw new Error('Recaptcha not initialized');
    }
    
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
    return confirmationResult;
  };

  const verifyOTP = async (confirmationResult: ConfirmationResult, otp: string) => {
    const result = await confirmationResult.confirm(otp);
    const firebaseUser = result.user;
    
    // Register/login user in our database
    const idToken = await firebaseUser.getIdToken();
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken,
        phoneNumber: firebaseUser.phoneNumber,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to register user');
    }
    
    const data = await response.json();
    setUser(data.data);
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setFirebaseUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      firebaseUser,
      loading, 
      signInWithPhone, 
      verifyOTP, 
      logout,
      setupRecaptcha
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
