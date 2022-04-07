import {
  Box,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { FC } from "react";

interface InputProps extends ChakraInputProps {
  startAdornment?: any;
}

const Input: FC<InputProps> = (props) => {
  const { startAdornment } = props;

  return (
    <InputGroup>
      {startAdornment && (
        <InputLeftElement
          h="100%"
          children={<Box pl="20px">{startAdornment}</Box>}
        />
      )}
      <ChakraInput
        isRequired
        minH="56px"
        border="1px solid transparent"
        borderRadius="12px"
        errorBorderColor="red.400"
        bg="brand.neutral"
        pl={startAdornment ? "52px" : "20px"}
        _focus={{
          borderColor: "brand.primary",
          shadow: "0 0 0 3px var(--focusColor)",
          bg: "#E7EAEE3f",
        }}
        _hover={{
          borderColor: "brand.primary",
          bg: "#E7EAEE3f",
        }}
        {...props}
      />
    </InputGroup>
  );
};

export default Input;
