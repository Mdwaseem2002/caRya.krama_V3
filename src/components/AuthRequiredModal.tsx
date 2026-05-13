"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, LogIn, UserPlus, X } from 'lucide-react';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignup: () => void;
  title?: string;
  message?: string;
}

export default function AuthRequiredModal({
  isOpen,
  onClose,
  onLogin,
  onSignup,
  title = "Sign in to save this car",
  message = "Create an account or sign in to save your favorite cars and get instant price drop alerts."
}: AuthRequiredModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
            >
              <X size={20} />
            </button>

            {/* Content */}
            <div className="p-8 flex flex-col items-center text-center">
              {/* Animated Icon */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6"
              >
                <Heart className="w-10 h-10 text-rose-500 fill-rose-500" />
              </motion.div>

              <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                {title}
              </h3>
              
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
                {message}
              </p>

              {/* Action Buttons */}
              <div className="w-full flex flex-col gap-3">
                <button
                  onClick={onSignup}
                  className="w-full sm:hidden py-4 bg-[#0059A3] hover:bg-[#004a87] text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <UserPlus size={18} />
                  Create Free Account
                </button>
                
                <button
                  onClick={onLogin}
                  className="w-full py-4 bg-white hover:bg-slate-50 text-[#0059A3] border-2 border-slate-100 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <LogIn size={18} />
                  Log In to Your Account
                </button>
              </div>

              {/* Footer text */}
              <p className="mt-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Trusted by 50,000+ car buyers
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
