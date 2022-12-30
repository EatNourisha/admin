import { useMemo } from "react";
import { Box, HStack, Text, Button } from "@chakra-ui/react";
import {
  GenericTable,
  GenericTableItem,
  Gravatar,
  Icon,
  Input,
  MainLayoutContainer,
  PageMotion,
  Paginator,
  PaginatorContainer,
  Topbar,
} from "components";
// import usePartialState from "hooks/usePartialState";

import { navigate } from "@reach/router";
import configs from "config";
import useUsers from "hooks/useUsers";
import { capitalize, omit } from "lodash";
import usePageFilters from "hooks/usePageFilters";

export default function Doctors() {
  // const [isLoading, setIsLoading] = useState(true);

  const { filter, onPrevPage, onNextPage } = usePageFilters({});
  const { data, isLoading } = useUsers({ roles: "doctor", ...filter });

  const doctors = useMemo(() => data?.results, [data]);
  const pageData = useMemo(() => omit(data, "results"), [data]);

  // useEffect(() => {
  //   const timer = setTimeout(() => setIsLoading(false), 2000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [isLoading]);

  return (
    <PageMotion key="doctors-root">
      <Topbar pageTitle="Doctors" />
      <MainLayoutContainer>
        <HStack as="form" justifyContent="space-between" w="100%" mb="24px">
          <Input
            // w="100%"
            minH="48px"
            maxW="300px"
            placeholder="Search Doctor"
            startAdornment={<Icon type="search" />}
          />

          {/* <HStack w="fit-content" ml="0 !important" minW="250px">
            <Text fontSize="14px" fontWeight="600" d="inline-block">
              Filter by:
            </Text>
            <Select
              flex="2"
              mt="10px"
              placeholder="Select Option"
              minH="48px"
              // maxW="300px"
            >
              <option>Value</option>
            </Select>
          </HStack> */}
        </HStack>
        <Box
          borderRadius="24px"
          overflow="hidden"
          shadow="0px 2px 12px rgba(0, 0, 0, 0.05)"
        >
          <GenericTable
            isLoading={isLoading}
            headers={[
              "Fullname",
              "Email",
              "Phone Number",
              "Gender",
              "License Number",
              "Total Bookings",
              "Action",
            ]}
          >
            {doctors?.map((value) => (
              <GenericTableItem
                key={`doctors-table-item:${value?._id}`}
                cols={[
                  <Gravatar
                    src={value?.profilePhotoUrl}
                    title={`${value?.firstName} ${value?.lastName}`}
                  />,
                  <Text fontSize="14px">{value?.email}</Text>,
                  <Text fontSize="14px">{value?.phone}</Text>,
                  <Text fontSize="14px">{capitalize(value.gender)}</Text>,
                  <Text fontSize="14px">-----</Text>,
                  <Text fontSize="14px">40 Bookings</Text>,
                  <Button
                    size="xs"
                    variant="transparent"
                    color="brand.primary"
                    leftIcon={<Icon type="view" />}
                    onClick={() =>
                      navigate(`${configs.paths.doctors}/${value?._id}`)
                    }
                  >
                    View More
                  </Button>,
                ]}
              />
            ))}
          </GenericTable>
        </Box>

        <Box>
          <PaginatorContainer>
            <Paginator
              {...pageData}
              onPrev={(prev) => onPrevPage(prev)}
              onNext={(next) => onNextPage(next)}
            />
          </PaginatorContainer>
        </Box>
      </MainLayoutContainer>
    </PageMotion>
  );
}
