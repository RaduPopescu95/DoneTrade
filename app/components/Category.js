import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "./Icon";

export default function Category(props) {
  const categories = [
    {
      backgroundColor: "#fc5c65",
      icon: "floor-lamp",
      label: "Furniture",
      value: 1,
    },
    {
      backgroundColor: "#fd9644",
      icon: "car",
      label: "Cars",
      value: 2,
    },
    {
      backgroundColor: "#fed330",
      icon: "camera",
      label: "Cameras",
      value: 3,
    },
    {
      backgroundColor: "#26de81",
      icon: "cards",
      label: "Games",
      value: 4,
    },
    {
      backgroundColor: "#2bcbba",
      icon: "shoe-heel",
      label: "Clothing",
      value: 5,
    },
    {
      backgroundColor: "#45aaf2",
      icon: "basketball",
      label: "Sports",
      value: 6,
    },
    {
      backgroundColor: "#4b7bec",
      icon: "headphones",
      label: "Movies & Music",
      value: 7,
    },
    {
      backgroundColor: "#a55eea",
      icon: "book-open-variant",
      label: "Books",
      value: 8,
    },
    {
      backgroundColor: "#778ca3",
      icon: "application",
      label: "Other",
      value: 9,
    },
  ];
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
    <View
      style={{
        marginTop: 2,
        backgroundColor: "#fff",
        paddingVertical: 10,
        paddingLeft: 0,
        alignItems: "center",
      }}
    >
      <View
        style={{
          marginTop: 2,
          width: "90%",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "900",
              alignContent: "flex-start",
            }}
          >
            Categories
          </Text>
          <TouchableOpacity
            style={{ fontSize: 15, fontWeight: "300", alignSelf: "flex-end" }}
            onPress={() => props.handleCategorySelection({ label: "none" })}
          >
            <Text>See all</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#D3D3D3",
            marginTop: 20,
            width: "90%",
            height: 20,
          }}
        ></View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((item, index) => (
          <>
            <View
              key={index}
              style={{
                marginRight: 10,
                marginLeft: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  props.handleCategorySelection(item);
                }}
                style={{
                  alignItems: "center",
                  marginTop: 2,
                  marginBottom: 5,
                }}
              >
                <Icon
                  backgroundColor={item.backgroundColor}
                  name={item.icon}
                  size={60}
                />

                <Text style={{ fontSize: 13, fontWeight: "900" }}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ))}
      </ScrollView>
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
