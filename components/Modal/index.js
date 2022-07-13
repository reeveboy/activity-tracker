import { motion } from "framer-motion";
import Backdrop from "./Backdrop";

export default function index({ handleClose, text }) {
  const dropIn = {
    hidden: {
      y: 1000,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        damping: 10,
        stiffness: 5,
      },
    },
    exit: {
      y: 1000,
      opacity: 0,
    },
  };

  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="mod"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit">
        {text}
      </motion.div>
    </Backdrop>
  );
}
