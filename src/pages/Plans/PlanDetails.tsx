import {
  Box,
  BoxProps,
  Button,
  Grid,
  Heading,
  HStack,
  IconButton,
  Select,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  TextProps,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  MainLayoutContainer,
  Topbar,
  Icon,
  PageMotion,
  ConfirmationModal,
} from "components";

import { navigate, useParams } from "@reach/router";
import { ReactNode, useMemo } from "react";
import { currencyFormat, when } from "utils";
import { EmptyCrate } from "components/Crate/Empty";
import usePlan from "hooks/usePlan";
import usePlanMutations from "hooks/usePlanMutations";
import configs from "config";

export default function UserDetails() {
  const { id } = useParams();

  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { deletePlan, isLoading: isDeleting } = usePlanMutations();

  const { data: plan, isLoading } = usePlan(id);
  const perks = useMemo(() => plan?.perks ?? [], [plan]);
  const hasPerks = useMemo(() => perks.length > 0, [perks]);

  const removePlan = async () => {
    onClose();
    const result = await deletePlan(id);
    if (!!result) {
      toast({
        position: "bottom-right",
        title: "Success 🎉",
        description: `${result?.name} plan successfully deleted`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      navigate(configs.paths.plans);
    }
  };

  return (
    <PageMotion key="plan-details">
      <Topbar pageTitle="Plans" />
      <MainLayoutContainer>
        <Grid
          templateColumns={{ xl: "1.3fr 1fr", "2xl": "1.5fr 1fr" }}
          gap="24px"
        >
          <Box
            p="38px"
            borderRadius="8px"
            border="2px solid transparent"
            borderColor="brand.neutral100"
            mb="20px"
            minH="700px"
          >
            <HStack w="100%" justifyContent="space-between">
              <Button
                size="xs"
                color="brand.black"
                variant="transparent"
                fontSize="md"
                fontWeight="600"
                leftIcon={<Icon type="leftArrow" />}
                onClick={() => navigate(-1)}
              >
                Back
              </Button>

              <HStack>
                <IconButton
                  minH="unset"
                  minW="unset"
                  maxH="unset"
                  maxW="unset"
                  boxSize="28px"
                  borderRadius="8px"
                  bg="transparent"
                  aria-label="remove perk"
                  icon={<Icon type="delete" />}
                  _hover={{
                    bg: "transparent",
                  }}
                  _active={{
                    bg: "transparent",
                  }}
                  _loading={{ color: "brand.primary" }}
                  onClick={onOpen}
                  disabled={isDeleting}
                  isLoading={isDeleting}
                />

                <Button
                  size="xs"
                  color="brand.black"
                  variant="transparent"
                  fontSize="md"
                  fontWeight="600"
                  leftIcon={<Icon type="edit" />}
                  disabled={isDeleting}
                  onClick={() => navigate(`${configs.paths.plans}/edit/${id}`)}
                >
                  Edit
                </Button>
              </HStack>
            </HStack>

            <Grid mt="98px" templateColumns="repeat(2, 1fr)" gap="20px">
              <Detail
                isLoading={isLoading}
                title="Name"
                description={plan?.name ?? "--------"}
              />
              <Detail
                isLoading={isLoading}
                title="Interval"
                description={`${plan?.subscription_interval ?? "week"}ly`}
              />
              <Detail
                isLoading={isLoading}
                title="Currency"
                description={plan?.currency ?? "GBP"}
                _desc={{ textTransform: "uppercase" }}
              />
              <Detail
                isLoading={isLoading}
                title="Amount"
                description={currencyFormat(
                  (plan?.currency as any) ?? "gbp"
                ).format(plan?.amount ?? 0)}
              />
              <Detail
                isLoading={isLoading}
                title="Reference ID"
                description={plan?.product_id ?? "---------"}
              />
              <Detail
                isLoading={isLoading}
                title="Delivery Fee"
                description={currencyFormat(
                  (plan?.currency as any) ?? "gbp"
                ).format(+(plan?.delivery_fee ?? 0))}
              />
            </Grid>

            <Detail
              mt="16px"
              isLoading={isLoading}
              title="Description"
              description={plan?.description ?? "---------"}
              _desc={{ textTransform: "none" }}
            />
          </Box>

          <Box position="sticky" top="100px">
            <HStack justifyContent="space-between">
              <Heading as="h5" fontSize="lg">
                Features / Perks
              </Heading>

              <Select
                mt="10px"
                placeholder="Select Option"
                minH="48px"
                maxW="180px"
                visibility="hidden"
              >
                <option>All time</option>
              </Select>
            </HStack>

            <Stack
              mt="16px"
              borderRadius="8px"
              overflow="hidden"
              p="14px"
              shadow={when(
                !hasPerks,
                "0px 2px 12px rgba(0, 0, 0, 0.05)",
                "none"
              )}
              gridGap="10px"
            >
              {!isLoading &&
                hasPerks &&
                perks.map((perk, i) => (
                  <PerkItem key={`perk-${i}`} index={i} content={perk} />
                ))}

              {isLoading &&
                !hasPerks &&
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <PerkItem
                      key={`perk-${i}`}
                      index={i}
                      isLoading={isLoading}
                      content="----------------------------------------------------------------"
                    />
                  ))}

              {!isLoading && !hasPerks && <EmptyCrate my="80px" />}
            </Stack>
          </Box>
        </Grid>
      </MainLayoutContainer>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        title="Confirm"
        onConfirm={removePlan}
        buttonText={["Delete"]}
        description="Are you sure you want to delete this plan?"
      />
    </PageMotion>
  );
}

interface DetailProps extends BoxProps {
  title: string;
  description?: ReactNode;
  isLoading?: boolean;
  _desc?: TextProps;
}

interface PerkItemProps extends BoxProps {
  isLoading?: boolean;
  content: string;
  index: number;
}

function Detail(props: DetailProps) {
  const { title, description, isLoading, _desc, ...xprops } = props;

  return (
    <Box
      w="100%"
      h="fit-content"
      p="24px 22px"
      borderRadius="8px"
      shadow="0px 6px 40px rgba(0, 0, 0, 0.05)"
      {...xprops}
    >
      <HStack color="brand.black">
        {/* <Icon type="phone" /> */}
        <Text fontSize="md" fontWeight="400" color="brand.greyText">
          {title}
        </Text>
      </HStack>

      <Skeleton
        isLoaded={!isLoading ?? true}
        w="fit-content"
        h={isLoading ? "20px" : "fit-content"}
        borderRadius="12px"
        mt="8px"
      >
        <Text fontSize="18px" textTransform="capitalize" {..._desc}>
          {description ?? "--------"}
        </Text>
      </Skeleton>
    </Box>
  );
}

function PerkItem(props: PerkItemProps) {
  const { index, content, isLoading, ...xprops } = props;

  return (
    <Box
      p="12px 16px"
      borderRadius="8px"
      border="1px solid transparent"
      borderColor="brand.neutral100"
      overflow="hidden"
      {...xprops}
    >
      <HStack justifyContent="space-between">
        <Stack>
          <Skeleton
            isLoaded={!isLoading ?? true}
            w="fit-content"
            h={isLoading ? "8px" : "fit-content"}
            borderRadius="12px"
            // mt="8px"
          >
            <Text fontSize="12px" mt="0 !important" color="brand.greyText">
              Perk #{index}
            </Text>
          </Skeleton>

          <SkeletonText
            isLoaded={!isLoading ?? true}
            w="fit-content"
            h={isLoading ? "12px" : "fit-content"}
            borderRadius="10px"
            // mt="8px"
          >
            <Text fontSize="14px" mt="0 !important" color="black">
              {content}
            </Text>
          </SkeletonText>
        </Stack>
      </HStack>
    </Box>
  );
}
