import { useMemo } from "react";
import { Box, FormControl, HStack, Select, Text } from "@chakra-ui/react";
import {
  APaginator,
  GenericTable,
  GenericTableItem,
  Gravatar,
  InputLabel,
  MainLayoutContainer,
  PageMotion,
  Topbar,
} from "components";

import { capitalize, join } from "lodash";
import usePageFilters from "hooks/usePageFilters";
import { MealPackRo, UserRo } from "interfaces";
import { navigate, useParams } from "@reach/router";
import configs from "config";
import useMealAnalysis from "hooks/useMealAnalysis";
import { ReferralCounter } from "components/ReferralCount/ReferralCount";

export default function MealAnalysis() {
  // const [isLoading, setIsLoading] = useState(true);
  const { state, filter, setFilter, onPageChange } = usePageFilters({
    limit: 10,
    page: 1,
  });

  const { id } = useParams();
  const { data, isLoading } = useMealAnalysis(id, {
    limit: 10,
    page: 1,
    day: filter?.day,
    meal_type: filter?.meal_type,
  });

  console.log("Meal Analysis", id, data);

  const analysis = useMemo(() => data?.data ?? [], [data]);

  const hasAnalysis = useMemo(() => (analysis ?? []).length > 0, [analysis]);

  const isFiltering = useMemo(
    () => hasAnalysis && isLoading,
    [hasAnalysis, isLoading]
  );

  const handleMealType = (value: string) => {
    setFilter("mealType", value);
    if (value !== "all") {
      setFilter("meal_type", value);
    } else {
      setFilter("meal_type", undefined);
    }
  };

  const handleDayOfWeek = (value: string) => {
    setFilter("dayOfWeek", value);
    if (value !== "all") {
      setFilter("day", value);
    } else {
      setFilter("day", undefined);
    }
  };

  // useEffect(() => {
  //   const timer = setTimeout(() => setIsLoading(false), 2000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [isLoading]);

  return (
    <PageMotion key="meal-analysis-root" pb="100px">
      <Topbar pageTitle="Meal Stats" />
      <MainLayoutContainer>
        <Box>
          <HStack
            mt="48px"
            as="form"
            justifyContent="flex-start"
            w="100%"
            mb="24px"
          >
            <ReferralCounter
              isLoading={isLoading}
              count={data?.totalCount ?? 0}
              description={"Total Count"}
            />
          </HStack>
          <HStack as="form" justifyContent="space-between" w="100%" mb="24px">
            <HStack gridGap="16px">
              {/* <Input
                // w="100%"
                minH="48px"
                minW="340px"
                maxW="400px"
                placeholder="Search Users"
                value={state?.searchPhrase ?? ""}
                endAdornment={<Icon type="search" />}
                onChange={(e) => setFilter("searchPhrase", e.target.value)}
              /> */}

              <FormControl w="fit-content" ml="0 !important" minW="250px">
                <InputLabel
                  isLoading={isFiltering}
                  fontSize="14px"
                  fontWeight="600"
                  display="inline-block"
                >
                  Filter by Meal type:
                </InputLabel>
                <Select
                  flex="2"
                  mt="10px"
                  disabled={isLoading || isFiltering}
                  borderWidth="1.5px"
                  placeholder="Select Option"
                  minH="52px"
                  borderRadius="8px"
                  value={filter?.mealType}
                  onChange={(e) => handleMealType(e.target.value)}
                  // maxW="300px"
                >
                  <option value="all">All</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </Select>
              </FormControl>
              <FormControl w="fit-content" ml="0 !important" minW="250px">
                <InputLabel
                  isLoading={isFiltering}
                  fontSize="14px"
                  fontWeight="600"
                  display="inline-block"
                >
                  Filter by Day of Week:
                </InputLabel>
                <Select
                  flex="2"
                  mt="10px"
                  disabled={isLoading || isFiltering}
                  borderWidth="1.5px"
                  placeholder="Select Option"
                  minH="52px"
                  borderRadius="8px"
                  value={filter?.dayOfWeek}
                  onChange={(e) => handleDayOfWeek(e.target.value)}
                  // maxW="300px"
                >
                  <option value="all">All</option>
                  {[
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday",
                  ].map((day) => (
                    <option value={day}>{capitalize(day)}</option>
                  ))}
                </Select>
              </FormControl>
            </HStack>

            {/* <Button
              ml="0 !important"
              leftIcon={<Icon type="export" />}
              isDisabled={isLoading || !hasSubscriptions}
            >
              Export
            </Button> */}
          </HStack>

          <Box
            borderRadius="8px"
            overflow="hidden"
            shadow="0px 2px 12px rgba(0, 0, 0, 0.05)"
          >
            <GenericTable
              isLoading={isLoading}
              headers={["Fullname", "Meal", "Day", "Meal Type", "Delivery Day"]}
            >
              {hasAnalysis
                ? analysis?.map((lysis) => {
                    const user = lysis?.customer as UserRo;
                    const pack = lysis?.pack as MealPackRo;

                    return (
                      <GenericTableItem
                        isClickable={false}
                        key={`lysisscription-table-item:${lysis?._id}`}
                        // onClick={() =>
                        //   navigate(`${configs.paths.users}/${user?._id}`)
                        // }
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
                          <Text fontSize="14px">
                            {pack?.name ?? "----------"}
                          </Text>,
                          <Text fontSize="14px">
                            {capitalize(lysis?.day ?? "--------------")}
                          </Text>,
                          <Text fontSize="14px" textTransform="capitalize">
                            {capitalize(lysis?.meal_type ?? "--------------")}
                          </Text>,
                          <Text fontSize="14px" textTransform="capitalize">
                            {capitalize(user?.delivery_day ?? "--------------")}
                          </Text>,
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

            {hasAnalysis && (
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
