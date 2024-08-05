import {
  Button,
  Container,
  FormControl,
  Heading,
  HStack,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { navigate } from "@reach/router";
import {
  Input,
  InputLabel,
  MainLayoutContainer,
  PageMotion,
  Topbar,
} from "components";
import { createGiftCardScheme } from "config/scheme";
import { FormikHelpers, useFormik } from "formik";
import { ApiResponse } from "interfaces";
import { useState } from "react";
import { post } from "utils/makeRequest";

function GiftCards() {
  const toast = useToast();
  const [ loading, setLoading] = useState(false);
  const onSubmit = async (
    data: {
      name: string;
      amount: string;
      subscription_interval: string;
    },
    action: FormikHelpers<any>
  ) => {
    setLoading(true);
    const res = (await post<ApiResponse<any>, {}>(`/gift/custom`, data))
      .data as any;
    if (res?._id) {
      toast({
        position: "bottom-right",
        title: "Success",
        description: "Gift card created successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      action.resetForm();
      navigate("/giftcards/list");
    setLoading(false);

    }
  };
  const { values, handleChange, handleSubmit, errors, isValid } = useFormik({
    validationSchema: createGiftCardScheme,
    initialValues: {
      name: "",
      amount: "",
      subscription_interval: "",
    },
    onSubmit,
  });

  return (
    <PageMotion key="users-root" pb="100px">
      <Topbar pageTitle="Gift cards" />

      <MainLayoutContainer>
        <Container maxW="3xl" m="0">
          <Stack>
            <Heading fontSize="2xl" mb="56px !important">
              Add Plan
            </Heading>

            <Stack
              my="46px !important"
              as="form"
              gridGap="24px"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <HStack gap="24px">
                <FormControl>
                  <InputLabel>Name</InputLabel>
                  <Input
                    isRequired={false}
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={""}
                    value={values?.name}
                    onChange={handleChange("name")}
                  />
                  {errors.name && <Text color="red">{errors.name}</Text>}
                </FormControl>

                <FormControl>
                  <InputLabel>Amount</InputLabel>
                  <Input
                    type="number"
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={""}
                    value={values?.amount}
                    onChange={handleChange("amount")}
                    endAdornment={
                      <Text fontSize="md" textTransform="uppercase">
                        £GBP
                      </Text>
                    }
                  />
                  {errors.amount && <Text color="red">{errors.amount}</Text>}
                </FormControl>
              </HStack>

              <HStack gridGap="24px">
                <FormControl>
                  <InputLabel>SUNSCRIPTION INTERVAL</InputLabel>
                  <Select
                    placeholder="Select Interval"
                    borderRadius="4px"
                    value={values?.subscription_interval ?? ""}
                    onChange={handleChange("subscription_interval")}
                  >
                    <option value={"week"}>Weekly</option>
                    <option value={"week"}>Monthly</option>
                  </Select>
                  {errors.subscription_interval && (
                    <Text color="red">{errors.subscription_interval}</Text>
                  )}
                </FormControl>
              </HStack>

              <HStack className="flex">
                <Button
                  disabled={!isValid}
                    isLoading={loading}
                  type="submit"
                >
                  Add Gift Card
                </Button>
              </HStack>
            </Stack>
          </Stack>
        </Container>
      </MainLayoutContainer>
    </PageMotion>
  );
}

export default GiftCards;
