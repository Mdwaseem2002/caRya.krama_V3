"use client";

import React, { useState } from "react";
import { 
  User, Mail, Phone, Lock, Camera, MapPin, Save, ArrowLeft, Shield, 
  Settings, Building2, Bell, AlertTriangle, Activity, X, Check, FileText, CheckCircle2, ChevronDown, ListChecks, LogOut, Trash2, Clock, CheckSquare, Square
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Toggles for forms
const Toggle = ({ enabled, onChange, label }: { enabled: boolean; onChange: () => void; label: string }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-sm font-bold text-gray-700">{label}</span>
    <button 
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-[#0059A3]' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

// Checkboxes for forms
const CheckboxRow = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
  <label className="flex items-center gap-3 py-2 cursor-pointer group">
    <div className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-colors ${checked ? 'bg-[#0059A3] border-[#0059A3]' : 'border-gray-300 group-hover:border-[#0059A3]'}`}>
      {checked && <Check className="w-3.5 h-3.5 text-white" />}
    </div>
    <span className="text-sm font-bold text-gray-700 select-none">{label}</span>
  </label>
);

export default function EditAdminProfile() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();

  // State
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: user?.name || "Zuhaib Admin",
    email: user?.email || "admin@caryakrama.com",
    phone: user?.phone || "+971 50 123 4567",
    profilePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    
    // Step 2: Account Settings
    username: "zuhaib_root",
    twoFactor: true,
    
    // Step 3: Role & Permissions
    role: "Super Admin", // Super Admin, Admin, Manager
    permissions: {
      uploadCars: true,
      editCars: true,
      deleteCars: false,
      manageReports: true,
      viewPayments: true,
    },
    
    // Step 4: Business Info
    companyName: "caRya.krama Dealers",
    companyLogo: "https://ui-avatars.com/api/?name=caRya&background=0059A3&color=fff&rounded=true",
    supportEmail: "support@caryakrama.com",
    contactNumber: "+971 4 123 4567",
    address: "Dubai Motor City, UAE",
    
    // Step 5: Notifications
    notifyUploads: true,
    notifyPayments: true,
    notifyReports: false,
    notifySignups: true,
  });

  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [passForm, setPassForm] = useState({ current: "", new: "", confirm: "" });

  const handleSave = () => {
    // Save logic
    alert("Profile structure saved successfully!");
  };

  const SectionCard = ({ icon: Icon, title, desc, children }: any) => (
    <div className="bg-white rounded-2xl md:rounded-[24px] shadow-sm border border-gray-100 p-6 md:p-8 mb-6 overflow-hidden">
      <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-50">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-[#0059A3]" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">{desc}</p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-inter text-gray-900 selection:bg-[#0059A3] selection:text-white">
      
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-[40] px-4 md:px-8 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-sm font-bold text-[#0059A3] hover:bg-blue-50 px-3 py-2 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div className="text-sm font-bold bg-green-50 text-green-600 px-3 py-1.5 rounded-full flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> System Synced
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-8">
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Configure Profile</h1>
          <p className="text-gray-500 font-medium">Manage your administrative identity, roles, and system preferences.</p>
        </div>

        {/* STEP 1: BASIC INFO */}
        <SectionCard icon={User} title="Basic Information" desc="Your personal details and public profile picture.">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Photo */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32 rounded-full ring-4 ring-gray-50 overflow-hidden bg-gray-100 group">
                <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white mb-1" />
                  <span className="text-[10px] text-white font-bold uppercase tracking-wider">Change</span>
                </div>
              </div>
            </div>
            {/* Right: Fields */}
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0059A3]/20 focus:border-[#0059A3] outline-none transition-all font-bold text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-gray-600"
                    readOnly
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded">VERIFIED</span>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="tel" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0059A3]/20 focus:border-[#0059A3] outline-none transition-all font-bold text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* STEP 2: ACCOUNT SETTINGS */}
        <SectionCard icon={Shield} title="Account Settings" desc="Security and login credentials.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={formData.username} 
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0059A3]/20 focus:border-[#0059A3] outline-none transition-all font-bold text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                <button 
                  onClick={() => setPasswordModalOpen(true)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors font-medium text-left flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2 text-gray-700"><Lock className="w-4 h-4 text-gray-400" /> ••••••••••••</span>
                  <span className="text-xs font-bold text-[#0059A3] group-hover:underline">Change Password</span>
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-center transition-all hover:shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                   <Shield className="w-4 h-4 text-[#0059A3]" />
                </div>
                <h4 className="font-extrabold text-gray-900 text-lg">Two-Factor Authentication</h4>
              </div>
              <p className="text-sm text-gray-500 font-medium mb-5 leading-relaxed">Add an extra layer of security to your account by requiring an OTP.</p>
              <Toggle 
                label="Enable 2FA via Email" 
                enabled={formData.twoFactor} 
                onChange={() => setFormData({...formData, twoFactor: !formData.twoFactor})} 
              />
            </div>
          </div>
        </SectionCard>

        {/* STEP 3: ROLE & PERMISSIONS */}
        <SectionCard icon={ListChecks} title="Role & Permissions" desc="Determine your access level across the platform.">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 space-y-2">
               <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Designated Role</label>
               <div className="relative">
                 <select 
                   value={formData.role} 
                   onChange={e => setFormData({...formData, role: e.target.value})}
                   className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none font-bold text-[#0059A3] outline-none hover:bg-white focus:ring-2 focus:ring-[#0059A3]/20 focus:border-[#0059A3] transition-all cursor-pointer"
                 >
                   <option value="Super Admin">Super Admin</option>
                   <option value="Admin">Admin</option>
                   <option value="Manager">Manager</option>
                 </select>
                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
               </div>
               
               <div className="mt-4 bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <h5 className="flex items-center gap-2 text-sm font-bold text-amber-900 mb-1">
                    <AlertTriangle className="w-4 h-4" /> Role Notice
                  </h5>
                  <p className="text-xs font-semibold text-amber-700 leading-relaxed">
                    Based on your assigned role, some permissions might be strictly enforced and unchangeable.
                  </p>
               </div>
            </div>

            <div className="w-full md:w-2/3">
               <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">Module Permissions</label>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
                  <CheckboxRow label="Upload Cars" checked={formData.permissions.uploadCars} onChange={() => setFormData({...formData, permissions: {...formData.permissions, uploadCars: !formData.permissions.uploadCars}})} />
                  <CheckboxRow label="Edit Cars" checked={formData.permissions.editCars} onChange={() => setFormData({...formData, permissions: {...formData.permissions, editCars: !formData.permissions.editCars}})} />
                  <CheckboxRow label="Delete Cars" checked={formData.permissions.deleteCars} onChange={() => setFormData({...formData, permissions: {...formData.permissions, deleteCars: !formData.permissions.deleteCars}})} />
                  <CheckboxRow label="Manage Reports" checked={formData.permissions.manageReports} onChange={() => setFormData({...formData, permissions: {...formData.permissions, manageReports: !formData.permissions.manageReports}})} />
                  <CheckboxRow label="View Payments" checked={formData.permissions.viewPayments} onChange={() => setFormData({...formData, permissions: {...formData.permissions, viewPayments: !formData.permissions.viewPayments}})} />
               </div>
            </div>
          </div>
        </SectionCard>

        {/* STEP 4: BUSINESS INFO */}
        <SectionCard icon={Building2} title="Business Info" desc="Company details used in reports and footers.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 flex items-center gap-5 bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-2">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0 group">
                <img src={formData.companyLogo} alt="Logo" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex-grow">
                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Company Name</label>
                 <input 
                    type="text" 
                    value={formData.companyName} 
                    onChange={e => setFormData({...formData, companyName: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none font-bold focus:ring-2 focus:ring-[#0059A3]/20 focus:border-[#0059A3]"
                  />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Support Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={formData.supportEmail} onChange={e => setFormData({...formData, supportEmail: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#0059A3]/20 focus:border-[#0059A3] font-bold" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#0059A3]/20 focus:border-[#0059A3] font-bold" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Official Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#0059A3]/20 focus:border-[#0059A3] font-bold" />
              </div>
            </div>
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* STEP 5: NOTIFICATIONS SETTINGS */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-[#0059A3]" />
                 </div>
                 <h3 className="text-xl font-black text-gray-900">Notifications</h3>
              </div>
              <div className="flex-grow bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1">
                  <Toggle label="New Car Uploaded" enabled={formData.notifyUploads} onChange={() => setFormData({...formData, notifyUploads: !formData.notifyUploads})} />
                  <Toggle label="New Payment Received" enabled={formData.notifyPayments} onChange={() => setFormData({...formData, notifyPayments: !formData.notifyPayments})} />
                  <Toggle label="Report Downloaded" enabled={formData.notifyReports} onChange={() => setFormData({...formData, notifyReports: !formData.notifyReports})} />
                  <Toggle label="User Signup" enabled={formData.notifySignups} onChange={() => setFormData({...formData, notifySignups: !formData.notifySignups})} />
              </div>
            </div>

            {/* BONUS: ACTIVITY LOG & DANGER ZONE */}
            <div className="flex flex-col gap-6">
               {/* Activity Log */}
               <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 h-full">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                       <Activity className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900">Activity Log</h3>
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 text-gray-500"><Clock className="w-4 h-4" /> <span className="text-sm font-semibold">Last Login</span></div>
                       <span className="text-sm font-bold text-gray-900">Today, 10:42 AM</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                       <div className="flex items-center gap-2 text-gray-500"><Settings className="w-4 h-4" /> <span className="text-sm font-semibold">Last Updated</span></div>
                       <span className="text-sm font-bold text-gray-900">2 days ago</span>
                    </div>
                    <div className="bg-emerald-50/50 p-4 rounded-xl mt-4 border border-emerald-100/50">
                       <p className="text-[10px] font-bold text-emerald-700 uppercase mb-2">Recent Actions</p>
                       <ul className="text-xs font-semibold text-gray-700 space-y-2 list-none">
                         <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Approved report for Bugatti</li>
                         <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Changed profile picture</li>
                       </ul>
                    </div>
                 </div>
               </div>

            </div>
        </div>

        {/* Danger Zone standalone */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-red-100 relative overflow-hidden mb-8">
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
             <div className="flex items-center gap-3 mb-6 relative">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                   <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">Danger Zone</h3>
                  <p className="text-sm font-semibold text-gray-500">Irreversible, destructive actions.</p>
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                <button className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-bold text-gray-700 flex items-center justify-between group shadow-sm">
                   <span className="flex items-center gap-2"><LogOut className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" /> Logout from all devices</span>
                </button>
                <button className="w-full px-5 py-4 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors font-bold text-red-600 flex items-center justify-between group shadow-sm">
                   <span className="flex items-center gap-2"><Trash2 className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" /> Delete Account</span>
                </button>
             </div>
        </div>

      </div>

      {/* STEP 6: SAVE / ACTION AREA */}
      <div className="fixed bottom-0 left-0 right-0 glass-light p-4 md:p-6 z-50">
         <div className="max-w-5xl mx-auto flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sm:gap-4">
            <button 
              onClick={() => router.back()} 
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-extrabold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Discard Changes
            </button>
            <button 
              onClick={handleSave} 
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-white bg-[#0059A3] hover:bg-[#004a87] active:scale-[0.98] transition-all shadow-lg shadow-[#0059A3]/30 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" /> Save Changes
            </button>
         </div>
      </div>

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 glass-dark">
           <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
             <div className="flex items-center justify-between mb-6">
                <div>
                   <h3 className="text-xl font-black text-gray-900">Change Password</h3>
                   <p className="text-xs font-semibold text-gray-500 mt-1">Ensure your new password is secure.</p>
                </div>
                <button onClick={() => setPasswordModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                   <X className="w-5 h-5 text-gray-500" />
                </button>
             </div>
             <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Current Password</label>
                  <input type="password" placeholder="••••••••" value={passForm.current} onChange={e=>setPassForm({...passForm, current: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#0059A3]/20 focus:border-[#0059A3] font-bold" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                  <input type="password" placeholder="••••••••" value={passForm.new} onChange={e=>setPassForm({...passForm, new: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#0059A3]/20 focus:border-[#0059A3] font-bold" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" value={passForm.confirm} onChange={e=>setPassForm({...passForm, confirm: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#0059A3]/20 focus:border-[#0059A3] font-bold" />
                </div>
             </div>
             <button onClick={() => { alert('Password updated successfully!'); setPasswordModalOpen(false); }} className="w-full mt-8 py-4 bg-[#0059A3] hover:bg-[#004a87] text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-[#0059A3]/20 active:scale-[0.98]">
                Update Password
             </button>
           </div>
        </div>
      )}

    </div>
  );
}
