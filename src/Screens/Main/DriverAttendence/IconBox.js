import { View, Text, Image } from "react-native";
import React from "react";
import colors from "../../../styles/colors";

export default function IconBox({ title, icon, value, tintColor, isThisDays }) {
  return (
    <View style={{ flexDirection: "row", width: "32%" }}>
      <Image
        source={icon}
        resizeMode="contain"
        style={{
          height: 35,
          width: 35,
          tintColor: tintColor ? tintColor : null,
        }}
      />
      <View style={{ marginLeft: 5 }}>
        {value == "Infinity" || value == "-" || value == "NaN" ? (
          <Text
            style={{
              fontSize: 18,
              color: colors.black,
              fontWeight: "500",
            }}
          >
            {value ? value : "--"}
          </Text>
        ) : isThisDays ? (
          <Text
            style={{
              fontSize: 18,
              color: colors.black,
              fontWeight: "500",
            }}
          >
            {value}
          </Text>
        ) : (
          <Text
            style={{
              fontSize: 18,
              color: colors.black,
              fontWeight: "500",
            }}
          >
            {value ? value.toFixed(2) : "--"}
          </Text>
        )}
        <Text style={{ fontSize: 11, color: colors.gray }}>{title}</Text>
      </View>
    </View>
  );
}
