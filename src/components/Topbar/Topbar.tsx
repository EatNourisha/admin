import { FC, ReactNode, useMemo, useRef } from "react";
import {
  // Badge,
  // Box,
  BoxProps,
  // Button,
  Heading,
  HStack,
  Stack,
  Skeleton,
  Progress,
  Button,
  Box,
  Badge,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerProps,
  useDisclosure,
  ButtonProps,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabProps,
  TabPanels,
  TabPanel,
  Text,
  Divider,
  useToast,
  // SkeletonCircle,
} from "@chakra-ui/react";

import MainLayoutContainer from "../MainLayoutContainer/MainLayoutContainer";
import Icon from "components/Icon/Icon";
import { navigate } from "@reach/router";
import useNotifications from "hooks/useNotifications";
import { when } from "utils";
import { NotificationRo } from "interfaces";
import { EmptyCrate } from "components/Crate/Empty";
import Loader from "components/Loader/Loader";
import { format, parseISO } from "date-fns";
import useNotificationMutations from "hooks/useNotificationMutations";
import usePageFilters from "hooks/usePageFilters";
import APaginator from "components/Paginator/APaginator";

const NotificationsIcon = () => <Icon type="notifications" />;

interface TopbarProps extends BoxProps {
  isLoading?: boolean;
  pageTitle?: string;
  action?: ReactNode;
  isDownloading?: boolean;
  progressValue?: number;
  fix_unpaid_order?: boolean;
  onFixOrders?: () => void;
  isFixing?: boolean;
}

interface NotificationButtonProps extends Omit<ButtonProps, "children"> {
  hasNewNotifications: boolean;
}

export const NotificationButton = (props: NotificationButtonProps) => {
  const { hasNewNotifications, ...xprops } = props;
  return (
    <Button
      pos="relative"
      boxSize="40px"
      minW="40px"
      minH="40px"
      display="flex"
      justifyContent="center"
      alignItems="center"
      aria-label="notification button"
      variant="unstyled"
      _hover={{ bg: "transparent" }}
      _focus={{ bg: "transparent" }}
      _active={{ bg: "transparent" }}
      h="fit-content"
      border="1px solid transparent"
      borderColor="brand.neutral"
      borderRadius="50%"
      // visibility=
      filter="drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.1))"
      {...xprops}

      //   _before={{
      //     content: "'2'",
      //     pos: "absolute",
      //     boxSize: "20px",
      //     bg: "brand.green",
      //   }}
    >
      <Box as={NotificationsIcon} />
      {hasNewNotifications && (
        <Badge
          pos="absolute"
          top="6px"
          right="10px"
          bg="brand.deepRed"
          borderRadius="50%"
          boxSize="10px"
          // w="fit-content"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="white"
        ></Badge>
      )}
    </Button>
  );
};

const Topbar: FC<TopbarProps> = (props) => {
  const {
    pageTitle,
    action,
    isLoading,
    isDownloading,
    progressValue,
    fix_unpaid_order,
    onFixOrders,
    isFixing,
    ...xprops
  } = props;

  const btnRef = useRef();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { data, isLoading: isNotificationsLoading, key } = useNotifications();

  const hasNewNotifications = useMemo(() => (data?.unread ?? 0) > 0, [data]);

  return (
    <Stack
      h="fit-content"
      top="0"
      pos="sticky"
      zIndex="99"
      mb="26px"
      // backdropFilter="blur(10px)"
      // mt="52px"
      borderBottom="1px solid #D0D5DD"
      // pos="relative"
      {...xprops}
    >
      <HStack w="100%" pos="relative" bg="white" minH="100px">
        <MainLayoutContainer>
          <HStack w="100%" justifyContent="space-between">
            <Stack>
              <Skeleton isLoaded={!isLoading || true}>
                <Heading fontSize="3xl" fontWeight="700" letterSpacing="-2px">
                  {pageTitle}
                </Heading>
              </Skeleton>
              {action && action}
            </Stack>

            <HStack>
              {/* <Input
              w="100%"
              minW="380px"
              mr="20px !important"
              placeholder="Enter your search term"
              startAdornment={<Icon type="search" />}
            /> */}
              {/* <SkeletonCircle isLoaded={!isLoading ?? true}>
              <NotificationButton />
            </SkeletonCircle> */}
              {pageTitle?.toLowerCase().includes("admin") && (
                <Button
                  size="sm"
                  variant="transparent"
                  leftIcon={<Icon type="admin" />}
                  onClick={() => navigate("/admins/settings")}
                >
                  Settings
                </Button>
              )}
              {pageTitle?.toLowerCase().includes("meal") && (
                <Button
                  size="sm"
                  variant="transparent"
                  leftIcon={<Icon type="subscriptions" />}
                  onClick={() => navigate("/meals/orders")}
                >
                  View Orders
                </Button>
              )}
              {pageTitle?.toLowerCase().includes("orders") &&
                !!fix_unpaid_order && (
                  <Button
                    size="sm"
                    variant="transparent"
                    leftIcon={<Icon type="subscriptions" />}
                    onClick={onFixOrders}
                    isLoading={isFixing}
                    disabled={isFixing}
                  >
                    Fix paid orders
                  </Button>
                )}

              <NotificationButton
                onClick={onOpen}
                isLoading={isNotificationsLoading}
                hasNewNotifications={hasNewNotifications}
              />
            </HStack>
          </HStack>
        </MainLayoutContainer>
        {isDownloading && (
          <Progress
            ml="0 !important"
            size="xs"
            isIndeterminate={
              isDownloading && !!progressValue && progressValue <= 0
            }
            pos="absolute"
            w="100%"
            bottom="0"
            colorScheme="primary"
            value={progressValue}
          />
        )}
      </HStack>

      <NotificationDrawer
        isOpen={isOpen}
        onClose={onClose}
        unreadCount={data?.unread ?? 0}
        readCount={data?.read ?? 0}
        finalFocusRef={btnRef as any}
        mutationKeys={[key]}
      />
    </Stack>
  );
};

export default Topbar;

interface NotificationDrawerProps extends Omit<DrawerProps, "children"> {
  unreadCount: number;
  readCount: number;
  mutationKeys?: string[];
}

function NotificationDrawer(props: NotificationDrawerProps) {
  const {
    isOpen,
    onClose,
    finalFocusRef,
    unreadCount,
    readCount,
    mutationKeys,
  } = props;

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={finalFocusRef}
    >
      <DrawerOverlay />
      <DrawerContent minW="520px">
        <DrawerCloseButton />
        <DrawerHeader>
          <HStack>
            <Heading as="h4" fontSize="md">
              Notifications
            </Heading>
            {unreadCount > 0 && (
              <Badge bg="brand.primary" color="white">
                New
              </Badge>
            )}
          </HStack>
        </DrawerHeader>

        <DrawerBody>
          <VStack w="100%" position="relative">
            <Tabs w="100%">
              <VStack>
                <TabList
                  top="150px"
                  position="sticky"
                  w="100%"
                  justifyContent="center"
                  alignItems="center"
                >
                  {/* <IconButton
                    minW="fit-content"
                    minH="fit-content"
                    maxW="fit-content"
                    maxH="fit-content"
                    aria-label="refresh button"
                    icon={
                      <RepeatIcon boxSize="18px" color="brand.neutral600" />
                    }
                    boxSize="20px"
                    p="2px"
                    borderRadius="50px"
                    bg="transparent"
                    _hover={{
                      bg: "transparent",
                    }}
                    _active={{
                      bg: "transparent",
                    }}
                    _loading={{ color: "brand.primary" }}
                    // onClick={() => {
                    //   action.current = "delete";
                    //   onOpen();
                    // }}
                  /> */}
                  <CTab>Unread ({unreadCount})</CTab>
                  <CTab>Read ({readCount})</CTab>
                </TabList>
              </VStack>

              <TabPanels>
                <TabPanel px={0}>
                  <Notifications
                    onClose={onClose}
                    status="unread"
                    mutationKeys={mutationKeys}
                  />
                </TabPanel>
                <TabPanel px={0}>
                  <Notifications
                    onClose={onClose}
                    status="read"
                    mutationKeys={mutationKeys}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </DrawerBody>

        {/* <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue">Save</Button>
        </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  );
}

interface CTabProps extends TabProps {}

interface NotificationsProps extends BoxProps {
  status: "read" | "unread";
  onClose: () => void;
  mutationKeys?: string[];
}
interface NotificationItemProps extends BoxProps {
  note: NotificationRo;
  onClose: () => void;
  index: number;
  mutationKeys?: string[];
}

function CTab(props: CTabProps) {
  const { children, ...xprops } = props;
  return (
    <Tab
      w="100%"
      p="20px"
      {...xprops}
      _selected={{ color: "brand.primary", borderColor: "brand.primary" }}
    >
      {children}
    </Tab>
  );
}

function Notifications(props: NotificationsProps) {
  const { status, onClose, mutationKeys } = props;

  const { state, onPageChange } = usePageFilters({ page: 1, limit: 10 }, false);
  const { data, isLoading, key } = useNotifications({ ...state, status });

  const notes = useMemo(() => data?.notifications?.data ?? [], [data]);
  const hasNotes = useMemo(() => notes.length > 0, [notes]);

  return (
    <Stack
      gap="10px"
      mt="16px"
      borderRadius="8px"
      overflow="hidden"
      // p="14px"
      shadow={when(!hasNotes, "0px 2px 12px rgba(0, 0, 0, 0.05)", "none")}
    >
      {hasNotes &&
        !isLoading &&
        notes.map((note, i) => (
          <NotificationItem
            key={i}
            index={i}
            onClose={onClose}
            note={note}
            mutationKeys={[key, ...(mutationKeys ?? [])]}
          />
        ))}

      {isLoading && !hasNotes && <Loader my="80px" />}

      {!hasNotes && !isLoading && (
        <EmptyCrate description="There's nothing to see here 🧐" />
      )}

      {hasNotes && (
        <APaginator
          flexDir={"row"}
          isLoading={isLoading}
          totalCount={data?.notifications?.totalCount}
          limit={state?.limit}
          page={state?.page}
          onPageChange={onPageChange}
        />
      )}
    </Stack>
  );
}

function NotificationItem(props: NotificationItemProps) {
  const toast = useToast();
  const { note, onClose, index, mutationKeys } = props;

  const { markAsRead, isLoading } = useNotificationMutations([
    ...(mutationKeys ?? []),
    "notifications/admins?status=read",
  ]);
  const { viewMore_link } = useNotificationItemViewMore(note);

  const handleMarkAsRead = async (e: any) => {
    e.preventDefault();
    if (!note?._id) return;
    const result = await markAsRead([note?._id]);
    if (!!result) {
      toast({
        position: "bottom-right",
        title: "Success 🎉",
        description: `Marked notification as read`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      w="100%"
      //   h="100px"
      p="16px"
      shadow="base"
      border="1px solid"
      borderColor="brand.neutral100"
      borderRadius="10px"
      bg="white"
    >
      <Stack flex="2">
        <HStack justifyContent="space-between">
          <HStack>
            <Icon
              type="notifications"
              boxSize="14px"
              color="brand.primary"
              opacity={0.8}
            />
            <Text fontSize="14px" color="brand.neutral700">
              {note?.title ?? "-----"}
            </Text>
          </HStack>

          <HStack>
            <Badge fontSize="10px" bg="#a6ffa68a" color="#464545">
              {note?.tag}
            </Badge>
            <Text fontSize="14px" color="brand.neutral700">
              {when(
                index === 0 && note?.status === "unread",
                "#Latest",
                `#${index + 1}`
              )}
            </Text>
          </HStack>
        </HStack>
        <Divider mt="4px" />

        <Box p="4px">
          <Text fontSize="14px" fontWeight="500">
            {note?.content}
          </Text>
        </Box>

        <Divider my="4px" />

        <HStack justifyContent="space-between">
          <Text fontSize="12px" color="brand.neutral700">
            {format(parseISO(note?.createdAt), "EEE dd, MMM yyyy hh:mm aa")}
          </Text>
          <HStack>
            {note?.status === "unread" && (
              <Button
                variant="transparent"
                size="sm"
                minH="26px"
                h="26px"
                onClick={handleMarkAsRead}
                isLoading={isLoading}
                isDisabled={isLoading}
              >
                Mark as read
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              minH="26px"
              h="26px"
              onClick={() => {
                !!onClose && onClose();
                !!viewMore_link && navigate(viewMore_link);
              }}
            >
              View Info
            </Button>
          </HStack>
        </HStack>
      </Stack>
    </Box>
  );
}

function useNotificationItemViewMore(note: NotificationRo) {
  const { tag, metadata } = note;

  console.log("Metadata", metadata);

  const viewMore_link = useMemo(() => {
    if (["lineup", "subscription"].includes(tag)) {
      const cus = metadata?.customer;
      const cus_id = when(!!cus && typeof cus === "string", cus, cus?._id);
      return `/users/${cus_id}`;
    }
  }, [tag, metadata]);

  return { viewMore_link };
}
