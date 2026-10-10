"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, type AuthResponse } from "@/lib/api-client";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await apiClient.login(email, password);
      login(data.access_token, data.user);
      router.push(`/${data.user.role}/dashboard`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred during login");
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
      setError(err instanceof Error ? err.message : "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

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
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLocalLogin} className="space-y-4 mb-6">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" fullWidth isLoading={isLoading}>
            Sign In
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
            onError={() => setError("Google Login Failed")}
          />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary hover:underline font-medium"
          >
            Register here
          </Link>
        </p>
      </Card>
    </div>
  );
}
