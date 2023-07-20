import {
  Button,
  Container,
  FormControl,
  Heading,
  HStack,
  Stack,
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
  Textarea,
} from "components";

import configs from "config";
import { useMemo } from "react";
import { useBroadcastForm } from "./useBroadcastForm";

export default function AddBroadcast() {
  //   const toast = useToast();

  const {
    set,
    state,
    isLoading: isSubmiting,
    isOpen,
    onClose,
    onOpen,
    submitForm,
  } = useBroadcastForm();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onOpen();
  };

  const isDisabled = useMemo(
    () => !(state?.title && state?.tag && state?.content) || isSubmiting,
    [state, isSubmiting]
  );

  return (
    <PageMotion key="broadcast-add">
      <Topbar pageTitle="Broadcasts" />

      <MainLayoutContainer>
        <Container maxW="3xl" m="0">
          <Stack>
            <HStack>
              <Button
                size="xs"
                color="brand.black"
                variant="transparent"
                leftIcon={<Icon type="leftArrow" />}
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
            </HStack>

            <Heading fontSize="2xl" mb="56px !important">
              Send Broadcast
            </Heading>

            <Gravatar
              initials={"Broadcast"}
              //   isLoading={isLoading}
              variant="vert"
              //   src={user?.profilePhotoUrl}
            />

            <Stack
              my="46px !important"
              as="form"
              gridGap="24px"
              onSubmit={handleSubmit}
            >
              <HStack gridGap="24px">
                <FormControl>
                  <InputLabel>Title</InputLabel>
                  <Input
                    isRequired={false}
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={"Enter Title"}
                    value={state?.title}
                    onChange={(e) => set({ title: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <InputLabel>Tag</InputLabel>
                  <Input
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={"Enter Tag"}
                    value={state?.tag ?? ""}
                    onChange={(e) => set({ tag: e.target.value })}
                  />
                </FormControl>
              </HStack>
              {/* <HStack gridGap="24px">
                <FormControl>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    placeholder="Select Currency"
                    borderRadius="4px"
                    value={state?.currency ?? ""}
                    onChange={(e) => set({ currency: e.target.value })}
                  >
                    <option value={"gbp"}>GBP</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>Interval</InputLabel>
                  <Select
                    placeholder="Select Interval"
                    borderRadius="4px"
                    value={state?.subscription_interval ?? ""}
                    onChange={(e) =>
                      set({ subscription_interval: e.target.value })
                    }
                  >
                    {Object.values(PlanInterval).map((intv, i) => (
                      <option key={`${intv}ly-interval`} value={intv}>
                        {capitalize(intv)}ly
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </HStack> */}

              <FormControl>
                <InputLabel>Content</InputLabel>
                <Textarea
                  borderWidth="2px"
                  borderColor="brand.neutral200"
                  placeholder="Add content"
                  value={state?.content ?? ""}
                  onChange={(e) => set({ content: e.target.value })}
                />
              </FormControl>

              <HStack>
                <Button
                  disabled={isDisabled}
                  isLoading={isSubmiting}
                  type="submit"
                >
                  Send Broadcast
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
        onConfirm={submitForm(() => {
          navigate(configs.paths.broadcasts, { replace: true });
        })}
        buttonText={["Send"]}
        description="Are you sure you want to send this broadcast?"
      />
    </PageMotion>
  );
}
