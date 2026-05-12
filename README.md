# AXIPAYS Payment System

A complete payment checkout system with transaction dashboard, card validation, and analytics.

## Project Structure

```
src/
  pages/          CheckoutPage, DashboardPage, PaymentRedirectPage
  components/     CheckoutForm, OrderSummary, Header, Footer, Layout
  hooks/          usePaymentForm, usePayment
  services/       paymentApi
  utils/          formatter, hash, luhn, mask, validation
  app/            routes
```

## How It Works

**Checkout Flow**
User fills card details → Form validates (Luhn check, expiry, CVV) → API called with HMAC-SHA256 hash → Redirect to payment gateway → Return to app → Show success/failed modal

**Dashboard**
Fetches all transactions → Shows summary cards → Displays charts (status breakdown, weekly volume, currency distribution) → Searchable transaction table with pagination

## Key Features

- Luhn algorithm card validation
- Card masking (first 6 and last 4 only)
- HMAC-SHA256 hash authentication
- Real-time form validation
- Responsive charts using SVG
- Transaction history with search and filter

## Test Cards

- Success: 4000000000000002
- Pending: 4000000000000000
- Failed: 4000000000000001

Use expiry 12/2028 and CVV 123

## Tech Stack

React, Tailwind CSS, Daisy UI, Lucide Icons, React Router DOM

## Live Demo

https://axi-pays-nu.vercel.app

## Run Locally

```
npm install
npm run dev
```

## Security

- No raw card numbers logged or displayed
- CVV always masked
- HMAC-SHA256 for API authentication
- Luhn validation before submission