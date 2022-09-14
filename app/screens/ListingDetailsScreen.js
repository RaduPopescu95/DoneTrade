import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Button,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { sendSignInLinkToEmail, signOut } from "firebase/auth";
import { authentication, db, storage } from "../../firebase";
import { ref, getDownloadURL } from "firebase/storage";
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

function ListingDetailsScreen({ route }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [firstName, setFirstName] = useState("firstName");
  const [lastName, setLastName] = useState("SecondName");
  const [email, setEmail] = useState("email");
  const [contact, setContacted] = useState(false);
  const [isPresentUser, setIsPresentUser] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [value] = useState(new Animated.Value(0));
  const auth = authentication;
  const userNow = {};

  const listing = route.params;

  const retrieveData = async () => {
    // GOOD FOR RETRIEVE ONE DOC
    console.log("test1");
    console.log(listing.user);
    const docRef = doc(db, "Users", listing.user);
    // console.log("DOCREF...", docRef);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:....", docSnap.data());
      setFirstName(docSnap.data().firstName);
      setLastName(docSnap.data().lastName);
      setEmail(docSnap.data().email);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }

    // console.log("test1");
    // const docRef = doc(db, "Users", auth.currentUser.email);
    // console.log(docRef);
    // const docSnap = await getDoc(docRef);
    // if (docSnap.exists()) {
    //   // console.log("Document data:", docSnap.data());
    //   setEmail(docSnap.data().email);
    //   setFirstName(docSnap.data().firstName);
    //   setLastName(docSnap.data().lastName);
    // } else {
    //   // doc.data() will be undefined in this case
    //   console.log("No such document!");
    // }
    // console.log("Retreving Profile Pict---------------------------");
    if (auth.currentUser.email === listing.user) {
      console.log("present user...", listing.user);
      setIsPresentUser(true);
    }
    const reference = ref(
      storage,
      `images/${listing.user}/profilePict/${listing.user}`
    );
    await getDownloadURL(reference).then((x) => {
      setProfilePicture(x);
    });
    // setLoading(false);
    // setRefreshing(false);
    // setListings(usersPosts);
  };

  const opacity = useRef(new Animated.Value(0)).current;

  const saveButtonOpacity = opacity.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [0, 0, 1],
  });
  const showContact = () => {
    setContacted(true);
    if (!isEditing) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
    Animated.timing(opacity, {
      toValue: isEditing ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };
  const saveButtonTranslationX = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });
  useEffect(() => {
    console.log(
      "USE EFFECTT FOR DETAIL LISTINGS................................."
    );
    console.log(firstName, lastName, email);
    console.log("EMAIL CURENT USER....", auth.currentUser.email);
    retrieveData();
  }, [isEditing]);

  const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);
  return (
    <View
      // behavior="position"
      // keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
      style={styles.bigContainer}
    >
      <Image style={styles.image} source={{ uri: listing.img_uri }} />

      <View style={styles.detailsContainer}>
        <View>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.price}>{listing.price}</Text>
        </View>
      </View>
      <View style={styles.detailsContainer2}>
        <View style={styles.userContainer}>
          <ListItem
            title={`${firstName} ${lastName}`}
            subTitle="5 Listings"
            image={{ uri: profilePicture }}
          />
        </View>

        {/* <Animated.Text style={{ opacity }}>Example text</Animated.Text> */}
        {/* <View style={styles.background}> */}

        <Animated.View
          style={{
            opacity: saveButtonOpacity,
            transform: [{ translateX: saveButtonTranslationX }],
          }}
        >
          {/* <Text>Save</Text> */}
          <ContactSellerForm listing={listing} />
        </Animated.View>
        {!isPresentUser && (
          <TouchableOpacity style={styles.button} onPress={() => showContact()}>
            {/* <Text style={styles.text}>C</Text> */}
            <MaterialCommunityIcons
              name="message"
              color={colors.light}
              size={32}
            />
          </TouchableOpacity>
        )}

        {/* </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    height: "100%",
    width: "100%",
    // top: 150,
    // position: "absolute",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  button: {
    backgroundColor: colors.secondary,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "20%",
    // height: 20,
    // marginLeft: 200,
    // marginTop: 0,
    top: 370,
    right: 20,
    // color: colors.dark,
    position: "absolute",
  },
  text: {
    color: colors.white,
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  detailsContainer: {
    backgroundColor: colors.light,
    paddingLeft: 20,
    display: "flex",
    flexDirection: "row",
  },
  detailsContainer2: {
    paddingBottom: 20,
    paddingLeft: 20,
    display: "flex",
    // flexDirection: "row",
  },
  image: {
    width: "100%",
    height: 200,
  },
  price: {
    color: colors.secondary,
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  userContainer: {
    marginVertical: 40,
  },
});

export default ListingDetailsScreen;
