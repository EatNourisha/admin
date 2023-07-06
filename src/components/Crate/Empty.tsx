import { BoxProps, Image, Text, VStack } from "@chakra-ui/react";

import Empty from "assets/images/folder.png";

interface EmptyCrateProps extends BoxProps {
  description?: string;
}

export function EmptyCrate(props: EmptyCrateProps) {
  const { description, ...xprops } = props;

  return (
    <VStack maxW="200px" mx="auto" my="180px" {...xprops}>
      <Image src={Empty} alt="empty list" boxSize="150px" />
      <Text textAlign="center" fontSize="14px">
        {description ?? "Sorry, it looks like you have nothing here yet"}
      </Text>
    </VStack>
  );
}
