"use client";

import React, { useState, useMemo } from "react";
import { User, Mail, Lock, CheckCircle, Eye, EyeOff, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useRouter } from "next/navigation";

const Signup = ({ onSwitch, onSuccess }: { onSwitch?: () => void, onSuccess?: () => void }) => {
  const { signup } = useAuth();
  const mobile = useIsMobile();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role] = useState<'admin' | 'customer'>('customer');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Password strength rules
  const pwRules = useMemo(() => [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { label: 'One number (0-9)', met: /[0-9]/.test(password) },
    { label: 'One special character (!@#$...)', met: /[^A-Za-z0-9]/.test(password) },
  ], [password]);

  const allRulesMet = pwRules.every(r => r.met);
  const metCount = pwRules.filter(r => r.met).length;
  const strengthPct = `${(metCount / pwRules.length) * 100}%`;
  const strengthColor = metCount <= 1 ? '#EF4444' : metCount <= 3 ? '#F59E0B' : metCount <= 4 ? '#3B82F6' : '#22C55E';
  const strengthLabel = metCount <= 1 ? 'Weak' : metCount <= 3 ? 'Fair' : metCount <= 4 ? 'Good' : 'Strong';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agreed) {
      setError("Please agree to the Terms & Conditions to continue.");
      return;
    }

    if (!allRulesMet) {
      setError("Please create a stronger password that meets all requirements.");
      return;
    }

    if (name && email && password) {
      setIsLoading(true);
      try {
        const success = await signup(name, email, role, password);
        if (success) {
          if (onSuccess) onSuccess();
          router.push('/Profile');
        } else {
          setError("Failed to create account. Please check your details or try again later.");
        }
      } catch (err: any) {
        setError(err?.message || "An unexpected error occurred during signup.");
      } finally {
        setIsLoading(false);
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
        Join caRya.krama for a verified experience
      </motion.p>
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
          <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
            style={{ width: '100%', border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: mobile ? '14px' : '15px', fontWeight: 500, color: '#111827' }} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} 
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'opacity 0.2s', opacity: password ? 1 : 0.4 }}>
            {showPassword ? <EyeOff size={18} className="text-[#9ca3af]" /> : <Eye size={18} className="text-[#9ca3af]" />}
          </button>
        </motion.div>

        {/* Password Strength Indicator */}
        <AnimatePresence>
          {password.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginBottom: mobile ? '10px' : '16px' }}
            >
              {/* Strength Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ flex: 1, height: '5px', backgroundColor: '#f3f4f6', borderRadius: '50px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: strengthPct }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    style={{ height: '100%', backgroundColor: strengthColor, borderRadius: '50px' }}
                  />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: strengthColor, minWidth: '40px', textAlign: 'right' }}>{strengthLabel}</span>
              </div>

              {/* Rules Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '0 4px' }}>
                {pwRules.map((rule) => (
                  <motion.div
                    key={rule.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      backgroundColor: rule.met ? '#DCFCE7' : '#FEF2F2',
                      transition: 'background-color 0.3s',
                    }}>
                      {rule.met
                        ? <Check size={10} style={{ color: '#16A34A' }} strokeWidth={3} />
                        : <X size={10} style={{ color: '#EF4444' }} strokeWidth={3} />
                      }
                    </div>
                    <span style={{
                      fontSize: mobile ? '11px' : '12px', fontWeight: 600,
                      color: rule.met ? '#16A34A' : '#9CA3AF',
                      transition: 'color 0.3s',
                    }}>{rule.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: mobile ? '12px' : '13px', color: '#6b7280', padding: '4px 0 12px' }}>
          <input 
            type="checkbox" 
            id="terms" 
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ width: '16px', height: '16px', flexShrink: 0, cursor: 'pointer' }} 
          />
          <label htmlFor="terms" style={{ cursor: 'pointer' }}>
            I agree to the <span style={{ color: '#0059A3', fontWeight: 700 }}>Terms & Conditions</span>
          </label>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ color: '#ef4444', fontSize: '12px', fontWeight: 600, marginBottom: '16px', textAlign: 'center', backgroundColor: '#fef2f2', padding: '8px', borderRadius: '8px', border: '1px solid #fee2e2' }}
          >
            {error}
          </motion.div>
        )}

        <motion.button 
          type="submit" 
          disabled={isLoading || (password.length > 0 && !allRulesMet)}
          variants={itemVariants} 
          whileHover={(isLoading || !allRulesMet) ? {} : { scale: 1.02 }} 
          whileTap={(isLoading || !allRulesMet) ? {} : { scale: 0.98 }}
          style={{ 
            width: '100%', padding: mobile ? '12px' : '14px', 
            backgroundColor: (isLoading || (password.length > 0 && !allRulesMet)) ? '#9ca3af' : '#0059A3', 
            color: '#ffffff', fontWeight: 700, borderRadius: mobile ? '14px' : '16px', 
            border: 'none', cursor: (isLoading || (password.length > 0 && !allRulesMet)) ? 'not-allowed' : 'pointer', 
            fontSize: mobile ? '14px' : '15px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(0,89,163,0.3)',
            opacity: (isLoading || (password.length > 0 && !allRulesMet)) ? 0.8 : 1
          }}
        >
          {isLoading ? 'Creating Account...' : 'Sign Up Now'} 
          {!isLoading && <CheckCircle size={18} strokeWidth={2} />}
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
