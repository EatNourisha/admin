import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Image,
  Select,
  Skeleton,
  Stack,
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
  CircleIcon,
  PageMotion,
} from "components";

import ResumePng from "assets/images/resume.png";

import { navigate, useParams } from "@reach/router";
import configs from "config";
import useUserDetails from "hooks/useUserDetails";
import { capitalize } from "lodash";
import useGetAppointments from "hooks/useGetAppointment";
import { useMemo } from "react";
import { format, parseISO } from "date-fns";

function ViewableImage() {
  return (
    <Box pos="relative" borderRadius="16px" h="100%" w="100%" py="20px">
      <Image w="100%" h="100%" src={ResumePng} alt="" />

      <Box
        pos="absolute"
        top="20px"
        left="0"
        w="100%"
        h="calc(100% - 40px)"
        color="white"
      >
        <VStack h="100%" justifyContent="center">
          <Button size="sm" variant="transparent" color="white" py="10px">
            <Stack alignItems="center">
              <Icon type="view" />
              <Text>Show</Text>
            </Stack>
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

export default function DoctorDetails() {
  const { id } = useParams();

  const { data: user, isLoading } = useUserDetails(id);
  const { data, isLoading: isAppointmentsLoading } = useGetAppointments({
    user_id: id,
    role: "doctor",
  });

  const appointments = useMemo(() => data?.results, [data]);

  return (
    <PageMotion key="doctor-details" pb="80px">
      <Topbar pageTitle="Doctors" />
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
                onClick={() => navigate(configs.paths.doctors)}
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

            <Grid templateColumns="repeat(2, 1fr)" gap="20px">
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
              <Box
                w="100%"
                p="24px 22px"
                borderRadius="24px"
                shadow="0px 6px 40px rgba(0, 0, 0, 0.05)"
              >
                <HStack color="brand.black">
                  <Icon type="file" />
                  <Text fontSize="md" fontWeight="400">
                    Resume
                  </Text>
                </HStack>

                <ViewableImage />
              </Box>
              <Box
                w="100%"
                p="24px 22px"
                borderRadius="24px"
                shadow="0px 6px 40px rgba(0, 0, 0, 0.05)"
              >
                <HStack color="brand.black">
                  <Icon type="folder" />
                  <Text fontSize="md" fontWeight="400">
                    Medical Certificate
                  </Text>
                </HStack>

                <ViewableImage />
              </Box>
              <Box
                w="100%"
                p="24px 22px"
                borderRadius="24px"
                shadow="0px 6px 40px rgba(0, 0, 0, 0.05)"
              >
                <HStack color="brand.black">
                  <Icon type="hash" />
                  <Text fontSize="md" fontWeight="400">
                    License
                  </Text>
                </HStack>

                <Text fontSize="18px">------</Text>
              </Box>
            </Grid>
          </Box>

          <Box>
            <Grid templateColumns="repeat(2, 1fr)" gap="16px" mb="24px">
              <Box
                shadow="0px 6px 40px rgba(0, 0, 0, 0.05)"
                borderRadius="24px"
                bg="white"
                p="48px 32px"
              >
                <VStack>
                  <CircleIcon
                    size="lg"
                    bg="brand.lightGreen"
                    type="checked"
                    shadow="0 10px 20px #03CCAA4f"
                  />
                  <VStack mt="12px !important">
                    <Text fontSize="36px" fontWeight="700">
                      56
                    </Text>
                    <Text mt="0 !important" color="brand.neutral600">
                      Completed Booking
                    </Text>
                  </VStack>
                </VStack>
              </Box>
              <Box
                shadow="0px 6px 40px rgba(0, 0, 0, 0.05)"
                borderRadius="24px"
                bg="white"
                p="48px 32px"
              >
                <VStack>
                  <CircleIcon
                    size="lg"
                    bg="brand.red"
                    type="cancel"
                    shadow="0 10px 20px #E5432E4f"
                  />
                  <VStack mt="12px !important">
                    <Text fontSize="36px" fontWeight="700">
                      20
                    </Text>
                    <Text mt="0 !important" color="brand.neutral600">
                      Pending Booking
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            </Grid>

            <HStack justifyContent="space-between">
              <Heading as="h5" fontSize="lg">
                Booking History
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
                headers={["Patient", "Date", "Consultant Type"]}
              >
                {appointments?.map((value) => (
                  <GenericTableItem
                    key={`appointments-table-item:${value?._id}`}
                    cols={[
                      <Gravatar
                        title={`${value?.user?.firstName} ${value?.user?.lastName}`}
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
                See All Booking History
              </Link>
            </VStack>
          </Box>
        </Grid>
      </MainLayoutContainer>
    </PageMotion>
  );
}
