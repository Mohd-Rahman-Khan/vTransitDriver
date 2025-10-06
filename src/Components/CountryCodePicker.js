import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import CountryPicker, { Flag } from "react-native-country-picker-modal";
import imagePath from "../constants/imagePath";
import colors from "../styles/colors";
import { moderateScale, textScale, width } from "../styles/responsiveSize";
import fontFamily from "../styles/fontFamily";
import CountryFlag from "react-native-country-flag";

const CountryCodePicker = ({
  setCountryCode,
  setCountryFlag,
  countryFlag,
  countryCode,
}) => {
  const [countryName, setCountryName] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const onSelect = (country) => {
    setCountryFlag(country.cca2);

    setCountryCode(`+${country.callingCode[0]}`);
    setCountryName(country);
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <CountryPicker
        onSelect={onSelect}
        countryCode={countryFlag}
        withCallingCode={true}
        withCallingCodeButton={countryCode}
        withFilter={true}
        theme={styles.countryPickerTheme}
        onClose={() => setIsVisible(false)}
        visible={isVisible}
        renderFlagButton={() => {
          return (
            <TouchableOpacity
              onPress={() => setIsVisible(true)}
              style={styles.flagButtonContainer}
            >
              {countryFlag ? (
                <View>
                  <CountryFlag isoCode={countryFlag} size={12} />
                </View>
              ) : null}
              {countryCode !== "+undefined" ? (
                <View style={styles.countryCodeContainer}>
                  <Text style={styles.countryCodeText}>{countryCode}</Text>
                </View>
              ) : null}
              <Image
                source={imagePath.dropdownIcon}
                style={styles.dropdownIconStyle}
              />
            </TouchableOpacity>
          );
        }}
      ></CountryPicker>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.mediumDarkGray,
    borderRadius: moderateScale(5),
    paddingHorizontal: moderateScale(5),
    borderWidth: moderateScale(0.5),
    borderColor: colors.mediumGray,
    marginRight: moderateScale(5),
  },
  flagButtonContainer: { flexDirection: "row", alignItems: "center" },
  countryCodeContainer: {
    alignItems: "center",
    marginHorizontal: moderateScale(5),
  },
  countryCodeText: {
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    fontSize: textScale(10),
  },
  dropdownIconStyle: {
    height: moderateScale(width / 35),
    width: moderateScale(width / 45),
    resizeMode: "contain",
  },
  countryPickerTheme: {
    onBackgroundTextColor: colors?.gray,
    backgroundColor: colors?.white,
  },
});

export default CountryCodePicker;
