import {
  Box,
  BoxProps,
  Button,
  Center,
  Divider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FC, useCallback } from "react";

// import { ReactComponent as Logo } from "assets/svgs/logo.svg";
// import { ReactComponent as LogoutIcon } from "assets/svgs/sidebar/current/logout.svg";

// import useAuth from "hooks/useAuth";

import SidebarLink from "./SidebarLink";

import take from "lodash/take";
import takeRight from "lodash/takeRight";

import { RouterProps } from "@reach/router";
import Icon from "../Icon/Icon";
import useAuth from "hooks/useAuth";

interface SidebarProps extends BoxProps {
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
    label: "Referral",
    to: "/referrals",
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

const Sidebar: FC<SidebarProps> = (props) => {
  const { ...xprops } = props;

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

  return (
    <Box 
    bg="brand.black"
    minW="var(--sideNavWidth)"
    maxW="var(--sideNavWidth)"
    py="45px"
    height="100vh"
    pos="fixed"
    top="0"
    
    display={"flex"}
    alignItems={"center"}
    justifyContent={"center"}
    {...xprops}

    >
    <Box
   
     width={"100%"}
     height={"95%"}
     overflow="auto"
    >
      <VStack
        color="white"
        justifyContent="center"
        alignItems="center"
        w="100%"
      >
        <Icon type="fullLogo" w="85px" h="90px" />
        <Text
          fontFamily="var(--manjari)"
          position="relative"
          top="-16px"
          mt="0 !important"
        >
          Admin
        </Text>
      </VStack>

      <VStack
        alignItems="flex-start"
        w="100%"
        h="calc(100% - 122px)"
        py="40px"
        overflowY="scroll"
      >
        {take(pageLinks, 9).map((link, i) => (
          <SidebarLink
            key={i}
            {...link}
            isCurrent={isCurrent(link.to)}
            mb={
              i === take(pageLinks, 9).length - 1
                ? "0 !important"
                : "8px !important"
            }
          />
        ))}

        <Center w="100%" my="12px !important" px="26px">
          <Divider color="brand.primary" borderColor="brand.primary" />
        </Center>

        {takeRight(pageLinks, 2).map((link, i) => (
          <SidebarLink
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
          // pos="absolute"
          // bottom="20px"
          mt="5px !important"
          leftIcon={<Icon type="logout" />}
          variant="ghost"
          p="16px 38px"
          w="100%"
          // w="calc(100% - (16px * 4))"
          minH="57px"
          maxH="fit-content"
          h="fit-content"
          borderRadius="0px"
          justifyContent="flex-start"
          // bg="#C2C8D11f"
          color="brand.greyText"
          fontSize="sm"
          onClick={() => logout()}
          _hover={{
            bg: "#EFF0F6",
            color: "brand.lightBlue",
          }}
        >
          Logout
        </Button>
      </VStack>
    </Box>
    </Box>
  );
};

export default Sidebar;
