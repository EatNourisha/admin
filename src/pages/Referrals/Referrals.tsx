import {
  Box,
  Button,
  HStack,
  // Select,
  VStack,
  Image,
  Text,
  IconButton,
  useDisclosure,
  FormControl,
  Stack,
  useClipboard,
} from "@chakra-ui/react";
import {
  ConfirmationModal,
  GenericTable,
  GenericTableItem,
  Icon,
  Input,
  InputLabel,
  Link,
  MainLayoutContainer,
  PageMotion,
  Paginator,
  PaginatorContainer,
  ReferralCUModal,
  Topbar,
} from "components";

import EmptyFolder from "assets/images/folder.png";
import configs from "config";
import { navigate } from "@reach/router";
import { useMemo } from "react";
import isEmpty from "lodash/isEmpty";
import usePageFilters from "hooks/usePageFilters";
import isEqual from "lodash/isEqual";
import omit from "lodash/omit";
import useReferrals from "hooks/useReferrals";
import { ReferralRo } from "interfaces/auth.interface";
import usePartialState from "hooks/usePartialState";
import useCreateReferral from "hooks/useCreateReferral";
import { CopyIcon } from "@chakra-ui/icons";

function EmptyState() {
  return (
    <Box>
      <HStack justifyContent="flex-end">
        <Button onClick={() => navigate(configs.paths.addAdministrator)}>
          Add Administrator
        </Button>
      </HStack>

      <VStack
        py="180px"
        justifyContent="center"
        maxW="200px"
        textAlign="center"
        m="0 auto"
        alignItems="center"
      >
        <Image boxSize="120px" src={EmptyFolder} alt="" />
        <Text>Sorry, it looks like you have nobody yet</Text>
        <Link
          to={configs.paths.addAdministrator}
          textDecoration="underline"
          color="brand.primary"
          fontWeight="bold"
        >
          Add Administrator
        </Link>
      </VStack>
    </Box>
  );
}

interface IState {
  email: string;
  name: string;
}

export default function Referrals() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { /*state,  setFilter,*/ filter, onPrevPage, onNextPage } =
    usePageFilters({});

  const { data, isLoading, key } = useReferrals({ ...filter });

  const [state, set] = usePartialState<IState>({});

  const refs = useMemo(() => data?.results ?? [], [data]);
  const pageData = useMemo(() => omit(data, "results"), [data]);

  const {
    createReferral,
    isLoading: isCreatingRef,
    isError,
  } = useCreateReferral([key]);

  const handleCreateRef = async () => {
    if (!(state?.name && state?.email)) return;
    const result = await createReferral({ ...state } as any);
    console.log("Create Referral Result", result);
    if (!isError && !!result) onClose();
  };

  return (
    <PageMotion key="referral-root">
      <Topbar pageTitle="Referrals" />
      <MainLayoutContainer>
        <HStack as="form" justifyContent="flex-end" w="100%" mb="24px">
          {/* <Input
            // w="100%"
            minH="48px"
            maxW="300px"
            placeholder="Search Referral"
            startAdornment={<Icon type="search" />}
            value={state?.searchQuery ?? ""}
            onChange={(e) => setFilter("searchQuery", e.target.value)}
          /> */}

          <Button onClick={onOpen}>Create Referral Code</Button>

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

        {!refs && isEmpty(refs) && !isLoading && <EmptyState />}

        {!isLoading && !isEmpty(refs) && (
          <Box
            borderRadius="24px"
            overflow="hidden"
            shadow="0px 2px 12px rgba(0, 0, 0, 0.05)"
          >
            <GenericTable
              isLoading={isLoading}
              headers={[
                "Name of Referral",
                "Email",
                "Code",
                "Nō of Referrals",
                "Action",
              ]}
            >
              {refs?.map((value) => (
                <ReferralItem
                  refreshKey={key}
                  key={`referral-table-item:${value?._id}`}
                  {...value}
                ></ReferralItem>
              ))}
            </GenericTable>
          </Box>
        )}

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

      <ReferralCUModal
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
      </ReferralCUModal>
    </PageMotion>
  );
}

interface ReferralItemProps extends ReferralRo {
  refreshKey: string;
}

function ReferralItem(props: ReferralItemProps) {
  const { _id, name, email, code, users, refreshKey } = props;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onClose: onDeleteClose,
    onOpen: onDeleteOpen,
  } = useDisclosure();

  const { onCopy } = useClipboard(code ?? "");
  const [state, set] = usePartialState<IState>({ name });

  const { deleteReferral, updateReferral, isLoading, isError } =
    useCreateReferral([refreshKey]);

  const handleDeleteRef = async () => {
    const result = await deleteReferral(_id);
    console.log("Deleted Referral Result", result);
    if (!isError && !!result) onClose();
  };

  const handleUpdateRef = async () => {
    if (!state?.name || (!!state?.name && isEqual(state.name, name ?? "")))
      return;
    const result = await updateReferral(_id, { ...state } as any);
    console.log("Updated Referral Result", result);
    if (!isError && !!result) onClose();
  };

  return (
    <>
      <GenericTableItem
        cols={[
          <Text fontSize="14px">{name ?? "----"}</Text>,
          <Text fontSize="14px">{email}</Text>,
          <HStack>
            <Text fontSize="14px">{code}</Text>
            <IconButton
              size="xs"
              aria-label="edit"
              variant="transparent"
              color="brand.neutral500"
              icon={<CopyIcon color="brand.primary" />}
              onClick={onCopy}
            />
          </HStack>,
          <Text fontSize="14px">{(users ?? [])?.length}</Text>,
          <HStack>
            <IconButton
              size="xs"
              aria-label="edit"
              variant="transparent"
              color="brand.neutral500"
              icon={<Icon type="edit" />}
              onClick={onOpen}
            />
            <IconButton
              size="xs"
              aria-label="edit"
              variant="transparent"
              color="brand.primary"
              icon={<Icon type="delete" />}
              // disabled={isRemoving && currentId === value?._id}
              // isLoading={isRemoving && currentId === value?._id}
              // onClick={() => handleRemove(value?._id)}
              onClick={onDeleteOpen}
            />

            <Button
              size="xs"
              variant="transparent"
              color="brand.primary"
              onClick={() => navigate(`${configs.paths.referrals}/${_id}`)}
            >
              View More
            </Button>
          </HStack>,
        ]}
      />

      <ReferralCUModal
        title="Edit Referral Code"
        isOpen={isOpen}
        onClose={onClose}
        buttonText={["Save Changes"]}
        isLoading={isLoading}
        onSave={handleUpdateRef}
      >
        <Stack>
          <FormControl mb="18px !important">
            <InputLabel>Name of Referral</InputLabel>
            <Input
              placeholder="Enter Name of Referral"
              value={state?.name ?? name}
              onChange={(e) => set({ name: e.target.value })}
            />
          </FormControl>
        </Stack>
      </ReferralCUModal>

      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        title="Delete Referral Code"
        onConfirm={handleDeleteRef}
        isLoading={isLoading}
        buttonText={["Delete", "Cancel"]}
        description="Are you sure you want to delete this referral code?"
      />
    </>
  );
}
