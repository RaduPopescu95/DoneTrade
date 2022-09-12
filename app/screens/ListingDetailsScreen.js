import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet } from "react-native";
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
import Text from "../components/Text";

function ListingDetailsScreen({ route }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [firstName, setFirstName] = useState("firstName");
  const [lastName, setLastName] = useState("SecondName");
  const [email, setEmail] = useState("email");
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

  useEffect(() => {
    console.log(
      "USE EFFECTT FOR DETAIL LISTINGS................................."
    );
    console.log(firstName, lastName, email);
    retrieveData();
  }, []);

  return (
    <View>
      <Image style={styles.image} source={{ uri: listing.img_uri }} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.price}>{listing.price}</Text>
        <View style={styles.userContainer}>
          <ListItem
            title={`${firstName} ${lastName}`}
            subTitle="5 Listings"
            image={{ uri: profilePicture }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
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
