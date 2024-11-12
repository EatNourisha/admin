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
import configs from "config";
import { PlanRo } from "interfaces";
import { currencyFormat } from "utils";

interface MobilePlansDataProps extends BoxProps {
  data?: PlanRo[];
  isLoading?: boolean;
}

function MobilePlansData({ data = [], isLoading }: MobilePlansDataProps) {
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
      {data.map((plan, index) => {
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
              <Text fontSize="18px" textTransform="capitalize">
                {plan?.name ?? "--------"}
              </Text>
              <HStack justifyContent="space-between">
                <Box>
                  <Text mb="8px">Reference Id:</Text>
                  <Text fontSize="14px" fontWeight="bold">
                    {plan?.product_id}
                  </Text>
                </Box>
                <Box>
                  <Text textAlign="right" mb="8px">
                    currency:
                  </Text>
                  <Text
                    fontSize="14px"
                    textAlign="right"
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    {plan?.currency}
                  </Text>
                </Box>
              </HStack>
              <HStack justifyContent="space-between">
                <Box>
                  <Text mb="8px">Amount:</Text>
                  <Text fontSize="14px" fontWeight="bold">
                    {currencyFormat((plan?.currency as any) ?? "gbp").format(
                      plan?.amount ?? 0
                    )}
                  </Text>
                </Box>
                <Box textAlign={"right"}>
                  <Text mb="8px">Interval:</Text>
                  <Text
                    fontSize="14px"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    {plan?.subscription_interval}ly
                  </Text>
                </Box>
              </HStack>
              <HStack justifyContent="space-between">
                <Box>
                  <Text mb="8px">Country:</Text>
                  <Text
                    fontSize="14px"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    {plan?.country ?? "--------"}
                  </Text>
                </Box>
              </HStack>
              <HStack>
                <Button
                  size="sm"
                  variant="transparent"
                  onClick={() =>
                    navigate(`${configs.paths.plans}/${plan?._id}/assign`)
                  }
                >
                  Assign To
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    navigate(`${configs.paths.plans}/${plan?._id}`)
                  }
                >
                  View More
                </Button>
              </HStack>
            </VStack>
          </Box>
        );
      })}
    </VStack>
  );
}

export default MobilePlansData;
