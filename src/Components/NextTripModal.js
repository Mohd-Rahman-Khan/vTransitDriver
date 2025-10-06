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

function NextTripModal(props) {
  var data = props.data;

  var lastPoint = data === "" ? "" : data.stopList[data.stopList.length - 1];
  var fromAddress = data === "" ? "" : data.stopList[0].location.locName;
  var toAddress = lastPoint === "" ? "" : lastPoint.location.locName;

  var fromPoint;
  var toPoint;

  if (data?.tripType === "UPTRIP") {
    var fromFullAddress = data?.stopList[0]?.location?.locName;

    fromPoint = fromFullAddress;
    toPoint =
      data?.stopList[0]?.onBoardPassengers[0]?.officeName +
      "-" +
      data?.stopList[0]?.onBoardPassengers[0]?.officeLocation?.locName;
  } else {
    if (data?.stopList?.length) {
      let getLastStopPoint = data?.stopList[data?.stopList?.length - 1];
      var toFullAddress = getLastStopPoint?.location?.locName;

      toPoint = toFullAddress;

      fromPoint =
        data?.stopList[0]?.onBoardPassengers[0]?.officeName +
        "-" +
        data?.stopList[0]?.onBoardPassengers[0]?.officeLocation?.locName;
    }
  }
  return (
    <Modal animationType="fade" transparent={true} visible={props.showModal}>
      <TouchableWithoutFeedback
        onPress={props.closeModal}
        style={styles.mainContainer}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.modalInsideContainer,
              {
                borderColor:
                  data.numberOfFemalePassengers > 0 ||
                  data?.escortTrip === "YES"
                    ? colors.pinkColor
                    : colors.blueBorderColor,
                //backgroundColor: colors.lightPinkColor,
                backgroundColor:
                  data.numberOfFemalePassengers > 0 ||
                  data?.escortTrip === "YES"
                    ? colors.lightPinkColor
                    : colors.white,
              },
            ]}
          >
            <View style={styles.rowStyle}>
              <View style={styles.dateTimeContainer}>
                <View style={styles.timeContainer}>
                  {data.tripType === "UPTRIP" ? (
                    <Image
                      source={imagePath.uptripIcon}
                      style={styles.userIconStyle}
                      resizeMode={"contain"}
                    />
                  ) : (
                    <Image
                      source={imagePath.downtripIcon}
                      style={styles.userIconStyle}
                      resizeMode={"contain"}
                    />
                  )}

                  {data === "" ? null : (
                    <Text style={styles.timeText}>
                      {data?.stopList[0]?.onBoardPassengers[0]?.shiftTime}
                    </Text>
                  )}
                </View>
                <View
                  style={[
                    styles.dateContainer,
                    {
                      backgroundColor:
                        data.numberOfFemalePassengers > 0 ||
                        data?.escortTrip === "YES"
                          ? colors.pinkColor
                          : "#0b698c",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.dateContainer,
                      {
                        backgroundColor:
                          data.numberOfFemalePassengers > 0 ||
                          data?.escortTrip === "YES"
                            ? colors.pinkColor
                            : "#0b698c",
                      },
                    ]}
                  >
                    <Text style={styles.dateText}>
                      {moment(data.date).format("Do MMM")}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.fromToContainer}>
                <View style={styles.fromAddressContainer}>
                  <View style={styles.toAddressIndicator}></View>
                  <Text numberOfLines={3} style={styles.addressText}>
                    {fromPoint}
                  </Text>
                </View>
                <View style={styles.dotIndicator}></View>
                <View style={styles.dotIndicator}></View>
                <View style={styles.dotIndicator}></View>
                <View style={styles.toAddressContainer}>
                  <View style={styles.fromAddressIndicator}></View>
                  <Text style={styles.addressText} numberOfLines={3}>
                    {toPoint}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: "40%" }}></View>
              <View style={{ width: "60%", flexDirection: "row" }}>
                {data?.escortTrip === "YES" ? (
                  <Image
                    resizeMode="contain"
                    style={{ height: 18, width: 18, marginTop: 10 }}
                    source={imagePath.escort}
                  />
                ) : null}

                {data.numberOfFemalePassengers > 0 ? (
                  <Image
                    resizeMode="contain"
                    style={{
                      height: 18,
                      width: 18,
                      marginTop: 10,
                      marginLeft: 5,
                    }}
                    source={imagePath.female}
                  />
                ) : null}
              </View>
            </View>

            <View style={styles.newRow}>
              <View style={styles.devider}></View>
            </View>

            <View style={[styles.mainIconContainer]}>
              <IconTextComp
                iconImage={
                  data?.tripCategory === "ADHOCTRIP"
                    ? imagePath.adhocBlackIcon
                    : imagePath.ID_icon
                }
                text={data.tripCode}
              />
              <IconTextComp
                iconImage={imagePath.group_icon}
                text={props?.totalEmpCount}
              />
            </View>

            <View style={styles.mainIconContainer}>
              {data?.tripCategory === "ADHOCTRIP" ? null : (
                <IconTextComp
                  //iconImage={imagePath.morning_icon}
                  iconImage={
                    Number(
                      data?.stopList[0]?.onBoardPassengers[0]?.shiftTime.split(
                        ":"
                      )?.[0]
                    ) >= 18
                      ? imagePath.night
                      : Number(
                          data?.stopList[0]?.onBoardPassengers[0]?.shiftTime.split(
                            ":"
                          )?.[0]
                        ) < 18 &&
                        Number(
                          data?.stopList[0]?.onBoardPassengers[0]?.shiftTime.split(
                            ":"
                          )?.[0]
                        ) >= 12
                      ? imagePath?.afternoonIcon
                      : imagePath?.morning
                  }
                  text={data?.shiftName}
                />
              )}

              {data?.escortTrip === "YES" || data?.escortTrip === "Yes" ? (
                <IconTextComp
                  iconImage={imagePath.Guard_icon}
                  text={data?.escortName}
                />
              ) : null}
            </View>

            <View style={[styles.mainIconContainer]}>
              <IconTextComp
                iconImage={imagePath.policeVrification_date}
                text={data.corporateName}
              />
              <IconTextComp
                iconImage={imagePath.vendor}
                text={data?.vendorName}
              />
            </View>

            <View style={styles.buttonRowContainer}>
              <View style={styles.TripModalbuttonContainer}>
                <ButtonComp
                  btnText={strings.Later}
                  btnStyle={styles.laterButtonStyle}
                  btnTextStyle={styles.laterButtonText}
                  onPress={() => {
                    props.onDecline(data.id, data.vehicleId);
                  }}
                />
              </View>
              <View style={styles.seperater}></View>
              <View style={styles.TripModalbuttonContainer}>
                <ButtonComp
                  btnText={strings.Accept}
                  btnStyle={{
                    borderRadius: moderateScale(20),
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor:
                      data.numberOfFemalePassengers > 0 ||
                      data?.escortTrip === "YES"
                        ? colors.pinkColor
                        : colors.greenColor,
                    paddingVertical: 10,
                  }}
                  btnTextStyle={styles.acceptButtonText}
                  onPress={() => {
                    props.onAccept(data.id);
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
  modalInsideContainer: {
    //height: "32%",
    width: "85%",
    borderWidth: 3,
    borderRadius: 20,
    paddingVertical: 20,
  },
  rowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    //marginTop: 15,
  },
  dateTimeContainer: {
    width: "35%",
  },
  timeContainer: {
    flexDirection: "row",
    //justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: colors.lightBorderColor,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingTop: 8,
  },
  userIconStyle: {
    height: 20,
    width: 20,
    //tintColor: colors.darkGrey,
  },
  timeText: {
    fontSize: 18,
    color: colors.black,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  dateContainer: {
    width: "100%",
    height: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  dateText: { color: colors.white, fontSize: 12 },
  fromToContainer: { width: "60%" },
  fromAddressContainer: {
    flexDirection: "row",
    alignItems: "center",
    //marginBottom: 1,
  },
  toAddressIndicator: {
    height: 6,
    width: 6,
    backgroundColor: colors.greenColor,
    borderRadius: 10,
  },
  addressText: { fontSize: 10, marginLeft: 5, color: colors.black },
  dotIndicator: {
    height: 5,
    width: 5,
    backgroundColor: colors.lightGray,
    // marginLeft: 1,
    borderRadius: 10,
    marginVertical: 1,
  },
  toAddressContainer: {
    flexDirection: "row",
    //marginTop: 2,
    alignItems: "center",
  },
  fromAddressIndicator: {
    height: 6,
    width: 6,
    backgroundColor: colors.orangeColor,
    borderRadius: 10,
  },
  adhocButtonContainer: { marginHorizontal: 10, marginTop: 5, width: 70 },
  adhocButtonStyle: {
    borderRadius: moderateScale(5),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.orangeColor,
    paddingVertical: 2,
  },
  regularButtonStyle: {
    borderRadius: moderateScale(5),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0b698c",
    paddingVertical: 2,
  },

  newRow: { marginVertical: 10, marginTop: 20 },
  mainIconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f4f4f4",
    paddingBottom: 10,
    paddingTop: 10,
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
    fontWeight: "400",
  },
  mainContainer: { flex: 1 },
  // dateContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  // },
  devider: {
    height: 0.7,
    width: "100%",
    backgroundColor: "#f4f4f4",
  },
  seperater: { width: 10 },
});

export default memo(NextTripModal);
