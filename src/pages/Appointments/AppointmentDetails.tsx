import {
  Box,
  Button,
  // CircularProgress,
  Grid,
  //   Heading,
  HStack,
  //   Select,
  Skeleton,
  Text,
  TextProps,
  // VStack,
} from "@chakra-ui/react";
import {
  MainLayoutContainer,
  Topbar,
  Icon,
  Gravatar,
  //   GenericTable,
  //   GenericTableItem,
  ConsultationBadge,
  //   Link,
  PageMotion,
  Means,
  AppointmentStatus,
  Loader,
  DetailItem,
} from "components";

// import { ReactComponent as StackIcon } from "assets/svgs/stack.svg";

import { navigate, useParams } from "@reach/router";
import configs from "config";
import { format, parseISO } from "date-fns";
import { capitalize } from "lodash";
// import useGetAppointments from "hooks/useGetAppointment";
import { PropsWithChildren } from "react";
import useAppointment from "hooks/useAppointment";

export default function AppointmentDetails() {
  const { id } = useParams();

  const { data: details, isLoading } = useAppointment(id);
  //   const { data, isLoading: isAppointmentsLoading } = useGetAppointments({
  //     user_id: id,
  //   });

  //   const appointments = useMemo(() => data?.results, [data]);

  return (
    <PageMotion key="appointment-details">
      <Topbar pageTitle="Appointments" />
      <MainLayoutContainer pb="40px">
        <Grid
          templateColumns={{ xl: "1.3fr 1fr", "2xl": "1.5fr 1fr" }}
          gap="24px"
        >
          <Box
            p="38px"
            borderRadius="24px"
            border="2px solid transparent"
            borderColor="brand.neutral100"
          >
            <HStack w="100%" justifyContent="flex-start">
              <Button
                size="xs"
                color="brand.black"
                variant="transparent"
                fontSize="md"
                fontWeight="600"
                leftIcon={<Icon type="leftArrow" />}
                onClick={() => navigate(configs.paths.appointments)}
              >
                Back
              </Button>
              {/* <Button
              size="xs"
              color="brand.black"
              variant="transparent"
              fontSize="md"
              fontWeight="600"
              leftIcon={<Icon type="edit" />}
            >
              Edit
            </Button> */}
            </HStack>

            {isLoading && !details && <Loader py="100px" />}

            {!isLoading && details && (
              <>
                <Box
                  w="100%"
                  mt="44px"
                  mb="44px"
                  p="34px 40px"
                  borderRadius="24px"
                  shadow="0px 6px 40px rgba(0, 0, 0, 0.05)"
                >
                  <Grid templateColumns="repeat(2, 1fr)" gap="16px">
                    {details?.user && (
                      <DetailItem
                        label="Patient"
                        _label={{ color: "brand.primary" }}
                      >
                        <Gravatar
                          variant="horizDouble"
                          isLoading={isLoading}
                          src={details?.user?.profilePhotoUrl}
                          title={`${details?.user?.firstName} ${details?.user?.lastName}`}
                          subtitle={capitalize(details?.user?.gender ?? "male")}
                        />
                      </DetailItem>
                    )}

                    {details?.doctor && (
                      <DetailItem
                        label="Doctor"
                        _label={{ color: "brand.primary" }}
                      >
                        <Gravatar
                          variant="horizDouble"
                          isLoading={isLoading}
                          src={details?.doctor?.profilePhotoUrl}
                          title={`${details?.doctor?.firstName} ${details?.doctor?.lastName}`}
                          subtitle={capitalize(
                            details?.doctor?.gender ?? "male"
                          )}
                        />
                      </DetailItem>
                    )}
                  </Grid>
                </Box>

                <Box w="100%" mb="74px" p="34px 40px">
                  <Grid
                    templateColumns="repeat(2, 1fr)"
                    gap="16px"
                    rowGap="40px"
                    mb="56px"
                  >
                    <DetailItem label="Date">
                      <Skeleton
                        borderRadius="16px"
                        w="fit-content"
                        isLoaded={!isLoading ?? true}
                      >
                        <HStack>
                          <Icon type="date" />
                          <Text>
                            {format(parseISO(details?.time!), "dd/MM/yy")}
                          </Text>
                        </HStack>
                      </Skeleton>
                    </DetailItem>

                    <DetailItem label="Time">
                      <Skeleton
                        borderRadius="16px"
                        w="fit-content"
                        isLoaded={!isLoading ?? true}
                      >
                        <HStack>
                          <Icon type="time" />
                          <Text>
                            {format(parseISO(details?.time!), "hh:mm a")}
                          </Text>
                        </HStack>
                      </Skeleton>
                    </DetailItem>

                    <DetailItem label="Means Of Contact">
                      <Skeleton
                        borderRadius="16px"
                        w="fit-content"
                        isLoaded={!isLoading ?? true}
                      >
                        <Means type={details?.meansOfContact!} />
                      </Skeleton>
                    </DetailItem>

                    <DetailItem label="Status">
                      <Skeleton
                        borderRadius="16px"
                        w="fit-content"
                        isLoaded={!isLoading ?? true}
                      >
                        <AppointmentStatus status={details?.status! as any} />
                      </Skeleton>
                    </DetailItem>

                    <DetailItem label="Consultant Type">
                      <Skeleton
                        borderRadius="16px"
                        w="fit-content"
                        isLoaded={!isLoading ?? true}
                      >
                        <ConsultationBadge type={details?.consultationType!} />
                      </Skeleton>
                    </DetailItem>
                  </Grid>

                  {details?.note && (
                    <DetailItem label="Note">
                      <Text color="brand.neutral600">{details?.note}</Text>
                    </DetailItem>
                  )}
                </Box>
              </>
            )}
          </Box>
        </Grid>
      </MainLayoutContainer>
    </PageMotion>
  );
}
