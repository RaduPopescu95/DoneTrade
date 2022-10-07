import React from "react";
import { useFormikContext } from "formik";

import Picker from "../Picker";
import ErrorMessage from "./ErrorMessage";
import { useEffect } from "react";

function AppFormPicker({
  items,
  name,
  numberOfColumns,
  PickerItemComponent,
  placeholder,
  width,
}) {
  const { errors, setFieldValue, touched, values } = useFormikContext();
  useEffect(() => {
    console.log("valuess...", values.category);
  }, []);
  return (
    <>
      <Picker
        items={items}
        numberOfColumns={numberOfColumns}
        onSelectItem={(item) => setFieldValue(name, item.label)}
        // onSelectItem={(item) => console.log("testitem...", item)}
        PickerItemComponent={PickerItemComponent}
        placeholder={placeholder}
        selectedItem={values.category}
        width={width}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default AppFormPicker;
