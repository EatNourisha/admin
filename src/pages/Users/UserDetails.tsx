import {
  Box,
  BoxProps,
  Button,
  FormControl,
  Grid,
  HStack,
  IconButton,
  Skeleton,
  Stack,
  Switch,
  Text,
  TextProps,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  APaginator,
  ConfirmationModal,
  Gravatar,
  Icon,
  InputLabel,
  Loader,
  MainLayoutContainer,
  PageMotion,
  Textarea,
  Topbar,
  TransactionDetailModal,
} from "components";

import { navigate, useParams } from "@reach/router";
import Modal from "components/Modal";
import ReportModal from "components/Modals/ReportModal";
import { format, parseISO } from "date-fns";
import useBillHistory from "hooks/useBillHistory";
import useLineup from "hooks/useLineUp";
import usePageFilters from "hooks/usePageFilters";
import useUserDetails from "hooks/useUserDetails";
import useUserMutations from "hooks/useUserMutations";
import { TransactionRo } from "interfaces";
import { AllergyRo, UserRo } from "interfaces/auth.interface";
import { capitalize, omit } from "lodash";
import join from "lodash/join";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { currencyFormat, get, post, when } from "utils";
import LineupData from "./LineupData";

export default function UserDetails() {
  const { id } = useParams();
  const toast = useToast();

  const { state, onPageChange } = usePageFilters({ limit: 3, page: 1 });

  const { data: user, isLoading, key } = useUserDetails(id);
  const { suspendUser, isLoading: isSuspending } = useUserMutations([key]);
  const { data: lineupData, isLoading: isLoadingLineup } = useLineup(id);
  const lineup = useMemo(
    () =>
      omit(lineupData, [
        "_id",
        "createdAt",
        "updatedAt",
        "customer",
        "__v",
        "delivery_date",
      ]),
    [lineupData]
  );

  const { data: bill_history, isLoading: isLoadingBills } = useBillHistory(id, {
    ...state,
  });

  const history = useMemo(() => bill_history?.data ?? [], [bill_history]);
  const hasBills = useMemo(() => history?.length > 0, [history]);
  const hasLineup = useMemo(() => Object.keys(lineup).length > 0, [lineup]);
  const isSuspended = useMemo(
    () => !!user?.control?.suspended,
    [user?.control?.suspended]
  );

  const delivery_day = useMemo(() => {
    const info = user?.delivery_info;
    if (!!info && !!info?.next_delivery_date) {
      const day = parseISO(info?.next_delivery_date).getDay(); /// Since nourisha doesn't delivery on sat, sun and mon, consider them not selected by the user.
      if ([6, 0, 1].includes(day)) return "------";
      return format(parseISO(info?.next_delivery_date), "EEE dd, MMM yyyy");
    }

    return info?.delivery_day ?? "------";
  }, [user]);

  const allergies = useMemo(() => {
    const allergys = (user?.preference?.allergies as AllergyRo[]) ?? [];
    if (allergys?.length < 1) return "------";
    return join(
      allergys?.map((a) => a.name),
      ", "
    );
  }, [user]);

  const toggleUserSuspense = async () => {
    const result = await suspendUser(id, !!user?.control?.suspended);
    if (!!result) {
      toast({
        position: "bottom-right",
        title: "Success 🎉",
        description: `User ${when(
          !!user?.control?.suspended,
          "unsuspended",
          "suspened"
        )} successfully`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <PageMotion key="user-details">
      <Topbar pageTitle="Users" />
      <MainLayoutContainer>
        <Grid
          templateColumns={{ base: "1fr", lg: "1.3fr 1fr", "2xl": "1.5fr 1fr" }}
          gap="24px"
        >
          <Box
            p={{ base: "0", md: "38px" }}
            borderRadius="8px"
            border={{ base: "none", md: "2px solid #E7EAEE" }}
            mb={{ base: "0", lg: "20px" }}
          >
            <HStack w="100%" justifyContent="space-between">
              <Button
                size="xs"
                color="brand.black"
                variant="transparent"
                fontSize="md"
                fontWeight="600"
                leftIcon={<Icon type="leftArrow" />}
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
              <HStack gap="10px">
                <FormControl
                  display="flex"
                  w="fit-content"
                  alignSelf="flex-end"
                >
                  <InputLabel
                    isLoading={isSuspending}
                    m="0"
                    htmlFor="isChecked"
                  >
                    {when(isSuspended, "Unsuspend", "Suspend")}
                  </InputLabel>
                  <Switch
                    ml="8px"
                    aria-label="suspend user"
                    disabled={isSuspending || isLoading}
                    isChecked={!!user?.control?.suspended}
                    onChange={toggleUserSuspense}
                    sx={{
                      "--switch-track-width": "26px",
                      ".chakra-switch__track": {
                        bg: "brand.neutral400",
                        padding: "3px",
                        borderRadius: "26px",
                      },
                      ".chakra-switch__track[data-checked]": {
                        bg: "#03CCAA",
                        padding: "3px",
                      },
                      ".chakra-switch__thumb": {
                        shadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      },
                    }}
                  />
                </FormControl>
                <Tooltip label="View Referrals">
                  <IconButton
                    minH="unset"
                    minW="unset"
                    maxH="unset"
                    maxW="unset"
                    boxSize="28px"
                    borderRadius="8px"
                    bg="transparent"
                    aria-label="edit user note"
                    icon={<Icon type="referral" color="black" />}
                    _hover={{
                      bg: "transparent",
                    }}
                    _active={{
                      bg: "transparent",
                    }}
                    _loading={{ color: "brand.primary" }}
                    onClick={() => navigate(`/referrals?customer=${id}`)}
                  />
                </Tooltip>
                <Tooltip label="View Orders">
                  <IconButton
                    minH="unset"
                    minW="unset"
                    maxH="unset"
                    maxW="unset"
                    boxSize="28px"
                    borderRadius="8px"
                    bg="transparent"
                    aria-label="edit user note"
                    icon={<Icon type="subscriptions" color="brand.primary" />}
                    _hover={{
                      bg: "transparent",
                    }}
                    _active={{
                      bg: "transparent",
                    }}
                    _loading={{ color: "brand.primary" }}
                    onClick={() => navigate(`/meals/orders?customer=${id}`)}
                  />
                </Tooltip>
              </HStack>
            </HStack>

            <VStack pt="44px" pb="74px">
              <Gravatar
                variant="vert"
                isLoading={isLoading}
                src={user?.profilePhotoUrl}
                title={join([user?.first_name, user?.last_name], " ")}
                _subtitle={{ textAlign: "center" }}
                platform={user?.platform}
              />
            </VStack>

            <Grid
              templateColumns="repeat(2, 1fr)"
              gap={{ base: "10px", md: "20px" }}
            >
              <Detail
                isLoading={!isLoading}
                title="Email"
                description={user?.email}
                _desc={{ textTransform: "lowercase" }}
              />
              <Detail
                isLoading={!isLoading}
                title="Phone Number"
                description={user?.phone}
              />
              <Detail
                isLoading={!isLoading}
                title="Delivery Day"
                description={delivery_day}
              />
              <Detail
                isLoading={!isLoading}
                title="Allergies"
                description={allergies}
              />
              <Detail
                isLoading={!isLoading}
                title="Address"
                description={join(
                  [
                    user?.address?.address_,
                    user?.address?.city,
                    user?.address?.country,
                    user?.address?.postcode,
                  ],
                  !!user?.address ? ", " : "---"
                )}
              />
              <Detail
                isLoading={!isLoading}
                title="Subscription"
                _desc={{
                  color: when(
                    !!user?.subscription &&
                      user?.subscription?.status !== "active",
                    "brand.error",
                    "inherit"
                  ),
                }}
                description={
                  !!user?.subscription &&
                  user?.subscription?.status === "active" ? (
                    <Text>
                      {when(
                        !!user?.subscription?.plan?.name,
                        `${user?.subscription?.plan?.name} Plan`,
                        undefined
                      )}{" "}
                      <br />
                      {when(
                        !!user?.subscription?.end_date && !isLoading,
                        `Ends ${format(
                          parseISO(
                            user?.subscription?.end_date ??
                              new Date().toISOString()
                          ),
                          "dd MMM, yyyy"
                        )}`,
                        undefined
                      )}
                    </Text>
                  ) : !user?.subscription ? (
                    "NO SUBSCRIPTION"
                  ) : (
                    "CANCELLED"
                  )
                }
              />
            </Grid>

            <Note
              mt="20px"
              customer_id={id}
              isLoading={isLoading}
              note={user?.notes}
              mutationKeys={[key]}
            />

            <Box mt="58px">
              <Text mb="16px">Billing history</Text>
              <VStack gap="10px">
                {!isLoadingBills &&
                  history?.map((tx, i) => (
                    <BillItem
                      isLoading={false}
                      w="100%"
                      key={`transaction-${i}`}
                      {...tx}
                    />
                  ))}
                {!isLoadingBills && history.length === 0 && (
                  <Text color="gray.600" fontSize="sm" textAlign="center">
                    No billing history available
                  </Text>
                )}
                {isLoadingBills &&
                  Array(state?.limit ?? 5)
                    .fill(0)
                    .map((_, i) => (
                      <BillItem
                        isLoading={true}
                        w="100%"
                        key={`transaction-${i}`}
                      />
                    ))}
              </VStack>

              {hasBills && (
                <APaginator
                  flexDir={"row"}
                  isLoading={isLoadingBills}
                  totalCount={bill_history?.totalCount}
                  limit={state?.limit}
                  page={state?.page}
                  onPageChange={onPageChange}
                />
              )}
            </Box>

            <Box display="flex" flexDirection="column" gap="1.5rem">
              <CSReport userId={user?._id} />
              <CSReport userId={user?._id} isFollowUp={true} />
            </Box>
          </Box>

          <LineupData
            user={user}
            isLoading={isLoading || isLoadingLineup}
            lineup={lineup}
            hasLineup={hasLineup}
          />
        </Grid>
      </MainLayoutContainer>
    </PageMotion>
  );
}

interface DetailProps extends BoxProps {
  title: string;
  description?: ReactNode;
  isLoading?: boolean;
  _desc?: TextProps;
}

interface NoteProps extends BoxProps {
  note?: string;
  isLoading?: boolean;
  mutationKeys?: string[];
  customer_id: string;
}

interface BillItemProps extends Partial<TransactionRo>, BoxProps {
  isLoading?: boolean;
}

function Detail(props: DetailProps) {
  const { title, description, isLoading, _desc, ...xprops } = props;

  return (
    <Box
      w="100%"
      p={{ base: "16px", md: "20px 24px" }}
      borderRadius="8px"
      shadow="0px 6px 40px rgba(0, 0, 0, 0.05)"
      wordBreak="break-word"
      {...xprops}
    >
      <VStack alignItems="flex-start" color="brand.black">
        <Text fontSize="md" fontWeight="400" color="brand.greyText">
          {title}
        </Text>
        <Skeleton isLoaded={isLoading} borderRadius="8px" {..._desc}>
          <Text
            fontSize={{ base: "14px", md: "18px" }}
            textTransform="capitalize"
            {..._desc}
          >
            {description ?? "--------"}
          </Text>
        </Skeleton>
      </VStack>
    </Box>
  );
}

function BillItem(props: BillItemProps) {
  const {
    _id,
    status,
    currency,
    reason,
    amount,
    createdAt,
    isLoading,
    ...xprops
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      p="12px 16px"
      borderRadius="8px"
      border="1px solid transparent"
      borderColor="brand.neutral100"
      {...xprops}
    >
      <HStack justifyContent="space-between">
        <Stack>
          <Skeleton
            isLoaded={!isLoading}
            w="fit-content"
            h={isLoading ? "20px" : "fit-content"}
            borderRadius="12px"
            // mt="8px"
          >
            <Text fontSize="14px" fontWeight="600">
              {capitalize(status ?? "Successful")}{" "}
              {capitalize(reason ?? "Subscription")}
            </Text>
          </Skeleton>
          <Skeleton
            isLoaded={!isLoading}
            w="fit-content"
            h={isLoading ? "8px" : "fit-content"}
            borderRadius="12px"
            // mt="8px"
          >
            <Text fontSize="12px" mt="0 !important" color="brand.greyText">
              {/* Fri, July 23, 2021 */}
              {!!createdAt
                ? format(
                    parseISO(createdAt ?? new Date().toDateString()),
                    "eee, MMM dd, yyyy"
                  )
                : "Fri, July 23, 2021"}
            </Text>
          </Skeleton>

          <Skeleton
            isLoaded={!isLoading}
            w="fit-content"
            h={isLoading ? "12px" : "fit-content"}
            borderRadius="10px"
            // mt="8px"
          >
            <Button
              p="0"
              variant="transparent"
              size="xs"
              w="fit-content"
              fontSize="12px"
              fontWeight="500"
              color="brand.primary"
              onClick={onOpen}
            >
              View payment details
            </Button>
          </Skeleton>
        </Stack>

        <Skeleton
          isLoaded={!isLoading}
          w="fit-content"
          h={isLoading ? "12px" : "fit-content"}
          borderRadius="12px"
          alignSelf="flex-start"
        >
          <Text
            alignSelf="flex-start"
            fontSize="14px"
            fontWeight="600"
            mt="0 !important"
            color="black"
          >
            {currencyFormat((currency as any) ?? "gbp").format(amount ?? 0)}
          </Text>
        </Skeleton>
      </HStack>

      {!!_id && (
        <TransactionDetailModal _id={_id!} isOpen={isOpen} onClose={onClose} />
      )}
    </Box>
  );
}

function Note(props: NoteProps) {
  const toast = useToast();
  const { customer_id, note, isLoading, mutationKeys, ...xprops } = props;

  const [_note, setNote] = useState(note);
  const [inEditMode, setEditMode] = useState(false);

  const { addNote, isLoading: isAddingNote } = useUserMutations(mutationKeys);

  const saveNote = async () => {
    if (!_note) return;
    const result = await addNote(customer_id, { notes: _note! });
    if (!!result) {
      setEditMode(false);
      toast({
        position: "bottom-right",
        title: "Success 🎉",
        description: `Note ${when(!!note, "updated", "added")} successfully`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      w="100%"
      h="fit-content"
      p="24px 22px"
      borderRadius="8px"
      shadow="0px 6px 40px rgba(0, 0, 0, 0.05)"
      {...xprops}
    >
      <HStack color="brand.black" justifyContent="space-between">
        {/* <Icon type="phone" /> */}
        <Text fontSize="md" fontWeight="400" color="brand.greyText">
          Note
        </Text>

        <IconButton
          minH="unset"
          minW="unset"
          maxH="unset"
          maxW="unset"
          boxSize="28px"
          borderRadius="8px"
          bg="transparent"
          aria-label="edit user note"
          icon={
            <Icon type={when(inEditMode, "cancel", "edit")} color="black" />
          }
          _hover={{
            bg: "transparent",
          }}
          _active={{
            bg: "transparent",
          }}
          _loading={{ color: "brand.primary" }}
          onClick={() => setEditMode(!inEditMode)}
          disabled={isLoading || isAddingNote}
          // disabled={isDeleting}
          // isLoading={isDeleting}
        />
      </HStack>

      <Skeleton
        isLoaded={!isLoading}
        w="100%"
        h={isLoading ? "20px" : "fit-content"}
        borderRadius="12px"
        mt="8px"
      >
        <Text
          fontSize="18px"
          textTransform="none"
          color={when(!!note, "black", "brand.greyText")}
        >
          {!inEditMode && (note ?? "Click the button to add a note")}
          {inEditMode && (
            <Textarea
              w="100%"
              color="black"
              placeholder="Add note"
              value={_note ?? note ?? ""}
              onChange={(e) => setNote(e.target.value)}
            />
          )}
        </Text>
      </Skeleton>

      {inEditMode && (
        <Button
          mt="12px"
          size="xs"
          color="white"
          // bg="blackAlpha.200"
          bg="brand.primary"
          variant="transparent"
          fontSize="xs"
          fontWeight="600"
          borderRadius="4px"
          // leftIcon={<Icon type="add" />}
          onClick={saveNote}
          isLoading={isAddingNote}
          disabled={isLoading || isAddingNote}
        >
          Save Note
        </Button>
      )}
    </Box>
  );
}

interface CSReportProps {
  userId?: string;
  isFollowUp?: boolean;
}

const CSReport = ({ userId, isFollowUp = false }: CSReportProps) => {
  // State management
  const [selectedCSId, setSelectedCSId] = useState<string>("");
  const [text, setText] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [csData, setCSData] = useState<{
    loading: boolean;
    data: { team_member: UserRo; added_by: UserRo; _id: string }[];
  }>({
    loading: true,
    data: [],
  });

  const toast = useToast();

  // Fetch CS admins
  const fetchCSAdmins = useCallback(async () => {
    const admins = await get(`cs`);
    setCSData({
      loading: false,
      //@ts-ignore
      data: admins?.data,
    }); //@ts-ignore
    // setSelectedCSId(admins?.data[0]?._id);
  }, []);

  // Fetch existing report/followup data
  // const fetchExistingData = useCallback(async () => {
  //   const endpoint = isFollowUp ? "followup" : "report";
  //   const data = await get(`cs/${endpoint}/${userId}`);

  //   //@ts-ignore
  //   const existingText = data?.data?.[0]?.text;
  //   if (existingText) {
  //     setText(existingText);
  //   }
  // }, [userId, isFollowUp]);

  useEffect(() => {
    fetchCSAdmins();
    // fetchExistingData();
  }, [fetchCSAdmins]);

  // Handle save
  const handleSave = async () => {
    if (!text) return;

    setLoading(true);
    const endpoint = isFollowUp ? "followup" : "report";

    try {
      await post(`/cs/${endpoint}/${userId}`, { text, teamId: selectedCSId });
      setConfirmModal(false);
      setText("");
      setSelectedCSId("");
      toast({
        position: "bottom-right",
        title: `${isFollowUp ? "Follow up" : "Report"} added`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        position: "bottom-right",
        title: "Error",
        description: "Failed to save",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-4 flex-col mb-8">
      {/* Modals */}
      <ConfirmationModal
        isOpen={confirmModal}
        title="Confirm"
        isLoading={loading}
        onConfirm={handleSave}
        onClose={() => setConfirmModal(false)}
        description="Are you sure you want to proceed?"
      />
      <Modal show={historyModal} onClose={() => setHistoryModal(false)}>
        <ReportModal
          userId={userId}
          isFollowUp={isFollowUp}
          close={() => setHistoryModal(false)}
        />
      </Modal>

      {/* Report/Follow Up Section */}
      <div className="flex justify-between">
        <p className="text-sm" style={{ color: "#7e8494" }}>
          {isFollowUp ? "FOLLOW UP" : "REPORT"}
        </p>
        <p
          className="cursor-pointer text-sm text-primary"
          onClick={() => setHistoryModal(true)}
        >
          VIEW {isFollowUp ? "FOLLOW UP" : "REPORT"} HISTORY
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Enter ${isFollowUp ? "follow up" : "report"} here`}
        className="h-[8.2835rem] w-full border-[1px] border-[#BDC0CE] rounded-[0.5rem] p-4"
      />

      {/* CS Selection Section */}
      {!isFollowUp && (
        <div>
          <p className="text-[#7e8494] text-sm mb-4">CX</p>
          {csData.loading ? (
            <Loader />
          ) : (
            <select
              onChange={(e) => setSelectedCSId(e.target.value)}
              className="border-[1px] border-[#BDC0CE] h-[3.75rem] w-full rounded-[0.5rem] px-3"
              placeholder="Select CS"
              value={selectedCSId}
            >
              <option value="">Select CX</option>
              {csData.data.map((user, index) => (
                <option value={user._id} key={`cs_user_${index}`}>
                  {user.team_member.first_name} {user.team_member.lastName}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      <div className="flex justify-end item-center gap-4">
        <Button
          onClick={() => text && setConfirmModal(true)}
          isDisabled={loading || !text || (!isFollowUp && !selectedCSId)}
          className="rounded-[0.5rem] flex justify-center items-center font-inter text-sm text-primary border-[1px] border-primary p-[0.625rem] py-4"
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};
