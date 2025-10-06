import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
} from "react-native";
import React, { memo } from "react";
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

function Header(props) {
  return (
    <View
      style={[
        styles.headerContainer,
        {
          marginTop: props.mapScreen ? moderateScale(height / 15) : 10,
          top: props?.margin ? moderateScale(30) : 0,
        },
      ]}
    >
      <View style={[styles.containerRow]}>
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
        <View style={{ width: props?.title ? "32%" : "0%" }}>
          {props?.title ? (
            <View style={styles.headerTitleRow}>
              <Text style={styles.titleText}>{props?.title}</Text>
              <View style={styles.vaccineIconContainer}>
                <Image
                  source={props.vaccinationIcon}
                  style={styles.vaccineIconStyle}
                />
              </View>
            </View>
          ) : null}
        </View>

        <View
          style={[
            styles.rightIconBox,
            {
              width: props?.title ? "55%" : "85%",
              alignItems: props?.title ? "flex-end" : null,
            },
          ]}
        >
          {props.showSOS ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  width: "80%",
                  paddingVertical: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
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
              <View style={{ width: "20%" }}>
                <TouchableOpacity
                  onPress={props.sosButtonClick}
                  style={styles.rightIconContainer}
                >
                  <Image
                    style={styles.sosIconStyle}
                    source={imagePath.sosIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",

                marginTop: props?.showSOS ? 0 : 10,
              }}
            >
              <View
                style={{
                  width: "80%",
                  paddingVertical: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
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
            </View>
          )}

          {props?.showFilterIcon ? (
            <Dropdown
              style={styles.dropdown}
              renderItem={(item) => (
                <View style={styles.dropdownRennderItemContainer}>
                  <Text style={styles.itemStyle}>{item.label}</Text>
                </View>
              )}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              labelField={null}
              maxHeight={200}
              valueField="value"
              data={props?.filterType}
              value={props?.selectFilterType}
              onChange={(item) => {
                props.setSelectFilterType(item.value);
              }}
              visibleSelectedItem={false}
              renderRightIcon={() => {
                return (
                  <View style={styles.dropdownRightIconContainer}>
                    <Image
                      style={styles.dropdownIconStyle}
                      source={props.filterIcon}
                    />
                  </View>
                );
              }}
            />
          ) : null}
          {props.showSpeedLimit ? (
            <View style={styles.speedLimitContainer}>
              <View style={styles.alignSpeedLimitIconAndText}>
                {props?.speedInKmPerH > props?.speedLimit ? (
                  <View style={styles.speedTextCoontainer}>
                    <Image
                      source={imagePath.warningIcon}
                      style={styles.warningIcon}
                    />
                    <Text style={styles.reduceSpeedText}>
                      {strings.SlowDownText}
                    </Text>
                  </View>
                ) : null}

                <View style={styles.speedLimitIconContainer}>
                  <ImageBackground
                    source={
                      props?.speedInKmPerH > 60
                        ? imagePath.speedLimitRed
                        : imagePath.speedLimitGreen
                    }
                    style={styles.speedLimitIcon}
                  >
                    <Text
                      style={
                        props?.speedInKmPerH > 60
                          ? styles.speedTextRed
                          : styles.speedTextGreen
                      }
                    >
                      {props?.speedInKmPerH.toFixed(1)}
                    </Text>
                    <Text
                      style={
                        props?.speedInKmPerH > 60
                          ? styles.kmPerHourTextStyleRed
                          : styles.kmPerHourTextStyleGreen
                      }
                    >
                      {strings.KMPerH}
                    </Text>
                  </ImageBackground>
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default memo(Header);

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
  containerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    //alignItems: "center",
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
    width: "55%",

    justifyContent: "center",
  },
  titleContainer: {
    width: "32%",
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
  onlineDot: {
    height: 10,
    width: 10,
    borderRadius: 50,

    marginRight: 5,
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
