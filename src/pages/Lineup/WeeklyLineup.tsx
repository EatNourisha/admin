import { Button, Text, useDisclosure } from "@chakra-ui/react";
import { navigate } from "@reach/router";
import { GenericTableItem } from "components/GenericTable/GenericTable";
import Gravatar from "components/Gravatar/Gravatar";
import configs from "config";
import { join } from "lodash";
import moment from "moment";
import { ILineUpItem } from "types";
import LineupDetailModal from "./LineupDetailModal";

interface WeeklyMealLineUpProps {
  data: ILineUpItem[];
  isLoading?: boolean;
}

export function WeeklyMealLineUp(props: WeeklyMealLineUpProps) {
  const { data } = props;

  return (
    <>
      {(data ?? []).map((sub, i) => (
        <Item key={i} {...sub} />
      ))}
    </>
  );
}

interface ItemProps extends ILineUpItem {}

function Item(props: ItemProps) {
  const { customer, delivery_date, status, isReturningCustomer, platform } =
    props;

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <GenericTableItem
        cols={[
          <Gravatar
            title={join([customer?.first_name, customer?.last_name], " ")}
            IsReturningCustomer={isReturningCustomer}
            onClick={() =>
              navigate(`${configs.paths.users}/${customer?._id ?? ""}`)
            }
          />,
          <Text textTransform="capitalize">{platform ?? "---"}</Text>,
          <Text textTransform="capitalize">{status}</Text>,
          <Text textTransform="capitalize">
            {customer?.address?.city ?? "------------"}
          </Text>,
          <Text textTransform="capitalize">
            {moment(delivery_date).format("DD/MM/YYYY")}
          </Text>,

          <Button
            size="sm"
            variant="outline"
            // isDisabled={!user?.lineup}
            onClick={onOpen}
          >
            View Lineup
          </Button>,
        ]}
      />

      {!!customer && (
        <LineupDetailModal
          {...props}
          lineupData={props}
          user={customer}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  );
}
