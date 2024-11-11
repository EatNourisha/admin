import { Box, HStack, Skeleton, VStack } from "@chakra-ui/react";

interface MobileDataSkeletonProps {
  count: number;
  className?: string;
}

function MobileDataSkeleton(props: MobileDataSkeletonProps) {
  const { count, className, ...xprops } = props;
  return (
    <VStack spacing={4} width="full" py={4} hideFrom={"md"} {...xprops}>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <Box
            key={`skeleton-${index}`}
            width="full"
            p={4}
            borderRadius="md"
            borderWidth="1px"
            className={className}
          >
            <VStack align="stretch" spacing={3}>
              <HStack>
                <Skeleton borderRadius="full" width="40px" height="40px" />
                <Skeleton height="20px" width="150px" />
              </HStack>
              <Skeleton height="16px" width="180px" />
              <Skeleton height="16px" width="140px" />
              <Skeleton height="16px" width="160px" />
            </VStack>
          </Box>
        ))}
    </VStack>
  );
}

export default MobileDataSkeleton;
