import Logo from "/logo.png";
import { SOCIAL_LINKS } from "../assets/socials";

const quickLinks = [
  ["Home", "#"],
  ["About", "#about"],
  ["What we do", "#what-we-do"],
  ["Events", "#events"],
  ["Team", "#team"],
];

/**
 * Footer
 *
 * Brand, map, links, socials, plus an oversized gradient wordmark that
 * fades into the bottom edge.
 */
function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-misc-night text-white">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 border-t border-white/10 pt-16 md:grid-cols-12">
          {/* Brand + map */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <img src={Logo} alt="MISC Logo" className="h-12 w-auto" />
              <div>
                <h3 className="display text-2xl">Microsoft Ignite Students Club</h3>
                <p className="text-sm font-medium text-misc-lightBlue">
                  Ignite • Innovate • Elevate
                </p>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-all duration-500 hover:border-misc-lightBlue/50 hover:shadow-misc-blue/20">
              <iframe
                title="MISC Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.1981901521413!2d77.67316457518486!3d12.894974016553412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1339d7500cd3%3A0x4b4fbdff03bfee09!2sAmrita%20Vishwa%20Vidyapeetam%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1735771492597!5m2!1sen!2sin"
                width="100%"
                height="200"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-48 w-full opacity-90 transition-opacity duration-500 hover:opacity-100"
              />
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 md:pl-8">
            <h4 className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-misc-lightBlue">
              Quick links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group/l display inline-flex items-center gap-3 text-3xl text-slate-300 transition-all duration-300 hover:translate-x-2 hover:text-white"
                  >
                    <span className="h-0.5 w-0 bg-misc-lightBlue transition-all duration-300 group-hover/l:w-6" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div className="md:col-span-4">
            <h4 className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-misc-lightBlue">
              Connect with us
            </h4>
            <ul className="space-y-3">
              {SOCIAL_LINKS.map(({ icon: Icon, url, label }) => (
                <li key={label}>
                  <a
                    href={url}
                    target={url.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="group/s flex items-center gap-4 text-slate-300 transition-colors duration-300 hover:text-white"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg transition-all duration-300 group-hover/s:-rotate-6 group-hover/s:scale-110 group-hover/s:border-transparent group-hover/s:bg-gradient-to-br group-hover/s:from-misc-blue group-hover/s:to-misc-purple">
                      <Icon />
                    </span>
                    <span className="font-semibold">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-16 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Microsoft Ignite Students Club. All rights reserved.
        </p>
      </div>

      {/* Giant wordmark */}
      <div
        aria-hidden="true"
        className="display pointer-events-none mt-4 select-none text-center text-[clamp(8rem,36vw,34rem)] leading-[0.75] text-transparent [-webkit-mask-image:linear-gradient(to_bottom,#000_20%,transparent_95%)] [mask-image:linear-gradient(to_bottom,#000_20%,transparent_95%)]"
        style={{
          backgroundImage: "linear-gradient(90deg,#0078D4,#2B88D8,#5C2D91)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          opacity: 0.55,
        }}
      >
        MISC
      </div>
    </footer>
  );
}

export default Footer;
