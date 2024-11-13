import {
  Badge,
  Box,
  BoxProps,
  Button,
  Grid,
  HStack,
  IconButton,
  Image,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import {
  APaginator,
  AddMealModal,
  ConfirmationModal,
  Icon,
  Input,
  Loader,
  MainLayoutContainer,
  PageMotion,
  Topbar,
} from "components";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import usePageFilters from "hooks/usePageFilters";
import { MealRo } from "interfaces";
import { orderBy } from "lodash";

// import { ReactComponent as PlateSVG } from "assets/svgs/plate.svg";
import { navigate, useLocation } from "@reach/router";
import useMealMutations from "hooks/useMealMutations";
import useMeals from "hooks/useMeals";
import { currencyFormat } from "utils";
import { post } from "utils/makeRequest";

export default function Meals() {
  // const [isLoading, setIsLoading] = useState(true);

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

  const { isOpen, onClose /*, onOpen */ } = useDisclosure();

  const { state, filter, onPageChange } = usePageFilters({
    limit: +(params.get("limit") ?? 12),
    page: +(params.get("page") ?? 1),
  });

  const { data, isLoading, key } = useMeals({
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

  return (
    <PageMotion key="meals-root" pb="100px">
      <Topbar pageTitle="Meals" />
      <MainLayoutContainer>
        <Box>
          <HStack as="form" justifyContent="flex-end" w="100%" mb="24px">
            <Button
              w={{ base: "100%", md: "auto" }}
              ml="0 !important"
              leftIcon={<Icon type="add" />}
              onClick={() => navigate("/meals/add")}
            >
              Add Meal
            </Button>
          </HStack>
          <div className="my-4">
            <Input
              value={searchMealsText}
              onChange={(e) => setSearchMealsText(e.target.value)}
              placeholder="Search meals"
            />
          </div>

          <VStack>
            {searchingMeals && <Loader mx="auto" my="160px" />}
            {hasMeals && (
              <Grid
                w="100%"
                templateColumns={{
                  base: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                }}
                gap="16px"
              >
                {(!!searchMealsText ? searchResult?.meals ?? [] : meals).map(
                  (meal, i) => (
                    <MealItem key={`meal-${i}`} keys={[key]} {...meal} />
                  )
                )}
              </Grid>
            )}
            {!hasMeals && isLoading && <Loader mx="auto" my="160px" />}
          </VStack>

          <Box>
            {hasMeals && totalCount >= (state?.limit ?? 0) && (
              <APaginator
                isLoading={isLoading}
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
        </Box>

        <AddMealModal keys={[key]} isOpen={isOpen} onClose={onClose} />
      </MainLayoutContainer>
    </PageMotion>
  );
}

interface MealItemProps extends Partial<MealRo>, Omit<BoxProps, keyof MealRo> {
  keys?: string[];
}

function MealItem(props: MealItemProps) {
  const {
    _id,
    name,
    image_url,
    keys,
    price,
    is_available,
    available_quantity,
    calories,
    spice_level,
    lastEditedBy, // Destructure but don't pass to DOM
    createdAt,
    updatedAt,
    isSwallow,
    meals,
    category,
    slug,
    isProtein,
    weight,
    orderType,
    country,
    mealInfo,
    images,
    description,
    continent,
    lastEdited,
    expected_proteins,
    expected_swallows,
    ...domProps // Only DOM-safe props remain
  } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: editIsOpen, onClose: editOnClose } = useDisclosure();

  const { deleteMeal, isLoading } = useMealMutations(keys);

  const removeMeal = async () => {
    if (!_id) return;
    onClose();
    await deleteMeal(_id);
  };

  return (
    <HStack
      p="14px"
      border="1px solid transparent"
      borderColor="brand.neutral"
      borderRadius="8px"
      pos="relative"
      {...domProps}
    >
      {!is_available && (
        <Badge
          pos="absolute"
          left="26px"
          top="calc(50% - 10px)"
          fontSize="sm"
          color="brand.red"
          transform="rotate(-45deg)"
          shadow="0 0 20px rgba(0 0 0 / 60%)"
        >
          Unavailable
        </Badge>
      )}
      <Box
        w="128px"
        minW="128px"
        h="120px"
        bg="rgb(233 87 63 / 20%)"
        borderRadius="8px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        <Box
          as={Image}
          src={image_url}
          boxSize="100%"
          objectFit="cover"
          alt={name}
        />
      </Box>

      <Stack p="12px">
        <Text>{name}</Text>
        <Text>{currencyFormat("gbp").format(+(price?.amount ?? 0))}</Text>
        <HStack mt="-10px !important" fontSize="xs" color="brand.primary">
          <Text>Delivery Fee</Text>
          <Text>
            {currencyFormat("gbp").format(+(price?.deliveryFee ?? 0))}
          </Text>
        </HStack>
        <HStack mt="0px !important" fontSize="xs" color="brand.black">
          <Text>Available Quantity:</Text>
          <Text fontSize="sm" fontWeight="600">
            {available_quantity ?? "Not specified"}
          </Text>
        </HStack>

        <HStack mt="0px !important" fontSize="xs" color="brand.black">
          <Text>Calories:</Text>
          <Text fontSize="sm" fontWeight="600">
            {calories ?? "Not specified"}
          </Text>
        </HStack>

        <HStack>
          <IconButton
            minH="unset"
            minW="unset"
            maxH="unset"
            maxW="unset"
            boxSize="28px"
            borderRadius="8px"
            bg="transparent"
            aria-label="edit mealpack"
            icon={<Icon type="edit" boxSize="16px" color="black" />}
            _hover={{
              bg: "transparent",
            }}
            _active={{
              bg: "transparent",
            }}
            onClick={() => navigate(`/meals/edit/${_id}`)}
          />

          <IconButton
            minH="unset"
            minW="unset"
            maxH="unset"
            maxW="unset"
            boxSize="28px"
            borderRadius="8px"
            bg="transparent"
            aria-label="delete mealpack"
            icon={<Icon type="delete" boxSize="16px" />}
            _hover={{
              bg: "transparent",
            }}
            _active={{
              bg: "transparent",
            }}
            _loading={{ color: "brand.primary" }}
            onClick={onOpen}
            disabled={isLoading}
            isLoading={isLoading}
          />
          <IconButton
            minH="unset"
            minW="unset"
            maxH="unset"
            maxW="unset"
            boxSize="28px"
            borderRadius="8px"
            bg="transparent"
            aria-label="view analysis"
            icon={<Icon type="stats" boxSize="16px" color="black" />}
            _hover={{
              bg: "transparent",
            }}
            _active={{
              bg: "transparent",
            }}
            _loading={{ color: "brand.primary" }}
            onClick={() => navigate(`/meals/analysis/${_id}`)}
            disabled={isLoading}
          />
        </HStack>
      </Stack>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        title="Confirm"
        onConfirm={removeMeal}
        buttonText={["Delete"]}
        description="Are you sure you want to delete this meal?"
      />

      <AddMealModal
        meal={{
          name,
          _id,
          image_url,
          is_available,
        }}
        keys={keys}
        isOpen={editIsOpen}
        onClose={editOnClose}
      />
    </HStack>
  );
}
