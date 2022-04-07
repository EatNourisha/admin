import { useMemo } from "react";
import { Badge, BadgeProps } from "@chakra-ui/react";

interface ConsultationBadgeProps extends BadgeProps {
  type: "doctor" | "therapist";
}

type DetailsMapType = Record<
  ConsultationBadgeProps["type"],
  { label: string; bg: string; color: string }
>;

export default function ConsultationBadge(props: ConsultationBadgeProps) {
  const { type } = props;

  const details = useMemo(() => {
    const map: DetailsMapType = {
      doctor: {
        bg: "#F2EFFF",
        label: "Doctor",
        color: "brand.purple",
      },
      therapist: {
        bg: "#E5F0FE",
        label: "Therapist",
        color: "brand.lightBlue",
      },
    };

    return map[type];
  }, [type]);

  return (
    <Badge
      p="8px 12px"
      borderRadius="24px"
      fontSize="14px"
      fontWeight="400"
      textTransform="capitalize"
      bg={details.bg}
      color={details.color}
    >
      {details.label}
    </Badge>
  );
}
