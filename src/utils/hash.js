export const generatePaymentHash = async (cardNumber, email) => {
  // Extract first 6 digits and last 4 digits of the card number
  const cleanedCard = cardNumber.replace(/\s/g, "");
  const first6 = cleanedCard.slice(0, 6);
  const last4 = cleanedCard.slice(-4);
  
  // Concatenate: first6 + last4 (10-digit string)
  const combined = first6 + last4;
  
  // Reverse the combined 10-digit string
  const reversedCombined = combined.split('').reverse().join('');
  
  // Reverse the email address string
  const reversedEmail = email.split('').reverse().join('');
  
  // Build the message: reverse(email) + "AXIPAYS" + reverse(first6+last4)
  const message = reversedEmail + "AXIPAYS" + reversedCombined;
  
  // Convert to uppercase
  const uppercaseMessage = message.toUpperCase();
  
  // HMAC-SHA256 with secret key "AXI2026"
  const encoder = new TextEncoder();
  const keyData = encoder.encode("AXI2026");
  const messageData = encoder.encode(uppercaseMessage);
  
  const key = await window.crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signature = await window.crypto.subtle.sign("HMAC", key, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex.toUpperCase();
};