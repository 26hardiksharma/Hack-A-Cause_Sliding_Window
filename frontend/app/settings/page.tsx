'use client'
import { useState } from 'react';
import { Shield, Sliders, Bell, Database, Users, Settings as SettingsIcon, Save } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('thresholds');

  return (
    <div className="grid grid-cols-12 gap-6 h-full pb-8">
      {/* Sidebar Navigation */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-2">
        <button 
          onClick={() => setActiveTab('thresholds')}
          className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-bold transition-colors ${activeTab === 'thresholds' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}
        >
          <Sliders className="w-5 h-5" />
          VWSI Thresholds
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-bold transition-colors ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}
        >
          <Users className="w-5 h-5" />
          User Access
        </button>
        <button 
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-bold transition-colors ${activeTab === 'notifications' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}
        >
          <Bell className="w-5 h-5" />
          Notifications
        </button>
        <button 
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-bold transition-colors ${activeTab === 'system' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}
        >
          <SettingsIcon className="w-5 h-5" />
          System Preferences
        </button>
      </div>

      {/* Main Content Area */}
      <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
        
        {/* Thresholds Tab */}
        {activeTab === 'thresholds' && (
          <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-800">VWSI Threshold Configuration</h2>
                <p className="text-sm text-slate-500 mt-1">Define the index ranges that trigger different drought severity levels.</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>

            <div className="space-y-8">
              {/* Normal */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div> Normal
                  </label>
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">0.00 - 0.25</span>
                </div>
                <input type="range" min="0" max="100" defaultValue="25" className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>0.00</span>
                  <span>1.00</span>
                </div>
              </div>

              {/* Moderate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div> Moderate
                  </label>
                  <span className="text-sm font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg">0.26 - 0.45</span>
                </div>
                <input type="range" min="0" max="100" defaultValue="45" className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>0.00</span>
                  <span>1.00</span>
                </div>
              </div>

              {/* High */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div> High
                  </label>
                  <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">0.46 - 0.60</span>
                </div>
                <input type="range" min="0" max="100" defaultValue="60" className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>0.00</span>
                  <span>1.00</span>
                </div>
              </div>

              {/* Critical */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div> Critical
                  </label>
                  <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">&gt; 0.60</span>
                </div>
                <input type="range" min="0" max="100" defaultValue="100" className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-500" />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>0.00</span>
                  <span>1.00</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-800">User Access Management</h2>
                <p className="text-sm text-slate-500 mt-1">Manage users, roles, and their permissions.</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Users className="w-4 h-4" /> Add User
              </button>
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
                  <tr>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src="https://picsum.photos/seed/user1/40/40" alt="User" className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="text-sm font-bold text-slate-800">Rajesh Kumar</p>
                          <p className="text-[10px] text-slate-500">rajesh.k@gov.in</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4"><span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">District Admin</span></td>
                    <td className="py-4 text-sm text-slate-600">All Talukas</td>
                    <td className="py-4"><span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Active</span></td>
                    <td className="py-4 text-right"><button className="text-xs font-medium text-blue-600 hover:text-blue-700">Edit</button></td>
                  </tr>
                  <tr>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src="https://picsum.photos/seed/user2/40/40" alt="User" className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="text-sm font-bold text-slate-800">Priya Sharma</p>
                          <p className="text-[10px] text-slate-500">priya.s@gov.in</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4"><span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">Taluka Officer</span></td>
                    <td className="py-4 text-sm text-slate-600">Khamgaon</td>
                    <td className="py-4"><span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Active</span></td>
                    <td className="py-4 text-right"><button className="text-xs font-medium text-blue-600 hover:text-blue-700">Edit</button></td>
                  </tr>
                  <tr>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src="https://picsum.photos/seed/user3/40/40" alt="User" className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="text-sm font-bold text-slate-800">Amit Patel</p>
                          <p className="text-[10px] text-slate-500">amit.p@gov.in</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4"><span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">Viewer</span></td>
                    <td className="py-4 text-sm text-slate-600">Selu</td>
                    <td className="py-4"><span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">Inactive</span></td>
                    <td className="py-4 text-right"><button className="text-xs font-medium text-blue-600 hover:text-blue-700">Edit</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other tabs can be implemented similarly */}
        {(activeTab === 'notifications' || activeTab === 'system') && (
          <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <SettingsIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800">Coming Soon</h3>
              <p className="text-sm text-slate-500 mt-2">This configuration section is under development.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
