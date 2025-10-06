import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import colors from "../styles/colors";
import strings from "../constants/lang";
import {
  height,
  moderateScale,
  textScale,
  width,
} from "../styles/responsiveSize";
import imagePath from "../constants/imagePath";
import fontFamily from "../styles/fontFamily";
import * as Progress from "react-native-progress";
import { findPercentage } from "../utils/utils";

const DashboardCard = ({
  count,
  title,
  icon,
  value,
  totalValue,
  progressColor,
  onPress = () => {},
  showProgressBar,
  ratingCard,
  AverageRatingPerc,
}) => {
  let progress;
  let initialVal = Number(value);
  let totalVal = Number(totalValue);
  let getPercntg = findPercentage(initialVal, totalVal);
  let getRoundPerc = Math.round(getPercntg);
  let getPercntgInDecimal = getRoundPerc / 100;
  let percentage = "";

  if (ratingCard) {
    progress = AverageRatingPerc / 100;
  } else {
    if (isNaN(getPercntgInDecimal)) {
      progress = 0;
    } else {
      let decimalNum = Number(getPercntgInDecimal).toFixed(2);
      progress = decimalNum;
      let getDecimalNum = decimalNum;
      percentage = getDecimalNum * 100;
    }
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
      <View style={styles.cardTopSideContainer}>
        <View style={styles.cardTopLeftSideContainer}>
          <Text style={styles.cardCount}>{count}</Text>
          <Text style={styles.cardHeadingText}>{title}</Text>
        </View>
        <View style={styles.cardTopRightSideContainer}>
          <Image source={icon} style={{ ...styles.cardIconStyle }} />
        </View>
      </View>

      {showProgressBar ? (
        <View style={styles.cardBottomSideContainer}>
          <View>
            <Progress.Bar
              animated={true}
              width={width / 4.8}
              progress={progress}
              color={progressColor}
              unfilledColor={colors.lightGray}
              borderWidth={0}
            />
          </View>
          <View>
            {ratingCard ? (
              <Text style={styles.progressTextStyle}>{AverageRatingPerc}%</Text>
            ) : (
              <Text style={styles.progressTextStyle}>
                {(Math.round(percentage * 100) / 100).toFixed(2)}%
              </Text>
            )}
          </View>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: moderateScale(15),
  },
  cardShadowProp: {
    shadowOffset: { width: 0, height: 0 },
    shadowColor: colors.shadowColor,
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  cardTopSideContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTopLeftSideContainer: {
    flex: 1,
  },
  cardCount: {
    color: colors.black,
    fontSize: textScale(16),
    fontFamily: fontFamily.robotoRegular,
  },
  cardHeadingText: {
    color: colors.gray,
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
  },
  cardTopRightSideContainer: {
    backgroundColor: colors.lightSkyBlueBackground,
    padding: moderateScale(5),
    borderRadius: moderateScale(50),
    width: moderateScale(width / 10),
    height: moderateScale(width / 10),
    alignItems: "center",
    justifyContent: "center",
  },
  cardIconStyle: {
    tintColor: colors.loginColor,
    width: moderateScale(width / 14),
    height: moderateScale(width / 14),
  },
  cardBottomSideContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: moderateScale(10),
    // flex:1
  },
  progressTextStyle: {
    color: colors.gray,
    fontSize: textScale(13),
    fontFamily: fontFamily.robotoMedium,
    marginLeft: moderateScale(5),
  },
});

export default DashboardCard;
