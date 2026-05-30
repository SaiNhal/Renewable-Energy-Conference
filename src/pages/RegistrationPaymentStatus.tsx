import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const PENDING_REGISTRATION_KEY = "pendingRegistration";

type RegistrationPaymentStatusProps = {
  mode: "success" | "cancel";
};

const RegistrationPaymentStatus = ({ mode }: RegistrationPaymentStatusProps) => {
  const [searchParams] = useSearchParams();
  const [paypalMessage, setPaypalMessage] = useState("");

  useEffect(() => {
    const finalizePayment = async () => {
      const provider = searchParams.get("provider");
      const registrationId = searchParams.get("registration_id");
      const paypalOrderId = searchParams.get("token");

      if (mode === "success" && registrationId) {
        localStorage.removeItem(PENDING_REGISTRATION_KEY);
      }

      if (mode !== "success" || provider !== "paypal" || !registrationId || !paypalOrderId) {
        return;
      }

      setPaypalMessage("Capturing your PayPal payment...");

      const { data, error } = await supabase.functions.invoke<{ status?: string; error?: string }>("capture-paypal-order", {
        body: {
          registrationId,
          orderId: paypalOrderId,
        },
      });

      if (error || data?.status !== "paid") {
        setPaypalMessage(data?.error || error?.message || "PayPal payment could not be captured. Please contact support.");
        return;
      }

      setPaypalMessage("PayPal payment captured successfully. Your registration is marked as paid.");
    };

    void finalizePayment();
  }, [mode, searchParams]);

  useEffect(() => {
    if (mode === "cancel" && searchParams.get("registration_id")) {
      localStorage.removeItem(PENDING_REGISTRATION_KEY);
    }
  }, [mode, searchParams]);

  const message =
    mode === "success"
      ? "Thank you. Your payment was completed and is being verified by the payment gateway."
      : "The payment was cancelled. Your attendee details were saved, but the registration is not marked as paid.";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-3xl">
                {mode === "success" ? "Payment Successful" : "Payment Cancelled"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{message}</p>
              {paypalMessage ? <p className="text-sm font-medium text-teal">{paypalMessage}</p> : null}
              {mode === "success" ? (
                <p className="text-sm text-muted-foreground">
                  Stripe payments are confirmed by webhook. PayPal payments are captured when this page loads after
                  approval.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  The attendee details are still stored. If needed, the user can start payment again from the
                  registration page.
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/registration">Back to Registration</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/">Go Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegistrationPaymentStatus;
