// src/services/paymentApi.js

export const initiatePayment = async (paymentData) => {
  try {
    // ... existing code ...
    
    const response = await fetch(`${API_BASE_URL}/initiate-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Hash": securityHash
      },
      body: JSON.stringify(requestPayload)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Payment initiation failed");
    }
    
    let redirectUrl = data.redirect_url || data.redirection_url;
    
    if (redirectUrl) {
      // CRITICAL: Use YOUR deployed Vercel app URL
      const yourAppUrl = "https://axi-pays-nu.vercel.app";
      const returnUrl = `${yourAppUrl}/payment-status`;
      
      // Append return_url to the redirect URL
      const separator = redirectUrl.includes('?') ? '&' : '?';
      redirectUrl = `${redirectUrl}${separator}return_url=${encodeURIComponent(returnUrl)}`;
      
      console.log("Redirect URL with return param:", redirectUrl);
      console.log("Will redirect back to:", returnUrl);
      
      sessionStorage.setItem("currentTransactionId", orderId);
      sessionStorage.setItem("transactionAmount", paymentData.amount);
      
      return { success: true, redirectUrl: redirectUrl };
    } else {
      throw new Error("No redirect URL received");
    }
    
  } catch (error) {
    console.error("Payment API Error:", error.message);
    return { success: false, error: error.message };
  }
};