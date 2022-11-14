import React, { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Platform,
  TouchableHighlight,
  Linking,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { authentication, db, storage } from "../../firebase";
import { ref, getDownloadURL, list } from "firebase/storage";
import {
  doc,
  getDoc,
  getDocs,
  query,
  collectionGroup,
} from "firebase/firestore";

import colors from "../config/colors";
import OtherUserListings from "../components/OtherUserListings";

function ListingDetailsScreen({ route }) {
  const [profilePicture, setProfilePicture] = useState("");
  const [firstName, setFirstName] = useState("firstName");
  const [lastName, setLastName] = useState("SecondName");
  const [isPresentUser, setIsPresentUser] = useState(false);
  const [usersListings, setUserListings] = useState([]);
  const auth = authentication;

  const listing = route.params;

  const retrieveData = async () => {
    const docRef = doc(db, "Users", listing.owner_uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setFirstName(docSnap.data().firstName);
      setLastName(docSnap.data().lastName);
    } else {
      console.log("No such document!");
    }
    if (auth.currentUser.email === listing.user) {
      setIsPresentUser(true);
    }
    const reference = ref(storage, `images/profilePict/${listing.owner_uid}`);
    await getDownloadURL(reference).then((x) => {
      setProfilePicture(x);
    });
    const usersPosts = [];
    const posts = query(collectionGroup(db, "Posts"));
    const querySnapshot = await getDocs(posts);
    querySnapshot.forEach((doc) => {
      if (listing.user === doc.data().user) {
        usersPosts.push({ ...doc.data(), key: doc.id });
      }
    });
    for (let i = 0; i < usersPosts.length; i++) {
      const img_uri = [];
      for (let z = 0; z < usersPosts[i].img_names.length; z++) {
        console.log("img names...", usersPosts[i].img_names[z]);
        const reference = ref(
          storage,
          `images/posts/${usersPosts[i].owner_uid}&&${usersPosts[i].img_names[z]}`
        );
        await getDownloadURL(reference).then((x) => {
          img_uri.push(x);
        });
      }
      usersPosts[i].img_uri = [...img_uri];
      usersPosts[i].first_img_uri = img_uri[0];
    }
    setUserListings(usersPosts);
  };

  const dialContact = () => {
    let number = "";
    if (Platform.OS === "ios") {
      number = "telprompt:${091123456789}";
      console.log("IOS...");
    } else {
      console.log("ANDROID...");
      number = "tel:${091123456789}";
    }
    Linking.openURL(number);
  };

  const [firstImage, setFirstImage] = useState(listing.img_uri[0]);
  const [secondImages, setSecondImages] = useState(listing.img_uri);
  let result = [...listing.img_uri];
  const handleChangeImages = (img) => {
    setSecondImages(result.filter((i) => i !== img));
    setFirstImage(img);
  };

  useEffect(() => {
    handleChangeImages(listing.img_uri[0]);
    retrieveData();
  }, [listing]);

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

        <View style={styles.card}>
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
          <Text style={styles.title}>User listings</Text>
        </View>
        {usersListings.length > 0 && (
          <OtherUserListings
            usersListings={usersListings}
            focusedListing={listing}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 10,
    marginTop: 2,
    marginBottom: 5,
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
    paddingVertical: 6.5,
    paddingHorizontal: 16,
  },
  cardHeader: {
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
