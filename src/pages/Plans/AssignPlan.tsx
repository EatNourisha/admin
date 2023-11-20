import { useMemo, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Text,
  useDisclosure,
  useToast,
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

import { navigate, useParams } from "@reach/router";
import configs from "config";
import useUsers from "hooks/useUsers";
import { join, orderBy } from "lodash";
import usePageFilters from "hooks/usePageFilters";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { useExport } from "hooks/useExports";
import usePlanMutations from "hooks/usePlanMutations";

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
          <HStack as="form" justifyContent="space-between" w="100%" mb="24px">
            <Input
              // w="100%"
              minH="48px"
              minW="340px"
              maxW="400px"
              placeholder="Search Users"
              value={state?.searchPhrase ?? ""}
              endAdornment={<Icon type="search" />}
              onChange={(e) => {
                e.preventDefault();
                setFilter("searchPhrase", e.target.value);
              }}
            />

            {/* <Button
              ml="0 !important"
              leftIcon={<Icon type="export" />}
              onClick={exportUsers}
            >
              Export
            </Button> */}
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
          </Box>

          <Box>
            {/* <PaginatorContainer>
              <Paginator
                {...pageData}
                onPrev={(prev) => onPrevPage(prev)}
                onNext={(next) => onNextPage(next)}
              />
              
            </PaginatorContainer> */}

            {hasCustomers && (
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
