import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import colors from "../styles/colors";

export default function IconTextComp(props) {
  return (
    <View style={styles.iconContainerWidth}>
      <View style={styles.insideIconContainer}>
        <View style={styles.iconContainer}>
          <Image
            source={props.iconImage}
            style={styles.modalIconStyle}
            resizeMode={"contain"}
          />
        </View>
        <View style={styles.iconTextContainer}>
          <Text style={styles.iconText}>{props.text}</Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  iconContainerWidth: { width: "47%" },
  insideIconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  iconContainer: { width: "20%" },
  modalIconStyle: {
    height: 20,
    width: 20,
  },
  iconTextContainer: { width: "75%" },
  iconText: { fontSize: 12, color: colors.black },
});
