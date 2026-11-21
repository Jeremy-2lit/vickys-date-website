import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";

// Put media files in public/media and use paths such as /media/photo.jpg.
const MOMENTS = [
  {
    id: "photo-one",
    kind: "photo",
    label: "Photo",
    title: "Our favorite little moment",
    note: "Add a photo and a little note about it.",
    src: "",
    poster: "",
    alt: "",
  },
  {
    id: "video-one",
    kind: "video",
    label: "Video",
    title: "A day worth replaying",
    note: "Add a video and a memory to go with it.",
    src: "",
    poster: "",
    alt: "",
  },
  {
    id: "photo-two",
    kind: "photo",
    label: "Photo",
    title: "A place that feels like us",
    note: "Add a photo and a little note about it.",
    src: "",
    poster: "",
    alt: "",
  },
  {
    id: "video-two",
    kind: "video",
    label: "Video",
    title: "The moment we couldn't stop laughing",
    note: "Add a video and a memory to go with it.",
    src: "",
    poster: "",
    alt: "",
  },
  {
    id: "photo-three",
    kind: "photo",
    label: "Photo",
    title: "One for the scrapbook",
    note: "Add a photo and a little note about it.",
    src: "",
    poster: "",
    alt: "",
  },
  {
    id: "video-three",
    kind: "video",
    label: "Video",
    title: "Our next little adventure",
    note: "Add a video and a memory to go with it.",
    src: "",
    poster: "",
    alt: "",
  },
];

// Audio paths such as /media/song.mp3 enable the native player automatically.
const AUDIO_TRACKS = [
  {
    id: "song-one",
    title: "Our song",
    note: "Add a song or voice note to make this page yours.",
    src: "",
  },
  {
    id: "song-two",
    title: "A little voice note",
    note: "Add another audio file whenever you're ready.",
    src: "",
  },
];

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 18 },
  },
};

const GRID_VARIANTS = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09 },
  },
};

const WAVEFORM_HEIGHTS = [28, 48, 36, 68, 42, 84, 55, 74, 34, 62, 44, 80, 38, 58, 30, 70, 46, 60, 34, 52, 26, 64, 42, 76];

function MomentCard({ moment, onOpen }) {
  const isVideo = moment.kind === "video";
  const previewSrc = isVideo ? moment.poster : moment.src;

  return (
    <m.button
      type="button"
      className={`moment-card moment-card--${moment.kind}`}
      variants={CARD_VARIANTS}
      whileHover={{ y: -8, rotate: isVideo ? 1 : -1, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onOpen(moment)}
      aria-label={`Open ${moment.label.toLowerCase()} placeholder: ${moment.title}`}
    >
      <span className="moment-card__art">
        <span className="moment-card__orb moment-card__orb--one" />
        <span className="moment-card__orb moment-card__orb--two" />
        {previewSrc ? (
          <img
            className="moment-card__image"
            src={previewSrc}
            alt={moment.alt}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="moment-card__placeholder" aria-hidden="true">
            <span className="moment-card__placeholder-icon">
              {isVideo ? "▶" : "♡"}
            </span>
            <span>{isVideo ? "VIDEO PREVIEW" : "PHOTO GOES HERE"}</span>
          </span>
        )}
        {isVideo && (
          <span className="moment-card__play" aria-hidden="true">
            <span>▶</span>
          </span>
        )}
        <span className="moment-card__type">
          <span aria-hidden="true">{isVideo ? "▶" : "♡"}</span> {moment.label}
        </span>
      </span>
      <span className="moment-card__copy">
        <span className="moment-card__title">{moment.title}</span>
        <span className="moment-card__note">{moment.note}</span>
      </span>
    </m.button>
  );
}

function AudioCard({ track, index }) {
  return (
    <m.article
      className={`audio-card audio-card--${index + 1}`}
      variants={CARD_VARIANTS}
      whileHover={{ y: -5 }}
    >
      <div className="audio-card__top">
        <m.div
          className="audio-card__disc"
          aria-hidden="true"
          animate={track.src ? { rotate: 360 } : undefined}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          <span>♫</span>
        </m.div>
        <div className="audio-card__details">
          <p className="audio-card__eyebrow">TRACK 0{index + 1}</p>
          <h3>{track.title}</h3>
          <p>{track.note}</p>
        </div>
      </div>

      <div className="audio-card__waveform" aria-hidden="true">
        {WAVEFORM_HEIGHTS.map((height, barIndex) => (
          <span key={barIndex} style={{ "--bar-height": `${height}%` }} />
        ))}
      </div>

      {track.src ? (
        <audio
          className="audio-card__player"
          controls
          preload="none"
          src={track.src}
        >
          Your browser does not support audio playback.
        </audio>
      ) : (
        <p className="audio-card__placeholder">
          Audio player placeholder · add a file to enable playback
        </p>
      )}
    </m.article>
  );
}

function MomentDialog({ moment, onClose, closeButtonRef }) {
  const isVideo = moment.kind === "video";

  return (
    <m.div
      className="moment-dialog"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <m.section
        className="moment-dialog__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="moment-dialog-title"
        initial={{ opacity: 0, y: 22, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          className="moment-dialog__close"
          type="button"
          onClick={onClose}
          aria-label="Close preview"
        >
          ×
        </button>
        <div className="moment-dialog__media">
          {moment.src && isVideo ? (
            <video
              src={moment.src}
              poster={moment.poster || undefined}
              controls
              playsInline
              preload="metadata"
            />
          ) : moment.src ? (
            <img src={moment.src} alt={moment.alt} />
          ) : (
            <div className="moment-dialog__empty">
              <span aria-hidden="true">{isVideo ? "▶" : "♡"}</span>
              <p>{isVideo ? "Your video preview will appear here." : "Your photo will appear here."}</p>
              <small>Add a media file to this moment in src/YesPage.jsx.</small>
            </div>
          )}
        </div>
        <div className="moment-dialog__caption">
          <span className="moment-dialog__eyebrow">{moment.label} PREVIEW</span>
          <h2 id="moment-dialog-title">{moment.title}</h2>
          <p>{moment.note}</p>
        </div>
      </m.section>
    </m.div>
  );
}

function YesPage() {
  const [selectedMoment, setSelectedMoment] = useState(null);
  const closeButtonRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!selectedMoment) return undefined;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedMoment(null);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [selectedMoment]);

  return (
    <main className="yes-page">
      <div className="yes-page__ambient" aria-hidden="true">
        <m.span
          className="ambient-orb ambient-orb--one"
          animate={reduceMotion ? undefined : { x: [0, 20, 0], y: [0, -16, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <m.span
          className="ambient-orb ambient-orb--two"
          animate={reduceMotion ? undefined : { x: [0, -18, 0], y: [0, 18, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="yes-page__content">
        <m.a
          className="back-link"
          href="./index.html"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span aria-hidden="true">←</span> Back to the question
        </m.a>

        <m.header
          className="yes-hero"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="yes-hero__copy">
            <p className="section-eyebrow">
              <span className="eyebrow-sparkle" aria-hidden="true">✦</span>
              A LITTLE YES, A LOT OF LOVE
            </p>
            <h1>
              A little world
              <br />
              of <span>our own.</span>
            </h1>
            <p className="yes-hero__description">
              A cozy place for the photos, videos, and songs that feel like us.
              Our favorite memories will go right here.
            </p>
            <a className="hero-scroll-link" href="#moments">
              Explore our moments <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="yes-hero__art" aria-hidden="true">
            <m.div
              className="hero-orbit hero-orbit--outer"
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
            />
            <m.div
              className="hero-orbit hero-orbit--inner"
              animate={reduceMotion ? undefined : { rotate: -360 }}
              transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
            />
            <m.div
              className="hero-heart"
              animate={reduceMotion ? undefined : { y: [0, -10, 0], scale: [1, 1.035, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <span>❤️</span>
            </m.div>
            <span className="hero-orbit-dot hero-orbit-dot--one">✦</span>
            <span className="hero-orbit-dot hero-orbit-dot--two">♡</span>
            <span className="hero-orbit-dot hero-orbit-dot--three">✧</span>
          </div>
        </m.header>

        <section className="page-section" id="moments" aria-labelledby="moments-title">
          <m.div
            className="section-heading"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <p className="section-eyebrow">
                <span className="eyebrow-sparkle" aria-hidden="true">✦</span>
                THE MEMORY ALBUM
              </p>
              <h2 id="moments-title">Little moments, <span>kept close.</span></h2>
            </div>
            <p className="section-heading__note">
              Photos and video previews go here. Tap a card to open its full-size moment.
            </p>
          </m.div>

          <m.div
            className="moment-grid"
            variants={GRID_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
          >
            {MOMENTS.map((moment) => (
              <MomentCard
                key={moment.id}
                moment={moment}
                onOpen={setSelectedMoment}
              />
            ))}
          </m.div>
        </section>

        <section className="page-section audio-section" aria-labelledby="audio-title">
          <m.div
            className="section-heading"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <p className="section-eyebrow">
                <span className="eyebrow-sparkle" aria-hidden="true">♫</span>
                OUR LITTLE SOUNDTRACK
              </p>
              <h2 id="audio-title">Songs that <span>feel like us.</span></h2>
            </div>
            <p className="section-heading__note">
              Add songs, a voice note, or any sound you want to keep close.
            </p>
          </m.div>

          <m.div
            className="audio-grid"
            variants={GRID_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {AUDIO_TRACKS.map((track, index) => (
              <AudioCard key={track.id} track={track} index={index} />
            ))}
          </m.div>
        </section>

        <m.footer
          className="yes-footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span aria-hidden="true">♡</span>
          <p>A little page for a lot of love.</p>
          <span aria-hidden="true">♡</span>
        </m.footer>
      </div>

      <AnimatePresence>
        {selectedMoment && (
          <MomentDialog
            key={selectedMoment.id}
            moment={selectedMoment}
            onClose={() => setSelectedMoment(null)}
            closeButtonRef={closeButtonRef}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default YesPage;
