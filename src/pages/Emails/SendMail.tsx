import { useState } from 'react';
import {
    // Box,
    Button,
    // Center,
    Container,
    // Divider,
    FormControl,
    // Grid,
    Heading,
    HStack,
    // IconButton,
    // Image,
    // Select,
    Stack,
    // Switch,
    // Text,
  } from "@chakra-ui/react";
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
  } from "components"

export default function SendMail() {
  const [email, setEmail] = useState<string>('');
  const [subject, setSubject] = useState<string>('');

  const handleSendMail = () => {
    // Implement your logic to send the email here
    console.log('Email:', email);
    console.log('Subject:', subject);
  };

  return (
    <PageMotion key="users-root" pb="100px">
        <Topbar
        pageTitle="Send Mail"
      />
       <MainLayoutContainer>
        <Container maxW="3xl" m="0">
          <Stack>

            <Gravatar
              initials={"Send Emails"}
              //   isLoading={isLoading}
              variant="vert"
              //   src={user?.profilePhotoUrl}
            />

            <Stack
              my="46px !important"
              as="form"
              gridGap="24px"
            //   onSubmit={handleSubmit}
            >
              <HStack gridGap="24px">
                <FormControl>
                  <InputLabel>Subject</InputLabel>
                  <Input
                    isRequired={false}
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={"Enter Subject"}
                    // value={state?.title}
                    // onChange={(e) => set({ title: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <InputLabel>Email Address</InputLabel>
                  <Input
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={"Enter User Group"}
                    // value={state?.tag ?? ""}
                    // onChange={(e) => set({ tag: e.target.value })}
                  />
                </FormControl>
              </HStack>
              

              <FormControl>
                <InputLabel>Content</InputLabel>
                <Textarea
                  borderWidth="2px"
                  borderColor="brand.neutral200"
                  placeholder="Add content"
                //   value={state?.content ?? ""}
                //   onChange={(e) => set({ content: e.target.value })}
                />
              </FormControl>

              <HStack>
                <Button
                //   disabled={isDisabled}
                //   isLoading={isSubmiting}
                  type="submit"
                >
                  Send Email
                </Button>
              </HStack>
            </Stack>
          </Stack>
        </Container>
      </MainLayoutContainer>
    </PageMotion>
  );
}
