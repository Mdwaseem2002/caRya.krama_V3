"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, Wallet, Building2, ChevronLeft, Check, ShieldCheck, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import PaymentDone from "../Popup/PaymentDone";
import { addPurchase } from "@/Admin/data/purchases";
import { getReportByCarId } from "@/Admin/data/reports";
import { cars } from "@/data/inventory";
import { getAllStoredCars } from "@/Admin/Upload/CarStorage";
import { useAuth } from "@/context/AuthContext";
import { addAdminNotification } from "@/Details/Notification/AdminNotify";

// Declare Razorpay on window for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Pay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const carId = searchParams.get('id');
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadedCarName, setUploadedCarName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useAuth();

  // Find car in static inventory OR uploaded MongoDB cars
  const staticCar = cars.find(c => c.id.toString() === carId?.toString());
  const basePrice = 499;
  const taxAndFees = 101;
  const price = basePrice + taxAndFees;

  useEffect(() => {
    if (!staticCar && carId) {
      // Try to find in uploaded (MongoDB) cars
      getAllStoredCars().then(uploadedCars => {
        const found = uploadedCars.find(c => c.id === carId);
        if (found) setUploadedCarName(found.title);
      }).catch(console.error);
    }
  }, [carId, staticCar]);

  const carDisplayName = staticCar?.name || uploadedCarName || "this vehicle";

  // ── Razorpay Payment Flow ───────────────────────────────────────────────────
  const handlePayment = async () => {
    if (!carId || !user) {
      setErrorMessage("Please log in to proceed with payment.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      // Step 1: Create Razorpay order on backend
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId, userId: user.id }),
      });

      const orderData = await orderRes.json();

      // Handle already-paid case
      if (!orderRes.ok) {
        if (orderData.error === "already_paid") {
          // User already purchased — show message and redirect to report
          addPurchase(carId); // Sync localStorage for legacy compat
          setErrorMessage("");
          setIsProcessing(true);
          // Brief visible feedback before redirect
          const msgEl = document.createElement("div");
          msgEl.className = "fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-green-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl text-sm";
          msgEl.textContent = "✅ You've already paid! Opening your report...";
          document.body.appendChild(msgEl);
          setTimeout(() => {
            router.push(`/details/report?id=${carId}`);
          }, 1500);
          return;
        }
        throw new Error(orderData.error || "Failed to create order");
      }

      // Step 2: Open Razorpay checkout modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Car Inspection Report",
        description: "Detailed car history, accident report, and mechanical inspection",
        order_id: orderData.orderId,
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        theme: { color: "#1B4FD8" },
        handler: async function (response: any) {
          // Step 3: Verify payment on backend
          try {
            setIsProcessing(true);

            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                carId,
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                amount: price,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              // Sync localStorage for legacy compatibility
              addPurchase(carId);

              // Send admin notification
              try {
                addAdminNotification({
                  title: "New Payment Received 💳",
                  message: `A payment of ₹${price} was received for ${carDisplayName}.`,
                  type: "payment" as any,
                  cta: { label: "View Payments", href: "/admin/payments" }
                });
              } catch (e) {
                console.error("Failed to send admin notification", e);
              }

              setIsSuccess(true);
            } else {
              setErrorMessage(verifyData.error || "Payment verification failed. Please contact support.");
            }
          } catch (verifyErr) {
            console.error("Payment verification error:", verifyErr);
            setErrorMessage("Payment verification failed. Please contact support.");
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setErrorMessage("Payment was cancelled. You can try again anytime.");
          },
        },
      };

      // Check if Razorpay script is loaded
      if (typeof window.Razorpay === "undefined") {
        throw new Error("Payment service is loading. Please try again in a moment.");
      }

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        setIsProcessing(false);
        setErrorMessage(
          response.error?.description || "Payment failed. Please try again."
        );
      });

      rzp.open();
      setIsProcessing(false); // Modal is now handling it

    } catch (err: any) {
      console.error("Payment initiation error:", err);
      setIsProcessing(false);
      setErrorMessage(err.message || "Unable to initiate payment. Please try again.");
    }
  };

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: CreditCard },
    { id: "upi", name: "UPI / Wallet", icon: Wallet },
    { id: "netbanking", name: "Net Banking", icon: Building2 },
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
                <span>₹{basePrice}.00</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium items-end">
                <div className="flex flex-col">
                  <span>Tax & Platform Fee</span>
                  <span className="text-[10px] text-gray-400 font-normal mt-0.5">(Includes 18% GST & 2% Platform Fee)</span>
                </div>
                <span>₹{taxAndFees}.00</span>
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
              
              {/* Payment method display (visual only — Razorpay modal handles actual selection) */}
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

              {/* Info text about Razorpay handling */}
              <p className="text-xs text-gray-400 text-center font-medium">
                You'll choose your exact payment method in the secure Razorpay window.
              </p>

              {/* Error Message */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm font-medium"
                >
                  {errorMessage}
                </motion.div>
              )}

              {/* Pay Button */}
              <button
                className="w-full py-4 mt-4 rounded-2xl bg-[#0059A3] text-white font-bold text-lg hover:bg-[#004a87] active:scale-[0.98] transition-all shadow-lg shadow-[#0059A3]/20 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Pay ₹{price}.00</>
                )}
              </button>

              <PaymentDone 
                isOpen={isSuccess} 
                onClose={() => setIsSuccess(false)} 
                carName={carDisplayName} 
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
