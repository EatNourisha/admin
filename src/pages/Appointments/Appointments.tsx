import { useMemo } from "react";
import {
  Box,
  Grid,
  HStack,
  Select,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  AppointmentStatus,
  ConsultationBadge,
  GenericTable,
  GenericTableItem,
  Gravatar,
  Icon,
  Input,
  MainLayoutContainer,
  Means,
  PageMotion,
  // Paginator,
  // PaginatorContainer,
  Topbar,
} from "components";
import useGetAppointments from "hooks/useGetAppointment";
import { format, parseISO } from "date-fns";
import configs from "config";
import { navigate } from "@reach/router";
import usePageFilters from "hooks/usePageFilters";
import useGetAppointmentStats from "hooks/useAppointmentStats";
// import { omit } from "lodash";
import capitalize from "lodash/capitalize";

interface StatProps {
  status: "pending" | "completed" | "queued";
}

function Stat(props: StatProps) {
  const { status } = props;
  const { data, isLoading } = useGetAppointmentStats({ status });

  return (
    <Box
      borderRadius="24px"
      minW="200px"
      p="66px 46px"
      shadow="0px 6px 40px rgba(0, 0, 0, 0.05)"
    >
      <Stack justifyContent="center" alignItems="center">
        <Skeleton
          isLoaded={!isLoading ?? true}
          borderRadius="12px"
          h={isLoading ? "14px" : "fit-content"}
        >
          <Text fontSize="32px" fontWeight="bold">
            {data?.count ?? "543"}
          </Text>
        </Skeleton>
        <Skeleton
          isLoaded={!isLoading ?? true}
          borderRadius="12px"
          h={isLoading ? "14px" : "fit-content"}
          mt={isLoading ? "2px !important" : "0 !important"}
        >
          <Text fontSize="md" color="brand.neutral500" mt="0 !important">
            {data?.status && capitalize(data?.status)}
          </Text>
        </Skeleton>
      </Stack>
    </Box>
  );
}

export default function Appointments() {
  // const [isLoading, setIsLoading] = useState(true);

  const { state, filter, setFilter } = usePageFilters({});
  const { data, isLoading } = useGetAppointments({ ...filter });

  const appointments = useMemo(() => data?.results, [data]);
  // const pageData = useMemo(() => omit(data, "results"), [data]);

  // console.log("APPOINTMENT DATA", appointments);

  // useEffect(() => {
  //   const timer = setTimeout(() => setIsLoading(false), 2000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [isLoading]);

  return (
    <PageMotion key="appointments-root">
      <Topbar pageTitle="Appointments" />
      <MainLayoutContainer>
        <Grid templateColumns="1fr .3fr" gap="30px">
          <Box>
            <HStack justifyContent="space-between" w="100%" mb="24px">
              <Input
                // w="100%"
                minH="48px"
                maxW="300px"
                placeholder="Search Appointment"
                startAdornment={<Icon type="search" />}
                value={state?.searchQuery ?? ""}
                onChange={(e) => setFilter("searchQuery", e.target.value)}
              />

              <HStack w="fit-content" ml="0 !important" minW="250px">
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
              </HStack>
            </HStack>

            <Box
              borderRadius="24px"
              overflow="hidden"
              shadow="0px 2px 12px rgba(0, 0, 0, 0.05)"
            >
              <GenericTable
                isLoading={isLoading}
                headers={[
                  "Patient",
                  "Consultant Type",
                  "Date",
                  "Time",
                  "Means of Contact",
                  "Status",
                ]}
              >
                {appointments?.map((value) => (
                  <GenericTableItem
                    isClickable
                    onClick={() =>
                      navigate(`${configs.paths.appointments}/${value?._id}`)
                    }
                    key={`appointment-table-item:${value?._id}`}
                    cols={[
                      <Gravatar
                        src={value?.user?.profilePhotoUrl}
                        title={`${value?.user?.firstName} ${value?.user?.lastName}`}
                      />,
                      <ConsultationBadge type={value?.consultationType} />,
                      <Text fontSize="14px">
                        {format(parseISO(value.time), "dd/MM/yy")}
                      </Text>,
                      <Text fontSize="14px">
                        {format(parseISO(value.time), "hh:mm a")}
                      </Text>,
                      <Means type={value.meansOfContact} />,
                      <AppointmentStatus status={value.status as any} />,
                    ]}
                  />
                ))}
              </GenericTable>
            </Box>
          </Box>

          <Stack mt="80px">
            <Stat status="completed" />
            <Stat status="pending" />
            <Stat status="queued" />
          </Stack>
        </Grid>

        {/* <Box>
          <PaginatorContainer>
            <Paginator
              {...pageData}
              onPrev={(prev) => setFilter("prevPage", prev)}
              onNext={(next) => setFilter("nextPage", next)}
            />
          </PaginatorContainer>
        </Box> */}
      </MainLayoutContainer>
    </PageMotion>
  );
}
