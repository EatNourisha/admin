import { Box, HStack, Skeleton, Text } from "@chakra-ui/react";
import CircleIcon from "components/Icon/CircleIcon";
import { useMemo } from "react";

interface TotalFeatureCountProps {
  type: "meals" | "users" | "subscriptions";
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
      meals: { bg: "brand.primary", shadow: "0 10px 20px transparent" },
      users: { bg: "brand.lemonGreen", shadow: "0 10px 20px transparent" },
      subscriptions: {
        bg: "brand.lightBlue",
        shadow: "0 10px 20px transparent",
      },
    };

    return map[type];
  }, [type]);

  return (
    <Box
      p={{ base: "16px", md: "20px" }}
      border="1px solid transparent"
      borderColor="brand.neutral"
      borderRadius="8px"
      minW="167px"
    >
      <HStack>
        <CircleIcon
          type={type as any}
          size={{ base: "md", lg: "lg" }}
          flexShrink={{ base: 0, lg: 1 }}
          bg={iconColor.bg}
          shadow={iconColor.shadow}
          _icon={{
            w: { base: "16px", md: "20px", lg: "32px" },
            h: { base: "16px", md: "20px", lg: "32px" },
          }}
        />

        <Box ml="8px !important">
          <Skeleton
            isLoaded={!isLoading}
            borderRadius="12px"
            h={isLoading ? "16px" : "initial"}
          >
            <Text
              fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
              fontWeight="800"
              color="brand.black"
            >
              {value}
            </Text>
          </Skeleton>
          <Skeleton
            isLoaded={!isLoading}
            borderRadius="12px"
            h={isLoading ? "14px" : "initial"}
            mt={isLoading ? "8px" : "initial"}
          >
            <Text fontSize={{ base: "sm", md: "md" }} fontWeight="400">
              {label}
            </Text>
          </Skeleton>
        </Box>
      </HStack>
    </Box>
  );
}
