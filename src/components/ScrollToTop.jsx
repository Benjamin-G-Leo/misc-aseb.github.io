import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";

/**
 * ScrollToTop
 *
 * Floating button wrapped in a ring that fills as you scroll the page.
 */
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 600));

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      title="Scroll to top"
      className={`group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-xl shadow-misc-blue/20 backdrop-blur-md transition-all duration-500 hover:scale-110 dark:bg-misc-darker/80 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-10 opacity-0"
      }`}
    >
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="26" fill="none" strokeWidth="2.5" className="stroke-slate-300/60 dark:stroke-slate-700" />
        <motion.circle
          cx="28"
          cy="28"
          r="26"
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="stroke-misc-blue"
          style={{ pathLength: scrollYProgress }}
        />
      </svg>
      <FiArrowUp className="text-xl text-misc-blue transition-transform duration-300 group-hover:-translate-y-1 dark:text-misc-lightBlue" />
    </button>
  );
};

export default ScrollToTop;
