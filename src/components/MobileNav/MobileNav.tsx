import {
  Box,
  BoxProps,
  Button,
  Center,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  HStack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { RouterProps } from "@reach/router";
import Icon from "components/Icon/Icon";
import SidebarLink from "components/Sidebar/SidebarLink";
import useAuth from "hooks/useAuth";
import { take, takeRight } from "lodash";
import { Menu } from "lucide-react";
import { FC, useCallback, useRef } from "react";

interface MobileNavProps extends BoxProps {
  location: RouterProps["location"];
}

const DashboardIcon = () => <Icon type="dashboard" />;
const UsersIcon = () => <Icon type="users" />;
const MealsIcon = () => <Icon type="meals" />;
const SubscriptionsIcon = () => <Icon type="subscriptions" />;
const ReferralIcon = () => <Icon type="referral" />;
const PlansIcon = () => <Icon type="plans" />;
const BroadcastIcon = () => <Icon type="broadcast" />;
const GiftCardIcon = () => <Icon type="giftCard" />;

const ProfileIcon = () => <Icon type="profile" />;
const AdminIcon = () => <Icon type="admin" />;

const pageLinks = [
  {
    activeIcon: DashboardIcon,
    icon: DashboardIcon,
    label: "Dashboard",
    to: "/dashboard",
  },
  {
    activeIcon: UsersIcon,
    icon: UsersIcon,
    label: "Users",
    to: "/users",
  },
  {
    activeIcon: MealsIcon,
    icon: MealsIcon,
    label: "Meals",
    to: "/meals",
  },

  {
    activeIcon: MealsIcon,
    icon: MealsIcon,
    label: "Bulk Meals",
    to: "/bulkOrder",
  },

  {
    activeIcon: MealsIcon,
    icon: MealsIcon,
    label: "Protein and Swallow",
    to: "/meal_extra",
  },
  {
    activeIcon: GiftCardIcon,
    icon: GiftCardIcon,
    label: "Gift Card",
    to: "/gift_cards",
  },

  {
    activeIcon: GiftCardIcon,
    icon: GiftCardIcon,
    label: "Line up",
    to: "/lineUp",
  },

  {
    activeIcon: SubscriptionsIcon,
    icon: SubscriptionsIcon,
    label: "Subscribed Users",
    to: "/subscriptions",
  },

  {
    activeIcon: ReferralIcon,
    icon: ReferralIcon,
    label: "Referal",
    to: "/referrals",
  },

  {
    activeIcon: SubscriptionsIcon,
    icon: SubscriptionsIcon,
    label: "Single Order",
    to: "/single-order",
  },
  {
    activeIcon: PlansIcon,
    icon: PlansIcon,
    label: "Plans",
    to: "/plans",
  },
  {
    activeIcon: BroadcastIcon,
    icon: BroadcastIcon,
    label: "Broadcasts",
    to: "/broadcasts",
  },
  {
    activeIcon: ReferralIcon,
    icon: ReferralIcon,
    label: "Promotions",
    to: "/promos",
  },
  {
    activeIcon: ProfileIcon,
    icon: ProfileIcon,
    label: "Profile",
    to: "/profile",
  },
  {
    activeIcon: BroadcastIcon,
    icon: BroadcastIcon,
    label: "Send Email",
    to: "/emails",
  },
  {
    activeIcon: AdminIcon,
    icon: AdminIcon,
    label: "Administrators",
    to: "/admins",
  },
];

const MobileNav: FC<MobileNavProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  const { logout } = useAuth();

  const isCurrent = useCallback(
    (path: string) => {
      const pathname = props.location?.pathname.match(/(\w)+/g),
        name = path.match(/(\w)+/g);

      return (
        ((name && pathname && pathname[0]?.includes(name[0])) ||
          props.location?.pathname === path) ??
        false
      );
    },
    [props?.location]
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);
  return (
    <Box
      zIndex="999"
      position="sticky"
      top="0"
      bg="brand.black"
      padding="16px"
      hideFrom="lg"
    >
      <HStack justifyContent="space-between">
        <HStack color="white" alignItems="center">
          <Icon type="logo2" w="98px" />
          <Text>Admin</Text>
        </HStack>
        <>
          <Button ref={btnRef} bg={"transparent"} p={0} onClick={onOpen}>
            <Menu />
          </Button>
          <Drawer
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            finalFocusRef={btnRef}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton color="white" />

              <DrawerBody bg={"brand.black"}>
                <Box width={"100%"} overflow="auto">
                  <VStack
                    alignItems="flex-start"
                    w="100%"
                    h="calc(100% - 122px)"
                    py="40px"
                    overflowY="scroll"
                  >
                    {take(pageLinks, pageLinks.length - 2).map((link, i) => (
                      <SidebarLink
                        style={{ textTransform: "capitalize" }}
                        key={i}
                        {...link}
                        isCurrent={isCurrent(link.to)}
                        mb={
                          i === take(pageLinks, 9).length - 1
                            ? "0 !important"
                            : "8px !important"
                        }
                        onClick={handleClose}
                      />
                    ))}

                    <Center w="100%" my="12px !important" px="26px">
                      <Divider
                        color="brand.primary"
                        borderColor="brand.primary"
                      />
                    </Center>

                    {takeRight(pageLinks, 2).map((link, i) => (
                      <SidebarLink
                        style={{ textTransform: "capitalize" }}
                        key={i}
                        {...link}
                        isCurrent={isCurrent(link.to)}
                        mb={
                          i === takeRight(pageLinks, 2).length - 1
                            ? "0 !important"
                            : "8px !important"
                        }
                      />
                    ))}

                    <Button
                      mt="5px !important"
                      leftIcon={<Icon type="logout" />}
                      variant="ghost"
                      p="16px 38px"
                      w="100%"
                      minH="57px"
                      maxH="fit-content"
                      h="fit-content"
                      borderRadius="0px"
                      justifyContent="flex-start"
                      color="brand.greyText"
                      fontSize="sm"
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                      _hover={{
                        bg: "#EFF0F6",
                        color: "brand.lightBlue",
                      }}
                    >
                      Logout
                    </Button>
                  </VStack>
                </Box>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      </HStack>
    </Box>
  );
};

export default MobileNav;
