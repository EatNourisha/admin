import { useMemo } from "react";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import {
  APaginator,
  GenericTable,
  GenericTableItem,
  MainLayoutContainer,
  PageMotion,
  Topbar,
  Gravatar,
  Icon,
} from "components";

import { navigate, useLocation } from "@reach/router";
import configs from "config";
import { join, omit, orderBy } from "lodash";
import usePageFilters from "hooks/usePageFilters";
import { currencyFormat, when } from "utils";
import usePromos from "hooks/usePromos";
import { CouponRo, UserRo } from "interfaces";

export default function Promos() {
  // const [isLoading, setIsLoading] = useState(true);
  const { state, filter, onPageChange } = usePageFilters({
    limit: 20,
    page: 1,
  });

  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const { data, isLoading } = usePromos({
    ...omit(state, ["searchPhrase"]),
    searchPhrase: filter?.searchPhrase,
    customer: params.get("customer") ?? undefined,
  });

  console.log("Orders", data);

  const promos = useMemo(
    () => orderBy(data?.data ?? [], ["createdAt"], ["desc"]),
    [data]
  );
  const hasPromos = useMemo(() => (promos ?? []).length > 0, [promos]);

  return (
    <PageMotion key="promos-root" pb="100px">
      <Topbar pageTitle="Promotion Codes" />
      <MainLayoutContainer>
        <Box>
          <HStack as="form" justifyContent="space-between" w="100%" mb="24px">
            {/* <Input
              // w="100%"
              minH="48px"
              minW="340px"
              maxW="400px"
              placeholder="Search Plans"
              value={state?.searchPhrase ?? ""}
              endAdornment={<Icon type="search" />}
              onChange={(e) => setFilter("searchPhrase", e.target.value)}
            /> */}

            <Button
              ml="0 !important"
              leftIcon={<Icon type="add" />}
              onClick={() => navigate(`/promos/create`)}
            >
              Create Promo Code
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
                "Influencer",
                "Code",
                "Percent Off",
                "Amount Off",
                "Currency",
                "Status",
                "Action",
              ]}
            >
              {hasPromos
                ? promos?.map((promo) => {
                    const inf =
                      promo?.influencer ??
                      when(
                        typeof promo?.influencer?.customer === "object",
                        promo?.influencer?.customer as UserRo,
                        undefined
                      );

                    const coup = promo?.coupon as CouponRo;

                    return (
                      <GenericTableItem
                        isClickable={false}
                        key={`promo-table-item:${promo?._id}`}
                        cols={[
                          <Gravatar
                            src={undefined}
                            title={join([inf?.first_name, inf?.last_name], " ")}
                            subtitle={when(
                              !!promo?.influencer?.customer,
                              "nourisha user",
                              "external"
                            )}
                          />,
                          <Text fontSize="14px" textTransform="uppercase">
                            {promo?.code ?? "--------"}
                          </Text>,
                          <Text fontSize="14px" textTransform="uppercase">
                            {`${coup?.percent_off ?? 0}%`}
                          </Text>,
                          <Text fontSize="14px" textTransform="uppercase">
                            {currencyFormat(
                              (coup?.currency as any) ?? "gbp"
                            ).format(+(coup?.amount_off ?? 0))}
                          </Text>,
                          <Text fontSize="14px" textTransform="uppercase">
                            {(coup?.currency as any) ?? "gbp"}
                          </Text>,
                          <Text fontSize="14px">
                            {when(!!promo?.active, "Active", "Inactive")}
                          </Text>,
                          //   <Text fontSize="14px" textTransform="uppercase">
                          //     {currencyFormat("gbp").format(order?.subtotal ?? 0)}
                          //   </Text>,
                          //   <Text fontSize="14px">
                          //     {currencyFormat("gbp").format(
                          //       order?.delivery_fee ?? 0
                          //     )}
                          //   </Text>,
                          //   <Text fontSize="14px" textTransform="capitalize">
                          //     {currencyFormat("gbp").format(order?.total ?? 0)}
                          //   </Text>,
                          //   <Text fontSize="14px" textTransform="capitalize">
                          //     <OrderStatusBadge type={order?.status} />
                          //   </Text>,
                          <HStack>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                navigate(
                                  `${configs.paths.promos}/${promo?._id}`
                                )
                              }
                            >
                              View more
                            </Button>
                          </HStack>,
                        ]}
                      />
                    );
                  })
                : null}
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

            {hasPromos && (
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
