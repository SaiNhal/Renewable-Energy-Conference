import { motion } from "framer-motion";
import CountdownTimer from "./CountdownTimer";
import { Link } from "react-router-dom";
import { useSiteData } from "@/hooks/useSiteData";
import { FileText, Send, Ticket } from "lucide-react";

const HeroSection = () => {
  const { values } = useSiteData();

  return (
    <section className="hero-gradient relative flex min-h-screen items-center overflow-hidden pb-16 pt-28">
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-gold-light backdrop-blur"
          >
            {values.hero_eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-5 max-w-4xl text-4xl font-extrabold leading-tight text-white md:text-6xl lg:text-7xl"
          >
            {values.hero_title_primary}
            <br />
            <span className="text-gold-light">{values.hero_title_secondary}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-3 text-xl font-bold text-white md:text-2xl"
          >
            {values.hero_date_line}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-9 max-w-3xl text-base leading-relaxed text-white/82 md:text-lg"
          >
            {values.hero_theme}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12 rounded-md border border-white/20 bg-white/12 p-6 shadow-2xl shadow-black/20 backdrop-blur-md"
          >
            <div className="rounded-md bg-white p-6">
              <CountdownTimer />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col gap-4 sm:flex-row justify-center"
          >
            <Link
              to="/abstract-submission"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-md bg-gold px-7 py-4 text-base font-extrabold text-hero-bg shadow-xl shadow-black/15 transition-all hover:-translate-y-0.5 hover:bg-gold-light"
            >
              <Send size={19} />
              <span>Submit Your Abstract Now</span>
            </Link>
            <Link
              to="/registration"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-md bg-teal px-7 py-4 text-base font-extrabold text-white shadow-xl shadow-black/15 transition-all hover:-translate-y-0.5 hover:bg-teal/85"
            >
              <Ticket size={20} />
              <span>Register Now</span>
            </Link>
            <a
              href="#information"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-md border border-white/40 bg-white/10 px-7 py-4 text-base font-extrabold text-white shadow-xl shadow-black/10 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/20"
            >
              <FileText size={20} />
              <span>Brochure</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
