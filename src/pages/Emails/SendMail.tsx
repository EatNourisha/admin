import { useState } from "react";
import  SendEmail   from "hooks/useSendEmails"
import {
  // Box,
  Button,
  // Center,
  Container,
  // Divider,
  FormControl,
  // Grid,
//   Heading,
  HStack,
  // IconButton,
  // Image,
  Select,
  Stack,
  // Switch,
  // Text,
} from "@chakra-ui/react";
import {
  Gravatar,
//   Icon,
  Input,
  MainLayoutContainer,
  PageMotion,
  Topbar,
  InputLabel,
//   ConfirmationModal,
  Textarea,
} from "components";

export default function SendMail() {
  const [email, setEmail] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [content, setContent] = useState<string>("")

  const { activeUser, isLoading, isSuccess, isError } = SendEmail();

  const handleSendMail = async () => {
   
    try {
        
        await activeUser({
          subscriptionStatus: email,
          subject: subject,
          message: content, 
        });
        
      
      } catch (error) {
        console.error("Error sending email:", error);
      }

  };

  return (
    <PageMotion key="users-root" pb="100px">
      <Topbar pageTitle="Send Mail" />
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
                    value={subject}
                    onChange={(e) => {
                        setSubject(e.target.value)}
                }
                  
                  />
                </FormControl>
                <FormControl>
                  <InputLabel>Email Address</InputLabel>
                  <Select
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder="Enter User Group"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="incomplete_expired">Incomplete Expired</option>
                    <option value="expired">Expired</option>
                    <option value="">No Subscription</option>
                  </Select>
                </FormControl>
              </HStack>

              <FormControl>
                <InputLabel>Content</InputLabel>
                <Textarea
                  borderWidth="2px"
                  borderColor="brand.neutral200"
                  placeholder="Add content"
                 value={content}
                 onChange={(e) => setContent(e.target.value)}
                />
              </FormControl>

              <HStack>
                <Button
                  //   disabled={isDisabled}
                  //   isLoading={isSubmiting}
                  onClick={handleSendMail}
                  type="button"
                >
                   {isSuccess ? "Email Sent" : isError ? "Error Sending" : "Send Email"}
                </Button>
              </HStack>
            </Stack>
          </Stack>
        </Container>
      </MainLayoutContainer>
    </PageMotion>
  );
}
