import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Select,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  MainLayoutContainer,
  Topbar,
  Icon,
  Gravatar,
  GenericTable,
  GenericTableItem,
  ConsultationBadge,
  Link,
  PageMotion,
} from "components";

import { ReactComponent as StackIcon } from "assets/svgs/stack.svg";

import { navigate, useParams } from "@reach/router";
import configs from "config";
import useUserDetails from "hooks/useUserDetails";
import { format, parseISO } from "date-fns";
import { capitalize } from "lodash";
import useGetAppointments from "hooks/useGetAppointment";
import { useMemo } from "react";

export default function PatientDetails() {
  const { id } = useParams();

  const { data: user, isLoading } = useUserDetails(id);
  const { data, isLoading: isAppointmentsLoading } = useGetAppointments({
    user_id: id,
  });

  const appointments = useMemo(() => data?.results, [data]);

  return (
    <PageMotion key="patient-details">
      <Topbar pageTitle="Patients" />
      <MainLayoutContainer>
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
                onClick={() => navigate(configs.paths.patients)}
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

            <VStack pt="44px" pb="74px">
              <Gravatar
                variant="vert"
                isLoading={isLoading}
                src={user?.profilePhotoUrl}
                title={`${user?.firstName} ${user?.lastName}`}
                subtitle={capitalize(user?.gender ?? "male")}
              />
            </VStack>

            <HStack gridGap="20px">
              <Box
                w="100%"
                p="24px 22px"
                borderRadius="24px"
                shadow="0px 6px 40px rgba(0, 0, 0, 0.05)"
              >
                <HStack color="brand.black">
                  <Icon type="email" />
                  <Text fontSize="md" fontWeight="400">
                    Email
                  </Text>
                </HStack>

                <Skeleton
                  isLoaded={!isLoading ?? true}
                  w="fit-content"
                  h="20px"
                  borderRadius="12px"
                  mt="8px"
                >
                  <Text fontSize="18px">{user?.email}</Text>
                </Skeleton>
              </Box>
              <Box
                w="100%"
                p="24px 22px"
                borderRadius="24px"
                shadow="0px 6px 40px rgba(0, 0, 0, 0.05)"
              >
                <HStack color="brand.black">
                  <Icon type="phone" />
                  <Text fontSize="md" fontWeight="400">
                    Phone Number
                  </Text>
                </HStack>

                <Skeleton
                  isLoaded={!isLoading ?? true}
                  w="fit-content"
                  h="20px"
                  borderRadius="12px"
                  mt="8px"
                >
                  <Text fontSize="18px">{user?.phone}</Text>
                </Skeleton>
              </Box>
            </HStack>

            <Box mt="58px">
              <Text mb="16px">Active Subcription</Text>
              <Box
                w="100%"
                minW={{ xl: "calc(100% - 140px)", "2xl": "calc(100% - 340px)" }}
                maxW={{ xl: "calc(100% - 140px)", "2xl": "calc(100% - 340px)" }}
                minH="180px"
                p="24px 22px"
                borderRadius="24px"
                bg="linear-gradient(180deg, #3A84FF 0%, #1B70FF 100%)"
                pos="relative"
              >
                <Box as={StackIcon} pos="absolute" top="22px" left="22px" />
                <HStack w="100%" justifyContent="flex-end">
                  <Box borderRadius="50px" bg="#ffffff1f" p="10px 20px">
                    <Text fontSize="14px" fontWeight="400" color="white">
                      Ends Sep. 19 2020
                    </Text>
                  </Box>
                </HStack>

                <Box color="white" mt="40px">
                  <Text fontSize="36px" fontWeight="700">
                    ₦1,500
                  </Text>
                  <Text fontSize="md" fontWeight="600" color="#97ABF2">
                    Doctor Monthly Plan
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box>
            <HStack justifyContent="space-between">
              <Heading as="h5" fontSize="lg">
                Appointment History
              </Heading>

              <Select
                mt="10px"
                placeholder="Select Option"
                minH="48px"
                maxW="180px"
              >
                <option>All time</option>
              </Select>
            </HStack>

            <Box
              mt="16px"
              borderRadius="24px"
              overflow="hidden"
              shadow="0px 2px 12px rgba(0, 0, 0, 0.05)"
            >
              <GenericTable
                isLoading={isAppointmentsLoading}
                headers={["Doctor", "Date", "Consultant Type"]}
              >
                {appointments?.map((value) => (
                  <GenericTableItem
                    key={`appointment-table-item:${value?._id}`}
                    cols={[
                      <Gravatar
                        title={`${value?.doctor?.firstName} ${value?.doctor?.lastName}`}
                      />,
                      <Text fontSize="14px">
                        {format(parseISO(value?.time), "dd/MM/yy")}
                      </Text>,
                      <ConsultationBadge type={value?.consultationType} />,
                    ]}
                  />
                ))}
              </GenericTable>
            </Box>

            <VStack py="20px">
              <Link
                to={configs.paths.appointments}
                color="brand.primary"
                fontWeight="600"
                textDecoration="underline"
              >
                See All Appointment History
              </Link>
            </VStack>
          </Box>
        </Grid>
      </MainLayoutContainer>
    </PageMotion>
  );
}
