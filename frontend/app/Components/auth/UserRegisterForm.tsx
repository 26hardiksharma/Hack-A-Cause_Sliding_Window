"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const DISTRICTS = [
  "North District",
  "South District",
  "Central Governance Zone",
  "East Zone",
  "West Zone",
  "Water Board HQ",
  "Ahmednagar",
  "Beed",
  "Latur",
  "Osmanabad",
];

export function UserRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="bg-white font-sans text-slate-900 antialiased min-h-screen flex flex-col lg:flex-row overflow-hidden absolute inset-0 z-50">
      {/* ── Left Panel: Branding ── */}
      <div className="relative w-full lg:w-5/12 xl:w-1/3 bg-[#101622] flex flex-col justify-between p-8 lg:p-12 text-white overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.08,
          }}
        />
        {/* Blue tint overlay */}
        <div className="absolute inset-0 bg-[#135bec]/20 pointer-events-none" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#101622] to-transparent pointer-events-none z-10" />
        {/* Topo SVG lines */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 100 100' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 100 Q 20 50 50 50 T 100 0' stroke='white' stroke-width='0.5' fill='none' /%3E%3Cpath d='M0 80 Q 30 40 60 60 T 100 20' stroke='white' stroke-width='0.5' fill='none' /%3E%3C/svg%3E")`,
            backgroundSize: "cover",
          }}
        />

        {/* Logo */}
        <div className="relative z-20 flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded bg-[#135bec] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-wide uppercase opacity-90">
            AquaGov
          </span>
        </div>

        {/* Tagline */}
        <div className="relative z-20 mt-auto mb-20 lg:mb-0">
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-4 text-white">
            Empowering
            <br />
            Water
            <br />
            Resilience
          </h1>
          <p className="text-lg text-slate-300 font-light max-w-md leading-relaxed">
            Secure access to the centralized Drought Governance &amp; Water
            Tanker Management System.
          </p>
        </div>

        {/* Footer text */}
        <div className="relative z-20 text-xs text-slate-500 font-medium tracking-wider uppercase mt-8 lg:mt-0">
          Official Government Portal © 2024
        </div>
      </div>

      {/* ── Right Panel: Register Form ── */}
      <div className="w-full lg:w-7/12 xl:w-2/3 bg-white flex flex-col justify-center items-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-[480px] py-10">
          {/* Tab toggle */}
          <div className="bg-[#f6f6f8] p-1.5 rounded-lg flex mb-8">
            {/* Login */}
            <Link
              href="/user-login"
              className="flex-1 py-2.5 text-center text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              Login
            </Link>
            {/* Create Account – active */}
            <button className="flex-1 py-2.5 text-center text-sm font-bold text-[#135bec] bg-white rounded shadow-sm border border-slate-200 transition-all">
              Create Account
            </button>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Register New Account
            </h2>
            <p className="text-slate-500">
              Enter your official details to request system access.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="reg-fullname"
                className="block text-sm font-medium text-slate-700"
              >
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#135bec] transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  id="reg-fullname"
                  type="text"
                  placeholder="e.g. Sarah Mitchell"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135bec]/20 focus:border-[#135bec] bg-white transition-all text-sm"
                />
              </div>
            </div>

            {/* Official ID */}
            <div className="space-y-1.5">
              <label
                htmlFor="reg-official-id"
                className="block text-sm font-medium text-slate-700"
              >
                Official ID / Badge No.
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#135bec] transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2"
                    />
                  </svg>
                </div>
                <input
                  id="reg-official-id"
                  type="text"
                  placeholder="GOV-ID-XXXX"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135bec]/20 focus:border-[#135bec] bg-white transition-all text-sm"
                />
              </div>
            </div>

            {/* Assigned District */}
            <div className="space-y-1.5">
              <label
                htmlFor="reg-district"
                className="block text-sm font-medium text-slate-700"
              >
                Assigned District
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#135bec] transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <select
                  id="reg-district"
                  defaultValue=""
                  className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#135bec]/20 focus:border-[#135bec] bg-white appearance-none transition-all text-sm"
                >
                  <option disabled value="">
                    Select District
                  </option>
                  {DISTRICTS.map((d) => (
                    <option
                      key={d}
                      value={d.toLowerCase().replace(/\s+/g, "_")}
                    >
                      {d}
                    </option>
                  ))}
                </select>
                {/* Chevron */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="reg-password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#135bec] transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className="block w-full pl-10 pr-12 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135bec]/20 focus:border-[#135bec] bg-white transition-all text-sm"
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

            {/* Terms */}
            <div className="flex items-start gap-3">
              <div className="flex h-5 items-center mt-0.5">
                <input
                  id="reg-terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-[#135bec] focus:ring-[#135bec]/20"
                />
              </div>
              <label
                htmlFor="reg-terms"
                className="text-sm font-medium text-slate-500"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="text-[#135bec] hover:text-[#0d43b3] underline decoration-1 underline-offset-2"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-[#135bec] hover:text-[#0d43b3] underline decoration-1 underline-offset-2"
                >
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-lg shadow-sm text-sm font-bold text-white bg-[#135bec] hover:bg-[#0d43b3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#135bec] transition-all"
            >
              Register Account
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-sm text-slate-400 uppercase tracking-wide font-medium">
                Or continue with
              </span>
            </div>
          </div>

          {/* SSO */}
          <button
            type="button"
            className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-slate-200 rounded-lg shadow-sm bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 transition-all"
          >
            <div className="w-5 h-5 bg-slate-800 rounded-full flex items-center justify-center text-white text-[10px] font-bold tracking-tighter">
              GOV
            </div>
            <span>Government SSO</span>
          </button>

          {/* Footer links */}
          <div className="mt-8 flex justify-center gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-slate-600 transition-colors">
              Help Center
            </a>
            <a href="#" className="hover:text-slate-600 transition-colors">
              Contact Support
            </a>
          </div>

          {/* Admin link */}
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-400">
              Government official?{" "}
              <Link
                href="/register"
                className="text-[#135bec] hover:text-[#0d43b3] font-medium hover:underline transition-colors"
              >
                Admin Registration →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
