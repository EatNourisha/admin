import { Badge, BadgeProps } from "@chakra-ui/react";
import { OrderStatus } from "interfaces";
import { capitalize } from "lodash";
import { useCallback, useMemo } from "react";
import { when } from "utils";

interface OrderStatusBadgeProps extends BadgeProps {
  type: OrderStatus;
}

type DetailsMapType = Record<
  OrderStatusBadgeProps["type"] | "default",
  { label: string; color: string; bg: string }
>;

export function OrderStatusBadge(props: OrderStatusBadgeProps) {
  const { type } = props;

  const { info: details } = useOrderStatus(type);

  return (
    <Badge
      p="4px 6px"
      borderRadius="24px"
      fontSize="12px"
      fontWeight="600"
      textTransform="capitalize"
      bg={details.bg}
      border="2px solid transparent"
      borderColor="transparent"
      color={details.color}
    >
      {details.label}
    </Badge>
  );
}

export function useOrderStatus(name: OrderStatus) {
  const map: DetailsMapType = useMemo(
    () => ({
      processing: {
        bg: "#e2dcef",
        label: "Unpaid",
        color: "#57319b",
      },
      payment_received: {
        bg: "#c4ceff",
        label: "Paid",
        color: "#0c38ff",
      },
      received: {
        bg: "#E6F7E4",
        label: "Delivered",
        color: "brand.green",
      },
      cancelled: {
        bg: "#eab9b8",
        label: "Cancelled",
        color: "#da140f",
      },
      accepted: {
        bg: "#fce4cc",
        label: "Preparing",
        color: "brand.primary",
      },
      default: {
        bg: "#ECEFFE",
        label: capitalize(name),
        color: "brand.neutral700",
      },
      confirming: {
        bg: "transparent",
        label: "Confirming Payment",
        color: "brand.red",
      },
      dispatched: {
        bg: "#E6F7E4",
        label: "Dispatched",
        color: "brand.green",
      },
    }),
    [name]
  );

  const getStatusInfo = useCallback(
    (name: OrderStatus) => {
      const _type = when(
        !Object.values(OrderStatus).includes(name),
        OrderStatus.DEFAULT,
        name
      );

      return map[_type];
    },
    [map]
  );

  const info = useMemo(() => getStatusInfo(name), [getStatusInfo, name]);

  return { info, getStatusInfo };
}
