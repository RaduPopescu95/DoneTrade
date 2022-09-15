import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  View,
  StyleSheet,
  ImageBackground,
  TextInput,
  Text,
} from "react-native";
import { Formik } from "formik";
import { Notifications } from "expo";
import * as Yup from "yup";
import { useFormikContext } from "formik";
import { sendSignInLinkToEmail, signOut } from "firebase/auth";
import { authentication, db, storage } from "../../firebase";
import { ref, getDownloadURL } from "firebase/storage";
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

import { Form, FormField, SubmitButton } from "./forms";
import styles from "../config/styles";
import colors from "../config/colors";
import { ErrorMessage } from "./forms";
// import messagesApi from "../api/messages";

function ContactSellerForm({ listing, toUser, toUserName }) {
  const [border, setBorder] = useState(colors.dark);
  const auth = authentication;
  // const { setFieldTouched, handleChange, errors, touched } = useFormikContext();

  const validationSchema = Yup.object().shape({
    message: Yup.string().required().min(1).label("Message"),
  });

  const handleAddItem = async (values, file) => {
    console.log("ADD ITEM...img", listing.img_uri);
    const userId = auth.currentUser.uid;
    const currentUserOnline = auth.currentUser;
    // console.log("currentUserOnline...", currentUserOnline);
    const unsub = query(
      collection(db, "Users"),
      where("owner_uid", "==", userId)
    );
    // console.log("unsub...", unsub);
    const docUpdated = doc(db, "Users", currentUserOnline.email);
    // console.log("docUpdated...", docUpdated);
    const mess = values.message;
    // if (values.images) {
    //   console.log(values.images);
    //   setImageUrl(values.images);
    // }
    // // Add POSTS TO USER
    try {
      console.log("STEP 1", currentUserOnline.email);
      const docRef = doc(db, "Users", currentUserOnline.email);
      console.log("step 2");
      const colRef = collection(docRef, "Messages");
      console.log("step 3...");
      const fileName = listing.img_uri.split(/[/%?]+/);
      console.log("fileName...", fileName[10]);
      addDoc(colRef, {
        user: currentUserOnline.email,
        // owner_uid: currentUserOnline.uid,
        message: values.message,
        touser: toUser,
        toUserName: toUserName,
        sentAt: serverTimestamp(),
        user_img: fileName[10],
      });
      // uploadImage(values.images[0]);
      // alert("Success");
      console.log("STEP 4....");
    } catch (err) {
      // alert("Could not save the listing", err);
    }
  };

  const tell = () => {
    console.log("telling.....");
  };

  return (
    // <View style={style.contactContainer}>
    <View>
      <Formik
        initialValues={{ message: "" }}
        onSubmit={handleAddItem}
        validationSchema={validationSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isValid,
        }) => (
          <>
            <TextInput
              placeholderTextColor="text"
              // style={defaultStyles.text}
              style={[style.text, { borderColor: border }]}
              onFocus={() => setBorder(colors.secondary)}
              blurOnSubmit
              multiline
              numberOfLines={4}
              placeholder="Message..."
              keyboardType="text"
              name="message"
              onChangeText={handleChange("message")}
              onBlur={handleBlur("message")}
            />
            {/* <FormField
              maxLength={255}
              multiline
              name="message"
              numberOfLines={3}
              placeholder="Description"
            /> */}
            {/* <ErrorMessage error={errors.email} /> */}

            {errors.message && (
              <Text style={style.error}>{errors.message}</Text>
            )}
            <SubmitButton title="Contact Seller" />
          </>
        )}
      </Formik>
      {/* </ImageBackground> */}
    </View>
  );
}

const style = StyleSheet.create({
  error: { color: "red" },
  text: {
    color: colors.dark,
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    width: 300,
    height: 95,
    borderWidth: 1,
    borderColor: colors.light,
    backgroundColor: colors.light,
    borderRadius: 5,
    margin: 10,
  },
  contactContainer: {
    height: "100%",
    backgroundColor: "blue",
    width: "100%",
    flex: 1,
    // alignItems: "ce",
    justifyContent: "flex-end",
    position: "absolute",
  },
  background: {
    height: "100%",
    width: "100%",
    top: 150,
    position: "absolute",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default ContactSellerForm;
