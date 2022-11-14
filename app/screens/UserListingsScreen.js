import React, { useEffect } from "react";
import { FlatList, StyleSheet, Alert } from "react-native";
import { authentication, db, storage } from "../../firebase";
import {
  doc,
  getDocs,
  query,
  collectionGroup,
  deleteDoc,
} from "firebase/firestore";
import Screen from "../components/Screen";
import { useState } from "react/cjs/react.development";
import Loader from "../components/Loader";
import { ref, getDownloadURL, deleteObject } from "firebase/storage";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";

function UserListingsScreen({ navigation }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deleted, setDeleted] = useState(true);
  const auth = authentication;

  const handleDelete = (item) => {
    Alert.alert(
      "Are you sure you want to delete this listing?",
      "After deletting your listing you will not be able to retrieve it!",
      [
        {
          text: "Delete listing",
          onPress: () => handleFinalDelete(item),
          // onPress: () => console.log("the item...", item),
          style: "cancel",
        },
        {
          text: "Keep listing",
          onPress: () => console.log("keep listing"),
          style: "cancel",
        },
      ]
    );
  };

  const handleFinalDelete = async (item) => {
    console.log("...curentuser", auth.currentUser.uid);
    // // Delete the file (REMEMBER TO ADD DELETE ALL IMG POSTS WHEN DELETTING USER)
    for (let i = 0; i < item.img_names.length; i++) {
      console.log(`${i}...items`, item.img_names[i]);
      const desertRef = ref(
        storage,
        `images/posts/${auth.currentUser.uid}&&${item.img_names[i]}`
      );
      deleteObject(desertRef)
        .then(() => {
          // File deleted successfully
          console.log("deleted file...");
        })
        .catch((error) => {
          console.log("error deleting file...", error);
          // Uh-oh, an error occurred!
        });
    }

    // Delete the post
    try {
      await deleteDoc(
        doc(db, "Users", auth.currentUser.uid, "Posts", item.key)
      );
      console.log("success delete from database!");
    } catch (err) {
      console.log("error on deletting the post from database...", errr);
    }
    setDeleted(!deleted);
  };

  const retrieveData = async () => {
    //GOOD FOR GETTING SUB COLLECTION
    console.log("Retreving data Listings---------------------------");
    setLoading(true);
    const usersPosts = [];
    const usersEmailImgName = [];
    const posts = query(collectionGroup(db, "Posts"));
    const querySnapshot = await getDocs(posts);
    querySnapshot.forEach((doc) => {
      if (doc.data().user === auth.currentUser.email) {
        usersPosts.push({ ...doc.data(), key: doc.id });
      }
    });
    for (let i = 0; i < usersPosts.length; i++) {
      console.log("start 3");
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
    setListings(usersPosts);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    retrieveData();
  }, [deleted]);

  return (
    <Screen>
      <Loader visible={loading} />
      <FlatList
        data={listings}
        keyExtractor={(listing) => listing.key.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            subTitle={
              item.description.length > 0 ? item.description : "No description"
            }
            image={{ uri: item.img_uri[0] }}
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
