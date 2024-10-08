import React from "react";
import { Text } from "react-native";

import defaultStyles from "../config/styles";
function AppText({children, style, ...otherProps}) {
  return (
    <Text style={[defaultStyles.defaultText, style]} {...otherProps}>
      {children}
    </Text>
  )
}

export default AppText;