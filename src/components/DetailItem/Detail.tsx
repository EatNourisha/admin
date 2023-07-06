import { Box, HStack, Skeleton, Text, TextProps } from "@chakra-ui/react";
import { ReactNode } from "react";

interface DetailProps {
  title: string;
  description?: ReactNode;
  isLoading?: boolean;
  _desc?: TextProps;
}

export function Detail(props: DetailProps) {
  const { title, description, isLoading, _desc } = props;

  return (
    <Box
      w="100%"
      h="fit-content"
      p="24px 22px"
      borderRadius="8px"
      shadow="0px 6px 40px rgba(0, 0, 0, 0.05)"
    >
      <HStack color="brand.black">
        {/* <Icon type="phone" /> */}
        <Text fontSize="md" fontWeight="400" color="brand.greyText">
          {title}
        </Text>
      </HStack>

      <Skeleton
        isLoaded={!isLoading ?? true}
        w="fit-content"
        h={isLoading ? "20px" : "fit-content"}
        borderRadius="12px"
        mt="8px"
        {..._desc}
      >
        <Text fontSize="18px" textTransform="capitalize">
          {description ?? "--------"}
        </Text>
      </Skeleton>
    </Box>
  );
}
