import {
  Box,
  Button,
  // HStack,
  Image,
  // Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import Icon from "components/Icon/Icon";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
import { useDropzone, DropzoneState, DropzoneInputProps } from "react-dropzone";

export type FilePreviewType = File & { preview: string };

type RendererType = {
  rootProps: DropzoneState["getRootProps"];
  inputProps:
    | ((props?: DropzoneInputProps | undefined) => DropzoneInputProps)
    | DropzoneInputProps;
  files: File[];
  isDragActive: DropzoneState["isDragActive"];
  isDragReject: DropzoneState["isDragReject"];
  open: DropzoneState["open"];
  title?: string;

  isDisabled?: boolean;
};

interface UploaderProps {
  files?: File[];
  onFiles?: (file: File[]) => void;
  renderer?: (props: RendererType) => JSX.Element;
  changeButtonText?: string;
  maxFiles?: number;
  title?: string;

  isDisabled?: boolean;
}

interface ThumbsProps {
  previewFiles: FilePreviewType[];
}

export const Thumbs = (props: ThumbsProps) => {
  const { previewFiles } = props;
  return (
    <>
      {previewFiles &&
        previewFiles.map((file) => (
          <Box
            key={file?.name}
            w="100%"
            maxH="240px"
            h="100%"
            position="absolute"
            top="0"
            left="0"
            zIndex="1"
          >
            <Box>
              <Image
                w="100%"
                maxH="240px"
                objectFit="contain"
                src={file?.preview}
              />
            </Box>

            {file.type === "application/pdf" && (
              <Box
                pos="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
              >
                <VStack>
                  <Icon boxSize="60px" type="pdf" />
                  <Text textAlign="center" fontSize="sm">
                    {file.name}
                  </Text>
                </VStack>
              </Box>
            )}
          </Box>
        ))}
    </>
  );
};

function Default({
  rootProps,
  inputProps,
  files,
  isDragActive,
  isDragReject,
  title,
}: Omit<RendererType, "open">) {
  // const bgColor = useColorModeValue("rgba(49, 183, 169, 0.1)", "secondary.800");
  const fgColor = useColorModeValue("black", "white");
  const browseColor = useColorModeValue("#31B7A9", "#31B7A9");

  return (
    <Box
      w="100%"
      minH="148px"
      // border="2px dashed transparent"
      borderRadius="8px"
      cursor="pointer"
      pos="relative"
      overflow="hidden"
      p="12px"
      // bg={bgColor}
      {...rootProps}
    >
      <input {...inputProps} />
      {/* <input type="file" /> */}
      {isEmpty(files) && (
        <Box
          pos="relative"
          zIndex={8}
          w="100%"
          h="100%"
          border="1px dashed transparent"
          borderColor="primary.400"
          borderRadius="12px"
          p="12px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <VStack w="100%" justifyContent="center" pos="relative" zIndex="1">
            <Icon type="upload" />
            <VStack justifyContent="center" mt="0 !important">
              <Text color={fgColor} mt="12px !important">
                {!isDragActive && (title ?? "Upload File")}
                {isDragActive && !isDragReject && "Drop it like it's hot!"}
                {isDragReject && "File type not accepted, sorry!"}
              </Text>
              {!isDragActive && (
                <Text
                  cursor="pointer"
                  color={browseColor}
                  textDecoration="underline"
                  mt="16px !important"
                >
                  Browse
                </Text>
              )}
            </VStack>
          </VStack>
        </Box>
      )}

      {/* <Preview /> */}
      <Thumbs previewFiles={files as FilePreviewType[]} />
    </Box>
  );
}

export default function Uploader(props: UploaderProps) {
  const {
    files,
    onFiles,
    renderer,
    changeButtonText,
    isDisabled,
    maxFiles,
    title,
  } = props;
  const ONE_MB = 1048576; // 1 Megabyte === 1048576 Byte;
  // const toast = useToast();

  const [_files, setFiles] = useState(
    files && !isEmpty(files)
      ? files.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      : []
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject, open } =
    useDropzone({
      minSize: 0,
      maxSize: ONE_MB * 5,
      maxFiles: maxFiles ?? 10,
      accept: {
        "image/*": [".png", ".jpg", ".jpeg"],
        // "application/pdf": [".pdf"],
      },
      onDrop: (acceptedFiles) => {
        if (!isDisabled) {
          onFiles && onFiles(acceptedFiles);
          setFiles(
            acceptedFiles.map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
            )
          );
        } //else openModal("featureUnavailable")();
      },
    });

  // console.log("REJECTED FILES", _files);

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      _files.forEach((file) => URL.revokeObjectURL(file?.preview));
    },
    [_files]
  );

  // useEffect(() => {
  //   rejectedFiles?.length > 0 &&
  //     rejectedFiles?.forEach((file) => {
  //       if (file.size > ONE_MB * 5)
  //         toast({
  //           position: "bottom-right",
  //           title: "Oops!!",
  //           description: "File is too large",
  //           status: "error",
  //           duration: 9000,
  //           isClosable: true,
  //         });
  //     });
  // }, [rejectedFiles, toast]);

  const handleClick = (e: any) => {
    // const { onClick } = getInputProps();
    // if (!isDisabled) !!onClick && onClick(e);
    // else openModal("featureUnavailable")();
    console.log("Uploader Click!!");
  };

  const renderDropZone = () => {
    return !renderer
      ? Default({
          rootProps: getRootProps(),
          inputProps: { ...getInputProps(), onClick: handleClick },
          files: _files,
          isDragReject: isDragReject,
          isDragActive: isDragActive,
          title,
        })
      : renderer({
          rootProps: getRootProps(),
          inputProps: { ...getInputProps(), onClick: handleClick },
          files: _files,
          isDragActive,
          isDragReject,
          open,
        });
  };

  return (
    <>
      <VStack
        w="100%"
        border="1px solid transparent"
        borderColor="brand.neutral"
        borderRadius="8px"
      >
        <input {...{ ...getInputProps(), onClick: handleClick }} />

        {renderDropZone()}

        <Text
          fontSize="12px"
          color="grey.300"
          fontWeight="500"
          mt="14px !important"
          mb="14px !important"
        >
          Supported format: PNG, JPEG file no more than 5MB
        </Text>

        {!isEmpty(_files) && (
          <Button
            minH="fit-content"
            maxH="fit-content"
            onClick={open}
            size="xs"
            variant="transparent"
            color="primary.default"
            textDecoration="underline"
            p="2"
            mb="20px !important"
            fontSize="14px"
            fontWeight="400"
          >
            {changeButtonText ?? "Change File"}
          </Button>
        )}
      </VStack>
    </>
  );
}
