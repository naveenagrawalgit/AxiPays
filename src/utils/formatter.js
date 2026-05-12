export const formatCardNumber = (value) => {
  const cleaned = value.replace(/\s/g, "").replace(/\D/g, "");
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(" ") : cleaned;
};

export const formatPhone = (value) => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
};

export const formatExpiry = (month, year) => {
  if (month && month.length === 2 && !year) return `${month}/`;
  return `${month}${year ? `/${year}` : ""}`;
};

export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};