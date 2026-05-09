import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Speaker = Tables<"speakers">;

const isCommitteeMember = (speaker: Speaker) =>
  (speaker.session_type || "").toLowerCase().includes("committee");

interface SpeakersSectionProps {
  showEmptyState?: boolean;
}

const SpeakersSection = ({ showEmptyState = true }: SpeakersSectionProps) => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchSpeakers = async () => {
      const { data } = await supabase
        .from("speakers")
        .select("*")
        .eq("is_visible", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (isMounted && data) {
        setSpeakers(data.filter((speaker) => !isCommitteeMember(speaker)));
      }
    };

    fetchSpeakers();

    return () => {
      isMounted = false;
    };
  }, []);

  if (speakers.length === 0) {
    if (!showEmptyState) {
      return null;
    }

    return (
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <p className="text-gold text-sm uppercase tracking-wider font-body mb-2">Confirmed</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-display">
              Speakers Coming Soon
            </h2>
          </div>
          <div className="rounded-[2rem] border border-gold/30 bg-gradient-to-br from-slate-900/95 via-slate-950 to-slate-900/95 p-12 text-center shadow-[0_30px_90px_rgba(234,179,8,0.12)]">
            <p className="text-slate-200 leading-8">
              Speakers will appear here once they are finalized. Stay tuned for updates as we assemble a team of experts to organize an unforgettable conference experience.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 section-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gold text-sm uppercase tracking-wider font-body mb-2">Confirmed</p>
          <h2 className="text-3xl md:text-4xl font-bold text-hero-foreground font-display">
            Speakers
          </h2>
        </div>

        <div className="media-marquee overflow-hidden rounded-3xl border border-border/40 bg-background/5 p-4">
          <div className="media-marquee-track flex gap-6">
          {[...speakers, ...speakers].map((speaker, i) => (
            <motion.div
              key={`${speaker.id}-${i}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group min-w-[250px] shrink-0 rounded-3xl border border-border bg-card p-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-gold/40 bg-gradient-to-br from-gold/30 to-teal/30 transition-colors group-hover:border-gold">
                {speaker.image_url ? (
                  <img src={speaker.image_url} alt={speaker.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="font-display text-3xl font-bold text-gold">
                    {speaker.name.split(" ").slice(-1)[0]?.[0] || speaker.name[0]}
                  </span>
                )}
              </div>
              <h3 className="mb-1 font-display text-base font-semibold text-card-foreground">
                {speaker.name}
              </h3>
              <p className="font-body text-sm text-muted-foreground">
                {speaker.organization || speaker.title || "Conference Speaker"}
              </p>
              {speaker.topic ? <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{speaker.topic}</p> : null}
            </motion.div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpeakersSection;
