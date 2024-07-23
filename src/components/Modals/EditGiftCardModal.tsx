import {
    Modal,
    ModalProps,
    ModalContentProps,
    ModalBodyProps,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    Heading,
    Button,
    ModalHeader,
    Stack,
    FormControl,
    useToast,
  } from "@chakra-ui/react";
  import { post,put } from "utils/makeRequest";
  import Input from "components/Input/Input";
  import { ApiResponse,  } from "interfaces";
  import { FormEvent, useState } from "react";
  import { when } from "utils";
import { IGiftCard } from "pages/GiftCards/ListGiftCards";
  
  interface AddMealModalProps extends Omit<ModalProps, "children" | "id"> {
    // Mutation keys
    keys?: string[];
    giftCard?: IGiftCard;
    _content?: ModalContentProps;
    _body?: ModalBodyProps;
    setGiftCards: (extras: IGiftCard[]) => void;
    giftCards: IGiftCard[];
  }
  
  export default function EditGiftCard(props: AddMealModalProps) {
    const {
      isOpen,
      onClose,
      giftCard,
      giftCards,
      setGiftCards,
      keys,
      _content,
      _body,
      ...xprops
    } = props;
    const [name, setName] = useState(giftCard?._id ? giftCard.name : "");
    const [loading, setLoading] = useState(false);
    const toast = useToast();
  
    const handleSubmit = async (e: FormEvent<HTMLDivElement>) => {
      e.preventDefault();
      setLoading(true);
      const res = (
        await  (giftCard?._id?put:post)<ApiResponse<any>, {}>(
          giftCard?._id ? `/gift/${giftCard?._id}` : `/meals/extras`,
          { name }
        )
      ).data as any;
  
      if (res?._id) {
        setGiftCards(
          giftCard?._id
            ? giftCards.map((extra) => {
                if (extra?._id === res?._id) {
                  extra = {
                    ...extra,
                    name
                  };
                }
                return extra;
              })
            : [res, ...giftCards]
        );
  
        toast({
          position: "bottom-right",
          title: "Success",
          description: "Gift card created successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
  
        onClose();
      }
      setLoading(false);
    };
  
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isCentered
        {...xprops}
      >
        <ModalOverlay />
        <ModalContent
          bg="white"
          p="38px"
          borderRadius="8px"
          minW="608px"
          w="100%"
        >
          <ModalHeader>
            <Heading fontSize="24px" fontWeight="600">
              {when(!!giftCard?._id, "Edit", "Add")} Gift card
            </Heading>
          </ModalHeader>
          <ModalCloseButton
            top="60px"
            right="64px"
            size="2xl"
            disabled={loading}
            _focus={{ shadow: `0 0 0 3px var(--focusColor)` }}
          />
          <ModalBody px="24px" overflowY="scroll">
            <Stack as="form" onSubmit={handleSubmit}>
              <FormControl mt="16px !important">
                <Input
                  placeholder="Enter Gift card name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <Button
                disabled={!name?.length}
                isLoading={loading}
                mr={3}
                mt={10}
                minH="48px"
                type="submit"
              >
                Save {when(!!giftCard?._id, "Changes", "Gift card")}
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  