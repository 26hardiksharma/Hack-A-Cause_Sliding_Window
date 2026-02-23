'use client';
import { Users } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const USERS = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.k@gov.in',
    avatar: 'https://picsum.photos/seed/user1/40/40',
    role: 'District Admin',
    roleClass: 'text-blue-600 bg-blue-50',
    region: 'All Talukas',
    status: 'Active',
    statusClass: 'text-emerald-600 bg-emerald-50',
  },
  {
    name: 'Priya Sharma',
    email: 'priya.s@gov.in',
    avatar: 'https://picsum.photos/seed/user2/40/40',
    role: 'Taluka Officer',
    roleClass: 'text-orange-600 bg-orange-50',
    region: 'Khamgaon',
    status: 'Active',
    statusClass: 'text-emerald-600 bg-emerald-50',
  },
  {
    name: 'Amit Patel',
    email: 'amit.p@gov.in',
    avatar: 'https://picsum.photos/seed/user3/40/40',
    role: 'Viewer',
    roleClass: 'text-slate-600 bg-slate-100',
    region: 'Selu',
    status: 'Inactive',
    statusClass: 'text-slate-500 bg-slate-100',
  },
];

export function UserAccessTab() {
  return (
    <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-800">User Access Management</h2>
          <p className="text-sm text-slate-500 mt-1">Manage users, roles, and their permissions.</p>
        </div>
        <Button className="bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 flex items-center gap-2">
          <Users className="w-4 h-4" /> Add User
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
              <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
              <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Region</th>
              <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {USERS.map((user) => (
              <tr key={user.email}>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <Image src={user.avatar} alt={user.name} width={32} height={32} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{user.name}</p>
                      <p className="text-[10px] text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${user.roleClass}`}>{user.role}</span>
                </td>
                <td className="py-4 text-sm text-slate-600">{user.region}</td>
                <td className="py-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${user.statusClass}`}>{user.status}</span>
                </td>
                <td className="py-4 text-right">
                  <Button variant="ghost" className="text-xs font-medium text-blue-600 hover:text-blue-700 h-auto p-0">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
