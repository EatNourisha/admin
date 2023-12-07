import {
  Button,
  Container,
  Divider,
  FormControl,
  Heading,
  HStack,
  Select,
  Stack,
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
} from "components";

import { useMemo } from "react";
import useSettings from "hooks/useSettings";
import { useSettingsForm } from "./useSettingsForm";
import { InfluencerRewardType } from "interfaces";
import { capitalize } from "lodash";
import { when } from "utils";

export default function Settings() {
  const { data: settings, isLoading } = useSettings();

  console.log("Settings Data", settings);

  const {
    set,
    state,
    isLoading: isSubmiting,
    isOpen,
    onClose,
    onOpen,
    submitForm,
    hasChanges,
    setReward,
  } = useSettingsForm(settings);

  console.log("Settings Changes", { hasChanges, state });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onOpen();
  };

  const isDisabled = useMemo(
    () =>
      (!(
        state?.name &&
        state?.delivery_fee &&
        state?.delivery_fee_calculation_type &&
        state?.influencer_reward?.amount
      ) &&
        !hasChanges) ||
      isSubmiting,
    [state, isSubmiting, hasChanges]
  );

  return (
    <PageMotion key="settings-edit">
      <Topbar pageTitle="Settings" />

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
              Change settings
            </Heading>

            <Gravatar
              initials={"settings"}
              isLoading={isLoading}
              variant="vert"
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
                    isDisabled
                  />
                </FormControl>
                <FormControl>
                  <InputLabel>Delivery Fee</InputLabel>
                  <Input
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={""}
                    value={state?.delivery_fee ?? ""}
                    onChange={(e) => set({ delivery_fee: e.target.value })}
                    endAdornment={
                      <Text fontSize="md" textTransform="uppercase">
                        {state?.currency === "gbp"
                          ? "£GBP"
                          : state?.currency ?? "£GBP"}
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
                    value={state?.currency ?? ""}
                    onChange={(e) => set({ currency: e.target.value })}
                  >
                    <option value={"gbp"}>GBP</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>Delivery Fee Calculation Strategy</InputLabel>
                  <Select
                    placeholder="Select Option"
                    borderRadius="4px"
                    value={state?.delivery_fee_calculation_type ?? ""}
                    onChange={(e) =>
                      set({ delivery_fee_calculation_type: e.target.value })
                    }
                  >
                    <option value={"fixed"}>Fixed</option>
                    <option value={"per_meal"}>Per Meal</option>
                  </Select>
                </FormControl>
              </HStack>

              <Divider />

              <HStack justifyContent="space-between">
                <Text fontWeight="600">Influencer's Reward</Text>
              </HStack>

              <HStack gridGap="24px">
                <FormControl>
                  <InputLabel>Type</InputLabel>
                  <Select
                    placeholder="Select Option"
                    borderRadius="4px"
                    value={state?.influencer_reward?.type ?? ""}
                    onChange={(e) => setReward({ type: e.target.value as any })}
                  >
                    {Object.values(InfluencerRewardType).map((type) => (
                      <option key={type} value={type}>
                        {capitalize(type)}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>
                    {when(
                      state?.influencer_reward?.type ===
                        InfluencerRewardType.FIXED,
                      "Amount",
                      "Percentage"
                    )}
                  </InputLabel>
                  <Input
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={""}
                    value={state?.influencer_reward?.amount ?? ""}
                    onChange={(e) => setReward({ amount: e.target.value })}
                    endAdornment={
                      <Text fontSize="md" textTransform="uppercase">
                        {state?.influencer_reward?.type ===
                        InfluencerRewardType.FIXED
                          ? "£"
                          : "%"}
                      </Text>
                    }
                  />
                </FormControl>
              </HStack>

              {/* <Divider /> */}

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
        onConfirm={submitForm()}
        buttonText={["Save"]}
        description="Are you sure you want to save changes to the admin settings?"
      />
    </PageMotion>
  );
}
