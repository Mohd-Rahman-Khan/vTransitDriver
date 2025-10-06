import {
  View,
  Text,
  Animated,
  Image,
  PanResponder,
  StyleSheet,
  ImageBackground,
} from "react-native";
import React, { useRef } from "react";
import colors from "../styles/colors";
import imagePath from "../constants/imagePath";
import { TouchableOpacity } from "react-native-gesture-handler";
import Draggable from "react-native-draggable";

export default function DraggableButton(props) {
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;
  return (
    // <Animated.View
    //   style={{
    //     transform: [{ translateX: pan.x }, { translateY: pan.y }],
    //     position: "absolute",
    //     marginTop: 150,
    //     marginLeft: 20,
    //   }}
    //   {...panResponder.panHandlers}
    // >
    //   <TouchableOpacity
    //     activeOpacity={0.7}
    //     onPress={props.onPress}
    //     style={styles.dragButtonContainer}
    //   >
    //     <ImageBackground
    //       resizeMode="contain"
    //       style={styles.dragIconStyle}
    //       source={imagePath.trip_notification_icon}
    //     />
    //   </TouchableOpacity>
    // </Animated.View>
    <Draggable
      onPressIn={props.onPressIn}
      imageSource={imagePath.trip_notification_icon}
      renderSize={60}
      x={10}
      y={50}
      z={100}
      minX={10}
      minY={50}
      // maxX={-10}
      // maxY={-50}
      // onShortPressRelease={() => {
      //   setshowTripModal(true);
      // }}
      onShortPressRelease={props.onShortPressRelease}
      // onRelease={() => {
      //   setmapdraggable(true);
      // }}
      onRelease={props.onRelease}
    />
  );
}

const styles = StyleSheet.create({
  dragButtonContainer: {
    height: 50,
    width: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  dragIconStyle: { height: "100%", width: "100%" },
});
