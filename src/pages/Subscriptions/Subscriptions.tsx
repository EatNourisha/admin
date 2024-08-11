import { useEffect, useMemo } from "react";
import { Box, FormControl, HStack, Select, Text } from "@chakra-ui/react";
import {
  APaginator,
  GenericTable,
  GenericTableItem,
  Gravatar,
  InputLabel,
  MainLayoutContainer,
  PageMotion,
  SubscriptionBadge,
  Topbar,
} from "components";

import { capitalize, join, omit } from "lodash";
import usePageFilters from "hooks/usePageFilters";
import useSubscriptions from "hooks/useSubscriptions";
import { PlanRo, UserRo } from "interfaces";
import { format, parseISO } from "date-fns";
import { navigate } from "@reach/router";
import configs from "config";
import usePlans from "hooks/usePlans";
import SubscriptionPopover from "./SubscriptionPopover";

export default function Subscriptions() {
  const { state, filter, setFilter, onPageChange } = usePageFilters(
    {
      limit: 10,
      page: 1,
    },
    false
  );

  const { data: plans, isLoading: isLoadingPlans } = usePlans({});

  const { data, isLoading } = useSubscriptions({
    ...omit(state, "subType"),
    plan: filter?.plan,
  });

  const subscriptions = useMemo(() => data?.data ?? [], [data]);
  const hasSubscriptions = useMemo(
    () => (subscriptions ?? []).length > 0,
    [subscriptions]
  );


  const handleSubscriptionType = (value: string) => {
    setFilter("subType", value);
    if (value !== "all") {
      setFilter("plan", value);
    } else {
      setFilter("plan", undefined);
    }
  };

  const handleSort = (value: string) => {
    if (value !== "all") setFilter("sort", value);
    else setFilter("sort", undefined);
  };

  const handleStatusSort = (value: string) => {
    if (value !== "all") setFilter("status", value);
    else setFilter("status", undefined);
  };


  const sortOptions = [
    { label: "All", value: "all" },
    { label: "Today", value: "today" },
    { label: "This Week", value: "this_week" },
    { label: "Last Week", value: "last_week" },
    { label: "This Month", value: "this_month" },
  ];

  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "in_active" },
    { label: "Past due", value: "past_due" },
    { label: "Incomplete", value: "incomplete_expired" },
  ];

  return (
    <PageMotion key="subscriptions-root" pb="100px">
      <Topbar pageTitle="Subscriptions" />
      <MainLayoutContainer>
        <Box>
          <HStack as="form" justifyContent="space-between" w="100%" mb="24px">
            <HStack w="100%" gridGap="16px" justifyContent="space-between">

              <FormControl w="fit-content" ml="0 !important" minW="250px">
                <InputLabel
                  isLoading={isLoadingPlans}
                  fontSize="14px"
                  fontWeight="600"
                  display="inline-block"
                >
                  Filter by Subscription type:
                </InputLabel>
                <Select
                  flex="2"
                  mt="10px"
                  disabled={isLoading || isLoadingPlans}
                  borderWidth="1.5px"
                  // placeholder="Select Option"
                  minH="52px"
                  borderRadius="8px"
                  value={filter?.subType}
                  onChange={(e) => handleSubscriptionType(e.target.value)}
                  // maxW="300px"
                >
                  <option value="all">All</option>
                  {(plans?.data ?? []).map((plan) => (
                    <option value={plan?._id}>
                      {capitalize(plan?.name ?? "")}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl w="fit-content" ml="0 !important" minW="250px">
                <InputLabel
                  isLoading={isLoadingPlans}
                  fontSize="14px"
                  fontWeight="600"
                  display="inline-block"
                >
                  Status:
                </InputLabel>
                <Select
                  flex="2"
                  mt="10px"
                  disabled={isLoading || isLoadingPlans}
                  borderWidth="1.5px"
                  placeholder="Select Option"
                  minH="52px"
                  borderRadius="8px"
                  value={filter?.sort}
                  onChange={(e) => handleStatusSort(e.target.value)}
                >
                  {statusOptions.map((sort) => (
                    <option key={sort.value} value={sort.value}>
                      {sort.label}
                    </option>
                  ))}
                </Select>
              </FormControl>


              <FormControl w="fit-content" ml="0 !important" minW="250px">
                <InputLabel
                  isLoading={isLoadingPlans}
                  fontSize="14px"
                  fontWeight="600"
                  display="inline-block"
                >
                  Sort:
                </InputLabel>
                <Select
                  flex="2"
                  mt="10px"
                  disabled={isLoading || isLoadingPlans}
                  borderWidth="1.5px"
                  placeholder="Select Option"
                  minH="52px"
                  borderRadius="8px"
                  value={filter?.sort}
                  onChange={(e) => handleSort(e.target.value)}
                >
                  {sortOptions.map((sort) => (
                    <option key={sort.value} value={sort.value}>
                      {sort.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </HStack>

         
          </HStack>
          <Box
            borderRadius="8px"
            overflow="hidden"
            shadow="0px 2px 12px rgba(0, 0, 0, 0.05)"
          >
            <GenericTable
              isLoading={isLoading}
              headers={[
                "Fullname",
                "Email",
                "Start Date",
                "End Date",
                "Subscription Type",
                "Action",
              ]}
            >
              {hasSubscriptions
                ? subscriptions?.map((sub) => {
                    const user = sub?.customer as UserRo;
                    const plan = sub?.plan as PlanRo;

                    return (
                      <GenericTableItem
                        isClickable={false}
                        key={`subscription-table-item:${sub?._id}`}
                        cols={[
                          <Gravatar
                            src={user?.profilePhotoUrl}
                            title={join(
                              [user?.first_name, user?.last_name],
                              " "
                            )}
                            onClick={() =>
                              navigate(`${configs.paths.users}/${user?._id}`)
                            }
                          />,
                          <Text width="130px" fontSize="14px">{user?.email}</Text>,
                          <Text fontSize="14px">
                            {!!sub?.start_date
                              ? format(
                                  parseISO(
                                    sub?.start_date ?? new Date().toDateString()
                                  ),
                                  "eee, MMM dd, yyyy"
                                )
                              : "--------------"}
                          </Text>,
                          <Text fontSize="14px" textTransform="capitalize">
                            {!!sub?.end_date
                              ? format(
                                  parseISO(
                                    sub?.end_date ?? new Date().toDateString()
                                  ),
                                  "eee, MMM dd, yyyy"
                                )
                              : "--------------"}
                          </Text>,
                          <SubscriptionBadge
                            type={(plan?.slug as any) ?? "no_subscription"}
                          />,
                          <SubscriptionPopover sub={sub} />
                        ]}
                      />
                    );
                  })
                : null}
            </GenericTable>
          </Box>

          <Box>

            {hasSubscriptions && (
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
