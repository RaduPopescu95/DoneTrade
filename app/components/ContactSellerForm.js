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

import { Form, FormField, SubmitButton } from "./forms";
import styles from "../config/styles";
import colors from "../config/colors";
import { ErrorMessage } from "./forms";
// import messagesApi from "../api/messages";

function ContactSellerForm({ listing }) {
  const [border, setBorder] = useState(colors.dark);
  // const { setFieldTouched, handleChange, errors, touched } = useFormikContext();

  const handleSubmit = async ({ message }, { resetForm }) => {
    Keyboard.dismiss();
  };

  const validationSchema = Yup.object().shape({
    message: Yup.string().required().min(1).label("Message"),
  });
  return (
    // <View style={style.contactContainer}>
    <View>
      <Formik
        initialValues={{ message: "" }}
        onSubmit={handleSubmit}
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
              name="Message"
              onChangeText={handleChange("Message")}
              onBlur={handleBlur("Message")}
            />
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
