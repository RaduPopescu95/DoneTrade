import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useFormikContext } from "formik";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";

export default function ProfilePictPicker({ onSelectProfileUri, name }) {
  const [image, setImage] = useState(null);
  const { errors, setFieldValue, touched, values } = useFormikContext();

  const requestPermision = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) alert("You need to enable permission to access the library");
  };

  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    // console.log(JSON.stringify(_image));
    // const result = JSON.stringify(_image);
    // console.log("REZULTAT ----", _image);
    // onSelectProfileUri(result.uri);

    if (!_image.cancelled) {
      setImage(_image.uri);
    }
    console.log("IMAGE......", _image.uri);
    // const imgUris = values[name];
    // console.log(imgUris);
    setFieldValue(name, _image.uri);
  };

  useEffect(() => {
    requestPermision();
    // console.log(imgUri);
  }, []);

  return (
    <View style={imageUploaderStyles.container}>
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}

      <View style={imageUploaderStyles.uploadBtnContainer}>
        <TouchableOpacity
          onPress={addImage}
          style={imageUploaderStyles.uploadBtn}
        >
          <Text>{image ? "Edit" : "Upload"} Image</Text>
          <AntDesign name="camera" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const imageUploaderStyles = StyleSheet.create({
  container: {
    alignSelf: "center",
    elevation: 2,
    height: 200,
    width: 200,
    backgroundColor: "#efefef",
    position: "relative",
    borderRadius: 999,
    overflow: "hidden",
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "lightgrey",
    width: "100%",
    height: "30%",
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
