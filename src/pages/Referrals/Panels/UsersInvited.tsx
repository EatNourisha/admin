import { Box, BoxProps, Stack, Text } from "@chakra-ui/react";
import { navigate } from "@reach/router";
import {
  APaginator,
  GenericTable,
  GenericTableItem,
  Gravatar,
} from "components";
import configs from "config";
import { formatDistanceToNow, parseISO } from "date-fns";
import usePageFilters from "hooks/usePageFilters";
import useReferrals from "hooks/useReferrals";
import { PromoRo, UserRo } from "interfaces";
import { join } from "lodash";
import { useMemo } from "react";
import { when } from "utils";

interface Props extends BoxProps {
  customer?: string;
}

export function UsersInvited(props: Props) {
  const { customer } = props;

  console.log("Users Invited", customer);

  const { filter, onPageChange } = usePageFilters({ page: 1, limit: 10 });
  const { data, isLoading } = useReferrals({ ...filter, customer });
  const customers = useMemo(() => data?.data ?? [], [data]);

  const hasCustomers = useMemo(() => (customers ?? []).length > 0, [customers]);

  return (
    <Stack my="20px">
      <Box
        borderRadius="8px"
        overflow="hidden"
        shadow="0px 2px 12px rgba(0, 0, 0, 0.05)"
      >
        <GenericTable
          isLoading={isLoading}
          headers={[
            "Customer",
            "Referred by",
            "City",
            "Ref / Promo Code",
            "Delivery Day",
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
                        if (!value?.inviter || !promo?.influencer?.customer)
                          return;
                        navigate(`${configs.paths.users}/${inviter?._id}`);
                      }}
                    />,
                    <Text fontSize="14px" textTransform="capitalize">
                      {value?.invitee?.address?.city ?? "--------------"}
                    </Text>,
                    <Text fontSize="14px" textTransform="capitalize">
                      {value?.ref_code ?? "--------------"}
                    </Text>,
                    <Text fontSize="14px" textTransform="capitalize">
                      {value?.invitee?.delivery_day ?? "--------------"}
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
            limit={10}
            page={1}
            onPageChange={onPageChange}
          />
        )}
      </Box>
    </Stack>
  );
}
