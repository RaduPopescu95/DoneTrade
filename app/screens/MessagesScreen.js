import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { authentication, db, storage } from "../../firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  collectionGroup,
} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

import Screen from "../components/Screen";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";

// const initialMessages = [
//   {
//     id: 1,
//     title: "Mosh Hamedani",
//     description: "Hey! Is this item still available?",
//     image: require("../assets/mosh.jpg"),
//   },
//   {
//     id: 2,
//     title: "Mosh Hamedani",
//     description:
//       "I'm interested in this item. When will you be able to post it?",
//     image: require("../assets/mosh.jpg"),
//   },
// ];

function MessagesScreen(props) {
  // const [messages, setMessages] = useState(initialMessages);
  const [refreshing, setRefreshing] = useState(false);
  const [listings, setListings] = useState([]);
  const [primite, setPrimite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState();
  const [currentUserOnline, setCurrentUserOnline] = useState("");
  const auth = authentication;

  const handleDelete = (message) => {
    // Delete the message from messages
    setMessages(messages.filter((m) => m.id !== message.id));
  };

  const retrieveData = async () => {
    //GOOD FOR GETTING SUB COLLECTION
    console.log("Retreving data Messages---------------------------");
    console.log("step 1");
    setLoading(true);
    console.log("step 2");
    const usersPosts = [];
    const usersEmailImgName = [];
    console.log("step 3");
    const posts = query(collectionGroup(db, "Messages"));
    const querySnapshot = await getDocs(posts);
    console.log("step 4");
    querySnapshot.forEach((doc) => {
      // console.log("all...", doc.data());
      // console.log(doc.data().user);
      // console.log(doc.data().touser);
      // console.log(auth.currentUser.email);
      if (
        doc.data().touser === auth.currentUser.email ||
        doc.data().user === auth.currentUser.email
      ) {
        usersPosts.push({ ...doc.data(), key: doc.id });
        // console.log("get the ms...", doc.data());
      }

      // console.log(usersPosts.length);
    });
    console.log("USERSPOSTS...", usersPosts);
    // console.log("USERSPOSTS...", usersPosts);
    // console.log("start 1");
    const newListings = [...listings];

    for (let i = 0; i < usersPosts.length; i++) {
      // console.log("USER IMAGES....", usersPosts[1].user_img);
      console.log(usersPosts[i].user);
      console.log(usersPosts[i].user_img);
      console.log("curentuser...", auth.currentUser.email);
      if (auth.currentUser.email === usersPosts[i].touser) {
        console.log("YES HERE!");
        const reference2 = ref(
          storage,
          `images/${usersPosts[i].user}/profilePict/${usersPosts[i].user}`
        );
        await getDownloadURL(reference2).then((x) => {
          console.log(usersPosts[i]);
          console.log(x);
          usersPosts[i].img_uri = x;
          // setUrl(x);
          newListings.forEach((element) => {
            element.img_uri = x;
          });
        });
      } else {
        const reference = ref(
          storage,
          `images/${usersPosts[i].touser}/profilePict/${usersPosts[i].touser}`
        );
        await getDownloadURL(reference).then((x) => {
          console.log(usersPosts[i]);
          console.log(x);
          usersPosts[i].img_uri = x;
          // setUrl(x);
          newListings.forEach((element) => {
            element.img_uri = x;
          });
        });
      }
      // usersEmailImgName.push({
      //   email: usersPosts[i].user,
      //   post_img: usersPosts[i].img_name,
      // });
    }
    setListings(usersPosts);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    console.log("USE EFFECTT FOR MESSAGES.................................");
    retrieveData();
  }, []);

  return (
    <Screen>
      <FlatList
        data={listings}
        keyExtractor={(listing) => listing.key.toString()}
        renderItem={({ item }) =>
          auth.currentUser.email === item.user ? (
            <ListItem
              title={`sent to: ${item.touser}`}
              subTitle={item.message}
              image={{ uri: item.img_uri }}
              onPress={() => console.log("Message selected", item)}
              renderRightActions={() => (
                <ListItemDeleteAction onPress={() => handleDelete(item)} />
              )}
            />
          ) : (
            <ListItem
              title={item.user}
              subTitle={item.message}
              image={{ uri: item.img_uri }}
              onPress={() => console.log("Message selected", item)}
              renderRightActions={() => (
                <ListItemDeleteAction onPress={() => handleDelete(item)} />
              )}
            />
          )
        }
        ItemSeparatorComponent={ListItemSeparator}
        refreshing={refreshing}
        onRefresh={() => {
          //CREATE DELETE FROM UI AND DATABASE AND SHOW ALERT DO YOU WANT TO DELETE AND EXPLAIN THAT THE MESSAGE WILL NOT BE DELETED FOR THE OTHER PERSON
          setMessages([
            {
              id: 2,
              title: "T2",
              description: "D2",
              image: require("../assets/mosh.jpg"),
            },
          ]);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});

export default MessagesScreen;
