import { useEffect, useState } from "react";
import { Box, HStack, Select, Text } from "@chakra-ui/react";
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
  Topbar,
} from "components";

export default function Appointments() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);

  return (
    <PageMotion key="appointments-root">
      <Topbar pageTitle="Appointments" />
      <MainLayoutContainer>
        <HStack as="form" justifyContent="space-between" w="100%" mb="24px">
          <Input
            // w="100%"
            minH="48px"
            maxW="300px"
            placeholder="Search Patient"
            startAdornment={<Icon type="search" />}
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
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <GenericTableItem
                  key={`generic-table-items:${i}`}
                  cols={[
                    <Gravatar title="Dolphin Ademide" />,
                    <ConsultationBadge type="doctor" />,
                    <Text fontSize="14px">12/24/21</Text>,
                    <Text fontSize="14px">5:45pm</Text>,
                    <Means type="audio" />,
                    <AppointmentStatus status="pending" />,
                  ]}
                />
              ))}
          </GenericTable>
        </Box>
      </MainLayoutContainer>
    </PageMotion>
  );
}
