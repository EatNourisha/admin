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
import { capitalize } from "lodash";
import { useMemo } from "react";

export default function Profile() {
  const { data, isLoading } = useUser();

  const user = useMemo(() => data?.data, [data]);

  return (
    <PageMotion key="profile-root">
      <Topbar pageTitle="Profile" />
      <MainLayoutContainer>
        <Box
          p="38px"
          borderRadius="24px"
          maxW="calc(100% - 65vh)"
          border="2px solid transparent"
          borderColor="brand.neutral100"
        >
          <HStack w="100%" justifyContent="flex-end">
            {/* <Button
              size="xs"
              color="brand.black"
              variant="transparent"
              fontSize="md"
              fontWeight="600"
              leftIcon={<Icon type="leftArrow" />}
            >
              Back
            </Button> */}
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
              title={`${user?.firstName} ${user?.lastName}`}
              subtitle={capitalize(user?.gender ?? "male")}
              _subtitle={{ textTransform: "unset" }}
            />
          </VStack>

          <HStack gridGap="20px">
            <Box
              w="100%"
              p="24px 22px"
              borderRadius="24px"
              shadow="0px 6px 40px rgba(0, 0, 0, 0.05)"
            >
              <Text fontSize="14px" fontWeight="400" color="brand.neutral500">
                Role
              </Text>

              <Text fontSize="18px">{capitalize(user?.roles[0])}</Text>
            </Box>
            <Box
              w="100%"
              p="24px 22px"
              borderRadius="24px"
              shadow="0px 6px 40px rgba(0, 0, 0, 0.05)"
            >
              <Text fontSize="14px" fontWeight="400" color="brand.neutral500">
                Phone Number
              </Text>

              <Skeleton
                isLoaded={!isLoading ?? true}
                w="fit-content"
                h="20px"
                borderRadius="12px"
                mt="8px"
              >
                <Text fontSize="18px">{user?.phone}</Text>
              </Skeleton>
            </Box>
          </HStack>
        </Box>
      </MainLayoutContainer>
    </PageMotion>
  );
}
