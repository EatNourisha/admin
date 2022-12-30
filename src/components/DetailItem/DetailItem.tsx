import { Box, Text, TextProps } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface DetailItemProps {
  label: string;
  _label?: TextProps;
}

export default function DetailItem(props: PropsWithChildren<DetailItemProps>) {
  const { label, children, _label } = props;
  return (
    <Box>
      <Text fontSize="md" fontWeight="600" mb="8px" {..._label}>
        {label}
      </Text>
      {children}
    </Box>
  );
}
