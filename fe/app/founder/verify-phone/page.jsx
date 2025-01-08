"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PhoneVerification() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requestVerification = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/phone-auth/request-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          role: "founder",
          email: localStorage.getItem("founderEmail") 
        })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send verification code");
      }
      
      setIsCodeSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/phone-auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          code: verificationCode,
          role: "founder",
          email: localStorage.getItem("founderEmail")
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Invalid verification code");
      }

      // Clear stored email and redirect to dashboard
      localStorage.removeItem("founderEmail");
      router.push("/founder/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Phone Verification</CardTitle>
          <CardDescription>
            {!isCodeSent 
              ? "Please enter your phone number to receive a verification code" 
              : "Enter the verification code sent to your phone"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {!isCodeSent ? (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                />
                <Button
                  variant="link"
                  className="px-0"
                  onClick={requestVerification}
                  disabled={loading}
                >
                  Resend Code
                </Button>
              </div>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={isCodeSent ? verifyCode : requestVerification}
            disabled={loading || (!isCodeSent && !phone) || (isCodeSent && !verificationCode)}
          >
            {loading 
              ? "Processing..." 
              : isCodeSent 
                ? "Verify Code" 
                : "Send Code"
            }
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}