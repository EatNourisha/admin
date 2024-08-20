import { useMemo, useState } from "react";
import { Box, Button, HStack, Text, useToast } from "@chakra-ui/react";
import {
  APaginator,
  ConfirmationModal,
  GenericTable,
  GenericTableItem,
  Icon,
  Input,
  MainLayoutContainer,
  PageMotion,
  Topbar,
} from "components";

import { navigate } from "@reach/router";
import { orderBy } from "lodash";
import usePageFilters from "hooks/usePageFilters";
import { useExport } from "hooks/useExports";
import useUserMutations from "hooks/useUserMutations";
import useGiftCard from "hooks/useGiftCards";
import { destroy } from "utils";

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

  const { isLoading: isSyncing } = useUserMutations();

  const { isDownloading, isLoading: isExporting } =
    useExport();

  const giftCards = useMemo(
    () => orderBy(data?.data ?? [], ["createdAt"], ["desc"]),
    [data]
  );

  const hasCustomers = useMemo(() => (giftCards ?? []).length > 0, [giftCards]);

  const [deleteGiftCard, setDeleteGiftCard] = useState({
    id: "",
    show: false,
    loading: false,
  });

  const handleDeleteGiftCard = async () => {
    setDeleteGiftCard({ ...deleteGiftCard, loading: true });
    const res = await destroy(`/gift/custom/${deleteGiftCard.id}`);
    setDeleteGiftCard({ show:false,id:"", loading: false });
  };

  return (
    <PageMotion key="users-root" pb="100px">
      <Topbar
        pageTitle="Gift Cards"
        isDownloading={isDownloading || isExporting}
        progressValue={progress}
      />
      <ConfirmationModal
        isOpen={deleteGiftCard.show}
        onClose={() => setDeleteGiftCard({ show: false, id: "", loading:false })}
        title="Confirm deletion"
        description="Are you sure you want to proceed?"
        onConfirm={handleDeleteGiftCard}
        buttonText={["Continue"]}
        isLoading={deleteGiftCard.loading}
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
              onClick={() => navigate("/gift_cards/add")}
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
              {giftCards?.map((value) => (
                <GenericTableItem
                  isClickable={false}
                  key={`customer-table-item:${value?._id}`}
                  cols={[
                    <Text fontSize="14px">{value?.name}</Text>,
                    <Text fontSize="14px">{value?.amount}</Text>,
                    <Text fontSize="14px" textTransform="capitalize">
                      {value.subscription_interval}
                    </Text>,

                    <HStack>
                      <Button
                        onClick={() =>
                          navigate(`gift_cards/edit/${value?._id}`)
                        }
                        size="sm"
                        variant="outline"
                      >
                        Edit
                      </Button>

                      <Button
                        onClick={() =>
                          setDeleteGiftCard({
                            show: true,
                            id: value?._id,
                            loading: false,
                          })
                        }
                        size="sm"
                        variant="ghost"
                      >
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
