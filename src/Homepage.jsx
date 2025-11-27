import { useState } from "react";
import Navbar from "./Navbar";
import React from "react";
import { useIsMobile } from "./hooks/use-mobile";
import { AnimatePresence } from "framer-motion";
import HeroAnimation from "./HeroAnimation";

export default function Homepage() {
  const isMobile = useIsMobile();
  const [animationKey, setAnimationKey] = useState(0);
  const NAV_HEIGHT = isMobile ? 200 : 350;
  return (
    <>
      <div
        className={`row p-2 mt-0 align-items-center fixed-top ${
          isMobile ? "mobile-layout" : "desktop-layout"
        }`}
      >
        <Navbar />
      </div>

      <AnimatePresence mode="wait">
        <HeroAnimation
          key={animationKey}
          NAV_HEIGHT={NAV_HEIGHT}
          isMobile={isMobile}
        />
      </AnimatePresence>
    </>
  );
}
