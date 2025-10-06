import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import imagePath from "../constants/imagePath";
import colors from "../styles/colors";
import strings from "../constants/lang";

export default function DefaultMapComp(props) {
  return (
    <RBSheet
      closeOnDragDown={false}
      dragFromTopOnly={true}
      ref={props.showDefaultButton}
      height={160}
      openDuration={250}
      customStyles={styles.bottomSheetContainer}
    >
      <View>
        <Text style={styles.selectMapText}>{strings.Select_Default_Map}</Text>
        <View style={styles.mapListContainer}>
          {Platform.OS === "ios" ? (
            <TouchableOpacity
              style={styles.appleMapContainer}
              onPress={() => {
                props.setDefaultMap("appleMap");
              }}
            >
              <Image source={imagePath.apple_map} style={styles.appleMapIcon} />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={() => {
              props.setDefaultMap("googleMap");
            }}
            style={styles.googleMapContainer}
          >
            <Image
              source={imagePath.google_maps}
              style={styles.googleMapIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </RBSheet>
  );
}
const styles = StyleSheet.create({
  bottomSheetContainer: {
    container: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 10,
    },
  },
  selectMapText: { textAlign: "center", color: colors.black, fontSize: 18 },
  mapListContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  appleMapContainer: {
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.lightBorderColor,
    padding: 5,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  appleMapIcon: { height: 55, width: 55 },
  googleMapContainer: {
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.lightBorderColor,
    padding: 5,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  googleMapIcon: { height: 55, width: 55, marginHorizontal: 20 },
});
