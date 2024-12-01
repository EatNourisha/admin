import {
  Box,
  Button,
  Heading,
  HStack,
  Select,
  Stack,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ConfirmationModal, LineupItem, Loader } from "components";

import { EmptyCrate } from "components/Crate/Empty";
import usePlans from "hooks/usePlans";
import { ApiResponse, MealRo, PlanRo, UserRo } from "interfaces";
import { useEffect, useMemo, useState } from "react";
import { post, when } from "utils";
import MealSelectionDrawer, { IProtein, ISwallow } from "./MealSelectionDrawer";
import { useSWRConfig } from "swr";
import { isEqual } from "lodash";

export const days: string[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

interface LineupDataProps {
  user?: UserRo;
  isLoading: boolean;
  lineup: any;
  hasLineup: boolean;
}

export interface ILineupFoodItem {
  mealId?: MealRo;
  proteinId?: IProtein | null;
  extraId?: ISwallow | null;
}

function LineupData({ isLoading, lineup, hasLineup, user }: LineupDataProps) {
  const { mutate } = useSWRConfig();
  const { data: plans } = usePlans({});
  const {
    isOpen: isModalOpen,
    onClose: onModalClose,
    onOpen: onModalOpen,
  } = useDisclosure();
  const [selectedPlan, setSelectedPlan] = useState<PlanRo | undefined>();
  const [lineupData, setLineupData] = useState<any>({ ...lineup });
  const [originalLineupData, setOriginalLineupData] = useState<any>({
    ...lineup,
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [deliveryDate, setDeliveryDate] = useState<string | undefined>("");
  const [originalDeliveryDate, setOriginalDeliveryDate] = useState<
    string | undefined
  >("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [currentMealContext, setCurrentMealContext] = useState<{
    day: string;
    mealType: "lunch" | "dinner";
  } | null>(null);

  const hasLineupChanged = useMemo(() => {
    // Check if lineupData is different from originalLineupData
    const lineupChanged = !isEqual(lineupData, originalLineupData);

    // Check if delivery date has changed
    const deliveryDateChanged = deliveryDate !== originalDeliveryDate;

    return lineupChanged || deliveryDateChanged;
  }, [lineupData, originalLineupData, deliveryDate, originalDeliveryDate]);

  useEffect(() => {
    if (hasLineup) {
      setLineupData(lineup);
      setOriginalLineupData(lineup);
    }
  }, [hasLineup, lineup]);

  // Determine days based on plan name
  const activeDays = Object.keys(lineup).filter((key) => days.includes(key));

  const handleMealClick = (day: string, mealType: "lunch" | "dinner") => {
    setCurrentMealContext({ day, mealType });
    onOpen();
  };

  const handleMealSelection = (
    mealType: string,
    selection: ILineupFoodItem
  ) => {
    setLineupData((prev: any) => {
      const dayKey = currentMealContext!.day.toLowerCase();
      return {
        ...prev,
        [dayKey]: {
          lunch: prev[dayKey]?.lunch || "",
          dinner: prev[dayKey]?.dinner || "",
          [mealType]: selection,
        },
      };
    });
  };

  const validateLineup = () => {
    const activeDays = selectedPlan?.name.includes("5")
      ? ["monday", "tuesday", "wednesday", "thursday", "friday"]
      : [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ];

    // Check if all active days have both lunch and dinner selected
    const missingSelections = activeDays.filter(
      (day) => !lineupData[day]?.lunch || !lineupData[day]?.dinner
    );

    return {
      isValid: missingSelections.length === 0,
      missingDays: missingSelections,
    };
  };

  console.log("lineupData", lineupData);
  

  const handleSaveLineup = async () => {
    const { isValid, missingDays } = validateLineup();

    if (!isValid) {
      toast({
        title: "Incomplete Lineup",
        description: `Please select meals for ${missingDays.join(", ")}`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!deliveryDate) {
      toast({
        title: "Missing Delivery Date",
        description: "Please select a delivery date",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Transform lineupData into the required format
    const data = activeDays.reduce((acc, day) => {
      const dayData = lineupData[day.toLowerCase()] || {
        lunch: "",
        dinner: "",
      };

      acc[day.toLowerCase()] = {
        lunch: dayData.lunch
          ? {
              mealId: dayData.lunch.mealId._id,
              ...(dayData.lunch.extraId && {
                extraId: dayData.lunch.extraId._id,
              }),
              ...(dayData.lunch.proteinId && {
                proteinId: dayData.lunch.proteinId._id,
              }),
            }
          : null,
        dinner: dayData.dinner
          ? {
              mealId: dayData.dinner.mealId._id,
              ...(dayData.dinner.extraId && {
                extraId: dayData.dinner.extraId._id,
              }),
              ...(dayData.dinner.proteinId && {
                proteinId: dayData.dinner.proteinId._id,
              }),
            }
          : null,
      };

      return acc;
    }, {} as any);

    // Add delivery date in the required format
    data.delivery_date = new Date(deliveryDate).toISOString();

    try {
      setIsSaving(true);
      const res = (
        await post<ApiResponse<any>, any>(`/lineups/${user?._id}`, data)
      ).data as any;

      mutate(`/lineups/${user?._id}`);

      toast({
        title: "Lineup Saved",
        description: "Your meal lineup has been successfully saved",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onModalClose();
      return res;
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: "Unable to save lineup. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePlanSelection = (planId: string) => {
    const plan = plans?.data?.find((p) => p._id === planId);
    setSelectedPlan(plan);
    // Reset lineup when plan changes
    setLineupData({});
    setOriginalLineupData({});
  };

  useEffect(() => {
    setSelectedPlan(
      !!user?.subscription && user?.subscription?.status === "active"
        ? when(
            !!user?.subscription?.plan?.name,
            user?.subscription?.plan as PlanRo,
            undefined
          )
        : undefined
    );

    let deliveryDate: string | undefined;

    if (typeof user?.delivery_date === "string") {
      deliveryDate = new Date(user?.delivery_date).toISOString().split("T")[0];
    }

    setDeliveryDate(deliveryDate);
    setOriginalDeliveryDate(deliveryDate);
  }, [user]);

  return (
    <Box position="sticky" top="0">
      <HStack justifyContent="space-between">
        <Heading as="h5" fontSize="lg">
          Weekly Meal Lineups
        </Heading>
      </HStack>

      <Stack
        mt="16px"
        borderRadius="8px"
        overflow="hidden"
        p="14px"
        shadow={when(!lineup, "0px 2px 12px rgba(0, 0, 0, 0.05)", "none")}
        gap="16px"
      >
        <Box>
          <label htmlFor="plan">Meal Plan</label>
          <Select
            id="plan"
            mt="10px"
            placeholder="Select Option"
            value={selectedPlan ? selectedPlan._id : ""}
            onChange={(e) => handlePlanSelection(e.target.value)}
          >
            {plans?.data?.map((plan: any) => (
              <option key={plan._id} value={plan._id}>
                {plan.name}
              </option>
            ))}
          </Select>
        </Box>

        <div className="h-[1px] border-b border-black border-dashed my-4" />

        {(selectedPlan || lineupData) && (
          <>
            {days.map((day) => (
              <LineupItem
                key={day}
                day={day}
                pack={
                  lineupData[day.toLowerCase()] || { lunch: "", dinner: "" }
                }
                activeDays={activeDays}
                onMealClick={handleMealClick}
              />
            ))}

            <div className="h-[1px] border-b border-black border-dashed my-4" />

            <VStack alignItems="flex-start">
              <label htmlFor="delivery-date">Delivery Date</label>
              <input
                className="w-full border p-2 rounded"
                type="date"
                name="delivery_date"
                id="delivery-date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]} // Prevent past dates
              />
            </VStack>

            <Button
              mt={4}
              colorScheme="blue"
              onClick={() => onModalOpen()}
              isDisabled={
                !hasLineupChanged ||
                Object.keys(lineupData).length === 0 ||
                isSaving
              }
            >
              Save Lineup
            </Button>
          </>
        )}

        {isLoading && !lineup && <Loader my="80px" />}

        {!isLoading && !hasLineup && (
          <EmptyCrate
            description={"This user is yet to update / select their lineup"}
          />
        )}

        <MealSelectionDrawer
          isOpen={isOpen}
          onClose={onClose}
          mealContext={currentMealContext}
          onMealSelect={handleMealSelection}
        />

        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={onModalClose}
          isLoading={isSaving}
          title="Confirm"
          onConfirm={handleSaveLineup}
          buttonText={["Save"]}
          description="Are you sure you want to save changes to this lineup?"
        />
      </Stack>
    </Box>
  );
}

export default LineupData;
