import { useMemo, useState } from "react";
import {
  Box,
  BoxProps,
  Button,
  HStack,
  Image,
  InputGroup,
  InputRightElement,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  APaginator,
  ConfirmationModal,
  GenericTable,
  GenericTableItem,
  Gravatar,
  Icon,
  Input,
  MainLayoutContainer,
  PageMotion,
  Topbar,
} from "components";
import Empty from "assets/images/folder.png";
import { navigate, useParams } from "@reach/router";
import configs from "config";
import useUsers from "hooks/useUsers";
import { join, orderBy } from "lodash";
import usePageFilters from "hooks/usePageFilters";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { useExport } from "hooks/useExports";
import usePlanMutations from "hooks/usePlanMutations";
import MobileDataSkeleton from "components/MobileDataSkeleton";
import { UserRo } from "interfaces";
import { ArrowLeft } from "lucide-react";

interface MobileDataProps extends BoxProps {
  data?: UserRo[];
  isLoading?: boolean;
  isAssigning?: boolean;
  selectedId?: string;
  handleAssignClick: (id: string) => void;
}

export default function AssignPlan() {
  const toast = useToast();
  // const [isLoading, setIsLoading] = useState(true);
  const { state, filter, setFilter, onPageChange } = usePageFilters({
    limit: 10,
    page: 1,
  });

  const { id } = useParams();

  console.log("Plan ID", id);

  const [progress /*, setProgress*/] = useState(0);
  const [selectedId, setId] = useState("none");

  const { data, isLoading, key } = useUsers({
    ...state,
    searchPhrase: filter?.searchPhrase,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { assignPlan, isLoading: isAssigning } = usePlanMutations([key]);

  const { /*exportUserDocs, */ isDownloading, isLoading: isExporting } =
    useExport();

  const customers = useMemo(
    () => orderBy(data?.data ?? [], ["createdAt"], ["desc"]),
    [data]
  );
  const hasCustomers = useMemo(() => (customers ?? []).length > 0, [customers]);

  const handleAssignClick = (id: string) => {
    onOpen();
    setId(id);
  };

  const assignPlanToUser = async () => {
    onClose();
    if (selectedId === "none") return;
    const result = await assignPlan({ plan_id: id, customer_id: selectedId });
    if (!!result) {
      console.log("Assigned Plan Result", result);
      toast({
        position: "bottom-right",
        title: "Success 🎉",
        status: "success",
        duration: 9000,
        isClosable: true,
        description: "Plan has been successfully assigned",
      });
      setId("none");
      navigate(-1);
    }
  };

  return (
    <PageMotion key="users-root" pb="100px">
      <Topbar
        pageTitle="Assign Plan"
        isDownloading={isDownloading || isExporting}
        progressValue={progress}
      />
      <MainLayoutContainer>
        <Box>
          <HStack>
            <Button
              size="xs"
              mb="12px"
              color="brand.black"
              variant="transparent"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </HStack>
          <HStack as="form" justifyContent="space-between" w="100%" mb="24px">
            <InputGroup
              display="block"
              w="100%"
              minH="48px"
              maxW={{ base: "100%", md: "400px" }}
            >
              <Input
                w="full"
                pr="40px"
                placeholder="Search Users"
                value={state?.searchPhrase ?? ""}
                onChange={(e) => {
                  e.preventDefault();
                  setFilter("searchPhrase", e.target.value);
                }}
              />
              <InputRightElement top="4px">
                <Icon type="search" />
              </InputRightElement>
            </InputGroup>
          </HStack>
          <Box
            borderRadius="8px"
            overflow="hidden"
            shadow="0px 2px 12px rgba(0, 0, 0, 0.05)"
          >
            <GenericTable
              isLoading={isLoading}
              headers={["Fullname", "Email", "Phone Number", "Date", "Action"]}
            >
              {customers?.map((value) => (
                <GenericTableItem
                  isClickable={false}
                  key={`customer-table-item:${value?._id}`}
                  cols={[
                    <Gravatar
                      src={value?.profilePhotoUrl}
                      title={join([value?.first_name, value?.last_name], " ")}
                      createdAt={value?.createdAt}
                      subtitle={
                        !value?.createdAt
                          ? undefined
                          : `${formatDistanceToNow(
                              parseISO(value?.createdAt!)
                            )} ago`
                      }
                      onClick={() =>
                        navigate(`${configs.paths.users}/${value?._id}`)
                      }
                    />,
                    <Text fontSize="14px">{value?.email}</Text>,
                    <Text fontSize="14px">{value?.phone}</Text>,
                    <Text fontSize="14px" textTransform="capitalize">
                      {format(
                        parseISO(value?.createdAt ?? new Date().toISOString()),
                        "dd/MM/yyyy"
                      )}
                    </Text>,
                    <Button
                      size="sm"
                      variant="transparent"
                      onClick={() => {
                        handleAssignClick(value?._id);
                      }}
                      isLoading={isAssigning && selectedId === value?._id}
                      disabled={isAssigning && selectedId === value?._id}
                    >
                      Assign
                    </Button>,
                  ]}
                />
              ))}
            </GenericTable>
            <MobileData
              data={customers}
              isLoading={isLoading}
              isAssigning={isAssigning}
              selectedId={selectedId}
              handleAssignClick={handleAssignClick}
            />
          </Box>

          <Box>
            {hasCustomers && (
              <APaginator
                isLoading={isLoading}
                totalCount={data?.totalCount}
                limit={state?.limit}
                page={state?.page}
                onPageChange={onPageChange}
              />
            )}
          </Box>
        </Box>

        <ConfirmationModal
          isOpen={isOpen}
          onClose={onClose}
          title="Confirmation"
          description="Are you sure you want to assign the plan to this user?"
          onConfirm={assignPlanToUser}
        />
      </MainLayoutContainer>
    </PageMotion>
  );
}

function MobileData({
  data = [],
  isLoading,
  isAssigning,
  selectedId,
  handleAssignClick,
}: MobileDataProps) {
  // Loading state - show 3 skeleton items
  if (isLoading) {
    return <MobileDataSkeleton count={10} />;
  }

  // Empty state
  if (!data.length) {
    return (
      <VStack maxW="200px" mx="auto" my="180px" hideFrom={"md"}>
        <Image src={Empty} alt="empty list" boxSize="150px" />
        <Text textAlign="center" fontSize="14px">
          Sorry, it looks like you have nothing here yet
        </Text>
      </VStack>
    );
  }

  // Render actual data
  return (
    <VStack spacing={4} width="full" py={4} hideFrom={"md"}>
      {data.map((value, index) => {
        return (
          <Box
            key={`subscription-${index}`}
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            fontSize="sm"
            w="full"
          >
            <VStack alignItems="stretch" spacing="12px">
              <Gravatar
                src={value?.profilePhotoUrl}
                title={join([value?.first_name, value?.last_name], " ")}
                createdAt={value?.createdAt}
                subtitle={
                  !value?.createdAt
                    ? undefined
                    : `${formatDistanceToNow(parseISO(value?.createdAt!))} ago`
                }
                onClick={() => navigate(`${configs.paths.users}/${value?._id}`)}
              />
              <HStack justifyContent="space-between">
                <Box>
                  <Text mb="8px">Email:</Text>
                  <Text fontSize="14px">{value?.email}</Text>
                </Box>
                <Box>
                  <Text textAlign="right" mb="8px">
                    Phone Number:
                  </Text>
                  <Text fontSize="14px">{value?.phone}</Text>
                </Box>
              </HStack>
              <HStack justifyContent="space-between">
                <Box>
                  <Text mb="8px">Date:</Text>
                  <Text fontSize="14px" textTransform="capitalize">
                    {format(
                      parseISO(value?.createdAt ?? new Date().toISOString()),
                      "dd/MM/yyyy"
                    )}
                  </Text>
                </Box>
              </HStack>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  handleAssignClick(value?._id);
                }}
                isLoading={isAssigning && selectedId === value?._id}
                disabled={isAssigning && selectedId === value?._id}
              >
                Assign
              </Button>
            </VStack>
          </Box>
        );
      })}
    </VStack>
  );
}
