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
// import { EmptyCrate } from "components/Crate/Empty";

import configs from "config";

import { useMemo } from "react";
import { useMealForm } from "./useMealForm";
import { when } from "utils";
import Uploader, { FilePreviewType } from "components/Uploader/Uploader";
import { RepeatIcon } from "@chakra-ui/icons";

export default function AddMeal() {
  //   const toast = useToast();

  const {
    set,
    state,
    removeFile,
    toggleImage,
    setPrice,
    isLoading: isSubmiting,
    isOpen,
    onClose,
    onOpen,
    submitForm,
    hasChanges,
  } = useMealForm();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onOpen();
  };

  const isDisabled = useMemo(
    () =>
      !(
        state?.name &&
        state?.price?.amount &&
        state?.price?.currency &&
        state?.orderType &&
        state?.country &&
        state?.price?.deliveryFee &&
        state?.description
      ) ||
      (state?.files ?? [])?.length < 1 ||
      isSubmiting ||
      !hasChanges,
    [state, isSubmiting, hasChanges]
  );

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
              Add Meal
            </Heading>

            <Gravatar
              initials={"Meal"}
              //   isLoading={isLoading}
              variant="vert"
              src={state?.image_url ?? (state?.images ?? [])[0]?.url}
            />

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
                    value={state?.name}
                    onChange={(e) => set({ name: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <InputLabel>Amount</InputLabel>
                  <Input
                    bg="white !important"
                    borderWidth="2px"
                    type="number"
                    borderColor="brand.neutral200"
                    placeholder={""}
                    value={state?.price?.amount ?? ""}
                    onChange={(e) => setPrice({ amount: e.target.value })}
                    endAdornment={
                      <Text fontSize="md" textTransform="uppercase">
                        {state?.price?.currency === "gbp"
                          ? "£GBP"
                          : state?.price?.currency ?? "£GBP"}
                      </Text>
                    }
                  />
                </FormControl>
              </HStack>
              <HStack gridGap="24px">
                <FormControl>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    placeholder="Select Currency"
                    borderRadius="4px"
                    value={state?.price?.currency ?? ""}
                    onChange={(e) => setPrice({ currency: e.target.value })}
                  >
                    <option value={"gbp"}>GBP</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>Previous Amount</InputLabel>
                  <Input
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={""}
                    isRequired={false}
                    value={state?.price?.previousAmount ?? ""}
                    isDisabled
                    // onChange={(e) => setPrice({ amount: +e.target.value })}
                    endAdornment={
                      <Text fontSize="md" textTransform="uppercase">
                        {state?.price?.currency === "gbp"
                          ? "£GBP"
                          : state?.price?.currency ?? "£GBP"}
                      </Text>
                    }
                  />
                </FormControl>
              </HStack>
              <HStack gridGap="24px">
                <FormControl>
                  <InputLabel>Order Type</InputLabel>
                  <Select
                    placeholder="Select Order Type"
                    borderRadius="4px"
                    value={state?.orderType ?? "subscription"}
                    onChange={(e) => set({ orderType: e.target.value })}
                  >
                    <option value={"subscription"}>Subscription</option>
                    <option value={"single order"}>Single Order</option>
                    <option value={"bulk-order"}>Bulk Order</option>
                    <option value={"both"}>Both</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>Country</InputLabel>
                  <Input
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={""}
                    isRequired={false}
                    value={state?.country ?? ""}
                    onChange={(e) => set({ country: e.target.value })}
                  />
                </FormControl>
              </HStack>

              <HStack gridGap="24px">
                <FormControl>
                  <InputLabel>Delivery Fee</InputLabel>
                  <Input
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={""}
                    isRequired={false}
                    value={state?.price?.deliveryFee ?? ""}
                    onChange={(e) => setPrice({ deliveryFee: e.target.value })}
                    endAdornment={
                      <Text fontSize="md" textTransform="uppercase">
                        {state?.price?.currency === "gbp"
                          ? "£GBP"
                          : state?.price?.currency ?? "£GBP"}
                      </Text>
                    }
                  />
                </FormControl>

                <FormControl>
                  <InputLabel>Available Quantity</InputLabel>
                  <Input
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={""}
                    type="number"
                    min={0}
                    value={state?.available_quantity ?? ""}
                    onChange={(e) =>
                      set({ available_quantity: e.target.value })
                    }
                  />
                </FormControl>
              </HStack>

              <FormControl>
                <InputLabel>Calories</InputLabel>
                <Input
                  borderWidth="2px"
                  borderColor="brand.neutral200"
                  placeholder="Add a calorie count"
                  value={state?.calories ?? ""}
                  type="text"
                  onChange={(e) => set({ calories: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <InputLabel>Continent</InputLabel>
                <Select
                  placeholder="Select continent"
                  borderRadius="4px"
                  value={state?.continent ?? "subscription"}
                  onChange={(e) => set({ continent: e.target.value })}
                >
                  {[
                    "Asia",
                    "Africa",
                    "North America",
                    "South America",
                    "Antarctica",
                    "Europe",
                    "Australia",
                  ].map((value, index) => (
                    <option key={`continent_${index}`} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <InputLabel>Weight</InputLabel>
                <Input
                  borderWidth="2px"
                  borderColor="brand.neutral200"
                  placeholder="Add a weight count"
                  value={state?.weight ?? ""}
                  type="text"
                  onChange={(e) => set({ weight: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <InputLabel>Spice level</InputLabel>
                <Input
                  borderWidth="2px"
                  borderColor="brand.neutral200"
                  placeholder="Add a spice level"
                  value={state?.spice_level ?? ""}
                  type="text"
                  onChange={(e) => set({ spice_level: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <InputLabel>Category</InputLabel>
                <Input
                  borderWidth="2px"
                  borderColor="brand.neutral200"
                  placeholder="Add a category"
                  value={state?.category ?? ""}
                  type="text"
                  onChange={(e) => set({ category: e.target.value })}
                />
              </FormControl>

          

              <FormControl>
                <InputLabel>Description</InputLabel>
                <Textarea
                  borderWidth="2px"
                  borderColor="brand.neutral200"
                  placeholder="Add a description"
                  value={state?.description ?? ""}
                  onChange={(e) => set({ description: e.target.value })}
                />
              </FormControl>


              <HStack display="flex">
                <FormControl flex="1">
                  <InputLabel>Protein</InputLabel>
                  <Input
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder="Enter protein"
                    value={state?.mealInfo?.nutrition?.protein ?? ""}
                    type="text"
                    onChange={(e) =>
                      set({
                        mealInfo: {
                          ...state?.mealInfo,
                          nutrition: {
                            ...state?.mealInfo?.nutrition,
                            protein: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </FormControl>

                <FormControl flex="1">
                  <InputLabel>Fat</InputLabel>
                  <Input
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder="Add fat"
                    value={state?.mealInfo?.nutrition?.fat ?? ""}
                    type="text"
                    onChange={(e) =>
                      set({
                        mealInfo: {
                          ...state?.mealInfo,
                          nutrition: {
                            ...state?.mealInfo?.nutrition,
                            fat: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </FormControl>

                <FormControl flex="1">
                  <InputLabel>Carbohydrate</InputLabel>
                  <Input
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder="Add a carbohydrate"
                    value={state?.mealInfo?.nutrition?.carbs ?? ""}
                    type="text"
                    onChange={(e) =>
                      set({
                        mealInfo: {
                          ...state?.mealInfo,
                          nutrition: {
                            ...state?.mealInfo?.nutrition,
                            carbs: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </FormControl>
              </HStack>

              <FormControl flex="1">
                <InputLabel>Ingredient</InputLabel>
                <Input
                  borderWidth="2px"
                  borderColor="brand.neutral200"
                  placeholder="Add a ingredients"
                  value={state?.mealInfo?.ingredient ?? ""}
                  type="text"
                  onChange={(e) =>
                    set({
                      mealInfo: {
                        ...state?.mealInfo,
                        ingredient: e.target.value,
                      },
                    })
                  }
                />
              </FormControl>


              <FormControl flex="1">
                <InputLabel>Allergy</InputLabel>
                <Input
                  borderWidth="2px"
                  borderColor="brand.neutral200"
                  placeholder="Enter allergies"
                  value={state?.mealInfo?.allergy ?? ""}
                  type="text"
                  onChange={(e) =>
                    set({
                      mealInfo: { ...state?.mealInfo, allergy: e.target.value },
                    })
                  }
                />
              </FormControl>

              <FormControl flex="1">
                <InputLabel>Heating Instruction</InputLabel>
                <Textarea
                  borderWidth="2px"
                  borderColor="brand.neutral200"
                  placeholder="Specify heating"
                  value={state?.mealInfo?.heating ?? ""}
                  onChange={(e) =>
                    set({
                      mealInfo: {
                        ...state?.mealInfo,
                        heating: e.target.value,
                      },
                    })
                  }
                />
              </FormControl>

            

         

              <HStack justifyContent={"space-between"}>
                <FormControl
                  display="flex"
                  w="fit-content"
                  alignSelf="flex-start"
                >
                  <Switch
                    ml="8px"
                    aria-label="switch meal availability"
                    disabled={isSubmiting}
                    isChecked={state?.is_available}
                    onChange={() => set({ is_available: !state?.is_available })}
                    sx={{
                      "--switch-track-width": "26px",
                      ".chakra-switch__track": {
                        bg: "brand.neutral400",
                        padding: "3px",
                        borderRadius: "26px",
                      },
                      ".chakra-switch__track[data-checked]": {
                        bg: "#03CCAA",
                        padding: "3px",
                      },
                      ".chakra-switch__thumb": {
                        shadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      },
                    }}
                  />
                  <InputLabel ml="8px" htmlFor="isChecked">
                    {when(!!state?.is_available, "Available", "Unavailable")}
                  </InputLabel>
                </FormControl>

                <FormControl
                  display="flex"
                  w="fit-content"
                  alignSelf="flex-start"
                >
                  <Switch
                    ml="8px"
                    aria-label="switch meal availability"
                    disabled={isSubmiting}
                    isChecked={state?.isSwallow}
                    onChange={() => set({ isSwallow: !state?.isSwallow })}
                    sx={{
                      "--switch-track-width": "26px",
                      ".chakra-switch__track": {
                        bg: "brand.neutral400",
                        padding: "3px",
                        borderRadius: "26px",
                      },
                      ".chakra-switch__track[data-checked]": {
                        bg: "#03CCAA",
                        padding: "3px",
                      },
                      ".chakra-switch__thumb": {
                        shadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      },
                    }}
                  />
                  <InputLabel ml="8px" htmlFor="isChecked">
                    {when(!!state?.isSwallow, "Swallow", "Not swallow")}
                  </InputLabel>
                </FormControl>
              </HStack>

              <Divider />

              <Stack>
                <Grid
                  templateColumns="repeat(3, 1fr)"
                  gap="10px"
                  mb="20px !important"
                >
                  {state?.images?.map((image, i) => (
                    <ImagePreview
                      key={i}
                      url={image.url}
                      onDelete={() => toggleImage(image.index)}
                      removed={image?.removed}
                      can_delete={(state?.images ?? [])?.length > 1}
                    />
                  ))}
                  {state?.files?.map((file, i) => (
                    <ImagePreview
                      key={i}
                      file={file}
                      onDelete={() => removeFile(i)}
                    />
                  ))}
                </Grid>

                <Uploader
                  title="Upload Meal Image"
                  files={state?.files}
                  onFiles={(files) =>
                    set({ files: files as unknown as FilePreviewType[] })
                  }
                />
              </Stack>

              <HStack>
                <Button
                  disabled={isDisabled}
                  isLoading={isSubmiting}
                  type="submit"
                >
                  Save Changes
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
          navigate(`${configs.paths.meals}`, { replace: true });
        })}
        buttonText={["Save"]}
        description="Are you sure you want to save changes to this meal"
      />
    </PageMotion>
  );
}

interface ImagePreviewProps {
  file?: FilePreviewType;
  url?: string;
  onDelete?: () => void;
  removed?: boolean;
  can_delete?: boolean;
}

function ImagePreview(props: ImagePreviewProps) {
  const { file, url, onDelete, removed, can_delete = true } = props;
  return (
    <Box pos="relative">
      <Box w="100%" h="140px" overflow="hidden" borderRadius="10px">
        <Image
          src={url ?? file?.preview}
          alt={file?.name ?? ""}
          w="100%"
          h="100%"
          objectFit="cover"
          objectPosition="center"
        />
        {removed && (
          <Box
            pos="absolute"
            top="0"
            bg="rgba(0,0,0,.5)"
            w="100%"
            h="100%"
            borderRadius="10px"
          >
            <Center h="100%">
              <Text color="white" fontWeight="bold">
                Removed
              </Text>
            </Center>
          </Box>
        )}
      </Box>

      <Box h="40px" bg="transparent" pos="absolute" top="10px" right="10px">
        {!!can_delete && (
          <IconButton
            minH="unset"
            minW="unset"
            maxH="unset"
            maxW="unset"
            boxSize="28px"
            borderRadius="8px"
            bg="white"
            aria-label="delete mealpack"
            icon={when(
              !!removed,
              <RepeatIcon color="green" />,
              <Icon type="delete" boxSize="16px" />
            )}
            _hover={{
              bg: "whiteAlpha.500",
            }}
            _active={{
              bg: "transparent",
            }}
            _loading={{ color: "brand.primary" }}
            onClick={onDelete}
            //   disabled={isLoading}
            //   isLoading={isLoading}
          />
        )}
      </Box>
    </Box>
  );
}
