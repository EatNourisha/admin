import { Box, Grid, HStack, Select, Text } from "@chakra-ui/react";
import {
  AppointmentStatus,
  CircleIcon,
  ConsultationBadge,
  Gravatar,
  Icon,
  Input,
  MainLayoutContainer,
  Means,
  PageMotion,
  SubscriptionBadge,
  Topbar,
} from "components";
import { MeansOfContact } from "interfaces";
import { useMemo } from "react";

interface TotalFeatureCountProps {
  type: "appointments" | "patients" | "doctors";
  value: number;
  label: string;
}

function TotalFeatureCount(props: TotalFeatureCountProps) {
  const { type, value, label } = props;

  const iconColor = useMemo(() => {
    const map: Record<
      TotalFeatureCountProps["type"],
      { bg: string; shadow: string }
    > = {
      appointments: { bg: "brand.lightGreen", shadow: "0 10px 20px #03CCAA4f" },
      patients: { bg: "brand.red", shadow: "0 10px 20px #E5432E4f" },
      doctors: { bg: "brand.lightBlue", shadow: "0 10px 20px #0066F54f" },
    };

    return map[type];
  }, [type]);

  return (
    <Box
      p="40px 34px"
      border="1px solid transparent"
      borderColor="brand.neutral"
      borderRadius="24px"
      minW="252px"
    >
      <HStack>
        <CircleIcon
          type={type as any}
          size="lg"
          bg={iconColor.bg}
          shadow={iconColor.shadow}
        />

        <Box ml="8px !important">
          <Text fontSize="3xl" fontWeight="800" color="brand.black">
            {value}
          </Text>
          <Text fontSize="md" fontWeight="400">
            {label}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
}

export default function Home() {
  return (
    <PageMotion key="dashboard-home">
      <Topbar pageTitle="Dashboard" />
      <MainLayoutContainer>
        <Grid templateColumns="2.5fr 1fr">
          <Box>
            <Grid templateColumns="repeat(3, 1fr)" gap="24px">
              <TotalFeatureCount
                type="appointments"
                value={563}
                label="Appointments"
              />
              <TotalFeatureCount type="patients" value={120} label="Patients" />
              <TotalFeatureCount type="doctors" value={400} label="Doctors" />
            </Grid>
          </Box>
        </Grid>

        <Box mt="20px">
          <ConsultationBadge type="doctor" />
          <ConsultationBadge type="therapist" />
        </Box>

        <Box mt="20px">
          <SubscriptionBadge type="doctor" />
          <SubscriptionBadge type="therapist" />
          <SubscriptionBadge type="free" />
        </Box>

        <Box mt="20px">
          {Object.values(MeansOfContact).map((type) => (
            <Means key={`means-of-contact:${type}`} type={type as any} />
          ))}
        </Box>

        <Box mt="20px">
          {["pending", "completed"].map((status) => (
            <AppointmentStatus
              key={`status:${status}`}
              status={status as any}
            />
          ))}
        </Box>

        <Box mt="20px">
          <Gravatar title="Dolphin Ademide" />
          <Gravatar
            variant="horizDouble"
            title="Dolphin Ademide"
            subtitle="male"
          />
          <Gravatar variant="vert" title="Dolphin Ademide" subtitle="male" />
        </Box>

        <Box mt="20px">
          <Input
            w="100%"
            minH="48px"
            maxW="300px"
            placeholder="Search Patient"
            startAdornment={<Icon type="search" />}
          />

          <Select
            mt="10px"
            placeholder="Select Option"
            minH="48px"
            maxW="300px"
          >
            <option>Value</option>
          </Select>
        </Box>
      </MainLayoutContainer>
    </PageMotion>
  );
}
