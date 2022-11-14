import React, { useEffect, useState } from "react";
import { StyleSheet, Alert } from "react-native";
import * as Yup from "yup";
import { ref, uploadBytes, deleteObject } from "firebase/storage";
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
import {
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import Loader from "../components/Loader";
import UploadScreen from "./UploadScreen";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  price: Yup.number().required().min(1).max(10000).label("Price"),
  description: Yup.string().label("Description"),
  category: Yup.string().required().nullable().label("Category"),
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

function UpdateListingScreen({ route }) {
  const [currentUserOnline, setCurrentUserOnline] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const navigation = useNavigation();
  const auth = authentication;
  let fileNamesArray = [];
  const listing = route.params;

  useEffect(() => {
    setCurrentUserOnline(auth.currentUser);
    setUploadVisible(false);
  }, []);

  const uploadImage = async (images) => {
    setLoading(true);
    for (let i = 0; i < images.length; i++) {
      const fileName = images[i].split("/").pop();
      // const fileType = fileName.split(".").pop();
      const storageRef = ref(
        storage,
        `images/posts/${currentUserOnline.uid}&&${fileName}`
      );
      const img = await fetch(images[i]);
      const bytes = await img.blob();
      await uploadBytes(storageRef, bytes);
    }

    // Delete old photos from storage
    for (let i = 0; i < listing.img_names.length; i++) {
      // Create a reference to the file to delete
      const desertRef = ref(
        storage,
        `images/posts/${currentUserOnline.uid}&&${listing.img_names[i]}`
      );
      // Delete the file
      deleteObject(desertRef)
        .then(() => {
          // File deleted successfully
          console.log("deleted file...");
        })
        .catch((error) => {
          console.log("error deleting file...", error);
          // Uh-oh, an error occurred!
        });
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
    try {
      const docUpdated = doc(
        db,
        "Users",
        auth.currentUser.uid,
        "Posts",
        listing.key
      );
      console.log("start 4");
      const colRef = collection(docUpdated, "Posts");
      for (let i = 0; i < values.images.length; i++) {
        console.log("values images3...", values.images[i]);
        const fileName = values.images[i].split("/").pop();
        fileNamesArray.push(fileName);
      }
      if (fileNamesArray.length > 4) {
        Alert.alert(
          "Maximum 4 photos allowed for upload!",
          `Please delete ${fileNamesArray.length - 4} photos and continue`,
          [
            {
              text: "Ok",
              onPress: () => (fileNamesArray = []),
              style: "cancel",
            },
          ]
        );
        return;
      }
      console.log("returned?...");
      // UPDATE FIELDS IN DOCUMENT
      await updateDoc(docUpdated, {
        title: values.title,
        price: values.price,
        category: values.category,
        description: values.description,
        updatedAt: serverTimestamp(),
        img_names: fileNamesArray,
      });
      uploadImage(values.images);
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
          title: listing.title,
          price: listing.price,
          description: listing.description,
          category: listing.category.label,
          images: listing.img_uri,
        }}
        onSubmit={handleAddItem}
        validationSchema={validationSchema}
      >
        <FormImagePicker name="images" images={listing.img_uri} />
        <FormField maxLength={255} name="title" placeholder={listing.title} />
        <FormField
          keyboardType="numeric"
          maxLength={8}
          name="price"
          placeholder={listing.price}
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
          categoryValue={listing.category}
        />
        <FormField
          maxLength={255}
          multiline
          name="description"
          numberOfLines={3}
          placeholder={listing.description}
        />
        <SubmitButton title="Update Listing" />
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
export default UpdateListingScreen;
