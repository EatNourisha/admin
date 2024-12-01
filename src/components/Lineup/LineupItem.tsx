import { Box, BoxProps, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import { daysOfWeek } from "config";
import { MealPackRo, MealRo } from "interfaces";
import { ILineupFoodItem } from "pages/Users/LineupData";

interface LineupItemProps extends BoxProps {
  day: string;
  pack: MealPackRo;
  activeDays?: string[];
  onMealClick?: (day: string, mealType: "lunch" | "dinner") => void;
}

export function LineupItem(props: LineupItemProps) {
  const { day, pack, activeDays, onMealClick, ...xprops } = props;  
  const keys = Object.keys(pack);
  if (!activeDays?.includes(day.toLowerCase())) return null;

  return daysOfWeek.map((d) => d.toUpperCase()).includes(day.toUpperCase()) ? (
    <Box {...xprops}>
      <Text
        fontSize="14px"
        fontWeight="500"
        textTransform="capitalize"
        mb="8px"
        color="#7E8494"
      >
        {day}
      </Text>
      <Grid templateColumns="repeat(2, 1fr)" gap="8px">
        {keys.map((key) => {
          return (
            (key === "lunch" || key === "dinner") && (
              <Meal
                pack={pack}
                key={key}
                title={key}
                onClick={() => onMealClick?.(day, key)}
                {...(pack as any)[key]}
              />
            )
          );
        })}
      </Grid>
    </Box>
  ) : (
    <></>
  );
}

interface MealProps extends MealRo, BoxProps {
  title: string;
  pack: { [key: string]: ILineupFoodItem };
  onClick?: () => void;
}

function Meal(props: MealProps) {
  const { title, pack, name, onClick, ...xprops } = props;
  const foodItem: ILineupFoodItem = pack[title];

  

  return foodItem?.mealId ? (
    <VStack>
      <Box
        p="10px"
        w="100%"
        onClick={onClick}
        cursor="pointer"
        borderRadius="8px"
        border="1px solid transparent"
        borderColor="brand.neutral"
        {...xprops}
      >
        <Text
          color="gray.400"
          fontSize="14px"
          fontWeight="500"
          textTransform="capitalize"
        >
          {title}
        </Text>
        {foodItem?.mealId?.name ? (
          <Text fontSize="14px" textTransform="capitalize">
            {foodItem?.mealId?.name}
          </Text>
        ) : (
          "---"
        )}
        <HStack mt="8px">
          {foodItem?.extraId?.name && (
            <Box width="100%" fontSize={14} alignItems="start">
              <Text color="gray.400">Swallow</Text>
              <Text color="#303237">{foodItem?.extraId?.name}</Text>
            </Box>
          )}
          {foodItem?.proteinId?.name && (
            <Box width="100%" fontSize={14}>
              <Text color="gray.400">Protein</Text>
              <Text color="#303237">{foodItem?.proteinId?.name}</Text>
            </Box>
          )}
        </HStack>
      </Box>
    </VStack>
  ) : (
    <Box
      p="10px"
      w="100%"
      onClick={onClick}
      borderRadius="8px"
      border="1px solid transparent"
      borderColor="brand.neutral"
      {...xprops}
    >
      <Text
        color="gray.400"
        fontSize="14px"
        fontWeight="500"
        textTransform="capitalize"
      >
        {title}
      </Text>
    </Box>
  );
}
