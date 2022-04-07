import {
  HStack,
  PinInput as ChakraPinInput,
  PinInputProps as ChakraPinInputProps,
  PinInputField,
} from "@chakra-ui/react";
import { FC } from "react";

interface PinInputProps extends Omit<ChakraPinInputProps, "children"> {
  limit?: number;
}

const PinInput: FC<PinInputProps> = (props) => {
  const { limit, size, otp, type, mask } = props;
  return (
    <HStack justifyContent="space-evenly">
      <ChakraPinInput
        otp={otp}
        type={type}
        size={size ?? "lg"}
        placeholder=""
        {...props}
        autoFocus={true}
        mask={mask ?? true}
      >
        {Array(limit ?? 5)
          .fill(0)
          .map((_, i) => (
            <PinInputField
              key={`pin-input-${i}`}
              w="100%"
              border="1px solid #B4B8C3"
              _focus={{
                borderColor: "brand.primary",
                shadow: "0 0 0 3px var(--focusColor)",
              }}
              borderRadius="8px"
            />
          ))}
      </ChakraPinInput>
    </HStack>
  );
};

export default PinInput;
