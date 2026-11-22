import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

const src = (name) => encodeURI(`${import.meta.env.BASE_URL}events/${name}`);

/**
 * EventDialog
 *
 * Full-screen viewer for one event: a photo carousel (arrows, thumbnails, left/right
 * keys) and the full write-up. It is rendered in a portal on <body> because the Past
 * Events gallery sits inside a transformed, pinned element, which would otherwise
 * trap a `position: fixed` overlay.
 *
 * Keyboard: Escape closes, Tab stays inside the dialog, arrow keys change the photo.
 * The page behind it is locked from scrolling while it is open, and focus goes back to
 * the card that opened it.
 *
 * @param {object}   event    An entry from events.json (title, subtitle, details, images)
 * @param {function} onClose  Called when the viewer should close
 */
export default function EventDialog({ event, onClose }) {
  const reduce = useReducedMotion();
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const opener = useRef(document.activeElement);
  const images = event.images?.length ? event.images : [event.image];
  const [index, setIndex] = useState(0);
  const many = images.length > 1;

  const go = useCallback(
    (step) => setIndex((i) => (i + step + images.length) % images.length),
    [images.length],
  );

  // Lock page scroll, move focus in, and put it back on close
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const toRestore = opener.current;
    return () => {
      document.body.style.overflow = previousOverflow;
      if (toRestore && typeof toRestore.focus === "function") toRestore.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      } else if (e.key === "ArrowRight" && many) go(1);
      else if (e.key === "ArrowLeft" && many) go(-1);
      else if (e.key === "Tab" && panelRef.current) {
        // keep Tab inside the dialog
        const items = panelRef.current.querySelectorAll(
          "button, [href], [tabindex]:not([tabindex='-1'])",
        );
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, go, many]);

  const fade = reduce ? { duration: 0 } : { duration: 0.25 };

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={fade}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-dialog-title"
          initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={fade}
          className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-misc-night text-white shadow-2xl"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close event details"
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-xl text-white backdrop-blur transition hover:bg-misc-blue"
          >
            <FiX />
          </button>

          <div className="overflow-y-auto">
            {/* Photo carousel */}
            <div className="relative bg-black">
              <img
                key={images[index]}
                src={src(images[index])}
                alt={`${event.title}, photo ${index + 1} of ${images.length}`}
                className="mx-auto block max-h-[52vh] w-full object-contain"
              />
              {many && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-2xl backdrop-blur transition hover:bg-misc-blue"
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-2xl backdrop-blur transition hover:bg-misc-blue"
                  >
                    <FiChevronRight />
                  </button>
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold tracking-wider backdrop-blur">
                    {index + 1} / {images.length}
                  </span>
                </>
              )}
            </div>

            {many && (
              <div className="flex gap-2 overflow-x-auto bg-black/40 p-3 [scrollbar-color:rgba(255,255,255,0.3)_transparent] [scrollbar-width:thin]" role="group" aria-label="Choose a photo">
                {images.map((name, i) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Show photo ${i + 1}`}
                    aria-current={i === index}
                    className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      i === index ? "border-misc-lightBlue" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={src(name)} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Write-up */}
            <div className="p-6 sm:p-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-misc-lightBlue">
                Past event{event.date ? ` · ${event.date}` : ""}
              </p>
              <h3 id="event-dialog-title" className="display text-3xl sm:text-5xl">
                {event.title}
              </h3>
              {event.subtitle && (
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-slate-300">{event.subtitle}</p>
              )}
              <div className="mt-5 max-w-3xl space-y-4 leading-relaxed text-slate-200">
                {(event.details?.length ? event.details : [event.description]).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
