// import { Box } from "@chakra-ui/react";
import { MainLayoutContainer, PageMotion, Topbar } from "components";

export default function Calendar() {
  return (
    <PageMotion key="calendar-home">
      <Topbar pageTitle="Calendar" />
      <MainLayoutContainer>Calendar</MainLayoutContainer>
    </PageMotion>
  );
}
