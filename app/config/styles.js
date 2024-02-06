import { Platform } from "react-native";

import colors from "./colors";

export default {
    colors,
    secondaryText:{
        color: colors.secondary,
        fontSize: 16,
        fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    },
    defaultText: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: "600",
        fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    },
    title:{
        color: colors.primary,
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    },
};
