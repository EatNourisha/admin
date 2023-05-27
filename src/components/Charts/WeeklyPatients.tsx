import { Box, BoxProps, HStack, Stack, Text } from "@chakra-ui/react";
import { init, EChartsOption, ECharts } from "echarts";
import { useEffect, useMemo, useRef } from "react";

import { ReactComponent as UpStatus } from "assets/svgs/up-status.svg";
import Loader from "components/Loader/Loader";
import useWeeklyPatients from "hooks/useWeeklyPatients";
import { isEmpty } from "lodash";

interface Props extends BoxProps {}
interface PercentageMoveProps extends BoxProps {
  value: number;
}

type SourceType = [string, number | string, number | string][];

// eslint-disable-next-line
function PercentageMove(props: PercentageMoveProps) {
  const { value = 5.02 } = props;

  const color = useMemo(() => {
    const map: Record<string, string> = {
      up: "brand.lightGreen",
      down: "brand.red",
    };

    return map[value > 0 ? "up" : "down"];
  }, [value]);

  return (
    <HStack>
      <Box as={UpStatus} color={color} />
      <Text fontSize="12px" color={color}>
        5.02%
      </Text>
    </HStack>
  );
}

export default function WeeklyPatients(props: Props) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chart = useRef<ECharts | null>(null);

  const { data, isLoading } = useWeeklyPatients();

  const demographics = useMemo(
    () => (data?.genderDemoGraphic ?? []).sort((a, b) => a?.month - b?.month),
    [data]
  );

  const totalPatients = useMemo(
    () => data?.totalPatientsForPeriod ?? 0,
    [data]
  );

  const source = useMemo(() => {
    const _: SourceType = [["gender", "Male", "Female"]];
    const weeks = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
    demographics?.forEach((graph, i) => {
      const week = weeks[graph?.dayOfWeek - 1];
      const maleScore =
        graph?.genderScores?.find((v) => v.gender === "male")?.count ?? 0;
      const femaleScore =
        graph?.genderScores?.find((v) => v.gender === "female")?.count ?? 0;
      _.push([week, maleScore, femaleScore]);
    });

    return _;
  }, [demographics]);

  console.log("Weekly patients demograhics", source);

  const options: EChartsOption = useMemo(
    () => ({
      legend: {
        itemHeight: 22,
        orient: "horizontal",
        bottom: "0%",
      },
      tooltip: {},
      dataset: {
        source: [
          ["gender", "Male", "Female"],
          ["Mon", 12, 6.4],
          ["Tues", 12, 6.2],
          ["Wed", 12, 6.8],
          ["Thurs", 12, 6.3],
          ["Fri", 12, 6.1],
        ],
      },
      xAxis: {
        type: "category",
        axisPointer: {
          show: true,
        },
        axisLine: {
          onZero: false,
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      // Declare several bar series, each will be mapped
      // to a column of dataset.source by default.
      series: [
        { type: "bar", roundCap: true, itemStyle: { borderRadius: 50 } },
        { type: "bar", roundCap: true, itemStyle: { borderRadius: 50 } },
      ],
      color: ["#03CCAA", "#FFC044"],
    }),
    []
  );

  useEffect(() => {
    chart.current = init(
      chartRef.current as HTMLElement,
      {},
      {
        renderer: "svg",
        useDirtyRect: false,
      }
    );

    if (options && typeof options === "object") {
      chart.current.setOption(options);
    }

    window.addEventListener("resize", chart.current.resize as any);

    return () => {
      window.removeEventListener("resize", chart.current?.resize as any);
    };
  }, [options]);

  useEffect(() => {
    if (chart.current && data && !isEmpty(source)) {
      chart.current.setOption({ ...options, dataset: { source } });
    }
  }, [source, options, data]);

  return (
    <Box
      //   maxW="280px"
      borderRadius="24px"
      border="2px solid transparent"
      borderColor="brand.neutral100"
      p="20px 16px"
      pos="relative"
      {...props}
    >
      <HStack justifyContent="space-between" w="100%" px="6px">
        <Text mt="0 !important" fontSize="21px" fontWeight="700">
          New Patient
        </Text>
        <Text fontSize="12px" color="brand.neutral500">
          Weekly
        </Text>
      </HStack>

      <Box
        ref={chartRef}
        id="weeklyPatient__chart"
        pos="relative"
        h="320px"
        overflow="hidden"
      />

      <HStack
        justifyContent="space-between"
        alignItems="flex-start"
        w="100%"
        mt="44px"
      >
        <Stack>
          <Text fontSize="12px" color="brand.neutral500">
            This Week
          </Text>
          <Text mt="0 !important" fontSize="21px" fontWeight="700">
            {totalPatients} Patients
          </Text>
        </Stack>

        {/* <PercentageMove value={5.02} /> */}
      </HStack>

      {isLoading && !data && (
        <Box bg="#ffffff9f" pos="absolute" w="100%" h="100%" top="0" left="0">
          <Loader
            pos="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
          />
        </Box>
      )}
    </Box>
  );
}
