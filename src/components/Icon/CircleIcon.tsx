import { Box } from "@chakra-ui/react";
import { useMemo } from "react";
import Icon, { IconProps } from "./Icon";

type IconSizes = "xs" | "sm" | "md" | "lg";

interface CircleIconProps extends IconProps {
  size?: IconSizes;
  _icon?: IconProps;
}

export default function CircleIcon(props: CircleIconProps) {
  const { type, size = "sm", bg, boxSize, _icon, ...xprops } = props;

  const sizes = useMemo(() => {
    const map: Record<IconSizes, string> = {
      xs: "16px",
      sm: "24px",
      md: "32px",
      lg: "63px",
    };

    return map[size];
  }, [size]);

  return (
    <Box
      d="flex"
      boxSize={boxSize ?? sizes}
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
