import { motion } from "framer-motion";

export default function index({ children, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="backdrop"
      onClick={onClick}>
      {children}
    </motion.div>
  );
}
