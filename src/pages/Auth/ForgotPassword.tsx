import {
  Box,
  FormControl,
  VStack,
  Container,
  Button,
  Heading,
  Text,
  Stack,
} from "@chakra-ui/react";
import { RequestPasswordResetDto } from "interfaces";
import { useState, useMemo } from "react";

import { Input, Icon } from "components";

import useAuth from "hooks/useAuth";

const ForgotPassword = (props: any) => {
  const [state, setState] = useState<Partial<RequestPasswordResetDto> | null>(
    null
  );

  const { forgotPassword, passwordReset } = useAuth();

  //   const status: string = "idle";

  const handleState = (newState: Partial<RequestPasswordResetDto>) => {
    setState({ ...state, ...newState });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    forgotPassword(state as RequestPasswordResetDto);
    setTimeout(() => setState(null), 2000);
  };

  const isDisabled = useMemo(
    () => !state?.email || passwordReset?.status === "loading",
    [state, passwordReset]
  );

  //   useEffect(() => {
  //     if (isSignedIn && token) {
  //       navigate("/");
  //     }
  //   }, [isSignedIn, token]);

  return (
    <VStack my="80px" justifyContent="center">
      {/* <Topbar /> */}

      <Container maxW="md">
        <Box py="60px">
          <VStack mb="32px">
            <Icon
              mb="60px !important"
              color="brand.primary"
              type="fullLogo"
              h="128px"
            />

            <VStack mb="20px">
              <Heading fontFamily="var(--manjari)" fontSize="2xl">
                Forgot Password
              </Heading>
              <Text mt="0 !important" fontSize="sm" color="brand.greyText">
                Enter your Email and we will send you a reset instruction
              </Text>
            </VStack>
          </VStack>

          <VStack as="form" onSubmit={handleSubmit}>
            <FormControl>
              <Input
                isRequired
                value={state?.email ?? ""}
                onChange={(e) => handleState({ email: e.target.value })}
                name="email"
                placeholder="Email"
                type="email"
              />
            </FormControl>

            <Stack justifyContent="flex-end" w="100%">
              <Button
                w="100%"
                mt="30px"
                isLoading={passwordReset?.status === "loading"}
                disabled={isDisabled}
                // alignSelf="flex-end"
                onClick={handleSubmit}
                type="submit"
              >
                Reset Password
              </Button>
            </Stack>
          </VStack>
        </Box>
      </Container>
    </VStack>
  );
};

export default ForgotPassword;
