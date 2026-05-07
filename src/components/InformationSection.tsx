import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type InformationBlock = Tables<"information_blocks">;

const fallbackBlocks = [
  {
    title: "Call for Distinguished Speakers & Scientific Leadership Roles",
    subtitle: "Speaking opportunities",
    content: "Renewable Energy - 2027 cordially invites eminent academicians, senior researchers, industry leaders, and policy experts to contribute as keynote speakers, plenary speakers, invited speakers, oral presenters, session chairs, scientific committee members, advisory board members, workshop speakers, panel experts, industry speakers, and young researcher forum speakers.",
    cta_label: "Submit Abstract",
    cta_url: "/abstract-submission",
  },
  {
    title: "Conference Highlights",
    subtitle: "Global visibility",
    content: "World-class keynote and plenary addresses, technical, parallel, and thematic sessions, global networking, a fully interactive virtual conference platform, e-certification, ISBN proceedings, awards, invited academic and industry talks, expert panels, peer-reviewed abstracts, recorded sessions, and digital meetups.",
    cta_label: "Register Now",
    cta_url: "/registration",
  },
  {
    title: "Who Should Attend",
    subtitle: "Distinguished global audience",
    content: "Professors, academicians, leading researchers, scientists, keynote speakers, plenary speakers, invited experts, industry leaders, engineers, consultants, policy makers, government officials, session chairs, postdoctoral fellows, PhD scholars, startups, NGOs, investors, and professionals seeking global collaboration are welcome.",
    cta_label: "Register Now",
    cta_url: "/registration",
  },
  {
    title: "Submit Your Abstract",
    subtitle: "Peer-reviewed submissions",
    content: "We welcome high-quality original research and review papers. All submissions will undergo a rigorous peer-review process to ensure academic excellence.",
    cta_label: "Submit Abstract",
    cta_url: "/abstract-submission",
  },
  {
    title: "Contact Information",
    subtitle: "Conference support",
    content: "Email: info@yourconference.com. Website: www.yourconference.com. Our organizing team is available to support speakers, authors, delegates, and scientific contributors.",
    cta_label: "Contact Us",
    cta_url: "/contact",
  },
  {
    title: "Join Us as a Speaker",
    subtitle: "Innovation and sustainability",
    content: "Be part of a global initiative driving innovation and sustainability in energy.",
    cta_label: "Submit Abstract",
    cta_url: "/abstract-submission",
  },
];

const InformationSection = () => {
  const [blocks, setBlocks] = useState<InformationBlock[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchBlocks = async () => {
      const { data } = await supabase
        .from("information_blocks")
        .select("*")
        .eq("is_visible", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (isMounted && data) {
        setBlocks(data);
      }
    };

    fetchBlocks();

    return () => {
      isMounted = false;
    };
  }, []);

  const items = blocks.length > 0 ? blocks : fallbackBlocks;

  return (
    <section id="information" className="bg-background pt-8 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="section-kicker mb-2">Highlights</p>
          <h2 className="text-3xl font-extrabold text-foreground md:text-4xl">Conference Information</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {items.map((item, index) => (
            <motion.div
              key={`${item.title}-${index}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="conference-card p-6"
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal">{item.subtitle || item.category || "General"}</p>
              <h3 className="mb-3 text-2xl font-extrabold text-card-foreground">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-5">{item.content || "Conference updates and editorial information will appear here."}</p>
              {item.cta_label && item.cta_url ? (
                <a href={item.cta_url} className="inline-flex items-center gap-2 text-sm font-bold text-teal transition-colors hover:text-gold">
                  {item.cta_label}
                  <ArrowUpRight size={16} />
                </a>
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InformationSection;
