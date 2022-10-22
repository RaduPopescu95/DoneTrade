import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import defaultStyles from "../config/styles";
import { useFormikContext } from "formik";

function AppTextInput({
  icon,
  width = "100%",
  bgColorContactSeller,
  defaultValue,
  value,
  name,
  changeVal,
  ...otherProps
}) {
  const { setFieldTouched, handleChange, errors, touched } = useFormikContext();
  return (
    <View style={[styles.container, { width }]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={defaultStyles.colors.medium}
          style={styles.icon}
        />
      )}
      <TextInput
        placeholderTextColor={defaultStyles.colors.medium}
        defaultValue={defaultValue}
        // style={defaultStyles.text}
        // changeVal={changeVal}
        value={value}
        style={[defaultStyles.text, { backgroundColor: bgColorContactSeller }]}
        {...otherProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 25,
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
});

export default AppTextInput;
