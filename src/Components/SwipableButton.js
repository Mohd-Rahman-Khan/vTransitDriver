import { View, Text, Image } from "react-native";
import React from "react";
import SwipeButton from "rn-swipe-button";
import colors from "../styles/colors";

export default function SwipableButton(props) {
  const swipeThumIcon = () => {
    return (
      <View>
        <Image
          style={{ height: 30, width: 40, tintColor: colors.white }}
          source={props.swipeIcon}
        />
      </View>
    );
  };
  return (
    <SwipeButton
      swipeSuccessThreshold={50}
      shouldResetAfterSuccess
      title={props.title}
      enableReverseSwipe={false}
      //onSwipeStart={props.swipeSuccess}
      onSwipeSuccess={props.swipeSuccess}
      railBackgroundColor={colors.greenColor}
      thumbIconBackgroundColor={colors.greenColor2}
      railFillBackgroundColor={colors.greenColor2}
      thumbIconComponent={swipeThumIcon}
      thumbIconBorderColor={colors.greenColor2}
      titleColor={colors.white}
      titleFontSize={20}
      containerStyles={{
        width: "80%",
        height: 52,
        borderRadius: 10,
        borderWidth: 0,
        borderColor: colors.greenColor2,
      }}
      railStyles={{
        height: 52,
        borderRadius: 10,
      }}
      thumbIconStyles={{
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
      }}
    />
  );
}
