import { StyleSheet } from "react-native";
import React from "react";
import { AirbnbRating } from "react-native-ratings";
import strings from "../constants/lang";
import colors from "../styles/colors";
import { textScale } from "../styles/responsiveSize";

const AirbnbRatingComp = ({
  handleRating = () => {},
  rating,
  color,
  empStatus,
  driverAppSettingData,
}) => {
  return (
    <AirbnbRating
      isDisabled={
        empStatus === "ABSENT" ||
        empStatus === "CANCLED" ||
        empStatus === "NOSHOW" ||
        empStatus === "SKIPPED" ||
        driverAppSettingData?.allowDriverToRateEmp != "YES"
          ? true
          : false
      }
      starContainerStyle={styles.starContainerStyle}
      ratingContainerStyle={styles.ratingContainerStyle}
      reviews={[
        `${strings.BAD}`,
        `${strings.OK}`,
        `${strings.GOOD}`,
        `${strings.VERY_GOOD}`,
        `${strings.AMAZING}`,
      ]}
      reviewColor={color}
      reviewSize={textScale(12)}
      ratingCount={5}
      defaultRating={
        empStatus === "ABSENT" ||
        empStatus === "CANCLED" ||
        empStatus === "NOSHOW" ||
        empStatus === "SKIPPED" ||
        driverAppSettingData?.allowDriverToRateEmp != "YES"
          ? 0
          : rating
      }
      selectedColor={color}
      size={15}
      onFinishRating={(rating) => handleRating(rating)}
    />
  );
};

const styles = StyleSheet.create({
  starContainerStyle: {
    flexDirection: "row",
  },
  ratingContainerStyle: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: -8,
    paddingHorizontal: 20,
  },
});

export default AirbnbRatingComp;
