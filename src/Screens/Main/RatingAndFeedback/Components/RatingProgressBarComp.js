import { View, Text } from "react-native";
import React from "react";
import * as Progress from "react-native-progress";
import { styles } from "../style";
import colors from "../../../../styles/colors";
import { findPercentage } from "../../../../utils/utils";

export default function RatingProgressBarComp(props) {
  let initialVal = props?.value;
  let totalVal = props?.totalReview;
  let getPercntg = findPercentage(initialVal, totalVal);
  let getRoundPerc = Math.round(getPercntg);
  let getPercntgInDecimal = getRoundPerc / 100;
  return (
    <View style={styles.progressBarRow}>
      <View style={styles.progressBarTitleContainer}>
        <Text style={styles.progressBarTitleStyle}>{props.title}</Text>
      </View>
      <View style={styles.progressBarIconContainer}>
        <Progress.Bar
          unfilledColor={colors.lightGrayBG}
          progress={getPercntgInDecimal ? getPercntgInDecimal : 0}
          color={props.color}
          width={null}
          borderWidth={0}
        />
      </View>
      <View style={styles.progressBarNumberContainer}>
        <Text style={styles.progressBarNumberTextStyle}>{props.value}</Text>
      </View>
    </View>
  );
}
