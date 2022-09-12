import React, { useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
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

import { ListItem, ListItemSeparator } from "../components/lists";
import colors from "../config/colors";
import Icon from "../components/Icon";
import Screen from "../components/Screen";
import { useState } from "react/cjs/react.development";

const menuItems = [
  {
    title: "My Listings",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary,
    },
  },
  {
    title: "My Messages",
    icon: {
      name: "email",
      backgroundColor: colors.secondary,
    },
    targetScreen: "Messages",
  },
];

function AccountScreen({ navigation }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [firstName, setFirstName] = useState("firstName");
  const [lastName, setLastName] = useState("SecondName");
  const [email, setEmail] = useState("email");
  const auth = authentication;
  const userNow = {};

  useEffect(() => {
    console.log("USE EFFECTT FOR Account.................................");
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // navigation.replace("AppNavigator");
        setIsSignedIn(true);
      } else {
        navigation.navigate("LoginScreen");
        setIsSignedIn(false);
      }
    });
    retrieveData();
  });

  const handleSignOut = () => {
    signOut(auth)
      .then((re) => {
        setIsSignedIn(false);
        console.log("signedOut");
        navigation.replace("WelcomeScreen");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const retrieveData = async () => {
    console.log("test1");
    const docRef = doc(db, "Users", auth.currentUser.email);
    // console.log(docRef);

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());

      setEmail(docSnap.data().email);
      setFirstName(docSnap.data().firstName);
      setLastName(docSnap.data().lastName);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
    console.log("Retreving Profile Pict---------------------------");
    const reference = ref(
      storage,
      `images/${auth.currentUser.email}/profilePict/${auth.currentUser.email}`
    );

    await getDownloadURL(reference).then((x) => {
      setProfilePicture(x);
    });

    // setLoading(false);
    // setRefreshing(false);
    // setListings(usersPosts);
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title={`${firstName} ${lastName}`}
          subTitle={email}
          image={{ uri: profilePicture }}
        />
      </View>

      <View style={styles.container}>
        <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          ItemSeparatorComponent={ListItemSeparator}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              IconComponent={
                <Icon
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
              onPress={() => navigation.navigate(item.targetScreen)}
            />
          )}
        />
      </View>
      <ListItem
        title="Log Out"
        IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
        onPress={handleSignOut}
      />
      <>
        <ListItem
          title="Log In"
          IconComponent={
            <Icon name="account" backgroundColor={colors.primary} />
          }
          onPress={() => navigation.navigate("LoginScreen")}
        />
        <ListItem
          title="Register"
          IconComponent={
            <Icon name="account" backgroundColor={colors.secondary} />
          }
          onPress={() => navigation.navigate("RegisterScreen")}
        />
      </>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
  },
  container: {
    marginVertical: 20,
  },
});

export default AccountScreen;
