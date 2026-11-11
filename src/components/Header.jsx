import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import Logo from "/logo.png";

const NAV = [
  { label: "Home", id: "top", href: "#" },
  { label: "About", id: "about", href: "#about" },
  { label: "What we do", id: "what-we-do", href: "#what-we-do" },
  { label: "Events", id: "events", href: "#events" },
  { label: "Team", id: "team", href: "#team" },
  { label: "Contact", id: "contact", href: "#contact" },
];

// Sections that should light up a nav item even though their id differs
const ALIAS = { "upcoming-events": "events" };

/**
 * Header
 *
 * Floating glass "pill" navigation. Highlights the section currently in view
 * with a sliding pill, shows a gradient scroll-progress bar, and hosts the
 * light/dark toggle.
 */
function Header({ theme, setTheme }) {
  const isDark = theme === "dark";
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  // Track which section is in view
  useEffect(() => {
    const ids = ["about", "what-we-do", "events", "upcoming-events", "team", "contact"];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(ALIAS[e.target.id] || e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));

    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      if (window.scrollY < 300) setActive("top");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const ThemeButton = (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-300/70 text-lg text-slate-700 transition-colors hover:border-misc-blue hover:text-misc-blue dark:border-slate-600 dark:text-slate-200 dark:hover:text-misc-lightBlue"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ y: 20, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -20, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute"
        >
          {isDark ? <FiMoon /> : <FiSun />}
        </motion.span>
      </AnimatePresence>
    </button>
  );

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-misc-blue via-misc-lightBlue to-misc-purple"
      />

      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-3 sm:px-4"
      >
        <div className="w-full max-w-5xl">
          <div
            className={`glass-nav flex items-center justify-between rounded-full py-2 pl-3 pr-2 transition-all duration-500 ${
              scrolled ? "shadow-xl" : ""
            }`}
          >
            {/* Brand */}
            <a href="#" className="flex items-center gap-2.5">
              <img src={Logo} alt="MISC Logo" className="h-9 w-auto" />
              <span className="display text-xl text-slate-900 dark:text-white">
                <span className="hidden lg:inline">Microsoft Ignite Students Club</span>
                <span className="lg:hidden">MISC</span>
              </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 md:flex">
              <ul className="flex items-center">
                {NAV.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      className="relative block px-3.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                    >
                      {active === item.id && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-misc-blue/10 ring-1 ring-misc-blue/30 dark:bg-misc-blue/20"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span
                        className={`relative ${
                          active === item.id ? "text-misc-blue dark:text-misc-lightBlue" : ""
                        }`}
                      >
                        {item.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="ml-2">{ThemeButton}</div>
            </nav>

            {/* Mobile controls */}
            <div className="flex items-center gap-2 md:hidden">
              {ThemeButton}
              <button
                onClick={() => setOpen((o) => !o)}
                aria-label="Toggle menu"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-misc-blue text-xl text-white"
              >
                {open ? <FiX /> : <FiMenu />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          <AnimatePresence>
            {open && (
              <motion.ul
                initial={{ opacity: 0, y: -12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className="glass-nav mt-2 overflow-hidden rounded-3xl p-2 md:hidden"
              >
                {NAV.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`display block rounded-2xl px-4 py-3 text-2xl ${
                        active === item.id
                          ? "bg-misc-blue/10 text-misc-blue dark:text-misc-lightBlue"
                          : "text-slate-800 dark:text-slate-100"
                      }`}
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
}

export default Header;
