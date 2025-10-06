import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  Platform,
} from "react-native";
import React from "react";
import imagePath from "../constants/imagePath";
import colors from "../styles/colors";
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from "../styles/responsiveSize";
import { Dropdown } from "react-native-element-dropdown";
import fontFamily from "../styles/fontFamily";
import strings from "../constants/lang";

export default function HomeHeader(props) {
  return (
    <View
      style={[
        styles.headerContainer,
        {
          marginTop: props.mapScreen ? moderateScale(height / 15) : 10,
          top: props?.margin
            ? Platform.OS === "android"
              ? moderateScale(20)
              : moderateScale(40)
            : 0,
        },
      ]}
    >
      <View style={styles.containerRow}>
        <View style={styles.drawerIconContainer}>
          <TouchableOpacity
            onPress={() => props.navigation.openDrawer()}
            style={styles.leftIconContainer}
          >
            <Image
              source={imagePath.menuIcon}
              style={styles.menuIconStyle}
              resizeMode={"contain"}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          {/* <View
            style={[
              styles.onlineDot,
              {
                backgroundColor:
                  props?.driverStatus == "offline"
                    ? colors.redColor
                    : colors.greenColor,
              },
            ]}
          ></View>
          <Text style={styles.statusText}>
            {`You are ${props?.driverStatus}`}{" "}
          </Text> */}
        </View>

        <TouchableOpacity
          onPress={props.rightIconPress}
          style={styles.rightIconBox}
        >
          {props?.driverStatus == "online" ? (
            <Image
              style={styles.onlineoflineIcon}
              source={imagePath.offlineIcon}
            />
          ) : (
            <Image
              style={styles.onlineoflineIcon}
              source={imagePath.onlineIcoon}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignSelf: "center",
    margin: 10,
    borderRadius: 5,
    position: "absolute",
    width: "100%",

    paddingHorizontal: 10,
    marginTop: height / 15,
  },
  statusText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "500",
  },
  onlineoflineIcon: {
    height: 40,
    width: 40,
  },
  containerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: colors.white,
    // paddingHorizontal: 10,
    // paddingVertical: 5,
    // borderRadius: 5,
  },
  leftIconContainer: {
    height: 40,
    width: 40,
    backgroundColor: colors.white,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      android: { elevation: 0.5 },
      ios: {
        shadowColor: colors.shadowColor,
        shadowOpacity: 0.5,
        shadowRadius: 6,
        shadowOffset: {
          height: 2,
          width: 2,
        },
      },
    }),
  },
  menuIconStyle: { width: 20, height: 20, tintColor: "black" },
  rightIconContainer: {
    height: 50,
    width: 50,
    backgroundColor: colors.white,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",

    ...Platform.select({
      android: { elevation: 0.5 },
      ios: {
        shadowColor: colors.shadowColor,
        shadowOpacity: 0.5,
        shadowRadius: 6,
        shadowOffset: {
          height: 2,
          width: 2,
        },
      },
    }),
  },
  sosIconStyle: { height: 30, width: 30 },
  speedLimitContainer: {
    width: "100%",
    // marginTop: 10,
    alignItems: "flex-end",
  },
  speedLimitIconContainer: {
    height: 70,
    width: 70,
    borderRadius: 50,
    marginTop: 5,
  },
  speedTextCoontainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingHorizontal: 2,
    paddingVertical: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.redColor,
    marginTop: 2,
  },
  warningIcon: {
    height: 20,
    width: 20,
  },
  reduceSpeedText: {
    fontSize: 10,
  },
  alignSpeedLimitIconAndText: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: -6,
  },

  speedLimitIcon: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  kmPerHourTextStyleRed: { fontSize: 10, color: colors.redColor },
  kmPerHourTextStyleGreen: { fontSize: 10, color: colors.greenColor },
  speedTextRed: { fontSize: 12, color: colors.redColor },
  speedTextGreen: { fontSize: 12, color: colors.greenColor },
  drawerIconContainer: {
    width: "13%",
  },
  rightIconBox: {
    width: "13%",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  titleContainer: {
    width: "72%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  onlineDot: {
    height: 10,
    width: 10,
    borderRadius: 50,

    marginRight: 5,
  },
  titleText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: "400",
  },
  dropdown: {
    backgroundColor: "transparent",
    borderRadius: moderateScale(8),
    maxWidth: moderateScale(width / 2.9),
    minWidth: moderateScale(width / 2.9),
    //marginTop: 20,
    borderColor: colors.white,
    borderWidth: 1,
  },
  itemStyle: {
    // flex: 1,
    fontSize: textScale(10),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    marginLeft: moderateScale(8),
    marginVertical: moderateScaleVertical(5),
    marginLeft: moderateScale(10),
  },
  placeholderStyle: {
    fontSize: textScale(9),
    fontFamily: fontFamily.robotoMedium,
    color: "transparent",
    marginLeft: moderateScale(8),
    textAlign: "center",
  },
  selectedTextStyle: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoMedium,
    color: "transparent",
    marginLeft: moderateScale(4),
    textAlign: "center",
  },
  headerTitleRow: { flexDirection: "row", alignItems: "center" },
  vaccineIconContainer: {
    height: 30,
    width: 30,
    borderWidth: 0.5,
    borderColor: colors.lightBackground,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  vaccineIconStyle: { height: 20, width: 20 },
  dropdownRennderItemContainer: {
    marginVertical: moderateScaleVertical(5),
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownRightIconContainer: {
    height: 35,
    width: 40,
    borderWidth: 0.5,
    borderColor: colors.lightBackground,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownIconStyle: { height: 16, width: 16 },
});
