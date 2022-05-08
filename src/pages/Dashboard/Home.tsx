import { Box, Grid, HStack, Select, Text } from "@chakra-ui/react";
import { navigate } from "@reach/router";
import {
  AppointmentHistoryChart,
  AppointmentStatus,
  ConsultationBadge,
  GenericTable,
  GenericTableItem,
  Gravatar,
  MainLayoutContainer,
  Means,
  PageMotion,
  Topbar,
  TotalPaymentChart,
  WeeklyPatientsChart,
} from "components";
import TotalFeatureCount from "components/TotalFeatureCount/TotalFeatureCount";
import configs from "config";
import { format, parseISO } from "date-fns";
import useDashboard from "hooks/useDashboard";
import useGetAppointments from "hooks/useGetAppointment";
import { take } from "lodash";
import { useMemo } from "react";

export default function Home() {
  const { data, isLoading } = useGetAppointments({});
  const { data: dashboardData, isLoading: isDashboadLoading } = useDashboard();
  const appointments = useMemo(() => take(data?.results ?? [], 5), [data]);

  return (
    <PageMotion key="dashboard-home">
      <Topbar pageTitle="Dashboard" />
      <MainLayoutContainer pb="60px">
        <Grid templateColumns="3fr 1fr" gap={"16px"}>
          <Box>
            <Grid templateColumns="repeat(3, 1fr)" gap="16px">
              <TotalFeatureCount
                type="appointments"
                value={dashboardData?.totalAppointments ?? 0}
                label="Appointments"
                isLoading={isDashboadLoading}
              />
              <TotalFeatureCount
                type="patients"
                value={dashboardData?.totalPatients ?? 0}
                label="Patients"
                isLoading={isDashboadLoading}
              />
              <TotalFeatureCount
                type="doctors"
                value={dashboardData?.totalDoctors ?? 0}
                label="Doctors"
                isLoading={isDashboadLoading}
              />
            </Grid>

            <AppointmentHistoryChart mt="16px" />
          </Box>

          <TotalPaymentChart />
        </Grid>

        <Grid mt="16px" templateColumns="3fr 1fr" gap="16px">
          <Box
            borderRadius="24px"
            overflow="hidden"
            // shadow="0px 2px 12px rgba(0, 0, 0, 0.05)"
            border="2px solid transparent"
            borderColor="brand.neutral100"
          >
            <HStack
              justifyContent="space-between"
              alignItems="center"
              p="26px 22px"
            >
              <Text fontSize="18px" fontWeight="700">
                All Appointment
              </Text>

              <Select
                // mt="10px"
                // placeholder="Select Option"
                minH="40px"
                maxW="164px"
                fontSize="12px"
              >
                <option value="recent">Recent Application</option>
              </Select>
            </HStack>
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

          <WeeklyPatientsChart />
        </Grid>

        {/* <Box mt="20px">
          <ConsultationBadge type="doctor" />
          <ConsultationBadge type="therapist" />
        </Box> */}

        {/* <Box mt="20px">
          <SubscriptionBadge type="doctor" />
          <SubscriptionBadge type="therapist" />
          <SubscriptionBadge type="free" />
        </Box> */}

        {/* <Box mt="20px">
          {Object.values(MeansOfContact).map((type) => (
            <Means key={`means-of-contact:${type}`} type={type as any} />
          ))}
        </Box> */}

        {/* <Box mt="20px">
          {["pending", "completed"].map((status) => (
            <AppointmentStatus
              key={`status:${status}`}
              status={status as any}
            />
          ))}
        </Box> */}

        {/* <Box mt="20px">
          <Gravatar title="Dolphin Ademide" />
          <Gravatar
            variant="horizDouble"
            title="Dolphin Ademide"
            subtitle="male"
          />
          <Gravatar variant="vert" title="Dolphin Ademide" subtitle="male" />
        </Box> */}

        {/* <Box mt="20px">
          <Input
            w="100%"
            minH="48px"
            maxW="300px"
            placeholder="Search Patient"
            startAdornment={<Icon type="search" />}
          />

          <Select
            mt="10px"
            placeholder="Select Option"
            minH="48px"
            maxW="300px"
          >
            <option>Value</option>
          </Select>
        </Box> */}
      </MainLayoutContainer>
    </PageMotion>
  );
}
