import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { type ImportantDateItem, type PricingRow, toLocalDate, useConferenceSettings } from "@/lib/conferenceSettings";

const PENDING_REGISTRATION_KEY = "pendingRegistration";
const SERVICE_CHARGE_RATE = 0.05;

type CategoryKey =
  | "pre-speaker"
  | "pre-poster"
  | "pre-student"
  | "pre-delegate"
  | "pre-virtual"
  | "early-speaker"
  | "early-poster"
  | "early-student"
  | "early-delegate"
  | "early-virtual"
  | "mid-speaker"
  | "mid-poster"
  | "mid-student"
  | "mid-delegate"
  | "onspot-speaker"
  | "onspot-poster"
  | "onspot-student"
  | "onspot-delegate";

type RegistrationCategory = {
  key: CategoryKey;
  label: string;
  price: number;
};

type RegistrationGroup = {
  title: string;
  date: string;
  startDate?: Date;
  endDate: Date;
  categories: RegistrationCategory[];
};

type FormValues = {
  title: string;
  name: string;
  email: string;
  phone: string;
  altEmail: string;
  whatsApp: string;
  organization: string;
  country: string;
};

const titleOptions = ["Mr.", "Ms.", "Mrs.", "Dr.", "Prof."];

const countryOptions = [
  "Australia",
  "Brazil",
  "Canada",
  "China",
  "France",
  "Germany",
  "India",
  "Italy",
  "Japan",
  "Netherlands",
  "Singapore",
  "South Africa",
  "Spain",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Other",
];

const initialForm: FormValues = {
  title: "",
  name: "",
  email: "",
  phone: "",
  altEmail: "",
  whatsApp: "",
  organization: "",
  country: "",
};

const formatUsd = (value: number) => `$${value.toFixed(value % 1 === 0 ? 0 : 2)}`;

const getToday = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

const isGroupAvailable = (group: RegistrationGroup, today: Date) => {
  const startsOn = group.startDate ?? new Date(0);
  return today >= startsOn && today <= group.endDate;
};

const labelForPricingRow = (row: PricingRow) =>
  row.id === "speaker"
    ? "Speaker Presentation"
    : row.id === "poster"
      ? "Poster Presentation"
      : row.id === "student"
        ? "Student Delegate (Listener)"
        : row.category;

const buildRegistrationGroups = (pricingRows: PricingRow[], importantDates: ImportantDateItem[]): RegistrationGroup[] => {
  const dateById = new Map(importantDates.map((date) => [date.id, date]));
  const groupConfigs = [
    { id: "pre-early", prefix: "pre", priceKey: "preEarly" as const, fallbackTitle: "Pre-Early Bird Registration" },
    { id: "early", prefix: "early", priceKey: "earlyBird" as const, fallbackTitle: "Early Bird Registration" },
    { id: "mid", prefix: "mid", priceKey: "midterm" as const, fallbackTitle: "Mid Term Registration" },
    { id: "onspot", prefix: "onspot", priceKey: "onSpot" as const, fallbackTitle: "On-spot Registration" },
  ];

  return groupConfigs.map((config) => {
    const date = dateById.get(config.id);

    return {
      title: date?.title || config.fallbackTitle,
      date: date?.date || "",
      startDate: toLocalDate(date?.startDate),
      endDate: toLocalDate(date?.endDate) ?? new Date(8640000000000000),
      categories: pricingRows.map((row) => ({
        key: `${config.prefix}-${row.id}` as CategoryKey,
        label: labelForPricingRow(row),
        price: row[config.priceKey],
      })),
    };
  });
};

const PricingSection = () => {
  const { toast } = useToast();
  const { importantDates, pricingRows } = useConferenceSettings();
  const [formValues, setFormValues] = useState<FormValues>(initialForm);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<CategoryKey>("pre-speaker");
  const [participants, setParticipants] = useState(1);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = useMemo(getToday, []);
  const registrationGroups = useMemo(
    () => buildRegistrationGroups(pricingRows, importantDates),
    [importantDates, pricingRows],
  );
  const activeGroup = registrationGroups.find((group) => isGroupAvailable(group, today));
  const availableCategories = activeGroup?.categories ?? [];
  const allCategories = registrationGroups.flatMap((group) => group.categories);
  const selectedCategory = allCategories.find((category) => category.key === selectedCategoryKey) ?? allCategories[0];
  const registrationPrice = selectedCategory.price;
  const totalRegistrationPrice = Math.max(registrationPrice * participants - discount, 0);
  const serviceCharge = totalRegistrationPrice * SERVICE_CHARGE_RATE;
  const totalPrice = totalRegistrationPrice + serviceCharge;

  const paymentLinks = useMemo(
    () => ({
      "pre-speaker": import.meta.env.VITE_STRIPE_PAYMENT_LINK_SPEAKER || import.meta.env.VITE_STRIPE_PAYMENT_LINK_ACADEMIC,
      "pre-poster": import.meta.env.VITE_STRIPE_PAYMENT_LINK_POSTER || import.meta.env.VITE_STRIPE_PAYMENT_LINK_BUSINESS,
      "pre-student": import.meta.env.VITE_STRIPE_PAYMENT_LINK_STUDENT,
      "pre-delegate": import.meta.env.VITE_STRIPE_PAYMENT_LINK_DELEGATE || import.meta.env.VITE_STRIPE_PAYMENT_LINK_BUSINESS,
      "pre-virtual": import.meta.env.VITE_STRIPE_PAYMENT_LINK_VIRTUAL,
      "early-speaker": import.meta.env.VITE_STRIPE_PAYMENT_LINK_SPEAKER || import.meta.env.VITE_STRIPE_PAYMENT_LINK_ACADEMIC,
      "early-poster": import.meta.env.VITE_STRIPE_PAYMENT_LINK_POSTER || import.meta.env.VITE_STRIPE_PAYMENT_LINK_BUSINESS,
      "early-student": import.meta.env.VITE_STRIPE_PAYMENT_LINK_STUDENT,
      "early-delegate": import.meta.env.VITE_STRIPE_PAYMENT_LINK_DELEGATE || import.meta.env.VITE_STRIPE_PAYMENT_LINK_BUSINESS,
      "early-virtual": import.meta.env.VITE_STRIPE_PAYMENT_LINK_VIRTUAL,
      "mid-speaker": import.meta.env.VITE_STRIPE_PAYMENT_LINK_SPEAKER || import.meta.env.VITE_STRIPE_PAYMENT_LINK_ACADEMIC,
      "mid-poster": import.meta.env.VITE_STRIPE_PAYMENT_LINK_POSTER || import.meta.env.VITE_STRIPE_PAYMENT_LINK_BUSINESS,
      "mid-student": import.meta.env.VITE_STRIPE_PAYMENT_LINK_STUDENT,
      "mid-delegate": import.meta.env.VITE_STRIPE_PAYMENT_LINK_DELEGATE || import.meta.env.VITE_STRIPE_PAYMENT_LINK_BUSINESS,
      "onspot-speaker": import.meta.env.VITE_STRIPE_PAYMENT_LINK_SPEAKER || import.meta.env.VITE_STRIPE_PAYMENT_LINK_ACADEMIC,
      "onspot-poster": import.meta.env.VITE_STRIPE_PAYMENT_LINK_POSTER || import.meta.env.VITE_STRIPE_PAYMENT_LINK_BUSINESS,
      "onspot-student": import.meta.env.VITE_STRIPE_PAYMENT_LINK_STUDENT,
      "onspot-delegate": import.meta.env.VITE_STRIPE_PAYMENT_LINK_DELEGATE || import.meta.env.VITE_STRIPE_PAYMENT_LINK_BUSINESS,
    }),
    [],
  );

  useEffect(() => {
    if (availableCategories.length && !availableCategories.some((category) => category.key === selectedCategoryKey)) {
      setSelectedCategoryKey(availableCategories[0].key);
    }
  }, [availableCategories, selectedCategoryKey]);

  const updateFormValue = (field: keyof FormValues, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const handleApplyCoupon = () => {
    setDiscount(0);
    toast({
      title: "Coupon applied",
      description: couponCode.trim() ? "No discount is configured for this coupon." : "Enter a coupon code to apply.",
    });
  };

  const handleReset = () => {
    setFormValues(initialForm);
    setSelectedCategoryKey(availableCategories[0]?.key ?? "pre-speaker");
    setParticipants(1);
    setCouponCode("");
    setDiscount(0);
  };

  const handleProceed = async () => {
    const requiredFields: Array<keyof FormValues> = ["title", "name", "email", "organization", "country"];
    const hasMissingField = requiredFields.some((field) => !formValues[field].trim());

    if (!availableCategories.some((category) => category.key === selectedCategoryKey)) {
      toast({
        title: "Registration period is not available",
        description: "Please select an option from the currently open registration period.",
        variant: "destructive",
      });
      return;
    }

    if (hasMissingField) {
      toast({
        title: "Complete required fields",
        description: "Title, Name, Email, Organization, and Country are required.",
        variant: "destructive",
      });
      return;
    }

    if (!formValues.email.includes("@")) {
      toast({
        title: "Enter a valid email",
        description: "Email must include @.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const link = paymentLinks[selectedCategory.key];
    const notes = [
      formValues.altEmail ? `Alt Email: ${formValues.altEmail}` : "",
      formValues.whatsApp ? `WhatsApp Number: ${formValues.whatsApp}` : "",
      `Participants: ${participants}`,
      `Discount: ${formatUsd(discount)}`,
      `Service Charge: ${formatUsd(serviceCharge)}`,
      `Total Price: ${formatUsd(totalPrice)}`,
      couponCode.trim() ? `Coupon: ${couponCode.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const { data, error } = await supabase
      .from("registration_intents")
      .insert({
        full_name: [formValues.title, formValues.name].filter(Boolean).join(" "),
        email: formValues.email.trim(),
        phone: formValues.phone.trim() || formValues.whatsApp.trim() || "Not provided",
        affiliation: formValues.organization.trim(),
        country: formValues.country,
        designation: selectedCategory.label,
        notes,
        plan_key: selectedCategory.key,
        plan_name: selectedCategory.label,
        payment_provider: "stripe",
        amount_usd: totalPrice,
        currency: "USD",
        payment_status: "pending",
        status: link ? "payment_pending" : "initiated",
        redirect_url: link || null,
        redirected_at: link ? new Date().toISOString() : null,
      })
      .select("id")
      .single();

    if (error || !data) {
      setIsSubmitting(false);
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
        provider: "stripe",
        planKey: selectedCategory.key,
        planName: selectedCategory.label,
        email: formValues.email.trim(),
        createdAt: new Date().toISOString(),
      }),
    );

    toast({
      title: "Registration started",
      description: link ? "Redirecting to payment." : "Registration details were saved.",
    });

    if (link) {
      window.location.href = link;
      return;
    }

    setIsSubmitting(false);
  };

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-md border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-6 font-display text-3xl font-bold text-card-foreground">Registration</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Title*</label>
                <Select value={formValues.title} onValueChange={(value) => updateFormValue("title", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {titleOptions.map((title) => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Name*</label>
                <Input placeholder="Name" value={formValues.name} onChange={(event) => updateFormValue("name", event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Email*</label>
                <Input type="email" placeholder="Email" value={formValues.email} onChange={(event) => updateFormValue("email", event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Phone</label>
                <Input placeholder="Phone" value={formValues.phone} onChange={(event) => updateFormValue("phone", event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Alt Email</label>
                <Input type="email" placeholder="Email" value={formValues.altEmail} onChange={(event) => updateFormValue("altEmail", event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">WhatsApp Number</label>
                <Input placeholder="WhatsApp Number" value={formValues.whatsApp} onChange={(event) => updateFormValue("whatsApp", event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Organization*</label>
                <Input placeholder="Organization" value={formValues.organization} onChange={(event) => updateFormValue("organization", event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Country*</label>
                <Select value={formValues.country} onValueChange={(value) => updateFormValue("country", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              {registrationGroups.map((group) => (
                <div
                  key={group.title}
                  className={`rounded-md border p-4 ${
                    isGroupAvailable(group, today)
                      ? "border-teal/50 bg-background"
                      : "border-border bg-muted/30 opacity-60"
                  }`}
                >
                  <div className="mb-4">
                    <h3 className="font-display text-xl font-bold text-foreground">{group.title}</h3>
                    <p className="text-sm font-semibold text-muted-foreground">{group.date}</p>
                    {isGroupAvailable(group, today) && (
                      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-teal">Open now</p>
                    )}
                  </div>
                  <div className="divide-y divide-border">
                    {group.categories.map((category) => {
                      const isAvailable = isGroupAvailable(group, today);

                      return (
                      <label
                        key={category.key}
                        className={`flex items-center justify-between gap-4 py-3 text-sm ${
                          isAvailable ? "cursor-pointer text-foreground" : "cursor-not-allowed text-muted-foreground"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="registration-category"
                            checked={selectedCategoryKey === category.key}
                            onChange={() => setSelectedCategoryKey(category.key)}
                            disabled={!isAvailable}
                            className="h-4 w-4 accent-teal"
                          />
                          <span>{category.label}</span>
                        </span>
                        <span className="font-bold">{formatUsd(category.price)}</span>
                      </label>
                    )})}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-md border border-border bg-card p-6 shadow-sm">
              <label className="mb-2 block text-sm font-semibold text-foreground">
                No. of Participants ( $ under category )
              </label>
              <Input
                min={1}
                type="number"
                value={participants}
                onChange={(event) => setParticipants(Math.max(Number(event.target.value) || 1, 1))}
              />

              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                <Input placeholder="Apply Coupon" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} />
                <Button type="button" variant="outline" onClick={handleApplyCoupon}>
                  Apply Coupon
                </Button>
              </div>

              <div className="mt-8">
                <h3 className="mb-4 font-display text-2xl font-bold text-card-foreground">Registration Summary</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p className="flex justify-between gap-4">
                    <span>A. Registration Price:</span>
                    <span className="font-semibold text-foreground">{formatUsd(registrationPrice)}</span>
                  </p>
                  <p className="flex justify-between gap-4">
                    <span>B. Participants:</span>
                    <span className="font-semibold text-foreground">{participants}</span>
                  </p>
                  <p className="flex justify-between gap-4">
                    <span>C. Discount:</span>
                    <span className="font-semibold text-foreground">-{discount}</span>
                  </p>
                  <p className="flex justify-between gap-4">
                    <span>D. Total Registration Price(A*B-C):</span>
                    <span className="font-semibold text-foreground">{formatUsd(totalRegistrationPrice)}</span>
                  </p>
                  <p className="flex justify-between gap-4">
                    <span>I. Service Charge:</span>
                    <span className="font-semibold text-foreground">{formatUsd(serviceCharge)}</span>
                  </p>
                  <p className="flex justify-between gap-4 border-t border-border pt-3 text-base font-bold text-foreground">
                    <span>Total Price(D+G+H+I):</span>
                    <span>{formatUsd(totalPrice)}</span>
                  </p>
                </div>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
                By clicking "Proceed to Register", you agree to the privacy policy, terms & conditions and cancellation
                policy.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                  reset
                </Button>
                <Button type="button" onClick={handleProceed} disabled={isSubmitting} className="flex-1 bg-teal text-white hover:bg-teal/85">
                  proceed to register
                </Button>
              </div>
            </div>

            <InfoBlock title="Refund & Cancellation Policy">
              <p>All cancellation requests must be submitted in writing via email to the Conference Secretariat.</p>
              <p>Cancellation before 50 days of the conference: 50% refund</p>
              <p>Cancellation before 40 days of the conference: 30% refund</p>
              <p>Cancellation within 30 days of the conference: No refund</p>
              <p>Registration may be transferred to another participant if the registered attendee is unable to participate.</p>
              <p>Eligible refunds will be processed within 4 weeks after the completion of the conference.</p>
            </InfoBlock>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <InfoBlock title="Important Note">
            <p>
              If the virtual conference is postponed due to unavoidable circumstances beyond the organizers' control,
              including technical disruptions, force majeure events, government restrictions, cyber incidents, or other
              emergency situations, refunds will not be applicable. In such cases, registrations will remain valid for
              the rescheduled event or future conference edition.
            </p>
          </InfoBlock>

          <InfoBlock title="Terms & Conditions">
            <p>By registering for the virtual conference, participants agree to all conference terms and policies.</p>
            <p>The organizers reserve the right to modify the conference program, speakers, schedule, or virtual platform if necessary.</p>
            <p>Participants are responsible for ensuring stable internet connectivity and access to the required virtual meeting platform.</p>
            <p>Conference access links and participation details will be shared with registered participants before the event.</p>
            <p>Recording, redistribution, or unauthorized sharing of conference materials or access links is strictly prohibited.</p>
            <p>In unavoidable circumstances, the conference may be postponed or rescheduled without prior notice.</p>
            <p>If the conference is postponed, registrations will remain valid for the rescheduled event or future edition.</p>
            <p>Participants are advised to regularly check the official conference website and registered email for updates and announcements.</p>
          </InfoBlock>

          <InfoBlock title="Why Participate?">
            <p>Present your research to a global audience from anywhere</p>
            <p>Network with international researchers and industry experts</p>
            <p>Receive official presentation and participation certificates</p>
            <p>Opportunity for publication and academic collaboration</p>
            <p>Flexible and convenient virtual participation experience</p>
          </InfoBlock>
        </div>
      </div>
    </section>
  );
};

const InfoBlock = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="rounded-md border border-border bg-card p-6 shadow-sm">
    <h3 className="mb-4 font-display text-xl font-bold text-card-foreground">{title}</h3>
    <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
  </div>
);

export default PricingSection;
