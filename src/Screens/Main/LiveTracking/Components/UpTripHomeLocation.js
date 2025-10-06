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

export default function UpTripHomeLocation(props) {
  var nextPickupData = props?.nextPickupData;
  var minutes = props?.minutes;
  var ontime = props?.ontime;
  var moment = props?.moment;
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          marginBottom: moderateScaleVertical(15),
          alignItems: "center",
          marginTop: -5,
        }}
      >
        {props.showTimer ? (
          <View
            style={{
              width: "20%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CountdownCircleTimer
              isPlaying
              trailColor={colors.darkYellow}
              strokeWidth={6}
              duration={props.timerDuration}
              colors={[colors.blueBorderColor]}
              size={65}
              onComplete={() => {
                props.timesUp("singleEmp");
              }}
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
          </View>
        ) : null}

        <View
          style={{
            width: props.showTimer || props.notshow ? "60%" : "78%",
          }}
        >
          <View style={styles.detailContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: "70%",
                }}
              >
                {nextPickupData?.onBoardPassengers ? (
                  <TouchableOpacity onPress={props.showQrCodeMoal}>
                    <Text numberOfLines={1} style={[styles.empNameText]}>
                      {nextPickupData?.onBoardPassengers[0]?.name}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={props.showQrCodeMoal}>
                    <Text numberOfLines={1} style={[styles.empNameText]}>
                      {nextPickupData?.deBoardPassengers[0]?.name}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {props.showAbsentButton ? (
                nextPickupData?.onBoardPassengers ? (
                  <View
                    style={{
                      width: "28%",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        props.showEmpListModal();
                      }}
                      style={{
                        borderRadius: 8,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        marginBottom: 5,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{ height: 30, width: 30 }}
                        source={
                          nextPickupData?.stopType?.toUpperCase()?.trim() ==
                          "ESCORT"
                            ? imagePath.escortCancelled
                            : imagePath.absent_emp_icon_blue
                        }
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={{
                      width: "28%",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        props.showEmpListModal();
                      }}
                      style={{
                        borderRadius: 8,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        marginBottom: 5,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{ height: 30, width: 30 }}
                        source={
                          nextPickupData?.stopType?.toUpperCase()?.trim() ==
                          "ESCORT"
                            ? imagePath.escortCancelled
                            : imagePath.absent_emp_icon_blue
                        }
                      />
                    </TouchableOpacity>
                  </View>
                )
              ) : nextPickupData?.onBoardPassengers ? (
                <View
                  style={{
                    width: "28%",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      props.showEmpListModal();
                    }}
                    style={{
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      marginBottom: 5,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{ height: 30, width: 30 }}
                      source={
                        nextPickupData?.stopType?.toUpperCase()?.trim() ==
                        "ESCORT"
                          ? imagePath.escortCancelled
                          : imagePath.absent_emp_icon_blue
                      }
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    width: "28%",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      props.showEmpListModal();
                    }}
                    style={{
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      marginBottom: 5,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{ height: 30, width: 30 }}
                      source={
                        nextPickupData?.stopType?.toUpperCase()?.trim() ==
                        "ESCORT"
                          ? imagePath.escortCancelled
                          : imagePath.absent_emp_icon_blue
                      }
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.ratingContainerRow}>
              <View style={styles.ratingContainer}>
                {nextPickupData?.onBoardPassengers ? (
                  <AirbnbRating
                    showRating={false}
                    count={5}
                    defaultRating={
                      nextPickupData?.onBoardPassengers[0]?.passRating
                    }
                    size={13}
                    isDisabled={true}
                    selectedColor={colors.greenColor2}
                  />
                ) : (
                  <AirbnbRating
                    showRating={false}
                    count={5}
                    defaultRating={
                      nextPickupData?.deBoardPassengers[0]?.passRating
                    }
                    size={13}
                    isDisabled={true}
                    selectedColor={colors.greenColor2}
                  />
                )}
                {/* {nextPickupData?.deBoardPassengers[0]?.passRating > 0 ? (
                  <Text style={{ color: colors.black }}>
                    {nextPickupData?.deBoardPassengers[0]?.passRating}
                  </Text>
                ) : null} */}
              </View>
              {nextPickupData?.onBoardPassengers ? (
                <Text style={styles.ratingText}>
                  {nextPickupData?.onBoardPassengers[0]?.averageRating}
                </Text>
              ) : (
                <Text style={styles.ratingText}>
                  {nextPickupData?.deBoardPassengers[0]?.averageRating}
                </Text>
              )}
            </View>

            <View style={[styles.empLocationContainer]}>
              <Image
                // source={
                //   nextPickupData?.stopType?.toUpperCase()?.trim() == "ESCORT"
                //     ? imagePath.officeMarker
                //     : imagePath.homeMapIcon
                // }
                source={
                  nextPickupData?.onBoardPassengers
                    ? nextPickupData?.onBoardPassengers[0]?.passType ===
                      "ESCORT"
                      ? imagePath.officeMarker
                      : imagePath.homeMapIcon
                    : nextPickupData?.deBoardPassengers[0]?.passType ===
                      "ESCORT"
                    ? imagePath.officeMarker
                    : imagePath.homeMapIcon
                }
                style={{
                  width: moderateScale(width / 20),
                  height: moderateScale(width / 16),
                }}
              />

              <Text
                style={[
                  styles.addressTextStyle,
                  {
                    textDecorationLine: "none",
                    color: colors.black,
                  },
                ]}
                numberOfLines={2}
              >
                {nextPickupData.location.locName}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ width: "20%" }}>
          {props?.driverAppSettingData?.canDriverViewEmployeesPhoto == "YES" ? (
            <View style={styles.vaccinationImgContainer}>
              {nextPickupData?.onBoardPassengers ? (
                <>
                  {nextPickupData?.onBoardPassengers[0]?.vaccineStatus ===
                    "Fully Vaccinated" ||
                  nextPickupData?.onBoardPassengers[0]?.vaccineStatus ===
                    "Vaccinated Fully" ? (
                    <Image
                      source={imagePath.Vaccinated_circle}
                      style={styles.vaccinationImgStyle}
                    />
                  ) : nextPickupData?.onBoardPassengers[0]?.vaccineStatus ===
                    "Partially Vaccinated" ? (
                    <Image
                      source={imagePath.partial_vaccinated_circle}
                      style={styles.vaccinationImgStyle}
                    />
                  ) : nextPickupData?.onBoardPassengers[0]?.vaccineStatus ===
                    "Not Vaccinated" ? (
                    <Image
                      source={imagePath.not_vaccinated_circle}
                      style={styles.vaccinationImgStyle}
                    />
                  ) : (
                    <Image
                      source={imagePath.Vaccinated_circle}
                      style={styles.vaccinationImgStyle}
                    />
                  )}

                  {nextPickupData?.onBoardPassengers[0]?.photo ? (
                    <Image
                      source={{
                        uri:
                          DOC_URL + nextPickupData?.onBoardPassengers[0]?.photo,
                      }}
                      style={styles.driverImg}
                    />
                  ) : (
                    <Image
                      source={imagePath.userIcon}
                      style={styles.driverImg}
                    />
                  )}
                </>
              ) : (
                <>
                  {nextPickupData?.deBoardPassengers[0]?.vaccineStatus ===
                    "Fully Vaccinated" ||
                  nextPickupData?.deBoardPassengers[0]?.vaccineStatus ===
                    "Vaccinated Fully" ? (
                    <Image
                      source={imagePath.Vaccinated_circle}
                      style={styles.vaccinationImgStyle}
                    />
                  ) : nextPickupData?.deBoardPassengers[0]?.vaccineStatus ===
                    "Partially Vaccinated" ? (
                    <Image
                      source={imagePath.partial_vaccinated_circle}
                      style={styles.vaccinationImgStyle}
                    />
                  ) : nextPickupData?.deBoardPassengers[0]?.vaccineStatus ===
                    "Not Vaccinated" ? (
                    <Image
                      source={imagePath.not_vaccinated_circle}
                      style={styles.vaccinationImgStyle}
                    />
                  ) : (
                    <Image
                      source={imagePath.Vaccinated_circle}
                      style={styles.vaccinationImgStyle}
                    />
                  )}
                  {nextPickupData?.deBoardPassengers[0]?.photo ? (
                    <Image
                      source={{
                        uri:
                          DOC_URL + nextPickupData?.deBoardPassengers[0]?.photo,
                      }}
                      style={styles.driverImg}
                    />
                  ) : (
                    <Image
                      source={imagePath.userIcon}
                      style={styles.driverImg}
                    />
                  )}
                </>
              )}
            </View>
          ) : (
            <Image source={imagePath.userIcon} style={styles.driverImg} />
          )}
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: -8,
          paddingHorizontal: 20,
          alignItems: "center",
        }}
      >
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.lightGary,
            paddingHorizontal: 5,
            paddingVertical: 5,
            width: 65,
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
            width: 65,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image source={imagePath.ETA} style={{ height: 14, width: 14 }} />
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
    </>
  );
}
