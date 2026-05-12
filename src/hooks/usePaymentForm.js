import { useState, useCallback } from "react";
import { formatCardNumber, formatPhone } from "../utils/formatter";
import { detectCardType, validateLuhn } from "../utils/luhn";

export const usePaymentForm = (initialData = {}) => {
  const [formData, setFormData] = useState({
    cardHolder: "",
    email: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    amount: "",
    currency: "USD",
    country: "",
    address: "",
    phone: "",
    ...initialData
  });
  
  const [errors, setErrors] = useState({});
  const [cardType, setCardType] = useState("");
  
  const validateField = useCallback((field, value, allData = formData) => {
    let error = "";
    
    switch(field) {
      case "cardHolder":
        if (!value || !value.trim()) error = "Card holder name required";
        else if (value.length < 3) error = "Enter full name";
        break;
      case "email":
        if (!value) error = "Email required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Valid email required";
        break;
      case "cardNumber": {
        const cleaned = value ? value.replace(/\s/g, "") : "";
        if (!cleaned) {
          error = "Card number required";
        } else if (cleaned.length < 13 || cleaned.length > 19) {
          error = "Card number must be 13-19 digits";
        } else if (!/^\d+$/.test(cleaned)) {
          error = "Card number must contain only digits";
        } else if (!validateLuhn(cleaned)) {
          error = "Invalid card number (Luhn check failed)";
        }
        break;
      }
      case "expiryMonth": {
        if (!value) {
          error = "Month required";
        } else {
          const month = parseInt(value, 10);
          if (month < 1 || month > 12) {
            error = "Invalid month";
          }
        }
        break;
      }
      case "expiryYear": {
        if (!value) {
          error = "Year required";
        } else if (value.length !== 4) {
          error = "Enter 4-digit year";
        } else {
          const year = parseInt(value, 10);
          const currentYear = new Date().getFullYear();
          const currentMonth = new Date().getMonth() + 1;
          const month = parseInt(allData.expiryMonth, 10);
          
          if (year < currentYear) {
            error = "Card has expired";
          } else if (year === currentYear && month && month < currentMonth) {
            error = "Card has expired";
          }
        }
        break;
      }
      case "cvv": {
        if (!value) {
          error = "CVV required";
        } else if (!/^\d+$/.test(value)) {
          error = "CVV must contain only digits";
        } else {
          const requiredLength = cardType === "Amex" ? 4 : 3;
          if (value.length !== requiredLength) {
            error = `CVV must be ${requiredLength} digits`;
          }
        }
        break;
      }
      case "amount":
        if (!value) error = "Amount required";
        else if (parseFloat(value) <= 0) error = "Enter valid amount";
        break;
      case "country":
        if (!value || !value.trim()) error = "Country required";
        break;
      case "address":
        if (!value || !value.trim()) error = "Address required";
        break;
      case "phone": {
        const phoneCleaned = value ? value.replace(/\s/g, "") : "";
        if (!value || !value.trim()) error = "Phone number required";
        else if (phoneCleaned.length < 10) error = "Valid phone required";
        break;
      }
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
    return error === "";
  }, [cardType, formData]);
  
  const handleChange = useCallback((field, rawValue) => {
    let processedValue = rawValue;
    
    if (field === "cardNumber") {
      processedValue = formatCardNumber(rawValue);
      setCardType(detectCardType(rawValue));
    }
    if (field === "phone") processedValue = formatPhone(rawValue);
    if (field === "cvv") {
      const maxLength = cardType === "Amex" ? 4 : 3;
      processedValue = rawValue.replace(/\D/g, "").slice(0, maxLength);
    }
    if (field === "expiryMonth") {
      processedValue = rawValue.replace(/\D/g, "").slice(0, 2);
    }
    if (field === "expiryYear") {
      // Only allow 4-digit year
      processedValue = rawValue.replace(/\D/g, "").slice(0, 4);
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  }, [cardType, errors]);
  
  const validateForm = useCallback(() => {
    const fieldsToValidate = ["cardHolder", "email", "cardNumber", "expiryMonth", "expiryYear", "cvv", "amount", "country", "address", "phone"];
    let isValid = true;
    
    fieldsToValidate.forEach(field => {
      if (!validateField(field, formData[field], formData)) {
        isValid = false;
      }
    });
    
    return isValid;
  }, [formData, validateField]);
  
  const getMaskedCardNumber = (cardNumber) => {
    if (!cardNumber) return "•••• •••• •••• ••••";
    const cleaned = cardNumber.replace(/\s/g, "");
    if (cleaned.length < 10) return "•••• •••• •••• ••••";
    const first6 = cleaned.slice(0, 6);
    const last4 = cleaned.slice(-4);
    const maskedMiddle = "•".repeat(cleaned.length - 10);
    const masked = `${first6}${maskedMiddle}${last4}`;
    return masked.match(/.{1,4}/g)?.join(" ") || masked;
  };
  
  return {
    formData,
    errors,
    cardType,
    handleChange,
    validateForm,
    setFormData,
    getMaskedCardNumber
  };
};