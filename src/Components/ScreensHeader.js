import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React from "react";
import imagePath from "../constants/imagePath";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from "../styles/responsiveSize";
import colors from "../styles/colors";
import navigationStrings from "../navigation/navigationStrings";
import fontFamily from "../styles/fontFamily";
import { Dropdown } from "react-native-element-dropdown";

export default function ScreensHeader({
  navigation,
  title,
  data,
  infoIconClick = () => {},
  showRightIcon,
  showDropDown,
  filterType,
  selectFilterType,
  setSelectFilterType = (item) => {},
  filterIcon,
}) {
  return (
    <View style={styles.topContainer}>
      <View
        style={{ ...styles.bgImageStyle, backgroundColor: colors.themeColor }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.headerContainer}>
            <View style={styles.backButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  if (data) {
                    navigation.navigate(navigationStrings.STATES, {
                      navigationData: data,
                    });
                  } else {
                    navigation.goBack();
                  }
                }}
              >
                <Image
                  source={imagePath.backArrowIcon}
                  style={{
                    height: 30,
                    width: 30,
                  }}
                />
              </TouchableOpacity>
              <Text style={styles.headerTitleText}>{title}</Text>
            </View>
          </View>
          {showRightIcon ? (
            showDropDown ? (
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
                data={filterType}
                value={selectFilterType}
                onChange={(item) => {
                  setSelectFilterType(item.value);
                }}
                visibleSelectedItem={false}
                renderRightIcon={() => {
                  return (
                    <View style={styles.dropdownRightIconContainer}>
                      <Image
                        style={styles.dropdownIconStyle}
                        source={filterIcon}
                      />
                    </View>
                  );
                }}
              />
            ) : (
              <TouchableOpacity
                style={{ marginRight: 20, marginTop: 20 }}
                onPress={infoIconClick}
              >
                <Image
                  source={imagePath.informationIcon}
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: colors.white,
                    //marginTop: 20,
                  }}
                />
              </TouchableOpacity>
            )
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: { height: 150 },
  bgImageStyle: {
    height: "100%",
    width: "100%",
    backgroundColor: colors.themeColor,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    //marginTop: 20,
  },
  backArrowIcon: {
    // width: moderateScale(width / 16),
    // height: moderateScale(width / 16),
    height: 30,
    width: 30,
  },
  headerTitleText: {
    color: colors.white,
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  dropdown: {
    borderRadius: moderateScale(8),
    maxWidth: moderateScale(width / 2.9),
    minWidth: moderateScale(width / 2.9),
    marginRight: 10,
  },
  dropdownRennderItemContainer: {
    marginVertical: moderateScaleVertical(5),
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownRightIconContainer: {
    height: 35,
    width: 40,
    borderWidth: 0.5,
    borderColor: colors.white,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownIconStyle: { height: 16, width: 16, tintColor: colors.white },
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
});
