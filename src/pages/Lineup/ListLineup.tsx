import { Box, Heading, HStack, Select, Stack } from "@chakra-ui/react";
import {
  APaginator,
  GenericTable,
  MainLayoutContainer,
  PageMotion,
  Topbar,
} from "components";
import { useEffect, useState } from "react";
import { ILineUpItem } from "types";
import { get } from "utils";
import { WeeklyMealLineUp } from "./WeeklyLineup";

export default function ListLineup() {
  const [lineUpData, setLineUpData] = useState<{
    data: ILineUpItem[];
    loading: boolean;
  }>({ data: [], loading: true });
  const [status, setStatus] = useState("");
  const [week, setWeek] = useState("");
  const [page, setPage] = useState(1);




  const getLineUps = async () => {
    setLineUpData({ ...lineUpData, loading: true });
    const data = await get(`/lineups/all?page=${page}&limit=10`);
    //@ts-ignore
    setLineUpData({ loading: false, data: data?.data });
  };

 
  useEffect(() => {
    getLineUps();
  }, [page]);

  useEffect(() => {
    const getStatusLineup = async () => {
      if (status) {
        setLineUpData({ ...lineUpData, loading: true });
        const queryString =
          status === "all" ? "/lineups/all" : `/lineups/all?status=${status}`;
        const data = await get(queryString);
        //@ts-ignore
        setLineUpData({ loading: false, data: data?.data });
      }

      if (week) {
        setLineUpData({ ...lineUpData, loading: true });
        const queryString =
          week === "all" ? "/lineups/all" : `/lineups/all?week=${week}`;
        const data = await get(queryString);
        //@ts-ignore
        setLineUpData({ loading: false, data: data?.data });
      }
    };
    getStatusLineup();
  }, [status, week]);

  return (
    <PageMotion key="dashboard-home">
      <Topbar pageTitle="Line Up" />
      <MainLayoutContainer pb="60px">
        <Stack my="26px">
          <HStack justifyContent="space-between">
            <Heading fontSize="lg" fontWeight="700">
              Weekly Meal Lineups
            </Heading>
            <HStack>
              <Select width="150px" onChange={(e) => setWeek(e.target.value)}>
                <option value="all">All</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Select>
              <Select width="150px" onChange={(e) => setStatus(e.target.value)}>
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="deactivated">Deactivated</option>
              </Select>
            </HStack>
          </HStack>
          <GenericTable
            isLoading={lineUpData.loading}
            headers={["Fullname", "Status", "City", "Delivery day", "Action"]}
          >
            {/* @ts-ignore */}
            {!!lineUpData.data?.lineups?.length ? (
              <WeeklyMealLineUp
                //@ts-ignore
                data={lineUpData.data?.lineups}
                isLoading={false}
              />
            ) : null}
          </GenericTable>
          {/* @ts-ignore */}
          {!!lineUpData.data?.lineups?.length && (
            <APaginator
              flexDir={"row"}
              isLoading={!lineUpData.loading}
              /* @ts-ignore */
              totalCount={lineUpData.data?.totalCount}
              limit={10}
              page={page}
              /* @ts-ignore */
              onPageChange={(p)=> setPage(p)}
            />
          )}
        </Stack>
      </MainLayoutContainer>
    </PageMotion>
  );
}
