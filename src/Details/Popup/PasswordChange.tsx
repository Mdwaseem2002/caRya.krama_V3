"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertCircle, X, ShieldAlert, KeyRound, Eye, EyeOff, 
  Loader2, Check, CheckCircle2, Lock
} from "lucide-react";

interface PasswordChangeProps {
  isOpen: boolean;
  onClose: () => void;
  email: string | undefined;
  onSuccess?: () => void;
}

export default function PasswordChange({ isOpen, onClose, email, onSuccess }: PasswordChangeProps) {
  const [view, setView] = useState<'form' | 'same-pass-error' | 'success'>('form');
  const [passForm, setPassForm] = useState({ current: "", new: "", confirm: "" });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [message, setMessage] = useState("");

  const validatePassword = (pass: string) => {
    return {
      length: pass.length >= 8,
      upper: /[A-Z]/.test(pass),
      lower: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass),
    };
  };

  const handleUpdate = async () => {
    if (!email) return;

    // Validation
    const validation = validatePassword(passForm.new);
    const isAllValid = Object.values(validation).every(v => v);
    
    if (!isAllValid) { setStatus('error'); setMessage('Requirements not met'); return; }
    if (passForm.new !== passForm.confirm) { setStatus('error'); setMessage('Passwords do not match'); return; }
    
    // Check for reused password (The requested feature)
    if (passForm.new === passForm.current) {
      setView('same-pass-error');
      return;
    }

    setStatus('saving');
    try {
      const res = await fetch('/api/admin/password', { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email, currentPassword: passForm.current, newPassword: passForm.new }) 
      });
      const data = await res.json();
      
      if (res.ok) { 
        setStatus('idle');
        setView('success');
        if (onSuccess) onSuccess();
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else { 
        setStatus('error'); 
        setMessage(data.error || 'Failed to update password'); 
      }
    } catch { 
      setStatus('error'); 
      setMessage('Network error. Please try again.'); 
    }
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setView('form');
      setPassForm({ current: "", new: "", confirm: "" });
      setStatus('idle');
      setMessage("");
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={handleClose}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100"
        >
          {/* Header */}
          <div className="p-8 pb-0">
             <div className="flex items-center justify-between mb-2">
                <div>
                   <h3 className="text-2xl font-black text-gray-900">
                     {view === 'same-pass-error' ? 'Security Alert' : view === 'success' ? 'Password Updated' : 'Change Password'}
                   </h3>
                   <p className="text-sm font-semibold text-gray-500">
                     {view === 'same-pass-error' ? 'Security Protocol Violation' : view === 'success' ? 'Your credentials are now secure.' : 'Ensure your new password is secure.'}
                   </p>
                </div>
                <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                   <X className="w-5 h-5 text-gray-500" />
                </button>
             </div>
          </div>

          <div className="p-8 pt-6">
            <AnimatePresence mode="wait">
              {/* FORM VIEW */}
              {view === 'form' && (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type={showPass.current ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={passForm.current} 
                        onChange={e => setPassForm({...passForm, current: e.target.value})} 
                        className="w-full pl-11 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-[1.25rem] outline-none focus:bg-white focus:ring-2 focus:ring-[#0059A3]/10 focus:border-[#0059A3] font-bold text-gray-900 transition-all" 
                      />
                      <button type="button" onClick={() => setShowPass({...showPass, current: !showPass.current})} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPass.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">New Password</label>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type={showPass.new ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={passForm.new} 
                        onChange={e => setPassForm({...passForm, new: e.target.value})} 
                        className="w-full pl-11 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-[1.25rem] outline-none focus:bg-white focus:ring-2 focus:ring-[#0059A3]/10 focus:border-[#0059A3] font-bold text-gray-900 transition-all" 
                      />
                      <button type="button" onClick={() => setShowPass({...showPass, new: !showPass.new})} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPass.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Confirm New Password</label>
                    <div className="relative">
                      <Check className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type={showPass.confirm ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={passForm.confirm} 
                        onChange={e => setPassForm({...passForm, confirm: e.target.value})} 
                        className="w-full pl-11 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-[1.25rem] outline-none focus:bg-white focus:ring-2 focus:ring-[#0059A3]/10 focus:border-[#0059A3] font-bold text-gray-900 transition-all" 
                      />
                      <button type="button" onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPass.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Requirements Checklist */}
                  <div className="bg-gray-50 p-5 rounded-[1.5rem] border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-widest">Security Requirements</p>
                    <div className="grid grid-cols-2 gap-y-2">
                      {[
                        { key: 'length', label: '8+ Characters' },
                        { key: 'upper', label: 'Uppercase' },
                        { key: 'lower', label: 'Lowercase' },
                        { key: 'number', label: 'Number' },
                        { key: 'special', label: 'Special Character' },
                      ].map(({ key, label }) => {
                        const isValid = validatePassword(passForm.new)[key as keyof ReturnType<typeof validatePassword>];
                        return (
                          <div key={key} className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${isValid ? 'bg-green-500 text-white' : 'bg-gray-200 text-transparent'}`}>
                              <Check className="w-2.5 h-2.5" strokeWidth={3} />
                            </div>
                            <span className={`text-[11px] font-bold transition-colors ${isValid ? 'text-green-600' : 'text-gray-400'}`}>{label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {status === 'error' && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold text-red-500 text-center">{message}</motion.p>
                  )}

                  <button 
                    onClick={handleUpdate}
                    disabled={status === 'saving' || !Object.values(validatePassword(passForm.new)).every(v => v)}
                    className="w-full mt-4 py-4 bg-gradient-to-r from-[#0059A3] to-[#1B4FD8] text-white font-black text-lg rounded-[1.5rem] transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-3"
                  >
                    {status === 'saving' ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldAlert className="w-5 h-5" />}
                    {status === 'saving' ? 'Updating...' : 'Update Password'}
                  </button>
                </motion.div>
              )}

              {/* SAME PASSWORD ERROR VIEW */}
              {view === 'same-pass-error' && (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-4"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-[#F87171] to-[#DC2626] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-red-500/20">
                    <ShieldAlert className="w-12 h-12 text-white" strokeWidth={2.5} />
                  </div>
                  <p className="text-gray-500 mb-8 leading-relaxed font-medium px-4">
                    Your current password <span className="text-red-500 font-bold">can't be your new password</span>. Please choose a unique combination for enhanced security.
                  </p>
                  <div className="space-y-3 mb-10">
                    <div className="flex items-center justify-center gap-3 text-sm font-bold text-red-700 bg-red-50/80 border border-red-100 py-3 px-4 rounded-2xl">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span>Password Reuse Prohibited</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setView('form')}
                    className="w-full py-4 bg-gray-900 text-white rounded-[1.5rem] font-black text-lg hover:bg-gray-800 active:scale-[0.98] transition-all"
                  >
                    Try a Different Password
                  </button>
                </motion.div>
              )}

              {/* SUCCESS VIEW */}
              {view === 'success' && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-4"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-[#10b981] to-[#047857] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/20">
                    <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
                  </div>
                  <p className="text-gray-500 mb-10 leading-relaxed font-medium">
                    Your password has been successfully updated. Your account is now more secure.
                  </p>
                  <button
                    onClick={handleClose}
                    className="w-full py-4 bg-[#0059A3] text-white rounded-[1.5rem] font-black text-lg hover:bg-[#004a87] transition-all"
                  >
                    Got it!
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
              Secure Node {email?.split('@')[0]}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
