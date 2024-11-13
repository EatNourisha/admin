import {
  Badge,
  Box,
  BoxProps,
  Button,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import Empty from "assets/images/folder.png";
import MobileDataSkeleton from "components/MobileDataSkeleton";
import { format, parseISO } from "date-fns";
import { BroadcastRo } from "interfaces";

interface MobileBroadcastDataProps extends BoxProps {
  data?: BroadcastRo[];
  isLoading?: boolean;
}

function MobileBroadcastData({
  data = [],
  isLoading,
}: MobileBroadcastDataProps) {
  // Loading state
  if (isLoading) {
    return <MobileDataSkeleton count={10} />;
  }

  // Empty state
  if (!data.length) {
    return (
      <VStack maxW="200px" mx="auto" my="180px" hideFrom={"md"}>
        <Image src={Empty} alt="empty list" boxSize="150px" />
        <Text textAlign="center" fontSize="14px">
          Sorry, it looks like you have nothing here yet
        </Text>
      </VStack>
    );
  }

  // Render actual data
  return (
    <VStack spacing={4} width="full" py={4} hideFrom={"md"}>
      {data.map((cast, index) => {
        return (
          <Box
            key={`subscription-${index}`}
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            fontSize="sm"
            w="full"
          >
            <VStack alignItems="stretch" spacing="12px">
              <Text fontSize="18px" fontWeight="bold">
                {cast?.title ?? "-------------------"}
              </Text>
              <HStack justifyContent="space-between">
                <Box>
                  <Text mb="8px">Tag:</Text>
                  <Badge fontSize="10px" fontWeight="bold">
                    {cast?.tag ?? "-------------------"}
                  </Badge>
                </Box>
              </HStack>
              <Box>
                <Text mb="8px">
                  Content:
                </Text>
                <Text
                  fontSize="14px"
                  fontWeight="bold"
                  whiteSpace="nowrap"
                  maxW="400px"
                  textOverflow="ellipsis"
                  overflow="hidden"
                >
                  {cast?.content ?? "-------------------"}
                </Text>
              </Box>
              <HStack justifyContent="space-between">
                <Box>
                  <Text mb="8px">Date Sent:</Text>
                  <Text fontSize="14px" fontWeight="bold">
                    {!!cast?.createdAt
                      ? format(
                          parseISO(
                            cast?.createdAt ?? new Date().toDateString()
                          ),
                          "eee, MMM dd, yyyy"
                        )
                      : "--------------"}
                  </Text>
                </Box>
              </HStack>
              <Button size="sm" variant="outline">
                Duplicate
              </Button>
            </VStack>
          </Box>
        );
      })}
    </VStack>
  );
}

export default MobileBroadcastData;
