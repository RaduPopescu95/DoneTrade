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
  const dialContact = () => {
    // setContacted(true);
    // if (!isEditing) {
    //   setIsEditing(true);
    // } else {
    //   setIsEditing(false);
    // }
    // Animated.timing(opacity, {
    //   toValue: isEditing ? 1 : 0,
    //   duration: 400,
    //   useNativeDriver: true,
    // }).start();
    let number = "";
    if (Platform.OS === "ios") {
      number = "telprompt:${091123456789}";
      console.log("IOS...");
    } else {
      console.log("ANDROID...");
      number = "tel:${091123456789}";
    }
    // Linking.openURL(number);
    Linking.openURL(number);
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
    <>
      <View
        // behavior="position"
        // keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
        style={styles.bigContainer}
      >
        <Image style={styles.image} source={{ uri: listing.img_uri }} />

        {/* <View style={styles.detailsContainer}>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.price}>${listing.price}</Text>
        <Text style={styles.description}>{listing.description}</Text>
      </View> */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{listing.title}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.price}>{listing.price}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardDescription}>{listing.description}</Text>
          </View>
        </View>
        <View style={styles.detailsContainer2}>
          {/* ---------------------------------- */}
          <View style={styles.box}>
            <Image style={styles.img} source={{ uri: profilePicture }} />
            <View style={styles.boxContent}>
              <Text style={styles.titlu}>{`${firstName} ${lastName}`}</Text>
              <Text style={styles.description}>5 Listings</Text>
              <View style={styles.buttons}>
                <TouchableHighlight
                  style={[styles.buttonul, styles.view]}
                  onPress={() => this.clickListener("login")}
                >
                  <MaterialCommunityIcons
                    name="account"
                    color={colors.dark}
                    size={32}
                  />
                </TouchableHighlight>
                {!isPresentUser && (
                  <>
                    <TouchableHighlight
                      style={[styles.buttonul, styles.message]}
                      onPress={() => dialContact()}
                    >
                      <MaterialCommunityIcons
                        name="phone"
                        color={colors.light}
                        size={32}
                      />
                    </TouchableHighlight>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* <Animated.View
          style={{
            opacity: saveButtonOpacity,
            transform: [{ translateX: saveButtonTranslationX }],
          }}
        >
          <ContactSellerForm
            listing={listing}
            toUser={email}
            toUserName={firstName + " " + lastName}
          />
        </Animated.View> */}

          {/* <TouchableOpacity style={styles.button} onPress={() => showContact()}>
            <MaterialCommunityIcons
              name="message"
              color={colors.light}
              size={32}
            />
          </TouchableOpacity> */}
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.price}>Users listings</Text>
      </View>

      <OtherUserListings />
    </>
  );
}

const styles = StyleSheet.create({
  bigContainer: { backgroundColor: colors.white },
  /******** card **************/
  card: {
    shadowColor: colors.dark,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.37,
    shadowRadius: 10.49,
    elevation: 4,

    marginVertical: 2,
    backgroundColor: "white",
    marginHorizontal: 0,
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12.5,
    paddingBottom: 0,

    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardTitle: {
    color: colors.dark,
    fontSize: 20,
  },
  cardDescription: {
    fontSize: 18,
    color: colors.dark,
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  box: {
    shadowColor: colors.dark,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.37,
    shadowRadius: 10.49,
    elevation: 10,
    padding: 10,
    marginTop: 2,
    marginBottom: 5,
    // marginRight: 5,
    backgroundColor: colors.white,
    flexDirection: "row",
  },
  boxContent: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: 10,
  },
  titlu: {
    fontSize: 18,
    color: "#151515",
  },
  description: {
    fontSize: 15,
    color: colors.dark,
  },
  buttons: {
    flexDirection: "row",
  },
  buttonul: {
    height: 35,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: 50,
    marginRight: 5,
    marginTop: 5,
  },
  icon: {
    width: 20,
    height: 20,
  },
  view: {
    backgroundColor: "#eee",
  },
  profile: {
    backgroundColor: "#1E90FF",
  },
  message: {
    backgroundColor: "#228B22",
  },
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
    // backgroundColor: colors.light,
    paddingLeft: 20,
    display: "flex",
    // flexDirection: "row",
  },
  detailsContainer2: {
    paddingBottom: 20,
    // paddingLeft: 10,
    display: "flex",
    // flexDirection: "row",
  },
  image: {
    width: "100%",
    height: 200,
  },
  price: {
    color: colors.dark,
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 0,
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
