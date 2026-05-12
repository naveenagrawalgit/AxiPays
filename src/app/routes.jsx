// src/app/routes.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import CheckoutPage from "../pages/CheckoutPage";
import DashboardPage from "../pages/DashboardPage";
import PaymentRedirectPage from "../pages/PaymentRedirectPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CheckoutPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
        
        <Route path="/payment-status" element={<PaymentRedirectPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;