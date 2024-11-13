import React from "react";
import {
  NumberInput,
  NumberInputField,
  InputGroup,
  InputRightAddon,
  NumberInputProps,
} from "@chakra-ui/react";

interface CurrencyInputProps
  extends Omit<NumberInputProps, "value" | "onChange"> {
  value?: string | number;
  onChange?: (valueString: string) => void;
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
  // Ensure value is never undefined and is properly formatted
  const inputValue = value ?? "";

  // Handle number input change
  const handleChange = (valueString: string) => {
    if (onChange) {
      onChange(valueString);
    }
  };

  return (
    <InputGroup
      w="100%"
      border="2px"
      borderColor="brand.neutral200"
      borderRadius="4px"
      alignItems="center"
    >
      <NumberInput
        value={inputValue}
        onChange={handleChange}
        w="full"
        isDisabled={isDisabled}
        {...props}
      >
        <NumberInputField
          border="none"
          w="full"
          bgColor="white"
          borderRadius="4px"
          _focus={{ boxShadow: "none" }}
          paddingInlineEnd="70px" // Make space for the currency addon
        />
      </NumberInput>
      <InputRightAddon
        bg="transparent"
        border="none"
        position="absolute"
        right="0"
        height="100%"
      >
        {currency === "gbp" ? "£GBP" : currency}
      </InputRightAddon>
    </InputGroup>
  );
};

export default CurrencyInput;
