import { Box, BoxProps, Grid, Text } from "@chakra-ui/react";
import { MealPackRo, MealRo } from "interfaces";

interface LineupItemProps extends BoxProps {
  day: string;
  pack: MealPackRo;
}

export function LineupItem(props: LineupItemProps) {
  const { day, pack, ...xprops } = props;

  const keys = Object.keys(pack);

  return (
    <Box {...xprops}>
      <Text
        fontSize="14px"
        fontWeight="500"
        textTransform="capitalize"
        mb="8px"
      >
        {day}
      </Text>
      <Grid templateColumns="repeat(2, 1fr)" gap="8px">
        {keys.map((key) => (
          <Meal key={key} title={key} {...(pack as any)[key]} />
        ))}
      </Grid>
    </Box>
  );
}

interface MealProps extends MealRo, BoxProps {
  title: string;
}

function Meal(props: MealProps) {
  const { title, name, ...xprops } = props;

  return (
    <Box
      p="10px"
      w="100%"
      borderRadius="8px"
      border="1px solid transparent"
      borderColor="brand.neutral"
      {...xprops}
    >
      <Text color="brand.greyText" fontSize="12px" textTransform="capitalize">
        {title}
      </Text>
      <Text fontSize="14px">{name}</Text>
    </Box>
  );
}
