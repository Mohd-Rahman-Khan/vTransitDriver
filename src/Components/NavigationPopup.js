import {
  Image,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import React, { memo } from "react";
import Divider from "./Divider";
import IconTextComp from "./IconTextComp";
import imagePath from "../constants/imagePath";
import ButtonComp from "./ButtonComp";
import colors from "../styles/colors";
import {
  moderateScale,
  moderateScaleVertical,
  height,
  width,
  textScale,
} from "../styles/responsiveSize";
import fontFamily from "../styles/fontFamily";
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

export default function NavigationPopup(props) {
  return (
    <Modal animationType="fade" transparent={true} visible={props.showModal}>
      <TouchableWithoutFeedback
        onPress={props.closeModal}
        style={styles.mainContainer}
      >
        <View style={styles.modalContainer}>
          <View
            // style={{
            //   flex: 1,
            //   marginBottom: props.marginBottom + 50,
            //   justifyContent: "flex-end",
            //   alignItems: "flex-end",
            // }}
            style={[
              styles.modalInsideConntainer,
              {
                marginBottom: props.marginBottom + 50,
              },
            ]}
          >
            <>
              {Platform.OS === "ios" ? (
                <TouchableOpacity
                  onPress={() => {
                    props.appleMapNavigation();
                  }}
                  style={styles.IOSButtonContainer}
                >
                  <Image
                    source={imagePath.apple_map}
                    style={styles.IOSIconStyle}
                  />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={styles.androidIconContainer}
                onPress={() => {
                  props.googleMapRedirection();
                }}
              >
                <Image
                  source={imagePath.google_maps}
                  style={styles.androidIconStyle}
                />
              </TouchableOpacity>
            </>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.modalColor,
    paddingHorizontal: 10,
  },
  IOSButtonContainer: {
    width: moderateScale(width / 10),
    height: moderateScale(width / 10),
    shadowColor: colors.black,
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 50,
    marginBottom: 10,
  },
  IOSIconStyle: {
    width: moderateScale(width / 18),
    height: moderateScale(width / 18),
    marginVertical: 15,
  },
  androidIconContainer: {
    width: moderateScale(width / 10),
    height: moderateScale(width / 10),
    shadowColor: colors.black,
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 50,
    marginBottom: 10,
  },
  androidIconStyle: {
    width: moderateScale(width / 18),
    height: moderateScale(width / 18),
  },
  mainContainer: { flex: 1 },
  modalInsideConntainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
});
