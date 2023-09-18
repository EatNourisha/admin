import {
  HStack,
  // Select,
  VStack,
  Tabs,
  Tab,
  TabList,
  TabProps,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { MainLayoutContainer, PageMotion, Topbar } from "components";

import useReferralStats from "hooks/useReferralStats";
import { UsersInvited } from "./Panels/UsersInvited";
import { UsersSubscribed } from "./Panels/UsersSubscribed";
import { PaidOut } from "./Panels/PaidOut";
import { PendingWithdrawals } from "./Panels/PendingWithdrawals";
import { useLocation } from "@reach/router";
import { useMemo } from "react";
import { ReferralCounter } from "components/ReferralCount/ReferralCount";

// function EmptyState() {
//   return (
//     <Box>
//       <HStack justifyContent="flex-end">
//         <Button onClick={() => navigate(configs.paths.addAdministrator)}>
//           Add Administrator
//         </Button>
//       </HStack>

//       <VStack
//         py="180px"
//         justifyContent="center"
//         maxW="200px"
//         textAlign="center"
//         m="0 auto"
//         alignItems="center"
//       >
//         <Image boxSize="120px" src={EmptyFolder} alt="" />
//         <Text>Sorry, it looks like you have nobody yet</Text>
//         <Link
//           to={configs.paths.addAdministrator}
//           textDecoration="underline"
//           color="brand.primary"
//           fontWeight="bold"
//         >
//           Add Administrator
//         </Link>
//       </VStack>
//     </Box>
//   );
// }

// interface IState {
//   email: string;
//   name: string;
// }

export default function Referrals() {
  // const { isOpen, onClose, onOpen } = useDisclosure();

  const location = useLocation();
  const searchParams = useMemo(
    () => new URLSearchParams(location?.search),
    [location?.search]
  );
  const customer = useMemo(
    () => searchParams.get("customer") ?? undefined,
    [searchParams]
  );

  const { data: stats, isLoading: isStatsLoading } = useReferralStats({
    customer,
  });

  console.log("Referral Stats", stats);

  // const [state, set] = usePartialState<IState>({});

  // const refs = useMemo(() => data?.results ?? [], [data]);
  // const pageData = useMemo(() => omit(data, "results"), [data]);

  // const {
  //   createReferral,
  //   isLoading: isCreatingRef,
  //   isError,
  // } = useCreateReferral([key]);

  // const handleCreateRef = async () => {
  //   if (!(state?.name && state?.email)) return;
  //   const result = await createReferral({ ...state } as any);
  //   console.log("Create Referral Result", result);
  //   if (!isError && !!result) onClose();
  // };

  return (
    <PageMotion key="referral-root">
      <Topbar pageTitle="Referrals" />
      <MainLayoutContainer>
        <HStack mt="48px" as="form" justifyContent="center" w="100%" mb="24px">
          <ReferralCounter
            isLoading={isStatsLoading}
            count={
              (stats?.unsubscribed_invites ?? 0) +
              (stats?.subscribed_invites ?? 0)
            }
            description={"Users Invited"}
          />
          <ReferralCounter
            isLoading={isStatsLoading}
            count={stats?.subscribed_invites ?? 0}
            description={"Users subscribed"}
            bg="#E6F7E4"
          />
          <ReferralCounter
            isLoading={isStatsLoading}
            count={stats?.fulfilled_withdrawals ?? 0}
            description={"Paid Out"}
            bg="#FFF8E7"
          />
          <ReferralCounter
            isLoading={isStatsLoading}
            count={stats?.pending_withdrawals ?? 0}
            description={"Pending Withdrawals"}
            bg="#e7f3ff"
          />
        </HStack>

        <VStack position="relative">
          <Tabs w="100%">
            <VStack>
              <TabList
                top="150px"
                position="sticky"
                w="fit-content"
                justifyContent="center"
              >
                <CTab>Users Invited</CTab>
                <CTab>Users Subscribed</CTab>
                {/* <CTab>Paid Out</CTab>
                <CTab>Pending Withdrawals</CTab> */}
              </TabList>
            </VStack>

            <TabPanels>
              <TabPanel>
                <UsersInvited customer={customer} />
              </TabPanel>
              <TabPanel>
                <UsersSubscribed customer={customer} />
              </TabPanel>
              <TabPanel>
                <PaidOut customer={customer} />
              </TabPanel>
              <TabPanel>
                <PendingWithdrawals customer={customer} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </MainLayoutContainer>

      {/* <ReferralCUModal
        title="Create Referral Code"
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isCreatingRef}
        onSave={handleCreateRef}
      >
        <Stack>
          <FormControl mb="18px !important">
            <InputLabel>Name of Referral</InputLabel>
            <Input
              placeholder="Enter Name of Referral"
              value={state?.name}
              onChange={(e) => set({ name: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <InputLabel>Email</InputLabel>
            <Input
              placeholder="Enter Email"
              value={state?.email}
              onChange={(e) => set({ email: e.target.value })}
            />
          </FormControl>
        </Stack>
      </ReferralCUModal> */}
    </PageMotion>
  );
}

// interface ReferralItemProps extends ReferralRo {
//   refreshKey: string;
// }

// function ReferralItem(props: ReferralItemProps) {
//   const { _id, name, email, code, users, refreshKey } = props;
//   const { isOpen, onClose, onOpen } = useDisclosure();
//   const {
//     isOpen: isDeleteOpen,
//     onClose: onDeleteClose,
//     onOpen: onDeleteOpen,
//   } = useDisclosure();

//   const { onCopy } = useClipboard(code ?? "");
//   const [state, set] = usePartialState<IState>({ name });

//   const { deleteReferral, updateReferral, isLoading, isError } =
//     useCreateReferral([refreshKey]);

//   const handleDeleteRef = async () => {
//     const result = await deleteReferral(_id);
//     console.log("Deleted Referral Result", result);
//     if (!isError && !!result) onClose();
//   };

//   const handleUpdateRef = async () => {
//     if (!state?.name || (!!state?.name && isEqual(state.name, name ?? "")))
//       return;
//     const result = await updateReferral(_id, { ...state } as any);
//     console.log("Updated Referral Result", result);
//     if (!isError && !!result) onClose();
//   };

//   return (
//     <>
//       <GenericTableItem
//         cols={[
//           <Text fontSize="14px">{name ?? "----"}</Text>,
//           <Text fontSize="14px">{email}</Text>,
//           <HStack>
//             <Text fontSize="14px">{code}</Text>
//             <IconButton
//               size="xs"
//               aria-label="edit"
//               variant="transparent"
//               color="brand.neutral500"
//               icon={<CopyIcon color="brand.primary" />}
//               onClick={onCopy}
//             />
//           </HStack>,
//           <Text fontSize="14px">{(users ?? [])?.length}</Text>,
//           <HStack>
//             <IconButton
//               size="xs"
//               aria-label="edit"
//               variant="transparent"
//               color="brand.neutral500"
//               icon={<Icon type="edit" />}
//               onClick={onOpen}
//             />
//             <IconButton
//               size="xs"
//               aria-label="edit"
//               variant="transparent"
//               color="brand.primary"
//               icon={<Icon type="delete" />}
//               // disabled={isRemoving && currentId === value?._id}
//               // isLoading={isRemoving && currentId === value?._id}
//               // onClick={() => handleRemove(value?._id)}
//               onClick={onDeleteOpen}
//             />

//             <Button
//               size="xs"
//               variant="transparent"
//               color="brand.primary"
//               onClick={() => navigate(`${configs.paths.referrals}/${_id}`)}
//             >
//               View More
//             </Button>
//           </HStack>,
//         ]}
//       />

//       <ReferralCUModal
//         title="Edit Referral Code"
//         isOpen={isOpen}
//         onClose={onClose}
//         buttonText={["Save Changes"]}
//         isLoading={isLoading}
//         onSave={handleUpdateRef}
//       >
//         <Stack>
//           <FormControl mb="18px !important">
//             <InputLabel>Name of Referral</InputLabel>
//             <Input
//               placeholder="Enter Name of Referral"
//               value={state?.name ?? name}
//               onChange={(e) => set({ name: e.target.value })}
//             />
//           </FormControl>
//         </Stack>
//       </ReferralCUModal>

//       <ConfirmationModal
//         isOpen={isDeleteOpen}
//         onClose={onDeleteClose}
//         title="Delete Referral Code"
//         onConfirm={handleDeleteRef}
//         isLoading={isLoading}
//         buttonText={["Delete", "Cancel"]}
//         description="Are you sure you want to delete this referral code?"
//       />
//     </>
//   );
// }

interface CTabProps extends TabProps {}

function CTab(props: CTabProps) {
  const { children, ...xprops } = props;
  return (
    <Tab
      p="20px"
      {...xprops}
      _selected={{ color: "brand.primary", borderColor: "brand.primary" }}
    >
      {children}
    </Tab>
  );
}
