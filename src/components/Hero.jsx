import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowRight, FiCalendar } from "react-icons/fi";
import Logo from "/logo.png";
import data from "../assets/events.json";
import Marquee from "./ui/Marquee";
import Magnetic from "./ui/Magnetic";

const ease = [0.22, 1, 0.36, 1];

/** One masked line of the giant headline */
const Line = ({ children, delay = 0, className = "" }) => (
  <span className="-mx-[0.1em] block overflow-hidden px-[0.1em] pb-[0.08em]">
    <motion.span
      className={`block ${className}`}
      initial={{ y: "108%" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1, delay, ease }}
    >
      {children}
    </motion.span>
  </span>
);

// Alternating tilt/offset for the card strip
const TILTS = [
  ["-4deg", "10px"],
  ["3deg", "-14px"],
  ["-2deg", "18px"],
  ["4deg", "-6px"],
  ["-3deg", "12px"],
  ["2deg", "-10px"],
];

/**
 * Hero
 *
 * Giant masked headline, ambient parallax glow, and an
 * infinite strip of tilted event photos that straighten and lift on hover.
 */
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 240]);

  const cards = data.past_events;

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-screen flex-col justify-between overflow-hidden pt-28 md:pt-32"
    >
      {/* Background layers */}
      <div className="bg-grid absolute inset-0 -z-10" />
      <motion.div style={{ y: glowY }} className="absolute inset-0 -z-10">
        <div className="absolute -left-20 top-10 h-80 w-80 animate-blob rounded-full bg-misc-blue opacity-30 mix-blend-multiply blur-3xl dark:mix-blend-screen" />
        <div className="absolute -right-10 top-0 h-80 w-80 animate-blob rounded-full bg-misc-purple opacity-30 mix-blend-multiply blur-3xl dark:mix-blend-screen [animation-delay:2s]" />
        <div className="absolute bottom-20 left-1/3 h-72 w-72 animate-blob rounded-full bg-misc-lightBlue opacity-25 mix-blend-multiply blur-3xl dark:mix-blend-screen [animation-delay:4s]" />
      </motion.div>
      {/* Text */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 text-center"
      >
        {/* Logo orb */}
        <motion.div
          initial={{ scale: 0, rotate: -90, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 1, ease, delay: 0.3 }}
          className="relative mb-5 h-16 w-16"
        >
          <div className="absolute -inset-1.5 animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,#0078D4,#5C2D91,#2B88D8,#0078D4)] opacity-80 blur-[3px]" />
          <div className="glass-card !rounded-full relative flex h-full w-full items-center justify-center !bg-white/90 dark:!bg-misc-darker/90">
            <img src={Logo} alt="MISC Logo" className="h-9 w-auto" />
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.45 }}
          className="glass-card mb-6 inline-flex items-center gap-2.5 !rounded-full px-5 py-2"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-misc-blue" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-misc-blue dark:text-misc-lightBlue sm:text-sm">
            Amrita Vishwa Vidyapeetham, Bengaluru
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="display text-[clamp(3.4rem,14.5vw,10.25rem)] text-slate-900 dark:text-white">
          <Line delay={0.5}>Ignite your</Line>
          <Line delay={0.62}>
            <span className="text-gradient">Tech</span>{" "}
            <span className="text-outline [--outline-fill:#f4efe6] dark:[--outline-fill:rgb(var(--misc-darker))]">Journey</span>
          </Line>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 1 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 md:text-xl"
        >
          Empowering students with cutting-edge Microsoft technologies. Join a
          community of innovators, builders, and future tech leaders.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 1.15 }}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Magnetic>
            <a href="#upcoming-events" className="btn btn-primary">
              <FiCalendar className="text-lg" />
              Upcoming events
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#about" className="btn btn-ghost">
              Learn more
              <FiArrowRight className="btn-arrow text-lg" />
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Event photo strip */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease, delay: 1.3 }}
        className="relative z-10 -mt-2 pb-4 [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]"
      >
        <Marquee duration={50} className="py-14">
          {cards.map((ev, i) => (
            <div
              key={ev.title}
              className="tilt-card group relative mx-3 aspect-[3/4] w-44 shrink-0 overflow-hidden rounded-3xl border border-white/40 bg-slate-200 shadow-2xl shadow-slate-900/20 dark:border-slate-700 dark:bg-slate-800 sm:w-56"
              style={{ "--r": TILTS[i % TILTS.length][0], "--y": TILTS[i % TILTS.length][1] }}
            >
              <img
                src={encodeURI(`${import.meta.env.BASE_URL}events/${ev.image}`)}
                alt={ev.title}
                loading="lazy"
                style={ev.image_position ? { objectPosition: ev.image_position } : undefined}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
              <p className="display absolute bottom-4 left-4 right-4 translate-y-3 text-lg text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {ev.title}
              </p>
            </div>
          ))}
        </Marquee>
      </motion.div>
    </section>
  );
}

export default Hero;
