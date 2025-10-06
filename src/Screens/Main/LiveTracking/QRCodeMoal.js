import {
  Image,
  Text,
  View,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  KeyboardEvent,
  Platform,
  TextInput,
} from "react-native";
import React, { memo, useEffect, useState } from "react";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";
//import { styles } from "./styles";
import imagePath from "../../../constants/imagePath";
import colors from "../../../styles/colors";
import BottomSheet from "react-native-gesture-bottom-sheet";
import strings from "../../../constants/lang";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import RBSheet from "react-native-raw-bottom-sheet";
import QRCode from "react-native-qrcode-svg";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../../../styles/responsiveSize";
import fontFamily from "../../../styles/fontFamily";
import TextInputComp from "../../../Components/TextInputComp";
import ButtonComp from "../../../Components/ButtonComp";

function ModalBottomSheet(props) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  var getData = props.data === "" ? "" : props.data.data[0];

  var lastPoint =
    props.data === "" ? "" : getData.stopList[getData.stopList.length - 1];
  var fromAddress =
    props.data === "" ? "" : getData.stopList[0].location.locName;
  var toAddress = getData === "" ? "" : lastPoint.location.locName;
  var arr;

  if (props?.ongoingRideData?.onBoardPassengers) {
    arr = props?.ongoingRideData?.onBoardPassengers?.map((itemD) => {
      return itemD?.empId;
    });
  } else {
    arr = props?.ongoingRideData?.deBoardPassengers?.map((itemD) => {
      return itemD?.empId;
    });
  }

  var qrCodeData = {
    tripId: getData?.id,
    empList: arr,
  };

  var fromPoint;
  var toPoint;

  if (getData?.tripType === "UPTRIP") {
    var fromFullAddress = getData?.stopList[0]?.location?.locName;
    // var parts = fromFullAddress.split(",");
    // var thePart = parts[parts.length - 2];
    // var thePart2 = parts[parts.length - 3];
    // fromPoint = thePart2 + "," + thePart;
    fromPoint = fromFullAddress;
    toPoint =
      getData?.stopList[0]?.onBoardPassengers[0]?.officeName +
      "-" +
      getData?.stopList[0]?.onBoardPassengers[0]?.officeLocation?.locName;
  } else {
    if (getData?.stopList?.length) {
      let getLastStopPoint = getData?.stopList[getData?.stopList?.length - 1];
      var toFullAddress = getLastStopPoint?.location?.locName;
      // var parts = toFullAddress.split(",");
      // var thePart = parts[parts.length - 2];
      // var thePart2 = parts[parts.length - 3];
      toPoint = toFullAddress;
      fromPoint =
        getData?.stopList[0]?.onBoardPassengers[0]?.officeName +
        "-" +
        getData?.stopList[0]?.onBoardPassengers[0]?.officeLocation?.locName;
    }
  }

  useEffect(() => {
    if (props?.ongoingRideData?.onBoardPassengers) {
      let isEscortData = props?.ongoingRideData?.onBoardPassengers?.filter(
        (ele, ind) => {
          return ele?.passType?.toUpperCase()?.trim() === "ESCORT";
        }
      );

      if (
        isEscortData?.[0]?.passType?.toUpperCase()?.trim() === "ESCORT" &&
        isEscortData?.[0]?.status?.toUpperCase()?.trim() === "SCHEDULE"
      ) {
        props?.setIsEscort(true);
      } else if (
        isEscortData?.[0]?.passType?.toUpperCase()?.trim() === "ESCORT" &&
        isEscortData?.[0]?.status?.toUpperCase()?.trim() === "BOARDED"
      ) {
      } else {
        props?.setIsEscort(false);
      }
    } else {
      let isEscortData = props?.ongoingRideData?.deBoardPassengers?.filter(
        (ele, ind) => {
          return ele?.passType?.toUpperCase()?.trim() === "ESCORT";
        }
      );

      if (
        isEscortData?.[0]?.passType?.toUpperCase()?.trim() === "ESCORT" &&
        isEscortData?.[0]?.status?.toUpperCase()?.trim() === "BOARDED"
      ) {
        props?.setIsEscort(true);
      } else {
        props?.setIsEscort(false);
      }
    }
  }, [props]);

  useEffect(() => {
    if (Platform.OS === "ios") {
      function onKeyboardDidShow(e) {
        setKeyboardHeight(e.endCoordinates.height);
      }

      function onKeyboardDidHide() {
        setKeyboardHeight(0);
      }

      const showSubscription = Keyboard.addListener(
        "keyboardDidShow",
        onKeyboardDidShow
      );
      const hideSubscription = Keyboard.addListener(
        "keyboardDidHide",
        onKeyboardDidHide
      );
      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }
  }, []);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.showQrCodeModalPopup}
    >
      <ScrollView
        style={styles.qrCodeModalMainContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <TouchableWithoutFeedback
          onPress={props.closeModal}
          style={styles.qrCodeModalMainContainer}
        >
          <View style={styles.qrCodeBottomModalContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={[
                styles.qrCodeModalContentContainer,
                { marginBottom: keyboardHeight },
              ]}
            >
              {props.showErrorMessage ? (
                <View style={styles.errorMessageContainer}>
                  <Text
                    style={[
                      styles.errorMessageText,
                      { color: props?.errorMessageColor },
                    ]}
                  >
                    {props.errorMessage}
                  </Text>
                </View>
              ) : null}

              <View style={styles.bottomSheetNewRowContainer}>
                {!props?.isEscort ? (
                  <View style={styles.qrCodeAddressContainer}>
                    <View style={{ width: props.showTimer ? "100%" : "100%" }}>
                      <View style={styles.qrCodeAddressContainerRow}>
                        <View style={styles.qrCodeFromPointIndicator}></View>
                        <Text
                          numberOfLines={2}
                          style={styles.qrCodeAddressText}
                        >
                          {fromPoint}
                        </Text>
                      </View>
                      <View style={styles.qrCodeDotInticator}></View>
                      <View style={styles.qrCodeDotInticator}></View>
                      <View style={styles.qrCodeDotInticator}></View>
                      <View style={styles.qrCodeToAddressRow}>
                        <View style={styles.qrCodeToAddressIndicator}></View>
                        <Text
                          style={styles.qrCodeAddressText}
                          numberOfLines={2}
                        >
                          {toPoint}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : null}
                <View style={styles.otpMainContainer}>
                  <View style={styles.otpContainer}>
                    <View>
                      {props?.driverAppSettingData
                        ?.captureAttendanceThroughShortId == "YES" ? (
                        <>
                          {!props?.isEscort ? (
                            <Text style={styles.qrCodeEnterOtpText}>
                              Employee Id{" "}
                            </Text>
                          ) : (
                            <Text style={styles.qrCodeEnterOtpText}>
                              Escort Id{" "}
                            </Text>
                          )}

                          <View
                            style={[
                              {
                                flexDirection: "row",
                                justifyContent: "space-between",
                              },
                            ]}
                          >
                            {/* <TextInput
                              //autoCapitalize={"characters"}
                              style={{ paddingBottom: 10, color: colors.black }}
                              onChangeText={(text) => {
                                props.EmpIdOnChangeNumber(text);
                              }}
                              //value={number}
                              placeholder="Please Enter"
                              //keyboardType="numeric"
                              placeholderTextColor={colors.greyBackgroundColor}
                              maxLength={16}
                            /> */}
                            <View
                              style={[
                                styles.docContainer,
                                {
                                  width: "70%",
                                },
                              ]}
                            >
                              <TextInput
                                //autoCapitalize={"characters"}
                                style={{
                                  paddingBottom: 10,
                                  color: colors.black,
                                }}
                                onChangeText={(text) => {
                                  props.EmpIdOnChangeNumber(text);
                                }}
                                //value={number}
                                placeholder="Please Enter"
                                //keyboardType="numeric"
                                placeholderTextColor={
                                  colors.greyBackgroundColor
                                }
                                maxLength={16}
                              />
                            </View>
                            <TouchableOpacity
                              onPress={props.submitShortId}
                              style={{
                                width: "25%",
                                alignItems: "flex-end",
                              }}
                            >
                              <View
                                style={{
                                  height: 30,
                                  width: 30,
                                  borderRadius: 50,
                                  borderWidth: 1,
                                  borderColor: colors.lightGary,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  source={imagePath.rightAngel}
                                  style={{ height: 25, width: 25 }}
                                  resizeMode="contain"
                                />
                              </View>
                            </TouchableOpacity>
                          </View>
                          {/* <View style={{ marginTop: 10 }}>
                            <ButtonComp
                              btnText={strings.SUBMIT}
                              btnStyle={{
                                paddingVertical: moderateScaleVertical(8),
                                paddingHorizontal: moderateScale(50),
                                borderRadius: moderateScale(10),
                                alignItems: "center",
                                backgroundColor: colors.themeColor,
                              }}
                              btnTextStyle={styles.submitBtnTextStyle}
                              onPress={props.submitShortId}
                            />
                          </View> */}
                        </>
                      ) : (
                        <>
                          <Text style={styles.qrCodeEnterOtpText}>
                            {strings.ENTER_OTP}
                          </Text>
                          <View style={styles.otpTextInputContainer}>
                            <SmoothPinCodeInput
                              cellStyle={[
                                styles.otpCellStyle,
                                { borderColor: props?.inputBoxColor },
                              ]}
                              cellStyleFocused={styles.otpFocusCellStyle}
                              value={props.otpCode}
                              onTextChange={(code) => props.setotpCode(code)}
                              autoFocus={true}
                              keyboardType="phone-pad"
                              containerStyle={styles.otpCodeContainer}
                              textStyle={{
                                color: props.inputBoxColor,
                                fontSize: 24,
                              }}
                            />
                          </View>
                        </>
                      )}
                    </View>
                  </View>
                  <View style={styles.otpImageContainer}>
                    <Image
                      source={imagePath.otp_image}
                      style={styles.otpImageStyle}
                      resizeMode="cover"
                    />
                  </View>
                </View>
              </View>

              {!props?.isEscort ? (
                <>
                  <View style={styles.bottomSheetDividerBox}>
                    <View style={styles.bottomSheetDividerContainer}>
                      <View style={styles.bottomSheetDividerStyle}></View>
                      <View style={styles.orTextContainerStyle}>
                        <Text style={styles.orTextStyle}>{strings.OR}</Text>
                      </View>
                      <View style={styles.bottomSheetDividerStyle}></View>
                    </View>
                  </View>
                  <View style={styles.qrCodeContainer}>
                    <View style={styles.qrImageContainer}>
                      <QRCode size={200} value={JSON.stringify(qrCodeData)} />
                    </View>
                  </View>
                  <View style={styles.bottomSheetNewRowContainer}>
                    <Text style={styles.showQrCodeText}>
                      {strings.SHOOW_QR_CODE}
                    </Text>
                  </View>
                </>
              ) : null}
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </Modal>
  );
}

export default memo(ModalBottomSheet);

const styles = StyleSheet.create({
  qrCodeModalMainContainer: { flex: 1 },
  qrCodeBottomModalContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    flex: 1,
    backgroundColor: colors.modalColor,
  },
  qrCodeModalContentContainer: {
    width: "100%",
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  errorMessageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  // errorMessageText: { color: colors.redColor, fontSize: 16 },
  errorMessageText: {
    color: colors.black,
    fontSize: 16,
    marginTop: 10,
    fontWeight: "500",
  },
  bottomSheetNewRowContainer: { paddingHorizontal: 20, marginTop: 20 },
  qrCodeAddressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  qrCodeAddressContainerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  qrCodeFromPointIndicator: {
    height: 6,
    width: 6,
    backgroundColor: colors.greenColor,
    borderRadius: 10,
  },
  qrCodeAddressText: {
    fontSize: 12,
    marginLeft: 5,
    color: colors.darkGray,
  },
  qrCodeDotInticator: {
    height: 5,
    width: 5,
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    marginVertical: 1,
  },
  qrCodeToAddressRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  qrCodeToAddressIndicator: {
    height: 6,
    width: 6,
    backgroundColor: colors.orangeColor,
    borderRadius: 10,
  },
  otpMainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  otpContainer: { width: "50%" },
  qrCodeEnterOtpText: { color: colors.black },
  otpTextInputContainer: { height: 80 },
  otpCellStyle: {
    borderBottomWidth: 2,
    borderColor: "gray",
    width: 40,
  },
  otpFocusCellStyle: {
    borderColor: "black",
  },
  otpCodeContainer: { width: "100%" },
  otpImageContainer: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  otpImageStyle: { height: 150, width: "90%" },
  bottomSheetDividerContainer: { flexDirection: "row", alignItems: "center" },
  bottomSheetDividerStyle: {
    height: 0.3,
    width: "45%",
    backgroundColor: colors.lightGray,
  },
  orTextContainerStyle: {
    width: "10%",
    height: 35,
    borderWidth: 1,
    borderColor: colors.lightGary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -10,
  },
  orTextStyle: { color: colors.black, fontSize: 12, fontWeight: "bold" },
  qrImageContainer: { justifyContent: "center", alignItems: "center" },
  showQrCodeText: {
    fontSize: 16,
    textAlign: "center",
    color: colors.darkSkyBlue,
    fontWeight: "bold",
    marginTop: -15,
  },
  bottomSheetDividerBox: { paddingHorizontal: 20 },
  qrCodeContainer: { paddingHorizontal: 20, marginTop: 10 },
  docContainer: {
    borderBottomColor: colors.lightGary,
    borderBottomWidth: moderateScale(0.5),
    marginTop: moderateScaleVertical(10),
  },
  editableInputStyle: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    // flex: 1,
    //paddingHorizontal: moderateScale(0),
    paddingVertical: moderateScaleVertical(10),
    //marginLeft: moderateScale(15),
    backgroundColor: "green",
    width: "100%",
  },
  submitBtnStyle: {
    paddingVertical: moderateScaleVertical(8),
    paddingHorizontal: moderateScale(50),
    borderRadius: moderateScale(10),
    alignItems: "center",
    backgroundColor: colors.themeColor,
  },
  submitBtnTextStyle: {
    color: colors.white,
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoMedium,
  },
});
