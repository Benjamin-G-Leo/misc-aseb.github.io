import { SOCIAL_LINKS } from "../assets/socials";
import RevealText from "./ui/RevealText";
import FadeUp from "./ui/FadeUp";
import Magnetic from "./ui/Magnetic";

const WORDS = ["Ignite", "Innovate", "Elevate"];

/**
 * One row of the tagline. Sized in vw so the whole row always fits the screen:
 * three words side by side from `sm` up, stacked on phones. Everything inside
 * is in em, so changing the font size here rescales the whole row.
 */
const Row = ({ outline }) => (
  <div className="flex flex-col items-center text-[17vw] sm:flex-row sm:justify-center sm:text-[min(7.2vw,9rem)]">
    {WORDS.map((w, i) => (
      <span key={w} className="flex items-center">
        {i > 0 && (
          <span className="mx-[0.3em] hidden animate-spin-slow text-[0.3em] text-misc-lightBlue sm:inline-block">
            ✦
          </span>
        )}
        <span className={`display ${outline ? "text-outline text-white/40 [--outline-fill:rgb(var(--misc-night))]" : "text-white/90"}`}>
          {w}
        </span>
      </span>
    ))}
  </div>
);

/**
 * JoinCta
 *
 * Closing call-to-action: two rows of the club tagline (solid and outline, sized
 * to always fit the screen) above a big headline and social buttons.
 */
function JoinCta() {
  return (
    <section className="relative z-20 -mt-12 overflow-hidden rounded-t-[2.5rem] bg-misc-night py-24 text-white md:-mt-16 md:rounded-t-[4rem] md:py-36">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 animate-blob rounded-full bg-gradient-to-tr from-misc-blue/40 to-misc-purple/40 blur-[130px]" />

      {/* soft fade into the footer so the glow never shows a hard edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48 bg-gradient-to-b from-transparent to-misc-night" />

      <div className="relative space-y-1 px-2 opacity-90 sm:space-y-2">
        <FadeUp>
          <Row />
        </FadeUp>
        <FadeUp delay={0.15}>
          <Row outline />
        </FadeUp>
      </div>

      <div className="relative mx-auto mt-20 flex max-w-4xl flex-col items-center px-4 text-center">
        <RevealText
          as="h2"
          text="Ready to ignite?"
          wordClass={(w) => (w.startsWith("ignite") ? "text-gradient" : "")}
          className="display text-5xl sm:text-7xl md:text-8xl"
        />
        <FadeUp delay={0.2}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300">
            Follow us for the latest events, announcements and opportunities —
            or just say hi.
          </p>
        </FadeUp>

        <FadeUp delay={0.3} className="mt-10 flex flex-wrap justify-center gap-4">
          {SOCIAL_LINKS.map(({ icon: Icon, url, label }) => (
            <Magnetic key={label} strength={0.5}>
              <a
                href={url}
                target={url.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                className="group/s flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/5 text-2xl backdrop-blur-md transition-all duration-300 hover:border-transparent hover:bg-gradient-to-br hover:from-misc-blue hover:to-misc-purple hover:shadow-xl hover:shadow-misc-blue/40"
              >
                <Icon className="transition-transform duration-300 group-hover/s:scale-125" />
              </a>
            </Magnetic>
          ))}
        </FadeUp>
      </div>
    </section>
  );
}

export default JoinCta;
