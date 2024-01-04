import { Box, BoxProps, HStack, Stack, Text } from "@chakra-ui/react";
import { navigate } from "@reach/router";
import {
  APaginator,
  GenericTable,
  GenericTableItem,
  Gravatar,
  Icon,
  Input,
} from "components";
import configs from "config";
import { formatDistanceToNow, parseISO } from "date-fns";
import usePageFilters from "hooks/usePageFilters";
import useReferrals from "hooks/useReferrals";
import { PromoRo, UserRo } from "interfaces";
import { join } from "lodash";
import { useMemo } from "react";
import { currencyFormat, when } from "utils";

interface Props extends BoxProps {
  customer?: string;
}

export function UsersSubscribed(props: Props) {
  const { customer } = props;
  const { state, onPageChange, setFilter } = usePageFilters({
    page: 1,
    limit: 10,
  });
  const { data, isLoading } = useReferrals({
    ...state,
    customer,
    subscribed: true,
  });
  const customers = useMemo(() => data?.data ?? [], [data]);

  const hasCustomers = useMemo(() => (customers ?? []).length > 0, [customers]);

  return (
    <Stack my="20px">
      <HStack mb="20px !important">
        <Input
          // w="100%"
          minH="48px"
          minW="340px"
          maxW="400px"
          placeholder="Filter referrals by influencer's refcode"
          value={state?.ref_code ?? ""}
          endAdornment={<Icon type="search" />}
          onChange={(e) => {
            e.preventDefault();
            setFilter("ref_code", e.target.value);
          }}
        />
      </HStack>

      <Box
        borderRadius="8px"
        overflow="hidden"
        shadow="0px 2px 12px rgba(0, 0, 0, 0.05)"
      >
        <GenericTable
          isLoading={isLoading}
          headers={[
            "Customer",
            "Referred By",
            "City",
            "RefCode",
            "Delivery Day",
            "Reward",
          ]}
        >
          {hasCustomers &&
            customers?.map((value) => {
              const promo = value?.promo as PromoRo;
              const inviter =
                value?.inviter ??
                promo?.influencer ??
                when(
                  typeof promo?.influencer?.customer === "object",
                  promo?.influencer?.customer as UserRo,
                  undefined
                );

              return (
                <GenericTableItem
                  isClickable={false}
                  key={`customer-table-item:${value?._id}`}
                  //   onClick={() => navigate(`${configs.paths.users}/${value?._id}`)}
                  cols={[
                    <Gravatar
                      src={value?.invitee?.profilePhotoUrl}
                      title={join(
                        [value?.invitee?.first_name, value?.invitee?.last_name],
                        " "
                      )}
                      createdAt={value?.invitee?.createdAt}
                      subtitle={
                        !value?.invitee?.createdAt
                          ? undefined
                          : `${formatDistanceToNow(
                              parseISO(value?.invitee?.createdAt!)
                            )} ago`
                      }
                      onClick={() =>
                        navigate(
                          `${configs.paths.users}/${value?.invitee?._id}`
                        )
                      }
                    />,
                    <Gravatar
                      src={inviter?.profilePhotoUrl}
                      title={join(
                        [inviter?.first_name, inviter?.last_name],
                        " "
                      )}
                      createdAt={value?.inviter?.createdAt}
                      subtitle={when(!!promo, "Influencer", "")}
                      onClick={() => {
                        if (!!promo)
                          navigate(`${configs.paths.promos}/${promo?._id}`);
                        else if (
                          !!value?.inviter ||
                          !!(promo as any)?.influencer?.customer
                        )
                          navigate(`${configs.paths.users}/${inviter?._id}`);
                      }}
                    />,
                    <Text fontSize="14px" textTransform="capitalize">
                      {value?.invitee?.address?.city ?? "--------------"}
                    </Text>,
                    <Text fontSize="14px" textTransform="capitalize">
                      {value?.ref_code ?? "------------"}
                    </Text>,
                    //   <SubscriptionBadge
                    //     type={
                    //       (value?.subscription_plan?.slug as any) ??
                    //       "no_subscription"
                    //     }
                    //   />,
                    <Text fontSize="14px" textTransform="capitalize">
                      {value?.invitee?.delivery_day ?? "--------------"}
                    </Text>,

                    <Text fontSize="14px" textTransform="capitalize">
                      {currencyFormat((value?.currency as any) ?? "gbp").format(
                        value?.reward ?? 0
                      )}
                    </Text>,
                  ]}
                />
              );
            })}
        </GenericTable>
      </Box>

      <Box>
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
    </Stack>
  );
}
