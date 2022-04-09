import { Box, BoxProps } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

interface PageMotionProps extends PropsWithChildren<BoxProps> {}

const MotionBox = motion(Box);

export default function PageMotion(props: PageMotionProps) {
  const { children, ...xprops } = props;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{
        staggerChildren: 5,
        opacity: { type: "spring", stiffness: 100 },
        y: { type: "spring", stiffness: 100 },
      }}
      {...xprops}
    >
      {children}
    </MotionBox>
  );
}
