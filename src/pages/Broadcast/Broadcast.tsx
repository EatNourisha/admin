import { useMemo } from "react";
import { Badge, Box, Button, HStack, Text } from "@chakra-ui/react";
import {
  APaginator,
  GenericTable,
  GenericTableItem,
  Icon,
  MainLayoutContainer,
  PageMotion,
  Topbar,
} from "components";

import { navigate } from "@reach/router";
import configs from "config";
import { omit, orderBy } from "lodash";
import usePageFilters from "hooks/usePageFilters";
import useBroadcasts from "hooks/useBroadcasts";
import { format, parseISO } from "date-fns";

export default function Broadcasts() {
  // const [isLoading, setIsLoading] = useState(true);
  const { state, filter, onPageChange } = usePageFilters({
    limit: 10,
    page: 1,
  });

  const { data, isLoading } = useBroadcasts({
    ...omit(state, ["tag"]),
    tag: filter?.tag,
  });

  const broadcasts = useMemo(
    () => orderBy(data?.data ?? [], ["createdAt"], ["desc"]),
    [data]
  );
  const hasBroadcasts = useMemo(
    () => (broadcasts ?? []).length > 0,
    [broadcasts]
  );

  // useEffect(() => {
  //   const timer = setTimeout(() => setIsLoading(false), 2000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [isLoading]);

  return (
    <PageMotion key="broadcast-root" pb="100px">
      <Topbar pageTitle="Broadcasts" />
      <MainLayoutContainer>
        <Box>
          <HStack as="form" justifyContent="flex-end" w="100%" mb="24px">
            {/* <Input
              // w="100%"
              minH="48px"
              minW="340px"
              maxW="400px"
              placeholder="Search Plans"
              value={state?.searchPhrase ?? ""}
              endAdornment={<Icon type="search" />}
              onChange={(e) => setFilter("searchPhrase", e.target.value)}
              visibility="hidden"
            /> */}

            <Button
              ml="0 !important"
              leftIcon={<Icon type="add" />}
              onClick={() => navigate(configs.paths.sendBroadcast)}
            >
              Broadcast Message
            </Button>
          </HStack>
          <Box
            borderRadius="8px"
            overflow="hidden"
            shadow="0px 2px 12px rgba(0, 0, 0, 0.05)"
          >
            <GenericTable
              isLoading={isLoading}
              headers={["No", "Title", "Tag", "Content", "Date Sent", "Action"]}
            >
              {hasBroadcasts
                ? broadcasts?.map((cast, idx) => (
                    <GenericTableItem
                      isClickable={false}
                      //   key={`broadcast-table-item:${cast?._id}`}
                      onClick={() =>
                        navigate(configs.paths.sendBroadcast, {
                          state: cast,
                        })
                      }
                      cols={[
                        <Text
                          fontSize="14px"
                          textTransform="capitalize"
                          whiteSpace="nowrap"
                          maxW="200px"
                          textOverflow="ellipsis"
                          overflow="hidden"
                        >
                          {idx + 1}
                        </Text>,
                        <Text fontSize="14px">
                          {cast?.title ?? "-------------------"}
                        </Text>,
                        <Badge fontSize="10px">
                          {cast?.tag ?? "-------------------"}
                        </Badge>,
                        <Text
                          fontSize="14px"
                          whiteSpace="nowrap"
                          maxW="400px"
                          textOverflow="ellipsis"
                          overflow="hidden"
                        >
                          {cast?.content ?? "-------------------"}
                        </Text>,
                        <Text fontSize="14px">
                          {!!cast?.createdAt
                            ? format(
                                parseISO(
                                  cast?.createdAt ?? new Date().toDateString()
                                ),
                                "eee, MMM dd, yyyy"
                              )
                            : "--------------"}
                        </Text>,
                        <Button size="sm" variant="outline">
                          Duplicate
                        </Button>,
                      ]}
                    />
                  ))
                : null}
            </GenericTable>
          </Box>

          <Box>
            {/* <PaginatorContainer>
              <Paginator
                {...pageData}
                onPrev={(prev) => onPrevPage(prev)}
                onNext={(next) => onNextPage(next)}
              />
              
            </PaginatorContainer> */}

            {hasBroadcasts && (
              <APaginator
                flexDir={"row"}
                isLoading={isLoading}
                totalCount={data?.totalCount}
                limit={state?.limit}
                page={state?.page}
                onPageChange={onPageChange}
              />
            )}
          </Box>
        </Box>
      </MainLayoutContainer>
    </PageMotion>
  );
}
