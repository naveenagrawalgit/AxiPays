import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentStatusPage = () => {
  const [status, setStatus] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const statusParam = urlParams.get("status");
    const paymentId = urlParams.get("paymentId");
    
    setStatus(statusParam);
    
    // Retrieve payment details from session storage
    const storedData = sessionStorage.getItem("paymentData");
    if (storedData) {
      setPaymentDetails(JSON.parse(storedData));
    }
  }, []);
  
  const statusConfig = {
    success: {
      icon: <CheckCircle className="w-20 h-20 text-success" />,
      title: "Payment Successful!",
      message: "Your transaction has been completed successfully.",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    failed: {
      icon: <XCircle className="w-20 h-20 text-error" />,
      title: "Payment Failed",
      message: "Something went wrong. Please try again.",
      color: "text-error",
      bgColor: "bg-error/10"
    },
    pending: {
      icon: <Clock className="w-20 h-20 text-warning" />,
      title: "Payment Pending",
      message: "Your transaction is being processed. You'll receive a confirmation email shortly.",
      color: "text-warning",
      bgColor: "bg-warning/10"
    }
  };
  
  const config = statusConfig[status];
  
  if (!config) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <p>Loading payment status...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card bg-base-100 w-full max-w-md shadow-2xl">
        <div className="card-body items-center text-center space-y-6">
          <div className={`p-4 rounded-full ${config.bgColor}`}>
            {config.icon}
          </div>
          
          <h2 className={`text-2xl font-bold ${config.color}`}>
            {config.title}
          </h2>
          
          <p className="text-base-content/70">
            {config.message}
          </p>
          
          {paymentDetails && (
            <div className="w-full p-4 bg-base-200 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-base-content/60">Amount:</span>
                <span className="font-medium">
                  {paymentDetails.currency} {paymentDetails.amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">Email:</span>
                <span className="font-medium">{paymentDetails.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">Date:</span>
                <span className="font-medium">
                  {new Date(paymentDetails.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          )}
          
          <div className="card-actions w-full gap-3">
            {status === "failed" && (
              <Link to="/checkout" className="btn btn-primary w-full">
                Try Again
              </Link>
            )}
            
            <Link to="/" className="btn btn-outline w-full gap-2">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusPage;