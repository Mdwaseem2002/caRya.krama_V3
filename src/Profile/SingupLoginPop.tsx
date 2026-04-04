"use client";

import React from "react";
import { LogIn, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

interface SignupLoginPopProps {
  onLogin: () => void;
  onSignup: () => void;
}

const SignupLoginPop: React.FC<SignupLoginPopProps> = ({ onLogin, onSignup }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[100] overflow-hidden"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onLogin();
        }}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left"
      >
        <LogIn size={20} className="text-[#0059A3]" />
        <span className="text-[#111827] text-sm font-semibold opacity-100">Login</span>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSignup();
        }}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
      >
        <UserPlus size={20} className="text-[#0059A3]" />
        <span className="text-[#111827] text-sm font-semibold opacity-100">Sign Up</span>
      </button>
    </motion.div>
  );
};

export default SignupLoginPop;
