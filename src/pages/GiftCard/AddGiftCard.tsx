import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  FormControl,
  Grid,
  Heading,
  HStack,
  IconButton,
  Image,
  Select,
  Stack,
  Switch,
  Text,
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

import { useMemo, useState } from "react";
import { useMealForm } from "../Meals/useMealForm";
import { post, when } from "utils";
import { FilePreviewType } from "components/Uploader/Uploader";
import { RepeatIcon } from "@chakra-ui/icons";
import { ApiResponse, GiftCardRo } from "interfaces";

export default function AddMeal() {
  //   const toast = useToast();

  const [values, setValues] = useState<GiftCardRo>({ subscription_interval:"month"} as GiftCardRo);
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

            <Heading fontSize="2xl" mb="56px !important">
              Add Gift Card
            </Heading>

            <Stack
              my="46px !important"
              as="form"
              gridGap="24px"
              onSubmit={handleSubmit}
            >
              <HStack gridGap="24px">
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
                  <Input
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={""}
                    value={values?.amount ?? ""}
                    type="number"
                    onChange={(e) =>
                      setValues({
                        ...values,
                        amount: parseInt(e.target.value),
                      })
                    }
                  />
                </FormControl>
              </HStack>

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

      {/* <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        title="Confirm"
        onConfirm={submitForm(() => {
          navigate(`${configs.paths.meals}`, { replace: true });
        })}
        buttonText={["Save"]}
        description="Are you sure you want to save changes to this meal"
      /> */}
    </PageMotion>
  );
}
