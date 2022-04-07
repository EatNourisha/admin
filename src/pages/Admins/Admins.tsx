import { Box } from "@chakra-ui/react";
import { MainLayoutContainer, Topbar } from "components";

export default function Admins() {
  return (
    <Box>
      <Topbar pageTitle="Administrators" />
      <MainLayoutContainer>Administrators</MainLayoutContainer>
    </Box>
  );
}
