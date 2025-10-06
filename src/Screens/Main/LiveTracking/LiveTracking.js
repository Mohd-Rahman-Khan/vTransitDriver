import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  memo,
  DeviceEventEmitter,
  useMemo,
} from "react";
import {
  Image,
  Text,
  View,
  Linking,
  AppState,
  Platform,
  Dimensions,
  Alert,
  Vibration,
  StyleSheet,
  StatusBar,
  Modal,
} from "react-native";
import ButtonComp from "../../../Components/ButtonComp";
import WrapperContainer from "../../../Components/WrapperContainer";
import imagePath from "../../../constants/imagePath";
import strings from "../../../constants/lang";
import colors from "../../../styles/colors";
import {
  height,
  moderateScaleVertical,
  width,
} from "../../../styles/responsiveSize";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import navigationStrings from "../../../navigation/navigationStrings";
import NextTripModal from "../../../Components/NextTripModal";
import QRCodeMoal from "./QRCodeMoal";
import EmpDetailBottomModal from "./EmpDetailBottomModal";
import Header from "../../../Components/Header";
import SosBottomSheet from "../../../Components/SosBottomSheet";
import actions from "../../../redux/actions";
import SwipeButton from "rn-swipe-button";
import {
  ADD_POLYLINE_DATA,
  CALLING_API,
  DOC_URL,
  DRIVER_NEXT_RIDE,
  DRIVER_ONGOING_RIDE,
} from "../../../config/urls";
import { showError, showSuccess } from "../../../utils/helperFunction";
import DraggableButton from "../../../Components/DraggableButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RatingComp from "../../../Components/RatingComp";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { useFocusEffect } from "@react-navigation/native";
import ShowEmpList from "./ShowEmpList";
import ShowStopPointEmpList from "./ShowStopPointEmpList";
import EmpDetailBottomDownTripModal from "./EmpDetailBottomDownTripModal";
import { useSelector } from "react-redux";
import socketServices from "../../../utils/socketServices";
import Geolocation from "@react-native-community/geolocation";
import KeepAwake from "react-native-keep-awake";
import LiveTrackMapGoogle from "../../../Components/LiveTrackMapGoogle";
// import {
//   showFloatingBubble,
//   hideFloatingBubble,
//   requestPermission,
//   initialize,
//   checkPermission,
// } from "react-native-floating-bubble";
import { lineSlice, nearestPointOnLine, pointToLineDistance } from "@turf/turf";
import PolylineA from "@mapbox/polyline";
import {
  addActualArrivalTimeInCurrentTime,
  getDelayOrEarlyMinutes,
  getDistanceOfTwoPoints,
  getDynamicEta,
  getItem,
  removeUserData,
  setItem,
} from "../../../utils/utils";
import {
  imageCompress,
  snapShotImageCompress,
} from "../../../utils/imageCompressor";
import EscortDetailsDownTrip from "./EscortDetailsDownTrip";
import Sound, { setCategory } from "react-native-sound";
import EmpListForCall from "./Components/EmpListForCall";
import EmpPermPopupForCall from "../../../Components/EmpPermPopupForCall";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";
import TollTaxAndParkingModal from "../../../Components/TollTaxAndParkingModal";
import InfoSheet from "../../../Components/InfoSheet";
import SimCardsManagerModule from "react-native-sim-cards-manager";
import { IVR_NUMBER } from "../../../constants/IVRCallingNumber";
import BackgroundTimer from "react-native-background-timer";
import { BarIndicator } from "react-native-indicators";
import NetInfo from "@react-native-community/netinfo";
import ShowEmpListDownTrip from "./ShowEmpListDownTrip";
import * as geolib from "geolib";
import { GOOGLE_MAP_APIKEY } from "../../../constants/googleMapKey";

const infoList = [
  {
    icon: imagePath.upTrip,
    name: "Login Shift",
  },
  {
    icon: imagePath.downTrip,
    name: "Logout Shift",
  },
  {
    icon: imagePath.escort,
    name: "Escort",
  },
  {
    icon: imagePath.escortCancelled,
    name: "Skip Escort",
  },
  {
    icon: imagePath.tollParkingBlack,
    name: "Toll Tax And Parking",
  },
  {
    icon: imagePath.call,
    name: "Call",
  },
  {
    icon: imagePath.current_location,
    name: "Recenter",
  },
  {
    icon: imagePath.play_button,
    name: "Navigate",
  },
  {
    icon: imagePath.skippedIcon,
    name: "Skipped",
  },
  {
    icon: imagePath.absent_emp_icon_blue,
    name: "Absent Employee",
  },
  {
    icon: imagePath.officeMarker,
    name: "Office Marker",
  },
  {
    icon: imagePath.homeMapIcon,
    name: "Home Location Marker",
  },
  {
    icon: imagePath.nodleIcon,
    name: "Nodal Point Marker",
  },
  {
    icon: imagePath.noShowIcon,
    name: "Noshow",
  },
  {
    icon: imagePath.absent,
    name: "Absent",
  },
  {
    icon: imagePath.remove,
    name: "Cancel",
  },
  {
    icon: imagePath.actualtime,
    name: "Expected arrival time",
  },
  {
    icon: imagePath.ETA,
    name: "Actual arrival time",
  },
];

const moment = extendMoment(Moment);

const LiveTracking = ({ route }) => {
  const navigation = useNavigation();
  const [ongoingRideData, setongoingRideData] = useState("");
  const [showTripModal, setshowTripModal] = useState(false);
  const [showDragButton, setshowDragButton] = useState(false);
  const [nextTripPopupData, setnextTripPopupData] = useState("");
  const sosBottomSheetRef = useRef();
  const [tripId, settripId] = useState("");
  const [chatMessage, setchatMessage] = useState("");
  const [otp, setotp] = useState("");
  const [showcompleteRide, setshowcompleteRide] = useState(false);
  const [ratingEmpList, setratingEmpList] = useState([]);
  const [tripType, settripType] = useState("");
  const [routee, setroute] = useState("");
  const [data, setData] = useState("");
  const [showmap, setshowmap] = useState(false);
  const [tripStartTime, settripStartTime] = useState();
  const [showNextStopBottomModal, setshowNextStopBottomModal] = useState(false);
  const [timerDuration, settimerDuration] = useState(180);
  const [showTimer, setshowTimer] = useState(false);
  const [lastPoint, setlastPoint] = useState("");
  const [driverCurrentCoordinate, setdriverCurrentCoordinate] = useState();
  const [nextPickupLocation, setnextPickupLocation] = useState("");
  const [attandanceEmployeeList, setattandanceEmployeeList] = useState([]);
  const [stopPointEmpList, setstopPointEmpList] = useState([]);
  const [notshow, setnotshow] = useState(false);
  const [sosSetting, setSOSSetting] = useState();
  const [passengersListType, setpassengersListType] = useState("");
  const [driverReachOffice, setdriverReachOffice] = useState(false);
  const [allEmpList, setallEmpList] = useState([]);
  const [empListForCall, setempListForCall] = useState([]);
  const [showErrorMessage, setshowErrorMessage] = useState(false);
  const [errorMessage, seterrorMessage] = useState("Invalid");
  const [completeRideData, setcompleteRideData] = useState("");
  const [showstopPointDetail, setshowstopPointDetail] = useState(false);
  const [isThisOffice, setisThisOffice] = useState(false);
  const isFocused = useIsFocused();
  const [showEmpDetailModal, setshowEmpDetailModal] = useState(false);
  const [showQrCodeModalPopup, setshowQrCodeModalPopup] = useState(false);
  const [destination, setdestination] = useState("");
  const [wayPoints, setwayPoints] = useState([]);
  const [errorMessageColor, seterrorMessageColor] = useState("black");
  const [inputBoxColor, setinputBoxColor] = useState("black");
  const [wayPointsIds, setwayPointsIds] = useState([]);
  const [showReachedAlert, setshowReachedAlert] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [showLoader, setshowLoader] = useState(false);
  const [isQrCodeOpened, setisQrCodeOpened] = useState(false);
  const [isRatingListSet, setisRatingListSet] = useState(false);
  const [showAbsentButton, setshowAbsentButton] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [polyLineGenerated, setpolyLineGenerated] = useState(false);
  const [travelledCoords, settravelledCoords] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState();
  const [routeCord, setRouteCord] = useState();
  const [reGenneratePolyline, setreGenneratePolyline] = useState(false);
  const [coveredRouteCord, setCoveredRouteCord] = useState([]);
  const [snapShotUri, setsnapShotUri] = useState("");
  const [showAbsentConfirm, setshowAbsentConfirm] = useState(false);
  const [mapdraggable, setmapdraggable] = useState(true);
  const [totalEmpCount, settotalEmpCount] = useState([]);
  const [isEscort, setIsEscort] = useState(false);
  const [escortStatus, setEscortStatus] = useState("");
  const [isThisEscortTrip, setisThisEscortTrip] = useState(false);
  const [speedInKmPerH, setspeedInKmPerH] = useState(0);
  const [showEmpListForCall, setshowEmpListForCall] = useState(false);
  const [routingRule, setroutingRule] = useState("");
  const [empDataForCalling, setempDataForCalling] = useState("");
  const [showEmpPermPopupForCall, setshowEmpPermPopupForCall] = useState(false);
  const [showTollTaxSheet, setshowTollTaxSheet] = useState(false);
  const [chargeCategory, setchargeCategory] = useState("");
  const [amount, setamount] = useState("");
  const [documentUri, setdocumentUri] = useState("");
  const [documentName, setdocumentName] = useState("");
  const [networkUri, setnetworkUri] = useState("");
  const [showInfoList, setshowInfoList] = useState(false);
  const [loadingButton, setloadingButton] = useState(false);
  const empListForCalling = useRef();
  const [barStyle, setBarStyle] = useState("dark-content");
  const [translucent, setTranslucent] = useState(true);
  const [tollName, settollName] = useState("");
  const [outofGeofencePopup, setoutofGeofencePopup] = useState(false);
  const [driverAppSettingData, setdriverAppSettingData] = useState("");
  const [waypointsDynamicETA, setwaypointsDynamicETA] = useState([]);
  const [count, setcount] = useState(0);
  const [count2, setcount2] = useState(0);
  const [allStopPointDynamicETA, setallStopPointDynamicETA] = useState("");
  const [driverCurrentPoint, setdriverCurrentPoint] = useState("");
  const [driverLastPoint, setdriverLastPoint] = useState("");
  const [empShortId, setempShortId] = useState("");
  const [isDynamicEtaCalled, setisDynamicEtaCalled] = useState(false);
  const [showAttendenceLoading, setshowAttendenceLoading] = useState(false);
  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );
  const getBoardEmpData = useSelector(
    (state) => state?.getEmployeeBoardedData?.boardEmpData
  );

  const getNewRideData = useSelector((state) => state?.newRideAssignReducer);
  const mapRef = useRef();
  const driverMarkerRef = useRef();
  const showRating = useRef();
  const infoSheet = useRef();
  const openEmpListModal = useRef();

  var overSpeedHooter;
  var nightHooter;
  var nightHooterInterval;
  var timer;
  var stoppageTimer;

  var tempInterV;
  var gpsSignalTimer;

  /////// *********************** Dynamic ETA Code according to timer   ***********************
  //                                    ----******* START CODE ********---
  // useEffect(() => {
  //   if (driverAppSettingData && data && ongoingRideData) {
  //     if (data?.data[0]?.tripType == "DOWNTRIP") {
  //       if (driverAppSettingData?.allowDynamicETAInDowntrip == "YES") {
  //         if (driverAppSettingData?.timeSchedulerToGetDynamicETA) {
  //           clearInterval(tempInterV);
  //           timer = BackgroundTimer.setInterval(() => {
  //             if (data) {
  //               getExpectedArrivalTime();
  //             }
  //           }, 60000 * driverAppSettingData?.timeSchedulerToGetDynamicETA);
  //           return () => BackgroundTimer.clearInterval(timer);
  //         } else {
  //         }
  //       }
  //     } else {
  //       if (driverAppSettingData?.allowDynamicETAInUptrip == "YES") {
  //         if (driverAppSettingData?.timeSchedulerToGetDynamicETA) {
  //           clearInterval(tempInterV);
  //           timer = BackgroundTimer.setInterval(
  //             () => {
  //               if (data) {
  //                 getExpectedArrivalTime();
  //               }
  //             },

  //             60000 * driverAppSettingData?.timeSchedulerToGetDynamicETA
  //           );
  //           return () => BackgroundTimer.clearInterval(timer);
  //         } else {
  //         }
  //       } else {
  //       }
  //     }
  //   } else {
  //     tempInterV = setTimeout(() => {
  //       setcount(count + 1);
  //     }, 15000);
  //   }
  // }, [count, driverAppSettingData]);

  // useEffect(() => {
  //   if (driverAppSettingData && data) {
  //     setisDynamicEtaCalled(true);
  //     if (isDynamicEtaCalled == false) {
  //       if (data?.data[0]?.tripType == "DOWNTRIP") {
  //         if (driverAppSettingData?.allowDynamicETAInDowntrip == "YES") {
  //           getExpectedArrivalTime();
  //         }
  //       } else {
  //         if (driverAppSettingData?.allowDynamicETAInUptrip == "YES") {
  //           getExpectedArrivalTime();
  //         } else {
  //         }
  //       }
  //     }
  //   } else {
  //     setisDynamicEtaCalled(false);
  //   }
  // }, [driverAppSettingData, isDynamicEtaCalled, data]);

  //                                          ----******* END CODE ********---
  /////// *********************** Dynamic ETA Code according to timer   ***********************

  useEffect(() => {
    if (driverAppSettingData && data && ongoingRideData) {
      checkGpsSignalStatus();
      stoppageTimer = BackgroundTimer.setInterval(() => {
        if (data) {
          getDriverStoppage();
        }
      }, 60000);
      return () => BackgroundTimer.clearInterval(stoppageTimer);
    } else {
      setTimeout(() => {
        setcount2(count2 + 1);
      }, 15000);
    }
  }, [count2, driverAppSettingData]);

  useEffect(() => {
    if (ongoingRideData && routingRule) {
      if (ongoingRideData?.onBoardPassengers) {
        if (
          ongoingRideData?.onBoardPassengers[0]?.tripType == "UPTRIP" &&
          ongoingRideData?.status == "SCHEDULE"
        ) {
          let travelTimeVoilationTimer = BackgroundTimer.setInterval(() => {
            checkTravelTimeVoilation();
            checkSendSmsAbountToReach();
          }, 15000);

          return () => BackgroundTimer.clearInterval(travelTimeVoilationTimer);
        } else {
        }
      } else if (ongoingRideData?.deBoardPassengers) {
        if (
          ongoingRideData?.deBoardPassengers[0]?.tripType == "UPTRIP" &&
          ongoingRideData?.status == "SCHEDULE"
        ) {
          let travelTimeVoilationTimer = BackgroundTimer.setInterval(() => {
            checkTravelTimeVoilation();
            checkSendSmsAbountToReach();
          }, 15000);

          return () => BackgroundTimer.clearInterval(travelTimeVoilationTimer);
        }
      }
    }
  }, [ongoingRideData, routingRule]);

  useEffect(() => {
    if (route?.params?.status) {
      setBarStyle("dark-content");
    }
    Sound.setCategory("Playback", true);
    return () => {
      if (overSpeedHooter) overSpeedHooter.release();
    };
  }, []);
  useEffect(() => {
    Sound.setCategory("Playback", true);
    return () => {
      if (nightHooter) nightHooter.release();
    };
  }, []);

  useEffect(() => {
    checkTimeForNightHooter();
  }, [driverAppSettingData]);

  useEffect(() => {
    if (tripType?.toUpperCase()?.trim() === "UPTRIP") {
      let escortStatusDetail = data?.data?.[0]?.stopList?.[
        data?.data?.[0]?.stopList?.length - 1
      ]?.deBoardPassengers?.filter((ele, index) => {
        return ele?.passType?.toUpperCase()?.trim() == "ESCORT";
      });

      setEscortStatus(escortStatusDetail?.[0]?.status?.toUpperCase()?.trim());
    } else {
      let escortStatusDetail =
        data?.data?.[0]?.stopList?.[0]?.onBoardPassengers?.filter(
          (ele, index) => {
            return ele?.passType?.toUpperCase()?.trim() == "ESCORT";
          }
        );

      setEscortStatus(escortStatusDetail?.[0]?.status?.toUpperCase()?.trim());
    }
  }, [data]);

  useEffect(() => {
    _getSOSSetting();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setshowLoader(true);
      setroute("");
      setdestination("");
      setwayPoints([]);
      setwayPointsIds([]);
      getDriverNextRide();
      getDriverAppSetting();
      getDriverModulePermissions();
    }, [])
  );
  useFocusEffect(
    useCallback(() => {
      setBarStyle("dark-content");
      setTranslucent(true);
    }, [barStyle])
  );

  useEffect(() => {
    getDistanceOfDriverFromStopPoint();
    checkIsDriverReachInGeofence("default");
  }, [driverCurrentCoordinate, ongoingRideData, driverAppSettingData]);

  useEffect(() => {
    watchPosition();
  }, [driverAppSettingData, tripId]);

  const _getSOSSetting = () => {
    actions
      .getSOSSetting()
      .then((res) => {
        let { status } = res;
        if (status == 200) {
          setSOSSetting(res?.data[0]);
        } else {
        }
      })
      .catch((error) => {});
  };

  useEffect(() => {
    generateGeometrey();
  }, [destination, wayPoints, driverCurrentCoordinate, ongoingRideData]);

  useEffect(() => {
    if (
      destination &&
      wayPoints &&
      ongoingRideData &&
      driverAppSettingData &&
      tripType
    ) {
      if (tripType == "UPTRIP") {
        if (driverAppSettingData?.allowDynamicETAInUptrip == "YES") {
          timer = BackgroundTimer.setInterval(() => {
            getDynamicEtaInsideGeofence();
          }, 25000);
          return () => BackgroundTimer.clearInterval(timer);
        }
      }
    }
  }, [destination, wayPoints, ongoingRideData, driverAppSettingData, tripType]);
  useEffect(() => {
    sendDataToEmpAndDashboard();
  }, [driverCurrentCoordinate, allEmpList, data, allStopPointDynamicETA]);

  useEffect(() => {
    if (isFocused) {
      getItem("coveredCord").then((res) => {
        if (res != null && res?.length) {
          setCoveredRouteCord(res);
        }
      });
      enableAwake(true);

      return () => {
        enableAwake(false);
      };
    } else {
      //stopVibration();
    }
  }, [isFocused]);

  useEffect(() => {
    if (showcompleteRide === false) {
      focusOnCurrentLocation();
    }
  }, [driverCurrentCoordinate]);

  // useEffect(() => {
  //   routeAnimation();
  // }, [driverCurrentCoordinate, data, driverAppSettingData]);
  useEffect(() => {
    routeAnimation();
  }, [driverCurrentCoordinate, data, driverAppSettingData, ongoingRideData]);

  useEffect(() => {
    if (Platform.OS === "android") {
      const subscription = AppState.addEventListener(
        "change",
        (nextAppState) => {
          if (nextAppState === "active") {
            // hideFloatingBubble()
            //   .then(() => {})
            //   .catch(() => {});
          } else {
            // showFloatingBubble(10, 10)
            //   .then(() => {})
            //   .catch((e) => {});
          }
        }
      );

      return () => {
        subscription.remove();
      };
    } else {
    }
  }, []);

  useEffect(() => {
    if (getBoardEmpData) {
      empBoardByQrCodeScan(getBoardEmpData);
    }
  }, [getBoardEmpData]);

  useEffect(() => {
    getDriverOngoingRide();
    getDriverNextRide();
  }, [getNewRideData, driverAppSettingData]);

  const checkGpsSignalStatus = () => {
    gpsSignalTimer = BackgroundTimer.setInterval(() => {
      NetInfo.fetch().then((state) => {
        if (state?.isConnected) {
          socketServices.initializeSocket();
          if (data) {
            sendCoveredPathToApi();
          }
        }
      });
    }, 60000);
    return () => {
      BackgroundTimer.clearInterval(gpsSignalTimer);
    };
  };

  const getRoutingRule = (corporateId) => {
    actions
      .getRoutingRule(corporateId)
      .then((res) => {
        setroutingRule(res?.data);
      })
      .catch((error) => {});
  };

  const sendCoveredPathToApi = async () => {
    let checkOngoingRide = await AsyncStorage.getItem("ongoingRideData");
    if (
      checkOngoingRide === "" ||
      checkOngoingRide === null ||
      checkOngoingRide === undefined
    ) {
    } else {
      let parseOnGoingRideData = JSON.parse(checkOngoingRide);
      if (parseOnGoingRideData.isOngoing) {
        getItem("coveredCord").then((res) => {
          if (res != null && res?.length) {
            let sendingData = {
              tripId: data?.data[0]?.id,
              latLongList: res,
            };

            actions
              .saveTripLatLong(sendingData)
              .then((response) => {})
              .catch((error) => {});
          }
        });
      }
    }
  };

  const getDriverStoppage = async () => {
    let DriverLastPoint = await AsyncStorage.getItem("DriverLastPoint");

    let checkOngoingRide = await AsyncStorage.getItem("ongoingRideData");
    if (
      checkOngoingRide === "" ||
      checkOngoingRide === null ||
      checkOngoingRide === undefined
    ) {
    } else {
      let parseOnGoingRideData = JSON.parse(checkOngoingRide);
      if (parseOnGoingRideData.isOngoing) {
        Geolocation.getCurrentPosition(
          (position) => {
            if (DriverLastPoint) {
              let driverLastPoint = JSON.parse(DriverLastPoint);

              let driverCurrentPoint = {
                lat: position?.coords?.latitude,
                lng: position?.coords?.longitude,
              };
              let driverLastPointCoords = {
                lat: driverLastPoint?.coords?.latitude,
                lng: driverLastPoint?.coords?.longitude,
              };

              var ky = 40000 / 360;
              var kx =
                Math.cos((Math.PI * driverLastPointCoords.lat) / 180.0) * ky;
              var dx =
                Math.abs(driverLastPointCoords.lng - driverCurrentPoint.lng) *
                kx;
              var dy =
                Math.abs(driverLastPointCoords.lat - driverCurrentPoint.lat) *
                ky;

              let distanceInKM = Math.sqrt(dx * dx + dy * dy);
              let distanceInMeter = distanceInKM * 1000;

              setItem("DriverCurrentPoint", position);
              setItem("DriverLastPoint", position);

              if (distanceInMeter < 5) {
                callStoppageApi(driverCurrentPoint);
              } else {
              }
            } else {
              setItem("DriverLastPoint", position);
              setItem("DriverCurrentPoint", position);
            }
          },
          (error) => {
            showError(error);
          },
          { enableHighAccuracy: false, timeout: 20000 }
        );
      }
    }
  };

  const callStoppageApi = (driverCurrentPoint) => {
    //data.data[0].stopList

    let getStopDetail = data.data[0].stopList.find(
      (listItem) =>
        listItem.status === "SCHEDULE" || listItem.status == "ARRIVED"
    );

    if (getStopDetail) {
      let driverLastPointCoords = {
        lat: getStopDetail?.location?.latitude,
        lng: getStopDetail?.location?.longitude,
      };

      var ky = 40000 / 360;
      var kx = Math.cos((Math.PI * driverLastPointCoords.lat) / 180.0) * ky;
      var dx =
        Math.abs(driverLastPointCoords.lng - driverCurrentPoint.lng) * kx;
      var dy =
        Math.abs(driverLastPointCoords.lat - driverCurrentPoint.lat) * ky;

      let distanceInKM = Math.sqrt(dx * dx + dy * dy);
      let distanceInMeter = distanceInKM * 1000;

      if (distanceInMeter > 500) {
        const timeObjectCreate = new Date();
        let currentTime = timeObjectCreate.getTime();
        let sendingData = {
          id: getStopDetail?.id,
          tripId: getStopDetail?.tripId,

          location: {
            locName: "",
            latitude: driverCurrentPoint?.lat,
            longitude: driverCurrentPoint?.lng,
          },
          vehicleStoppageShield: "YES",
        };

        actions
          .stoppageHistory(sendingData)
          .then((response) => {})
          .catch((error) => {});
      }
    }
  };

  // const getExpectedArrivalTime = async () => {
  //   actions.getRide(DRIVER_ONGOING_RIDE).then((res) => {
  //     if (res?.status === 200) {
  //       if (res?.data.length > 0) {
  //         let getStopDetail = res?.data[0]?.stopList?.find(
  //           (item) => item?.status == "SCHEDULE" || item?.status == "ARRIVED"
  //         );

  //         if (getStopDetail) {
  //           Geolocation.getCurrentPosition(
  //             (position) => {
  //               checkIsDriverCrossHundMeterFromLastPoint(
  //                 position,
  //                 getStopDetail
  //               );
  //             },
  //             (error) => {
  //               showError(error.message);
  //             },
  //             { enableHighAccuracy: false, timeout: 20000 }
  //           );
  //         }
  //       }
  //     }
  //   });
  // };

  // const checkIsDriverCrossHundMeterFromLastPoint = async (
  //   position,
  //   getStopDetail
  // ) => {
  //   let DriverLastPoint = await AsyncStorage.getItem(
  //     "DriverLastPointForDynamicETA"
  //   );

  //   if (DriverLastPoint) {
  //     let driverLastPoint = JSON.parse(DriverLastPoint);
  //     let driverLastPointCoords = {
  //       lat: driverLastPoint?.coords?.latitude,
  //       lng: driverLastPoint?.coords?.longitude,
  //     };

  //     let driverCurrentPoint = {
  //       lat: position?.coords?.latitude,
  //       lng: position?.coords?.longitude,
  //     };

  //     var ky = 40000 / 360;
  //     var kx = Math.cos((Math.PI * driverLastPointCoords.lat) / 180.0) * ky;
  //     var dx =
  //       Math.abs(driverLastPointCoords.lng - driverCurrentPoint.lng) * kx;
  //     var dy =
  //       Math.abs(driverLastPointCoords.lat - driverCurrentPoint.lat) * ky;

  //     let distanceInKM = Math.sqrt(dx * dx + dy * dy);
  //     let distanceInMeter = distanceInKM * 1000;

  //     if (distanceInMeter > 100) {
  //       setItem("DriverLastPointForDynamicETA", position);
  //       getDynamicETAFromGoogle(position, getStopDetail);
  //     } else {
  //     }
  //   } else {
  //     getDynamicETAFromGoogle(position, getStopDetail);
  //     setItem("DriverLastPointForDynamicETA", position);
  //     //console.log("DynamicETAAPICall", "first time");

  //     // getDynamicETAFromGoogle(position, getStopDetail);
  //   }
  // };

  const getDynamicEtaInsideGeofence = async () => {
    if (
      destination &&
      wayPoints &&
      driverCurrentCoordinate &&
      ongoingRideData
    ) {
      if (ongoingRideData?.onBoardPassengers) {
        if (
          ongoingRideData?.dynamicEtaUpdated == "false" ||
          ongoingRideData?.dynamicEtaUpdated == null
        ) {
          Geolocation.getCurrentPosition(
            (position) => {
              let driverLastPointCoords = {
                lat: ongoingRideData?.location?.latitude,
                lng: ongoingRideData?.location?.longitude,
              };

              let driverCurrentPoint = {
                lat: position?.coords?.latitude,
                lng: position?.coords?.longitude,
              };

              var ky = 40000 / 360;
              var kx =
                Math.cos((Math.PI * driverLastPointCoords.lat) / 180.0) * ky;
              var dx =
                Math.abs(driverLastPointCoords.lng - driverCurrentPoint.lng) *
                kx;
              var dy =
                Math.abs(driverLastPointCoords.lat - driverCurrentPoint.lat) *
                ky;

              let distanceInKM = Math.sqrt(dx * dx + dy * dy);
              let distanceInMeter = distanceInKM * 1000;

              if (distanceInMeter < 1000) {
                //console.log("directionApiResp", "under 1 km");

                let origin = `${position?.coords?.latitude},${position?.coords?.longitude}`;
                let routeWaypoints = wayPoints.join("|");
                let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${routeWaypoints}&key=${GOOGLE_MAP_APIKEY}`;

                actions
                  .getDirection(url)
                  .then((response) => {
                    //console.log("directionApiResp", response);

                    setwaypointsDynamicETA(response?.routes[0]?.legs);

                    let getDecodeData = decodeFun(
                      response?.routes[0].overview_polyline.points
                    );

                    setCoordinates(getDecodeData);
                    const routeCoordinates = PolylineA.toGeoJSON(
                      response?.routes[0].overview_polyline.points
                    ).coordinates;
                    const route = PolylineA.toGeoJSON(
                      response?.routes[0].overview_polyline.points
                    );
                    setRouteCoordinates(routeCoordinates);
                    setRouteCord(route);
                    sendRouteCoordinnate(
                      getDecodeData,
                      response?.routes[0].overview_polyline.points
                    );

                    let getETA = response?.routes[0]?.legs[0]?.duration?.value;

                    let getDriverArrivalTimeToNextStop =
                      addActualArrivalTimeInCurrentTime(getETA);
                    let getDelayOrEarlyMin = getDelayOrEarlyMinutes(
                      ongoingRideData?.expectedArivalTime,
                      getDriverArrivalTimeToNextStop
                    );
                    sendDynamicETAToBackend(
                      ongoingRideData?.id,
                      ongoingRideData?.tripId,
                      getDriverArrivalTimeToNextStop,
                      true
                    );
                    setallStopPointDynamicETA(getDelayOrEarlyMin);
                    setItem("DynamicETA", getDelayOrEarlyMin);
                  })
                  .catch((error) => {});
              }
            },
            (error) => {
              showError(JSON.stringify(error));
            },
            {
              enableHighAccuracy: false,
              timeout: 20000,
            }
          );
        }
      }
    }
  };

  // const getDynamicETAFromGoogle = (position, getStopDetail) => {
  //   let origin = `${position?.coords?.latitude},${position?.coords?.longitude}`;
  //   let destinatiion = `${getStopDetail?.location?.latitude},${getStopDetail?.location?.longitude}`;
  //   let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destinatiion}&key=${GOOGLE_MAP_APIKEY}`;
  //   actions
  //     .getDirection(url)
  //     .then((response) => {
  //       let getETA = response?.routes[0]?.legs[0]?.duration?.value;
  //       let getDriverArrivalTimeToNextStop =
  //         addActualArrivalTimeInCurrentTime(getETA);
  //       let getDelayOrEarlyMin = getDelayOrEarlyMinutes(
  //         getStopDetail?.expectedArivalTime,
  //         getDriverArrivalTimeToNextStop
  //       );
  //       sendDynamicETAToBackend(
  //         getStopDetail?.id,
  //         getStopDetail?.tripId,
  //         getDriverArrivalTimeToNextStop,
  //         false
  //       );
  //       setallStopPointDynamicETA(getDelayOrEarlyMin);
  //       setItem("DynamicETA", getDelayOrEarlyMin);
  //     })
  //     .catch((error) => {});
  // };

  const sendDynamicETAToBackend = (
    stopPointId,
    tripId,
    arrivalTime,
    dynamicEtaUpdatedStatus
  ) => {
    let sendingData = {
      id: stopPointId,
      tripId: tripId,
      updatedArivalTime: arrivalTime,
      dynamicEtaUpdated: dynamicEtaUpdatedStatus,
    };

    //console.log("directionApiResp", sendingData);

    actions
      .updateDynamicETA(sendingData)
      .then((response) => {
        //console.log("directionApiResp", response);
        if (response?.status == 200) {
          getDriverOngoingRide();
        }
      })
      .catch((error) => {
        //console.log("directionApiResp", error);
      });
  };

  const checkTimeForNightHooter = () => {
    if (driverAppSettingData === "") {
    } else {
      if (
        driverAppSettingData?.driverShouldReceiveSleepAlert == "YES" ||
        driverAppSettingData?.driverShouldReceiveSleepAlert == "Yes"
      ) {
        var currentTime = moment().format("HH:mm");

        if (
          driverAppSettingData?.driverShouldReceiveSleepAlertFrom &&
          driverAppSettingData?.driverShouldReceiveSleepAlertTo &&
          driverAppSettingData?.driverShouldReceiveSleepAlertFrequency
        ) {
          if (
            currentTime >=
            driverAppSettingData?.driverShouldReceiveSleepAlertFrom
          ) {
            if (
              currentTime <=
              driverAppSettingData?.driverShouldReceiveSleepAlertTo
            ) {
              playNightHooter();
              nightHooterInterval = setInterval(() => {
                if (data) {
                  playNightHooter();
                }
              }, 60000 * driverAppSettingData?.driverShouldReceiveSleepAlertFrequency);
              return () => {
                clearInterval(nightHooterInterval);
              };
            }
          }
        } else {
        }
      }
    }
  };

  const getDriverAppSetting = () => {
    if (profileData?.id) {
      actions
        .getDriverDataById(profileData?.id)
        .then((re) => {
          let { status } = re;
          if (status == 200) {
            actions
              .getDriverAppSetting(re?.data?.corporateId)
              .then((response) => {
                if (response?.status == 200) {
                  setdriverAppSettingData(response?.data);
                }
              })
              .catch((error) => {});
          } else {
          }
        })
        .catch((er) => {});
    }
  };

  const getDriverModulePermissions = () => {
    // actions
    //   .getModulePermissionData(profileData?.corporateId)
    //   .then((response) => {
    //     if (response?.status == 200) {
    //       actions.saveModulePermissionData(response?.data);
    //     }
    //   })
    //   .catch((error) => {});

    if (profileData?.id) {
      actions
        .getDriverDataById(profileData?.id)
        .then((re) => {
          let { status } = re;
          if (status == 200) {
            getRoutingRule(re?.data?.corporateId);
            actions
              .getModulePermissionData(re?.data?.corporateId)
              .then((response) => {
                if (response?.status == 200) {
                  actions.saveModulePermissionData(response?.data);
                }
              })
              .catch((error) => {});
          } else {
          }
        })
        .catch((er) => {});
    }
  };

  const playNightHooter = async () => {
    let loginUserType = await AsyncStorage.getItem("loginUserType");
    if (
      loginUserType === null ||
      loginUserType === undefined ||
      loginUserType === ""
    ) {
      clearInterval(nightHooterInterval);
    } else {
      actions.getRide(DRIVER_ONGOING_RIDE).then((res) => {
        if (res?.status === 200) {
          if (res?.data.length > 0) {
            nightHooter = new Sound(
              require("../../../sound/hooter.mp3"),
              (error, _sound) => {
                if (error) {
                  return;
                }

                nightHooter.play(() => {
                  nightHooter.release();
                });
              }
            );
          } else {
            clearInterval(nightHooterInterval);
          }
        }
      });
    }
  };

  const routeAnimation = () => {
    if (driverCurrentCoordinate?.latitude && routeCoordinates && routeCord) {
      let longitude = Number(driverCurrentCoordinate?.longitude);
      let latitude = Number(driverCurrentCoordinate?.latitude);
      var newSourcePoint = [longitude, latitude];
      let coveredCord = [...coveredRouteCord];
      var totaldistance = pointToLineDistance(
        newSourcePoint,
        routeCoordinates,
        {
          units: "meters",
        }
      );

      var nearestPoint = nearestPointOnLine(routeCord, newSourcePoint, {
        units: "meters",
      });

      let distanceInMeterForRouteChange = 70;

      if (totaldistance < distanceInMeterForRouteChange) {
        setreGenneratePolyline(false);
        AsyncStorage.removeItem("reGenneratePolyline");

        var startmarkerLocation = [
          nearestPoint.geometry.coordinates[0],
          nearestPoint.geometry.coordinates[1],
        ];
        // var sliced = lineSlice(
        //   startmarkerLocation,
        //   routeCoordinates?.[routeCoordinates?.length - 1],
        //   routeCord
        // );
        var sliced;
        if (data?.data?.length > 0) {
          if (data?.data[0]?.tripType === "UPTRIP") {
            if (
              data.data[0].stopList[0]?.status == "SCHEDULE" ||
              data.data[0].stopList[0]?.status == "ARRIVED"
            ) {
              let secondLastStop =
                data.data[0]?.stopList[data.data[0]?.stopList?.length - 2];
              let stopPoitPoint = [
                secondLastStop?.location?.longitude,
                secondLastStop?.location?.latitude,
              ];

              sliced = lineSlice(startmarkerLocation, stopPoitPoint, routeCord);
            } else {
              sliced = lineSlice(
                startmarkerLocation,
                routeCoordinates?.[routeCoordinates?.length - 1],
                routeCord
              );
            }
          } else {
            sliced = lineSlice(
              startmarkerLocation,
              routeCoordinates?.[routeCoordinates?.length - 1],
              routeCord
            );
          }
          let newSliced;
          if (sliced?.geometry?.coordinates?.length) {
            newSliced = sliced?.geometry?.coordinates.map((c) => ({
              latitude: c[1],
              longitude: c[0],
            }));
          }

          var coords = [
            {
              latitude: startmarkerLocation[1],
              longitude: startmarkerLocation[0],
              heading: driverCurrentCoordinate?.heading,
            },
          ];

          settravelledCoords([...travelledCoords, ...coords]);
          setCoordinates(newSliced);
          setRouteCoordinates(sliced.geometry.coordinates);
          setRouteCord(sliced);

          if (data?.data?.length > 0) {
            NetInfo.fetch().then((state) => {
              let networkStatus = state?.isConnected;
              let networkStrength = state?.details?.strength
                ? state?.details?.strength
                : null;

              coveredCord.push({
                latitude: nearestPoint.geometry.coordinates[1],
                longitude: nearestPoint.geometry.coordinates[0],
                networkStatus: networkStatus,
                networkStrength: networkStrength,
                speed: driverCurrentCoordinate?.speed,
                time: new Date().getTime(),
              });

              setItem("coveredCord", coveredCord);
              setCoveredRouteCord(coveredCord);
            });
          }
        }
      } else {
        if (data?.data?.length > 0) {
          NetInfo.fetch().then((state) => {
            let networkStatus = state?.isConnected;

            let networkStrength = state?.details?.strength
              ? state?.details?.strength
              : null;

            if (networkStatus) {
              // if (reGenneratePolyline === false) {
              //   reGenerateRoute();
              // }

              getItem("reGenneratePolyline").then((res) => {
                if (res == null) {
                  reGenerateRoute();
                } else {
                }
              });

              let reGenneratePolyline = {
                regerated: true,
              };
              AsyncStorage.setItem(
                "reGenneratePolyline",
                JSON.stringify(reGenneratePolyline)
              );
            } else {
              coveredCord.push({
                latitude: driverCurrentCoordinate?.latitude,
                longitude: driverCurrentCoordinate?.longitude,
                networkStatus: networkStatus,
                networkStrength: networkStrength,
                speed: driverCurrentCoordinate?.speed,
                time: new Date().getTime(),
              });

              setItem("coveredCord", coveredCord);
              setCoveredRouteCord(coveredCord);
            }
          });
        }
      }
    } else {
    }
  };

  const reGenerateRoute = () => {
    setreGenneratePolyline(true);

    let origin = `${driverCurrentCoordinate?.latitude},${driverCurrentCoordinate?.longitude}`;
    let routeWaypoints = wayPoints.join("|");

    let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${routeWaypoints}&key=${GOOGLE_MAP_APIKEY}`;

    actions
      .getDirection(url)
      .then((response) => {
        setwaypointsDynamicETA(response?.routes[0]?.legs);

        let getDecodeData = decodeFun(
          response?.routes[0].overview_polyline.points
        );

        setCoordinates(getDecodeData);
        const routeCoordinates = PolylineA.toGeoJSON(
          response?.routes[0].overview_polyline.points
        ).coordinates;
        const route = PolylineA.toGeoJSON(
          response?.routes[0].overview_polyline.points
        );
        setRouteCoordinates(routeCoordinates);
        setRouteCord(route);
        sendRouteCoordinnate(
          getDecodeData,
          response?.routes[0].overview_polyline.points
        );
        AsyncStorage.removeItem("reGenneratePolyline");
      })
      .catch((error) => {});
  };

  const sendRouteCoordinnate = (newGeneraredCoords, encodedData) => {
    getItem("coveredCord").then((res) => {
      if (res != null && res?.length) {
        let coveredCoords = res;
        let newCoords = newGeneraredCoords;
        let mergeCoords = [...coveredCoords, ...newCoords];

        callSendDataToDashboardApi(
          mergeCoords,
          newGeneraredCoords,
          encodedData
        );
      } else {
        callSendDataToDashboardApi(
          newGeneraredCoords,
          newGeneraredCoords,
          encodedData
        );
      }
    });
  };

  const callSendDataToDashboardApi = (coveredRoute, newRoute, encodedData) => {
    var allRecieverList = [];
    if (data?.data[0]?.tripType === "UPTRIP") {
      let uptripLastStop =
        data.data[0].stopList[data.data[0].stopList.length - 1];
      let getAllEmpList = uptripLastStop?.deBoardPassengers.map((emp) => {
        if (emp?.status === "ABSENT") {
          return null;
        } else {
          return emp.empId;
        }
      });
      getAllEmpList.push(data?.data[0]?.vendorId);
      getAllEmpList.push(data?.data[0]?.corporateId);
      allRecieverList = getAllEmpList;
    } else {
      let uptripLastStop = data?.data[0]?.stopList[0];
      let getAllEmpList = uptripLastStop?.onBoardPassengers.map((emp) => {
        if (emp?.status === "ABSENT") {
          return null;
        } else {
          return emp.empId;
        }
      });
      getAllEmpList.push(data?.data[0]?.vendorId);
      getAllEmpList.push(data?.data[0]?.corporateId);
      allRecieverList = getAllEmpList;
    }

    actions
      .addPolyLineData(
        `id=${tripId}&driverPolyLine=${encodeURIComponent(
          encodedData
        )}&driverTripPolyLine=`
      )
      .then((res) => {
        let sendingData = {
          tripId: tripId,
          start_to_end: coveredRoute,
          currloc_to_end: newRoute,
          status: "STARTED",
          reciverIds: allRecieverList,
          driverId: profileData?.id,
          absent: [],
        };

        actions
          .addDirection(sendingData)
          .then((res) => {})
          .catch((err) => {
            setisLoading(false);
          });
      })
      .catch((err) => {
        let sendingData = {
          tripId: tripId,
          start_to_end: coveredRoute,
          currloc_to_end: newRoute,
          status: "STARTED",
          reciverIds: allRecieverList,
          driverId: profileData?.id,
          absent: [],
        };

        actions
          .addDirection(sendingData)
          .then((res) => {})
          .catch((err) => {
            setisLoading(false);
          });
      });
  };
  const empBoardByQrCodeScan = (data) => {
    if (data?.notification?.body) {
      if (
        data?.data?.isDepartured === true ||
        data?.data?.isDepartured === "true"
      ) {
        setshowQrCodeModalPopup(false);
      } else {
      }
      showSuccess(data?.notification?.body);
      getDriverOngoingRide();
    }
  };

  const enableAwake = (value) => {
    if (value) {
      KeepAwake.activate();
    } else {
      KeepAwake.deactivate();
    }
  };

  const sendDataToEmpAndDashboard = async () => {
    if (allEmpList?.length > 0) {
      let getDynnamicETA = await AsyncStorage.getItem("DynamicETA");
      if (getDynnamicETA) {
        let parseGetDynnamicETA = JSON.parse(getDynnamicETA);
        let sendingData = {
          from: profileData?.id,
          to: allEmpList,

          location: {
            lat: driverCurrentCoordinate?.latitude,
            long: driverCurrentCoordinate?.longitude,
            heading: driverCurrentCoordinate?.heading,
            stopPointsDynamicETA: parseGetDynnamicETA,
            id: ongoingRideData?.id,
          },
        };

        socketServices.emit("send-location", sendingData);
      } else {
        let sendingData = {
          from: profileData?.id,
          to: allEmpList,

          location: {
            lat: driverCurrentCoordinate?.latitude,
            long: driverCurrentCoordinate?.longitude,
            heading: driverCurrentCoordinate?.heading,
            stopPointsDynamicETA: null,
            id: ongoingRideData?.id,
          },
        };

        socketServices.emit("send-location", sendingData);
      }
    }
  };

  const watchPosition = async () => {
    Geolocation.watchPosition(
      (position) => {
        if (position?.coords?.latitude === driverCurrentCoordinate?.latitude) {
        } else {
          setdriverCurrentCoordinate({
            ...driverCurrentCoordinate,
            latitude: position?.coords?.latitude,
            longitude: position?.coords?.longitude,
            heading: position?.coords?.heading,
            speed: position?.coords?.speed,
          });
          let speed = position?.coords?.speed;
          let speedInKmPerH = 3.6 * speed;

          setspeedInKmPerH(speedInKmPerH);

          if (driverAppSettingData?.alertCorpOnOverSpeedingBetween == "YES") {
            if (
              driverAppSettingData?.alertCorpOnOverSpeedingBetweenfrom &&
              driverAppSettingData?.alertCorpOnOverSpeedingBetweento
            ) {
              if (
                speedInKmPerH >
                driverAppSettingData?.alertCorpOnOverSpeedingBetweenfrom
              ) {
                if (
                  speedInKmPerH <
                  driverAppSettingData?.alertCorpOnOverSpeedingBetweento
                ) {
                  getItem("hooter").then((res) => {
                    if (res) {
                      if (res === "false") {
                        setItem("hooter", "true");
                        playHooter();
                        callSpeedLimitApi(position, speedInKmPerH);
                        //startVibration();
                      } else {
                      }
                    } else {
                      setItem("hooter", "true");
                      playHooter();
                      callSpeedLimitApi(position, speedInKmPerH);
                      //startVibration();
                    }
                  });
                } else {
                  setItem("hooter", "false");
                  //stopVibration();
                  overSpeedHooter?.stop(() => {});
                }
              } else {
                setItem("hooter", "false");
                //stopVibration();
                overSpeedHooter?.stop(() => {});
              }
            } else {
            }
          } else {
          }
        }
      },
      (error) => {},
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        distanceFilter: 10,
      }
    );
  };

  const callSpeedLimitApi = async (position, speedInKmPerH) => {
    let checkOngoingRide = await AsyncStorage.getItem("ongoingRideData");

    if (
      checkOngoingRide === "" ||
      checkOngoingRide === null ||
      checkOngoingRide === undefined
    ) {
    } else {
      let parseOnGoingRideData = JSON.parse(checkOngoingRide);
      if (parseOnGoingRideData.isOngoing) {
        let sendingDataToApi = {
          //locName: "",
          latitude: position?.coords?.latitude,
          longitude: position?.coords?.longitude,
          type: "OverSpeed",
          driverId: profileData?.id,
          tripId: tripId,
          maximumSpeed: speedInKmPerH,
        };
        //let sendingData = `OverSpeed/${profileData?.id}`;
        actions
          .callSpeedLimitApi(sendingDataToApi)
          .then((res) => {})
          .catch((err) => {
            setisLoading(false);
          });
      }
    }
  };

  const playHooter = () => {
    overSpeedHooter = new Sound(
      require("../../../sound/hooter.mp3"),
      (error, _sound) => {
        if (error) {
          return;
        }

        overSpeedHooter.play(() => {
          overSpeedHooter.release();
        });
      }
    );
  };
  const startVibration = () => {
    const ONE_SECOND_IN_MS = 1000;

    const PATTERN = [
      1 * ONE_SECOND_IN_MS,
      2 * ONE_SECOND_IN_MS,
      3 * ONE_SECOND_IN_MS,
    ];

    //Vibration.vibrate(PATTERN, true);
  };
  const stopVibration = () => {
    //Vibration.cancel();
  };

  const callSendSmsApi = async (distanceInMeter, ongoingRideData) => {
    let data = {
      tripId: ongoingRideData?.tripId,
      distance: distanceInMeter,
      stopId: ongoingRideData?.id,
    };

    actions
      .callNearToStopPointApi(data)
      .then((res) => {
        //getDriverOngoingRide();
      })
      .catch((err) => {});
  };

  const getDistanceOfDriverFromStopPoint = async () => {
    let distanceInMeter = getDistanceOfTwoPoints(
      driverCurrentCoordinate,
      ongoingRideData
    );

    let geofeceArea = 100;

    if (tripType === "UPTRIP") {
      if (ongoingRideData?.deBoardPassengers) {
        geofeceArea = 500;
      } else {
        geofeceArea = 100;
      }
    } else {
      geofeceArea = 100;
    }

    if (distanceInMeter < geofeceArea) {
      setshowAbsentButton(true);
      setoutofGeofencePopup(false);
      if (showReachedAlert === false) {
        showReachedDestinationPopup();

        if (tripType === "UPTRIP") {
          if (ongoingRideData?.onBoardPassengers) {
            setshowstopPointDetail(false);

            openEmpListModal.current.close();

            if (
              driverAppSettingData?.canEmpAttendenceBeCaptureUsingOTPQR == "YES"
            ) {
              setTimeout(() => {
                setotp("");
                setshowQrCodeModalPopup(true);
              }, 2000);
            }
          } else {
            setshowQrCodeModalPopup(false);
          }
        } else {
          setshowstopPointDetail(false);

          openEmpListModal.current.close();
          if (
            driverAppSettingData?.canEmpAttendenceBeCaptureUsingOTPQR == "YES"
          ) {
            setTimeout(() => {
              setotp("");
              setshowQrCodeModalPopup(true);
            }, 2000);
          }
        }
      }

      if (tripType === "") {
      } else {
        if (tripType === "UPTRIP") {
          updateArrivedStatus();

          if (notshow) {
          } else {
            if (ongoingRideData?.onBoardPassengers) {
              let expected = ongoingRideData?.expectedArivalTime;

              const timeObjectCreate = new Date();
              let arrival = timeObjectCreate.getTime();
              let secDiff = Math.floor((arrival - expected) / 1000);

              if (secDiff === 0) {
                setshowTimer(true);
              } else if (secDiff > 0) {
                setshowTimer(true);
              } else if (secDiff < 0) {
              } else {
              }
            } else {
              getDriverOngoingRide();
            }
          }
        } else {
          if (ongoingRideData?.onBoardPassengers === null) {
            updateArrivedStatus();
          } else {
            updateArrivedStatus();

            let expected = ongoingRideData?.expectedArivalTime;

            const timeObjectCreate = new Date();
            let arrival = timeObjectCreate.getTime();
            let secDiff = Math.floor((arrival - expected) / 1000);

            if (secDiff === 0) {
              setshowTimer(true);
            } else if (secDiff > 0) {
              setshowTimer(true);
            } else if (secDiff < 0) {
            } else {
            }
          }
        }
      }
    } else {
      AsyncStorage.removeItem("ArrivedStatus");
      setshowReachedAlert(false);
      setshowTimer(false);
      setshowAbsentButton(false);

      if (driverAppSettingData?.alertDriverIfEmpAttendanceNotMarked == "YES") {
        if (ongoingRideData?.status === "ARRIVED") {
          if (tripType === "UPTRIP") {
            if (ongoingRideData?.onBoardPassengers) {
              let getUnboardEmp = ongoingRideData?.onBoardPassengers.find(
                (itemData) => itemData.status === "SCHEDULE"
              );
              if (getUnboardEmp) {
                if (!outofGeofencePopup) {
                  let userType = "";

                  let findEscortAt = ongoingRideData?.onBoardPassengers.find(
                    (itemData) => itemData.passType === "ESCORT"
                  );

                  if (findEscortAt) {
                    if (findEscortAt?.status === "SCHEDULE") {
                      userType = "Escort";
                    } else {
                      userType = "Employee";
                    }
                  } else {
                    userType = "Employee";
                  }

                  //startVibration();
                  setshowQrCodeModalPopup(false);
                  Alert.alert(
                    `${userType} Attendence`,
                    `${userType} attendance is not marked`,
                    [
                      {
                        text: "OK",
                        onPress: () => {
                          openEmpListModal.current.open();
                          //stopVibration();
                        },
                      },
                    ]
                  );
                  setoutofGeofencePopup(true);
                }
              }
            } else {
              //stopVibration();
            }
          } else {
            if (ongoingRideData?.onBoardPassengers) {
              let getUnboardEmp = ongoingRideData?.onBoardPassengers.find(
                (itemData) => itemData.status === "SCHEDULE"
              );
              if (getUnboardEmp) {
                if (!outofGeofencePopup) {
                  let userType = "";

                  let findEscortAt = ongoingRideData?.onBoardPassengers.find(
                    (itemData) => itemData.passType === "ESCORT"
                  );

                  if (findEscortAt) {
                    if (findEscortAt?.status === "SCHEDULE") {
                      userType = "Escort";
                    } else {
                      userType = "Employee";
                    }
                  } else {
                    userType = "Employee";
                  }

                  //startVibration();
                  setshowQrCodeModalPopup(false);
                  Alert.alert(
                    `${userType} Attendence`,
                    `${userType} attendance is not marked`,
                    [
                      {
                        text: "OK",
                        onPress: () => {
                          openEmpListModal.current.open();
                          //stopVibration();
                        },
                      },
                    ]
                  );
                  setoutofGeofencePopup(true);
                }
              }
            } else {
              let getUnboardEmp = ongoingRideData?.deBoardPassengers.find(
                (itemData) => itemData.status === "BOARDED"
              );
              if (getUnboardEmp) {
                if (!outofGeofencePopup) {
                  let userType = "";

                  let findEscortAt = ongoingRideData?.deBoardPassengers.find(
                    (itemData) => itemData.passType === "ESCORT"
                  );

                  if (findEscortAt) {
                    if (findEscortAt?.status === "SCHEDULE") {
                      userType = "Escort";
                    } else {
                      userType = "Employee";
                    }
                  } else {
                    userType = "Employee";
                  }

                  // startVibration();
                  setshowQrCodeModalPopup(false);
                  Alert.alert(
                    `${userType} Attendence`,
                    `${userType} attendance is not marked`,
                    [
                      {
                        text: "OK",
                        onPress: () => {
                          openEmpListModal.current.open();
                          //stopVibration();
                        },
                      },
                    ]
                  );
                  setoutofGeofencePopup(true);
                }
              } else {
                //stopVibration();
              }
            }
          }
        } else {
          //stopVibration();
        }
      }
    }
  };

  const showReachedDestinationPopup = async () => {
    showSuccess("You reached at the destination.");
    setshowReachedAlert(true);
  };

  const updateArrivedStatus = async () => {
    if (ongoingRideData === "") {
    } else {
      if (tripType === "DOWNTRIP") {
        let getArrivedStatus = await AsyncStorage.getItem("ArrivedStatus");

        if (
          getArrivedStatus === "" ||
          getArrivedStatus === null ||
          getArrivedStatus === undefined
        ) {
          AsyncStorage.setItem("ArrivedStatus", "Yes");
          let data = {
            tripId: tripId,
            location: ongoingRideData?.location,
            id: ongoingRideData?.id,
          };

          actions
            .updateArrivedStatus(data)
            .then((res) => {
              getDriverOngoingRide();
            })
            .catch((err) => {});
        }
      } else {
        let getArrivedStatus = await AsyncStorage.getItem("ArrivedStatus");
        if (
          getArrivedStatus === "" ||
          getArrivedStatus === null ||
          getArrivedStatus === undefined
        ) {
          AsyncStorage.setItem("ArrivedStatus", "Yes");
          let data = {
            tripId: tripId,
            location: ongoingRideData?.location,
            id: ongoingRideData?.id,
          };

          actions
            .updateArrivedStatus(data)
            .then((res) => {
              getDriverOngoingRide();
            })
            .catch((err) => {});
        } else {
        }
      }
    }
  };

  const checkSendSmsAbountToReach = async () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        let driverCurrentPoint = {
          latitude: position?.coords?.latitude,
          longitude: position?.coords?.longitude,
        };
        let distanceInMeter = getDistanceOfTwoPoints(
          driverCurrentPoint,
          ongoingRideData
        );

        if (distanceInMeter < 1200) {
          let getTravelTimeVoilation = await AsyncStorage.getItem("SmsApi");
          if (
            getTravelTimeVoilation === "" ||
            getTravelTimeVoilation === null ||
            getTravelTimeVoilation === undefined
          ) {
            let savingData = {
              stopId: ongoingRideData.id,
              status: true,
            };
            AsyncStorage.setItem("SmsApi", JSON.stringify(savingData));
            //console.log("SmsApi", "call api");
            callSendSmsApi(distanceInMeter, ongoingRideData);
          } else {
            let parseData = JSON.parse(getTravelTimeVoilation);

            if (parseData.stopId == ongoingRideData.id) {
              //console.log("SmsApi", "already called api");
            } else {
              let savingData = {
                stopId: ongoingRideData.id,
                status: true,
              };
              AsyncStorage.setItem("SmsApi", JSON.stringify(savingData));
              //console.log("SmsApi", "call api");
              callSendSmsApi(distanceInMeter, ongoingRideData);
            }
          }
        } else {
          //console.log("SmsApi", "else");
          AsyncStorage.removeItem("SmsApi");
        }
      },
      (error) => {},
      { enableHighAccuracy: false, timeout: 20000 }
    );
  };

  const checkTravelTimeVoilation = async () => {
    const timeObjectCreate = new Date();
    let currentTime = timeObjectCreate.getTime();

    let getMinutes = getDelayOrEarlyMinutes(
      ongoingRideData?.expectedArivalTime,
      currentTime
    );

    if (getMinutes > routingRule?.bufferTime) {
      let getTravelTimeVoilation = await AsyncStorage.getItem(
        "TravelTimeVoilation"
      );
      if (
        getTravelTimeVoilation === "" ||
        getTravelTimeVoilation === null ||
        getTravelTimeVoilation === undefined
      ) {
        let savingData = {
          stopId: ongoingRideData.id,
          status: true,
          currentTime: currentTime,
        };
        AsyncStorage.setItem("TravelTimeVoilation", JSON.stringify(savingData));

        let getDiff = getMinutes - routingRule?.bufferTime;
        callTravelTimeVoilation(ongoingRideData, getDiff);
      } else {
        let parseData = JSON.parse(getTravelTimeVoilation);

        if (parseData.stopId == ongoingRideData.id) {
          let findMinutesDiff = getDelayOrEarlyMinutes(
            parseData.currentTime,
            currentTime
          );

          if (findMinutesDiff >= routingRule?.bufferTime) {
            let savingData = {
              stopId: ongoingRideData.id,
              status: true,
              currentTime: currentTime,
            };
            AsyncStorage.setItem(
              "TravelTimeVoilation",
              JSON.stringify(savingData)
            );

            let getDiff = getMinutes - routingRule?.bufferTime;
            callTravelTimeVoilation(ongoingRideData, getDiff);
          } else {
          }
        } else {
          let savingData = {
            stopId: ongoingRideData.id,
            status: true,
            currentTime: currentTime,
          };
          AsyncStorage.setItem(
            "TravelTimeVoilation",
            JSON.stringify(savingData)
          );

          let getDiff = getMinutes - routingRule?.bufferTime;
          callTravelTimeVoilation(ongoingRideData, getDiff);
        }
      }
    } else {
      AsyncStorage.removeItem("TravelTimeVoilation");
    }
  };

  const callTravelTimeVoilation = (stopDetail, getDiff) => {
    let sendingData = `${stopDetail?.tripId}/${stopDetail?.id}/${getDiff}`;
    actions
      .callTravelTimeVoilation(sendingData)
      .then((res) => {})
      .catch((err) => {});
  };

  const generateGeometrey = () => {
    if (destination) {
      if (coordinates.length === 0) {
        if (
          driverCurrentCoordinate?.latitude &&
          wayPoints.length > 0 &&
          ongoingRideData
        ) {
          setpolyLineGenerated(true);

          if (polyLineGenerated) {
          } else {
            let origin = `${driverCurrentCoordinate?.latitude},${driverCurrentCoordinate?.longitude}`;
            let routeWaypoints = wayPoints.join("|");
            let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${routeWaypoints}&key=${GOOGLE_MAP_APIKEY}`;

            actions
              .getDirection(url)
              .then((response) => {
                setwaypointsDynamicETA(response?.routes[0]?.legs);

                let getDecodeData = decodeFun(
                  response?.routes[0].overview_polyline.points
                );

                setCoordinates(getDecodeData);
                const routeCoordinates = PolylineA.toGeoJSON(
                  response?.routes[0].overview_polyline.points
                ).coordinates;
                const route = PolylineA.toGeoJSON(
                  response?.routes[0].overview_polyline.points
                );
                setRouteCoordinates(routeCoordinates);
                setRouteCord(route);
                sendRouteCoordinnate(
                  getDecodeData,
                  response?.routes[0].overview_polyline.points
                );

                let getETA = response?.routes[0]?.legs[0]?.duration?.value;

                let getDriverArrivalTimeToNextStop =
                  addActualArrivalTimeInCurrentTime(getETA);
                let getDelayOrEarlyMin = getDelayOrEarlyMinutes(
                  ongoingRideData?.expectedArivalTime,
                  getDriverArrivalTimeToNextStop
                );
                sendDynamicETAToBackend(
                  ongoingRideData?.id,
                  ongoingRideData?.tripId,
                  getDriverArrivalTimeToNextStop,
                  ongoingRideData?.dynamicEtaUpdated == "true" ? true : false
                );
                setallStopPointDynamicETA(getDelayOrEarlyMin);
                setItem("DynamicETA", getDelayOrEarlyMin);
                //console.log("distance", data?.data[0]?.actualTripDistance);
                if (data?.data[0]?.actualTripDistance == 0) {
                  sendActualTripDistanceToApi(
                    response?.routes[0]?.legs,
                    data.data[0].id
                  );
                }
              })
              .catch((error) => {});
          }
        } else {
        }
      }
    }
  };

  const sendActualTripDistanceToApi = (route, id) => {
    let distance = 0;
    for (let i = 0; i < route.length; i++) {
      distance = distance + route[i].distance.value;
    }

    actions
      .addActualDistance(`id=${id}&actualTripDistance=${parseInt(distance)}`)
      .then((res) => {})
      .catch((err) => {});
  };

  const decodeFun = (t, e) => {
    for (
      var n,
        o,
        u = 0,
        l = 0,
        r = 0,
        d = [],
        h = 0,
        i = 0,
        a = null,
        c = Math.pow(10, e || 5);
      u < t.length;

    ) {
      (a = null), (h = 0), (i = 0);
      do (a = t.charCodeAt(u++) - 63), (i |= (31 & a) << h), (h += 5);
      while (a >= 32);
      (n = 1 & i ? ~(i >> 1) : i >> 1), (h = i = 0);
      do (a = t.charCodeAt(u++) - 63), (i |= (31 & a) << h), (h += 5);
      while (a >= 32);
      (o = 1 & i ? ~(i >> 1) : i >> 1),
        (l += n),
        (r += o),
        d.push([l / c, r / c]);
    }
    return (d = d.map(function (t) {
      return { latitude: t[0], longitude: t[1] };
    }));
  };

  const getDriverOngoingRide = async () => {
    actions
      .getRide(DRIVER_ONGOING_RIDE)
      .then((res) => {
        setshowAttendenceLoading(false);
        setshowLoader(false);
        if (res.status === 200) {
          if (res.data.length > 0) {
            if (
              res?.data[0]?.escortTrip === "Yes" ||
              res?.data[0]?.escortTrip === "YES"
            ) {
              setisThisEscortTrip(true);
            } else {
              setisThisEscortTrip(false);
            }
            if (res.data[0].tripType === "UPTRIP") {
              setData(res);

              settripId(res.data[0].id);
              settripType(res.data[0].tripType);

              settripStartTime(res.data[0].startTimeInMiliSec);

              let uptripLastStop =
                res.data[0].stopList[res.data[0].stopList.length - 1];
              let callingEmpList = [];

              for (
                let k = 0;
                k < uptripLastStop?.deBoardPassengers?.length;
                k++
              ) {
                if (
                  uptripLastStop?.deBoardPassengers[k]?.status === "SCHEDULE"
                ) {
                  callingEmpList.push(uptripLastStop?.deBoardPassengers[k]);
                }
              }
              setempListForCall(callingEmpList);

              let getAllEmpList = uptripLastStop?.deBoardPassengers.map(
                (emp) => {
                  if (
                    emp?.status === "ABSENT" ||
                    emp?.status === "COMPLETED" ||
                    emp?.status === "CANCLED" ||
                    emp?.status === "NOSHOW" ||
                    emp?.status === "SKIPPED"
                  ) {
                    return null;
                  } else {
                    return emp.empId;
                  }
                }
              );
              getAllEmpList.push(res?.data[0]?.vendorId);
              getAllEmpList.push(res?.data[0]?.corporateId);
              setallEmpList(getAllEmpList);

              var respArr = res.data[0].stopList.map((item, index) => {
                if (item?.status === "SCHEDULE" || item?.status === "ARRIVED") {
                  return (
                    item?.location?.latitude + "," + item?.location?.longitude
                  );
                }
              });

              var lastItem = respArr.pop();

              setdestination(lastItem);
              setwayPoints(respArr);

              for (var i = 0; i < res.data[0].stopList.length; i++) {
                if (res.data[0].stopList[i].onBoardPassengers === null) {
                  if (res.data[0].stopList[i].status === "SCHEDULE") {
                    if (
                      driverAppSettingData?.displayLoginCompleteTripButtonAfterAllEmpAttdCapture ==
                      "YES"
                    ) {
                      setshowNextStopBottomModal(false);
                      setshowcompleteRide(true);

                      setshowQrCodeModalPopup(false);
                      let lastPoint =
                        res.data[0].stopList[res.data[0].stopList.length - 1];
                      setlastPoint(lastPoint);

                      setshowmap(false);
                      setongoingRideData(res.data[0].stopList[i]);

                      let ongoingRideData = {
                        isOngoing: true,
                      };
                      AsyncStorage.setItem(
                        "ongoingRideData",
                        JSON.stringify(ongoingRideData)
                      );

                      if (isRatingListSet === false) {
                        setratingEmpList(lastPoint.deBoardPassengers);
                        setisRatingListSet(true);
                      } else {
                      }

                      let expectedDepartureTime = moment(
                        res.data[0].stopList[i].expectedDepartureTime
                      );
                      let expectedArivalTime = moment(
                        res.data[0].stopList[i].expectedArivalTime
                      );

                      let diffr =
                        expectedDepartureTime.diff(expectedArivalTime);

                      settimerDuration(120);

                      break;
                    } else {
                      setongoingRideData(res.data[0].stopList[i]);

                      let ongoingRideData = {
                        isOngoing: true,
                      };
                      AsyncStorage.setItem(
                        "ongoingRideData",
                        JSON.stringify(ongoingRideData)
                      );

                      let expectedDepartureTime = moment(
                        res.data[0].stopList[i].expectedDepartureTime
                      );
                      let expectedArivalTime = moment(
                        res.data[0].stopList[i].expectedArivalTime
                      );

                      let diffr =
                        expectedDepartureTime.diff(expectedArivalTime);

                      settimerDuration(120);

                      setEmpForAttandance(
                        res.data[0].stopList[i].deBoardPassengers,
                        res.data[0].tripType
                      );

                      setshowNextStopBottomModal(true);
                      setshowcompleteRide(false);

                      setlastPoint("");
                      setratingEmpList([]);

                      break;
                    }
                  } else {
                    setshowNextStopBottomModal(false);
                    setshowcompleteRide(true);

                    setshowQrCodeModalPopup(false);
                    let lastPoint =
                      res.data[0].stopList[res.data[0].stopList.length - 1];
                    setlastPoint(lastPoint);
                    setshowmap(false);
                    setongoingRideData("");
                    let ongoingRideData = {
                      isOngoing: true,
                    };
                    AsyncStorage.setItem(
                      "ongoingRideData",
                      JSON.stringify(ongoingRideData)
                    );

                    if (isRatingListSet === false) {
                      setratingEmpList(lastPoint.deBoardPassengers);
                      setisRatingListSet(true);
                    } else {
                    }
                  }
                } else {
                  if (
                    res.data[0].stopList[i].status === "SCHEDULE" ||
                    res.data[0].stopList[i].status === "ARRIVED"
                  ) {
                    setnextPickupLocation(res.data[0].stopList[i + 1]);
                    setongoingRideData(res.data[0].stopList[i]);

                    let ongoingRideData = {
                      isOngoing: true,
                    };
                    AsyncStorage.setItem(
                      "ongoingRideData",
                      JSON.stringify(ongoingRideData)
                    );

                    let expectedDepartureTime = moment(
                      res.data[0].stopList[i].expectedDepartureTime
                    );
                    let expectedArivalTime = moment(
                      res.data[0].stopList[i].expectedArivalTime
                    );

                    let diffr = expectedDepartureTime.diff(expectedArivalTime);

                    settimerDuration(120);

                    setEmpForAttandance(
                      res.data[0].stopList[i].onBoardPassengers,
                      res.data[0].tripType
                    );

                    setshowNextStopBottomModal(true);
                    setshowcompleteRide(false);

                    setlastPoint("");
                    setratingEmpList([]);

                    break;
                  } else {
                  }
                }
              }
            } else if (res.data[0].tripType === "DOWNTRIP") {
              setData(res);

              settripId(res.data[0].id);
              settripType(res.data[0].tripType);

              settripStartTime(res.data[0].startTimeInMiliSec);

              let uptripLastStop = res?.data[0]?.stopList[0];
              let callingEmpList = [];

              for (
                let k = 0;
                k < uptripLastStop?.onBoardPassengers?.length;
                k++
              ) {
                if (
                  uptripLastStop?.onBoardPassengers[k]?.status === "SCHEDULE"
                ) {
                  callingEmpList.push(uptripLastStop?.onBoardPassengers[k]);
                }
              }
              setempListForCall(callingEmpList);

              let getAllEmpList = uptripLastStop?.onBoardPassengers.map(
                (emp) => {
                  if (
                    emp?.status === "COMPLETED" ||
                    emp?.status === "ABSENT" ||
                    emp?.status === "CANCLED" ||
                    emp?.status === "NOSHOW" ||
                    emp?.status === "SKIPPED"
                  ) {
                    return null;
                  } else {
                    return emp.empId;
                  }
                }
              );
              getAllEmpList.push(res?.data[0]?.vendorId);
              getAllEmpList.push(res?.data[0]?.corporateId);
              setallEmpList(getAllEmpList);

              var respArr = res.data[0].stopList.map((item, index) => {
                if (item?.status === "SCHEDULE" || item?.status === "ARRIVED") {
                  return (
                    item?.location?.latitude + "," + item?.location?.longitude
                  );
                }
              });

              var lastItem = respArr.pop();

              let getLastStopPoint =
                res.data[0].stopList[res.data[0].stopList.length - 1];

              setdestination(lastItem);
              setwayPoints(respArr);

              if (getLastStopPoint.status === "DEPARTURED") {
                let getStopPointStatus = res.data[0].stopList.find(
                  (itemData) =>
                    itemData.status === "SCHEDULE" ||
                    itemData.status === "ARRIVED"
                );

                if (getStopPointStatus) {
                  for (let i = 0; i < res.data[0].stopList.length; i++) {
                    if (res.data[0].stopList.length === i + 1) {
                      let getEmpStatus = res.data[0].stopList[
                        i
                      ].deBoardPassengers.find(
                        (itemData) => itemData.status === "BOARDED"
                      );

                      if (getEmpStatus === undefined || getEmpStatus === null) {
                        let getLastStopPoint =
                          res.data[0].stopList[res.data[0].stopList.length - 1];
                        completeDownTrip(getLastStopPoint);
                        setshowNextStopBottomModal(false);
                        setshowcompleteRide(true);

                        setshowQrCodeModalPopup(false);
                        let lastPoint = res.data[0].stopList[0];
                        setlastPoint(lastPoint);

                        setshowmap(false);

                        if (isRatingListSet === false) {
                          setratingEmpList(lastPoint.onBoardPassengers);
                          setisRatingListSet(true);
                        } else {
                        }
                      } else {
                        if (
                          res.data[0].stopList[i].status === "SCHEDULE" ||
                          res.data[0].stopList[i].status === "ARRIVED"
                        ) {
                          let getEmpStatus = res.data[0].stopList[
                            i
                          ].deBoardPassengers.find(
                            (itemData) => itemData.status === "BOARDED"
                          );

                          if (
                            getEmpStatus === null ||
                            getEmpStatus === undefined
                          ) {
                          } else {
                            setpassengersListType("deBoardPassengers");
                            setnextPickupLocation(res.data[0].stopList[i + 1]);
                            setongoingRideData(res.data[0].stopList[i]);

                            let ongoingRideData = {
                              isOngoing: true,
                            };
                            AsyncStorage.setItem(
                              "ongoingRideData",
                              JSON.stringify(ongoingRideData)
                            );

                            let expectedDepartureTime = moment(
                              res.data[0].stopList[i].expectedDepartureTime
                            );
                            let expectedArivalTime = moment(
                              res.data[0].stopList[i].expectedArivalTime
                            );

                            let diffr =
                              expectedDepartureTime.diff(expectedArivalTime);

                            settimerDuration(120);

                            setEmpForAttandance(
                              res.data[0].stopList[i].deBoardPassengers,
                              res.data[0].tripType
                            );

                            setshowNextStopBottomModal(true);
                            setshowcompleteRide(false);

                            setlastPoint("");
                            setratingEmpList([]);
                            break;
                          }
                        }
                      }
                    } else {
                      if (i === 0) {
                        if (
                          res.data[0].stopList[i].status === "SCHEDULE" ||
                          res.data[0].stopList[i].status === "ARRIVED"
                        ) {
                          setpassengersListType("onBoardPassengers");
                          setnextPickupLocation(res.data[0].stopList[i + 1]);
                          setongoingRideData(res.data[0].stopList[i]);

                          let ongoingRideData = {
                            isOngoing: true,
                          };
                          AsyncStorage.setItem(
                            "ongoingRideData",
                            JSON.stringify(ongoingRideData)
                          );

                          let expectedDepartureTime = moment(
                            res.data[0].stopList[i].expectedDepartureTime
                          );
                          let expectedArivalTime = moment(
                            res.data[0].stopList[i].expectedArivalTime
                          );

                          let diffr =
                            expectedDepartureTime.diff(expectedArivalTime);

                          settimerDuration(120);

                          setEmpForAttandance(
                            res.data[0].stopList[i].onBoardPassengers,
                            res.data[0].tripType
                          );

                          setshowNextStopBottomModal(true);
                          setshowcompleteRide(false);

                          setlastPoint("");
                          setratingEmpList([]);
                          break;
                        }
                      } else {
                        if (
                          res.data[0].stopList[i].deBoardPassengers.length > 0
                        ) {
                          if (
                            res.data[0].stopList[i].status === "SCHEDULE" ||
                            res.data[0].stopList[i].status === "ARRIVED"
                          ) {
                            let getEmpStatus = res.data[0].stopList[
                              i
                            ].deBoardPassengers.find(
                              (itemData) => itemData.status === "BOARDED"
                            );

                            if (
                              getEmpStatus === null ||
                              getEmpStatus === undefined
                            ) {
                            } else {
                              if (passengersListType === "onBoardPassengers") {
                              }
                              setpassengersListType("deBoardPassengers");
                              setnextPickupLocation(
                                res.data[0].stopList[i + 1]
                              );
                              setongoingRideData(res.data[0].stopList[i]);

                              let ongoingRideData = {
                                isOngoing: true,
                              };
                              AsyncStorage.setItem(
                                "ongoingRideData",
                                JSON.stringify(ongoingRideData)
                              );

                              let expectedDepartureTime = moment(
                                res.data[0].stopList[i].expectedDepartureTime
                              );
                              let expectedArivalTime = moment(
                                res.data[0].stopList[i].expectedArivalTime
                              );

                              let diffr =
                                expectedDepartureTime.diff(expectedArivalTime);

                              settimerDuration(120);

                              setEmpForAttandance(
                                res.data[0].stopList[i].deBoardPassengers,
                                res.data[0].tripType
                              );

                              setshowNextStopBottomModal(true);
                              setshowcompleteRide(false);

                              setlastPoint("");
                              setratingEmpList([]);
                              break;
                            }
                          }
                        } else {
                        }
                      }
                    }
                  }
                } else {
                  setcompleteRideData(getLastStopPoint);
                  setshowNextStopBottomModal(false);
                  setshowcompleteRide(true);

                  setshowQrCodeModalPopup(false);
                  let lastPoint = res.data[0].stopList[0];
                  setlastPoint(lastPoint);

                  setshowmap(false);

                  if (isRatingListSet === false) {
                    setratingEmpList(lastPoint.onBoardPassengers);
                    setisRatingListSet(true);
                  } else {
                  }
                }
              } else {
                for (let i = 0; i < res.data[0].stopList.length; i++) {
                  if (res.data[0].stopList.length === i + 1) {
                    let getEmpStatus = res.data[0].stopList[
                      i
                    ].deBoardPassengers.find(
                      (itemData) => itemData.status === "BOARDED"
                    );

                    if (getEmpStatus === undefined || getEmpStatus === null) {
                      let getLastStopPoint =
                        res.data[0].stopList[res.data[0].stopList.length - 1];
                      completeDownTrip(getLastStopPoint);
                      setshowNextStopBottomModal(false);
                      setshowcompleteRide(true);

                      setshowQrCodeModalPopup(false);
                      let lastPoint = res.data[0].stopList[0];
                      setlastPoint(lastPoint);

                      setshowmap(false);

                      if (isRatingListSet === false) {
                        setratingEmpList(lastPoint.onBoardPassengers);
                        setisRatingListSet(true);
                      } else {
                      }
                    } else {
                      if (
                        res.data[0].stopList[i].status === "SCHEDULE" ||
                        res.data[0].stopList[i].status === "ARRIVED"
                      ) {
                        let getEmpStatus = res.data[0].stopList[
                          i
                        ].deBoardPassengers.find(
                          (itemData) => itemData.status === "BOARDED"
                        );

                        if (
                          getEmpStatus === null ||
                          getEmpStatus === undefined
                        ) {
                        } else {
                          setpassengersListType("deBoardPassengers");
                          setnextPickupLocation(res.data[0].stopList[i + 1]);
                          setongoingRideData(res.data[0].stopList[i]);

                          let ongoingRideData = {
                            isOngoing: true,
                          };
                          AsyncStorage.setItem(
                            "ongoingRideData",
                            JSON.stringify(ongoingRideData)
                          );

                          let expectedDepartureTime = moment(
                            res.data[0].stopList[i].expectedDepartureTime
                          );
                          let expectedArivalTime = moment(
                            res.data[0].stopList[i].expectedArivalTime
                          );

                          let diffr =
                            expectedDepartureTime.diff(expectedArivalTime);

                          settimerDuration(120);

                          setEmpForAttandance(
                            res.data[0].stopList[i].deBoardPassengers,
                            res.data[0].tripType
                          );

                          setshowNextStopBottomModal(true);
                          setshowcompleteRide(false);

                          setlastPoint("");
                          setratingEmpList([]);
                          break;
                        }
                      }
                    }
                  } else {
                    if (i === 0) {
                      if (
                        res.data[0].stopList[i].status === "SCHEDULE" ||
                        res.data[0].stopList[i].status === "ARRIVED"
                      ) {
                        setpassengersListType("onBoardPassengers");
                        setnextPickupLocation(res.data[0].stopList[i + 1]);
                        setongoingRideData(res.data[0].stopList[i]);

                        let ongoingRideData = {
                          isOngoing: true,
                        };
                        AsyncStorage.setItem(
                          "ongoingRideData",
                          JSON.stringify(ongoingRideData)
                        );

                        let expectedDepartureTime = moment(
                          res.data[0].stopList[i].expectedDepartureTime
                        );
                        let expectedArivalTime = moment(
                          res.data[0].stopList[i].expectedArivalTime
                        );

                        let diffr =
                          expectedDepartureTime.diff(expectedArivalTime);

                        settimerDuration(120);

                        setEmpForAttandance(
                          res.data[0].stopList[i].onBoardPassengers,
                          res.data[0].tripType
                        );

                        setshowNextStopBottomModal(true);
                        setshowcompleteRide(false);

                        setlastPoint("");
                        setratingEmpList([]);
                        break;
                      }
                    } else {
                      if (
                        res.data[0].stopList[i].deBoardPassengers.length > 0
                      ) {
                        if (
                          res.data[0].stopList[i].status === "SCHEDULE" ||
                          res.data[0].stopList[i].status === "ARRIVED"
                        ) {
                          let getEmpStatus = res.data[0].stopList[
                            i
                          ].deBoardPassengers.find(
                            (itemData) => itemData.status === "BOARDED"
                          );

                          if (
                            getEmpStatus === null ||
                            getEmpStatus === undefined
                          ) {
                          } else {
                            if (passengersListType === "onBoardPassengers") {
                            }
                            setpassengersListType("deBoardPassengers");
                            setnextPickupLocation(res.data[0].stopList[i + 1]);
                            setongoingRideData(res.data[0].stopList[i]);

                            let ongoingRideData = {
                              isOngoing: true,
                            };
                            AsyncStorage.setItem(
                              "ongoingRideData",
                              JSON.stringify(ongoingRideData)
                            );

                            let expectedDepartureTime = moment(
                              res.data[0].stopList[i].expectedDepartureTime
                            );
                            let expectedArivalTime = moment(
                              res.data[0].stopList[i].expectedArivalTime
                            );

                            let diffr =
                              expectedDepartureTime.diff(expectedArivalTime);

                            settimerDuration(120);

                            setEmpForAttandance(
                              res.data[0].stopList[i].deBoardPassengers,
                              res.data[0].tripType
                            );

                            setshowNextStopBottomModal(true);
                            setshowcompleteRide(false);

                            setlastPoint("");
                            setratingEmpList([]);
                            break;
                          }
                        }
                      } else {
                      }
                    }
                  }
                }
              }
            } else {
            }
          } else {
            if (
              getNewRideData?.newRideData == "Trip Assign" ||
              getNewRideData?.newRideData == "Alert Driver for Upcoming Trip" ||
              getNewRideData?.newRideData == "Trip Start" ||
              getNewRideData?.newRideData == ""
            ) {
            } else {
              showSuccess("Ride completed successfully.");
              actions.newRideAssign("");
              let ongoingRideData = {
                isOngoing: false,
              };
              AsyncStorage.setItem(
                "ongoingRideData",
                JSON.stringify(ongoingRideData)
              );
              setItem("coveredCord", []);
              removeUserData("coveredCord");
              setCoveredRouteCord([]);
              setratingEmpList([]);
              setongoingRideData("");
              clearInterval(nightHooterInterval);
              AsyncStorage.removeItem("DynamicETA");
              BackgroundTimer.clearInterval(timer);
              AsyncStorage.removeItem("DriverCurrentPoint");
              AsyncStorage.removeItem("DriverLastPoint");
              BackgroundTimer.clearInterval(stoppageTimer);
              BackgroundTimer.clearInterval(gpsSignalTimer);
              setData("");
              setongoingRideData("");
              navigation.navigate(navigationStrings.HOME);
            }
          }
        } else {
          showError(res.message);
        }
      })
      .catch((err) => {
        setshowAttendenceLoading(false);
        setshowLoader(false);
      });
  };

  const getDriverOngoingRide_2 = async () => {
    actions
      .getRide(DRIVER_ONGOING_RIDE)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.length > 0) {
            if (
              res?.data[0]?.escortTrip === "Yes" ||
              res?.data[0]?.escortTrip === "YES"
            ) {
              setisThisEscortTrip(true);
            } else {
              setisThisEscortTrip(false);
            }
            if (res.data[0].tripType === "UPTRIP") {
              setData(res);

              settripId(res.data[0].id);
              settripType(res.data[0].tripType);

              settripStartTime(res.data[0].startTimeInMiliSec);

              let uptripLastStop =
                res.data[0].stopList[res.data[0].stopList.length - 1];

              let callingEmpList = [];

              for (
                let k = 0;
                k < uptripLastStop?.deBoardPassengers?.length;
                k++
              ) {
                if (
                  uptripLastStop?.deBoardPassengers[k]?.status === "SCHEDULE"
                ) {
                  callingEmpList.push(uptripLastStop?.deBoardPassengers[k]);
                }
              }
              setempListForCall(callingEmpList);
              let getAllEmpList = uptripLastStop?.deBoardPassengers.map(
                (emp) => {
                  if (
                    emp?.status === "ABSENT" ||
                    emp?.status === "COMPLETED" ||
                    emp?.status === "CANCLED" ||
                    emp?.status === "NOSHOW" ||
                    emp?.status === "SKIPPED"
                  ) {
                    return null;
                  } else {
                    return emp.empId;
                  }
                }
              );
              getAllEmpList.push(res?.data[0]?.vendorId);
              getAllEmpList.push(res?.data[0]?.corporateId);
              setallEmpList(getAllEmpList);

              var respArr = res.data[0].stopList.map((item, index) => {
                if (item?.status === "SCHEDULE" || item?.status === "ARRIVED") {
                  return (
                    item?.location?.latitude + "," + item?.location?.longitude
                  );
                }
              });

              var lastItem = respArr.pop();

              setdestination(lastItem);
              setwayPoints(respArr);

              for (var i = 0; i < res.data[0].stopList.length; i++) {
                if (res.data[0].stopList[i].onBoardPassengers === null) {
                  if (res.data[0].stopList[i].status === "SCHEDULE") {
                    if (
                      driverAppSettingData?.displayLoginCompleteTripButtonAfterAllEmpAttdCapture ==
                      "YES"
                    ) {
                      setshowNextStopBottomModal(false);
                      setshowcompleteRide(true);

                      setshowQrCodeModalPopup(false);
                      let lastPoint =
                        res.data[0].stopList[res.data[0].stopList.length - 1];
                      setlastPoint(lastPoint);

                      setshowmap(false);
                      setongoingRideData(res.data[0].stopList[i]);

                      let ongoingRideData = {
                        isOngoing: true,
                      };
                      AsyncStorage.setItem(
                        "ongoingRideData",
                        JSON.stringify(ongoingRideData)
                      );

                      if (isRatingListSet === false) {
                        setratingEmpList(lastPoint.deBoardPassengers);
                        setisRatingListSet(true);
                      } else {
                      }

                      let expectedDepartureTime = moment(
                        res.data[0].stopList[i].expectedDepartureTime
                      );
                      let expectedArivalTime = moment(
                        res.data[0].stopList[i].expectedArivalTime
                      );

                      let diffr =
                        expectedDepartureTime.diff(expectedArivalTime);

                      settimerDuration(120);

                      break;
                    } else {
                      setongoingRideData(res.data[0].stopList[i]);

                      let ongoingRideData = {
                        isOngoing: true,
                      };
                      AsyncStorage.setItem(
                        "ongoingRideData",
                        JSON.stringify(ongoingRideData)
                      );

                      let expectedDepartureTime = moment(
                        res.data[0].stopList[i].expectedDepartureTime
                      );
                      let expectedArivalTime = moment(
                        res.data[0].stopList[i].expectedArivalTime
                      );

                      let diffr =
                        expectedDepartureTime.diff(expectedArivalTime);

                      settimerDuration(120);

                      setEmpForAttandance(
                        res.data[0].stopList[i].deBoardPassengers,
                        res.data[0].tripType
                      );

                      setshowNextStopBottomModal(true);
                      setshowcompleteRide(false);

                      setlastPoint("");
                      setratingEmpList([]);

                      break;
                    }
                  } else {
                    setshowNextStopBottomModal(false);
                    setshowcompleteRide(true);

                    setshowQrCodeModalPopup(false);
                    let lastPoint =
                      res.data[0].stopList[res.data[0].stopList.length - 1];
                    setlastPoint(lastPoint);

                    setshowmap(false);
                    setongoingRideData("");
                    let ongoingRideData = {
                      isOngoing: true,
                    };
                    AsyncStorage.setItem(
                      "ongoingRideData",
                      JSON.stringify(ongoingRideData)
                    );

                    if (isRatingListSet === false) {
                      setratingEmpList(lastPoint.deBoardPassengers);
                      setisRatingListSet(true);
                    } else {
                    }
                  }
                } else {
                  if (
                    res.data[0].stopList[i].status === "SCHEDULE" ||
                    res.data[0].stopList[i].status === "ARRIVED"
                  ) {
                    setnextPickupLocation(res.data[0].stopList[i + 1]);
                    setongoingRideData(res.data[0].stopList[i]);

                    let expectedDepartureTime = moment(
                      res.data[0].stopList[i].expectedDepartureTime
                    );
                    let expectedArivalTime = moment(
                      res.data[0].stopList[i].expectedArivalTime
                    );

                    let diffr = expectedDepartureTime.diff(expectedArivalTime);

                    settimerDuration(120);

                    setEmpForAttandance(
                      res.data[0].stopList[i].onBoardPassengers,
                      res.data[0].tripType
                    );

                    setshowNextStopBottomModal(true);
                    setshowcompleteRide(false);

                    setlastPoint("");
                    setratingEmpList([]);

                    break;
                  } else {
                  }
                }
              }
            } else if (res.data[0].tripType === "DOWNTRIP") {
              setData(res);

              settripId(res.data[0].id);
              settripType(res.data[0].tripType);

              settripStartTime(res.data[0].startTimeInMiliSec);

              let uptripLastStop = res?.data[0]?.stopList[0];

              let callingEmpList = [];

              for (
                let k = 0;
                k < uptripLastStop?.onBoardPassengers?.length;
                k++
              ) {
                if (
                  uptripLastStop?.onBoardPassengers[k]?.status === "SCHEDULE"
                ) {
                  callingEmpList.push(uptripLastStop?.onBoardPassengers[k]);
                }
              }
              setempListForCall(callingEmpList);
              let getAllEmpList = uptripLastStop?.onBoardPassengers.map(
                (emp) => {
                  if (
                    emp?.status === "COMPLETED" ||
                    emp?.status === "ABSENT" ||
                    emp?.status === "CANCLED" ||
                    emp?.status === "NOSHOW" ||
                    emp?.status === "SKIPPED"
                  ) {
                    return null;
                  } else {
                    return emp.empId;
                  }
                }
              );
              getAllEmpList.push(res?.data[0]?.vendorId);
              getAllEmpList.push(res?.data[0]?.corporateId);
              setallEmpList(getAllEmpList);

              var respArr = res.data[0].stopList.map((item, index) => {
                if (item?.status === "SCHEDULE" || item?.status === "ARRIVED") {
                  return (
                    item?.location?.latitude + "," + item?.location?.longitude
                  );
                }
              });

              var lastItem = respArr.pop();

              let getLastStopPoint =
                res.data[0].stopList[res.data[0].stopList.length - 1];

              setdestination(lastItem);
              setwayPoints(respArr);

              if (getLastStopPoint.status === "DEPARTURED") {
                let getStopPointStatus = res.data[0].stopList.find(
                  (itemData) =>
                    itemData.status === "SCHEDULE" ||
                    itemData.status === "ARRIVED"
                );

                if (getStopPointStatus) {
                  for (let i = 0; i < res.data[0].stopList.length; i++) {
                    if (res.data[0].stopList.length === i + 1) {
                      let getEmpStatus = res.data[0].stopList[
                        i
                      ].deBoardPassengers.find(
                        (itemData) => itemData.status === "BOARDED"
                      );

                      if (getEmpStatus === undefined || getEmpStatus === null) {
                        let getLastStopPoint =
                          res.data[0].stopList[res.data[0].stopList.length - 1];
                        completeDownTrip(getLastStopPoint);
                        setshowNextStopBottomModal(false);
                        setshowcompleteRide(true);

                        setshowQrCodeModalPopup(false);
                        let lastPoint = res.data[0].stopList[0];
                        setlastPoint(lastPoint);

                        setshowmap(false);

                        if (isRatingListSet === false) {
                          setratingEmpList(lastPoint.onBoardPassengers);
                          setisRatingListSet(true);
                        } else {
                        }
                      } else {
                        if (
                          res.data[0].stopList[i].status === "SCHEDULE" ||
                          res.data[0].stopList[i].status === "ARRIVED"
                        ) {
                          let getEmpStatus = res.data[0].stopList[
                            i
                          ].deBoardPassengers.find(
                            (itemData) => itemData.status === "BOARDED"
                          );

                          if (
                            getEmpStatus === null ||
                            getEmpStatus === undefined
                          ) {
                          } else {
                            setpassengersListType("deBoardPassengers");
                            setnextPickupLocation(res.data[0].stopList[i + 1]);
                            setongoingRideData(res.data[0].stopList[i]);

                            let expectedDepartureTime = moment(
                              res.data[0].stopList[i].expectedDepartureTime
                            );
                            let expectedArivalTime = moment(
                              res.data[0].stopList[i].expectedArivalTime
                            );

                            let diffr =
                              expectedDepartureTime.diff(expectedArivalTime);

                            settimerDuration(120);

                            setEmpForAttandance(
                              res.data[0].stopList[i].deBoardPassengers,
                              res.data[0].tripType
                            );

                            setshowNextStopBottomModal(true);
                            setshowcompleteRide(false);

                            setlastPoint("");
                            setratingEmpList([]);
                            break;
                          }
                        }
                      }
                    } else {
                      if (i === 0) {
                        if (
                          res.data[0].stopList[i].status === "SCHEDULE" ||
                          res.data[0].stopList[i].status === "ARRIVED"
                        ) {
                          setpassengersListType("onBoardPassengers");
                          setnextPickupLocation(res.data[0].stopList[i + 1]);
                          setongoingRideData(res.data[0].stopList[i]);

                          let expectedDepartureTime = moment(
                            res.data[0].stopList[i].expectedDepartureTime
                          );
                          let expectedArivalTime = moment(
                            res.data[0].stopList[i].expectedArivalTime
                          );

                          let diffr =
                            expectedDepartureTime.diff(expectedArivalTime);

                          settimerDuration(120);

                          setEmpForAttandance(
                            res.data[0].stopList[i].onBoardPassengers,
                            res.data[0].tripType
                          );

                          setshowNextStopBottomModal(true);
                          setshowcompleteRide(false);

                          setlastPoint("");
                          setratingEmpList([]);
                          break;
                        }
                      } else {
                        if (
                          res.data[0].stopList[i].deBoardPassengers.length > 0
                        ) {
                          if (
                            res.data[0].stopList[i].status === "SCHEDULE" ||
                            res.data[0].stopList[i].status === "ARRIVED"
                          ) {
                            let getEmpStatus = res.data[0].stopList[
                              i
                            ].deBoardPassengers.find(
                              (itemData) => itemData.status === "BOARDED"
                            );

                            if (
                              getEmpStatus === null ||
                              getEmpStatus === undefined
                            ) {
                            } else {
                              if (passengersListType === "onBoardPassengers") {
                              }
                              setpassengersListType("deBoardPassengers");
                              setnextPickupLocation(
                                res.data[0].stopList[i + 1]
                              );
                              setongoingRideData(res.data[0].stopList[i]);

                              let expectedDepartureTime = moment(
                                res.data[0].stopList[i].expectedDepartureTime
                              );
                              let expectedArivalTime = moment(
                                res.data[0].stopList[i].expectedArivalTime
                              );

                              let diffr =
                                expectedDepartureTime.diff(expectedArivalTime);

                              settimerDuration(120);

                              setEmpForAttandance(
                                res.data[0].stopList[i].deBoardPassengers,
                                res.data[0].tripType
                              );

                              setshowNextStopBottomModal(true);
                              setshowcompleteRide(false);

                              setlastPoint("");
                              setratingEmpList([]);
                              break;
                            }
                          }
                        } else {
                        }
                      }
                    }
                  }
                } else {
                  setcompleteRideData(getLastStopPoint);
                  setshowNextStopBottomModal(false);
                  setshowcompleteRide(true);

                  setshowQrCodeModalPopup(false);
                  let lastPoint = res.data[0].stopList[0];
                  setlastPoint(lastPoint);

                  setshowmap(false);

                  if (isRatingListSet === false) {
                    setratingEmpList(lastPoint.onBoardPassengers);
                    setisRatingListSet(true);
                  } else {
                  }
                }
              } else {
                for (let i = 0; i < res.data[0].stopList.length; i++) {
                  if (res.data[0].stopList.length === i + 1) {
                    let getEmpStatus = res.data[0].stopList[
                      i
                    ].deBoardPassengers.find(
                      (itemData) => itemData.status === "BOARDED"
                    );

                    if (getEmpStatus === undefined || getEmpStatus === null) {
                      let getLastStopPoint =
                        res.data[0].stopList[res.data[0].stopList.length - 1];
                      completeDownTrip(getLastStopPoint);
                      setshowNextStopBottomModal(false);
                      setshowcompleteRide(true);

                      setshowQrCodeModalPopup(false);
                      let lastPoint = res.data[0].stopList[0];
                      setlastPoint(lastPoint);

                      setshowmap(false);

                      if (isRatingListSet === false) {
                        setratingEmpList(lastPoint.onBoardPassengers);
                        setisRatingListSet(true);
                      } else {
                      }
                    } else {
                      if (
                        res.data[0].stopList[i].status === "SCHEDULE" ||
                        res.data[0].stopList[i].status === "ARRIVED"
                      ) {
                        let getEmpStatus = res.data[0].stopList[
                          i
                        ].deBoardPassengers.find(
                          (itemData) => itemData.status === "BOARDED"
                        );

                        if (
                          getEmpStatus === null ||
                          getEmpStatus === undefined
                        ) {
                        } else {
                          setpassengersListType("deBoardPassengers");
                          setnextPickupLocation(res.data[0].stopList[i + 1]);
                          setongoingRideData(res.data[0].stopList[i]);

                          let expectedDepartureTime = moment(
                            res.data[0].stopList[i].expectedDepartureTime
                          );
                          let expectedArivalTime = moment(
                            res.data[0].stopList[i].expectedArivalTime
                          );

                          let diffr =
                            expectedDepartureTime.diff(expectedArivalTime);

                          settimerDuration(120);

                          setEmpForAttandance(
                            res.data[0].stopList[i].deBoardPassengers,
                            res.data[0].tripType
                          );

                          setshowNextStopBottomModal(true);
                          setshowcompleteRide(false);

                          setlastPoint("");
                          setratingEmpList([]);
                          break;
                        }
                      }
                    }
                  } else {
                    if (i === 0) {
                      if (
                        res.data[0].stopList[i].status === "SCHEDULE" ||
                        res.data[0].stopList[i].status === "ARRIVED"
                      ) {
                        setpassengersListType("onBoardPassengers");
                        setnextPickupLocation(res.data[0].stopList[i + 1]);
                        setongoingRideData(res.data[0].stopList[i]);

                        let expectedDepartureTime = moment(
                          res.data[0].stopList[i].expectedDepartureTime
                        );
                        let expectedArivalTime = moment(
                          res.data[0].stopList[i].expectedArivalTime
                        );

                        let diffr =
                          expectedDepartureTime.diff(expectedArivalTime);

                        settimerDuration(120);

                        setEmpForAttandance(
                          res.data[0].stopList[i].onBoardPassengers,
                          res.data[0].tripType
                        );

                        setshowNextStopBottomModal(true);
                        setshowcompleteRide(false);

                        setlastPoint("");
                        setratingEmpList([]);
                        break;
                      }
                    } else {
                      if (
                        res.data[0].stopList[i].deBoardPassengers.length > 0
                      ) {
                        if (
                          res.data[0].stopList[i].status === "SCHEDULE" ||
                          res.data[0].stopList[i].status === "ARRIVED"
                        ) {
                          let getEmpStatus = res.data[0].stopList[
                            i
                          ].deBoardPassengers.find(
                            (itemData) => itemData.status === "BOARDED"
                          );

                          if (
                            getEmpStatus === null ||
                            getEmpStatus === undefined
                          ) {
                          } else {
                            if (passengersListType === "onBoardPassengers") {
                            }
                            setpassengersListType("deBoardPassengers");
                            setnextPickupLocation(res.data[0].stopList[i + 1]);
                            setongoingRideData(res.data[0].stopList[i]);

                            let expectedDepartureTime = moment(
                              res.data[0].stopList[i].expectedDepartureTime
                            );
                            let expectedArivalTime = moment(
                              res.data[0].stopList[i].expectedArivalTime
                            );

                            let diffr =
                              expectedDepartureTime.diff(expectedArivalTime);

                            settimerDuration(120);

                            setEmpForAttandance(
                              res.data[0].stopList[i].deBoardPassengers,
                              res.data[0].tripType
                            );

                            setshowNextStopBottomModal(true);
                            setshowcompleteRide(false);

                            setlastPoint("");
                            setratingEmpList([]);
                            break;
                          }
                        }
                      } else {
                      }
                    }
                  }
                }
              }
            } else {
            }
          } else {
            showSuccess("Ride completed successfully.");
            actions.newRideAssign("");
            let ongoingRideData = {
              isOngoing: false,
            };
            AsyncStorage.setItem(
              "ongoingRideData",
              JSON.stringify(ongoingRideData)
            );
            setItem("coveredCord", []);
            removeUserData("coveredCord");
            setCoveredRouteCord([]);
            setratingEmpList([]);
            setongoingRideData("");
            clearInterval(nightHooterInterval);
            AsyncStorage.removeItem("DynamicETA");
            BackgroundTimer.clearInterval(timer);
            AsyncStorage.removeItem("DriverCurrentPoint");
            AsyncStorage.removeItem("DriverLastPoint");
            BackgroundTimer.clearInterval(gpsSignalTimer);
            BackgroundTimer.clearInterval(stoppageTimer);
            setData("");
            setongoingRideData("");
            navigation.navigate(navigationStrings.HOME);
          }
        } else {
          showError(res.message);
        }
      })
      .catch((err) => {});
  };

  const fitToCoordinates = async () => {
    if (coveredRouteCord?.length > 0) {
      await mapRef?.current?.fitToCoordinates(coveredRouteCord, {
        edgePadding: {
          top: 30,
          right: 30,
          bottom: 30,
          left: 30,
        },
      });
    }
  };

  const completeDownTrip = (id, lastStopStatus) => {
    if (snapShotUri === "") {
    } else {
      let sendingData = {
        tripId: tripId,
        location: lastStopStatus.location,
        deBoardPassengers: lastStopStatus.deBoardPassengers,
        id: lastStopStatus?.id,
      };

      actions
        .completeTrip(sendingData)
        .then((res) => {
          if (res.status === 200) {
            //submitSnapshot();

            let ongoingRideData = {
              isOngoing: false,
            };
            AsyncStorage.setItem(
              "ongoingRideData",
              JSON.stringify(ongoingRideData)
            );
            setItem("coveredCord", []);
            showSuccess("Ride completed successfully.");
            actions.newRideAssign("");
            removeUserData("coveredCord");
            setCoveredRouteCord([]);
            setratingEmpList([]);
            setongoingRideData("");
            clearInterval(nightHooterInterval);

            AsyncStorage.removeItem("DynamicETA");
            BackgroundTimer.clearInterval(timer);
            AsyncStorage.removeItem("DriverCurrentPoint");
            AsyncStorage.removeItem("DriverLastPoint");
            BackgroundTimer.clearInterval(gpsSignalTimer);
            BackgroundTimer.clearInterval(stoppageTimer);
            setData("");
            setongoingRideData("");
            navigation.navigate(navigationStrings.HOME);
          } else {
          }
        })
        .catch((err) => {});
    }
  };

  const setEmpForAttandance = async (arr) => {
    setattandanceEmployeeList(arr);
  };

  const getDriverNextRide = () => {
    actions
      .getRide(DRIVER_NEXT_RIDE)
      .then((res) => {
        if (res?.status === 200) {
          if (res?.data?.length > 0) {
            for (var j = 0; j < res.data.length; j++) {
              var todayDate = moment(new Date()).format("YYYY-MM-DD");
              var tripDate = res.data[j].date;
              var empCount = [];
              if (todayDate === tripDate) {
                setshowDragButton(true);
                setnextTripPopupData(res.data[j]);
                if (res.data[j]?.tripType === "UPTRIP") {
                  let getLastStopPoint =
                    res.data[j]?.stopList[res.data[j]?.stopList?.length - 1];

                  for (
                    let i = 0;
                    i < getLastStopPoint?.deBoardPassengers?.length;
                    i++
                  ) {
                    if (
                      getLastStopPoint?.deBoardPassengers[i]?.passType ===
                      "EMPLOYEE"
                    ) {
                      if (
                        getLastStopPoint?.deBoardPassengers[i]?.status ===
                        "SCHEDULE"
                      ) {
                        empCount.push(
                          getLastStopPoint?.deBoardPassengers[i]?.empId
                        );
                      } else {
                      }
                    }
                  }
                  settotalEmpCount(empCount);
                } else {
                  let getFirstStopPoint = res.data[j]?.stopList[0];
                  for (
                    let i = 0;
                    i < getFirstStopPoint?.onBoardPassengers?.length;
                    i++
                  ) {
                    if (
                      getFirstStopPoint?.onBoardPassengers[i]?.passType ===
                      "EMPLOYEE"
                    ) {
                      if (
                        getFirstStopPoint?.onBoardPassengers[i]?.status ===
                        "SCHEDULE"
                      ) {
                        empCount.push(
                          getFirstStopPoint?.onBoardPassengers[i]?.empId
                        );
                      } else {
                      }
                    }
                  }
                  settotalEmpCount(empCount);
                }

                break;
              } else {
                setshowDragButton(false);
              }
            }
          } else {
            setshowDragButton(false);
          }
        } else {
          setshowDragButton(false);
        }
      })
      .catch((err) => {});
  };

  const acceptRejectRide = async (status, id) => {
    let sendData = {
      tripId: id,

      status: status,
      deviceId: "",
    };

    actions
      .driverAcceptRejectRide(sendData)
      .then((res) => {
        if (res.status === 200) {
          showSuccess("Trip Accepted Successfully.");
          getDriverNextRide();
        } else {
          showError(res.message);
        }
      })
      .catch((err) => {});
  };

  const completeRide = () => {
    showRating.current.open();
  };

  const submitShortId = () => {
    for (let i = 0; i < attandanceEmployeeList.length; i++) {
      if (attandanceEmployeeList[i].tripType === "DOWNTRIP") {
        if (passengersListType === "") {
        } else {
          if (passengersListType === "deBoardPassengers") {
            if (attandanceEmployeeList[i].shortId === empShortId) {
              if (attandanceEmployeeList[i].status === "BOARDED") {
                let newArr = attandanceEmployeeList.map((itemDta) => {
                  if (itemDta?.id === attandanceEmployeeList[i]?.id) {
                    itemDta.status = "COMPLETED";
                  }
                  return { ...itemDta };
                });

                let checkEmpAllBoarded = newArr.find(
                  (listItem) => listItem.status === "BOARDED"
                );

                if (checkEmpAllBoarded) {
                  submitEmployeeAttendenceTime(
                    attandanceEmployeeList[i].id,
                    attandanceEmployeeList[i].name,
                    attandanceEmployeeList[i].empId
                  );
                } else {
                  submitEmployeeAttendenceTime(
                    attandanceEmployeeList[i].id,
                    attandanceEmployeeList[i].name,
                    attandanceEmployeeList[i].empId
                  );
                  setshowTimer(false);
                  setnotshow(false);

                  setshowQrCodeModalPopup(false);
                }

                return;
              } else {
                let empStatus =
                  attandanceEmployeeList[i].status.charAt(0).toUpperCase() +
                  attandanceEmployeeList[i].status.slice(1).toLowerCase();
                setshowErrorMessage(true);
                seterrorMessageColor(colors.redColor);
                setinputBoxColor(colors.redColor);

                setTimeout(() => {
                  setshowErrorMessage(false);
                  seterrorMessage("");
                }, 3000);

                if (attandanceEmployeeList[i].status === "COMPLETED") {
                  seterrorMessage(
                    `${attandanceEmployeeList[i].passType} is Deboarded`
                  );
                } else {
                  seterrorMessage(
                    `${attandanceEmployeeList[i].passType} is ${empStatus}`
                  );
                }
                return;
              }
            }
          } else {
            let findEscortAt = ongoingRideData?.onBoardPassengers.find(
              (itemData) => itemData.passType === "ESCORT"
            );

            if (findEscortAt) {
              if (findEscortAt?.status === "SCHEDULE") {
                if (
                  attandanceEmployeeList[i].shortId === empShortId &&
                  attandanceEmployeeList[i].passType == "ESCORT"
                ) {
                  if (attandanceEmployeeList[i].status === "SCHEDULE") {
                    let newArr = attandanceEmployeeList.map((itemDta) => {
                      if (itemDta?.id === attandanceEmployeeList[i]?.id) {
                        itemDta.status = "BOARDED";
                      }
                      return { ...itemDta };
                    });

                    if (attandanceEmployeeList[i].passType === "ESCORT") {
                      submitEmployeeAttendenceTime(
                        attandanceEmployeeList[i].id,
                        attandanceEmployeeList[i].name,
                        attandanceEmployeeList[i].empId
                      );

                      setshowQrCodeModalPopup(false);
                    } else {
                      let checkEmpAllBoarded = newArr.find(
                        (listItem) => listItem.status === "SCHEDULE"
                      );

                      if (checkEmpAllBoarded) {
                        submitEmployeeAttendenceTime(
                          attandanceEmployeeList[i].id,
                          attandanceEmployeeList[i].name,
                          attandanceEmployeeList[i].empId
                        );
                      } else {
                        setshowTimer(false);
                        setnotshow(false);
                        submitEmployeeAttendenceTime(
                          attandanceEmployeeList[i].id,
                          attandanceEmployeeList[i].name,
                          attandanceEmployeeList[i].empId
                        );

                        setshowQrCodeModalPopup(false);
                      }

                      return;
                    }
                  } else {
                    let empStatus =
                      attandanceEmployeeList[i].status.charAt(0).toUpperCase() +
                      attandanceEmployeeList[i].status.slice(1).toLowerCase();

                    seterrorMessageColor(colors.black);
                    setinputBoxColor(colors.black);
                    seterrorMessage(
                      `${attandanceEmployeeList[i].passType} is ${empStatus}`
                    );
                    setshowErrorMessage(true);
                    setTimeout(() => {
                      setshowErrorMessage(false);
                      seterrorMessage("");
                    }, 3000);
                    return;
                  }
                } else {
                  seterrorMessage(`Invalid Employee Id`);
                  seterrorMessageColor(colors?.redColor);
                  setinputBoxColor(colors.redColor);
                  setshowErrorMessage(true);
                  setTimeout(() => {
                    setshowErrorMessage(false);
                    seterrorMessage("");
                  }, 3000);
                }
              } else {
                if (attandanceEmployeeList[i].shortId === empShortId) {
                  if (attandanceEmployeeList[i].status === "SCHEDULE") {
                    let newArr = attandanceEmployeeList.map((itemDta) => {
                      if (itemDta?.id === attandanceEmployeeList[i]?.id) {
                        itemDta.status = "BOARDED";
                      }
                      return { ...itemDta };
                    });

                    if (attandanceEmployeeList[i].passType === "ESCORT") {
                      submitEmployeeAttendenceTime(
                        attandanceEmployeeList[i].id,
                        attandanceEmployeeList[i].name,
                        attandanceEmployeeList[i].empId
                      );

                      setshowQrCodeModalPopup(false);
                    } else {
                      let checkEmpAllBoarded = newArr.find(
                        (listItem) => listItem.status === "SCHEDULE"
                      );

                      if (checkEmpAllBoarded) {
                        submitEmployeeAttendenceTime(
                          attandanceEmployeeList[i].id,
                          attandanceEmployeeList[i].name,
                          attandanceEmployeeList[i].empId
                        );
                      } else {
                        setshowTimer(false);
                        setnotshow(false);
                        submitEmployeeAttendenceTime(
                          attandanceEmployeeList[i].id,
                          attandanceEmployeeList[i].name,
                          attandanceEmployeeList[i].empId
                        );

                        setshowQrCodeModalPopup(false);
                      }

                      return;
                    }
                  } else {
                    let empStatus =
                      attandanceEmployeeList[i].status.charAt(0).toUpperCase() +
                      attandanceEmployeeList[i].status.slice(1).toLowerCase();
                    seterrorMessage(
                      `${attandanceEmployeeList[i].passType} is ${empStatus}`
                    );
                    seterrorMessageColor(colors.redColor);
                    setinputBoxColor(colors.redColor);
                    setshowErrorMessage(true);
                    setTimeout(() => {
                      setshowErrorMessage(false);
                      seterrorMessage("");
                    }, 3000);
                    return;
                  }
                }
              }
            } else {
              if (attandanceEmployeeList[i].shortId === empShortId) {
                if (attandanceEmployeeList[i].status === "SCHEDULE") {
                  let newArr = attandanceEmployeeList.map((itemDta) => {
                    if (itemDta?.id === attandanceEmployeeList[i]?.id) {
                      itemDta.status = "BOARDED";
                    }
                    return { ...itemDta };
                  });

                  if (attandanceEmployeeList[i].passType === "ESCORT") {
                    submitEmployeeAttendenceTime(
                      attandanceEmployeeList[i].id,
                      attandanceEmployeeList[i].name,
                      attandanceEmployeeList[i].empId
                    );

                    setshowQrCodeModalPopup(false);
                  } else {
                    let checkEmpAllBoarded = newArr.find(
                      (listItem) => listItem.status === "SCHEDULE"
                    );

                    if (checkEmpAllBoarded) {
                      submitEmployeeAttendenceTime(
                        attandanceEmployeeList[i].id,
                        attandanceEmployeeList[i].name,
                        attandanceEmployeeList[i].empId
                      );
                    } else {
                      setshowTimer(false);
                      setnotshow(false);
                      submitEmployeeAttendenceTime(
                        attandanceEmployeeList[i].id,
                        attandanceEmployeeList[i].name,
                        attandanceEmployeeList[i].empId
                      );

                      setshowQrCodeModalPopup(false);
                    }

                    return;
                  }
                } else {
                  let empStatus =
                    attandanceEmployeeList[i].status.charAt(0).toUpperCase() +
                    attandanceEmployeeList[i].status.slice(1).toLowerCase();
                  seterrorMessage(
                    `${attandanceEmployeeList[i].passType} is ${empStatus}`
                  );
                  seterrorMessageColor(colors.black);
                  setinputBoxColor(colors.black);
                  setshowErrorMessage(true);
                  setTimeout(() => {
                    setshowErrorMessage(false);
                    seterrorMessage("");
                  }, 3000);
                  return;
                }
              }
            }
          }
        }
      } else {
        if (attandanceEmployeeList.length === 1) {
          if (attandanceEmployeeList[i].shortId == empShortId) {
            if (attandanceEmployeeList[i].status === "SCHEDULE") {
              setshowTimer(false);
              setnotshow(false);

              setshowQrCodeModalPopup(false);

              submitEmployeeAttendenceTime(
                attandanceEmployeeList[i].id,
                attandanceEmployeeList[i].name,
                attandanceEmployeeList[i].empId
              );

              return;
            } else {
              setshowErrorMessage(true);
              let empStatus =
                attandanceEmployeeList[i].status.charAt(0).toUpperCase() +
                attandanceEmployeeList[i].status.slice(1).toLowerCase();
              seterrorMessageColor(colors.redColor);
              setinputBoxColor(colors.redColor);
              seterrorMessage(
                `${attandanceEmployeeList[i].passType} is ${empStatus}`
              );

              setTimeout(() => {
                setshowErrorMessage(false);
                seterrorMessage("");
              }, 3000);
              return;
            }
          }
        } else {
          if (attandanceEmployeeList[i].shortId == empShortId) {
            if (attandanceEmployeeList[i].status === "SCHEDULE") {
              let newArr = attandanceEmployeeList.map((itemDta) => {
                if (itemDta?.id === attandanceEmployeeList[i]?.id) {
                  itemDta.status = "BOARDED";
                }
                return { ...itemDta };
              });

              let checkEmpAllBoarded = newArr.find(
                (listItem) => listItem.status === "SCHEDULE"
              );

              if (checkEmpAllBoarded) {
                submitEmployeeAttendenceTime(
                  attandanceEmployeeList[i].id,
                  attandanceEmployeeList[i].name,
                  attandanceEmployeeList[i].empId
                );
              } else {
                submitEmployeeAttendenceTime(
                  attandanceEmployeeList[i].id,
                  attandanceEmployeeList[i].name,
                  attandanceEmployeeList[i].empId
                );
                setshowTimer(false);
                setnotshow(false);

                setshowQrCodeModalPopup(false);
              }

              return;
            } else {
              setshowErrorMessage(true);

              let empStatus =
                attandanceEmployeeList[i].status.charAt(0).toUpperCase() +
                attandanceEmployeeList[i].status.slice(1).toLowerCase();
              seterrorMessageColor(colors.redColor);
              setinputBoxColor(colors.redColor);
              seterrorMessage(
                `${attandanceEmployeeList[i].passType} is ${empStatus}`
              );
              setTimeout(() => {
                setshowErrorMessage(false);
                seterrorMessage("");
              }, 3000);
              return;
            }
          }
        }
      }
    }

    setshowErrorMessage(true);
    seterrorMessage("Invalid Id");
    seterrorMessageColor(colors?.redColor);
    setinputBoxColor(colors.redColor);
    setTimeout(() => {
      setshowErrorMessage(false);
      seterrorMessage("");
    }, 3000);
  };
  const verifyOTP = async (otp) => {
    for (let i = 0; i < attandanceEmployeeList.length; i++) {
      if (attandanceEmployeeList[i].tripType === "DOWNTRIP") {
        if (passengersListType === "") {
        } else {
          if (passengersListType === "deBoardPassengers") {
            if (attandanceEmployeeList[i].oneTimePasswordDrop === otp) {
              if (attandanceEmployeeList[i].status === "BOARDED") {
                let newArr = attandanceEmployeeList.map((itemDta) => {
                  if (itemDta?.id === attandanceEmployeeList[i]?.id) {
                    itemDta.status = "COMPLETED";
                  }
                  return { ...itemDta };
                });

                let checkEmpAllBoarded = newArr.find(
                  (listItem) => listItem.status === "BOARDED"
                );

                if (checkEmpAllBoarded) {
                  submitEmployeeAttendenceTime(
                    attandanceEmployeeList[i].id,
                    attandanceEmployeeList[i].name,
                    attandanceEmployeeList[i].empId
                  );
                } else {
                  submitEmployeeAttendenceTime(
                    attandanceEmployeeList[i].id,
                    attandanceEmployeeList[i].name,
                    attandanceEmployeeList[i].empId
                  );
                  setshowTimer(false);
                  setnotshow(false);

                  setshowQrCodeModalPopup(false);
                }

                return;
              } else {
                let empStatus =
                  attandanceEmployeeList[i].status.charAt(0).toUpperCase() +
                  attandanceEmployeeList[i].status.slice(1).toLowerCase();
                setshowErrorMessage(true);
                seterrorMessageColor(colors.redColor);
                setinputBoxColor(colors.redColor);

                setTimeout(() => {
                  setshowErrorMessage(false);
                  seterrorMessage("");
                }, 3000);

                if (attandanceEmployeeList[i].status === "COMPLETED") {
                  seterrorMessage(
                    `${attandanceEmployeeList[i].passType} is Deboarded`
                  );
                } else {
                  seterrorMessage(
                    `${attandanceEmployeeList[i].passType} is ${empStatus}`
                  );
                }
                return;
              }
            }
          } else {
            let findEscortAt = ongoingRideData?.onBoardPassengers.find(
              (itemData) => itemData.passType === "ESCORT"
            );

            if (findEscortAt) {
              if (findEscortAt?.status === "SCHEDULE") {
                if (
                  attandanceEmployeeList[i].oneTimePassword === otp &&
                  attandanceEmployeeList[i].passType == "ESCORT"
                ) {
                  if (attandanceEmployeeList[i].status === "SCHEDULE") {
                    let newArr = attandanceEmployeeList.map((itemDta) => {
                      if (itemDta?.id === attandanceEmployeeList[i]?.id) {
                        itemDta.status = "BOARDED";
                      }
                      return { ...itemDta };
                    });

                    if (attandanceEmployeeList[i].passType === "ESCORT") {
                      submitEmployeeAttendenceTime(
                        attandanceEmployeeList[i].id,
                        attandanceEmployeeList[i].name,
                        attandanceEmployeeList[i].empId
                      );

                      setshowQrCodeModalPopup(false);
                    } else {
                      let checkEmpAllBoarded = newArr.find(
                        (listItem) => listItem.status === "SCHEDULE"
                      );

                      if (checkEmpAllBoarded) {
                        submitEmployeeAttendenceTime(
                          attandanceEmployeeList[i].id,
                          attandanceEmployeeList[i].name,
                          attandanceEmployeeList[i].empId
                        );
                      } else {
                        setshowTimer(false);
                        setnotshow(false);
                        submitEmployeeAttendenceTime(
                          attandanceEmployeeList[i].id,
                          attandanceEmployeeList[i].name,
                          attandanceEmployeeList[i].empId
                        );

                        setshowQrCodeModalPopup(false);
                      }

                      return;
                    }
                  } else {
                    let empStatus =
                      attandanceEmployeeList[i].status.charAt(0).toUpperCase() +
                      attandanceEmployeeList[i].status.slice(1).toLowerCase();

                    seterrorMessageColor(colors.redColor);
                    setinputBoxColor(colors.redColor);
                    seterrorMessage(
                      `${attandanceEmployeeList[i].passType} is ${empStatus}`
                    );
                    setshowErrorMessage(true);
                    setTimeout(() => {
                      setshowErrorMessage(false);
                      seterrorMessage("");
                    }, 3000);
                    return;
                  }
                } else {
                  seterrorMessage(`Invalid OTP`);
                  seterrorMessageColor(colors?.redColor);
                  setinputBoxColor(colors.redColor);
                  setshowErrorMessage(true);
                  setTimeout(() => {
                    setshowErrorMessage(false);
                    seterrorMessage("");
                  }, 3000);
                }
              } else {
                if (attandanceEmployeeList[i].oneTimePassword === otp) {
                  if (attandanceEmployeeList[i].status === "SCHEDULE") {
                    let newArr = attandanceEmployeeList.map((itemDta) => {
                      if (itemDta?.id === attandanceEmployeeList[i]?.id) {
                        itemDta.status = "BOARDED";
                      }
                      return { ...itemDta };
                    });

                    if (attandanceEmployeeList[i].passType === "ESCORT") {
                      submitEmployeeAttendenceTime(
                        attandanceEmployeeList[i].id,
                        attandanceEmployeeList[i].name,
                        attandanceEmployeeList[i].empId
                      );

                      setshowQrCodeModalPopup(false);
                    } else {
                      let checkEmpAllBoarded = newArr.find(
                        (listItem) => listItem.status === "SCHEDULE"
                      );

                      if (checkEmpAllBoarded) {
                        submitEmployeeAttendenceTime(
                          attandanceEmployeeList[i].id,
                          attandanceEmployeeList[i].name,
                          attandanceEmployeeList[i].empId
                        );
                      } else {
                        setshowTimer(false);
                        setnotshow(false);
                        submitEmployeeAttendenceTime(
                          attandanceEmployeeList[i].id,
                          attandanceEmployeeList[i].name,
                          attandanceEmployeeList[i].empId
                        );

                        setshowQrCodeModalPopup(false);
                      }

                      return;
                    }
                  } else {
                    let empStatus =
                      attandanceEmployeeList[i].status.charAt(0).toUpperCase() +
                      attandanceEmployeeList[i].status.slice(1).toLowerCase();
                    seterrorMessage(
                      `${attandanceEmployeeList[i].passType} is ${empStatus}`
                    );
                    seterrorMessageColor(colors.redColor);
                    setinputBoxColor(colors.redColor);
                    setshowErrorMessage(true);
                    setTimeout(() => {
                      setshowErrorMessage(false);
                      seterrorMessage("");
                    }, 3000);
                    return;
                  }
                }
              }
            } else {
              if (attandanceEmployeeList[i].oneTimePassword === otp) {
                if (attandanceEmployeeList[i].status === "SCHEDULE") {
                  let newArr = attandanceEmployeeList.map((itemDta) => {
                    if (itemDta?.id === attandanceEmployeeList[i]?.id) {
                      itemDta.status = "BOARDED";
                    }
                    return { ...itemDta };
                  });

                  if (attandanceEmployeeList[i].passType === "ESCORT") {
                    submitEmployeeAttendenceTime(
                      attandanceEmployeeList[i].id,
                      attandanceEmployeeList[i].name,
                      attandanceEmployeeList[i].empId
                    );

                    setshowQrCodeModalPopup(false);
                  } else {
                    let checkEmpAllBoarded = newArr.find(
                      (listItem) => listItem.status === "SCHEDULE"
                    );

                    if (checkEmpAllBoarded) {
                      submitEmployeeAttendenceTime(
                        attandanceEmployeeList[i].id,
                        attandanceEmployeeList[i].name,
                        attandanceEmployeeList[i].empId
                      );
                    } else {
                      setshowTimer(false);
                      setnotshow(false);
                      submitEmployeeAttendenceTime(
                        attandanceEmployeeList[i].id,
                        attandanceEmployeeList[i].name,
                        attandanceEmployeeList[i].empId
                      );

                      setshowQrCodeModalPopup(false);
                    }

                    return;
                  }
                } else {
                  let empStatus =
                    attandanceEmployeeList[i].status.charAt(0).toUpperCase() +
                    attandanceEmployeeList[i].status.slice(1).toLowerCase();
                  seterrorMessage(
                    `${attandanceEmployeeList[i].passType} is ${empStatus}`
                  );
                  seterrorMessageColor(colors.redColor);
                  setinputBoxColor(colors.redColor);
                  setshowErrorMessage(true);
                  setTimeout(() => {
                    setshowErrorMessage(false);
                    seterrorMessage("");
                  }, 3000);
                  return;
                }
              }
            }
          }
        }
      } else {
        if (attandanceEmployeeList.length === 1) {
          if (attandanceEmployeeList[i].oneTimePassword === otp) {
            if (attandanceEmployeeList[i].status === "SCHEDULE") {
              setshowTimer(false);
              setnotshow(false);

              setshowQrCodeModalPopup(false);

              submitEmployeeAttendenceTime(
                attandanceEmployeeList[i].id,
                attandanceEmployeeList[i].name,
                attandanceEmployeeList[i].empId
              );

              return;
            } else {
              setshowErrorMessage(true);
              let empStatus =
                attandanceEmployeeList[i].status.charAt(0).toUpperCase() +
                attandanceEmployeeList[i].status.slice(1).toLowerCase();
              seterrorMessageColor(colors.redColor);
              setinputBoxColor(colors.redColor);
              seterrorMessage(
                `${attandanceEmployeeList[i].passType} is ${empStatus}`
              );

              setTimeout(() => {
                setshowErrorMessage(false);
                seterrorMessage("");
              }, 3000);
              return;
            }
          }
        } else {
          if (attandanceEmployeeList[i].oneTimePassword === otp) {
            if (attandanceEmployeeList[i].status === "SCHEDULE") {
              let newArr = attandanceEmployeeList.map((itemDta) => {
                if (itemDta?.id === attandanceEmployeeList[i]?.id) {
                  itemDta.status = "BOARDED";
                }
                return { ...itemDta };
              });

              let checkEmpAllBoarded = newArr.find(
                (listItem) => listItem.status === "SCHEDULE"
              );

              if (checkEmpAllBoarded) {
                submitEmployeeAttendenceTime(
                  attandanceEmployeeList[i].id,
                  attandanceEmployeeList[i].name,
                  attandanceEmployeeList[i].empId
                );
              } else {
                submitEmployeeAttendenceTime(
                  attandanceEmployeeList[i].id,
                  attandanceEmployeeList[i].name,
                  attandanceEmployeeList[i].empId
                );
                setshowTimer(false);
                setnotshow(false);

                setshowQrCodeModalPopup(false);
              }

              return;
            } else {
              setshowErrorMessage(true);

              let empStatus =
                attandanceEmployeeList[i].status.charAt(0).toUpperCase() +
                attandanceEmployeeList[i].status.slice(1).toLowerCase();
              seterrorMessageColor(colors.redColor);
              setinputBoxColor(colors.redColor);
              seterrorMessage(
                `${attandanceEmployeeList[i].passType} is ${empStatus}`
              );
              setTimeout(() => {
                setshowErrorMessage(false);
                seterrorMessage("");
              }, 3000);
              return;
            }
          }
        }
      }
    }

    setshowErrorMessage(true);
    seterrorMessage("Invalid Otp");
    seterrorMessageColor(colors?.redColor);
    setinputBoxColor(colors.redColor);
    setTimeout(() => {
      setshowErrorMessage(false);
      seterrorMessage("");
    }, 3000);
  };

  const submitEmployeeAttendenceTime = (passId, name, empId) => {
    if (driverAppSettingData?.allowEmpAttdCaptureOutsideGeofenceArea == "YES") {
      let geoFenceViolance = "";

      let distanceInMeter = getDistanceOfTwoPoints(
        driverCurrentCoordinate,
        ongoingRideData
      );

      if (distanceInMeter < 500) {
        geoFenceViolance = "NO";
      } else {
        geoFenceViolance = "YES";
      }
      let sendData = {
        tripId: tripId,
        id: passId,
        geoFenceViolance: geoFenceViolance,
      };
      setshowLoader(true);

      actions
        .submitEmpAttandanceTime(sendData)
        .then((res) => {
          setshowLoader(false);
          if (res.status === 200) {
            setnotshow(false);
            getDriverOngoingRide();
            setnotshow(false);
            setotp("");

            if (tripType === "UPTRIP") {
              seterrorMessage(`${name} boarded successfully.`);
              seterrorMessageColor(colors.greenColor);
              setinputBoxColor(colors.black);
              setshowErrorMessage(true);
              setTimeout(() => {
                setshowErrorMessage(false);
                seterrorMessage("");
              }, 3000);
              showSuccess(`${name} boarded successfully.`);
              sendToEmployee(empId, "BOARDED");
            } else {
              if (passengersListType === "onBoardPassengers") {
                seterrorMessage(`${name} boarded successfully.`);
                seterrorMessageColor(colors.greenColor);
                setinputBoxColor(colors.black);
                setshowErrorMessage(true);
                setTimeout(() => {
                  setshowErrorMessage(false);
                  seterrorMessage("");
                }, 3000);
                showSuccess(`${name} boarded successfully.`);
                sendToEmployee(empId, "BOARDED");
              } else {
                seterrorMessage(`${name} deboarded successfully.`);
                seterrorMessageColor(colors.greenColor);
                setinputBoxColor(colors.black);
                setshowErrorMessage(true);
                setTimeout(() => {
                  setshowErrorMessage(false);
                  seterrorMessage("");
                }, 3000);
                showSuccess(`${name} deboarded successfully.`);
                sendToEmployee(empId, "COMPLETED");
              }
            }
          } else {
            setshowLoader(false);
            showError(res.message);
          }
        })
        .catch((err) => {
          setshowLoader(false);
        });
    } else {
      let distanceInMeter = getDistanceOfTwoPoints(
        driverCurrentCoordinate,
        ongoingRideData
      );

      if (distanceInMeter < 100) {
        let sendData = {
          tripId: tripId,
          id: passId,
          geoFenceViolance: distanceInMeter > 500 ? "YES" : "NO",
        };
        setshowLoader(true);

        actions
          .submitEmpAttandanceTime(sendData)
          .then((res) => {
            setshowLoader(false);

            if (res.status === 200) {
              setnotshow(false);
              getDriverOngoingRide();
              setnotshow(false);
              setotp("");

              if (tripType === "UPTRIP") {
                seterrorMessage(`${name} boarded successfully.`);
                seterrorMessageColor(colors.greenColor);
                setinputBoxColor(colors.black);
                setshowErrorMessage(true);
                setTimeout(() => {
                  setshowErrorMessage(false);
                  seterrorMessage("");
                }, 3000);

                showSuccess(`${name} boarded successfully.`);
                sendToEmployee(empId, "BOARDED");
              } else {
                if (passengersListType === "onBoardPassengers") {
                  seterrorMessage(`${name} boarded successfully.`);
                  seterrorMessageColor(colors.greenColor);
                  setinputBoxColor(colors.black);
                  setshowErrorMessage(true);
                  setTimeout(() => {
                    setshowErrorMessage(false);
                    seterrorMessage("");
                  }, 3000);
                  showSuccess(`${name} boarded successfully.`);
                  sendToEmployee(empId, "BOARDED");
                } else {
                  seterrorMessage(`${name} deboarded successfully.`);
                  seterrorMessageColor(colors.greenColor);
                  setinputBoxColor(colors.black);
                  setshowErrorMessage(true);
                  setTimeout(() => {
                    setshowErrorMessage(false);
                    seterrorMessage("");
                  }, 3000);
                  showSuccess(`${name} deboarded successfully.`);
                  sendToEmployee(empId, "COMPLETED");
                }
              }
            } else {
              setshowLoader(false);
              showError(res.message);
            }
          })
          .catch((err) => {
            setshowLoader(false);
          });
      } else {
        getDriverOngoingRide();
        showError("You are not at the boarding point.");
      }
    }
  };

  const sendToEmployee = (empId, status) => {
    const timeObjectCreate = new Date();
    let currentTime = timeObjectCreate.getTime();
    let data = {
      to: empId,
      update: {
        time: currentTime,
        type: status,
      },
    };

    socketServices.emit("update-to-employee", data);
  };

  const sendToAllEmployees = () => {
    const timeObjectCreate = new Date();
    let currentTime = timeObjectCreate.getTime();
    let data = {
      to: allEmpList,
      update: {
        time: currentTime,
        type: "COMPLETED",
      },
    };

    socketServices.emit("update-to-employee", data);
  };

  const swipeThumIcon = () => {
    return (
      <View>
        <Image
          style={{
            height: 30,
            width: 40,
            tintColor: "white",
            transform: [{ rotate: "180deg" }],
          }}
          source={imagePath.swipe_right}
        />
      </View>
    );
  };

  const submitSnapshot = () => {
    let sendingData = {
      tripId: tripId,
      driverId: profileData?.id,
      driverSnapShot: snapShotUri,
    };

    actions
      .submitSnapshot(sendingData)
      .then((res) => {
        setsnapShotUri("");
      })
      .catch((err) => {
        setisLoading(false);
      });
  };

  const sendRating = () => {
    let sendingData = ratingEmpList;
    actions.sendRatingToEmployee(sendingData).then((res) => {
      setisLoading(false);
      if (res.status === 200) {
        //submitSnapshot();

        let ongoingRideData = {
          isOngoing: false,
        };
        AsyncStorage.setItem(
          "ongoingRideData",
          JSON.stringify(ongoingRideData)
        );

        setItem("coveredCord", []);

        setshowcompleteRide(false);

        showSuccess("Ride completed successfully.");
        actions.newRideAssign("");
        showRating.current.close();

        setroute("");
        setshowTimer(false);
        setnotshow(false);
        setisRatingListSet(false);
        removeUserData("coveredCord");
        setCoveredRouteCord([]);
        setratingEmpList([]);
        setongoingRideData("");
      } else {
        //submitSnapshot();

        let ongoingRideData = {
          isOngoing: false,
        };
        AsyncStorage.setItem(
          "ongoingRideData",
          JSON.stringify(ongoingRideData)
        );

        setItem("coveredCord", []);

        setshowcompleteRide(false);

        showSuccess("Ride completed successfully.");
        actions.newRideAssign("");
        showRating.current.close();

        setroute("");
        setshowTimer(false);
        setnotshow(false);
        setisRatingListSet(false);
        removeUserData("coveredCord");
        setCoveredRouteCord([]);
        setratingEmpList([]);
        setongoingRideData("");
      }
    });
  };

  const completeTrip = (id, lastPoint, data) => {
    var totalCoveredDistace = data[0]?.tripDistance ? data[0]?.tripDistance : 0;
    completeDriverRide(id, lastPoint, data, totalCoveredDistace);
  };

  const completeDriverRide = (id, lastPoint, data, distance) => {
    setisLoading(true);
    let sendingData = {
      tripId: id,
      location: lastPoint?.location,
      deBoardPassengers: lastPoint?.deBoardPassengers,
      id: lastPoint?.id,
      //actualTripDistance: distance,
    };

    //console.log("sendingData", sendingData);

    setshowLoader(true);
    actions
      .completeTrip(sendingData)
      .then((res) => {
        setshowLoader(false);
        setisLoading(false);
        if (res.status === 200) {
          //submitSnapshot();
          let ongoingRideData = {
            isOngoing: false,
          };
          AsyncStorage.setItem(
            "ongoingRideData",
            JSON.stringify(ongoingRideData)
          );
          setItem("coveredCord", []);
          setshowcompleteRide(false);
          showSuccess("Ride completed successfully.");
          actions.newRideAssign("");
          showRating.current.close();
          setroute("");
          setshowTimer(false);
          setnotshow(false);
          setisRatingListSet(false);
          removeUserData("coveredCord");
          setCoveredRouteCord([]);
          setratingEmpList([]);
          setongoingRideData("");
          sendToAllEmployees();
          clearInterval(nightHooterInterval);
          actions.newRideAssign("");
          AsyncStorage.removeItem("DynamicETA");
          BackgroundTimer.clearInterval(timer);
          AsyncStorage.removeItem("DriverCurrentPoint");
          AsyncStorage.removeItem("DriverLastPoint");
          BackgroundTimer.clearInterval(gpsSignalTimer);
          BackgroundTimer.clearInterval(stoppageTimer);
          setData("");
          setongoingRideData("");
          navigation.navigate(navigationStrings.HOME);
        } else {
          showError(res.message);
        }
      })
      .catch((err) => {
        setshowLoader(false);
        setisLoading(false);
      });
    let sendRatingData = ratingEmpList;
    actions
      .sendRatingToEmployee(sendRatingData)
      .then((res) => {})
      .catch((err) => {});
  };

  const submitRating = () => {
    actions.getRide(DRIVER_ONGOING_RIDE).then((res) => {
      if (res?.status === 200) {
        if (res?.data.length > 0) {
          let lastPoint = res.data[0].stopList[res.data[0].stopList.length - 1];
          completeTrip(res.data[0].id, lastPoint, res?.data);
        } else {
          sendRating();
          clearInterval(nightHooterInterval);
          actions.newRideAssign("");
          let ongoingRideData = {
            isOngoing: false,
          };
          AsyncStorage.setItem(
            "ongoingRideData",
            JSON.stringify(ongoingRideData)
          );
          AsyncStorage.removeItem("DynamicETA");
          BackgroundTimer.clearInterval(timer);
          BackgroundTimer.clearInterval(gpsSignalTimer);
          BackgroundTimer.clearInterval(stoppageTimer);
          AsyncStorage.removeItem("DriverCurrentPoint");
          AsyncStorage.removeItem("DriverLastPoint");
          setData("");
          setongoingRideData("");
          navigation.navigate(navigationStrings.HOME);
        }
      }
    });
  };

  const googleMapRedirection = () => {
    let arr = data.data[0].stopList;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]?.onBoardPassengers) {
        if (arr[i]?.onBoardPassengers.length === 1) {
          let getEmpStatus = arr[i]?.onBoardPassengers.find(
            (itemData) =>
              itemData.status === "ABSENT" ||
              itemData.status === "NOSHOW" ||
              itemData.status === "CANCLED" ||
              itemData?.status === "SKIPPED"
          );

          if (getEmpStatus) {
          } else {
            if (arr[i].status === "SCHEDULE" || arr[i].status === "ARRIVED") {
              let destination = `${arr[i]?.location?.latitude},${arr[i]?.location?.longitude}`;

              let url = `https://www.google.com/maps/dir/?api=1&origin=&destination=${destination}&travelmode=driving&dir_action=navigate`;
              Linking.openURL(url);

              let selectionTypeData = { selectionType: "googleMap" };
              AsyncStorage.setItem(
                "mapType",
                JSON.stringify(selectionTypeData)
              );
              break;
            }
          }
        } else {
          let getAbsentEmp = arr[i]?.onBoardPassengers.find(
            (itemData) =>
              itemData.status === "ABSENT" ||
              itemData.status === "NOSHOW" ||
              itemData.status === "CANCLED" ||
              itemData?.status === "SKIPPED"
          );

          if (getAbsentEmp) {
            let getScheduleEmp = arr[i]?.onBoardPassengers.find(
              (itemData) =>
                itemData.status === "SCHEDULE" || itemData.status === "BOARDED"
            );

            if (getScheduleEmp) {
              if (arr[i].status === "SCHEDULE" || arr[i].status === "ARRIVED") {
                let destination = `${arr[i]?.location?.latitude},${arr[i]?.location?.longitude}`;

                let url = `https://www.google.com/maps/dir/?api=1&origin=&destination=${destination}&travelmode=driving&dir_action=navigate`;
                Linking.openURL(url);

                let selectionTypeData = { selectionType: "googleMap" };
                AsyncStorage.setItem(
                  "mapType",
                  JSON.stringify(selectionTypeData)
                );
                break;
              }
            }
          } else {
            if (arr[i].status === "SCHEDULE" || arr[i].status === "ARRIVED") {
              let destination = `${arr[i]?.location?.latitude},${arr[i]?.location?.longitude}`;

              let url = `https://www.google.com/maps/dir/?api=1&origin=&destination=${destination}&travelmode=driving&dir_action=navigate`;
              Linking.openURL(url);

              let selectionTypeData = { selectionType: "googleMap" };
              AsyncStorage.setItem(
                "mapType",
                JSON.stringify(selectionTypeData)
              );
              break;
            }
          }
        }
      } else {
        if (arr[i]?.deBoardPassengers.length === 1) {
          let getEmpStatus = arr[i]?.deBoardPassengers.find(
            (itemData) =>
              itemData.status === "ABSENT" ||
              itemData.status === "NOSHOW" ||
              itemData.status === "CANCLED" ||
              itemData?.status === "SKIPPED"
          );

          if (getEmpStatus) {
          } else {
            if (arr[i].status === "SCHEDULE" || arr[i].status === "ARRIVED") {
              let destination = `${arr[i]?.location?.latitude},${arr[i]?.location?.longitude}`;

              let url = `https://www.google.com/maps/dir/?api=1&origin=&destination=${destination}&travelmode=driving&dir_action=navigate`;
              Linking.openURL(url);

              let selectionTypeData = { selectionType: "googleMap" };
              AsyncStorage.setItem(
                "mapType",
                JSON.stringify(selectionTypeData)
              );
              break;
            }
          }
        } else {
          let getAbsentEmp = arr[i]?.deBoardPassengers.find(
            (itemData) =>
              itemData.status === "ABSENT" ||
              itemData.status === "NOSHOW" ||
              itemData.status === "CANCLED" ||
              itemData?.status === "SKIPPED"
          );

          if (getAbsentEmp) {
            let getScheduleEmp = arr[i]?.deBoardPassengers.find(
              (itemData) =>
                itemData.status === "SCHEDULE" || itemData.status === "BOARDED"
            );

            if (getScheduleEmp) {
              if (arr[i].status === "SCHEDULE" || arr[i].status === "ARRIVED") {
                let destination = `${arr[i]?.location?.latitude},${arr[i]?.location?.longitude}`;

                let url = `https://www.google.com/maps/dir/?api=1&origin=&destination=${destination}&travelmode=driving&dir_action=navigate`;
                Linking.openURL(url);

                let selectionTypeData = { selectionType: "googleMap" };
                AsyncStorage.setItem(
                  "mapType",
                  JSON.stringify(selectionTypeData)
                );
                break;
              }
            }
          } else {
            if (arr[i].status === "SCHEDULE" || arr[i].status === "ARRIVED") {
              let destination = `${arr[i]?.location?.latitude},${arr[i]?.location?.longitude}`;

              let url = `https://www.google.com/maps/dir/?api=1&origin=&destination=${destination}&travelmode=driving&dir_action=navigate`;
              Linking.openURL(url);

              let selectionTypeData = { selectionType: "googleMap" };
              AsyncStorage.setItem(
                "mapType",
                JSON.stringify(selectionTypeData)
              );
              break;
            }
          }
        }
      }
    }
  };

  const appleMapNavigation = () => {
    let arr = data.data[0].stopList;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]?.onBoardPassengers) {
        if (arr[i]?.onBoardPassengers.length === 1) {
          let getEmpStatus = arr[i]?.onBoardPassengers.find(
            (itemData) =>
              itemData.status === "ABSENT" ||
              itemData.status === "NOSHOW" ||
              itemData.status === "CANCLED" ||
              itemData?.status === "SKIPPED"
          );

          if (getEmpStatus) {
          } else {
            if (arr[i].status === "SCHEDULE" || arr[i].status === "ARRIVED") {
              let source = `${driverCurrentCoordinate?.latitude},${driverCurrentCoordinate?.longitude}`;
              let destination = `${arr[i]?.location?.latitude},${arr[i]?.location?.longitude}`;
              let urlFormat = `${source}/${destination}`;

              Linking.openURL(
                `http://maps.apple.com/?saddr=${source}&daddr=${destination}`
              );
              let selectionTypeData = { selectionType: "appleMap" };
              AsyncStorage.setItem(
                "mapType",
                JSON.stringify(selectionTypeData)
              );
              break;
            }
          }
        } else {
          let getAbsentEmp = arr[i]?.onBoardPassengers.find(
            (itemData) =>
              itemData.status === "ABSENT" ||
              itemData.status === "NOSHOW" ||
              itemData.status === "CANCLED" ||
              itemData?.status === "SKIPPED"
          );

          if (getAbsentEmp) {
            let getScheduleEmp = arr[i]?.onBoardPassengers.find(
              (itemData) =>
                itemData.status === "SCHEDULE" || itemData.status === "BOARDED"
            );

            if (getScheduleEmp) {
              if (arr[i].status === "SCHEDULE" || arr[i].status === "ARRIVED") {
                let source = `${driverCurrentCoordinate?.latitude},${driverCurrentCoordinate?.longitude}`;
                let destination = `${arr[i]?.location?.latitude},${arr[i]?.location?.longitude}`;
                let urlFormat = `${source}/${destination}`;

                Linking.openURL(
                  `http://maps.apple.com/?saddr=${source}&daddr=${destination}`
                );
                let selectionTypeData = { selectionType: "appleMap" };
                AsyncStorage.setItem(
                  "mapType",
                  JSON.stringify(selectionTypeData)
                );
                break;
              }
            }
          } else {
            if (arr[i].status === "SCHEDULE" || arr[i].status === "ARRIVED") {
              let source = `${driverCurrentCoordinate?.latitude},${driverCurrentCoordinate?.longitude}`;
              let destination = `${arr[i]?.location?.latitude},${arr[i]?.location?.longitude}`;
              let urlFormat = `${source}/${destination}`;

              Linking.openURL(
                `http://maps.apple.com/?saddr=${source}&daddr=${destination}`
              );
              let selectionTypeData = { selectionType: "appleMap" };
              AsyncStorage.setItem(
                "mapType",
                JSON.stringify(selectionTypeData)
              );
              break;
            }
          }
        }
      } else {
        if (arr[i]?.deBoardPassengers.length === 1) {
          let getEmpStatus = arr[i]?.deBoardPassengers.find(
            (itemData) =>
              itemData.status === "ABSENT" ||
              itemData.status === "NOSHOW" ||
              itemData.status === "CANCLED" ||
              itemData?.status === "SKIPPED"
          );

          if (getEmpStatus) {
          } else {
            if (arr[i].status === "SCHEDULE" || arr[i].status === "ARRIVED") {
              let source = `${driverCurrentCoordinate?.latitude},${driverCurrentCoordinate?.longitude}`;
              let destination = `${arr[i]?.location?.latitude},${arr[i]?.location?.longitude}`;
              let urlFormat = `${source}/${destination}`;

              Linking.openURL(
                `http://maps.apple.com/?saddr=${source}&daddr=${destination}`
              );
              let selectionTypeData = { selectionType: "appleMap" };
              AsyncStorage.setItem(
                "mapType",
                JSON.stringify(selectionTypeData)
              );
              break;
            }
          }
        } else {
          let getAbsentEmp = arr[i]?.deBoardPassengers.find(
            (itemData) =>
              itemData.status === "ABSENT" ||
              itemData.status === "NOSHOW" ||
              itemData.status === "CANCLED" ||
              itemData?.status === "SKIPPED"
          );

          if (getAbsentEmp) {
            let getScheduleEmp = arr[i]?.deBoardPassengers.find(
              (itemData) =>
                itemData.status === "SCHEDULE" || itemData.status === "BOARDED"
            );

            if (getScheduleEmp) {
              if (arr[i].status === "SCHEDULE" || arr[i].status === "ARRIVED") {
                let source = `${driverCurrentCoordinate?.latitude},${driverCurrentCoordinate?.longitude}`;
                let destination = `${arr[i]?.location?.latitude},${arr[i]?.location?.longitude}`;
                let urlFormat = `${source}/${destination}`;

                Linking.openURL(
                  `http://maps.apple.com/?saddr=${source}&daddr=${destination}`
                );
                let selectionTypeData = { selectionType: "appleMap" };
                AsyncStorage.setItem(
                  "mapType",
                  JSON.stringify(selectionTypeData)
                );
                break;
              }
            }
          } else {
            if (arr[i].status === "SCHEDULE" || arr[i].status === "ARRIVED") {
              let source = `${driverCurrentCoordinate?.latitude},${driverCurrentCoordinate?.longitude}`;
              let destination = `${arr[i]?.location?.latitude},${arr[i]?.location?.longitude}`;
              let urlFormat = `${source}/${destination}`;

              Linking.openURL(
                `http://maps.apple.com/?saddr=${source}&daddr=${destination}`
              );
              let selectionTypeData = { selectionType: "appleMap" };
              AsyncStorage.setItem(
                "mapType",
                JSON.stringify(selectionTypeData)
              );
              break;
            }
          }
        }
      }
    }
  };

  const handleRating = (rating, id, status) => {
    if (status === "ABSENT") {
      showError("Employee was absent in the trip.");
    } else {
      if (tripType === "DOWNTRIP") {
        let arr = ratingEmpList.map((item) => {
          if (item.id === id) {
            item.rating = rating;
            item.ratingColor =
              rating === 1
                ? colors.rating_1
                : rating === 2
                ? colors.rating_2
                : rating === 3
                ? colors.rating_3
                : rating === 4
                ? colors.rating_4
                : rating === 5
                ? colors.rating_5
                : null;
            item.driverFeedback = "Excellent";
            item.driverRating = rating;
            item.driverId = profileData.id;
            item.passRating = rating;
            item.passFeedback = "Excellent";
          } else {
            item.ratingColor =
              item.rating === 1
                ? colors.rating_1
                : item.rating === 2
                ? colors.rating_2
                : item.rating === 3
                ? colors.rating_3
                : item.rating === 4
                ? colors.rating_4
                : item.rating === 5
                ? colors.rating_5
                : null;
            item.driverFeedback = "Excellent";
            item.driverRating = rating;
            item.driverId = profileData.id;
          }
          return { ...item };
        });

        setratingEmpList(arr);
      } else {
        let arr = ratingEmpList.map((item) => {
          if (item.id === id) {
            item.rating = rating;
            item.passRating = rating;
            item.ratingColor =
              rating === 1
                ? colors.rating_1
                : rating === 2
                ? colors.rating_2
                : rating === 3
                ? colors.rating_3
                : rating === 4
                ? colors.rating_4
                : rating === 5
                ? colors.rating_5
                : null;
            item.driverFeedback = "Excellent";
            item.driverRating = rating;
            item.driverId = profileData.id;
            item.passFeedback = "Excellent";
          } else {
            item.ratingColor =
              item.rating === 1
                ? colors.rating_1
                : item.rating === 2
                ? colors.rating_2
                : item.rating === 3
                ? colors.rating_3
                : item.rating === 4
                ? colors.rating_4
                : item.rating === 5
                ? colors.rating_5
                : null;
          }
          return { ...item };
        });

        setratingEmpList(arr);
      }
    }
  };

  const noShowClick = async (clickItem) => {
    let arr = attandanceEmployeeList.map((item) => {
      if (clickItem.empId === item.empId) {
        item.status = "ABSENT";
      } else {
      }
      return { ...item };
    });

    let checkAbsendEmp = arr.find((itemData) => itemData.status === "SCHEDULE");
    if (checkAbsendEmp) {
      callAbsentEmpApi(clickItem.empId, clickItem?.name);
      sendAbsentEmpDataToDashboard(clickItem.empId);
    } else {
      callAbsentEmpApi(clickItem.empId, clickItem?.name);
      sendAbsentEmpDataToDashboard(clickItem.empId);

      openEmpListModal.current.close();
      setshowTimer(false);
      setnotshow(false);
    }
  };

  const sendAbsentEmpDataToDashboard = (empId) => {
    let sendingData = {
      tripId: tripId,
      absent: [empId],
    };

    actions
      .addDirection(sendingData)
      .then((res) => {})
      .catch((err) => {
        setisLoading(false);
      });
  };

  const escortAttendence = (clickItem) => {
    setshowLoader(true);
    const timeObjectCreate = new Date();
    let currentTime = timeObjectCreate.getTime();
    let sendingData = {};

    sendingData = {
      tripId: tripId,
      empId: "",
      escortId: clickItem?.escortId,
      status: "SKIPPED",
    };

    actions
      .markEmployeeAsAbsent(sendingData)
      .then((res) => {
        setshowAttendenceLoading(false);
        setshowLoader(false);

        if (res?.status === 200) {
          openEmpListModal.current.close();
          if (res?.data?.passType?.toUpperCase()?.trim() === "ESCORT") {
            showSuccess(`${clickItem?.name} mark skipped successfully.`);
          } else {
            showSuccess(`${clickItem?.name} mark absent successfully.`);
          }
          getDriverOngoingRide();
        } else {
          showError(res?.message);
        }
      })
      .catch((err) => {
        setshowAttendenceLoading(false);
        setshowLoader(false);
        setisLoading(false);
      });
  };

  const callAbsentEmpApi = (empId, name) => {
    setshowLoader(true);
    const timeObjectCreate = new Date();
    let currentTime = timeObjectCreate.getTime();
    let sendingData = {
      tripId: tripId,
      empId: empId,
      status: "ABSENT",
      absentDateTime: currentTime,
    };

    actions
      .markEmployeeAsAbsent(sendingData)
      .then((res) => {
        setshowAttendenceLoading(false);
        setshowLoader(false);

        if (res?.status === 200) {
          showSuccess(`${name} mark absent successfully.`);
          getDriverOngoingRide_2();
        } else {
          showError(res?.message);
        }
      })
      .catch((err) => {
        setshowAttendenceLoading(false);
        setshowLoader(false);
        setisLoading(false);
      });
  };

  useEffect(() => {
    let isEscortData = ongoingRideData?.onBoardPassengers?.filter(
      (ele, ind) => {
        return (
          ele?.passType?.toUpperCase()?.trim() === "ESCORT" &&
          ele?.status?.toUpperCase()?.trim() === "SCHEDULE"
        );
      }
    );

    if (
      isEscortData?.[0]?.passType?.toUpperCase()?.trim() === "ESCORT" &&
      isEscortData?.[0]?.passType?.toUpperCase()?.trim() === "SCHEDULE"
    ) {
      setIsEscort(true);
    } else {
      setIsEscort(false);
    }
  }, [ongoingRideData]);

  const sendSosAlert = () => {
    let sosData = {
      to: data?.data[0]?.corporateId,
      sos: {
        tripId: tripId,
        driverId: profileData?.id,
        latitude: `${driverCurrentCoordinate?.latitude}`,
        longitude: `${driverCurrentCoordinate?.longitude}`,
        time: new Date().getTime(),
      },
    };
    let sendSOSData = {
      tripId: tripId,
      latitude: `${driverCurrentCoordinate?.latitude}`,
      longitude: `${driverCurrentCoordinate?.longitude}`,
      time: new Date().getTime(),
    };

    actions
      .sendSOS(sendSOSData)
      .then((response) => {
        let { status } = response;

        if (status == 200) {
          socketServices.emit("send-sos", sosData);
          showSuccess("Your Request has been sent");
          getDriverOngoingRide();
        }
      })
      .catch((error) => {});
    sosBottomSheetRef.current.close();
  };

  const checkIsDriverReachInGeofence = (type) => {
    let escortTrip = ongoingRideData?.onBoardPassengers?.filter((ele, ind) => {
      return (
        ele?.passType?.toUpperCase()?.trim() === "ESCORT" &&
        ele?.status?.toUpperCase()?.trim() === "SCHEDULE"
      );
    });

    let distanceInMeter = getDistanceOfTwoPoints(
      driverCurrentCoordinate,
      ongoingRideData
    );
    if (distanceInMeter < 100) {
      if (
        ongoingRideData?.onBoardPassengers &&
        escortTrip?.[0]?.passType?.toUpperCase()?.trim() === "ESCORT" &&
        escortTrip?.[0]?.passType?.toUpperCase()?.trim() === "SCHEDULE"
      ) {
        setIsEscort(true);
        setotp("");

        if (driverAppSettingData) {
          if (
            driverAppSettingData?.canEmpAttendenceBeCaptureUsingOTPQR == "YES"
          ) {
            setshowQrCodeModalPopup(true);
          }
        } else {
          setshowQrCodeModalPopup(false);
        }
      }
      if (type === "default") {
        if (isQrCodeOpened === false) {
          setisQrCodeOpened(true);

          if (tripType === "UPTRIP") {
            if (ongoingRideData?.onBoardPassengers) {
              setotp("");

              if (driverAppSettingData) {
                if (
                  driverAppSettingData?.canEmpAttendenceBeCaptureUsingOTPQR ==
                  "YES"
                ) {
                  setshowQrCodeModalPopup(true);
                }
              } else {
                setshowQrCodeModalPopup(false);
              }
            } else {
              setshowQrCodeModalPopup(false);
            }
          } else if (
            ongoingRideData?.onBoardPassengers &&
            escortTrip?.[0]?.passType?.toUpperCase()?.trim() === "ESCORT" &&
            escortTrip?.[0]?.passType?.toUpperCase()?.trim() === "SCHEDULE"
          ) {
            setIsEscort(true);

            setotp("");

            if (driverAppSettingData) {
              if (
                driverAppSettingData?.canEmpAttendenceBeCaptureUsingOTPQR ==
                "YES"
              ) {
                setshowQrCodeModalPopup(true);
              }
            } else {
              setshowQrCodeModalPopup(false);
            }
          } else {
            setotp("");

            if (driverAppSettingData) {
              if (
                driverAppSettingData?.canEmpAttendenceBeCaptureUsingOTPQR ==
                "YES"
              ) {
                setshowQrCodeModalPopup(true);
              }
            } else {
              setshowQrCodeModalPopup(false);
            }
          }
        }
      } else {
        setotp("");

        if (driverAppSettingData) {
          if (
            driverAppSettingData?.canEmpAttendenceBeCaptureUsingOTPQR == "YES"
          ) {
            setshowQrCodeModalPopup(true);
          }
        } else {
          setshowQrCodeModalPopup(false);
        }
      }
    } else {
      if (type === "openQrCode") {
        showError("You did not reach at the boarding point.");
      }
    }
  };

  const takeSnapShot = (type = "") => {
    const snapshot = mapRef?.current?.takeSnapshot({
      width: 300,
      height: 300,
      format: "png",
      quality: 0.8,
      result: "file",
    });
    snapshot?.then((uri) => {
      compressImage(uri, type);
    });
  };

  const compressImage = async (fileUri, type) => {
    let compressImage = await snapShotImageCompress(fileUri);

    if (compressImage) {
      let data = new FormData();
      let selectedImage = compressImage.split(".").pop();

      data.append("photo", {
        uri: compressImage,
        name: `${(Math.random() + 1)
          .toString(36)
          .substring(7)}.${selectedImage}`,
        type: `image/${selectedImage}`,
      });

      actions
        .saveSnapShotFile(
          data,
          { "Content-Type": "multipart/form-data" },
          "formData"
        )
        .then((res) => {
          if (res?.status === 200) {
            if (type == "") {
              afterTakeSubmitSnapshot(res?.data?.documentName);
              setsnapShotUri(res?.data?.documentName);
            } else {
            }
          } else {
            //showError("Error in file upload.");
            if (type == "") {
              afterTakeSubmitSnapshot(res?.data?.documentName);
              setsnapShotUri(res?.data?.documentName);
            } else {
            }
          }
        })
        .catch((err) => {});
    }
  };

  const afterTakeSubmitSnapshot = (snapShot) => {
    let sendingData = {
      tripId: tripId,
      driverId: profileData?.id,
      driverSnapShot: snapShot,
    };

    actions
      .submitSnapshot(sendingData)
      .then((res) => {
        //setsnapShotUri("");
      })
      .catch((err) => {
        setisLoading(false);
      });
  };

  const focusOnCurrentLocation = () => {
    if (driverCurrentCoordinate?.latitude) {
      mapRef?.current?.animateToRegion({
        latitude: driverCurrentCoordinate?.latitude,
        longitude: driverCurrentCoordinate?.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
        heading: driverCurrentCoordinate?.heading,
      });
    }
  };

  const showQrCodeModal = async () => {
    seterrorMessageColor(colors?.black);
    setinputBoxColor(colors.black);
    if (tripType === "UPTRIP") {
      if (ongoingRideData?.onBoardPassengers === null) {
      } else {
        setotp("");
        setshowQrCodeModalPopup(true);
      }
    } else {
      let escortTrip;
      if (ongoingRideData?.onBoardPassengers) {
        escortTrip = ongoingRideData?.onBoardPassengers.filter((ele, ind) => {
          return (
            ele?.passType?.toUpperCase()?.trim() === "ESCORT" &&
            ele?.status?.toUpperCase()?.trim() === "SCHEDULE"
          );
        });
      }

      if (
        ongoingRideData?.onBoardPassengers &&
        escortTrip?.[0]?.passType?.toUpperCase()?.trim() === "ESCORT" &&
        escortTrip?.[0]?.passType?.toUpperCase()?.trim() === "SCHEDULE"
      ) {
        setIsEscort(true);
        setotp("");

        setshowQrCodeModalPopup(true);
      } else if (ongoingRideData?.onBoardPassengers) {
        setotp("");

        setshowQrCodeModalPopup(true);
      } else {
        setotp("");

        setshowQrCodeModalPopup(true);
      }
    }
  };

  const callToEmployee = (deviceType, callType) => {
    let sendingData = {
      callType: "dte",
      callFrom: profileData,
      trip: data?.data[0],
      callTo: {
        id: empDataForCalling?.id,
        mobile:
          empDataForCalling?.passType === "ESCORT"
            ? empDataForCalling?.escortMobileNo
            : empDataForCalling?.mobileNo,
        name: empDataForCalling?.name,
      },
      corporateId: data?.data[0]?.corporateId,
      vendorId: data?.data[0]?.vendorId,
    };

    actions
      .callToEmp(sendingData)
      .then((res) => {
        if (res?.status === 200 || res?.status === "200") {
          showSuccess("Call initiated.");

          if (deviceType === "IOS") {
            let number = "";
            number = `tel:${IVR_NUMBER}`;
            Linking.openURL(number);
          } else if (deviceType === "Android") {
            if (callType === "immidiate") {
              RNImmediatePhoneCall.immediatePhoneCall(IVR_NUMBER);
            } else {
              let number = "";
              number = `tel:${IVR_NUMBER}`;
              Linking.openURL(number);
            }
          }
        } else {
          showError("Failed to initiate call.");
        }
      })
      .catch((err) => {
        showError("Failed to initiate call.");
      });
  };

  const getSimnumbers = () => {
    SimCardsManagerModule.getSimCards({
      title: "vTransit Driver",
      message: "vTransit want to access your app for calling.",
      buttonNeutral: "Not now",
      buttonNegative: "Not OK",
      buttonPositive: "OK",
    })
      .then((array) => {
        if (array.length == 1) {
          if (array[0]?.phoneNumber) {
            let getSimNumber = array[0]?.phoneNumber.substr(
              array[0]?.phoneNumber.length - 10
            );
            if (
              getSimNumber == profileData?.mobileNo ||
              getSimNumber == profileData?.alternateNo
            ) {
              callToEmployee("Android", "immidiate");
            } else {
              showError("Please use registered mobile number for calling.");
            }
          } else {
            callToEmployee("Android", "immidiate");
          }
        } else {
          if (array[0]?.phoneNumber) {
            let simNumbers = [
              array[0]?.phoneNumber.substr(array[0]?.phoneNumber.length - 10),
              array[1]?.phoneNumber.substr(array[1]?.phoneNumber.length - 10),
            ];

            let checkRegisteredNumber = simNumbers.find(
              (number) =>
                number == profileData?.mobileNo ||
                number == profileData?.alternateNo
            );

            if (checkRegisteredNumber) {
              callToEmployee("Android");
            } else {
              showError("Please use registered mobile number for calling.");
            }
          } else {
            callToEmployee("Android");
          }
        }
      })
      .catch((error) => {
        showError("Call not initiated.");
      });
  };

  const submitFile = (res) => {
    setloadingButton(true);
    let formData = new FormData();
    if (res?.type) {
      formData.append("photo", {
        uri: res?.uri,
        name: res?.name,
        type: res?.type,
      });
    } else {
      formData.append("photo", {
        uri: res?.path,
        name: "photo",
        type: res?.mime,
      });
    }

    actions
      .saveFuelFile(
        formData,
        {
          "Content-Type": "multipart/form-data",
        },
        "formData"
      )
      .then((res) => {
        setloadingButton(false);

        if (res?.status === 200) {
          setnetworkUri(res?.data?.documentName);
        } else {
          showError("Error in file upload.");
        }
      })
      .catch((err) => {
        setloadingButton(false);
        showError("Error in file upload.");
      });
  };

  const submitCharges = () => {
    setshowLoader(true);
    setloadingButton(true);
    if (chargeCategory === "" || amount === "" || documentUri === "") {
      showError("Please fill all inputs.");
      setshowLoader(false);
      setloadingButton(false);
    } else {
      let sendingData = {
        tripId: data?.data[0]?.id,
        tollParkingData: [
          {
            type: chargeCategory,
            amount: amount,
            photo: networkUri,
            tollName: tollName,
          },
        ],
      };

      actions
        .submitTollTaxAndParking(sendingData)
        .then((res) => {
          setshowLoader(false);
          setloadingButton(false);
          setshowTollTaxSheet(false);

          if (res?.status === 200 || res?.status === "200") {
            showSuccess(`${chargeCategory} submit successfully.`);
          } else {
            showError("Network error");
          }
        })
        .catch((err) => {
          setshowLoader(false);

          showError("Network error");
        });
    }
  };

  function FocusAwareStatusBar(props) {
    const isFocused = useIsFocused();

    return isFocused ? <StatusBar {...props} /> : null;
  }

  const boardEmployeeWithoutOTP = (item) => {
    for (let i = 0; i < attandanceEmployeeList.length; i++) {
      if (attandanceEmployeeList[i].tripType === "DOWNTRIP") {
        if (passengersListType === "") {
        } else {
          if (passengersListType === "deBoardPassengers") {
            if (attandanceEmployeeList[i].id === item?.id) {
              if (attandanceEmployeeList[i].status === "BOARDED") {
                let newArr = attandanceEmployeeList.map((itemDta) => {
                  if (itemDta?.id === attandanceEmployeeList[i]?.id) {
                    itemDta.status = "COMPLETED";
                  }
                  return { ...itemDta };
                });

                let checkEmpAllBoarded = newArr.find(
                  (listItem) => listItem.status === "BOARDED"
                );

                if (checkEmpAllBoarded) {
                  submitEmployeeAttendenceTime(
                    attandanceEmployeeList[i].id,
                    attandanceEmployeeList[i].name,
                    attandanceEmployeeList[i].empId
                  );
                } else {
                  submitEmployeeAttendenceTime(
                    attandanceEmployeeList[i].id,
                    attandanceEmployeeList[i].name,
                    attandanceEmployeeList[i].empId
                  );
                  setshowTimer(false);
                  setnotshow(false);

                  openEmpListModal.current.close();
                }

                return;
              } else {
              }
            }
          } else {
            if (attandanceEmployeeList[i].id === item?.id) {
              if (attandanceEmployeeList[i].status === "SCHEDULE") {
                let newArr = attandanceEmployeeList.map((itemDta) => {
                  if (itemDta?.id === attandanceEmployeeList[i]?.id) {
                    itemDta.status = "BOARDED";
                  }
                  return { ...itemDta };
                });

                if (attandanceEmployeeList[i].passType === "ESCORT") {
                  submitEmployeeAttendenceTime(
                    attandanceEmployeeList[i].id,
                    attandanceEmployeeList[i].name,
                    attandanceEmployeeList[i].empId
                  );

                  openEmpListModal.current.close();
                } else {
                  let checkEmpAllBoarded = newArr.find(
                    (listItem) => listItem.status === "SCHEDULE"
                  );

                  if (checkEmpAllBoarded) {
                    submitEmployeeAttendenceTime(
                      attandanceEmployeeList[i].id,
                      attandanceEmployeeList[i].name,
                      attandanceEmployeeList[i].empId
                    );
                  } else {
                    setshowTimer(false);
                    setnotshow(false);
                    submitEmployeeAttendenceTime(
                      attandanceEmployeeList[i].id,
                      attandanceEmployeeList[i].name,
                      attandanceEmployeeList[i].empId
                    );

                    openEmpListModal.current.close();
                  }

                  return;
                }
              } else {
                return;
              }
            }
          }
        }
      } else {
        if (attandanceEmployeeList.length === 1) {
          if (attandanceEmployeeList[i].id === item?.id) {
            if (attandanceEmployeeList[i].status === "SCHEDULE") {
              setshowTimer(false);
              setnotshow(false);

              openEmpListModal.current.close();

              submitEmployeeAttendenceTime(
                attandanceEmployeeList[i].id,
                attandanceEmployeeList[i].name,
                attandanceEmployeeList[i].empId
              );

              return;
            } else {
              return;
            }
          }
        } else {
          if (attandanceEmployeeList[i].id === item?.id) {
            if (attandanceEmployeeList[i].status === "SCHEDULE") {
              let newArr = attandanceEmployeeList.map((itemDta) => {
                if (itemDta?.id === attandanceEmployeeList[i]?.id) {
                  itemDta.status = "BOARDED";
                }
                return { ...itemDta };
              });

              let checkEmpAllBoarded = newArr.find(
                (listItem) => listItem.status === "SCHEDULE"
              );

              if (checkEmpAllBoarded) {
                submitEmployeeAttendenceTime(
                  attandanceEmployeeList[i].id,
                  attandanceEmployeeList[i].name,
                  attandanceEmployeeList[i].empId
                );
              } else {
                submitEmployeeAttendenceTime(
                  attandanceEmployeeList[i].id,
                  attandanceEmployeeList[i].name,
                  attandanceEmployeeList[i].empId
                );
                setshowTimer(false);
                setnotshow(false);

                openEmpListModal.current.close();
              }

              return;
            } else {
            }
          }
        }
      }
    }
  };

  const openShowEmpListModal = () => {
    openEmpListModal.current.open();
  };

  const openQrCodeModalPopup = () => {
    showQrCodeModal();
    if (driverAppSettingData) {
      if (driverAppSettingData?.canEmpAttendenceBeCaptureUsingOTPQR == "YES") {
        showQrCodeModal();
      }
    } else {
      showQrCodeModal();
    }
  };

  const showMapFunc = (val) => {
    setshowmap(val);
  };

  const openEmpListForCalling = () => {
    if (empListForCall.length > 0) {
      setshowEmpListForCall(true);
      setTimeout(() => {
        empListForCalling.current.open();
      }, 1000);
    } else {
      showError("All employee boarded.");
    }
  };

  const markEmpAbsent = (item) => {
    Alert.alert(
      `Are you sure you want to ${
        item?.passType === "ESCORT"
          ? "skip this escort"
          : "absent this employee"
      } ?`,
      "",
      [
        {
          text: "No",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            setshowAttendenceLoading(true);
            if (item?.passType === "ESCORT") {
              escortAttendence(item);
            } else {
              noShowClick(item);
            }
          },
        },
      ]
    );
  };

  const boardEmp = (item) => {
    let empStatus =
      item?.passType?.charAt(0)?.toUpperCase() +
      item?.passType?.slice(1)?.toLowerCase();

    let status =
      item?.status == "SCHEDULE"
        ? "Board"
        : item?.status == "BOARDED"
        ? "Deboard"
        : "Board";
    Alert.alert(
      `${status} ${empStatus}`,
      `Are you sure you want to ${status} this ${empStatus}?`,
      [
        {
          text: "No",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            setshowAttendenceLoading(true);
            boardEmployeeWithoutOTP(item);
          },
        },
      ]
    );
  };

  const openGoogleMapCallback = useCallback(googleMapRedirection, [data]);
  const openAppleMapCallback = useCallback(appleMapNavigation, [data]);
  const showEmpListCallback = useCallback(openShowEmpListModal, []);

  const showQrCodeModalCallback = useCallback(openQrCodeModalPopup, [
    driverAppSettingData,
    ongoingRideData,
  ]);

  const showMapCallback = useCallback((val) => {
    showMapFunc(val);
  }, []);

  const noShowClickCallback = useCallback((item) => {
    noShowClick(item);
  }, []);

  const openEmpListForCallCallback = useCallback(openEmpListForCalling, [
    empListForCall,
  ]);
  const openTollTaxAndParkingSheetCallback = useCallback(() => {
    setshowTollTaxSheet(true);
    setamount("");
    settollName("");
    setchargeCategory("");
    setnetworkUri("");
    setdocumentName("");
    setdocumentUri("");
  }, []);
  const infoIconClickCallback = useCallback(() => {
    infoSheet.current.open();
  }, []);

  const showEmpListForCallCallback = useCallback(() => {
    setshowEmpListForCall(false);
  }, []);

  const markEmpAbsentCallback = useCallback(
    (item) => {
      markEmpAbsent(item);
    },
    [attandanceEmployeeList]
  );

  const permissionPopupForCallCallback = useCallback((itemData) => {
    setempDataForCalling(itemData);
    empListForCalling.current.close();
    setTimeout(() => {
      setshowEmpPermPopupForCall(true);
    }, 1000);
  }, []);

  const closeEmpCallingPermCallback = useCallback((itemData) => {
    setshowEmpPermPopupForCall(false);
    setshowEmpListForCall(true);
    setTimeout(() => {
      empListForCalling.current.open();
    }, 1000);
  }, []);

  const callToEmpCallback = useCallback(() => {
    setshowEmpPermPopupForCall(false);
    setshowEmpListForCall(false);

    if (
      driverAppSettingData?.canDriverCallEmployeesThroughCallMasking == "YES"
    ) {
      if (Platform.OS === "android") {
        getSimnumbers();
      } else {
        callToEmployee("IOS");
      }
    } else {
      if (empDataForCalling?.passType == "ESCORT") {
        let number = "";
        number = `tel:${empDataForCalling?.escortMobileNo}`;
        Linking.openURL(number);
      } else {
        let number = "";
        number = `tel:${empDataForCalling?.mobileNo}`;
        Linking.openURL(number);
      }
    }
  }, [driverAppSettingData, empDataForCalling]);

  const boardEmployeeCallback = useCallback(
    (item) => {
      boardEmp(item);
    },
    [attandanceEmployeeList]
  );

  const selectChargeTypeCallback = useCallback((item) => {
    setchargeCategory(item?.value);
  }, []);

  const setTollAmountCallback = useCallback((text) => {
    setamount(text);
  }, []);

  const setSelectedDocCallback = useCallback((uri) => {
    submitFile(uri);
    setdocumentUri(uri);
  }, []);

  const setselectedDocNameCallback = useCallback((docName) => {
    setdocumentName(docName);
  }, []);

  const changeTollNameCallback = useCallback((text) => {
    settollName(text);
  }, []);

  const handleRatingCallback = useCallback(
    (rating, id, status) => {
      handleRating(rating, id, status);
    },
    [ratingEmpList, tripType]
  );

  const setisThisOfficeCallback = useCallback((val) => {
    setisThisOffice(val);
  }, []);

  const setstopPointEmpListCallback = useCallback((val) => {
    setstopPointEmpList(val);
  }, []);

  const setshowstopPointDetailCallback = useCallback((val) => {
    setshowstopPointDetail(!showstopPointDetail);
  }, []);

  const nextTripOnAcceptCallback = useCallback((id) => {
    acceptRejectRide("ACCEPT", id);
    setshowTripModal(false);
    setshowDragButton(true);
  }, []);

  const closeTollTaxParkingCallback = useCallback(() => {
    setshowTollTaxSheet(false);
  }, []);

  const onSwipeStartCallback = useCallback(() => {
    setTimeout(() => {
      fitToCoordinates();
      sendCoveredPathToApi();
      completeRide();
      setTimeout(() => {
        takeSnapShot();
      }, 3000);
    }, 1000);
  }, [data]);

  const sosButtonClickCallback = useCallback(() => {
    sosBottomSheetRef?.current?.show();
  }, []);

  const onPressOnDragButtonCallback = useCallback(() => {
    setnextTripPopupData(nextTripPopupData);
    setshowTripModal(true);
  }, [nextTripPopupData]);

  const onPressInDragButtonCallback = useCallback(() => {
    setmapdraggable(false);
  }, []);

  const onShortPressReleaseCallback = useCallback(() => {
    setshowTripModal(true);
  }, []);

  const onReleaseDragButtonCallback = useCallback(() => {
    setmapdraggable(true);
  }, []);

  const nextTripCloseModalCallback = useCallback(() => {
    setshowTripModal(!showTripModal);
    setshowDragButton(true);
  }, []);

  const nextTripOnDeclineCallback = useCallback(() => {
    setshowTripModal(false);
    setshowDragButton(true);
  }, []);

  const closeInfoSheetCallback = useCallback(() => {
    setshowInfoList(false);
  }, []);

  const closeRatingSheetCallback = useCallback(() => {
    setsnapShotUri("");
  }, []);

  const submitRatingFunCallback = useCallback(() => {
    submitRating();
  }, [ratingEmpList]);

  const cleanSelectionCallback = useCallback(() => {
    setdocumentName("");
    setdocumentUri("");
  }, []);

  const closeShowStopPointModalCallback = useCallback(() => {
    setshowstopPointDetail(false);
  }, []);

  const setotpCodeCallback = useCallback(
    (text) => {
      if (isNaN(text)) {
      } else {
        setotp(text);

        if (text.length === 4) {
          verifyOTP(text);
        } else {
          seterrorMessageColor(colors.black);
          setinputBoxColor(colors.black);
        }
      }
    },
    [attandanceEmployeeList]
  );
  const closeOtpModalCallback = useCallback(() => {
    setshowQrCodeModalPopup(false);
  }, []);

  const EmpIdOnChangeNumberCallback = useCallback((text) => {
    setempShortId(text);
  }, []);

  const submitShortIdCallback = useCallback(() => {
    submitShortId();
  }, [attandanceEmployeeList, empShortId]);
  return (
    <View style={{ flex: 1 }}>
      {/* {showLoader ? (
        <Modal transparent visible={true}>
          <View
            style={{
              backgroundColor: colors.whiteOpacity22,
              elevation: 5,
              width: width,
              height: height,
            }}
          >
            <BarIndicator size={25} color={colors.darkBlue} />
          </View>
        </Modal>
      ) : null} */}
      {/* <StatusBar backgroundColor={"transparent"} barStyle={'dark-content'} translucent={true} /> */}
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
      />

      <View style={!showmap ? { flex: 1 } : { height: height - 110 }}>
        <LiveTrackMapGoogle
          scrollEnabled={mapdraggable}
          showcompleteRide={showcompleteRide}
          travelledCoords={travelledCoords}
          coveredRouteCord={coveredRouteCord}
          coordinates={coordinates}
          mapRef={mapRef}
          driverMarkerRef={driverMarkerRef}
          data={data?.data?.length > 0 ? data : ""}
          driverCurrentCoordinate={driverCurrentCoordinate}
          setisThisOffice={setisThisOfficeCallback}
          setstopPointEmpList={setstopPointEmpListCallback}
          setshowstopPointDetail={setshowstopPointDetailCallback}
          route={routee}
        />
      </View>
      {showcompleteRide ? (
        <View style={styles.swipeToRightButtonContainer}>
          {tripType === "DOWNTRIP" ? (
            <View style={{ width: "80%" }}>
              <SwipeButton
                swipeSuccessThreshold={60}
                shouldResetAfterSuccess
                title="Complete Ride"
                enableReverseSwipe={true}
                onSwipeStart={onSwipeStartCallback}
                railBackgroundColor="#a83232"
                thumbIconBackgroundColor="#c22b2e"
                railFillBackgroundColor="#c22b2e"
                thumbIconComponent={swipeThumIcon}
                thumbIconBorderColor="#c22b2e"
                titleColor={colors.white}
                titleFontSize={20}
                containerStyles={{
                  width: "100%",
                  height: 52,
                  borderRadius: 10,
                  borderWidth: 0,
                }}
                railStyles={{
                  height: 52,
                  borderRadius: 10,

                  borderColor: "#c22b2e",
                }}
                thumbIconStyles={{
                  borderRadius: 10,
                  margin: 0,
                }}
              />
            </View>
          ) : (
            <View style={{ width: "80%" }}>
              <SwipeButton
                swipeSuccessThreshold={50}
                shouldResetAfterSuccess
                title="Complete Ride"
                enableReverseSwipe={true}
                onSwipeStart={onSwipeStartCallback}
                railBackgroundColor="#a83232"
                thumbIconBackgroundColor="#c22b2e"
                railFillBackgroundColor="#c22b2e"
                thumbIconComponent={swipeThumIcon}
                thumbIconBorderColor="#c22b2e"
                titleColor={colors.white}
                titleFontSize={20}
                containerStyles={styles.swipeButtonContainerStyle}
                railStyles={styles.swipeButtonRailStyle}
                thumbIconStyles={styles.swipeButtonThumbIconStyle}
              />
            </View>
          )}
        </View>
      ) : null}
      <Header
        driverStatus="online"
        margin
        speedInKmPerH={speedInKmPerH}
        navigation={navigation}
        sosButtonClick={sosButtonClickCallback}
        showSOS={
          tripId && data?.data?.[0]?.isSSO?.toUpperCase()?.trim() !== "TRUE"
            ? true
            : false
        }
        showSpeedLimit={true}
        mapScreen={false}
        speedLimit={
          driverAppSettingData?.alertCorpOnOverSpeedingBetweenfrom
            ? driverAppSettingData?.alertCorpOnOverSpeedingBetweenfrom
            : 60
        }
      />
      {showDragButton ? (
        <DraggableButton
          onPress={onPressOnDragButtonCallback}
          onPressIn={onPressInDragButtonCallback}
          onShortPressRelease={onShortPressReleaseCallback}
          onRelease={onReleaseDragButtonCallback}
        />
      ) : null}

      {tripType == "DOWNTRIP" ? (
        <ShowEmpListDownTrip
          showAttendenceLoading={showAttendenceLoading}
          openEmpListModal={openEmpListModal}
          driverAppSettingData={driverAppSettingData}
          showAbsentButton={showAbsentButton}
          noShowClick={markEmpAbsentCallback}
          boardEmployee={boardEmployeeCallback}
          empList={attandanceEmployeeList}
          tripType={tripType}
          passengersListType={passengersListType}
          showEmpDetailModal={showEmpDetailModal}
          escotrTrip={
            ongoingRideData?.stopType?.toUpperCase()?.trim() === "ESCORT"
              ? true
              : false
          }
        />
      ) : (
        <ShowEmpList
          showAttendenceLoading={showAttendenceLoading}
          openEmpListModal={openEmpListModal}
          driverAppSettingData={driverAppSettingData}
          showAbsentButton={showAbsentButton}
          noShowClick={markEmpAbsentCallback}
          boardEmployee={boardEmployeeCallback}
          empList={attandanceEmployeeList}
          tripType={tripType}
          passengersListType={passengersListType}
          showEmpDetailModal={showEmpDetailModal}
          escotrTrip={
            ongoingRideData?.stopType?.toUpperCase()?.trim() === "ESCORT"
              ? true
              : false
          }
        />
      )}

      {showstopPointDetail ? (
        <ShowStopPointEmpList
          stopPoint={stopPointEmpList}
          showstopPointDetail={showstopPointDetail}
          closeModal={closeShowStopPointModalCallback}
          tripStartTime={tripStartTime}
          isThisOffice={isThisOffice}
          driverAppSettingData={driverAppSettingData}
        />
      ) : null}

      {showTripModal ? (
        <NextTripModal
          data={nextTripPopupData}
          showModal={showTripModal}
          closeModal={nextTripCloseModalCallback}
          onDecline={nextTripOnDeclineCallback}
          onAccept={nextTripOnAcceptCallback}
          totalEmpCount={totalEmpCount?.length}
        />
      ) : null}

      {showQrCodeModalPopup ? (
        <QRCodeMoal
          showErrorMessage={showErrorMessage}
          errorMessageColor={errorMessageColor}
          inputBoxColor={inputBoxColor}
          errorMessage={errorMessage}
          timerDuration={timerDuration}
          showTimer={showTimer}
          setotpCode={setotpCodeCallback}
          otpCode={otp}
          data={data}
          isEscort={isEscort}
          setIsEscort={setIsEscort}
          ongoingRideData={ongoingRideData}
          showQrCodeModalPopup={showQrCodeModalPopup}
          closeModal={closeOtpModalCallback}
          escort={isEscort ? "YES" : "NO"}
          driverAppSettingData={driverAppSettingData}
          EmpIdOnChangeNumber={EmpIdOnChangeNumberCallback}
          submitShortId={submitShortIdCallback}
        />
      ) : null}

      {showNextStopBottomModal ? (
        tripType === "UPTRIP" ? (
          <EmpDetailBottomModal
            mapRef={mapRef}
            allStopPointDynamicETA={allStopPointDynamicETA}
            isThisEscortTrip={isThisEscortTrip}
            showAbsentButton={showAbsentButton}
            driverId={profileData?.id}
            attandanceEmployeeList={attandanceEmployeeList}
            timerDuration={timerDuration}
            showTimer={showTimer}
            escortStatus={escortStatus}
            nextPickupLocation={nextPickupLocation}
            data={ongoingRideData === "" ? null : ongoingRideData}
            notshow={notshow}
            tripType={tripType}
            driverAppSettingData={driverAppSettingData}
            driverReachOffice={driverReachOffice}
            googleMapRedirection={openGoogleMapCallback}
            appleMapNavigation={openAppleMapCallback}
            showEmpListModal={showEmpListCallback}
            timesUp={showEmpListCallback}
            showQrCodeMoal={showQrCodeModalCallback}
            noShowClick={noShowClickCallback}
            setshowmap={showMapCallback}
            openEmpListForCall={openEmpListForCallCallback}
            openTollTaxAndParkingSheet={openTollTaxAndParkingSheetCallback}
            infoIconClick={infoIconClickCallback}
          />
        ) : ongoingRideData?.onBoardPassengers
            ?.filter((ele, ind) => {
              return (
                ele?.passType?.toUpperCase()?.trim() === "ESCORT" &&
                ele?.status?.toUpperCase()?.trim() === "SCHEDULE"
              );
            })?.[0]
            ?.passType?.toUpperCase()
            ?.trim() === "ESCORT" ? (
          <EscortDetailsDownTrip
            mapRef={mapRef}
            allStopPointDynamicETA={allStopPointDynamicETA}
            isThisEscortTrip={isThisEscortTrip}
            showAbsentButton={showAbsentButton}
            driverId={profileData?.id}
            attandanceEmployeeList={attandanceEmployeeList}
            timerDuration={timerDuration}
            showTimer={showTimer}
            escortStatus={escortStatus}
            nextPickupLocation={nextPickupLocation}
            data={ongoingRideData === "" ? null : ongoingRideData}
            notshow={notshow}
            tripType={tripType}
            driverAppSettingData={driverAppSettingData}
            driverReachOffice={driverReachOffice}
            googleMapRedirection={openGoogleMapCallback}
            appleMapNavigation={openAppleMapCallback}
            showEmpListModal={showEmpListCallback}
            timesUp={showEmpListCallback}
            showQrCodeMoal={showQrCodeModalCallback}
            noShowClick={noShowClickCallback}
            setshowmap={showMapCallback}
            openEmpListForCall={openEmpListForCallCallback}
            openTollTaxAndParkingSheet={openTollTaxAndParkingSheetCallback}
            infoIconClick={infoIconClickCallback}
          />
        ) : (
          <EmpDetailBottomDownTripModal
            mapRef={mapRef}
            allStopPointDynamicETA={allStopPointDynamicETA}
            isThisEscortTrip={isThisEscortTrip}
            showAbsentButton={showAbsentButton}
            driverId={profileData?.id}
            attandanceEmployeeList={attandanceEmployeeList}
            timerDuration={timerDuration}
            showTimer={showTimer}
            escortStatus={escortStatus}
            nextPickupLocation={nextPickupLocation}
            data={ongoingRideData === "" ? null : ongoingRideData}
            notshow={notshow}
            tripType={tripType}
            driverAppSettingData={driverAppSettingData}
            driverReachOffice={driverReachOffice}
            googleMapRedirection={openGoogleMapCallback}
            appleMapNavigation={openAppleMapCallback}
            showEmpListModal={showEmpListCallback}
            timesUp={showEmpListCallback}
            showQrCodeMoal={showQrCodeModalCallback}
            noShowClick={noShowClickCallback}
            setshowmap={showMapCallback}
            openEmpListForCall={openEmpListForCallCallback}
            openTollTaxAndParkingSheet={openTollTaxAndParkingSheetCallback}
            infoIconClick={infoIconClickCallback}
          />
        )
      ) : null}
      {showEmpPermPopupForCall ? (
        <EmpPermPopupForCall
          onClose={closeEmpCallingPermCallback}
          empDataForCalling={empDataForCalling}
          callEmp={callToEmpCallback}
          driverAppSettingData={driverAppSettingData}
        />
      ) : null}

      {showEmpListForCall ? (
        <EmpListForCall
          driverAppSettingData={driverAppSettingData}
          empList={empListForCall}
          empListForCalling={empListForCalling}
          closeModal={showEmpListForCallCallback}
          permissionForCall={permissionPopupForCallCallback}
        />
      ) : null}

      {showTollTaxSheet ? (
        <TollTaxAndParkingModal
          showTollTaxSheet={showTollTaxSheet}
          closeModal={closeTollTaxParkingCallback}
          selectChargeType={selectChargeTypeCallback}
          chargeCategory={chargeCategory}
          amount={amount}
          documentUri={documentUri}
          settollAmount={setTollAmountCallback}
          setselectedDoc={setSelectedDocCallback}
          setselectedDocName={setselectedDocNameCallback}
          documentName={documentName}
          cleanSelection={cleanSelectionCallback}
          submitCharges={submitCharges}
          loadingButton={loadingButton}
          showDropDown={true}
          changeTollName={changeTollNameCallback}
          tollName={tollName}
        />
      ) : null}

      <SosBottomSheet
        showSosBottomSheet={sosBottomSheetRef}
        sendSos={sendSosAlert}
      />
      <RatingComp
        onClose={closeRatingSheetCallback}
        snapShotUri={snapShotUri}
        isLoading={isLoading}
        ratingEmpList={ratingEmpList}
        showRating={showRating}
        submitRatingFun={submitRatingFunCallback}
        handleRating={handleRatingCallback}
        driverAppSettingData={driverAppSettingData}
      />

      <InfoSheet
        onClose={closeInfoSheetCallback}
        infoList={infoList}
        infoSheet={infoSheet}
      />
    </View>
  );
};

export default memo(LiveTracking);

const styles = StyleSheet.create({
  swipeToRightButtonContainer: {
    width: "100%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  swipeButtonContainerStyle: {
    width: "100%",
    height: 52,
    borderRadius: 10,
    borderWidth: 0,
  },
  swipeButtonRailStyle: {
    height: 52,
    borderRadius: 10,
    borderColor: "#c22b2e",
  },
  swipeButtonThumbIconStyle: {
    borderRadius: 10,
    margin: 0,
  },
});
