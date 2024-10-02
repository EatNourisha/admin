import {
  Box,
  Button,
  Grid,
  HStack,
  IconButton,
  Stack,
  VStack,
  Text,
} from "@chakra-ui/react";
import {
  ConfirmationModal,
  Icon,
  MainLayoutContainer,
  PageMotion,
  Topbar,
} from "components";
import { useEffect, useState } from "react";
import { get, destroy } from "utils/makeRequest";
import { ReactComponent as PlateSVG } from "assets/svgs/plate.svg";
import AddMealExtra from "components/Modals/AddMealExtra";

export interface IMealExtra {
  _id?: string;
  createdAt?: string;
  name?: string;
  type?: string;
}

const MealExtraItem = ({
  mealExtras,
  setMealExtras,
  mealExtra,
}: {
  mealExtra: IMealExtra;
  mealExtras: IMealExtra[];
  setMealExtras: (extras: IMealExtra[]) => void;
}) => {
  const [confirmdDeletion, setConfirmdDeletion] = useState(false);
  const [showEditMealExtra, setShowEditMealExtra] = useState(false);
  return (
    <HStack
      p="14px"
      border="1px solid transparent"
      borderColor="brand.neutral"
      borderRadius="8px"
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
        <Text>{mealExtra?.name}</Text>
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
            onClick={() => setShowEditMealExtra(true)}
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
            onClick={() => setConfirmdDeletion(true)}
          />
        </HStack>
      </Stack>

      <ConfirmationModal
        isOpen={confirmdDeletion}
        onClose={() => setConfirmdDeletion(false)}
        title="Confirm"
        onConfirm={() => {
          setMealExtras(
            mealExtras.filter((extra) => extra?._id !== mealExtra?._id)
          );
          setConfirmdDeletion(false);
          destroy(`/meals/extras/${mealExtra?._id}`);
        }}
        buttonText={["Delete"]}
        description="Are you sure you want to delete this meal extra?"
      />

      <AddMealExtra
        isOpen={showEditMealExtra}
        onClose={() => setShowEditMealExtra(false)}
        mealExtra={mealExtra}
        setMealExtras={setMealExtras}
        mealExtras={mealExtras}
      />
    </HStack>
  );
};
function ListMealExtra() {
  const [mealExtras, setMealExtras] = useState<IMealExtra[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAddMealExtraModal, setOpenAddMealExtraModal] = useState(false);

  useEffect(() => {
    const getExtras = async () => {
      return await get(`/meals/extras`);
    };
    getExtras().then((data) => {
      //@ts-ignore
      setMealExtras([...data?.data?.swallow?.data, ...data?.data?.protein?.data]);
      setLoading(false);
    });
  }, []);
  return (
    <PageMotion key="meals-root" pb="100px">
      <Topbar pageTitle="Meals Extra" />
      <MainLayoutContainer>
        <Box>
          <HStack as="form" justifyContent="flex-end" w="100%" mb="24px">
            <Button
              ml="0 !important"
              leftIcon={<Icon type="add" />}
              onClick={() => setOpenAddMealExtraModal(true)}
            >
              Add Meal Extra
            </Button>
          </HStack>

          <VStack>
            {loading ? (
              <div className="text-center text-sm">Loading...</div>
            ) : (
              <Grid w="100%" templateColumns="repeat(3, 1fr)" gap="16px">
                {mealExtras?.map((mealExtra, i) => (
                  <MealExtraItem
                    setMealExtras={setMealExtras}
                    mealExtras={mealExtras}
                    mealExtra={mealExtra}
                    key={`meal-${i}`}
                  />
                ))}
              </Grid>
            )}
          </VStack>
        </Box>

        <AddMealExtra
          isOpen={openAddMealExtraModal}
          onClose={() => setOpenAddMealExtraModal(false)}
          setMealExtras={setMealExtras}
          mealExtras={mealExtras}
        />
      </MainLayoutContainer>
    </PageMotion>
  );
}

export default ListMealExtra;
