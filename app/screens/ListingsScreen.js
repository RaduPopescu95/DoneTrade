import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { authentication, db, storage } from "../../firebase";
// import { collection, query, where } from "firebase/firestore";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  collectionGroup,
} from "firebase/firestore";

import Card from "../components/Card";
import colors from "../config/colors";
import Screen from "../components/Screen";
import routes from "../navigation/routes";
import { useState } from "react/cjs/react.development";
import LinkList from "react-native/Libraries/NewAppScreen/components/LearnMoreLinks";
import Loader from "../components/Loader";
import { ref, getDownloadURL, listAll, child } from "firebase/storage";
// import { onSnapshot } from "firebase/firestore";

const listingss = [
  {
    id: 1,
    title: "Red jacket for sale",
    price: 100,
    image: require("../assets/jacket.jpg"),
  },
  {
    id: 2,
    title: "Couch in great condition",
    price: 1000,
    image: require("../assets/couch.jpg"),
  },
  {
    id: 3,
    title: "Couch in great condition",
    price: 1000,
    image: require("../assets/couch.jpg"),
  },
];

const handleNavigate = () => {
  navigation.navigate("WelcomeScreen");
  // console.log("adsasdadsa");
};

function ListingsScreen({ navigation }) {
  const [listings, setListings] = useState([]);
  const [primite, setPrimite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [url, setUrl] = useState();
  const [currentUserOnline, setCurrentUserOnline] = useState("");
  const auth = authentication;

  const retrieveData = async () => {
    // GOOD FOR RETRIEVE ONE DOC
    // console.log("test1");
    // const docRef = doc(db, "Users", "ProjectUsers");
    // console.log(docRef);
    // const docSnap = await getDoc(docRef);
    // if (docSnap.exists()) {
    //   console.log("Document data:", docSnap.data());
    // } else {
    //   // doc.data() will be undefined in this case
    //   console.log("No such document!");
    // }
    // -------------------
    // GOOD FOR GETTING THE USERS
    // const q = query(collection(db, "Users"));
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   console.log("test");
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.id, " => ", doc.data());
    // });
    // ------------------------------
    //GOOD FOR GETTING SUB COLLECTION
    console.log("Retreving data Listings---------------------------");
    setLoading(true);
    const usersPosts = [];
    const usersEmailImgName = [];
    const posts = query(collectionGroup(db, "Posts"));
    const querySnapshot = await getDocs(posts);
    querySnapshot.forEach((doc) => {
      // console.log(doc.data());
      // console.log(usersPosts.length);
      usersPosts.push({ ...doc.data(), key: doc.id });
      // console.log(usersPosts.length);
    });
    console.log(usersPosts);
    console.log("start 1");
    const newListings = [...listings];

    for (let i = 0; i < usersPosts.length; i++) {
      // console.log(usersPosts[i]);
      // console.log(usersPosts[i].user);
      // console.log(usersPosts[i].img_name);
      const reference = ref(
        storage,
        `images/${usersPosts[i].user}/posts/${usersPosts[i].img_name}`
      );
      await getDownloadURL(reference).then((x) => {
        // console.log(usersPosts[i]);
        // console.log(x);
        usersPosts[i].img_uri = x;
        // setUrl(x);
        newListings.forEach((element) => {
          element.img_uri = x;
        });
      });
      usersEmailImgName.push({
        email: usersPosts[i].user,
        post_img: usersPosts[i].img_name,
      });
    }
    setListings(usersPosts);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    console.log("USE EFFECTT FOR LISTINGS.................................");
    retrieveData();
  }, []);

  return (
    <Screen style={styles.screen}>
      <Loader visible={loading} />

      {/* <ActivityIndicator animating={loading} size="large" /> */}
      {/* <Loader visible={loading} /> */}
      <FlatList
        data={listings}
        keyExtractor={(listing) => listing.key.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card
            title={item.title}
            subTitle={"$" + item.price}
            image={{ uri: item.img_uri }}
            // image={require("../assets/chair.jpg")}
            onPress={() => navigation.navigate("ListingDetails", item)}
          />
        )}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          retrieveData();
          setLoading(false);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 10,
    backgroundColor: colors.light,
  },
  imgTest: {
    width: 200,
    height: 200,
  },
});

export default ListingsScreen;
