import {
  Button,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { navigate } from "@reach/router";
import { GenericTableItem } from "components/GenericTable/GenericTable";
import Gravatar from "components/Gravatar/Gravatar";
import configs from "config";
import { UserRo } from "interfaces";
import { join } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import { ILineUpItem } from "types";
import { get } from "utils";
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
  const [user, setUser] = useState<{ data: UserRo; loading: boolean }>({
    data: {} as UserRo,
    loading: true,
  });
  const { customer, delivery_date, status, isReturningCustomer } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const getUser = async () => {
    const data = await get(`customers/${customer}`);
    //@ts-ignore
    setUser({ loading: false, data: data?.data });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <GenericTableItem
        cols={[
          <Gravatar
            title={join([user?.data?.first_name, user?.data?.last_name], " ")}
            IsReturningCustomer={isReturningCustomer}
            onClick={() =>
              navigate(`${configs.paths.users}/${user?.data?._id ?? ""}`)
            }
          />,
          <Text textTransform="capitalize">{status}</Text>,
          <Text textTransform="capitalize">
            {user?.data?.address?.city ?? "------------"}
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

      {!!user?.data && (
        <LineupDetailModal
          {...props}
          lineupData={props}
          user={user.data}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  );
}
