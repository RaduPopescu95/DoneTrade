import React, { Component } from "react";
import { useEffect } from "react";
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
// import Category from "./components/Explore/Category";
import Category from "./Category";

export default function OtherUserListings() {
  let startHeaderHeight = 80;
  const { height, width } = Dimensions.get("window");
  useEffect(() => {
    if (Platform.OS == "android") {
      startHeaderHeight = 100 + StatusBar.currentHeight;
    }
  }, []);
  return (
    // <SafeAreaView style={{ flex: 1 }}>
    <SafeAreaView style={{ marginBottom: 10 }}>
      <View style={{ height: 130, marginTop: 10 }}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <Category imageUri={require("../assets/mosh.jpg")} name="Home" />
          <Category
            imageUri={require("../assets/mosh.jpg")}
            name="Experiences"
          />
          <Category imageUri={require("../assets/mosh.jpg")} name="Resturant" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
