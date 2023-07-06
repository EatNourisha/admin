import { ComponentStyleConfig } from "@chakra-ui/react";
// import hexToRgba from "utils/hexToRgba";

const Button: ComponentStyleConfig = {
  // The styles all button have in common
  baseStyle: {
    fontWeight: "600",
    textTransform: "capitalize",
    borderRadius: "8px", // <-- border radius is same for all variants and sizes
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: "xs",
      px: 4,
      py: 3,
      minH: "20px",
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
        bg: "brand.primary",
      },
      _active: {
        bg: "brand.primary",
      },
      _focus: {
        shadow: "0 0 0 3px var(--focusColor)",
      },
    },
    outline: {
      // borderRadius: "4px",
      border: "1px solid transparent",
      borderColor: "brand.primary",
      color: "brand.primary",
      bg: "transparent",
      _hover: {
        color: "white",
        bg: "brand.darkPrimary",
        shadow: `0 0 0 3px var(--focusColor)`,
      },
      _active: {
        color: "white",
        bg: "brand.primary",
        transform: "scale(.99)",
      },
      _focus: {
        shadow: `0 0 0 3px var(--focusColor)`,
      },
    },
    transparent: {
      bg: "transparent",
      // borderRadius: "6px",
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
      // borderRadius: "4px",
      _hover: {
        bg: "brand.darkPrimary",
      },
      _active: {
        bg: "brand.darkPrimary",
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
