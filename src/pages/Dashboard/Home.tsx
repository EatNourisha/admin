import { Box } from "@chakra-ui/react";
import { MainLayoutContainer, Topbar } from "components";

export default function Home() {
  return (
    <Box>
      <Topbar pageTitle="Dashboard" />
      <MainLayoutContainer>Dashboard</MainLayoutContainer>
    </Box>
  );
}
