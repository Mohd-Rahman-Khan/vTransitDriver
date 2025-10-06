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
import React, { useRef, useState, memo } from "react";
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
import UpTripHomeLocation from "./Components/UpTripHomeLocation";
import UpTripNodalPointComp from "./Components/UpTripNodalPointComp";
import ToolTipButtons from "./Components/ToolTipButtons";
import NextPickupLocationComp from "./Components/NextPickupLocationComp";
import { getDelayOrEarlyMinutes } from "../../../utils/utils";
import Geolocation from "react-native-geolocation-service";

const moment = extendMoment(Moment);

function EmpottomModal(props) {
  const [indexValue, setIndexValue] = useState();
  const [toolTipVisible, setToolTipVisible] = useState(false);
  const [isShowTooltip, setisShowTooltip] = useState(false);
  const [showTooltipModal, setshowTooltipModal] = useState(false);
  const [isShutterOpen, setisShutterOpen] = useState(false);
  const [isFullAddressVisible, setisFullAddressVisible] = useState(false);
  var nextPickupData = props.data;

  let actualETA = moment
    .utc(props.nextPickupLocation?.expectedArivalTimeStr)
    //.local()
    .format("HH:mm");
  const BOTTOM_SHEET_MAX_HEIGHT =
    nextPickupData?.stopType === "NODAL"
      ? 220
      : nextPickupData?.onBoardPassengers
      ? 290
      : 160;

  const BOTTOM_SHEET_MIN_HEIGHT =
    nextPickupData?.stopType === "NODAL"
      ? 120
      : nextPickupData?.onBoardPassengers?.length === 1 ||
        nextPickupData?.deBoardPassengers?.length === 1
      ? 145
      : 125;

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
      let minutesDiff = getDelayOrEarlyMinutes(
        nextPickupData?.expectedArivalTime,
        nextPickupData?.actualArivalTime
      );

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
        let minutesDiff = getDelayOrEarlyMinutes(
          nextPickupData?.expectedArivalTime,
          nextPickupData?.actualArivalTime
        );

        if (minutesDiff === 0) {
          ontime = "yes";
        } else {
          minutes = minutesDiff;
          ontime = "";
        }
      }
    } else {
      let minutesDiff = getDelayOrEarlyMinutes(
        nextPickupData?.expectedArivalTime,
        nextPickupData?.updatedArivalTime
      );

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
  return (
    <Animated.View
      style={[
        {
          height: BOTTOM_SHEET_MAX_HEIGHT,
          width: width,
          backgroundColor: colors.white,
          position: "absolute",
          borderTopLeftRadius: moderateScale(15),
          borderTopRightRadius: moderateScale(15),
          bottom: BOTTOM_SHEET_MIN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT,
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

          {nextPickupData?.stopType ? (
            nextPickupData?.stopType === "HOME" ||
            nextPickupData?.stopType === "ESCORT" ? (
              <>
                <UpTripHomeLocation
                  nextPickupData={nextPickupData}
                  showTimer={props?.showTimer}
                  notshow={props?.notshow}
                  moment={moment}
                  minutes={minutes}
                  ontime={ontime}
                  timerDuration={props?.timerDuration}
                  showQrCodeMoal={props?.showQrCodeMoal}
                  showAbsentButton={props?.showAbsentButton}
                  showEmpListModal={props?.showEmpListModal}
                  timesUp={props.timesUp}
                  tripType={props?.tripType}
                  driverAppSettingData={props?.driverAppSettingData}
                />
              </>
            ) : (
              <UpTripNodalPointComp
                nextPickupData={nextPickupData}
                showTimer={props?.showTimer}
                notshow={props?.notshow}
                moment={moment}
                minutes={minutes}
                ontime={ontime}
                timerDuration={props?.timerDuration}
                showQrCodeMoal={props?.showQrCodeMoal}
                showAbsentButton={props?.showAbsentButton}
                showEmpListModal={props?.showEmpListModal}
                timesUp={props.timesUp}
                tripType={props?.tripType}
                driverAppSettingData={props?.driverAppSettingData}
              />
            )
          ) : nextPickupData?.onBoardPassengers?.length === 1 ||
            nextPickupData?.deBoardPassengers?.length === 1 ? (
            <>
              <UpTripHomeLocation
                nextPickupData={nextPickupData}
                showTimer={props?.showTimer}
                notshow={props?.notshow}
                moment={moment}
                minutes={minutes}
                ontime={ontime}
                timerDuration={props?.timerDuration}
                showQrCodeMoal={props?.showQrCodeMoal}
                showAbsentButton={props?.showAbsentButton}
                showEmpListModal={props?.showEmpListModal}
                timesUp={props.timesUp}
                tripType={props?.tripType}
                driverAppSettingData={props?.driverAppSettingData}
              />
            </>
          ) : (
            <UpTripNodalPointComp
              nextPickupData={nextPickupData}
              showTimer={props?.showTimer}
              notshow={props?.notshow}
              moment={moment}
              minutes={minutes}
              ontime={ontime}
              timerDuration={props?.timerDuration}
              showQrCodeMoal={props?.showQrCodeMoal}
              showAbsentButton={props?.showAbsentButton}
              showEmpListModal={props?.showEmpListModal}
              timesUp={props.timesUp}
              tripType={props?.tripType}
              driverAppSettingData={props?.driverAppSettingData}
            />
          )}
        </View>

        {nextPickupData?.onBoardPassengers ? (
          <NextPickupLocationComp
            height={BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT}
            nextPickupData={nextPickupData}
            nextPickupLocation={props.nextPickupLocation}
            actualETA={actualETA}
            onPress={() => {
              setisFullAddressVisible(true);
            }}
          />
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
  },
  tripDetails: {
    borderRadius: moderateScale(4),
    backgroundColor: colors.white,
    height: "75%",
    marginTop: 20,
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
  vaccinationImgContainer: {
    zIndex: 99,
    width: "20%",
    //marginRight: moderateScale(-20),
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
});
export default memo(EmpottomModal);
