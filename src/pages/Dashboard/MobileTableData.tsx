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
import LineupStatus from "components/Status/LineupStatus";
import SubscriptionBadge from "components/SubscriptionBadge/SubscriptionBadge";
import configs from "config";
import { format, parseISO } from "date-fns";
import { PlanRo, SubscriptionRo, UserRo } from "interfaces";
import { join } from "lodash";

interface MobileTableDataProps extends BoxProps {
  data?: SubscriptionRo[];
  isLoading?: boolean;
  onViewLineup?: (user: UserRo) => void;
}

const MobileTableData = (props: MobileTableDataProps) => {
  const { data = [], isLoading, onViewLineup } = props;

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

  // Render actual data
  return (
    <VStack spacing={4} width="full" py={4} hideFrom={"md"}>
      {data.map((subscription, index) => {
        const user = subscription.customer as UserRo;
        const plan = subscription.plan as PlanRo;

        const delivery_day = (() => {
          const info = user?.delivery_info;
          if (!!info && !!info?.next_delivery_date) {
            return format(
              parseISO(info?.next_delivery_date),
              "EEE dd, MMM yyyy"
            );
          }
          return info?.delivery_day ?? "------";
        })();

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
              <Gravatar
                platform={user?.platform}
                title={join([user?.first_name, user?.last_name], " ")}
                onClick={() =>
                  navigate(`${configs.paths.users}/${user?._id ?? ""}`)
                }
              />
              <HStack justifyContent="space-between">
                <Box>
                  <Text mb="8px">Status:</Text>
                  <LineupStatus has_lineup={!!user?.lineup} />
                </Box>
                <Box>
                  <Text textAlign="right" mb="8px">
                    city:
                  </Text>
                  <Text fontWeight="bold" textTransform="capitalize">
                    {user?.address?.city ?? "------------"}
                  </Text>
                </Box>
              </HStack>
              <HStack justifyContent="space-between">
                <Box>
                  <Text mb="8px">Delivery Day:</Text>
                  <Text textTransform="capitalize">{delivery_day}</Text>
                </Box>
                <Box textAlign={"right"}>
                  <Text mb="8px">Subscription:</Text>
                  <SubscriptionBadge
                    type={(plan?.slug as any) ?? "no_subscription"}
                  />
                </Box>
              </HStack>
              <Button
                size="sm"
                variant="outline"
                isDisabled={!user?.lineup}
                onClick={() => onViewLineup?.(user)}
              >
                View Lineup
              </Button>
              ,
            </VStack>
          </Box>
        );
      })}
    </VStack>
  );
};

export default MobileTableData;
