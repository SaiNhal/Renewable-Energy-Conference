import { useEffect, useState } from "react";
import { Globe2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type MediaPartner = Tables<"media_partners">;

const fallbackPartners = [
  { name: "Global Materials Review", tier: "Media Partner", website_url: "#", description: "Conference and research media coverage." },
  { name: "NanoTech Journal", tier: "Publishing Partner", website_url: "#", description: "Special issue and post-event dissemination." },
  { name: "Applied Engineering World", tier: "Outreach Partner", website_url: "#", description: "Academic and industry audience amplification." },
];

const MediaPartnersSection = () => {
  const [partners, setPartners] = useState<MediaPartner[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchPartners = async () => {
      const { data } = await supabase
        .from("media_partners")
        .select("*")
        .eq("is_visible", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (isMounted && data) {
        setPartners(data);
      }
    };

    fetchPartners();

    return () => {
      isMounted = false;
    };
  }, []);

  const items = partners.length > 0 ? partners : fallbackPartners;
  const marqueeItems = [...items, ...items];

  return (
    <section className="py-20 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gold text-sm uppercase tracking-wider font-body mb-2">Visibility</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground font-display">Media Partners</h2>
        </div>

        <div className="media-marquee overflow-hidden rounded-3xl border border-border bg-background p-4">
          <div className="media-marquee-track flex gap-6">
            {marqueeItems.map((partner, index) => (
              <a
                key={`${partner.name}-${index}`}
                href={partner.website_url || "#"}
                target={partner.website_url ? "_blank" : undefined}
                rel={partner.website_url ? "noreferrer" : undefined}
                className="min-w-[300px] shrink-0 rounded-3xl border border-border bg-card p-6"
              >
                <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center mb-4">
                  {partner.logo_url ? (
                    <img src={partner.logo_url} alt={partner.name} className="w-10 h-10 rounded-xl object-cover" />
                  ) : (
                    <Globe2 className="text-hero-bg" size={24} />
                  )}
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-gold mb-2">{partner.tier || "Media Partner"}</p>
                <h3 className="font-display text-xl text-card-foreground mb-2">{partner.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{partner.description || "Trusted outreach and publication support for the conference."}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaPartnersSection;
