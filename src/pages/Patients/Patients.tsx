import { Box } from "@chakra-ui/react";
import { MainLayoutContainer, Topbar } from "components";

export default function Patients() {
  return (
    <Box>
      <Topbar pageTitle="Patients" />
      <MainLayoutContainer>Patients</MainLayoutContainer>
    </Box>
  );
}
