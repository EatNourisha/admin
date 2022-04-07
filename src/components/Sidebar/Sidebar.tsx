import {
  Box,
  BoxProps,
  Button,
  Center,
  Divider,
  VStack,
} from "@chakra-ui/react";
import { FC, useCallback } from "react";

// import { ReactComponent as Logo } from "assets/svgs/logo.svg";
// import { ReactComponent as LogoutIcon } from "assets/svgs/sidebar/current/logout.svg";

import Logo from "../Logo/Logo";

// import useAuth from "hooks/useAuth";

import SidebarLink from "./SidebarLink";

import take from "lodash/take";
import takeRight from "lodash/takeRight";

import { RouterProps } from "@reach/router";
import Icon from "../Icon/Icon";

interface SidebarProps extends BoxProps {
  location: RouterProps["location"];
}

const DashboardIcon = () => <Icon type="dashboard" />;
const AppointmentIcon = () => <Icon type="appointments" />;
const PatientsIcon = () => <Icon type="patients" />;
const DoctorsIcon = () => <Icon type="doctors" />;
const CalendarIcon = () => <Icon type="calendar" />;
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
    activeIcon: AppointmentIcon,
    icon: AppointmentIcon,
    label: "Appointments",
    to: "/appointments",
  },
  {
    activeIcon: PatientsIcon,
    icon: PatientsIcon,
    label: "Patients",
    to: "/patients",
  },
  {
    activeIcon: DoctorsIcon,
    icon: DoctorsIcon,
    label: "Doctors",
    to: "/doctors",
  },
  {
    activeIcon: CalendarIcon,
    icon: CalendarIcon,
    label: "Calendar",
    to: "/calendar",
  },
  {
    activeIcon: ProfileIcon,
    icon: ProfileIcon,
    label: "Profile",
    to: "/profile",
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

  // const { logout } = useAuth();

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
      bg="brand.deepBlue"
      minW="var(--sideNavWidth)"
      maxW="var(--sideNavWidth)"
      py="45px"
      minH="100vh"
      pos="fixed"
      top="0"
      {...xprops}
    >
      <VStack justifyContent="center" alignItems="center" w="100%">
        <Logo w="52px" />
      </VStack>

      <VStack alignItems="flex-start" w="100%" mt="80px" overflowY="scroll">
        {take(pageLinks, 5).map((link, i) => (
          <SidebarLink
            key={i}
            {...link}
            isCurrent={isCurrent(link.to)}
            mb={
              i === take(pageLinks, 5).length - 1
                ? "0 !important"
                : "16px !important"
            }
          />
        ))}

        <Center w="100%" my="44px !important" px="26px">
          <Divider color="brand.primary" borderColor="brand.primary400" />
        </Center>

        {takeRight(pageLinks, 2).map((link, i) => (
          <SidebarLink
            key={i}
            {...link}
            isCurrent={isCurrent(link.to)}
            mb={
              i === takeRight(pageLinks, 2).length - 1
                ? "0 !important"
                : "16px !important"
            }
          />
        ))}

        <Button
          // pos="absolute"
          // bottom="20px"
          mt="16px !important"
          leftIcon={<Icon type="logout" />}
          variant="ghost"
          p="16px 38px"
          w="100%"
          // w="calc(100% - (16px * 4))"
          minH="57px"
          maxH="fit-content"
          h="fit-content"
          borderRadius="2px"
          justifyContent="flex-start"
          // bg="#C2C8D11f"
          color="brand.greyText"
          fontSize="sm"
          // onClick={() => logout()}
          _hover={{
            bg: "#EFF0F6",
          }}
        >
          Logout
        </Button>
      </VStack>
    </Box>
  );
};

export default Sidebar;
