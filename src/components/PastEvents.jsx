import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { FiArrowDown, FiImage } from "react-icons/fi";
import data from "../assets/events.json";
import EventDialog from "./ui/EventDialog";

const events = data.past_events.map((e) => ({
  ...e,
  image: encodeURI(`${import.meta.env.BASE_URL}events/${e.image}`),
}));

/**
 * One tall photo card. Events with a write-up or several photos (details / images in
 * events.json) are clickable and open the EventDialog viewer.
 */
function EventCard({ event, index, onOpen }) {
  const interactive = Boolean(event.details?.length || event.images?.length > 1);
  const photoCount = event.images?.length || 1;
  const interactiveProps = interactive
    ? {
        role: "button",
        tabIndex: 0,
        "aria-haspopup": "dialog",
        "aria-label": `${event.title}: view photos and details`,
        onClick: () => onOpen(event),
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen(event);
          }
        },
      }
    : {};
  return (
    <article
      {...interactiveProps}
      className={`group relative h-[58vh] min-h-[340px] w-[78vw] max-w-[440px] shrink-0 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 transition-all duration-500 hover:-translate-y-3 hover:rotate-[-1.5deg] hover:border-misc-lightBlue/60 hover:shadow-2xl hover:shadow-misc-blue/30 sm:w-[46vw] lg:w-[30vw] ${interactive ? "cursor-pointer" : ""}`}
    >
      <img
        src={event.image}
        alt={event.title}
        loading="lazy"
        style={event.image_position ? { objectPosition: event.image_position } : undefined}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-misc-night via-misc-night/30 to-transparent transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-br from-misc-blue/30 to-misc-purple/30 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100" />

      <span className="display text-outline absolute left-6 top-5 text-6xl text-white/70">
        {String(index + 1).padStart(2, "0")}
      </span>

      {interactive && (
        <span className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
          <FiImage aria-hidden="true" />
          {photoCount > 1 ? `${photoCount} photos · ` : ""}Details
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
        <h3 className="display text-3xl text-white sm:text-4xl">{event.title}</h3>
        {event.subtitle && (
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-misc-lightBlue">{event.subtitle}</p>
        )}
        {event.date && (
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300">{event.date}</p>
        )}
        {/* Description slides open on hover (always visible on touch devices) */}
        <div className="grid grid-rows-[0fr] transition-all duration-500 ease-out group-hover:grid-rows-[1fr] [@media(hover:none)]:grid-rows-[1fr]">
          <p className="overflow-hidden text-sm leading-relaxed text-slate-200 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
            <span className="block pt-3">{event.description}</span>
          </p>
        </div>
      </div>
    </article>
  );
}

/** Intro and outro panels that bookend the horizontal track */
const Intro = () => (
  <div className="flex w-[80vw] shrink-0 flex-col justify-center pr-4 sm:w-[50vw] lg:w-[34vw]">
    <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-misc-lightBlue">
      Our legacy
    </p>
    <h2 className="display text-6xl sm:text-7xl lg:text-8xl">
      Past <span className="text-gradient">events</span>
    </h2>
    <p className="mt-5 max-w-sm text-slate-300">
      A look back at the workshops, hackathons and sessions we&rsquo;ve hosted. Keep
      scrolling.
    </p>
  </div>
);

const Outro = () => (
  <div className="flex h-[58vh] min-h-[340px] w-[70vw] shrink-0 flex-col items-start justify-center sm:w-[36vw] lg:w-[24vw]">
    <h3 className="display text-5xl sm:text-6xl">
      More <span className="text-outline [--outline-fill:rgb(var(--misc-night))]">coming</span> soon
    </h3>
    <a href="#upcoming-events" className="btn btn-light mt-6">
      What&rsquo;s next <FiArrowDown className="text-lg" />
    </a>
  </div>
);

/**
 * PastEvents
 *
 * Scroll-jacked horizontal gallery: vertical scrolling slides the photo
 * track sideways while the section stays pinned. Falls back to a plain
 * swipeable row when the user prefers reduced motion.
 */
function PastEvents() {
  const reduce = useReducedMotion();
  const outer = useRef(null);
  const track = useRef(null);
  const [dims, setDims] = useState({ dist: 0, vh: 0 });
  const [active, setActive] = useState(null); // event shown in the details viewer

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDims({
        dist: Math.max(0, track.current.scrollWidth - window.innerWidth),
        vh: window.innerHeight,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [reduce]);

  const { scrollYProgress } = useScroll({
    target: outer,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dims.dist]);
  const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const trackContent = (
    <>
      <Intro />
      {events.map((e, i) => (
        <EventCard key={e.title} event={e} index={i} onOpen={setActive} />
      ))}
      <Outro />
    </>
  );

  const dialog = active ? <EventDialog event={active} onClose={() => setActive(null)} /> : null;

  if (reduce) {
    return (
      <section id="events" className="relative bg-misc-night py-24 text-white">
        <div className="flex gap-6 overflow-x-auto px-6 pb-6">{trackContent}</div>
        {dialog}
      </section>
    );
  }

  return (
    <section
      id="events"
      ref={outer}
      style={{ height: dims.dist ? dims.dist + dims.vh : "300vh" }}
      className="relative bg-misc-night text-white"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pb-16">
        <div className="pointer-events-none absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-misc-blue/20 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-misc-purple/25 blur-[120px]" />

        <motion.div
          ref={track}
          style={{ x }}
          className="relative flex w-max items-center gap-5 px-5 will-change-transform sm:gap-8 sm:px-12 lg:px-20"
        >
          {trackContent}
        </motion.div>

        {/* Progress bar */}
        <div className="absolute inset-x-6 bottom-20 h-[3px] overflow-hidden rounded-full bg-white/10 sm:inset-x-12 lg:inset-x-20">
          <motion.div
            style={{ width: barWidth }}
            className="h-full rounded-full bg-gradient-to-r from-misc-blue to-misc-purple"
          />
        </div>
      </div>
      {dialog}
    </section>
  );
}

export default PastEvents;
