import { AnimatePresence } from "framer-motion";
import { useState} from "react";
import HeroAnimation from "./HeroAnimation";
import Navbar from "./Navbar";

export default function Homepage() {
  const [animationKey, setAnimationKey] = useState(0);
  const NAV_HEIGHT = 350; // same number you used before

  return (
    <>
      <div className="row p-2 mt-0 align-items-center fixed-top">
        <Navbar />
      </div>

      <AnimatePresence mode="wait">
        <HeroAnimation key={animationKey} NAV_HEIGHT={NAV_HEIGHT} />
      </AnimatePresence>

      
    </>
  );
}
