import {
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaEnvelope,
  FaFacebookF,
} from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { PiMicrosoftOutlookLogoFill } from "react-icons/pi";

/**
 * Web-mail "compose" links. A plain mailto: link does nothing on a laptop that has no mail
 * app set up, so we offer Gmail and Outlook in the browser as well. Both open a new
 * message addressed to `to`; on a phone they open the Gmail / Outlook app if it is installed.
 */
export const gmailCompose = (to) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}`;
export const outlookCompose = (to) =>
  `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(to)}`;

export const CLUB_EMAIL = "ignitesclub@blr.amrita.edu";

/** Club social links, shared by the CTA band and the footer. */
export const SOCIAL_LINKS = [
  { icon: FaInstagram, url: "https://www.instagram.com/ignitestudentsclub/", label: "Instagram" },
  { icon: FaLinkedinIn, url: "https://www.linkedin.com/company/microsoft-ignite-students-club-aseb", label: "LinkedIn" },
  { icon: FaYoutube, url: "https://www.youtube.com/@IgniteStudentsClub", label: "YouTube" },
  { icon: FaFacebookF, url: "https://www.facebook.com/profile.php?id=61556389845852", label: "Facebook" },
  { icon: SiGmail, url: gmailCompose(CLUB_EMAIL), label: "Gmail" },
  { icon: PiMicrosoftOutlookLogoFill, url: outlookCompose(CLUB_EMAIL), label: "Outlook" },
  { icon: FaEnvelope, url: `mailto:${CLUB_EMAIL}`, label: "Email app" },
];
