import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { styles } from "../styles";
import imagePath from "../../../../constants/imagePath";
import { Rating, AirbnbRating } from "react-native-ratings";
import colors from "../../../../styles/colors";
import {
  moderateScale,
  moderateScaleVertical,
  height,
  width,
  textScale,
  scale,
} from "../../../../styles/responsiveSize";
import fontFamily from "../../../../styles/fontFamily";
import { DOC_URL } from "../../../../config/urls";

export default function UpTripNodalPointComp(props) {
  var nextPickupData = props?.nextPickupData;
  var minutes = props?.minutes;
  var ontime = props?.ontime;
  var moment = props?.moment;
  let presentEmpArr = [];

  if (nextPickupData?.onBoardPassengers) {
    presentEmpArr = nextPickupData?.onBoardPassengers.filter((element) => {
      return (
        element.status === "SCHEDULE" ||
        element.status === "BOARDED" ||
        element?.status === "SKIPPED"
      );
    });
  } else {
    presentEmpArr = nextPickupData?.deBoardPassengers.filter((element) => {
      return (
        element.status === "SCHEDULE" ||
        element.status === "BOARDED" ||
        element?.status === "SKIPPED"
      );
    });
  }

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        //height: "28%",
        paddingHorizontal: 20,
        //marginTop: moderateScaleVertical(15),
        marginBottom: moderateScaleVertical(15),
        alignItems: "center",
        marginTop: -5,
      }}
    >
      <View style={{ width: "65%" }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "10%" }}>
            {props?.tripType === "UPTRIP" ? (
              <Image
                source={
                  nextPickupData?.onBoardPassengers
                    ? imagePath.nodleIcon
                    : imagePath.officeMarker
                }
                style={{
                  width: moderateScale(width / 20),
                  height: moderateScale(width / 16),
                }}
              />
            ) : (
              <Image
                source={
                  nextPickupData?.onBoardPassengers
                    ? imagePath.officeMarker
                    : imagePath.nodleIcon
                }
                style={{
                  width: moderateScale(width / 20),
                  height: moderateScale(width / 16),
                }}
              />
            )}
          </View>
          <View style={{ width: "90%" }}>
            <TouchableOpacity
              onPress={() => {
                if (props?.tripType === "UPTRIP") {
                  if (nextPickupData?.onBoardPassengers) {
                    props.showQrCodeMoal();
                  }
                } else {
                  props.showQrCodeMoal();
                }
              }}
            >
              <Text style={styles.addressTextStyle} numberOfLines={3}>
                {props?.tripType === "UPTRIP"
                  ? nextPickupData?.onBoardPassengers
                    ? nextPickupData?.location.locName
                    : nextPickupData?.deBoardPassengers[0]?.officeName +
                      "-" +
                      nextPickupData?.deBoardPassengers[0]?.officeLocation
                        ?.locName
                  : nextPickupData?.onBoardPassengers
                  ? nextPickupData?.onBoardPassengers[0]?.officeName +
                    "-" +
                    nextPickupData?.onBoardPassengers[0]?.officeLocation
                      ?.locName
                  : nextPickupData?.location.locName}
              </Text>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                //paddingHorizontal: 20,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  borderWidth: 1,
                  borderColor: colors.lightGary,
                  paddingHorizontal: 5,
                  paddingVertical: 5,
                  width: 70,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={imagePath.actualtime}
                    style={{ height: 14, width: 14 }}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontSize: 12,
                      color: "black",
                    }}
                  >
                    {moment
                      .utc(nextPickupData?.expectedArivalTimeStr)
                      //.local()
                      .format("HH:mm")}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: colors.lightGary,
                  paddingHorizontal: 5,
                  paddingVertical: 5,
                  width: 70,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={imagePath.ETA}
                    style={{ height: 14, width: 14 }}
                  />
                  {/* <Text
                    style={{
                      marginLeft: 5,
                      fontSize: 12,
                      color: "black",
                    }}
                  >
                    {nextPickupData?.actualArivalTime === 0
                      ? "--"
                      : moment
                          .utc(nextPickupData?.actualArivalTime)
                          .local()
                          .format("HH:mm")}
                  </Text> */}
                  {nextPickupData?.status === "ARRIVED" ? (
                    <Text
                      style={{
                        marginLeft: 5,
                        fontSize: 12,
                        color: "black",
                      }}
                    >
                      {nextPickupData?.actualArivalTime === 0
                        ? "--"
                        : moment
                            .utc(nextPickupData?.actualArivalTime)
                            .local()
                            .format("HH:mm")}
                    </Text>
                  ) : nextPickupData?.updatedArivalTime == 0 ? (
                    <Text
                      style={{
                        marginLeft: 5,
                        fontSize: 12,
                        color: "black",
                      }}
                    >
                      --
                    </Text>
                  ) : (
                    <Text
                      style={{
                        marginLeft: 5,
                        fontSize: 12,
                        color: "black",
                      }}
                    >
                      {moment
                        .utc(nextPickupData?.updatedArivalTime)
                        .local()
                        .format("HH:mm")}
                    </Text>
                  )}
                </View>
              </View>
              <View>
                {minutes > 0 ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginHorizontal: 5,
                    }}
                  >
                    <Image
                      style={{ height: 15, width: 15 }}
                      source={imagePath.delayIcon}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        color: minutes > 0 ? "red" : colors.lightBlueColor,
                        marginLeft: 5,
                        fontSize: 12,
                      }}
                    >
                      +{minutes} min
                    </Text>
                  </View>
                ) : minutes < 0 ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginHorizontal: 5,
                    }}
                  >
                    <Image
                      style={{ height: 15, width: 15 }}
                      source={imagePath.earlyIcon}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        color: minutes > 0 ? "red" : colors.lightBlueColor,
                        marginLeft: 5,
                        fontSize: 12,
                      }}
                    >
                      {minutes} min
                    </Text>
                  </View>
                ) : ontime === "yes" ? (
                  <Image
                    source={imagePath.onTime}
                    style={{ height: 20, width: 20, marginLeft: 5 }}
                    resizeMode="contain"
                  />
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </View>
      {props.showTimer ? (
        <View
          style={{
            width: "30%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                props.showEmpListModal();
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Image
                source={imagePath.grpup_absent}
                resizeMode="contain"
                style={{
                  height: 30,
                  width: 30,
                }}
              />
              {nextPickupData?.onBoardPassengers === null ? (
                <Text style={{ fontSize: 12, color: "black" }}>
                  {presentEmpArr?.length +
                    "/" +
                    nextPickupData?.deBoardPassengers?.length}
                </Text>
              ) : (
                <Text style={{ fontSize: 12, color: "#196492" }}>
                  {presentEmpArr?.length +
                    "/" +
                    nextPickupData?.onBoardPassengers?.length}
                </Text>
              )}
            </TouchableOpacity>
            {props.showTimer ? (
              <CountdownCircleTimer
                isPlaying
                trailColor={colors.darkYellow}
                strokeWidth={6}
                duration={props.timerDuration}
                colors={[colors.blueBorderColor]}
                size={65}
                // onComplete={() => {
                //   props.timesUp("multipleUser");
                // }}
              >
                {({ remainingTime }) => {
                  return (
                    <View>
                      <Text
                        style={{
                          color: "#616161",
                          fontWeight: "bold",
                          fontSize: 20,
                          textAlign: "center",
                        }}
                      >
                        {remainingTime}
                      </Text>
                      <Text
                        style={{
                          color: "#616161",
                          fontWeight: "bold",
                          fontSize: 11,
                          textAlign: "center",
                        }}
                      >
                        Sec
                      </Text>
                    </View>
                  );
                }}
              </CountdownCircleTimer>
            ) : null}
          </View>
        </View>
      ) : (
        <View
          style={{
            width: "30%",
            alignItems: "center",
            //backgroundColor: 'red',
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                // showEmpList.current.show();
                props.showEmpListModal();
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Image
                source={imagePath?.grpup_absent}
                resizeMode="contain"
                style={{
                  height: 30,
                  width: 30,
                }}
              />
              {nextPickupData?.onBoardPassengers === null ? (
                <Text style={{ fontSize: 12, color: "black" }}>
                  {presentEmpArr?.length +
                    "/" +
                    nextPickupData.deBoardPassengers.length}
                </Text>
              ) : (
                <Text style={{ fontSize: 12, color: "#196492" }}>
                  {presentEmpArr?.length +
                    "/" +
                    nextPickupData?.onBoardPassengers.length}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
