import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import imagePath from "../../../constants/imagePath";
import { styles } from "./style";
import colors from "../../../styles/colors";

export default function TripDetailRow(props) {
  return (
    <View>
      <View style={styles.detailRow}>
        <Image
          resizeMode="contain"
          source={props.icon}
          style={styles.iconStyle}
        />
        {props.isItLink ? (
          <TouchableOpacity
            onPress={props.onPress}
            style={styles.tollContainer}
          >
            <View style={styles.linkTextContainer}>
              <Text
                style={[
                  styles.iconTextStyle,
                  {
                    color: props.linkColor ? props.linkColor : colors.blueColor,
                  },
                ]}
              >
                {props.iconText}
              </Text>
            </View>
            <View style={styles.amountAndStatusContainer}>
              <Text
                style={[
                  styles.iconTextStyle,
                  {
                    color: props?.linkColor,
                  },
                ]}
              >
                {props?.taxAmount}
              </Text>
              <Image style={styles.tollStatusIcon} source={props?.statusIcon} />
            </View>
          </TouchableOpacity>
        ) : (
          <View>
            <Text style={styles.iconTextStyle}>{props.iconText}</Text>
            {props?.vehicleNumber ? (
              <Text style={styles.iconTextStyle}>
                Vehicle Number - {props.vehicleNumber}
              </Text>
            ) : null}
            {props?.vehicleSticker ? (
              <Text style={styles.iconTextStyle}>
                Vehicle Sticker - {props.vehicleSticker}
              </Text>
            ) : null}
          </View>
        )}
      </View>
      <View style={styles.divier}></View>
    </View>
  );
}
