import { useMemo } from "react";
import {
  Box,
  BoxProps,
  Button,
  Grid,
  HStack,
  IconButton,
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
  Loader,
  MainLayoutContainer,
  PageMotion,
  Topbar,
} from "components";

import { orderBy } from "lodash";
import usePageFilters from "hooks/usePageFilters";
import { MealRo } from "interfaces";

import { ReactComponent as PlateSVG } from "assets/svgs/plate.svg";
import useMeals from "hooks/useMeals";
import useMealMutations from "hooks/useMealMutations";

export default function Meals() {
  // const [isLoading, setIsLoading] = useState(true);

  const { isOpen, onClose, onOpen } = useDisclosure();

  const { state, filter, onPageChange } = usePageFilters({
    limit: 10,
    page: 1,
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

  // useEffect(() => {
  //   const timer = setTimeout(() => setIsLoading(false), 2000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [isLoading]);

  return (
    <PageMotion key="meals-root" pb="100px">
      <Topbar pageTitle="Meals" />
      <MainLayoutContainer>
        <Box>
          <HStack as="form" justifyContent="flex-end" w="100%" mb="24px">
            <Button
              ml="0 !important"
              leftIcon={<Icon type="add" />}
              onClick={onOpen}
            >
              Add Meal
            </Button>
          </HStack>

          <VStack>
            {hasMeals && (
              <Grid w="100%" templateColumns="repeat(3, 1fr)" gap="16px">
                {/* {Array(12)
              .fill(0)
              .map((_, i) => (
                <MealItem />
              ))} */}

                {meals.map((meal, i) => (
                  <MealItem key={`meal-${i}`} keys={[key]} {...meal} />
                ))}
              </Grid>
            )}
            {!hasMeals && isLoading && <Loader mx="auto" my="160px" />}
          </VStack>

          <Box>
            {hasMeals && meals.length > (state?.limit ?? 0) && (
              <APaginator
                flexDir={"row"}
                isLoading={isLoading}
                totalCount={data?.totalCount}
                limit={state?.limit}
                page={state?.page}
                onPageChange={onPageChange}
              />
            )}
          </Box>
        </Box>

        <AddMealModal keys={[key]} isOpen={isOpen} onClose={onClose} />
      </MainLayoutContainer>
    </PageMotion>
  );
}

interface MealItemProps extends Partial<MealRo>, BoxProps {
  keys?: string[];
}

function MealItem(props: MealItemProps) {
  const { name, keys, ...xprops } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: editIsOpen,
    onOpen: editOnOpen,
    onClose: editOnClose,
  } = useDisclosure();

  const { deleteMeal, isLoading } = useMealMutations(keys);

  const removeMeal = async () => {
    if (!props?._id) return;
    onClose();
    await deleteMeal(props?._id!);
  };

  return (
    <HStack
      p="14px"
      border="1px solid transparent"
      borderColor="brand.neutral"
      borderRadius="8px"
      {...xprops}
    >
      <Box
        w="128px"
        minW="128px"
        h="120px"
        // bg="brand.neutral"
        bg="rgb(233 87 63 / 20%)"
        borderRadius="8px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box as={PlateSVG} boxSize="60px" />
      </Box>

      <Stack p="12px">
        <Text>{name}</Text>
        <HStack>
          <IconButton
            minH="unset"
            minW="unset"
            maxH="unset"
            maxW="unset"
            boxSize="28px"
            borderRadius="8px"
            bg="transparent"
            aria-label="remove perk"
            icon={<Icon type="edit" boxSize="16px" color="black" />}
            _hover={{
              bg: "transparent",
            }}
            _active={{
              bg: "transparent",
            }}
            onClick={editOnOpen}
          />

          <IconButton
            minH="unset"
            minW="unset"
            maxH="unset"
            maxW="unset"
            boxSize="28px"
            borderRadius="8px"
            bg="transparent"
            aria-label="remove perk"
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

      {/* The add meal modal is being used in edit mode here */}
      <AddMealModal
        meal={{
          name,
          _id: props?._id,
          image_url: props?.image_url,
          is_available: props?.is_available,
        }}
        keys={keys}
        isOpen={editIsOpen}
        onClose={editOnClose}
      />
    </HStack>
  );
}
