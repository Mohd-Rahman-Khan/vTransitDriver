import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
} from "react-native";
import React, { useState } from "react";
import colors from "../styles/colors";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from "../styles/responsiveSize";
import fontFamily from "../styles/fontFamily";

const DocInput = ({
  docName = "",
  docIcon,
  onPress = () => {},
  rightIcon = "",
  checkBoxData,
  isMendotery,
  multiCheckbox,
  value,
  toggleButton,
  disabled 
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  return (
    <View style={styles.docContainer}>
      {multiCheckbox ? (
        <>
          <View style={styles.leftIconContainer}>
            <Image
              source={docIcon}
              style={styles.iconStyle}
              resizeMode="contain"
            />
          </View>
          <View style={styles.middleContainer}>
            <View style={styles.middleContainerRow}>
              <View style={styles.docNameContainer}>
                <Text style={styles.docName} numberOfLines={2}>
                  {docName}
                </Text>
              </View>
              <Switch
              disabled={disabled ? true  : false}
                onTintColor={colors.darkBlue}
                trackColor={{ false: colors.lightGary, true: colors.skyBlue }}
                onValueChange={toggleButton}
                value={value === "Yes" || value === "YES" ? true : false}
              />
            </View>
          </View>
        </>
      ) : (
        <TouchableOpacity
        disabled={disabled ? true  : false}

          activeOpacity={0.7}
          onPress={onPress}
          style={styles.rightContainer}
        >
          <View style={styles.rightContainerRow}>
            <Image
              source={docIcon}
              style={styles.iconStyle}
              resizeMode="contain"
            />
            <Text style={[styles.docName,{color: disabled ?  colors.mediumGray :  colors.black,}]} numberOfLines={1}>
              {docName}
            </Text>
          </View>
          <View style={styles.mendeteryIconContainer}>
            <Text style={styles.checkBoxText}>{checkBoxData}</Text>
            <Image style={styles.checkboxStyle} source={rightIcon} />
            {isMendotery ? (
              <Text style={styles.mendetryIconStyle}>*</Text>
            ) : null}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  docContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    borderBottomColor: colors.lightGary,
    borderBottomWidth: moderateScale(0.3),
    paddingVertical: moderateScaleVertical(10),
    marginTop: moderateScaleVertical(20),
  },

  iconStyle: {
    width: moderateScale(width / 20),
    height: moderateScaleVertical(width / 20),
  },
  docName: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color:  colors.black,
    flex: 0.8,
    marginHorizontal: 10,
  },
  checkboxStyle: {
    height: 20,
    width: 20,
  },
  leftIconContainer: { width: "10%" },
  middleContainer: {
    width: "90%",
    justifyContent: "center",
  },
  middleContainerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  docNameContainer: { width: "65%" },
  rightContainer: { flexDirection: "row", alignItems: "center" },
  rightContainerRow: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
  },
  mendeteryIconContainer: {
    width: "20%",
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
  },
  checkBoxText: { marginRight: -20, color: "grey", fontWeight: "500" },
  mendetryIconStyle: {
    color: colors.darkRed,
    fontSize: 16,
    marginTop: 5,
  },
});

export default DocInput;
