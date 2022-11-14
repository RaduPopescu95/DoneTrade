import React from "react";
import { useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import HorizontalListings from "./lists/HorizontalListings";
import { useState } from "react";
import colors from "../config/colors";

export default function OtherUserListings({ usersListings, focusedListing }) {
  let startHeaderHeight = 80;
  const navigation = useNavigation();
  const [keyFocused, setKeyFocused] = useState("");
  useEffect(() => {
    if (Platform.OS == "android") {
      startHeaderHeight = 100 + StatusBar.currentHeight;
    }
    for (let i = 0; i < usersListings.length; i++) {
      console.log(`loop ${i}`, usersListings[i]);
    }
    handleFocused(focusedListing.key);
  }, []);

  const handleFocused = (key) => {
    console.log(key);
    setKeyFocused(key);
  };
  return (
    <SafeAreaView style={{ marginBottom: 10 }}>
      <View style={{ height: 130, marginTop: 10 }}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {usersListings.map((listing) =>
            listing.key === keyFocused ? (
              <HorizontalListings
                keyStyle={colors.dark}
                keyBorderWidth={1.5}
                key={listing.key}
                imageUri={{ uri: listing.img_uri[0] }}
                name={listing.title}
                onPress={() => {
                  handleFocused(listing.key);
                  navigation.navigate("ListingDetails", listing);
                }}
              />
            ) : (
              <HorizontalListings
                key={listing.key}
                imageUri={{ uri: listing.img_uri[0] }}
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
