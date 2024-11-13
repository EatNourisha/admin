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
import { Gravatar } from "components";
import MobileDataSkeleton from "components/MobileDataSkeleton";
import configs from "config";
import { CouponRo, PromoRo, UserRo } from "interfaces";
import { join } from "lodash";
import { currencyFormat, when } from "utils";

interface MobilePromoDataProps extends BoxProps {
  data?: PromoRo[];
  isLoading?: boolean;
}

function MobilePromoData({ data = [], isLoading }: MobilePromoDataProps) {
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
      {data.map((promo, index) => {
        const inf =
          promo?.influencer ??
          when(
            typeof promo?.influencer?.customer === "object",
            promo?.influencer?.customer as UserRo,
            undefined
          );

        const coup = promo?.coupon as CouponRo;
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
                src={undefined}
                title={join([inf?.first_name, inf?.last_name], " ")}
                subtitle={when(
                  !!promo?.influencer?.customer,
                  "nourisha user",
                  "external"
                )}
              />
              <HStack justifyContent="space-between">
                <Box>
                  <Text mb="8px">Code:</Text>
                  <Text
                    fontSize="14px"
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    {promo?.code ?? "--------"}
                  </Text>
                </Box>
                <Box textAlign="right">
                  <Text mb="8px">
                    Percent Off:
                  </Text>
                  <Text
                    fontSize="14px"
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    {`${coup?.percent_off ?? 0}%`}
                  </Text>
                </Box>
              </HStack>
              <HStack justifyContent="space-between">
                <Box>
                  <Text mb="8px">Amount Off:</Text>
                  <Text
                    fontSize="14px"
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    {currencyFormat((coup?.currency as any) ?? "gbp").format(
                      +(coup?.amount_off ?? 0)
                    )}
                  </Text>
                </Box>
                <Box textAlign="right">
                  <Text mb="8px">
                    Currency:
                  </Text>
                  <Text
                    fontSize="14px"
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    {(coup?.currency as any) ?? "gbp"}
                  </Text>
                </Box>
              </HStack>
              <Box>
                <Text mb="8px">Status:</Text>
                <Text fontSize="14px" fontWeight="bold">
                  {when(!!promo?.active, "Active", "Inactive")}
                </Text>
              </Box>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  navigate(`${configs.paths.promos}/${promo?._id}`)
                }
              >
                View more
              </Button>
            </VStack>
          </Box>
        );
      })}
    </VStack>
  );
}

export default MobilePromoData;
