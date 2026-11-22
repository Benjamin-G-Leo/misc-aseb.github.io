import { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Statement from "./components/Statement";
import About from "./components/About";
import Features from "./components/Features";
import PastEvents from "./components/PastEvents";
import UpcomingEvents from "./components/UpcomingEvents";
import Team from "./components/Team";
import JoinCta from "./components/JoinCta";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Browsers can block localStorage (private windows, strict privacy settings) and then
// even reading it throws. Wrap both calls so the page still loads, just without remembering the theme.
const readTheme = () => {
  try {
    return localStorage.getItem("theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};
const saveTheme = (value) => {
  try {
    localStorage.setItem("theme", value);
  } catch {
    /* storage unavailable: the choice is simply not remembered */
  }
};

function App() {
  const [theme, setTheme] = useState(readTheme);

  // Sync Tailwind dark mode class + persist the choice
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    saveTheme(theme);
  }, [theme]);

  // Feed the scroll distance to CSS so the gradient text colours slide as you scroll.
  // The value is written only onto the gradient headings that are on screen, not onto <html>:
  // changing a custom property on the root makes the browser re-check every element on the
  // page (thousands of them) on every scroll frame, which made phones stutter.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const visible = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      write(true);
    });
    let frame = 0;
    let last = -1;
    function write(force = false) {
      frame = 0;
      const y = Math.round(window.scrollY / 2) * 2; // skip sub-pixel noise
      if (y === last && force !== true) return;
      last = y;
      visible.forEach((el) => el.style.setProperty("--scroll-y", String(y)));
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(write);
    };
    document.querySelectorAll(".text-gradient").forEach((el) => io.observe(el));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <Header theme={theme} setTheme={setTheme} />
      <main>
        <Hero />
        <Statement />
        <About />
        <Features />
        <Team />
        <PastEvents />
        <UpcomingEvents />
        <JoinCta />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
