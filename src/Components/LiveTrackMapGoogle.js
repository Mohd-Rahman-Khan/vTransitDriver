import { View, Text, Dimensions, Image } from "react-native";
import React, { memo } from "react";
import MapView from "react-native-maps";
import {
  Marker,
  MarkerAnimated,
  PROVIDER_GOOGLE,
  Polyline,
} from "react-native-maps";
import imagePath from "../constants/imagePath";
import LiveMapMarker from "./LiveMapMarker";
import colors from "../styles/colors";

function LiveTrackMapGoogle(props) {
  const screen = Dimensions.get("window");
  const ASPECT_RATIO = screen.width / screen.height;
  const LATITUDE_DELTA = 0.04;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  var tripRouteDetails = props?.data?.data?.length
    ? props?.data?.data[0]
    : null;

  return (
    <View style={{ flex: 1 }}>
      {props?.driverCurrentCoordinate?.longitude ? (
        <MapView
          scrollEnabled={props.scrollEnabled}
          onRegionChange={props.onRegionChange}
          provider={PROVIDER_GOOGLE}
          ref={props.mapRef}
          maxZoomLevel={30}
          minZoomLevel={10}
          zoomEnabled={true}
          rotateEnabled={true}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: Number(props?.driverCurrentCoordinate?.latitude),
            longitude: Number(props?.driverCurrentCoordinate?.longitude),
            latitudeDelta: 0.1,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          <MarkerAnimated
            ref={props.driverMarkerRef}
            position={"center"}
            rotation={props?.driverCurrentCoordinate?.heading}
            //image={imagePath.carIcon}
            image={
              tripRouteDetails?.vehicleType?.toUpperCase()?.trim() === "SEDAN"
                ? imagePath.sedan
                : tripRouteDetails?.vehicleType?.toUpperCase()?.trim() === "SUV"
                ? imagePath.suvCar
                : tripRouteDetails?.vehicleType?.toUpperCase()?.trim() === "BUS"
                ? imagePath.bus
                : tripRouteDetails?.vehicleType?.toUpperCase()?.trim() ===
                  "MINI BUS"
                ? imagePath.miniBus
                : tripRouteDetails?.vehicleType?.toUpperCase()?.trim() ===
                    "VAN" ||
                  tripRouteDetails?.vehicleType?.toUpperCase()?.trim() === "TT"
                ? imagePath.van
                : tripRouteDetails?.vehicleType?.toUpperCase()?.trim() ===
                  "MINI"
                ? imagePath.miniCar
                : tripRouteDetails?.vehicleType?.toUpperCase()?.trim() ===
                  "MICRO"
                ? imagePath.carIcon
                : imagePath.carIcon
            }
            flat
            coordinate={{
              latitude: Number(props?.driverCurrentCoordinate?.latitude),
              longitude: Number(props?.driverCurrentCoordinate?.longitude),
            }}
          ></MarkerAnimated>
          {props?.driverCurrentCoordinate?.latitude
            ? props?.data === ""
              ? null
              : props?.data.data[0].stopList.map((item, index) => {
                  if (props?.data.data[0].tripType === "UPTRIP") {
                    if (item?.onBoardPassengers) {
                      if (item?.onBoardPassengers?.length === 1) {
                        let getAbsentEmp = item?.onBoardPassengers.find(
                          (itemData) =>
                            itemData?.status === "ABSENT" ||
                            itemData?.status === "NOSHOW" ||
                            itemData?.status === "CANCLED"
                        );

                        if (getAbsentEmp) {
                          return (
                            <LiveMapMarker
                              key={index + 1}
                              lat={item?.location.latitude}
                              long={item?.location.longitude}
                              icon={imagePath.homeMapIconRed}
                              onPress={(e) => {
                                props?.setisThisOffice(false);
                                if (item?.onBoardPassengers) {
                                  props?.setstopPointEmpList(item);

                                  props?.setshowstopPointDetail(true);
                                } else {
                                  props?.setstopPointEmpList(item);

                                  props?.setshowstopPointDetail(true);
                                }
                              }}
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
                              onPress={(e) => {
                                props?.setisThisOffice(false);
                                if (item?.onBoardPassengers) {
                                  props?.setstopPointEmpList(item);

                                  props?.setshowstopPointDetail(true);
                                } else {
                                  props?.setstopPointEmpList(item);

                                  props?.setshowstopPointDetail(true);
                                }
                              }}
                            />
                          );
                        }
                      } else {
                        let getAbsentEmp = item?.onBoardPassengers.find(
                          (itemData) =>
                            itemData.status === "ABSENT" ||
                            itemData.status === "NOSHOW" ||
                            itemData.status === "CANCLED"
                        );

                        if (getAbsentEmp) {
                          let getScheduleEmp = item?.onBoardPassengers.find(
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
                                onPress={(e) => {
                                  props?.setisThisOffice(false);
                                  if (item?.onBoardPassengers) {
                                    props?.setstopPointEmpList(item);

                                    props?.setshowstopPointDetail(true);
                                  } else {
                                    props?.setstopPointEmpList(item);

                                    props?.setshowstopPointDetail(true);
                                  }
                                }}
                              />
                            );
                          } else {
                            return (
                              <LiveMapMarker
                                key={index + 1}
                                lat={item?.location.latitude}
                                long={item?.location.longitude}
                                icon={imagePath.picIcon}
                                onPress={(e) => {
                                  props?.setisThisOffice(false);
                                  if (item?.onBoardPassengers) {
                                    props?.setstopPointEmpList(item);

                                    props?.setshowstopPointDetail(true);
                                  } else {
                                    props?.setstopPointEmpList(item);

                                    props?.setshowstopPointDetail(true);
                                  }
                                }}
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
                              onPress={(e) => {
                                props?.setisThisOffice(false);
                                if (item?.onBoardPassengers) {
                                  props?.setstopPointEmpList(item);

                                  props?.setshowstopPointDetail(true);
                                } else {
                                  props?.setstopPointEmpList(item);

                                  props?.setshowstopPointDetail(true);
                                }
                              }}
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
                            item?.status === "ARRIVED"
                              ? imagePath.officeMarker
                              : imagePath.officeMarkerGrey
                          }
                          onPress={(e) => {
                            props?.setisThisOffice(true);
                            if (item?.onBoardPassengers) {
                              props?.setstopPointEmpList(item);

                              props?.setshowstopPointDetail(true);
                            } else {
                              props?.setstopPointEmpList(item);

                              props?.setshowstopPointDetail(true);
                            }
                          }}
                        />
                      );
                    }
                  } else {
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
                            onPress={(e) => {
                              props?.setisThisOffice(true);
                              if (item?.onBoardPassengers) {
                                props?.setstopPointEmpList(item);

                                props?.setshowstopPointDetail(true);
                              } else {
                                props?.setstopPointEmpList(item);

                                props?.setshowstopPointDetail(true);
                              }
                            }}
                          />
                        );
                      } else {
                        return (
                          <LiveMapMarker
                            key={index + 1}
                            lat={item?.location.latitude}
                            long={item?.location.longitude}
                            icon={imagePath.officeMarker}
                            onPress={(e) => {
                              props?.setisThisOffice(true);
                              if (item?.onBoardPassengers) {
                                props?.setstopPointEmpList(item);

                                props?.setshowstopPointDetail(true);
                              } else {
                                props?.setstopPointEmpList(item);

                                props?.setshowstopPointDetail(true);
                              }
                            }}
                          />
                        );
                      }
                    } else {
                      if (item?.deBoardPassengers?.length === 1) {
                        let getAbsentEmp = item?.deBoardPassengers.find(
                          (itemData) =>
                            itemData.status === "ABSENT" ||
                            itemData.status === "NOSHOW" ||
                            itemData.status === "CANCLED"
                        );

                        if (getAbsentEmp) {
                          return null;
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
                              onPress={(e) => {
                                props?.setisThisOffice(false);
                                if (item?.onBoardPassengers) {
                                  props?.setstopPointEmpList(item);

                                  props?.setshowstopPointDetail(true);
                                } else {
                                  props?.setstopPointEmpList(item);

                                  props?.setshowstopPointDetail(true);
                                }
                              }}
                            />
                          );
                        }
                      } else {
                        let getAbsentEmp = item?.deBoardPassengers.find(
                          (itemData) => itemData.status === "ABSENT"
                        );

                        if (getAbsentEmp) {
                          let getScheduleEmp = item?.deBoardPassengers.find(
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
                                onPress={(e) => {
                                  props?.setisThisOffice(false);
                                  if (item?.onBoardPassengers) {
                                    props?.setstopPointEmpList(item);

                                    props?.setshowstopPointDetail(true);
                                  } else {
                                    props?.setstopPointEmpList(item);

                                    props?.setshowstopPointDetail(true);
                                  }
                                }}
                              />
                            );
                          } else {
                            return (
                              <LiveMapMarker
                                key={index + 1}
                                lat={item?.location.latitude}
                                long={item?.location.longitude}
                                icon={imagePath.picIcon}
                                onPress={(e) => {
                                  props?.setisThisOffice(false);
                                  if (item?.onBoardPassengers) {
                                    props?.setstopPointEmpList(item);

                                    props?.setshowstopPointDetail(true);
                                  } else {
                                    props?.setstopPointEmpList(item);

                                    props?.setshowstopPointDetail(true);
                                  }
                                }}
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
                              onPress={(e) => {
                                props?.setisThisOffice(false);
                                if (item?.onBoardPassengers) {
                                  props?.setstopPointEmpList(item);

                                  props?.setshowstopPointDetail(true);
                                } else {
                                  props?.setstopPointEmpList(item);

                                  props?.setshowstopPointDetail(true);
                                }
                              }}
                            />
                          );
                        }
                      }
                    }
                  }
                })
            : null}

          {props?.showcompleteRide ? (
            props?.coveredRouteCord?.length > 1 ? (
              <Polyline
                coordinates={props?.coveredRouteCord}
                strokeWidth={4.1}
                strokeColor={colors.polyLineColor}
              />
            ) : null
          ) : props?.coordinates?.length > 1 ? (
            <>
              <Polyline
                coordinates={props?.coveredRouteCord}
                strokeWidth={4.1}
                strokeColor={colors.mediumGray}
              />
              <Polyline
                coordinates={props?.coordinates}
                strokeWidth={4}
                strokeColor={colors.polyLineColor}
              />
            </>
          ) : null}
        </MapView>
      ) : null}
    </View>
  );
}
export default memo(LiveTrackMapGoogle);
