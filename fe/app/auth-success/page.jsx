"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

const AuthSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const key = params.get('key'); 
    const email = params.get('email'); 

    localStorage.setItem('userEmail', email)
    console.log(email)

    if (token) {
      localStorage.setItem('token', token);

      if (key === 'true') {
        router.push(`/developer/login?token=${token}`);
      } else {
        router.push(`/developer/signup?token=${token}`);
      }
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-t-primary animate-spin rounded-full" />
          </div>
          <p className="text-center mt-4">Completing authentication...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthSuccess;
