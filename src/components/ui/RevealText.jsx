import { motion } from "framer-motion";

/**
 * RevealText
 *
 * Masked word-by-word reveal: each word slides up out of an invisible
 * "slot" when the heading scrolls into view (the Krackerz-style headline).
 *
 * @param {string}   text        The heading text
 * @param {string}   as          Tag to render (h1, h2, h3, p, div...)
 * @param {function} wordClass   (word, index) => extra className for a word
 */
export default function RevealText({
  text,
  as: Tag = "h2",
  className = "",
  wordClass,
  delay = 0,
  stagger = 0.07,
  ...rest
}) {
  const MotionTag = motion[Tag];
  const words = text.split(" ");

  return (
    <MotionTag
      className={className}
      aria-label={text}
      {...rest}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="-mx-[0.05em] mr-[0.17em] inline-block overflow-hidden px-[0.05em] align-bottom pb-[0.1em] -mb-[0.1em]"
        >
          <motion.span
            className={`inline-block ${wordClass ? wordClass(word, i) : ""}`}
            variants={{
              hidden: { y: "115%", rotate: 4 },
              visible: {
                y: "0%",
                rotate: 0,
                transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
