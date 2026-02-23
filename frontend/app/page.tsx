"use client";

import Link from "next/link";
import {
  Droplets,
  RefreshCw,
  PieChart,
  MapPin,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f6f6f8] font-sans text-slate-900 antialiased overflow-x-hidden">
      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 md:px-10 max-w-[1280px] mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-lg bg-[#135bec]/10 p-1.5 text-[#135bec]">
              <Droplets className="w-5 h-5" />
            </div>
            <span className="text-slate-900 text-lg font-bold tracking-tight">
              DroughtGov
            </span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-slate-600 hover:text-[#135bec] text-sm font-medium transition-colors"
            >
              Features
            </a>
            <a
              href="#impact"
              className="text-slate-600 hover:text-[#135bec] text-sm font-medium transition-colors"
            >
              Impact
            </a>
            <a
              href="#resources"
              className="text-slate-600 hover:text-[#135bec] text-sm font-medium transition-colors"
            >
              Resources
            </a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:block text-slate-900 text-sm font-medium hover:text-[#135bec] transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="flex items-center justify-center rounded-lg bg-[#135bec] px-4 py-2 text-sm font-bold text-white transition-all hover:bg-[#0f4bc4] shadow-sm hover:shadow-md"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* ── Hero ── */}
        <section className="relative w-full h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden bg-slate-900">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-slate-800/60 z-10" />
            {/* Subtle grid pattern */}
            <div
              className="w-full h-full opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 35%, #135bec 0%, transparent 55%),
                                  radial-gradient(circle at 75% 65%, #0ea5e9 0%, transparent 55%)`,
              }}
            />
          </div>

          <div className="relative z-20 container mx-auto px-4 text-center">
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-white tracking-wide uppercase">
                Live District Monitoring
              </span>
            </div>

            <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6 max-w-4xl mx-auto drop-shadow-sm">
              Data-Driven <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                Drought Mitigation
              </span>
            </h1>

            <p className="text-slate-200 text-lg md:text-xl font-normal max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-sm">
              Centralized governance for water tanker management and resource
              allocation. Visualize deficits, track fleets, and optimize
              distribution in real-time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="h-12 px-8 rounded-lg bg-[#135bec] text-white font-bold text-base hover:bg-[#0f4bc4] transition-all shadow-lg shadow-blue-900/20 w-full sm:w-auto flex items-center justify-center gap-2"
              >
                View Live Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="h-12 px-8 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-base hover:bg-white/20 transition-all w-full sm:w-auto">
                Watch System Tour
              </button>
            </div>
          </div>
        </section>

        {/* ── Operational Intelligence ── */}
        <section className="py-20 md:py-28 px-4 bg-[#f6f6f8]" id="features">
          <div className="max-w-[1280px] mx-auto">
            {/* Section header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="max-w-2xl">
                <p className="text-[#135bec] font-bold tracking-wider uppercase text-sm mb-2">
                  Operational Intelligence
                </p>
                <h2 className="text-slate-900 text-3xl md:text-5xl font-bold leading-tight">
                  Real-Time Governance
                </h2>
                <p className="mt-4 text-slate-600 text-lg">
                  Monitor allocation accuracy, track tanker fleets, and manage
                  approvals efficiently with our modular dashboard widgets
                  designed for rapid decision-making.
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 text-slate-500">
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Last updated: Just now
                </span>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Card 1 – Allocation Accuracy */}
              <div className="group bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-2 bg-blue-50 rounded-lg text-[#135bec]">
                    <PieChart className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                    +2.4% vs last week
                  </span>
                </div>
                <div className="relative h-48 w-full bg-slate-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {/* Donut chart visual */}
                  <div className="w-32 h-32 rounded-full border-8 border-slate-200 border-t-[#135bec] border-r-[#135bec] rotate-45" />
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold text-slate-900">
                      85%
                    </span>
                    <span className="text-xs text-slate-500">Efficiency</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Allocation Accuracy
                </h3>
                <p className="text-sm text-slate-500">
                  Visualizing resource distribution efficiency across all zones.
                </p>
              </div>

              {/* Card 2 – Real-time Tanker GPS */}
              <div className="group bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-2 bg-blue-50 rounded-lg text-[#135bec]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-slate-500">
                      Live
                    </span>
                  </div>
                </div>
                <div
                  className="relative h-48 w-full bg-slate-100 rounded-lg mb-4 overflow-hidden"
                  style={{
                    backgroundImage: `linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)`,
                  }}
                >
                  <div className="absolute inset-0 bg-blue-900/5" />
                  {/* Tanker dots */}
                  <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-[#135bec] border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute top-1/3 left-2/3 w-3 h-3 bg-[#135bec] border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute bottom-1/3 left-1/2 w-2.5 h-2.5 bg-sky-400 border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2" />
                  {/* Grid lines */}
                  <svg
                    className="absolute inset-0 w-full h-full opacity-20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern
                        id="grid"
                        width="24"
                        height="24"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 24 0 L 0 0 0 24"
                          fill="none"
                          stroke="#135bec"
                          strokeWidth="0.5"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Real-time Tanker GPS
                </h3>
                <p className="text-sm text-slate-500">
                  Live tracking of 145 active water tanker movements.
                </p>
              </div>

              {/* Card 3 – Approval Workflow */}
              <div className="group bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-2 bg-blue-50 rounded-lg text-[#135bec]">
                    <ClipboardCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    12 Pending
                  </span>
                </div>
                <div className="h-48 w-full bg-white rounded-lg mb-4 flex flex-col gap-2 overflow-hidden">
                  {[
                    {
                      id: "W2",
                      color: "bg-orange-100 text-orange-600",
                      name: "Ward 24 Request",
                      sub: "High Priority • Water Deficit",
                    },
                    {
                      id: "N5",
                      color: "bg-blue-100 text-blue-600",
                      name: "North Zone Supply",
                      sub: "Standard • Routine Check",
                    },
                    {
                      id: "S1",
                      color: "bg-purple-100 text-purple-600",
                      name: "South Zone Audit",
                      sub: "Low Priority • Scheduled",
                      faded: true,
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-2 rounded border border-slate-100 ${item.faded ? "opacity-60" : ""}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-xs font-bold`}
                      >
                        {item.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {item.sub}
                        </p>
                      </div>
                      <button className="text-[#135bec] text-xs font-bold hover:text-[#0f4bc4] transition-colors">
                        Review
                      </button>
                    </div>
                  ))}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Approval Workflow
                </h3>
                <p className="text-sm text-slate-500">
                  Streamlined administrative processing for requests.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Impact In Numbers ── */}
        <section
          className="py-16 bg-white border-y border-slate-100"
          id="impact"
        >
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center items-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
              {[
                { value: "15M+", label: "Litres Delivered" },
                { value: "1,200", label: "Villages Protected" },
                { value: "30%", label: "Cost Reduction" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center px-4 w-full md:w-auto pt-6 md:pt-0"
                >
                  <p className="text-5xl md:text-6xl font-black text-[#135bec] tracking-tight mb-2">
                    {stat.value}
                  </p>
                  <p className="text-lg font-medium text-slate-600">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA / Demo Form ── */}
        <section className="py-20 px-4 bg-[#f6f6f8]">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="flex flex-col md:flex-row">
              {/* Left info panel */}
              <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center bg-slate-50">
                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#135bec]/10 text-[#135bec]">
                  {/* Envelope icon via SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                  Transform your district's water governance.
                </h2>
                <p className="text-slate-600 mb-8">
                  Schedule a personalized demo to see how DroughtGov can
                  optimize your resource allocation and fleet management.
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>No credit card</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Instant access</span>
                  </div>
                </div>
              </div>

              {/* Right form panel */}
              <div className="p-8 md:p-12 md:w-1/2 bg-white">
                <form className="flex flex-col gap-5">
                  <div>
                    <label
                      htmlFor="demo-name"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      id="demo-name"
                      type="text"
                      placeholder="John Doe"
                      className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 shadow-sm focus:border-[#135bec] focus:ring-2 focus:ring-[#135bec]/20 px-4 py-2.5 text-sm outline-none transition"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="demo-dept"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Department / Agency
                    </label>
                    <input
                      id="demo-dept"
                      type="text"
                      placeholder="Ministry of Water Resources"
                      className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 shadow-sm focus:border-[#135bec] focus:ring-2 focus:ring-[#135bec]/20 px-4 py-2.5 text-sm outline-none transition"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="demo-email"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Official Email
                    </label>
                    <input
                      id="demo-email"
                      type="email"
                      placeholder="john@gov.in"
                      className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 shadow-sm focus:border-[#135bec] focus:ring-2 focus:ring-[#135bec]/20 px-4 py-2.5 text-sm outline-none transition"
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-2 w-full flex justify-center items-center rounded-lg bg-[#135bec] px-4 py-3 text-base font-bold text-white transition-all hover:bg-[#0f4bc4] shadow-md hover:shadow-lg"
                  >
                    Request System Demo
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="px-4 md:px-10 max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-900">
            <Droplets className="w-5 h-5 text-[#135bec]" />
            <span className="font-bold text-lg">DroughtGov</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-[#135bec] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#135bec] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-[#135bec] transition-colors">
              Contact Support
            </a>
          </div>
          <p className="text-sm text-slate-400">
            © 2024 DroughtGov. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
