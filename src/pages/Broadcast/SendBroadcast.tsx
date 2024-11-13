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
  ConfirmationModal,
  Gravatar,
  Input,
  InputLabel,
  MainLayoutContainer,
  PageMotion,
  Textarea,
  Topbar
} from "components";

import configs from "config";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { useBroadcastForm } from "./useBroadcastForm";

export default function AddBroadcast() {
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
        <Container p={0} maxW="3xl" m="0">
          <Stack>
            <HStack>
              <Button
                size="xs"
                mb="12px"
                color="brand.black"
                variant="transparent"
                leftIcon={<ArrowLeft size={16} />}
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
            </HStack>

            <Heading
              fontSize="2xl"
              mb={{ base: "20px !important", md: "40px !important" }}
            >
              Send Broadcast
            </Heading>

            <Gravatar initials={"Broadcast"} variant="vert" />

            <Stack
              my={{ base: "20px !important", md: "40px !important" }}
              as="form"
              gap={{ base: "16px", md: "24px" }}
              onSubmit={handleSubmit}
            >
              <Stack direction={{ base: "column", md: "row" }} gap={{ base: "16px", md: "24px" }}>
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
              </Stack>
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
