import {
  Box,
  BoxProps,
  Button,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { navigate } from "@reach/router";
import Empty from "assets/images/folder.png";
import { Icon } from "components";
import Gravatar from "components/Gravatar/Gravatar";
import MobileDataSkeleton from "components/MobileDataSkeleton";
import configs from "config";
import { UserRo } from "interfaces";
import { join } from "lodash";
import CSStatus from "./CSStatus";

interface MobileAdminDataProps extends BoxProps {
  data?: UserRo[];
  isLoading?: boolean;
  isRemoving?: boolean;
  currentId: string | "none";
  setId: (id: string | "none") => void;
  onOpen: () => void;
}

function MobileAdminData(props: MobileAdminDataProps) {
  const { data = [], isLoading, currentId, isRemoving, setId, onOpen } = props;

  // Loading state - show 3 skeleton items
  if (isLoading) {
    return <MobileDataSkeleton count={10} />;
  }

  // Empty state
  if (!data.length) {
    return (
      <VStack maxW="200px" mx="auto" my="180px" hideFrom={"md"}>
        <Image src={Empty} alt="empty list" boxSize="150px" />
        <Text textAlign="center" fontSize="14px">
          Sorry, it looks like you have nothing here yet
        </Text>
      </VStack>
    );
  }

  return (
    <VStack spacing={4} width="full" hideFrom={"md"}>
      {data.map((admin, index) => (
        <Box
          key={`subscription-${index}`}
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          fontSize="sm"
          w="full"
        >
          <VStack alignItems="stretch" gap="12px">
            <Gravatar
              src={admin?.profilePhotoUrl}
              title={join([admin?.first_name, admin?.last_name], " ")}
              onClick={() => navigate(`${configs.paths.users}/${admin?._id}`)}
            />
            <HStack justifyContent="space-between">
              <Box>
                <Text mb="8px">Email:</Text>
                <Text fontSize="14px" fontWeight="bold">
                  {admin?.email}
                </Text>
              </Box>
            </HStack>
            <Box>
              <Text mb="8px">
                Phone Number:
              </Text>
              <Text fontSize="14px" fontWeight="bold">
                {admin?.phone}
              </Text>
            </Box>
            <HStack justifyContent="space-between">
              <Button
                size="xs"
                aria-label="edit"
                variant="transparent"
                color="brand.error"
                leftIcon={<Icon type="delete" />}
                disabled={isRemoving && currentId === admin?._id}
                isLoading={isRemoving && currentId === admin?._id}
                onClick={() => {
                  setId(admin?._id);
                  onOpen();
                }}
              >
                Revoke Privilege
              </Button>
              <CSStatus adminId={admin?._id} />
            </HStack>
          </VStack>
        </Box>
      ))}
    </VStack>
  );
}

export default MobileAdminData;
