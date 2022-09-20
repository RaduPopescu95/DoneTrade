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
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
// import Category from "./components/Explore/Category";
import Category from "./Category";
import { useState } from "react";
import colors from "../config/colors";

export default function OtherUserListings({ usersListings, focusedListing }) {
  let startHeaderHeight = 80;
  const { height, width } = Dimensions.get("window");
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(false);
  const [keyFocused, setKeyFocused] = useState("");
  useEffect(() => {
    if (Platform.OS == "android") {
      startHeaderHeight = 100 + StatusBar.currentHeight;
    }
    console.log("usersListings...in component", usersListings);

    handleFocused(focusedListing.key);
  }, []);

  const handleFocused = (key) => {
    console.log(key);
    setKeyFocused(key);
  };
  return (
    // <SafeAreaView style={{ flex: 1 }}>

    <SafeAreaView style={{ marginBottom: 10 }}>
      <View style={{ height: 130, marginTop: 10 }}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {usersListings.map((listing) =>
            listing.key === keyFocused ? (
              <Category
                keyStyle={colors.dark}
                keyBorderWidth={1.5}
                key={listing.key}
                imageUri={{ uri: listing.img_uri }}
                name={listing.title}
                onPress={() => {
                  handleFocused(listing.key);
                  navigation.navigate("ListingDetails", listing);
                }}
              />
            ) : (
              <Category
                key={listing.key}
                imageUri={{ uri: listing.img_uri }}
                name={listing.title}
                onPress={() => {
                  handleFocused(listing.key);
                  navigation.navigate("ListingDetails", listing);
                }}
              />
            )
          )}
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
