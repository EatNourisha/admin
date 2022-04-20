import {
  Modal,
  ModalProps,
  ModalContentProps,
  ModalBodyProps,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";

interface ConfirmationModalProps extends Omit<ModalProps, "children"> {
  title?: string;
  description?: string;
  buttonText?: string[];
  onConfirm?: () => void;
  isLoading?: boolean;

  _content?: ModalContentProps;
  _body?: ModalBodyProps;
}

export default function ConfirmationModal(props: ConfirmationModalProps) {
  const {
    title,
    description,
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    buttonText,
    _content,
    _body,
    ...xprops
  } = props;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      {...xprops}
    >
      <ModalOverlay />
      <ModalContent borderRadius="18px" {..._content}>
        <ModalHeader textAlign="left" py="30px" px="40px">
          {title ?? ""}
        </ModalHeader>
        <ModalCloseButton
          top="28px"
          right="38px"
          disabled={isLoading}
          _focus={{ shadow: `0 0 0 3px var(--focusColor)` }}
        />
        <ModalBody textAlign="left" py="10px" px="40px" {..._body}>
          <Text>{description ?? ""}</Text>
        </ModalBody>

        <ModalFooter justifyContent="center" py="30px" px="40px">
          <Button
            disabled={isLoading}
            isLoading={isLoading}
            w="100%"
            mr={3}
            size="sm"
            onClick={onConfirm}
          >
            {buttonText && buttonText[0] ? buttonText[0] : "Confirm"}
          </Button>
          <Button
            w="100%"
            size="sm"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {buttonText && buttonText[1] ? buttonText[1] : "Close"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
