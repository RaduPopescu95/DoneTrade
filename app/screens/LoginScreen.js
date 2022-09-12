import React, { useEffect, useState } from "react";
import { StyleSheet, Image, Button, Alert } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import { Form, FormField, SubmitButton } from "../components/forms";
import colors from "../config/colors";
import * as firebase from "../../firebase";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { authentication, db } from "../../firebase";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen(props) {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  const navigation = useNavigation();
  const auth = authentication;

  const handleSubmit = async (values) => {
    // console.log(values);
    console.log("---------------------------");

    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Success");
        setIsSignedIn(true);
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

  // error => {
  //    switch (error.code) {
  //       case 'auth/email-already-in-use':
  //         console.log(`Email address ${this.state.email} already in use.`);
  //         break;
  //       case 'auth/invalid-email':
  //         console.log(`Email address ${this.state.email} is invalid.`);
  //         break;
  //       case 'auth/operation-not-allowed':
  //         console.log(`Error during sign up.`);
  //         break;
  //       case 'auth/weak-password':
  //         console.log('Password is not strong enough. Add additional characters including special characters and numbers.');
  //         break;
  //       default:
  //         console.log(error.message);
  //         break;
  //     }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("AppNavigator");
      }
    });
    return unsubscribe;
  }, []);

  // const handleSignUp = () => {
  //   auth
  //     .createUserWithEmailAndPassword(email, password)
  //     .then((userCredentials) => {
  //       const user = userCredentials.user;
  //       console.log(user.email);
  //     })
  //     .catch((error) => alert(error.message));
  // };

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
        <Button
          title="Register"
          onPress={() => navigation.navigate("RegisterScreen")}
        />
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
