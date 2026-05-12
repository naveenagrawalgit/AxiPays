import React, { useState } from "react";
import { Lock, CreditCard, Phone, MapPin, Mail, User, Calendar, Shield, Home, Globe, AlertCircle } from "lucide-react";
import { usePaymentForm } from "../../hooks/usePaymentForm";

const CheckoutForm = ({ onSubmit, isProcessing, submitError }) => {
  const { formData, errors, cardType, handleChange, validateForm } = usePaymentForm();
  const [touched, setTouched] = useState({});

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    const isValid = validateForm();
    
    if (isValid) {
      onSubmit(formData);
    } else {
      const allFields = Object.keys(formData);
      const touchedFields = {};
      allFields.forEach(field => {
        touchedFields[field] = true;
      });
      setTouched(touchedFields);
    }
  };

  const showError = (field) => {
    return touched[field] && errors[field];
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Complete payment
          </h1>
          <p className="mt-1 text-sm text-base-content/60">
            All fields are required
          </p>
        </div>

        {submitError && (
          <div className="alert alert-error rounded-none border border-red-500 bg-red-50 text-red-700 mb-4">
            <AlertCircle size={16} />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Card Holder */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <User size={14} />
                Card Holder Name
              </span>
            </label>
            <input
              type="text"
              value={formData.cardHolder}
              onChange={(e) => handleChange("cardHolder", e.target.value)}
              onBlur={() => handleBlur("cardHolder")}
              placeholder="John Doe"
              className={`input rounded-none border ${showError("cardHolder") ? "border-red-500" : "border-black"} bg-white w-full`}
              disabled={isProcessing}
            />
            {showError("cardHolder") && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.cardHolder}</span>
              </label>
            )}
          </div>

          {/* Email */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <Mail size={14} />
                Email Address
              </span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="john@example.com"
              className={`input rounded-none border ${showError("email") ? "border-red-500" : "border-black"} bg-white w-full`}
              disabled={isProcessing}
            />
            {showError("email") && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.email}</span>
              </label>
            )}
          </div>

          {/* Card Number */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <CreditCard size={14} />
                Card Number
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => {
                  let value = e.target.value.replace(/\s/g, "").replace(/\D/g, "").slice(0, 16);
                  let formatted = value.replace(/(.{4})/g, "$1 ").trim();
                  handleChange("cardNumber", formatted);
                }}
                onBlur={() => handleBlur("cardNumber")}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
                className={`input rounded-none border ${showError("cardNumber") ? "border-red-500" : "border-black"} bg-white font-mono w-full`}
                disabled={isProcessing}
              />
              {cardType && cardType !== "Unknown" && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: "#1a56db" }}>
                  {cardType}
                </span>
              )}
            </div>
            {showError("cardNumber") && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.cardNumber}</span>
              </label>
            )}
          </div>

          {/* Expiry Month, Year & CVV */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Calendar size={14} />
                  Month
                </span>
              </label>
              <input
                type="text"
                value={formData.expiryMonth}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "").slice(0, 2);
                  handleChange("expiryMonth", value);
                }}
                onBlur={() => handleBlur("expiryMonth")}
                placeholder="MM"
                maxLength={2}
                className={`input rounded-none border ${showError("expiryMonth") ? "border-red-500" : "border-black"} bg-white w-full text-center`}
                disabled={isProcessing}
              />
              {showError("expiryMonth") && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.expiryMonth}</span>
                </label>
              )}
            </div>
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Year</span>
              </label>
              <input
                type="text"
                value={formData.expiryYear}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "").slice(0, 4);
                  handleChange("expiryYear", value);
                }}
                onBlur={() => handleBlur("expiryYear")}
                placeholder="YYYY"
                maxLength={4}
                className={`input rounded-none border ${showError("expiryYear") ? "border-red-500" : "border-black"} bg-white w-full text-center`}
                disabled={isProcessing}
              />
              {showError("expiryYear") && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.expiryYear}</span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Shield size={14} />
                  CVV
                </span>
              </label>
              <input
                type="password"
                value={formData.cvv}
                onChange={(e) => {
                  const maxLength = cardType === "Amex" ? 4 : 3;
                  const value = e.target.value.replace(/\D/g, "").slice(0, maxLength);
                  handleChange("cvv", value);
                }}
                onBlur={() => handleBlur("cvv")}
                placeholder={cardType === "Amex" ? "1234" : "123"}
                maxLength={4}
                className={`input rounded-none border ${showError("cvv") ? "border-red-500" : "border-black"} bg-white font-mono text-center w-full`}
                disabled={isProcessing}
              />
              {showError("cvv") && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.cvv}</span>
                </label>
              )}
            </div>
          </div>

          {/* Currency & Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Globe size={14} />
                  Currency
                </span>
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                className="select rounded-none border border-black bg-white w-full"
                disabled={isProcessing}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <CreditCard size={14} />
                  Payment Amount
                </span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                onBlur={() => handleBlur("amount")}
                placeholder="0.00"
                className={`input rounded-none border ${showError("amount") ? "border-red-500" : "border-black"} bg-white w-full font-semibold`}
                disabled={isProcessing}
              />
              {showError("amount") && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.amount}</span>
                </label>
              )}
            </div>
          </div>

          {/* Country */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <MapPin size={14} />
                Country
              </span>
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              onBlur={() => handleBlur("country")}
              placeholder="United States"
              className={`input rounded-none border ${showError("country") ? "border-red-500" : "border-black"} bg-white w-full`}
              disabled={isProcessing}
            />
            {showError("country") && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.country}</span>
              </label>
            )}
          </div>

          {/* Address */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <Home size={14} />
                Address
              </span>
            </label>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              onBlur={() => handleBlur("address")}
              placeholder="123 Main St, Apt 4B"
              className={`textarea rounded-none border ${showError("address") ? "border-red-500" : "border-black"} bg-white w-full`}
              disabled={isProcessing}
            />
            {showError("address") && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.address}</span>
              </label>
            )}
          </div>

          {/* Phone */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <Phone size={14} />
                Phone
              </span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "").slice(0, 15);
                let formatted = value.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3").trim();
                handleChange("phone", formatted || value);
              }}
              onBlur={() => handleBlur("phone")}
              placeholder="123 456 7890"
              className={`input rounded-none border ${showError("phone") ? "border-red-500" : "border-black"} bg-white w-full`}
              disabled={isProcessing}
            />
            {showError("phone") && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.phone}</span>
              </label>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn w-full mt-8 gap-2 text-white rounded-none"
            style={{ backgroundColor: "#1a56db", border: "none" }}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Processing...
              </>
            ) : (
              <>
                <Lock size={16} />
                Pay ${formData.amount || "0"} {formData.currency}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;