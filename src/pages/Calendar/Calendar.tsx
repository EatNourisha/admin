import { Box } from "@chakra-ui/react";
import { MainLayoutContainer, Topbar } from "components";

export default function Calendar() {
  return (
    <Box>
      <Topbar pageTitle="Calendar" />
      <MainLayoutContainer>Calendar</MainLayoutContainer>
    </Box>
  );
}
