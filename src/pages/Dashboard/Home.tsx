import { Box, Grid, Heading, Stack, Text } from "@chakra-ui/react";
import {
  APaginator,
  GenericTable,
  Link,
  MainLayoutContainer,
  PageMotion,
  Topbar,
  WeeklyMealLineUp,
} from "components";
import TotalFeatureCount from "components/TotalFeatureCount/TotalFeatureCount";
import useDashboard from "hooks/useDashboard";
import usePageFilters from "hooks/usePageFilters";
import useSubscriptions from "hooks/useSubscriptions";
// import { LinkedList } from "libs";
import { useMemo } from "react";

export default function Home() {
  const { state, onPageChange } = usePageFilters({ limit: 10, page: 1 });

  // const { data, isLoading } = useUsers({
  //   has_lineup: true,
  //   has_subscription: true,
  //   ...state,
  // });

  const { data, isLoading } = useSubscriptions({ ...state, status: "active" });

  const { data: dashboardData, isLoading: isDashboadLoading } = useDashboard();
  const subscriptions = useMemo(() => data?.data ?? [], [data]);
  const hasSubscriptions = useMemo(
    () => (subscriptions ?? []).length > 0,
    [subscriptions]
  );

  console.log("Customers", subscriptions);

  // const list = new LinkedList<number>();
  // Array(10)
  //   .fill(0)
  //   .forEach((_, i) => list.push(i + 1));
  // console.log(list);

  return (
    <PageMotion key="dashboard-home">
      <Topbar pageTitle="Dashboard" />
      <MainLayoutContainer pb="60px">
        <Box>
          <Grid templateColumns="repeat(4, 1fr)" gap="16px">
            <TotalFeatureCount
              type="meals"
              value={dashboardData?.meals ?? 0}
              label="Meals"
              isLoading={isDashboadLoading}
            />
            <TotalFeatureCount
              type="users"
              value={dashboardData?.customers ?? 0}
              label="Users"
              isLoading={isDashboadLoading}
            />
            <TotalFeatureCount
              type="subscriptions"
              value={dashboardData?.subscriptions ?? 0}
              label="Subscriptions"
              isLoading={isDashboadLoading}
            />
            <Box
              p="40px 34px"
              border="1px solid transparent"
              borderColor="brand.neutral"
              borderRadius="8px"
              minW="252px"
            >
              <Text fontSize="3xl" fontWeight="800">
                Menu
              </Text>
              <Link to="/meals" color="brand.primary">
                View this week menu
              </Link>
            </Box>
          </Grid>
        </Box>

        <Stack my="26px">
          <Box>
            <Heading fontSize="lg" fontWeight="700">
              Weekly Meal Lineups
            </Heading>
          </Box>
          <GenericTable
            isLoading={isLoading}
            headers={[
              "Fullname",
              "Status",
              "City",
              "Delivery day",
              "Subscription",
              "Action",
            ]}
          >
            {hasSubscriptions ? (
              <WeeklyMealLineUp data={subscriptions} isLoading={false} />
            ) : null}
          </GenericTable>

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
        </Stack>
      </MainLayoutContainer>
    </PageMotion>
  );
}
