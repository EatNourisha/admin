import { ComponentStyleConfig } from "@chakra-ui/react";
// import hexToRgba from "utils/hexToRgba";

const Button: ComponentStyleConfig = {
  // The styles all button have in common
  baseStyle: {
    fontWeight: "500",
    textTransform: "capitalize",
    borderRadius: "4px", // <-- border radius is same for all variants and sizes
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: "sm",
      px: 6,
      py: 3,
      minH: "40px",
    },
    md: {
      minH: "52px",
      fontSize: "sm",
      px: 10,
      py: 4,
    },
    xl: {
      fontSize: "md",
      minH: "54px",
      px: "38px",
      py: "10px",
    },
  },
  // Two variants: outline and solid
  variants: {
    ghost: {
      // minW: "fit-content",
      // minH: "fit-content",
      _hover: {
        bg: "brand.secondary",
      },
      _active: {
        bg: "brand.secondary",
      },
      _focus: {
        shadow: "0 0 0 3px var(--focusColor)",
      },
    },
    outline: {
      borderRadius: "4px",
      border: "1px solid transparent",
      borderColor: "brand.primary",
      color: "brand.primary",
      bg: "transparent",
      _hover: {
        color: "white",
        bg: "#6410da",
      },
      _active: {
        color: "white",
        bg: "#a265f7",
        transform: "scale(.99)",
      },
      _focus: {
        shadow: `0 0 0 3px var(--focusColor)`,
      },
    },
    transparent: {
      bg: "transparent",
      borderRadius: "6px",
      border: "2px solid transparent",
      color: "brand.primary",
      textTransform: "inherit",
      _hover: {
        shadow: `0 0 0 3px var(--focusColor)`,
      },
      _active: {
        shadow: `0 0 0 3px var(--focusColor)`,
        transform: "scale(.99)",
      },
      _focus: {
        shadow: `0 0 0 3px var(--focusColor)`,
      },
    },
    solid: {
      pos: "relative",
      bg: "brand.primary",
      color: "white",
      borderRadius: "4px",
      _hover: {
        bg: "#6410da",
      },
      _active: {
        bg: "#a265f7",
        transform: "scale(.99)",
      },
      _focus: {
        shadow: `0 0 0 3px var(--focusColor)`,
      },
    },
  },
  // The default size and variant values
  defaultProps: {
    size: "md",
    variant: "solid",
  } as any,
};

export default Button;
