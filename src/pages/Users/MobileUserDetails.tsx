import {
  Box,
  BoxProps,
  Button,
  HStack,
  Image,
  Text,
  VStack
} from "@chakra-ui/react";
import { navigate } from "@reach/router";
import Empty from "assets/images/folder.png";
import Gravatar from "components/Gravatar/Gravatar";
import MobileDataSkeleton from "components/MobileDataSkeleton";
import SubscriptionBadge from "components/SubscriptionBadge/SubscriptionBadge";
import configs from "config";
import { format, parseISO } from "date-fns";
import { UserRo } from "interfaces";
import { join } from "lodash";
import { useCallback } from "react";
import { when } from "utils";

interface MobileUserDetailsProps extends BoxProps {
  data?: UserRo[];
  isLoading?: boolean;
}

function MobileUserDetails(props: MobileUserDetailsProps) {
  const { data = [], isLoading } = props;

  const delivery_day = useCallback((user: UserRo) => {
    const info = user?.delivery_info;
    if (!!info && info?.next_delivery_date) {
      const day = parseISO(info?.next_delivery_date).getDay();
      /// Since nourisha doesn't delivery on sat, sun and mon, consider them not selected by the user.
      if ([6, 0, 1].includes(day)) return "------";
      return format(parseISO(info?.next_delivery_date), "EEE dd, MMM yyyy");
    }

    return info?.delivery_day ?? "------";
  }, []);

  // Loading state - show 3 skeleton items
  if (isLoading) {
    return (
      <MobileDataSkeleton count={10} />
    );
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
      {data.map((user, index) => (
        <Box
          key={`subscription-${index}`}
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          fontSize="sm"
          w="full"
        >
          <VStack alignItems="stretch" gap="12px">
            <Gravatar
              title={join([user?.first_name, user?.last_name], " ")}
              onClick={() =>
                navigate(`${configs.paths.users}/${user?._id ?? ""}`)
              }
            />
            <HStack justifyContent="space-between">
              <Box>
                <Text mb="8px">Email:</Text>
                <Text fontSize="14px" fontWeight="bold">
                  {user?.email}
                </Text>
              </Box>
              <Box>
                <Text textAlign="right" mb="8px">
                  Phone Number:
                </Text>
                <Text fontSize="14px" fontWeight="bold">
                  {user?.phone}
                </Text>
              </Box>
            </HStack>
            <HStack justifyContent="space-between">
              <Box>
                <Text mb="8px">Delivery Day:</Text>
                <Text
                  fontSize="14px"
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  {delivery_day(user)}
                </Text>
              </Box>
              <Box textAlign={"right"}>
                <Text mb="8px">Subscription:</Text>
                <SubscriptionBadge
                  type={when(
                    ["active"].includes(
                      user?.subscription?.status ?? "past_due"
                    ),
                    (user?.subscription?.plan?.name as any) ?? "Active",
                    "no_subscription"
                  )}
                />
              </Box>
            </HStack>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`${configs.paths.users}/${user?._id}`)}
            >
              View Lineup
            </Button>
            ,
          </VStack>
        </Box>
      ))}
    </VStack>
  );
}

export default MobileUserDetails;
