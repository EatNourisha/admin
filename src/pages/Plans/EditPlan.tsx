import {
  Box,
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
import { navigate, useParams } from "@reach/router";
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
import { EmptyCrate } from "components/Crate/Empty";

import configs from "config";
import { PlanInterval } from "interfaces";
import { capitalize } from "lodash";
import { useMemo } from "react";
import { usePlanForm } from "./usePlanForm";
import { PerkItem } from "./PerkItem";
import usePlan from "hooks/usePlan";

export default function EditPlan() {
  //   const toast = useToast();
  const { id } = useParams();
  const { data: plan, isLoading } = usePlan(id);

  const {
    set,
    state,
    hasPerks,
    perkDraft,
    addPerkDraft,
    savePerkDraft,
    removePerk,
    togglePerkEditMode,
    isLoading: isSubmiting,
    isOpen,
    onClose,
    onOpen,
    submitForm,
    hasChanges,
  } = usePlanForm(plan);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onOpen();
  };

  const isDisabled = useMemo(
    () =>
      !(
        state?.name &&
        state?.amount &&
        state?.currency &&
        state?.subscription_interval
      ) ||
      (state?.perks ?? [])?.length < 1 ||
      isSubmiting ||
      !hasChanges,
    [state, isSubmiting, hasChanges]
  );

  return (
    <PageMotion key="plan-add">
      <Topbar pageTitle="Plans" />

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
              Edit Plan
            </Heading>

            <Gravatar
              initials={"Plan"}
              isLoading={isLoading}
              variant="vert"
              //   src={user?.profilePhotoUrl}
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
                    borderColor="brand.neutral200"
                    placeholder={""}
                    value={state?.amount ?? ""}
                    onChange={(e) => set({ amount: e.target.value })}
                    endAdornment={
                      <Text fontSize="md" textTransform="uppercase">
                        {state?.currency === "gbp" ? "£GBP" : state?.currency}
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
                  <InputLabel>Interval</InputLabel>
                  <Select
                    placeholder="Select Interval"
                    borderRadius="4px"
                    value={state?.subscription_interval ?? ""}
                    onChange={(e) =>
                      set({ subscription_interval: e.target.value })
                    }
                  >
                    {Object.values(PlanInterval).map((intv, i) => (
                      <option key={`${intv}ly-interval`} value={intv}>
                        {capitalize(intv)}ly
                      </option>
                    ))}
                  </Select>
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
                    value={state?.delivery_fee ?? ""}
                    onChange={(e) => set({ delivery_fee: e.target.value })}
                    endAdornment={
                      <Text fontSize="md" textTransform="uppercase">
                        {state?.currency === "gbp" ? "£GBP" : state?.currency}
                      </Text>
                    }
                  />
                </FormControl>
              </HStack>

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

              <Divider />

              <Stack>
                <HStack justifyContent="space-between">
                  <Text fontWeight="600">Features / Perks</Text>
                  <Button
                    size="xs"
                    color="brand.black"
                    variant="transparent"
                    fontSize="sm"
                    fontWeight="600"
                    leftIcon={<Icon type="add" />}
                    onClick={addPerkDraft}
                  >
                    Add Perk
                  </Button>
                </HStack>

                {!!perkDraft && (
                  <PerkItem
                    my="16px"
                    mode="edit"
                    {...perkDraft}
                    onSaveDraft={(e) => savePerkDraft(e)}
                  />
                )}

                {!isLoading && hasPerks && (
                  <Stack my="24px !important">
                    {(state?.perks ?? []).map((perk, i) => (
                      <PerkItem
                        key={`perk-${i}`}
                        // my="16px"
                        mode="read"
                        {...perk}
                        onRemove={(e) => removePerk(e)}
                        toggleEditMode={(index) => togglePerkEditMode(index)}
                        onSaveDraft={(e) => savePerkDraft(e)}
                      />
                    ))}
                  </Stack>
                )}

                {isLoading &&
                  !hasPerks &&
                  !perkDraft &&
                  Array(3)
                    .fill(0)
                    .map((_, i) => <PerkItem isLoading={isLoading} />)}

                {!hasPerks && !perkDraft && (
                  <Box>
                    <EmptyCrate
                      my="80px"
                      description="You need to add at least one feature/perk to add this plan"
                    />
                  </Box>
                )}
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
          navigate(`${configs.paths.plans}/${id}`, { replace: true });
        })}
        buttonText={["Save"]}
        description="Are you sure you want to save changes to this plan"
      />
    </PageMotion>
  );
}
