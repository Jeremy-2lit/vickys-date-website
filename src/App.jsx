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

function App() {
  const [screen, setScreen] = useState("proposal");
  const [isYes, setIsYes] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(RUN_TIME);
  const [buttonPosition, setButtonPosition] = useState({ x: "50%", y: "50%" });
  const [buttonPose, setButtonPose] = useState("center");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 0, y: 0 });
  const [zoomScale, setZoomScale] = useState(48);
  const cardRef = useRef(null);
  const buttonAreaRef = useRef(null);
  const buttonRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

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

    const farthestCorner = Math.max(
      Math.hypot(event.clientX, event.clientY),
      Math.hypot(window.innerWidth - event.clientX, event.clientY),
      Math.hypot(event.clientX, window.innerHeight - event.clientY),
      Math.hypot(
        window.innerWidth - event.clientX,
        window.innerHeight - event.clientY,
      ),
    );
    setZoomOrigin({ x: event.clientX, y: event.clientY });
    setZoomScale(Math.ceil((farthestCorner * 2) / 50));
    setIsTransitioning(true);
  }

  function finishTransition() {
    setScreen("surprise");
    setIsTransitioning(false);
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

        <AnimatePresence mode="wait" initial={false}>
          {screen === "proposal" ? (
            <m.main
              key="proposal"
              ref={cardRef}
              className="proposal-container"
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.94 }}
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
          ) : (
            <m.section
              key="surprise"
              className="surprise-screen"
              aria-labelledby="surprise-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <m.div
                className="surprise-content"
                initial={{ opacity: 0, y: 25, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <m.div
                  className="big-heart"
                  aria-hidden="true"
                  animate={shouldReduceMotion ? undefined : { scale: [1, 1.12, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  ❤️
                </m.div>

                <h1 id="surprise-title">YES! ❤️</h1>

                <p id="personalMessage">YOUR SPECIAL MESSAGE WILL GO HERE.</p>

                <p className="surprise-footer">
                  Something beautiful is waiting for you.
                </p>
              </m.div>
            </m.section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isYes && screen === "proposal" && (
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
              key="heart-zoom"
              className="heart-zoom"
              style={{ left: zoomOrigin.x, top: zoomOrigin.y }}
              initial={{ scale: 0.1, rotate: -18 }}
              animate={{ scale: zoomScale, rotate: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              onAnimationComplete={finishTransition}
              aria-hidden="true"
            >
              ❤️
            </m.div>
          )}
        </AnimatePresence>
        </div>
      </LazyMotion>
    </MotionConfig>
  );
}

export default App;
