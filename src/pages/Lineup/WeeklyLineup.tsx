import {
  Button,
  Divider,
  Grid,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalBodyProps,
  ModalCloseButton,
  ModalContent,
  ModalContentProps,
  ModalOverlay,
  ModalProps,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { navigate } from "@reach/router";
import { Logo } from "components";
import { EmptyCrate } from "components/Crate/Empty";
import { Detail } from "components/DetailItem/Detail";
import { GenericTableItem } from "components/GenericTable/GenericTable";
import Gravatar from "components/Gravatar/Gravatar";
import { LineupItem } from "components/Lineup/LineupItem";
import LineupStatus from "components/Status/LineupStatus";
import SubscriptionBadge from "components/SubscriptionBadge/SubscriptionBadge";
import configs from "config";
import { format, parseISO } from "date-fns";
import useLineup from "hooks/useLineUp";
import useUser from "hooks/useUser";
import { PlanRo, SubscriptionRo, UserRo } from "interfaces";
import { join, omit } from "lodash";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { ILineUpItem } from "types";
import { get, when } from "utils";

interface WeeklyMealLineUpProps {
  data: ILineUpItem[];
  isLoading?: boolean;
}

export function WeeklyMealLineUp(props: WeeklyMealLineUpProps) {
  const { data } = props;

  return (
    <>
      {(data ?? []).map((sub) => (
        <Item {...sub} />
      ))}
    </>
  );
}

interface ItemProps extends ILineUpItem {}

function Item(props: ItemProps) {
  const [user, setUser] = useState<{ data: UserRo; loading: boolean }>({
    data: {} as UserRo,
    loading: true,
  });
  const { customer, delivery_date, status,isReturningCustomer } = props;



  const { isOpen, onOpen, onClose } = useDisclosure();

  const getUser = async () => {
    const data = await get(`customers/${customer}`);
    //@ts-ignore
    setUser({ loading: false, data: data?.data });
  };

  useEffect(() => {
    getUser();
  }, []);

  console.log("LINE UPS");
  console.log(props)

  return (
    <>
      <GenericTableItem
        cols={[
          <Gravatar
            title={join([user?.data?.first_name, user?.data?.last_name], " ")}
            IsReturningCustomer={isReturningCustomer}
            onClick={() =>
              navigate(`${configs.paths.users}/${user?.data?._id ?? ""}`)
            }
          />,
          <Text textTransform="capitalize">{status}</Text>,
          <Text textTransform="capitalize">
            {user?.data?.address?.city ?? "------------"}
          </Text>,
          <Text textTransform="capitalize">{moment(delivery_date).format("DD/MM/YYYY")}</Text>,
         
          <Button
            size="sm"
            variant="outline"
            // isDisabled={!user?.lineup}
            onClick={onOpen}
          >
            View Lineup
          </Button>,
        ]}
      />

      {!!user?.data && (
        <LineupDetailModal
          lineupData={props}
          {...props}
          user={user.data}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  );
}

interface LineupDetailModalProps extends Omit<ModalProps, "children" | "id"> {
  user: UserRo;
  isLoading?: boolean;
  _content?: ModalContentProps;
  _body?: ModalBodyProps;
  lineupData: ILineUpItem;
}

const LineupDetailModal = (props: LineupDetailModalProps) => {
  const { user, isOpen, onClose, _content, _body, lineupData, ...xprops } =
    props;

  // const { isLoading } = useLineup(user?._id);
  const isLoading = false;
  const lineup = useMemo(
    () =>
      omit(lineupData, [
        "_id",
        "createdAt",
        "updatedAt",
        "customer",
        "__v",
        "delivery_date",
      ]),
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
        minW="560px"
        maxH="90vh"
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
        <ModalCloseButton
          top="48px"
          right="56px"
          size="2xl"
          disabled={isLoading}
          _focus={{ shadow: `0 0 0 3px var(--focusColor)` }}
        />
        <ModalBody
          borderRadius="32px"
          px="38px"
          overflowX="hidden"
          overflowY="scroll"
        >
          <HStack justifyContent={"center"} mt={10} alignItems="center">
            <Logo width={100} height={100}  />
          </HStack>
          <Heading mt="5px" fontSize="24px" fontWeight="600">
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
            <Detail
              isLoading={isLoading}
              title="Delivery Day"
              description={user?.delivery_day}
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
         
         <Text fontSize={16} color="#000" fontWeight={700}>
         Week {lineupData?.week}
         </Text>

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

          <HStack>
            <Button
              disabled={isLoading}
              isLoading={isLoading}
              leftIcon={<Icon type="print" />}
              // w="100%"
              mr={3}
              flex={1}
              minH="48px"
              // size="sm"
              // font
              onClick={window.print}
            >
              Print
            </Button>
            <Button
              flex={1}
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
          </HStack>
        </ModalBody>

        {/* <ModalFooter justifyContent="center" py="30px" px="40px">
        
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  );
};

// const LineupItem =()=>{
//   return  (

//   )
// }
