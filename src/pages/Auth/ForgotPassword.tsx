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

import { InputLabel, Input } from "components";

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
    <VStack>
      {/* <Topbar /> */}

      <Container maxW="md">
        <Box py="60px">
          <Box mb="20px">
            <Heading fontSize="3xl">Forgot Password?</Heading>
            <Text fontSize="sm" color="brand.greyText" mt="10px">
              Enter the email address associated with your account, and we’ll
              email you an email to change your password.
            </Text>
          </Box>
          <VStack as="form" onSubmit={handleSubmit}>
            <FormControl>
              <InputLabel>Email Address</InputLabel>
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
                Send me instructions
              </Button>
            </Stack>
          </VStack>
        </Box>
      </Container>
    </VStack>
  );
};

export default ForgotPassword;
