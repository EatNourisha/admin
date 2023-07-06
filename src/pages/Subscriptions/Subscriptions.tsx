import { useMemo } from "react";
import { Box, Button, HStack, Select, Text } from "@chakra-ui/react";
import {
  APaginator,
  GenericTable,
  GenericTableItem,
  Gravatar,
  Icon,
  Input,
  MainLayoutContainer,
  PageMotion,
  SubscriptionBadge,
  Topbar,
} from "components";

import { join } from "lodash";
import usePageFilters from "hooks/usePageFilters";
import useSubscriptions from "hooks/useSubscriptions";
import { PlanRo, UserRo } from "interfaces";
import { format, parseISO } from "date-fns";
import { navigate } from "@reach/router";
import configs from "config";

export default function Users() {
  // const [isLoading, setIsLoading] = useState(true);
  const { state, setFilter, onPageChange } = usePageFilters({
    limit: 10,
    page: 1,
  });

  const { data, isLoading } = useSubscriptions({ ...state });
  const subscriptions = useMemo(() => data?.data ?? [], [data]);
  const hasSubscriptions = useMemo(
    () => (subscriptions ?? []).length > 0,
    [subscriptions]
  );

  // useEffect(() => {
  //   const timer = setTimeout(() => setIsLoading(false), 2000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [isLoading]);

  return (
    <PageMotion key="subscriptions-root" pb="100px">
      <Topbar pageTitle="Subscriptions" />
      <MainLayoutContainer>
        <Box>
          <HStack as="form" justifyContent="space-between" w="100%" mb="24px">
            <HStack gridGap="16px">
              <Input
                // w="100%"
                minH="48px"
                minW="340px"
                maxW="400px"
                placeholder="Search Users"
                value={state?.searchPhrase ?? ""}
                endAdornment={<Icon type="search" />}
                onChange={(e) => setFilter("searchPhrase", e.target.value)}
              />

              <HStack w="fit-content" ml="0 !important" minW="250px">
                <Text fontSize="14px" fontWeight="600" d="inline-block">
                  Filter by Subscription type:
                </Text>
                <Select
                  flex="2"
                  mt="10px"
                  borderWidth="1.5px"
                  placeholder="Select Option"
                  minH="52px"
                  borderRadius="8px"
                  // maxW="300px"
                >
                  <option value="all">All</option>
                  <option value="individual">Individual</option>
                  <option value="family">Family</option>
                </Select>
              </HStack>
            </HStack>

            <Button ml="0 !important" leftIcon={<Icon type="export" />}>
              Export
            </Button>
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
              ]}
            >
              {subscriptions?.map((sub) => {
                const user = sub?.customer as UserRo;
                const plan = sub?.plan as PlanRo;

                return (
                  <GenericTableItem
                    isClickable={false}
                    key={`subscription-table-item:${sub?._id}`}
                    // onClick={() =>
                    //   navigate(`${configs.paths.users}/${user?._id}`)
                    // }
                    cols={[
                      <Gravatar
                        src={user?.profilePhotoUrl}
                        title={join([user?.first_name, user?.last_name], " ")}
                        onClick={() =>
                          navigate(`${configs.paths.users}/${user?._id}`)
                        }
                      />,
                      <Text fontSize="14px">{user?.email}</Text>,
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
                    ]}
                  />
                );
              })}
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
