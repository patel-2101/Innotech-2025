'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, ArrowLeft, Mail, Phone, Loader2 } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';

type LoginMethod = 'phone' | 'gmail';

export default function CitizenLoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('✓ Recaptcha verified successfully');
        },
        'expired-callback': () => {
          console.log('⚠ Recaptcha expired, please try again');
          setError('Security verification expired. Please try again.');
        }
      });
    }
    return (window as any).recaptchaVerifier;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate phone number format
      if (!phoneNumber.startsWith('+')) {
        setError('Phone number must include country code (e.g., +91 for India)');
        setLoading(false);
        return;
      }

      // Setup and verify recaptcha
      const appVerifier = setupRecaptcha();
      
      console.log('📱 Sending OTP to:', phoneNumber);
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      
      console.log('✓ OTP sent successfully');
      setConfirmationResult(confirmation);
      setShowOtpInput(true);
      setError('');
    } catch (err: any) {
      console.error('❌ OTP send failed:', err);
      
      // Handle specific Firebase errors
      if (err.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number format. Please include country code (e.g., +91 1234567890)');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else if (err.code === 'auth/quota-exceeded') {
        setError('SMS quota exceeded. Please try again later or contact support.');
      } else {
        setError(err.message || 'Failed to send OTP. Please check your phone number and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!confirmationResult) {
        setError('Please request OTP first');
        setLoading(false);
        return;
      }

      // Validate OTP format
      if (otp.length !== 6) {
        setError('Please enter a valid 6-digit OTP');
        setLoading(false);
        return;
      }

      console.log('🔐 Verifying OTP...');
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      console.log('✓ OTP verified successfully');
      console.log('👤 User authenticated:', user.uid);
      
      // Get Firebase ID token
      const idToken = await user.getIdToken();
      
      // Register/Login user in backend
      console.log('📡 Registering user with backend...');
      const response = await fetch('/api/auth/citizen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: user.uid,
          phoneNumber: user.phoneNumber,
          displayName: user.displayName,
          idToken
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✓ User registered successfully');
        // Set token in cookie
        document.cookie = `authToken=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        console.log('🎉 Redirecting to citizen dashboard...');
        router.push('/citizen');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err: any) {
      console.error('❌ OTP verification failed:', err);
      
      if (err.code === 'auth/invalid-verification-code') {
        setError('Invalid OTP code. Please check and try again.');
      } else if (err.code === 'auth/code-expired') {
        setError('OTP has expired. Please request a new one.');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Initiating Google Sign-in...');
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log('✓ Google Sign-in successful');
      console.log('👤 User:', user.email);

      // Get Firebase ID token
      const idToken = await user.getIdToken();

      // Register/Login user in backend
      console.log('📡 Registering user with backend...');
      const response = await fetch('/api/auth/citizen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          idToken
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✓ User registered successfully');
        // Set token in cookie
        document.cookie = `authToken=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        console.log('🎉 Redirecting to citizen dashboard...');
        router.push('/citizen');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err: any) {
      console.error('❌ Google Sign-in failed:', err);
      
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup blocked. Please allow popups for this site.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        // User cancelled, don't show error
        return;
      } else {
        setError(err.message || 'Google login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div id="recaptcha-container"></div>
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <Link 
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Citizen Login</h1>
            <p className="text-gray-600">Login to submit and track your complaints</p>
          </div>

          {/* Login Method Selector */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => {
                setLoginMethod('phone');
                setError('');
                setShowOtpInput(false);
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                loginMethod === 'phone'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Phone className="w-4 h-4" />
              Phone OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMethod('gmail');
                setError('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                loginMethod === 'gmail'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Mail className="w-4 h-4" />
              Gmail
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Phone OTP Login */}
          {loginMethod === 'phone' && (
            <>
              {!showOtpInput ? (
                <form onSubmit={handleSendOTP} className="space-y-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 1234567890"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Enter with country code (e.g., +91)</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      'Send OTP'
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                      Enter OTP
                    </label>
                    <input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                      maxLength={6}
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500 text-center">
                      OTP sent to {phoneNumber}
                    </p>
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-700 underline"
                    >
                      Didn&apos;t receive? Resend OTP
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowOtpInput(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify OTP'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* Gmail Login */}
          {loginMethod === 'gmail' && (
            <div className="space-y-4">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg border-2 border-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
              <p className="text-xs text-center text-gray-500">
                We&apos;ll create an account if you don&apos;t have one
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800 font-medium mb-2">� Phone Authentication</p>
            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
              <li>Enter phone with country code (e.g., +91 1234567890)</li>
              <li>You&apos;ll receive a 6-digit OTP via SMS</li>
              <li>Enter the OTP to complete login</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-blue-800 font-medium mb-2">🔐 Google Sign-in</p>
              <p className="text-xs text-blue-700">
                Click the Google button to sign in with your Google account
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
