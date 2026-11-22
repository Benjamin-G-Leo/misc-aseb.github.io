import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import SectionHeading from "./ui/SectionHeading";
import FadeUp from "./ui/FadeUp";

const FEATURES = [
  {
    pill: "Expert Talks",
    title: "Straight from the industry",
    blurb:
      "Our club hosts industry expert talks, bringing insights from professionals at the forefront of innovation straight to campus.",
    points: ["Ignite Sessions", "Industry professionals", "Insights from the frontier"],
    image: "Ignite Session - 1_inauguration.jpg",
    caption: "Ignite Session — Inauguration",
  },
  {
    pill: "Hands-on Workshops",
    title: "Build while you learn",
    blurb:
      "From Python for machine learning to Microsoft Reactor programs, we focus on hands-on experience with new technologies.",
    points: ["Python for ML", "Microsoft Reactor", "AI Artistry"],
    image: "Python_for_ml.jpeg",
    caption: "Python for Machine Learning",
  },
  {
    pill: "Hackathons & CTFs",
    title: "Compete. Collaborate. Ship.",
    blurb:
      "PrisonCTF, the Spootacular Solutions Hackathon and MSpectra — high-energy events where ideas meet deadlines.",
    points: ["PrisonCTF", "Spootacular Solutions", "MSpectra Hackathon"],
    image: "PrisonCTF Participants Photo.jpg",
    caption: "PrisonCTF Participants",
  },
];

const img = (name) => encodeURI(`${import.meta.env.BASE_URL}events/${name}`);

/**
 * Features ("What we do")
 *
 * Desktop: a tall section with a pinned viewport. Scrolling drives the pill
 * tabs, the copy, and a deck of photo cards that fly off one by one.
 * Mobile: a simple stacked list (pinning is awkward on small screens).
 */
function Features() {
  const outer = useRef(null);
  const [active, setActive] = useState(0);
  const n = FEATURES.length;

  const { scrollYProgress } = useScroll({
    target: outer,
    offset: ["start start", "end end"],
  });
  const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(n - 1, Math.max(0, Math.floor(v * n))));
  });

  const goTo = (i) => {
    const el = outer.current;
    const start = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: start + ((i + 0.5) / n) * range, behavior: "smooth" });
  };

  const f = FEATURES[active];

  return (
    <div id="what-we-do" className="relative z-10 -mt-12 rounded-t-[2.5rem] bg-misc-night text-white md:-mt-16 md:rounded-t-[4rem]">
      {/* ---------- Desktop: pinned scroll story ---------- */}
      <section ref={outer} className="relative hidden h-[330vh] lg:block">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden rounded-t-[4rem] px-8 pb-4 pt-24">
          <div className="pointer-events-none absolute -left-40 top-20 h-[32rem] w-[32rem] rounded-full bg-misc-blue/25 blur-[120px]" />
          <div className="pointer-events-none absolute -right-40 bottom-0 h-[32rem] w-[32rem] rounded-full bg-misc-purple/30 blur-[120px]" />

          <div className="relative mx-auto w-full max-w-7xl">
            <div className="mb-4 flex items-end justify-between gap-8">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-misc-lightBlue">
                  What we do
                </p>
                <h2 className="display whitespace-nowrap text-6xl xl:text-7xl">
                  How you&rsquo;ll <span className="text-gradient">ignite</span>
                </h2>
              </div>

              {/* Pill tabs */}
              <div className="flex gap-2 rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur-md">
                {FEATURES.map((ft, i) => (
                  <button
                    key={ft.pill}
                    onClick={() => goTo(i)}
                    className="relative whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors xl:px-5 xl:text-sm"
                  >
                    {active === i && (
                      <motion.span
                        layoutId="feature-pill"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-misc-blue to-misc-purple shadow-lg shadow-misc-blue/40"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                    <span className={`relative ${active === i ? "text-white" : "text-slate-400 hover:text-white"}`}>
                      {ft.pill}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-10">
              {/* Copy */}
              <div className="col-span-6 min-h-[19rem]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="display text-outline text-7xl text-white/30 [--outline-fill:rgb(var(--misc-night))]">
                      0{active + 1}
                    </span>
                    <h3 className="display mt-1 text-5xl xl:text-6xl">{f.title}</h3>
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 xl:text-lg">
                      {f.blurb}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2.5">
                      {f.points.map((p, i) => (
                        <motion.li
                          key={p}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + i * 0.08 }}
                          className="cursor-default rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-misc-lightBlue hover:bg-misc-blue/20"
                        >
                          {p}
                        </motion.li>
                      ))}
                    </ul>
                    <a href="#events" className="btn btn-light mt-6 !py-3">
                      See our events
                      <FiArrowRight className="btn-arrow text-lg" />
                    </a>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Photo deck */}
              <div className="col-span-6">
                <div className="relative mx-auto h-[46vh] max-h-[28rem] w-full max-w-md">
                  {FEATURES.map((ft, i) => {
                    const d = i - active;
                    const gone = d < 0;
                    return (
                      <motion.div
                        key={ft.pill}
                        animate={{
                          y: gone ? -140 : d * 26,
                          x: gone ? -60 : d * 14,
                          rotate: gone ? -14 : d * 4,
                          scale: gone ? 1.05 : 1 - d * 0.06,
                          opacity: gone ? 0 : 1 - d * 0.25,
                        }}
                        transition={{ type: "spring", stiffness: 130, damping: 20 }}
                        style={{ zIndex: n - Math.abs(d) - (gone ? 5 : 0) }}
                        className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl shadow-black/60"
                      >
                        <img
                          src={img(ft.image)}
                          alt={ft.caption}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-misc-night/90 via-transparent to-transparent" />
                        <div className="absolute inset-x-5 bottom-5 flex items-center justify-between">
                          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                            {ft.caption}
                          </span>
                          <span className="display text-4xl text-white/80">0{i + 1}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Scroll progress */}
            <div className="mt-6 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                style={{ width: barWidth }}
                className="h-full rounded-full bg-gradient-to-r from-misc-blue to-misc-purple"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Mobile / tablet: stacked list ---------- */}
      <section className="relative px-4 pb-16 pt-24 lg:hidden">
        <SectionHeading
          dark
          eyebrow="What we do"
          title="How you'll ignite"
          accent={["ignite"]}
          className="mb-12"
        />
        <div className="mx-auto flex max-w-xl flex-col gap-8">
          {FEATURES.map((ft, i) => (
            <FadeUp key={ft.pill}>
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={img(ft.image)} alt={ft.caption} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-misc-night/90 to-transparent" />
                  <span className="display absolute bottom-3 right-5 text-5xl text-white/80">0{i + 1}</span>
                  <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-misc-blue to-misc-purple px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                    {ft.pill}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="display text-3xl">{ft.title}</h3>
                  <p className="mt-3 text-slate-300">{ft.blurb}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {ft.points.map((p) => (
                      <li key={p} className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-semibold">
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Features;
