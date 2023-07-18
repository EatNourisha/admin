import {
  Box,
  Button,
  HStack,
  // Select,
  VStack,
  Image,
  Text,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import {
  APaginator,
  ConfirmationModal,
  GenericTable,
  GenericTableItem,
  Gravatar,
  Icon,
  Input,
  Link,
  Loader,
  MainLayoutContainer,
  PageMotion,
  Topbar,
} from "components";

import EmptyFolder from "assets/images/folder.png";
import configs from "config";
import { navigate } from "@reach/router";
import { useMemo, useState } from "react";
import isEmpty from "lodash/isEmpty";
import usePageFilters from "hooks/usePageFilters";

import useAdmins from "hooks/useAdmins";
import { join } from "lodash";
import useUserMutations from "hooks/useUserMutations";

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
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentId, setId] = useState<string | "none">("none");
  const { state, filter, setFilter, onPageChange } = usePageFilters({
    limit: 10,
    page: 1,
  });

  const { data, isLoading, key } = useAdmins({
    ...filter,
    searchPhrase: filter?.searchPhrase,
  });

  const { revokeAdminPrivilege, isLoading: isRemoving } = useUserMutations([
    key,
  ]);

  const admins = useMemo(() => data?.data ?? [], [data]);
  const hasAdmins = useMemo(() => admins.length > 0, [admins]);

  const handleRemove = async (id: string) => {
    // setId(id);
    onClose();
    const result = await revokeAdminPrivilege(id);
    if (!!result) {
      toast({
        position: "bottom-right",
        title: "Success 🎉",
        description: `Successfully revoked the admin privilege`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
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
            minW="340px"
            maxW="400px"
            placeholder="Search Admins"
            value={state?.searchPhrase ?? ""}
            endAdornment={<Icon type="search" />}
            onChange={(e) => setFilter("searchPhrase", e.target.value)}
          />

          <Button onClick={() => navigate(configs.paths.addAdministrator)}>
            Add Administrator
          </Button>
        </HStack>

        {!admins && isEmpty(admins) && !isLoading && <EmptyState />}

        {isLoading && isEmpty(admins) && <Loader my="180px" />}

        {!isLoading && !isEmpty(admins) && (
          <Box
            borderRadius="24px"
            overflow="hidden"
            shadow="0px 2px 12px rgba(0, 0, 0, 0.05)"
          >
            <GenericTable
              isLoading={isLoading}
              headers={["Fullname", "Email", "Phone Number", "Action"]}
            >
              {admins?.map((admin) => (
                <GenericTableItem
                  key={`doctors-table-item:${admin?._id}`}
                  cols={[
                    <Gravatar
                      src={admin?.profilePhotoUrl}
                      title={join([admin?.first_name, admin?.last_name], " ")}
                      onClick={() =>
                        navigate(`${configs.paths.users}/${admin?._id}`)
                      }
                    />,
                    <Text fontSize="14px">{admin?.email}</Text>,
                    <Text fontSize="14px">{admin?.phone}</Text>,
                    <HStack>
                      <Button
                        size="xs"
                        aria-label="edit"
                        variant="transparent"
                        color="brand.error"
                        leftIcon={<Icon type="delete" />}
                        disabled={isRemoving && currentId === admin?._id}
                        isLoading={isRemoving && currentId === admin?._id}
                        onClick={() => {
                          setId(admin?._id);
                          onOpen();
                        }}
                      >
                        Revoke Privilege
                      </Button>
                    </HStack>,
                  ]}
                />
              ))}
            </GenericTable>
          </Box>
        )}

        {admins?.length > (state?.limit ?? 0) && (
          <Box>
            {hasAdmins && (
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
        )}
      </MainLayoutContainer>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        title="Confirm Revocation"
        description="Are you sure you want to revoke this privilege?"
        onConfirm={() => handleRemove(currentId)}
        buttonText={["Revoke"]}
      />
    </PageMotion>
  );
}
