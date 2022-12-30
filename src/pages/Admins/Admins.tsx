import {
  Box,
  Button,
  HStack,
  // Select,
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
  Paginator,
  PaginatorContainer,
  Topbar,
} from "components";

import EmptyFolder from "assets/images/folder.png";
import configs from "config";
import { navigate } from "@reach/router";
import useUsers from "hooks/useUsers";
import { useMemo, useState } from "react";
import isEmpty from "lodash/isEmpty";
import usePageFilters from "hooks/usePageFilters";
import useUpdateAdminStatus from "hooks/useUpdateAdminStatus";
import { when } from "utils";
import useAuthStore from "stores/auth";
import { omit } from "lodash";

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
  const { sub } = useAuthStore();
  const [currentId, setId] = useState<string | "none">("none");
  const { state, filter, setFilter, onPrevPage, onNextPage } = usePageFilters(
    {}
  );

  const { data, isLoading, key } = useUsers({ ...filter, roles: "admin" });

  const { update, removeAdmin, isRemoving, isUpdating } = useUpdateAdminStatus([
    key,
  ]);

  const admins = useMemo(
    () => (data?.results ?? [])?.filter((r) => r?._id !== sub),
    [data, sub]
  );
  const pageData = useMemo(() => omit(data, "results"), [data]);

  const handleStatus = async (id: string, isSuspended: boolean) => {
    setId(id);
    const action = when(!!isSuspended, "enable", "disable");
    await update(action)(id);
    setId("none");
  };

  const handleRemove = async (id: string) => {
    setId(id);
    await removeAdmin(id);
    setId("none");
  };

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

          <Button onClick={() => navigate(configs.paths.addAdministrator)}>
            Add Administrator
          </Button>

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

        {!admins && isEmpty(admins) && !isLoading && <EmptyState />}

        {!isLoading && !isEmpty(admins) && (
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
                        disabled={isRemoving && currentId === value?._id}
                        isLoading={isRemoving && currentId === value?._id}
                        onClick={() => handleRemove(value?._id)}
                      />
                    </HStack>,
                    <Switch
                      disabled={isUpdating && currentId === value?._id}
                      isChecked={!value?.suspended}
                      onChange={() =>
                        handleStatus(value?._id, value?.suspended)
                      }
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
        )}

        <Box>
          <PaginatorContainer>
            <Paginator
              {...pageData}
              onPrev={(prev) => onPrevPage(prev)}
              onNext={(next) => onNextPage(next)}
            />
          </PaginatorContainer>
        </Box>
      </MainLayoutContainer>
    </PageMotion>
  );
}
