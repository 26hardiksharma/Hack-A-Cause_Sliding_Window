import {
  Droplets,
  User,
  Badge,
  ShieldCheck,
  Briefcase,
  Fingerprint,
  MapPin,
  Mail,
  ArrowRight,
  Shield,
  CheckCircle,
  Clock,
  HelpCircle,
  Phone,
} from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="bg-[#f6f6f8] text-slate-900 font-sans min-h-screen flex flex-col w-full">
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded bg-[#135bec]/10 text-[#135bec]">
                <Droplets className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                AquaGov
              </span>
            </div>
            {/* Actions */}
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-block text-sm text-slate-500">
                Already verified?
              </span>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#135bec] rounded-lg hover:bg-[#0e45b8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#135bec] transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Section (8 cols) */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
              {/* Header Text */}
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Official Access Request
                </h1>
                <p className="text-slate-500">
                  Register for the Water Tanker Management System. All accounts
                  require manual verification.
                </p>
              </div>

              {/* Progress Stepper */}
              <div className="mb-10">
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-between">
                    {/* Step 1: Active */}
                    <div className="flex flex-col items-center group">
                      <span className="flex items-center justify-center w-10 h-10 bg-[#135bec] rounded-full ring-4 ring-[#f6f6f8] sm:ring-white">
                        <User className="text-white w-5 h-5" />
                      </span>
                      <span className="mt-2 text-sm font-semibold text-[#135bec]">
                        Personal Details
                      </span>
                    </div>

                    {/* Step 2: Pending */}
                    <div className="flex flex-col items-center group">
                      <span className="flex items-center justify-center w-10 h-10 bg-white border-2 border-slate-300 rounded-full ring-4 ring-[#f6f6f8] sm:ring-white">
                        <Badge className="text-slate-400 w-5 h-5" />
                      </span>
                      <span className="mt-2 text-sm font-medium text-slate-500">
                        Credentials
                      </span>
                    </div>

                    {/* Step 3: Pending */}
                    <div className="flex flex-col items-center group">
                      <span className="flex items-center justify-center w-10 h-10 bg-white border-22 border-slate-300 rounded-full ring-4 ring-[#f6f6f8] sm:ring-white">
                        <ShieldCheck className="text-slate-400 w-5 h-5" />
                      </span>
                      <span className="mt-2 text-sm font-medium text-slate-500">
                        Verification
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label
                      className="block text-sm font-medium text-slate-900"
                      htmlFor="fullname"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Badge className="text-slate-400 w-5 h-5" />
                      </div>
                      <input
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] sm:text-sm"
                        id="fullname"
                        placeholder="e.g. Rajesh Kumar"
                        required
                        type="text"
                      />
                    </div>
                  </div>

                  {/* Designation */}
                  <div className="space-y-1.5">
                    <label
                      className="block text-sm font-medium text-slate-900"
                      htmlFor="designation"
                    >
                      Designation
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="text-slate-400 w-5 h-5" />
                      </div>
                      <select
                        className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] sm:text-sm"
                        id="designation"
                        defaultValue=""
                      >
                        <option disabled value="">
                          Select Designation
                        </option>
                        <option>Sub-Divisional Officer</option>
                        <option>Junior Engineer</option>
                        <option>Block Development Officer</option>
                        <option>Collectorate Staff</option>
                      </select>
                    </div>
                  </div>

                  {/* Department ID */}
                  <div className="space-y-1.5">
                    <label
                      className="block text-sm font-medium text-slate-900"
                      htmlFor="deptId"
                    >
                      Department ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Fingerprint className="text-slate-400 w-5 h-5" />
                      </div>
                      <input
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] sm:text-sm"
                        id="deptId"
                        placeholder="e.g. WRD-2023-884"
                        type="text"
                      />
                    </div>
                  </div>

                  {/* District */}
                  <div className="space-y-1.5">
                    <label
                      className="block text-sm font-medium text-slate-900"
                      htmlFor="district"
                    >
                      District
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="text-slate-400 w-5 h-5" />
                      </div>
                      <select
                        className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] sm:text-sm"
                        id="district"
                        defaultValue=""
                      >
                        <option disabled value="">
                          Select District
                        </option>
                        <option>Ahmednagar</option>
                        <option>Beed</option>
                        <option>Latur</option>
                        <option>Osmanabad</option>
                      </select>
                    </div>
                  </div>

                  {/* Official Email */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label
                      className="block text-sm font-medium text-slate-900"
                      htmlFor="email"
                    >
                      Official Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="text-slate-400 w-5 h-5" />
                      </div>
                      <input
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] sm:text-sm"
                        id="email"
                        placeholder="e.g. name@department.gov.in"
                        type="email"
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Please use your official .gov.in or .nic.in email address.
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    className="text-sm font-medium cursor-pointer bg-slate-500 p-3 rounded-lg text-white transition-colors"
                    type="button"
                  >
                    Cancel Request
                  </button>
                  <button
                    className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#135bec] hover:bg-[#0e45b8] shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#135bec] transition-all"
                    type="button"
                  >
                    Continue to Credentials
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Sidebar Info (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Security Notice Card */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="hrink-0">
                  <Shield className="text-[#135bec] w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    Secure Verification Process
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    For security reasons, all new official accounts must be
                    manually verified by the District Collectorate
                    Administration.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-blue-200">
                <h4 className="text-xs font-semibold text-[#135bec] uppercase tracking-wider mb-2">
                  Process Timeline
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="text-green-600 w-4 h-4" />
                    <span>Submit Request Form</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700 ">
                    <Clock className="text-slate-400 w-4 h-4" />
                    <span>Admin Review (up to 24hrs)</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700 ">
                    <Mail className="text-slate-400 w-4 h-4" />
                    <span>Receive Credentials via Email</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                Help &amp; Support
              </h3>
              <div className="space-y-4">
                <Link
                  href="#"
                  className="flex items-center gap-3 text-sm text-slate-600 hover:text-[#135bec] transition-colors group"
                >
                  <HelpCircle className="text-slate-400 group-hover:text-[#135bec] transition-colors w-5 h-5" />
                  <span>Registration Guide PDF</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 text-sm text-slate-600 hover:text-[#135bec] transition-colors group"
                >
                  <Phone className="text-slate-400 group-hover:text-[#135bec] transition-colors w-5 h-5" />
                  <span>Contact District Helpdesk</span>
                </Link>
              </div>
            </div>

            {/* Decorative mini-map or context image */}
            <div className="hidden lg:block h-48 w-full rounded-xl overflow-hidden relative group">
              {/* @next/next/no-img-element rule warning typically ignored or allowed. Standard img tags used for demo external links without next.config.ts setup. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Abstract blue water ripples pattern representing resource management"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOJ3yXyiiddrlZmbQ3J378ZYsuAg9P18RvQOD-XG8gMZKmfmhjm8U_cwQPCW8uEWEf6IVsSZAr-xRPFX64qUmjoWuZfQEIWe9y_0aQFBYNmf2fsNXJek12SyCpKSnC-eZ1kVYC8L5COGYBR7ZJtKjZhvZtj7Xlw6Y2xQHkt4aJ1LIsMWQmsh86P_6n_0lK59_Q-6I9gpWY3_k2QFHeZ1k3dIvO_9yovL21ZfH7Y1GWZ6xLn8DXwx0ojXvXTEdC3qHMDtm-CC-GDh4"
              />
              <div className="absolute inset-0 bg-[#135bec]/20 mix-blend-multiply"></div>
              <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm">
                Water Resources Department
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 text-center sm:text-left">
            AquaGov. Government of India.
          </p>
          <div className="flex gap-4">
            <Link
              className="text-sm text-slate-500 hover:text-[#135bec]"
              href="#"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-sm text-slate-500 hover:text-[#135bec]"
              href="#"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
