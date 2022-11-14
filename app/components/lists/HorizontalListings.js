import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import colors from "../../config/colors";

export default function HorizontalListings(props) {
  let borderShadow = {};
  if (props.keyBorderWidth > 0) {
    console.log("testing 0....");
    borderShadow = {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 11,
      },
      shadowOpacity: 0.57,
      shadowRadius: 15.19,

      elevation: 3,
    };
  }
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View
        style={[
          {
            height: 130,
            width: 130,
            marginLeft: 20,
            borderWidth: props.keyBorderWidth > 0 ? props.keyBorderWidth : 0.5,
            borderColor:
              props.keyBorderWidth > 0 ? props.keyStyle : colors.medium,
          },
        ]}
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
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
