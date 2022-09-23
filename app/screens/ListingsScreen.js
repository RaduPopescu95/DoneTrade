import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import Constants from "expo-constants";
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
import SearchBox from "../components/SearchBox";
import OtherUserListings from "../components/OtherUserListings";
import Category from "../components/Category";
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
  const imageUri = "";

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
    // console.log("query...", querySnapshot);
    querySnapshot.forEach((doc) => {
      console.log("doc.data...", doc.data());
      // console.log(usersPosts.length);
      usersPosts.push({ ...doc.data(), key: doc.id });
      // console.log(usersPosts.length);
    });
    console.log("usersPosts...", usersPosts);
    console.log("start 1");
    const newListings = [...listings];
    const img_uri = [];

    for (let i = 0; i < usersPosts.length; i++) {
      for (let z = 0; z < usersPosts[i].img_names.length; z++) {
        console.log("img names...", usersPosts[i].img_names[z]);
        const reference = ref(
          storage,
          `images/${usersPosts[i].user}/posts/${usersPosts[i].img_names[z]}`
        );
        await getDownloadURL(reference).then((x) => {
          // console.log(usersPosts[i]);
          console.log("xxx", x);
          img_uri.push(x);

          // setUrl(x);
          // newListings.forEach((element) => {
          //   element.img_uri = x;
          // });
        });
      }
      usersPosts[i].img_uri = [...img_uri];
      usersPosts[i].first_img_uri = img_uri[0];
      console.log("firstimageuri...", usersPosts[i].first_img_uri);
      usersEmailImgName.push({
        email: usersPosts[i].user,
        post_img: usersPosts[i].img_names[0],
      });
    }
    setLoading(false);
    console.log("UsersPosts2...", usersPosts);
    // console.log("imgs urisss...", usersPosts.img_uri[0]);
    // imageUri = usersPosts.img_uri[0];
    setListings(usersPosts);
    setRefreshing(false);
  };

  useEffect(() => {
    console.log("USE EFFECTT FOR LISTINGS.................................");
    retrieveData();
  }, []);

  return (
    <>
      <View style={styles.searchContainer}></View>
      <Screen style={styles.screen}>
        {/* <Category /> */}
        <Loader visible={loading} />

        {/* <ActivityIndicator animating={loading} size="large" /> */}
        {/* <Loader visible={loading} /> */}
        <FlatList
          data={listings}
          keyExtractor={(listing) => listing.key.toString()}
          showsVerticalScrollIndicator={false}
          style={styles.listingsStyle}
          numColumns={2}
          renderItem={({ item }) => (
            // console.log(typeof item.img_uri[0], item.img_uri[0])
            <Card
              title={item.title}
              subTitle={"$" + item.price}
              image={{ uri: item.first_img_uri }}
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
    </>
  );
}

const styles = StyleSheet.create({
  listingsStyle: {
    // flex: 1,
    // flexDirection: "row",
    // margin: 0,
  },
  card: {
    // shadowColor: colors.dark,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.37,
    shadowRadius: 10.49,
    elevation: 4,
    width: "100%",
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
  screen: {
    padding: 5,
    backgroundColor: colors.light,
    paddingTop: 5,
  },
  searchContainer: {
    // flex: 1,
    // justifyContent: "center",
    marginTop: 7,
    backgroundColor: colors.light,
    paddingTop: Constants.statusBarHeight,
  },
  imgTest: {
    width: 200,
    height: 200,
  },
});

export default ListingsScreen;
