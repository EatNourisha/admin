import { useMemo } from "react";
import {
  Box,
  HStack,
  Text,
  Button,
  Td,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  APaginator,
  ConfirmationModal,
  GenericTable,
  Gravatar,
  Icon,
  Input,
  MainLayoutContainer,
  PageMotion,
  Topbar,
} from "components";

import useUsers from "hooks/useUsers";
import { capitalize, join } from "lodash";
import { UserRo } from "interfaces";

import usePageFilters from "hooks/usePageFilters";
import { navigate } from "@reach/router";
import configs from "config";
import useUserMutations from "hooks/useUserMutations";

interface TableItemProps {
  value: UserRo;
  mutationKeys: string[];
}

// interface IFilterState {
//   searchQuery: string;
//   filterBy: string;
// }

function TableItem(props: TableItemProps) {
  const { value, mutationKeys } = props;

  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { makeAdmin: _make, isLoading } = useUserMutations(mutationKeys);

  const makeAdmin = async () => {
    onClose();
    const result = await _make(value._id);
    if (!!result) {
      toast({
        position: "bottom-right",
        title: "Success 🎉",
        description: `Successfully upgraded to admin`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const isAdmin = useMemo(
    () =>
      (value?.roles as any).map((r: any) => r?.slug)?.includes("superadmin"),
    [value]
  );

  return (
    <>
      <Tr _hover={{ cursor: "default", bg: "#F7F8F98f" }}>
        <Td>
          <Gravatar
            src={value?.profilePhotoUrl}
            title={join([value?.first_name, value?.last_name], " ")}
            onClick={() => navigate(`${configs.paths.users}/${value?._id}`)}
          />
        </Td>
        <Td>
          <Text fontSize="14px">{value?.email}</Text>
        </Td>
        <Td>
          <Text fontSize="14px" fontWeight="500">
            {(value?.roles as any)
              .map((r: any) => r.name)
              .map(capitalize)
              .join(", ")}
          </Text>
        </Td>
        <Td>
          <Text fontSize="14px">{value?.phone}</Text>
        </Td>
        <Td>
          <Button
            size="xs"
            variant="solid"
            color="white"
            leftIcon={<Icon type="add" />}
            onClick={onOpen}
            isLoading={isLoading}
            disabled={isAdmin || isLoading}
          >
            Make Admin
          </Button>
        </Td>
      </Tr>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        title="Confirm"
        onConfirm={makeAdmin}
        buttonText={["Make Admin"]}
        description="Are you sure you want to make this user an admin?"
      />
    </>
  );
}

// type FilterKeys = keyof IFilterState;

export default function AddAdmin() {
  // const [isLoading, setIsLoading] = useState(true);

  const { state, filter, setFilter, onPageChange } = usePageFilters({
    limit: 10,
    page: 1,
  });

  const { data, isLoading, key } = useUsers({
    page: state?.page,
    limit: state?.limit,
    nin_roles: "superadmin",
    searchPhrase: filter?.searchPhrase,
  });

  const users = useMemo(() => data?.data ?? [], [data]);
  const hasUsers = useMemo(() => users.length > 0, [users]);

  console.log("FILTERS", filter);

  // useEffect(() => {
  //   const timer = setTimeout(() => setIsLoading(false), 2000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [isLoading]);

  return (
    <PageMotion key="doctors-root" pb="100px">
      <Topbar pageTitle="Administrators" />
      <MainLayoutContainer>
        <HStack as="form" justifyContent="space-between" w="100%" mb="24px">
          <Input
            // w="100%"
            minH="48px"
            minW="340px"
            maxW="400px"
            placeholder="Search Users"
            value={state?.searchPhrase ?? ""}
            endAdornment={<Icon type="search" />}
            onChange={(e) => setFilter("searchPhrase", e.target.value)}
          />
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
        <Box
          borderRadius="24px"
          overflow="hidden"
          shadow="0px 2px 12px rgba(0, 0, 0, 0.05)"
        >
          <GenericTable
            isLoading={isLoading}
            headers={["Fullname", "Email", "Roles", "Phone Number", "Action"]}
          >
            {users?.map((value: any) => (
              <TableItem
                key={`users-table-item-${value?._id}`}
                value={value}
                mutationKeys={[key]}
              />
            ))}
          </GenericTable>
        </Box>

        <Box>
          {hasUsers && (
            <APaginator
              flexDir={"row"}
              isLoading={isLoading}
              totalCount={data?.totalCount}
              limit={state?.limit}
              page={state?.page}
              onPageChange={onPageChange}
            />
          )}
        </Box>
      </MainLayoutContainer>
    </PageMotion>
  );
}
