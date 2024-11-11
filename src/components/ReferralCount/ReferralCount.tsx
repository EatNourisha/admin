import { BoxProps, Skeleton, Text, VStack } from "@chakra-ui/react";
import { when } from "utils";

interface ReferralCounterProps extends BoxProps {
  count: number;
  description: string;
  isLoading?: boolean;
}

export function ReferralCounter(props: ReferralCounterProps) {
  const { count, description, isLoading, ...xprops } = props;
  return (
    <VStack
      w="100%"
      borderRadius="8px"
      justifyContent="center"
      alignItems="center"
      bg="#FFE6E4"
      p={{ base: "14px", md: "40px" }}
      {...xprops}
    >
      <Skeleton isLoaded={!isLoading} opacity={when(!!isLoading, 0.5, 1)}>
        <Text fontSize="32px" fontWeight="700" color="black">
          {when(count <= 99, `0${count}`, String(count))}
        </Text>
      </Skeleton>
      <Skeleton isLoaded={!isLoading} opacity={when(!!isLoading, 0.5, 1)}>
        <Text
          textAlign="center"
          mt="0 !important"
          fontSize={{ base: "14px", md: "16px" }}
          color="black"
          textTransform="capitalize"
        >
          {description}
        </Text>
      </Skeleton>
    </VStack>
  );
}
