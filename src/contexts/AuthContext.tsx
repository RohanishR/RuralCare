"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  profile_image?: string;
  auth_provider: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = () => {
    Cookies.remove("access_token", { path: "/" });

    setUser(null);

    router.replace("/login");
  };

  const refetchUser = async () => {
    try {
      const userData = await apiClient.get<User>("/auth/me");
      setUser(userData);
    } catch {
      Cookies.remove("access_token", { path: "/" });
      setUser(null);
      router.replace("/login");
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get("access_token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const decoded: { exp?: number } = jwtDecode(token);

        if (!decoded.exp || decoded.exp * 1000 <= Date.now()) {
          Cookies.remove("access_token", { path: "/" });
          setUser(null);
          router.replace("/login");
          return;
        }

        await refetchUser();
      } catch {
        Cookies.remove("access_token", { path: "/" });
        setUser(null);
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (token: string, userData: User) => {
    Cookies.set("access_token", token, {
      expires: 1,
      path: "/",
      sameSite: "lax",
      secure: window.location.protocol === "https:",
    });

    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
