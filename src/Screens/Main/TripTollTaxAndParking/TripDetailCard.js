import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TextInput,
  Linking,
} from "react-native";
import React from "react";
import { styles } from "./style";
import colors from "../../../styles/colors";
import imagePath from "../../../constants/imagePath";
import TableHeader from "./TableHeader";
import TableBodyComp from "./TableBodyComp";
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

export default function TripDetailCard({
  item,
  onPress = () => {},
  editIconnClick = () => {},
  toolTax,
  parking,
}) {
  let totalAmount = 0;
  let color;
  for (let i = 0; i < item?.tollParkingData.length; i++) {
    if (toolTax) {
      if (item?.tollParkingData[i].type === "Toll Tax") {
        totalAmount = totalAmount + parseInt(item?.tollParkingData[i].amount);
      }
    } else if (parking) {
      if (item?.tollParkingData[i].type === "Parking") {
        totalAmount = totalAmount + parseInt(item?.tollParkingData[i].amount);
      }
    }
  }

  let getPendingStatus = item?.tollParkingData.find(
    // (itemData) => itemData.status === "PENDING"
    (itemData) => {
      if (toolTax) {
        if (itemData?.type === "Toll Tax" && itemData.status === "PENDING") {
          return true;
        }
      } else if (parking) {
        if (itemData?.type === "Parking" && itemData.status === "PENDING") {
          return true;
        }
      }
    }
  );
  let getAcceptStatus = item?.tollParkingData.find(
    // (itemData) => itemData.status === "APPROVED"
    (itemData) => {
      if (toolTax) {
        if (itemData?.type === "Toll Tax" && itemData.status === "APPROVED") {
          return true;
        }
      } else if (parking) {
        if (itemData?.type === "Parking" && itemData.status === "APPROVED") {
          return true;
        }
      }
    }
  );
  let getRejectStatus = item?.tollParkingData.find(
    // (itemData) => itemData.status === "REJECTED"
    (itemData) => {
      if (toolTax) {
        if (itemData?.type === "Toll Tax" && itemData.status === "REJECTED") {
          return true;
        }
      } else if (parking) {
        if (itemData?.type === "Parking" && itemData.status === "REJECTED") {
          return true;
        }
      }
    }
  );

  if (getRejectStatus) {
    color = colors.expiredLightRedColor;
  } else if (getPendingStatus) {
    color = colors.pendingComplianceBlueColor;
  } else if (getAcceptStatus) {
    color = colors.metStatusColor;
  } else {
    color = colors.pendingComplianceBlueColor;
  }

  var fromPoint = "--";
  var toPoint = "--";

  if (item?.stopList) {
    if (item?.tripType === "UPTRIP") {
      var fromFullAddress = item?.stopList[0]?.location?.locName;

      fromPoint = fromFullAddress;

      toPoint =
        item?.stopList[0]?.onBoardPassengers[0]?.officeName +
        " - " +
        item?.stopList[0]?.onBoardPassengers[0]?.officeLocation?.locName;
    } else {
      let getLastStopPoint = item?.stopList[item?.stopList.length - 1];
      var toFullAddress = getLastStopPoint?.location?.locName;

      toPoint = toFullAddress;
      fromPoint =
        item?.stopList[0]?.onBoardPassengers[0]?.officeName +
        " - " +
        item?.stopList[0]?.onBoardPassengers[0]?.officeLocation?.locName;
    }
  }

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        style={[
          styles.detailRowStyle,
          {
            backgroundColor: color,
            borderBottomLeftRadius: item?.isSelected ? 0 : 10,
            borderBottomRightRadius: item?.isSelected ? 0 : 10,
          },
        ]}
      >
        <View style={styles.tripDetailContainer}>
          <View style={styles.tripIconBox}>
            {item?.tripType === "DOWNTRIP" ? (
              <Image source={imagePath.downTrip} style={styles.tripIconStyle} />
            ) : (
              <Image source={imagePath.upTrip} style={styles.tripIconStyle} />
            )}
          </View>
          {/* <View style={styles.fromToAddressContainer}>
            <View style={styles.fromToContainer}>
              <View style={styles.fromAddressContainer}>
                <View style={styles.toAddressIndicator}></View>
                <Text numberOfLines={1} style={styles.addressText}>
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
                    <Text style={styles.addressText} numberOfLines={1}>
                      {toPoint}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View> */}
          <View style={styles.tripDetailBox}>
            {/* <Text numberOfLines={1} style={styles.addressText}>
              {fromPoint},{toPoint}
            </Text> */}
            <View style={styles.fromToAddressContainer}>
              <View style={styles.fromToContainer}>
                <View style={styles.fromAddressContainer}>
                  <View style={styles.toAddressIndicator}></View>
                  <Text numberOfLines={1} style={styles.addressText}>
                    {fromPoint}
                  </Text>
                </View>
                {/* <View style={styles.dotIndicatorContainer}>
                  <View>
                    <View style={styles.dotIndicator}></View>
                    <View style={styles.dotIndicator}></View>
                    <View style={styles.dotIndicator}></View>
                  </View>
                </View> */}

                <View style={styles.toAddressContainer}>
                  <View style={styles.fromAddressIndicator}></View>
                  <View style={styles.fromAddressTextContainer}>
                    <View style={styles.toPointTextContainer}>
                      <Text style={styles.addressText} numberOfLines={1}>
                        {toPoint}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.tripIdContainer}>
              <Text style={styles.tripDateAndIdText}>{item?.tripCode}</Text>
              <View style={styles.verticalDevider}></View>
              <Text style={styles.dateText}>
                {item?.tripType == "UPTRIP"
                  ? item?.stopList[0]?.onBoardPassengers[0]?.shiftInTime ===
                      null ||
                    item?.stopList[0]?.onBoardPassengers[0]?.shiftInTime === 0
                    ? null
                    : moment(
                        item?.stopList[0]?.onBoardPassengers[0]?.shiftInTime
                      ).format("ddd,MMM D,YYYY HH:mm")
                  : item?.stopList[0]?.onBoardPassengers[0]?.shiftOutTime ===
                      null ||
                    item?.stopList[0]?.onBoardPassengers[0]?.shiftOutTime === 0
                  ? null
                  : moment(
                      item?.stopList[0]?.onBoardPassengers[0]?.shiftOutTime
                    ).format("ddd,MMM D,YYYY HH:mm")}
                {/* {moment(item?.tripTime).format("ddd,MMM D,YYYY HH:mm")} */}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.amountDetailConntainer}>
          <Text style={styles.amountText}>{totalAmount}</Text>
          <View style={styles.actionIconContainer}>
            <Image
              source={imagePath.rightAngel}
              style={[
                styles.actionIconStyle,
                {
                  transform: [{ rotate: item?.isSelected ? "270deg" : "0deg" }],
                },
              ]}
            />
          </View>
        </View>
      </TouchableOpacity>
      {item?.isSelected ? (
        <View>
          <View
            style={{
              height: 1,
              backgroundColor: colors.lightGary,
              width: "100%",
              //marginTop: 5,
            }}
          ></View>
          <TableHeader parking={parking} />

          {item?.tollParkingData.map((listItem, index) => {
            if (parking) {
              if (listItem?.type === "Parking") {
                return (
                  <TableBodyComp
                    key={index.toString()}
                    listItem={listItem}
                    editIconnClick={editIconnClick}
                  />
                );
              } else {
                return null;
              }
            } else if (toolTax) {
              if (listItem?.type === "Toll Tax") {
                return (
                  <TableBodyComp
                    key={index.toString()}
                    listItem={listItem}
                    editIconnClick={editIconnClick}
                  />
                );
              } else {
                return null;
              }
            } else {
              return null;
            }
          })}

          {/* <TableBodyComp editIconnClick={editIconnClick} />
          <TableBodyComp editIconnClick={editIconnClick} /> */}
        </View>
      ) : null}
    </View>
  );
}
