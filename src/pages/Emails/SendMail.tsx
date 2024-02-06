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

  const { activeUser } = SendEmail();

  const handleSendMail = async () => {
    // Implement your logic to send the email here
    try {
        // Call the activeUser function to send the email
        const result = await activeUser({
          subject: subject,
          message: content, // Add your message here
          subscriptionStatus: email,
        });
        
        console.log("Email sent successfully:", result);
      } catch (error) {
        console.error("Error sending email:", error);
      }
    // console.log("Email:", email);
    // console.log("Subject:", subject);
    // console.log("content", content);
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
                        console.log("sub", e.target.value)
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
                    <option value="group2">Group 2</option>
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
                  onClick={()=>handleSendMail()}
                  type="button"
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
