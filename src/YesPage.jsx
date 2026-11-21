import { forwardRef, useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";

const MEDIA_PATH = "/media";

const MOMENTS = [
  {
    id: "night-out",
    kind: "photo",
    label: "Photo",
    title: "A little night out",
    note: "Just us, out in the world.",
    src: `${MEDIA_PATH}/PHOTO-2026-11-21-07-27-02.jpg`,
    alt: "Two people sharing a quiet moment together outdoors at night.",
  },
  {
    id: "portrait-day",
    kind: "photo",
    label: "Photo",
    title: "Looking sharp",
    note: "One of those photos that makes you smile.",
    src: `${MEDIA_PATH}/PHOTO-2026-11-21-07-27-04.jpg`,
    alt: "A person dressed in a vest and tie, standing outside.",
  },
  {
    id: "video-night",
    kind: "video",
    label: "Video",
    title: "A day worth replaying",
    note: "Press play and relive the moment.",
    src: `${MEDIA_PATH}/VIDEO-2026-11-21-07-27-31.mp4`,
    poster: `${MEDIA_PATH}/PHOTO-2026-11-21-07-27-34.jpg`,
    alt: "A close-up selfie of two people together.",
  },
  {
    id: "close-up",
    kind: "photo",
    label: "Photo",
    title: "The little details",
    note: "Even the small things are worth keeping.",
    src: `${MEDIA_PATH}/PHOTO-2026-11-21-07-27-33.jpg`,
    alt: "A close-up photograph of a person's lower torso.",
  },
  {
    id: "video-selfie",
    kind: "video",
    label: "Video",
    title: "The moment we couldn't stop laughing",
    note: "A tiny clip from our camera roll.",
    src: `${MEDIA_PATH}/VIDEO-2026-11-21-07-27-33.mp4`,
    poster: `${MEDIA_PATH}/PHOTO-2026-11-21-07-27-37.jpg`,
    alt: "Two people smiling together in a selfie.",
  },
  {
    id: "soft-selfie",
    kind: "photo",
    label: "Photo",
    title: "A face I love",
    note: "A close-up, because why not?",
    src: `${MEDIA_PATH}/PHOTO-2026-11-21-07-27-34.jpg`,
    alt: "A close-up selfie of two people looking at the camera.",
  },
  {
    id: "headwrap-selfie",
    kind: "photo",
    label: "Photo",
    title: "A cozy little selfie",
    note: "Caught in a quiet moment.",
    src: `${MEDIA_PATH}/PHOTO-2026-11-21-07-27-35.jpg`,
    alt: "A person wearing a dark head wrap and hoodie, taking a selfie.",
  },
  {
    id: "heart-hands",
    kind: "photo",
    label: "Photo",
    title: "Made with our hands",
    note: "A tiny heart, from the two of us.",
    src: `${MEDIA_PATH}/PHOTO-2026-11-21-07-27-36.jpg`,
    alt: "Two people making a heart shape with their hands.",
  },
  {
    id: "cheek-kiss",
    kind: "photo",
    label: "Photo",
    title: "A kiss for the camera",
    note: "One of my favorite kinds of pictures.",
    src: `${MEDIA_PATH}/PHOTO-2026-11-21-07-27-37.jpg`,
    alt: "One person kissing their partner on the cheek outdoors.",
  },
  {
    id: "playful-couple",
    kind: "photo",
    label: "Photo",
    title: "The silly ones are the best",
    note: "A little bit of chaos, a lot of love.",
    src: `${MEDIA_PATH}/PHOTO-2026-11-21-07-27-38.jpg`,
    alt: "A couple making playful expressions in a selfie.",
  },
  {
    id: "peace-sign",
    kind: "photo",
    label: "Photo",
    title: "Too cute not to save",
    note: "A quick pose and a bright smile.",
    src: `${MEDIA_PATH}/PHOTO-2026-11-21-07-27-39.jpg`,
    alt: "A person with braids smiling and making peace signs.",
  },
  {
    id: "sunny-selfie",
    kind: "photo",
    label: "Photo",
    title: "A sunny little hello",
    note: "A smile that brightens the whole page.",
    src: `${MEDIA_PATH}/PHOTO-2026-11-21-07-27-40.jpg`,
    alt: "A person smiling for a selfie in warm sunlight.",
  },
  {
    id: "silly-face",
    kind: "photo",
    label: "Photo",
    title: "Never a dull moment",
    note: "Proof that we never take ourselves too seriously.",
    src: `${MEDIA_PATH}/PHOTO-2026-11-21-07-27-41.jpg`,
    alt: "A person posing playfully for a close-up selfie.",
  },
  {
    id: "jersey-pose",
    kind: "photo",
    label: "Photo",
    title: "Game-day energy",
    note: "Serving looks and team spirit.",
    src: `${MEDIA_PATH}/PHOTO-2026-11-21-07-27-42.jpg`,
    alt: "A person posing outdoors in a black and white sports jersey.",
  },
  {
    id: "jersey-smile",
    kind: "photo",
    label: "Photo",
    title: "That smile, though",
    note: "A favorite outfit and an even better smile.",
    src: `${MEDIA_PATH}/PHOTO-2026-11-21-07-27-43.jpg`,
    alt: "A person smiling in a black and white sports jersey.",
  },
  {
    id: "jersey-moment",
    kind: "photo",
    label: "Photo",
    title: "A little main-character moment",
    note: "Confident, playful, and completely you.",
    src: `${MEDIA_PATH}/PHOTO-2026-11-21-07-27-45.jpg`,
    alt: "A person posing playfully outdoors in a sports jersey.",
  },
  {
    id: "video-glam",
    kind: "video",
    label: "Video",
    title: "A little bit of glam",
    note: "A favorite moment, saved in motion.",
    src: `${MEDIA_PATH}/VIDEO-2026-11-21-07-27-57.mp4`,
    poster: `${MEDIA_PATH}/PHOTO-2026-11-21-07-27-57.jpg`,
    alt: "A dressed-up portrait with a burgundy head wrap.",
  },
  {
    id: "burgundy-glow",
    kind: "photo",
    label: "Photo",
    title: "All dressed up",
    note: "A whole moment in burgundy and sparkle.",
    src: `${MEDIA_PATH}/PHOTO-2026-11-21-07-27-57.jpg`,
    alt: "A person wearing a burgundy head wrap and a sparkling necklace.",
  },
  {
    id: "video-day-out",
    kind: "video",
    label: "Video",
    title: "A little day-out clip",
    note: "Tap to watch this memory.",
    src: `${MEDIA_PATH}/VIDEO-2026-11-21-07-27-58.mp4`,
    poster: `${MEDIA_PATH}/PHOTO-2026-11-21-07-27-42.jpg`,
    alt: "A person posing in a sports jersey outside.",
  },
  {
    id: "video-laugh",
    kind: "video",
    label: "Video",
    title: "One for the camera roll",
    note: "A small moment, kept close.",
    src: `${MEDIA_PATH}/VIDEO-2026-11-21-07-27-59.mp4`,
    poster: `${MEDIA_PATH}/PHOTO-2026-11-21-07-27-43.jpg`,
    alt: "A smiling portrait in a sports jersey.",
  },
  {
    id: "glasses",
    kind: "photo",
    label: "Photo",
    title: "A candid kind of lovely",
    note: "The everyday moments make the best memories.",
    src: `${MEDIA_PATH}/PHOTO-2026-11-21-07-27-60.jpg`,
    alt: "A person wearing glasses, captured in a candid indoor portrait.",
  },
];

const HERO_PHOTOS = MOMENTS.filter((moment) => moment.kind === "photo");

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

function HeroPhotoStack({ reduceMotion }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isShowingInterlude, setIsShowingInterlude] = useState(false);

  useEffect(() => {
    if (reduceMotion || HERO_PHOTOS.length < 2) return undefined;

    const nextPhoto = HERO_PHOTOS[(activeIndex + 1) % HERO_PHOTOS.length];
    const preload = new Image();
    let advanceTimeoutId;
    let interludeTimeoutId;
    let cancelled = false;
    let scheduled = false;

    const scheduleAdvance = () => {
      if (cancelled || scheduled) return;
      scheduled = true;
      advanceTimeoutId = window.setTimeout(() => {
        setIsShowingInterlude(true);
        interludeTimeoutId = window.setTimeout(() => {
          setActiveIndex((index) => (index + 1) % HERO_PHOTOS.length);
          setIsShowingInterlude(false);
        }, 850);
      }, 4200);
    };

    preload.onload = scheduleAdvance;
    preload.onerror = () => {
      console.error(`Unable to preload hero slideshow image: ${nextPhoto.src}`);
    };
    preload.src = nextPhoto.src;

    if (preload.complete && preload.naturalWidth > 0) {
      scheduleAdvance();
    }

    return () => {
      cancelled = true;
      window.clearTimeout(advanceTimeoutId);
      window.clearTimeout(interludeTimeoutId);
      preload.onload = null;
      preload.onerror = null;
    };
  }, [activeIndex, reduceMotion]);

  const activePhoto = HERO_PHOTOS[activeIndex];

  return (
    <div className="yes-hero__art" aria-hidden="true">
      <div className="hero-photo-card hero-photo-card--back-two" />
      <div className="hero-photo-card hero-photo-card--back-one" />
      <AnimatePresence initial={false}>
        <m.div
          key={activePhoto.id}
          className="hero-photo-card hero-photo-card--front"
          initial={reduceMotion ? false : { opacity: 0, y: 12, rotate: 1 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          exit={{ opacity: 1, y: -4, rotate: -2 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <m.img
            key={activePhoto.id}
            src={activePhoto.src}
            alt=""
            decoding="async"
            animate={{ opacity: isShowingInterlude ? 0 : 1 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.3 }}
          />
          <m.div
            className="hero-photo-card__interlude"
            animate={{ opacity: isShowingInterlude ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.3 }}
          >
            <span>I love you</span>
            <span aria-hidden="true">♥</span>
          </m.div>
          <span className="hero-photo-card__badge">♡&nbsp; our moments</span>
        </m.div>
      </AnimatePresence>
      <span className="hero-photo-stack__sparkle hero-photo-stack__sparkle--one">✦</span>
      <span className="hero-photo-stack__sparkle hero-photo-stack__sparkle--two">✧</span>
    </div>
  );
}

const MomentCard = forwardRef(function MomentCard({ moment, onOpen }, ref) {
  const isVideo = moment.kind === "video";
  const previewSrc = isVideo ? moment.poster : moment.src;

  return (
    <m.button
      ref={ref}
      type="button"
      className={`moment-card moment-card--${moment.kind}`}
      layout
      variants={CARD_VARIANTS}
      whileHover={{ y: -8, rotate: isVideo ? 1 : -1, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onOpen(moment)}
      aria-label={`Open ${moment.label.toLowerCase()}: ${moment.title}`}
    >
      <span className="moment-card__art">
        <span className="moment-card__orb moment-card__orb--one" />
        <span className="moment-card__orb moment-card__orb--two" />
        <img
          className="moment-card__image"
          src={previewSrc}
          alt={moment.alt}
          loading="lazy"
          decoding="async"
        />
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
});

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

function MomentDialog({
  moment,
  onClose,
  closeButtonRef,
  fullscreenRef,
  isFullscreen,
  fullscreenError,
  onToggleFullscreen,
}) {
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
        ref={fullscreenRef}
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
        <div className="moment-dialog__toolbar">
          <button
            className="moment-dialog__fullscreen"
            type="button"
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? "Exit full screen" : "View media full screen"}
            title={isFullscreen ? "Exit full screen" : "View media full screen"}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {isFullscreen ? (
                <path d="M8 3v5H3M16 3v5h5M8 21v-5H3m13 5v-5h5" />
              ) : (
                <path d="M3 8V3h5m8 0h5v5M3 16v5h5m13-5v5h-5" />
              )}
            </svg>
          </button>
          <button
            ref={closeButtonRef}
            className="moment-dialog__close"
            type="button"
            onClick={onClose}
            aria-label="Close preview"
          >
            ×
          </button>
        </div>
        <div className="moment-dialog__media">
          {moment.src && isVideo ? (
            <video
              src={moment.src}
              poster={moment.poster || undefined}
              controls
              playsInline
              preload="none"
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
        {fullscreenError && (
          <p className="moment-dialog__error" role="status">
            {fullscreenError}
          </p>
        )}
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
  const [activeFilter, setActiveFilter] = useState("all");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState("");
  const closeButtonRef = useRef(null);
  const fullscreenRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const visibleMoments = MOMENTS.filter(
    (moment) => activeFilter === "all" || moment.kind === activeFilter,
  );

  useEffect(() => {
    if (!selectedMoment) return undefined;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !document.fullscreenElement) {
        setSelectedMoment(null);
      }
    };
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === fullscreenRef.current);
      setFullscreenError("");
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [selectedMoment]);

  async function toggleFullscreen() {
    const preview = fullscreenRef.current;
    if (!preview) return;

    setFullscreenError("");

    try {
      if (document.fullscreenElement === preview) {
        await document.exitFullscreen();
      } else if (preview.requestFullscreen) {
        await preview.requestFullscreen();
      } else {
        setFullscreenError("Full screen isn't supported in this browser.");
      }
    } catch (error) {
      setFullscreenError("Couldn't open full screen. Please try again.");
      console.error("Unable to toggle the media preview's full-screen mode.", error);
    }
  }

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
              A little scrapbook of our photos, favorite clips, and everything
              that makes this feel like us.
            </p>
            <a className="hero-scroll-link" href="#moments">
              Explore our moments <span aria-hidden="true">↓</span>
            </a>
          </div>

          <HeroPhotoStack reduceMotion={reduceMotion} />
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
              Sixteen photos and five little clips, all in one place.
            </p>
          </m.div>

          <div className="moment-filters" role="group" aria-label="Filter memories">
            {[
              { id: "all", label: "Everything", count: MOMENTS.length },
              {
                id: "photo",
                label: "Photos",
                count: MOMENTS.filter((moment) => moment.kind === "photo").length,
              },
              {
                id: "video",
                label: "Videos",
                count: MOMENTS.filter((moment) => moment.kind === "video").length,
              },
            ].map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={`moment-filter${activeFilter === filter.id ? " is-active" : ""}`}
                aria-pressed={activeFilter === filter.id}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label} <span>{filter.count}</span>
              </button>
            ))}
          </div>

          <m.div
            className="moment-grid"
            variants={GRID_VARIANTS}
            layout
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
          >
            <AnimatePresence mode="popLayout">
              {visibleMoments.map((moment) => (
                <MomentCard
                  key={moment.id}
                  moment={moment}
                  onOpen={setSelectedMoment}
                />
              ))}
            </AnimatePresence>
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
            fullscreenRef={fullscreenRef}
            isFullscreen={isFullscreen}
            fullscreenError={fullscreenError}
            onToggleFullscreen={toggleFullscreen}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default YesPage;
