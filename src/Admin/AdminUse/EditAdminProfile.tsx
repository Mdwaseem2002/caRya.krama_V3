"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  User, Mail, Phone, Lock, Camera, MapPin, Save, ArrowLeft, Shield, 
  Settings, Building2, Bell, AlertTriangle, Activity, X, Check, FileText, CheckCircle2, ChevronDown, ListChecks, LogOut, Trash2, Clock, CheckSquare, Square,
  Eye, EyeOff, Loader2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Toggles for forms
const Toggle = ({ enabled, onChange, label }: { enabled: boolean; onChange: () => void; label: string }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-sm font-bold text-gray-700">{label}</span>
    <button onClick={onChange} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-[#0059A3]' : 'bg-gray-200'}`}>
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

const DEFAULT_FORM = {
  name: "", email: "", phone: "", profilePhoto: "",
  username: "", twoFactor: false,
  role: "Super Admin",
  permissions: { uploadCars: true, editCars: true, deleteCars: false, manageReports: true, viewPayments: true },
  companyName: "", companyLogo: "", supportEmail: "", contactNumber: "", address: "",
  notifyUploads: true, notifyPayments: true, notifyReports: false, notifySignups: true,
};

export default function EditAdminProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({ ...DEFAULT_FORM });
  const [originalData, setOriginalData] = useState({ ...DEFAULT_FORM });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState("");

  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [passForm, setPassForm] = useState({ current: "", new: "", confirm: "" });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [passStatus, setPassStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [passMessage, setPassMessage] = useState("");

  // ── Fetch profile from MongoDB on mount ──
  useEffect(() => {
    if (!user?.email) { setIsLoading(false); return; }
    (async () => {
      try {
        const res = await fetch(`/api/admin/profile?email=${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const { profile: p } = await res.json();
          const loaded = {
            name: p.name || "", email: p.email || "", phone: p.phone || "", profilePhoto: p.profilePhoto || "",
            username: p.username || "", twoFactor: p.twoFactor ?? false, role: p.adminRole || "Super Admin",
            permissions: { uploadCars: p.permissions?.uploadCars ?? true, editCars: p.permissions?.editCars ?? true, deleteCars: p.permissions?.deleteCars ?? false, manageReports: p.permissions?.manageReports ?? true, viewPayments: p.permissions?.viewPayments ?? true },
            companyName: p.companyName || "", companyLogo: p.companyLogo || "", supportEmail: p.supportEmail || "", contactNumber: p.contactNumber || "", address: p.address || "",
            notifyUploads: p.notifications?.notifyUploads ?? true, notifyPayments: p.notifications?.notifyPayments ?? true, notifyReports: p.notifications?.notifyReports ?? false, notifySignups: p.notifications?.notifySignups ?? true,
          };
          setFormData(loaded);
          setOriginalData(loaded);
        }
      } catch (err) { console.error("Failed to fetch admin profile:", err); }
      finally { setIsLoading(false); }
    })();
  }, [user]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setSaveStatus('error'); setSaveMessage('Image must be under 2MB'); setTimeout(() => setSaveStatus('idle'), 3000); return; }
    const reader = new FileReader();
    reader.onloadend = () => setFormData(prev => ({ ...prev, profilePhoto: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!user?.email) return;
    setIsSaving(true); setSaveStatus('idle');
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email, name: formData.name, phone: formData.phone, profilePhoto: formData.profilePhoto,
          username: formData.username, twoFactor: formData.twoFactor, adminRole: formData.role, permissions: formData.permissions,
          companyName: formData.companyName, companyLogo: formData.companyLogo, supportEmail: formData.supportEmail,
          contactNumber: formData.contactNumber, address: formData.address,
          notifications: { notifyUploads: formData.notifyUploads, notifyPayments: formData.notifyPayments, notifyReports: formData.notifyReports, notifySignups: formData.notifySignups },
        }),
      });
      if (res.ok) { setSaveStatus('success'); setSaveMessage('Profile saved successfully!'); setOriginalData({ ...formData }); }
      else { const err = await res.json(); setSaveStatus('error'); setSaveMessage(err.error || 'Failed to save'); }
    } catch { setSaveStatus('error'); setSaveMessage('Network error'); }
    finally { setIsSaving(false); setTimeout(() => setSaveStatus('idle'), 4000); }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#0059A3] animate-spin" />
          <p className="text-sm font-bold text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-inter text-gray-900 selection:bg-[#0059A3] selection:text-white">

      {/* ─── ENHANCED ANIMATED STATUS POPUP ─── */}
      {saveStatus !== 'idle' && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
           <div className={`bg-white rounded-[32px] p-8 shadow-2xl border flex flex-col items-center text-center max-w-sm w-full animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 ${saveStatus === 'success' ? 'border-green-100' : 'border-red-100'}`}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${saveStatus === 'success' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                 {saveStatus === 'success' ? (
                   <div className="relative">
                      <CheckCircle2 className="w-12 h-12 relative z-10 animate-in zoom-in duration-500 delay-150" />
                      <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-20"></div>
                   </div>
                 ) : (
                   <AlertTriangle className="w-12 h-12" />
                 )}
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                {saveStatus === 'success' ? 'Configuration Saved' : 'Update Failed'}
              </h3>
              <p className="text-gray-500 font-bold text-sm mb-8 leading-relaxed">
                {saveMessage}
              </p>
              <button 
                onClick={() => setSaveStatus('idle')}
                className={`w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg ${
                  saveStatus === 'success' 
                    ? 'bg-[#0059A3] text-white shadow-blue-500/20' 
                    : 'bg-red-500 text-white shadow-red-500/20'
                }`}
              >
                Continue Working
              </button>
           </div>
        </div>
      )}

      
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
              <div className="relative w-32 h-32 rounded-full ring-4 ring-gray-50 overflow-hidden bg-gray-100 group flex items-center justify-center">
                {formData.profilePhoto ? (
                  <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-gray-300" />
                )}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="w-6 h-6 text-white mb-1" />
                  <span className="text-[10px] text-white font-bold uppercase tracking-wider">Change</span>
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoChange} 
                accept="image/*" 
                className="hidden" 
              />
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

        {/* ACTION AREA - Moved above Danger Zone */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mb-8">
           <div className="flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4">
              <button 
                onClick={() => { setFormData({ ...originalData }); setSaveStatus('idle'); }} 
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-extrabold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Discard Changes
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-white bg-[#0059A3] hover:bg-[#004a87] active:scale-[0.98] transition-all shadow-lg shadow-[#0059A3]/30 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
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
                <button onClick={() => { logout(); router.push('/'); }} className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-bold text-gray-700 flex items-center justify-between group shadow-sm">
                   <span className="flex items-center gap-2"><LogOut className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" /> Logout from all devices</span>
                </button>
                <button onClick={async () => { if (!user?.id || !confirm('Are you absolutely sure? This cannot be undone.')) return; try { const r = await fetch(`/api/users/${user.id}`, { method: 'DELETE' }); if (r.ok) { logout(); router.push('/'); } else { alert('Failed to delete account'); } } catch { alert('Network error'); } }} className="w-full px-5 py-4 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors font-bold text-red-600 flex items-center justify-between group shadow-sm">
                   <span className="flex items-center gap-2"><Trash2 className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" /> Delete Account</span>
                </button>
             </div>
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
                  <div className="relative">
                    <input type={showPass.current ? "text" : "password"} placeholder="••••••••" value={passForm.current} onChange={e=>setPassForm({...passForm, current: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#0059A3]/20 focus:border-[#0059A3] font-bold" />
                    <button type="button" onClick={() => setShowPass({...showPass, current: !showPass.current})} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showPass.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                  <div className="relative">
                    <input type={showPass.new ? "text" : "password"} placeholder="••••••••" value={passForm.new} onChange={e=>setPassForm({...passForm, new: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#0059A3]/20 focus:border-[#0059A3] font-bold" />
                    <button type="button" onClick={() => setShowPass({...showPass, new: !showPass.new})} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showPass.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input type={showPass.confirm ? "text" : "password"} placeholder="••••••••" value={passForm.confirm} onChange={e=>setPassForm({...passForm, confirm: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#0059A3]/20 focus:border-[#0059A3] font-bold" />
                    <button type="button" onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showPass.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
             </div>
             {passStatus === 'error' && <p className="text-sm font-bold text-red-500 mt-2">{passMessage}</p>}
             {passStatus === 'success' && <p className="text-sm font-bold text-green-600 mt-2">{passMessage}</p>}
             <button 
               onClick={async () => {
                 if (!user?.email) return;
                 if (passForm.new !== passForm.confirm) { setPassStatus('error'); setPassMessage('Passwords do not match'); return; }
                 if (passForm.new.length < 6) { setPassStatus('error'); setPassMessage('Min 6 characters'); return; }
                 setPassStatus('saving');
                 try {
                   const res = await fetch('/api/admin/password', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: user.email, currentPassword: passForm.current, newPassword: passForm.new }) });
                   const data = await res.json();
                   if (res.ok) { setPassStatus('success'); setPassMessage('Password updated!'); setTimeout(() => { setPasswordModalOpen(false); setPassForm({ current: '', new: '', confirm: '' }); setPassStatus('idle'); }, 2000); }
                   else { setPassStatus('error'); setPassMessage(data.error || 'Failed'); }
                 } catch { setPassStatus('error'); setPassMessage('Network error'); }
               }}
               disabled={passStatus === 'saving'}
               className="w-full mt-8 py-4 bg-[#0059A3] hover:bg-[#004a87] text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-[#0059A3]/20 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
             >
                {passStatus === 'saving' ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : 'Update Password'}
             </button>
           </div>
        </div>
      )}

    </div>
  );
}
