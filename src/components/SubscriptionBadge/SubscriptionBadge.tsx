import { useMemo } from "react";
import { Badge, BadgeProps } from "@chakra-ui/react";

interface SubscriptionBadgeProps extends BadgeProps {
  type: "doctor" | "therapist" | "free";
}

type DetailsMapType = Record<
  SubscriptionBadgeProps["type"],
  { label: string; color: string }
>;

export default function SubscriptionBadge(props: SubscriptionBadgeProps) {
  const { type } = props;

  const details = useMemo(() => {
    const map: DetailsMapType = {
      doctor: {
        label: "Doctor's Plan",
        color: "brand.purple",
      },
      therapist: {
        label: "Therapist's Plan",
        color: "brand.lightBlue",
      },
      free: {
        label: "Free trial",
        color: "brand.neutral700",
      },
    };

    return map[type];
  }, [type]);

  return (
    <Badge
      p="8px 12px"
      borderRadius="24px"
      fontSize="14px"
      fontWeight="600"
      textTransform="capitalize"
      bg="transparent"
      border="2px solid transparent"
      borderColor={details.color}
      color={details.color}
    >
      {details.label}
    </Badge>
  );
}
