import { useState } from "react";
import { initiatePayment } from "../services/paymentApi";

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  
  const processPayment = async (paymentData) => {
    console.log("Processing payment for:", {
      cardHolder: paymentData.cardHolder,
      email: paymentData.email,
      amount: paymentData.amount,
      currency: paymentData.currency
    });
    
    setIsProcessing(true);
    setPaymentError(null);
    
    try {
      const result = await initiatePayment(paymentData);
      console.log("Payment initiation result:", result);
      
      if (result.success && result.redirectUrl) {
        // Store transaction reference
        sessionStorage.setItem("transactionMetadata", JSON.stringify({
          transactionId: result.transactionId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          email: paymentData.email,
          timestamp: new Date().toISOString()
        }));
        
        // Redirect to payment gateway
        window.location.href = result.redirectUrl;
        return { success: true };
      } else {
        setPaymentError(result.error);
        setPaymentStatus({ type: "failed", message: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      const errorMessage = error.message || "An unexpected error occurred";
      setPaymentError(errorMessage);
      setPaymentStatus({ type: "failed", message: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  };
  
  const resetPayment = () => {
    setPaymentStatus(null);
    setPaymentError(null);
    setIsProcessing(false);
  };
  
  return {
    isProcessing,
    paymentStatus,
    paymentError,
    processPayment,
    resetPayment,
    setPaymentStatus
  };
};