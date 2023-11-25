import {
  Badge,
  Box,
  BoxProps,
  Button,
  Grid,
  Heading,
  HStack,
  IconButton,
  Image,
  Select,
  Skeleton,
  Stack,
  Text,
  TextProps,
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
  APaginator,
} from "components";

import { navigate, useParams } from "@reach/router";
import { format, parseISO } from "date-fns";
import join from "lodash/join";
import { ReactNode, useMemo, useState } from "react";
import { currencyFormat, when } from "utils";
import { MealRo, OrderItemRo, OrderStatus } from "interfaces";
import usePageFilters from "hooks/usePageFilters";
import useOrderDetails from "hooks/useOrderDetails";
import { useOrderStatus } from "./OrderStatusBadge";
import { EmptyCrate } from "components/Crate/Empty";
import useOrderMutations from "hooks/useOrderMutation";
import usePartialState from "hooks/usePartialState";

export default function OrderDetails() {
  const { id } = useParams();
  const toast = useToast();

  const { state, onPageChange } = usePageFilters({ limit: 5, page: 1 });

  const [statusEditMode, setStatusEditMode] = useState(false);

  const { data, isLoading, key } = useOrderDetails(id);
  const { updateOrder, isLoading: isUpdating } = useOrderMutations([key]);

  const order = useMemo(() => data?.order, [data]);
  const cus = useMemo(() => order?.customer, [order]);
  const items = useMemo(() => data?.items, [data]);
  const order_items = useMemo(() => items?.data ?? [], [items]);
  const { info: status, getStatusInfo } = useOrderStatus(
    order?.status ?? OrderStatus.PROCESSING
  );

  const [partial, set] = usePartialState<{ status: OrderStatus }>(
    { status: order?.status ?? OrderStatus.DEFAULT },
    [order?.status]
  );

  console.log("Order status", id, partial);

  const updateStatus = async () => {
    if (
      !partial?.status ||
      (!!partial?.status && partial.status === OrderStatus.DEFAULT)
    )
      return;
    const result = await updateOrder(id, { status: partial.status });

    if (!!result) {
      setStatusEditMode(false);
      toast({
        position: "bottom-right",
        title: "Success 🎉",
        description: `Order status successfully updated`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <PageMotion key="order-details">
      <Topbar pageTitle="Orders" />
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
              <HStack gridGap="10px"></HStack>
            </HStack>

            <VStack pt="44px" pb="74px">
              <Gravatar
                variant="vert"
                isLoading={isLoading}
                src={cus?.profilePhotoUrl}
                title={join([cus?.first_name, cus?.last_name], " ")}
                // subtitle={capitalize(user?.gender ?? "male")}
              />
              <Badge bg={status.bg} color={status.color}>
                Order {status.label}
              </Badge>
            </VStack>

            <Grid templateColumns="repeat(2, 1fr)" gap="20px">
              <Detail
                isLoading={isLoading}
                title="Subtotal"
                description={currencyFormat("gbp").format(order?.subtotal ?? 0)}
              />
              <Detail
                isLoading={isLoading}
                title="Delivery Fee"
                description={currencyFormat("gbp").format(
                  order?.delivery_fee ?? 0
                )}
              />
              <Detail
                isLoading={isLoading}
                title="Total"
                description={currencyFormat("gbp").format(order?.total ?? 0)}
              />
              <Detail
                isLoading={isLoading}
                title="Phone Number"
                description={order?.phone_number}
              />
              <Detail
                isLoading={isLoading}
                title="Delivery Date"
                description={format(
                  parseISO(order?.delivery_date ?? new Date().toISOString()),
                  "dd eee, MMM yyyy "
                )}
              />
              <Detail
                isLoading={isLoading}
                title="Address"
                description={join(
                  [
                    order?.delivery_address?.address_,
                    order?.delivery_address?.city,
                    order?.delivery_address?.country,
                    order?.delivery_address?.postcode,
                  ],
                  !!order?.delivery_address ? ", " : "---"
                )}
              />
              <Detail
                isLoading={isLoading}
                title="Status"
                description={
                  <HStack w="100%">
                    {!statusEditMode ? (
                      <Text
                        fontWeight="500"
                        fontSize="sm"
                        color={status?.color}
                      >
                        {status.label}
                      </Text>
                    ) : (
                      <HStack>
                        <Select
                          w="100%"
                          minH="24px"
                          size="sm"
                          borderRadius="6px"
                          value={partial?.status ?? order?.status}
                          onChange={(e) =>
                            set({ status: e.target.value as any })
                          }
                          disabled={isUpdating}
                        >
                          {Object.values(OrderStatus).map((status) => {
                            return (
                              <option key={status} value={status}>
                                {getStatusInfo(status).label}
                              </option>
                            );
                          })}
                        </Select>

                        <Button
                          size="sm"
                          onClick={() => updateStatus()}
                          isLoading={isUpdating}
                          disabled={isUpdating}
                        >
                          update
                        </Button>
                      </HStack>
                    )}

                    <IconButton
                      minH="unset"
                      minW="unset"
                      maxH="unset"
                      maxW="unset"
                      boxSize="28px"
                      borderRadius="8px"
                      bg="transparent"
                      aria-label="edit mealpack"
                      icon={
                        <Icon
                          type={when(!!statusEditMode, "cancel", "edit")}
                          boxSize="16px"
                          color="black"
                        />
                      }
                      _hover={{
                        bg: "transparent",
                      }}
                      _active={{
                        bg: "transparent",
                      }}
                      onClick={() => setStatusEditMode(!statusEditMode)}
                    />
                  </HStack>
                }
              />
            </Grid>
          </Box>

          <Box position="sticky" top="100px">
            <HStack justifyContent="space-between">
              <Heading as="h5" fontSize="lg">
                Order Items
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
              p="14px 0"
              shadow={when(!items, "0px 2px 12px rgba(0, 0, 0, 0.05)", "none")}
              gridGap="16px"
            >
              {!isLoading &&
                order_items.map((item, i) => <OrderItem key={i} {...item} />)}

              {isLoading && !data && <Loader my="80px" />}

              {!isLoading && order_items?.length < 1 && (
                <EmptyCrate description={"This order does not have any item"} />
              )}

              <Box>
                {!isLoading &&
                  order_items?.length > 0 &&
                  (items?.totalCount ?? 0) >= (state?.limit ?? 0) && (
                    <APaginator
                      flexDir={"row"}
                      isLoading={isLoading}
                      totalCount={items?.totalCount ?? 0}
                      limit={state?.limit}
                      page={state?.page}
                      onPageChange={onPageChange}
                    />
                  )}
              </Box>
            </Stack>
          </Box>
        </Grid>
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

interface OrderItemProps extends Partial<Omit<OrderItemRo, "order">>, BoxProps {
  isLoading?: boolean;
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
        {..._desc}
      >
        <Text fontSize="18px" textTransform="capitalize">
          {description ?? "--------"}
        </Text>
      </Skeleton>
    </Box>
  );
}

function OrderItem(props: OrderItemProps) {
  const { item, quantity, cart_session_id, isLoading, ...xprops } = props;

  const meal = item as MealRo;

  return (
    <HStack
      p="12px 16px"
      borderRadius="8px"
      pos="relative"
      border="1px solid transparent"
      borderColor="brand.neutral100"
      {...xprops}
    >
      <Box w="160px" h="100px" overflow="hidden" borderRadius="10px">
        <Image
          src={meal?.image_url}
          alt={meal?.slug}
          w="100%"
          h="100%"
          objectFit="cover"
        />
      </Box>

      <Stack ml="10px !important" gap="0">
        <Heading as="h6" fontSize="sm">
          {meal?.name}
        </Heading>
        <Text color="grey" fontSize="xs" mt="0px !important">
          {cart_session_id}
        </Text>
        <HStack mt="6px !important">
          <Text fontSize="sm">Quantity</Text>
          <Badge bg="red" w="fit-content" color="white">
            {quantity}
          </Badge>
        </HStack>
        <Button
          mt="6px !important"
          maxW="100px"
          size="xs"
          variant="outline"
          onClick={() => navigate(`/meals/edit/${meal?._id}`)}
        >
          View Meal
        </Button>
      </Stack>

      <Text pos="absolute" bottom="16px" right="20px" fontWeight="500">
        {currencyFormat("gbp").format(
          +(meal?.price?.amount ?? 0) * (quantity ?? 1)
        )}
      </Text>
    </HStack>
  );
}
