import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

export default function HeroAnimation({ NAV_HEIGHT }) {
  const hero = useAnimation();

  useEffect(() => {
    (async () => {
      await hero.start({ scale: 1.08, transition: { duration: 0.7 } });
      await hero.start({ scale: 0.96, transition: { duration: 0.6 } });
      await hero.start({ scale: 1.02, transition: { duration: 0.5 } });
      await hero.start({
        width: "100%",
        height: "60vh",
        left: 0,
        top: NAV_HEIGHT,
        x: 0,
        y: 0,
        scale: 1,
        transition: { duration: 0.9, ease: "easeInOut" },
      });
    })();
  }, [hero, NAV_HEIGHT]);

  return (
    <motion.section
      initial={{
        width: 320,
        height: 320,
        left: "50%",
        top: "50%",
        x: "-50%",
        y: "-50%",
        scale: 1,
      }}
      animate={hero}
      style={{
        position: "fixed",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
      }}
    >
      <motion.img
        src="/images/cute_chat.jpeg"
        alt="img"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          inset: 0,
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: 2.4, duration: 0.8 },
        }}
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          color: "#b30000",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 25,
            letterSpacing: 1,
            marginBottom: 6,
            color: "black",
          }}
        >
          mail: bingo@gmail.com
        </div>
        <h1
          style={{
            fontSize: "6vw",
            fontWeight: 600,
            margin: 0,
            letterSpacing: 12,
          }}
        >
          BINGO
        </h1>
      </motion.div>
    </motion.section>
  );
}