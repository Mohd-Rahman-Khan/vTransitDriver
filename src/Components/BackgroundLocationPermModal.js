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
import strings from "../constants/lang";
const moment = extendMoment(Moment);

function BackgroundLocationPermModal(props) {
  return (
    <Modal animationType="fade" transparent={true} visible={props.showModal}>
      <TouchableWithoutFeedback
        onPress={props.closeModal}
        style={styles.mainConntainer}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalInsideContainer}
          >
            <Text style={styles.alertDescriptionText}>
              {strings.Backgrounnd_Location_Perm_Text}
            </Text>
            <View style={styles.buttonRowContainer}>
              <View style={styles.TripModalbuttonContainer}>
                <ButtonComp
                  btnText={strings.Go_To_Setting}
                  btnStyle={styles.acceptButtonStyle}
                  btnTextStyle={styles.acceptButtonText}
                  onPress={() => {
                    props.goToSettint();
                  }}
                />
              </View>
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
    backgroundColor: colors.modalColor,
    paddingHorizontal: 10,
  },
  mainConntainer: {
    flex: 1,
  },
  modalInsideContainer: {
    //height: "32%",
    width: "85%",
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.blueBorderColor,
    borderRadius: 20,
    paddingVertical: 20,
  },

  newRow: { marginVertical: 10 },
  mainIconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f4f4f4",
    paddingBottom: 10,
    paddingTop: 10,
    //borderStyle: 'dotted',
  },
  buttonRowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  TripModalbuttonContainer: { width: "40%" },
  laterButtonStyle: {
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.greyBackgroundColor,
    paddingVertical: 10,
  },
  laterButtonText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: fontFamily.robotoMedium,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  acceptButtonStyle: {
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.greenColor,
    paddingVertical: 10,
  },
  acceptButtonText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: fontFamily.robotoMedium,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  alertDescriptionText: { color: colors.black, textAlign: "center" },
});

export default memo(BackgroundLocationPermModal);
