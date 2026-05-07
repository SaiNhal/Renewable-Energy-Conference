import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, CreditCard, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PENDING_REGISTRATION_KEY = "pendingRegistration";

type PlanKey = "speaker" | "poster" | "student" | "delegate";

type PaymentProvider = "stripe" | "paypal";

export interface RegistrationFormValues {
  title: string;
  fullName: string;
  email: string;
  phone: string;
  affiliation: string;
  country: string;
  designation: string;
  notes: string;
}

type RegistrationField =
  | "title"
  | "fullName"
  | "email"
  | "phone"
  | "affiliation"
  | "country"
  | "designation"
  | "affiliationType";

const plans: Array<{ key: PlanKey; name: string; price: number; color: string; featured?: boolean }> = [
  { key: "speaker", name: "Speaker", price: 149, color: "from-teal to-[#126c70]", featured: true },
  { key: "poster", name: "Poster", price: 99, color: "from-[#126c70] to-teal" },
  { key: "student", name: "Student Listener", price: 59, color: "from-gold to-gold-light" },
  { key: "delegate", name: "Delegate", price: 49, color: "from-teal to-gold" },
];

const features = [
  "Live and recorded session access",
  "E-copy of Abstract Book and Program",
  "E-Certificate",
  "Publication support in proceedings",
  "Digital networking access",
  "Award eligibility",
];

const designationOptions = [
  "Student",
  "Research Scholar",
  "Postdoctoral Researcher",
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Scientist",
  "Industry Professional",
  "Entrepreneur",
  "Other",
];

const titleOptions = ["Mr.", "Ms.", "Mrs.", "Dr.", "Prof."];

const countryOptions = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United States",
  "United Kingdom",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
  "Other",
];

const initialForm: RegistrationFormValues = {
  title: "",
  fullName: "",
  email: "",
  phone: "",
  affiliation: "",
  country: "",
  designation: "",
  notes: "",
};

const PricingSection = () => {
  const { toast } = useToast();
  const [selectedPlanKey, setSelectedPlanKey] = useState<PlanKey | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [detailsSubmitted, setDetailsSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<RegistrationField, string>>>({});
  const [affiliationType, setAffiliationType] = useState<"university" | "organization" | "">("");
  const [registrationDetails, setRegistrationDetails] = useState<RegistrationFormValues>(initialForm);

  const paymentLinks = useMemo(
    () => ({
      student: {
        stripe: import.meta.env.VITE_STRIPE_PAYMENT_LINK_STUDENT,
        paypal: import.meta.env.VITE_PAYPAL_PAYMENT_LINK_STUDENT,
      },
      speaker: {
        stripe: import.meta.env.VITE_STRIPE_PAYMENT_LINK_SPEAKER || import.meta.env.VITE_STRIPE_PAYMENT_LINK_ACADEMIC,
        paypal: import.meta.env.VITE_PAYPAL_PAYMENT_LINK_SPEAKER || import.meta.env.VITE_PAYPAL_PAYMENT_LINK_ACADEMIC,
      },
      poster: {
        stripe: import.meta.env.VITE_STRIPE_PAYMENT_LINK_POSTER || import.meta.env.VITE_STRIPE_PAYMENT_LINK_BUSINESS,
        paypal: import.meta.env.VITE_PAYPAL_PAYMENT_LINK_POSTER || import.meta.env.VITE_PAYPAL_PAYMENT_LINK_BUSINESS,
      },
      delegate: {
        stripe: import.meta.env.VITE_STRIPE_PAYMENT_LINK_DELEGATE || import.meta.env.VITE_STRIPE_PAYMENT_LINK_BUSINESS,
        paypal: import.meta.env.VITE_PAYPAL_PAYMENT_LINK_DELEGATE || import.meta.env.VITE_PAYPAL_PAYMENT_LINK_BUSINESS,
      },
    }),
    [],
  );

  const selectedPlan = plans.find((plan) => plan.key === selectedPlanKey) ?? null;
  const affiliationPlaceholder =
    affiliationType === "university"
      ? "Enter university name"
      : affiliationType === "organization"
        ? "Enter organization name"
        : "Institution or company";

  const handleProceed = (planKey: PlanKey) => {
    setSelectedPlanKey(planKey);
    setDetailsSubmitted(false);
    setFieldErrors({});
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setSelectedPlanKey(null);
      setIsRedirecting(false);
      setDetailsSubmitted(false);
      setAffiliationType("");
      setFieldErrors({});
    }
  };

  const handleDetailsSubmit = () => {
    if (!selectedPlan) {
      return;
    }

    const nextErrors: Partial<Record<RegistrationField, string>> = {};

    if (!registrationDetails.title.trim()) nextErrors.title = "Title is required";
    if (!registrationDetails.fullName.trim()) nextErrors.fullName = "Full Name is required";
    if (!registrationDetails.phone.trim()) nextErrors.phone = "Phone Number is required";
    if (!registrationDetails.email.trim()) nextErrors.email = "Email Address is required";
    if (!affiliationType) nextErrors.affiliationType = "Select University or Organization";
    if (!registrationDetails.affiliation.trim()) nextErrors.affiliation = "Affiliation is required";
    if (!registrationDetails.country.trim()) nextErrors.country = "Country is required";
    if (!registrationDetails.designation.trim()) nextErrors.designation = "Designation is required";

    if (registrationDetails.phone.trim() && !/^\d+$/.test(registrationDetails.phone.trim())) {
      nextErrors.phone = "Phone Number must contain numbers only";
    }

    if (registrationDetails.email.trim() && !registrationDetails.email.includes("@")) {
      nextErrors.email = "Email Address must include @";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      toast({
        title: "Complete attendee details",
        description: "Please fix the highlighted fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setFieldErrors({});
    setDetailsSubmitted(true);
    toast({
      title: "Details submitted",
      description: `${selectedPlan.name} selected successfully. You can continue to payment now.`,
    });
  };

  const handlePaymentRedirect = async (provider: PaymentProvider) => {
    if (!selectedPlan) {
      return;
    }

    if (!detailsSubmitted) {
      toast({
        title: "Submit details first",
        description: "Please submit the attendee details before choosing a payment gateway.",
        variant: "destructive",
      });
      return;
    }

    const link = paymentLinks[selectedPlan.key][provider];

    if (!link) {
      toast({
        title: `${provider === "stripe" ? "Stripe" : "PayPal"} link missing`,
        description: `Add the ${provider} checkout URL for ${selectedPlan.name} in your Vite environment variables.`,
        variant: "destructive",
      });
      return;
    }

    setIsRedirecting(true);

    const payload = {
      full_name: [registrationDetails.title.trim(), registrationDetails.fullName.trim()].filter(Boolean).join(" "),
      email: registrationDetails.email.trim(),
      phone: registrationDetails.phone.trim(),
      affiliation: registrationDetails.affiliation.trim() || null,
      country: registrationDetails.country.trim() || null,
      designation: registrationDetails.designation.trim() || null,
      notes: registrationDetails.notes.trim() || null,
      plan_key: selectedPlan.key,
      plan_name: selectedPlan.name,
      payment_provider: provider,
      amount_usd: selectedPlan.price,
      currency: "USD",
      payment_status: "pending",
      status: "payment_pending",
      redirect_url: link,
      redirected_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("registration_intents")
      .insert(payload)
      .select("id")
      .single();

    if (error || !data) {
      setIsRedirecting(false);
      toast({
        title: "Could not start registration",
        description: error?.message || "Unknown error",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem(
      PENDING_REGISTRATION_KEY,
      JSON.stringify({
        registrationId: data.id,
        provider,
        planKey: selectedPlan.key,
        planName: selectedPlan.name,
        email: registrationDetails.email.trim(),
        createdAt: new Date().toISOString(),
      }),
    );

    toast({
      title: "Registration Started!",
      description: `Redirecting to ${provider === "stripe" ? "Stripe" : "PayPal"} for ${selectedPlan.name}.`,
    });

    window.location.href = link;
  };

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="section-kicker mb-2">Get Your</p>
          <h2 className="text-3xl font-extrabold text-foreground md:text-4xl">Registration</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`overflow-hidden rounded-md border bg-card card-hover ${
                plan.featured ? "border-teal shadow-lg shadow-teal/10 md:scale-105" : "border-border"
              }`}
            >
              <div className={`bg-gradient-to-r ${plan.color} p-6 text-center`}>
                <h3 className="font-display text-lg font-bold text-white">{plan.name}</h3>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <span className="text-muted-foreground font-body">$</span>
                  <span className="text-5xl font-extrabold text-card-foreground">{plan.price}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check size={16} className="text-teal flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleProceed(plan.key)}
                  className="w-full bg-teal text-white hover:bg-teal/85"
                >
                  Proceed
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedPlan} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Attendee Details</DialogTitle>
            <DialogDescription>
              {selectedPlan
                ? `Fill in your details for ${selectedPlan.name}, submit them, and then continue to Stripe or PayPal.`
                : "Complete your details and select a payment method."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title *</label>
                <Select
                  value={registrationDetails.title}
                  onValueChange={(value) => {
                    setRegistrationDetails((current) => ({ ...current, title: value }));
                    setFieldErrors((current) => ({ ...current, title: undefined }));
                  }}
                >
                  <SelectTrigger className={fieldErrors.title ? "border-destructive focus:ring-destructive" : ""}>
                    <SelectValue placeholder="Select Title" />
                  </SelectTrigger>
                  <SelectContent>
                    {titleOptions.map((title) => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.title ? <p className="text-xs text-destructive">{fieldErrors.title}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name *</label>
                <Input
                  className={fieldErrors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}
                  placeholder="Enter your full name"
                  value={registrationDetails.fullName}
                  onChange={(e) => {
                    setRegistrationDetails((current) => ({ ...current, fullName: e.target.value }));
                    setFieldErrors((current) => ({ ...current, fullName: undefined }));
                  }}
                />
                {fieldErrors.fullName ? <p className="text-xs text-destructive">{fieldErrors.fullName}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number *</label>
                <Input
                  className={fieldErrors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                  placeholder="Enter your phone number"
                  value={registrationDetails.phone}
                  inputMode="numeric"
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D+/g, "");
                    setRegistrationDetails((current) => ({ ...current, phone: numericValue }));
                    setFieldErrors((current) => ({ ...current, phone: undefined }));
                  }}
                />
                {fieldErrors.phone ? <p className="text-xs text-destructive">{fieldErrors.phone}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address *</label>
                <Input
                  className={fieldErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                  type="email"
                  placeholder="Enter your email address"
                  value={registrationDetails.email}
                  onChange={(e) => {
                    setRegistrationDetails((current) => ({ ...current, email: e.target.value }));
                    setFieldErrors((current) => ({ ...current, email: undefined }));
                  }}
                />
                {fieldErrors.email ? <p className="text-xs text-destructive">{fieldErrors.email}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Affiliation *</label>
                <div className="flex flex-wrap gap-4 pb-1">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Checkbox
                      checked={affiliationType === "university"}
                      onCheckedChange={(checked) =>
                        {
                          setAffiliationType(checked === true ? "university" : "");
                          setFieldErrors((current) => ({ ...current, affiliationType: undefined }));
                        }
                      }
                    />
                    <span>University</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Checkbox
                      checked={affiliationType === "organization"}
                      onCheckedChange={(checked) =>
                        {
                          setAffiliationType(checked === true ? "organization" : "");
                          setFieldErrors((current) => ({ ...current, affiliationType: undefined }));
                        }
                      }
                    />
                    <span>Organization</span>
                  </label>
                </div>
                {fieldErrors.affiliationType ? <p className="text-xs text-destructive">{fieldErrors.affiliationType}</p> : null}
                <Input
                  className={fieldErrors.affiliation ? "border-destructive focus-visible:ring-destructive" : ""}
                  placeholder={affiliationPlaceholder}
                  value={registrationDetails.affiliation}
                  onChange={(e) => {
                    setRegistrationDetails((current) => ({ ...current, affiliation: e.target.value }));
                    setFieldErrors((current) => ({ ...current, affiliation: undefined }));
                  }}
                />
                {fieldErrors.affiliation ? <p className="text-xs text-destructive">{fieldErrors.affiliation}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Country *</label>
                <Select
                  value={registrationDetails.country}
                  onValueChange={(value) => {
                    setRegistrationDetails((current) => ({ ...current, country: value }));
                    setFieldErrors((current) => ({ ...current, country: undefined }));
                  }}
                >
                  <SelectTrigger className={fieldErrors.country ? "border-destructive focus:ring-destructive" : ""}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.country ? <p className="text-xs text-destructive">{fieldErrors.country}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Designation *</label>
                <Select
                  value={registrationDetails.designation}
                  onValueChange={(value) => {
                    setRegistrationDetails((current) => ({ ...current, designation: value }));
                    setFieldErrors((current) => ({ ...current, designation: undefined }));
                  }}
                >
                  <SelectTrigger className={fieldErrors.designation ? "border-destructive focus:ring-destructive" : ""}>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {designationOptions.map((designation) => (
                      <SelectItem key={designation} value={designation}>
                        {designation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.designation ? <p className="text-xs text-destructive">{fieldErrors.designation}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Notes</label>
                <Textarea
                  placeholder="Any extra information, billing note, or participation details"
                  value={registrationDetails.notes}
                  onChange={(e) => setRegistrationDetails((current) => ({ ...current, notes: e.target.value }))}
                />
              </div>
            </div>

            {!detailsSubmitted ? (
              <Button
                type="button"
                onClick={handleDetailsSubmit}
                className="w-full gold-gradient text-hero-bg font-semibold hover:opacity-90 font-body"
              >
                Submit Details
              </Button>
            ) : null}

            {detailsSubmitted && selectedPlan ? (
              <div className="space-y-3">
                <div className="rounded-xl border border-gold/30 bg-gold/5 px-4 py-3">
                  <p className="text-sm font-semibold text-foreground">
                    Registration successful for {selectedPlan.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Choose your payment gateway to complete the payment.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handlePaymentRedirect("stripe")}
                  disabled={isRedirecting}
                  className="w-full rounded-xl border border-border bg-card px-4 py-4 text-left transition-colors hover:border-gold hover:bg-gold/5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#635bff] text-white">
                      <CreditCard size={20} />
                    </span>
                    <span className="flex-1">
                      <span className="block font-semibold text-card-foreground">Continue with Stripe</span>
                      <span className="block text-sm text-muted-foreground">Card checkout and hosted payment page</span>
                    </span>
                    <ExternalLink size={16} className="text-muted-foreground" />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePaymentRedirect("paypal")}
                  disabled={isRedirecting}
                  className="w-full rounded-xl border border-border bg-card px-4 py-4 text-left transition-colors hover:border-gold hover:bg-gold/5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#003087] text-white font-bold text-sm">
                      PP
                    </span>
                    <span className="flex-1">
                      <span className="block font-semibold text-card-foreground">Continue with PayPal</span>
                      <span className="block text-sm text-muted-foreground">PayPal checkout and wallet-based payment</span>
                    </span>
                    <ExternalLink size={16} className="text-muted-foreground" />
                  </span>
                </button>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PricingSection;
