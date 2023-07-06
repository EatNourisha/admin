// 1. Import the extendTheme function
import { extendTheme, withDefaultVariant } from "@chakra-ui/react";
// import { hexToRgba } from "utils";
import Button from "./Button";
// 2. Extend the theme to include custom colors, fonts, etc

const colors = {
  brand: {
    black: "#141316",
    primary: "#FE7E00",
    warning: "#FFC22E",
    error: "#FA0707",
    primary400: "#4956CD",
    darkPrimary: "#d86d03",
    purple: "#7B61FF",
    secondary: "#2C66FF",
    lightBlue: "#6891FF",
    lemonGreenAlpha: "#effff6",
    blackGrey: "#0A164140",
    paleWhite: "#FAFBFD",
    green: "#20AF0B",
    lemonGreen: "#88DA7C",
    lightGreen: "#E6F7E4",
    red: "#FA0707",
    deepRed: "#E5432E",
    grey400: "#BDC0CE",
    greyText: "#7E8494",
    grayText: "#323A46",
    deepBlue: "#050927",
    neutral: "#E7EAEE",
    neutral50: "#F7F8F9",
    neutral100: "#E7EAEE",
    neutral200: "#D0D5DD",
    neutral400: "#A0ABBB",
    neutral500: "#64748B",
    neutral600: "#4B5768",
    neutral700: "#323A46",
  },
  primary: {
    50: "#fff1da",
    100: "#ffd7ae",
    200: "#ffbf7d",
    300: "#ffa54c",
    400: "#fe9833",
    500: "#ff8b1a",
    600: "#b45900",
    700: "#813e00",
    800: "#4f2500",
    900: "#200b00",
  },
};

const fonts = {
  heading: "'Inter', sans-serif",
  body: "'Inter', sans-serif",
};

const inputSelectStyles = {
  variants: {
    filled: {
      field: {
        borderColor: "transparent",
        borderWidth: "1px",
        px: "20px",
        minH: "56px",
        borderRadius: "12px",
        _placeholder: {
          color: "brand.neutral600",
        },
        backgroundColor: "brand.neutral",
        _focus: {
          borderColor: "brand.primary",
          borderWidth: "1px",
        },
      },
    },
  },
};

const SelectStyles = {
  variants: {
    filled: {
      field: {
        borderColor: "brand.neutral200",
        borderWidth: "2px",
        px: "20px",
        minH: "56px",
        borderRadius: "12px",
        _placeholder: {
          color: "brand.neutral600",
        },
        backgroundColor: "white",
        _focus: {
          borderColor: "brand.primary",
          borderWidth: "2px",
        },
      },
    },
  },
};

const theme = extendTheme(
  {
    fonts,
    colors,
    config: {
      cssVarPrefix: "aegle",
    },
    styles: {
      global: {
        // ":root": {
        //   "--focusShadowThickness": "3px",
        //   "--focusColor": hexToRgba("#0066F5", 0.4),
        //   "--focusShadow": `0 0 0 3px red`,
        // },
        "html, body": {
          color: "brand.black",
        },

        // "*": {
        //   _focus: {
        //     shadow: "0 0 0 10px red",
        //   },
        // },
      },
    },
    components: {
      Button,
      Input: { ...inputSelectStyles },
      Select: { ...SelectStyles },
    },
  },
  withDefaultVariant({
    variant: "filled",
    components: ["Input", "Select"],
  } as any)
);

export default theme;
