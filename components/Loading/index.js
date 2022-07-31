import React from "react";
import { motion } from "framer-motion";

export default function Loading() {
  const blockVariants = {
    start: {
      x: -200,
      rotate: 0,
    },
    target: {
      x: 200,
      rotate: 270,
    },
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <motion.div
        style={{
          borderRadius: "20px",
          width: "150px",
          height: "150px",
          background: "linear-gradient(90deg,#ffa0ae 0%,#aacaef 75%)",
          border: "1px solid #f4f4f4",
        }}
        initial="start"
        animate="target"
        transition={{
          type: "tween",
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 1,
          duration: 1,
        }}
        variants={blockVariants}
      />
    </div>
  );
}
