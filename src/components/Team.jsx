import { motion } from "framer-motion";
import { TiSocialInstagram } from "react-icons/ti";
import { FaFacebook, FaWhatsapp, FaGithubAlt, FaLinkedin } from "react-icons/fa";
import { PiMicrosoftOutlookLogoFill } from "react-icons/pi";
import { SiGmail } from "react-icons/si";
import { gmailCompose, outlookCompose } from "../assets/socials";
import teams from "../assets/teams.json";
import SectionHeading from "./ui/SectionHeading";
import TiltCard from "./ui/TiltCard";
import RevealText from "./ui/RevealText";
import SectionBackdrop from "./ui/SectionBackdrop";

const SOCIALS = [
  ["instagram", TiSocialInstagram, "Instagram"],
  ["facebook", FaFacebook, "Facebook"],
  ["github", FaGithubAlt, "GitHub"],
  ["linkedin", FaLinkedin, "LinkedIn"],
  ["whatsapp", FaWhatsapp, "WhatsApp"],
];

/**
 * All icon links for a member. `social.email` holds an email address (not a URL) and turns
 * into two icons, Gmail and Outlook, that open a new message in the browser or the phone app.
 */
function memberLinks(member) {
  const social = member.social || {};
  const links = SOCIALS.filter(([key]) => social[key]).map(([key, Icon, label]) => ({
    key,
    Icon,
    label,
    href: social[key],
  }));
  if (social.email) {
    const address = social.email.replace(/^mailto:/i, "");
    links.push(
      { key: "gmail", Icon: SiGmail, label: "Gmail", href: gmailCompose(address) },
      { key: "outlook", Icon: PiMicrosoftOutlookLogoFill, label: "Outlook", href: outlookCompose(address) },
    );
  }
  return links;
}

const imageSrc = (img) =>
  !img
    ? ""
    : img.startsWith("http") || img.startsWith("/")
      ? img
      : encodeURI(`${import.meta.env.BASE_URL}${img}`);

/** A single member card: photo, role chip, socials that slide up on hover */
function MemberCard({ member, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard max={6} className="rounded-3xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-500 group-hover:-translate-y-1 group-hover:border-misc-blue/60 group-hover:shadow-2xl group-hover:shadow-misc-blue/20 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="relative aspect-[4/5] overflow-hidden bg-slate-200 dark:bg-slate-800">
            {member.image ? (
              <img
                src={imageSrc(member.image)}
                alt={member.name}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0078D4&color=fff&size=400`;
                }}
                className="h-full w-full object-cover object-top transition-all duration-700 group-hover:scale-110 [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0"
              />
            ) : (
              /* No photo yet: brand-coloured initials, no outside request */
              <div
                role="img"
                aria-label={member.name}
                className="flex h-full w-full items-center justify-center bg-gradient-to-br from-misc-blue to-misc-purple transition-transform duration-700 group-hover:scale-110"
              >
                <span className="display text-7xl text-white/90">
                  {member.name
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-misc-night/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-br from-misc-blue/30 to-misc-purple/30 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100" />

            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-misc-blue shadow backdrop-blur dark:bg-misc-darker/80 dark:text-misc-lightBlue">
              {member.role}
            </span>

            {/* Social links */}
            {memberLinks(member).length > 0 && (
              <div className="absolute inset-x-0 bottom-0 flex translate-y-0 justify-center gap-1.5 bg-gradient-to-t from-slate-950/90 via-slate-950/55 to-transparent p-3">
                {memberLinks(member).map(({ key: k, Icon, label, href }) => (
                  <a
                    key={k}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on ${label}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg text-slate-900 shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-misc-purple hover:text-white"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="p-5">
            <h4 className="display text-2xl text-slate-900 transition-colors duration-300 group-hover:text-misc-blue dark:text-white dark:group-hover:text-misc-lightBlue">
              {member.name}
            </h4>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

/**
 * Team
 *
 * Members grouped by team (from teams.json). Each group gets an oversized
 * outlined title with a member count.
 */
function Team() {
  return (
    <section id="team" className="relative isolate bg-slate-50 px-4 py-24 dark:bg-misc-darker md:py-32">
      <SectionBackdrop />
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="The people"
          title="Meet our team"
          accent={["team"]}
          subtitle="The passionate individuals driving innovation and building the community at MISC."
          className="mb-20 md:mb-28"
        />

        {Object.entries(teams).map(([section, members]) => (
          <div key={section} className="mb-24 last:mb-0 md:mb-32">
            <div className="mb-10 flex items-end justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
              <RevealText
                as="h3"
                data-clear-backdrop
                text={section.replace(/_/g, " ")}
                className="display text-outline text-6xl text-slate-900 dark:text-white sm:text-7xl md:text-8xl [--outline-fill:#f4efe6] dark:[--outline-fill:rgb(var(--misc-darker))]"
              />
              <span className="display text-gradient mb-2 text-3xl md:text-5xl">
                {String(members.length).padStart(2, "0")}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {members.map((m, i) => (
                <MemberCard key={m.id || m.name} member={m} index={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Team;
