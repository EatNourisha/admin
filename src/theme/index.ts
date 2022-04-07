// 1. Import the extendTheme function
import { extendTheme, withDefaultVariant } from "@chakra-ui/react";
// import { hexToRgba } from "utils";
import Button from "./Button";
// 2. Extend the theme to include custom colors, fonts, etc

const colors = {
  brand: {
    black: "#061238",
    primary: "#1B2CC1",
    primary400: "#4956CD",
    darkPrimary: "#2D0C9A",
    purple: "#7B61FF",
    secondary: "#FDFAEC",
    lightBlue: "#0066F5",
    lightGreen: "#03CCAA",
    blackGrey: "#0A164140",
    paleWhite: "#FAFBFD",
    green: "#32D660",
    red: "#FA0707",
    deepRed: "#E5432E",
    greyText: "#64748B",
    grayText: "#323A46",
    deepBlue: "#050927",
    neutral: "#E7EAEE",
    neutral50: "#F7F8F9",
    neutral100: "#E7EAEE",
    neutral200: "#D0D5DD",
    neutral500: "#64748B",
    neutral600: "#4B5768",
    neutral700: "#323A46",
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
      cssVarPrefix: "koinpoll",
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
      //
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
