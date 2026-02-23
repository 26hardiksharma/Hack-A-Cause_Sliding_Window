"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/Components/auth/AuthContext";
import { ENABLE_AUTH, LOGIN_REDIRECT } from "@/lib/auth-config";

/**
 * Client-side auth guard for the dashboard route group.
 * Complements the server-side middleware – catches cases where
 * the token cookie exists but the context has since been cleared
 * (e.g. manual localStorage wipe), or when ENABLE_AUTH is toggled
 * at runtime without a middleware restart.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ENABLE_AUTH) return; // auth restriction is OFF – nothing to guard
    if (isLoading) return;    // still hydrating from localStorage

    if (!isAuthenticated) {
      router.replace(LOGIN_REDIRECT);
    }
  }, [isAuthenticated, isLoading, router]);

  // While loading or redirecting, render nothing (avoids flash of protected content).
  if (ENABLE_AUTH && (isLoading || !isAuthenticated)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f6f6f8]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading…</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
