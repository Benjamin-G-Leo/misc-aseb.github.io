import RevealText from "./RevealText";
import FadeUp from "./FadeUp";

/**
 * SectionHeading
 *
 * Eyebrow pill + big masked headline + optional subtitle.
 * `dark` forces light-on-dark text for the navy band sections.
 * Words listed in `accent` get the brand gradient; `outline` get outlined.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  accent = [],
  outline = [],
  dark = false,
  align = "center",
  className = "",
}) {
  const wordClass = (w) => {
    const clean = w.replace(/[^\w]/g, "").toLowerCase();
    if (accent.map((a) => a.toLowerCase()).includes(clean)) return "text-gradient";
    if (outline.map((a) => a.toLowerCase()).includes(clean)) return "text-outline";
    return "";
  };

  return (
    <div
      className={`flex flex-col ${
        align === "center" ? "items-center text-center" : "items-start text-left"
      } ${className}`}
    >
      {eyebrow && (
        <FadeUp>
          <div
            className={`mb-6 inline-block rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] ${
              dark
                ? "border-white/15 bg-white/5 text-misc-lightBlue"
                : "border-misc-blue/20 bg-misc-blue/10 text-misc-blue dark:text-misc-lightBlue"
            }`}
          >
            {eyebrow}
          </div>
        </FadeUp>
      )}
      <RevealText
        as="h2"
        text={title}
        wordClass={wordClass}
        className={`display text-5xl sm:text-6xl md:text-8xl ${
          dark ? "text-white" : "text-slate-900 dark:text-white"
        }`}
      />
      {subtitle && (
        <FadeUp delay={0.2}>
          <p
            className={`mt-6 max-w-2xl text-base leading-relaxed md:text-lg ${
              dark ? "text-slate-300" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            {subtitle}
          </p>
        </FadeUp>
      )}
    </div>
  );
}
