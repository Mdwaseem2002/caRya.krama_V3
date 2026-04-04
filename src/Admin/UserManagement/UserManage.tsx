"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, UserPlus, UserCheck, UserX, Search, Filter, 
  MoreVertical, Eye, Shield, Trash2, X, Calendar, 
  Mail, ShoppingBag, Clock, ChevronRight, ShieldCheck,
  ShieldAlert, FileText, Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getAllUsers, 
  User, 
  toggleUserStatus, 
  toggleUserRole, 
  deleteUser 
} from "../DataSaver/UserStore";

export default function UserManage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "customer">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "blocked">("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    getAllUsers().then(setUsers).catch(console.error);
  }, []);

  const refreshUsers = async () => {
    const updatedUsers = await getAllUsers();
    setUsers(updatedUsers);
  };

  const handleToggleStatus = async (id: string) => {
    await toggleUserStatus(id);
    await refreshUsers();
    if (selectedUser?.id === id) {
      const updated = (await getAllUsers()).find(u => u.id === id);
      if (updated) setSelectedUser(updated);
    }
  };

  const handleToggleRole = async (id: string) => {
    await toggleUserRole(id);
    await refreshUsers();
    if (selectedUser?.id === id) {
      const updated = (await getAllUsers()).find(u => u.id === id);
      if (updated) setSelectedUser(updated);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
      await refreshUsers();
      setIsPanelOpen(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = users.length;
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const newUsers = users.filter(u => new Date(u.joinedDate) >= sevenDaysAgo).length;
    const payingUsers = users.filter(u => u.reportsPurchased.length > 0).length;
    const blockedUsers = users.filter(u => u.status === "blocked").length;

    return { total, newUsers, payingUsers, blockedUsers };
  }, [users]);

  return (
    <div className="space-y-8 relative">
      
      {/* ─── TOP STATS ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "New Users", value: `+${stats.newUsers}`, icon: UserPlus, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Paying Users", value: stats.payingUsers, icon: UserCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Blocked Users", value: stats.blockedUsers, icon: UserX, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-3`}>
              <stat.icon size={20} />
            </div>
            <div className="text-2xl font-black text-gray-900">{stat.value}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ─── SEARCH & FILTERS ─── */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-3">
          {/* Role Dropdown */}
          <div className="relative group">
            <div className="px-4 py-3 bg-gray-50 rounded-2xl text-sm font-bold text-gray-600 flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-all min-w-[140px] border border-transparent group-hover:border-gray-200">
               <Shield size={16} className="text-gray-400" />
               <span>{roleFilter === 'all' ? 'All Roles' : roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1) + 's'}</span>
            </div>
            <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
               <div className="bg-gray-100 px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Role</div>
               <div onClick={() => setRoleFilter('all')} className="px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors">All Roles</div>
               <div onClick={() => setRoleFilter('admin')} className="px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors">Admins</div>
               <div onClick={() => setRoleFilter('customer')} className="px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors">Customers</div>
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="relative group">
            <div className="px-4 py-3 bg-gray-50 rounded-2xl text-sm font-bold text-gray-600 flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-all min-w-[140px] border border-transparent group-hover:border-gray-200">
               <Activity size={16} className="text-gray-400" />
               <span>{statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
            </div>
            <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
               <div className="bg-gray-100 px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Status</div>
               <div onClick={() => setStatusFilter('all')} className="px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors">All Status</div>
               <div onClick={() => setStatusFilter('active')} className="px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors">Active</div>
               <div onClick={() => setStatusFilter('blocked')} className="px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors">Blocked</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── USERS TABLE ─── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Activity</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                        {user.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      user.role === 'admin' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-gray-50 text-gray-600 border border-gray-100'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold text-gray-600">{new Date(user.joinedDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag size={14} className="text-gray-400" />
                      <span className="text-xs font-bold text-gray-900">{user.reportsPurchased.length} Reports</span>
                    </div>
                    {user.reportsPurchased.length >= 3 && (
                      <div className="mt-1">
                        <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">Premium</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                     <span className={`flex items-center gap-1.5 text-[10px] font-bold ${user.status === 'active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`}></div>
                        {user.status.toUpperCase()}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setSelectedUser(user); setIsPanelOpen(true); }}
                        className="p-2 hover:bg-white hover:shadow-md rounded-xl text-gray-400 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(user.id)}
                        className={`p-2 hover:bg-white hover:shadow-md rounded-xl transition-all border border-transparent ${
                          user.status === 'active' ? 'text-gray-400 hover:text-rose-600 hover:border-rose-100' : 'text-rose-600 hover:text-emerald-600 hover:border-emerald-100'
                        }`}
                        title={user.status === 'active' ? "Block User" : "Unblock User"}
                      >
                        {user.status === 'active' ? <UserX size={18} /> : <UserCheck size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="py-20 text-center">
              <Users size={48} className="mx-auto text-gray-200 mb-4" />
              <div className="text-gray-500 font-bold">No users found matching your criteria</div>
            </div>
          )}
        </div>
      </div>

      {/* ─── USER DETAILS PANEL ─── */}
      <AnimatePresence>
        {isPanelOpen && selectedUser && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsPanelOpen(false)}
              className="fixed inset-0 glass-dark z-[100]"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">User Details</h2>
                  <button onClick={() => setIsPanelOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>

                {/* Profile Header */}
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-3xl mb-4 border-4 border-white shadow-xl">
                    {selectedUser.name[0]}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">{selectedUser.name}</h3>
                  <div className="text-sm font-medium text-gray-500 mb-4">{selectedUser.email}</div>
                  
                  <div className="flex gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      selectedUser.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {selectedUser.role}
                    </span>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      selectedUser.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-gray-500">
                        <Calendar size={18} />
                        <span className="text-sm font-bold">Joined Date</span>
                      </div>
                      <span className="text-sm font-black text-gray-900">{new Date(selectedUser.joinedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-gray-500">
                        <Clock size={18} />
                        <span className="text-sm font-bold">Last Active</span>
                      </div>
                      <span className="text-sm font-black text-gray-900">{new Date(selectedUser.lastActive).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-gray-500">
                        <ShoppingBag size={18} />
                        <span className="text-sm font-bold">Reports Bought</span>
                      </div>
                      <span className="text-sm font-black text-gray-900">{selectedUser.reportsPurchased.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-gray-500">
                        <ShieldCheck size={18} />
                        <span className="text-sm font-bold">Total Spend</span>
                      </div>
                      <span className="text-sm font-black text-blue-600">₹{selectedUser.totalSpend.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Purchase History */}
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Purchase History</h4>
                    <div className="space-y-3">
                      {selectedUser.reportsPurchased.length > 0 ? (
                        selectedUser.reportsPurchased.map(report => (
                          <div key={report.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                <FileText size={16} />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-gray-900">{report.carName}</div>
                                <div className="text-[10px] text-gray-400 font-medium">{report.purchaseDate}</div>
                              </div>
                            </div>
                            <div className="text-sm font-black text-gray-900">₹{report.amount}</div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                           <ShoppingBag size={24} className="mx-auto text-gray-300 mb-2" />
                           <div className="text-xs font-bold text-gray-400">No purchases yet</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Danger Zone Actions */}
                  <div className="pt-6 border-t border-gray-100 space-y-3">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Account Control</h4>
                    <button 
                      onClick={() => handleToggleRole(selectedUser.id)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-purple-50 rounded-2xl group transition-all"
                    >
                      <div className="flex items-center gap-3 text-gray-700">
                        <Shield className="group-hover:text-purple-600 transition-colors" size={18} />
                        <span className="text-sm font-bold">Toggle Admin Access</span>
                      </div>
                      <ChevronRight size={18} className="text-gray-300 group-hover:text-purple-300" />
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(selectedUser.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl group transition-all ${
                        selectedUser.status === 'active' ? 'bg-gray-50 hover:bg-rose-50' : 'bg-emerald-50 hover:bg-emerald-100'
                      }`}
                    >
                      <div className={`flex items-center gap-3 ${selectedUser.status === 'active' ? 'text-gray-700 group-hover:text-rose-600' : 'text-emerald-700'}`}>
                        {selectedUser.status === 'active' ? <UserX size={18} /> : <UserCheck size={18} />}
                        <span className="text-sm font-bold">{selectedUser.status === 'active' ? 'Block User Account' : 'Reactive Account'}</span>
                      </div>
                      {selectedUser.status === 'active' ? <ShieldAlert size={18} className="text-gray-300 group-hover:text-rose-300" /> : <ShieldCheck size={18} className="text-emerald-300" />}
                    </button>
                    <button 
                      onClick={() => handleDelete(selectedUser.id)}
                      className="w-full flex items-center justify-between p-4 bg-rose-50/50 hover:bg-rose-500 hover:text-white rounded-2xl group transition-all"
                    >
                      <div className="flex items-center gap-3 text-rose-600 group-hover:text-white">
                        <Trash2 size={18} />
                        <span className="text-sm font-bold">Permanently Delete</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
