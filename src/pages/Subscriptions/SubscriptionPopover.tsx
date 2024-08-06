import { HStack, Popover, Text } from "@chakra-ui/react";
import { SubscriptionRo } from "interfaces";

export default ({ sub }: { sub: SubscriptionRo }) => {
  return (
    <HStack>
      <Text>{sub?.status?.toUpperCase()}</Text>
      <Popover >
        text
      </Popover>
    </HStack>
  );
};
