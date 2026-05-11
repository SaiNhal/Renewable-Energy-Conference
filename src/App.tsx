import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Speakers from "./pages/Speakers.tsx";
import AbstractSubmission from "./pages/AbstractSubmission.tsx";
import Registration from "./pages/Registration.tsx";
import Sessions from "./pages/Sessions.tsx";
import Information from "./pages/Information.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import Admin from "./pages/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";
import RegistrationPaymentStatus from "./pages/RegistrationPaymentStatus.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/speakers" element={<Speakers />} />
            <Route path="/abstract-submission" element={<AbstractSubmission />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/registration/success" element={<RegistrationPaymentStatus mode="success" />} />
            <Route path="/registration/cancel" element={<RegistrationPaymentStatus mode="cancel" />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/information" element={<Information />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
