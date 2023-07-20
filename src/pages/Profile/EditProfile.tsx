import {
  Button,
  Container,
  FormControl,
  Heading,
  HStack,
  Select,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { navigate } from "@reach/router";
import {
  Gravatar,
  Icon,
  Input,
  MainLayoutContainer,
  PageMotion,
  Topbar,
  InputLabel,
  ConfirmationModal,
} from "components";

import configs from "config";
import usePartialState from "hooks/usePartialState";
import useUpdateProfile from "hooks/useUpdateProfile";
import useUser from "hooks/useUser";
import { UserRo } from "interfaces";
import { capitalize, isEqual } from "lodash";
import { useEffect, useMemo } from "react";

interface IFormState {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

function transformed(user: UserRo) {
  return {
    first_name: user?.first_name,
    last_name: user?.last_name,
    email: user?.email,
    phone: user?.phone,
  };
}

export default function AddAdmin() {
  const toast = useToast();
  const { data, isLoading } = useUser();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const user = useMemo(() => data?.data, [data]);

  const { update, isLoading: isUpdating, isSuccess } = useUpdateProfile();

  const [state, set] = usePartialState<IFormState>(
    transformed((user ?? {}) as any),
    [user]
  );

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onOpen();
  };

  const updateProfile = async () => {
    onClose();
    const reqData = { ...state };

    // Object.assign(reqData, {
    //   first_name: first ?? user?.first_name,
    //   last_name: last ?? user?.last_name,
    // });
    // }
    // console.log("STATE", reqData);

    await update(reqData);
  };

  const isDisabled = useMemo(
    () =>
      isEqual(transformed(user ?? ({} as any)), { ...state }) ||
      isLoading ||
      isUpdating,
    [isLoading, isUpdating, state, user]
  );

  useEffect(() => {
    if (isSuccess) {
      toast({
        position: "bottom-right",
        title: "Success 🎉",
        description: "Profile successfully updated",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      navigate(configs.paths.profile);
    }
  }, [isSuccess, toast]);

  return (
    <PageMotion key="profile-edit">
      <Topbar pageTitle="Profile" />

      <MainLayoutContainer>
        <Container maxW="3xl" m="0">
          <Stack>
            <HStack>
              <Button
                size="xs"
                color="brand.black"
                variant="transparent"
                leftIcon={<Icon type="leftArrow" />}
                onClick={() => navigate(configs.paths.profile)}
              >
                Back
              </Button>
            </HStack>

            <Heading fontSize="2xl" mb="56px !important">
              Edit Profile
            </Heading>

            <Gravatar
              initials={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
              isLoading={isLoading}
              variant="vert"
              src={user?.profilePhotoUrl}
            />

            <Stack
              mt="46px !important"
              as="form"
              gridGap="24px"
              onSubmit={handleSubmit}
            >
              <HStack gridGap="24px">
                <FormControl>
                  <InputLabel>Firstname</InputLabel>
                  <Input
                    isRequired={false}
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={`Enter firstname`}
                    value={state?.first_name ?? user?.last_name}
                    onChange={(e) => set({ first_name: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <InputLabel>Lastname</InputLabel>
                  <Input
                    isRequired={false}
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={`Enter lastname`}
                    value={state?.last_name ?? user?.first_name}
                    onChange={(e) => set({ last_name: e.target.value })}
                  />
                </FormControl>
              </HStack>
              <HStack gridGap="24px">
                <FormControl>
                  <InputLabel>Email</InputLabel>
                  <Input
                    isDisabled
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={user?.email ?? ""}
                    value={user?.email ?? ""}
                    onChange={undefined}
                  />
                </FormControl>
                <FormControl>
                  <InputLabel>Phone Number</InputLabel>
                  <Input
                    isRequired={false}
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={user?.phone ?? ""}
                    value={state?.phone}
                    // onChange={(e) => set({ phone: e.target.value })}
                  />
                </FormControl>
              </HStack>
              <HStack gridGap="24px">
                <FormControl w="50%">
                  <InputLabel>Role</InputLabel>
                  <Select borderRadius="4px">
                    <option value={user?.primary_role ?? ""}>
                      {capitalize(user?.primary_role ?? "")}
                    </option>
                  </Select>
                </FormControl>
                <FormControl w="50%" visibility="hidden"></FormControl>
              </HStack>

              <HStack>
                <Button
                  isDisabled={isDisabled}
                  isLoading={isUpdating}
                  type="submit"
                >
                  Save Changes
                </Button>
              </HStack>
            </Stack>
          </Stack>
        </Container>
      </MainLayoutContainer>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        title="Confirm"
        onConfirm={updateProfile}
        buttonText={["Save"]}
        description="Are you sure you want to these save changes"
      />
    </PageMotion>
  );
}
