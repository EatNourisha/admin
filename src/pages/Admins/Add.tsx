import {
  Button,
  Container,
  FormControl,
  Heading,
  HStack,
  Select,
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
} from "components";
import InputLabel from "components/InputLabel/InputLabel";
import configs from "config";

export default function AddAdmin() {
  return (
    <PageMotion key="admin-add">
      <Topbar pageTitle="Administrators" />

      <MainLayoutContainer>
        <Container maxW="3xl" m="0">
          <Stack>
            <HStack>
              <Button
                size="xs"
                color="brand.black"
                variant="transparent"
                leftIcon={<Icon type="leftArrow" />}
                onClick={() => navigate(configs.paths.administrators)}
              >
                Back
              </Button>
            </HStack>

            <Heading fontSize="2xl" mb="56px !important">
              New Administrator
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
                    placeholder="John Doe"
                  />
                </FormControl>
                <FormControl>
                  <InputLabel>Email</InputLabel>
                  <Input
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder="johndoe@email.com"
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
                    startAdornment={"+234"}
                    // placeholder="johndoe@email.com"
                  />
                </FormControl>
              </HStack>

              <HStack>
                <Button>Add Role</Button>
              </HStack>
            </Stack>
          </Stack>
        </Container>
      </MainLayoutContainer>
    </PageMotion>
  );
}
