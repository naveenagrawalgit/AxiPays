import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const PaymentRedirectPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const statusParam = urlParams.get("status");
    
    if (statusParam) {
      setStatus(statusParam);
      setMessage(statusParam === "success" ? "Payment completed successfully" : "Payment " + statusParam);
      setLoading(false);
    } else {
      fetch("https://payment-assignment.onrender.com/redirect")
        .then(res => res.json())
        .then(data => {
          setStatus(data.status);
          setMessage(data.message);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error:", err);
          setStatus("error");
          setMessage("Unable to verify payment status");
          setLoading(false);
        });
    }
  }, [location]);

  const getConfig = () => {
    switch(status) {
      case "success":
        return {
          icon: <CheckCircle size={48} className="text-emerald-500" />,
          title: "Payment Successful!",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          buttonText: "Go to Dashboard",
          onClick: () => navigate("/dashboard")
        };
      case "failed":
        return {
          icon: <XCircle size={48} className="text-rose-500" />,
          title: "Payment Failed",
          bgColor: "bg-rose-50",
          borderColor: "border-rose-200",
          buttonText: "Try Again",
          onClick: () => navigate("/checkout")
        };
      case "pending":
        return {
          icon: <Clock size={48} className="text-amber-500" />,
          title: "Payment Pending",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          buttonText: "Check Dashboard",
          onClick: () => navigate("/dashboard")
        };
      default:
        return {
          icon: <XCircle size={48} className="text-stone-400" />,
          title: "Payment Status Unknown",
          bgColor: "bg-stone-50",
          borderColor: "border-stone-200",
          buttonText: "Return to Checkout",
          onClick: () => navigate("/checkout")
        };
    }
  };

  const config = getConfig();

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg" style={{ color: "#1a56db" }}></span>
          <p className="mt-4 text-stone-500">Verifying payment status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className={`bg-white border ${config.borderColor} max-w-md w-full p-6 text-center`}>
        <div className={`flex justify-center mb-4 ${config.bgColor} w-20 h-20 rounded-full mx-auto items-center`}>
          {config.icon}
        </div>
        <h2 className="text-xl font-semibold text-stone-900 mb-2">{config.title}</h2>
        <p className="text-sm text-stone-500 mb-6">{message}</p>
        <button
          onClick={config.onClick}
          className="w-full py-3 text-white rounded-none"
          style={{ backgroundColor: "#1a56db" }}
        >
          {config.buttonText}
        </button>
      </div>
    </div>
  );
};

export default PaymentRedirectPage;