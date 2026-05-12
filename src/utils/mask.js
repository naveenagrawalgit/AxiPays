/**
 * Masks credit card number showing only first 6 and last 4 digits
 * @param {string} cardNumber - Raw card number
 * @returns {string} Masked card number
 */
export const maskCardNumber = (cardNumber) => {
  if (!cardNumber) return "•••• •••• •••• ••••";
  const cleaned = cardNumber.replace(/\s/g, "");
  if (cleaned.length < 10) return "•••• •••• •••• ••••";
  const firstSix = cleaned.slice(0, 6);
  const lastFour = cleaned.slice(-4);
  const maskedMiddle = "•".repeat(Math.min(cleaned.length - 10, 6));
  const masked = `${firstSix}${maskedMiddle}${lastFour}`;
  return masked.match(/.{1,4}/g)?.join(" ") || masked;
};

/**
 * Masks CVV code completely
 * @param {string} cvv - Raw CVV code
 * @returns {string} Masked CVV
 */
export const maskCVV = (cvv) => {
  if (!cvv) return "•••";
  return "•".repeat(Math.min(cvv.length, 4));
};

/**
 * Masks email address showing only first 2 characters and domain
 * @param {string} email - Raw email address
 * @returns {string} Masked email
 */
export const maskEmail = (email) => {
  if (!email) return "•••@•••.com";
  const [localPart, domain] = email.split('@');
  if (!domain) return email;
  const maskedLocal = localPart.length > 2 
    ? localPart.slice(0, 2) + "•••" 
    : "•••";
  return `${maskedLocal}@${domain}`;
};