import React, { useEffect, useState } from "react";
import { StyleSheet, Alert } from "react-native";
import * as Yup from "yup";
import useLocation from "../hooks/useLocation";
import { ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import LottieView from "lottie-react-native";

import {
  Form,
  FormField,
  FormPicker as Picker,
  SubmitButton,
} from "../components/forms";
import CategoryPickerItem from "../components/CategoryPickerItem";
import Screen from "../components/Screen";
import FormImagePicker from "../components/forms/FormImagePicker";
import colors from "../config/colors";
import { authentication, db, storage } from "../../firebase";
// import { db } from "../firebase";
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
import { useNavigation } from "@react-navigation/native";
import Loader from "../components/Loader";
import UploadScreen from "./UploadScreen";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  price: Yup.number().required().min(1).max(10000).label("Price"),
  description: Yup.string().label("Description"),
  category: Yup.object().required().nullable().label("Category"),
  images: Yup.array()
    .min(1, "Please select at least one image.")
    .label("Images"),
});

const categories = [
  {
    backgroundColor: "#fc5c65",
    icon: "floor-lamp",
    label: "Furniture",
    value: 1,
  },
  {
    backgroundColor: "#fd9644",
    icon: "car",
    label: "Cars",
    value: 2,
  },
  {
    backgroundColor: "#fed330",
    icon: "camera",
    label: "Cameras",
    value: 3,
  },
  {
    backgroundColor: "#26de81",
    icon: "cards",
    label: "Games",
    value: 4,
  },
  {
    backgroundColor: "#2bcbba",
    icon: "shoe-heel",
    label: "Clothing",
    value: 5,
  },
  {
    backgroundColor: "#45aaf2",
    icon: "basketball",
    label: "Sports",
    value: 6,
  },
  {
    backgroundColor: "#4b7bec",
    icon: "headphones",
    label: "Movies & Music",
    value: 7,
  },
  {
    backgroundColor: "#a55eea",
    icon: "book-open-variant",
    label: "Books",
    value: 8,
  },
  {
    backgroundColor: "#778ca3",
    icon: "application",
    label: "Other",
    value: 9,
  },
];

function ListingEditScreen() {
  const [signedIn, setSignedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [currentUserOnline, setCurrentUserOnline] = useState("");
  const [imageUrl, setImageUrl] = useState([]);
  const [imageAsFile, setImageAsFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileNames, setFileNames] = useState([]);
  const location = useLocation();
  const navigation = useNavigation();
  const auth = authentication;
  const allInputs = { imgUrl: "" };
  const fileNamesArray = [];

  // const db = firebase.firestore

  useEffect(() => {
    console.log("useEffect for edit started");

    setCurrentUserOnline(auth.currentUser);

    const collectionIds = currentUserOnline;
    setUploadVisible(false);
    // console.log(collectionIds.email);
    // setLoading(false);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // console.log(user.uid);
        setSignedIn(true);
        setUserId(user.uid);
      } else setSignedIn(false);
    });
  }, []);

  const uploadImage = async (images) => {
    setLoading(true);
    for (let i = 0; i < images.length; i++) {
      console.log("values images2...", images[i]);
      const fileName = images[i].split("/").pop();
      const fileType = fileName.split(".").pop();
      const storageRef = ref(
        storage,
        `images/${currentUserOnline.email}/posts/${fileName}`
      );
      console.log("img...No");
      const img = await fetch(images[i]);
      console.log("img...Yes");
      const bytes = await img.blob();
      // console.log("bytes...", JSON.stringify(bytes));
      await uploadBytes(storageRef, bytes);
    }
    setLoading(false);
    setUploadVisible(true);
    if (!uploadVisible) {
      setUploadVisible(true);
      setTimeout(function () {
        navigation.goBack();
      }, 1500);
    }

    setUploadVisible(false);
  };

  const handleAddItem = async (values, { resetForm }, file) => {
    // console.log("ADD ITEM..", values);
    const unsub = query(
      collection(db, "Users"),
      where("owner_uid", "==", userId)
    );
    const docUpdated = doc(db, "Users", currentUserOnline.email);
    const Titlu = values.title;

    if (values.images) {
      console.log("values images....3", values.images);
      setImageUrl(values.images);
    }
    console.log("imageUrl...", imageUrl);
    // Add POSTS TO USER
    try {
      const docRef = doc(db, "Users", currentUserOnline.email);
      const colRef = collection(docRef, "Posts");
      for (let i = 0; i < values.images.length; i++) {
        console.log("values images2...", values.images[i]);
        const fileName = values.images[i].split("/").pop();
        fileNamesArray.push(fileName);
      }
      console.log("fileNamesArrayNew...", fileNamesArray);

      if (fileNamesArray.length > 4) {
        Alert.alert(
          "Maximum 4 photos allowed for upload!",
          `Please delete ${fileNamesArray.length - 4} photos and continue`,
          [
            {
              text: "Ok",
              onPress: () => console.log("Ok Pressed"),
              style: "cancel",
            },
          ]
        );
        return;
      }
      console.log("returned?...");
      addDoc(colRef, {
        // image: values.images,
        user: currentUserOnline.email,
        owner_uid: currentUserOnline.uid,
        title: values.title,
        price: values.price,
        category: values.category,
        description: values.description,
        createdAt: serverTimestamp(),
        likes: 0,
        comments: [],
        likes_by_users: [],
        img_names: fileNamesArray,
      });
      uploadImage(values.images);
      //   // alert("Success");
      //   resetForm();
    } catch (err) {
      console.log("Could not save the listing", err);
    }
  };

  return (
    <Screen style={styles.container}>
      <Loader visible={loading} />
      <UploadScreen visible={uploadVisible} />

      <Form
        initialValues={{
          title: "",
          price: "",
          description: "",
          category: null,
          images: [],
        }}
        // onSubmit={(values) => console.log(location)}
        onSubmit={handleAddItem}
        validationSchema={validationSchema}
      >
        <FormImagePicker name="images" />
        <FormField maxLength={255} name="title" placeholder="Title" />
        <FormField
          keyboardType="numeric"
          maxLength={8}
          name="price"
          placeholder="Price"
          width={120}
          defaultValue={0}
        />
        <Picker
          items={categories}
          name="category"
          numberOfColumns={3}
          PickerItemComponent={CategoryPickerItem}
          placeholder="Category"
          width="50%"
        />
        <FormField
          maxLength={255}
          multiline
          name="description"
          numberOfLines={3}
          placeholder="Description"
        />
        <SubmitButton title="Post" />
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.light,
  },
});
export default ListingEditScreen;
