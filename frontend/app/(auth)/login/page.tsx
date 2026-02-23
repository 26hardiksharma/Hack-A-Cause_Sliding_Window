import {
  Droplets,
  Quote,
  Lock,
  Mail,
  Key,
  Eye,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  return (
    <main className="bg-[#f6f6f8] dark:bg-[#101622] font-sans text-slate-900 dark:text-slate-100 antialiased h-screen w-full flex overflow-hidden absolute inset-0 z-50">
      {/* Left Panel: Branding & Mood */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(19, 91, 236, 0.9) 0%, rgba(14, 69, 184, 0.8) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDR4YDicibWiK6Rfxa1elQMXsi-b-TUfoRKyo2efV6i1wU8tali-rTbYU-ymUjUO-gY6rS73gQ71h_ptHMN_4J2yz6YKt7L8fvsld8_jetEl2NhgUvs2IgBxEqRhP2-SVZs8xoNYCjke1rf91zgeHCO6HATsZMql6rpjxr2OYD9MMV1806zuECY_mO9nEaGBuVHu6cz6gtjuzW-2XCcoJgddeF6aCB5hedGaTTitfmEktRVHOdnmKLaXQYClcrxps17iNIRv_23i8w")',
        }}
      >
        {/* Top Branding */}
        <div className="flex items-center gap-3 z-10">
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/20">
            <Droplets className="text-white w-8 h-8" />
          </div>
          <p className="text-white font-bold text-lg tracking-wide uppercase opacity-90">
            AquaGov
          </p>
        </div>

        {/* Center/Bottom Content */}
        <div className="relative z-10 max-w-lg">
          <div className="mb-6">
            <Quote className="text-white/40 w-16 h-16 transform rotate-180" />
          </div>
          <h1 className="text-white text-4xl font-bold leading-tight mb-4">
            Water Security &amp; Drought Governance
          </h1>
          <p className="text-white/80 text-lg font-normal leading-relaxed">
            Ensuring sustainable water access for every community through
            data-driven governance and transparent resource management.
          </p>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#135bec]/30 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-white overflow-y-auto ">
        {/* Mobile Branding (Only visible on small screens) */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
          <Droplets className="text-[#135bec] w-8 h-8" />
          <span className="text-slate-900 dark:text-white font-bold text-lg">
            AquaGov
          </span>
        </div>

        <div className=" w-full max-w-[440px] flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="h-12 w-12 rounded-xl bg-[#135bec]/10 flex items-center justify-center mb-2 text-[#135bec]">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 ">
              Official Login
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Please sign in with your government credentials.
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-5">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label
                className="text-slate-900 text-sm font-medium"
                htmlFor="email"
              >
                Official Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-slate-400 group-focus-within:text-[#135bec] transition-colors w-5 h-5" />
                </div>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135bec]/20 focus:border-[#135bec] transition-all text-base"
                  id="email"
                  placeholder="admin@gov.water.dept"
                  required
                  type="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label
                  className="text-slate-900 text-sm font-medium"
                  htmlFor="password"
                >
                  Password
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="text-slate-400 group-focus-within:text-[#135bec] transition-colors w-5 h-5" />
                </div>
                <input
                  className="w-full pl-10 pr-12 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135bec]/20 focus:border-[#135bec] transition-all text-base"
                  id="password"
                  placeholder="••••••••"
                  required
                  type="password"
                />
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  type="button"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  className="h-4 w-4 rounded border-slate-300 text-[#135bec] focus:ring-[#135bec]/20 dark:border-slate-600 dark:bg-slate-800"
                  type="checkbox"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Remember Me
                </span>
              </label>
              <a
                className="text-sm font-medium text-[#135bec] hover:text-[#0e45b8] hover:underline transition-colors"
                href="#"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              className="w-full bg-[#135bec] hover:bg-[#0e45b8] text-white font-medium py-3 px-4 rounded-lg shadow-sm shadow-blue-500/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
              type="submit"
            >
              <span>Secure Login</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Footer Links */}
          <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Don&apos;t have an account?
              <a
                className="font-medium text-[#135bec] hover:text-[#0e45b8] hover:underline transition-colors ml-1"
                href="#"
              >
                Request Access
              </a>
            </p>
          </div>
          <div className="mt-8 flex justify-center gap-6">
            <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
              <div className="h-6 w-6 bg-slate-400 rounded-full"></div>
              <span className="text-xs font-medium text-slate-800">
                Ministry of Water
              </span>
            </div>
            <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
              <div className="h-6 w-6 bg-slate-400 rounded-full"></div>
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
