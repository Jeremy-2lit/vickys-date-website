import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  useReducedMotion,
} from "framer-motion";

const FLOATING_HEARTS = ["♥", "♡", "♥", "♡", "♥", "♡", "♥"];
const HEART_DELAYS = [0, 2, 4, 1, 3, 5, 6];
const TRIGGER_DISTANCE = 110;
const CARD_PADDING = 15;
const ESCAPE_DISTANCE = 150;
const RUN_TIME = 10;
const MIN_TRANSITION_DURATION = 3000;
// Set this to a file under public/media when the soundtrack is ready.
const PORTAL_AUDIO_SRC = "";
const DESTINATION_IMAGES = [
  "PHOTO-2026-11-21-07-27-02.jpg",
  "PHOTO-2026-11-21-07-27-04.jpg",
  "PHOTO-2026-11-21-07-27-33.jpg",
  "PHOTO-2026-11-21-07-27-34.jpg",
  "PHOTO-2026-11-21-07-27-35.jpg",
  "PHOTO-2026-11-21-07-27-36.jpg",
  "PHOTO-2026-11-21-07-27-37.jpg",
  "PHOTO-2026-11-21-07-27-38.jpg",
  "PHOTO-2026-11-21-07-27-39.jpg",
  "PHOTO-2026-11-21-07-27-40.jpg",
  "PHOTO-2026-11-21-07-27-41.jpg",
  "PHOTO-2026-11-21-07-27-42.jpg",
  "PHOTO-2026-11-21-07-27-43.jpg",
  "PHOTO-2026-11-21-07-27-45.jpg",
  "PHOTO-2026-11-21-07-27-57.jpg",
  "PHOTO-2026-11-21-07-27-60.jpg",
].map((filename) => `/media/${filename}`);
const LOVE_MESSAGE = [
  { character: "I", color: "pink" },
  { character: " ", color: "space" },
  { character: "L", color: "red" },
  { character: "O", color: "red" },
  { character: "V", color: "red" },
  { character: "E", color: "red" },
  { character: " ", color: "space" },
  { character: "Y", color: "glow" },
  { character: "O", color: "glow" },
  { character: "U", color: "glow" },
];

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    let settled = false;

    const finish = (error) => {
      if (settled) return;
      settled = true;
      image.onload = null;
      image.onerror = null;
      if (error) reject(error);
      else resolve();
    };

    image.onload = () => {
      if (typeof image.decode === "function") {
        image.decode().then(() => finish(), () => finish());
      } else {
        finish();
      }
    };
    image.onerror = () => finish(new Error(`Unable to preload destination image: ${src}`));
    image.src = src;

    if (image.complete) {
      if (image.naturalWidth > 0) finish();
      else finish(new Error(`Unable to preload destination image: ${src}`));
    }
  });
}

function App() {
  const [isYes, setIsYes] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(RUN_TIME);
  const [buttonPosition, setButtonPosition] = useState({ x: "50%", y: "50%" });
  const [buttonPose, setButtonPose] = useState("center");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionStage, setTransitionStage] = useState("idle");
  const [transitionError, setTransitionError] = useState("");
  const [destinationPage, setDestinationPage] = useState(null);
  const [portalScale, setPortalScale] = useState(10);
  const cardRef = useRef(null);
  const buttonAreaRef = useRef(null);
  const buttonRef = useRef(null);
  const portalAudioRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!destinationPage) return undefined;

    const handlePopState = () => window.location.reload();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [destinationPage]);

  useEffect(() => {
    if (!timerStarted || isYes) return undefined;
    if (timeLeft === 0) {
      setIsYes(true);
      setButtonPosition({ x: "50%", y: "50%" });
      setButtonPose("center");
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setTimeLeft((remaining) => remaining - 1);
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [isYes, timeLeft, timerStarted]);

  function moveButton(pointerX, pointerY, force = false) {
    if (isYes || isTransitioning) return;

    const button = buttonRef.current;
    const area = buttonAreaRef.current;
    const card = cardRef.current;
    if (!button || !area || !card) return;

    const buttonRect = button.getBoundingClientRect();
    const areaRect = area.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const buttonX = buttonRect.left + buttonRect.width / 2;
    const buttonY = buttonRect.top + buttonRect.height / 2;
    const dx = buttonX - pointerX;
    const dy = buttonY - pointerY;

    if (Math.hypot(dx, dy) > TRIGGER_DISTANCE && !force) return;

    setTimerStarted(true);

    const halfWidth = button.offsetWidth / 2 + CARD_PADDING;
    const halfHeight = button.offsetHeight / 2 + CARD_PADDING;
    const minX = cardRect.left + halfWidth;
    const maxX = cardRect.right - halfWidth;
    const minY = cardRect.top + halfHeight;
    const maxY = cardRect.bottom - halfHeight;
    const angle = Math.atan2(dy, dx);
    let nextX = buttonX + Math.cos(angle) * ESCAPE_DISTANCE;
    let nextY = buttonY + Math.sin(angle) * ESCAPE_DISTANCE;

    nextX = Math.max(minX, Math.min(nextX, maxX));
    nextY = Math.max(minY, Math.min(nextY, maxY));

    if (Math.hypot(nextX - pointerX, nextY - pointerY) < TRIGGER_DISTANCE * 1.3) {
      let bestDistance = -1;

      for (let attempt = 0; attempt < 25; attempt += 1) {
        const candidateX = minX + Math.random() * (maxX - minX);
        const candidateY = minY + Math.random() * (maxY - minY);
        const distance = Math.hypot(candidateX - pointerX, candidateY - pointerY);

        if (distance > bestDistance) {
          bestDistance = distance;
          nextX = candidateX;
          nextY = candidateY;
        }
      }
    }

    setButtonPosition({
      x: nextX - areaRect.left,
      y: nextY - areaRect.top,
    });
    setButtonPose("escaping");
  }

  function handlePointerMove(event) {
    if (event.pointerType !== "touch") {
      moveButton(event.clientX, event.clientY);
    }
  }

  function handleButtonClick(event) {
    if (!isYes) {
      event.preventDefault();
      moveButton(event.clientX, event.clientY, true);
      return;
    }

    if (isTransitioning) return;

    primePortalAudio();
    setIsTransitioning(true);
    setTransitionStage("typing");
    setTransitionError("");
    void prepareDestination();
  }

  async function prepareDestination() {
    setTransitionError("");
    const minimumDuration = new Promise((resolve) =>
      window.setTimeout(resolve, MIN_TRANSITION_DURATION),
    );

    try {
      const [pageModule] = await Promise.all([
        import("./YesPage.jsx"),
        import("./yes-page.css"),
        Promise.all(DESTINATION_IMAGES.map(preloadImage)),
        minimumDuration,
      ]);
      setDestinationPage(() => pageModule.default);
      const portalDiameter = Math.max(
        200,
        Math.min(380, Math.min(window.innerWidth, window.innerHeight) * 0.4),
      );
      setPortalScale(Math.ceil((Math.hypot(window.innerWidth, window.innerHeight) / portalDiameter) * 1.5));
      setTransitionStage("portal");
    } catch (error) {
      console.error("Unable to prepare the Yes page before the transition.", error);
      setTransitionError("A few memories are taking a moment to load.");
    }
  }

  function primePortalAudio() {
    if (!PORTAL_AUDIO_SRC) return;
    if (!portalAudioRef.current) {
      portalAudioRef.current = new Audio(PORTAL_AUDIO_SRC);
      portalAudioRef.current.loop = true;
      portalAudioRef.current.preload = "auto";
    }

    portalAudioRef.current.muted = true;
    portalAudioRef.current.load();
    portalAudioRef.current.play().catch((error) => {
      console.error("Unable to prepare the portal audio.", error);
    });
  }

  function finishTransition() {
    if (PORTAL_AUDIO_SRC) {
      portalAudioRef.current.currentTime = 0;
      portalAudioRef.current.muted = false;
      portalAudioRef.current.play().catch((error) => {
        console.error("Unable to start the portal audio.", error);
      });
    }

    window.history.pushState({}, "", new URL("./yes.html", window.location.href));
    document.title = "Our Little Moments ❤️";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", "A little collection of photos, videos, and songs.");
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", "#2c1029");
    setTransitionStage("revealing");
  }

  if (destinationPage && transitionStage === "revealing") {
    const DestinationPage = destinationPage;
    return (
      <MotionConfig reducedMotion="user">
        <LazyMotion features={domAnimation}>
          <m.div
            className="destination-reveal"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.035 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <DestinationPage />
          </m.div>
        </LazyMotion>
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <div className="app-shell" onPointerMove={handlePointerMove}>
        <m.div className="background-hearts" aria-hidden="true">
          {FLOATING_HEARTS.map((heart, index) => (
            <m.span
              key={`${heart}-${index}`}
              className={`floating-heart floating-heart-${index + 1}`}
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: "-115vh",
                      rotate: 360,
                      opacity: [0, 0.8, 0],
                    }
              }
              transition={{
                duration: 12 + (index % 4) * 2,
                delay: HEART_DELAYS[index],
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {heart}
            </m.span>
          ))}
        </m.div>

        <m.main
              ref={cardRef}
              className="proposal-container"
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <m.div
                className="heart-icon"
                aria-hidden="true"
                animate={shouldReduceMotion ? undefined : { scale: [1, 1.12, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                ♡
              </m.div>

              <p className="small-text">I HAVE SOMETHING TO ASK YOU...</p>

              <h1>
                Will you be
                <br />
                my date? <span>❤️</span>
              </h1>

              <p className="description">
                Just one little question,
                <br />
                but it means a lot to me.
              </p>

              <div className="button-area" ref={buttonAreaRef}>
                <m.button
                  ref={buttonRef}
                  id="yesButton"
                  type="button"
                  disabled={isTransitioning}
                  className={isYes ? "yes-button" : ""}
                  initial={false}
                  animate={{
                    left: buttonPosition.x,
                    top: buttonPosition.y,
                    rotate: buttonPose === "escaping" ? -8 : 0,
                    scale: buttonPose === "escaping" ? 1.1 : isYes ? 1.15 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 24,
                    mass: 0.7,
                  }}
                  onPointerDown={(event) => {
                    if (event.pointerType === "touch" && !isYes) {
                      event.preventDefault();
                      moveButton(event.clientX, event.clientY, true);
                    }
                  }}
                  onClick={handleButtonClick}
                >
                  {isYes ? "YES ❤️" : "NO 🥺"}
                </m.button>
              </div>

              <p className="footer-text">Made with love, just for you.</p>

              <AnimatePresence mode="wait" initial={false}>
                {!isYes && (
                  <m.p
                    key="counter"
                    className="attempt-counter"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {timerStarted
                      ? `Catch me if you can... ${timeLeft}s ⏳`
                      : "A little question for you ❤️"}
                  </m.p>
                )}
              </AnimatePresence>
        </m.main>

        <AnimatePresence>
          {isYes && (
            <m.div
              key="tease-popup"
              className="tease-popup"
              role="status"
              initial={{ opacity: 0, y: -24, scale: 0.86 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 360, damping: 24 }}
            >
              You can&apos;t get rid of me that easily 🌙😂
            </m.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isTransitioning && (
            <m.div
                  key="love-transition"
                  className={`love-transition love-transition--${transitionStage}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  role="dialog"
                  aria-modal="true"
                  aria-label={transitionError || "I love you"}
            >
                  <div className="love-transition__aurora" aria-hidden="true">
                    <m.span
                      className="love-transition__orb love-transition__orb--one"
                      animate={shouldReduceMotion ? undefined : { x: [0, 32, -18, 0], y: [0, -22, 18, 0], scale: [1, 1.12, 0.94, 1] }}
                      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <m.span
                      className="love-transition__orb love-transition__orb--two"
                      animate={shouldReduceMotion ? undefined : { x: [0, -28, 16, 0], y: [0, 20, -14, 0], scale: [1, 0.9, 1.12, 1] }}
                      transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {Array.from({ length: 14 }, (_, index) => (
                      <m.span
                        key={index}
                        className="love-transition__spark"
                        style={{
                          left: `${8 + ((index * 37) % 84)}%`,
                          top: `${8 + ((index * 53) % 84)}%`,
                        }}
                        animate={shouldReduceMotion ? undefined : { opacity: [0.18, 0.85, 0.18], scale: [0.7, 1.25, 0.7], y: [0, -12, 0] }}
                        transition={{
                          duration: 2.2 + (index % 4) * 0.55,
                          delay: (index % 6) * 0.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        {index % 3 === 0 ? "♡" : "✦"}
                      </m.span>
                    ))}
                  </div>

                  <m.div
                    className="love-transition__content"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <m.p
                      className="love-transition__eyebrow"
                      animate={shouldReduceMotion ? undefined : { opacity: [0.65, 1, 0.65] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      A LITTLE NOTE BEFORE WE BEGIN
                    </m.p>
                    <m.h2
                      className="love-transition__message"
                      aria-hidden="true"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: {},
                        visible: {
                          transition: {
                            delayChildren: 0.18,
                            staggerChildren: shouldReduceMotion ? 0 : 0.105,
                          },
                        },
                      }}
                    >
                      {LOVE_MESSAGE.map(({ character, color }, index) => (
                        <m.span
                          key={`${character}-${index}`}
                          className={`love-transition__letter love-transition__letter--${color}`}
                          variants={{
                            hidden: shouldReduceMotion
                              ? { opacity: 0 }
                              : { opacity: 0, y: 34, scale: 0.45, rotateX: -75 },
                            visible: {
                              opacity: 1,
                              ...(shouldReduceMotion ? {} : { y: 0, scale: 1, rotateX: 0 }),
                              transition: {
                                ...(shouldReduceMotion
                                  ? { duration: 0.15 }
                                  : { type: "spring", stiffness: 430, damping: 13, mass: 0.65 }),
                              },
                            },
                          }}
                        >
                          {character === " " ? "\u00a0" : character}
                        </m.span>
                      ))}
                    </m.h2>
                    <m.p
                      className="love-transition__status"
                      role="status"
                      aria-live="polite"
                      key={transitionError || "loading"}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {transitionError || "Getting our little world ready…"}
                    </m.p>
                    {transitionError && (
                      <m.button
                        className="love-transition__retry"
                        type="button"
                        whileHover={shouldReduceMotion ? undefined : { scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={prepareDestination}
                      >
                        Try loading again
                      </m.button>
                    )}
                  </m.div>

                  <AnimatePresence>
                    {transitionStage === "portal" && (
                      <m.div
                        className="love-transition__portal"
                        initial={{ opacity: 0, scale: 0.25, rotate: -45 }}
                        animate={{
                          opacity: 1,
                          scale: portalScale,
                          rotate: shouldReduceMotion ? 0 : 675,
                        }}
                        transition={{
                          opacity: { duration: 0.18 },
                          scale: { duration: shouldReduceMotion ? 0.7 : 1.7, ease: [0.7, 0, 0.2, 1] },
                          rotate: { duration: shouldReduceMotion ? 0.7 : 1.7, ease: [0.7, 0, 0.2, 1] },
                        }}
                        onAnimationComplete={finishTransition}
                        aria-hidden="true"
                      >
                        <span className="love-transition__portal-ring love-transition__portal-ring--outer" />
                        <span className="love-transition__portal-ring love-transition__portal-ring--inner" />
                        <span className="love-transition__portal-core">♥</span>
                      </m.div>
                    )}
                  </AnimatePresence>
                </m.div>
              )}
        </AnimatePresence>
        </div>
      </LazyMotion>
    </MotionConfig>
  );
}

export default App;
