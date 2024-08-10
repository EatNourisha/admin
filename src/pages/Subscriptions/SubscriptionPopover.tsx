import {
  Button,
  FocusLock,
  HStack,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { SubscriptionRo, UserRo } from "interfaces";
import { useRef, useState } from "react";
import { put } from "utils";
import { Icon } from "@iconify/react";

export default ({ sub }: { sub: SubscriptionRo }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleUpdateSubscription = async () => {
    setLoading(true);
    try {
      await put(
        `/subscriptions/active/${(sub.customer as UserRo)._id}/?status=${
          sub.status === "active" ? "cancel" : "active"
        }`,
        {}
      );
      onClose();

      toast({
        position: "bottom-right",
        title: "Success",
        description: "Suscription updated successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      window.location.reload();
    } catch (error) {
      toast({
        position: "bottom-right",
        title: "Error",
        description: "Error updated successfully",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <HStack>
      <Popover
        isOpen={isOpen}
        initialFocusRef={firstFieldRef}
        onOpen={onOpen}
        onClose={onClose}
        placement="left"
        closeOnBlur={true}
      >
        <PopoverTrigger>
          <HStack gap="5px">
            <Icon icon="cil:options" />
            <Text textAlign="center" className="text-primary text-center">
              {sub.status === "incomplete_expired" ? "Incomplete":sub.status}
            </Text>
          </HStack>
        </PopoverTrigger>
        <PopoverContent p={0}>
          <FocusLock persistentFocus={false}>
            <PopoverArrow />
            <PopoverCloseButton />

            {sub.status !== ("active" || "incomplete_expired") && (
              <Button
                mt="0 !important"
                w="80%"
                isLoading={loading}
                disabled={loading}
                type="submit"
                variant="error"
                onClick={handleUpdateSubscription}
              >
                Activate
              </Button>
            )}

            {sub.status !== "cancelled" && (
              <Button
                mt="0 !important"
                w="80%"
                isLoading={loading}
                disabled={loading}
                type="submit"
                variant="error"
                onClick={handleUpdateSubscription}
              >
                Cancel
              </Button>
            )}
          </FocusLock>
        </PopoverContent>
      </Popover>
    </HStack>
  );
};
