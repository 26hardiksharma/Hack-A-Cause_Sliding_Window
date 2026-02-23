"use client";
import { useState } from "react";
import { Droplets, Lock, Mail, Key, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/app/Components/auth/AuthContext";

export function LoginForm() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="bg-[#f6f6f8] dark:bg-[#101622] font-sans text-slate-900 dark:text-slate-100 antialiased h-screen w-full flex overflow-hidden absolute inset-0 z-50">
      {/* Left Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(19, 91, 236, 0.9) 0%, rgba(14, 69, 184, 0.8) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDR4YDicibWiK6Rfxa1elQMXsi-b-TUfoRKyo2efV6i1wU8tali-rTbYU-ymUjUO-gY6rS73gQ71h_ptHMN_4J2yz6YKt7L8fvsld8_jetEl2NhgUvs2IgBxEqRhP2-SVZs8xoNYCjke1rf91zgeHCO6HATsZMql6rpjxr2OYD9MMV1806zuECY_mO9nEaGBuVHu6cz6gtjuzW-2XCcoJgddeF6aCB5hedGaTTitfmEktRVHOdnmKLaXQYClcrxps17iNIRv_23i8w")',
        }}
      >
        <div className="flex items-center gap-3 z-10">
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/20">
            <Droplets className="text-white w-8 h-8" />
          </div>
          <p className="text-white font-bold text-lg tracking-wide uppercase opacity-90">
            AquaGov
          </p>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="mb-6">
            <svg
              className="text-white/40 w-16 h-16 transform rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
          <h1 className="text-white text-4xl font-bold leading-tight mb-4">
            Water Security &amp; Drought Governance
          </h1>
          <p className="text-white/80 text-lg font-normal leading-relaxed">
            Ensuring sustainable water access for every community through
            data-driven governance and transparent resource management.
          </p>
        </div>

        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#135bec]/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-white overflow-y-auto">
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
          <Droplets className="text-[#135bec] w-8 h-8" />
          <span className="text-slate-900 font-bold text-lg">AquaGov</span>
        </div>

        <div className="w-full max-w-[440px] flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="h-12 w-12 rounded-xl bg-[#135bec]/10 flex items-center justify-center mb-2 text-[#135bec]">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">
              Official Login
            </h2>
            <p className="text-slate-500 text-base">
              Please sign in with your government credentials.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Error Banner */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="email"
                className="text-slate-900 text-sm font-medium"
              >
                Official Email
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-slate-400 group-focus-within:text-[#135bec] transition-colors w-5 h-5" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@gov.water.dept"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 py-3 border-slate-200 focus:ring-2 focus:ring-[#135bec]/20 focus:border-[#135bec] text-base h-auto"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="password"
                className="text-slate-900 text-sm font-medium"
              >
                Password
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="text-slate-400 group-focus-within:text-[#135bec] transition-colors w-5 h-5" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-12 py-3 border-slate-200 focus:ring-2 focus:ring-[#135bec]/20 focus:border-[#135bec] text-base h-auto"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-[#135bec] focus:ring-[#135bec]/20"
                />
                <span className="text-sm text-slate-600">Remember Me</span>
              </label>
              <a
                href="#"
                className="text-sm font-medium text-[#135bec] hover:text-[#0e45b8] hover:underline transition-colors"
              >
                Forgot Password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#135bec] hover:bg-[#0e45b8] text-white font-medium py-3 h-auto shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span>{isLoading ? "Signing in…" : "Secure Login"}</span>
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </Button>
          </form>

          <div className="pt-2 text-center border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-[#135bec] hover:text-[#0e45b8] hover:underline transition-colors"
              >
                Request Access
              </Link>
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Not an admin?{" "}
              <Link
                href="/user-login"
                className="text-[#135bec] hover:text-[#0e45b8] hover:underline transition-colors"
              >
                User Login →
              </Link>
            </p>
          </div>

          <div className="mt-8 flex justify-center gap-6">
            <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
              <div className="h-6 w-6 bg-slate-400 rounded-full" />
              <span className="text-xs font-medium text-slate-800">
                Ministry of Water
              </span>
            </div>
            <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
              <div className="h-6 w-6 bg-slate-400 rounded-full" />
              <span className="text-xs font-medium text-slate-800">
                National Drought Relief
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
