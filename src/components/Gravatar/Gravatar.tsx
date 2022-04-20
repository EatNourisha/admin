import {
  Avatar,
  AvatarProps,
  Box,
  BoxProps,
  Skeleton,
  SkeletonCircle,
  Text,
  TextProps,
} from "@chakra-ui/react";
import { useMemo } from "react";

type VariantNameType = "horizSingle" | "horizDouble" | "vert";

type VariantObjectType = Partial<{
  container: BoxProps;
  avatar: AvatarProps;
  title: TextProps;
  subtitle: TextProps;
  textContainer: BoxProps;
}>;

type VariantMapType = Record<VariantNameType, VariantObjectType>;

interface GravatarProps extends BoxProps {
  src?: string;
  orientation?: "horizontal" | "vertical";
  title?: string;
  subtitle?: string;
  _avatar?: AvatarProps;
  _title?: TextProps;
  _subtitle?: TextProps;
  _container?: TextProps;
  _textContainer?: TextProps;
  variant?: VariantNameType;
  isLoading?: boolean;
  initials?: string;
}

export default function Gravatar(props: GravatarProps) {
  const {
    orientation = "horizontal",
    title,
    subtitle,
    src,
    _avatar,
    variant,
    _title,
    _subtitle,
    _container,
    _textContainer,
    isLoading,
    initials,
  } = props;

  const _orientation = useMemo(() => {
    const map: Record<"horizontal" | "vertical", "row" | "column"> = {
      horizontal: "row",
      vertical: "column",
    };

    return map[orientation];
  }, [orientation]);

  const variants = useMemo(() => {
    const map: VariantMapType = {
      horizSingle: {
        container: {
          flexDir: "row",
        },
        avatar: {
          size: "sm",
        },
        title: {},
        subtitle: {},
        textContainer: { ml: "8px" },
      },
      horizDouble: {
        container: {
          flexDir: "row",
        },
        avatar: {
          size: "md",
        },
        title: {
          fontSize: "md",
          fontWeight: "600",
        },
        subtitle: {
          fontSize: "12px",
          fontWeight: "400",
        },
        textContainer: { ml: "8px" },
      },
      vert: {
        container: {
          flexDir: "column",
        },
        avatar: {
          size: "xl",
        },
        textContainer: {
          ml: 0,
          mt: "10px",
          d: "flex",
          flexDir: "column",
          alignItems: "center",
          justifyContent: "center",
        },
        title: {
          fontSize: "18px",
          fontWeight: "600",
        },
        subtitle: {
          fontSize: "md",
          fontWeight: "400",
        },
      },
    };

    return map[variant ?? "horizSingle"];
  }, [variant]);

  return (
    <Box
      d="flex"
      flexDir={_orientation}
      justifyContent="center"
      alignItems="center"
      w="fit-content"
      {...variants?.container}
      {..._container}
    >
      <SkeletonCircle
        isLoaded={!isLoading ?? true}
        w="fit-content"
        h="fit-content"
      >
        <Avatar
          src={src}
          size="sm"
          name={initials ?? title ?? "User avatar"}
          {...variants?.avatar}
          {..._avatar}
        />
      </SkeletonCircle>

      {(title || subtitle) && (
        <Box ml="4px" {...variants?.textContainer} {..._textContainer}>
          {title && (
            <Skeleton
              isLoaded={!isLoading ?? true}
              w="fit-content"
              h="20px"
              borderRadius="12px"
              mb={isLoading ? "3px" : "0"}
            >
              <Text
                fontSize="14px"
                fontWeight="400"
                color="brand.black"
                textTransform="capitalize"
                {...variants?.title}
                {..._title}
              >
                {title}
              </Text>
            </Skeleton>
          )}
          {subtitle && (
            <Skeleton
              isLoaded={!isLoading ?? true}
              w="fit-content"
              h="20px"
              borderRadius="12px"
              mt="4px !important"
            >
              <Text
                fontSize="12px"
                fontWeight="400"
                color="brand.neutral600"
                textTransform="capitalize"
                {...variants?.subtitle}
                {..._subtitle}
              >
                {subtitle}
              </Text>
            </Skeleton>
          )}
        </Box>
      )}
    </Box>
  );
}
