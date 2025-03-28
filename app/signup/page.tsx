'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignUpForm } from '@/components/auth/signup-form';

export default function TwoStepRegistration() {

  const [isRegistered, setIsRegistered] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   if (isRegistered) {
  //     router.push('/home-page');
  //   }
  // }, [isRegistered, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Create your account
          </h1>
          {/* SignUpForm receives a callback to update isRegistered */}
          <SignUpForm onRegistered={
            () => {
              setIsRegistered(true)
              router.push('/home-page')
              }
            } />
        </div>
    </div>
  );
}