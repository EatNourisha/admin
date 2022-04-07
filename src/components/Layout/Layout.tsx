import { Box, BoxProps } from "@chakra-ui/react";
import Main from "../Main/Main";
import Sidebar from "../Sidebar/Sidebar";

interface LayoutProps {
  path?: any;
  location?: any;
  _sidebar?: BoxProps;
  _main?: BoxProps;
  children: any;
}

export default function Layout(props: LayoutProps) {
  const { _sidebar, _main, location, children } = props;
  return (
    <Box pos="relative" d="flex" bg="white">
      <Sidebar {...({ ..._sidebar, location } as any)} />
      <Main {..._main}>{children}</Main>
    </Box>
  );
}
