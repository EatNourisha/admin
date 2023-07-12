import { Text, TextProps, HStack } from "@chakra-ui/layout";
import { CircularProgress } from "@chakra-ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { FC } from "react";

interface InputLabelProps extends TextProps {
  isLoading?: boolean;
  htmlFor?: string;
}

const InputLabel: FC<InputLabelProps> = (props) => {
  const { isLoading, children } = props;
  return (
    <HStack alignItems="center">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={`input-label-motion-${isLoading ? "loading" : "stale"}`}
          style={{ display: "inherit" }}
          layout="position"
          initial={{ x: -4, opacity: 1 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -4, opacity: 1 }}
        >
          <Text
            as="label"
            display="inline-block"
            fontSize="sm"
            color="brand.black"
            mb="4px !important"
            {...props}
          >
            {children}
          </Text>
        </motion.div>
        {/* </AnimatePresence> */}
        {/* <Text
        as="label"
        display="inline-block"
        fontSize="sm"
        color="brand.black"
        mb="4px !important"
        {...props}
      >
        {children}
      </Text> */}

        {/* <AnimatePresence initial={false} exitBeforeEnter={true}> */}
        <motion.div
          key={`input-label-motion-${isLoading ? "loading" : "stale"}`}
          style={{ display: "inherit", marginTop: "-3px" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          {isLoading && (
            <CircularProgress
              isIndeterminate
              color="brand.primary"
              size="16px"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </HStack>
  );
};

export default InputLabel;
