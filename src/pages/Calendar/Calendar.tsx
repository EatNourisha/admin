// import { Box } from "@chakra-ui/react";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import {
  AppointmentStatus,
  Gravatar,
  Icon,
  Loader,
  MainLayoutContainer,
  PageMotion,
  Paginator,
  PaginatorContainer,
  Topbar,
} from "components";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useMemo, useState } from "react";
import { TextField } from "@mui/material";
import {
  Badge,
  Box,
  Divider,
  Grid,
  Heading,
  HStack,
  Skeleton,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { format, isToday, parseISO, sub } from "date-fns";
import useGetAppointments from "hooks/useGetAppointment";
import { AppointmentRO } from "interfaces";
import { isEmpty, join, omit } from "lodash";
import { navigate } from "@reach/router";
import usePageFilters from "hooks/usePageFilters";

interface CalendarPickerProps {
  onPick?: (value: Date | null) => void;
}

interface CalendarAppointmentProps extends AppointmentRO {
  date: string;
  onClick?: () => void;
}

export default function Calendar() {
  const [date, setDate] = useState<Date | null>(new Date());

  const { filter, onPrevPage, onNextPage } = usePageFilters({});

  const { data, isLoading } = useGetAppointments({
    startDate: !!date
      ? format(sub(date, { days: 1 }), "yyyy-dd-MM")
      : undefined,
    endDate: !!date ? format(date, "yyyy-dd-MM") : undefined,
    // limit: 10,
    ...filter,
  });
  const pageData = useMemo(() => omit(data, "results"), [data]);

  console.log("Calendar Data", data, pageData);

  const appointments = useMemo(() => data?.results ?? [], [data]);
  const totalCount = useMemo(() => appointments.length, [appointments]);

  return (
    <PageMotion key="calendar-home">
      <Topbar pageTitle="Calendar" />
      <MainLayoutContainer pb="40px">
        <Grid templateColumns=".6fr 1fr" gap="40px">
          <Stack>
            <HStack>
              <Heading as="h5" fontSize="md">
                Appointments
              </Heading>
              <Badge
                boxSize="18px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                borderRadius="50%"
                bg="brand.deepBlue"
                color="white"
                p="2px"
              >
                ({totalCount})
              </Badge>
            </HStack>

            {isLoading && isEmpty(appointments) && <Loader py="180px" />}

            {!isLoading && !isEmpty(appointments) && (
              <Stack mt="18px !important">
                {appointments.map((appt, i) => (
                  <CalendarAppointment
                    key={appt?._id}
                    date={date?.toISOString()!}
                    {...appt}
                    onClick={() => navigate(`/appointments/${appt?._id}`)}
                  />
                ))}

                <Box>
                  <PaginatorContainer>
                    <Paginator
                      {...pageData}
                      onPrev={(prev) => onPrevPage(prev)}
                      onNext={(next) => onNextPage(next)}
                    />
                  </PaginatorContainer>
                </Box>
              </Stack>
            )}

            {!isLoading && isEmpty(appointments) && (
              <VStack py="180px" color="gray.400">
                <Text>No appointments found!</Text>
              </VStack>
            )}

            {/* {!isLoading && !isEmpty(appointments) && (
              <Box>
                <PaginatorContainer>
                  <Paginator
                    {...pageData}
                    onPrev={(prev) => onPrevPage(prev)}
                    onNext={(next) => onNextPage(next)}
                  />
                </PaginatorContainer>
              </Box>
            )} */}
          </Stack>

          <CalendarPicker onPick={(value) => setDate(value)} />
        </Grid>
      </MainLayoutContainer>
    </PageMotion>
  );
}

function CalendarAppointment(props: CalendarAppointmentProps) {
  const { time, doctor, user, status, onClick } = props;

  console.log("Calendar Appointment Status", status);
  return (
    <Box
      p="28px 34px"
      maxW="680px"
      w="100%"
      borderRadius="24px"
      border="1px solid transparent"
      borderColor="brand.neutral100"
      as="button"
      outline="1px solid transparent"
      _focus={{
        shadow: "0 0 0 3px var(--focusColor)",
      }}
      onClick={onClick}
      mb="10px !important"
    >
      <HStack justifyContent="space-between" mb="30px">
        {!["pending"].includes(status) && (
          <>
            <Gravatar
              src={doctor?.profilePhotoThumbnailUrl}
              title={`Dr. ${join([doctor?.firstName, doctor?.lastName], " ")}`}
              _avatar={{ size: "sm" }}
              _title={{ maxW: "116px" }}
            />
            <Box minW="50px" h="4px" bg="brand.primary" />
          </>
        )}
        <Gravatar
          src={user?.profilePhotoThumbnailUrl}
          title={`${join([user?.firstName, user?.lastName], " ")}`}
          _avatar={{ size: "sm" }}
          _title={{ maxW: "116px" }}
        />
      </HStack>

      <Divider borderColor="brand.neutral100" borderWidth="1px" />

      <HStack mt="18px" pos="relative">
        <Skeleton borderRadius="16px" w="fit-content" isLoaded={true}>
          <HStack>
            <Icon type="date" />
            <Text>{format(parseISO(time), "dd/MM/yy")}</Text>
          </HStack>
        </Skeleton>

        <Skeleton borderRadius="16px" w="fit-content" isLoaded={true}>
          <HStack ml="30px !important">
            <Icon type="time" />
            <Text>{format(parseISO(time), "hh:mm a")}</Text>
          </HStack>
        </Skeleton>

        <AppointmentStatus pos="absolute" right="0" status={status as any} />
      </HStack>
    </Box>
  );
}

function CalendarPicker(props: CalendarPickerProps) {
  const { onPick } = props;
  const [value, setValue] = useState<Date | null>(new Date());

  const dateLabel = useMemo(() => {
    if (isToday(value as Date)) return "Today";
    return format(value as Date, "MMMM do, yyyy");
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack w="fit-content">
        <Text>{dateLabel}</Text>
        <Box
          p="42px"
          shadow="0px 6px 40px rgba(0, 0, 0, 0.05)"
          borderRadius="24px"
        >
          <StaticDatePicker
            autoFocus
            displayStaticWrapperAs="desktop"
            openTo="day"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
              onPick && onPick(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
      </Stack>
    </LocalizationProvider>
  );
}
