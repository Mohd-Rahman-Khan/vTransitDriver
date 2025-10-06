import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import WrapperContainer from "../../../Components/WrapperContainer";
import colors from "../../../styles/colors";
import { styles } from "./style";
import ButtonComp from "../../../Components/ButtonComp";
import strings from "../../../constants/lang";
import navigationStrings from "../../../navigation/navigationStrings";
import imagePath from "../../../constants/imagePath";
import TrackingBottomSheet from "./TrackingBottomSheet";
import TripDetailRow from "./TripDetailRow";
import Moment from "moment";
import { extendMoment } from "moment-range";
import DownLiveTripTrack from "./DownLiveTripTrack";
import UpLiveTripTrack from "./UpLiveTripTrack";
import MapView from "react-native-maps";

import {
  Marker,
  MarkerAnimated,
  PROVIDER_GOOGLE,
  Polyline,
} from "react-native-maps";

const moment = extendMoment(Moment);
import actions from "../../../redux/actions";
import { height, moderateScale, width } from "../../../styles/responsiveSize";
import { DOC_URL } from "../../../config/urls";
import LiveMapMarker from "../../../Components/LiveMapMarker";
import { useIsFocused } from "@react-navigation/native";
import InfoSheet from "../../../Components/InfoSheet";
import { useSelector } from "react-redux";
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
    icon: imagePath.state,
    name: "Office Location",
  },
  {
    icon: imagePath.onTime,
    name: "Ontime",
  },
  {
    icon: imagePath.Vaccinated_green,
    name: "Fully vaccinated",
  },
  {
    icon: imagePath.partially_vaccinated_blue,
    name: "Partially vaccinated",
  },
  {
    icon: imagePath.not_vaccinated_orange,
    name: "Not vaccinated",
  },
  {
    icon: imagePath.male,
    name: "male",
  },
  {
    icon: imagePath.female,
    name: "female",
  },
  {
    icon: imagePath.other,
    name: "other",
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
    icon: imagePath.skippedIcon,
    name: "Skipped",
  },
  {
    icon: imagePath.noShowIcon,
    name: "Noshow employee",
  },
  {
    icon: imagePath.vehicleDelay,
    name: "vehicle delay",
  },
  {
    icon: imagePath.delayIcon,
    name: "delay Icon",
  },
  {
    icon: imagePath.locationGray,
    name: "Nodal Point",
  },
  {
    icon: imagePath.earlyIcon,
    name: "Early",
  },
  {
    icon: imagePath.group_icon,
    name: "Show More",
  },
  {
    icon: imagePath.vehical_icon,
    name: "Vehicle Detail",
  },
  {
    icon: imagePath.Numbers_of_Employee_Icon,
    name: "Number of employee",
  },
  {
    icon: imagePath.km_icon,
    name: "Distance",
  },
  {
    icon: imagePath.tollParkingBlack,
    name: "Toll tax and parking",
  },
];

export default function TripDetail({ route, navigation }) {
  const isFocused = useIsFocused();

  const bottomSheetRef = useRef();
  const [rideDetail, setrideDetail] = useState("");
  const [fromAddress, setfromAddress] = useState("");
  const [toAddress, settoAddress] = useState("");
  const [stopPointList, setstopPointList] = useState([]);
  const [tripDate, settripDate] = useState("");
  const [tripTime, settripTime] = useState("");
  const [tripType, settripType] = useState("");
  const [tripStatus, settripStatus] = useState("");
  const [tripDistance, settripDistance] = useState("");
  const [tripDuration, settripDuration] = useState("");
  const [triproute, settriproute] = useState("");
  const [center, setcenter] = useState(null);
  const [vehicleDetail, setvehicleDetail] = useState("");
  const [viaPointCount, setviaPointCount] = useState(0);
  const [bounds, setbounds] = useState(undefined);
  const [Coordinates, setCoordinates] = useState([]);
  const [tollTaxTotal, settollTaxTotal] = useState("");
  const [parkingTotal, setparkingTotal] = useState("");
  const [parkingStatus, setparkingStatus] = useState("");
  const [tollTaxStatus, setsettollTaxStatus] = useState("");

  const [parkingLinkColor, setparkingLinkColor] = useState("black");
  const [tollTaxLinkColor, settollTaxLinkColor] = useState("black");
  const [driverAppSettingData, setdriverAppSettingData] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const camera = useRef();

  const screen = Dimensions.get("window");
  const ASPECT_RATIO = screen.width / screen.height;
  const LATITUDE_DELTA = 0.04;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const mapRef = useRef();
  const [showInfoList, setshowInfoList] = useState(false);
  const [showTollTaxAndParking, setshowTollTaxAndParking] = useState(false);
  const infoSheet = useRef();
  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );
  const getModulePermissionData = useSelector(
    (state) => state?.modulePermission?.modulePermissionData
  );

  useEffect(() => {
    if (isFocused) {
      getRideDetail();
      getTripTollTaxAndParkingDetail();
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      getDriverAppSetting();
      getTollAndParkingPermission();
    }
  }, [isFocused, profileData]);

  const getTollAndParkingPermission = () => {
    let checkTollTaxAndParking = getModulePermissionData?.permissions?.find(
      (item) => item?.moduleName == "Toll And Parking"
    );

    if (checkTollTaxAndParking) {
      if (checkTollTaxAndParking?.actions) {
        let findViewPerm = checkTollTaxAndParking?.actions?.find(
          (itemData) => itemData == "View"
        );
        if (findViewPerm) {
          setshowTollTaxAndParking(true);
        } else {
          setshowTollTaxAndParking(false);
        }
      } else {
        setshowTollTaxAndParking(false);
      }
    } else {
      setshowTollTaxAndParking(false);
    }
  };
  const getDriverAppSetting = () => {
    actions
      .getDriverAppSetting(profileData?.corporateId)
      .then((response) => {
        if (response?.status == 200) {
          setdriverAppSettingData(response?.data);
        }
      })
      .catch((error) => {});
  };

  const getTripTollTaxAndParkingDetail = () => {
    actions
      .getTollTaxAnndParking()
      .then((res) => {
        let findTripTollTax = res?.data.find(
          (itemData) => itemData.tripId === route.params?.tripId
        );

        let tollTaxSum = 0;
        let parkingSum = 0;

        if (findTripTollTax) {
          let tollTaxArr = [];
          let parkingArr = [];

          for (let i = 0; i < findTripTollTax?.tollParkingData?.length; i++) {
            if (findTripTollTax?.tollParkingData[i].type === "Toll Tax") {
              tollTaxSum += parseInt(
                findTripTollTax?.tollParkingData[i].amount
              );
              tollTaxArr.push(findTripTollTax?.tollParkingData[i]);
            } else if (findTripTollTax?.tollParkingData[i].type === "Parking") {
              parkingSum += parseInt(
                findTripTollTax?.tollParkingData[i].amount
              );
              parkingArr.push(findTripTollTax?.tollParkingData[i]);
            }
          }
          settollTaxTotal(tollTaxSum);
          setparkingTotal(parkingSum);

          let getPendingTollTaxStatus = tollTaxArr.find(
            (itemData) => itemData.status === "PENDING"
          );
          let getAcceptTollTaxStatus = tollTaxArr.find(
            (itemData) => itemData.status === "APPROVED"
          );
          let getRejectTollTaxStatus = tollTaxArr.find(
            (itemData) => itemData.status === "REJECTED"
          );

          if (getRejectTollTaxStatus) {
            setsettollTaxStatus("REJECTED");
            settollTaxLinkColor(colors.redColor);
          } else if (getPendingTollTaxStatus) {
            setsettollTaxStatus("PENDING");
            settollTaxLinkColor(colors.blueColor);
          } else if (getAcceptTollTaxStatus) {
            setsettollTaxStatus("APPROVED");
            settollTaxLinkColor(colors.greenColor);
          } else {
            setsettollTaxStatus("PENDING");
            settollTaxLinkColor(colors.blueColor);
          }

          let getPendingParkinngStatus = parkingArr.find(
            (itemData) => itemData.status === "PENDING"
          );
          let getAcceptParkinngStatus = parkingArr.find(
            (itemData) => itemData.status === "APPROVED"
          );
          let getRejectParkinngStatus = parkingArr.find(
            (itemData) => itemData.status === "REJECTED"
          );

          if (getRejectParkinngStatus) {
            setparkingStatus("REJECTED");
            setparkingLinkColor(colors.redColor);
          } else if (getPendingParkinngStatus) {
            setparkingStatus("PENDING");
            setparkingLinkColor(colors.blueColor);
          } else if (getAcceptParkinngStatus) {
            setparkingStatus("APPROVED");
            setparkingLinkColor(colors.greenColor);
          } else {
            setparkingStatus("PENDING");
            setparkingLinkColor(colors.blueColor);
          }
        }
      })
      .catch((err) => {});
  };

  const getRideDetail = () => {
    setisLoading(true);
    actions
      .getRideById(route.params?.tripId)
      .then((res) => {
        //console.log("tripDetail", res?.data?.vehicleStickerId);
        if (res.status === 200) {
          setisLoading(false);
          getVehicleDetail(res?.data?.vehicleId);
          setrideDetail(res.data);
          setviaPointCount(res.data?.stopList.length - 2);

          if (res?.data?.tripType === "UPTRIP") {
            var fromFullAddress = res?.data?.stopList[0]?.location?.locName;
            // var parts = fromFullAddress.split(",");
            // var thePart = parts[parts.length - 2];
            // var thePart2 = parts[parts.length - 3];
            // var fromPoint = thePart2 + "," + thePart;
            var toPoint =
              res?.data?.stopList[0]?.onBoardPassengers[0]?.officeName +
              " - " +
              res?.data?.stopList[0]?.onBoardPassengers[0]?.officeLocation
                ?.locName;
            setfromAddress(fromFullAddress);
            settoAddress(toPoint);
          } else {
            let getLastStopPoint =
              res?.data?.stopList[res?.data?.stopList.length - 1];

            var toFullAddress = getLastStopPoint?.location?.locName;

            var parts = toFullAddress.split(",");

            var thePart = parts[parts.length - 2];
            var thePart2 = parts[parts.length - 3];
            var toPoint = thePart2 + "," + thePart;

            var fromPoint =
              res?.data?.stopList[0]?.onBoardPassengers[0]?.officeName +
              " - " +
              res?.data?.stopList[0]?.onBoardPassengers[0]?.officeLocation
                ?.locName;
            setfromAddress(fromPoint);

            settoAddress(toFullAddress);
          }

          setstopPointList(res?.data?.stopList);
          settripDate(moment(res?.data?.date).format("ddd,MMM,D"));
          settripTime(moment(res?.data?.startTimeInMiliSecStr).format("H:mm"));
          settripType(res?.data?.tripType);
          settripStatus(res?.data?.status);
          let distanceInMeter = res?.data?.actualTripDistance
            ? res?.data?.actualTripDistance
            : res?.data?.tripDistance;
          let distanceInKm = Math.round(distanceInMeter / 100) / 10;
          settripDistance(distanceInKm);

          let tripDurationInSec = res?.data?.tripDuration;
          var tripDurationInMinutes = Math.floor(tripDurationInSec / 60);
          settripDuration(tripDurationInMinutes);

          var respArr = res.data?.stopList.map((item, index) => {
            return item?.location?.latitude + "," + item?.location?.longitude;
          });

          let origin = respArr[0];
          let destination = respArr[respArr.length - 1];
          var lastItem = respArr.pop();
          respArr.shift();

          if (!res?.data?.tripSnapshot) {
            if (res?.data?.driverTripPolyLine) {
              setRoute(res?.data?.driverTripPolyLine);
            } else {
              generateGeometrey(origin, destination, respArr);
            }
          }
        } else {
          setisLoading(false);
        }
      })
      .catch((err) => {
        setisLoading(false);
      });
  };

  const getVehicleDetail = (vehicleId) => {
    actions.getVehicleDetail(vehicleId).then((res) => {
      if (res?.status === 200) {
        setvehicleDetail(res?.data);
      }
    });
  };

  const generateGeometrey = (origin, destination, wiaPoints) => {
    let routeWaypoints = wiaPoints.join("|");
    let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${routeWaypoints}&key=${GOOGLE_MAP_APIKEY}`;

    actions
      .getDirection(url)
      .then((response) => {
        // setCoordinates(decodeFun(response?.routes[0].overview_polyline.points));
        // let fitCoordinate = decodeFun(
        //   response?.routes[0].overview_polyline.points
        // );

        // fitToCoordinates(fitCoordinate);
        setRoute(response?.routes[0].overview_polyline.points, "saveIndB");
      })
      .catch((error) => {});
  };

  const setRoute = (encodedRoute, shouldSaveInDB = "") => {
    setCoordinates(decodeFun(encodedRoute));
    let fitCoordinate = decodeFun(encodedRoute);

    fitToCoordinates(fitCoordinate);
    if (shouldSaveInDB == "saveIndB") {
      saveRouteInDB(encodedRoute);
    }
  };

  const saveRouteInDB = (encodedData) => {
    actions
      .addPolyLineData(
        `id=${
          route.params?.tripId
        }&driverPolyLine=&driverTripPolyLine=${encodeURIComponent(encodedData)}`
      )
      .then((response) => {})
      .catch((error) => {});
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

  const showMoreClick = (clickItem) => {
    let arr = stopPointList.map((item) => {
      if (item?.location?.locName === clickItem?.location?.locName) {
        item.showMore = !item?.showMore;
      } else {
        item.showMore = false;
      }
      return { ...item };
    });

    setstopPointList(arr);
  };

  const fitToCoordinates = async (fitCoordinate) => {
    if (fitCoordinate?.length > 0) {
      await mapRef?.current?.fitToCoordinates(fitCoordinate, {
        edgePadding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        },
      });
    }
  };
  return (
    <WrapperContainer
      bgColor={colors.homeBg}
      isLoading={isLoading}
      withModal={true}
    >
      {showInfoList ? (
        <InfoSheet
          onClose={() => {
            setshowInfoList(false);
          }}
          infoList={infoList}
          infoSheet={infoSheet}
        />
      ) : null}
      <View style={styles.topContainer}>
        <View style={styles.bgImageStyle}>
          <View style={styles.backButtonContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Image
                    source={imagePath.backArrowIcon}
                    style={styles.backArrowIconStyle}
                  />
                </TouchableOpacity>
                <View>
                  {rideDetail === "" ? null : (
                    <Text style={styles.headerTitleText}>
                      {tripDate},
                      {rideDetail?.stopList[0]?.onBoardPassengers[0]?.shiftTime}
                    </Text>
                  )}

                  <View style={styles.tripIconAndIdContainer}>
                    <View style={styles.tripIconContainer}>
                      {rideDetail?.tripType === "UPTRIP" ? (
                        <Image
                          style={styles.tripIconStyle}
                          source={imagePath.upTrip}
                        />
                      ) : (
                        <Image
                          style={styles.tripIconStyle}
                          source={imagePath.downTrip}
                        />
                      )}
                    </View>

                    <Text style={styles.trackingIdTextStyle}>
                      {rideDetail?.tripCode}
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setshowInfoList(true);
                    setTimeout(() => {
                      infoSheet.current.open();
                    }, 1000);
                  }}
                >
                  <Image
                    source={imagePath.informationIcon}
                    style={{
                      height: 20,
                      width: 20,
                      tintColor: colors.white,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.contentSectionContainer}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={styles.scrollViewContainer}
          >
            <View>
              <View style={styles.rowContainer}>
                <View style={styles.rowContainerLeftBox}>
                  <View style={styles.toAddressIndicator}></View>
                  <View style={styles.dotContainer}>
                    <View style={styles.dotIndicatorStyle}></View>
                    <View style={styles.dotIndicatorStyle}></View>
                    <View style={styles.dotIndicatorStyle}></View>
                    <View style={styles.dotIndicatorStyle}></View>
                  </View>
                </View>
                <View style={styles.rowContainerRightBox}>
                  <View style={styles.addressContainer}>
                    <Text
                      numberOfLines={2}
                      style={[styles.addressText, { marginTop: 0 }]}
                    >
                      {fromAddress}
                    </Text>
                  </View>

                  <View style={styles.showMoreContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        bottomSheetRef.current.open();
                      }}
                      style={styles.plusButtonContainer}
                    >
                      <Text style={styles.plusTexT}>+{viaPointCount}</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                      onPress={() => {
                        navigation.navigate(navigationStrings.CHOOSE_AN_ISSUE, {
                          rideDetail: rideDetail,
                        });
                      }}
                      style={styles.supportButtonContainer}
                    >
                      <Image
                        source={imagePath.support_icon}
                        resizeMode="contain"
                        style={styles.supportIconStyle}
                      />
                      <Text style={styles.supportText}>Support</Text>
                    </TouchableOpacity> */}
                  </View>
                </View>
              </View>
              <View style={styles.rowContainer}>
                <View style={styles.rowContainerLeftBox}>
                  <View style={styles.fromAddressIndicator}></View>
                </View>
                <View style={styles.rowContainerRightBox}>
                  <View style={styles.addressContainer}>
                    <Text numberOfLines={2} style={styles.addressText}>
                      {toAddress}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.mapContainer}>
              {rideDetail?.tripSnapshot ? (
                <Image
                  resizeMode="stretch"
                  source={{ uri: DOC_URL + rideDetail?.tripSnapshot }}
                  style={styles.snapShotStyle}
                />
              ) : rideDetail === "" ? null : (
                <MapView
                  provider={PROVIDER_GOOGLE}
                  ref={mapRef}
                  maxZoomLevel={30}
                  minZoomLevel={10}
                  zoomEnabled={true}
                  rotateEnabled={true}
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: Number(
                      rideDetail?.stopList[0]?.location?.latitude
                    ),
                    longitude: Number(
                      rideDetail?.stopList[0]?.location?.longitude
                    ),
                    latitudeDelta: 0.1,
                    longitudeDelta: LONGITUDE_DELTA,
                  }}
                >
                  {rideDetail === ""
                    ? null
                    : rideDetail?.stopList.map((item, index) => {
                        if (rideDetail.tripType === "DOWNTRIP") {
                          if (item?.onBoardPassengers) {
                            if (
                              item.status === "SCHEDULE" ||
                              item?.status === "ARRIVED"
                            ) {
                              return (
                                <LiveMapMarker
                                  key={index + 1}
                                  lat={item?.location.latitude}
                                  long={item?.location.longitude}
                                  icon={imagePath.officeMarkerGrey}
                                />
                              );
                            } else {
                              return (
                                <LiveMapMarker
                                  key={index + 1}
                                  lat={item?.location.latitude}
                                  long={item?.location.longitude}
                                  icon={imagePath.officeMarker}
                                />
                              );
                            }
                          } else {
                            if (item?.deBoardPassengers?.length === 1) {
                              let getAbsentEmp = item?.deBoardPassengers.find(
                                (itemData) => itemData.status === "ABSENT"
                              );

                              if (getAbsentEmp) {
                                return (
                                  <LiveMapMarker
                                    key={index + 1}
                                    lat={item?.location.latitude}
                                    long={item?.location.longitude}
                                    icon={imagePath.homeMapIconRed}
                                  />
                                );
                              } else {
                                return (
                                  <LiveMapMarker
                                    key={index + 1}
                                    lat={item?.location.latitude}
                                    long={item?.location.longitude}
                                    icon={
                                      item?.status === "DEPARTURED"
                                        ? imagePath.homeMapIcon
                                        : imagePath.homeMapIconGrey
                                    }
                                  />
                                );
                              }
                            } else {
                              let getAbsentEmp = item?.deBoardPassengers.find(
                                (itemData) => itemData.status === "ABSENT"
                              );

                              if (getAbsentEmp) {
                                let getScheduleEmp =
                                  item?.deBoardPassengers.find(
                                    (itemData) =>
                                      itemData.status === "SCHEDULE" ||
                                      itemData.status === "BOARDED" ||
                                      itemData.status === "COMPLETED"
                                  );

                                if (getScheduleEmp) {
                                  return (
                                    <LiveMapMarker
                                      key={index + 1}
                                      lat={item?.location.latitude}
                                      long={item?.location.longitude}
                                      icon={imagePath.partiallyBoard}
                                    />
                                  );
                                } else {
                                  return (
                                    <LiveMapMarker
                                      key={index + 1}
                                      lat={item?.location.latitude}
                                      long={item?.location.longitude}
                                      icon={imagePath.picIcon}
                                    />
                                  );
                                }
                              } else {
                                return (
                                  <LiveMapMarker
                                    key={index + 1}
                                    lat={item?.location.latitude}
                                    long={item?.location.longitude}
                                    icon={
                                      item?.status === "DEPARTURED"
                                        ? imagePath.nodleIcon
                                        : imagePath.nodleIconGrey
                                    }
                                  />
                                );
                              }
                            }
                          }
                        } else {
                          if (item?.onBoardPassengers) {
                            if (item?.onBoardPassengers?.length === 1) {
                              let getAbsentEmp = item?.onBoardPassengers.find(
                                (itemData) => itemData.status === "ABSENT"
                              );

                              if (getAbsentEmp) {
                                return (
                                  <LiveMapMarker
                                    key={index + 1}
                                    lat={item?.location.latitude}
                                    long={item?.location.longitude}
                                    icon={imagePath.homeMapIconRed}
                                  />
                                );
                              } else {
                                return (
                                  <LiveMapMarker
                                    key={index + 1}
                                    lat={item?.location.latitude}
                                    long={item?.location.longitude}
                                    icon={
                                      item?.status === "DEPARTURED"
                                        ? imagePath.homeMapIcon
                                        : imagePath.homeMapIconGrey
                                    }
                                  />
                                );
                              }
                            } else {
                              let getAbsentEmp = item?.onBoardPassengers.find(
                                (itemData) => itemData.status === "ABSENT"
                              );

                              if (getAbsentEmp) {
                                let getScheduleEmp =
                                  item?.onBoardPassengers.find(
                                    (itemData) =>
                                      itemData.status === "SCHEDULE" ||
                                      itemData.status === "BOARDED" ||
                                      itemData.status === "COMPLETED"
                                  );

                                if (getScheduleEmp) {
                                  return (
                                    <LiveMapMarker
                                      key={index + 1}
                                      lat={item?.location.latitude}
                                      long={item?.location.longitude}
                                      icon={imagePath.partiallyBoard}
                                    />
                                  );
                                } else {
                                  return (
                                    <LiveMapMarker
                                      key={index + 1}
                                      lat={item?.location.latitude}
                                      long={item?.location.longitude}
                                      icon={imagePath.picIcon}
                                    />
                                  );
                                }
                              } else {
                                return (
                                  <LiveMapMarker
                                    key={index + 1}
                                    lat={item?.location.latitude}
                                    long={item?.location.longitude}
                                    icon={
                                      item?.status === "DEPARTURED"
                                        ? imagePath.nodleIcon
                                        : imagePath.nodleIconGrey
                                    }
                                  />
                                );
                              }
                            }
                          } else {
                            return (
                              <LiveMapMarker
                                key={index + 1}
                                lat={item?.location.latitude}
                                long={item?.location.longitude}
                                icon={
                                  item?.status === "ARRIVED" ||
                                  item?.status === "DEPARTURED"
                                    ? imagePath.officeMarker
                                    : imagePath.officeMarkerGrey
                                }
                              />
                            );
                          }
                        }
                      })}
                  {Coordinates.length > 1 ? (
                    <Polyline
                      coordinates={Coordinates}
                      strokeWidth={4}
                      strokeColor={colors.darkBlue}
                    />
                  ) : null}
                </MapView>
              )}
            </View>

            <View style={styles.detailContainer}>
              <TripDetailRow
                icon={imagePath.vehical_icon}
                iconText={`${
                  vehicleDetail?.vehicleBrand ? vehicleDetail?.vehicleBrand : ""
                }(${
                  vehicleDetail?.vehicleNumberPlate
                    ? vehicleDetail?.vehicleNumberPlate
                    : ""
                })`}
                vehicleSticker={rideDetail?.vehicleStickerId}
                //vehicleNumber={vehicleDetail?.vehicleNumberPlate}
              />
              <TripDetailRow
                icon={imagePath.Numbers_of_Employee_Icon}
                iconText={
                  rideDetail?.numberOfMalePassengers +
                  rideDetail?.numberOfFemalePassengers
                }
              />

              <TripDetailRow
                icon={imagePath.km_icon}
                iconText={`${tripDistance} Km ${tripDuration} Min`}
              />
              {showTollTaxAndParking ? (
                rideDetail?.status === "COMPLETED" ||
                rideDetail?.status === "STARTED" ? (
                  <>
                    <TripDetailRow
                      icon={imagePath.tollParkingBlack}
                      iconText="Toll tax"
                      isItLink={true}
                      onPress={() => {
                        navigation.navigate(
                          navigationStrings.TOLL_TAX_AND_PARKING,
                          {
                            tripId: route.params?.tripId,
                            selectionType: "Toll Tax",
                          }
                        );
                      }}
                      taxAmount={tollTaxTotal === 0 ? "" : tollTaxTotal}
                      linkColor={tollTaxLinkColor}
                      statusIcon={
                        tollTaxStatus === "PENDING"
                          ? imagePath.expireIcon_Blue
                          : tollTaxStatus === "APPROVED"
                          ? imagePath.check_mark_circle
                          : tollTaxStatus === "REJECTED"
                          ? imagePath.warningIcon
                          : imagePath.expireIcon_Blue
                      }
                    />
                    <TripDetailRow
                      icon={imagePath.tollParkingBlack}
                      iconText="Parking"
                      isItLink={true}
                      onPress={() => {
                        navigation.navigate(
                          navigationStrings.TOLL_TAX_AND_PARKING,
                          {
                            tripId: route.params?.tripId,
                            selectionType: "Parking",
                          }
                        );
                      }}
                      taxAmount={parkingTotal === 0 ? "" : parkingTotal}
                      linkColor={parkingLinkColor}
                      statusIcon={
                        parkingStatus === "PENDING"
                          ? imagePath.expireIcon_Blue
                          : parkingStatus === "APPROVED"
                          ? imagePath.check_mark_circle
                          : parkingStatus === "REJECTED"
                          ? imagePath.warningIcon
                          : imagePath.expireIcon_Blue
                      }
                    />
                  </>
                ) : null
              ) : null}
            </View>
          </ScrollView>
        </View>
      </View>

      {tripType === "DOWNTRIP" ? (
        tripStatus === "STARTED" ? (
          <DownLiveTripTrack
            empList={stopPointList}
            rideDetail={rideDetail}
            showBottomSheet={bottomSheetRef}
            tripType={tripType}
            tripStatus={rideDetail?.status}
            showMorePress={(clickItem) => {
              showMoreClick(clickItem);
            }}
            driverAppSettingData={driverAppSettingData}
          />
        ) : (
          <TrackingBottomSheet
            rideDetail={rideDetail}
            showMorePress={(clickItem) => {
              showMoreClick(clickItem);
            }}
            empList={stopPointList}
            showBottomSheet={bottomSheetRef}
            tripType={tripType}
            tripStatus={rideDetail?.status}
            driverAppSettingData={driverAppSettingData}
          />
        )
      ) : tripStatus === "STARTED" ? (
        <UpLiveTripTrack
          rideDetail={rideDetail}
          empList={stopPointList}
          showBottomSheet={bottomSheetRef}
          tripType={tripType}
          tripStatus={rideDetail?.status}
          showMorePress={(clickItem) => {
            showMoreClick(clickItem);
          }}
          driverAppSettingData={driverAppSettingData}
        />
      ) : (
        <TrackingBottomSheet
          rideDetail={rideDetail}
          showMorePress={(clickItem) => {
            showMoreClick(clickItem);
          }}
          empList={stopPointList}
          showBottomSheet={bottomSheetRef}
          tripType={tripType}
          tripStatus={rideDetail?.status}
          driverAppSettingData={driverAppSettingData}
        />
      )}
    </WrapperContainer>
  );
}
