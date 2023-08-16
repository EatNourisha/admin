import { Box, BoxProps } from "@chakra-ui/react";

interface Props extends BoxProps {
  customer?: string;
}

export function PendingWithdrawals(props: Props) {
  return <Box>Pending Withdrawals</Box>;
}
