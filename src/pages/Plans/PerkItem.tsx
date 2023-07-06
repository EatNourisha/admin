import {
  Box,
  BoxProps,
  Button,
  HStack,
  IconButton,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { PerkType } from "./usePlanForm";
import { useMemo, useState } from "react";
import { Icon } from "components";

interface PerkItemProps extends BoxProps {
  isLoading?: boolean;
  content?: string;
  index?: number;
  mode?: "edit" | "read";
  editMode?: boolean;
  onSaveDraft?: (e: Partial<PerkType>) => void;
  onRemove?: (e: Partial<PerkType>) => void;
  toggleEditMode?: (index: number) => void;
}

export function PerkItem(props: PerkItemProps) {
  const {
    index,
    content,
    isLoading,
    mode = "read",
    editMode,
    onSaveDraft,
    onRemove,
    toggleEditMode,
    ...xprops
  } = props;

  const [_content, setContent] = useState<string | null>(content ?? null);

  // console.log(`Content #${index ?? 0}`, content, _content);

  const isEditable = useMemo(
    () => mode === "edit" || !!editMode,
    [mode, editMode]
  );

  return (
    <Box>
      <Box
        p="12px 16px"
        borderRadius="8px"
        border="1px solid transparent"
        borderColor="brand.neutral100"
        overflow="hidden"
        {...xprops}
      >
        <HStack w="100%" justifyContent="space-between">
          <Stack w="100%">
            <Skeleton
              isLoaded={!isLoading ?? true}
              w="fit-content"
              h={isLoading ? "8px" : "fit-content"}
              borderRadius="12px"
              // mt="8px"
            >
              <Text fontSize="12px" mt="0 !important" color="brand.greyText">
                Perk #{isEditable ? "Draft" : index}
              </Text>
            </Skeleton>

            <SkeletonText
              isLoaded={!isLoading ?? true}
              w="100%"
              h={isLoading ? "12px" : "fit-content"}
              borderRadius="10px"
              // mt="8px"
            >
              {isEditable ? (
                <Textarea
                  w="100%"
                  placeholder="Add content"
                  value={_content ?? content ?? ""}
                  onChange={(e) => setContent(e.target.value)}
                />
              ) : (
                <Text fontSize="14px" mt="0 !important" color="black">
                  {content}
                </Text>
              )}
            </SkeletonText>
          </Stack>

          {!isEditable && !isLoading && (
            <IconButton
              minH="unset"
              minW="unset"
              maxH="unset"
              maxW="unset"
              boxSize="28px"
              borderRadius="8px"
              bg="transparent"
              aria-label="remove perk"
              icon={<Icon type="delete" boxSize="16px" />}
              _hover={{
                bg: "transparent",
              }}
              _active={{
                bg: "transparent",
              }}
              onClick={() =>
                onRemove && onRemove({ index, content, removed: true })
              }
            />
          )}

          {!isEditable && !isLoading && (
            <IconButton
              minH="unset"
              minW="unset"
              maxH="unset"
              maxW="unset"
              boxSize="28px"
              borderRadius="8px"
              bg="transparent"
              aria-label="remove perk"
              icon={<Icon type="edit" boxSize="16px" color="black" />}
              _hover={{
                bg: "transparent",
              }}
              _active={{
                bg: "transparent",
              }}
              onClick={() => toggleEditMode && toggleEditMode(index!)}
            />
          )}
        </HStack>
      </Box>

      {isEditable && (
        <HStack my="16px">
          <Button
            size="xs"
            color="brand.black"
            bg="blackAlpha.200"
            variant="transparent"
            fontSize="xs"
            fontWeight="600"
            // leftIcon={<Icon type="add" />}
            onClick={() =>
              onSaveDraft &&
              onSaveDraft({
                index,
                content: _content ?? content,
                removed: false,
                editMode: false,
              })
            }
          >
            Save Draft
          </Button>

          {!!editMode && (
            <Button
              size="xs"
              color="brand.black"
              bg="blackAlpha.200"
              variant="transparent"
              fontSize="xs"
              fontWeight="600"
              // leftIcon={<Icon type="add" />}
              onClick={() => toggleEditMode && toggleEditMode(index!)}
            >
              Cancel
            </Button>
          )}
        </HStack>
      )}
    </Box>
  );
}
