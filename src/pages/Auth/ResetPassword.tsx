import {
  Box,
  FormControl,
  VStack,
  Container,
  Button,
  Heading,
  Text,
  FormHelperText,
  Stack,
} from "@chakra-ui/react";
import { ResetPasswordDto } from "interfaces";
import { useState, useEffect, useMemo } from "react";

import useAuth from "hooks/useAuth";

import { navigate, useLocation } from "@reach/router";
import { Icon, Link, PasswordInput } from "components";

import configs from "config";

const ResetPassword = (props: any) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [state, setState] = useState<Partial<
    ResetPasswordDto & { confirmPassword: string }
  > | null>(null);

  const { resetPassword, passwordReset } = useAuth();

  console.log("token", params.get("token"), params.get("sub"));

  const handleState = (newState: Partial<ResetPasswordDto>) => {
    setState({ ...state, ...newState });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    resetPassword({
      ...state,
      accountId: params.get("sub"),
      token: params.get("token"),
    } as ResetPasswordDto);
  };

  const doesNotMatch = useMemo(
    () =>
      Boolean(
        state?.password &&
          state?.confirmPassword &&
          state?.password !== state?.confirmPassword
      ),
    [state]
  );

  const isDisabled = useMemo(
    () =>
      !(state?.password && state?.confirmPassword) ||
      passwordReset?.status === "loading" ||
      doesNotMatch,
    [state, passwordReset, doesNotMatch]
  );

  useEffect(() => {
    if (passwordReset?.status === "success") {
      navigate(configs.paths.login);
    }
  }, [passwordReset]);

  return (
    <VStack my="80px">
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
                Reset Email Sent
              </Heading>
              <Text
                align="center"
                mt="0 !important"
                fontSize="sm"
                color="brand.greyText"
              >
                We have sent a reset email to your email janedoe@icould.com.
                <Link to="#" color="brand.primary">
                  Having problems?
                </Link>
              </Text>
            </VStack>
          </VStack>
          <VStack as="form" onSubmit={handleSubmit}>
            <FormControl>
              {/* <InputLabel>New Password</InputLabel> */}
              <PasswordInput
                isRequired
                isInvalid={doesNotMatch}
                value={state?.password ?? ""}
                onChange={(e) => handleState({ password: e.target.value })}
                name="newPassword"
                placeholder="New Password"
              />
            </FormControl>
            <FormControl>
              {/* <InputLabel>Confirm Password</InputLabel> */}
              <PasswordInput
                isRequired
                isInvalid={doesNotMatch}
                value={state?.confirmPassword ?? ""}
                onChange={(e) =>
                  handleState({ confirmPassword: e.target.value } as any)
                }
                name="confirmPassword"
                placeholder="Confirm New Password"
              />
              {doesNotMatch && (
                <FormHelperText fontSize="sm" color="red.400">
                  Passwords does not match
                </FormHelperText>
              )}
            </FormControl>

            <Stack justifyContent="flex-end" w="100%">
              <Button
                w="100%"
                mt="30px"
                disabled={isDisabled}
                isLoading={passwordReset?.status === "loading"}
                // alignSelf="flex-end"
                onClick={handleSubmit}
                type="submit"
              >
                Submit
              </Button>
            </Stack>
          </VStack>
        </Box>
      </Container>
    </VStack>
  );
};

export default ResetPassword;
