import { Box, ResponsiveValue } from "@chakra-ui/react";
import { useMemo } from "react";
import Icon, { IconProps } from "./Icon";

type IconSizeKey = "xs" | "sm" | "md" | "lg";
type IconSizes = ResponsiveValue<IconSizeKey>;
type IconStyleProps = Omit<IconProps, "type">;

interface CircleIconProps extends Omit<IconProps, "size"> {
  size?: IconSizes;
  _icon?: IconStyleProps;
}

export default function CircleIcon(props: CircleIconProps) {
  const { type, size = "sm", bg, boxSize, _icon, ...xprops } = props;

  const getSize = (value: IconSizeKey): string => {
    const sizeMap: Record<IconSizeKey, string> = {
      xs: "16px",
      sm: "24px",
      md: "32px",
      lg: "63px",
    };
    return sizeMap[value];
  };

  const responsiveSize = useMemo(() => {
    if (typeof size === "object") {
      return Object.entries(size).reduce((acc, [breakpoint, value]) => {
        acc[breakpoint] = getSize(value as IconSizeKey);
        return acc;
      }, {} as Record<string, string>);
    }
    return getSize(size as IconSizeKey);
  }, [size]);

  return (
    <Box
      display="flex"
      boxSize={boxSize ?? responsiveSize}
      justifyContent="center"
      alignItems="center"
      bg={bg}
      color="white"
      borderRadius="50%"
      {...xprops}
    >
      <Icon type={type} {..._icon} />
    </Box>
  );
}
