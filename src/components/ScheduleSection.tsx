import { useState } from "react";
import { motion } from "framer-motion";

const schedule = [
  {
    day: "Day 1",
    date: "March 3, 2027",
    events: [
      { time: "09:00 - 09:30", title: "Opening Ceremony and Introduction" },
      { time: "09:30 - 10:30", title: "Keynote Session I" },
      { time: "10:30 - 11:00", title: "Refreshment Break" },
      { time: "11:00 - 12:30", title: "Keynote Session II" },
      { time: "12:30 - 13:30", title: "Plenary Speaker Session I" },
      { time: "13:30 - 15:00", title: "Plenary Speaker Session II" },
      { time: "15:00 - 17:30", title: "Poster Speaker Session" },
      { time: "17:30 - 18:00", title: "Awards & Closing Ceremony" },
    ],
  },
  {
    day: "Day 2",
    date: "March 4, 2027",
    events: [
      { time: "09:00 - 09:30", title: "Opening Ceremony and Introduction" },
      { time: "09:30 - 10:30", title: "Keynote Session I" },
      { time: "10:30 - 11:00", title: "Refreshment Break" },
      { time: "11:00 - 12:30", title: "Keynote Session II" },
      { time: "12:30 - 13:30", title: "Plenary Speaker Session I" },
      { time: "13:30 - 15:00", title: "Plenary Speaker Session II" },
      { time: "15:00 - 17:30", title: "Poster Speaker Session" },
      { time: "17:30 - 18:00", title: "Awards & Closing Ceremony" },
    ],
  },
];

const ScheduleSection = () => {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <section id="schedule" className="py-20 section-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gold text-sm uppercase tracking-wider font-body mb-2">Conference</p>
          <h2 className="text-3xl md:text-4xl font-bold text-hero-foreground font-display">Schedule</h2>
        </div>

        {/* Day tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {schedule.map((day, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className={`px-6 py-3 rounded-lg font-body font-semibold text-sm transition-all ${
                activeDay === i
                  ? "gold-gradient text-hero-bg"
                  : "bg-white/10 text-hero-foreground/70 hover:bg-white/15"
              }`}
            >
              {day.day} - {day.date}
            </button>
          ))}
        </div>

        {/* Schedule */}
        <div className="max-w-2xl mx-auto">
          {schedule[activeDay].events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex gap-4 py-4 border-b border-white/10 last:border-0"
            >
              <span className="text-gold font-mono text-sm w-32 flex-shrink-0 font-body">{event.time}</span>
              <span className="text-hero-foreground font-body">{event.title}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
