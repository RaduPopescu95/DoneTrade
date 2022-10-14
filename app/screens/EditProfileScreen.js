import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Button,
  Alert,
  TextInput,
  ScrollView,
  FlatList,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Modal,
} from "react-native";
import * as Yup from "yup";
import { authentication, db, storage } from "../../firebase";
import { getAuth, deleteUser } from "firebase/auth";
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import {
  setDoc,
  doc,
  getDoc,
  deleteDoc,
  collectionGroup,
  getDocs,
  query,
} from "firebase/firestore";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
// import * as auth from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import { Form, FormField, SubmitButton } from "../components/forms";
import colors from "../config/colors";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import ProfilePictPicker from "../components/forms/ProfilePictPicker";
import UploadScreen from "./UploadScreen";

const validationSchema = Yup.object().shape({
  // firstName: Yup.string()
  //   .required("First name is a required field")
  //   .label("FirstName"),
  // lastName: Yup.string()
  //   .required("Last name is a required field")
  //   .label("LastName"),
  // email: Yup.string().required().email().label("Email"),
  // phoneNumber: Yup.number()
  //   .typeError("Phone number must contain only numbers!")
  //   .required("You need to enter a phone number")
  //   .label("PhoneNumber"),
  // password: Yup.string().required().min(4).label("Password"),
  // email: Yup.string().email().required("Please Enter your Email"),
  // confirmPassword: Yup.string()
  //   .required("Please confirm your password")
  //   .oneOf([Yup.ref("password"), null], "Passwords must match"),
  images: Yup.array()
    .min(1, "Please select at least one image.")
    .label("profilePict"),
});

function EditProfileScreen({ route }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [profileImg, setProfileImg] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [uploadVisible, setUploadVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [modalVisible, setModalVisible] = useState(true);
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [currentUserOnline, setCurrentUserOnline] = useState("");
  const navigation = useNavigation();
  const auth = authentication;
  const details = route.params;

  const options = [
    {
      id: 1,
      title: "First name",
      subtitle: userDetails.firstName,
      firebaseParam: "firstName",
      initialValue: "firstName",
    },
    {
      id: 2,
      title: "Second name",
      subtitle: userDetails.lastName,
      firebaseParam: "lastName",
      initialValue: "lastName",
    },
    {
      id: 3,
      title: "Email",
      subtitle: userDetails.email,
      firebaseParam: "email",
      initialValue: "email",
    },
    {
      id: 4,
      title: "Phone number",
      subtitle: userDetails.phoneNumber,
      firebaseParam: "phoneNumber",
      initialValue: "phoneNumber",
    },
    {
      id: 5,
      title: "Change password",
      // subtitle: userDetails.phoneNumber,
      initialValue: "password",
    },
  ];

  const handleSignUp = async (values) => {
    console.log("START PROFILE PICTURE UPLOAD");
    console.log(values.email);
    setCurrentUserOnline(values.email);
    console.log("START 1");
    console.log(values.profilePict);
    const fileName = values.profilePict.split("/").pop();
    console.log("START 2");
    console.log(fileName);
    const fileType = fileName.split(".").pop();
    console.log("START 3");
    const storageRef = ref(storage, `images/profilePict/${values.email}`);
    console.log("START 4");
    const img = await fetch(values.profilePict);
    console.log("START 5");
    console.log("START 6");
    const bytes = await img.blob();
    console.log("START 7");
    await uploadBytes(storageRef, bytes);
    console.log("START 8");
    console.log("HANDLESIGNUP");
    setUploadVisible(true);
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredentials) => {
        setTimeout(function () {
          const user = userCredentials.user;
          console.log("Starting PASS");
          setIsSignedIn(true);
          const collectionId = "Users";
          const documentId = values.email;
          const value = {
            owner_uid: user.uid,
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            email: user.email,
            // profilePicture: getRandomProfilePicture(),
          };
          setDoc(doc(db, collectionId, documentId), value);
          console.log("success PASS");
        }, 1500);

        // navigation.replace("AppNavigator");
      })

      .catch((error) => {
        Alert.alert(
          "User already in use",
          "Your e-mail is already in use. Please try again with another e-mail or log in into an existing account",
          [
            {
              text: "Try Again",
              onPress: () => console.log("Try Again pressed"),
              style: "cancel",
            },
          ]
        );

        console.log(error);
      });
  };

  const uploadProfilePicture = async (image, values) => {
    // setLoading(true);
    console.log(image);
    console.log("START 1");
    const fileName = image.split("/").pop();
    console.log("START 2");
    const fileType = fileName.split(".").pop();
    console.log("START 3");
    const storageRef = ref(
      storage,
      `images/${values.email}/profilePict/${fileName}`
    );
    console.log("START 4");
    const img = await fetch(image);
    console.log("START 5");
    console.log("START 6");
    const bytes = await img.blob();
    console.log("START 7");
    await uploadBytes(storageRef, bytes);
    console.log("START 8");
    // setLoading(false);
    //  navigation.goBack();
  };

  // // // The Firebase Admin SDK to access Firestore.
  // const functions = require("firebase-functions");
  // const admin = require("firebase-admin");

  const handleFinalDelete = async () => {
    console.log("...curentuser", auth.currentUser.uid);

    // // Delete the file (REMEMBER TO ADD DELETE ALL IMG POSTS WHEN DELETTING USER)
    const desertRef = ref(
      storage,
      `images/profilePict/${auth.currentUser.uid}`
    );
    console.log("desertRef", desertRef);

    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
        console.log("deleted file...");
      })
      .catch((error) => {
        console.log("error deleting file...", error);
        // Uh-oh, an error occurred!
      });

    // // Delete doc
    const usersPosts = [];
    const posts = query(collectionGroup(db, "Posts"));
    const querySnapshot = await getDocs(posts);
    console.log("start1...");
    querySnapshot.forEach((doc) => {
      // console.log(usersPosts.length);
      console.log("start2...");
      if (doc.data().user === auth.currentUser.email) {
        console.log("start3...");
        // console.log("yes");
        // console.log("curent user...", auth.currentUser.email);
        usersPosts.push({ ...doc.data(), key: doc.id });
        console.log("start4...");
      }
      // console.log(usersPosts.length);
      console.log("start5...");
    });
    for (let i = 0; i < usersPosts.length; i++) {
      await deleteDoc(
        doc(db, "Users", auth.currentUser.uid, "Posts", usersPosts[i].key)
      );
      console.log("startI...", usersPosts[i].key);
    }
    console.log("start6...");
    await deleteDoc(doc(db, "Users", auth.currentUser.uid));
    console.log("start7...");

    //Delete user from authentication
    console.log("deletting...", auth.currentUser.uid);
    auth.currentUser
      .delete()
      .then(() => console.log("User deleted"))
      .catch((error) => console.log(error));
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Are you sure you want to delete your account?",
      "After deletting your account you will not be able to retrieve your account and listings and you will have to create a new account.",
      [
        {
          text: "Delete account",
          onPress: () => handleFinalDelete(),
          style: "cancel",
        },
        {
          text: "Keep account",
          onPress: () => console.log("keep account"),
          style: "cancel",
        },
      ]
    );
  };

  const retrieveData = async () => {
    console.log("test1", auth.currentUser);
    const docRef = doc(db, "Users", auth.currentUser.uid);
    console.log("test2");
    console.log(docRef);
    console.log("test3");
    const docSnap = await getDoc(docRef);
    console.log("test4");
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setUserDetails(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }

    const reference = ref(
      storage,
      `images/profilePict/${auth.currentUser.uid}`
    );

    await getDownloadURL(reference).then((x) => {
      setProfilePicture(x);
    });

    // ------------------------------
    //GOOD FOR GETTING SUB COLLECTION
    // console.log("Retreving data OF USERS---------------------------");
    // // setLoading(true);

    // const usersEmailImgName = [];
    // const posts = query(collectionGroup(db, "Posts"));
    // const querySnapshot = await getDocs(posts);
    // // console.log("query...", querySnapshot);
    // querySnapshot.forEach((doc) => {
    //   // console.log("doc.idd...", doc.id);
    //   // console.log(usersPosts.length);
    //   usersPosts.push({ ...doc.data(), key: doc.id });
    //   // console.log(usersPosts.length);
    // });
    // // console.log("usersPosts...", usersPosts);
    // // console.log("start 1");
    // const newListings = [...listings];

    // for (let i = 0; i < usersPosts.length; i++) {
    //   const img_uri = [];
    //   for (let z = 0; z < usersPosts[i].img_names.length; z++) {
    //     console.log(`img names...${z}`, usersPosts[i].img_names[z]);
    //     const reference = ref(
    //       storage,
    //       `images/${usersPosts[i].user}/posts/${usersPosts[i].img_names[z]}`
    //     );

    //     await getDownloadURL(reference).then((x) => {
    //       // console.log(usersPosts[i]);

    //       img_uri.push(x);
    //       console.log(`xxx...img uri${z}`, img_uri);

    //       // setUrl(x);
    //       // newListings.forEach((element) => {
    //       //   element.img_uri = x;
    //       // });
    //     });
    //   }
    //   // console.log("image uris...", img_uri);
    //   usersPosts[i].img_uri = [...img_uri];
    //   usersPosts[i].first_img_uri = img_uri[0];

    //   // console.log("firstimageuri...", usersPosts[i].first_img_uri);
    //   usersEmailImgName.push({
    //     email: usersPosts[i].user,
    //     post_img: usersPosts[i].img_names[0],
    //   });
    // }
    // setLoading(false);
    // // console.log("UsersPosts2...", usersPosts);
    // // console.log("imgs urisss...", usersPosts[0].img_uri);
    // // imageUri = usersPosts.img_uri[0];
    // setListings(usersPosts);
    // setRefreshing(false);
  };

  useEffect(() => {
    setCurrentUserOnline(auth.currentUser);
    console.log("registerUseEffect.....", auth.currentUser);
    retrieveData();
  }, [details]);

  return (
    <>
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      ></Modal> */}
      <ScrollView style={styles.container}>
        <UploadScreen visible={uploadVisible} />

        <Form
          initialValues={{
            // firstName: "",
            // lastName: "",
            // email: "",
            // password: "",
            profilePict: [],
          }}
          onSubmit={handleSignUp}
          validationSchema={validationSchema}
        >
          <ProfilePictPicker name="profilePict" img={profilePicture} />
        </Form>
        <Screen>
          {/* <Loader visible={loading} /> */}

          <FlatList
            data={options}
            // keyExtractor={(option) => option.key.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              // <Text>{item.description}</Text>
              <TouchableHighlight
                underlayColor={colors.light}
                onPress={() => navigation.navigate("EditProfileElement", item)}
              >
                <View style={styles.containerTouch}>
                  {/* {IconComponent} */}
                  {/* {image && <Image style={styles.image} source={image} />} */}
                  <View style={styles.detailsContainer}>
                    <Text style={styles.title} numberOfLines={1}>
                      {item.title}
                    </Text>
                    {item.subtitle && (
                      <Text style={styles.subTitle} numberOfLines={2}>
                        {item.subtitle}
                      </Text>
                    )}
                  </View>
                  <MaterialCommunityIcons
                    color={colors.medium}
                    name="chevron-right"
                    size={25}
                  />
                </View>
              </TouchableHighlight>
            )}
            ItemSeparatorComponent={ListItemSeparator}
            // refreshing={refreshing}
            // onRefresh={() => {
            //   setRefreshing(true);
            //   retrieveData();
            //   setLoading(false);
            // }}
          />
          {/* <TouchableHighlight
            underlayColor={colors.light}
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <View style={styles.containerTouch}>
              <View style={styles.detailsContainer}>
                <Text style={styles.title} numberOfLines={1}>
                  Change password
                </Text>
              </View>
              <MaterialCommunityIcons
                color={colors.medium}
                name="chevron-right"
                size={25}
              />
            </View>
          </TouchableHighlight> */}
          <TouchableOpacity
            // style={[styles.button, { backgroundColor: colors[color] }]}
            style={styles.button}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.text}>Delete account</Text>
          </TouchableOpacity>
        </Screen>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  img: {
    marginBottom: 15,
  },
  container: {
    padding: 10,
    backgroundColor: colors.light,
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  containerTouch: {
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
    backgroundColor: colors.white,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  subTitle: {
    color: colors.medium,
  },
  title: {
    fontWeight: "500",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
    marginVertical: 20,
  },
  text: {
    color: colors.white,
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
