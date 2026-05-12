import React from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const StatusModal = ({ status, onClose }) => {
  if (!status) return null;
  
  const statusConfig = {
    success: {
      icon: <CheckCircle className="w-16 h-16 text-success" />,
      title: "Payment Successful!",
      message: "Your transaction has been completed successfully.",
    },
    failed: {
      icon: <XCircle className="w-16 h-16 text-error" />,
      title: "Payment Failed",
      message: status.message || "Something went wrong. Please try again.",
    },
    pending: {
      icon: <Clock className="w-16 h-16 text-warning" />,
      title: "Payment Pending",
      message: "Your transaction is being processed.",
    }
  };
  
  const config = statusConfig[status.type];
  if (!config) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-none border border-black max-w-md w-full p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {config.icon}
          <h2 className="text-xl font-bold">{config.title}</h2>
          <p className="text-sm text-gray-600">{config.message}</p>
          <button 
            className="btn rounded-none w-full mt-4 text-white"
            style={{ backgroundColor: "#1a56db", border: "none" }}
            onClick={onClose}
          >
            {status.type === "success" ? "Continue" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;