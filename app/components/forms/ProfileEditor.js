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
  const [opt, setOpt] = useState(option.subtitle);
  // const { setFieldTouched, handleChange, errors, touched } = useFormikContext();

  const handleFocus = () => setFocus(!focus);
  useEffect(() => {
    navigation.setOptions({ headerTitle: option.title });
    console.log("options...", option.title);
  }, []);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text>asdas</Text>
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
              },
              {
                borderBottomColor: !focus ? colors.medium : colors.dark,
                borderBottomWidth: !focus ? 1 : 2,
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
              onFocus={handleFocus}
              onBlur={handleFocus}
              style={[
                {
                  height: 45,
                  marginLeft: 16,
                  // borderBottomColor: colors.secondary,
                  flex: 1,
                  borderBottomWidth: 1,
                },
                {
                  borderBottomColor: !focus ? colors.medium : colors.dark,
                  borderBottomWidth: !focus ? 1 : 2,
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
      {/* <View style={styles.containerButton}>
      </View> */}
    </>
  );
}

const styles = StyleSheet.create({
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
  logo: {
    width: 120,
    height: 120,
    justifyContent: "center",
    marginBottom: 20,
  },
  inputContainer: {
    // borderColor: colors.dark,
    backgroundColor: colors.light,
    // borderRadius: 30,
    // borderBottomWidth: 1,
    width: 300,
    height: 45,
    marginTop: 40,
    flexDirection: "row",
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
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    width: "80%",
    borderRadius: 30,
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
