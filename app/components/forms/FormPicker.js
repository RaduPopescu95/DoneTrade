import React from "react";
import { useFormikContext } from "formik";
import { useEffect } from "react";

import Picker from "../Picker";
import ErrorMessage from "./ErrorMessage";

function AppFormPicker({
  items,
  name,
  numberOfColumns,
  PickerItemComponent,
  placeholder,
  width,
  categoryValue,
}) {
  const { errors, setFieldValue, touched, values } = useFormikContext();

  useEffect(() => {}, []);
  return (
    <>
      <Picker
        items={items}
        numberOfColumns={numberOfColumns}
        onSelectItem={(item) => setFieldValue(name, item.label)}
        PickerItemComponent={PickerItemComponent}
        placeholder={placeholder}
        selectedItem={values.category}
        categoryValue={categoryValue}
        width={width}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default AppFormPicker;
