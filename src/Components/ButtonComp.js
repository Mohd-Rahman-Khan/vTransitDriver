import React from "react";
import { StyleSheet, Text, TouchableOpacity, Image } from "react-native";

const ButtonComp = ({
  onPress = () => {},
  btnStyle = {},
  btnTextStyle = {},
  leftIcon = {},
  iconLeft = {},
  iconStyle = {},
  btnColors = {},
  btnText = "",
  disabled,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{ ...styles.btnStyle, ...btnStyle }}
      onPress={onPress}
      disabled={disabled}
    >
      {iconLeft ? <Image source={leftIcon} style={iconStyle} /> : null}

      <Text style={btnTextStyle}>{btnText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default ButtonComp;
