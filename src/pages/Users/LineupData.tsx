import { Box, Heading, HStack, Select, Stack } from "@chakra-ui/react";
import { LineupItem, Loader } from "components";

import { EmptyCrate } from "components/Crate/Empty";
import { when } from "utils";

interface LineupDataProps {
  isLoading: boolean;
  lineup: any;
  hasLineup: boolean;
}

function LineupData({ isLoading, lineup, hasLineup }: LineupDataProps) {
  return (
    <Box className="hidden md:block" position="sticky" top="0">
      <HStack justifyContent="space-between">
        <Heading as="h5" fontSize="lg">
          Weekly Meal Lineups
        </Heading>

        <Select
          mt="10px"
          placeholder="Select Option"
          minH="48px"
          maxW="180px"
          visibility="hidden"
        >
          <option>All time</option>
        </Select>
      </HStack>

      <Stack
        mt="16px"
        borderRadius="8px"
        overflow="hidden"
        p="14px"
        shadow={when(!lineup, "0px 2px 12px rgba(0, 0, 0, 0.05)", "none")}
        gap="16px"
      >
        {!!lineup &&
          !isLoading &&
          Object.keys(lineup ?? {}).map((key, i) => (
            <LineupItem key={key} day={key} pack={(lineup! as any)[key]} />
          ))}

        {isLoading && !lineup && <Loader my="80px" />}

        {!isLoading && !hasLineup && (
          <EmptyCrate
            description={"This user is yet to update / select their lineup"}
          />
        )}
      </Stack>
    </Box>
  );
}

export default LineupData;
