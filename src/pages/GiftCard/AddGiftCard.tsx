import {
  Button,
  Container,
  Divider,
  FormControl,
  Heading,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { navigate } from "@reach/router";
import {
  Icon,
  Input,
  InputLabel,
  MainLayoutContainer,
  PageMotion,
  Topbar,
} from "components";

import { ApiResponse, GiftCardRo } from "interfaces";
import { useState } from "react";
import { post } from "utils";

export default function AddMeal() {
  const [values, setValues] = useState<GiftCardRo>({
    subscription_interval: "month",
  } as GiftCardRo);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const res = (
      await post<ApiResponse<GiftCardRo>, GiftCardRo>("/gift", values)
    ).data as GiftCardRo;

    if (res) {
      toast({
        position: "bottom-right",
        title: "Gift card added",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      navigate(-1);
    }
    setLoading(false);
  };

  return (
    <PageMotion key="meal-add">
      <Topbar pageTitle="Meals" />

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

            <Heading
              fontSize="2xl"
              mb={{ base: "20px !important", md: "40px !important" }}
            >
              Add Gift Card
            </Heading>

            <Stack
              my={{ base: "20px !important", md: "40px !important" }}
              as="form"
              gap={{ base: "10px", md: "20px" }}
              onSubmit={handleSubmit}
            >
              <Stack
                direction={{ base: "column", md: "row" }}
                gap={{ base: "10px", md: "20px" }}
              >
                <FormControl>
                  <InputLabel>Name</InputLabel>
                  <Input
                    isRequired={false}
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={""}
                    value={values?.name}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        name: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl>
                  <InputLabel>Amount</InputLabel>
                  <NumberInput
                    isRequired
                    value={values?.amount ?? 0}
                    onChange={(value) =>
                      setValues({
                        ...values,
                        amount: parseInt(value),
                      })
                    }
                  >
                    <NumberInputField
                      bg="white !important"
                      borderWidth="2px"
                      borderColor="brand.neutral200"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </Stack>

              <FormControl>
                <InputLabel>Subscription Interval</InputLabel>
                <Input
                  bg="white !important"
                  borderWidth="2px"
                  borderColor="brand.neutral200"
                  placeholder={""}
                  value={"month"}
                  opacity={0.3}
                  isReadOnly
                />
              </FormControl>

              <Divider />

              <HStack>
                <Button isLoading={loading} type="submit">
                  Save Changes
                </Button>
              </HStack>
            </Stack>
          </Stack>
        </Container>
      </MainLayoutContainer>
    </PageMotion>
  );
}
