"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Wallet, Building2, Apple, ChevronLeft, Check, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import PaymentDone from "../Popup/PaymentDone";
import { addPurchase } from "@/Admin/data/purchases";
import { getReportByCarId } from "@/Admin/data/reports";
import { cars } from "@/data/inventory";

export default function Pay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const carId = searchParams.get('id');
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [isSuccess, setIsSuccess] = useState(false);
  const { user } = useAuth();

  const car = cars.find(c => c.id.toString() === carId?.toString());
  const report = carId ? getReportByCarId(carId) : null;
  const price = report?.price || 299;

  const handlePayment = () => {
    if (carId) {
      addPurchase(carId);
    }
    
    // Trigger notification
    if (user) {
        import("@/Details/Notification/CustomerNotify").then(({ addNotification }) => {
          addNotification(user.id, {
            title: "Payment Successful 💳",
            message: `Your payment of ₹${price} is confirmed.`,
            type: "payment",
            cta: { label: "View Report", href: `/details/report?id=${carId}` }
          });
        });
    }

    setIsSuccess(true);
  };

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: CreditCard },
    { id: "upi", name: "UPI / Wallet", icon: Wallet },
    { id: "netbanking", name: "Net Banking", icon: Building2 },
    { id: "applepay", name: "Apple Pay", icon: Apple },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-6"
          >
            <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
            
            <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex flex-shrink-0 items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-blue-500" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-medium text-gray-900">Inspection Report</h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">Detailed car history, accident report, and mechanical inspection.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Subtotal</span>
                <span>₹299.00</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Tax</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-100">
                <span>Total</span>
                <span>₹{price}.00</span>
              </div>
            </div>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;
                  
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? "border-[#0059A3] bg-[#0059A3]/5"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center transition-colors ${
                        isSelected ? "bg-[#0059A3] text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-gray-900 flex-grow text-left">
                        {method.name}
                      </span>
                      {isSelected && (
                        <Check className="w-5 h-5 text-[#0059A3] flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Card Details (Mock) */}
              {selectedMethod === "card" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 pt-2 overflow-hidden"
                >
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-[#0059A3] focus:border-transparent outline-none transition-all font-medium"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-[#0059A3] focus:border-transparent outline-none transition-all font-medium"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-[#0059A3] focus:border-transparent outline-none transition-all font-medium"
                    />
                  </div>
                </motion.div>
              )}

              <button
                className="w-full py-4 mt-8 rounded-2xl bg-[#0059A3] text-white font-bold text-lg hover:bg-[#004a87] active:scale-[0.98] transition-all shadow-lg shadow-[#0059A3]/20 flex items-center justify-center"
                onClick={handlePayment}
              >
                Pay ₹{price}.00
              </button>

              <PaymentDone 
                isOpen={isSuccess} 
                onClose={() => setIsSuccess(false)} 
                carName={car?.name || "this vehicle"} 
                carId={carId || ""}
              />
              
              <p className="text-center text-sm font-medium text-gray-500 mt-6 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-green-500" /> Secure 256-bit encryption
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
