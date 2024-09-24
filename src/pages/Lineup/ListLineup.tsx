import { Text, Button, Heading, HStack, Select, Stack } from "@chakra-ui/react";
import {
  APaginator,
  GenericTable,
  GenericTableItem,
  Gravatar,
  MainLayoutContainer,
  PageMotion,
  Topbar,
} from "components";
import { join } from "lodash";
import { formatDistanceToNow, parseISO } from "date-fns";
import { currencyFormat } from "utils";
import { useEffect, useState } from "react";
import { ILineUpItem } from "types";
import { navigate } from "@reach/router";

import { get } from "utils";
import { WeeklyMealLineUp } from "./WeeklyLineup";
import { OrderStatusBadge } from "pages/Orders/OrderStatusBadge";
import configs from "config";
import { OrderRo } from "interfaces";

export default function ListLineup() {
  const [lineUpData, setLineUpData] = useState<{
    data: ILineUpItem[];
    loading: boolean;
  }>({ data: [], loading: true });
  const [status, setStatus] = useState("");
  const [week, setWeek] = useState("");
  const [page, setPage] = useState(1);

  const getLineUps = async () => {
    setLineUpData({ ...lineUpData, loading: true });
    const data = await get(`/orders/lineup/one-section?page=${page}&limit=10`);

    //@ts-ignore
    setLineUpData({ loading: false, data: data?.data });
  };

  useEffect(() => {
    getLineUps();
  }, [page]);

  useEffect(() => {
    const getStatusLineup = async () => {
      if (status) {
        setLineUpData({ ...lineUpData, loading: true });
        const queryString =
          status === "all" ? "/lineups/all" : `/lineups/all?status=${status}`;
        const data = await get(queryString);
        //@ts-ignore
        setLineUpData({ loading: false, data: data?.data });
      }

      if (week) {
        setLineUpData({ ...lineUpData, loading: true });
        const queryString =
          week === "all" ? "/lineups/all" : `/lineups/all?week=${week}`;
        const data = await get(queryString);
        //@ts-ignore
        setLineUpData({ loading: false, data: data?.data });
      }
    };
    getStatusLineup();
  }, [status, week]);

  return (
    <PageMotion key="dashboard-home">
      <Topbar pageTitle="Line Up" />
      <MainLayoutContainer pb="60px">
        <Stack my="26px">
          <div>
            {/* LINEUPS */}
            <HStack justifyContent="space-between">
              <Heading fontSize="lg" fontWeight="700">
                Weekly Meal Lineups
              </Heading>
              <HStack>
                <Select width="150px" onChange={(e) => setWeek(e.target.value)}>
                  <option value="all">All</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </Select>
                <Select
                  width="150px"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="deactivated">Deactivated</option>
                </Select>
              </HStack>
            </HStack>
            <GenericTable
              isLoading={lineUpData.loading}
              headers={["Fullname", "Status", "City", "Delivery day", "Action"]}
            >
              {/* @ts-ignore */}
              {!!lineUpData.data?._lineups?.lineups?.length ? (
                <WeeklyMealLineUp
                  //@ts-ignore
                  data={lineUpData?.data?._lineups?.lineups}
                  isLoading={false}
                />
              ) : null}
            </GenericTable>

            {/* ORDERS?\ */}

            <HStack mt="10" justifyContent="space-between">
              <Heading fontSize="lg" fontWeight="700">
                Orders
              </Heading>
            </HStack>

            <GenericTable
              isLoading={lineUpData?.loading}
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
              {/* @ts-ignore */}
              {!!(lineUpData.data?._orders?.data as OrderRo[])?.filter(o => !(o.status?.toLowerCase()?.includes("un"))).length &&
                //@ts-ignore
                (lineUpData.data?._orders?.data as OrderRo[])?.filter(o => !(o.status?.toLowerCase()?.includes("paid"))).map((order) => {
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
                })}
            </GenericTable>
          </div>
          {/* @ts-ignore */}
          {!!lineUpData.data?._lineups?.lineups?.length && (
            <APaginator
              flexDir={"row"}
              isLoading={!lineUpData.loading}
              /* @ts-ignore */
              totalCount={lineUpData.data?.totalCount}
              limit={10}
              page={page}
              /* @ts-ignore */
              onPageChange={(p) => setPage(p)}
            />
          )}
        </Stack>
      </MainLayoutContainer>
    </PageMotion>
  );
}
