import { Box, BoxProps } from "@chakra-ui/react";

interface Props extends BoxProps {
  customer?: string;
}

export function PaidOut(props: Props) {
  return <Box>Paid Out</Box>;
}
