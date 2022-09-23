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

function ListingDetailsScreen({ route }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [firstName, setFirstName] = useState("firstName");
  const [lastName, setLastName] = useState("SecondName");
  const [email, setEmail] = useState("email");
  const [contact, setContacted] = useState(false);
  const [isPresentUser, setIsPresentUser] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [usersListings, setUserListings] = useState([]);
  const [value] = useState(new Animated.Value(0));
  const auth = authentication;
  const userNow = {};

  const listing = route.params;

  const retrieveData = async () => {
    // GOOD FOR RETRIEVE ONE DOC
    // console.log("test1");
    // console.log(listing.user);
    const docRef = doc(db, "Users", listing.user);
    // console.log("DOCREF...", docRef);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // console.log("Document data:....", docSnap.data());
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
      // console.log("present user...", listing.user);
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
    console.log(
      "Retreving data Listings For the user---------------------------"
    );
    // setLoading(true);
    const usersPosts = [];
    // const usersEmailImgName = [];
    const posts = query(collectionGroup(db, "Posts"));
    const querySnapshot = await getDocs(posts);
    // console.log("query...", querySnapshot);
    querySnapshot.forEach((doc) => {
      // console.log("doc.data...", doc.data().user);
      // console.log(usersPosts.length);
      if (listing.user === doc.data().user) {
        // console.log("test here...", doc.data().user);
        usersPosts.push({ ...doc.data(), key: doc.id });
      }
      // console.log("length of usersposts...", usersPosts.length);
    });
    // console.log("usersposts...", usersPosts);
    // console.log("all users posts...", usersPosts);
    console.log("start 1 FOR SETTINGS USERS POSTS");
    // const newListings = [...usersListings];

    for (let i = 0; i < usersPosts.length; i++) {
      // console.log(usersPosts[i]);
      // console.log("loops for settings users posts...", usersPosts[i].user);
      // console.log("loops for settings users posts1...", usersPosts[i]);
      // console.log("loops for settings users posts2...", usersPosts[i].img_name);
      // console.log(usersPosts[i].img_name);
      const reference = ref(
        storage,
        `images/${usersPosts[i].user}/posts/${usersPosts[i].img_name}`
      );
      await getDownloadURL(reference).then((x) => {
        // console.log(usersPosts[i]);
        // console.log("xxx....", x);
        usersPosts[i].img_uri = x;
        // setUrl(x);
        // newListings.forEach((element) => {
        //   element.img_uri = x;
        // });
      });
      // usersEmailImgName.push({
      //   email: usersPosts[i].user,
      //   post_img: usersPosts[i].img_name,
      // });
    }
    console.log("final users...posts.1..", usersPosts);
    setUserListings(usersPosts);
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

  const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);

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

  const [firstImage, setFirstImage] = useState(listing.img_uri[0]);
  const [secondImages, setSecondImages] = useState(listing.img_uri);
  let result = [...listing.img_uri];
  const handleChangeImages = (img) => {
    // console.log("imgg...", img);
    // console.log("second img...", secondImages);
    // result = result.filter((i) => i !== img);
    // console.log("second img...", secondImages);
    setSecondImages(result.filter((i) => i !== img));
    // console.log("second img2222...", secondImages);
    setFirstImage(img);
    // console.log("firstimages...", firstImage);

    // console.log("result...", result);
  };

  useEffect(() => {
    console.log(
      "USE EFFECTT FOR DETAIL LISTINGS................................."
    );
    console.log("useefect userslistings...", usersListings);
    // console.log(firstName, lastName, email);
    // console.log("EMAIL CURENT USER....", auth.currentUser.email);
    retrieveData();
  }, [isEditing]);

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
                {/* <Image style={styles.mainImage} source={{ uri: mainImage }} /> */}
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
          {/* <View style={styles.cardContent}> */}
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
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.title}>Users listings</Text>
        </View>
        {usersListings.length > 0 && (
          <OtherUserListings
            usersListings={usersListings}
            focusedListing={listing}
            // onPress={() => navigation.navigate("ListingDetails", item)}
          />
        )}
        {/* </View> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    // shadowColor: colors.dark,
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.37,
    // shadowRadius: 10.49,
    // elevation: 10,
    padding: 10,
    marginTop: 2,
    marginBottom: 5,
    // marginRight: 5,
    backgroundColor: colors.white,
    flexDirection: "row",
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
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
  img: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#ebf0f7",
  },
  content: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    marginBottom: 15,
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
    // flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12.5,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardTitle: {
    color: colors.dark,
    fontSize: 20,
  },
});

export default ListingDetailsScreen;
