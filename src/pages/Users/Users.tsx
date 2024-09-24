import { useCallback, useMemo, useState } from "react";
import { Box, Button, HStack, Text, useToast } from "@chakra-ui/react";
import {
  APaginator,
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
import useUsers from "hooks/useUsers";
import { join, orderBy } from "lodash";
import usePageFilters from "hooks/usePageFilters";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { useExport } from "hooks/useExports";
import { when } from "utils";
import { UserRo } from "interfaces";
import useUserMutations from "hooks/useUserMutations";

export default function Users() {
  const toast = useToast();
  // const [isLoading, setIsLoading] = useState(true);
  const { state, filter, setFilter, onPageChange } = usePageFilters({
    limit: 10,
    page: 1,
  });

  const [progress /*, setProgress*/] = useState(0);

  const { data, isLoading } = useUsers({
    ...state,
    searchPhrase: filter?.searchPhrase,
  });

  const { syncUsersToMailchimp, isLoading: isSyncing } = useUserMutations();

  const { /*exportUserDocs, */ isDownloading, isLoading: isExporting } =
    useExport();

  const customers = useMemo(
    () => orderBy(data?.data ?? [], ["createdAt"], ["desc"]),
    [data]
  );
  console.log(customers)
  const hasCustomers = useMemo(() => (customers ?? []).length > 0, [customers]);

  const delivery_day = useCallback((user: UserRo) => {
    const info = user?.delivery_info;
    if (!!info && info?.next_delivery_date) {
      const day = parseISO(info?.next_delivery_date).getDay();
      /// Since nourisha doesn't delivery on sat, sun and mon, consider them not selected by the user.
      if ([6, 0, 1].includes(day)) return "------";
      return format(parseISO(info?.next_delivery_date), "EEE dd, MMM yyyy");
    }

    return info?.delivery_day ?? "------";
  }, []);

  // const exportUsers = async () => {
  //   await exportUserDocs((progs) => setProgress(progs));
  // };

  // useEffect(() => {
  //   const timer = setTimeout(() => setIsLoading(false), 2000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [isLoading]);

  const handleSyncContacts = async (e: any) => {
    e.preventDefault();
    const result = await syncUsersToMailchimp();
    if (!!result) {
      toast({
        position: "bottom-right",
        title: "Success 🎉",
        description: `Successfully synced users to mailchimp`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <PageMotion key="users-root" pb="100px">
      <Topbar
        pageTitle="Users"
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

            <Button
              size="md"
              ml="0 !important"
              leftIcon={<Icon type="export" />}
              onClick={handleSyncContacts}
              isLoading={isSyncing}
              isDisabled={isSyncing}
            >
              Sync to mailchimp
            </Button>
          </HStack>
          <Box
            borderRadius="8px"
            overflow="hidden"
            shadow="0px 2px 12px rgba(0, 0, 0, 0.05)"
          >
            <GenericTable
              isLoading={isLoading}
              headers={[
                "Fullname",
                "Email",
                "Phone Number",
                "Delivery Day",
                "Subscription",
                "Action",
              ]}
            >
              {customers?.map((value) => (
                <GenericTableItem
                  isClickable={false}
                  key={`customer-table-item:${value?._id}`}
                  onClick={() =>
                    navigate(`${configs.paths.users}/${value?._id}`)
                  }
                  cols={[
                    <Gravatar
                      src={value?.profilePhotoUrl}
                      title={join([value?.first_name, value?.last_name], " ")}
                      IsReturningCustomer={value?.IsReturningCustomer}
                      createdAt={value?.createdAt}
                      subtitle={
                        !value?.createdAt
                          ? undefined
                          : `${formatDistanceToNow(
                              parseISO(value?.createdAt!)
                            )} ago`
                      }
                    />,
                    <Text fontSize="14px">{value?.email}</Text>,
                    <Text fontSize="14px">{value?.phone}</Text>,
                    <Text fontSize="14px" textTransform="capitalize">
                      {delivery_day(value)}
                    </Text>,
                    <SubscriptionBadge
                      type={when(
                        ["active"].includes(
                          value?.subscription?.status ?? "past_due"
                        ),
                        (value?.subscription?.plan?.name as any) ?? "Active",
                        "no_subscription"
                      )}
                    />,
                    <Button size="sm" variant="outline">
                      View More
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
      </MainLayoutContainer>
    </PageMotion>
  );
}
