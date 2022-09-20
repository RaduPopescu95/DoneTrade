import React, { Component, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Platform,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import colors from "../config/colors";

export default function SearchBox() {
  let startHeaderHeight = 80;
  const { height, width } = Dimensions.get("window");
  useEffect(() => {
    if (Platform.OS == "android") {
      startHeaderHeight = 100 + StatusBar.currentHeight;
    }
  }, []);
  return (
    <View
      style={{
        height: startHeaderHeight,
        backgroundColor: colors.light,
        borderBottomWidth: 1,
        borderBottomColor: colors.light,
        height: 50,
        marginBottom: 10,
        width: "90%",
        alignSelf: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          backgroundColor: "white",
          marginHorizontal: 0,
          shadowOffset: { width: 0, height: 0 },
          shadowColor: "black",
          shadowOpacity: 0.2,
          elevation: 1,
          marginTop: Platform.OS == "android" ? 10 : null,
          width: "100%",
        }}
      >
        <Icon name="ios-search" size={20} style={{ marginRight: 10 }} />
        <TextInput
          underlineColorAndroid="transparent"
          placeholder="What are you looking for?"
          placeholderTextColor="grey"
          style={{ flex: 1, fontWeight: "700", backgroundColor: "white" }}
        />
      </View>
    </View>
  );
}
