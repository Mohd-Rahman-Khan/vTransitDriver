import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import strings from "../../../../constants/lang";
import imagePath from "../../../../constants/imagePath";
import colors from "../../../../styles/colors";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from "../../../../styles/responsiveSize";
import fontFamily from "../../../../styles/fontFamily";

export default function NextPickupLocationComp(props) {
  return (
    <View
      style={[
        styles.tripDetails,
        {
          height: props.height,
        },
      ]}
    >
      <View
        style={[
          styles.nextPickupContainer,
          {
            height: props.height,
          },
        ]}
      >
        <View style={styles.nextPickupLeftContainer}>
          {props.nextPickupLocation?.onBoardPassengers ? (
            <Text style={styles.nextPickupText}>
              {strings.NEXT_PICK_UP_LOCATION}
            </Text>
          ) : (
            <Text style={styles.nextPickupText}>
              {strings.NEXT_DROP_LOCATION}
            </Text>
          )}

          <View style={styles.deliveryTruckContainer}>
            <Image
              source={imagePath.Delivery_truck_icon}
              style={styles.deliveryTruckIcon}
            />
            <View style={styles.nextPickupDetailsContainer}>
              {props.nextPickupLocation?.onBoardPassengers?.length === 1 ||
              props.nextPickupLocation?.deBoardPassengers?.length === 1 ? (
                <Image
                  style={styles.nextpickupIcon}
                  source={imagePath.homeMapIcon}
                />
              ) : (
                <Image
                  style={styles.nextpickupIcon}
                  source={imagePath.nodleIcon}
                />
              )}

              <TouchableOpacity
                onPress={props.onPress}
                style={styles.nextPickupBody}
              >
                <Text numberOfLines={1} style={styles.nextPickup}>
                  {props.nextPickupLocation?.location?.locName}
                </Text>
                <View style={styles.etaContainer}>
                  <Image
                    style={styles.clockWhiteImg}
                    source={imagePath.clock_white}
                  />
                  <Text style={styles.etaTextStyle}>
                    {strings.ETA} :{props?.actualETA}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.nextPickupRightContainer}>
          <Image
            source={imagePath.Delivery_infographic}
            style={styles.deliveryInfographic}
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGary,
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
});
