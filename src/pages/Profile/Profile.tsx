import { Box, Button, HStack, Skeleton, Text, VStack } from "@chakra-ui/react";
import { navigate } from "@reach/router";
import {
  MainLayoutContainer,
  Topbar,
  Icon,
  Gravatar,
  PageMotion,
} from "components";
import configs from "config";
import useUser from "hooks/useUser";
import { capitalize, join } from "lodash";
import { useMemo } from "react";
// import uploadFile from "utils/do";

export default function Profile() {
  const { data, isLoading } = useUser();

  const user = useMemo(() => data?.data, [data]);

  return (
    <PageMotion key="profile-root">
      <Topbar pageTitle="Profile" />
      <MainLayoutContainer>
        <Box
          p={{ base: "16px", md: "38px" }}
          borderRadius="12px"
          w="100%"
          border="2px solid transparent"
          borderColor="brand.neutral100"
        >
          <HStack w="100%" justifyContent="flex-end">
            <Button
              size="xs"
              color="brand.black"
              variant="transparent"
              fontSize="md"
              fontWeight="600"
              leftIcon={<Icon type="edit" />}
              onClick={() => navigate(configs.paths.editProfile)}
            >
              Edit
            </Button>
          </HStack>

          <VStack pt="44px" pb="74px">
            <Gravatar
              variant="vert"
              isLoading={isLoading}
              src={user?.profilePhotoUrl}
              title={join([user?.first_name, user?.last_name], " ")}
              subtitle={capitalize(user?.gender ?? "male")}
              _subtitle={{ textTransform: "unset" }}
            />
          </VStack>

          <HStack gap={{ base: "10px", md: "20px" }}>
            <Box
              w="100%"
              p={{ base: "16px", md: "22px" }}
              borderRadius="12px"
              shadow="0px 6px 40px rgba(0, 0, 0, 0.05)"
            >
              <Text fontSize="14px" fontWeight="400" color="brand.neutral500">
                Role
              </Text>

              <Text fontSize={{ base: "16px", md: "18px" }}>
                {capitalize(user?.primary_role ?? "")}
              </Text>
            </Box>
            <Box
              w="100%"
              p={{ base: "16px", md: "22px" }}
              borderRadius="12px"
              shadow="0px 6px 40px rgba(0, 0, 0, 0.05)"
            >
              <Text fontSize="14px" fontWeight="400" color="brand.neutral500">
                Phone Number
              </Text>

              <Skeleton
                isLoaded={!isLoading}
                w="fit-content"
                h="20px"
                borderRadius="12px"
                mt="8px"
              >
                <Text fontSize={{ base: "16px", md: "18px" }}>
                  {user?.phone}
                </Text>
              </Skeleton>
            </Box>
          </HStack>
        </Box>
      </MainLayoutContainer>
    </PageMotion>
  );
}
