import {
  Box,
  BoxProps,
  Button,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { navigate } from "@reach/router";
import Empty from "assets/images/folder.png";
import MobileDataSkeleton from "components/MobileDataSkeleton";
import { GiftCardRo } from "interfaces/auth.interface";

interface MobileGiftCardDataProps extends BoxProps {
  data?: GiftCardRo[];
  isLoading?: boolean;
  setDeleteGiftCard: any;
}

function MobileGiftCardData({
  data = [],
  isLoading,
  setDeleteGiftCard,
}: MobileGiftCardDataProps) {
  // Loading state - show 3 skeleton items
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

  return (
    <VStack spacing={4} width="full" hideFrom={"md"}>
      {data.map((value, index) => (
        <Box
          key={`subscription-${index}`}
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          fontSize="sm"
          w="full"
        >
          <VStack alignItems="stretch" gap="12px">
            <HStack justifyContent="space-between">
              <Box>
                <Text mb="8px">Name:</Text>
                <Text fontSize="14px" fontWeight="bold">{value?.name}</Text>
              </Box>
              <Box>
                <Text textAlign="right" mb="8px">
                  Amount:
                </Text>
                <Text fontSize="14px" fontWeight="bold">{value?.amount}</Text>
              </Box>
            </HStack>
            <HStack justifyContent="space-between">
              <Box>
                <Text mb="8px">Subscription Interval:</Text>
                <Text fontSize="14px" fontWeight="bold" textTransform="capitalize">
                  {value.subscription_interval}
                </Text>
              </Box>
            </HStack>
            <HStack>
              <Button
                onClick={() => navigate(`gift_cards/edit/${value?._id}`)}
                size="sm"
                variant="outline"
              >
                Edit
              </Button>

              <Button
                color="#E5432E"
                border="1px solid #E5432E"
                _hover={{ bg: "#E5432E", color: "white" }}
                onClick={() =>
                  setDeleteGiftCard({
                    show: true,
                    id: value?._id,
                    loading: false,
                  })
                }
                size="sm"
                variant="outline"
              >
                Delete
              </Button>
            </HStack>
          </VStack>
        </Box>
      ))}
    </VStack>
  );
}

export default MobileGiftCardData;
