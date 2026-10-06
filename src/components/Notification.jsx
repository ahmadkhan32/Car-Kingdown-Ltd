import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../hooks/useCart";

export default function Notification() {
  const { toast } = useCart();
  return (
    <AnimatePresence>
      {toast && <motion.div className="toast" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>✓ {toast}</motion.div>}
    </AnimatePresence>
  );
}
