import React, { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Button,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
  Platform,
  TextInput,
  TouchableHighlight,
  Alert,
  FlatList,
  Linking,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { sendSignInLinkToEmail, signOut } from "firebase/auth";
import { authentication, db, storage } from "../../firebase";
import { ref, getDownloadURL, list } from "firebase/storage";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  collectionGroup,
} from "firebase/firestore";

import colors from "../config/colors";
import ListItem from "../components/lists/ListItem";
// import Text from "../components/Text";
import ContactSellerForm from "../components/ContactSellerForm";
import ImageInput from "../components/ImageInput";
import OtherUserListings from "../components/OtherUserListings";

export default function UserListingDetails({ route }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [userSelected, setUserSelected] = useState([]);
  const [selectedImage, setSelectedImage] = useState({});
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [firstName, setFirstName] = useState("firstName");
  const [lastName, setLastName] = useState("SecondName");
  const [email, setEmail] = useState("email");
  const [contact, setContacted] = useState(false);
  const [isPresentUser, setIsPresentUser] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [usersListings, setUserListings] = useState([]);
  // const [value] = useState(new Animated.Value(0));
  const auth = authentication;
  const userNow = {};
  const listing = route.params;
  const product = {
    name: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.",
    created: "",
    images: [
      "https://bootdey.com/img/Content/avatar/avatar6.png",
      "https://bootdey.com/img/Content/avatar/avatar2.png",
      "https://bootdey.com/img/Content/avatar/avatar3.png",
    ],
    colors: ["#00BFFF", "#FF1493", "#00CED1", "#228B22", "#20B2AA", "#FF4500"],
  };

  const __setImageSelected = (image) => {
    setSelectedImage({ selectedImage: image });
  };

  const __renderImages = () => {
    return (
      <View style={styles.smallImagesContainer}>
        {product.images.map((prop, key) => {
          return (
            <TouchableOpacity
              key={key}
              onPress={() => {
                __setImageSelected(prop);
              }}
            >
              <Image style={styles.smallImage} source={{ uri: prop }} />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  useEffect(() => {
    console.log(
      "USE EFFECTT FOR DETAIL LISTINGS................................."
    );

    console.log("listing....here", listing);
  }, [isEditing]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.name}>{listing.title}</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.header}>
              <View style={styles.mainImageContainer}>
                <Image
                  style={styles.mainImage}
                  source={{ uri: listing.first_img_uri }}
                />
              </View>
              {__renderImages()}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Price</Text>
            <Text style={styles.cardTitle}>${listing.price}</Text>
          </View>
          {/* <View style={styles.cardContent}>{__renderColors()}</View> */}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Description</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.description}>{listing.description}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardContent}>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => this.clickEventListener()}
            >
              <Text style={styles.shareButtonText}>Edit Listing</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    marginTop: 10,
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
  },
  description: {
    fontSize: 18,
    color: "#696969",
  },
  shareButton: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "#00BFFF",
  },
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
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
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardTitle: {
    color: "#00BFFF",
  },
});
