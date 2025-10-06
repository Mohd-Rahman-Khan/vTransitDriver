import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import fontFamily from "../styles/fontFamily";
import colors from "../styles/colors";
import imagePath from "../constants/imagePath";
import { textScale } from "../styles/responsiveSize";
import Moment from "moment";
import { extendMoment } from "moment-range";
import Tooltip from "react-native-walkthrough-tooltip";
import { getDelayOrEarlyMinutes } from "../utils/utils";
import navigationStrings from "../navigation/navigationStrings";
import { useNavigation } from "@react-navigation/native";
const moment = extendMoment(Moment);

export default function RideComp({
  item,
  showStartButton,
  screen,
  index,
  onPress = () => {},
}) {
  const [toolTipVisible, setToolTipVisible] = useState(false);
  const [indexValue, setIndexValue] = useState();
  const navigation = useNavigation();
  var tripStatus = "";
  var fromPoint;
  var toPoint;

  if (item?.status === "COMPLETED") {
    if (item?.tripType === "UPTRIP") {
      if (item?.shiftInTime === 0 || item?.actualTripCompletionTime === 0) {
      } else {
        let expected = item?.shiftInTime;
        let arrival = item?.actualTripCompletionTime;

        let secDiff = Math.floor((arrival - expected) / 1000);
        let minutesDiff = Math.floor(secDiff / 60);
        var diffInMins = minutesDiff;
        var firstPickupDelay = "";

        if (diffInMins < 0) {
          tripStatus = "early";
        } else if (diffInMins > 0) {
          tripStatus = "late";
        } else if (diffInMins === 0) {
          tripStatus = "ontime";
        } else {
          tripStatus = "";
        }
      }

      if (
        item?.stopList[0]?.expectedArivalTime > 0 &&
        item?.stopList[0]?.actualArivalTime > 0
      ) {
        let getMinutes = getDelayOrEarlyMinutes(
          item?.stopList[0]?.expectedArivalTime,
          item?.stopList[0]?.actualArivalTime
        );
        if (getMinutes > 0) {
          firstPickupDelay = "FPD";
        } else {
          firstPickupDelay = "";
        }
      } else {
        firstPickupDelay = "";
      }
    } else {
      if (
        item?.stopList[0]?.actualDepartureTime === 0 ||
        item?.shiftOutTime === 0
      ) {
      } else {
        let expected = item?.stopList[0]?.actualDepartureTime;
        let arrival = item?.shiftOutTime;

        let secDiff = Math.floor((arrival - expected) / 1000);
        let minutesDiff = Math.floor(secDiff / 60);
        var diffInMins = minutesDiff;

        if (diffInMins < 0) {
          tripStatus = "early";
        } else if (diffInMins > 0) {
          tripStatus = "late";
        } else if (diffInMins === 0) {
          tripStatus = "ontime";
        } else {
          tripStatus = "";
        }
      }
    }
  } else {
    if (item?.tripType === "UPTRIP") {
      var firstPickupDelay = "";
      if (
        item?.stopList[0]?.expectedArivalTime > 0 &&
        item?.stopList[0]?.actualArivalTime > 0
      ) {
        let getMinutes = getDelayOrEarlyMinutes(
          item?.stopList[0]?.expectedArivalTime,
          item?.stopList[0]?.actualArivalTime
        );
        if (getMinutes > 0) {
          firstPickupDelay = "FPD";
        } else {
          firstPickupDelay = "";
        }
      } else {
        firstPickupDelay = "";
      }
    }
  }
  let numberOfPasseengers =
    item?.numberOfMalePassengers + item?.numberOfFemalePassengers;

  let getLastStopPoint = item?.stopList[item?.stopList.length - 1];

  if (item?.tripType === "UPTRIP") {
    var fromFullAddress = item?.stopList[0]?.location?.locName;
    // var parts = fromFullAddress.split(",");
    // var thePart = parts[parts.length - 2];
    // var thePart2 = parts[parts.length - 3];
    // fromPoint = thePart2 + "," + thePart;
    fromPoint = fromFullAddress;

    toPoint =
      item?.stopList[0]?.onBoardPassengers[0]?.officeName +
      " - " +
      item?.stopList[0]?.onBoardPassengers[0]?.officeLocation?.locName;
  } else {
    var toFullAddress = getLastStopPoint?.location?.locName;
    // var parts = toFullAddress.split(",");
    // var thePart = parts[parts.length - 2];
    // var thePart2 = parts[parts.length - 3];
    // toPoint = thePart2 + "," + thePart;
    toPoint = toFullAddress;
    fromPoint =
      item?.stopList[0]?.onBoardPassengers[0]?.officeName +
      " - " +
      item?.stopList[0]?.onBoardPassengers[0]?.officeLocation?.locName;
  }
  return (
    <TouchableOpacity onPress={onPress} style={styles.listItemContainer}>
      <Text style={styles.shiftDateTimeText}>
        {moment(item?.date).format("ddd, MMM, D")},
        {item?.stopList[0]?.onBoardPassengers[0]?.shiftTime}
      </Text>

      <ImageBackground
        source={
          item?.status === "ABSENT"
            ? imagePath.absentTripIcon
            : item?.status === "CANCLED"
            ? imagePath.cancelledTripIcon
            : item?.status === "NOSHOW"
            ? imagePath.noShowTripIcon
            : item?.status === "EXPIRED"
            ? imagePath.expiredTripIcon
            : null
        }
        style={styles.listItemdestinationContainer}
        resizeMode="contain"
        opacity={0.4}
      >
        <View style={styles.fromToAddressContainer}>
          <View style={styles.fromToContainer}>
            <View style={styles.fromAddressContainer}>
              <View style={styles.toAddressIndicator}></View>
              <Text numberOfLines={2} style={styles.addressText}>
                {fromPoint}
              </Text>
            </View>
            <View style={styles.dotIndicatorContainer}>
              <View>
                <View style={styles.dotIndicator}></View>
                <View style={styles.dotIndicator}></View>
                <View style={styles.dotIndicator}></View>
              </View>
            </View>

            <View style={styles.toAddressContainer}>
              <View style={styles.fromAddressIndicator}></View>
              <View style={styles.fromAddressTextContainer}>
                <View style={styles.toPointTextContainer}>
                  <Text style={styles.addressText} numberOfLines={2}>
                    {toPoint}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.listItemRightIconContainer}>
          {item?.status === "STARTED" ? (
            <View style={styles.rideStatrtedContainer}>
              <View style={styles.rideStartedDotIndicator}></View>
              <Text style={styles.liveTextStyle}>LIVE</Text>
            </View>
          ) : item?.status === "COMPLETED" ? (
            <>
              {screen === navigationStrings.YOUR_RIDES ? (
                <Tooltip
                  animated
                  isVisible={indexValue == index ? toolTipVisible : false}
                  content={
                    <Text style={styles.timeTextStyle}>
                      {moment
                        .utc(item?.actualTripCompletionTime)
                        .local()
                        .format("HH:mm A")}
                    </Text>
                  }
                  placement="left"
                  onClose={() => setToolTipVisible(false)}
                >
                  <Text
                    onPress={() => {
                      setToolTipVisible(true);
                      setIndexValue(index);
                    }}
                    style={{
                      color:
                        tripStatus === "early"
                          ? colors.lightBlueColor
                          : tripStatus === "late"
                          ? colors.redColor
                          : tripStatus === "ontime"
                          ? colors.greenColor
                          : colors.black,
                    }}
                  >
                    {diffInMins}
                  </Text>
                </Tooltip>
              ) : (
                <Tooltip
                  animated
                  isVisible={toolTipVisible}
                  content={
                    <Text style={styles.timeTextStyle}>
                      {moment
                        .utc(item?.actualTripCompletionTime)
                        .local()
                        .format("HH:mm A")}
                    </Text>
                  }
                  placement="left"
                  onClose={() => setToolTipVisible(false)}
                >
                  <Text
                    onPress={() => {
                      setToolTipVisible(true);
                    }}
                    style={{
                      color:
                        tripStatus === "early"
                          ? colors.lightBlueColor
                          : tripStatus === "late"
                          ? colors.redColor
                          : tripStatus === "ontime"
                          ? colors.greenColor
                          : colors.black,
                    }}
                  >
                    {diffInMins}
                  </Text>
                </Tooltip>
              )}

              <Image
                resizeMode="contain"
                source={
                  tripStatus === "early"
                    ? imagePath.earlyIcon
                    : tripStatus === "late"
                    ? imagePath.delayIcon
                    : tripStatus === "ontime"
                    ? imagePath.check_mark_circle
                    : null
                }
                style={styles.rightIconStyle}
              />
            </>
          ) : item?.status == "SCHEDULE" ? (
            showStartButton ? (
              <View
                style={{
                  backgroundColor: colors.greenColor,
                  flexDirection: "row",
                  paddingHorizontal: 15,
                  paddingVertical: 3,
                  alignItems: "center",
                  borderRadius: 5,
                  paddingVertical: 5,
                }}
              >
                <Text style={{ color: colors.white, fontWeight: "600" }}>
                  Start
                </Text>
              </View>
            ) : null
          ) : null}
        </View>
      </ImageBackground>
      <View style={styles.listItemDetailRow}>
        {item?.tripType === "UPTRIP" ? (
          <Image style={styles.imageIconStyle} source={imagePath.upTrip} />
        ) : (
          <Image style={styles.imageIconStyle} source={imagePath.downTrip} />
        )}

        <Text style={styles.idTextStyle}>{item?.tripCode}</Text>
        <View style={styles.verticalDivider} />
        <Image style={styles.iconStyle} source={imagePath.avtarIcon} />
        <Text style={styles.userCountText}>{numberOfPasseengers}</Text>

        {item?.escortTrip === "YES" || item?.escortTrip === "Yes" ? (
          <>
            <View style={styles.verticalDivider} />
            <Image style={styles.iconStyle} source={imagePath.Guard_icon} />
            <Image
              style={styles.checkIconStyle}
              source={imagePath.check_mark}
            />
          </>
        ) : null}

        {item?.tripCategory === "ADHOCTRIP" ? (
          <>
            <View style={styles.verticalDivider} />
            <Image
              source={imagePath.adhocBlackIcon}
              style={styles.imageIconStyle}
            />
            {/* <View
              style={{
                backgroundColor: colors.orange,
                paddingHorizontal: 4,
                paddingVertical: 2,
                borderRadius: 3,
              }}
            >
              <Text style={{ fontSize: 12, color: colors.white }}>Adhoc</Text>
            </View> */}
          </>
        ) : null}
        <View style={styles.verticalDivider} />
        {firstPickupDelay ? (
          <View style={styles.firstPickupDelayContainer}>
            <Text style={styles.fistPickupDelayText}>{firstPickupDelay}</Text>
          </View>
        ) : null}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
          paddingHorizontal: 5,
        }}
      >
        <View
          style={{
            width: "48%",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={imagePath.policeVrification_date}
            style={{ height: 18, width: 18 }}
            resizeMode="contain"
          />
          <Text numberOfLines={1} style={styles.idTextStyle}>
            {item?.corporateName}
          </Text>
        </View>
        <View
          style={{
            width: "48%",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={imagePath.vendor}
            style={{ height: 15, width: 15 }}
            resizeMode="contain"
          />
          <Text numberOfLines={1} style={styles.idTextStyle}>
            {item?.vendorName}
          </Text>
        </View>
      </View>
      <View style={styles.divider}></View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listItemContainer: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  listItemdestinationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fromToAddressContainer: {
    width: "70%",
  },
  fromToContainer: { width: "100%" },
  fromAddressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  toAddressIndicator: {
    height: 6,
    width: 6,
    backgroundColor: colors.greenColor,
    borderRadius: 10,
  },
  addressText: {
    fontSize: textScale(10),
    marginLeft: 5,
    color: colors.gray,
    fontFamily: fontFamily.robotoRegular,
  },
  dotIndicatorContainer: { flexDirection: "row" },
  dotIndicator: {
    height: 5,
    width: 5,
    backgroundColor: colors.lightGray,
    marginLeft: 1,
    borderRadius: 10,
    marginVertical: 1,
  },
  toAddressContainer: {
    flexDirection: "row",
    marginTop: 2,
    alignItems: "center",
  },
  fromAddressIndicator: {
    height: 6,
    width: 6,
    backgroundColor: colors.orangeColor,
    borderRadius: 10,
  },
  fromAddressTextContainer: {
    flexDirection: "row",
    //justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  listItemDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 20,
  },
  idTextStyle: {
    fontFamily: fontFamily.robotoRegular,
    fontSize: textScale(10),
    color: colors.gray,
    marginHorizontal: 3,
  },
  verticalDivider: {
    height: 10,
    width: 2,
    backgroundColor: colors.lightGary,
    marginHorizontal: 3,
  },
  iconStyle: {
    height: 12,
    width: 12,
    tintColor: colors.mediumBlue,
    marginHorizontal: 3,
  },
  userCountText: {
    fontFamily: fontFamily.robotoRegular,
    fontSize: textScale(10),
    color: colors.gray,
    marginRight: 3,
  },
  checkIconStyle: {
    height: 12,
    width: 12,
    marginHorizontal: 3,
  },
  firstPickupDelayContainer: {
    backgroundColor: colors.redColor,
    marginHorizontal: 4,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  fistPickupDelayText: {
    fontFamily: fontFamily.robotoRegular,
    fontSize: textScale(10),
    color: colors.white,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: colors.lightGary,
  },
  rightIconStyle: {
    height: 20,
    width: 20,
  },
  listItemRightIconContainer: {
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
    //paddingRight: 10,
  },
  shiftDateTimeText: {
    marginBottom: 10,
    fontSize: textScale(15),
    color: colors.gray,
    fontFamily: fontFamily.robotoRegular,
  },
  toPointTextContainer: { width: "100%" },
  rideStatrtedContainer: {
    backgroundColor: "#e7f8dc",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignItems: "center",
    borderRadius: 5,
  },
  rideStartedDotIndicator: {
    height: 10,
    width: 10,
    backgroundColor: "#58a428",
    borderRadius: 20,
  },
  liveTextStyle: { marginLeft: 2, color: colors.black },
  timeTextStyle: { color: colors.black },
  imageIconStyle: { height: 15, width: 15 },
});
