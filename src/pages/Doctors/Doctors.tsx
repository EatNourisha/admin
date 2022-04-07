import { Box } from "@chakra-ui/react";
import { MainLayoutContainer, Topbar } from "components";

export default function Doctors() {
  return (
    <Box>
      <Topbar pageTitle="Doctors" />
      <MainLayoutContainer>Doctors</MainLayoutContainer>
    </Box>
  );
}
