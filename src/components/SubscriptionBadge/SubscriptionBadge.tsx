import { useMemo } from "react";
import { Badge, BadgeProps } from "@chakra-ui/react";
import { when } from "utils";
import capitalize from "lodash/capitalize";

const known_subscription_types = [
  "doctor",
  "therapist",
  "free",
  "individual",
  "family",
  "no_subscription",
] as const;
interface SubscriptionBadgeProps extends BadgeProps {
  type: (typeof known_subscription_types)[number];
}

type DetailsMapType = Record<
  SubscriptionBadgeProps["type"] | "default",
  { label: string; color: string; bg: string }
>;

export default function SubscriptionBadge(props: SubscriptionBadgeProps) {
  const { type } = props;

  const details = useMemo(() => {
    const map: DetailsMapType = {
      doctor: {
        bg: "#ECEFFE",
        label: "Doctor's Plan",
        color: "brand.primary400",
      },
      therapist: {
        bg: "#ECEFFE",
        label: "Therapist's Plan",
        color: "brand.lightBlue",
      },
      free: {
        bg: "#ECEFFE",
        label: "Individual",
        color: "brand.neutral700",
      },
      individual: {
        bg: "#ECEFFE",
        label: "Individual",
        color: "brand.primary400",
      },
      family: {
        bg: "#E6F7E4",
        label: "Family",
        color: "brand.green",
      },
      default: {
        bg: "#ECEFFE",
        label: capitalize(type),
        color: "brand.neutral700",
      },
      no_subscription: {
        bg: "transparent",
        label: "No Subscription",
        color: "brand.neutral700",
      },
    };

    const _type = when(
      !known_subscription_types.includes(type),
      "default",
      type
    );
    return map[_type];
  }, [type]);

  return (
    <Badge
      p="8px 12px"
      borderRadius="24px"
      fontSize="14px"
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
