import { useMemo, useState } from "react";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
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
import { formatDistanceToNow, parseISO } from "date-fns";
import { useExport } from "hooks/useExports";

export default function Users() {
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

  const { /*exportUserDocs, */ isDownloading, isLoading: isExporting } =
    useExport();

  const customers = useMemo(
    () => orderBy(data?.data ?? [], ["createdAt"], ["desc"]),
    [data]
  );
  const hasCustomers = useMemo(() => (customers ?? []).length > 0, [customers]);

  // const exportUsers = async () => {
  //   await exportUserDocs((progs) => setProgress(progs));
  // };

  // useEffect(() => {
  //   const timer = setTimeout(() => setIsLoading(false), 2000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [isLoading]);

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
              onChange={(e) => setFilter("searchPhrase", e.target.value)}
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
                      {value?.delivery_day ?? "--------"}
                    </Text>,
                    <SubscriptionBadge
                      type={
                        (value?.subscription?.plan?.slug as any) ??
                        "no_subscription"
                      }
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
