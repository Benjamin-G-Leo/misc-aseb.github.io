import { FiArrowUpRight, FiCalendar, FiMapPin } from "react-icons/fi";
import data from "../assets/events.json";
import SectionHeading from "./ui/SectionHeading";
import SectionBackdrop from "./ui/SectionBackdrop";
import TiltCard from "./ui/TiltCard";
import FadeUp from "./ui/FadeUp";
import Magnetic from "./ui/Magnetic";

/**
 * UpcomingEvents
 *
 * Posters get a blurred copy of themselves as backdrop so any aspect ratio
 * fills the card nicely. Cards tilt in 3D under the cursor.
 */
function UpcomingEvents() {
  const events = (data.upcoming_events || []).map((event) => ({
    ...event,
    image: event.image.startsWith("http")
      ? event.image
      : encodeURI(`${import.meta.env.BASE_URL}events/${event.image}`),
    type: event.type || "Event",
    location: event.location || "Amrita Bengaluru",
  }));

  const single = events.length === 1;

  return (
    <section
      id="upcoming-events"
      className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-slate-50 px-4 pb-24 pt-24 dark:bg-misc-darker md:-mt-16 md:rounded-t-[4rem] md:pb-32 md:pt-32"
    >
      <SectionBackdrop flip />
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Join us"
          title="Upcoming events"
          accent={["events"]}
          subtitle="Don't miss out on our latest workshops, hackathons, and tech talks."
          className="mb-16 md:mb-24"
        />

        {events.length === 0 && (
          <FadeUp className="mx-auto max-w-2xl rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
            <p className="display text-4xl text-slate-900 dark:text-white">
              Something&rsquo;s <span className="text-gradient">brewing</span>
            </p>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              New events are on the way. Follow us on social media to be the
              first to know.
            </p>
          </FadeUp>
        )}

        <div
          className={
            single
              ? "mx-auto max-w-6xl"
              : "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          }
        >
          {events.map((event) => (
            <FadeUp key={event.title}>
              <TiltCard max={single ? 3 : 6} className="rounded-[2rem]">
                <article
                  className={`overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 transition-shadow duration-500 hover:shadow-2xl hover:shadow-misc-blue/20 dark:border-slate-800 dark:bg-slate-900/70 ${
                    single ? "flex flex-col md:flex-row" : "flex h-full flex-col"
                  }`}
                >
                  {/* Poster */}
                  <div
                    className={`relative shrink-0 overflow-hidden bg-slate-900 ${
                      single ? "min-h-[300px] md:w-1/2" : "h-60"
                    }`}
                  >
                    <img
                      src={event.image}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full scale-125 object-cover opacity-60 blur-2xl"
                    />
                    <img
                      src={event.image}
                      alt={event.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-contain transition-transform duration-700 group-hover:scale-110"
                    />
                    <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-misc-blue to-misc-purple px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                      {event.type}
                    </span>
                  </div>

                  {/* Details */}
                  <div className={`flex flex-1 flex-col p-7 md:p-10 ${single ? "justify-center" : ""}`}>
                    <h3
                      className={`display text-slate-900 transition-colors duration-300 group-hover:text-misc-blue dark:text-white dark:group-hover:text-misc-lightBlue ${
                        single ? "text-5xl md:text-6xl" : "text-3xl"
                      }`}
                    >
                      {event.title}
                    </h3>

                    {event.description && (
                      <p
                        className={`mt-4 text-slate-600 dark:text-slate-400 ${
                          single ? "text-base leading-relaxed md:text-lg" : "line-clamp-3 text-sm"
                        }`}
                      >
                        {event.description}
                      </p>
                    )}

                    <div className="mt-6 space-y-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-misc-blue/10 text-misc-blue dark:text-misc-lightBlue">
                          <FiCalendar />
                        </span>
                        {event.date}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-misc-purple/10 text-misc-purple dark:text-purple-300">
                          <FiMapPin />
                        </span>
                        {event.location}
                      </div>
                    </div>

                    {event.event_url && (
                      <div className="mt-8">
                        <Magnetic strength={0.2}>
                          <a
                            href={event.event_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                          >
                            Learn more
                            <FiArrowUpRight className="btn-arrow text-lg" />
                          </a>
                        </Magnetic>
                      </div>
                    )}
                  </div>
                </article>
              </TiltCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

export default UpcomingEvents;
