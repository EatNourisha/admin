import { Button, Text, useDisclosure } from "@chakra-ui/react";
import { navigate } from "@reach/router";
import { GenericTableItem } from "components/GenericTable/GenericTable";
import Gravatar from "components/Gravatar/Gravatar";
import LineupDetailModal from "components/Modals/LineupDetails";
import LineupStatus from "components/Status/LineupStatus";
import SubscriptionBadge from "components/SubscriptionBadge/SubscriptionBadge";
import configs from "config";
import { PlanRo, SubscriptionRo, UserRo } from "interfaces";
import { join } from "lodash";

interface WeeklyMealLineUpProps {
  data: SubscriptionRo[];
  isLoading?: boolean;
}

export function WeeklyMealLineUp(props: WeeklyMealLineUpProps) {
  const { data } = props;

  return (
    <>
      {(data ?? []).map((sub) => (
        <Item {...sub} />
      ))}
    </>
  );
}

interface ItemProps extends SubscriptionRo {}

function Item(props: ItemProps) {
  const { customer, plan: _plan } = props;
  const user = customer as UserRo;
  const plan = _plan as PlanRo;

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <GenericTableItem
        cols={[
          <Gravatar
            title={join([user?.first_name, user?.last_name], " ")}
            onClick={() =>
              navigate(`${configs.paths.users}/${user?._id ?? ""}`)
            }
          />,
          <LineupStatus has_lineup={!!user?.lineup} />,
          <Text textTransform="capitalize">
            {user?.address?.city ?? "------------"}
          </Text>,
          <Text textTransform="capitalize">
            {user?.delivery_day ?? "------------"}
          </Text>,
          <SubscriptionBadge type={(plan?.slug as any) ?? "no_subscription"} />,
          <Button
            size="sm"
            variant="outline"
            disabled={!user?.lineup}
            onClick={onOpen}
          >
            View Lineup
          </Button>,
        ]}
      />

      {!!user?.lineup && (
        <LineupDetailModal user={user} isOpen={isOpen} onClose={onClose} />
      )}
    </>
  );
}
