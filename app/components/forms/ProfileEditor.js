import React, { useState } from "react";
import { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as Yup from "yup";
import {
  doc,
  query,
  updateDoc,
  collectionGroup,
  getDocs,
} from "firebase/firestore";
import { updatePassword, signOut, updateEmail } from "firebase/auth";
import { Formik } from "formik";
import { authentication, db } from "../../../firebase";
import colors from "../../config/colors";
import ErrorMessage from "./ErrorMessage";

const validationSchemaFirstName = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is a required field")
    .label("FirstName"),
});

const validationSchemaLastName = Yup.object().shape({
  lastName: Yup.string()
    .required("Last name is a required field")
    .label("LastName"),
});

const validationSchemaPhoneNumber = Yup.object().shape({
  phoneNumber: Yup.number()
    .typeError("Phone number must contain only numbers!")
    .required("You need to enter a phone number")
    .label("PhoneNumber"),
});

const validationSchemaEmail = Yup.object().shape({
  email: Yup.string().email().required("Please Enter your Email"),
});

const validationSchemaPassword = Yup.object().shape({
  password: Yup.string().required().min(4).label("Password"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

function ProfileEditor({ route, navigation }) {
  const option = route.params;
  const [focus, setFocus] = useState(false);
  const [focusConfirm, setFocusConfirm] = useState(false);
  const [opt, setOpt] = useState(option.subtitle);
  const [initialValue, setInitialValue] = useState(option.initialValue);
  const [firebaseParam, setFirebaseParam] = useState(option.firebaseParam);
  const [currentUserOnline, setCurrentUserOnline] = useState("");
  const auth = authentication;
  let confirmPassword = "confirmPassword";
  let usersPosts = [];
  let validationSchema = "";

  switch (initialValue) {
    case "firstName":
      console.log(initialValue);
      validationSchema = validationSchemaFirstName;
      break;
    case "lastName":
      console.log(initialValue);
      validationSchema = validationSchemaLastName;
      break;
    case "phoneNumber":
      console.log(initialValue);
      validationSchema = validationSchemaPhoneNumber;
      break;
    case "email":
      console.log(initialValue);
      validationSchema = validationSchemaEmail;
      break;
    case "password":
      console.log(initialValue);
      validationSchema = validationSchemaPassword;
      break;
    default:
      console.log(`Sorry, we are out of expressions.`);
  }

  const handleFocusConfirmPass = () => {
    setFocusConfirm(!focusConfirm);
  };

  const handleFocus = () => {
    setFocus(!focus);
  };

  const handleChangePassword = (newPassword) => {
    console.log("changing....", auth.currentUser);
    const user = auth.currentUser;
    updatePassword(user, newPassword)
      .then(() => {
        Alert.alert(`Password changed!`, `Please login again in your account`, [
          {
            text: "Ok",
            onPress: () => {
              signOut(auth)
                .then((re) => {
                  console.log("signedOut");
                  navigation.replace("LoginScreen");
                })
                .catch((error) => {
                  console.log(
                    "error on sign out after password change...",
                    error.message
                  );
                });
            },
            style: "cancel",
          },
        ]);
        console.log("Update successful");
      })
      .catch((error) => {
        console.log("An error ocurred updating pass...", error);
      });
  };

  const handleChangeEmail = async (newEmail) => {
    //Update email in database
    try {
      const posts = query(collectionGroup(db, "Posts"));
      const querySnapshot = await getDocs(posts);
      querySnapshot.forEach((doc) => {
        if (doc.data().user === auth.currentUser.email) {
          usersPosts.push({ ...doc.data(), key: doc.id });
        }
      });
      for (let i = 0; i < usersPosts.length; i++) {
        console.log("usersposts...", usersPosts[i].key);
        const docUpdated = doc(
          db,
          "Users",
          currentUserOnline.uid,
          "Posts",
          usersPosts[i].key
        );
        await updateDoc(docUpdated, {
          user: newEmail,
        });
      }
    } catch (err) {
      console.log(
        "error at updating email in database of posts of user...",
        err
      );
    }

    console.log("SUCCES UPDATING EMAIL IN POSTS OF USER");
    //Update email in authentification
    updateEmail(auth.currentUser, newEmail)
      .then(() => {
        console.log("Email updated!");
      })
      .catch((error) => {
        console.log("An error occurred updating email auth", error);
      });

    Alert.alert(`Email changed!`, `Please login again in your account`, [
      {
        text: "Ok",
        onPress: () => {
          signOut(auth)
            .then((re) => {
              navigation.replace("LoginScreen");
            })
            .catch((error) => {
              console.log(
                "error on sign out after email change...",
                error.message
              );
            });
        },
        style: "cancel",
      },
    ]);
  };

  const handleAddItem = async (values, { resetForm }, file) => {
    if (option.title === "Change password") {
      handleChangePassword(values.password);
      return;
    }
    if (option.title === "Email") {
      const docUpdated = doc(db, "Users", currentUserOnline.uid);
      await updateDoc(docUpdated, {
        [firebaseParam]: values[initialValue],
      });
      handleChangeEmail(values.email);
      return;
    }
    const docUpdated = doc(db, "Users", currentUserOnline.uid);
    await updateDoc(docUpdated, {
      [firebaseParam]: values[initialValue],
    });
    Alert.alert(
      `${option.title} changed!`,
      `Now your ${option.title} will apear in your listings`,
      [
        {
          text: "Ok",
          onPress: () =>
            navigation.navigate("EditProfileScreen", {
              "option.title": values.firstName,
            }),
          style: "cancel",
        },
      ]
    );
  };

  useEffect(() => {
    navigation.setOptions({ headerTitle: option.title });
    setCurrentUserOnline(auth.currentUser);
  }, []);
  return (
    <>
      <Formik
        initialValues={{
          [initialValue]: opt,
        }}
        onSubmit={handleAddItem}
        validationSchema={validationSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.container}>
            <View style={styles.textPlaceHolder}>
              <Text style={styles.txt}>{option.title}</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                onFocus={handleFocus}
                onBlur={handleFocus}
                secureTextEntry={
                  option.title === "Change password" ? true : false
                }
                style={[
                  {
                    height: 45,
                    marginLeft: 16,
                    flex: 1,
                    borderBottomWidth: 1,
                    width: "100%",
                  },
                  {
                    borderBottomColor: !focus ? colors.medium : colors.dark,
                    borderBottomWidth: !focus ? 1 : 2.5,
                  },
                ]}
                placeholder={
                  option.title === "Change password"
                    ? "New password"
                    : option.title
                }
                name={
                  option.title === "Change password"
                    ? "password"
                    : option.firebaseParam
                }
                value={values[initialValue]}
                underlineColorAndroid="transparent"
                onChangeText={handleChange(initialValue)}
                keyboardType={option.title === "Phone number" ? "number" : ""}
              />
            </View>
            <ErrorMessage
              error={
                option.title === "Change password"
                  ? errors["password"]
                  : errors[option.firebaseParam]
              }
              visible={
                option.title === "Change password"
                  ? touched["password"]
                  : touched[option.firebaseParam]
              }
            />
            {option.title === "Change password" && (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    onFocus={handleFocusConfirmPass}
                    onBlur={handleFocusConfirmPass}
                    secureTextEntry
                    style={[
                      {
                        height: 45,
                        marginLeft: 16,
                        flex: 1,
                        borderBottomWidth: 1,
                        width: "100%",
                      },
                      {
                        borderBottomColor: !focusConfirm
                          ? colors.medium
                          : colors.dark,
                        borderBottomWidth: !focusConfirm ? 1 : 2.5,
                      },
                    ]}
                    placeholder="Confirm password"
                    name={confirmPassword}
                    value={option.subtitle}
                    underlineColorAndroid="transparent"
                    onChangeText={handleChange(confirmPassword)}
                  />
                </View>
                <ErrorMessage
                  error={errors["confirmPassword"]}
                  visible={touched["confirmPassword"]}
                />
              </>
            )}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.text}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "80%",
    marginVertical: 20,
  },
  text: {
    color: colors.white,
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  container: {
    flex: 3,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.light,
  },
  containerButton: {
    padding: 10,
    flex: 1,

    alignItems: "flex-end",
    backgroundColor: colors.light,
    flexDirection: "row",
    marginBottom: 20,
  },
  textPlaceHolder: {
    width: "100%",
    fontSize: 20,
    backgroundColor: colors.light,
    height: 17,
    marginTop: 20,
    paddingLeft: 30,
    marginLeft: 20,
  },
  txt: {
    color: colors.dark,
    fontSize: 15,
    fontWeight: "bold",
  },
  inputContainer: {
    backgroundColor: colors.light,
    width: 300,
    height: 45,
    marginTop: 0,
    flexDirection: "column",
    alignItems: "center",
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    flex: 1,
    borderBottomWidth: 1,
  },
  messageInput: {
    borderBottomWidth: 1,
    height: 45,
    marginLeft: 16,
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: "center",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    backgroundColor: colors.light,
  },
  sendButton: {
    marginTop: 30,
    backgroundColor: colors.primary,
    alignContent: "stretch",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
});

export default ProfileEditor;
