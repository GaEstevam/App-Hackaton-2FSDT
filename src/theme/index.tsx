import { extendTheme } from "native-base";
import { background } from "native-base/lib/typescript/theme/styled-system";

export const THEME = extendTheme({
  colors: {
    background: {
      500: "#e5e5e5fc",
    },
    purple: {
      700: "#7e22ce",
      500: "#9a67ea",
    },
    gray: {
      700: "#121214",
      600: "#202024",
      500: "#29292E",
      400: "#323238",
      300: "#7C7C8A",
      200: "#C4C4CC",
      100: "#f0f0f0",
    },
    white: "#FFFFFF",
    red: {
      500: "#F75A68",
    },
  },
  fonts: {
    heading: "Roboto_700Bold",
    body: "Roboto_400Regular",
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  },
  sizes: {
    14: 56,
    33: 148,
  },
});
