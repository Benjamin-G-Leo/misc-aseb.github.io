import { FiCheck, FiTarget } from "react-icons/fi";
import { motion } from "framer-motion";
import events from "../assets/events.json";
import teams from "../assets/teams.json";
import SectionHeading from "./ui/SectionHeading";
import SectionBackdrop from "./ui/SectionBackdrop";
import SpotlightCard from "./ui/SpotlightCard";
import Counter from "./ui/Counter";

const visionItems = [
  "Create a supportive, inclusive space for growth",
  "Develop and implement AI solutions",
  "Explore and share advanced insights",
  "Promote AI through cloud and open source",
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 50, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardBase =
  "rounded-3xl border border-slate-200/80 bg-white/70 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-misc-blue/50 hover:shadow-2xl hover:shadow-misc-blue/10 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-misc-blue/60";

/**
 * About
 *
 * Bento grid. Cards stagger in on scroll on scroll.
 * Stat numbers are derived from the JSON data so they stay accurate.
 */
function About() {
  const memberCount = Object.values(teams).reduce((n, g) => n + g.length, 0);
  const stats = [
    { value: events.past_events.length, label: "Events recapped", rgb: "0,120,212" },
    { value: memberCount, label: "Team members", rgb: "92,45,145" },
    { value: Object.keys(teams).length, label: "Teams at work", rgb: "43,136,216" },
  ];

  return (
    <section id="about" className="relative isolate px-4 pb-40 pt-8 md:pb-48">
      <SectionBackdrop flip />
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Who we are"
          title="About MISC"
          accent={["MISC"]}
          className="mb-16 md:mb-24"
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          className="grid grid-cols-1 gap-5 lg:grid-cols-12"
        >
          {/* Main story */}
          <motion.div variants={item} className="lg:col-span-7">
            <SpotlightCard className={`${cardBase} h-full`}>
              <div className="flex h-full flex-col justify-center p-8 md:p-12">
                <h3 className="display mb-6 text-4xl text-slate-900 dark:text-white md:text-5xl">
                  Empowering the next generation of{" "}
                  <span className="text-gradient">tech leaders</span>
                </h3>
                <p className="mb-5 text-base leading-relaxed text-slate-600 dark:text-slate-300 md:text-lg">
                  Microsoft Ignite Students Club is a dynamic student-driven
                  community dedicated to exploring and mastering the latest
                  technologies. Our club hosts industry expert talks, providing
                  members with invaluable insights from professionals at the
                  forefront of innovation.
                </p>
                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300 md:text-lg">
                  We are committed to fostering students&rsquo; skills with new
                  technologies, ensuring they stay ahead in the ever-evolving
                  tech landscape. Additionally, we actively participate in
                  Microsoft Reactor programs, offering hands-on experiences.
                </p>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Vision & mission */}
          <motion.div variants={item} className="lg:col-span-5">
            <SpotlightCard
              rgb="92,45,145"
              className={`${cardBase} h-full bg-gradient-to-br from-misc-blue/5 to-misc-purple/10 dark:from-misc-blue/10 dark:to-misc-purple/20`}
            >
              <div className="p-8 md:p-10">
                <h3 className="display mb-8 flex items-center gap-4 text-3xl text-slate-900 dark:text-white md:text-4xl">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-misc-blue text-2xl text-white shadow-lg shadow-misc-blue/30 transition-transform duration-500 group-hover:rotate-[360deg]">
                    <FiTarget />
                  </span>
                  Vision &amp; Mission
                </h3>
                <ul className="space-y-5">
                  {visionItems.map((text) => (
                    <li key={text} className="group/item flex items-start gap-4">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-misc-blue/15 text-misc-blue transition-all duration-300 group-hover/item:scale-125 group-hover/item:bg-misc-blue group-hover/item:text-white dark:text-misc-lightBlue">
                        <FiCheck className="text-sm" strokeWidth={3} />
                      </span>
                      <span className="text-base font-medium leading-snug text-slate-700 transition-transform duration-300 group-hover/item:translate-x-1 dark:text-slate-200 md:text-lg">
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Stats */}
          {stats.map((s) => (
            <motion.div key={s.label} variants={item} className="lg:col-span-4">
              <SpotlightCard rgb={s.rgb} className={cardBase}>
                <div className="flex items-end justify-between p-8 md:p-10">
                  <div>
                    <div className="display text-gradient text-7xl md:text-8xl">
                      <Counter to={s.value} />
                    </div>
                    <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      {s.label}
                    </p>
                  </div>
                  <span className="h-3 w-3 rounded-full bg-misc-blue transition-transform duration-500 group-hover:scale-[6] group-hover:opacity-10" />
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default About;
