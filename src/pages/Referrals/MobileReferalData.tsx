import { Box, BoxProps, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { navigate } from "@reach/router";
import Empty from "assets/images/folder.png";
import Gravatar from "components/Gravatar/Gravatar";
import MobileDataSkeleton from "components/MobileDataSkeleton";
import configs from "config";
import { formatDistanceToNow, parseISO } from "date-fns";
import { PromoRo, UserRo } from "interfaces";
import { ReferralRo } from "interfaces/auth.interface";
import { join } from "lodash";
import { currencyFormat, when } from "utils";

interface MobileReferalDataProps extends BoxProps {
  data?: ReferralRo[];
  isLoading?: boolean;
  reward: boolean;
}

function MobileReferalData({
  data = [],
  isLoading,
  reward,
}: MobileReferalDataProps) {
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
      {data.map((value, index) => {
        const promo = value?.promo as PromoRo;
        const inviter =
          value?.inviter ??
          promo?.influencer ??
          when(
            typeof promo?.influencer?.customer === "object",
            promo?.influencer?.customer as UserRo,
            undefined
          );

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
                src={value?.invitee?.profilePhotoUrl}
                title={join(
                  [value?.invitee?.first_name, value?.invitee?.last_name],
                  " "
                )}
                createdAt={value?.invitee?.createdAt}
                subtitle={
                  !value?.invitee?.createdAt
                    ? undefined
                    : `${formatDistanceToNow(
                        parseISO(value?.invitee?.createdAt!)
                      )} ago`
                }
                onClick={() =>
                  navigate(`${configs.paths.users}/${value?.invitee?._id}`)
                }
              />
              <HStack justifyContent="space-between">
                <Box>
                  <Text mb="8px">Refered by:</Text>
                  <Text fontSize="14px" fontWeight="bold">
                    {join([inviter?.first_name, inviter?.last_name], " ")}
                  </Text>
                </Box>
                <Box>
                  <Text textAlign="right" mb="8px">
                    city:
                  </Text>
                  <Text
                    fontSize="14px"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    {value?.invitee?.address?.city ?? "--------------"}
                  </Text>
                </Box>
              </HStack>
              <HStack justifyContent="space-between">
                <Box>
                  <Text mb="8px">Code:</Text>
                  <Text
                    fontSize="14px"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    {value?.ref_code ?? "--------------"}
                  </Text>
                </Box>
                <Box textAlign={"right"}>
                  <Text mb="8px">Delivery Day:</Text>
                  <Text
                    fontSize="14px"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    {value?.invitee?.delivery_day ?? "--------------"}
                  </Text>
                </Box>
              </HStack>
              {reward && (
                <HStack justifyContent="space-between">
                  <Box>
                    <Text mb="8px">Reward:</Text>
                    <Text fontWeight="bold" fontSize="14px" textTransform="capitalize">
                      {currencyFormat((value?.currency as any) ?? "gbp").format(
                        value?.reward ?? 0
                      )}
                    </Text>
                  </Box>
                </HStack>
              )}
            </VStack>
          </Box>
        );
      })}
    </VStack>
  );
}

export default MobileReferalData;
