import React, { useEffect, useState, useRef } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";

export default function UserListingDetails({ route, navigation }) {
  const listing = route.params;
  const [firstImage, setFirstImage] = useState(listing.img_uri[0]);
  const [secondImages, setSecondImages] = useState(listing.img_uri);
  let result = [...listing.img_uri];

  const handleChangeImages = (img) => {
    setSecondImages(result.filter((i) => i !== img));
    setFirstImage(img);
  };

  const __renderImages = () => {
    return (
      <View style={styles.smallImagesContainer}>
        <TouchableOpacity
          onPress={() => {
            handleChangeImages(secondImages[0]);
          }}
        >
          <Image style={styles.smallImage} source={{ uri: secondImages[0] }} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleChangeImages(secondImages[1]);
          }}
        >
          <Image style={styles.smallImage} source={{ uri: secondImages[1] }} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleChangeImages(secondImages[2]);
          }}
        >
          <Image style={styles.smallImage} source={{ uri: secondImages[2] }} />
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.name}>{listing.title}</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.header}>
              <View style={styles.mainImageContainer}>
                <Image style={styles.mainImage} source={{ uri: firstImage }} />
              </View>
              {__renderImages()}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Price</Text>
            <Text style={styles.price}>${listing.price}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Description</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.description}>{listing.description}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => navigation.navigate("UpdateListingScreen", listing)}
          >
            <MaterialCommunityIcons name="pencil" color={"white"} size={20} />
            <Text style={styles.shareButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#ebf0f7",
  },
  content: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    height: "100%",
  },
  header: {
    flexDirection: "row",
  },
  mainImage: {
    width: 200,
    height: 200,
  },
  smallImagesContainer: {
    flexDirection: "column",
    marginLeft: 30,
  },
  smallImage: {
    width: 60,
    height: 60,
    marginTop: 5,
  },
  btnColor: {
    height: 40,
    width: 40,
    borderRadius: 40,
    marginHorizontal: 3,
  },
  contentColors: {
    flexDirection: "row",
  },
  name: {
    fontSize: 22,
    color: "#696969",
    fontWeight: "bold",
  },
  price: {
    marginTop: 15,

    color: colors.dark,
    fontWeight: "bold",
    fontSize: 15,
    marginVertical: 0,
  },
  description: {
    fontSize: 18,
    color: "#696969",
  },
  shareButton: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    backgroundColor: colors.medium,
    width: "90%",
    borderRightColor: colors.primary,
    borderTopColor: colors.primary,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderBottomStartRadius: 30,
  },
  buttonContainer: {
    position: "absolute",
    right: 0,
    top: 1,
    height: 90,
    width: 90,
    flexDirection: "column",
    alignItems: "center",
  },
  shareButtonText: {
    color: colors.white,
    fontSize: 20,
    marginLeft: 5,
  },

  /******** card **************/
  card: {
    shadowColor: "#00000021",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,

    marginVertical: 5,
    backgroundColor: "white",
    marginHorizontal: 5,
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardHeader: {
    justifyContent: "space-between",
    paddingTop: 6.5,
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardTitle: {
    color: colors.dark,
    fontSize: 20,
    marginTop: 5,
  },
});
