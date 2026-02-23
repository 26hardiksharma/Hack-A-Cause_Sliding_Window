"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { api, type AuthUser } from "@/lib/api";
import { AUTH_COOKIE, POST_LOGIN_REDIRECT } from "@/lib/auth-config";

// ── Storage helpers ──────────────────────────────────────────────────────────

function setToken(token: string) {
  // Store in both cookie (for middleware) and localStorage (for client reads)
  document.cookie = `${AUTH_COOKIE}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  localStorage.setItem(AUTH_COOKIE, token);
}

function clearToken() {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
  localStorage.removeItem(AUTH_COOKIE);
  localStorage.removeItem("aquagov_user");
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_COOKIE);
}

function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("aquagov_user");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

// ── Context types ─────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Admin / official login */
  login: (email: string, password: string) => Promise<void>;
  /** End-user login */
  userLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();
    if (storedToken && storedUser) {
      setTokenState(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const handleLoginResponse = useCallback(
    (token: string, user: AuthUser) => {
      setToken(token);
      localStorage.setItem("aquagov_user", JSON.stringify(user));
      setTokenState(token);
      setUser(user);
      router.push(POST_LOGIN_REDIRECT);
    },
    [router]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.auth.login({ email, password });
      handleLoginResponse(res.token, res.user);
    },
    [handleLoginResponse]
  );

  const userLogin = useCallback(
    async (email: string, password: string) => {
      const res = await api.auth.userLogin({ email, password });
      handleLoginResponse(res.token, res.user);
    },
    [handleLoginResponse]
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setTokenState(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        userLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
