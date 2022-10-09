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
import colors from "../../config/colors";

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
  // const { setFieldTouched, handleChange, errors, touched } = useFormikContext();

  const handleFocusConfirmPass = () => {
    setFocusConfirm(!focusConfirm);
  };

  const handleFocus = () => {
    setFocus(!focus);
  };
  useEffect(() => {
    navigation.setOptions({ headerTitle: option.title });
    console.log("options...", option.title);
  }, []);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.textPlaceHolder}>
          <Text style={styles.txt}>{option.title}</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            onFocus={handleFocus}
            onBlur={handleFocus}
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
              option.title === "Change password" ? "New password" : option.title
            }
            value={opt}
            underlineColorAndroid="transparent"
            onChangeText={(newText) => setOpt(newText)}
          />
        </View>
        {option.title === "Change password" && (
          <View style={styles.inputContainer}>
            <TextInput
              onFocus={handleFocusConfirmPass}
              onBlur={handleFocusConfirmPass}
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
              value={option.subtitle}
              underlineColorAndroid="transparent"
              // onChangeText={(password) => this.setState({ password })}
            />
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          // style={[styles.button, { backgroundColor: colors[color] }]}
          style={styles.button}
          // onPress={onPress}
        >
          <Text style={styles.text}>Save</Text>
        </TouchableOpacity>
      </View>
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
