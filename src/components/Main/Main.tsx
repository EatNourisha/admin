import { Box } from "@chakra-ui/react";
import { useLocation } from "@reach/router";
import MobileNav from "components/MobileNav/MobileNav";

const Main = (props: any) => {
  const location = useLocation();
  return (
    <Box
      w="100%"
      pos="relative"
      left={{ base: 0, lg: "var(--sideNavWidth)" }}
      width="100%"
      maxW={{ base: "100%", lg: "calc(100% - var(--sideNavWidth))" }}
      minH="100vh"
      overflow-y="scroll"
    >
      <MobileNav location={location} />
      <Box>{props.children}</Box>
    </Box>
  );
};

export default Main;
