import { Box, BoxProps, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import { MealPackRo, MealRo } from "interfaces";
import { useMemo, useState } from "react";
import { ILineUpFoodItem } from "types";
import { omit } from "lodash";
import { daysOfWeek } from "config";

interface LineupItemProps extends BoxProps {
  day: string;
  pack: MealPackRo;
}

export function LineupItem(props: LineupItemProps) {
  const { day, pack, ...xprops } = props;
  const keys = Object.keys(pack);



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
              <Meal pack={pack} key={key} title={key} {...(pack as any)[key]} />
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
  pack: { launch: string; dinner: string };
}

function Meal(props: MealProps) {
  const { title, pack, name, ...xprops } = props;
  //@ts-ignore
  const foodItem: ILineUpFoodItem = pack[title];

  return foodItem?.mealId ? (
    <VStack>
      <Box
        p="10px"
        w="100%"
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
      </Box>
      {foodItem?.extraId?.name && (
        <HStack width="100%" fontSize={14} color="#303237">
          <Text color="#303237">Extra: {foodItem?.extraId?.name}</Text>
        </HStack>
      )}
    </VStack>
  ) : (
    <Box>
      <Text>---</Text>
    </Box>
  );
}
