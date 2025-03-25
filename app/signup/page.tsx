'use client';

import { useState } from 'react';
import { VerifyBlock } from "@/components/auth/verify-world-id";
import { SignUpForm } from '@/components/auth/signup-form';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TwoStepRegistration() {
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
      {!isVerified ? (
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Step 1: Verify with World ID
          </h1>
          {/* Pass a callback to update verification state */}
          <VerifyBlock onVerified={() => setIsVerified(true)} />
        </div>
      ) : (
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Step 2: Create Your Account
          </h1>
          <SignUpForm onRegistered={() => setIsRegistered(true)}/>
        </div>
      )}
    </div>
  );
}
