import React, { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import ScrollToTop from "./components/ScrollToTop.tsx";

const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Speakers = lazy(() => import("./pages/Speakers"));
const AbstractSubmission = lazy(() => import("./pages/AbstractSubmission"));
const Registration = lazy(() => import("./pages/Registration"));
const ImportantDatesPage = lazy(() => import("./pages/ImportantDatesPage"));
const Information = lazy(() => import("./pages/Information"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RegistrationPaymentStatus = lazy(() => import("./pages/RegistrationPaymentStatus"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading…</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/speakers" element={<Speakers />} />
              <Route path="/abstract-submission" element={<AbstractSubmission />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/important-dates" element={<ImportantDatesPage />} />
              <Route path="/registration/success" element={<RegistrationPaymentStatus mode="success" />} />
              <Route path="/registration/cancel" element={<RegistrationPaymentStatus mode="cancel" />} />
              <Route path="/sessions" element={<Navigate to="/abstract-submission#scientific-sessions" replace />} />
              <Route path="/information" element={<Information />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
