"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, type AuthResponse } from "@/lib/api-client";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  return <Suspense fallback={<p className="p-8" role="status">Loading registration…</p>}><RegistrationForm /></Suspense>;
}

function RegistrationForm() {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(searchParams.get("role") === "doctor" ? "doctor" : "patient");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Register the user
      await apiClient.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      // 2. Automatically log them in after successful registration
      let data: AuthResponse;
      try {
        data = await apiClient.login(email, password);
      } catch {
        setError("Your account was created, but automatic sign-in failed. Please sign in using the link below.");
        return;
      }
      login(data.access_token, data.user);
      router.push(`/${data.user.role}/dashboard`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration could not be completed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError("Google did not return a sign-in credential. Please try again.");
      return;
    }
    try {
      setIsLoading(true);
      const data = await apiClient.post<AuthResponse>("/auth/google", {
        credential: credentialResponse.credential,
      });
      login(data.access_token, data.user);
      router.push(`/${data.user.role}/dashboard`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: "patient", label: "Patient" },
    { value: "doctor", label: "Doctor" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 relative">
        <Link 
          href="/" 
          className="absolute left-6 top-6 text-muted-foreground hover:text-primary transition flex items-center gap-1.5 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
        <div className="text-center mb-8 mt-4">
          <img
            src="/logo.svg"
            alt="RuralCare Logo"
            className="h-10 mx-auto mb-2 w-auto object-contain"
          />
          <p className="text-muted-foreground">Create your account</p>
        </div>

        {error && (
          <div role="alert" className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 mb-6">
          <Input
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <Input
            label="Password"
            type="password"
            minLength={12}
            maxLength={128}
            autoComplete="new-password"
            placeholder="At least 12 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <Select
            label="I am a..."
            options={roleOptions}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
          />
          <Button type="submit" fullWidth isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-surface text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Signup Failed")}
          />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in here
          </Link>
        </p>
      </Card>
    </div>
  );
}
