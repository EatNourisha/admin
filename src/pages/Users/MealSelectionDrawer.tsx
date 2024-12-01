import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Grid,
  Heading,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useLocation } from "@reach/router";
import { APaginator, Loader } from "components";
import useExtras from "hooks/useExtras";
import useMeals from "hooks/useMeals";
import usePageFilters from "hooks/usePageFilters";
import { MealRo } from "interfaces";
import { orderBy } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { post } from "utils";

export interface IExtra {
  protein: {
    data: IProtein[];
    totalCount: number;
  };
  swallow: {
    data: ISwallow[];
    totalCount: number;
  };
}

export interface IProtein {
  _id: string;
  name: string;
  available_quantity: number;
  type: string;
  createdAt: string;
  updatedAt: string;
  _v: number;
}

export interface ISwallow {
  _id: string;
  name: string;
  available_quantity: number;
  type: string;
  createdAt: string;
  updatedAt: string;
  _v: number;
}

export interface ILineupFoodItem {
  mealId?: MealRo;
  proteinId: IProtein | null;
  extraId: ISwallow | null;
}

const MealSelectionDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  mealContext: {
    day: string;
    mealType: "lunch" | "dinner";
  } | null;
  onMealSelect: (mealType: string, selection: ILineupFoodItem) => void;
}> = ({ isOpen, onClose, mealContext, onMealSelect }) => {
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const [searchingMeals, setSearchingMeals] = useState(false);
  const [searchMealsText, setSearchMealsText] = useState("");
  const [value] = useDebounce(searchMealsText, 1000);
  const [searchResult, setSearchResult] = useState<
    | {
        totalcount: number;
        meals: MealRo[];
      }
    | undefined
  >(undefined);
  const { state, filter, onPageChange } = usePageFilters({
    limit: +(params.get("limit") ?? 12),
    page: +(params.get("page") ?? 1),
  });

  const { data: extras } = useExtras({ searchPhrase: "" });
  const { data, isLoading: isLoadingMeals } = useMeals({
    ...state,
    searchPhrase: filter?.searchPhrase,
  });

  const meals = useMemo(
    () => orderBy(data?.data ?? [], ["createdAt"], ["desc"]),
    [data]
  );

  const hasMeals = useMemo(() => (meals ?? []).length > 0, [meals]);
  const totalCount = useMemo(() => data?.totalCount ?? 0, [data]);

  const searchMeals = useCallback(async () => {
    setSearchingMeals(true);
    const response = await post(`/meals/pack/search/phrase`, {
      searchPhrase: value,
    });
    //@ts-ignore
    setSearchResult(response?.data);
    setSearchingMeals(false);
  }, [value, setSearchingMeals, setSearchResult]);

  useEffect(() => {
    if (value) {
      searchMeals();
    }
  }, [value, searchMeals]);

  const [selectedMeal, setSelectedMeal] = useState<MealRo | null>(null);
  const [selectedProtein, setSelectedProtein] = useState<IProtein | null>(null);
  const [selectedSwallow, setSelectedSwallow] = useState<ISwallow | null>(null);

  // Reset state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedMeal(null);
      setSelectedProtein(null);
      setSelectedSwallow(null);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (selectedMeal) {
      const selection: ILineupFoodItem = {
        mealId: selectedMeal,
        proteinId: selectedProtein || null,
        extraId: selectedSwallow || null,
      };
      onMealSelect(mealContext!.mealType, selection);
      onClose();
    }
  };

  const isSelectionComplete = () => {
    return (
      selectedMeal &&
      (!selectedMeal.isProtein || selectedProtein) &&
      (!selectedMeal.isSwallow || selectedSwallow)
    );
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement="right"
      size={{ base: "full", md: "xl" }}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader display="flex" justifyContent="space-between">
          Select Meal for {mealContext?.day} {mealContext?.mealType}{" "}
          <DrawerCloseButton />
        </DrawerHeader>
        <DrawerBody>
          <div className="my-4">
            <Input
              value={searchMealsText}
              onChange={(e) => setSearchMealsText(e.target.value)}
              placeholder="Search meals"
            />
          </div>

          {searchingMeals && <Loader mx="auto" my="160px" />}
          {/* Meal Selection Stage */}
          {!selectedMeal && (
            <VStack spacing={4}>
              <Heading size="md">Select a Meal</Heading>
              <Grid
                gap="16px"
                w="100%"
                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
              >
                {(!!searchMealsText ? searchResult?.meals ?? [] : meals).map(
                  (meal, i) => (
                    <Box
                      border="1px solid #E5E7EF"
                      borderRadius="8px"
                      p="14px"
                      key={i}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      gap={"16px"}
                      w="100%"
                    >
                      <Image
                        src={meal.image_url}
                        alt={meal.name}
                        w="128px"
                        borderRadius="8px"
                      />
                      <VStack>
                        <Text>{meal.name}</Text>
                        <Button
                          key={meal._id}
                          onClick={() => setSelectedMeal(meal)}
                          w="full"
                        >
                          Select
                        </Button>
                      </VStack>
                    </Box>
                  )
                )}
              </Grid>
            </VStack>
          )}

          {/* Protein Selection Stage */}
          {selectedMeal?.isProtein && !selectedProtein && (
            <VStack spacing={4} mt={4}>
              <Heading size="md">Select Protein</Heading>
              <Grid
                gap="16px"
                w="100%"
                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
              >
                {extras?.protein.data?.map((protein: any) => (
                  <Button
                    key={protein._id}
                    onClick={() => setSelectedProtein(protein)}
                    w="full"
                  >
                    {protein.name}
                  </Button>
                ))}
              </Grid>
            </VStack>
          )}

          {/* Swallow Selection Stage */}
          {selectedMeal?.isSwallow && !selectedSwallow && (
            <VStack spacing={4} mt={4}>
              <Heading size="md">Select Swallow</Heading>
              <Grid
                gap="16px"
                w="100%"
                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
              >
                {extras?.swallow.data?.map((swallow: any) => (
                  <Button
                    key={swallow._id}
                    onClick={() => setSelectedSwallow(swallow)}
                    w="full"
                  >
                    {swallow.name}
                  </Button>
                ))}
              </Grid>
            </VStack>
          )}
          <Box>
            {hasMeals && totalCount >= (state?.limit ?? 0) && (
              <APaginator
                isLoading={isLoadingMeals}
                totalCount={data?.totalCount}
                limit={state?.limit}
                page={state?.page}
                onPageChange={(value: number) => {
                  setSearchMealsText("");
                  onPageChange(value);
                }}
              />
            )}
          </Box>

          {/* Save Button */}
          <Button
            isDisabled={!isSelectionComplete()}
            onClick={handleSave}
            colorScheme="green"
            w="full"
            mt={4}
          >
            Save Selection
          </Button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default MealSelectionDrawer;
