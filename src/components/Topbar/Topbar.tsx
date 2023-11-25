import { FC, ReactNode } from "react";
import {
  // Badge,
  // Box,
  BoxProps,
  // Button,
  Heading,
  HStack,
  Stack,
  Skeleton,
  Progress,
  Button,
  // SkeletonCircle,
} from "@chakra-ui/react";

import MainLayoutContainer from "../MainLayoutContainer/MainLayoutContainer";
import Icon from "components/Icon/Icon";
import { navigate } from "@reach/router";
// import Icon from "../Icon/Icon";
// import Input from "../Input/Input";

// const NotificationsIcon = () => <Icon type="notifications" />;

interface TopbarProps extends BoxProps {
  isLoading?: boolean;
  pageTitle?: string;
  action?: ReactNode;
  isDownloading?: boolean;
  progressValue?: number;
}

// const NotificationButton = () => {
//   return (
//     <Button
//       pos="relative"
//       boxSize="40px"
//       minW="40px"
//       minH="40px"
//       d="flex"
//       justifyContent="center"
//       alignItems="center"
//       aria-label="notification button"
//       variant="unstyled"
//       _hover={{ bg: "transparent" }}
//       _focus={{ bg: "transparent" }}
//       _active={{ bg: "transparent" }}
//       h="fit-content"
//       border="1px solid transparent"
//       borderColor="brand.neutral"
//       borderRadius="50%"
//       filter="drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.1))"

//       //   _before={{
//       //     content: "'2'",
//       //     pos: "absolute",
//       //     boxSize: "20px",
//       //     bg: "brand.green",
//       //   }}
//     >
//       <Box as={NotificationsIcon} />
//       <Badge
//         pos="absolute"
//         top="6px"
//         right="10px"
//         bg="brand.deepRed"
//         borderRadius="50%"
//         boxSize="10px"
//         // w="fit-content"
//         d="flex"
//         alignItems="center"
//         justifyContent="center"
//         color="white"
//       ></Badge>
//     </Button>
//   );
// };

const Topbar: FC<TopbarProps> = (props) => {
  const {
    pageTitle,
    action,
    isLoading,
    isDownloading,
    progressValue,
    ...xprops
  } = props;
  return (
    <Stack
      h="fit-content"
      top="0"
      pos="sticky"
      zIndex="99"
      // py="14px"
      // px="16px"

      mb="26px"
      // backdropFilter="blur(10px)"
      // mt="52px"
      borderBottom="1px solid #D0D5DD"
      // pos="relative"
      {...xprops}
    >
      <HStack w="100%" pos="relative" bg="white" minH="100px">
        <MainLayoutContainer>
          <HStack w="100%" justifyContent="space-between">
            <Stack>
              <Skeleton isLoaded={!isLoading || true}>
                <Heading fontSize="3xl" fontWeight="700" letterSpacing="-2px">
                  {pageTitle}
                </Heading>
              </Skeleton>
              {action && action}
            </Stack>

            <HStack>
              {/* <Input
              w="100%"
              minW="380px"
              mr="20px !important"
              placeholder="Enter your search term"
              startAdornment={<Icon type="search" />}
            /> */}
              {/* <SkeletonCircle isLoaded={!isLoading ?? true}>
              <NotificationButton />
            </SkeletonCircle> */}
              {pageTitle?.toLowerCase().includes("admin") && (
                <Button
                  size="sm"
                  variant="transparent"
                  leftIcon={<Icon type="admin" />}
                  onClick={() => navigate("/admins/settings")}
                >
                  Settings
                </Button>
              )}
              {pageTitle?.toLowerCase().includes("meal") && (
                <Button
                  size="sm"
                  variant="transparent"
                  leftIcon={<Icon type="subscriptions" />}
                  onClick={() => navigate("/meals/orders")}
                >
                  View Orders
                </Button>
              )}
            </HStack>
          </HStack>
        </MainLayoutContainer>
        {isDownloading && (
          <Progress
            ml="0 !important"
            size="xs"
            isIndeterminate={
              isDownloading && !!progressValue && progressValue <= 0
            }
            pos="absolute"
            w="100%"
            bottom="0"
            colorScheme="primary"
            value={progressValue}
          />
        )}
      </HStack>
    </Stack>
  );
};

export default Topbar;
