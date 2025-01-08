'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GithubIcon } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

const DeveloperSignUp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPhoneVerification, setShowPhoneVerification] = useState(true);
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const requestVerification = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      console.log(email)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/phone-auth/request-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone,
          role: 'developer',
          email: email || localStorage.getItem('userEmail') 
        })
      });
      if (!res.ok) throw new Error('Failed to send code');
      alert('Verification code sent!');
    } catch (error) {
      setError(error.message);
    }
  };
  
  const verifyCode = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      console.log(email)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/phone-auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          code: verificationCode,
          role: 'developer',
          email: email || localStorage.getItem('userEmail') 
        })
      });
      if (!res.ok) throw new Error('Invalid code');
      setIsPhoneVerified(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGitHubSignUp = () => {
    setLoading(true);
    const authUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/developer/auth/github/callback`;
    window.location.href = authUrl;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/developer/set-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to set password');
      }

      localStorage.setItem('token', token);
      router.push('/developer/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Set Your Password</CardTitle>
            <CardDescription>
              Please set a password to complete your account setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              {showPhoneVerification && (
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1234567890"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      {!isPhoneVerified && (
                        <Button 
                          onClick={requestVerification}
                          type="button"
                          className="w-full"
                        >
                          Send Code
                        </Button>
                      )}
                      {!isPhoneVerified && (
                        <div className="space-y-2">
                          <Label htmlFor="code">Verification Code</Label>
                          <Input
                            id="code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                          />
                          <Button 
                            onClick={verifyCode}
                            type="button"
                            className="w-full"
                          >
                            Verify Code
                          </Button>
                        </div>
                      )}
                    </form>
                  </CardContent>
                )}
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? "Setting up..." : "Complete Setup"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Sign Up as Developer</CardTitle>
          <CardDescription>
            Create your account to find exciting startup opportunities
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative w-full">
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                continue with
              </span>
            </div>
          </div>
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={handleGitHubSignUp}
            disabled={loading}
          >
            <GithubIcon className="mr-2 h-4 w-4" />
            {loading ? "Connecting..." : "Sign up with GitHub"}
          </Button>

          <div className="text-center text-sm">
            Have an account?{" "}
            <Link href="/developer/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>

        </CardFooter>
      </Card>
    </div>
  );
};

export default DeveloperSignUp;