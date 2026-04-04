"use client";

import React, { useState } from "react";
import { User, Mail, Lock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/useIsMobile";

const Signup = ({ onSwitch, onSuccess }: { onSwitch?: () => void, onSuccess?: () => void }) => {
  const { signup } = useAuth();
  const mobile = useIsMobile();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'customer'>('customer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password) {
      signup(name, email, role);
      if (onSuccess) onSuccess();
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
        style={{ width: mobile ? '60px' : '80px', height: mobile ? '60px' : '80px', minHeight: mobile ? '60px' : '80px', minWidth: mobile ? '60px' : '80px', backgroundColor: '#0059A3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: mobile ? '16px' : '24px' }}
      >
        <User style={{ color: '#ffffff', width: mobile ? '28px' : '40px', height: mobile ? '28px' : '40px' }} strokeWidth={1.5} />
      </motion.div>

      <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: mobile ? '22px' : '28px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
        Create Account
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ color: '#6b7280', marginBottom: mobile ? '20px' : '32px', textAlign: 'center', fontSize: mobile ? '13px' : '15px' }}>
        Join caRya.krama for a premium experience
      </motion.p>

      <div style={{ display: 'flex', gap: '12px', width: '100%', marginBottom: mobile ? '16px' : '24px' }}>
        <button 
          onClick={() => setRole('customer')}
          style={{ 
            flex: 1, padding: '10px', borderRadius: '12px', border: '2px solid', 
            borderColor: role === 'customer' ? '#0059A3' : '#e5e7eb',
            backgroundColor: role === 'customer' ? '#0059A3' : 'transparent',
            color: role === 'customer' ? '#ffffff' : '#6b7280',
            fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
            fontSize: mobile ? '12px' : '14px'
          }}
        >
          Customer
        </button>
        <button 
          onClick={() => setRole('admin')}
          style={{ 
            flex: 1, padding: '10px', borderRadius: '12px', border: '2px solid', 
            borderColor: role === 'admin' ? '#0059A3' : '#e5e7eb',
            backgroundColor: role === 'admin' ? '#0059A3' : 'transparent',
            color: role === 'admin' ? '#ffffff' : '#6b7280',
            fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
            fontSize: mobile ? '12px' : '14px'
          }}
        >
          Admin
        </button>
      </div>

      <motion.form variants={containerVariants} initial="hidden" animate="visible" onSubmit={handleSubmit} style={{ width: '100%' }}>
        <motion.div variants={itemVariants} style={inputRow}>
          <User style={{ color: '#9ca3af', flexShrink: 0 }} size={mobile ? 18 : 20} strokeWidth={1.5} />
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required
            style={{ width: '100%', border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: mobile ? '14px' : '15px', fontWeight: 500, color: '#111827' }} />
        </motion.div>

        <motion.div variants={itemVariants} style={inputRow}>
          <Mail style={{ color: '#9ca3af', flexShrink: 0 }} size={mobile ? 18 : 20} strokeWidth={1.5} />
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required
            style={{ width: '100%', border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: mobile ? '14px' : '15px', fontWeight: 500, color: '#111827' }} />
        </motion.div>

        <motion.div variants={itemVariants} style={inputRow}>
          <Lock style={{ color: '#9ca3af', flexShrink: 0 }} size={mobile ? 18 : 20} strokeWidth={1.5} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
            style={{ width: '100%', border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: mobile ? '14px' : '15px', fontWeight: 500, color: '#111827' }} />
        </motion.div>

        <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: mobile ? '12px' : '13px', color: '#6b7280', padding: '4px 0 12px' }}>
          <input type="checkbox" id="terms" style={{ width: '16px', height: '16px', flexShrink: 0 }} />
          <label htmlFor="terms">I agree to the <span style={{ color: '#0059A3', fontWeight: 700, cursor: 'pointer' }}>Terms & Conditions</span></label>
        </motion.div>

        <motion.button type="submit" variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          style={{ width: '100%', padding: mobile ? '12px' : '14px', backgroundColor: '#0059A3', color: '#ffffff', fontWeight: 700, borderRadius: mobile ? '14px' : '16px', border: 'none', cursor: 'pointer', fontSize: mobile ? '14px' : '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(0,89,163,0.3)' }}>
          Sign Up Now <CheckCircle size={18} strokeWidth={2} />
        </motion.button>
      </motion.form>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        style={{ marginTop: mobile ? '20px' : '32px', color: '#6b7280', fontSize: mobile ? '13px' : '14px' }}>
        Already have an account? <span onClick={onSwitch} style={{ color: '#0059A3', fontWeight: 700, cursor: 'pointer', marginLeft: '4px' }}>Log In</span>
      </motion.p>
    </div>
  );
};

export default Signup;
