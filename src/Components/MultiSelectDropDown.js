import { View, Text } from "react-native";
import React from "react";
import { MultiSelect } from "react-native-element-dropdown";

export default function MultiSelectDropDown(props) {
  return (
    <MultiSelect
      style={props.dropdownStyle}
      placeholderStyle={props.placeholderStyle}
      selectedTextStyle={props.selectedTextStyle}
      iconStyle={props.iconStyle}
      data={props.data}
      labelField={props.labelField}
      valueField={props.valueField}
      //   labelField={"corporateName"}
      //   valueField={"corporateId"}
      placeholder={props.placeholder}
      value={props.value}
      onChange={(item) => {
        props.onChange(item);
      }}
      renderLeftIcon={props.renderLeftIcon}
      selectedStyle={props.selectedStyle}
      renderItem={props.renderItem}
      visibleSelectedItem={true}
      alwaysRenderSelectedItem={true}
    />
  );
}
