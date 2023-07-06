import {
  Textarea as ChakraTextarea,
  TextareaProps as ChakraTextareaProps,
} from "@chakra-ui/react";
import { FC } from "react";

interface TextareaProps extends ChakraTextareaProps {}

const Textarea: FC<TextareaProps> = (props) => {
  return (
    <ChakraTextarea
      isRequired
      //   minH="50px"
      border="1px solid transparent"
      borderColor="brand.neutral"
      borderRadius="4px"
      errorBorderColor="red.400"
      bg="transparent"
      _focus={{
        borderColor: "brand.primary",
        shadow: "0 0 0 3px var(--focusColor)",
      }}
      _hover={{
        borderColor: "brand.primary",
      }}
      sx={{
        "::placeholder": {
          color: "#B4C1DC",
        },
      }}
      {...props}
    />
  );
};

export default Textarea;
