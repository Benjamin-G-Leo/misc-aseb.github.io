import { motion } from "framer-motion";

/** Simple scroll-triggered fade + rise. */
export default function FadeUp({
  children,
  delay = 0,
  y = 40,
  className = "",
  as = "div",
  ...rest
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
