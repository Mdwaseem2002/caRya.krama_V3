"use client";

import React, { useState } from "react";
import { LogIn, ShieldCheck, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/useIsMobile";

interface LoginProps {
  onSwitch?: () => void;
  onSuccess?: () => void;
  role?: 'admin' | 'customer';
}

const Login = ({ onSwitch, onSuccess, role = 'customer' }: LoginProps) => {
  const { login } = useAuth();
  const mobile = useIsMobile();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = role === 'admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (email && password) {
      const success = await login(email, role, password);
      if (success) {
        if (onSuccess) onSuccess();
      } else {
        if (role === 'customer') {
          setError('User not found. Redirecting to sign up...');
          setTimeout(() => {
            if (onSwitch) onSwitch();
          }, 2000);
        } else {
          setError('Invalid admin credentials.');
        }
      }
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } };

  const inputRow: React.CSSProperties = {
    display: 'flex', alignItems: 'center', width: '100%',
    padding: mobile ? '10px 14px' : '12px 16px',
    backgroundColor: '#ffffff', border: '1px solid #e5e7eb',
    borderRadius: mobile ? '14px' : '16px', gap: '12px',
    marginBottom: mobile ? '10px' : '16px',
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: mobile ? '24px 20px' : '32px',
      backgroundColor: '#ffffff', borderRadius: mobile ? '20px' : '24px',
      boxShadow: '0 25px 50px rgba(0,0,0,0.15)', width: '100%',
      maxWidth: mobile ? '100%' : '420px', margin: '0 auto', overflow: 'hidden',
    }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        style={{ width: mobile ? '60px' : '80px', height: mobile ? '60px' : '80px', minHeight: mobile ? '60px' : '80px', minWidth: mobile ? '60px' : '80px', backgroundColor: isAdmin ? '#1e293b' : '#0059A3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: mobile ? '16px' : '24px' }}
      >
        {isAdmin ? (
          <ShieldCheck style={{ color: '#ffffff', width: mobile ? '28px' : '40px', height: mobile ? '28px' : '40px' }} strokeWidth={1.5} />
        ) : (
          <LogIn style={{ color: '#ffffff', width: mobile ? '28px' : '40px', height: mobile ? '28px' : '40px', marginLeft: '2px' }} strokeWidth={1.5} />
        )}
      </motion.div>

      <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: mobile ? '22px' : '28px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
        {isAdmin ? 'Admin Login' : 'Welcome Back'}
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ color: '#6b7280', marginBottom: mobile ? '20px' : '32px', textAlign: 'center', fontSize: mobile ? '13px' : '15px' }}>
        {isAdmin ? 'Sign in to the admin dashboard' : 'Log in to your caRya.krama account'}
      </motion.p>

      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: '#ef4444', marginBottom: '16px', fontSize: '13px', textAlign: 'center', fontWeight: 500 }}>
          {error}
        </motion.p>
      )}

      <motion.form variants={containerVariants} initial="hidden" animate="visible" onSubmit={handleSubmit} style={{ width: '100%' }}>
        <motion.div variants={itemVariants} style={inputRow}>
          <Mail style={{ color: '#9ca3af', flexShrink: 0 }} size={mobile ? 18 : 20} strokeWidth={1.5} />
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required
            style={{ width: '100%', border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: mobile ? '14px' : '15px', fontWeight: 500, color: '#111827' }} />
        </motion.div>

        <motion.div variants={itemVariants} style={inputRow}>
          <Lock style={{ color: '#9ca3af', flexShrink: 0 }} size={mobile ? 18 : 20} strokeWidth={1.5} />
          <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
            style={{ width: '100%', border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: mobile ? '14px' : '15px', fontWeight: 500, color: '#111827' }} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} 
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'opacity 0.2s', opacity: password ? 1 : 0.4 }}>
            {showPassword ? <EyeOff size={18} className="text-[#9ca3af]" /> : <Eye size={18} className="text-[#9ca3af]" />}
          </button>
        </motion.div>

        {!isAdmin && (
          <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'flex-start', padding: '2px 0 10px' }}>
            <span style={{ fontSize: mobile ? '12px' : '13px', color: '#0059A3', fontWeight: 700, cursor: 'pointer' }}>Forgot Password?</span>
          </motion.div>
        )}

        <motion.button type="submit" variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          style={{ width: '100%', padding: mobile ? '12px' : '14px', backgroundColor: isAdmin ? '#1e293b' : '#0059A3', color: '#ffffff', fontWeight: 700, borderRadius: mobile ? '14px' : '16px', border: 'none', cursor: 'pointer', fontSize: mobile ? '14px' : '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: isAdmin ? '0 4px 14px rgba(30,41,59,0.3)' : '0 4px 14px rgba(0,89,163,0.3)' }}>
          Sign In <ArrowRight size={18} strokeWidth={2} />
        </motion.button>
      </motion.form>

      {!isAdmin && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            style={{ marginTop: mobile ? '20px' : '32px', display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
            <div style={{ height: '1px', backgroundColor: '#e5e7eb', flex: 1 }} />
            <span style={{ color: '#9ca3af', fontSize: '13px', fontWeight: 500 }}>OR</span>
            <div style={{ height: '1px', backgroundColor: '#e5e7eb', flex: 1 }} />
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            style={{ marginTop: mobile ? '20px' : '32px', color: '#6b7280', fontSize: mobile ? '13px' : '14px' }}>
            Don't have an account? <span onClick={onSwitch} style={{ color: '#0059A3', fontWeight: 700, cursor: 'pointer', marginLeft: '4px' }}>Sign Up</span>
          </motion.p>
        </>
      )}

    </div>
  );
};

export default Login;
