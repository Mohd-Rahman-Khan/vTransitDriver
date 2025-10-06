import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { Marker } from "react-native-maps";

export default function LiveMapMarker({ lat, long, icon, onPress = () => {} }) {
  return (
    <Marker
      onPress={onPress}
      coordinate={{
        latitude: Number(lat),
        longitude: Number(long),
      }}
    >
      <Image source={icon} style={styles.markerIcon} resizeMode={"contain"} />
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerIcon: { height: 35, width: 35 },
});
