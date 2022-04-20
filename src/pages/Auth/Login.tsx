import {
  Box,
  FormControl,
  VStack,
  Container,
  Button,
  Heading,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { LoginDto } from "interfaces";
import { useState, useEffect, useMemo } from "react";

// import { useDispatch, useSelector } from "react-redux";
// import { login, selectAuth } from "store/slices";
import useAuth from "hooks/useAuth";

import { navigate } from "@reach/router";
import { Link, InputLabel, Input, PasswordInput } from "components";

import configs from "config";

const Login = (props: any) => {
  const [state, setState] = useState<Partial<LoginDto> | null>(null);

  const { login, status, isSignedIn, token, sub } = useAuth();

  const handleState = (newState: Partial<LoginDto>) => {
    setState({ ...state, ...newState });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await login(state as LoginDto);
  };

  const isDisabled = useMemo(
    () => !(state?.email && state?.password) || status === "loading",
    [state, status]
  );

  console.log("AUTH DATA", { isSignedIn, token, sub });

  useEffect(() => {
    if (isSignedIn && token) {
      navigate(configs.paths.dashboard);
    }
  }, [isSignedIn, token]);

  return (
    <VStack>
      <HStack
        maxW={configs.containerW}
        w="100%"
        justifyContent="flex-end"
        px="18px"
      >
        {/* <Link to={configs.paths.register}>
          <HStack>
            <Text>Don’t have an account?</Text>{" "}
            <Text color="brand.primary">Register</Text>
          </HStack>
        </Link> */}
      </HStack>

      <Container maxW="md">
        <Box py="60px">
          <Box mb="20px">
            <Heading fontSize="3xl">Sign in to your account</Heading>
            {/* <Text color="brand.greyText">
            Enter your details below to get started on Genera
          </Text> */}
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
            <FormControl>
              <InputLabel>Password</InputLabel>
              <PasswordInput
                isRequired
                value={state?.password ?? ""}
                onChange={(e) => handleState({ password: e.target.value })}
                name="password"
                placeholder="Password"
              />
            </FormControl>

            <Stack justifyContent="flex-end" w="100%">
              <Link
                w="fit-content"
                alignSelf="flex-end"
                textDecoration="none"
                color="#1351FC"
                mb="30px"
                mt="10px"
                to={configs.paths.forgotPassword}
              >
                Forgot password?
              </Link>
              <Button
                w="100%"
                isLoading={status === "loading"}
                disabled={isDisabled}
                type="submit"
                // alignSelf="flex-end"
                // onClick={handleSubmit}
              >
                Log in
              </Button>
            </Stack>
          </VStack>
        </Box>
      </Container>
    </VStack>
  );
};

export default Login;
