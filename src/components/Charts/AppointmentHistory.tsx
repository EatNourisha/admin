import { useEffect, useMemo, useRef } from "react";
import { Box, BoxProps, HStack, Text } from "@chakra-ui/react";
import Loader from "components/Loader/Loader";
import { init, EChartsOption, ECharts } from "echarts";
import useDashboard from "hooks/useDashboard";
import isEmpty from "lodash/isEmpty";

interface Props extends BoxProps {}

type SourceType = [string, number | string, number | string][];

export default function AppointmentHistory(props: Props) {
  const { data, isLoading } = useDashboard();

  const demograhics = useMemo(
    () => (data?.genderDemoGraphic ?? []).sort((a, b) => a?.month - b?.month),
    [data]
  );

  const source = useMemo(() => {
    const _: SourceType = [["gender", "Male", "Female"]];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    demograhics?.forEach((graph, i) => {
      const month = months[graph.month - 1];
      const maleScore =
        graph.genderScores?.find((v) => v.gender === "male")?.count ?? 0;
      const femaleScore =
        graph.genderScores?.find((v) => v.gender === "female")?.count ?? 0;
      _.push([month, maleScore, femaleScore]);
    });

    return _;
  }, [demograhics]);

  console.log("Appointment History Source", source);

  const chartRef = useRef<HTMLDivElement | null>(null);
  const chart = useRef<ECharts | null>(null);

  const options: EChartsOption = useMemo(
    () => ({
      legend: {
        itemWidth: 16,
        itemHeight: 16,
        orient: "horizontal",
        right: "10%",
      },
      tooltip: {},
      dataset: {
        source: [
          ["gender", "Male", "Female"],
          ["Jan", 140, 110],
          ["Feb", 80, 120],
          ["Mar", 100, 30],
          ["Apr", 50, 45],
          ["May", 90, 130],
          ["Jun", 60, 25],
          ["Jul", 25, 60],
          ["Aug", 140, 120],
          ["Sep", 30, 10],
          ["Oct", 10, 60],
          ["Nov", 100, 101],
          ["Dec", 70, 35],
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
        { type: "bar", roundCap: true, itemStyle: { borderRadius: 8 } },
        { type: "bar", roundCap: true, itemStyle: { borderRadius: 8 } },
      ],
      color: ["#3385F7", "#FF6550"],
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
      window.removeEventListener(
        "resize",
        (chart.current as ECharts).resize as any
      );
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
      p="30px 0px"
      pb="10px"
      m="0"
      pos="relative"
      {...props}
    >
      <HStack
        justifyContent="space-between"
        w="100%"
        px="6px"
        pos="absolute"
        left="6%"
      >
        <Text mt="0 !important" fontSize="21px" fontWeight="700">
          Appointment History
        </Text>
      </HStack>

      <Box
        ref={chartRef}
        id="appointmentHistory__chart"
        pos="relative"
        h="320px"
        // w="800px"
        overflow="hidden"
      />

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
