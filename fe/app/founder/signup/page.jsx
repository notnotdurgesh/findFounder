"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FounderSignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    startupName: "",
    startupIdea: "",
    stage: "",
    requirements: "",
    benefits: "",
    phone: '',
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStageChange = (value) => {
    setFormData({ ...formData, stage: value });
  };

  const handleSubmit = async (e) => {
    console.log("submit clicked for Sign Up")
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/founder/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          startupStage: formData.stage,
          technicalRequirements: formData.requirements,
          benefitsForCoFounder: formData.benefits,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register");
      }
      localStorage.setItem("founderEmail", formData.email);

      alert("Signup successful! Redirecting to verification...");
      router.push("/founder/verify-phone");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Sign Up as Founder</CardTitle>
          <CardDescription>Create your account to find your perfect technical co-founder</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Your full name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="Your email address" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Choose a strong password" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="startupName">Startup Name</Label>
                <Input id="startupName" name="startupName" placeholder="Your startup's name" value={formData.startupName} onChange={handleChange} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="startupIdea">Startup Idea</Label>
                <Textarea id="startupIdea" name="startupIdea" placeholder="Describe your startup idea" value={formData.startupIdea} onChange={handleChange} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="stage">Startup Stage</Label>
                <Select onValueChange={handleStageChange}>
                  <SelectTrigger id="stage">
                    <SelectValue placeholder="Select your startup's current stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Idea Stage</SelectItem>
                    <SelectItem value="mvp">MVP</SelectItem>
                    <SelectItem value="early-stage">Early Stage</SelectItem>
                    <SelectItem value="growth">Growth Stage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="requirements">Technical Requirements</Label>
                <Textarea id="requirements" name="requirements" placeholder="What technical skills are you looking for in a co-founder?" value={formData.requirements} onChange={handleChange} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="benefits">Benefits for Co-Founder</Label>
                <Textarea id="benefits" name="benefits" placeholder="What can you offer to your potential co-founder? (e.g., equity, salary, etc.)" value={formData.benefits} onChange={handleChange} required />
              </div>
            </div>
            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={loading} onClick = {handleSubmit}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
