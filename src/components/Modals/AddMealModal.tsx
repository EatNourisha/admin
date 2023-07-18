import {
  Modal,
  ModalProps,
  ModalContentProps,
  ModalBodyProps,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Heading,
  ModalFooter,
  Button,
  ModalHeader,
  Stack,
  FormControl,
} from "@chakra-ui/react";

import Input from "components/Input/Input";

import Uploader from "components/Uploader/Uploader";
import useMealMutations from "hooks/useMealMutations";
import usePartialState from "hooks/usePartialState";
import { MealRo } from "interfaces";
import { useEffect, useMemo, useRef } from "react";
import { uploadFile, when } from "utils";

import isEqual from "lodash/isEqual";

interface AddMealModalProps extends Omit<ModalProps, "children" | "id"> {
  // Mutation keys
  keys?: string[];
  meal?: Partial<MealRo>;
  _content?: ModalContentProps;
  _body?: ModalBodyProps;
}

interface IMealFormState {
  name: string;
  file: File;
  isUploading?: boolean;
  is_available?: boolean;
}

export default function AddMealModal(props: AddMealModalProps) {
  const { isOpen, onClose, meal, keys, _content, _body, ...xprops } = props;

  const { state, set, hasChanges, isLoading, submitForm } = useMealForm(
    meal,
    keys
  );

  const files = [state?.file!].filter(Boolean);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const result = await submitForm();
    if (!!result) onClose();
  };

  const isDisabled = useMemo(() => {
    if (!!meal) return !hasChanges || !!state?.file || isLoading;
    else return !(state?.file && state?.name) || isLoading;
  }, [state, isLoading, hasChanges, meal]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      isCentered
      {...xprops}
    >
      <ModalOverlay />
      <ModalContent
        bg="white"
        p="38px"
        borderRadius="8px"
        minW="608px"
        w="100%"
      >
        <ModalHeader>
          <Heading fontSize="24px" fontWeight="600">
            {when(!!meal, "Edit", "Add")} Meal
          </Heading>
        </ModalHeader>
        <ModalCloseButton
          top="60px"
          right="64px"
          size="2xl"
          //   disabled={isLoading}
          _focus={{ shadow: `0 0 0 3px var(--focusColor)` }}
        />
        <ModalBody px="24px" overflowY="scroll">
          <Stack as="form" onSubmit={onSubmit}>
            <Uploader
              title="Upload Meal Image"
              files={files}
              onFiles={(files) => set({ file: files[0] })}
            />

            <FormControl mt="16px !important">
              <Input
                placeholder="Enter meal name"
                value={state?.name ?? ""}
                onChange={(e) => set({ name: e.target.value })}
              />
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter justifyContent="flex-start" py="30px">
          <Button
            disabled={isDisabled}
            isLoading={isLoading}
            mr={3}
            minH="48px"
            type="submit"
            onClick={onSubmit}
          >
            Save {when(!!meal, "Changes", "Meal")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function useMealForm(meal?: Partial<MealRo>, keys?: string[]) {
  //   const initialChanges = useRef<string | undefined>(meal?.name);
  const hasChanges = useRef<boolean>(false);

  const [state, set, reset] = usePartialState<IMealFormState>(
    {
      name: meal?.name,
    },
    [meal]
  );

  const { updateMeal, addNewMeal, isLoading } = useMealMutations(keys);

  const createMeal = async () => {
    if (!state?.file) return;
    let image_url: string | null = null;

    try {
      set({ isUploading: true });
      const file = state.file;
      const filename = `${file?.name}_${Math.random() * 99999999}`;
      const res = await uploadFile(file, filename);
      image_url = res.location;

      // console.log("Upload Result", res);
      set({ isUploading: false });
    } catch (error) {
      console.log("Upload Error", error);
      set({ isUploading: false });
    }

    const res = addNewMeal({
      name: state?.name!,
      image_url: image_url as string,
      is_available: true,
      meals: [],
    });

    return res;
  };

  const saveMealChanges = async () => {
    if (!meal || !meal?._id) return;
    let image_url: string | null = null;

    if (!!state?.file) {
      try {
        set({ isUploading: true });
        const file = state.file;
        const filename = `${file?.name}_${Math.random() * 99999999}`;
        const res = await uploadFile(file, filename);
        image_url = res.location;
        set({ isUploading: false });
      } catch (error) {
        console.log("Upload Error", error);
        set({ isUploading: false });
      }
    }
    const res = await updateMeal(meal?._id, {
      name: state?.name ?? meal?.name,
      image_url: image_url ?? meal?.image_url,
      is_available: state?.is_available ?? meal?.is_available,
    });

    return res;
  };

  const submitForm = async () => {
    const result = await when(!!meal, saveMealChanges, createMeal)();
    reset();
    return result;
  };

  useEffect(() => {
    if (!isEqual(meal?.name, state?.name)) {
      hasChanges.current = true;
      //   initialChanges.current = meal?.name;
    } else {
      hasChanges.current = false;
      //   initialChanges.current = meal?.name;
    }
  }, [state, hasChanges, meal]);

  console.log("Changes", state, hasChanges);

  return {
    state,
    set,
    submitForm,
    isLoading: state?.isUploading || isLoading,
    hasChanges: hasChanges.current,
  };
}
