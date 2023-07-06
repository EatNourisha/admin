import { useMemo } from "react";
import { Text, TextProps } from "@chakra-ui/layout";
import capitalize from "lodash/capitalize";

interface LineupStatusProps extends TextProps {
  has_lineup: boolean;
}

export default function LineupStatus(props: LineupStatusProps) {
  const { has_lineup, ...xprops } = props;

  const info = useMemo(() => {
    const map: Record<string, { color: string; label: string }> = {
      true: { color: "brand.green", label: "Meal Selected" },
      false: { color: "brand.warning", label: "Pending" },
    };

    return map[String(has_lineup)];
  }, [has_lineup]);

  return (
    <Text fontSize="14px" fontWeight="400" color={info.color} {...xprops}>
      {capitalize(info.label)}
    </Text>
  );
}
