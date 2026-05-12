import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import CheckoutForm from "../components/checkout/CheckoutForm";
import OrderSummary from "../components/checkout/OrderSummary";
import { initiatePayment } from "../services/paymentApi";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [modalStatus, setModalStatus] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    
    if (status === "success") {
      setModalStatus({ type: "success", message: "Payment completed successfully" });
      window.history.replaceState({}, document.title, "/checkout");
    } else if (status === "failed") {
      setModalStatus({ type: "failed", message: "Payment failed. Please try again." });
      window.history.replaceState({}, document.title, "/checkout");
    } else if (status === "pending") {
      setModalStatus({ type: "pending", message: "Payment is being processed." });
      window.history.replaceState({}, document.title, "/checkout");
    }
  }, []);

  const handlePaymentSubmit = async (paymentData) => {
    setIsProcessing(true);
    setSubmitError(null);
    
    try {
      const result = await initiatePayment(paymentData);
      
      if (result.success && result.redirectUrl) {
        sessionStorage.setItem("paymentData", JSON.stringify({
          amount: paymentData.amount,
          currency: paymentData.currency,
          email: paymentData.email,
          timestamp: new Date().toISOString()
        }));
        window.location.href = result.redirectUrl;
      } else {
        setSubmitError(result.error || "Payment failed");
        setModalStatus({ type: "failed", message: result.error || "Payment failed" });
      }
    } catch (error) {
      setSubmitError(error.message);
      setModalStatus({ type: "failed", message: error.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setModalStatus(null);
    if (modalStatus?.type === "success") {
      navigate("/dashboard");
    }
  };

  const StatusModal = () => {
    if (!modalStatus) return null;
    
    const config = {
      success: {
        icon: <CheckCircle size={48} className="text-emerald-500" />,
        title: "Payment Successful!",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        buttonText: "Go to Dashboard",
      },
      failed: {
        icon: <XCircle size={48} className="text-rose-500" />,
        title: "Payment Failed",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-200",
        buttonText: "Try Again",
      },
      pending: {
        icon: <Clock size={48} className="text-amber-500" />,
        title: "Payment Pending",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        buttonText: "Go to Dashboard",
      }
    };
    
    const current = config[modalStatus.type];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`bg-white border ${current.borderColor} max-w-md w-full p-6 text-center`}>
          <div className={`flex justify-center mb-4 ${current.bgColor} w-20 h-20 rounded-full mx-auto items-center`}>
            {current.icon}
          </div>
          <h2 className="text-xl font-semibold text-stone-900 mb-2">{current.title}</h2>
          <p className="text-sm text-stone-500 mb-6">{modalStatus.message}</p>
          <button
            onClick={closeModal}
            className="w-full py-3 text-white rounded-none"
            style={{ backgroundColor: "#1a56db" }}
          >
            {current.buttonText}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <CheckoutForm 
              onSubmit={handlePaymentSubmit} 
              isProcessing={isProcessing}
              submitError={submitError}
            />
          </div>
          <div className="lg:col-span-5">
            <OrderSummary amount="104.00" currency="USD" />
          </div>
        </div>
      </div>
      <StatusModal />
    </div>
  );
};

export default CheckoutPage;