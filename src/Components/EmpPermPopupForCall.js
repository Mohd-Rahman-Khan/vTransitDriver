import {
  Image,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { memo } from "react";
import colors from "../styles/colors";
import strings from "../constants/lang";
import { DOC_URL } from "../config/urls";
import imagePath from "../constants/imagePath";
import ButtonComp from "./ButtonComp";
import { moderateScale } from "../styles/responsiveSize";
import fontFamily from "../styles/fontFamily";

function EmpPermPopupForCall(props) {
  return (
    <Modal animationType="fade" transparent={true} visible={props.showModal}>
      <TouchableWithoutFeedback
        //onPress={props.onClose}
        style={styles.mainContainer}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalInsideContainer}
          >
            <View style={styles.empDetailConntainer}>
              <View style={styles.empDetailBox}>
                <View style={styles.empImageBox}>
                  {props?.driverAppSettingData?.canDriverViewEmployeesPhoto ==
                  "YES" ? (
                    props.empDataForCalling?.passType === "EMPLOYEE" ? (
                      props.empDataForCalling?.photo ? (
                        <Image
                          source={{
                            uri: DOC_URL + props.empDataForCalling?.photo,
                          }}
                          style={styles.empImage}
                        />
                      ) : (
                        <Image
                          source={imagePath.userIcon}
                          style={styles.empImage}
                        />
                      )
                    ) : props.empDataForCalling?.photo ? (
                      <Image
                        source={{
                          uri: DOC_URL + props.empDataForCalling?.photo,
                        }}
                        style={styles.empImage}
                      />
                    ) : (
                      <Image
                        source={imagePath.userIcon}
                        style={styles.empImage}
                      />
                    )
                  ) : (
                    <Image
                      source={imagePath.userIcon}
                      style={styles.empImage}
                    />
                  )}
                </View>
                <Text style={styles.empNametext}>
                  {props.empDataForCalling?.name}
                </Text>
                <Text style={styles.empCodetext}>
                  ({props.empDataForCalling?.empCode})
                </Text>
              </View>
              <View style={styles.verticalDevider}></View>
              <View style={styles.empConfirmationBox}>
                <Text style={styles.confirmationText}>
                  {strings.CALL_CONFIRMATION}
                </Text>
                <Text style={styles.confirmationTextDetail}>
                  {strings.CALLING_MESSAGE}
                </Text>
                <View style={styles.confirmationButtonContainer}>
                  <View style={styles.buttonContainer}>
                    <ButtonComp
                      btnText={strings.NO}
                      btnStyle={styles.noButtonStyle}
                      btnTextStyle={styles.noButtonText}
                      onPress={props.onClose}
                    />
                  </View>
                  <View style={styles.emptyButtonContainer}></View>
                  <View style={styles.buttonContainer}>
                    <ButtonComp
                      btnText={strings.YES}
                      btnStyle={styles.yesButtonStyle}
                      btnTextStyle={styles.yesButtonText}
                      onPress={props.callEmp}
                    />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default memo(EmpPermPopupForCall);

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: colors.modalColor,
    paddingHorizontal: 10,
  },
  modalInsideContainer: {
    width: "85%",
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.blueBorderColor,
    borderRadius: 20,
  },
  empDetailConntainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  empDetailBox: {
    width: "35%",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  empConfirmationBox: {
    width: "63%",
    paddingVertical: 20,
    alignItems: "center",
    paddingHorizontal: 5,
  },
  empImageBox: {
    height: 60,
    width: 60,
    borderRadius: 50,
    borderColor: colors.lightBorderColor,
    borderWidth: 2,
  },
  confirmationText: {
    fontSize: 16,
    color: colors.black,
    textAlign: "center",
    fontWeight: "700",
  },
  confirmationTextDetail: {
    fontSize: 13,
    color: colors.black,
    textAlign: "center",
  },
  empImage: {
    height: 58,
    width: 58,
    borderRadius: 50,
  },
  empNametext: {
    fontSize: 17,
    color: colors.black,
    textAlign: "center",
  },
  verticalDevider: {
    height: "100%",
    width: 1,
    backgroundColor: colors.lightGary,
  },
  empCodetext: {
    fontSize: 11,
    color: colors.darkGray,
  },
  confirmationButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "42%",
  },
  noButtonStyle: {
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.greyBackgroundColor,
    paddingVertical: 5,
  },
  noButtonText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fontFamily.robotoMedium,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  yesButtonStyle: {
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.greenColor,
    paddingVertical: 5,
  },
  yesButtonText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fontFamily.robotoMedium,
    textTransform: "uppercase",
    fontWeight: "400",
  },
  emptyButtonContainer: {
    width: "8%",
  },
});
