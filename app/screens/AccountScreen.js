import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
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
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ListItem, ListItemSeparator } from "../components/lists";
import colors from "../config/colors";
import Icon from "../components/Icon";
import Screen from "../components/Screen";
import MenuList from "../components/lists/MenuList";

const menuItems = [
  {
    title: "My Listings",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary,
    },
    targetScreen: "MyListings",
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
      console.log("Document data:", docSnap.data());

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

  const data = [
    {
      id: 1,
      title: "You",
      color: colors.light,
      titleColor: colors.dark,
      image: "https://img.icons8.com/color/70/000000/name.png",
      icon: {
        name: "account",
        backgroundColor: colors.primary,
      },
      targetScreen: "EditProfileScreen",
    },
    {
      id: 2,
      title: "Listings",
      color: colors.light,
      titleColor: colors.dark,
      image: "https://img.icons8.com/office/70/000000/home-page.png",
      icon: {
        name: "format-list-bulleted",
        backgroundColor: colors.primary,
      },
      targetScreen: "MyListings",
    },
    {
      id: 3,
      title: "Log In",
      color: colors.light,
      titleColor: colors.dark,
      image: "https://img.icons8.com/color/70/000000/two-hearts.png",
      icon: {
        name: "login",
        backgroundColor: colors.secondary,
      },
      targetScreen: "LoginScreen",
    },

    {
      id: 4,
      title: "Register",
      color: colors.light,
      titleColor: colors.dark,
      image: "https://img.icons8.com/color/70/000000/family.png",
      icon: {
        name: "account-box",
        backgroundColor: colors.primary,
      },
      targetScreen: "RegisterScreen",
    },
    {
      id: 5,
      title: "Log Out",
      color: colors.light,
      titleColor: colors.dark,
      image: "https://img.icons8.com/color/70/000000/two-hearts.png",
      icon: {
        name: "logout",
        backgroundColor: colors.secondary,
      },
      targetScreen: "LogoutScreen",
    },
  ];

  const handlePress = (targetScreen) => {
    if (targetScreen === "LogoutScreen") {
      Alert.alert("LOG OUT", "Are you sure you want to log out?", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => handleSignOut() },
      ]);
    } else navigation.navigate(targetScreen);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}></View>
        {auth.currentUser ? (
          <Image style={styles.avatar} source={{ uri: profilePicture }} />
        ) : (
          <Image
            style={styles.avatar}
            source={require("../assets/blankProfile.png")}
          />
        )}
      </View>
      <View style={styles.containerMenu}>
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContainer}
          data={data}
          horizontal={false}
          numColumns={2}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={({ item }) => {
            if (
              auth.currentUser &&
              (item.id === 5 || item.id === 1 || item.id === 2)
            ) {
              return (
                <MenuList
                  item={item}
                  handlePress={() => handlePress(item.targetScreen)}
                />
              );
            }
            if (!auth.currentUser && (item.id === 3 || item.id === 4)) {
              return (
                <MenuList
                  item={item}
                  handlePress={() => handlePress(item.targetScreen)}
                />
              );
            }
          }}
        />
      </View>
    </>
    // <Screen style={styles.screen}>
    //   <View style={styles.container}>
    //     <ListItem
    //       title={`${firstName} ${lastName}`}
    //       subTitle={email}
    //       image={{ uri: profilePicture }}
    //     />
    //   </View>

    //   <View style={styles.container}>
    //     <FlatList
    //       data={menuItems}
    //       keyExtractor={(menuItem) => menuItem.title}
    //       ItemSeparatorComponent={ListItemSeparator}
    //       renderItem={({ item }) => (
    //         <ListItem
    //           title={item.title}
    //           IconComponent={
    // <Icon
    //   name={item.icon.name}
    //   backgroundColor={item.icon.backgroundColor}
    // />
    //           }
    //           onPress={() => navigation.navigate(item.targetScreen)}
    //         />
    //       )}
    //     />
    //   </View>

    //   {!auth.currentUser ? (
    //     <>
    //       <ListItem
    //         title="Log In"
    //         IconComponent={
    //           <Icon name="account" backgroundColor={colors.primary} />
    //         }
    //         onPress={() => navigation.navigate("LoginScreen")}
    //       />
    //       <ListItem
    //         title="Register"
    //         IconComponent={
    //           <Icon name="account" backgroundColor={colors.secondary} />
    //         }
    //         onPress={() => navigation.navigate("RegisterScreen")}
    //       />
    //     </>
    //   ) : (
    // <ListItem
    //   title="Log Out"
    //   IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
    //   onPress={handleSignOut}
    // />
    //   )}
    // </Screen>
  );
}

const styles = StyleSheet.create({
  // screen: {
  //   backgroundColor: colors.light,
  // },
  // container: {
  //   marginVertical: 20,
  // },
  containerMenu: {
    flex: 1,
    marginTop: 65,
    backgroundColor: "#fff",
  },
  list: {
    paddingHorizontal: 5,
    backgroundColor: "#fff",
  },
  listContainer: {
    alignItems: "center",
  },
  header: {
    backgroundColor: colors.primary,
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 130,
  },
  name: {
    fontSize: 33,
    color: colors.primary,
    fontWeight: "600",
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: "center",
    padding: 30,
  },
  bodyContentWithoutFlex: {
    alignItems: "center",
    padding: 30,
  },
  name: {
    fontSize: 28,
    color: "#696969",
    fontWeight: "600",
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: "#00BFFF",
  },
  /******** card **************/
  card: {
    shadowColor: "#474747",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
    marginVertical: 20,
    marginHorizontal: 40,
    backgroundColor: "#e2e2e2",
    //flexBasis: '42%',
    width: 90,
    height: 90,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeader: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardImage: {
    height: 50,
    width: 50,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    flex: 1,
    alignSelf: "center",
    fontWeight: "bold",
  },
});

export default AccountScreen;
