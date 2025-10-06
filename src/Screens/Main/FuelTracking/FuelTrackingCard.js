import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import React from "react";
import colors from "../../../styles/colors";
import {
  moderateScale,
  moderateScaleVertical,
} from "../../../styles/responsiveSize";
import imagePath from "../../../constants/imagePath";
import { getFileName } from "../../../utils/utils";
import { DOC_URL } from "../../../config/urls";
import { styles } from "./style";

export default function FuelTrackingCard(props) {
  let status = props?.item?.status;
  //let status = "REJECTED";
  let item = props?.item;
  let moment = props?.moment;
  let fuelPrice;
  if (item?.fuelPrice && item?.fuelVolume) {
    fuelPrice = item?.fuelPrice * item?.fuelVolume;
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      //onPress={props?.onPress}
      style={{
        shadowColor: colors.darkGray,
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.25,
        shadowRadius: moderateScale(6.84),

        elevation: 5,
      }}
    >
      <View
        style={{
          marginVertical: 10,
          borderWidth: 2,
          borderColor: colors.lightBorderColor,
          borderRadius: 10,
          borderBottomColor: item.isSelected
            ? status === "PENDING"
              ? colors.pendingComplianceBlueBorderColor
              : status === "APPROVED"
              ? colors.lightGreen
              : status === "REJECTED"
              ? colors.darkRed
              : colors.darkRed
            : "transparent",
          borderBottomWidth: 4,
        }}
      >
        <View
          style={{
            backgroundColor:
              status === "PENDING"
                ? colors.pendingComplianceBlueColor
                : status === "APPROVED"
                ? colors.metStatusColor
                : "#fff7f7",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
          <View style={styles.vehicleDetailContainer}>
            <View style={styles.dlNumberBox}>
              <View style={{ marginHorizontal: 5 }}>
                <Text style={styles.vehicleNumberStyle}>{item?.vehicleNo}</Text>

                <Text style={styles.vehicleModelText}>
                  {item?.vehicleModel}
                </Text>
              </View>
            </View>
            <View style={styles.fuelPriceContainer}>
              <Text style={styles.fuelTotalPriceText}>
                {/* {"3211"} */}₹
                {item?.fuelPrice && item?.fuelVolume
                  ? fuelPrice.toFixed(2)
                  : null}
              </Text>
            </View>
            <View style={styles.statusIconContainer}>
              {status === "APPROVED" ? (
                <Image
                  source={imagePath.check_mark_circle}
                  resizeMode="contain"
                  style={styles.statusIconStyle}
                />
              ) : status === "PENDING" ? (
                <Image
                  source={imagePath.waiting}
                  resizeMode="contain"
                  style={styles.statusIconStyle}
                />
              ) : (
                <Image
                  source={imagePath.rejectStatusIcon}
                  style={styles.statusIconStyle}
                  resizeMode="contain"
                />
              )}
            </View>
          </View>
        </View>
        <View style={styles.dateAndODOMeterContainer}>
          <View style={styles.dateAndTimeContainer}>
            <Image
              source={imagePath.calendar}
              style={styles.calenderIconStyle}
              resizeMode="contain"
            />

            <Text style={styles.dateAndTimeText}>
              {item?.date} {moment(item?.createdOn).format("HH:mm")}
            </Text>
          </View>
          <View style={styles.speedMeterContainer}>
            <Image
              source={imagePath.speedMeter}
              style={styles.speedMeterIconStyle}
              resizeMode="contain"
            />

            <Text style={styles.speedMeterText}>
              {/* {"12345"} */}
              {item?.odoMeterReadin}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.coollapseButtonContainer}
            onPress={props?.onPress}
          >
            <Image
              source={item.isSelected ? imagePath.minusIcon : imagePath.addIcon}
              style={styles.collapseButtonStyle}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        {item.isSelected && (
          <View style={styles.fuelDetailContainer}>
            <View style={styles.tableBodyDetailRow}>
              <View style={styles.fuelPriceAnFuelVolumeContainer}>
                <Text style={styles.tableBodyHeading}>{"Fuel Price"}</Text>
                <Text style={styles.tableBodyHeadingValueText}>
                  {/* {"₹99"} */}₹{item?.fuelPrice}
                </Text>
              </View>
              <View style={styles.fuelPriceAnFuelVolumeContainer}>
                <Text style={styles.tableBodyHeading}>{"Fuel Volume"}</Text>
                <Text style={styles.tableBodyHeadingValueText}>
                  {/* {"99 LTR"} */}
                  {item?.fuelVolume} LTR
                </Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "33%",
                  borderBottomWidth: 1,
                  borderBottomColor: colors.lightBorderColor,
                  height: 55,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.black,
                    textAlign: "center",
                  }}
                >
                  {"Milage/Average Kms"}
                </Text>
                <Text style={styles.tableBodyHeadingValueText}>
                  {/* {(item?.mileage).toFixed(2)} */}
                  {/* {item?.mileage} */}
                  {Number(item?.mileage).toFixed(2)}
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                //backgroundColor: "red",
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 10,
                  width: "33%",
                  height: 55,
                  borderRightWidth: 1,
                  borderRightColor: colors.lightBorderColor,
                }}
              >
                <Text style={styles.tableBodyHeading}>{"Vehicle Type"}</Text>
                <Text style={styles.tableBodyHeadingValueText}>
                  {item?.vehicleType}
                </Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 10,
                  width: "33%",
                  height: 55,
                  borderRightWidth: 1,
                  borderRightColor: colors.lightBorderColor,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.black,
                    width: 100,
                    textAlign: "center",
                  }}
                >
                  {"Fueling Station"}
                </Text>
                <Text
                  style={styles.tableBodyHeadingValueText}
                  numberOfLines={2}
                >
                  {/* {"Noida "} */}
                  {item?.fuelStation}
                </Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 10,
                  width: "33%",
                  height: 55,
                }}
              >
                <Text style={styles.tableBodyHeading}>{"Document"}</Text>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(DOC_URL + item?.invoiceDoc);
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 14,
                      color: colors.pendingComplianceBlueBorderColor,
                      fontWeight: "500",
                    }}
                  >
                    {/* {getFileName(item?.invoiceDoc)} */}
                    Invoice.png
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
