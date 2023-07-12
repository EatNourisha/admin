import {
  Box,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { FC } from "react";

interface InputProps extends ChakraInputProps {
  startAdornment?: any;
  endAdornment?: any;
}

const Input: FC<InputProps> = (props) => {
  const { startAdornment, endAdornment } = props;

  return (
    <InputGroup w="unset">
      {startAdornment && (
        <InputLeftElement
          h="100%"
          children={<Box pl="20px">{startAdornment}</Box>}
        />
      )}
      <ChakraInput
        isRequired
        // maxW=""
        minH="52px"
        border="1px solid transparent"
        borderRadius="4px"
        errorBorderColor="brand.deepRed"
        bg="#E7EAEE3f"
        pl={startAdornment ? "52px" : "20px"}
        pr={endAdornment ? "52px" : "20px"}
        _focus={{
          borderColor: "brand.primary",
          shadow: "0 0 0 3px var(--focusColor)",
          bg: "#E7EAEE3f",
        }}
        _hover={{
          borderColor: "brand.primary",
          bg: "#E7EAEE3f",
        }}
        sx={{
          "::placeholder": {
            color: "brand.greyText",
          },
        }}
        {...props}
      />
      {endAdornment && (
        <InputRightElement
          h="100%"
          children={<Box pr="20px">{endAdornment}</Box>}
        />
      )}
    </InputGroup>
  );
};

export default Input;
