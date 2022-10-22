import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { useFormikContext } from "formik";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import colors from "../../config/colors";
import { authentication, db, storage } from "../../../firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export default function ProfilePictEdit({
  onSelectProfileUri,
  name,
  img,
  profileImage,
  newImg,
}) {
  const [image, setImage] = useState(null);
  const { errors, setFieldValue, touched, values } = useFormikContext();
  const auth = authentication;

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

    Alert.alert(
      "Profile image change",
      "Are you sure you want to change your profile picture?",
      [
        // {
        //   text: "Choose another image",
        //   onPress: () => addImage(),
        // },
        {
          text: "Keep profile picture",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Change profile picture",
          onPress: () => handleUploadImg(_image),
        },
      ]
    );
  };

  const handleUploadImg = async (img) => {
    if (!img.cancelled) {
      setImage(img.uri);
    }

    console.log("IMAGE......", img.uri);

    // setFieldValue(name, img.uri);

    const desertRef = ref(
      storage,
      `images/profilePict/${auth.currentUser.uid}`
    );
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
        console.log("deleted file...");
      })
      .catch((error) => {
        console.log("error deleting file...", error);
        // Uh-oh, an error occurred!
      });

    console.log("...curentuser", auth.currentUser.uid);
    const storageRef = ref(
      storage,
      `images/profilePict/${auth.currentUser.uid}`
    );

    const image = await fetch(img.uri);

    const bytes = await image.blob();

    await uploadBytes(storageRef, bytes);
    newImg(img.uri);
  };

  useEffect(() => {
    requestPermision();
    // console.log(imgUri);
  }, []);

  return (
    <>
      <View style={imageUploaderStyles.container}>
        {image && (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        )}
        {img && (
          <Image source={{ uri: img }} style={{ width: 200, height: 200 }} />
        )}

        <View style={imageUploaderStyles.uploadBtnContainer}>
          <TouchableOpacity
            onPress={addImage}
            style={imageUploaderStyles.uploadBtn}
          >
            <Text>{img ? "Edit" : "Upload"} Image</Text>
            <AntDesign name="camera" size={20} color="black" />
          </TouchableOpacity>
        </View>
        {/* <View style={imageUploaderStyles.uploadBtnContainer}> */}

        {/* </View> */}
      </View>
    </>
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
  confirmUpload: {
    // borderRadius: 999,

    position: "absolute",

    right: 20,
    bottom: 10,
    // backgroundColor: colors.white,
    // width: 70,
    // height: "30%",
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
