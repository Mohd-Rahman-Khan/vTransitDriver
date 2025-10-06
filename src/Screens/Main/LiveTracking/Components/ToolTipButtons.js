import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  moderateScaleVertical,
  moderateScale,
  width,
} from "../../../../styles/responsiveSize";
import colors from "../../../../styles/colors";
import imagePath from "../../../../constants/imagePath";
import { useSelector } from "react-redux";

export default function ToolTipButtons(props) {
  const [showTollTaxAndParking, setshowTollTaxAndParking] = useState(false);
  const getModulePermissionData = useSelector(
    (state) => state?.modulePermission?.modulePermissionData
  );

  useEffect(() => {
    let checkTollTaxAndParking = getModulePermissionData?.permissions?.find(
      (item) => item?.moduleName == "Toll And Parking"
    );

    if (checkTollTaxAndParking) {
      if (checkTollTaxAndParking?.actions) {
        let findViewPerm = checkTollTaxAndParking?.actions?.find(
          (itemData) => itemData == "Create"
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
  }, []);
  return (
    <TouchableWithoutFeedback>
      <View style={styles.tooltipContainer}>
        <View style={styles.tooltipRowContainer}>
          <View style={styles.containerLeftBox}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.securityButtonContainer}
            >
              <Image
                resizeMode="contain"
                style={styles.tooltipIconStyle}
                source={imagePath.securityIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.containerRightBox}>
            <TouchableOpacity
              onPress={props.infoIconClick}
              style={styles.currentLocationButtonConntainer}
            >
              <Image
                source={imagePath.informationIcon}
                style={styles.calliconStyle}
              />
            </TouchableOpacity>
            {props?.isThisEscortTrip ? (
              <View style={styles.escortButtonnConntainer}>
                <Image
                  source={
                    props?.escortStatus?.toUpperCase()?.trim() === "BOARDED"
                      ? imagePath.escortBoarded
                      : props?.escortStatus?.toUpperCase()?.trim() ===
                        "SCHEDULE"
                      ? imagePath.escort
                      : imagePath.escortAbsent
                  }
                  style={styles.tooltipIconStyle}
                />
              </View>
            ) : null}

            {showTollTaxAndParking ? (
              <TouchableOpacity
                onPress={props.openTollTaxAndParkingSheet}
                style={styles.currentLocationButtonConntainer}
              >
                <Image
                  source={imagePath.tollParkingBlack}
                  style={styles.calliconStyle}
                />
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              onPress={props.openEmpListForCall}
              style={styles.currentLocationButtonConntainer}
            >
              <Image source={imagePath.call} style={styles.calliconStyle} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={props.focusOnCurrentLocation}
              style={styles.currentLocationButtonConntainer}
            >
              <Image
                source={imagePath.current_location}
                style={styles.tooltipIconStyle}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={props.checkSelectedNavigationType}>
              <Image
                source={imagePath.play_button}
                style={styles.playIconStyle}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  playIconStyle: {
    width: moderateScale(width / 10),
    height: moderateScale(width / 10),
  },
  tooltipIconStyle: {
    width: moderateScale(width / 15),
    height: moderateScale(width / 15),
  },
  securityButtonContainer: {
    width: moderateScale(width / 10),
    height: moderateScale(width / 10),
    shadowColor: colors.black,
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },

  currentLocationButtonConntainer: {
    width: moderateScale(width / 10),
    height: moderateScale(width / 10),
    shadowColor: colors.black,
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 50,
    marginBottom: 5,
  },
  escortButtonnConntainer: {
    width: moderateScale(width / 10),
    height: moderateScale(width / 10),
    shadowColor: colors.black,
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 50,
    marginVertical: 5,
  },

  tooltipContainer: {
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
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    height: 100,
  },
  tooltipRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  containerLeftBox: { width: "50%" },
  containerRightBox: {
    width: "50%",
    alignItems: "flex-end",
  },
  calliconStyle: { height: 23, width: 23 },
});
