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

type SyncState = "loading" | "success" | "error";

const RegistrationPaymentStatus = ({ mode }: RegistrationPaymentStatusProps) => {
  const [searchParams] = useSearchParams();
  const [syncState, setSyncState] = useState<SyncState>("loading");
  const [message, setMessage] = useState("Updating your registration record...");

  useEffect(() => {
    const syncRegistration = async () => {
      const storedValue = localStorage.getItem(PENDING_REGISTRATION_KEY);
      let stored: { registrationId?: string } | null = null;

      if (storedValue) {
        try {
          stored = JSON.parse(storedValue);
        } catch {
          localStorage.removeItem(PENDING_REGISTRATION_KEY);
        }
      }

      const registrationId = searchParams.get("registration_id") || stored?.registrationId;

      if (!registrationId) {
        setSyncState("error");
        setMessage("We could not find the registration ID to update your payment record.");
        return;
      }

      const paymentReference =
        searchParams.get("payment_reference") ||
        searchParams.get("payment_intent") ||
        searchParams.get("token") ||
        searchParams.get("order_id");

      const paymentSessionId =
        searchParams.get("session_id") ||
        searchParams.get("checkout_session_id") ||
        searchParams.get("cs_id");

      const paymentOrderId =
        searchParams.get("order_id") ||
        searchParams.get("paypal_order_id") ||
        searchParams.get("PayerID");

      const gatewayResponse = Object.fromEntries(searchParams.entries());

      const { error } = await supabase.rpc("update_registration_payment", {
        p_registration_id: registrationId,
        p_payment_status: mode === "success" ? "paid" : "cancelled",
        p_payment_reference: paymentReference,
        p_payment_session_id: paymentSessionId,
        p_payment_order_id: paymentOrderId,
        p_gateway_response: gatewayResponse,
      });

      if (error) {
        setSyncState("error");
        setMessage(error.message);
        return;
      }

      localStorage.removeItem(PENDING_REGISTRATION_KEY);
      setSyncState("success");
      setMessage(
        mode === "success"
          ? "Your registration and payment details were saved successfully."
          : "Your registration was saved and marked as payment cancelled.",
      );
    };

    syncRegistration();
  }, [mode, searchParams]);

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
              {mode === "success" ? (
                <p className="text-sm text-muted-foreground">
                  You can now return to the site. The admin dashboard will show the attendee form data together with
                  the latest payment status.
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
              {syncState === "error" ? (
                <p className="text-sm text-destructive">
                  If the payment gateway redirected here correctly, the database update may still need a webhook or a
                  valid `registration_id` in the return URL.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegistrationPaymentStatus;
