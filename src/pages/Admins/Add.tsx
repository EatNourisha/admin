import { useEffect, useMemo } from "react";
import {
  Box,
  HStack,
  // Select,
  Text,
  Button,
  Td,
  Tr,
  useDisclosure,
  useToast,
  Stack,
} from "@chakra-ui/react";
import {
  ConfirmationModal,
  GenericTable,
  Gravatar,
  Icon,
  Input,
  MainLayoutContainer,
  PageMotion,
  Paginator,
  PaginatorContainer,
  Topbar,
} from "components";
// import usePartialState from "hooks/usePartialState";

// import { navigate } from "@reach/router";
// import configs from "config";
import useUsers from "hooks/useUsers";
import { capitalize, omit } from "lodash";
import { UserRo } from "interfaces";
import useMakeAdmin from "hooks/useMakeAdmin";
// import usePartialState from "hooks/usePartialState";

// import debounce from "lodash/debounce";
import usePageFilters from "hooks/usePageFilters";

interface TableItemProps {
  value: UserRo;
}

// interface IFilterState {
//   searchQuery: string;
//   filterBy: string;
// }

function TableItem(props: TableItemProps) {
  const { value } = props;

  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { makeAdmin: _make, isLoading, isSuccess } = useMakeAdmin();

  const makeAdmin = async () => {
    onClose();
    await _make(value._id);
  };

  const isAdmin = useMemo(() => value?.roles?.includes("admin"), [value]);

  useEffect(() => {
    if (isSuccess) {
      toast({
        containerStyle: {
          background: "whitesmoke",
        },
        position: "bottom-right",
        title: "Success 🎉",
        description: (
          <Stack>
            <Gravatar
              mt="6px !important"
              variant="horizSingle"
              src={value?.profilePhotoUrl}
              title={`${value?.firstName} ${value?.lastName}`}
            />
            <Text mt="0 !important">Successfully upgraded to admin</Text>
          </Stack>
        ),
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      // navigate(configs.paths.profile);
    }
  }, [isSuccess, toast, value]);

  return (
    <>
      <Tr _hover={{ cursor: "default", bg: "#F7F8F98f" }}>
        <Td>
          <Gravatar
            src={value?.profilePhotoUrl}
            title={`${value?.firstName} ${value?.lastName}`}
          />
        </Td>
        <Td>
          <Text fontSize="14px">{value?.email}</Text>
        </Td>
        <Td>
          <Text fontSize="14px" fontWeight="500">
            {value?.roles.map(capitalize).join(", ")}
          </Text>
        </Td>
        <Td>
          <Text fontSize="14px">{value?.phone}</Text>
        </Td>
        <Td>
          <Text fontSize="14px">{capitalize(value.gender)}</Text>
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

  const { state, filter, setFilter, onNextPage, onPrevPage } = usePageFilters(
    {}
  );

  const { data, isLoading } = useUsers({ ...filter, roles: "doctor,patient" });

  const users = useMemo(
    () => (data?.results ?? []).filter((u) => !u.roles?.includes("admin")),
    [data]
  );

  const pageData = useMemo(() => omit(data, "results"), [data]);

  console.log("FILTERS", filter);

  // useEffect(() => {
  //   const timer = setTimeout(() => setIsLoading(false), 2000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [isLoading]);

  return (
    <PageMotion key="doctors-root">
      <Topbar pageTitle="Administrators" />
      <MainLayoutContainer>
        <HStack as="form" justifyContent="space-between" w="100%" mb="24px">
          <Input
            // w="100%"
            minH="48px"
            maxW="300px"
            placeholder="Search User"
            startAdornment={<Icon type="search" />}
            value={state?.searchQuery ?? ""}
            onChange={(e) => setFilter("searchQuery", e.target.value)}
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
            headers={[
              "Fullname",
              "Email",
              "Roles",
              "Phone Number",
              "Gender",
              "Action",
            ]}
          >
            {users?.map((value) => (
              <TableItem key={`users-table-item-${value?._id}`} value={value} />
            ))}
          </GenericTable>
        </Box>

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
