import {
  Modal,
  ModalProps,
  ModalContentProps,
  ModalBodyProps,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  VStack,
  Heading,
  Grid,
  Stack,
  ModalFooter,
  Button,
  Divider,
} from "@chakra-ui/react";
import { EmptyCrate } from "components/Crate/Empty";
import { Detail } from "components/DetailItem/Detail";
import Icon from "components/Icon/Icon";
import { LineupItem } from "components/Lineup/LineupItem";
import useLineup from "hooks/useLineUp";
import { UserRo } from "interfaces";
import { join, omit } from "lodash";
import { useMemo } from "react";
import { when } from "utils";

interface LineupDetailModalProps extends Omit<ModalProps, "children" | "id"> {
  user: UserRo;
  isLoading?: boolean;

  _content?: ModalContentProps;
  _body?: ModalBodyProps;
}

export default function LineupDetailModal(props: LineupDetailModalProps) {
  const { user, isOpen, onClose, _content, _body, ...xprops } = props;

  const { data: lineupData, isLoading } = useLineup(user?._id);
  const lineup = useMemo(
    () =>
      omit(lineupData, ["_id", "createdAt", "updatedAt", "customer", "__v"]),
    [lineupData]
  );

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
        // p="38px"
        borderRadius="8px"
        minW="608px"
        maxH="calc(100vh - 200px)"
        w="100%"
        sx={{
          "@media print": {
            body: {
              marginTop: "5px",
              marginLeft: "10px",
              transform: "scale(0.76)",
              transformOrigin: "0 0",
            },
          },
        }}
      >
        <VStack mt="10px" py="32px">
          <Icon type="fullLogo" h="72px" color="brand.primary" />
        </VStack>
        <ModalCloseButton
          top="48px"
          right="56px"
          size="2xl"
          disabled={isLoading}
          _focus={{ shadow: `0 0 0 3px var(--focusColor)` }}
        />
        <ModalBody px="38px" overflowY="scroll">
          <Heading mt="10px" fontSize="24px" fontWeight="600">
            Weekly Lineup
          </Heading>

          <Grid mt="28px" templateColumns="repeat(2, 1fr)" gap="20px">
            <Detail
              isLoading={isLoading}
              title="Name"
              description={join([user?.first_name, user?.last_name], " ")}
              _desc={{ fontSize: "16px" }}
            />
            <Detail
              isLoading={isLoading}
              title="Phone Number"
              description={user?.phone ?? "---------"}
              _desc={{ fontSize: "16px" }}
            />
            <Detail
              isLoading={isLoading}
              title="Address"
              description={join(
                [
                  user?.address?.address_,
                  user?.address?.city,
                  user?.address?.country,
                  user?.address?.postcode,
                ],
                !!user?.address ? ", " : "---"
              )}
              _desc={{ fontSize: "16px" }}
            />
          </Grid>

          <Divider
            mt="26px"
            mb="20px"
            borderWidth="1px"
            borderStyle="dashed"
            borderColor="black"
          />

          <Stack
            mt="16px"
            borderRadius="8px"
            overflow="hidden"
            p="14px"
            shadow={when(
              !lineupData,
              "0px 2px 12px rgba(0, 0, 0, 0.05)",
              "none"
            )}
            gridGap="16px"
          >
            {!!lineupData &&
              !isLoading &&
              Object.keys(lineup ?? {}).map((key, i) => (
                <LineupItem key={key} day={key} pack={(lineup! as any)[key]} />
              ))}

            {!isLoading && !lineupData && <EmptyCrate />}
          </Stack>
        </ModalBody>

        <ModalFooter justifyContent="center" py="30px" px="40px">
          <Button
            disabled={isLoading}
            isLoading={isLoading}
            leftIcon={<Icon type="print" />}
            // w="100%"
            mr={3}
            minH="48px"
            // size="sm"
            // font
            onClick={window.print}
          >
            Print
          </Button>
          <Button
            // w="100%"
            // size="sm"
            minH="48px"
            variant="outline"
            onClick={onClose}
            leftIcon={<Icon type="download" />}
            disabled={isLoading}
          >
            Download
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
