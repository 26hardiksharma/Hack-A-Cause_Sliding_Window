'use client'
import { Search, Filter, Plus, MoreVertical, Shield, User, MapPin } from 'lucide-react';

export default function UsersPage() {
  return (
    <div className="flex flex-col h-full pb-8">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-72">
          <span className="absolute left-3 top-2.5 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 shadow-sm" placeholder="Search users by name or role..." type="text" />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Jurisdiction</th>
                <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Last Active</th>
                <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img alt="User" className="w-10 h-10 rounded-full object-cover" src="https://picsum.photos/seed/user1/100/100" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Rajesh Patil</p>
                      <p className="text-xs text-slate-500">rajesh.p@maharashtra.gov.in</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    <Shield className="w-3.5 h-3.5" /> DWO
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" /> Beed District
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-slate-500">Just now</td>
                <td className="py-4 px-6 text-right">
                  <button className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                      AK
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Amit Kumar</p>
                      <p className="text-xs text-slate-500">amit.k@maharashtra.gov.in</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    <User className="w-3.5 h-3.5" /> Block Manager
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" /> Parli Block
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-slate-500">2h ago</td>
                <td className="py-4 px-6 text-right">
                  <button className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img alt="User" className="w-10 h-10 rounded-full object-cover" src="https://picsum.photos/seed/user3/100/100" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Priya Sharma</p>
                      <p className="text-xs text-slate-500">priya.s@maharashtra.gov.in</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    <User className="w-3.5 h-3.5" /> Block Manager
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" /> Majalgaon Block
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Offline
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-slate-500">1d ago</td>
                <td className="py-4 px-6 text-right">
                  <button className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <p className="text-xs text-slate-500 font-medium">Showing 1 to 3 of 42 users</p>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-400 bg-slate-50 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
