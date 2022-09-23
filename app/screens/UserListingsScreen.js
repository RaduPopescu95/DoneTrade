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
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
// import { onSnapshot } from "firebase/firestore";

const handleNavigate = () => {
  navigation.navigate("WelcomeScreen");
  // console.log("adsasdadsa");
};

function UserListingsScreen({ navigation }) {
  const [listings, setListings] = useState([]);
  const [primite, setPrimite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [url, setUrl] = useState();
  const [currentUserOnline, setCurrentUserOnline] = useState("");
  const auth = authentication;

  const retrieveData = async () => {
    //GOOD FOR GETTING SUB COLLECTION
    console.log("Retreving data Listings---------------------------");
    setLoading(true);
    const usersPosts = [];
    const usersEmailImgName = [];
    const posts = query(collectionGroup(db, "Posts"));
    const querySnapshot = await getDocs(posts);
    querySnapshot.forEach((doc) => {
      // console.log(usersPosts.length);
      if (doc.data().user === auth.currentUser.email) {
        // console.log("yes");
        // console.log("curent user...", auth.currentUser.email);
        usersPosts.push({ ...doc.data(), key: doc.id });
      }
      // console.log(usersPosts.length);
    });
    // console.log(usersPosts);
    console.log("start 1");
    const newListings = [...listings];

    for (let i = 0; i < usersPosts.length; i++) {
      // console.log(usersPosts[i]);
      // console.log(usersPosts[i].user);
      // console.log(usersPosts[i].img_name);
      const reference = ref(
        storage,
        `images/${auth.currentUser.email}/posts/${usersPosts[i].img_name}`
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
    console.log("listings for user...", listings);
  }, []);

  return (
    <Screen>
      <Loader visible={loading} />
      <FlatList
        data={listings}
        keyExtractor={(listing) => listing.key.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          // <Text>{item.description}</Text>
          <ListItem
            title={item.title}
            subTitle={
              item.description.length > 0 ? item.description : "No description"
            }
            image={{ uri: item.img_uri }}
            onPress={() => navigation.navigate("UserListingDetails", item)}
            renderRightActions={() => (
              <ListItemDeleteAction onPress={() => handleDelete(item)} />
            )}
          />
        )}
        ItemSeparatorComponent={ListItemSeparator}
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

const styles = StyleSheet.create({});

export default UserListingsScreen;
