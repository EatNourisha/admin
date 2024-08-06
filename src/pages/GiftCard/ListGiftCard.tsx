import { useCallback, useMemo, useState } from "react";
import { Box, Button, HStack, Text, useToast } from "@chakra-ui/react";
import {
  APaginator,
  GenericTable,
  GenericTableItem,
  Icon,
  Input,
  MainLayoutContainer,
  PageMotion,
  Topbar,
} from "components";

import { navigate } from "@reach/router";
import configs from "config";
import { join, orderBy } from "lodash";
import usePageFilters from "hooks/usePageFilters";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { useExport } from "hooks/useExports";
import { when } from "utils";
import { UserRo } from "interfaces";
import useUserMutations from "hooks/useUserMutations";
import useGiftCard from "hooks/useGiftCards";

export default function GiftCards() {
  const toast = useToast();
  // const [isLoading, setIsLoading] = useState(true);
  const { state, filter, setFilter, onPageChange } = usePageFilters({
    limit: 10,
    page: 1,
  });

  const [progress /*, setProgress*/] = useState(0);

  const { data, isLoading } = useGiftCard({
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



  return (
    <PageMotion key="users-root" pb="100px">
      <Topbar
        pageTitle="Gift Cards"
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
              placeholder="Search gift cards"
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
              onClick={()=> navigate("/gift_cards/add")}
              isLoading={isSyncing}
              isDisabled={isSyncing}
            >
              Add Gift card
            </Button>
          </HStack>
          <Box
            borderRadius="8px"
            overflow="hidden"
            shadow="0px 2px 12px rgba(0, 0, 0, 0.05)"
          >
            <GenericTable
              isLoading={isLoading}
              headers={["Name", "Amount", "Subscription Interval", "Action"]}
            >
              {customers?.map((value) => (
                <GenericTableItem
                  isClickable={false}
                  key={`customer-table-item:${value?._id}`}
                  onClick={() =>
                    navigate(`${configs.paths.users}/${value?._id}`)
                  }
                  cols={[
                    <Text fontSize="14px">{value?.name}</Text>,
                    <Text fontSize="14px">{value?.amount}</Text>,
                    <Text fontSize="14px" textTransform="capitalize">
                      {value.subscription_interval}
                    </Text>,

                    <HStack>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>

                      <Button size="sm" variant="ghost">
                        Delete
                      </Button>
                    </HStack>,
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
