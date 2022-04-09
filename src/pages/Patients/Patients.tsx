import { useEffect, useState } from "react";
import { Box, HStack, Select, Text } from "@chakra-ui/react";
import {
  GenericTable,
  GenericTableItem,
  Gravatar,
  Icon,
  Input,
  MainLayoutContainer,
  PageMotion,
  SubscriptionBadge,
  Topbar,
} from "components";

import { navigate } from "@reach/router";
import configs from "config";

export default function Patients() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);

  return (
    <PageMotion key="patients-root">
      <Topbar pageTitle="Patients" />
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
              "Fullname",
              "Email",
              "Phone Number",
              "Gender",
              "Subscription",
            ]}
          >
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <GenericTableItem
                  isClickable
                  key={`generic-table-items:${i}`}
                  onClick={() => navigate(`${configs.paths.patients}/${i}`)}
                  cols={[
                    <Gravatar title="Dolphin Ademide" />,
                    <Text fontSize="14px">johndoe@email.com</Text>,
                    <Text fontSize="14px">(603) 555-0123</Text>,
                    <Text fontSize="14px">Male</Text>,
                    <SubscriptionBadge type="doctor" />,
                  ]}
                />
              ))}
          </GenericTable>
        </Box>
      </MainLayoutContainer>
    </PageMotion>
  );
}
