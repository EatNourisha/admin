import { VStack, Box, CircularProgress, BoxProps } from "@chakra-ui/react";

interface Props extends BoxProps {
  size?: string;
}

export default function Loader(props: Props) {
  const { size } = props;
  return (
    <VStack {...props}>
      <Box
        p="20px"
        bg="white"
        borderRadius="8px"
        shadow="0px 6px 40px rgba(0, 0, 0, 0.05)"
      >
        <CircularProgress
          isIndeterminate
          color="brand.primary"
          size={size ?? "24px"}
        />
      </Box>
    </VStack>
  );
}
