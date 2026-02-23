'use client';
import { useState } from 'react';
import {
  Droplets, User, Badge, ShieldCheck, Briefcase,
  Fingerprint, MapPin, Mail, ArrowRight, Shield,
  CheckCircle, Clock, HelpCircle, Phone,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';

export function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [designation, setDesignation] = useState('');
  const [deptId, setDeptId] = useState('');
  const [district, setDistrict] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    try {
      const res = await api.auth.register({
        full_name: fullName,
        designation,
        department_id: deptId,
        district,
        email,
      });
      setSuccess(res.message || 'Registration submitted. Await admin approval.');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-[#f6f6f8] text-slate-900 font-sans min-h-screen flex flex-col w-full">
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded bg-[#135bec]/10 text-[#135bec]">
                <Droplets className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">AquaGov</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-block text-sm text-slate-500">Already verified?</span>
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

      {/* Main */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Official Access Request</h1>
                <p className="text-slate-500">Register for the Water Tanker Management System. All accounts require manual verification.</p>
              </div>

              {/* Stepper */}
              <div className="mb-10">
                <div className="relative">
                  <div aria-hidden="true" className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-between">
                    {[
                      { icon: User, label: 'Personal Details', active: true },
                      { icon: Badge, label: 'Credentials', active: false },
                      { icon: ShieldCheck, label: 'Verification', active: false },
                    ].map(({ icon: Icon, label, active }) => (
                      <div key={label} className="flex flex-col items-center">
                        <span className={`flex items-center justify-center w-10 h-10 rounded-full ring-4 ring-[#f6f6f8] sm:ring-white ${active ? 'bg-[#135bec]' : 'bg-white border-2 border-slate-300'}`}>
                          <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                        </span>
                        <span className={`mt-2 text-sm font-${active ? 'semibold text-[#135bec]' : 'medium text-slate-500'}`}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feedback */}
              {error && (
                <div className="mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-6 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
                  {success}
                </div>
              )}

              {/* Form Fields */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="fullname" className="text-sm font-medium text-slate-900">Full Name</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Badge className="text-slate-400 w-5 h-5" />
                      </div>
                      <Input
                        id="fullname"
                        placeholder="e.g. Rajesh Kumar"
                        required
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 border-slate-300 focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec]"
                      />
                    </div>
                  </div>

                  {/* Designation */}
                  <div className="space-y-1.5">
                    <Label htmlFor="designation" className="text-sm font-medium text-slate-900">Designation</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="text-slate-400 w-5 h-5" />
                      </div>
                      <select
                        id="designation"
                        required
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] sm:text-sm"
                      >
                        <option disabled value="">Select Designation</option>
                        <option>Sub-Divisional Officer</option>
                        <option>Junior Engineer</option>
                        <option>Block Development Officer</option>
                        <option>Collectorate Staff</option>
                      </select>
                    </div>
                  </div>

                  {/* Department ID */}
                  <div className="space-y-1.5">
                    <Label htmlFor="deptId" className="text-sm font-medium text-slate-900">Department ID</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Fingerprint className="text-slate-400 w-5 h-5" />
                      </div>
                      <Input
                        id="deptId"
                        placeholder="e.g. WRD-2023-884"
                        type="text"
                        value={deptId}
                        onChange={(e) => setDeptId(e.target.value)}
                        className="pl-10 border-slate-300 focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec]"
                      />
                    </div>
                  </div>

                  {/* District */}
                  <div className="space-y-1.5">
                    <Label htmlFor="district" className="text-sm font-medium text-slate-900">District</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="text-slate-400 w-5 h-5" />
                      </div>
                      <select
                        id="district"
                        required
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] sm:text-sm"
                      >
                        <option disabled value="">Select District</option>
                        <option>Ahmednagar</option>
                        <option>Beed</option>
                        <option>Latur</option>
                        <option>Osmanabad</option>
                      </select>
                    </div>
                  </div>

                  {/* Official Email */}
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-900">Official Email Address</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="text-slate-400 w-5 h-5" />
                      </div>
                      <Input
                        id="email"
                        placeholder="e.g. name@department.gov.in"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 border-slate-300 focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec]"
                      />
                    </div>
                    <p className="text-xs text-slate-500">Please use your official .gov.in or .nic.in email address.</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Button
                    type="button"
                    onClick={() => router.push('/login')}
                    className="bg-slate-500 hover:bg-slate-600 text-white text-sm font-medium"
                  >
                    Cancel Request
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto bg-[#135bec] hover:bg-[#0e45b8] text-white text-base font-medium flex items-center gap-2 disabled:opacity-60"
                  >
                    {isLoading ? 'Submitting…' : <>Continue to Credentials <ArrowRight className="w-4 h-4" /></>}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Shield className="text-[#135bec] w-8 h-8 flex-shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Secure Verification Process</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    For security reasons, all new official accounts must be manually verified by the District Collectorate Administration.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <h4 className="text-xs font-semibold text-[#135bec] uppercase tracking-wider mb-2">Process Timeline</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="text-green-600 w-4 h-4" /> Submit Request Form
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <Clock className="text-slate-400 w-4 h-4" /> Admin Review (up to 24hrs)
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <Mail className="text-slate-400 w-4 h-4" /> Receive Credentials via Email
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Help &amp; Support</h3>
              <div className="space-y-4">
                <Link href="#" className="flex items-center gap-3 text-sm text-slate-600 hover:text-[#135bec] transition-colors group">
                  <HelpCircle className="text-slate-400 group-hover:text-[#135bec] transition-colors w-5 h-5" />
                  <span>Registration Guide PDF</span>
                </Link>
                <Link href="#" className="flex items-center gap-3 text-sm text-slate-600 hover:text-[#135bec] transition-colors group">
                  <Phone className="text-slate-400 group-hover:text-[#135bec] transition-colors w-5 h-5" />
                  <span>Contact District Helpdesk</span>
                </Link>
              </div>
            </div>

            <div className="hidden lg:block h-48 w-full rounded-xl overflow-hidden relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Abstract blue water ripples pattern representing resource management"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOJ3yXyiiddrlZmbQ3J378ZYsuAg9P18RvQOD-XG8gMZKmfmhjm8U_cwQPCW8uEWEf6IVsSZAr-xRPFX64qUmjoWuZfQEIWe9y_0aQFBYNmf2fsNXJek12SyCpKSnC-eZ1kVYC8L5COGYBR7ZJtKjZhvZtj7Xlw6Y2xQHkt4aJ1LIsMWQmsh86P_6n_0lK59_Q-6I9gpWY3_k2QFHeZ1k3dIvO_9yovL21ZfH7Y1GWZ6xLn8DXwx0ojXvXTEdC3qHMDtm-CC-GDh4"
              />
              <div className="absolute inset-0 bg-[#135bec]/20 mix-blend-multiply" />
              <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm">
                Water Resources Department
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 text-center sm:text-left">AquaGov. Government of India.</p>
          <div className="flex gap-4">
            <Link className="text-sm text-slate-500 hover:text-[#135bec]" href="#">Privacy Policy</Link>
            <Link className="text-sm text-slate-500 hover:text-[#135bec]" href="#">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
