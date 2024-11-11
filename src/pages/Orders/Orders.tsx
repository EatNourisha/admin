import { useMemo } from "react";
import {
  Box,
  BoxProps,
  Button,
  HStack,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import {
  APaginator,
  GenericTable,
  GenericTableItem,
  MainLayoutContainer,
  PageMotion,
  Topbar,
  Gravatar,
} from "components";
import Empty from "assets/images/folder.png";
import { navigate, useLocation } from "@reach/router";
import configs from "config";
import { join, omit, orderBy } from "lodash";
import usePageFilters from "hooks/usePageFilters";
import { currencyFormat } from "utils";
import useOrders from "hooks/useOrders";
import { formatDistanceToNow, parseISO } from "date-fns";
import { OrderStatusBadge } from "./OrderStatusBadge";
import useOrderMutations from "hooks/useOrderMutation";
import MobileDataSkeleton from "components/MobileDataSkeleton";
import { OrderRo } from "interfaces";

interface MobileOrderDataProps extends BoxProps {
  data?: OrderRo[];
  isLoading?: boolean;
}

export default function Orders() {
  // const [isLoading, setIsLoading] = useState(true);
  const { state, filter, onPageChange } = usePageFilters({
    limit: 20,
    page: 1,
  });

  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const { data, isLoading, key } = useOrders({
    ...omit(state, ["searchPhrase"]),
    searchPhrase: filter?.searchPhrase,
    customer: params.get("customer") ?? undefined,
  });

  const orders = useMemo(
    () => orderBy(data?.data ?? [], ["createdAt"], ["desc"]),
    [data]
  );
  const hasOrders = useMemo(() => (orders ?? []).length > 0, [orders]);

  const { fixPaidOrders, isLoading: isFixing } = useOrderMutations([key]);

  return (
    <PageMotion key="orders-root" pb="100px">
      <Topbar
        pageTitle="Orders"
        fix_unpaid_order
        onFixOrders={fixPaidOrders}
        isFixing={isFixing}
      />
      <MainLayoutContainer>
        <Box>
          <Box
            borderRadius="8px"
            overflow="scroll"
            shadow="0px 2px 12px rgba(0, 0, 0, 0.05)"
          >
            <GenericTable
              isLoading={isLoading}
              headers={[
                "Name",
                "Reference ID",
                "Phone Number",
                "Subtotal",
                "Delivery Fee",
                "Total",
                "Status",
                "Action",
              ]}
            >
              {hasOrders
                ? orders?.map((order) => {
                    const cus = order?.customer;
                    console.log(order);

                    return (
                      <GenericTableItem
                        isClickable={false}
                        key={`order-table-item:${order?._id}`}
                        cols={[
                          <Gravatar
                            src={cus?.profilePhotoUrl}
                            title={join([cus?.first_name, cus?.last_name], " ")}
                            createdAt={cus?.createdAt}
                            IsReturningCustomer={order?.isReturningCustomer}
                            subtitle={
                              !cus?.createdAt
                                ? undefined
                                : `${formatDistanceToNow(
                                    parseISO(cus?.createdAt!)
                                  )} ago`
                            }
                          />,
                          <Text fontSize="14px" textTransform="capitalize">
                            {order?.ref ?? "--------"}
                          </Text>,
                          //  <Text fontSize="14px" textTransform="capitalize">
                          //   {order?.ref ?? "--------"}
                          // </Text>,
                          <Text fontSize="14px">{order?.phone_number}</Text>,
                          <Text fontSize="14px" textTransform="uppercase">
                            {currencyFormat("gbp").format(order?.subtotal ?? 0)}
                          </Text>,
                          <Text fontSize="14px">
                            {currencyFormat("gbp").format(
                              order?.delivery_fee ?? 0
                            )}
                          </Text>,
                          <Text fontSize="14px" textTransform="capitalize">
                            {currencyFormat("gbp").format(order?.total ?? 0)}
                          </Text>,
                          <Text fontSize="14px" textTransform="capitalize">
                            <OrderStatusBadge type={order?.status} />
                          </Text>,
                          <HStack>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                navigate(`${configs.paths.order}/${order?._id}`)
                              }
                            >
                              View More
                            </Button>
                          </HStack>,
                        ]}
                      />
                    );
                  })
                : null}
            </GenericTable>
            <MobileOrderData data={orders} isLoading={isLoading} />
          </Box>

          <Box>
            {/* <PaginatorContainer>
              <Paginator
                {...pageData}
                onPrev={(prev) => onPrevPage(prev)}
                onNext={(next) => onNextPage(next)}
              />
              
            </PaginatorContainer> */}

            {hasOrders && (
              <APaginator
                isLoading={isLoading}
                totalCount={data?.totalCount}
                limit={state?.limit}
                page={state?.page}
                onPageChange={onPageChange}
              />
            )}
          </Box>
        </Box>
      </MainLayoutContainer>
    </PageMotion>
  );
}

function MobileOrderData({ data = [], isLoading }: MobileOrderDataProps) {
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
      {data.map((order, index) => {
        const cus = order?.customer;
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
                src={cus?.profilePhotoUrl}
                title={join([cus?.first_name, cus?.last_name], " ")}
                createdAt={cus?.createdAt}
                IsReturningCustomer={order?.isReturningCustomer}
                subtitle={
                  !cus?.createdAt
                    ? undefined
                    : `${formatDistanceToNow(parseISO(cus?.createdAt!))} ago`
                }
              />
              <HStack justifyContent="space-between">
                <Box>
                  <Text mb="8px">Reference ID:</Text>
                  <Text fontSize="14px" fontWeight="bold" textTransform="capitalize">
                    {order?.ref ?? "--------"}
                  </Text>
                </Box>
                <Box>
                  <Text textAlign="right" mb="8px">
                    Phone Number:
                  </Text>
                  <Text fontSize="14px" fontWeight="bold">{order?.phone_number}</Text>
                </Box>
              </HStack>
              <HStack justifyContent="space-between">
                <Box>
                  <Text mb="8px">SubTotal:</Text>
                  <Text fontSize="14px" fontWeight="bold" textTransform="uppercase">
                    {currencyFormat("gbp").format(order?.subtotal ?? 0)}
                  </Text>
                </Box>
                <Box textAlign={"right"}>
                  <Text mb="8px">Delivery Fee:</Text>
                  <Text fontSize="14px" fontWeight="bold">
                    {currencyFormat("gbp").format(order?.delivery_fee ?? 0)}
                  </Text>
                </Box>
              </HStack>
              <HStack justifyContent="space-between">
                <Box>
                  <Text mb="8px">Total:</Text>
                  <Text fontSize="14px" fontWeight="bold" textTransform="capitalize">
                    {currencyFormat("gbp").format(order?.total ?? 0)}
                  </Text>
                </Box>
                <Box>
                  <Text mb="8px">Status:</Text>
                  <Text fontSize="14px" fontWeight="bold" textTransform="capitalize">
                    <OrderStatusBadge type={order?.status} />
                  </Text>
                </Box>
              </HStack>
              <Button
                w="full"
                size="sm"
                variant="outline"
                onClick={() => navigate(`${configs.paths.order}/${order?._id}`)}
              >
                View More
              </Button>
            </VStack>
          </Box>
        );
      })}
    </VStack>
  );
}
