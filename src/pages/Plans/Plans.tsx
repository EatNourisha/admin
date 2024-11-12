import { useMemo } from "react";
import {
  Box,
  Button,
  HStack,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from "@chakra-ui/react";
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
import { omit, orderBy } from "lodash";
import usePageFilters from "hooks/usePageFilters";
import usePlans from "hooks/usePlans";
import { currencyFormat } from "utils";
import MobilePlansData from "./MobilePlansData";

export default function Plans() {
  // const [isLoading, setIsLoading] = useState(true);
  const { state, filter, setFilter, onPageChange } = usePageFilters({
    limit: 10,
    page: 1,
  });

  const { data, isLoading } = usePlans({
    ...omit(state, ["searchPhrase"]),
    searchPhrase: filter?.searchPhrase,
  });

  const plans = useMemo(
    () => orderBy(data?.data ?? [], ["createdAt"], ["desc"]),
    [data]
  );
  const hasPlans = useMemo(() => (plans ?? []).length > 0, [plans]);

  return (
    <PageMotion key="plans-root" pb="100px">
      <Topbar pageTitle="Plans" />
      <MainLayoutContainer>
        <Box>
          <Stack
            direction={{ base: "column", md: "row" }}
            as="form"
            justifyContent="space-between"
            w="100%"
            mb="24px"
          >
            <InputGroup
              display="block"
              w="100%"
              minH="48px"
              maxW={{ base: "100%", md: "400px" }}
            >
              <Input
                w="full"
                pr="40px"
                placeholder="Search Plans"
                value={state?.searchPhrase ?? ""}
                onChange={(e) => setFilter("searchPhrase", e.target.value)}
              />
              <InputRightElement top="4px">
                <Icon type="search" />
              </InputRightElement>
            </InputGroup>

            <Button
              w={{ base: "100%", md: "auto" }}
              ml="0 !important"
              leftIcon={<Icon type="add" />}
              onClick={() => navigate(configs.paths.addPlan)}
            >
              Add
            </Button>
          </Stack>
          <Box
            borderRadius="8px"
            overflow="hidden"
            shadow="0px 2px 12px rgba(0, 0, 0, 0.05)"
          >
            <GenericTable
              isLoading={isLoading}
              headers={[
                "Name",
                "Reference ID",
                "Currency",
                "Amount",
                "Interval",
                "Country",
                "Action",
              ]}
            >
              {hasPlans
                ? plans?.map((plan) => (
                    <GenericTableItem
                      isClickable={false}
                      key={`customer-table-item:${plan?._id}`}
                      cols={[
                        <Text fontSize="14px" textTransform="capitalize">
                          {plan?.name ?? "--------"}
                        </Text>,
                        <Text fontSize="14px">{plan?.product_id}</Text>,
                        <Text fontSize="14px" textTransform="uppercase">
                          {plan?.currency}
                        </Text>,
                        <Text fontSize="14px">
                          {currencyFormat(
                            (plan?.currency as any) ?? "gbp"
                          ).format(plan?.amount ?? 0)}
                        </Text>,
                        <Text fontSize="14px" textTransform="capitalize">
                          {plan?.subscription_interval}ly
                        </Text>,
                        <Text fontSize="14px" textTransform="capitalize">
                          {plan?.country ?? "--------"}
                        </Text>,
                        <HStack>
                          <Button
                            size="sm"
                            variant="transparent"
                            onClick={() =>
                              navigate(
                                `${configs.paths.plans}/${plan?._id}/assign`
                              )
                            }
                          >
                            Assign To
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              navigate(`${configs.paths.plans}/${plan?._id}`)
                            }
                          >
                            View More
                          </Button>
                        </HStack>,
                      ]}
                    />
                  ))
                : null}
            </GenericTable>
            <MobilePlansData data={plans} isLoading={isLoading} />
          </Box>

          <Box>
            {/* <PaginatorContainer>
              <Paginator
                {...pageData}
                onPrev={(prev) => onPrevPage(prev)}
                onNext={(next) => onNextPage(next)}
              />
              
            </PaginatorContainer> */}

            {hasPlans && (
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
      </MainLayoutContainer>
    </PageMotion>
  );
}
