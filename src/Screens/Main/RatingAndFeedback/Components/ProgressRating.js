import { View, Text } from "react-native";
import React from "react";
import RatingProgressBarComp from "./RatingProgressBarComp";
import colors from "../../../../styles/colors";

export default function ProgressRating(props) {
  return (
    <View>
      <RatingProgressBarComp
        color={colors.rating_1}
        title="Excellent"
        value={props.data?.Excellent}
        totalReview={props?.totalReview}
      />
      <RatingProgressBarComp
        color={colors.rating_2}
        title="Good"
        value={props.data?.Good}
        totalReview={props?.totalReview}
      />
      <RatingProgressBarComp
        color={colors.rating_3}
        title="Average"
        value={props.data?.Average}
        totalReview={props?.totalReview}
      />
      <RatingProgressBarComp
        color={colors.rating_4}
        title="Below Average"
        value={props.data?.BelowAverage}
        totalReview={props?.totalReview}
      />
      <RatingProgressBarComp
        color={colors.rating_5}
        title="Poor"
        value={props.data?.Poor}
        totalReview={props?.totalReview}
      />
    </View>
  );
}
