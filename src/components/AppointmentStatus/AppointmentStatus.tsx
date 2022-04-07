import { useMemo } from "react";
import { Text, TextProps } from "@chakra-ui/layout";
import capitalize from "lodash/capitalize";

interface AppointmentStatusProps extends TextProps {
  status: "pending" | "completed" | "cancelled" | "queued";
}

type StatusColorMapType = Record<AppointmentStatusProps["status"], string>;

export default function AppointmentStatus(props: AppointmentStatusProps) {
  const { status } = props;

  const color = useMemo(() => {
    const map: StatusColorMapType = {
      pending: "brand.red",
      completed: "brand.lightGreen",
      cancelled: "brand.red",
      queued: "yellow",
    };

    return map[status];
  }, [status]);

  return (
    <Text fontSize="14px" fontWeight="400" color={color}>
      {capitalize(status)}
    </Text>
  );
}
