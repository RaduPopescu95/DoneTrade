import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import { authentication, db, storage } from "../../firebase";
import { ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
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
  const [uploadVisible, setUploadVisible] = useState(false);
  const navigation = useNavigation();
  const auth = authentication;

  const handleSignUp = async (values) => {
    const fileName = values.profilePict.split("/").pop();
    // const fileType = fileName.split(".").pop();
    setUploadVisible(true);
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredentials) => {
        setTimeout(async () => {
          const user = userCredentials.user;
          const storageRef = ref(storage, `images/profilePict/${user.uid}`);
          const img = await fetch(values.profilePict);
          const bytes = await img.blob();
          await uploadBytes(storageRef, bytes);
          const collectionId = "Users";
          const documentId = user.uid;
          const value = {
            owner_uid: user.uid,
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            email: user.email,
          };
          setDoc(doc(db, collectionId, documentId), value);
          console.log("success PASS");
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

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <ScrollView>
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
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
            }}
          >
            <Text>Already have an account?</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text style={styles.text}>Click here</Text>
            </TouchableOpacity>
          </View>
        </Form>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.light,
    paddingTop: Constants.statusBarHeight,
    height: "100%",
  },
  button: {
    backgroundColor: "transparent",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
  text: {
    color: colors.dark,
    fontSize: 15,
    textDecorationLine: "underline",
  },
});

export default RegisterScreen;
