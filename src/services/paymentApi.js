import { generatePaymentHash } from "../utils/hash";
import { maskCardNumber } from "../utils/mask";

const API_BASE_URL = "https://payment-assignment.onrender.com";

const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `ORD_${timestamp}_${random}`;
};

const formatExpiryYear = (year) => {
  if (!year) return "";
  const cleanYear = year.replace(/\D/g, "");
  if (cleanYear.length === 2) {
    return `20${cleanYear}`;
  }
  return cleanYear.slice(0, 4);
};

const sanitizePhoneNumber = (phone) => {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
};

const buildPaymentRequest = (paymentData, orderId) => {
  return {
    orderId: orderId,
    cardHolderName: paymentData.cardHolder,
    email: paymentData.email,
    cardNumber: paymentData.cardNumber.replace(/\s/g, ""),
    expiryMonth: paymentData.expiryMonth,
    expiryYear: formatExpiryYear(paymentData.expiryYear),
    cardCVC: paymentData.cvv,
    amount: parseFloat(paymentData.amount),
    currency: paymentData.currency,
    country: paymentData.country,
    address: paymentData.address,
    phone: sanitizePhoneNumber(paymentData.phone)
  };
};

const logRequestDetails = (requestBody, hash) => {
  console.log("Payment Request:", {
    orderId: requestBody.orderId,
    cardNumber: maskCardNumber(requestBody.cardNumber),
    amount: requestBody.amount,
    currency: requestBody.currency,
    hashHeader: hash ? hash.substring(0, 16) + "..." : "missing"
  });
};

export const initiatePayment = async (paymentData) => {
  if (!paymentData.phone || paymentData.phone.trim() === "") {
    return { success: false, error: "Phone number is required" };
  }

  try {
    const securityHash = await generatePaymentHash(paymentData.cardNumber, paymentData.email);
    const orderId = generateOrderId();
    const requestPayload = buildPaymentRequest(paymentData, orderId);
    
    logRequestDetails(requestPayload, securityHash);
    
    console.log("Sending request to:", `${API_BASE_URL}/initiate-payment`);
    
    const apiResponse = await fetch(`${API_BASE_URL}/initiate-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Hash": securityHash
      },
      body: JSON.stringify(requestPayload)
    });
    
    const responseData = await apiResponse.json();
    console.log("API Response:", responseData);
    
    if (!apiResponse.ok) {
      return {
        success: false,
        error: responseData.message || responseData.error || "Payment initiation failed"
      };
    }
    
    const redirectUrl = responseData.redirect_url || responseData.redirection_url;
    
    if (redirectUrl) {
      const yourAppUrl = window.location.origin;
      const returnUrl = `${yourAppUrl}/payment-status`;
      
      const separator = redirectUrl.includes('?') ? '&' : '?';
      const finalRedirectUrl = `${redirectUrl}${separator}return_url=${encodeURIComponent(returnUrl)}`;
      
      console.log("Redirect URL:", finalRedirectUrl);
      
      sessionStorage.setItem("currentTransactionId", orderId);
      sessionStorage.setItem("transactionAmount", paymentData.amount);
      sessionStorage.setItem("transactionCurrency", paymentData.currency);
      
      return { success: true, redirectUrl: finalRedirectUrl };
    } else {
      return { success: false, error: "No redirect URL received" };
    }
    
  } catch (error) {
    console.error("Payment API Error:", error.message);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

export const getTransactionStatus = async (transactionId = null) => {
  try {
    const storedId = transactionId || sessionStorage.getItem("currentTransactionId");
    
    if (!storedId) {
      return { success: false, error: "No transaction reference found" };
    }
    
    const statusUrl = `${API_BASE_URL}/transaction/${storedId}/status`;
    
    const response = await fetch(statusUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to retrieve transaction status");
    }
    
    return { success: true, status: data.status, message: data.message };
    
  } catch (error) {
    console.error("Status check error:", error.message);
    return { success: false, error: error.message };
  }
};
