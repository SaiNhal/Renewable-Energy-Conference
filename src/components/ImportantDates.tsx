import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useConferenceSettings } from "@/lib/conferenceSettings";

const ImportantDates = () => {
  const { importantDates } = useConferenceSettings();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="section-kicker mb-2">Important</p>
          <h2 className="text-3xl font-extrabold text-foreground md:text-4xl">Dates</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {importantDates.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="conference-card card-hover p-6 text-center"
            >
              <Calendar className="mx-auto mb-4 text-teal" size={32} />
              <h3 className="mb-2 text-lg font-extrabold text-card-foreground">{item.title}</h3>
              <p className="mb-1 text-xl font-bold text-gold">{item.date}</p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImportantDates;
