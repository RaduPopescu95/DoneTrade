import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Image,
  Text,
  ActivityIndicator,
} from "react-native";

import { authentication } from "../../firebase";

import Button from "../components/Button";
import Loader from "../components/Loader";

function WelcomeScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const auth = authentication;
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("AppNavigator");
      } else setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <ImageBackground
      blurRadius={10}
      // style={styles.background}
      style={[
        styles.background,
        { justifyContent: isLoading ? "center" : "flex-end" },
      ]}
      source={require("../assets/background.jpg")}
    >
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("../assets/logo-red.png")} />
        <Text style={styles.tagline}>Sell What You Don't Need</Text>
      </View>
      {isLoading ? (
        // <ActivityIndicator animating={isLoading} size="large" />
        <Loader visible={isLoading} />
      ) : (
        <View style={styles.buttonsContainer}>
          <Button
            title="Login"
            onPress={() => navigation.navigate("LoginScreen")}
          />
          <Button
            title="Register"
            color="secondary"
            onPress={() => navigation.navigate("RegisterScreen")}
          />
          <Button
            title="Continue as guest"
            color="secondary"
            onPress={() => navigation.navigate("AppNavigator")}
          />
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonsContainer: {
    padding: 20,
    width: "100%",
  },
  logo: {
    width: 100,
    height: 100,
  },
  logoContainer: {
    position: "absolute",
    top: 70,
    alignItems: "center",
  },
  tagline: {
    fontSize: 25,
    fontWeight: "600",
    paddingVertical: 20,
  },
});

export default WelcomeScreen;
