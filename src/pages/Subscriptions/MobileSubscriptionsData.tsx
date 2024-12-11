import { Box, BoxProps, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { navigate } from "@reach/router";
import Empty from "assets/images/folder.png";
import Gravatar from "components/Gravatar/Gravatar";
import MobileDataSkeleton from "components/MobileDataSkeleton";
import SubscriptionBadge from "components/SubscriptionBadge/SubscriptionBadge";
import configs from "config";
import { format, parseISO } from "date-fns";
import { PlanRo, SubscriptionRo, UserRo } from "interfaces";
import { join } from "lodash";
import SubscriptionPopover from "./SubscriptionPopover";

interface MobileSubscriptionsDataProps extends BoxProps {
  data?: SubscriptionRo[];
  isLoading?: boolean;
}

const MobileSubscriptionsData = (props: MobileSubscriptionsDataProps) => {
  const { data = [], isLoading } = props;

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

  // Render actual data
  return (
    <VStack spacing={4} width="full" py={4} hideFrom={"md"}>
      {data.map((sub, index) => {
        const user = sub.customer as UserRo;
        const plan = sub.plan as PlanRo;

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
                  <Text mb="8px">Email:</Text>
                  <Text
                    fontSize="14px"
                    fontWeight="bold"
                    wordBreak={"break-word"}
                  >
                    {user?.email ?? "------------"}
                  </Text>
                </Box>
                <Box>
                  <Text textAlign="right" mb="8px">
                    Start Date:
                  </Text>
                  <Text fontSize="14px" fontWeight="bold">
                    {!!sub?.start_date
                      ? format(
                          parseISO(
                            sub?.start_date ?? new Date().toDateString()
                          ),
                          "eee, MMM dd, yyyy"
                        )
                      : "--------------"}
                  </Text>
                </Box>
              </HStack>
              <HStack justifyContent="space-between">
                <Box>
                  <Text mb="8px">End Date:</Text>
                  <Text
                    fontSize="14px"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    {!!sub?.end_date
                      ? format(
                          parseISO(sub?.end_date ?? new Date().toDateString()),
                          "eee, MMM dd, yyyy"
                        )
                      : "--------------"}
                  </Text>
                </Box>
                <Box textAlign={"right"}>
                  <Text mb="8px">Subscription:</Text>
                  <SubscriptionBadge
                    type={(plan?.slug as any) ?? "no_subscription"}
                  />
                </Box>
              </HStack>
              <SubscriptionPopover sub={sub} />
            </VStack>
          </Box>
        );
      })}
    </VStack>
  );
};

export default MobileSubscriptionsData;
