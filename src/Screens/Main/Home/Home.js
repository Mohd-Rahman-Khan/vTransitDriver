import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  PermissionsAndroid,
  SafeAreaView,
  StatusBar,
  DeviceEventEmitter,
  Linking,
  AppState,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import ButtonComp from "../../../Components/ButtonComp";
import WrapperContainer from "../../../Components/WrapperContainer";
import imagePath from "../../../constants/imagePath";
import strings from "../../../constants/lang";
import colors from "../../../styles/colors";
import { styles } from "./style";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import navigationStrings from "../../../navigation/navigationStrings";
import Header from "../../../Components/Header";
import NetInfo from "@react-native-community/netinfo";

import Geolocation from "react-native-geolocation-service";
import actions from "../../../redux/actions";
import DraggableButton from "../../../Components/DraggableButton";
import NextTripModal from "../../../Components/NextTripModal";
import SwipableButton from "../../../Components/SwipableButton";
import { showError, showSuccess } from "../../../utils/helperFunction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { BarIndicator } from "react-native-indicators";
// import {
//   showFloatingBubble,
//   hideFloatingBubble,
//   requestPermission,
//   initialize,
//   checkPermission,
// } from "react-native-floating-bubble";

import {
  DRIVER_ONGOING_RIDE,
  DRIVER_NEXT_RIDE,
  DRIVER_SCHEDULED_RIDE,
  GET_DRIVER_VEHICLE_NUMBER,
  GET_PAST_RIDE,
} from "../../../config/urls";
import Moment from "moment";
import { extendMoment } from "moment-range";
//import CurrentLocationActivity from "../../../Components/CurrentLocationActivity";
import { useSelector } from "react-redux";
import socketServices from "../../../utils/socketServices";
import {
  getDriverDataById,
  saveProfileData,
} from "../../../redux/actions/profileData";
import { removeUserData, setItem } from "../../../utils/utils";
import { height, moderateScale, width } from "../../../styles/responsiveSize";
import DeviceInfo from "react-native-device-info";
import MapView from "react-native-maps";
import { Marker, MarkerAnimated, PROVIDER_GOOGLE } from "react-native-maps";
import { requestUserPermission } from "../../../utils/notificationServices";
import InfoSheet from "../../../Components/InfoSheet";
import HomeHeader from "../../../Components/HomeHeader";
import SelectRideToStartPopup from "../../../Components/SelectRideToStartPopup";

const moment = extendMoment(Moment);
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
];

const Home = () => {
  const navigation = useNavigation();
  const [mapdraggable, setmapdraggable] = useState(true);
  const [driverLat, setdriverLat] = useState(null);
  const [driverLong, setdriverLong] = useState(null);
  const [showTripModal, setshowTripModal] = useState(false);
  const [showStartRideButton, setshowStartRideButton] = useState(false);
  const [showDragButton, setshowDragButton] = useState(false);
  const [nextTripData, setnextTripData] = useState("");
  const [nextTripPopupData, setnextTripPopupData] = useState("");
  const [statrRideData, setstatrRideData] = useState("");
  const [tripId, settripId] = useState("");
  const [lastCompRide, setlastCompRide] = useState("");
  const [nextTripTime, setnextTripTime] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [driverCurrentCoordinate, setdriverCurrentCoordinate] = useState();
  const [totalEmpCount, settotalEmpCount] = useState([]);
  const [showInfoList, setshowInfoList] = useState(false);
  const [driverAppSettingData, setdriverAppSettingData] = useState("");
  const [showLoadingButton, setshowLoadingButton] = useState(false);
  const [driverStatus, setdriverStatus] = useState("offline");
  const [showChooseRideToStartPopup, setshowChooseRideToStartPopup] =
    useState(false);
  const [sheduledRided, setsheduledRided] = useState([]);
  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );
  const isFocus = useIsFocused();

  const getdriverStatus = useSelector(
    (state) => state?.driverAttendenceReducer?.driverAttendence
  );

  const getDrawerCloseData = useSelector(
    (state) => state?.closeDrawerReducer?.closeDrawer
  );

  const screen = Dimensions.get("window");
  const ASPECT_RATIO = screen.width / screen.height;
  const LATITUDE_DELTA = 0.04;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const mapRef = useRef();
  const infoSheet = useRef();

  const getNewRideData = useSelector((state) => state?.newRideAssignReducer);

  useFocusEffect(
    useCallback(() => {
      getDriverModulePermissions();
      getCurrentCoords();
      getAllPermissions();
      setshowStartRideButton(false);
      getOngoingRide();
      _getDriverDataById();
      getDriverAppSetting();
      changeAppTheme();
    }, [])
  );

  useEffect(() => {
    //getOngoingRide();
    //_getDriverDataById();
    getCurrentCoords();
    requestUserPermission();
  }, []);
  useEffect(() => {
    socketServices.initializeSocket();
  }, []);

  useEffect(() => {
    watchPosition();
  }, [lastCompRide]);

  useEffect(() => {
    if (getdriverStatus) {
      setdriverStatus(getdriverStatus);
    }
  }, [getdriverStatus]);

  useEffect(() => {
    sendDataToDashboard();
  }, [driverCurrentCoordinate, lastCompRide]);

  useEffect(() => {
    const subscriptionPress = DeviceEventEmitter.addListener(
      "floating-bubble-press",
      function (e) {
        Linking.openURL("mychat://");
        navigation.navigate(navigationStrings.LIVE_TRACKING);
      }
    );
    const subscriptionRemove = DeviceEventEmitter.addListener(
      "floating-bubble-remove",
      function (e) {}
    );
    return () => {
      subscriptionPress.remove();
      subscriptionRemove.remove();
    };
  }, []);

  useEffect(() => {
    if (getDrawerCloseData?.isDrawerrClose) {
      getOngoingRide();
    }
  }, [getDrawerCloseData]);

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

  const changeAppTheme = () => {
    actions
      .getTanantById(profileData?.tenantId)
      .then((res) => {
        let { status } = res;

        if (status == 200) {
          if (res?.data?.theme) {
            colors.statusBarColor = res?.data?.theme?.bgColor;
            colors.themeColor = res?.data?.theme?.bgColor;
            colors.darkBlue = res?.data?.theme?.bgColor;
            colors.homeBg = res?.data?.theme?.bgColor;
          }
        } else {
        }
      })
      .catch((error) => {});
  };

  const getAllPermissions = async () => {
    if (Platform.OS == "android") {
      const granted1 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: "vTransit",
          message:
            "This app want your current location latlong to get your exact location",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );

      const granted222 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        {
          title: "vTransit",
          message:
            "This app want your current location latlong to get your exact location",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      const granted3 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        {
          title: "vTransit",
          message:
            "This app want your current location latlong to get your exact location",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );

      const granteda = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
        {
          title: "vTransit",
          message:
            "This app want your current location latlong to get your exact location",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
    }
  };

  useEffect(() => {
    getOngoingRide();
    getScheduledRides();
  }, [getNewRideData, driverAppSettingData]);

  const sendDataToDashboard = async () => {
    let networkStatus = false;
    let networkStrength;
    NetInfo.fetch().then((state) => {
      networkStatus = state?.isConnected;

      networkStrength = state?.details?.strength
        ? state?.details?.strength
        : null;
    });
    if (lastCompRide) {
      const timeObjectCreate = new Date();
      let currentTime = timeObjectCreate.getTime();
      var batteryPercentage;
      DeviceInfo.getBatteryLevel().then((batteryLevel) => {
        var batteryLevelInDecimal = batteryLevel;
        var changebatteryLevelInInteger = batteryLevelInDecimal * 100;
        batteryPercentage = ~~changebatteryLevelInInteger;
      });
      let getStopPointsDynamicETA;
      let getDynnamicETA = await AsyncStorage.getItem("DynamicETA");
      if (getDynnamicETA) {
        let parseGetDynnamicETA = JSON.parse(getDynnamicETA);

        getStopPointsDynamicETA = parseGetDynnamicETA;
      } else {
        getStopPointsDynamicETA = null;
      }

      if (batteryPercentage) {
        let sendDriverLoc = {
          vendorId: lastCompRide?.vendorId,
          corpId: lastCompRide?.corporateId,
          vehicleId: lastCompRide?.vehicleId,
          driverId: profileData?.id,
          location: {
            lat: driverCurrentCoordinate?.latitude,
            lng: driverCurrentCoordinate?.longitude,
            heading: driverCurrentCoordinate?.heading,
          },
          tripStatus: lastCompRide?.status,
          tripId: lastCompRide?.id,
          OVER_SPEEDING: driverCurrentCoordinate?.speed,
          GPS_SIGNAL_LOST: networkStatus,
          networkStrength: networkStrength,
          updatedOn: currentTime,
          mobileBatteryStatus: batteryPercentage,
          date: moment(timeObjectCreate).format("DD-MM-YYYY"),
          stopPointsDynamicETA: getStopPointsDynamicETA,
        };

        socketServices.emit("live", sendDriverLoc);
      }
    }
  };

  const sendLiveTripData = async (position) => {
    let networkStatus = false;
    let networkStrength;
    NetInfo.fetch().then((state) => {
      networkStatus = state?.isConnected;

      networkStrength = state?.details?.strength
        ? state?.details?.strength
        : null;
    });
    if (lastCompRide) {
      const timeObjectCreate = new Date();
      let currentTime = timeObjectCreate.getTime();
      var batteryPercentage;
      DeviceInfo.getBatteryLevel().then((batteryLevel) => {
        var batteryLevelInDecimal = batteryLevel;
        var changebatteryLevelInInteger = batteryLevelInDecimal * 100;
        batteryPercentage = ~~changebatteryLevelInInteger;
      });
      let getStopPointsDynamicETA;
      let getDynnamicETA = await AsyncStorage.getItem("DynamicETA");
      if (getDynnamicETA) {
        let parseGetDynnamicETA = JSON.parse(getDynnamicETA);

        getStopPointsDynamicETA = parseGetDynnamicETA;
      } else {
        getStopPointsDynamicETA = null;
      }

      if (batteryPercentage) {
        let sendDriverLoc = {
          vendorId: lastCompRide?.vendorId,
          corpId: lastCompRide?.corporateId,
          vehicleId: lastCompRide?.vehicleId,
          driverId: profileData?.id,
          location: {
            lat: position?.coords?.latitude,
            lng: position?.coords?.longitude,
            heading: position?.coords?.heading,
          },
          tripStatus: lastCompRide?.status,
          tripId: lastCompRide?.id,
          OVER_SPEEDING: position?.coords?.speed,
          GPS_SIGNAL_LOST: networkStatus,
          networkStrength: networkStrength,
          updatedOn: currentTime,
          mobileBatteryStatus: batteryPercentage,
          date: moment(timeObjectCreate).format("DD-MM-YYYY"),
          stopPointsDynamicETA: getStopPointsDynamicETA,
          gpsTrackingMode: lastCompRide?.gpsTrackingMode,
        };
        socketServices.emit("live", sendDriverLoc);
      }
    } else {
      const timeObjectCreate = new Date();
      let currentTime = timeObjectCreate.getTime();
      var batteryPercentage;
      DeviceInfo.getBatteryLevel().then((batteryLevel) => {
        var batteryLevelInDecimal = batteryLevel;
        var changebatteryLevelInInteger = batteryLevelInDecimal * 100;
        batteryPercentage = ~~changebatteryLevelInInteger;
      });
      let getStopPointsDynamicETA;
      let getDynnamicETA = await AsyncStorage.getItem("DynamicETA");
      if (getDynnamicETA) {
        let parseGetDynnamicETA = JSON.parse(getDynnamicETA);

        getStopPointsDynamicETA = parseGetDynnamicETA;
      } else {
        getStopPointsDynamicETA = null;
      }

      if (batteryPercentage) {
        let sendDriverLoc = {
          vendorId: profileData?.vendorId,
          corpId: profileData?.corporateId,
          vehicleId: profileData?.vehicleId,
          driverId: profileData?.id,
          location: {
            lat: position?.coords?.latitude,
            lng: position?.coords?.longitude,
            heading: position?.coords?.heading,
          },
          tripStatus: null,
          tripId: null,
          OVER_SPEEDING: position?.coords?.speed,
          GPS_SIGNAL_LOST: networkStatus,
          networkStrength: networkStrength,
          updatedOn: currentTime,
          mobileBatteryStatus: batteryPercentage,
          date: moment(timeObjectCreate).format("DD-MM-YYYY"),
          stopPointsDynamicETA: getStopPointsDynamicETA,
        };
        socketServices.emit("live", sendDriverLoc);
      }
    }
  };

  const watchPosition = async () => {
    Geolocation.watchPosition(
      (position) => {
        sendLiveTripData(position);
      },
      (error) => {},
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        distanceFilter: 0,
      }
    );
  };

  const _getDriverDataById = async () => {
    AsyncStorage.removeItem("DriverLastPointForDynamicETA");
    if (profileData?.id) {
      actions
        .getDriverDataById(profileData?.id)
        .then((re) => {
          let { status } = re;
          if (status == 200) {
            actions.saveProfileData(re?.data);
            saveProfileData(re?.data);
          } else {
          }
        })
        .catch((er) => {});
    }
  };

  const logout = async () => {
    AsyncStorage.removeItem("loginUserType2");
    AsyncStorage.removeItem("DynamicETA");
    AsyncStorage.removeItem("mapType");
    AsyncStorage.removeItem("DriverCurrentPoint");
    AsyncStorage.removeItem("DriverLastPoint");

    actions.logout();
    actions.logoutAccount(`${profileData?.id}`);
    removeUserData("loginType");
    showSuccess("Logout successfully");
  };

  const getPastRide = () => {
    actions
      .getRide(`${GET_PAST_RIDE}?page=0&size=1`)
      .then((res) => {
        if (res?.status === 200) {
          if (res?.data?.body?.TripList) {
            if (res?.data?.body?.TripList?.length > 0) {
              setlastCompRide(res?.data?.body?.TripList[0]);
            } else {
            }
          }
        } else {
          showError("Something went wrong.");
        }
      })
      .catch((err) => {});
  };

  const getOngoingRide = async () => {
    actions
      .getRide(DRIVER_ONGOING_RIDE)
      .then((res) => {
        if (res.status === 200) {
          if (res?.data) {
            if (res?.data.length > 0) {
              if (profileData?.id) {
                actions
                  .getDriverDataById(profileData?.id)
                  .then((re) => {
                    let { status } = re;
                    if (status == 200) {
                      re?.data?.corporateId;
                      if (re?.data?.corporateId == res?.data[0]?.corporateId) {
                        if (Platform.OS == "android") {
                          let splitOSVersion =
                            Platform.constants["Release"].split(".");
                          if (splitOSVersion[0] < 10) {
                            //showError("Android version 11 is required.");
                          } else {
                            setlastCompRide(res?.data[0]);
                            let ongoingRideData = {
                              isOngoing: true,
                            };
                            AsyncStorage.setItem(
                              "ongoingRideData",
                              JSON.stringify(ongoingRideData)
                            );
                            socketServices.emit("add-user", profileData.id);

                            checkQuickAccessButtonPermission();
                          }
                        } else {
                          setlastCompRide(res?.data[0]);
                          let ongoingRideData = {
                            isOngoing: true,
                          };
                          AsyncStorage.setItem(
                            "ongoingRideData",
                            JSON.stringify(ongoingRideData)
                          );
                          socketServices.emit("add-user", profileData.id);

                          checkQuickAccessButtonPermission();
                        }
                      } else {
                        getPastRide();
                        let ongoingRideData = {
                          isOngoing: false,
                        };
                        AsyncStorage.setItem(
                          "ongoingRideData",
                          JSON.stringify(ongoingRideData)
                        );
                        socketServices.emit("add-user", profileData.id);
                        getCurrentCoords();
                        getDriverUpcomingRide();
                        getScheduledRides();
                      }
                    } else {
                    }
                  })
                  .catch((er) => {});
              }
            } else {
              getPastRide();
              let ongoingRideData = {
                isOngoing: false,
              };
              AsyncStorage.setItem(
                "ongoingRideData",
                JSON.stringify(ongoingRideData)
              );
              socketServices.emit("add-user", profileData.id);
              getCurrentCoords();
              getDriverUpcomingRide();
              getScheduledRides();
            }
          } else {
            getPastRide();
            let ongoingRideData = {
              isOngoing: false,
            };
            socketServices.emit("add-user", profileData.id);
            AsyncStorage.setItem(
              "ongoingRideData",
              JSON.stringify(ongoingRideData)
            );
            getCurrentCoords();
            getDriverUpcomingRide();
            getScheduledRides();
          }
        } else if (res.status === 511) {
          logout();
        } else {
          getPastRide();
          let ongoingRideData = {
            isOngoing: false,
          };
          AsyncStorage.setItem(
            "ongoingRideData",
            JSON.stringify(ongoingRideData)
          );
          socketServices.emit("add-user", profileData.id);
          getCurrentCoords();
          getDriverUpcomingRide();
          getScheduledRides();
        }
      })
      .catch((err) => {
        getPastRide();
      });
  };

  const checkQuickAccessButtonPermission = () => {
    navigation.navigate(navigationStrings.LIVE_TRACKING);
    // if (Platform.OS === "android") {
    //   checkPermission()
    //     .then((value) => {
    //       navigation.navigate(navigationStrings.LIVE_TRACKING);
    //       if (value) {
    //         initialize()
    //           .then(() => {
    //             navigation.navigate(navigationStrings.LIVE_TRACKING);
    //           })
    //           .catch(() => {
    //             showError("Failed initialize quick access button.");
    //             navigation.navigate(navigationStrings.LIVE_TRACKING);
    //           });
    //       } else {
    //         requestPermission()
    //           .then(() => {
    //             initialize()
    //               .then(() => {
    //                 navigation.navigate(navigationStrings.LIVE_TRACKING);
    //               })
    //               .catch(() => {
    //                 showError("Failed initialize quick access button.");
    //                 navigation.navigate(navigationStrings.LIVE_TRACKING);
    //               });
    //           })
    //           .catch(() =>
    //             showError(
    //               "Please allow draw over other apps permission for quick access."
    //             )
    //           );
    //       }
    //     })
    //     .catch(() => {
    //       showError("Failed to check quick access button permission.");
    //       navigation.navigate(navigationStrings.LIVE_TRACKING);
    //     });
    // } else {
    //   navigation.navigate(navigationStrings.LIVE_TRACKING);
    // }
  };

  const getScheduledRides = () => {
    actions
      .getRide(DRIVER_SCHEDULED_RIDE)
      .then((res) => {
        if (res?.status === 200) {
          if (res?.data?.length > 0) {
            setsheduledRided(res?.data);
            if (Platform.OS == "android") {
              let splitOSVersion = Platform.constants["Release"].split(".");
              if (splitOSVersion[0] < 10) {
                //showError("Android version 11 is required.");
              } else {
                for (var i = 0; i < res.data.length; i++) {
                  var todayDate = moment(new Date()).format("YYYY-MM-DD");
                  var tripDate = res.data[i].date;

                  if (todayDate === tripDate) {
                    var ridStartTime;

                    if (res.data[i]?.tripType === "UPTRIP") {
                      ridStartTime = moment
                        .utc(res.data[i].stopList[0]?.expectedArivalTime)
                        .local()
                        .format("HH:mm");
                    } else if (res.data[i]?.tripType === "DOWNTRIP") {
                      ridStartTime = moment
                        .utc(res.data[i].stopList[0]?.expectedArivalTime)
                        .local()
                        .format("HH:mm");
                    } else {
                      ridStartTime = moment
                        .utc(res.data[i].startTimeInMiliSec)
                        .local()
                        .format("HH:mm");
                    }

                    var currentTime = moment().format("HH:mm");

                    var startTime = moment(currentTime, "HH:mm");

                    var endTime = moment(ridStartTime, "HH:mm");

                    var diffrent = moment.duration(endTime.diff(startTime));

                    var hours = parseInt(diffrent.asHours());
                    var minutes = parseInt(diffrent.asMinutes()) - hours * 60;
                    var totalMin = hours * 60 + minutes;

                    var minutesOfStartRide;

                    if (res.data[i]?.tripType === "UPTRIP") {
                      if (
                        driverAppSettingData?.displayStartButtonBeforeMinDiffOfFirstPickup
                      ) {
                        minutesOfStartRide =
                          driverAppSettingData?.displayStartButtonBeforeMinDiffOfFirstPickup;
                      } else {
                        minutesOfStartRide = 15;
                      }
                    } else if (res.data[i]?.tripType === "DOWNTRIP") {
                      if (
                        driverAppSettingData?.displayStartButtonBeforeMinDiffOfLogoutTime
                      ) {
                        minutesOfStartRide =
                          driverAppSettingData?.displayStartButtonBeforeMinDiffOfLogoutTime;
                      } else {
                        minutesOfStartRide = 15;
                      }
                    } else {
                      minutesOfStartRide = 15;
                    }

                    setshowStartRideButton(true);

                    // if (totalMin < 0) {
                    //   setstatrRideData(res.data[i]);
                    //   setshowStartRideButton(true);
                    // } else {
                    //   if (totalMin > 0 && totalMin <= minutesOfStartRide) {
                    //     setstatrRideData(res.data[i]);
                    //     setshowStartRideButton(true);
                    //   } else {
                    //     setstatrRideData("");
                    //     setshowStartRideButton(false);
                    //   }
                    // }
                  } else {
                    setstatrRideData("");
                    setshowStartRideButton(false);
                  }
                }
              }
            } else {
              for (var i = 0; i < res.data.length; i++) {
                var todayDate = moment(new Date()).format("YYYY-MM-DD");
                var tripDate = res.data[i].date;

                if (todayDate === tripDate) {
                  var ridStartTime;

                  if (res.data[i]?.tripType === "UPTRIP") {
                    ridStartTime = moment
                      .utc(res.data[i].stopList[0]?.expectedArivalTime)
                      .local()
                      .format("HH:mm");
                  } else if (res.data[i]?.tripType === "DOWNTRIP") {
                    ridStartTime = moment
                      .utc(res.data[i].stopList[0]?.expectedArivalTime)
                      .local()
                      .format("HH:mm");
                  } else {
                    ridStartTime = moment
                      .utc(res.data[i].startTimeInMiliSec)
                      .local()
                      .format("HH:mm");
                  }

                  var currentTime = moment().format("HH:mm");

                  var startTime = moment(currentTime, "HH:mm");

                  var endTime = moment(ridStartTime, "HH:mm");

                  var diffrent = moment.duration(endTime.diff(startTime));

                  var hours = parseInt(diffrent.asHours());
                  var minutes = parseInt(diffrent.asMinutes()) - hours * 60;
                  var totalMin = hours * 60 + minutes;

                  var minutesOfStartRide;

                  if (res.data[i]?.tripType === "UPTRIP") {
                    if (
                      driverAppSettingData?.displayStartButtonBeforeMinDiffOfFirstPickup
                    ) {
                      minutesOfStartRide =
                        driverAppSettingData?.displayStartButtonBeforeMinDiffOfFirstPickup;
                    } else {
                      minutesOfStartRide = 15;
                    }
                  } else if (res.data[i]?.tripType === "DOWNTRIP") {
                    if (
                      driverAppSettingData?.displayStartButtonBeforeMinDiffOfLogoutTime
                    ) {
                      minutesOfStartRide =
                        driverAppSettingData?.displayStartButtonBeforeMinDiffOfLogoutTime;
                    } else {
                      minutesOfStartRide = 15;
                    }
                  } else {
                    minutesOfStartRide = 15;
                  }

                  // if (
                  //   totalMin > 0 ||
                  //   totalMin < 0 ||
                  //   totalMin <= minutesOfStartRide
                  // ) {
                  //   setstatrRideData(res.data[i]);
                  //   setshowStartRideButton(true);
                  // } else {
                  //   setstatrRideData("");
                  //   setshowStartRideButton(false);
                  // }

                  //console.log("totalMin", totalMin);

                  if (totalMin < 0) {
                    setstatrRideData(res.data[i]);
                    setshowStartRideButton(true);
                  } else {
                    if (totalMin > 0 && totalMin <= minutesOfStartRide) {
                      setstatrRideData(res.data[i]);
                      setshowStartRideButton(true);
                    } else {
                      setstatrRideData("");
                      setshowStartRideButton(false);
                    }
                  }
                } else {
                  setstatrRideData("");
                  setshowStartRideButton(false);
                }
              }
            }
          } else {
            setstatrRideData("");
            setshowStartRideButton(false);
          }
        } else {
          setstatrRideData("");
          setshowStartRideButton(false);
        }
      })
      .catch((err) => {});
  };

  const getDriverUpcomingRide = () => {
    actions
      .getRide(DRIVER_NEXT_RIDE)
      .then((res) => {
        if (res?.status === 200) {
          if (res?.data?.length > 0) {
            if (Platform.OS == "android") {
              let splitOSVersion = Platform.constants["Release"].split(".");
              if (splitOSVersion[0] < 10) {
              } else {
                for (var j = 0; j < res.data.length; j++) {
                  var todayDate = moment(new Date()).format("YYYY-MM-DD");
                  var tripDate = res.data[j].date;
                  var empCount = [];
                  if (todayDate == tripDate) {
                    setnextTripPopupData(res.data[j]);
                    setshowDragButton(true);
                    if (res.data[j]?.tripType === "UPTRIP") {
                      let getLastStopPoint =
                        res.data[j]?.stopList[
                          res.data[j]?.stopList?.length - 1
                        ];

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
              }
            } else {
              for (var j = 0; j < res.data.length; j++) {
                var todayDate = moment(new Date()).format("YYYY-MM-DD");
                var tripDate = res.data[j].date;
                var empCount = [];
                if (todayDate == tripDate) {
                  setnextTripPopupData(res.data[j]);
                  setshowDragButton(true);
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
            }
          } else {
            setshowDragButton(false);
          }
        } else {
          setshowDragButton(false);
        }
      })
      .catch((err) => {
        setshowDragButton(false);
      });
  };

  const getCurrentCoords = async () => {
    //setisLoading(true);
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "vTransit",
            message:
              "This app want your current location latlong to get your exact location",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            (position) => {
              setTimeout(() => {
                setisLoading(false);
              }, 2000);
              setdriverCurrentCoordinate({
                ...driverCurrentCoordinate,
                latitude: position?.coords?.latitude,
                longitude: position?.coords?.longitude,
                heading: position?.coords?.heading,
              });
            },
            (error) => {
              setTimeout(() => {
                setisLoading(false);
              }, 2000);
              showError(error.message);
            },
            { enableHighAccuracy: false, timeout: 20000 }
          );
        } else {
          setTimeout(() => {
            setisLoading(false);
          }, 2000);
        }
      } catch (err) {
        setTimeout(() => {
          setisLoading(false);
        }, 2000);
      }
    } else {
      Geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            setisLoading(false);
          }, 2000);
          if (position?.coords?.latitude) {
            setdriverCurrentCoordinate({
              ...driverCurrentCoordinate,
              latitude: position?.coords?.latitude,
              longitude: position?.coords?.longitude,
              heading: position?.coords?.heading,
            });
          } else {
          }
        },
        (error) => {
          setTimeout(() => {
            setisLoading(false);
          }, 2000);
          showError(error.message);
        },
        { enableHighAccuracy: false, timeout: 20000 }
      );
    }
  };

  const acceptRejectRide = async (status, id) => {
    setisLoading(true);
    let sendData = {
      tripId: id,
      status: status,
      deviceId: "",
    };

    actions
      .driverAcceptRejectRide(sendData)
      .then((res) => {
        setTimeout(() => {
          setisLoading(false);
        }, 2000);

        if (res.status === 200) {
          showSuccess("Trip Accepted Successfully.");
          getDriverUpcomingRide();
          getScheduledRides();
        } else {
          showError(res.message);
        }
      })
      .catch((err) => {
        setTimeout(() => {
          setisLoading(false);
        }, 2000);
      });
  };

  const srartTrip = (tripId) => {
    setshowLoadingButton(true);
    let data = new FormData();

    data.append("withMask", null);
    data.append("withoutMask", null);

    let otherdetail = {
      tripId: tripId,
      wearingFaceMask: "No",
      relatedSystoms: "No",
      sanitizedVehicle: "No",
      haveCovid: "No",
    };

    data.append("data", JSON.stringify(otherdetail));

    actions
      .driverSelfConsent(
        data,
        { "Content-Type": "multipart/form-data" },
        "formData",
        "Axios"
      )
      .then((res) => {
        setshowLoadingButton(false);
        let { status } = res;
        if (status === 200) {
          showSuccess("Your Ride Started Successfully.");

          getDriverModulePermissions();
          getDriverAppSetting();
          let ongoingRideData = {
            isOngoing: true,
          };
          AsyncStorage.setItem(
            "ongoingRideData",
            JSON.stringify(ongoingRideData)
          );
          socketServices.emit("add-user", profileData.id);
          //socketServices.emit("join", route.params.tripId);
          checkAccessButton();
        } else {
          //setisLoading(false);
          showError(res?.message);
        }
      })
      .catch((err) => {
        setshowLoadingButton(false);
        setisLoading(false);
        showError(err?.message);
      });
  };

  const checkAccessButton = () => {
    if (Platform.OS === "android") {
      navigation.navigate(navigationStrings.LIVE_TRACKING);
      // checkPermission()
      //   .then((value) => {
      //     if (value) {
      //       initialize()
      //         .then(() => {
      //           navigation.navigate(navigationStrings.LIVE_TRACKING);
      //         })
      //         .catch(() => {
      //           showError("Failed initialize quick access button.");
      //           navigation.navigate(navigationStrings.LIVE_TRACKING);
      //         });
      //     } else {
      //       requestPermission()
      //         .then(() => {
      //           initialize()
      //             .then(() => {
      //               navigation.navigate(navigationStrings.LIVE_TRACKING);
      //             })
      //             .catch(() => {
      //               showError("Failed initialize quick access button.");
      //               navigation.navigate(navigationStrings.LIVE_TRACKING);
      //             });
      //         })
      //         .catch(() =>
      //           showError(
      //             "Please allow draw over other apps permission for quick access."
      //           )
      //         );
      //     }
      //   })
      //   .catch(() => {
      //     showError("Failed to check quick access button permission.");
      //     navigation.navigate(navigationStrings.LIVE_TRACKING);
      //   });
    } else {
      navigation.navigate(navigationStrings.LIVE_TRACKING);
    }
  };

  const focusOnCurrentLocation = () => {
    if (driverCurrentCoordinate?.latitude) {
      mapRef?.current?.animateToRegion({
        latitude: driverCurrentCoordinate?.latitude,
        longitude: driverCurrentCoordinate?.longitude,
        heading: driverCurrentCoordinate?.heading,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      });
    }
  };
  function FocusAwareStatusBar(props) {
    const isFocused = useIsFocused();

    return isFocused ? <StatusBar {...props} /> : null;
  }

  const checkLiveTrip_2 = (id) => {
    actions
      .getRide(DRIVER_ONGOING_RIDE)
      .then((res) => {
        if (res.status === 200) {
          if (res?.data.length > 0) {
            showError("One trip is already running.");
          } else {
            if (
              driverAppSettingData?.isConsentMandatoryForDriverToStartTheTrip ==
              "YES"
            ) {
              navigation.navigate(navigationStrings.DRIVER_SELF_CONCENT, {
                tripId: id,
              });
            } else {
              srartTrip(id);
            }
          }
        } else {
          showError("Live trip data not found.");
        }
      })
      .catch((err) => {
        showError("Live trip data not found.");
      });
  };

  const checkLiveTrip = () => {
    actions
      .getRide(DRIVER_ONGOING_RIDE)
      .then((res) => {
        if (res.status === 200) {
          if (res?.data.length > 0) {
            showError("One trip is already running.");
          } else {
            if (
              driverAppSettingData?.isConsentMandatoryForDriverToStartTheTrip ==
              "YES"
            ) {
              navigation.navigate(navigationStrings.DRIVER_SELF_CONCENT, {
                tripId: statrRideData?.id,
              });
            } else {
              srartTrip(statrRideData?.id);
            }
          }
        } else {
          showError("Live trip data not found.");
        }
      })
      .catch((err) => {
        showError("Live trip data not found.");
      });
  };
  return (
    <View style={styles.mainContainer}>
      {isLoading ? (
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
      ) : null}

      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
      />

      {showInfoList ? (
        <InfoSheet
          onClose={() => {
            setshowInfoList(false);
          }}
          infoList={infoList}
          infoSheet={infoSheet}
        />
      ) : null}
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          {driverCurrentCoordinate?.latitude ? (
            <MapView
              scrollEnabled={mapdraggable}
              provider={PROVIDER_GOOGLE}
              ref={mapRef}
              maxZoomLevel={20}
              minZoomLevel={13}
              zoomEnabled={true}
              followsUserLocation={true}
              userLocationPriority={"high"}
              style={{ flex: 1 }}
              initialRegion={{
                latitude: Number(driverCurrentCoordinate?.latitude),
                longitude: Number(driverCurrentCoordinate?.longitude),
                latitudeDelta: 0.1,
                longitudeDelta: LONGITUDE_DELTA,
              }}
            >
              <MarkerAnimated
                position={"center"}
                rotation={driverCurrentCoordinate?.heading + 180}
                coordinate={{
                  latitude: Number(driverCurrentCoordinate?.latitude),
                  longitude: Number(driverCurrentCoordinate?.longitude),
                }}
              >
                <Image
                  source={imagePath.carIcon}
                  style={styles.markerIcon}
                  resizeMode={"contain"}
                />
              </MarkerAnimated>
            </MapView>
          ) : null}
        </View>

        <Header margin navigation={navigation} mapScreen={false} />
        {showDragButton ? (
          <DraggableButton
            onPress={() => {
              setnextTripPopupData(nextTripPopupData);
              setshowTripModal(true);
            }}
            onPressIn={() => {
              setmapdraggable(false);
            }}
            onShortPressRelease={() => {
              setshowTripModal(true);
            }}
            onRelease={() => {
              setmapdraggable(true);
            }}
          />
        ) : null}
        {showTripModal ? (
          <NextTripModal
            data={nextTripPopupData}
            showModal={showTripModal}
            shiftTime={nextTripTime}
            closeModal={() => {
              setshowTripModal(false);
            }}
            onDecline={(id, vehicleId) => {
              setshowTripModal(false);
            }}
            onAccept={(id) => {
              acceptRejectRide("ACCEPT", id);
              setshowTripModal(false);
              setshowDragButton(true);
            }}
            totalEmpCount={totalEmpCount?.length}
          />
        ) : null}

        <View
          style={[
            styles.focusOnCurrentLocationContainer,
            { marginBottom: showStartRideButton ? 80 : 10 },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              setshowInfoList(true);
              setTimeout(() => {
                infoSheet.current.open();
              }, 1000);
            }}
            style={styles.focusOnLocationButtonContainer}
          >
            <Image
              source={imagePath.informationIcon}
              style={styles.currentLocationIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={focusOnCurrentLocation}
            style={styles.focusOnLocationButtonContainer}
          >
            <Image
              source={imagePath.current_location}
              style={styles.currentLocationIcon}
            />
          </TouchableOpacity>
        </View>
        {showChooseRideToStartPopup ? (
          <SelectRideToStartPopup
            data={sheduledRided}
            showModal={showChooseRideToStartPopup}
            closeModal={() => {
              setshowChooseRideToStartPopup(false);
            }}
            onPress={(item) => {
              Alert.alert(`Are you sure you want to start this ride?`, "", [
                {
                  text: "No",
                  onPress: () => {},
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    setshowChooseRideToStartPopup(false);
                    setTimeout(() => {
                      checkLiveTrip_2(item?.id);
                    }, 1000);
                  },
                },
              ]);
            }}
            showLoadingButton={showLoadingButton}
          />
        ) : null}
        {showStartRideButton ? (
          <View style={styles.swipeToRightButtonContainer}>
            {showLoadingButton ? (
              <View
                style={{
                  width: "80%",
                  height: 52,
                  borderRadius: 10,
                  borderWidth: 0,
                  backgroundColor: colors.greenColor,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size={20} color={colors.white} />
              </View>
            ) : (
              <SwipableButton
                title={strings.SWIP_TO_START}
                swipeIcon={imagePath.swipe_right}
                swipeSuccess={() => {
                  setshowChooseRideToStartPopup(true);
                  //checkLiveTrip();
                  // if (
                  //   driverAppSettingData?.isConsentMandatoryForDriverToStartTheTrip ==
                  //   "YES"
                  // ) {
                  //   navigation.navigate(navigationStrings.DRIVER_SELF_CONCENT, {
                  //     tripId: statrRideData.id,
                  //   });
                  // } else {
                  //   srartTrip(statrRideData.id);
                  // }
                }}
              />
            )}
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default memo(Home);
