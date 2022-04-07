import { Box } from "@chakra-ui/react";

const Main = (props: any) => {
  return (
    <Box
      w="100%"
      pos="relative"
      left="var(--sideNavWidth)"
      maxW="calc(100% - var(--sideNavWidth))"
      // bg="#F5F6FA"
      minH="100vh"
      overflow-y="scroll"
    >
      {/* <Navbar /> */}

      <Box>{props.children}</Box>
    </Box>
  );
};

export default Main;
