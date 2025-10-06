import {
  Image,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { memo } from "react";
import imagePath from "../../../constants/imagePath";
import colors from "../../../styles/colors";
import { moderateScale } from "../../../styles/responsiveSize";
import fontFamily from "../../../styles/fontFamily";
import ButtonComp from "../../../Components/ButtonComp";

function ConfirmLocationModal(props) {
  return (
    <Modal animationType="fade" transparent={true} visible={props.showModal}>
      <TouchableWithoutFeedback
        onPress={props.closeModal}
        style={styles.mainContainer}
      >
        <View style={styles.modalContainer}>
          <View
            style={{
              height: 80,
              width: 80,
              backgroundColor: colors.white,
              zIndex: 100,
              marginTop: -10,
              borderRadius: 50,
              padding: 10,
            }}
          >
            <View
              style={{
                borderRadius: 50,
                borderWidth: 3,
                borderColor: colors.lightBlue,
                justifyContent: "center",
                alignItems: "center",
                height: 60,
                width: 60,
              }}
            >
              <Image
                source={imagePath.nodleIcon}
                style={{ height: 40, width: 40 }}
              />
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalInsideContainer}
          >
            <View
              style={{
                marginTop: 30,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={{ fontSize: 22, fontWeight: "500", color: colors.black }}
              >
                Confirm Your Location
              </Text>
              {props?.address ? (
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: "center",
                    marginTop: 10,
                    color: colors.black,
                  }}
                >
                  {props?.address}
                </Text>
              ) : (
                <ActivityIndicator color={colors.gray} size={"small"} />
              )}

              <Text
                style={{
                  fontSize: 14,
                  textAlign: "center",
                  marginTop: 10,
                  color: colors.black,
                }}
              >
                Is this your current location? Kindly confirm your location
                before punch in/punch out.
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <View style={{ width: "45%" }}>
                  <ButtonComp
                    btnText="No"
                    btnStyle={styles.laterButtonStyle}
                    btnTextStyle={styles.laterButtonText}
                    onPress={props.closeModal}
                  />
                </View>
                <View style={{ width: "6%" }}></View>
                <View style={{ width: "45%" }}>
                  <ButtonComp
                    disabled={props?.isButtonDisable}
                    btnText="Yes"
                    btnStyle={
                      props?.isButtonDisable
                        ? styles.laterButtonStyle
                        : styles.acceptButtonStyle
                    }
                    btnTextStyle={styles.acceptButtonText}
                    onPress={props.onAccept}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

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
    borderRadius: 20,
    paddingVertical: 20,
    marginTop: -40,
    justifyContent: "center",
    alignItems: "center",
  },
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
    backgroundColor: colors.themeColor,
    paddingVertical: 10,
  },
  acceptButtonText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: fontFamily.robotoMedium,
    textTransform: "uppercase",
    fontWeight: "400",
  },
});

export default memo(ConfirmLocationModal);
