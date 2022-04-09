import { Box, Button, HStack, VStack, Image, Text } from "@chakra-ui/react";
import { Link, MainLayoutContainer, PageMotion, Topbar } from "components";

import EmptyFolder from "assets/images/folder.png";
import configs from "config";
import { navigate } from "@reach/router";

function EmptyState() {
  return (
    <Box>
      <HStack justifyContent="flex-end">
        <Button onClick={() => navigate(configs.paths.addAdministrator)}>
          Add Administrator
        </Button>
      </HStack>

      <VStack
        py="180px"
        justifyContent="center"
        maxW="200px"
        textAlign="center"
        m="0 auto"
        alignItems="center"
      >
        <Image boxSize="120px" src={EmptyFolder} alt="" />
        <Text>Sorry, it looks like you have nobody yet</Text>
        <Link
          to={configs.paths.addAdministrator}
          textDecoration="underline"
          color="brand.primary"
          fontWeight="bold"
        >
          Add Administrator
        </Link>
      </VStack>
    </Box>
  );
}

export default function Admins() {
  return (
    <PageMotion key="admins-root">
      <Topbar pageTitle="Administrators" />
      <MainLayoutContainer>
        <EmptyState />
      </MainLayoutContainer>
    </PageMotion>
  );
}
