import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionBackdrop from "./ui/SectionBackdrop";

const TEXT =
  "Lectures teach concepts. We give students the experts, the tools and the community to actually build with them.";
const HIGHLIGHT = ["experts,", "tools", "community", "build"];

/** A single word whose opacity is tied to scroll position */
function Word({ word, range, progress }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [14, 0]);
  const highlighted = HIGHLIGHT.includes(word);
  return (
    <motion.span
      style={{ opacity, y }}
      className={`mr-[0.22em] inline-block ${highlighted ? "text-gradient" : ""}`}
    >
      {word}
    </motion.span>
  );
}

/**
 * Statement
 *
 * Big manifesto line that "fills in" word-by-word as you scroll through it.
 */
function Statement() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.5"],
  });
  const words = TEXT.split(" ");

  return (
    <section ref={ref} className="relative isolate px-4 py-32 md:py-48">
      <SectionBackdrop />
      <div className="mx-auto max-w-6xl">
        <p className="display text-4xl text-slate-900 dark:text-white sm:text-6xl md:text-7xl lg:text-8xl">
          {words.map((w, i) => (
            <Word
              key={i}
              word={w}
              progress={scrollYProgress}
              range={[i / words.length, (i + 1) / words.length]}
            />
          ))}
        </p>
      </div>
    </section>
  );
}

export default Statement;
