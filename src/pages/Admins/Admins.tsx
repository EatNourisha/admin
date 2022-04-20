import {
  Box,
  Button,
  HStack,
  Select,
  VStack,
  Image,
  Text,
  IconButton,
  Switch,
} from "@chakra-ui/react";
import {
  GenericTable,
  GenericTableItem,
  Gravatar,
  Icon,
  Input,
  Link,
  MainLayoutContainer,
  PageMotion,
  Topbar,
} from "components";

import EmptyFolder from "assets/images/folder.png";
import configs from "config";
import { navigate } from "@reach/router";
import useUsers from "hooks/useUsers";
import { useMemo } from "react";
import isEmpty from "lodash/isEmpty";
import usePageFilters from "hooks/usePageFilters";

function EmptyState() {
  return (
    <Box>
      <HStack justifyContent="flex-end">
        <Button onClick={() => navigate(configs.paths.addAdministrator)}>
          Add Administrator
        </Button>
      </HStack>

      <VStack
        py="180px"
        justifyContent="center"
        maxW="200px"
        textAlign="center"
        m="0 auto"
        alignItems="center"
      >
        <Image boxSize="120px" src={EmptyFolder} alt="" />
        <Text>Sorry, it looks like you have nobody yet</Text>
        <Link
          to={configs.paths.addAdministrator}
          textDecoration="underline"
          color="brand.primary"
          fontWeight="bold"
        >
          Add Administrator
        </Link>
      </VStack>
    </Box>
  );
}

export default function Admins() {
  const { state, filter, setFilter } = usePageFilters({});
  const { data, isLoading } = useUsers({ ...filter, roles: "admin" });

  const admins = useMemo(() => data?.results, [data]);

  return (
    <PageMotion key="admins-root">
      <Topbar pageTitle="Administrators" />
      <MainLayoutContainer>
        <HStack as="form" justifyContent="space-between" w="100%" mb="24px">
          <Input
            // w="100%"
            minH="48px"
            maxW="300px"
            placeholder="Search Admin"
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

        {!admins && isEmpty(admins) && !isLoading && <EmptyState />}

        {
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
                "Action",
                "Status",
              ]}
            >
              {admins?.map((value) => (
                <GenericTableItem
                  key={`doctors-table-item:${value?._id}`}
                  cols={[
                    <Gravatar
                      src={value?.profilePhotoUrl}
                      title={`${value?.firstName} ${value?.lastName}`}
                    />,
                    <Text fontSize="14px">{value?.email}</Text>,
                    <Text fontSize="14px">{value?.phone}</Text>,
                    <HStack>
                      <IconButton
                        size="xs"
                        aria-label="edit"
                        variant="transparent"
                        color="brand.neutral500"
                        icon={<Icon type="edit" />}
                        onClick={() =>
                          navigate(`${configs.paths.doctors}/${value?._id}`)
                        }
                      />
                      <IconButton
                        size="xs"
                        aria-label="edit"
                        variant="transparent"
                        color="brand.primary"
                        icon={<Icon type="delete" />}
                        onClick={() =>
                          navigate(`${configs.paths.doctors}/${value?._id}`)
                        }
                      />
                    </HStack>,
                    <Switch
                      isChecked={!value?.suspended}
                      sx={{
                        "--switch-track-width": "26px",
                        ".chakra-switch__track": {
                          bg: "brand.neutral400",
                          padding: "3px",
                          borderRadius: "26px",
                        },
                        ".chakra-switch__track[data-checked]": {
                          bg: "#03CCAA",
                          padding: "3px",
                        },
                        ".chakra-switch__thumb": {
                          shadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                        },
                      }}
                    />,
                  ]}
                />
              ))}
            </GenericTable>
          </Box>
        }
      </MainLayoutContainer>
    </PageMotion>
  );
}
