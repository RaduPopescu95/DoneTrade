import React from "react";
import { StyleSheet } from "react-native";

import colors from "../../config/colors";
import Text from "../Text";

function ErrorMessage({ error, visible }) {
  return <Text style={styles.error}>{error}</Text>;
}

const styles = StyleSheet.create({
  error: { color: "red", borderColor: colors.light },
});

export default ErrorMessage;
