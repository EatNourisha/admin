import { Box } from "@chakra-ui/react";
import { MainLayoutContainer, Topbar } from "components";

export default function Appointments() {
  return (
    <Box>
      <Topbar pageTitle="Appointments" />
      <MainLayoutContainer>Appointments</MainLayoutContainer>
    </Box>
  );
}
