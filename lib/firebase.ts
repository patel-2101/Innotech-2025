import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCDr95PVKiJcAjjKDgknx2w4h1iteW-er8",
  authDomain: "ai-smart-complaint--system.firebaseapp.com",
  projectId: "ai-smart-complaint--system",
  storageBucket: "ai-smart-complaint--system.firebasestorage.app",
  messagingSenderId: "17396598535",
  appId: "1:17396598535:web:d1ee182d4a5d3a1706a7a2",
  measurementId: "G-HM4NGNZ3B4"
};

let app: FirebaseApp;
let auth: Auth;
let storage: FirebaseStorage;
let analytics: Analytics;

if (typeof window !== 'undefined') {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  storage = getStorage(app);
  analytics = getAnalytics(app);
}

export { app, auth, storage, analytics };
