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
  RadioGroup,
  Radio,
  useDisclosure,
  useToast,
  Checkbox,
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
} from "components";

import { CouponDuration, CouponRo, PromoRo } from "interfaces";
import { capitalize, omit } from "lodash";
import { useCallback, useMemo, useRef } from "react";

import usePartialState from "hooks/usePartialState";
import { generatePromoCode, when } from "utils";
import usePromoMutations from "hooks/usePromoMutation";
import configs from "config";
import usePromo from "hooks/usePromo";

export default function EditPromo() {
  //   const toast = useToast();

  const { id } = useParams();
  const { data: promo, isLoading } = usePromo(id);

  const {
    set,
    state,
    setInflu,
    setCoupon,

    isSubmiting,
    isOpen,
    onClose,
    onOpen,
    setRestrictions,
    percent_or_amount_field,
    submitForm,
  } = usePromoForm(promo);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onOpen();
  };

  const isDisabled = useMemo(
    () =>
      !(
        state?.influencer?.email &&
        state?.influencer?.first_name &&
        state?.influencer?.last_name &&
        state?.influencer?.phone_number &&
        state?.code &&
        state?.coupon?.duration
      ) ||
      !(state?.coupon?.amount_off || state?.coupon?.percent_off) ||
      isSubmiting,
    [state, isSubmiting]
  );

  // const isDisabled = false;

  return (
    <PageMotion key="edit-promo">
      <Topbar pageTitle="Promotion Codes" />

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
              Edit Promotion Code
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
              <HStack justifyContent="space-between">
                <Text fontWeight="600">Influencer Details</Text>
                {/* <Button
                  size="xs"
                  color="brand.black"
                  variant="transparent"
                  fontSize="sm"
                  fontWeight="600"
                  leftIcon={<Icon type="add" />}
                  onClick={addPerkDraft}
                >
                  Add Perk
                </Button> */}
              </HStack>

              <HStack gridGap="24px">
                <FormControl>
                  <InputLabel>Firstname</InputLabel>
                  <Input
                    isRequired={false}
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={""}
                    value={state?.influencer?.first_name ?? ""}
                    onChange={(e) => setInflu({ first_name: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <InputLabel>Lastname</InputLabel>
                  <Input
                    isRequired={false}
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={""}
                    value={state?.influencer?.last_name ?? ""}
                    onChange={(e) => setInflu({ last_name: e.target.value })}
                  />
                </FormControl>
              </HStack>

              <HStack gridGap="24px">
                <FormControl>
                  <InputLabel>Email</InputLabel>
                  <Input
                    isRequired={false}
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={""}
                    type="email"
                    value={state?.influencer?.email ?? ""}
                    onChange={(e) => setInflu({ email: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <InputLabel>Phone Number</InputLabel>
                  <Input
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={""}
                    value={state?.influencer?.phone_number ?? ""}
                    onChange={(e) => setInflu({ phone_number: e.target.value })}
                  />
                </FormControl>
              </HStack>

              {/* <FormControl>
                <InputLabel>Description</InputLabel>
                <Textarea
                  borderWidth="2px"
                  borderColor="brand.neutral200"
                  placeholder="Add a description"
                  // value={state?.description ?? ""}
                  // onChange={(e) => set({ description: e.target.value })}
                />
              </FormControl> */}

              <Divider />

              <HStack justifyContent="space-between">
                <Text fontWeight="600">Promo</Text>

                <RadioGroup
                  onChange={(value) => {
                    set({ by: value as any });
                    if (value === "amount")
                      setCoupon({ percent_off: undefined });
                    else setCoupon({ amount_off: undefined });
                  }}
                  value={state?.by}
                >
                  <Stack direction="row">
                    <Radio size="sm" value="percent">
                      Percent Off
                    </Radio>
                    <Radio size="sm" value="amount">
                      Amount Off
                    </Radio>
                  </Stack>
                </RadioGroup>
              </HStack>

              <HStack gridGap="24px">
                <FormControl>
                  <InputLabel>Code</InputLabel>
                  <Input
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    textTransform="uppercase"
                    placeholder={""}
                    value={state?.code ?? ""}
                    onChange={(e) => set({ code: e.target.value })}
                    endAdornment={
                      <Button
                        right="18px"
                        size="xs"
                        minH="32px"
                        borderRadius="5px"
                        bg="gray.500"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          set({ code: generatePromoCode() });
                        }}
                      >
                        GENERATE
                      </Button>
                    }
                  />
                </FormControl>
                <FormControl>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    placeholder="Select Currency"
                    borderRadius="4px"
                    value={state?.coupon?.currency ?? ""}
                    onChange={(e) => {
                      setCoupon({ currency: e.target.value });
                      setRestrictions({
                        minimum_amount_currency: e.target.value,
                      });
                    }}
                  >
                    <option value={"gbp"}>GBP</option>
                  </Select>
                </FormControl>
              </HStack>

              <HStack gridGap="24px">
                <FormControl>
                  <InputLabel>{capitalize(state?.by)} Off</InputLabel>
                  <Input
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={""}
                    type="number"
                    min={when(state?.by === "percent", 0, 1)}
                    max={when(state?.by === "percent", 100, undefined)}
                    step={0.1}
                    value={
                      ((state?.coupon as any) ?? {})[percent_or_amount_field] ??
                      ""
                    }
                    onChange={(e) =>
                      setCoupon({ [percent_or_amount_field]: e.target.value })
                    }
                    endAdornment={
                      <Text fontSize="md" textTransform="uppercase">
                        {state?.by === "amount" ? "£" : "%"}
                      </Text>
                    }
                  />
                </FormControl>
                <FormControl>
                  <InputLabel>Duration</InputLabel>
                  <Select
                    placeholder="Select Duration"
                    borderRadius="4px"
                    value={state?.coupon?.duration ?? ""}
                    onChange={(e) =>
                      setCoupon({ duration: e.target.value as any })
                    }
                  >
                    {Object.values(CouponDuration).map((duration) => (
                      <option key={duration} value={duration}>
                        {capitalize(duration)}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>

              <HStack gridGap="24px">
                <FormControl>
                  <InputLabel>Duration In Months</InputLabel>
                  <Input
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={""}
                    type="number"
                    isRequired={false}
                    min={0}
                    isDisabled={state?.coupon?.duration !== "repeating"}
                    value={state?.coupon?.duration_in_months ?? ""}
                    onChange={(e) =>
                      setCoupon({ duration_in_months: e.target.value })
                    }
                  />
                </FormControl>
              </HStack>

              <Divider />

              <HStack justifyContent="space-between">
                <Text fontWeight="600">Restrictions</Text>

                <Checkbox
                  size="sm"
                  colorScheme="red"
                  isChecked={
                    state?.restrictions?.first_time_transaction ?? false
                  }
                  onChange={(e) => {
                    setRestrictions({
                      first_time_transaction: e.target.checked,
                    });
                  }}
                >
                  First Time Transaction
                </Checkbox>
              </HStack>

              <HStack gridGap="24px">
                <FormControl>
                  <InputLabel>Minimum Amount</InputLabel>
                  <Input
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={""}
                    type="number"
                    isRequired={false}
                    min={0}
                    value={state?.restrictions?.minimum_amount ?? ""}
                    onChange={(e) =>
                      setRestrictions({ minimum_amount: e.target.value })
                    }
                    endAdornment={
                      <Text fontSize="md" textTransform="uppercase">
                        £
                      </Text>
                    }
                  />
                </FormControl>
                <FormControl>
                  <InputLabel>Max Redemptions</InputLabel>
                  <Input
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={""}
                    type="number"
                    min={0}
                    isRequired={false}
                    value={state?.coupon?.max_redemptions ?? ""}
                    onChange={(e) => {
                      set({ max_redemptions: e.target.value });
                      setCoupon({ max_redemptions: e.target.value });
                    }}
                  />
                </FormControl>
              </HStack>

              <HStack gridGap="24px">
                <FormControl>
                  <InputLabel>Expires At</InputLabel>
                  <Input
                    bg="white !important"
                    borderWidth="2px"
                    borderColor="brand.neutral200"
                    placeholder={""}
                    isRequired={false}
                    type="date"
                    value={state?.expires_at ?? ""}
                    onChange={(e) => {
                      set({ expires_at: e.target.value });
                    }}
                  />
                </FormControl>
                <FormControl>
                  <InputLabel>Minimum Amount Currency</InputLabel>
                  <Select
                    // placeholder="Select Currency"
                    borderRadius="4px"
                    isRequired={false}
                    value={state?.coupon?.currency ?? ""}
                    // onChange={(e) => set({ currency: e.target.value })}
                    disabled
                  >
                    <option value={"gbp"}>GBP</option>
                  </Select>
                </FormControl>
              </HStack>

              <HStack mt="40px !important">
                <Button
                  isDisabled={isDisabled}
                  isLoading={isSubmiting}
                  type="submit"
                >
                  Create Promo
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
          navigate(configs.paths.promos);
        })}
        buttonText={["Create"]}
        description="Are you sure you want to create this promotion code?"
      />
    </PageMotion>
  );
}

export interface IPromoFormState
  extends Omit<PromoRo, "_id" | "createdAt" | "updatedAt" | "coupon"> {
  coupon: CouponRo;
  by: "percent" | "amount";
}

const transformPromoToFormState = (promo: PromoRo): IPromoFormState | any => {
  return { ...promo, by: "amount" };
};

function usePromoForm(promo?: PromoRo) {
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  // const initialChanges = useRef<IPromoFormState>(
  //   transformPromoToFormState((promo ?? {}) as any)
  // );
  const hasChanges = useRef<boolean>(false);

  const { createPromo, isLoading } = usePromoMutations();

  const [state, set] = usePartialState<IPromoFormState>(
    transformPromoToFormState((promo ?? {}) as any),
    [promo]
  );

  console.log("State", state);

  const percent_or_amount_field = useMemo(
    () => when(state?.by === "percent", "percent_off", "amount_off"),
    [state?.by]
  );

  const setCoupon = useCallback(
    (updates: Partial<CouponRo>) =>
      set((state) => ({
        ...state,
        coupon: { ...state?.coupon, ...updates } as any,
      })),
    [set]
  );

  const setInflu = useCallback(
    (updates: Partial<IPromoFormState["influencer"]>) =>
      set((state) => ({
        ...state,
        influencer: { ...state?.influencer, ...updates } as any,
      })),
    [set]
  );

  const setRestrictions = useCallback(
    (updates: Partial<IPromoFormState["restrictions"]>) =>
      set((state) => ({
        ...state,
        restrictions: { ...state?.restrictions, ...updates } as any,
      })),
    [set]
  );

  const createNewPromo = async () => {
    const result = await createPromo({
      ...omit(state as any, ["by"]),
      coupon: {
        ...state?.coupon,
        duration: (state?.coupon?.duration as any) ?? "once",
        currency: state?.coupon?.currency ?? "gpb",
        amount_off: when(
          !!state?.coupon?.amount_off,
          +(state?.coupon?.amount_off ?? 0),
          undefined
        ),
        percent_off: when(
          !!state?.coupon?.percent_off,
          // Number(Number(state?.coupon?.percent_off ?? 0).toFixed(2)),
          +(state?.coupon?.percent_off ?? 0),
          undefined
        ),
      },
      restrictions: {
        first_time_transaction:
          state?.restrictions?.first_time_transaction ?? false,
        minimum_amount: when(
          +(state?.restrictions?.minimum_amount ?? 0) > 0,
          +(state?.restrictions?.minimum_amount ?? 0),
          undefined
        ),
        minimum_amount_currency: when(
          +(state?.restrictions?.minimum_amount ?? 0) > 0,
          state?.restrictions?.minimum_amount_currency,
          undefined
        ),
      },
    } as any);

    return result;
  };

  const submitForm = (callback?: (result: PromoRo) => void) => async () => {
    onClose();
    const is_update = !!promo;
    const result = await when(is_update, async () => promo, createNewPromo)();
    if (!!result) {
      callback && callback(result);
      toast({
        position: "bottom-right",
        title: "Success 🎉",
        description: `Promo successfully ${when(
          is_update,
          "updated",
          "created"
        )}`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return {
    state,
    set,
    setCoupon,
    setInflu,
    onOpen,
    onClose,
    isOpen,
    hasChanges: hasChanges.current,
    percent_or_amount_field,
    setRestrictions,
    isSubmiting: isLoading,
    submitForm,
  };
}
