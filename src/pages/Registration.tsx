import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";

const Registration = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 hero-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gold font-display mb-4">Registration</h1>
          <p className="text-hero-foreground/80 font-body max-w-2xl mx-auto">
            Choose the registration plan that best suits you
          </p>
        </div>
      </div>
      <div className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-card-foreground mb-3">Registration Flow</h2>
            <p className="text-sm text-muted-foreground font-body mb-6">
              Choose your plan first. After clicking Proceed, the attendee details form will open and then continue to
              the selected payment gateway.
            </p>
          </div>
        </div>
      </div>
      <div className="py-6 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Who Should Attend",
                text: "Researchers, students, academicians, policy leaders, engineers, startups, consultants, NGOs, and clean energy professionals.",
              },
              {
                title: "What You Receive",
                text: "Live and recorded session access, abstract book, e-certificate, publication support, presentation visibility, and networking opportunities.",
              },
              {
                title: "How It Works",
                text: "Choose a plan, click Proceed, fill your attendee details, then continue to Stripe or PayPal on the secure hosted checkout page.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-display text-xl text-card-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <PricingSection />
      <div className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-card border border-border rounded-xl p-8 mb-6">
            <h2 className="font-display text-2xl font-bold text-card-foreground mb-4">Registration Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground text-sm font-body">
              <div className="space-y-2">
                <p>- Present your research from anywhere</p>
                <p>- Access to live and recorded sessions</p>
                <p>- E-copy of the abstract book and program</p>
                <p>- E-certificate of participation or presentation</p>
              </div>
              <div className="space-y-2">
                <p>- Publication support in proceedings with ISBN/e-ISBN</p>
                <p>- Global recognition on the conference website</p>
                <p>- Eligibility for speaker and researcher awards</p>
                <p>- Digital networking with international experts</p>
              </div>
            </div>
          </div>
          <div className="bg-muted/60 border border-border rounded-xl p-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-3">Payment Setup</h2>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              Each plan now supports both Stripe and PayPal. Add your hosted checkout links in
              <span className="mx-1 font-mono text-foreground">.env</span>
              using the category-specific variables from
              <span className="mx-1 font-mono text-foreground">.env.example</span>
              and the Proceed button will redirect visitors to the selected payment gateway. For final payment status
              tracking, configure your gateway success and cancel URLs to return to
              <span className="mx-1 font-mono text-foreground">/registration/success</span>
              and
              <span className="mx-1 font-mono text-foreground">/registration/cancel</span>.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Registration;
