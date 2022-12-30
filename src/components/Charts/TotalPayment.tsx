import { Box, BoxProps, HStack, Text } from "@chakra-ui/react";
import Loader from "components/Loader/Loader";
import { init, EChartsOption, ECharts } from "echarts";
import useDashboard from "hooks/useDashboard";
import { useEffect, useMemo, useRef } from "react";
import { currencyFormat } from "utils";

interface Props extends BoxProps {}

export default function TotalPayment(props: Props) {
  const { data, isLoading } = useDashboard();
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chart = useRef<ECharts | null>(null);

  const options: EChartsOption = useMemo(
    () => ({
      tooltip: {
        trigger: "item",
        confine: true,
      },
      legend: {
        bottom: "5%",
        left: "left",
        orient: "vertical",
      },
      color: ["#03CCAA", "#FFC044", "#1B2CC1"],
      // polar: {
      //   center: ["10%", "10%"],
      // },
      series: [
        {
          name: "Total Payment",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["50%", "30%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
            shadowColor: "rgba(3, 204, 170, 0.25)",
            shadowOffsetX: 0,
            shadowOffsetY: 4,
            shadowBlur: 12,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "14",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 1048, name: "Doctor's Subscription" },
            { value: 2000, name: "Therapist's Subscription" },
            { value: 580, name: "Free Trial" },
          ],
        },
      ],
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

    window.addEventListener("resize", chart.current?.resize as any);

    return () => {
      window.removeEventListener("resize", chart.current?.resize as any);
    };
  }, [options]);

  useEffect(() => {
    if (chart.current && data) {
      chart.current.setOption({
        ...options,

        series: [
          {
            ...(options.series as any)[0],
            data: [
              {
                value: data?.totalDoctorSubscriptionPayment ?? 0,
                name: "Doctor's Subscription",
              },
              {
                value: data?.totalTherapistSubscriptionPayment ?? 0,
                name: "Therapist's Subscription",
              },
              {
                value: data?.totalFreeTrialSubscriptionPayment ?? 0,
                name: "Free Trial",
              },
            ],
          },
        ],
      });
    }
  }, [options, data]);

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
      <Text fontSize="18px" fontWeight="700" mb="10px">
        Total Payment
      </Text>
      <HStack
        justifyContent="center"
        alignItems="center"
        w="100%"
        px="6px"
        pos="absolute"
        bottom="30%"
        left="0px"
      >
        <Text mt="0 !important" fontSize="28px" fontWeight="700">
          {/* ₦500,000 */}
          {currencyFormat("ngn").format(data?.totalSubscriptionPayment ?? 0)}
        </Text>
      </HStack>

      <Box
        ref={chartRef}
        id="totalPayment__chart"
        pos="relative"
        h="90%"
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
