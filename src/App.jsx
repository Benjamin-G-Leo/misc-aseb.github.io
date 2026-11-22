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

  // Feed the scroll distance to CSS so the gradient text colours slide as you scroll
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      document.documentElement.style.setProperty("--scroll-y", String(window.scrollY));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
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
