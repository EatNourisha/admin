import { useMemo } from "react";
import { Box, Grid, HStack, Text } from "@chakra-ui/react";
import {
  GenericTable,
  GenericTableItem,
  Gravatar,
  Icon,
  Input,
  MainLayoutContainer,
  PageMotion,
  Paginator,
  PaginatorContainer,
  SubscriptionBadge,
  Topbar,
  WeeklyPatientsChart,
} from "components";

import { navigate } from "@reach/router";
import configs from "config";
import useUsers from "hooks/useUsers";
import { capitalize, omit } from "lodash";
import usePageFilters from "hooks/usePageFilters";
import TotalFeatureCount from "components/TotalFeatureCount/TotalFeatureCount";

export default function Patients() {
  // const [isLoading, setIsLoading] = useState(true);
  const { state, filter, setFilter, onNextPage, onPrevPage } = usePageFilters(
    {}
  );

  const { data, isLoading } = useUsers({ ...filter, roles: "patient" });

  const patients = useMemo(() => data?.results, [data]);
  const pageData = useMemo(() => omit(data, "results"), [data]);

  // useEffect(() => {
  //   const timer = setTimeout(() => setIsLoading(false), 2000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [isLoading]);

  return (
    <PageMotion key="patients-root" pb="100px">
      <Topbar pageTitle="Patients" />
      <MainLayoutContainer>
        <Grid templateColumns="3fr 1fr" gap="16px">
          <Box>
            <HStack as="form" justifyContent="space-between" w="100%" mb="24px">
              <Input
                // w="100%"
                minH="48px"
                maxW="300px"
                placeholder="Search Patient"
                value={state?.searchQuery ?? ""}
                startAdornment={<Icon type="search" />}
                onChange={(e) => setFilter("searchQuery", e.target.value)}
              />

              {/* <HStack w="fit-content" ml="0 !important" minW="250px">
                <Text fontSize="14px" fontWeight="600" d="inline-block">
                  Filter by:
                </Text>
                <Select
                  flex="2"
                  mt="10px"
                  placeholder="Select Option"
                  minH="48px"
                  // maxW="300px"
                >
                  <option>Value</option>
                </Select>
              </HStack> */}
            </HStack>
            <Box
              borderRadius="24px"
              overflow="hidden"
              shadow="0px 2px 12px rgba(0, 0, 0, 0.05)"
            >
              <GenericTable
                isLoading={isLoading}
                headers={[
                  "Fullname",
                  "Email",
                  "Phone Number",
                  "Gender",
                  "Subscription",
                ]}
              >
                {patients?.map((value) => (
                  <GenericTableItem
                    isClickable
                    key={`patient-table-item:${value?._id}`}
                    onClick={() =>
                      navigate(`${configs.paths.patients}/${value?._id}`)
                    }
                    cols={[
                      <Gravatar
                        src={value?.profilePhotoUrl}
                        title={`${value?.firstName} ${value?.lastName}`}
                      />,
                      <Text fontSize="14px">{value?.email}</Text>,
                      <Text fontSize="14px">{value?.phone}</Text>,
                      <Text fontSize="14px">{capitalize(value?.gender)}</Text>,
                      <SubscriptionBadge type="doctor" />,
                    ]}
                  />
                ))}
              </GenericTable>
            </Box>

            <Box>
              <PaginatorContainer>
                <Paginator
                  {...pageData}
                  onPrev={(prev) => onPrevPage(prev)}
                  onNext={(next) => onNextPage(next)}
                />
              </PaginatorContainer>
            </Box>
          </Box>

          <Box>
            <WeeklyPatientsChart maxH="520px" mb="16px" />

            <TotalFeatureCount type="patients" value={120} label="Patients" />
          </Box>
        </Grid>
      </MainLayoutContainer>
    </PageMotion>
  );
}
