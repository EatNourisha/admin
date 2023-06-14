import { useMemo } from "react";
import { Badge, BadgeProps } from "@chakra-ui/react";
import { when } from "utils";
import { capitalize } from "lodash";

const known_consulation_types = [
  "doctor",
  "therapist",
  "fitness_coach",
] as const;
interface ConsultationBadgeProps extends BadgeProps {
  type: (typeof known_consulation_types)[number] | "default";
}

type DetailsMapType = Record<
  ConsultationBadgeProps["type"],
  { label: string; bg: string; color: string }
>;

export default function ConsultationBadge(props: ConsultationBadgeProps) {
  const { type } = props;

  console.log("Consultation Type", type);

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
      default: {
        bg: "#F2EFFF",
        label: capitalize(type),
        color: "brand.purple",
      },
      fitness_coach: {
        bg: "#effff6",
        label: "Fitness Coach",
        color: "brand.lemonGreen",
      },
    };

    const _type = when(
      !known_consulation_types.includes(type as any),
      "default",
      type
    );

    return (map as any)[_type];
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
