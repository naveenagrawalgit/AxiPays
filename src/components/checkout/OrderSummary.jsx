import React from "react";
import { Shield, Truck, Clock, CheckCircle } from "lucide-react";

const OrderSummary = ({ amount, currency }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="space-y-6">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-base-content/60">
              Total
            </span>
            <div className="mt-1 flex justify-between items-baseline">
              <span className="text-3xl font-light tracking-tight text-primary">
                ${amount}
              </span>
              <span className="text-sm text-base-content/60">{currency}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-base-content/60">Premium Plan</span>
              <span className="font-medium">$99.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-base-content/60">Tax</span>
              <span className="font-medium">$5.00</span>
            </div>
          </div>

          <div className="divider"></div>

          <div className="flex items-center gap-2 text-xs text-base-content/60">
            <Shield size={14} />
            Secure payment
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;