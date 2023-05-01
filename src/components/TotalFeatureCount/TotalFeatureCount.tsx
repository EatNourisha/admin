import { Box, HStack, Skeleton, Text } from "@chakra-ui/react";
import CircleIcon from "components/Icon/CircleIcon";
import { useMemo } from "react";

interface TotalFeatureCountProps {
  type: "appointments" | "patients" | "doctors";
  value: number;
  label: string;
  isLoading?: boolean;
}

export default function TotalFeatureCount(props: TotalFeatureCountProps) {
  const { type, value, label, isLoading } = props;

  const iconColor = useMemo(() => {
    const map: Record<
      TotalFeatureCountProps["type"],
      { bg: string; shadow: string }
    > = {
      appointments: { bg: "brand.lightGreen", shadow: "0 10px 20px #03CCAA4f" },
      patients: { bg: "brand.red", shadow: "0 10px 20px #E5432E4f" },
      doctors: { bg: "brand.lightBlue", shadow: "0 10px 20px #0066F54f" },
    };

    return map[type];
  }, [type]);

  return (
    <Box
      p="40px 34px"
      border="1px solid transparent"
      borderColor="brand.neutral"
      borderRadius="24px"
      minW="252px"
    >
      <HStack>
        <CircleIcon
          type={type as any}
          size="lg"
          bg={iconColor.bg}
          shadow={iconColor.shadow}
        />

        <Box ml="8px !important">
          <Skeleton
            isLoaded={!isLoading ?? true}
            borderRadius="12px"
            h={isLoading ? "16px" : "initial"}
          >
            <Text fontSize="3xl" fontWeight="800" color="brand.black">
              {value}
            </Text>
          </Skeleton>
          <Skeleton
            isLoaded={!isLoading ?? true}
            borderRadius="12px"
            h={isLoading ? "14px" : "initial"}
            mt={isLoading ? "8px" : "initial"}
          >
            <Text fontSize="md" fontWeight="400">
              {label}
            </Text>
          </Skeleton>
        </Box>
      </HStack>
    </Box>
  );
}