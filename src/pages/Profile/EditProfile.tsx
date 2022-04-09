import {
  Button,
  Container,
  FormControl,
  Heading,
  HStack,
  Select,
  Stack,
} from "@chakra-ui/react";
import {
  Gravatar,
  Icon,
  Input,
  MainLayoutContainer,
  PageMotion,
  Topbar,
} from "components";
import InputLabel from "components/InputLabel/InputLabel";

export default function AddAdmin() {
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
              >
                Back
              </Button>
            </HStack>

            <Heading fontSize="2xl" mb="56px !important">
              Edit Profile
            </Heading>

            <Gravatar variant="vert" />

            <Stack mt="46px !important" as="form" gridGap="24px">
              <HStack gridGap="24px">
                <FormControl>
                  <InputLabel>Name</InputLabel>
                  <Input
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder="Abake Daniel"
                  />
                </FormControl>
                <FormControl>
                  <InputLabel>Email</InputLabel>
                  <Input
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder="abakedaniel@email.com"
                  />
                </FormControl>
              </HStack>
              <HStack gridGap="24px">
                <FormControl>
                  <InputLabel>Role</InputLabel>
                  <Select placeholder="Select Role">
                    <option>Value</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>Phone Number</InputLabel>
                  <Input
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder="(603) 555-0123"
                  />
                </FormControl>
              </HStack>

              <HStack>
                <Button>Save Changes</Button>
              </HStack>
            </Stack>
          </Stack>
        </Container>
      </MainLayoutContainer>
    </PageMotion>
  );
}
