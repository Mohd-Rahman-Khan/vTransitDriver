import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState, memo } from "react";
import BottomSheet from "react-native-gesture-bottom-sheet";
import imagePath from "../constants/imagePath";
import colors from "../styles/colors";
import SwipeButton from "rn-swipe-button";
import strings from "../constants/lang";

function SosBottomSheet(props) {
  const swipeThumIcon = () => {
    return (
      <View>
        <Image style={styles.arrowRightIcon} source={imagePath.arrow_right} />
      </View>
    );
  };
  return (
    <BottomSheet ref={props.showSosBottomSheet} height={280}>
      <View style={styles.container}>
        <View style={styles.containerRow}>
          <View style={styles.leftBox}>
            <Text style={styles.areYouInText}>{strings.Are_you_in_an}</Text>
            <Text style={styles.emergencyText}>{strings.Emergency}</Text>
            <Text style={styles.descriptionText}>
              {strings.Sos_Description}
            </Text>
          </View>

          <View style={styles.rightBox}>
            <Image style={styles.warningIcon} source={imagePath.warningIcon} />
          </View>
        </View>

        <View style={styles.swipeButtonContainer}>
          <SwipeButton
            swipeSuccessThreshold={100}
            shouldResetAfterSuccess
            title={strings.RAISE_ALERT}
            enableReverseSwipe={false}
            onSwipeSuccess={() => {
              props.sendSos();
            }}
            railBackgroundColor={colors.SOSSwipeBottonColor1}
            thumbIconBackgroundColor={colors.SOSSwipeBottonColor2}
            railFillBackgroundColor={colors.SOSSwipeBottonColor2}
            thumbIconComponent={swipeThumIcon}
            thumbIconBorderColor={colors.SOSSwipeBottonColor2}
            titleColor={colors.white}
            titleFontSize={20}
            containerStyles={styles.swipeButtonContainerStyle}
            railStyles={styles.swipeButtonRailStyle}
            thumbIconStyles={styles.swipeButtonThumbStyle}
          />
        </View>
      </View>
    </BottomSheet>
  );
}

export default memo(SosBottomSheet);

const styles = StyleSheet.create({
  container: {
    fllex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  containerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftBox: { width: "55%" },
  rightBox: { width: "50%", alignItems: "center" },
  arrowRightIcon: { height: 30, width: 40, tintColor: colors.white },
  areYouInText: { fontSize: 24, color: colors.black, fontWeight: "500" },
  emergencyText: {
    fontSize: 28,
    color: colors.themeColor,
    fontWeight: "bold",
  },
  descriptionText: { marginTop: 20, color: colors.black, fontSize: 12 },
  warningIcon: { height: 100, width: 100 },
  swipeButtonContainer: {
    width: "100%",
    marginTop: 30,
  },
  swipeButtonContainerStyle: {
    width: "100%",
    height: 52,
    borderRadius: 10,
    borderWidth: 0,
  },
  swipeButtonRailStyle: {
    height: 52,
    borderRadius: 10,
    borderColor: colors.SOSSwipeBottonColor2,
  },
  swipeButtonThumbStyle: {
    borderRadius: 10,
    margin: 0,
  },
});
