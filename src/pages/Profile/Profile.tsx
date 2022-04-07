import { Box } from "@chakra-ui/react";
import { MainLayoutContainer, Topbar } from "components";

export default function Profile() {
  return (
    <Box>
      <Topbar pageTitle="Profile" />
      <MainLayoutContainer>Profile</MainLayoutContainer>
    </Box>
  );
}
