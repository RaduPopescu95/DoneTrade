import React, { useState } from "react";
import { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as Yup from "yup";
import {
  addDoc,
  collection,
  doc,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getAuth, updatePassword, signOut } from "firebase/auth";
import { Formik, useFormikContext } from "formik";
import { authentication, db, storage } from "../../../firebase";
import {
  Form,
  FormField,
  FormPicker as Picker,
  SubmitButton,
} from "../forms/Form";
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
  // email: Yup.string().required().email().label("Email"),
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

function ProfileEditor({
  // name,
  // width,
  // bgColorContactSeller,
  // defaultValue,
  // ...otherProps
  route,
  navigation,
}) {
  const option = route.params;
  const [focus, setFocus] = useState(false);
  const [focusConfirm, setFocusConfirm] = useState(false);
  const [opt, setOpt] = useState(option.subtitle);
  const [initialValue, setInitialValue] = useState(option.initialValue);
  const [firebaseParam, setFirebaseParam] = useState(option.firebaseParam);
  const [currentUserOnline, setCurrentUserOnline] = useState("");
  const auth = authentication;
  let confirmPassword = "confirmPassword";
  // const { handleSubmit } = useFormikContext();
  // const { setFieldTouched, handleChange, errors, touched } = useFormikContext();

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
                  setIsSignedIn(false);
                  console.log("signedOut");
                  navigation.replace("LoginScreen");
                })
                .catch((error) => {
                  console.log(
                    "error on sign out after password change...",
                    error.message
                  );
                });
              // navigation.navigate("LoginScreen")
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

  const handleAddItem = async (values, { resetForm }, file) => {
    if (option.title === "Change password") {
      console.log("passs....", values.password);
      handleChangePassword(values.password);
      return;
    }
    console.log("EDIT ITEM..", values);
    // const unsub = query(
    //   collection(db, "Users"),
    //   where("owner_uid", "==", userId)
    // );
    const docUpdated = doc(db, "Users", currentUserOnline.email);
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
    // const Titlu = values.title;
    // if (values.images) {
    //   console.log("values images....3", values.images);
    //   setImageUrl(values.images);
    // }
    // console.log("imageUrl...", imageUrl);
    // Add POSTS TO USER
    // try {
    //   const docRef = doc(db, "Users", currentUserOnline.email);
    //   const colRef = collection(docRef, "Posts");
    //   for (let i = 0; i < values.images.length; i++) {
    //     console.log("values images2...", values.images[i]);
    //     const fileName = values.images[i].split("/").pop();
    //     fileNamesArray.push(fileName);
    //   }
    //   console.log("fileNamesArrayNew...", fileNamesArray);
    //   if (fileNamesArray.length > 4) {
    //     Alert.alert(
    //       "Maximum 4 photos allowed for upload!",
    //       `Please delete ${fileNamesArray.length - 4} photos and continue`,
    //       [
    //         {
    //           text: "Ok",
    //           onPress: () => console.log("Ok Pressed"),
    //           style: "cancel",
    //         },
    //       ]
    //     );
    //     return;
    //   }
    //   console.log("returned?...");
    //   addDoc(colRef, {
    //     // image: values.images,
    //     user: currentUserOnline.email,
    //     owner_uid: currentUserOnline.uid,
    //     title: values.title,
    //     price: values.price,
    //     category: values.category,
    //     description: values.description,
    //     createdAt: serverTimestamp(),
    //     likes: 0,
    //     comments: [],
    //     likes_by_users: [],
    //     img_names: fileNamesArray,
    //   });
    //   uploadImage(values.images);
    //   // alert("Success");
    //   resetForm();
    // } catch (err) {
    //   console.log("Could not save the listing", err);
    // }
  };

  useEffect(() => {
    navigation.setOptions({ headerTitle: option.title });
    setCurrentUserOnline(auth.currentUser);
    console.log("options...", option.title);
  }, []);
  return (
    <>
      {/* <Form
        initialValues={{
          title: "",
          price: "",
          description: "",
          category: null,
          images: [],
        }}
        // onSubmit={(values) => console.log(location)}
        onSubmit={handleAddItem}
        // validationSchema={validationSchema}
      > */}
      <Formik
        initialValues={{
          [initialValue]: opt,
        }}
        // onSubmit={(values) => console.log(location)}
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
                secureTextEntry
                style={[
                  {
                    height: 45,
                    marginLeft: 16,
                    // borderBottomColor: colors.secondary,
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
                // name="password"
                value={values[initialValue]}
                // value={opt}
                underlineColorAndroid="transparent"
                // onChangeText={(newText) => setOpt(newText)}
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
                        // borderBottomColor: colors.secondary,
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
            {/* <View style={styles.buttonContainer}> */}
            <TouchableOpacity
              // style={[styles.button, { backgroundColor: colors[color] }]}
              style={styles.button}
              onPress={handleSubmit}
              // title="Submit"
            >
              <Text style={styles.text}>Save</Text>
            </TouchableOpacity>
            {/* </View> */}
          </View>
        )}
        {/* </Form> */}
      </Formik>
      {/* <View style={styles.containerButton}>
      </View> */}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    // alignContent: "flex-end",
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
    // flexWrap: "wrap",
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
    // borderColor: colors.dark,
    backgroundColor: colors.light,
    // borderRadius: 30,
    // borderBottomWidth: 1,

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
    // borderColor: colors.dark,
    backgroundColor: colors.light,
    // borderRadius: 30,
    // borderBottomWidth: 1,
    width: 300,
    height: 45,
    marginTop: 0,
    flexDirection: "column",
    // flex: 1
    alignItems: "center",
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    // borderBottomColor: colors.secondary,
    flex: 1,
    borderBottomWidth: 1,
  },
  messageInput: {
    borderBottomWidth: 1,
    height: 45,
    marginLeft: 16,
    // borderBottomColor: "#FFFFFF",
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: "center",
  },
  buttonContainer: {
    // height: 45,
    // flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    // width: "80%",
    // borderRadius: 30,
    backgroundColor: colors.light,
  },
  sendButton: {
    marginTop: 30,
    backgroundColor: colors.primary,
    alignContent: "stretch",
    // alignSelf: "flex-end",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
});

export default ProfileEditor;
