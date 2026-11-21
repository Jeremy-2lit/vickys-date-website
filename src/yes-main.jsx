import React from "react";
import { createRoot } from "react-dom/client";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import YesPage from "./YesPage.jsx";
import "./yes-page.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <YesPage />
      </LazyMotion>
    </MotionConfig>
  </React.StrictMode>,
);
