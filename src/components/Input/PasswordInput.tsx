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
        borderRadius="4px"
        errorBorderColor="brand.deepRed"
        minH="52px"
        bg="#E7EAEE3f"
        border="1px solid transparent"
        variant="filled"
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
                <Box fontSize="24px" as={ViewIcon} color="brand.greyText" />
              ) : (
                <Box fontSize="24px" as={ViewOffIcon} color="brand.greyText" />
              )
            }
          />
        }
      />
    </InputGroup>
  );
};

export default PasswordInput;
