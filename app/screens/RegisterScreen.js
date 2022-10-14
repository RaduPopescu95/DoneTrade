import React, { useState, useEffect } from "react";
import { StyleSheet, Button, Alert, TextInput, ScrollView } from "react-native";
import * as Yup from "yup";
import { authentication, db, storage } from "../../firebase";
import { ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";
// import * as auth from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Screen from "../components/Screen";
import { Form, FormField, SubmitButton } from "../components/forms";
import colors from "../config/colors";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import ProfilePictPicker from "../components/forms/ProfilePictPicker";
import UploadScreen from "./UploadScreen";

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is a required field")
    .label("FirstName"),
  lastName: Yup.string()
    .required("Last name is a required field")
    .label("LastName"),
  email: Yup.string().required().email().label("Email"),
  phoneNumber: Yup.number()
    .typeError("Phone number must contain only numbers!")
    .required("You need to enter a phone number")
    .label("PhoneNumber"),
  password: Yup.string().required().min(4).label("Password"),
  email: Yup.string().email().required("Please Enter your Email"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
  images: Yup.array()
    .min(1, "Please select at least one image.")
    .label("profilePict"),
});

function RegisterScreen() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [profileImg, setProfileImg] = useState([]);
  const [currentUserOnline, setCurrentUserOnline] = useState("");
  const [uploadVisible, setUploadVisible] = useState(false);
  const navigation = useNavigation();
  const auth = authentication;

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

    setUploadVisible(true);
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredentials) => {
        setTimeout(async () => {
          const user = userCredentials.user;
          const storageRef = ref(storage, `images/profilePict/${user.uid}`);

          const img = await fetch(values.profilePict);

          const bytes = await img.blob();

          await uploadBytes(storageRef, bytes);
          console.log("Starting PASS");
          setIsSignedIn(true);
          const collectionId = "Users";
          const documentId = user.uid;
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
      `images/${values.email}/profilePict/${user.uid}`
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

  useEffect(() => {
    console.log("registerUseEffect.....");
  }, []);
  return (
    <ScrollView style={styles.container}>
      <UploadScreen visible={uploadVisible} />
      <Form
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          profilePict: [],
        }}
        onSubmit={handleSignUp}
        validationSchema={validationSchema}
      >
        <ProfilePictPicker name="profilePict" />
        <FormField
          autoCorrect={false}
          icon="account"
          name="firstName"
          placeholder="First name"
        />
        <FormField
          autoCorrect={false}
          icon="account"
          name="lastName"
          placeholder="Last name"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="email"
          keyboardType="email-address"
          name="email"
          placeholder="Email"
          textContentType="emailAddress"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="email"
          keyboardType="number"
          name="phoneNumber"
          placeholder="Phone Number"
          textContentType="emailAddress"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          name="password"
          placeholder="Password"
          secureTextEntry
          textContentType="password"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          name="confirmPassword"
          placeholder="Confirm password"
          secureTextEntry
          textContentType="password"
        />
        <SubmitButton title="Register" />
        <Button
          title="Login"
          onPress={() => navigation.navigate("LoginScreen")}
        />
      </Form>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.light,
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
});

export default RegisterScreen;
