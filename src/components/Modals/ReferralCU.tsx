import {
  Modal,
  ModalProps,
  ModalContentProps,
  ModalBodyProps,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

interface ReferralModalProps extends ModalProps {
  title?: string;
  description?: string;
  buttonText?: string[];
  onSave?: () => void;
  isLoading?: boolean;

  _content?: ModalContentProps;
  _body?: ModalBodyProps;
}

export default function ReferralModal(props: ReferralModalProps) {
  const {
    title,
    description,
    isOpen,
    onClose,
    onSave,
    isLoading,
    buttonText,
    _content,
    _body,
    children,
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
      <ModalContent borderRadius="18px" maxW="520px" {..._content}>
        <ModalHeader textAlign="left" py="30px" px="40px">
          {title ?? ""}
        </ModalHeader>
        {/* <ModalCloseButton
          top="28px"
          right="38px"
          disabled={isLoading}
          _focus={{ shadow: `0 0 0 3px var(--focusColor)` }}
        /> */}
        <ModalBody textAlign="left" pb="10px" px="40px" mb="24px" {..._body}>
          {children}
        </ModalBody>

        <ModalFooter justifyContent="flex-end" py="30px" px="40px">
          <Button
            w="180px"
            size="md"
            fontSize="16px"
            mr={3}
            variant="transparent"
            onClick={onClose}
            disabled={isLoading}
          >
            {buttonText && buttonText[1] ? buttonText[1] : "Cancel"}
          </Button>
          <Button
            disabled={isLoading}
            isLoading={isLoading}
            w="180px"
            size="md"
            fontSize="16px"
            onClick={onSave}
          >
            {buttonText && buttonText[0] ? buttonText[0] : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
