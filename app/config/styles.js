import { Platform } from "react-native";

import colors from "./colors";

export default {
  colors,
  text: {
    color: colors.dark,
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    width: "100%",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 20,
  },
};
