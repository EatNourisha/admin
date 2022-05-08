import { VStack, Box, CircularProgress, BoxProps } from "@chakra-ui/react";

interface Props extends BoxProps {}

export default function Loader(props: Props) {
  return (
    <VStack {...props}>
      <Box
        p="20px"
        bg="white"
        borderRadius="26px"
        shadow="0px 6px 40px rgba(0, 0, 0, 0.05)"
      >
        <CircularProgress isIndeterminate color="brand.primary" size="24px" />
      </Box>
    </VStack>
  );
}
