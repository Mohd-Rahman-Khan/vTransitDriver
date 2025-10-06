import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  PanResponder,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useRef, useState, memo, useEffect } from "react";
//import { styles } from "./styles";
import imagePath from "../../../constants/imagePath";
import colors from "../../../styles/colors";
import strings from "../../../constants/lang";
import { Rating, AirbnbRating } from "react-native-ratings";
import {
  moderateScale,
  moderateScaleVertical,
  height,
  width,
  textScale,
  scale,
} from "../../../styles/responsiveSize";
import fontFamily from "../../../styles/fontFamily";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { DOC_URL } from "../../../config/urls";
import NavigationPopup from "../../../Components/NavigationPopup";
import FullAddressPopUp from "../../../Components/FullAddressPopUp";
import ToolTipButtons from "./Components/ToolTipButtons";
import NextPickupLocationComp from "./Components/NextPickupLocationComp";
import Geolocation from "react-native-geolocation-service";

const moment = extendMoment(Moment);

function EscortDetailsDownTrip(props) {
  const [indexValue, setIndexValue] = useState();
  const [toolTipVisible, setToolTipVisible] = useState(false);
  const [isShowTooltip, setisShowTooltip] = useState(false);
  const [showTooltipModal, setshowTooltipModal] = useState(false);
  const [isShutterOpen, setisShutterOpen] = useState(false);
  const [isFullAddressVisible, setisFullAddressVisible] = useState(false);
  const [escortDetails, setEscortDetails] = useState({});
  var nextPickupData = props.data;

  let actualETA = moment
    .utc(props.nextPickupLocation?.expectedArivalTimeStr)
    //.local()
    .format("HH:mm");
  const BOTTOM_SHEET_MAX_HEIGHT = nextPickupData?.onBoardPassengers ? 290 : 160;

  const BOTTOM_SHEET_MIN_HEIGHT =
    nextPickupData?.onBoardPassengers?.length === 1 ||
    nextPickupData?.deBoardPassengers?.length === 1
      ? 145
      : 155;

  const MAX_UPWORDS_TRANSLATE_Y =
    BOTTOM_SHEET_MIN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT;

  const MAX_DOWNWORDS_TRANSLATE_Y = 0;

  const DRAG_THRESHOLD = 50;
  const animatedValue = useRef(new Animated.Value(0)).current;
  const lastGestureDy = useRef(0);
  var minutes = 0;
  var ontime = "";

  if (nextPickupData?.status == "ARRIVED") {
    if (
      nextPickupData?.expectedArivalTime > 0 &&
      nextPickupData?.actualArivalTime > 0
    ) {
      let expected = nextPickupData?.expectedArivalTime;
      let arrival = nextPickupData?.actualArivalTime;

      let secDiff = Math.floor((arrival - expected) / 1000);
      let minutesDiff = Math.floor(secDiff / 60);

      if (minutesDiff === 0) {
        ontime = "yes";
      } else {
        minutes = minutesDiff;
        ontime = "";
      }
    }
  } else {
    if (nextPickupData?.updatedArivalTime == 0) {
      if (
        nextPickupData?.expectedArivalTime > 0 &&
        nextPickupData?.actualArivalTime > 0
      ) {
        let expected = nextPickupData?.expectedArivalTime;
        let arrival = nextPickupData?.actualArivalTime;

        let secDiff = Math.floor((arrival - expected) / 1000);
        let minutesDiff = Math.floor(secDiff / 60);

        if (minutesDiff === 0) {
          ontime = "yes";
        } else {
          minutes = minutesDiff;
          ontime = "";
        }
      }
    } else {
      let expected = nextPickupData?.expectedArivalTime;
      let arrival = nextPickupData?.updatedArivalTime;

      let secDiff = Math.floor((arrival - expected) / 1000);
      let minutesDiff = Math.floor(secDiff / 60);

      if (minutesDiff === 0) {
        ontime = "yes";
      } else {
        minutes = minutesDiff;
        ontime = "";
      }
    }
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        animatedValue.setOffset(lastGestureDy.current);
      },
      onPanResponderMove: (e, gesture) => {
        animatedValue.setValue(gesture.dy);
      },
      onPanResponderRelease: (e, gesture) => {
        animatedValue.flattenOffset();

        if (gesture.dy > 0) {
          if (gesture.dy <= DRAG_THRESHOLD) {
            springAnimation("up");
            props.setshowmap(true);
            setisShutterOpen(true);
          } else {
            springAnimation("down");
            props.setshowmap(false);
            setisShutterOpen(false);
          }
        } else {
          if (gesture.dy >= -DRAG_THRESHOLD) {
            springAnimation("down");
            props.setshowmap(false);
            setisShutterOpen(false);
          } else {
            springAnimation("up");
            props.setshowmap(true);
            setisShutterOpen(true);
          }
        }
      },
    })
  ).current;

  const springAnimation = (direction) => {
    lastGestureDy.current =
      direction === "down"
        ? MAX_DOWNWORDS_TRANSLATE_Y
        : MAX_UPWORDS_TRANSLATE_Y;

    Animated.spring(animatedValue, {
      toValue: lastGestureDy.current,
      useNativeDriver: true,
    }).start();
  };

  const bottomSheetAnimation = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [MAX_UPWORDS_TRANSLATE_Y, MAX_DOWNWORDS_TRANSLATE_Y],
          outputRange: [MAX_UPWORDS_TRANSLATE_Y, MAX_DOWNWORDS_TRANSLATE_Y],
          extrapolate: "clamp",
        }),
      },
    ],
  };

  const focusOnCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        // latitude: position?.coords?.latitude,
        //longitude: position?.coords?.longitude,
        if (position?.coords?.longitude) {
          props.mapRef?.current?.animateToRegion({
            latitude: position?.coords?.latitude,
            longitude: position?.coords?.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
            heading: position?.coords?.heading,
          });
        }
      },
      (error) => {
        //setisLoading(false);
      },
      { enableHighAccuracy: false, timeout: 20000 }
    );
  };

  const checkSelectedNavigationType = async () => {
    let checkStatus = await AsyncStorage.getItem("mapType");

    if (checkStatus === null || checkStatus === undefined) {
      setshowTooltipModal(true);
    } else {
      let parseData = JSON.parse(checkStatus);
      if (parseData.selectionType === "googleMap") {
        props.googleMapRedirection();
      } else {
        props.appleMapNavigation();
      }
    }
  };

  useEffect(() => {
    if (props?.data?.onBoardPassengers) {
      let escortDetailsData = props?.data?.onBoardPassengers?.filter(
        (ele, ind) => {
          return ele?.passType?.toUpperCase()?.trim() === "ESCORT";
        }
      );

      setEscortDetails(escortDetailsData?.[0]);
      // }
    } else {
      let escortDetailsData = props?.data?.deBoardPassengers?.filter(
        (ele, ind) => {
          return ele?.passType?.toUpperCase()?.trim() === "ESCORT";
        }
      );

      setEscortDetails(escortDetailsData?.[0]);
    }
  }, [props]);

  return (
    <Animated.View
      style={[
        {
          height: BOTTOM_SHEET_MAX_HEIGHT,
          width: width,
          backgroundColor: colors.white,
          position: "absolute",
          //marginBottom: moderateScaleVertical(20),
          borderTopLeftRadius: moderateScale(15),
          borderTopRightRadius: moderateScale(15),
          bottom: BOTTOM_SHEET_MIN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT,
          //bottom: 10,
          ...Platform.select({
            android: { elevation: 10 },
            ios: {
              shadowColor: colors.shadowColor,
              shadowOpacity: 10,
              shadowRadius: 6,
              shadowOffset: {
                height: 2,
                width: 2,
              },
            },
          }),
        },
        bottomSheetAnimation,
      ]}
      {...panResponder.panHandlers}
    >
      {isFullAddressVisible ? (
        <FullAddressPopUp
          onClose={() => {
            setisFullAddressVisible(false);
          }}
          address={props.nextPickupLocation?.location?.locName}
        />
      ) : null}
      {showTooltipModal ? (
        <NavigationPopup
          showModal={showTooltipModal}
          closeModal={() => {
            setshowTooltipModal(!showTooltipModal);
          }}
          marginBottom={
            isShutterOpen ? BOTTOM_SHEET_MAX_HEIGHT : BOTTOM_SHEET_MIN_HEIGHT
          }
          isShutterOpen={isShutterOpen}
          googleMapRedirection={() => {
            props.googleMapRedirection();
            setshowTooltipModal(false);
          }}
          appleMapNavigation={() => {
            props.appleMapNavigation();
            setshowTooltipModal(false);
          }}
        />
      ) : null}
      <View>
        <View style={{ height: BOTTOM_SHEET_MIN_HEIGHT }}>
          <ToolTipButtons
            escortStatus={props?.escortStatus}
            focusOnCurrentLocation={focusOnCurrentLocation}
            checkSelectedNavigationType={() => {
              checkSelectedNavigationType();
            }}
            isThisEscortTrip={props?.isThisEscortTrip}
            openEmpListForCall={props.openEmpListForCall}
            openTollTaxAndParkingSheet={props?.openTollTaxAndParkingSheet}
            infoIconClick={props.infoIconClick}
          />
          <View style={styles.dragbleArea}></View>

          {!nextPickupData?.stopType ? (
            nextPickupData?.stopType !== "HOME" ||
            nextPickupData?.stopType !== "ESCORT" ? (
              <>
                <View style={styles.escortHomeLocationContainer}>
                  {props.showTimer ? (
                    <View style={styles.showTimerContainer}>
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
                              <Text style={styles.escortRemainingTimeText}>
                                {remainingTime}
                              </Text>
                              <Text style={styles.escortSecText}>Sec</Text>
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
                      <View style={styles.escortDetailContainerRow}>
                        <View style={styles.escortDetailContainerLeftContainer}>
                          {nextPickupData?.onBoardPassengers ? (
                            <TouchableOpacity onPress={props.showQrCodeMoal}>
                              <Text
                                numberOfLines={1}
                                style={[styles.empNameText]}
                              >
                                {escortDetails?.name}
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity onPress={props.showQrCodeMoal}>
                              <Text
                                numberOfLines={1}
                                style={[styles.empNameText]}
                              >
                                {escortDetails?.name}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        {props.showAbsentButton ? (
                          nextPickupData?.onBoardPassengers ? (
                            <View
                              style={styles.escortDetailContainerRightContainer}
                            >
                              <TouchableOpacity
                                onPress={() => {
                                  props.showEmpListModal();
                                }}
                                style={styles.showEmpListButtonContainer}
                              >
                                <Image
                                  style={styles.absentEmpIconBlue}
                                  source={imagePath.escortCancelled}
                                />
                              </TouchableOpacity>
                            </View>
                          ) : null
                        ) : nextPickupData?.onBoardPassengers ? (
                          <View
                            style={styles.escortDetailContainerRightContainer}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                props.showEmpListModal();
                              }}
                              style={styles.showEmpListButtonContainer}
                            >
                              <Image
                                style={styles.absentEmpIconBlue}
                                source={imagePath.escortCancelled}
                              />
                            </TouchableOpacity>
                          </View>
                        ) : null}
                      </View>

                      <View style={styles.ratingContainerRow}>
                        <View style={styles.ratingContainer}>
                          {nextPickupData?.onBoardPassengers ? (
                            <AirbnbRating
                              showRating={false}
                              count={5}
                              defaultRating={escortDetails?.passRating}
                              size={13}
                              isDisabled={true}
                              selectedColor={colors.greenColor2}
                            />
                          ) : (
                            <AirbnbRating
                              showRating={false}
                              count={5}
                              defaultRating={escortDetails?.passRating}
                              size={13}
                              isDisabled={true}
                              selectedColor={colors.greenColor2}
                            />
                          )}
                        </View>
                      </View>

                      <View style={[styles.empLocationContainer]}>
                        <Image
                          source={imagePath.officeMarker}
                          style={styles.nextpickupIcon}
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
                  <View style={styles.vaccineAndGenderIconContainer}>
                    <View style={styles.vaccinationImgContainer}>
                      {props?.driverAppSettingData
                        ?.canDriverViewEmployeesPhoto == "YES" ? (
                        nextPickupData?.onBoardPassengers ? (
                          <>
                            {escortDetails?.vaccineStatus ===
                              "Fully Vaccinated" ||
                            escortDetails?.vaccineStatus ===
                              "Vaccinated Fully" ? (
                              <Image
                                source={imagePath.Vaccinated_circle}
                                style={styles.vaccinationImgStyle}
                              />
                            ) : escortDetails?.vaccineStatus ===
                              "Partially Vaccinated" ? (
                              <Image
                                source={imagePath.partial_vaccinated_circle}
                                style={styles.vaccinationImgStyle}
                              />
                            ) : escortDetails?.vaccineStatus ===
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

                            {escortDetails?.photo ? (
                              <Image
                                source={{
                                  uri: DOC_URL + escortDetails?.photo,
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
                            {escortDetails?.vaccineStatus ===
                              "Fully Vaccinated" ||
                            escortDetails?.vaccineStatus ===
                              "Vaccinated Fully" ? (
                              <Image
                                source={imagePath.Vaccinated_circle}
                                style={styles.vaccinationImgStyle}
                              />
                            ) : escortDetails?.vaccineStatus ===
                              "Partially Vaccinated" ? (
                              <Image
                                source={imagePath.partial_vaccinated_circle}
                                style={styles.vaccinationImgStyle}
                              />
                            ) : escortDetails?.vaccineStatus ===
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
                            {escortDetails?.photo ? (
                              <Image
                                source={{
                                  uri: DOC_URL + escortDetails?.photo,
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
                        )
                      ) : (
                        <Image
                          source={imagePath.userIcon}
                          style={styles.driverImg}
                        />
                      )}
                    </View>
                  </View>
                </View>
                <View style={styles.stopPointTimeContainer}>
                  <View style={styles.stopPointTimeBox}>
                    <View style={styles.stopPointTimeBoxRow}>
                      <Image
                        source={imagePath.actualtime}
                        style={styles.stopPointTimeIcon}
                      />
                      <Text style={styles.stopPointTimeText}>
                        {moment
                          .utc(nextPickupData?.expectedArivalTimeStr)
                          .format("HH:mm")}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.stopPointTimeBox}>
                    <View style={styles.stopPointTimeBoxRow}>
                      <Image
                        source={imagePath.ETA}
                        style={styles.stopPointTimeIcon}
                      />
                      {/* <Text style={styles.stopPointTimeText}>
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
                      <View style={styles.stopPoinntTimeBoxDelayEarlyContainer}>
                        <Image
                          style={styles.stopPointTimeBoxDelayEarlyIcon}
                          source={imagePath.delayIcon}
                          resizeMode="contain"
                        />
                        <Text
                          style={{
                            color:
                              minutes > 0
                                ? colors.redColor
                                : colors.lightBlueColor,
                            marginLeft: 5,
                            fontSize: 12,
                          }}
                        >
                          +{minutes} min
                        </Text>
                      </View>
                    ) : minutes < 0 ? (
                      <View style={styles.stopPoinntTimeBoxDelayEarlyContainer}>
                        <Image
                          style={styles.stopPointTimeBoxDelayEarlyIcon}
                          source={imagePath.earlyIcon}
                          resizeMode="contain"
                        />
                        <Text
                          style={{
                            color:
                              minutes > 0
                                ? colors.redColor
                                : colors.lightBlueColor,
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
                        style={styles.stopPointOntimeIcon}
                        resizeMode="contain"
                      />
                    ) : null}
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.escortHomeLocationContainer}>
                <View style={styles.escortDetailContainer}>
                  <View style={styles.rowContainer}>
                    <View style={styles.stopPointIconContainer}>
                      {nextPickupData?.onBoardPassengers ? (
                        <Image
                          source={imagePath.nodleIcon}
                          style={styles.nextpickupIcon}
                        />
                      ) : (
                        <Image
                          source={imagePath.officeMarker}
                          style={styles.nextpickupIcon}
                        />
                      )}
                    </View>
                    <View style={styles.stopPointNameConntainer}>
                      <TouchableOpacity onPress={props.showQrCodeMoal}>
                        {nextPickupData?.onBoardPassengers ? (
                          <Text
                            style={styles.addressTextStyle}
                            numberOfLines={4}
                          >
                            {nextPickupData?.location.locName}
                          </Text>
                        ) : (
                          <Text
                            style={styles.addressTextStyle}
                            numberOfLines={4}
                          >
                            {nextPickupData?.deBoardPassengers[0]?.officeName}
                          </Text>
                        )}
                      </TouchableOpacity>

                      <View style={styles.etaAndTimeContainer}>
                        <View style={styles.timeContainerBox}>
                          <View style={styles.timeContainerBoxRow}>
                            <Image
                              source={imagePath.actualtime}
                              style={styles.stopPointTimeIcon}
                            />
                            <Text style={styles.timeTextStyle}>
                              {moment
                                .utc(nextPickupData?.expectedArivalTimeStr)
                                .format("HH:mm")}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.timeContainerBox}>
                          <View style={styles.timeContainerBoxRow}>
                            <Image
                              source={imagePath.ETA}
                              style={styles.stopPointTimeIcon}
                            />
                            {/* <Text style={styles.timeTextStyle}>
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
                            <View style={styles.iconContainer}>
                              <Image
                                style={styles.stopPointTimeBoxDelayEarlyIcon}
                                source={imagePath.delayIcon}
                                resizeMode="contain"
                              />
                              <Text
                                style={{
                                  color:
                                    minutes > 0
                                      ? colors.redColor
                                      : colors.lightBlueColor,
                                  marginLeft: 5,
                                  fontSize: 12,
                                }}
                              >
                                +{minutes} min
                              </Text>
                            </View>
                          ) : minutes < 0 ? (
                            <View style={styles.iconContainer}>
                              <Image
                                style={styles.stopPointTimeBoxDelayEarlyIcon}
                                source={imagePath.earlyIcon}
                                resizeMode="contain"
                              />
                              <Text
                                style={{
                                  color:
                                    minutes > 0
                                      ? colors.redColor
                                      : colors.lightBlueColor,
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
                              style={styles.stopPointOntimeIcon}
                              resizeMode="contain"
                            />
                          ) : null}
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                {props.showTimer ? (
                  <View style={styles.showTimerContainer}>
                    <View style={styles.showEmpListCnntainer}>
                      <TouchableOpacity
                        onPress={() => {
                          props.showEmpListModal();
                        }}
                        style={styles.showEmpListModalButton}
                      >
                        <Image
                          source={imagePath.grpup_absent}
                          resizeMode="contain"
                          style={styles.groupAbsentIconStyle}
                        />
                        {nextPickupData?.onBoardPassengers === null ? (
                          <Text style={styles.passengersCountText}>
                            {nextPickupData?.deBoardPassengers?.length}
                          </Text>
                        ) : (
                          <Text style={styles.passengersCountText}>
                            {nextPickupData?.onBoardPassengers?.length}
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
                          onComplete={() => {
                            props.timesUp("multipleUser");
                          }}
                        >
                          {({ remainingTime }) => {
                            return (
                              <View>
                                <Text style={styles.timerRemainingMinutesText}>
                                  {remainingTime}
                                </Text>
                                <Text style={styles.timerRemainingSecText}>
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
                  <View style={styles.escortDetailRightContainer}>
                    <View style={styles.showEmpListCnntainer}>
                      <TouchableOpacity
                        onPress={() => {
                          props.showEmpListModal();
                        }}
                        style={styles.showEmpListModalButton}
                      >
                        <Image
                          source={imagePath?.grpup_absent}
                          resizeMode="contain"
                          style={styles.groupAbsentIconStyle}
                        />
                        {nextPickupData?.onBoardPassengers === null ? (
                          <Text style={styles.passengersCountText}>
                            {nextPickupData.deBoardPassengers.length}
                          </Text>
                        ) : (
                          <Text style={styles.passengersCountText}>
                            {nextPickupData?.onBoardPassengers.length}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )
          ) : nextPickupData?.onBoardPassengers?.length === 1 ||
            nextPickupData?.deBoardPassengers?.length === 1 ? (
            nextPickupData?.onBoardPassengers ? (
              <>
                <View style={styles.escortHomeLocationContainer}>
                  {props.showTimer ? (
                    <View style={styles.showTimerContainer}>
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
                              <Text style={styles.timerRemainingMinutesText}>
                                {remainingTime}
                              </Text>
                              <Text style={styles.timerRemainingSecText}>
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
                      <View style={styles.escortDetailContainerRow}>
                        <View style={styles.escortDetailContainerLeftContainer}>
                          {nextPickupData?.onBoardPassengers ? (
                            <TouchableOpacity onPress={props.showQrCodeMoal}>
                              <Text
                                numberOfLines={1}
                                style={[styles.empNameText]}
                              >
                                {nextPickupData?.onBoardPassengers[0].name}
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity onPress={props.showQrCodeMoal}>
                              <Text
                                numberOfLines={1}
                                style={[styles.empNameText]}
                              >
                                {nextPickupData?.deBoardPassengers[0].name}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        {props.showAbsentButton ? (
                          nextPickupData?.onBoardPassengers ? (
                            <View
                              style={styles.escortDetailContainerRightContainer}
                            >
                              <TouchableOpacity
                                onPress={() => {
                                  props.showEmpListModal();
                                }}
                                style={styles.showEmpListButtonContainer}
                              >
                                <Image
                                  style={styles.absentEmpIconBlue}
                                  source={imagePath.absent_emp_icon_blue}
                                />
                              </TouchableOpacity>
                            </View>
                          ) : null
                        ) : nextPickupData?.onBoardPassengers ? (
                          <View
                            style={styles.escortDetailContainerRightContainer}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                props.showEmpListModal();
                              }}
                              style={styles.showEmpListButtonContainer}
                            >
                              <Image
                                style={styles.absentEmpIconBlue}
                                source={imagePath.absent_emp_icon_blue}
                              />
                            </TouchableOpacity>
                          </View>
                        ) : null}
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
                        </View>
                      </View>

                      <View style={[styles.empLocationContainer]}>
                        <Image
                          source={imagePath.homeMapIcon}
                          style={styles.nextpickupIcon}
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
                  <View style={styles.vaccineAndGenderIconContainer}>
                    <View style={styles.vaccinationImgContainer}>
                      {props?.driverAppSettingData
                        ?.canDriverViewEmployeesPhoto == "YES" ? (
                        nextPickupData?.onBoardPassengers ? (
                          <>
                            {nextPickupData?.onBoardPassengers[0]
                              ?.vaccineStatus === "Fully Vaccinated" ||
                            nextPickupData?.onBoardPassengers[0]
                              ?.vaccineStatus === "Vaccinated Fully" ? (
                              <Image
                                source={imagePath.Vaccinated_circle}
                                style={styles.vaccinationImgStyle}
                              />
                            ) : nextPickupData?.onBoardPassengers[0]
                                ?.vaccineStatus === "Partially Vaccinated" ? (
                              <Image
                                source={imagePath.partial_vaccinated_circle}
                                style={styles.vaccinationImgStyle}
                              />
                            ) : nextPickupData?.onBoardPassengers[0]
                                ?.vaccineStatus === "Not Vaccinated" ? (
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
                                    DOC_URL +
                                    nextPickupData?.onBoardPassengers[0]?.photo,
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
                            {nextPickupData?.deBoardPassengers[0]
                              ?.vaccineStatus === "Fully Vaccinated" ||
                            nextPickupData?.deBoardPassengers[0]
                              ?.vaccineStatus === "Vaccinated Fully" ? (
                              <Image
                                source={imagePath.Vaccinated_circle}
                                style={styles.vaccinationImgStyle}
                              />
                            ) : nextPickupData?.deBoardPassengers[0]
                                ?.vaccineStatus === "Partially Vaccinated" ? (
                              <Image
                                source={imagePath.partial_vaccinated_circle}
                                style={styles.vaccinationImgStyle}
                              />
                            ) : nextPickupData?.deBoardPassengers[0]
                                ?.vaccineStatus === "Not Vaccinated" ? (
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
                                    DOC_URL +
                                    nextPickupData?.deBoardPassengers[0]?.photo,
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
                        )
                      ) : (
                        <Image
                          source={imagePath.userIcon}
                          style={styles.driverImg}
                        />
                      )}
                    </View>
                  </View>
                </View>
                <View style={styles.stopPointTimeContainer}>
                  <View style={styles.stopPointTimeBox}>
                    <View style={styles.stopPointTimeBoxRow}>
                      <Image
                        source={imagePath.actualtime}
                        style={styles.stopPointTimeIcon}
                      />
                      <Text style={styles.stopPointTimeText}>
                        {moment
                          .utc(nextPickupData?.expectedArivalTimeStr)
                          .format("HH:mm")}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.stopPointTimeBox}>
                    <View style={styles.stopPointTimeBoxRow}>
                      <Image
                        source={imagePath.ETA}
                        style={styles.stopPointTimeIcon}
                      />
                      {/* <Text style={styles.stopPointTimeText}>
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
                      <View style={styles.stopPoinntTimeBoxDelayEarlyContainer}>
                        <Image
                          style={styles.stopPointTimeBoxDelayEarlyIcon}
                          source={imagePath.delayIcon}
                          resizeMode="contain"
                        />
                        <Text
                          style={{
                            color:
                              minutes > 0
                                ? colors.redColor
                                : colors.lightBlueColor,
                            marginLeft: 5,
                            fontSize: 12,
                          }}
                        >
                          +{minutes} min
                        </Text>
                      </View>
                    ) : minutes < 0 ? (
                      <View style={styles.stopPoinntTimeBoxDelayEarlyContainer}>
                        <Image
                          style={styles.stopPointTimeBoxDelayEarlyIcon}
                          source={imagePath.earlyIcon}
                          resizeMode="contain"
                        />
                        <Text
                          style={{
                            color:
                              minutes > 0
                                ? colors.redColor
                                : colors.lightBlueColor,
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
                        style={styles.stopPointOntimeIcon}
                        resizeMode="contain"
                      />
                    ) : null}
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.escortHomeLocationContainer}>
                <View style={styles.escortDetailContainer}>
                  <View style={styles.rowContainer}>
                    <View style={styles.stopPointIconContainer}>
                      {nextPickupData?.onBoardPassengers ? (
                        <Image
                          source={imagePath.nodleIcon}
                          style={styles.nextpickupIcon}
                        />
                      ) : (
                        <Image
                          source={imagePath.officeMarker}
                          style={styles.nextpickupIcon}
                        />
                      )}
                    </View>
                    <View style={styles.stopPointNameConntainer}>
                      <TouchableOpacity onPress={props.showQrCodeMoal}>
                        {nextPickupData?.onBoardPassengers ? (
                          <Text
                            style={styles.addressTextStyle}
                            numberOfLines={4}
                          >
                            {nextPickupData?.location.locName}
                          </Text>
                        ) : (
                          <Text
                            style={styles.addressTextStyle}
                            numberOfLines={4}
                          >
                            {nextPickupData?.deBoardPassengers[0]?.officeName +
                              " - " +
                              nextPickupData?.deBoardPassengers[0]
                                ?.officeLocation?.locName}
                          </Text>
                        )}
                      </TouchableOpacity>

                      <View style={styles.etaAndTimeContainer}>
                        <View style={styles.timeContainerBox}>
                          <View style={styles.timeContainerBoxRow}>
                            <Image
                              source={imagePath.actualtime}
                              style={styles.stopPointTimeIcon}
                            />
                            <Text style={styles.timeTextStyle}>
                              {moment
                                .utc(nextPickupData?.expectedArivalTimeStr)
                                .format("HH:mm")}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.timeContainerBox}>
                          <View style={styles.timeContainerBoxRow}>
                            <Image
                              source={imagePath.ETA}
                              style={styles.stopPointTimeIcon}
                            />
                            {/* <Text style={styles.timeTextStyle}>
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
                            <View style={styles.iconContainer}>
                              <Image
                                style={styles.stopPointTimeBoxDelayEarlyIcon}
                                source={imagePath.delayIcon}
                                resizeMode="contain"
                              />
                              <Text
                                style={{
                                  color:
                                    minutes > 0
                                      ? colors.redColor
                                      : colors.lightBlueColor,
                                  marginLeft: 5,
                                  fontSize: 12,
                                }}
                              >
                                +{minutes} min
                              </Text>
                            </View>
                          ) : minutes < 0 ? (
                            <View style={styles.iconContainer}>
                              <Image
                                style={styles.stopPointTimeBoxDelayEarlyIcon}
                                source={imagePath.earlyIcon}
                                resizeMode="contain"
                              />
                              <Text
                                style={{
                                  color:
                                    minutes > 0
                                      ? colors.redColor
                                      : colors.lightBlueColor,
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
                              style={styles.stopPointOntimeIcon}
                              resizeMode="contain"
                            />
                          ) : null}
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                {props.showTimer ? (
                  <View style={styles.showTimerContainer}>
                    <View style={styles.showEmpListCnntainer}>
                      <TouchableOpacity
                        onPress={() => {
                          props.showEmpListModal();
                        }}
                        style={styles.showEmpListModalButton}
                      >
                        <Image
                          source={imagePath.grpup_absent}
                          resizeMode="contain"
                          style={styles.groupAbsentIconStyle}
                        />
                        {nextPickupData?.onBoardPassengers === null ? (
                          <Text style={styles.passengersCountText}>
                            {nextPickupData?.deBoardPassengers?.length}
                          </Text>
                        ) : (
                          <Text style={styles.passengersCountText}>
                            {nextPickupData?.onBoardPassengers?.length}
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
                          onComplete={() => {
                            props.timesUp("multipleUser");
                          }}
                        >
                          {({ remainingTime }) => {
                            return (
                              <View>
                                <Text style={styles.timerRemainingMinutesText}>
                                  {remainingTime}
                                </Text>
                                <Text style={styles.timerRemainingSecText}>
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
                  <View style={styles.escortDetailRightContainer}>
                    <View style={styles.showEmpListCnntainer}>
                      <TouchableOpacity
                        onPress={() => {
                          // showEmpList.current.show();
                          props.showEmpListModal();
                        }}
                        style={styles.showEmpListModalButton}
                      >
                        <Image
                          source={imagePath?.grpup_absent}
                          resizeMode="contain"
                          style={styles.groupAbsentIconStyle}
                        />
                        {nextPickupData?.onBoardPassengers === null ? (
                          <Text style={styles.passengersCountText}>
                            {nextPickupData.deBoardPassengers.length}
                          </Text>
                        ) : (
                          <Text style={styles.passengersCountText}>
                            {nextPickupData?.onBoardPassengers.length}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )
          ) : (
            <View style={styles.escortHomeLocationContainer}>
              <View style={styles.escortDetailContainer}>
                <View style={styles.rowContainer}>
                  <View style={styles.stopPointIconContainer}>
                    {nextPickupData?.onBoardPassengers ? (
                      <Image
                        source={imagePath.nodleIcon}
                        style={styles.nextpickupIcon}
                      />
                    ) : (
                      <Image
                        source={imagePath.officeMarker}
                        style={styles.nextpickupIcon}
                      />
                    )}
                  </View>
                  <View style={styles.stopPointNameConntainer}>
                    <TouchableOpacity onPress={props.showQrCodeMoal}>
                      {nextPickupData?.onBoardPassengers ? (
                        <Text style={styles.addressTextStyle} numberOfLines={4}>
                          {nextPickupData?.location.locName}
                        </Text>
                      ) : (
                        <Text style={styles.addressTextStyle} numberOfLines={4}>
                          {nextPickupData?.deBoardPassengers[0]?.officeName +
                            " - " +
                            nextPickupData?.deBoardPassengers[0]?.officeLocation
                              ?.locName}
                        </Text>
                      )}
                    </TouchableOpacity>

                    <View style={styles.etaAndTimeContainer}>
                      <View style={styles.timeContainerBox}>
                        <View style={styles.timeContainerBoxRow}>
                          <Image
                            source={imagePath.actualtime}
                            style={styles.stopPointTimeIcon}
                          />
                          <Text style={styles.stopPointTimeText}>
                            {moment
                              .utc(nextPickupData?.expectedArivalTimeStr)
                              //.local()
                              .format("HH:mm")}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.timeContainerBox}>
                        <View style={styles.timeContainerBoxRow}>
                          <Image
                            source={imagePath.ETA}
                            style={styles.stopPointTimeIcon}
                          />
                          {/* <Text style={styles.stopPointTimeText}>
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
                            style={styles.stopPoinntTimeBoxDelayEarlyContainer}
                          >
                            <Image
                              style={styles.stopPointTimeBoxDelayEarlyIcon}
                              source={imagePath.delayIcon}
                              resizeMode="contain"
                            />
                            <Text
                              style={{
                                color:
                                  minutes > 0
                                    ? colors.redColor
                                    : colors.lightBlueColor,
                                marginLeft: 5,
                                fontSize: 12,
                              }}
                            >
                              +{minutes} min
                            </Text>
                          </View>
                        ) : minutes < 0 ? (
                          <View
                            style={styles.stopPoinntTimeBoxDelayEarlyContainer}
                          >
                            <Image
                              style={styles.stopPointTimeBoxDelayEarlyIcon}
                              source={imagePath.earlyIcon}
                              resizeMode="contain"
                            />
                            <Text
                              style={{
                                color:
                                  minutes > 0
                                    ? colors.redColor
                                    : colors.lightBlueColor,
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
                            style={styles.stopPointOntimeIcon}
                            resizeMode="contain"
                          />
                        ) : null}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              {props.showTimer ? (
                <View style={styles.showTimerContainer}>
                  <View style={styles.showEmpListCnntainer}>
                    <TouchableOpacity
                      onPress={() => {
                        props.showEmpListModal();
                      }}
                      style={styles.showEmpListModalButton}
                    >
                      <Image
                        source={imagePath.grpup_absent}
                        resizeMode="contain"
                        style={styles.groupEmpIcon}
                      />
                      {nextPickupData?.onBoardPassengers === null ? (
                        <Text style={styles.passengersCountText}>
                          {nextPickupData?.deBoardPassengers?.length}
                        </Text>
                      ) : (
                        <Text style={styles.passengersCountText}>
                          {nextPickupData?.onBoardPassengers?.length}
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
                        onComplete={() => {
                          props.timesUp("multipleUser");
                        }}
                      >
                        {({ remainingTime }) => {
                          return (
                            <View>
                              <Text style={styles.escortRemainingTimeText}>
                                {remainingTime}
                              </Text>
                              <Text style={styles.escortSecText}>Sec</Text>
                            </View>
                          );
                        }}
                      </CountdownCircleTimer>
                    ) : null}
                  </View>
                </View>
              ) : (
                <View style={styles.escortDetailRightContainer}>
                  <View style={styles.showEmpListCnntainer}>
                    <TouchableOpacity
                      onPress={() => {
                        props.showEmpListModal();
                      }}
                      style={styles.showEmpListModalButton}
                    >
                      <Image
                        source={imagePath?.grpup_absent}
                        resizeMode="contain"
                        style={styles.groupEmpIcon}
                      />
                      {nextPickupData?.onBoardPassengers === null ? (
                        <Text style={styles.passengersCountText}>
                          {nextPickupData.deBoardPassengers.length}
                        </Text>
                      ) : (
                        <Text style={styles.passengersCountText}>
                          {nextPickupData?.onBoardPassengers.length}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>

        {nextPickupData?.onBoardPassengers ? (
          <>
            <NextPickupLocationComp
              height={BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT}
              nextPickupData={nextPickupData}
              nextPickupLocation={props.nextPickupLocation}
              actualETA={actualETA}
              onPress={() => {
                setisFullAddressVisible(true);
              }}
            />
          </>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGary,
  },
  escortDetailRightContainer: {
    width: "30%",
    alignItems: "center",
    //backgroundColor: 'red',
  },

  qrCodeAndOtpContainer: {
    backgroundColor: "transparent",
    width: "100%",
    shadowColor: colors.black,
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    marginTop: moderateScale(-105),
    justifyContent: "space-between",
    paddingHorizontal: 10,
    height: 100,
  },

  dragbleArea: {
    width: "100%",
    height: moderateScale(30),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    //marginTop: moderateScaleVertical(20),
    // backgroundColor: "red",
  },

  tripDetails: {
    borderRadius: moderateScale(4),
    backgroundColor: colors.white,
    height: "75%",
  },

  vaccinationImgContainer: {
    zIndex: 99,
    width: "20%",
  },
  vaccinationImgStyle: {
    width: moderateScale(width / 5.5),
    height: moderateScale(width / 5.5),
  },
  driverImg: {
    position: "absolute",
    width: moderateScale(width / 7.9),
    height: moderateScale(width / 7.9),
    top: moderateScale(width / 36),
    left: moderateScale(width / 37.5),
    borderRadius: moderateScale(50),
  },
  nextPickupContainer: {
    // flex: 1,
    flexDirection: "row",
    marginHorizontal: moderateScale(8),
    //marginTop: moderateScaleVertical(10),
    alignItems: "center",
    marginBottom: moderateScaleVertical(20),
    height: "44%",
  },
  nextPickupLeftContainer: {
    flex: 0.6,
    justifyContent: "center",
  },
  nextPickupText: {
    color: colors.darkSkyBlue,
    fontSize: textScale(14),
    fontFamily: fontFamily.robotoRegular,
  },
  deliveryTruckIcon: {
    width: moderateScale(width / 2.2),
    height: moderateScale(width / 5),
  },
  deliveryTruckContainer: {
    marginTop: moderateScaleVertical(5),
  },
  nextpickupIcon: {
    width: moderateScale(width / 20),
    height: moderateScale(width / 16),
    // backgroundColor:'red'
  },
  nextPickupDetailsContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(5),
    marginVertical: moderateScaleVertical(10),
  },
  nextPickupBody: {
    marginHorizontal: moderateScale(7),
  },
  nextPickup: {
    fontSize: textScale(10),
    color: colors.gray,
    fontFamily: fontFamily.robotoRegular,
    marginVertical: moderateScaleVertical(2),
    width: 90,
  },
  etaContainer: {
    backgroundColor: colors.skyBlue,
    flexDirection: "row",
    paddingHorizontal: moderateScale(5),
    alignItems: "center",
    borderRadius: moderateScale(8),
    paddingVertical: moderateScaleVertical(2),
    width: 87,
  },
  clockWhiteImg: {
    width: moderateScale(width / 35),
    height: moderateScale(width / 35),
  },
  etaTextStyle: {
    fontSize: textScale(9),
    color: colors.white,
    fontFamily: fontFamily.robotoRegular,
    marginLeft: moderateScale(5),
  },
  nextPickupRightContainer: {
    flex: 0.4,
    alignSelf: "center",
  },

  deliveryInfographic: {
    width: moderateScale(width / 3),
    height: moderateScale(width / 6),
    resizeMode: "cover",
  },
  detailContainer: {
    width: "100%",
    paddingHorizontal: 10,
    marginLeft: -10,
    //backgroundColor: "green",
  },
  empNameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.blueBackground,
    textDecorationLine: "underline",
  },
  ratingContainerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -5,
  },
  ratingContainer: {
    marginTop: 5,
    alignItems: "flex-start",
  },
  empLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  addressTextStyle: {
    fontSize: 12,
    marginLeft: 5,
    color: colors.blueBackground,
    textDecorationLine: "underline",
  },
  showTimerContainer: {
    width: "30%",
  },
  showEmpListCnntainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  showEmpListModalButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  groupAbsentIconStyle: {
    height: 30,
    width: 30,
  },
  passengersCountText: { fontSize: 12, color: colors.black },
  timerRemainingMinutesText: {
    color: "#616161",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  timerRemainingSecText: {
    color: "#616161",
    fontWeight: "bold",
    fontSize: 11,
    textAlign: "center",
  },
  escortHomeLocationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: moderateScaleVertical(15),
    alignItems: "center",
    marginTop: -5,
  },
  showTimerContainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  escortDetailContainerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  escortDetailContainerLeftContainer: {
    width: "70%",
  },
  escortDetailContainerRightContainer: {
    width: "28%",
  },
  showEmpListButtonContainer: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  absentEmpIconBlue: { height: 30, width: 30 },
  stopPointTimeContainer: {
    flexDirection: "row",
    marginTop: -8,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  stopPointTimeBox: {
    borderWidth: 1,
    borderColor: colors.lightGary,
    paddingHorizontal: 5,
    paddingVertical: 5,
    width: 65,
  },
  stopPointTimeBoxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stopPointTimeIcon: { height: 14, width: 14 },
  stopPointTimeText: {
    marginLeft: 5,
    fontSize: 12,
    color: colors.black,
  },
  stopPoinntTimeBoxDelayEarlyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
  },
  stopPointTimeBoxDelayEarlyIcon: { height: 15, width: 15 },
  stopPointOntimeIcon: { height: 20, width: 20, marginLeft: 5 },
  escortRemainingTimeText: {
    color: "#616161",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  escortSecText: {
    color: "#616161",
    fontWeight: "bold",
    fontSize: 11,
    textAlign: "center",
  },
  vaccineAndGenderIconContainer: { width: "20%" },
  escortDetailContainer: { width: "65%" },
  rowContainer: { flexDirection: "row" },
  stopPointIconContainer: { width: "10%" },
  stopPointNameConntainer: { width: "90%" },
  etaAndTimeContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  timeContainerBox: {
    borderWidth: 1,
    borderColor: colors.lightGary,
    paddingHorizontal: 5,
    paddingVertical: 5,
    width: 70,
  },
  timeContainerBoxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeTextStyle: {
    marginLeft: 5,
    fontSize: 12,
    color: colors.black,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
  },
  groupEmpIcon: {
    height: 30,
    width: 30,
  },
});
export default memo(EscortDetailsDownTrip);
