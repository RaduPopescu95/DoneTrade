import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Alert,
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
import {
  ref,
  uploadBytes,
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
import { ListItemSeparator } from "../components/lists";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import { Form } from "../components/forms";
import colors from "../config/colors";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import ProfilePictPicker from "../components/forms/ProfilePictPicker";
import ProfilePictEdit from "../components/forms/ProfilePictEdit";
import UploadScreen from "./UploadScreen";

const validationSchema = Yup.object().shape({
  images: Yup.array()
    .min(1, "Please select at least one image.")
    .label("profilePict"),
});

function EditProfileScreen({ route }) {
  const [userDetails, setUserDetails] = useState({});
  const [uploadVisible, setUploadVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [newImg, setNewImg] = useState(null);
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
      initialValue: "password",
    },
  ];

  const handleSignUp = async (values) => {
    const storageRef = ref(storage, `images/profilePict/${values.email}`);
    const img = await fetch(values.profilePict);
    const bytes = await img.blob();
    await uploadBytes(storageRef, bytes);
    setUploadVisible(true);
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredentials) => {
        setTimeout(function () {
          const user = userCredentials.user;
          const collectionId = "Users";
          const documentId = values.email;
          const value = {
            owner_uid: user.uid,
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            email: user.email,
          };
          setDoc(doc(db, collectionId, documentId), value);
        }, 1500);
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
    const fileName = image.split("/").pop();
    const storageRef = ref(
      storage,
      `images/${values.email}/profilePict/${fileName}`
    );
    const img = await fetch(image);
    const bytes = await img.blob();
    await uploadBytes(storageRef, bytes);
  };

  const handleFinalDelete = async () => {
    console.log("...curentuser", auth.currentUser.uid);
    // // Delete the file (REMEMBER TO ADD DELETE ALL IMG POSTS WHEN DELETTING USER)
    const desertRef = ref(
      storage,
      `images/profilePict/${auth.currentUser.uid}`
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

    // Delete doc
    const usersPosts = [];
    const posts = query(collectionGroup(db, "Posts"));
    const querySnapshot = await getDocs(posts);
    querySnapshot.forEach((doc) => {
      if (doc.data().user === auth.currentUser.email) {
        usersPosts.push({ ...doc.data(), key: doc.id });
      }
    });
    for (let i = 0; i < usersPosts.length; i++) {
      await deleteDoc(
        doc(db, "Users", auth.currentUser.uid, "Posts", usersPosts[i].key)
      );
    }
    await deleteDoc(doc(db, "Users", auth.currentUser.uid));
    //Delete user from authentication
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
    const docRef = doc(db, "Users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
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
  };

  useEffect(() => {
    retrieveData();
  }, [details, newImg]);

  return (
    <>
      <ScrollView style={styles.container}>
        <UploadScreen visible={uploadVisible} />
        <Form
          initialValues={{
            profilePict: [],
          }}
          onSubmit={handleSignUp}
          validationSchema={validationSchema}
        >
          <View style={{ marginTop: 15 }}>
            <ProfilePictEdit
              name="profilePict"
              img={profilePicture}
              newImg={setNewImg}
            />
          </View>
        </Form>
        <View style={{ marginTop: 10 }}>
          <FlatList
            data={options}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableHighlight
                underlayColor={colors.light}
                onPress={() => navigation.navigate("EditProfileElement", item)}
              >
                <View style={styles.containerTouch}>
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
          />
          <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
            <Text style={styles.text}>Delete account</Text>
          </TouchableOpacity>
        </View>
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
