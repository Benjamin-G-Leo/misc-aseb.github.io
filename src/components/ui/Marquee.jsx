/**
 * Marquee
 *
 * Seamless infinite horizontal scroller. Children are rendered twice and the
 * track slides by exactly one copy's width. Pauses on hover.
 */
export default function Marquee({
  children,
  reverse = false,
  duration = 40,
  className = "",
  pauseOnHover = true,
}) {
  const track = (hidden) => (
    <div
      aria-hidden={hidden || undefined}
      className={`flex min-w-full shrink-0 items-center justify-around ${
        pauseOnHover ? "group-hover/marquee:[animation-play-state:paused]" : ""
      }`}
      style={{
        animation: `marquee ${duration}s linear infinite`,
        animationDirection: reverse ? "reverse" : "normal",
      }}
    >
      {children}
    </div>
  );

  return (
    <div className={`group/marquee flex w-full overflow-hidden ${className}`}>
      {track(false)}
      {track(true)}
    </div>
  );
}
