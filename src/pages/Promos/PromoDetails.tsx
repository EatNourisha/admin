import {
  Box,
  BoxProps,
  Button,
  Divider,
  FormControl,
  Grid,
  Heading,
  HStack,
  IconButton,
  Select,
  Skeleton,
  Stack,
  Switch,
  Text,
  TextProps,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  MainLayoutContainer,
  Topbar,
  Icon,
  Gravatar,
  PageMotion,
  Loader,
  InputLabel,
  APaginator,
  ConfirmationModal,
} from "components";

import { navigate, useParams } from "@reach/router";
import { format, parseISO } from "date-fns";
import join from "lodash/join";
import { ReactNode, useMemo, useRef } from "react";
import { currencyFormat, when } from "utils";
import { CouponRo } from "interfaces";
import usePageFilters from "hooks/usePageFilters";
import { EmptyCrate } from "components/Crate/Empty";
import usePromo from "hooks/usePromo";
import { ReferralRo } from "interfaces/auth.interface";
import usePromoMutations from "hooks/usePromoMutation";

export default function PromoDetails() {
  const { id } = useParams();
  const toast = useToast();
  const action = useRef<string>("none");

  const { isOpen, onClose, onOpen } = useDisclosure();

  const { state, onPageChange } = usePageFilters({ limit: 10, page: 1 });

  const { data, isLoading, key } = usePromo(id, { ...state });

  console.log("Promo Details", data);

  const influencer = useMemo(() => data?.promo?.influencer, [data]);
  const coupon = useMemo(() => data?.promo?.coupon as CouponRo, [data]);
  const earnings = useMemo(() => data?.earnings, [data]);
  const referrals = useMemo(() => data?.referrals, [data]);

  const {
    updatePromo,
    deletePromo,
    isLoading: isUpdating,
  } = usePromoMutations([key]);

  const hasReferrals = useMemo(
    () => (referrals?.data ?? []).length > 0,
    [referrals]
  );
  const isActive = useMemo(() => !!data?.promo?.active, [data?.promo]);

  const togglePromoStatus = async () => {
    action.current = "switch";
    const result = await updatePromo(id, { active: !data?.promo?.active });
    if (!!result) {
      toast({
        position: "bottom-right",
        title: "Success 🎉",
        description: `Promo ${when(
          !!result?.active,
          "activated",
          "deactivated"
        )} successfully`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const deletePromoById = async () => {
    onClose();
    const result = await deletePromo(id);
    if (!!result) {
      navigate(-1);
      toast({
        position: "bottom-right",
        title: "Success 🎉",
        description: `Promo deleted successfully`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <PageMotion key="promo-details">
      <Topbar pageTitle="Promotion Code" />
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
              {/* <Button
              size="xs"
              color="brand.black"
              variant="transparent"
              fontSize="md"
              fontWeight="600"
              leftIcon={<Icon type="edit" />}
            >
              Edit
            </Button> */}
              <HStack gridGap="10px">
                <FormControl
                  display="flex"
                  w="fit-content"
                  alignSelf="flex-end"
                >
                  <InputLabel isLoading={isUpdating} m="0" htmlFor="isChecked">
                    {when(isActive, "Active", "Inactive")}
                  </InputLabel>
                  <Switch
                    ml="8px"
                    aria-label="suspend user"
                    disabled={
                      (isUpdating && action.current === "switch") || isLoading
                    }
                    isChecked={!!data?.promo?.active}
                    onChange={togglePromoStatus}
                    sx={{
                      "--switch-track-width": "26px",
                      ".chakra-switch__track": {
                        bg: "brand.neutral400",
                        padding: "3px",
                        borderRadius: "26px",
                      },
                      ".chakra-switch__track[data-checked]": {
                        bg: "#03CCAA",
                        padding: "3px",
                      },
                      ".chakra-switch__thumb": {
                        shadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      },
                    }}
                  />
                </FormControl>
                <Tooltip label="Edit">
                  <IconButton
                    minH="unset"
                    minW="unset"
                    maxH="unset"
                    maxW="unset"
                    boxSize="28px"
                    borderRadius="8px"
                    bg="transparent"
                    aria-label="edit promo"
                    icon={<Icon type="edit" color="black" />}
                    _hover={{
                      bg: "transparent",
                    }}
                    _active={{
                      bg: "transparent",
                    }}
                    _loading={{ color: "brand.primary" }}
                    onClick={() => navigate(`/promos/edit/${id}`)}
                    // disabled={isDeleting}
                    // isLoading={isDeleting}
                  />
                </Tooltip>
                <Tooltip label="Delete Promo">
                  <IconButton
                    minH="unset"
                    minW="unset"
                    maxH="unset"
                    maxW="unset"
                    boxSize="28px"
                    borderRadius="8px"
                    bg="transparent"
                    aria-label="edit promo"
                    icon={<Icon type="delete" color="brand.red" />}
                    _hover={{
                      bg: "transparent",
                    }}
                    _active={{
                      bg: "transparent",
                    }}
                    _loading={{ color: "brand.primary" }}
                    onClick={() => {
                      action.current = "delete";
                      onOpen();
                    }}
                    // disabled={isDeleting}
                    isLoading={isUpdating && action.current === "delete"}
                  />
                </Tooltip>
              </HStack>
            </HStack>

            <VStack pt="44px" pb="74px">
              <Gravatar
                variant="vert"
                isLoading={isLoading}
                // src={user?.profilePhotoUrl}
                title={join(
                  [influencer?.first_name, influencer?.last_name],
                  " "
                )}
                // subtitle={capitalize(user?.gender ?? "male")}
              />
            </VStack>

            <Grid templateColumns="repeat(2, 1fr)" gap="20px">
              <Detail
                isLoading={isLoading}
                title="Email"
                description={influencer?.email}
                _desc={{ textTransform: "lowercase" }}
              />
              <Detail
                isLoading={isLoading}
                title="Phone Number"
                description={influencer?.phone_number}
              />
              <Detail
                isLoading={isLoading}
                title="Code"
                description={data?.promo?.code}
                _desc={{ textTransform: "uppercase" }}
              />
              {!!coupon?.amount_off && (
                <Detail
                  isLoading={isLoading}
                  title="Amount Off"
                  description={currencyFormat(
                    (coupon?.currency as any) ?? "gbp"
                  ).format(+(coupon?.amount_off ?? 0))}
                />
              )}
              {!!coupon?.percent_off && (
                <Detail
                  isLoading={isLoading}
                  title="Percent Off"
                  description={join([coupon?.percent_off, "%"], "")}
                />
              )}

              <Detail
                isLoading={isLoading}
                title="Duration"
                description={coupon?.duration}
              />

              <Detail
                isLoading={isLoading}
                title="Duration In Months"
                description={coupon?.duration_in_months ?? "--------"}
              />
            </Grid>

            <Divider mt="40px" />

            <HStack mb="20px" mt="10px">
              <Text fontWeight="600">Restrictions</Text>
            </HStack>

            <Grid templateColumns="repeat(2, 1fr)" gap="20px">
              <Detail
                isLoading={isLoading}
                title="Max Redemptions"
                description={coupon?.max_redemptions}
              />
              <Detail
                isLoading={isLoading}
                title="Minimum Amount"
                description={currencyFormat(
                  (data?.promo?.restrictions?.minimum_amount_currency as any) ??
                    "gbp"
                ).format(+(data?.promo?.restrictions?.minimum_amount ?? 0))}
              />
              {!!data?.promo?.expires_at && (
                <Detail
                  isLoading={isLoading}
                  title="Expiry Date"
                  description={format(
                    parseISO(data?.promo?.expires_at),
                    "EEE dd, MMM yyyy"
                  )}
                />
              )}
              <Detail
                isLoading={isLoading}
                title="First Time Transaction"
                description={when(
                  !!data?.promo?.restrictions?.first_time_transaction,
                  "YES",
                  "NO"
                )}
              />
            </Grid>

            {!!earnings && (
              <>
                <Divider mt="40px" />

                <HStack mb="20px" mt="10px">
                  <Text fontWeight="600">Earnings</Text>
                </HStack>

                <Box
                  w="100%"
                  //   h="100px"
                  p="20px"
                  shadow="base"
                  border="1px solid"
                  borderColor="brand.neutral100"
                  borderRadius="10px"
                  bg="white"
                >
                  <HStack>
                    <Stack flex="2">
                      <Text fontSize="xs" color="brand.neutral500">
                        Balance
                      </Text>
                      <Text fontSize="24px" fontWeight="600">
                        {currencyFormat("gbp").format(earnings?.balance ?? 0)}
                      </Text>
                    </Stack>
                    <Divider orientation="vertical" />

                    <Stack flex="1">
                      <Text fontSize="xs" color="brand.neutral500">
                        Referrals
                      </Text>
                      <Text fontSize="24px" fontWeight="600">
                        {(earnings?.refs ?? []).length}
                      </Text>
                    </Stack>
                    <Stack flex="1">
                      <Text fontSize="xs" color="brand.neutral500">
                        Discounts
                      </Text>
                      <Text fontSize="24px" fontWeight="600">
                        {0}
                      </Text>
                    </Stack>
                  </HStack>
                </Box>
              </>
            )}
          </Box>

          <Box position="sticky" top="100px">
            <HStack justifyContent="space-between">
              <Heading as="h5" fontSize="lg">
                Referrals
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
                !hasReferrals,
                "0px 2px 12px rgba(0, 0, 0, 0.05)",
                "none"
              )}
              gridGap="16px"
            >
              {!!referrals?.data &&
                !isLoading &&
                (referrals.data ?? []).map((ref) => (
                  <ReferralItem key={ref?._id} {...ref} />
                ))}

              {isLoading && !hasReferrals && <Loader my="80px" />}

              {!isLoading && !hasReferrals && (
                <EmptyCrate
                  description={"This promo has no referrals at the moment"}
                />
              )}

              {hasReferrals && (
                <APaginator
                  flexDir={"row"}
                  isLoading={isLoading}
                  totalCount={referrals?.totalCount}
                  limit={state?.limit}
                  page={state?.page}
                  onPageChange={onPageChange}
                />
              )}
            </Stack>
          </Box>
        </Grid>

        <ConfirmationModal
          isOpen={isOpen}
          onClose={onClose}
          description="Are you sure you want to delete this promo?"
          onConfirm={deletePromoById}
        />
      </MainLayoutContainer>
    </PageMotion>
  );
}

interface DetailProps extends BoxProps {
  title: string;
  description?: ReactNode;
  isLoading?: boolean;
  _desc?: TextProps;
}

interface ReferralItemProps extends ReferralRo {}

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
        {..._desc}
      >
        <Text fontSize="18px" textTransform="capitalize" {..._desc}>
          {description ?? "--------"}
        </Text>
      </Skeleton>
    </Box>
  );
}

function ReferralItem(props: ReferralItemProps) {
  const { invitee, reward, createdAt, is_subscribed } = props;
  return (
    <Box
      w="100%"
      p="20px"
      shadow="base"
      border="1px solid"
      borderColor="brand.neutral100"
      borderRadius="10px"
      bg="white"
    >
      <HStack justifyContent="space-between">
        <Gravatar
          variant="horizSingle"
          // src={user?.profilePhotoUrl}
          title={join([invitee?.first_name, invitee?.last_name], " ")}
          subtitle={format(parseISO(createdAt), "EEE dd, MMM yyyy")}
          onClick={() => navigate(`/users/${invitee?._id}`)}
          _container={{
            flex: 3.5,
            alignSelf: "center",
            justifyContent: "flex-start",
          }}
        />

        <Divider orientation="vertical" />

        <Stack flex="1.5" gap="0">
          <Text fontSize="10px" color="brand.neutral500">
            Ref Code
          </Text>
          <Text
            mt="0 !important"
            fontSize="sm"
            fontWeight="600"
            textTransform="uppercase"
          >
            {invitee?.ref_code}
          </Text>
        </Stack>
        {!!is_subscribed && (
          <Stack flex="1" gap="0">
            <Text fontSize="10px" color="brand.neutral500">
              Reward
            </Text>
            <Text
              mt="0 !important"
              fontSize="sm"
              fontWeight="600"
              textTransform="uppercase"
            >
              {currencyFormat("gbp").format(reward ?? 0)}
            </Text>
          </Stack>
        )}
      </HStack>
    </Box>
  );
}
