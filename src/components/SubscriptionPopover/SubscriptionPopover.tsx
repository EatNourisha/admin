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
import { Icon as Iconify } from "@iconify/react";
import { SubscriptionRo, UserRo } from "interfaces";
import { useRef, useState } from "react";
import { put } from "utils/makeRequest";

function SubscriptionPopover({
  subscription,
}: {
  subscription: SubscriptionRo;
}) {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleUpdateSubscription = async () => {
    setLoading(true);
    try {
      await put(
        `/subscriptions/active/${
          (subscription.customer as UserRo)._id
        }/?status=${subscription.status === "active" ? "cancel" : "active"}`,
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
          <Iconify icon="cil:options" />
        </HStack>
      </PopoverTrigger>
      <PopoverContent p={0}>
        <FocusLock persistentFocus={false}>
          <PopoverArrow />
          <PopoverCloseButton />
          {/* <Text  textAlign="center" className="text-primary text-center">Current status:{subscription.status}</Text> */}

          {subscription.status !==( "active"||"incomplete_expired") 
             && (
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

          {subscription.status !== "cancelled" && (
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
  );
}

export default SubscriptionPopover;
