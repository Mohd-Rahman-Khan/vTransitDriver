import { View, Text, TextInput, StyleSheet, Image } from "react-native";
import React from "react";
import colors from "../styles/colors";
import {
  moderateScaleVertical,
  textScale,
  moderateScale,
  width,
  verticalScale,
} from "../styles/responsiveSize";
import fontFamily from "../styles/fontFamily";
import { TouchableOpacity } from "react-native-gesture-handler";
import imagePath from "../constants/imagePath";

const TextInputComp = ({
  inputContainerStyle = {},
  placeholder = "",
  inputStyle = {},
  onChangeText = () => {},
  lable = "",
  icon = "",
  rightIcon,
  keyboardType,
  rightIconClick = () => {},
  disabled,
  ...props
}) => {
  return (
    <View style={{ ...styles.inputContainerStyle, ...inputContainerStyle }}>
      <View style={[styles.textInputContainer]}>
        <View
          style={{ width: "70%", flexDirection: "row", alignItems: "center" }}
        >
          <Image source={icon} style={styles.iconStyle} resizeMode="contain" />
          <TextInput
            keyboardType={keyboardType}
            placeholder={placeholder}
            style={{ ...styles.inputStyle, ...inputStyle }}
            placeholderTextColor={colors.mediumGray}
            onChangeText={onChangeText}
            // onFocus={isEnabled}
            {...props}
            //multiline={multiline}
          />
        </View>
        <View
          style={{
            width: "30%",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          {rightIcon ? (
            <TouchableOpacity onPress={rightIconClick} disabled={disabled ? true  : false}>
              <Image
                resizeMode="contain"
                style={{
                  height: moderateScale(width / 22),
                  width: moderateScale(width / 22),
                  tintColor:disabled ? colors.mediumGray : colors.black

                }}
                source={rightIcon}
                
              />
            </TouchableOpacity>
          ) : null}

          {props?.showRightButton ? (
            <TouchableOpacity
              onPress={() => {
                if (props.rightButtunText === "Verify") {
                  props.rightButtonClick();
                }
              }}
              style={
                props.rightButtunText === "Verified"
                  ? styles.verifiedButtonStyle
                  : styles.verifyButtonStyle
              }
            >
              {props.rightButtunText === "Verified" ? (
                <Image
                  style={{ height: 15, width: 15 }}
                  source={imagePath.check_mark_circle}
                />
              ) : (
                // <Text
                //   style={
                //     props.rightButtunText === 'Verified'
                //       ? styles.verifiedText
                //       : styles.verifyText
                //   }>
                //   {props.rightButtunText}
                // </Text>
                <Image
                  style={{ height: 15, width: 15 }}
                  source={imagePath.pending}
                />
              )}
            </TouchableOpacity>
          ) : null}
          {props.isMendotery ? (
            <Text
              style={{
                color: colors.darkRed,
                fontSize: 16,
                marginLeft: 2,
                //marginRight: -8,
              }}
            >
              *
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: 'green',
    //borderBottomWidth: moderateScale(0.5),s
    //borderBottomColor:colors.lightGary
  },

  textInputLabel: {
    color: colors.black,
    fontSize: textScale(14),
    marginTop: moderateScaleVertical(10),
    //fontFamily: fontFamily.robotoLight,
  },
  iconStyle: {
    width: moderateScale(width / 22),
    height: moderateScaleVertical(width / 18),
  },
  verifiedText: {
    color: colors.greenColor,
    fontWeight: "500",
    fontSize: 14,
  },
  verifyText: {
    color: colors.darkRed,
    fontWeight: "500",
    fontSize: 14,
  },
  verifiedButtonStyle: {
    borderColor: colors.greenColor,
    //borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifyButtonStyle: {
    //borderColor: colors.darkRed,
    // borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
  },
});
export default TextInputComp;
