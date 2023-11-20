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
  Text,
  Box,
  VStack,
  Stack,
  Divider,
  HStack,
  BoxProps,
} from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import useTransaction from "hooks/useTransaction";
import { PlanRo } from "interfaces";
import { capitalize } from "lodash";
import { useMemo } from "react";
import { currencyFormat } from "utils";

interface TransactionDetailModalProps
  extends Omit<ModalProps, "children" | "id"> {
  _id: string;
  description?: string;
  buttonText?: string[];
  onConfirm?: () => void;
  isLoading?: boolean;

  _content?: ModalContentProps;
  _body?: ModalBodyProps;
}

export default function TransactionDetailModal(
  props: TransactionDetailModalProps
) {
  const {
    _id,
    description,
    isOpen,
    onClose,
    onConfirm,
    buttonText,
    _content,
    _body,
    ...xprops
  } = props;

  const { data: tx, isLoading } = useTransaction(_id);
  const plan = useMemo(() => tx?.plan as PlanRo, [tx]);

  console.log("Transaction Details", _id, tx);

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
        p="48px"
        borderRadius="8px"
        minW="604px"
        w="100%"
      >
        <Box>
          <ModalHeader textAlign="left" py="30px" px="40px">
            <Text fontSize="2xl">Transaction detail</Text>
            <Text fontSize="12px" color="brand.greyText">
              {/* Fri July 23, 2021 */}
              {!!tx?.createdAt
                ? format(
                    parseISO(tx?.createdAt ?? new Date().toDateString()),
                    "eee, MMM dd, yyyy"
                  )
                : "Fri, July 23, 2021"}
            </Text>
          </ModalHeader>
        </Box>
        <ModalCloseButton
          top="68px"
          right="68px"
          size="2xl"
          disabled={isLoading}
          _focus={{ shadow: `0 0 0 3px var(--focusColor)` }}
        />
        <ModalBody py="10px" px="40px">
          <VStack>
            <Stack justifyContent="center" textAlign="center">
              <Text fontSize="14px" color="brand.greyText">
                Amount
              </Text>
              <Text mt="0 !important" fontSize="28px" fontWeight="600">
                {currencyFormat((tx?.currency as any) ?? "gbp").format(
                  tx?.amount ?? 0
                )}
              </Text>
              <Text mt="0 !important" fontSize="14px" color="green">
                {capitalize(tx?.status ?? "Successful")}
              </Text>
            </Stack>

            <Divider mt="20px !important" borderColor="brand.neutral" />

            <Stack
              w="100%"
              my="32px !important"
              p="12px 16px"
              borderRadius="8px"
              border="2px dotted transparent"
              borderColor="brand.primary"
            >
              {!!plan?.name && (
                <TxDetail
                  isLoading={isLoading}
                  title="Subscription Type"
                  description={plan?.name ?? "-------"}
                />
              )}

              <TxDetail
                isLoading={isLoading}
                title="Transaction Ref"
                description={tx?.reference ?? ""}
              />

              <TxDetail
                isLoading={isLoading}
                title="Payment Channel"
                description={tx?.payment_method ?? ""}
              />

              <TxDetail
                isLoading={isLoading}
                title="Payment Gateway"
                description={tx?.payment_gateway ?? ""}
              />
            </Stack>
          </VStack>
        </ModalBody>

        {/* <ModalFooter justifyContent="center" py="30px" px="40px">
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
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  );
}

interface TxDetailProps extends BoxProps {
  title: string;
  description: string;
  isLoading?: boolean;
}

function TxDetail(props: TxDetailProps) {
  const { title, description } = props;

  return (
    <HStack justifyContent="space-between">
      <Text color="brand.greyText">{title}</Text>
      <Text color="brand.greyText">{description}</Text>
    </HStack>
  );
}
