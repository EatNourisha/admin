import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Text, TextProps } from "@chakra-ui/react";
import { Loader2 } from "lucide-react";

interface InputLabelProps extends TextProps {
  isLoading?: boolean;
  htmlFor?: string;
}

const InputLabel: React.FC<InputLabelProps> = ({
  isLoading,
  htmlFor,
  className,
  children,
  ...props
}) => {
  return (
    <div className="flex items-center">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key="input-label-text"
          className="inline-flex"
          layout="position"
          initial={{ x: -4, opacity: 1 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -4, opacity: 1 }}
        >
          <Text
            as="label"
            htmlFor={htmlFor}
            className={`inline-block text-sm text-black mb-1 ${
              className || ""
            }`}
            {...props}
          >
            {children}
          </Text>
        </motion.div>
      </AnimatePresence>
      {isLoading && (
        <Loader2 className="animate-spin ml-2 text-primary" size={16} strokeWidth={2} />
      )}
    </div>
  );
};

export default InputLabel;
