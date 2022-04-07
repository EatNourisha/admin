import {
  InputGroup,
  InputRightElement,
  Input as ChakraInput,
  Box,
  IconButton,
  InputProps,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import clsx from "classnames";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

interface PasswordInputProps extends InputProps {
  label?: string;
}

const PasswordInput: FC<PasswordInputProps> = ({
  w,
  width,
  label,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const visibility = clsx(isVisible ? "text" : "password");

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <InputGroup>
      <ChakraInput
        w={w}
        width={width}
        borderRadius="8px"
        errorBorderColor="red.400"
        minH="52px"
        // bg="#EFF0F7"
        border="1px solid transparent"
        variant="filled"
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
        type={visibility}
      />
      <InputRightElement
        h="100%"
        mr="12px"
        children={
          <IconButton
            variant="unstyled"
            aria-label="visibility toggle"
            bg="transparent"
            minW="0"
            size="xs"
            borderRadius="2"
            _focus={{ shadow: `0 0 0 3px var(--focusColor)` }}
            onClick={toggleVisibility}
            icon={
              !isVisible ? (
                <Box fontSize="24px" as={ViewIcon} color="brand.black" />
              ) : (
                <Box fontSize="24px" as={ViewOffIcon} color="brand.black" />
              )
            }
          />
        }
      />
    </InputGroup>
  );
};

export default PasswordInput;
