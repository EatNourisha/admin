import React from "react";
import {
  Input,
  InputGroup,
  InputRightAddon,
  InputProps,
} from "@chakra-ui/react";

interface CurrencyInputProps extends Omit<InputProps, "value" | "onChange"> {
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currency?: string;
  isDisabled?: boolean;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  currency = "gbp",
  isDisabled,
  ...props
}) => {
  // Ensure value is never undefined
  const inputValue = value ?? "";

  return (
    <InputGroup
      w="100%"
      border="2px"
      borderColor="brand.neutral200"
      borderRadius="4px"
      alignItems="center"
    >
      <Input
        border="none"
        w="full"
        type="number"
        bgColor="white"
        borderRadius="4px"
        
        value={inputValue}
        onChange={onChange}
        isDisabled={isDisabled}
        {...props}
      />
      <InputRightAddon bg="transparent">
        {currency === "gbp" ? "£GBP" : currency}
      </InputRightAddon>
    </InputGroup>
  );
};

export default CurrencyInput;
