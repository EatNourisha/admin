import { useDisclosure, useToast } from "@chakra-ui/react";
import usePartialState from "hooks/usePartialState";
import useMealMutations from "hooks/useMealMutations";
import { MealRo } from "interfaces";
import { useEffect, useMemo, useRef, useState } from "react";
import { slugify, uploadFile, when } from "utils";

import isEqual from "lodash/isEqual";
import { useParams } from "@reach/router";
import { FilePreviewType } from "components/Uploader/Uploader";

export type ImageType = {
  index: number;
  url: string;
  removed: boolean;
  editMode?: boolean;
};

export interface IMealFormState
  extends Omit<
    MealRo,
    | "_id"
    | "createdAt"
    | "updatedAt"
    | "product_id"
    | "price_id"
    | "images"
    | "slug"
  > {
  images: ImageType[];
  files: FilePreviewType[];
  is_uploading?: boolean;
}

const transformMealToFormState = (meal: MealRo): IMealFormState => {
  return {
    name: meal?.name,
    weight: meal?.weight,
    continent: meal?.continent,
    spice_level: meal?.spice_level,
    category: meal?.category,
    isSwallow: meal?.isSwallow,
    price: { ...meal?.price } as any,
    description: meal?.description,
    image_url: meal?.image_url,
    is_available: meal?.is_available,
    orderType: meal?.orderType,
    country: meal?.country,
    calories: meal?.calories,
    meals: meal?.meals ?? [],
    images: (meal?.images ?? []).map((image, i) => ({
      index: i,
      url: image,
      editMode: false,
      removed: false,
    })),
    available_quantity: meal?.available_quantity,
    files: [],
  };
};

export function useMealForm(meal?: MealRo) {
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { id } = useParams();

  const initialChanges = useRef<IMealFormState>(
    transformMealToFormState((meal ?? {}) as any)
  );
  const hasChanges = useRef<boolean>(false);

  const [state, set] = usePartialState<IMealFormState>(
    transformMealToFormState((meal ?? {}) as any),
    [meal]
  );

  const setPrice = (updates: Partial<MealRo["price"]>) => {
    return set({ price: { ...state?.price, ...(updates as any) } });
  };

  const hasImages = useMemo(
    () => (state?.images ?? []).length > 0,
    [state?.images]
  );

  const [imageDraft, setImageDraft] = useState<ImageType | null>(null);

  const { addNewMeal, updateMeal, isLoading } = useMealMutations();

  const addImageDraft = () => {
    const images = state?.images ?? [];
    const index_already_exist =
      images.findIndex((p) => p.index === images.length) > -1;

    setImageDraft({
      index: when(index_already_exist, images.length + 1, images.length),
      url: "",
      removed: false,
    });
  };

  const saveImageDraft = (perk: Partial<ImageType>) => {
    console.log("Image to save", perk);
    set((draft) => {
      let edited_image = draft.images?.find((p) => p.index === perk?.index);
      if (!!edited_image) {
        edited_image.url = perk?.url!;
        edited_image.editMode = perk?.editMode;
        edited_image.removed = perk?.removed!;
      } else {
        draft.images = [...(draft?.images ?? []), perk as any];
      }
    });
    setImageDraft(null);
  };

  const removeFile = (index: number) => {
    set((draft) => {
      draft.files = draft.files?.filter((_, i) => i !== index);
    });
    setImageDraft(null);
  };

  const toggleImage = (index: number) => {
    set((draft) => {
      const image = draft.images?.find((img) => img?.index === index);
      if (!!image) image.removed = !image?.removed;
    });
  };

  const uploadFiles = async () => {
    const files = state?.files ?? [];
    if ((files ?? [])?.length < 1) return [];

    try {
      set({ is_uploading: true });
      const to_run = files?.filter(Boolean).map((file) => {
        const filename = `${slugify(file?.name)}_${Math.random() * 99999999}`;
        return uploadFile(file, filename);
      });
      const uploads = await Promise.all(to_run);
      set({ is_uploading: false });
      return uploads.map((u) => u.location);
    } catch (error) {
      console.log("Upload Error", error);
      set({ is_uploading: false });
    }
    return [];
  };

  const createMeal = async () => {
    const uploaded_images = await uploadFiles();
    const saved_images = (state?.images ?? [])
      .filter((i) => !i.removed)
      .map((pk) => pk?.url);

    const images = [...saved_images, ...uploaded_images];



    const result = await addNewMeal({
      ...(state as any),
      price:
        {
          ...state?.price,
          deliveryFee: +(state?.price?.deliveryFee ?? 0) as any,
        } ?? {},
      image_url: images[0],
      images,
    });

    return result;
  };

  const saveMealChanges = async () => {
    const uploaded_images = await uploadFiles();
    const saved_images = (state?.images ?? [])
      .filter((i) => !i.removed)
      .map((pk) => pk?.url);

    const result = await updateMeal(id, {
      ...(state as any),
      price:
        {
          ...state?.price,
          deliveryFee: +(state?.price?.deliveryFee ?? 0) as any,
        } ?? {},
      images: [...saved_images, ...uploaded_images],
    });

    return result;
  };

  const submitForm = (callback?: (result: MealRo) => void) => async () => {
    onClose();
    const is_update = !!meal;
    const result = await when(is_update, saveMealChanges, createMeal)();
    if (!!result) {
      callback && callback(result);
      toast({
        position: "bottom-right",
        title: "Success 🎉",
        description: `Meal successfully ${when(
          is_update,
          "updated",
          "created"
        )}`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (!isEqual(initialChanges.current, state)) {
      hasChanges.current = true;
      initialChanges.current = transformMealToFormState(meal as any);
    } else {
      hasChanges.current = false;
      initialChanges.current = transformMealToFormState(meal as any);
    }
  }, [initialChanges, state, hasChanges, meal]);

  console.log("State", state);

  return {
    state,
    set,
    imageDraft,
    addImageDraft,
    hasImages,
    saveImageDraft,
    removeFile,
    toggleImage,
    isLoading: isLoading || state?.is_uploading,
    submitForm,
    isOpen,
    onClose,
    onOpen,
    setPrice,
    hasChanges: hasChanges.current,
  };
}
