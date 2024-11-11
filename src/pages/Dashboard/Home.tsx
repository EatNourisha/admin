import { Box, Grid, GridItem, Heading, Stack, Text, useDisclosure } from "@chakra-ui/react";
import {
  APaginator,
  GenericTable,
  LineupDetailModal,
  Link,
  MainLayoutContainer,
  PageMotion,
  Topbar,
  WeeklyMealLineUp,
} from "components";
import MobileTableData from "pages/Dashboard/MobileTableData";
import TotalFeatureCount from "components/TotalFeatureCount/TotalFeatureCount";
import useDashboard from "hooks/useDashboard";
import usePageFilters from "hooks/usePageFilters";
import useSubscriptions from "hooks/useSubscriptions";
import { UserRo } from "interfaces";
import { useMemo, useState } from "react";

export default function Home() {
  const { state, onPageChange } = usePageFilters({ limit: 10, page: 1 });
  const { data, isLoading } = useSubscriptions({ ...state, status: "active" })
  const { data: dashboardData, isLoading: isDashboadLoading } = useDashboard();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<UserRo | null>(null);

  const handleOpenModal = (user: UserRo) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    onClose();
  };

  const subscriptions = useMemo(() => data?.data ?? [], [data]);
  const hasSubscriptions = useMemo(
    () => (subscriptions ?? []).length > 0,
    [subscriptions]
  );  

  return (
    <PageMotion key="dashboard-home">
      <Topbar pageTitle="Dashboard" />
      <MainLayoutContainer pb="60px">
        <Box>
          <Grid
            templateColumns={{
              base: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              xl: "repeat(4, 1fr)",
            }}
            gap={{ base: "12px", md: "16px" }}
          >
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
            <TotalFeatureCount
              type="subscriptions"
              value={dashboardData?.orders ?? 0}
              label="Orders"
              isLoading={isDashboadLoading}
            />
            <GridItem
              p={{ base: "16px", md: "20px" }}
              border="1px solid transparent"
              borderColor="brand.neutral"
              borderRadius="8px"
              colSpan={{ base: 2, md: 1 }}
              minW="167px"
            >
              <Text
                fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                fontWeight="800"
              >
                Menu
              </Text>
              <Link
                fontSize={{ base: "sm", md: "md", lg: "lg" }}
                to="/meals"
                color="brand.primary"
              >
                View this week menu
              </Link>
            </GridItem>
          </Grid>
        </Box>

        <Stack my="26px">
          <Box>
            <Heading fontSize="lg" fontWeight="700">
              Weekly Meal Lineups
            </Heading>
          </Box>
          <MobileTableData
            isLoading={isLoading}
            data={subscriptions}
            onViewLineup={handleOpenModal}
          />
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
              <WeeklyMealLineUp
                data={subscriptions}
                isLoading={false}
                onViewLineup={handleOpenModal}
              />
            ) : null}
          </GenericTable>

          {selectedUser && (
            <LineupDetailModal
              user={selectedUser}
              isOpen={isOpen}
              onClose={handleCloseModal}
            />
          )}

          {hasSubscriptions && (
            <APaginator
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
