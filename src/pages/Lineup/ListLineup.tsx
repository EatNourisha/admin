import { useCallback, useEffect, useState } from "react";
import { join } from "lodash";
import { formatDistanceToNow, parseISO } from "date-fns";
import { navigate } from "@reach/router";
import {
  Text,
  Button,
  Heading,
  HStack,
  Select,
  Stack,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import {
  APaginator,
  GenericTable,
  GenericTableItem,
  Gravatar,
  LineupDetailModal,
  MainLayoutContainer,
  PageMotion,
  Topbar,
} from "components";
import { WeeklyMealLineUp } from "./WeeklyLineup";
import { OrderStatusBadge } from "pages/Orders/OrderStatusBadge";
import { currencyFormat, get } from "utils";
import configs from "config";
import { OrderRo, UserRo } from "interfaces";
import { ILineUpItem } from "types";
import MobileTableData from "./MobileTableData";
import moment from "moment";

interface LineUpState {
  data: ILineUpItem[];
  loading: boolean;
}

const ITEMS_PER_PAGE = 10;

export default function ListLineup() {
  // State management
  const [lineUpData, setLineUpData] = useState<LineUpState>({
    data: [],
    loading: true,
  });
  const [filters, setFilters] = useState({
    status: "",
    sortBy: "createdAt",
    week: "all",
    delivery_date: "",
    page: 1,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<UserRo | null>(null);

  // Modal handlers
  const handleOpenModal = useCallback(
    (user: UserRo) => {
      setSelectedUser(user);
      onOpen();
    },
    [onOpen]
  );

  const handleCloseModal = useCallback(() => {
    setSelectedUser(null);
    onClose();
  }, [onClose]);

  // // Data fetching
  // const fetchLineUps = useCallback(async () => {
  //   setLineUpData((prev) => ({ ...prev, loading: true }));
  //   try {
  //     const data = await get(
  //       `/orders/lineup/one-section?page=${filters.page}&limit=${ITEMS_PER_PAGE}`
  //     );
  //     //@ts-ignore
  //     setLineUpData({ loading: false, data: data?.data ?? [] });
  //   } catch (error) {
  //     console.error("Error fetching lineups:", error);
  //     setLineUpData((prev) => ({ ...prev, loading: false }));
  //   }
  // }, [filters.page]);

  const fetchFilteredLineups = useCallback(async () => {
    if (
      !filters.status &&
      !filters.sortBy &&
      !filters.week &&
      !filters.delivery_date
    )
      return;

    setLineUpData((prev) => ({ ...prev, loading: true }));
    try {
      let queryString = `/orders/lineup/one-section?page=${filters.page}&limit=${ITEMS_PER_PAGE}`;

      if (filters.status && filters.status !== "all") {
        queryString += `&status=${filters.status}`;
      }

      if (filters.sortBy) {
        queryString +=
          filters.sortBy === "createdAt"
            ? ""
            : `&status=active&sortby=${filters.sortBy}`;
      }

      if (filters.delivery_date) {
        queryString += `&delivery_date=${new Date(
          filters.delivery_date
        ).toISOString()}`;
      }

      if (filters.week && filters.week !== "all") {
        queryString += `&week=${filters.week}`;
      }

      const data = await get(queryString);
      //@ts-ignore
      setLineUpData({ loading: false, data: data?.data ?? [] });
    } catch (error) {
      console.error("Error fetching filtered lineups:", error);
      setLineUpData((prev) => ({ ...prev, loading: false }));
    }
  }, [
    filters.status,
    filters.sortBy,
    filters.week,
    filters.page,
    filters.delivery_date,
  ]);

  // Filter handlers
  const handleFilterChange = useCallback(
    (key: keyof typeof filters, value: string) => {
      console.log("Filter changed:", key, value);
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        // Reset to first page when filters change
        ...(key !== "page" && { page: 1 }),
      }));
    },
    []
  );


  // useEffect(() => {
  //   fetchLineUps();
  // }, [filters.page, fetchLineUps]);

  useEffect(() => {
    fetchFilteredLineups();
  }, [
    filters.page,
    filters.status,
    filters.week,
    filters.sortBy,
    filters.delivery_date,
    fetchFilteredLineups,
  ]);
  // Render helpers
  const renderOrderTableRow = useCallback((order: OrderRo) => {
    const customer = order?.customer;
    const fullName = join([customer?.first_name, customer?.last_name], " ");

    return (
      <GenericTableItem
        isClickable={false}
        key={`order-table-item:${order?._id}`}
        cols={[
          <Gravatar
            src={customer?.profilePhotoUrl}
            title={fullName}
            createdAt={customer?.createdAt}
            IsReturningCustomer={order?.isReturningCustomer}
            platform={customer?.platform}
            subtitle={
              customer?.createdAt &&
              `${formatDistanceToNow(parseISO(customer.createdAt))} ago`
            }
          />,
          <Text fontSize="14px">{order?.platform ?? "---"}</Text>,
          <Text fontSize="14px" textTransform="capitalize">
            {order?.ref ?? "--------"}
          </Text>,
          <Text fontSize="14px">{order?.phone_number}</Text>,
          <Text fontSize="14px" textTransform="uppercase">
            {currencyFormat("gbp").format(order?.subtotal ?? 0)}
          </Text>,
          <Text fontSize="14px">
            {currencyFormat("gbp").format(order?.delivery_fee ?? 0)}
          </Text>,
          <Text fontSize="14px">
            {moment(order?.delivery_date).format("DD/MM/YYYY")}
          </Text>,
          <Text fontSize="14px" textTransform="capitalize">
            {currencyFormat("gbp").format(order?.total ?? 0)}
          </Text>,
          <Text fontSize="14px" textTransform="capitalize">
            {order?.coupon ?? "---"}
          </Text>,
          <Text fontSize="14px" textTransform="capitalize">
            <OrderStatusBadge type={order?.status} />
          </Text>,
          <HStack>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`${configs.paths.order}/${order?._id}`)}
            >
              View More
            </Button>
          </HStack>,
        ]}
      />
    );
  }, []);

  //@ts-ignore
  const filteredOrders = lineUpData.data?._orders?.data?.filter(
    (order: OrderRo) => !order.status?.toLowerCase()?.includes("paid")
  );

  return (
    <PageMotion key="dashboard-home">
      <Topbar pageTitle="Line Up" />
      <MainLayoutContainer pb="60px">
        <Stack my="26px">
          {/* Weekly Meal Lineups Section */}
          <Stack mb={10}>
            <Stack
              direction={{ base: "column", md: "row" }}
              justifyContent="space-between"
            >
              <Heading fontSize="lg" fontWeight="700">
                Weekly Meal Lineups
              </Heading>
              <Stack direction={{ base: "column", md: "row" }}>
                <Select
                  width={{ base: "100%", md: "160px" }}
                  onChange={(e) => handleFilterChange("week", e.target.value)}
                  value={filters.week}
                  isDisabled={lineUpData.loading}
                >
                  <option value="all">All</option>
                  {[1, 2, 3, 4].map((num) => (
                    <option key={num} value={String(num)}>
                      {num}
                    </option>
                  ))}
                </Select>
                <Input
                  width={{ base: "100%", md: "200px" }}
                  type="date"
                  onChange={(e) =>
                    handleFilterChange("delivery_date", e.target.value)
                  }
                  value={filters.delivery_date}
                  isDisabled={lineUpData.loading}
                />
                <Select
                  width={{ base: "100%", md: "160px" }}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  value={filters.sortBy}
                  isDisabled={lineUpData.loading}
                >
                  <option value="createdAt">Created date</option>
                  <option value="deliverydate">Delivery date</option>
                </Select>
              </Stack>
            </Stack>

            {/* Desktop View */}
            <GenericTable
              isLoading={lineUpData.loading}
              headers={["Fullname", "Platform", "Status", "City", "Delivery day", "Action"]}
            >
              {/* @ts-ignore */}
              {lineUpData.data?._lineups?.lineups?.length > 0 && (
                <WeeklyMealLineUp
                  //@ts-ignore
                  data={lineUpData.data._lineups.lineups}
                  isLoading={false}
                />
              )}
            </GenericTable>

            {/* Mobile View */}
            <MobileTableData
              type="lineup"
              //@ts-ignore
              data={lineUpData.data?._lineups?.lineups}
              isLoading={lineUpData.loading}
              onViewLineup={handleOpenModal}
            />

            {/* Lineup Detail Modal */}
            {selectedUser && (
              <LineupDetailModal
                user={selectedUser}
                isOpen={isOpen}
                onClose={handleCloseModal}
              />
            )}

            {/*@ts-ignore*/}
            {lineUpData.data?._lineups?.lineups?.length > 0 && (
              <APaginator
                flexDir="row"
                isLoading={!lineUpData.loading}
                //@ts-ignore
                totalCount={lineUpData.data?._lineups?.totalCount}
                limit={ITEMS_PER_PAGE}
                page={filters.page}
                onPageChange={(p: number) =>
                  handleFilterChange("page", String(p))
                }
              />
            )}

            {/* Orders Section */}
            <HStack my="10" justifyContent="space-between">
              <Heading fontSize="lg" fontWeight="700">
                Orders
              </Heading>
            </HStack>

            <GenericTable
              isLoading={lineUpData.loading}
              headers={[
                "Name",
                "Platform",
                "Reference ID",
                "Phone Number",
                "Subtotal",
                "Delivery Fee",
                "delivery date",
                "Total",
                "Coupon Code",
                "Status",
                "Action",
              ]}
            >
              {filteredOrders?.map(renderOrderTableRow)}
            </GenericTable>

            <MobileTableData
              type="order"
              //@ts-ignore
              data={lineUpData.data?._orders?.data}
              isLoading={lineUpData.loading}
            />

            <APaginator
              isLoading={!lineUpData.loading}
              //@ts-ignore
              totalCount={lineUpData.data?._orders?.totalCount}
              limit={ITEMS_PER_PAGE}
              page={filters.page}
              onPageChange={(p: number) =>
                handleFilterChange("page", String(p))
              }
            />
          </Stack>
        </Stack>
      </MainLayoutContainer>
    </PageMotion>
  );
}
