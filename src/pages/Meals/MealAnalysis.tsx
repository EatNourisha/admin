import {
  Box,
  BoxProps,
  FormControl,
  HStack,
  Image,
  Select,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { navigate, useParams } from "@reach/router";
import Empty from "assets/images/folder.png";
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
import MobileDataSkeleton from "components/MobileDataSkeleton";
import { ReferralCounter } from "components/ReferralCount/ReferralCount";
import configs from "config";
import useMealAnalysis from "hooks/useMealAnalysis";
import usePageFilters from "hooks/usePageFilters";
import { MealAnalysisRo, MealPackRo, UserRo } from "interfaces";
import { capitalize, join } from "lodash";
import { useMemo } from "react";

interface MobileTableDataProps extends BoxProps {
  data?: MealAnalysisRo[];
  isLoading?: boolean;
}

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

  // console.log("Meal Analysis", id, data);

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
        <Box w="100%">
          <HStack mt="48px" as="form" w="100%" mb="30px">
            <ReferralCounter
              isLoading={isLoading}
              count={data?.totalCount ?? 0}
              description={"Total Count"}
            />
          </HStack>
          <HStack as="form" justifyContent="space-between" w="100%" mb="30px">
            <Stack
              w="full"
              direction={{ base: "column", md: "row" }}
              gap="16px"
            >
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
                  ].map((day, i) => (
                    <option key={i} value={day}>
                      {capitalize(day)}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Stack>

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
            <MobileTableData data={analysis} isLoading={isLoading} />
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

const MobileTableData = (props: MobileTableDataProps) => {
  const { data = [], isLoading } = props;

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
      {data.map((lysis, index) => {
        const user = lysis?.customer as UserRo;
        const pack = lysis?.pack as MealPackRo;

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
                src={user?.profilePhotoUrl}
                title={join([user?.first_name, user?.last_name], " ")}
                onClick={() => navigate(`${configs.paths.users}/${user?._id}`)}
              />
              <HStack justifyContent="space-between">
                <Box>
                  <Text mb="8px">Meal:</Text>
                  <Text fontSize="14px" fontWeight="bold">
                    {pack?.name ?? "----------"}
                  </Text>
                </Box>
                <Box>
                  <Text textAlign="right" mb="8px">
                    Day:
                  </Text>
                  <Text fontSize="14px" fontWeight="bold">
                    {capitalize(lysis?.day ?? "--------------")}
                  </Text>
                </Box>
              </HStack>
              <HStack justifyContent="space-between">
                <Box>
                  <Text mb="8px">Meal Type:</Text>
                  <Text
                    fontSize="14px"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    {capitalize(lysis?.meal_type ?? "--------------")}
                  </Text>
                </Box>
                <Box textAlign={"right"}>
                  <Text mb="8px">Delivery Day:</Text>
                  <Text
                    fontSize="14px"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    {capitalize(user?.delivery_day ?? "--------------")}
                  </Text>
                </Box>
              </HStack>
            </VStack>
          </Box>
        );
      })}
    </VStack>
  );
};
