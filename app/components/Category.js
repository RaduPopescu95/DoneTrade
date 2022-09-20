import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function Category(props) {
  return (
    <View
      style={{
        height: 130,
        width: 130,
        marginLeft: 20,
        borderWidth: 0.5,
        borderColor: "#dddddd",
      }}
    >
      <View style={{ flex: 2 }}>
        <Image
          source={props.imageUri}
          style={{ flex: 1, width: null, height: null, resizeMode: "cover" }}
        />
      </View>
      <View style={{ flex: 1, paddingLeft: 10, paddingTop: 10 }}>
        <Text>{props.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
