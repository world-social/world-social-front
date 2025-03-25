'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { VerifyBlock } from '@/components/auth/verify-world-id';
import { SignUpForm } from '@/components/auth/signup-form';
import { Login } from '@/components/wallet-login'; // Make sure this component exists

export default function TwoStepRegistration() {
  const [isLogged, setIsLogged] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isRegistered) {
      router.push('/home');
    }
  }, [isRegistered, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {!isLogged ? (
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Please Log In
          </h1>
          {/* Login component receives a callback to update isLogged state */}
          <Login onLogged={() => setIsLogged(true)} />
        </div>
      ) : !isVerified ? (
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Step 1: Verify with World ID
          </h1>
          {/* VerifyBlock receives a callback to update isVerified */}
          <VerifyBlock onVerified={() => setIsVerified(true)} />
        </div>
      ) : (
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Step 2: Create Your Account
          </h1>
          {/* SignUpForm receives a callback to update isRegistered */}
          <SignUpForm onRegistered={() => setIsRegistered(true)} />
        </div>
      )}
    </div>
  );
}
