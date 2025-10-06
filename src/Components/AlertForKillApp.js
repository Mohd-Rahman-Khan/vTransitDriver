import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import React from "react";
import ButtonComp from "./ButtonComp";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";
import colors from "../styles/colors";
import strings from "../constants/lang";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../styles/responsiveSize";
import fontFamily from "../styles/fontFamily";

export default function AlertForKillApp(props) {
  return (
    <Modal animationType="fade" transparent={true} visible={props.isVisible}>
      <TouchableWithoutFeedback style={{ flex: 1 }}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalInsideContainer}
          >
            <View>
              <Text style={styles.verifyOTPText}>
                This Device is rooted. Please uninstall the root application.
              </Text>
            </View>

            <View
              style={{
                alignItems: "center",
                paddingHorizontal: 20,
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={styles.laterButtonStyle}
                activeOpacity={0.7}
                onPress={props.closeModal}
              >
                <Text style={{ fontSize: textScale(14), color: colors.black }}>
                  {" "}
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: colors.themeColor,
  },
  modalInsideContainer: {
    // height: "32%",
    width: "80%",
    backgroundColor: colors.white,
    // borderWidth: 3,
    // borderColor: colors.blueBorderColor,
    borderRadius: 20,
    paddingVertical: 20,
  },
  cellStyle: {
    borderBottomColor: colors.darkBlue,
    borderBottomWidth: moderateScale(3),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: moderateScaleVertical(10),
  },
  textStyle: {
    fontSize: textScale(18),
    fontFamily: fontFamily.robotoRegular,
    color: colors.darkBlue,
  },
  buttonRowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  TripModalbuttonContainer: { width: "40%" },
  laterButtonStyle: {
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.greyBackgroundColor,
    paddingVertical: 5,
    paddingHorizontal: 30,
  },
  laterButtonText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: fontFamily.robotoMedium,
    textTransform: "uppercase",
  },
  acceptButtonStyle: {
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.themeColor,
  },
  acceptButtonText: {
    color: colors.themeColor,
    fontSize: 12,
    fontFamily: fontFamily.robotoMedium,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  verifyOTPText: {
    textAlign: "center",
    fontSize: 18,
    color: colors.black,
    fontWeight: "400",
  },
});
