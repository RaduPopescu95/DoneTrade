import React, { useEffect, useState } from "react";
import { StyleSheet, Image, Alert, TouchableOpacity, Text } from "react-native";
import * as Yup from "yup";
import Screen from "../components/Screen";
import { Form, FormField, SubmitButton } from "../components/forms";
import colors from "../config/colors";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { authentication, db } from "../../firebase";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen(props) {
  const navigation = useNavigation();
  const auth = authentication;
  const handleSubmit = async (values) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredentials) => {
        navigation.navigate("AppNavigator");
      })
      .catch((error) => {
        Alert.alert(
          "Could Not Log In",
          "Your email or password is incorect or there is no existing user with this account. Please try again or register for an accout",
          [
            {
              text: "Try Again",
              onPress: () => console.log("Try Again pressed"),
              style: "cancel",
            },
            {
              text: "Register",
              onPress: () => navigation.push("RegisterScreen"),
            },
          ]
        );
        console.log(error);
      });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("AppNavigator");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <Screen style={styles.container}>
      <Image style={styles.logo} source={require("../assets/logo-red.png")} />

      <Form
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
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
          icon="lock"
          name="password"
          placeholder="Password"
          secureTextEntry
          textContentType="password"
        />
        <SubmitButton title="Login" />
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("RegisterScreen")}
        >
          <Text style={styles.text}>Register for an account</Text>
        </TouchableOpacity>
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "transparent",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    width: "100%",
    // marginVertical: 0,
  },
  text: {
    color: colors.dark,
    fontSize: 15,
    textDecorationLine: "underline",
  },
  container: {
    padding: 10,
    backgroundColor: colors.light,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
});

export default LoginScreen;
