import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export default function Modal({
  show,
  onClose,
  children,
}: {
  show: boolean;
  onClose?:()=> void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-[#00000077] opacity-75 z-[99999999] flex justify-center items-end md:items-center "
        >
          <div className="w-full md:w-[50%] ">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
