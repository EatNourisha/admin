import { useMemo } from "react";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import {
  APaginator,
  GenericTable,
  GenericTableItem,
  MainLayoutContainer,
  PageMotion,
  Topbar,
  Gravatar,
} from "components";

import { navigate, useLocation } from "@reach/router";
import configs from "config";
import { join, omit, orderBy } from "lodash";
import usePageFilters from "hooks/usePageFilters";
import { currencyFormat } from "utils";
import useOrders from "hooks/useOrders";
import { formatDistanceToNow, parseISO } from "date-fns";
import { OrderStatusBadge } from "./OrderStatusBadge";

export default function Orders() {
  // const [isLoading, setIsLoading] = useState(true);
  const { state, filter, onPageChange } = usePageFilters({
    limit: 10,
    page: 1,
  });

  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const { data, isLoading } = useOrders({
    ...omit(state, ["searchPhrase"]),
    searchPhrase: filter?.searchPhrase,
    customer: params.get("customer") ?? undefined,
  });

  console.log("Orders", data);

  const orders = useMemo(
    () => orderBy(data?.data ?? [], ["createdAt"], ["desc"]),
    [data]
  );
  const hasOrders = useMemo(() => (orders ?? []).length > 0, [orders]);

  // useEffect(() => {
  //   const timer = setTimeout(() => setIsLoading(false), 2000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [isLoading]);

  return (
    <PageMotion key="orders-root" pb="100px">
      <Topbar pageTitle="Orders" />
      <MainLayoutContainer>
        <Box>
          {/* <HStack as="form" justifyContent="space-between" w="100%" mb="24px">
            <Input
              // w="100%"
              minH="48px"
              minW="340px"
              maxW="400px"
              placeholder="Search Plans"
              value={state?.searchPhrase ?? ""}
              endAdornment={<Icon type="search" />}
              onChange={(e) => setFilter("searchPhrase", e.target.value)}
            />

            <Button
              ml="0 !important"
              leftIcon={<Icon type="add" />}
              onClick={() => navigate(configs.paths.addPlan)}
            >
              Add
            </Button>
          </HStack> */}
          <Box
            borderRadius="8px"
            overflow="hidden"
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

                    return (
                      <GenericTableItem
                        isClickable={false}
                        key={`order-table-item:${order?._id}`}
                        cols={[
                          <Gravatar
                            src={cus?.profilePhotoUrl}
                            title={join([cus?.first_name, cus?.last_name], " ")}
                            createdAt={cus?.createdAt}
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
                                navigate(
                                  `${configs.paths.meals}/orders/${order?._id}`
                                )
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
                flexDir={"row"}
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
